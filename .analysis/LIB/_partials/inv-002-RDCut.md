---
partial_id: inv-002
artifact: LIB
class: RDCut
source_files:
  - lib/rdcut.h
  - lib/rdcut.cpp
status: done
agent: PHASE-2-inventory-subagent
timestamp: 2026-04-05
---

# RDCut — Inventory Partial

## Typ Qt

Plain C++ class (nie dziedziczy po QObject). Wykorzystuje Q3Signal do prostego callbacku (legacy Qt3 pattern). Nie ma Q_OBJECT macro, nie ma Q_PROPERTY, nie ma signals/slots w sensie Qt.

## Odpowiedzialnosc WHAT

RDCut to model pojedynczego "cuta" -- segmentu audio w systemie Rivendell. Cut jest najmniejsza jednostka audio, nalezaca do carta (identyfikowana przez CUT_NAME = 6-cyfrowy cart number + 3-cyfrowy cut number). Klasa realizuje wzorzec Active Record: kazda instancja mapuje sie 1:1 na rekord w tabeli CUTS.

Odpowiada za:
- Odczyt i zapis wszystkich metadanych cuta (opis, outcue, ISRC, ISCI, MusicBrainz IDs, daty, wagi, countery)
- Zarzadzanie punktami audio (start, end, fadeup, fadedown, segue start/end, hook start/end, talk start/end) -- markery w milisekundach
- Walidacje dostepnosci cuta (czas, dzien tygodnia, daypart, zakres dat, evergreen)
- Kopiowanie cuta do innego cart (metadane DB + audio + eventy)
- Check-in nagrania (po zakonczeniu nagrywania aktualizuje metadane)
- Auto-trim (wyszukiwanie poczatku/konca dzwieku na podstawie poziomu)
- Auto-segue (wyznaczanie punktow segue na podstawie poziomu lub stalej dlugosci)
- Reset do stanu domyslnego (z analizy pliku WAV)
- Logowanie odtworzenia (inkrementacja counterow play/local)
- Eksport/import metadanych (getMetadata/setMetadata z RDWaveData)
- Serializacja do XML
- Laczenie sygnalu zmiany (connect/disconnect via Q3Signal)

## Sygnaly

Brak sygnalw Qt (klasa nie ma Q_OBJECT). Zamiast tego uzywa Q3Signal (legacy) -- pole `cut_signal` -- do prostego powiadamiania o zmianach. Podlaczenie przez metody `connect()`/`disconnect()`.

## Sloty

Brak (nie QObject).

## Q_PROPERTY

Brak.

## Publiczne API

### Konstruktory/Destruktor
| Metoda | Opis |
|--------|------|
| `RDCut(QString name, bool create=false)` | Tworzy obiekt z nazwy cuta (format: NNNNNN_NNN). Opcjonalnie tworzy rekord DB |
| `RDCut(unsigned cartnum, int cutnum, bool create=false)` | Tworzy obiekt z numeru carta + numeru cuta |
| `~RDCut()` | Destruktor |

### Sprawdzanie istnienia i waznosci
| Metoda | Opis |
|--------|------|
| `exists()` | Sprawdza czy rekord istnieje w tabeli CUTS |
| `isValid()` | Sprawdza dostepnosc cuta w biezacym momencie |
| `isValid(QTime)` | Sprawdza dostepnosc o danej godzinie |
| `isValid(QDateTime)` | Pelna walidacja: evergreen, dzien tygodnia, zakres dat, daypart |

### Identyfikatory (gettery)
| Metoda | Opis |
|--------|------|
| `cutName()` | Nazwa cuta (format NNNNNN_NNN) |
| `cutNumber()` | Numer cuta w ramach carta (1-999) |
| `cartNumber()` / `setCartNumber()` | Numer carta nadrzednego |

### Metadane opisowe (getter + setter)
| Pole | Typ |
|------|-----|
| `evergreen` | bool -- cut zawsze dostepny, pomija reguły dat/godzin |
| `description` | QString |
| `outcue` | QString -- tekst outcue |
| `isrc` | QString -- kod ISRC |
| `isci` | QString -- kod ISCI (reklamy) |
| `recordingMbId` | QString -- MusicBrainz Recording ID |
| `releaseMbId` | QString -- MusicBrainz Release ID |
| `sha1Hash` | QString -- hash SHA1 pliku audio |
| `originName` | QString -- stacja, na ktorej utworzono |
| `originLoginName` | QString -- uzytkownik, ktory utworzyl |
| `sourceHostname` | QString -- hostname zrodla |

### Czas i scheduling (getter + setter)
| Pole | Typ |
|------|-----|
| `length` | unsigned -- dlugosc w milisekundach |
| `originDatetime` | QDateTime -- kiedy utworzono |
| `startDatetime` / `endDatetime` | QDateTime -- zakres waznosci |
| `startDaypart` / `endDaypart` | QTime -- zakres godzinowy (daypart) |
| `weekPart` | unsigned short -- maska dni tygodnia |
| `weight` | unsigned -- waga do rotacji |
| `playOrder` | int -- kolejnosc odtwarzania |
| `lastPlayDatetime` | QDateTime |
| `uploadDatetime` | QDateTime |
| `playCounter` | unsigned -- globalny licznik odtworzen |
| `localCounter` | unsigned -- lokalny licznik odtworzen |

### Parametry audio (getter + setter)
| Pole | Typ | Opis |
|------|-----|------|
| `codingFormat` | unsigned | Format kodowania (PCM/MPEG) |
| `sampleRate` | unsigned | Czestotliwosc probkowania |
| `bitRate` | unsigned | Bitrate |
| `channels` | unsigned | Liczba kanalow |
| `playGain` | int | Gain odtwarzania w dB*100 |

### Punkty audio (getter + setter, wartosci w ms, -1 = nie ustawiono)
| Pole | Opis |
|------|------|
| `startPoint` / `endPoint` | Zakres odtwarzanego audio |
| `fadeupPoint` / `fadedownPoint` | Punkty fade in/out |
| `segueStartPoint` / `segueEndPoint` | Zakres segue (przejscie do nastepnego) |
| `segueGain` | Gain segue |
| `hookStartPoint` / `hookEndPoint` | Hook (fragment promocyjny) |
| `talkStartPoint` / `talkEndPoint` | Talk-over (fragment do mowienia) |

### Metody wyliczane
| Metoda | Opis |
|--------|------|
| `effectiveStart()` | Efektywny poczatek (startPoint jesli >= 0, inaczej 0) |
| `effectiveEnd()` | Efektywny koniec (endPoint jesli >= 0, inaczej length) |

### Operacje
| Metoda | Opis |
|--------|------|
| `logPlayout()` | Rejestruje odtworzenie -- inkrementuje playCounter i localCounter, ustawia lastPlayDatetime |
| `copyTo(station, user, cutname, config)` | Kopiuje metadane DB, eventy i audio do innego cuta |
| `getMetadata(RDWaveData*)` | Eksportuje metadane cuta do obiektu RDWaveData |
| `setMetadata(RDWaveData*)` | Importuje metadane z RDWaveData do cuta (z walidacja zakresow) |
| `checkInRecording(station, user, hostname, settings, msecs)` | Finalizuje nagranie -- ustawia parametry audio, resetuje punkty, rozwiazuje hostname z IP |
| `autoTrim(AudioEnd, level)` | Automatyczne wyznaczanie startPoint/endPoint na podstawie progu poziomu audio |
| `autoSegue(level, length, station, user, config)` | Automatyczne wyznaczanie segue na podstawie progu lub stalej dlugosci |
| `reset()` | Resetuje metadane do stanu domyslnego (z ponowna analiza pliku WAV) |
| `connect(receiver, member)` | Podlacza callback Q3Signal |
| `disconnect(receiver, member)` | Odlacza callback Q3Signal |
| `xml(RDSqlQuery*, bool absolute, RDSettings*)` | Serializuje cut do XML (tryb absolute lub relative) |

### Metody statyczne
| Metoda | Opis |
|--------|------|
| `cutName(cartnum, cutnum)` | Generuje nazwe cuta z numerow |
| `cartNumber(cutname)` | Wyciaga numer carta z nazwy |
| `cutNumber(cutname)` | Wyciaga numer cuta z nazwy |
| `create(cartnum, cutnum)` / `create(cutname)` | Tworzy rekord w DB z domyslnymi datami z grupy |
| `exists(cartnum, cutnum)` / `exists(cutname)` | Sprawdza istnienie rekordu |
| `pathName(cartnum, cutnum)` / `pathName(cutname)` | Zwraca sciezke do pliku audio |

### Metody prywatne
| Metoda | Opis |
|--------|------|
| `SetRow(kolumna, wartosc)` | 7 przeciazen -- aktualizuje pojedyncza kolumne w tabeli CUTS |
| `FileCopy(...)` | Kopiowanie pliku (legacy) |
| `GetDefaultDateTimes(start, end, cutname)` | Pobiera domyslne daty waznosci z konfiguracji grupy (GROUPS.DEFAULT_CUT_LIFE) |

## Enums

### AudioEnd
Okresla ktory koniec audio obrabiac:
- `AudioBoth` (0) -- oba konce
- `AudioHead` (1) -- poczatek
- `AudioTail` (2) -- koniec

### IsrcFormat
Format kodu ISRC:
- `RawIsrc` (0) -- surowy
- `FormattedIsrc` (1) -- sformatowany

### Validity
Okreslenie waznosci cuta:
- `NeverValid` (0) -- nigdy wazny
- `ConditionallyValid` (1) -- wazny warunkowo (zalezy od dat/godzin)
- `AlwaysValid` (2) -- zawsze wazny
- `FutureValid` (3) -- bedzie wazny w przyszlosci

## Reguly biznesowe

1. **Nazewnictwo cutow**: CUT_NAME = 6-cyfrowy CART_NUMBER + "_" + 3-cyfrowy CUT_NUMBER (np. "000123_001"). Parsowane przez sscanf z pozycji w stringu.

2. **Walidacja dostepnosci (isValid)**: Hierarchia sprawdzen:
   - Evergreen = true -> zawsze dostepny (pomija pozostale reguly)
   - Dzien tygodnia musi byc wlaczony (MON-SUN)
   - Biezaca data musi byc w zakresie START_DATETIME..END_DATETIME
   - Biezaca godzina musi byc w zakresie START_DAYPART..END_DAYPART

3. **Domyslne daty waznosci**: Przy tworzeniu cuta, jesli grupa ma ustawione DEFAULT_CUT_LIFE > 0, START_DATETIME = now(), END_DATETIME = now() + DEFAULT_CUT_LIFE dni.

4. **Opis nigdy pusty**: setMetadata() wymusza minimalny opis "Cut NNN" jesli description jest puste.

5. **Outcue automatyczne**: setMetadata() ustawia outcue "[music fades]" lub "[music ends cold]" na podstawie typu zakonczenia, jesli brak jawnego outcue.

6. **Walidacja zakresow punktow**: setMetadata() koryguje segue/talk/hook punkty aby miescily sie w zakresie start..end.

7. **Segue = zakres startPoint..endPoint**: Jesli segue start/end pokrywa sie z calym cutem, jest czyszczone do -1 (brak segue).

8. **Auto-trim**: Uzywa poziomu referencyjnego audio (REFERENCE_LEVEL) do znalezienia poczatku/konca dzwieku w pliku WAV. Level >= 0 oznacza reset do pelnej dlugosci.

9. **Auto-segue**: Moze dzialac w trybie threshold (znajdz koniec dzwieku) lub fixed-length (stala dlugosc od konca). Koryguje aby segue nie wychodzil poza endPoint.

10. **Reset**: Odczytuje parametry audio z pliku WAV i przywraca metadane DB do stanu bazowego. Jesli plik nie istnieje, zeruje wszystko.

11. **Rozwiazywanie hostname**: checkInRecording() probuje rozwiazac IP na nazwe stacji z tabeli STATIONS. Adresy localhost (127.x.x.x, ::1) mapowane sa na nazwe biezacej stacji.

12. **Kopiowanie cuta**: copyTo() kopiuje metadane DB, resetuje PLAY_COUNTER do 0, kopiuje eventy CUT_EVENTS, a nastepnie kopiuje audio przez RDCopyAudio (komunikacja z rdcatchd).

13. **XML serializacja**: xml() wspiera tryb absolute (oryginalne punkty) i relative (przeliczone wzgledem startPoint). Wymaga query z RDCart::xmlSql().

## Linux-specific

Brak bezposrednich wywolan QProcess, /dev/ ani specyficznych komend Linux w tej klasie. Operacje na plikach audio sa delegowane do RDWaveFile, RDCopyAudio, RDTrimAudio.

## Tabele DB CRUD

### CUTS (glowna tabela)
- **CREATE**: `create()` -- INSERT z CUT_NAME, CART_NUMBER, ORIGIN_DATETIME, DESCRIPTION, START_DATETIME, END_DATETIME
- **READ**: `isValid()`, `getMetadata()`, `effectiveStart/End()`, `exists()`, wszystkie gettery (przez RDGetSqlValue)
- **UPDATE**: `setMetadata()`, `checkInRecording()`, `reset()`, `logPlayout()`, `copyTo()`, wszystkie settery (przez SetRow)
- **DELETE**: brak (usuwanie cuta realizowane gdzie indziej)

Kolumny tabeli CUTS (wnioskowane z SQL):
CUT_NAME, CART_NUMBER, DESCRIPTION, OUTCUE, LENGTH, CODING_FORMAT, SAMPLE_RATE, BIT_RATE, CHANNELS, PLAY_GAIN, START_POINT, END_POINT, FADEUP_POINT, FADEDOWN_POINT, SEGUE_START_POINT, SEGUE_END_POINT, SEGUE_GAIN, HOOK_START_POINT, HOOK_END_POINT, TALK_START_POINT, TALK_END_POINT, ISRC, ISCI, RECORDING_MBID, RELEASE_MBID, SHA1_HASH, ORIGIN_DATETIME, ORIGIN_NAME, ORIGIN_LOGIN_NAME, SOURCE_HOSTNAME, START_DATETIME, END_DATETIME, START_DAYPART, END_DAYPART, MON, TUE, WED, THU, FRI, SAT, SUN, EVERGREEN, WEIGHT, PLAY_ORDER, LAST_PLAY_DATETIME, UPLOAD_DATETIME, PLAY_COUNTER, LOCAL_COUNTER, VALIDITY

### CUT_EVENTS
- **READ**: `copyTo()` -- SELECT NUMBER, POINT
- **CREATE**: `copyTo()` -- INSERT z CUT_NAME, NUMBER, POINT (kopiowanie eventow)

### STATIONS (lookup)
- **READ**: `checkInRecording()` -- lookup NAME by IPV4_ADDRESS (rozwiazywanie hostname)

### GROUPS + CART (lookup, JOIN)
- **READ**: `GetDefaultDateTimes()` -- SELECT GROUPS.DEFAULT_CUT_LIFE via JOIN z CART (pobieranie domyslnego czasu zycia cuta)

## Zaleznosci

- **RDSqlQuery / RDDb** -- dostep do bazy danych (Active Record)
- **RDWaveFile** -- analiza plikow audio WAV (auto-trim, reset)
- **RDWaveData** -- obiekt transferu metadanych (DTO)
- **RDSettings** -- konfiguracja formatu audio
- **RDStation** -- model stacji
- **RDUser** -- model uzytkownika
- **RDConfig** -- konfiguracja systemowa (sciezki audio)
- **RDCopyAudio** -- kopiowanie audio miedzy cutami (delegacja do rdcatchd)
- **RDTrimAudio** -- zdalne przycinanie audio (delegacja do rdcatchd)
- **Q3Signal** -- legacy mechanizm powiadamiania (Qt3 compat)
- **RDEscapeString** -- sanityzacja SQL
- **RDGetSqlValue / RDDoesRowExist** -- helpery DB
- **RDXmlField** -- helper serializacji XML
