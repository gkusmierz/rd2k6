---
phase: 2
artifact: LIB
artifact_name: librd
status: done
completed_at: 2026-04-05
partial_count: 191
conflicts_found: 0
missing_coverage: 0
agent_version: 1.1.0
---

# Inventory: librd

## Statystyki

| Typ | Liczba |
|-----|--------|
| Klasy lacznie | 115 |
| QMainWindow subclassy | 0 |
| QDialog subclassy | 22 |
| QWidget subclassy | 17 |
| QObject subclassy (serwisy) | 36 |
| QAbstractItemModel subclassy | 1 |
| QThread subclassy | 0 |
| Plain C++ (non-Qt) klasy | 39 |

---

## Klasy -- szczegolowy inwentarz

### RDApplication

**Typ Qt:** QObject (Service -- singleton-like)
**Plik:** `rdapplication.h` + `rdapplication.cpp`
**Odpowiedzialnosc:** Glowna klasa inicjalizacyjna srodowiska Rivendell. Otwiera polaczenie z baza danych, tworzy i udostepnia obiekty konfiguracji (RDConfig), stacji (RDStation), systemu (RDSystem), uzytkownika (RDUser), klienta CAE (RDCae) i RIPC (RDRipc). Globalna instancja `rda`.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| userChanged() | brak | Aktywny uzytkownik zostal zmieniony (np. po loginie) |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| userChangedData() | brak | private | Propaguje zmiane uzytkownika z RIPC |

**Stan (Q_PROPERTY):** Brak

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| open() | err_msg, err_type, check_svc | Inicjalizuje cale srodowisko: config, DB, stacje, usera, CAE, RIPC | Wywolywane raz przy starcie aplikacji |
| cae() | brak | Zwraca klienta Core Audio Engine | Po open() |
| ripc() | brak | Zwraca klienta RIPC (komunikacja z ripcd) | Po open() |
| config() | brak | Zwraca konfiguracje systemu (rd.conf) | Po open() |
| station() | brak | Zwraca dane stacji roboczej | Po open() |
| user() | brak | Zwraca aktywnego uzytkownika | Po open() |
| system() | brak | Zwraca konfiguracje systemowa | Po open() |
| syslog() | priority, fmt, ... | Loguje wiadomosc do sysloga | Zawsze |
| dropTable() | tbl_name | Usuwa tabele z bazy | Po open() |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| ErrorType | ErrorOk, ErrorDbVersionSkew, ErrorNoHostEntry, ErrorNoService | Bledy inicjalizacji |
| ExitCode | ExitOk..ExitLast (19 wartosci) | Kody wyjscia aplikacji (prior instance, no DB, invalid option, itp.) |

**Reguly biznesowe:**
- Aplikacja wymaga istniejacego wpisu stacji w bazie danych (ErrorNoHostEntry)
- Wersja schematu bazy musi odpowiadac wersji oprogramowania (ErrorDbVersionSkew)
- Moze sprawdzac czy serwis systemd jest aktywny (ErrorNoService)
- Zrodlo: open()

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| syslog | syslog() do systemowego logu | MEDIUM |

**Zaleznosci od innych klas tego artifaktu:**
- RDConfig, RDStation, RDSystem, RDUser, RDCae, RDRipc, RDCmdSwitch, RDAirPlayConf, RDLibraryConf, RDLogeditConf, RDDbHeartbeat, RDRssSchemas

---

### RDCae

**Typ Qt:** QObject (Service)
**Plik:** `rdcae.h` + `rdcae.cpp`
**Odpowiedzialnosc:** Klient Core Audio Engine. Komunikuje sie z demonem caed przez socket UDP/TCP. Zarzadza odtwarzaniem, nagrywaniem, poziomami audio, miernikami i ustawieniami kart dzwiekowych.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| isConnected(bool) | state | Polaczenie z CAE nawiazane/utracone |
| playLoaded(int) | handle | Audio zaladowane do playbacku, gotowe do odtwarzania |
| playPositioned(int,unsigned) | handle, pos | Pozycja odtwarzania ustawiona |
| playing(int) | handle | Odtwarzanie rozpoczete |
| playStopped(int) | handle | Odtwarzanie zatrzymane |
| playUnloaded(int) | handle | Audio zwolnione z playbacku |
| recordLoaded(int,int) | card, stream | Deck nagrywania gotowy |
| recording(int,int) | card, stream | Nagrywanie rozpoczete |
| recordStopped(int,int) | card, stream | Nagrywanie zatrzymane |
| recordUnloaded(int,int,unsigned) | card, stream, msecs | Nagranie zwolnione z podanym czasem trwania |
| inputStatusChanged(int,int,bool) | card, stream, state | Status wejscia audio zmieniony |
| playPositionChanged(int,unsigned) | handle, sample | Pozycja playbacku zaktualizowana |
| timescalingSupported(int,bool) | card, state | Informacja czy karta wspiera timescaling |

**Sloty:** Brak publicznych

**Stan (Q_PROPERTY):** Brak

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| connectHost() | brak | Nawiazuje polaczenie z demonem CAE | Po stworzeniu obiektu |
| loadPlay() | card, name, stream*, handle* | Laduje audio do playbacku, zwraca stream/handle | Po connectHost() |
| play() | handle, length, speed, pitch | Rozpoczyna odtwarzanie | Po loadPlay() |
| stopPlay() | handle | Zatrzymuje odtwarzanie | Podczas odtwarzania |
| loadRecord() | card, stream, name, coding, chan, rate, bitrate | Przygotowuje nagrywanie | Po connectHost() |
| record() | card, stream, length, threshold | Rozpoczyna nagrywanie | Po loadRecord() |
| stopRecord() | card, stream | Zatrzymuje nagrywanie | Podczas nagrywania |
| setInputVolume() | card, stream, level | Ustawia poziom wejscia | Zawsze |
| setOutputVolume() | card, stream, port, level | Ustawia poziom wyjscia | Zawsze |
| fadeOutputVolume() | card, stream, port, level, length | Fade wyjscia do poziomu | Zawsze |
| enableMetering() | cards | Wlacza mierniki dla wybranych kart | Po connectHost() |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| ClockSource | InternalClock, AesEbuClock, SpDiffClock, WordClock | Zrodlo zegara audio |
| ChannelMode | Normal, Swap, LeftOnly, RightOnly | Tryb kanalow |
| SourceType | Analog, AesEbu | Typ zrodla wejscia |
| AudioCoding | Pcm16, MpegL1, MpegL2, MpegL3, Pcm24 | Format kodowania audio |

**Reguly biznesowe:**
- Komunikacja z CAE odbywa sie przez socket UDP (komendy tekstowe)
- Mierniki odswiezane cyklicznie przez timer (clockData)
- Zrodlo: connectHost(), UpdateMeters()

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Q3SocketDevice | UDP socket do CAE | HIGH |

**Zaleznosci od innych klas tego artifaktu:**
- RDStation, RDConfig, RDCmdCache

---

### RDRipc

**Typ Qt:** QObject (Service)
**Plik:** `rdripc.h` + `rdripc.cpp`
**Odpowiedzialnosc:** Klient RPC do komunikacji z demonem ripcd. Obsluguje przesylanie makr RML, zarzadzanie GPIO, powiadomienia miedzy procesami, oraz zmiane uzytkownika.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| connected(bool) | state | Polaczenie z ripcd nawiazane/utracone |
| userChanged() | brak | Aktywny uzytkownik zmieniony |
| gpiStateChanged(int,int,bool) | matrix, line, state | Stan wejscia GPIO zmieniony |
| gpoStateChanged(int,int,bool) | matrix, line, state | Stan wyjscia GPIO zmieniony |
| gpiMaskChanged(int,int,bool) | matrix, line, state | Maska GPI zmieniona |
| gpoMaskChanged(int,int,bool) | matrix, line, state | Maska GPO zmieniona |
| gpiCartChanged(int,int,int,int) | matrix, line, off_cart, on_cart | Cart przypisany do GPI zmieniony |
| gpoCartChanged(int,int,int,int) | matrix, line, off_cart, on_cart | Cart przypisany do GPO zmieniony |
| notificationReceived(RDNotification*) | notify | Powiadomienie odebrane od innego procesu |
| onairFlagChanged(bool) | state | Flaga on-air zmieniona |
| rmlReceived(RDMacro*) | rml | Komenda RML odebrana |

**Sloty:** Brak publicznych

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| connectHost() | hostname, port, password | Laczy sie z ripcd | Po stworzeniu obiektu |
| sendRml() | macro | Wysyla komende RML do wykonania | Po connectHost() |
| sendNotification() | type, action, id | Wysyla powiadomienie do wszystkich procesow | Po connectHost() |
| sendOnairFlag() | brak | Wysyla aktualny stan on-air | Po connectHost() |
| setUser() | user | Zmienia aktywnego uzytkownika | Zawsze |

**Reguly biznesowe:**
- Komunikacja z ripcd przez TCP socket (komendy tekstowe)
- Obsluguje GPIO mask/cart dla matryc przelacznikowych
- Zrodlo: connectHost(), DispatchCommand()

**Zaleznosci od innych klas tego artifaktu:**
- RDStation, RDConfig, RDMacro, RDNotification

---

### RDCart

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdcart.h` + `rdcart.cpp`
**Odpowiedzialnosc:** Reprezentuje Cart (kontener audio) w systemie. Cart to podstawowa jednostka organizacyjna audio -- moze zawierac wiele Cuts (segmentow audio). Obsluguje metadane (tytul, artysta, album), wybor cuta do odtworzenia (rotation), walidacje dat waznosci, oraz operacje CRUD na bazie.

**Sygnaly:** Brak (non-Qt)

**Sloty:** Brak (non-Qt)

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| selectCut() | cut* [, time] | Wybiera nastepny Cut do odtworzenia wg rotacji i warunkow | Cart musi istniec |
| type() / setType() | RDCart::Type | Audio lub Macro cart | Zawsze |
| addCut() | format, bitrate, chans, isci, desc | Dodaje nowy Cut do carta | Cart musi istniec |
| removeCut() | station, user, cutname, config | Usuwa Cut i jego plik audio | Cart musi istniec |
| remove() | station, user, config | Usuwa caly Cart z systemu | Cart musi istniec |
| create() | groupname, type, err_msg, cartnum | Tworzy nowy Cart (statyczna) | Numer moze byc auto-przydzielony |
| updateLength() | enforce_length, length | Przelicza srednia dlugosc carta | Po zmianach w Cutach |
| validateLengths() | len | Sprawdza czy Cuty mieszcza sie w limicie | Zawsze |
| getMetadata() / setMetadata() | RDWaveData | Pobiera/ustawia metadane audio | Cart musi istniec |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Type | All, Audio, Macro | Typ carta: audio lub makro |
| PlayOrder | Sequence, Random | Kolejnosc odtwarzania Cutow |
| UsageCode | UsageFeature..UsageLast (6) | Kod uzycia: feature, open, close, theme, background, promo |
| Validity | NeverValid..FutureValid (5) | Stan waznosci carta: nigdy, warunkowo, zawsze, evergreen, przyszly |

**Reguly biznesowe:**
- Cart moze byc Audio (odtwarza plik) lub Macro (wykonuje komendy RML)
- Selekcja cuta uwzglednia rotacje (Sequence/Random), waznosc dat i daypart
- Cart z Validity=NeverValid nie moze byc odtworzony
- Evergreen carts sa zawsze wazne (uzywane jako fallback)
- Tytul carta musi byc unikalny (titleIsUnique, ensureTitleIsUnique)
- Numer carta jest z zakresu grupy (enforceCartRange w RDGroup)
- Zrodlo: selectCut(), ValidateCut(), create()

**Zaleznosci od innych klas tego artifaktu:**
- RDCut, RDWaveData, RDSettings, RDStation, RDUser, RDConfig, RDSqlQuery

---

### RDCut

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdcut.h` + `rdcut.cpp`
**Odpowiedzialnosc:** Reprezentuje Cut (segment audio w ramach carta). Cut to faktyczny plik dzwiekowy z markerami (start, end, segue, fadeup/fadedown, hook, talk). Obsluguje walidacje waznosci, dayparts, kopie plikow, logowanie odtworzen.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| isValid() | [time/datetime] | Sprawdza czy Cut jest wazny w danym momencie | Zawsze |
| startPoint() / endPoint() | [calc] | Poczatek/koniec audio (z opcja kalkulacji) | Cut musi istniec |
| segueStartPoint() / segueEndPoint() | [calc] | Markery segue (transition do nastepnego) | Cut musi istniec |
| fadeupPoint() / fadedownPoint() | [calc] | Markery fade in/out | Cut musi istniec |
| hookStartPoint() / hookEndPoint() | [calc] | Markery hook (skrocona wersja preview) | Cut musi istniec |
| talkStartPoint() / talkEndPoint() | [calc] | Markery talk-over | Cut musi istniec |
| logPlayout() | brak | Loguje odtworzenie do bazy (play counter, last play) | Po odtworzeniu |
| autoTrim() | end, level | Automatycznie przycina cisza | Cut musi istniec |
| autoSegue() | level, length, station, user, config | Automatycznie generuje punkt segue na bazie poziomu | Cut musi istniec |
| checkInRecording() | station, user, hostname, settings, msecs | Rejestruje zakonczenie nagrania | Po nagrywaniu |
| copyTo() | station, user, cutname, config | Kopiuje audio do innego Cuta | Cut musi istniec |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| AudioEnd | AudioBoth, AudioHead, AudioTail | Ktory koniec audio do operacji trim |
| IsrcFormat | RawIsrc, FormattedIsrc | Format kodu ISRC |
| Validity | NeverValid, ConditionallyValid, AlwaysValid, FutureValid | Stan waznosci |

**Reguly biznesowe:**
- Cut jest wazny tylko gdy: data waznosci w zakresie AND dzien tygodnia dozwolony AND daypart (godziny) dozwolony
- Evergreen Cut jest zawsze wazny niezaleznie od dat
- logPlayout() inkrementuje play_counter i ustawia last_play_datetime
- cutName ma format NNNNNN_NNN (6 cyfr numer carta + _ + 3 cyfry numer cuta)
- Zrodlo: isValid(), logPlayout()

**Zaleznosci od innych klas tego artifaktu:**
- RDWaveData, RDSettings, RDStation, RDUser, RDConfig, RDSqlQuery

---

### RDLog

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdlog.h` + `rdlog.cpp`
**Odpowiedzialnosc:** Reprezentuje Log (playlist/schedule) w systemie. Log to uporzadkowana lista zdarzen do odtworzenia w czasie. Obsluguje metadane logu, linkowanie z importami traffic/music, sledzenie voicetrackow.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| create() | name, svc_name, air_date, user_name, err_msg, config | Tworzy nowy log | statyczna |
| remove() | station, user, config | Usuwa log i powiazane dane | Log musi istniec |
| createLogEvent() | brak | Tworzy RDLogEvent z danych logu | Log musi istniec |
| updateTracks() | brak | Przelicza stan voicetrackow | Log musi istniec |
| linkState() / setLinkState() | src | Sprawdza/ustawia stan linkowania (traffic/music) | Zawsze |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Type | Log, Event, Clock, Grid | Typ obiektu |
| Source | SourceTraffic, SourceMusic | Zrodlo importu |
| LinkState | LinkMissing, LinkDone, LinkNotPresent | Stan linkowania z importem traffic/music |

**Reguly biznesowe:**
- Log jest powiazany z serwisem (service) ktory determinuje reguly importu
- Linkowanie laczy importy traffic/music z placeholderami w logu
- Log ma daty start/end/purge okreslajace cykl zycia
- autoRefresh pozwala na automatyczne odswiezanie logu w trakcie emisji
- Zrodlo: linkState(), create()

**Zaleznosci od innych klas tego artifaktu:**
- RDLogEvent, RDUser, RDStation, RDConfig

---

### RDLogEvent

**Typ Qt:** Plain C++ (non-Qt)
**Plik:** `rdlog_event.h` + `rdlog_event.cpp`
**Odpowiedzialnosc:** Kolekcja linii logu (RDLogLine) -- reprezentuje zawartosc logu w pamieci. Obsluguje ladowanie/zapisywanie do bazy, walidacje, operacje na liniach (insert, remove, move, copy), obliczanie dlugosci blokow.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| load() | track_ptrs | Laduje log z bazy do pamieci | Log musi istniec |
| save() | config, update_tracks, line | Zapisuje zmiany do bazy | Po zmianach |
| validate() | report*, date | Waliduje log, generuje raport bledow | Po zaladowaniu |
| insert() | line, num_lines, preserve_trans | Wstawia nowe linie | Po zaladowaniu |
| remove() | line, num_lines, preserve_trans | Usuwa linie | Po zaladowaniu |
| move() / copy() | from, to | Przenosi/kopiuje linie | Po zaladowaniu |
| length() | from, to | Oblicza dlugosc fragmentu logu | Po zaladowaniu |
| logLine() | line | Zwraca dana linie logu | Po zaladowaniu |

**Zaleznosci od innych klas tego artifaktu:**
- RDLogLine, RDConfig

---

### RDLogLine

**Typ Qt:** Plain C++ (non-Qt, Value Object)
**Plik:** `rdlog_line.h` + `rdlog_line.cpp`
**Odpowiedzialnosc:** Reprezentuje pojedyncza linie w logu. Przechowuje typ zdarzenia, numer carta, czasy start/end, markery audio, metadane carta, status odtwarzania, informacje o transition (play/segue/stop).

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| setEvent() | mach, next_type, timescale, len | Ustawia zdarzenie do odtworzenia -- laduje carta i konfiguruje deck | Przy play |
| loadCart() | cartnum, next_type, mach, timescale | Laduje metadane carta do logline | Przed odtworzeniem |
| effectiveLength() | brak | Oblicza efektywna dlugosc z uwzglednieniem enforce_length | Zawsze |
| resolveWildcards() | pattern, log_id | Rozwiazuje wildcards w tekscie (np. %t=title, %a=artist) | Dla NowNext |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Type | Cart, Marker, Macro, OpenBracket, CloseBracket, Chain, Track, MusicLink, TrafficLink, UnknownType | Typ linii logu |
| TimeType | Relative, Hard, NoTime | Sposob okreslenia czasu startu |
| TransType | Play, Segue, Stop, NoTrans | Typ przejscia miedzy liniami |
| Status | Scheduled, Playing, Auditioning, Finished, Finishing, Paused | Status odtwarzania |
| State | Ok, NoCart, NoCut | Stan gotowosci do odtworzenia |
| Source | Manual, Traffic, Music, Template, Tracker | Zrodlo linii (skad dodana) |
| StartSource | StartUnknown..StartChannel (8) | Co zainicjowalo start |
| PlaySource | UnknownSource..CartSlot (6) | Z jakiego zrodla odtwarzane |

**Reguly biznesowe:**
- Linia z TimeType=Hard ma wymuszony czas startu (np. 14:00:00)
- TransType=Segue powoduje crossfade do nastepnego elementu
- MusicLink/TrafficLink to placeholdery do wypelnienia przez import
- Track to placeholder na voicetrack do nagrania
- Zrodlo: setEvent(), loadCart()

---

### RDLogPlay

**Typ Qt:** QObject + RDLogEvent (Service, playback engine)
**Plik:** `rdlogplay.h` + `rdlogplay.cpp`
**Odpowiedzialnosc:** Silnik odtwarzania logu -- zarzadza kolejka odtwarzania, obsluguje segue/transition/hard-time starty, steruje deckami odtwarzania, obsluguje NowNext PAD, reaguje na powiadomienia o zmianach.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| renamed() | brak | Log zostal przemianowany |
| reloaded() | brak | Log zostal przeladowany |
| transportChanged() | brak | Stan transportu (play/stop/pause) zmieniony |
| played(int) | line | Linia rozpoczela odtwarzanie |
| paused(int) | line | Linia wstrzymana |
| stopped(int) | line | Linia zatrzymana |
| position(int,int) | line, point | Pozycja odtwarzania zmieniona |
| inserted(int) | line | Nowa linia wstawiona |
| removed(int,int,bool) | line, num, moving | Linie usuniete |
| modified(int) | line | Linia zmodyfikowana |
| topEventChanged(int) | line | Zmiana gornej linii widocznej w UI |
| nextEventChanged(int) | line | Zmiana nastepnej linii do odtworzenia |
| nextStopChanged(QTime) | time | Czas nastepnego zatrzymania zmieniony |
| runStatusChanged(bool) | running | Stan pracy (play/stop) zmieniony |
| channelStarted/Stopped(int,int,int,int) | id, mport, card, port | Kanal audio uruchomiony/zatrzymany |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| play() | line, src, mport, skip_meta | Rozpoczyna odtwarzanie linii | Log zaladowany |
| stop() | all, port, fade | Zatrzymuje odtwarzanie | Podczas odtwarzania |
| pause() | line | Wstrzymuje odtwarzanie | Podczas odtwarzania |
| makeNext() | line | Ustawia nastepna linie do odtworzenia | Log zaladowany |
| load() | brak | Laduje log z bazy | Po setLogName() |
| refresh() | brak | Odswieza log (nowe linkowania) | Podczas emisji |
| setOpMode() | mode | Ustawia tryb pracy (LiveAssist/Auto/Manual) | Zawsze |
| auditionHead/Tail() | line | Odsluchiwa poczatek/koniec carta | Log zaladowany |

**Reguly biznesowe:**
- W trybie Auto -- nastepny element startuje automatycznie (segue/play)
- W trybie LiveAssist -- hard-time starty sa automatyczne, reszta manualna
- W trybie Manual -- wszystko manualne
- Hard-time events maja priorytet nad kolejnoscia odtwarzania
- Segue realizowany przez crossfade dwoch deckow jednoczesnie
- Maksymalnie LOGPLAY_MAX_PLAYS (7) jednoczesnych odtworzen
- Zrodlo: play(), StartEvent(), SetTransTimer()

**Zaleznosci od innych klas tego artifaktu:**
- RDLogEvent, RDCae, RDPlayDeck, RDMacroEvent, RDSimplePlayer, RDEventPlayer, RDAirPlayConf, RDLog, RDNotification, RDUnixSocket

---

### RDPlayDeck

**Typ Qt:** QObject (Service -- audio playback unit)
**Plik:** `rdplay_deck.h` + `rdplay_deck.cpp`
**Odpowiedzialnosc:** Abstrahuje pojedynczy deck odtwarzania audio. Zarzadza stanem play/pause/stop, pozycja odtwarzania, segue/hook/talk point timerami, fade in/out i ducking.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| stateChanged(int,RDPlayDeck::State) | id, state | Stan decku zmieniony (stopped/playing/paused/finished) |
| position(int,int) | id, msecs | Pozycja odtwarzania zmieniona |
| segueStart(int) / segueEnd(int) | id | Osiagnieto punkt segue start/end |
| hookStart(int) / hookEnd(int) | id | Osiagnieto punkt hook start/end |
| talkStart(int) / talkEnd(int) | id | Osiagnieto punkt talk-over start/end |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| play() | pos, segue_start, segue_end, duck_up_end | public | Rozpoczyna odtwarzanie od pozycji |
| pause() | brak | public | Wstrzymuje odtwarzanie |
| stop() | interval, gain | public | Zatrzymuje z opcjonalnym fadeout |
| duckVolume() | level, fade | public | Ducking poziomu glosnosci |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| State | Stopped, Stopping, Playing, Paused, Finished | Stan odtwarzania decku |

**Zaleznosci od innych klas tego artifaktu:**
- RDCae, RDCart, RDCut, RDLogLine

---

### RDCatchConnect

**Typ Qt:** QObject (Service)
**Plik:** `rdcatch_connect.h` + `rdcatch_connect.cpp`
**Odpowiedzialnosc:** Klient TCP do komunikacji z demonem rdcatchd. Obsluguje sterowanie nagrywaniem/odtwarzaniem zaplanowanym, monitorowanie deckow, heartbeat.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| connected(int,bool) | serial, state | Polaczenie z rdcatchd nawiazane/utracone |
| statusChanged(int,unsigned,RDDeck::Status,int,QString) | serial, channel, status, id, cutname | Status decku nagrywania/odtwarzania zmieniony |
| monitorChanged(int,unsigned,bool) | serial, channel, state | Monitor on/off zmieniony |
| meterLevel(int,int,int,int) | serial, deck, chan, level | Poziom miernika zmieniony |
| eventUpdated(int) / eventPurged(int) | id | Zdarzenie zaplanowane zaktualizowane/usuniete |
| heartbeatFailed(int) | id | Heartbeat z rdcatchd utracony |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| reset() / reload() / refresh() | brak | public | Resetuj/przeladuj/odswiez konfiguracje |
| stop() | deck | public | Zatrzymaj deck nagrywania |
| monitor() | deck, state | public | Wlacz/wylacz monitoring decku |

**Zaleznosci od innych klas tego artifaktu:**
- RDDeck, RDRecording

---

### RDSoundPanel

**Typ Qt:** RDWidget (Widget -- sound panel)
**Plik:** `rdsound_panel.h` + `rdsound_panel.cpp`
**Odpowiedzialnosc:** Panel dzwiekowy (SoundPanel) -- siatka przyciskow z przypisanymi cartami. Obsluguje play/pause/stop, drag&drop, tryby sterowania (normal/add/delete/move/copy), przelaczanie miedzy panelami stacji/uzytkownika.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| selectClicked(unsigned,int,int) | cartnum, row, col | Kliknieto przycisk z cartem |
| channelStarted/Stopped(int,int,int) | mport, card, port | Kanal audio uruchomiony/zatrzymany |
| tick() | brak | Tykniecie zegara (odswiezenie UI) |
| buttonFlash(bool) | state | Stan migania przyciskow |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| play() | type, panel, row, col, src, mport, pause_when_finished | Odtwarza cart z przycisku | Panel zaladowany |
| pause() | type, panel, row, col, mport | Wstrzymuje odtwarzanie | Podczas odtwarzania |
| stop() | type, panel, row, col, mport, pause_when_finished, fade_out | Zatrzymuje z opcjonalnym fadeout | Podczas odtwarzania |
| setActionMode() | mode | Ustawia tryb sterowania (Normal/AddFrom/DeleteFrom/itp.) | Zawsze |

**Zaleznosci od innych klas tego artifaktu:**
- RDButtonPanel, RDPanelButton, RDPlayDeck, RDCart, RDCartDialog, RDButtonDialog, RDComboBox, RDPushButton, RDEventPlayer, RDAirPlayConf

---

### RDFeed

**Typ Qt:** QObject (Service)
**Plik:** `rdfeed.h` + `rdfeed.cpp`
**Odpowiedzialnosc:** Reprezentuje podcast feed (RSS). Obsluguje metadane kanalu (title, description, author, copyright), zarzadzanie epizodami, generowanie XML RSS, upload/delete plikow audio i obrazow, autopost.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| postProgressChanged(int) | step | Postep operacji publikacji |
| postProgressRangeChanged(int,int) | min, max | Zakres postepu publikacji |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| postCut() | cutname, err | Publikuje Cut jako epizod podcastu | Feed musi istniec |
| postFile() | srcfile, err | Publikuje plik audio jako epizod | Feed musi istniec |
| postLog() | logname, start_time, stop_at_stop, start_line, end_line, err | Renderuje log do audio i publikuje | Feed musi istniec |
| postXml() | brak | Generuje i uploaduje XML RSS | Feed musi istniec |
| rssXml() | err_msg, now, ok | Generuje XML RSS w pamieci | Feed musi istniec |
| isSuperfeed() | brak | Sprawdza czy feed jest superfeedem (agreguje subfeedy) | Zawsze |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Error | ErrorOk..ErrorRenderError (8) | Kody bledow operacji na feedach |

**Reguly biznesowe:**
- Feed moze byc superfeedem -- agreguje epizody z subfeedow
- Autopost automatycznie publikuje nowe Cuty jako epizody
- maxShelfLife okresla maksymalny czas zycia epizodu w dniach
- castOrder okresla kolejnosc epizodow (chronologiczna/odwrotna)
- Upload korzysta z curl (HTTP/FTP/SFTP)
- Zrodlo: postCut(), postXml(), rssXml()

**Zaleznosci od innych klas tego artifaktu:**
- RDConfig, RDStation, RDUser, RDSettings, RDRssSchemas, RDRenderer

---

### RDAudioConvert

**Typ Qt:** QObject (Service)
**Plik:** `rdaudioconvert.h` + `rdaudioconvert.cpp`
**Odpowiedzialnosc:** Konwertuje pliki audio miedzy formatami. Obsluguje 3-etapowa konwersje: Stage1 (dekodowanie zrodla), Stage2 (resampling/channels), Stage3 (kodowanie celu). Wspiera PCM16/24, MPEG L1/L2/L3, FLAC, Ogg Vorbis, M4A.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| convert() | brak | Wykonuje konwersje z ustawionymi parametrami | Po ustawieniu src/dst/settings |
| setSourceFile() / setDestinationFile() | filename | Ustawia pliki zrodlowy/docelowy | Przed convert() |
| setDestinationSettings() | settings | Ustawia parametry kodowania | Przed convert() |
| setRange() | start_pt, end_pt | Ustawia zakres do konwersji | Przed convert() |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| ErrorCode | ErrorOk..ErrorNoSpace (12) | Kody bledow konwersji |

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| libmad | Dekodowanie MPEG (dlopen) | HIGH |
| libtwolame | Kodowanie MPEG L2 (dlopen) | HIGH |
| liblame | Kodowanie MPEG L3 (dlopen) | HIGH |
| libsndfile | I/O plikow audio | HIGH |
| libvorbis | Kodowanie/dekodowanie Ogg Vorbis | HIGH |
| libFLAC | Kodowanie/dekodowanie FLAC | HIGH |

**Zaleznosci od innych klas tego artifaktu:**
- RDSettings, RDWaveData, RDWaveFile, RDConfig, RDMp4

---

### RDAudioExport

**Typ Qt:** QObject (Service)
**Plik:** `rdaudioexport.h` + `rdaudioexport.cpp`
**Odpowiedzialnosc:** Eksportuje audio z systemu Rivendell do pliku zewnetrznego. Komunikuje sie z web service (rdxport.cgi) do pobrania pliku z serwera, nastepnie konwertuje lokalnie.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| strobe() | brak | Impuls aktywnosci (dla progress bars) |

**Zaleznosci od innych klas tego artifaktu:**
- RDSettings, RDAudioConvert

---

### RDAudioImport

**Typ Qt:** QObject (Service)
**Plik:** `rdaudioimport.h` + `rdaudioimport.cpp`
**Odpowiedzialnosc:** Importuje audio z pliku zewnetrznego do systemu Rivendell. Upload poprzez web service (rdxport.cgi).

**Zaleznosci od innych klas tego artifaktu:**
- RDSettings, RDAudioConvert

---

### RDConfig

**Typ Qt:** Plain C++ (non-Qt)
**Plik:** `rdconfig.h` + `rdconfig.cpp`
**Odpowiedzialnosc:** Parsuje i przechowuje konfiguracje systemu z pliku /etc/rd.conf. Zawiera parametry MySQL, ALSA, audio storage, JACK, fontow, provisioning nowych hostow/serwisow.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| RDSelectExitCode | RDSelectOk..RDSelectLast (15) | Kody wyjscia narzedzia rdselect |

**Reguly biznesowe:**
- Domyslny plik konfiguracyjny: /etc/rd.conf
- Audio przechowywane w /var/snd jako pliki WAV
- Format nazwy pliku: NNNNNN_NNN.wav (numer carta _ numer cuta)
- Provisioning moze automatycznie tworzyc nowe hosty/serwisy

---

### RDStation

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdstation.h` + `rdstation.cpp`
**Odpowiedzialnosc:** Reprezentuje stacje robocza w systemie. Przechowuje konfiguracje kart audio, portow, sterownikow, ustawien JACK, polaczen sieciowych, cart slotow.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| AudioDriver | None, Hpi, Jack, Alsa | Sterownik audio |
| Capability | HaveOggenc..HaveMp4Decode (7) | Dostepne kodeki na stacji |
| FilterMode | FilterSynchronous, FilterAsynchronous | Tryb filtrowania |

---

### RDUser

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rduser.h` + `rduser.cpp`
**Odpowiedzialnosc:** Reprezentuje uzytkownika systemu. Zarzadza uprawnieniami (permissions), autoryzacja grup i feedow, tworzeniem ticketow sesji, walidacja hasel.

**Reguly biznesowe:**
- Uprawnienia sa bitowe: adminConfig, createCarts, deleteCarts, modifyCarts, editAudio, createLog, deleteLog, arrangeLog, voicetrackLog, editCatches, addPodcast, editPodcast, deletePodcast, configPanels, modifyTemplate
- Autoryzacja grup -- user widzi tylko autoryzowane grupy cartow
- Autentykacja moze byc lokalna (haslo w DB) lub przez PAM
- Tickety sesji maja czas wygasniecia i sa powiazane z adresem IP klienta

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| PAM | Autentykacja uzytkownikow | MEDIUM |

---

### RDGroup

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdgroup.h` + `rdgroup.cpp`
**Odpowiedzialnosc:** Reprezentuje grupe cartow. Grupa okresla zakres numerow cartow, domyslny typ, polityki zycia cutow, eksport raportow, kolor wyswietlania.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| ExportType | None, Traffic, Music | Typ eksportu dla raportow |

**Reguly biznesowe:**
- Grupa ma zakres numerow cartow (defaultLowCart..defaultHighCart)
- enforceCartRange wymusza ze nowe carty musza byc w zakresie
- cutShelflife okresla automatyczne usuwanie starych cutow
- deleteEmptyCarts automatycznie usuwa puste carty

---

### RDSvc

**Typ Qt:** QObject (Service)
**Plik:** `rdsvc.h` + `rdsvc.cpp`
**Odpowiedzialnosc:** Reprezentuje serwis (uslugi radiowe). Zarzadza importem traffic/music, generowaniem logow, linkowaniem logow z danymi traffic/music, szablonami nazw logow.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| generationProgress(int) | step | Postep generowania logu |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| ImportSource | Traffic, Music | Zrodlo importu |
| ImportField | CartNumber..LengthSeconds (13) | Pola parsowane z pliku importu |
| ShelflifeOrigin | OriginAirDate, OriginCreationDate | Punkt odniesienia dla shelflife |
| SubEventInheritance | ParentEvent, SchedFile | Sposob dziedziczenia sub-event |

**Reguly biznesowe:**
- Import parsuje pliki traffic/music z konfigurowalnym offsetem/dlugoscia pol
- Generowanie logu uzywa zegarow (RDClock) przypisanych do dni tygodnia
- Linkowanie wymaga blokady logu (RDLogLock) aby zapobiec jednoczesnej edycji

**Zaleznosci od innych klas tego artifaktu:**
- RDConfig, RDStation, RDUser, RDLogLock

---

### RDEvent

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdevent.h` + `rdevent.cpp`
**Odpowiedzialnosc:** Reprezentuje zdarzenie programowe (Log Manager Event). Definiuje blok w zegarze z czasem trwania, typem transition, zrodlem importu, autofill, scheduler.

---

### RDClock

**Typ Qt:** Plain C++ (non-Qt)
**Plik:** `rdclock.h` + `rdclock.cpp`
**Odpowiedzialnosc:** Zegar programowy -- definiuje rozklad zdarzen w ciagu godziny. Uzywany do generowania logow. Zawiera liste RDEventLine z czasem startu i dlugoscia.

---

### RDRecording

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdrecording.h` + `rdrecording.cpp`
**Odpowiedzialnosc:** Reprezentuje zaplanowane zdarzenie nagrywania/odtwarzania/uploadu/downloadu w RDCatch.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Type | Recording, MacroEvent, SwitchEvent, Playout, Download, Upload | Typ zdarzenia |
| ExitCode | Ok..NoCut (15) | Kody zakonczenia zdarzenia |
| StartType | HardStart, GpiStart | Typ startu (czas lub GPIO) |
| EndType | HardEnd, GpiEnd, LengthEnd | Typ zakonczenia |

---

### RDReport

**Typ Qt:** Plain C++ (non-Qt)
**Plik:** `rdreport.h` + `rdreport.cpp`
**Odpowiedzialnosc:** Reprezentuje raport eksportowy. Generuje raporty w 21 formatach (DeltaFlex, TextLog, BMI EMR, SoundExchange, RadioTraffic, MusicPlayout, SpinCount, itp.) na podstawie danych ELR.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| ExportFilter | CbsiDeltaFlex..LastFilter (21) | Format raportu eksportowego |
| ExportOs | Linux, Windows | System docelowy |
| ExportType | Generic, Traffic, Music | Typ raportu |
| StationType | TypeOther, TypeAm, TypeFm | Typ stacji radiowej |

---

### RDMatrix

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdmatrix.h` + `rdmatrix.cpp`
**Odpowiedzialnosc:** Reprezentuje matrycc przelaczania audio (audio router/switcher). Obsluguje 45 roznych typow sprzetu.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Type | LocalGpio..LastType (45) | Typ matrycy/sprzetu |
| PortType | TtyPort, TcpPort, NoPort | Typ portu komunikacji |
| Endpoint | Input, Output | Wejscie/wyjscie matrycy |

---

### RDDownload

**Typ Qt:** QObject (RDTransfer subclass)
**Plik:** `rddownload.h` + `rddownload.cpp`
**Odpowiedzialnosc:** Pobiera pliki z URL (HTTP/HTTPS/FTP/SFTP) na dysk.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| progressChanged(int) | step | Postep pobierania |

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| libcurl | Pobieranie HTTP/FTP/SFTP | HIGH |

---

### RDUpload

**Typ Qt:** QObject (RDTransfer subclass)
**Plik:** `rdupload.h` + `rdupload.cpp`
**Odpowiedzialnosc:** Uploaduje pliki na zdalny serwer (HTTP/HTTPS/FTP/SFTP).

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| libcurl | Upload HTTP/FTP/SFTP | HIGH |

---

### RDRenderer

**Typ Qt:** QObject (Service)
**Plik:** `rdrenderer.h` + `rdrenderer.cpp`
**Odpowiedzialnosc:** Renderuje log (playlist) do pojedynczego pliku audio. Miksuje wiele zrodel z crossfadami, segue, fade in/out.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| progressMessageSent(QString) | msg | Wiadomosc o postepie renderowania |
| lineStarted(int,int) | lineno, totallines | Rozpoczeto renderowanie linii N z M |

---

### RDLiveWire

**Typ Qt:** QObject (Service)
**Plik:** `rdlivewire.h` + `rdlivewire.cpp`
**Odpowiedzialnosc:** Sterownik Axia LiveWire -- komunikuje sie z node'ami LiveWire przez LWRP (LiveWire Routing Protocol) TCP.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| connected(unsigned) | id | Polaczenie z nodem nawiazane |
| sourceChanged(unsigned,RDLiveWireSource*) | id, src | Konfiguracja zrodla zmieniona |
| destinationChanged(unsigned,RDLiveWireDestination*) | id, dst | Konfiguracja destination zmieniona |
| gpiChanged/gpoChanged(unsigned,unsigned,unsigned,bool) | id, slot, line, state | Stan GPIO zmieniony |

---

### RDMacroEvent

**Typ Qt:** QObject (Service)
**Plik:** `rdmacro_event.h` + `rdmacro_event.cpp`
**Odpowiedzialnosc:** Kontener i executor listy makr RML. Laduje makra z carta typu Macro, wykonuje sekwencyjnie z obsluga Sleep.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| started() / started(int) | [line] | Wykonywanie makra/listy rozpoczete |
| finished() / finished(int) | [line] | Wykonywanie makra/listy zakonczone |
| stopped() | brak | Wykonywanie zatrzymane |

---

### RDMacro

**Typ Qt:** Plain C++ (non-Qt, Value Object)
**Plik:** `rdmacro.h` + `rdmacro.cpp`
**Odpowiedzialnosc:** Kontener na pojedyncza komende RML (Rivendell Macro Language). ~60 dwuliterowych komend (PL=Play Log, ST=Stop, PN=Play Next, itp.).

---

### RDNotification

**Typ Qt:** Plain C++ (non-Qt, Value Object)
**Plik:** `rdnotification.h` + `rdnotification.cpp`
**Odpowiedzialnosc:** Wiadomosc powiadomienia miedzy procesami Rivendell. Informuje o zmianach w cartach, logach, feedach, dropboxach.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Type | NullType, CartType, LogType, PypadType, DropboxType, CatchEventType, FeedItemType, FeedType | Typ obiektu |
| Action | NoAction, AddAction, DeleteAction, ModifyAction | Rodzaj zmiany |

---

### RDCdPlayer

**Typ Qt:** QObject (Service)
**Plik:** `rdcdplayer.h` + `rdcdplayer.cpp`
**Odpowiedzialnosc:** Abstrahuje odtwarzacz CD z Linux CDROM device.

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| linux/cdrom.h | Bezposredni dostep do CDROM ioctl | CRITICAL |

---

### RDCdRipper

**Typ Qt:** QObject (Service)
**Plik:** `rdcdripper.h` + `rdcdripper.cpp`
**Odpowiedzialnosc:** Rippuje tracki z CD do plikow WAV. Korzysta z cdparanoia.

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| cdparanoia | Ripping CD | HIGH |

---

### RDDiscLookup / RDCddbLookup / RDMbLookup / RDDummyLookup

**Typ Qt:** RDDialog (Dialog -- base + 3 subclasses)
**Plik:** `rddisclookup.h`, `rdcddblookup.h`, `rdmblookup.h`, `rddummylookup.h`
**Odpowiedzialnosc:** Lookup metadanych plyt CD: CDDB, MusicBrainz, lub dummy (brak sieci).

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| lookupDone(Result,QString) | result, err_msg | Lookup zakonczony (match/no match/error) |

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| libdiscid | Obliczanie disc ID | MEDIUM |
| libmusicbrainz | MusicBrainz lookup | MEDIUM |

---

### RDTimeEngine

**Typ Qt:** QObject (Service)
**Plik:** `rdtimeengine.h` + `rdtimeengine.cpp`
**Odpowiedzialnosc:** Silnik zdarzen czasowych -- emituje timeout(id) w zaplanowanych momentach.

---

### RDAirPlayConf

**Typ Qt:** Plain C++ (non-Qt, Active Record pattern)
**Plik:** `rdairplay_conf.h` + `rdairplay_conf.cpp`
**Odpowiedzialnosc:** Konfiguracja RDAirPlay -- mapowanie kanalow audio, tryby pracy, segue/transition, GPIO, panele.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| OpMode | Previous, LiveAssist, Auto, Manual | Tryb pracy logu |
| ActionMode | Normal..Audition (9) | Tryb akcji panel |
| Channel | MainLog1Channel..LastChannel (10) | Kanaly audio w AirPlay |
| PanelType | StationPanel, UserPanel | Typ panelu dzwiekowego |
| StartMode | StartEmpty, StartPrevious, StartSpecified | Tryb startu logu |

---

### RDSqlQuery

**Typ Qt:** QSqlQuery (subclass)
**Plik:** `rddb.h` + `rddb.cpp`
**Odpowiedzialnosc:** Rozszerzony QSqlQuery z automatycznym raportowaniem bledow i reconnect do bazy.

---

### RDSettings

**Typ Qt:** Plain C++ (non-Qt, Value Object)
**Plik:** `rdsettings.h` + `rdsettings.cpp`
**Odpowiedzialnosc:** Ustawienia formatu audio -- format, kanaly, sample rate, bitrate, quality, normalizacja, autotrim.

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Format | Pcm16, MpegL1, MpegL2, MpegL3, Flac, OggVorbis, MpegL2Wav, Pcm24 | Format kodowania audio |

---

### RDWaveData

**Typ Qt:** Plain C++ (non-Qt, Value Object)
**Plik:** `rdwavedata.h` + `rdwavedata.cpp`
**Odpowiedzialnosc:** Kontener metadanych audio -- tytul, artysta, album, conductor, label, client, agency, ISRC, daty.

---

### Dialogi (RDDialog subclasses)

| Klasa | Plik | Odpowiedzialnosc |
|-------|------|------------------|
| RDCartDialog | rdcart_dialog.h | Wybor carta z filtrami (grupa, schedcode, tekst) z preview |
| RDCutDialog | rdcut_dialog.h | Wybor cuta z carta |
| RDEditAudio | rdedit_audio.h | Edytor markerow audio (waveform, 11 typow markerow) |
| RDImportAudio | rdimport_audio.h | Dialog importu/eksportu audio |
| RDButtonDialog | rdbutton_dialog.h | Konfiguracja przycisku panelu |
| RDWaveDataDialog | rdwavedata_dialog.h | Edycja metadanych audio |
| RDExportSettingsDialog | rdexport_settings_dialog.h | Ustawienia eksportu audio |
| RDAddCart | rdadd_cart.h | Dodawanie nowego carta |
| RDAddLog | rdadd_log.h | Dodawanie nowego logu |
| RDGetPasswd | rdgetpasswd.h | Podanie hasla |
| RDPasswd | rdpasswd.h | Zmiana hasla |
| RDGetAth | rdget_ath.h | Uwierzytelnianie (user+haslo) |
| RDDateDialog | rddatedialog.h | Wybor daty |
| RDBusyDialog | rdbusydialog.h | Busy indicator |
| RDListLogs | rdlist_logs.h | Wybor logu z listy |
| RDListGroups | rdlist_groups.h | Wybor grupy z listy |
| RDListSvcs | rdlistsvcs.h | Wybor serwisu z listy |
| RDSlotDialog | rdslotdialog.h | Konfiguracja cart slotu |
| RDSchedCodesDialog | rdschedcodes_dialog.h | Edycja kodow schedulera |
| RDCueEditDialog | rdcueeditdialog.h | Edycja cue pointow |
| RDEditPanelName | rdedit_panel_name.h | Edycja nazwy panelu |

### Widgety (QWidget/RDWidget subclasses)

| Klasa | Plik | Odpowiedzialnosc |
|-------|------|------------------|
| RDDialog | rddialog.h | Bazowy dialog + RDFontEngine |
| RDWidget | rdwidget.h | Bazowy widget + RDFontEngine |
| RDFrame | rdframe.h | Bazowy QFrame + RDFontEngine |
| RDPushButton | rdpushbutton.h | Przycisk + RDFontEngine + flash |
| RDTransportButton | rdtransportbutton.h | Przycisk transportu (play/stop/rec) |
| RDPanelButton | rdpanel_button.h | Przycisk panelu + drag&drop |
| RDComboBox | rdcombobox.h | ComboBox Rivendell |
| RDLineEdit | rdlineedit.h | LineEdit Rivendell |
| RDMarkerEdit | rdmarker_edit.h | Edycja markerow czasu |
| RDMarkerBar | rdmarker_bar.h | Pasek markerow |
| RDMarkerButton | rdmarker_button.h | Przycisk markera |
| RDListView | rdlistview.h | ListView (Qt3-compat) z sortowaniem typowanym |
| RDListViewItem | rdlistviewitem.h | ListViewItem (Qt3-compat) |
| RDSlider | rdslider.h | Suwak glosnosci |
| RDPlayMeter | rdplaymeter.h | Miernik playback |
| RDSegMeter | rdsegmeter.h | Segment meter |
| RDStereoMeter | rdstereometer.h | Miernik stereo VU |
| RDBusyBar | rdbusybar.h | Pasek zajetosci |
| RDTimeEdit | rdtimeedit.h | Edycja czasu (hh:mm:ss) |
| RDDatePicker | rddatepicker.h | Kalendarz |
| RDLogFilter | rdlogfilter.h | Filtr logow |
| RDEmptyCart | rdemptycart.h | Placeholder pustego carta |
| RDCardSelector | rdcardselector.h | Selektor karty/portu audio |
| RDGpioSelector | rdgpioselector.h | Selektor GPIO |
| RDListSelector | rdlistselector.h | Dual-list selector |
| RDImagePickerBox | rdimagepickerbox.h | ComboBox z miniaturami |
| RDRssCategoryBox | rdrsscategorybox.h | Selektor kategorii RSS |
| RDCartSlot | rdcartslot.h | Widget cart slotu |
| RDSlotBox | rdslotbox.h | Display cart slotu |
| RDCueEdit | rdcueedit.h | Widget edycji cue |
| RDSimplePlayer | rdsimpleplayer.h | Prosty odtwarzacz (play+stop) |
| RDWavePainter | rdwavepainter.h | Painter waveformu |

### Klasy utility / pomocnicze

| Klasa | Plik | Typ | Odpowiedzialnosc |
|-------|------|-----|------------------|
| RDImagePickerModel | rdimagepickermodel.h | QAbstractListModel | Model obrazow feedow |
| RDSocket | rdsocket.h | QTcpSocket | Socket z connection ID |
| RDUnixServer | rdunixserver.h | QObject | Serwer UNIX domain socket |
| RDUnixSocket | rdunixsocket.h | QTcpSocket | Klient UNIX domain socket |
| RDMulticaster | rdmulticaster.h | QObject | Multicast UDP |
| RDDataPacer | rddatapacer.h | QObject | Pacer wysylki danych |
| RDDbHeartbeat | rddbheartbeat.h | QObject | Heartbeat DB |
| RDLogLock | rdloglock.h | QObject | Blokada edycji logu |
| RDProcess | rdprocess.h | QObject | Zarzadzanie procesami |
| RDEventPlayer | rdevent_player.h | QObject | Dzwieki zdarzen UI |
| RDOneShot | rdoneshot.h | QObject | Jednorazowy timer z ID |
| RDCodeTrap | rdcodetrap.h | QObject | Wykrywanie sekwencji znakow |
| RDGpio | rdgpio.h | QObject | Sterownik GPIO (Linux) |
| RDKernelGpio | rdkernelgpio.h | QObject | Sterownik GPIO (kernel sysfs) |
| RDTextValidator | rdtextvalidator.h | QValidator | Walidator tekstu |
| RDIdValidator | rdidvalidator.h | QValidator | Walidator ID |
| RDTrimAudio | rdtrimaudio.h | QObject | Przycinanie audio |
| RDRehash | rdrehash.h | QObject | Rehash plikow audio |
| RDPeaksExport | rdpeaksexport.h | QObject | Eksport danych peaks |
| RDAudioInfo | rdaudioinfo.h | QObject | Informacje o pliku audio |
| RDAudioStore | rdaudiostore.h | QObject | Zarzadzanie storage audio |
| RDDelete | rddelete.h | RDTransfer | Usuwanie zasobow (async) |
| RDTransfer | rdtransfer.h | QObject | Bazowa klasa transferow |
| RDCartDrag | rdcartdrag.h | Q3StoredDrag | Drag-and-drop cartow |

### Plain C++ (non-Qt) klasy

| Klasa | Plik | Odpowiedzialnosc |
|-------|------|------------------|
| RDDeck | rddeck.h | Konfiguracja decku nagrywania |
| RDEventLine | rdevent_line.h | Linia zdarzenia w zegarze |
| RDPodcast | rdpodcast.h | Epizod podcastu |
| RDDropBox | rddropbox.h | Konfiguracja auto-importu |
| RDSystem | rdsystem.h | Konfiguracja systemowa |
| RDSchedCode | rdschedcode.h | Kod schedulera |
| RDReplicator | rdreplicator.h | Konfiguracja replikatora |
| RDInstanceLock | rdinstancelock.h | Blokada instancji procesu |
| RDCmdSwitch | rdcmd_switch.h | Parsowanie argumentow CLI |
| RDProfile | rdprofile.h | Parsowanie plikow INI |
| RDTempDirectory | rdtempdirectory.h | Katalog tymczasowy (RAII) |
| RDHash | rdhash.h | Hashowanie SHA1 |
| RDSendMail | rdsendmail.h | Wysylanie e-maili |
| RDFontEngine | rdfontengine.h | Silnik fontow Rivendell |
| RDDiscRecord | rddiscrecord.h | Rekord metadanych CD |
| RDFormPost | rdformpost.h | Parsowanie multipart POST |
| RDRingBuffer | rdringbuffer.h | Bufor cykliczny audio |
| RDGainEnvelope | rdgain_envelope.h | Obwiednia glosnosci |
| RDFLACDecode | rdflacdecode.h | Dekoder FLAC |
| RDSlotOptions | rdslotoptions.h | Opcje cart slotu |
| RDButtonPanel | rdbutton_panel.h | Kontener przyciskow panelu |
| RDStringList | rdstringlist.h | Rozszerzony QStringList |
| RDUrl | rdurl.h | Helper URL (Q3Url) |
| RDTimeEvent | rdtimeevent.h | Zdarzenie czasowe |
| RDLiveWireSource | rdlivewiresource.h | Zrodlo LiveWire |
| RDLiveWireDestination | rdlivewiredestination.h | Destination LiveWire |
| RDMarkerButton | rdmarker_button.h | Przycisk markera |
| RDTTYDevice | rdttydevice.h | Urzadzenie seryjne TTY |
| RDRssSchemas | rdrssschemas.h | Schematy RSS |

### Pliki only-header (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| rd.h | Stale systemowe: RD_MAX_CARDS=8, RD_MAX_PORTS=8, RD_MAX_STREAMS=64, sciezki, MySQL defaults |
| gpio.h | Struktury danych GPIO |
| dbversion.h | Wersja schematu bazy danych |
| rdpaths.h.in | Template sciezek systemowych |
| rdxport_interface.h | Interfejs web API |

### Pliki only-cpp (exportery raportow)

13 plikow export_*.cpp -- implementacje metod RDReport dla roznych formatow raportow:
export_bmiemr.cpp, export_cutlog.cpp, export_deltaflex.cpp, export_musicclassical.cpp, export_musicplayout.cpp, export_musicsummary.cpp, export_nprsoundex.cpp, export_radiotraffic.cpp, export_resultsrecon.cpp, export_soundex.cpp, export_spincount.cpp, export_technical.cpp, export_textlog.cpp

---

## Missing Coverage

| Klasa | Plik | Powod braku |
|-------|------|-------------|

---

## Conflicts

| ID | Klasa | Opis konfliktu | Status |
|----|-------|----------------|--------|
