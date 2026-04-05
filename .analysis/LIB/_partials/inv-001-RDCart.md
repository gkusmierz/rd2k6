---
partial_id: 001
artifact: LIB
class_name: RDCart
header_file: lib/rdcart.h
source_file: lib/rdcart.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCart

## Typ Qt
Plain C++ / Active Record pattern (no Q_OBJECT, no signals/slots, no Q_PROPERTY)

## Odpowiedzialnosc (WHAT)
RDCart to model "carta" (kontenera audio) w systemie Rivendell — centralny obiekt biblioteki audio. Reprezentuje jeden wpis w tabeli CART bazy danych i zapewnia pelny CRUD na nim oraz na powiazanych cutach (fragmentach audio). Odpowiada za: zarzadzanie metadanymi carta (tytul, artysta, album, itd.), selekcje nastepnego cuta do odtworzenia (z uwzglednieniem rotacji, wag, daypartingu i dat waznosci), walidacje dlugosci cutow wzgledem wymagan schedulera, oraz serializacje/deserializacje do XML.

## Sygnaly
Brak (plain C++)

## Sloty
Brak (plain C++)

## Stan (Q_PROPERTY)
Brak

## Publiczne API (metody z znaczeniem biznesowym)

| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| `selectCut` | `QString *cut, QTime time` | Wybiera nastepny cut do odtworzenia z uwzglednieniem: dat waznosci (START/END_DATETIME), daypartingu (START/END_DAYPART), dnia tygodnia, rotacji (sekwencyjna lub wagowa). Jesli brak waznych cutow, szuka evergreenow. | Cart musi istniec; dotyczy tylko typu Audio |
| `create` (static) | `groupname, type, err_msg, cartnum` | Tworzy nowy cart w grupie. Jesli cartnum=0, automatycznie przydziela wolny numer z grupy. Wstawia rekord do tabeli CART z unikalnym tytulem. | Grupa musi istniec i miec wolne numery |
| `addCut` | `format, bitrate, chans, isci, desc` | Dodaje nowy cut do carta. Generuje nazwe cuta (NNNNNN_CCC), tworzy rekord w CUTS, aktualizuje dlugosci i resetuje rotacje. | Musi byc wolny slot (max 999 cutow) |
| `removeCut` | `station, user, cutname, config` | Usuwa cut: kasuje audio (lokalnie lub przez XPORT API), usuwa rekord z CUTS, aktualizuje dlugosci. | - |
| `removeCart` (static) | `cart_num, station, user, config` | Kaskadowe usuniecie carta: usuwa audio wszystkich cutow, rekordy z CUTS, CART_SCHED_CODES, REPL_CART_STATE, CART. | - |
| `updateLength` | `enforce_length, length` | Przelicza srednie dlugosci (audio, segue, hook, talk), uwzgledniajac wagi cutow i daty wygasniecia. Aktualizuje walidosc carta (NeverValid / ConditionallyValid / AlwaysValid / EvergreenValid / FutureValid). Ustawia START/END_DATETIME carta na podstawie cutow. | - |
| `calculateAverageLength` | `max_dev` | Oblicza srednia wazona dlugosc cutow (wagami sa WEIGHT, z zerowaniem dla wygaslych). Zwraca tez max odchylenie. | Dotyczy tylko typu Audio |
| `validateLengths` | `len` | Sprawdza czy wszystkie cuty miescza sie w zakresie timescale (RD_TIMESCALE_MIN..MAX razy target length). | - |
| `getMetadata` / `setMetadata` | `RDWaveData *data` | Odczyt/zapis pelnych metadanych carta (tytul, artysta, album, rok, label, BPM, usage code, sched codes, itd.) z/do bazy. | - |
| `resetRotation` | - | Zeruje LOCAL_COUNTER wszystkich cutow carta, restartujac rotacje. | - |
| `xml` / `xmlSql` / `cutXml` | rozne | Serializacja carta (i opcjonalnie cutow) do formatu XML. xmlSql buduje SQL query pobierajacy wszystkie potrzebne kolumny z CART+CUTS. | - |
| `readXml` (static) | XML string, RDWaveData | Deserializacja metadanych carta z XML do struktury RDWaveData. | - |
| `removePending` (static) | `station, user, config` | Usuwa carty oznaczone jako "pending" dla danej stacji i PID procesu. Mechanizm czyszczenia tymczasowych cartow. | - |
| `uniqueCartTitle` / `titleIsUnique` / `ensureTitleIsUnique` (static) | `cartnum, except_cartnum` | Generowanie unikalnych tytulow cartow, sprawdzanie unikalnosci, wymuszanie unikalnosci przez dodanie suffixu `[N]`. | - |

## Stany i kategorie (enums)

| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| `Type` | `All=0, Audio=1, Macro=2` | Typ carta: Audio (zawiera nagrania), Macro (skrypt komend), All (filtr) |
| `PlayOrder` | `Sequence=0, Random=1` | Kolejnosc odtwarzania cutow: sekwencyjna lub losowa |
| `UsageCode` | `UsageFeature=0, UsageOpen=1, UsageClose=2, UsageTheme=3, UsageBackground=4, UsagePromo=5, UsageLast=6` | Klasyfikacja uzycia carta w kontekscie programu radiowego (feature, opener, closer, theme, background, promo) |
| `Validity` | `NeverValid=0, ConditionallyValid=1, AlwaysValid=2, EvergreenValid=3, FutureValid=4` | Status waznosci carta w kontekscie schedulera: nigdy, warunkowo (zalezy od dnia/godziny), zawsze, evergreen (zawsze dostepny jako fallback), przyszly (jeszcze nie aktywny) |

## Reguly biznesowe (z implementacji)

- Regula: Selekcja cuta uwzglednia dayparting (okna czasowe START/END_DAYPART), daty waznosci (START/END_DATETIME), dzien tygodnia (SUN-SAT) i flage evergreen. Jesli brak waznych cutow, system probuje evergreeny jako fallback.
  - Zrodlo: `selectCut()`

- Regula: W trybie wagowym (`useWeighting=true`) nastepny cut jest wybierany na podstawie stosunku LOCAL_COUNTER/WEIGHT (najnizszy stosunek = najrzadziej grany wzgledem wagi). W trybie sekwencyjnym wybiera cut o najnizszym PLAY_ORDER wiekszym od ostatnio granego.
  - Zrodlo: `GetNextCut()`

- Regula: Srednia dlugosc carta jest srednia wazona dlugosci cutow, gdzie waga wygaslych cutow (END_DATETIME < now) jest zerowana — nie wplywaja na srednia.
  - Zrodlo: `calculateAverageLength()`, `updateLength()`

- Regula: Walidosc carta jest promowana: ConditionallyValid -> AlwaysValid jesli aktywne wszystkie 7 dni tygodnia i czas OK; dowolna walidosc -> EvergreenValid jesli WSZYSTKIE cuty maja flage evergreen.
  - Zrodlo: `updateLength()` (sekcja Update Validity)

- Regula: Tworzenie carta wymaga istniejacej grupy z wolnymi numerami. Tytul jest automatycznie generowany jako unikalny (`[N]` suffix dodawany jesli duplikat).
  - Zrodlo: `create()`, `uniqueCartTitle()`, `ensureTitleIsUnique()`

- Regula: Usuwanie carta jest kaskadowe — usuwa audio cutow (przez lokalne `unlink` lub remote XPORT API), rekordy CUTS, CART_SCHED_CODES, REPL_CART_STATE, i wreszcie CART.
  - Zrodlo: `removeCart()`

- Regula: Usuwanie audio cuta ma dwa tryby: lokalny (bezposredni `unlink` pliku + usuniecie CUT_EVENTS) gdy brak usera, lub zdalny (HTTP POST do XPORT API z DELETEAUDIO command) gdy user jest podany.
  - Zrodlo: `removeCutAudio()`

- Regula: Dodanie cuta automatycznie resetuje rotacje (LOCAL_COUNTER=0 dla wszystkich cutow) i przelicza dlugosci carta.
  - Zrodlo: `addCut()`

- Regula: Nazwa cuta ma format NNNNNN_CCC (6-cyfrowy numer carta + 3-cyfrowy numer cuta). Max 999 cutow na cart.
  - Zrodlo: `addCut()`, `GetNextFreeCut()`

## Linux-specific uzycia
Brak bezposrednich odwolan do QProcess, jackd, cdparanoia czy /dev/. Jedyne elementy systemowe to `unistd.h` (getpid() dla pending carts) i `curl` (HTTP do XPORT API).

## Tabele DB (CRUD)

| Tabela | Operacje | Kolumny |
|--------|----------|---------|
| `CART` | SELECT, INSERT, UPDATE, DELETE | NUMBER, TYPE, GROUP_NAME, TITLE, ARTIST, ALBUM, YEAR, LABEL, CLIENT, AGENCY, PUBLISHER, COMPOSER, USER_DEFINED, USAGE_CODE, FORCED_LENGTH, AVERAGE_LENGTH, LENGTH_DEVIATION, AVERAGE_SEGUE_LENGTH, AVERAGE_HOOK_LENGTH, MINIMUM_TALK_LENGTH, MAXIMUM_TALK_LENGTH, CUT_QUANTITY, LAST_CUT_PLAYED, VALIDITY, ENFORCE_LENGTH, ASYNCRONOUS, OWNER, METADATA_DATETIME, CONDUCTOR, MACROS, SONG_ID, BPM, NOTES, PLAY_ORDER, START_DATETIME, END_DATETIME, USE_WEIGHTING, PRESERVE_PITCH, USE_EVENT_LENGTH, PENDING_STATION, PENDING_PID |
| `CUTS` | SELECT, UPDATE, DELETE | CUT_NAME, CART_NUMBER, EVERGREEN, DESCRIPTION, OUTCUE, ISRC, ISCI, LENGTH, ORIGIN_DATETIME, START_DATETIME, END_DATETIME, SUN, MON, TUE, WED, THU, FRI, SAT, START_DAYPART, END_DAYPART, ORIGIN_NAME, ORIGIN_LOGIN_NAME, SOURCE_HOSTNAME, WEIGHT, LAST_PLAY_DATETIME, PLAY_COUNTER, LOCAL_COUNTER, VALIDITY, CODING_FORMAT, SAMPLE_RATE, BIT_RATE, CHANNELS, PLAY_GAIN, START_POINT, END_POINT, FADEUP_POINT, FADEDOWN_POINT, SEGUE_START_POINT, SEGUE_END_POINT, SEGUE_GAIN, HOOK_START_POINT, HOOK_END_POINT, TALK_START_POINT, TALK_END_POINT, RECORDING_MBID, RELEASE_MBID, PLAY_ORDER |
| `CART_SCHED_CODES` | SELECT, INSERT, DELETE | CART_NUMBER, SCHED_CODE |
| `SCHED_CODES` | SELECT (read-only lookup) | CODE |
| `REPL_CART_STATE` | DELETE | CART_NUMBER |
| `CUT_EVENTS` | DELETE (via removeCutAudio) | CUT_NAME |

## Zaleznosci od innych klas tego artifaktu

- `RDCut` — model cuta (fragmentu audio), tworzenie/usuwanie cutow, walidacja, nazewnictwo
- `RDGroup` — model grupy cartow, sprawdzanie istnienia grupy, pobieranie wolnego numeru carta
- `RDStation` — model stacji, URL web service dla remote operations
- `RDUser` — model usera, dane uwierzytelniajace dla XPORT API
- `RDConfig` — konfiguracja systemowa, user agent
- `RDWaveData` — struktura metadanych audio (tytul, artysta, itp.)
- `RDDb` / `RDSqlQuery` — warstwa dostepu do bazy danych (Active Record persistence)

## Zaleznosci od shared libraries

- `libcurl` (curl/curl.h) — HTTP client do komunikacji z XPORT API (usuwanie audio zdalnie)
- Qt Core (QDateTime, QStringList, QVariant, QObject) — typy danych i lokalizacja
- POSIX (sys/types.h, unistd.h) — getpid() dla mechanizmu pending carts
- syslog.h — logowanie systemowe (przez rda->syslog)
