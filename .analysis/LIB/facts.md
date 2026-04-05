---
phase: 5
artifact: LIB
artifact_name: librd
status: done
completed_at: 2026-04-05
sources_used: [code]
facts_total: 65
conflicts_found: 0
agent_version: 1.1.0
---

# Facts: librd

## Zrodla analizy

| Zrodlo | Uzyte | Jakosc |
|--------|-------|--------|
| Kod zrodlowy | tak | wysoka (101k LOC) |
| Testy QTest | nie | brak testow w librd |
| Dokumentacja PDF | nie | brak PDF w projekcie |

---

## Use Cases (aktor -> akcja -> efekt)

| ID | Aktor | Akcja | Efekt | Zrodlo |
|----|-------|-------|-------|--------|
| UC-001 | Operator | Odtwarza element logu | Audio gra przez kanal CAE, pozycja sie aktualizuje | rdlogplay.cpp |
| UC-002 | Operator | Zatrzymuje odtwarzanie | Audio sie zatrzymuje, kanal jest zwalniany | rdlogplay.cpp |
| UC-003 | Operator | Klika przycisk panelu dzwiekowego | Cart jest odtwarzany natychmiast | rdsound_panel.cpp |
| UC-004 | Operator | Wybiera carta z dialogu | Dialog zwraca numer carta do wywolujacego | rdcart_dialog.cpp |
| UC-005 | Operator | Importuje plik audio | Plik jest konwertowany i zapisany jako cut | rdimport_audio.cpp, rdaudioimport.cpp |
| UC-006 | Operator | Eksportuje audio z cuta | Plik audio jest zapisany na dysku | rdaudioexport.cpp |
| UC-007 | Operator | Edytuje markery audio | Markery (start/end/segue/fade/hook/talk) sa zapisane | rdedit_audio.cpp |
| UC-008 | System | Generuje log z siatki programu | Log jest tworzony na podstawie zegarow i eventow | rdsvc.cpp, rdclock.cpp |
| UC-009 | System | Importuje dane music/traffic | Dane z zewnetrznych systemow sa wstawiane do logu | rdsvc.cpp |
| UC-010 | System | Wybiera cut do odtworzenia (rotation) | Nastepny cut jest wybrany wg kolejnosci/losowo z uwzglednieniem waznosci | rdcart.cpp |
| UC-011 | System | Publikuje epizod podcastu | Audio jest uploadowane, RSS XML zaktualizowany | rdfeed.cpp |
| UC-012 | System | Renderuje log do pliku audio | Caly log jest zmixowany do jednego pliku | rdrenderer.cpp |
| UC-013 | Admin | Tworzy nowego carta | Cart jest tworzony w bazie danych | rdcart.cpp, rdadd_cart.cpp |
| UC-014 | Admin | Zmienia haslo uzytkownika | Haslo jest zaktualizowane (lokalne lub PAM) | rduser.cpp, rdpasswd.cpp |
| UC-015 | System | Wysyla powiadomienie broadcast | Wszystkie aplikacje Rivendell otrzymuja notification | rdripc.cpp, rdnotification.cpp |

---

## Reguly biznesowe (Gherkin)

```gherkin
# --- REGULY WAZNOSCI CUTA (CUT VALIDITY) ---

Rule: Cut jest wazny tylko w okreslonych warunkach

  Scenario: Cut evergreen jest zawsze wazny
    Given cut ma flage EVERGREEN=Y
    When  sprawdzana jest waznosc
    Then  cut jest wazny niezaleznie od daty i godziny

  Scenario: Cut jest wazny w dozwolonym dniu tygodnia
    Given cut ma dozwolone dni (MON..SUN)
    When  sprawdzana jest waznosc w dany dzien
    Then  cut jest wazny tylko jesli ten dzien tygodnia jest dozwolony

  Scenario: Cut jest wazny w zakresie dat
    Given cut ma START_DATETIME i END_DATETIME
    When  sprawdzana jest waznosc
    Then  cut jest wazny tylko jesli biezacy datetime jest miedzy START i END

  Scenario: Cut jest wazny w zakresie godzin (dayparting)
    Given cut ma START_DAYPART i END_DAYPART (czasy dnia)
    When  sprawdzana jest waznosc
    Then  cut jest wazny tylko jesli biezacy czas jest miedzy START i END daypart

  # Zrodlo: rdcut.cpp:102-153 | Pewnosc: potwierdzone

# --- REGULY ROTATION CARTOW ---

Rule: Wybor cuta z carta odbywa sie wg algorytmu rotation

  Scenario: Sekwencyjna rotation (PlayOrder=Sequence)
    Given cart ma PlayOrder=Sequence
    When  wybrany jest nastepny cut
    Then  wybierany jest cut o numerze wiekszym niz ostatnio odtworzony
    And   jesli ostatni cut, wracamy do pierwszego (cyklicznie)

  Scenario: Losowa rotation (PlayOrder=Random)
    Given cart ma PlayOrder=Random
    When  wybrany jest nastepny cut
    Then  losowy cut jest wybrany z uwzglednieniem wag (WEIGHT)
    And   cuty z waga 0 sa pomijane

  Scenario: Rotation pomija niewazne cuty
    Given cut nie jest wazny (dayparting/daty/dzien tygodnia)
    When  wybierany jest cut
    Then  niewazny cut jest pomijany w rotation

  # Zrodlo: rdcart.cpp:80-170 (selectCut) | Pewnosc: potwierdzone

# --- REGULY TIMESCALING ---

Rule: Timescaling jest ograniczone do zakresu 83.3%-125%

  Scenario: Cut miesci sie w zakresie timescale
    Given enforceLength=true i forcedLength jest ustawiony
    And   cut.length * RD_TIMESCALE_MIN <= forcedLength <= cut.length * RD_TIMESCALE_MAX
    When  cut jest odtwarzany
    Then  predkosc jest dostosowana do wymuszonej dlugosci

  Scenario: Cut nie miesci sie w zakresie timescale
    Given enforceLength=true
    And   forcedLength poza zakresem 83.3%-125% dlugosci cuta
    When  walidacja dlugosci
    Then  walidacja zwraca false — cut nie moze byc timescalowany

  # Zrodlo: rdcart.cpp:1015-1031, rd.h:342-343 | Pewnosc: potwierdzone

# --- REGULY UWIERZYTELNIANIA ---

Rule: Uwierzytelnianie uzywa dwoch metod

  Scenario: Uwierzytelnianie lokalne
    Given uzytkownik ma localAuthentication=true
    When  sprawdzane jest haslo
    Then  haslo jest porownywane z polem PASSWORD w tabeli USERS
    And   jesli webuser=true, wymagane jest tez ENABLE_WEB=Y

  Scenario: Uwierzytelnianie PAM
    Given uzytkownik ma localAuthentication=false
    When  sprawdzane jest haslo
    Then  haslo jest weryfikowane przez PAM service (pamService())

  # Zrodlo: rduser.cpp:64-94 | Pewnosc: potwierdzone

# --- REGULY LOGU (PLAYLIST) ---

Rule: Log obsługuje automatyczne przejscia miedzy elementami

  Scenario: Przejscie Segue
    Given aktualny element ma segue start/end point
    And   transType nastepnego = Segue
    When  odtwarzanie dojdzie do segue start point
    Then  automatycznie uruchamiany jest nastepny element
    And   oba elementy graja jednoczesnie do segue end point

  Scenario: Przejscie Play
    Given transType nastepnego = Play
    When  aktualny element sie konczy
    Then  nastepny element startuje natychmiast

  Scenario: Przejscie Stop
    Given transType nastepnego = Stop
    When  aktualny element sie konczy
    Then  odtwarzanie sie zatrzymuje (manual restart)

  # Zrodlo: rdlogplay.cpp (StartEvent, segueStartData) | Pewnosc: potwierdzone

Rule: Hard time events uruchamiaja sie o dokladnej godzinie

  Scenario: Element z timeType=Hard
    Given element logu ma timeType=Hard i startTime=14:00:00
    When  zegar systemowy osiagnie 14:00:00
    Then  element jest uruchamiany automatycznie (grace timer)
    And   aktualnie grany element jest przerwany lub segue'd

  # Zrodlo: rdlogplay.cpp (graceTimerData) | Pewnosc: potwierdzone

# --- REGULY GRUP CARTOW ---

Rule: Grupa definiuje zakres numerow cartow

  Scenario: Tworzenie carta w grupie
    Given grupa ma defaultLowCart=100000 i defaultHighCart=199999
    And   enforceCartRange=true
    When  tworzony jest nowy cart
    Then  numer carta musi byc w zakresie [100000, 199999]

  Scenario: Automatyczne przydzielanie numeru
    Given grupa ma wolne numery
    When  wymagany jest nowy numer
    Then  nextFreeCart() zwraca najnizszy wolny numer w zakresie

  # Zrodlo: rdgroup.cpp | Pewnosc: potwierdzone

# --- REGULY PODCAST/RSS ---

Rule: Feed moze byc superfeed (agregujacy subfeed'y)

  Scenario: Superfeed agreguje epizody
    Given feed jest oznaczony jako superfeed
    When  generowane jest RSS XML
    Then  XML zawiera epizody z wszystkich subfeedow

  Scenario: Publikacja epizodu
    Given epizod ma audio i metadane
    When  postPodcast() jest wywolany
    Then  audio jest uploadowane na serwer
    And   RSS XML jest regenerowany i uploadowany

  # Zrodlo: rdfeed.cpp | Pewnosc: potwierdzone

# --- REGULY NAGRYWANIA (RDCATCH) ---

Rule: Zaplanowane nagranie moze byc wyzwalane czasem lub GPIO

  Scenario: Start czasowy
    Given recording ma startType=HardStart i startTime=08:00
    When  zegar osiagnie 08:00
    Then  nagrywanie startuje

  Scenario: Start GPI
    Given recording ma startType=GpiStart i startGpi ustawione
    When  sygnal GPI jest aktywny
    Then  nagrywanie startuje

  Scenario: Koniec dlugoscia
    Given recording ma endType=LengthEnd i length=3600000 (1h)
    When  minelo 1h od startu
    Then  nagrywanie sie konczy

  # Zrodlo: rdrecording.h (enum types) | Pewnosc: potwierdzone

# --- REGULY KONWERSJI AUDIO ---

Rule: Konwersja audio odbywa sie w 3 etapach

  Scenario: Pipeline konwersji
    Given plik zrodlowy w formacie X i docelowy format Y
    When  convert() jest wywolany
    Then  Stage1: dekodowanie do RAW PCM
    And   Stage2: resampling + timescaling (jesli potrzebne)
    And   Stage3: enkodowanie do formatu docelowego

  # Zrodlo: rdaudioconvert.cpp | Pewnosc: potwierdzone

# --- REGULY POWIADOMIEN ---

Rule: Powiadomienia sa broadcast do wszystkich klientow RIPC

  Scenario: Modyfikacja carta
    Given uzytkownik modyfikuje carta w rdlibrary
    When  zmiany sa zapisane
    Then  RDNotification(CartType, ModifyAction, cartId) jest wyslany
    And   wszystkie aplikacje (rdairplay, rdpanel, etc.) otrzymuja notification
    And   kazda aplikacja odswierza swoje widoki

  # Zrodlo: rdripc.cpp, rdnotification.h | Pewnosc: potwierdzone

# --- REGULY RML (RIVENDELL MACRO LANGUAGE) ---

Rule: Komendy RML sa dwuliterowe z argumentami

  Scenario: Komenda odtwarzania
    Given komenda PL (Play) z argumentami (log_machine, line, trans)
    When  komenda dociera przez ripcd
    Then  wskazana linia logu jest odtwarzana

  Scenario: Komenda zatrzymania
    Given komenda ST (Stop) z argumentami (log_machine, line)
    When  komenda dociera przez ripcd
    Then  odtwarzanie jest zatrzymywane

  # Zrodlo: rdmacro.h (Command enum, ~60 komend) | Pewnosc: potwierdzone
```

---

## Stany encji

### RDPlayDeck -- stany odtwarzania

| Przejscie | Trigger | Warunek | Efekt uboczny |
|-----------|---------|---------|--------------|
| Idle -> Playing | play() | handle zaladowany | emit stateChanged(Playing) |
| Playing -> Paused | pause() | trwa odtwarzanie | emit stateChanged(Paused) |
| Paused -> Playing | play() | jest spauznowany | emit stateChanged(Playing) |
| Playing -> Stopping | stop() | trwa odtwarzanie | czekanie na caed confirmation |
| Stopping -> Stopped | playStoppedData() | caed potwierdza | emit stateChanged(Stopped) |
| Stopped -> Idle | clear()/reset() | zakonczono | zwolnienie zasobow |

### RDLogLine -- stany linii logu

| Przejscie | Trigger | Warunek | Efekt uboczny |
|-----------|---------|---------|--------------|
| Ready -> Playing | play() | cut istnieje i jest wazny | odtwarzanie audio |
| Playing -> Paused | pause() | trwa odtwarzanie | audio wstrzymane |
| Playing -> Finished | koniec cuta / segue end | naturalny koniec | zwolnienie decka |
| Playing -> Stopped | stop() | wymuszony stop | zwolnienie decka |
| * -> Transitioning | segue start | nadchodzi segue | overlap z nastepnym |

### RDCut -- stany waznosci

| Stan | Warunek |
|------|---------|
| NeverValid | cut nie ma pliku audio |
| ConditionallyValid | cut ma daty/godziny waznosci, aktualnie poza zakresem |
| AlwaysValid | cut jest w zakresie dat/godzin LUB nie ma ograniczen |
| EvergreenValid | cut ma flage EVERGREEN=Y |

### RDCart -- stany waznosci

| Stan | Warunek |
|------|---------|
| NeverValid | zadne cuty nie sa wazne |
| ConditionallyValid | przynajmniej jeden cut jest conditionally valid |
| AlwaysValid | przynajmniej jeden cut jest always valid |
| EvergreenValid | przynajmniej jeden cut jest evergreen |

### RDPodcast -- stany

| Stan | Warunek |
|------|---------|
| StatusPending | epizod oczekuje na publikacje |
| StatusActive | epizod jest opublikowany |
| StatusExpired | epizod wygasl (shelf life) |

---

## Ograniczenia i limity

| Ograniczenie | Wartosc | Dotyczy | Zrodlo |
|-------------|---------|---------|--------|
| Max numer carta | 999999 | RDCart | rd.h:180 |
| Max numer cuta | 999 | RDCut | rd.h:185 |
| Max dlugos hasla | 32 znaki | RDUser | rd.h:76 |
| Max kart audio | 24 | RDStation | rd.h:129 |
| Max strumieni per karta | 48 | RDCae | rd.h:134 |
| Max portow per karta | 24 | RDStation | rd.h:139 |
| Max timerow makr | 16 | RDMacroEvent | rd.h:164 |
| Timescale min | 0.833 (83.3%) | RDAudioConvert | rd.h:342 |
| Timescale max | 1.250 (125%) | RDAudioConvert | rd.h:343 |
| Domyslna czestotliwosc probkowania | 48000 Hz | RDSystem | rd.h:370 |
| Domyslna liczba kanalow | 2 (stereo) | RDSystem | rd.h:375 |
| Max dlugos POST | 10000000 bytes (~10MB) | RDFormPost | rd.h:262 |
| Max argumentow RML | 100 | RDMacro | rd.h:285 |
| Max dlugos RML | 2048 bytes | RDMacro | rd.h:286 |
| Max offset czasu | 10000 ms | RDTimeEngine | rd.h:291 |
| Max dlugos linii importu | 1024 | RDSvc | rd.h:311 |
| Fade depth | -3000 cdB (-30 dB) | RDLogPlay | rd.h:317 |
| Mute depth | -10000 cdB (-100 dB) | System | rd.h:322 |
| Limit wyszukiwania cartow | 100 wynikow | RDCartDialog | rd.h:491 |
| Curl timeout | 1200 s (20 min) | RDDownload/RDUpload | rd.h:496 |
| Log lock timeout | 30000 ms (30 s) | RDLogLock | rd.h:578 |
| Meter update interval | 20 ms | RDCae | rd.h:301 |
| Maint min interval | 900000 ms (15 min) | System | rd.h:443 |
| Maint max interval | 3600000 ms (60 min) | System | rd.h:444 |
| LiveWire GPIO bundle size | 5 | RDLiveWire | rd.h:480 |
| GPIO event days | 30 | System | rd.h:626 |
| Service timeout default | 30 s | RDConfig | rd.h:616 |
| Audition preroll | 5000 ms (5 s) | RDEditAudio | rd.h:428 |
| Button flash period | 200 ms | UI | rd.h:427 |
| PAD client TCP port | 34289 | RDLogPlay | rd.h:610 |
| Notification multicast addr | 239.192.255.72 | RDNotification | rd.h:583 |
| Notification port | 20539 | RDNotification | rd.h:588 |
| RML echo port | 5858 | RDMacro | rd.h:282 |
| RML no-echo port | 5859 | RDMacro | rd.h:283 |
| RML reply port | 5860 | RDMacro | rd.h:284 |

---

## Konfiguracja

Konfiguracja odczytywana z pliku `/etc/rd.conf` przez RDConfig:

| Sekcja/Klucz | Typ | Domyslna | Znaczenie |
|------|-----|---------|-----------|
| [mySQL] Hostname | string | localhost | Host bazy danych |
| [mySQL] Loginname | string | rduser | Uzytkownik DB |
| [mySQL] Database | string | Rivendell | Nazwa bazy |
| [mySQL] Password | string | letmein | Haslo DB |
| [Identity] AudioOwner | string | rivendell | Wlasciciel plikow audio |
| [Identity] AudioGroup | string | rivendell | Grupa plikow audio |
| [Identity] Password | string | (puste) | Haslo stacji |
| [Cae] AudioRoot | string | /var/snd | Katalog plikow audio |
| [Cae] AudioExtension | string | wav | Rozszerzenie plikow |
| [Fonts] Family | string | (systemowy) | Rodzina fontow |
| [Fonts] ButtonSize | int | (domyslny) | Rozmiar fontu przyciskow |
| [Tuning] MeterBasePort | int | 30000 | Bazowy port UDP metrow |
| [Tuning] MeterPortRange | int | 100 | Zakres portow metrow |

---

## Linux-specific komponenty

| Komponent | Gdzie uzywany | Funkcja | Priorytet |
|-----------|--------------|---------|-----------|
| MySQL/MariaDB | RDSqlQuery, RDDb (caly system) | Glowna baza danych | CRITICAL |
| JACK | RDStation (konfiguracja), caed | Audio engine | CRITICAL |
| ALSA | RDConfig (parametry), caed | Audio engine | CRITICAL |
| HPI (AudioScience) | RDStation (konfiguracja) | Karty audio broadcast | CRITICAL |
| libsndfile | RDAudioConvert (Stage1/Stage3) | Dekodowanie/enkodowanie WAV/AIFF | HIGH |
| libmad | RDAudioConvert (Stage1Mpeg) | Dekodowanie MPEG | HIGH |
| LAME | RDAudioConvert (Stage3Layer3) | Enkodowanie MP3 | HIGH |
| TwoLAME | RDAudioConvert (Stage3Layer2) | Enkodowanie MPEG Layer 2 | HIGH |
| libvorbis | RDAudioConvert (Stage1/Stage3Vorbis) | Dekodowanie/enkodowanie Ogg | HIGH |
| FLAC | RDAudioConvert, RDFLACDecode | Dekodowanie/enkodowanie FLAC | HIGH |
| libsamplerate | RDAudioConvert (Stage2) | Resampling audio | HIGH |
| SoundTouch | RDAudioConvert (Stage2) | Timescaling audio | HIGH |
| cdparanoia | RDCdRipper | Ripping CD | HIGH |
| libcurl | RDDownload, RDUpload, RDFeed | Transfer plikow HTTP/FTP/SFTP | MEDIUM |
| libmusicbrainz | RDMbLookup | Wyszukiwanie informacji o CD | MEDIUM |
| PAM | RDUser (rdpam.cpp) | Uwierzytelnianie | MEDIUM |
| OpenSSL (libcrypto) | RDHash | Hashowanie SHA1 | LOW |
| syslog | RDApplication::syslog() | Logowanie systemowe | LOW |
| /dev/cdrom | RDCdPlayer | Odtwarzanie CD | HIGH |
| /sys/class/gpio | RDKernelGpio | GPIO kernel | HIGH |
| /etc/rd.conf | RDConfig | Konfiguracja glowna | MEDIUM |
| /var/snd | RDConfig (audioRoot) | Storage plikow audio | MEDIUM |
| /var/run | rd.h (PID_DIR) | Pliki PID | LOW |
| /var/lock | rd.h (LOCKFILE_DIR) | Pliki blokad | LOW |

---

## Konflikty miedzy zrodlami

Brak PDF i testow — analiza oparta wylacznie na kodzie zrodlowym.
Nie wykryto wewnetrznych sprzecznosci w kodzie.
