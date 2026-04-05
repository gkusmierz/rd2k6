---
phase: 2
artifact: RPC
artifact_name: ripcd (Rivendell Interprocess Communication Daemon)
status: done
completed_at: 2026-04-05
partial_count: 46
conflicts_found: 0
missing_coverage: 0
agent_version: 1.1.0
---

# Inventory: ripcd (RPC Service Daemon)

## Statystyki

| Typ | Liczba |
|-----|--------|
| Klasy lacznie | 46 |
| QMainWindow subclassy | 0 |
| QDialog subclassy | 0 |
| QWidget subclassy | 0 |
| QObject subclassy (serwisy) | 2 (MainObject, Switcher abstract) |
| QObject subclassy (drivery Switcher) | 41 |
| QAbstractItemModel subclassy | 0 |
| QThread subclassy | 0 |
| Plain C++ (bez Q_OBJECT) | 3 (RipcdConnection, StarGuideFeed, UnityFeed) |

---

## Architektura (podsumowanie)

ripcd to headless daemon (QApplication z false = brak GUI) pelniacy role centralnego
hubu IPC i sterownika urzadzen GPIO/switcher w systemie Rivendell.

**Wzorzec**: Strategy/Driver pattern
- `Switcher` (abstract QObject) definiuje interfejs drivera
- 41 konkretnych driveow implementuje rozne protokoly sprzetowe
- `MainObject` laduje drivery dynamicznie przez LoadSwitchDriver() (factory)
- Komunikacja z klientami przez TCP (QTcpServer + RipcdConnection)
- Obsluga makr RML (Rivendell Macro Language) przez UDP (echo/noecho/reply)
- GPIO state tracking: macierze GPI/GPO z maskami i makrami cart

---

## Klasy -- szczegolowy inwentarz

### MainObject

**Typ Qt:** QObject (Service -- glowny daemon)
**Plik:** `ripcd.h` + `ripcd.cpp` + `loaddrivers.cpp` + `local_macros.cpp` + `local_notifications.cpp`
**Odpowiedzialnosc:** Centralny obiekt daemona ripcd. Zarzadza polaczeniami TCP od klientow Rivendell (rdairplay, rdlibrary itp.), odbiera i wykonuje komendy RML (Rivendell Macro Language) przez UDP, laduje i zarzadza driverami switcher/GPIO, trackuje stan GPI/GPO i broadcasting notyfikacji miedzy klientami.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| Brak | -- | MainObject nie emituje sygnalow; jest glownym konsumentem sygnalow od driverow |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| newConnectionData | -- | private | Akceptuje nowe polaczenie TCP klienta, tworzy RipcdConnection |
| notificationReceivedData | QString msg, QHostAddress addr | private | Odbiera notyfikacje multicast, przekazuje do klientow TCP i RunLocalNotifications |
| sendRml | RDMacro *rml | private | Wysyla komende RML przez UDP do docelowego hosta |
| rmlEchoData | -- | private | Odbiera RML z portu ECHO (z potwierdzeniem) |
| rmlNoechoData | -- | private | Odbiera RML z portu NOECHO (bez potwierdzenia) |
| rmlReplyData | -- | private | Odbiera odpowiedzi RML |
| gpiChangedData | int matrix, int line, bool state | private | Reaguje na zmiane stanu GPI -- loguje, broadcastuje, wykonuje przypisany cart macro |
| gpoChangedData | int matrix, int line, bool state | private | Reaguje na zmiane stanu GPO -- loguje, broadcastuje, wykonuje przypisany cart macro |
| gpiStateData | int matrix, unsigned line, bool state | private | Broadcastuje aktualny stan GPI do wszystkich klientow |
| gpoStateData | int matrix, unsigned line, bool state | private | Broadcastuje aktualny stan GPO do wszystkich klientow |
| ttyTrapData | int cartnum | private | Wykonuje cart macro po dopasowaniu pattern na porcie TTY |
| ttyReadyReadData | int num | private | Czyta dane z portu TTY i przekazuje do code trap scanner |
| macroTimerData | int num | private | Wykonuje opozniony cart macro po wypaleniu timera |
| readyReadData | int conn_id | private | Parsuje dane z polaczenia TCP klienta, dispatches komendy |
| killData | int conn_id | private | Zamyka polaczenie TCP klienta |
| exitTimerData | -- | private | Sprawdza co 200ms czy daemon ma sie zakonczyc (SIGTERM/SIGINT) |
| garbageData | -- | private | Czysci zamkniete polaczenia TCP (garbage collector) |
| startJackData | -- | private | Proby polaczenia z JACK server (opcjonalnie, #ifdef JACK) |

**Stan (Q_PROPERTY):**
| Property | Typ | NOTIFY sygnal |
|----------|-----|--------------|
| Brak | -- | -- |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| MainObject | QObject *parent | Inicjalizuje daemon: TCP server, UDP sockets, timery, GPIO tablice, drivery, TTY, JACK | Raz przy starcie procesu |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak | -- | -- |

**Reguly biznesowe (z implementacji):**
- Klient TCP musi sie uwierzytelnic komenda PW z haslem (rda->config()->password()) zanim moze wykonywac komendy uprzywilejowane
- Komendy RML AG (Air Guard) sa odrzucane jesli on-air flag nie jest aktywna -- zabezpieczenie przed przypadkowym wyemitowaniem na antene
- GPIO change: jesli maska GPI/GPO jest wylaczona (false), zmiana stanu jest broadcastowana ale NIE wykonuje przypisanego cart macro
- GPIO macro: kazdy pin GPI/GPO ma 2 przypisane cart macros -- osobny dla stanu ON i OFF
- GPIO events sa logowane do tabeli SQL GPIO_EVENTS (insert z timestamp)
- GPI/GPO macros sa ladowane z tabel SQL GPIS/GPOS per station
- Matryce switcher/GPIO sa ladowane z tabeli SQL MATRICES per station
- TTY porty sa konfigurowane z tabeli SQL TTYS (baud rate, data bits, parity, termination)
- Notyfikacje typu DropboxType dla aktualnej stacji sa przekazywane jako SIGUSR1 do rdservice
- ForwardConvert() konwertuje stare formaty RML (GE z 3 args, GI z 3-4 args, GO z 4 args) do nowego formatu z 5 args
- Komenda SZ (switcher restart): zamyka stary driver, laduje nowy z LoadSwitchDriver() -- hot reload drivera
- Komenda SY (TTY restart): zamyka port TTY i ponownie otwiera z aktualnej konfiguracji DB
- Komenda RN: wykonuje zewnetrzny skrypt shell jako fork+execl z konfigurowanym UID/GID
- Komenda MB: wyswietla popup (rdpopup) na wskazanym X display z konfigurowanym UID/GID
- Komenda MT: ustawia opozniony timer dla cart macro (1-based index, max RD_MAX_MACRO_TIMERS)
- Komenda LO: login/logout -- weryfikuje uzytkownika i haslo przez RDUser, zmienia aktualnego usera

**Protokol TCP klienta (komendy dispatched przez DispatchCommand):**
| Komenda | Znaczenie |
|---------|-----------|
| DC | Drop Connection (rozlacz) |
| PW pass | Authenticate (haslo) |
| RU | Request User (pobierz aktualnego usera) |
| SU user | Set User |
| MS addr port rml | Send RML command |
| ME addr port rml | Send RML reply |
| RG | Reload GPI table |
| GI matrix | Send complete GPI status |
| GO matrix | Send complete GPO status |
| GM matrix | Send complete GPI mask states |
| GN matrix | Send complete GPO mask states |
| GC matrix | Send complete GPI cart assignments |
| GD matrix | Send complete GPO cart assignments |
| ON msg | Send notification (multicast + broadcast TCP) |
| TA | Query on-air flag state |

**Komendy RML obslugiwane lokalnie (RunLocalMacros):**
| Komenda | Znaczenie |
|---------|-----------|
| BO | Binary Output -- wyslij bajty hex na port TTY |
| GI | GPIO set -- przypisz cart macro do pinu GPI/GPO |
| GE | GPIO enable/disable mask |
| JC | JACK Connect -- polacz porty JACK audio |
| JD | JACK Disconnect -- rozlacz porty JACK audio |
| JZ | JACK Disconnect All -- rozlacz wszystkie polaczenia JACK |
| LO | Login/Logout user |
| MB | Message Box -- wyswietl popup na wskazanym display |
| MT | Macro Timer -- ustaw opozniony cart macro |
| RN | Run -- wykonaj zewnetrzny skrypt shell |
| SI | Set Input trap -- dodaj code trap na port TTY |
| SC | Clear traps -- usun code trapy z portu TTY |
| SO | Send Output -- wyslij tekst na port TTY z terminatorem |
| SY | TTY restart -- zamknij i ponownie otworz port TTY |
| SZ | Switcher restart -- hot reload drivera switcher |
| TA | Set on-air flag |
| UO | UDP Output -- wyslij dane UDP na wskazany adres:port |
| CL/FS/GO/ST/SA/SD/SG/SR/SL/SX | Delegowane do ripcd_switcher[matrix]->processCommand() |

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| JACK (jack/jack.h) | Polaczenia audio ports (#ifdef JACK) | HIGH |
| fork()/execl() | Wykonywanie zewnetrznych skryptow (RN, MB) | MEDIUM |
| POSIX signals (SIGCHLD/SIGTERM/SIGINT/SIGUSR1) | Obsluga sygnalow Unix | MEDIUM |
| syslog | Logowanie systemowe | LOW |
| setuid/setgid/seteuid/setegid | Zmiana uzytkownika przy exec | MEDIUM |
| /bin/sh | Wykonywanie komend shell | MEDIUM |

**Zaleznosci od innych klas tego artifaktu:**
- Switcher: laduje i zarzadza instancjami driverow, laczy sygnaly
- RipcdConnection: obiekt polaczenia TCP klienta
- Wszystkie 41 klas driverow: tworzone dynamicznie w LoadSwitchDriver()

**Zaleznosci od shared libraries:**
- RDApplication: singleton srodowiska (rda), config, station, system
- RDMacro: reprezentacja komendy RML
- RDMatrix: konfiguracja matrycy switcher/GPIO (tabela SQL MATRICES)
- RDStation: konfiguracja stacji (adres, userName, jackServerName)
- RDUser: weryfikacja uzytkownika i hasla
- RDNotification: notyfikacje miedzy procesami (multicast)
- RDMulticaster: transport multicast UDP
- RDTTYDevice: obsluga portow szeregowych
- RDCodeTrap: pattern matching na danych TTY (trap -> cart exec)
- RDSqlQuery: zapytania SQL
- RDConfig: konfiguracja (haslo, stationName, uid/gid)
- RDTty: konfiguracja TTY (termination mode)

---

### Switcher

**Typ Qt:** QObject (abstract base -- interfejs drivera)
**Plik:** `switcher.h` + `switcher.cpp`
**Odpowiedzialnosc:** Abstrakcyjna klasa bazowa definiujaca kontrakt dla wszystkich driverow switcher/GPIO w systemie Rivendell. Kazdy driver sprzetu (router audio, GPIO card, protokol sieciowy) dziedziczy z Switcher i implementuje metode processCommand() do obslugi komend RML.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| rmlEcho | RDMacro *cmd | Driver chce wyslac odpowiedz RML (echo) do nadawcy komendy |
| gpiChanged | int matrix, int line, bool state | Stan wejscia GPIO zmienil sie (hardware -> software) |
| gpoChanged | int matrix, int line, bool state | Stan wyjscia GPIO zmienil sie (hardware -> software) |
| gpiState | int matrix, unsigned line, bool state | Raport biezacego stanu GPI (odpowiedz na zapytanie) |
| gpoState | int matrix, unsigned line, bool state | Raport biezacego stanu GPO (odpowiedz na zapytanie) |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| Brak | -- | -- | -- |

**Stan (Q_PROPERTY):**
| Property | Typ | NOTIFY sygnal |
|----------|-----|--------------|
| Brak | -- | -- |

**Publiczne API (pure virtual + virtual):**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| type | -- | Zwraca typ matrycy (RDMatrix::Type enum) | -- |
| gpiQuantity | -- | Zwraca liczbe pinow GPI tego drivera | -- |
| gpoQuantity | -- | Zwraca liczbe pinow GPO tego drivera | -- |
| primaryTtyActive | -- | Czy driver uzywa pierwszego portu TTY | -- |
| secondaryTtyActive | -- | Czy driver uzywa drugiego portu TTY | -- |
| processCommand | RDMacro *cmd | Przetwarza komende RML specyficzna dla drivera | Wywolywana przez MainObject::RunLocalMacros |
| sendGpi | -- | Wysyla pelen stan GPI (domyslnie no-op) | -- |
| sendGpo | -- | Wysyla pelen stan GPO (domyslnie no-op) | -- |
| stationName | -- | Zwraca nazwe stacji drivera | -- |
| matrixNumber | -- | Zwraca numer matrycy drivera | -- |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak wlasnych | uzywa RDMatrix::Type, RDMatrix::Mode | Typy matryc zdefiniowane w librd |

**Reguly biznesowe (z implementacji):**
- executeMacroCart(): driver moze wykonac cart macro przez emisje sygnalu rmlEcho z komenda EX (Execute)
- insertGpioEntry(): driver dynamicznie tworzy wpisy GPIO w tabeli SQL GPIS/GPOS jesli nie istnieja (auto-provisioning)
- logBytes(): narzedzie diagnostyczne -- loguje bajty hex do syslog

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| syslog | Logowanie diagnostyczne | LOW |

**Zaleznosci od shared libraries:**
- RDMatrix: konfiguracja matrycy (station, matrix number)
- RDMacro: komendy RML
- RDSqlQuery: operacje bazodanowe (insertGpioEntry)
- RDApplication (rda): dostep do syslog

---

### RipcdConnection

**Typ Qt:** plain C++ (bez Q_OBJECT)
**Plik:** `ripcd_connection.h` + `ripcd_connection.cpp`
**Odpowiedzialnosc:** Reprezentuje polaczenie TCP od klienta Rivendell (rdairplay, rdlibrary itp.) do daemona ripcd. Przechowuje socket, stan uwierzytelnienia i bufor akumulujacy dane wejsciowe.

**Sygnaly:**
Brak (klasa nie jest QObject)

**Sloty:**
Brak

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| id | -- | Zwraca identyfikator polaczenia (indeks w tablicy) | -- |
| socket | -- | Zwraca QTcpSocket polaczenia | -- |
| isAuthenticated | -- | Czy klient przeszedl autentykacje (komenda PW) | -- |
| setAuthenticated | bool state | Ustawia stan autentykacji | Po weryfikacji hasla |
| isClosing | -- | Czy polaczenie jest w trakcie zamykania | -- |
| close | -- | Oznacza polaczenie do zamkniecia (garbage collector usunie) | -- |
| accum | -- | Publiczny bufor akumulujacy dane wejsciowe (QString) | Uzywany przez MainObject::readyReadData |

**Reguly biznesowe:**
- Nowe polaczenie zaczyna jako nieuwierzytelnione (ripcd_authenticated=false)
- close() tylko oznacza do zamkniecia, nie zamyka socketa natychmiast (deferred cleanup pattern)

**Zaleznosci od shared libraries:**
- rd.h: stale globalne

---

### globals.h (modul, nie klasa)

**Typ:** Header-only globals
**Plik:** `globals.h`
**Odpowiedzialnosc:** Deklaracje globalne dla daemona ripcd -- extern tablica active_locks per matryca.

**Publiczne API:**
| Symbol | Typ | Znaczenie |
|--------|-----|-----------|
| ripcd_active_locks | QString[MAX_MATRICES] | Tablica blokad aktywnych per matryca |

**Zaleznosci od shared libraries:**
- rd.h: MAX_MATRICES
- rdconfig.h: RDConfig

---

### Switcher Drivers -- Grupa BroadcastTools (serial TTY, polling GPIO)

Wszystkie klasy w tej grupie dziedzicza z Switcher i maja identyczny interfejs publiczny:
- type(), gpiQuantity(), gpoQuantity(), primaryTtyActive(), secondaryTtyActive(), processCommand()

**Wzorzec**: serial RS-232 komunikacja przez RDTTYDevice, polling statusu GPI przez timer, oneshot timery na GPO.

#### Bt10x1

**Plik:** `bt10x1.h` + `bt10x1.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools 10x1 (10 wejsc, 1 wyjscie). Obsluguje komende crosspoint (ST) oraz gain control (SL) przez port szeregowy.
**Komunikacja:** Serial TTY (RDTTYDevice)
**GPIO:** Brak (0 GPI, 0 GPO)
**Sloty:** Brak prywatnych slotow

---

#### Bt16x1

**Plik:** `bt16x1.h` + `bt16x1.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools 16x1 (16 wejsc, 1 wyjscie) z gain control.
**Komunikacja:** Serial TTY
**GPIO:** Brak
**Sloty:** Brak prywatnych slotow

---

#### Bt16x2

**Plik:** `bt16x2.h` + `bt16x2.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools 16x2 (16 wejsc, 2 wyjscia) z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling przez processStatus, oneshot timery)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### Bt8x2

**Plik:** `bt8x2.h` + `bt8x2.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools 8x2 (8 wejsc, 2 wyjscia) z gain control.
**Komunikacja:** Serial TTY
**GPIO:** Brak
**Sloty:** Brak

---

#### BtAcs82

**Plik:** `btacs82.h` + `btacs82.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools ACS 8.2 z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtAdms4422

**Plik:** `btadms4422.h` + `btadms4422.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools ADMS 44.22 z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtGpi16

**Plik:** `btgpi16.h` + `btgpi16.cpp`
**Odpowiedzialnosc:** Driver BroadcastTools GPI-16 -- dedykowany panel GPIO 16 pinow (tylko wejscia).
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI (polling przez processStatus)
**Sloty:** processStatus

---

#### BtSrc16

**Plik:** `btsrc16.h` + `btsrc16.cpp`
**Odpowiedzialnosc:** Driver BroadcastTools SRC-16 (Satellite Receiver Controller) z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtSrc8Iii

**Plik:** `btsrc8iii.h` + `btsrc8iii.cpp`
**Odpowiedzialnosc:** Driver BroadcastTools SRC-8 III z GPIO 8 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 8 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtSs124

**Plik:** `btss124.h` + `btss124.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 12.4 (12 wejsc, 4 wyjscia).
**Komunikacja:** Serial TTY
**GPIO:** Brak
**Sloty:** Brak

---

#### BtSs164

**Plik:** `btss164.h` + `btss164.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 16.4 (16 wejsc, 4 wyjscia) z GPIO 24 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 24 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtSs21

**Plik:** `btss21.h` + `btss21.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 2.1 (2 wejscia, 1 wyjscie).
**Komunikacja:** Serial TTY
**GPIO:** Brak
**Sloty:** Brak

---

#### BtSs41Mlr

**Plik:** `btss41mlr.h` + `btss41mlr.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 4.1 MLR (4 wejscia, 1 wyjscie) z GPIO 16 pinow i monitoring statusu.
**Komunikacja:** Serial TTY (z async readyRead)
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** readyReadData, gpiOneshotData, gpoOneshotData

---

#### BtSs42

**Plik:** `btss42.h` + `btss42.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 4.2 (4 wejscia, 2 wyjscia) z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtSs44

**Plik:** `btss44.h` + `btss44.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 4.4 (4 wejscia, 4 wyjscia) z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

#### BtSs82

**Plik:** `btss82.h` + `btss82.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools SS 8.2 (8 wejsc, 2 wyjscia) z GPIO 16 pinow.
**Komunikacja:** Serial TTY
**GPIO:** Do 16 GPI + GPO (polling, oneshot)
**Sloty:** processStatus, gpiOneshotData, gpoOneshotData

---

### Switcher Drivers -- Grupa BroadcastTools (network TCP)

#### BtSentinel4Web

**Plik:** `btsentinel4web.h` + `btsentinel4web.cpp`
**Odpowiedzialnosc:** Driver AES switchera BroadcastTools Sentinel 4 Web (4 wejscia, 1 wyjscie) sterowanego przez TCP.
**Komunikacja:** TCP (QTcpSocket, reconnect + watchdog)
**GPIO:** Brak
**Sloty:** connectedData, errorData, readyReadData, watchdogData, watchdogResetData

---

#### BtU41MlrWeb

**Plik:** `btu41mlrweb.h` + `btu41mlrweb.cpp`
**Odpowiedzialnosc:** Driver audio switchera BroadcastTools Universal 4.1 MLR>>Web (4 wejscia, 1 wyjscie) z GPIO 5 pinow, sterowanego przez TCP.
**Komunikacja:** TCP (QTcpSocket, keepalive + watchdog)
**GPIO:** 5 GPI, 0 GPO
**Sloty:** connectedData, readyReadData, errorData, keepaliveData, watchdogData

---

### Switcher Drivers -- Grupa SAS (Sierra Automated Systems)

#### Sas16000

**Plik:** `sas16000.h` + `sas16000.cpp`
**Odpowiedzialnosc:** Driver audio switchera SAS 16000(D) -- duza matryca audio broadcast.
**Komunikacja:** Serial TTY (RDTTYDevice)
**GPIO:** Konfigurowane z DB (sas_gpis, sas_gpos)
**Sloty:** Brak

---

#### Sas32000

**Plik:** `sas32000.h` + `sas32000.cpp`
**Odpowiedzialnosc:** Driver audio switchera SAS 32000 z command queue i opoznieniem (10ms command delay).
**Komunikacja:** Serial TTY
**GPIO:** Brak
**Sloty:** runQueue (timer-driven command queue)

---

#### Sas64000

**Plik:** `sas64000.h` + `sas64000.cpp`
**Odpowiedzialnosc:** Driver audio switchera SAS 64000.
**Komunikacja:** Serial TTY
**GPIO:** Brak
**Sloty:** Brak

---

#### Sas64000Gpi

**Plik:** `sas64000gpi.h` + `sas64000gpi.cpp`
**Odpowiedzialnosc:** Driver SAS 64000 polaczony przez interfejs GPI-1600 -- obsluga GPIO.
**Komunikacja:** Serial TTY
**GPIO:** Konfigurowane z DB (sas_gpis, sas_gpos, oneshot GPO)
**Sloty:** gpoOneshotData

---

#### SasUsi

**Plik:** `sasusi.h` + `sasusi.cpp`
**Odpowiedzialnosc:** Driver SAS audio routerow przez protokol USI (Universal Serial Interface). Obsluguje TCP lub serial z reconnect logic, GPIO, cart macros start/stop.
**Komunikacja:** TCP (QTcpSocket) lub Serial (RDTTYDevice), konfigurowane per port
**GPIO:** Konfigurowane z DB (sas_gpis, sas_gpos)
**Sloty:** ipConnect, connectedData, connectionClosedData, readyReadData, errorData

---

### Switcher Drivers -- Grupa Livewire (AoIP)

#### LiveWireLwrpAudio

**Plik:** `livewire_lwrpaudio.h` + `livewire_lwrpaudio.cpp`
**Odpowiedzialnosc:** Driver audio routingu Livewire przez protokol LWRP (Livewire Routing Protocol). Zarzadza wiele wezlow Livewire, monitoruje zmiany zrodel i destynacji audio.
**Komunikacja:** TCP (przez RDLiveWire helper z librd)
**GPIO:** Brak (tylko audio routing)
**Sloty:** nodeConnectedData, sourceChangedData, destinationChangedData, watchdogStateChangedData

---

#### LiveWireLwrpGpio

**Plik:** `livewire_lwrpgpio.h` + `livewire_lwrpgpio.cpp`
**Odpowiedzialnosc:** Driver GPIO Livewire przez protokol LWRP. Obsluguje GPI/GPO przez polaczenie TCP do wezla Livewire.
**Komunikacja:** TCP (przez RDLiveWire)
**GPIO:** Konfigurowane (gpio_gpi_limit, gpio_gpo_limit), moze byc "virtual"
**Sloty:** gpiChangedData, gpoChangedData, connectedData, watchdogStateChangedData

---

#### LiveWireMcastGpio

**Plik:** `livewire_mcastgpio.h` + `livewire_mcastgpio.cpp`
**Odpowiedzialnosc:** Driver GPIO Livewire przez multicast UDP. Bezposrednia komunikacja multicastowa z wezlami Livewire (subscribe/unsubscribe) bez posrednictwa LWRP.
**Komunikacja:** Multicast UDP (raw sockets, subscribe/unsubscribe na adresach multicast)
**GPIO:** Konfigurowane (livewire_gpios), mapowanie source_numbers -> surface_addresses
**Sloty:** gpioActivatedData (socket notifier), gpiTimeoutData, gpoInTimeoutData, gpoOutTimeoutData
**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Raw sockets (sys/socket.h) | Multicast UDP GPIO communication | HIGH |

---

### Switcher Drivers -- Grupa Protocol-specific (TCP)

#### Gvc7000

**Plik:** `gvc7000.h` + `gvc7000.cpp`
**Odpowiedzialnosc:** Driver routera audio Grass Valley serii 7000. Komunikacja TCP z keepalive i auto-reconnect.
**Komunikacja:** TCP (QTcpSocket + RDDataPacer do throttlingu komend)
**GPIO:** Brak
**Sloty:** ipConnect, keepaliveData, connectedData, disconnectedData, errorData, sendCommandData

---

#### Harlond

**Plik:** `harlond.h` + `harlond.cpp`
**Odpowiedzialnosc:** Driver wirtualnego miksera Harlond (AudioScience HPI) z pelna obsluga crosspoint, salvo, GPO z reset timerami.
**Komunikacja:** TCP (QTcpSocket + watchdog + auto-reconnect)
**GPIO:** GPO z timerami resetu (reset_timers per linia)
**Sloty:** resetTimeoutData, socketConnectedData, socketDisconnectedData, socketReadyReadData, socketErrorData, watchdogTimeoutData

---

#### Modbus

**Plik:** `modbus.h` + `modbus.cpp`
**Odpowiedzialnosc:** Driver GPIO przez protokol Modbus TCP (przemyslowy standard automatyki). Polling wejsc, sterowanie cewkami, watchdog.
**Komunikacja:** TCP (QTcpSocket, Modbus protocol)
**GPIO:** Konfigurowane (modbus_gpis, modbus_gpos), polling co 100ms, state machine
**Sloty:** connectedData, readyReadData, errorData, pollInputs, resetStateData, watchdogData

---

#### Quartz1

**Plik:** `quartz1.h` + `quartz1.cpp`
**Odpowiedzialnosc:** Driver routera audio Quartz Type 1 protocol. Dual-connection (primary + backup) z auto-reconnect.
**Komunikacja:** TCP (QTcpSocket x2) lub Serial (RDTTYDevice x2), konfigurowane per port
**GPIO:** Brak
**Sloty:** ipConnect, connectedData, connectionClosedData, errorData, error0Data, error1Data

---

#### RossNkScp

**Plik:** `rossnkscp.h` + `rossnkscp.cpp`
**Odpowiedzialnosc:** Driver routerow Ross NK przez protokol SCP/A (Serial Control Protocol).
**Komunikacja:** Serial TTY (RDTTYDevice)
**GPIO:** Brak
**Sloty:** Brak

---

#### SoftwareAuthority

**Plik:** `swauthority.h` + `swauthority.cpp`
**Odpowiedzialnosc:** Driver routerow audio/GPIO uzywaajacych protokolu Software Authority (popularny w broadcast). TCP z auto-reconnect, obsluga GPIO, cart macros start/stop.
**Komunikacja:** TCP (QTcpSocket) z reconnect
**GPIO:** Konfigurowane z DB (swa_gpis, swa_gpos), state tracking per pin (string-based)
**Sloty:** ipConnect, connectedData, connectionClosedData, readyReadData, errorData

---

#### VGuest

**Plik:** `vguest.h` + `vguest.cpp`
**Odpowiedzialnosc:** Driver mikserow Logitek przez protokol vGuest. Dual-connection (primary + backup), obsluga faderow, GPIO, metadanych, ping/keepalive.
**Komunikacja:** TCP (RDSocket x2) lub Serial (RDTTYDevice x2), z reconnect i ping
**GPIO:** Konfigurowane (vguest_gpis, vguest_gpos), relay mapping (engine/device/surface/relay)
**Sloty:** ipConnect, connectedData, connectionClosedData, readyReadData, errorData, gpioOneshotData, pingData, pingResponseData

---

### Switcher Drivers -- Grupa Wheatstone

#### WheatnetLio

**Plik:** `wheatnet_lio.h` + `wheatnet_lio.cpp`
**Odpowiedzialnosc:** Driver GPIO urzadzen Wheatnet LIO (Logic I/O). TCP z polling, watchdog, auto-provisioning GPIO entries.
**Komunikacja:** TCP (QTcpSocket)
**GPIO:** Konfigurowane (lio_gpios), polling co 1000ms, watchdog co 5000ms
**Sloty:** connectedData, readyReadData, errorData, resetStateData, pollData, watchdogData

---

#### WheatnetSlio

**Plik:** `wheatnet_slio.h` + `wheatnet_slio.cpp`
**Odpowiedzialnosc:** Driver GPIO urzadzen Wheatnet SLIO (Serial Logic I/O). Identyczny wzorzec jak WheatnetLio.
**Komunikacja:** TCP (QTcpSocket)
**GPIO:** Konfigurowane (slio_gpios), polling co 1000ms, watchdog co 5000ms
**Sloty:** connectedData, readyReadData, errorData, resetStateData, pollData, watchdogData

---

### Switcher Drivers -- Grupa lokalna (hardware host)

#### Acu1p

**Plik:** `acu1p.h` + `acu1p.cpp`
**Odpowiedzialnosc:** Driver GPIO Sine Systems ACU-1 (Prophet). Serial TTY z polling, obsluga 16 pinow GPI/GPO.
**Komunikacja:** Serial TTY (RDTTYDevice + QSocketNotifier)
**GPIO:** 16 GPI + GPO (polling co 100ms, oneshot timery)
**Sloty:** pollData, readyReadData, gpiOneshotData, gpoOneshotData

---

#### KernelGpio

**Plik:** `kernelgpio.h` + `kernelgpio.cpp`
**Odpowiedzialnosc:** Driver GPIO przez interfejs Linux kernel GPIO (sysfs/chardev). Bezposredni dostep do pinow GPIO hosta.
**Komunikacja:** Kernel GPIO (przez RDKernelGpio z librd)
**GPIO:** Konfigurowane (gpio_gpis, gpio_gpos)
**Sloty:** gpiChangedData, gpiOneshotData, gpoResetData
**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Linux kernel GPIO (rdkernelgpio) | Bezposredni dostep do GPIO pinow | HIGH |

---

#### LocalAudio

**Plik:** `local_audio.h` + `local_audio.cpp`
**Odpowiedzialnosc:** Driver lokalnych kart audio AudioScience HPI -- mixer, metering, GPIO przez HPI API.
**Komunikacja:** AudioScience HPI (#ifdef HPI, asihpi/hpi.h)
**GPIO:** Konfigurowane z DB (bt_gpis, bt_gpos), polling co 100ms
**Sloty:** pollData, gpoOneshotData
**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| AudioScience HPI (asihpi/hpi.h) | Dostep do audio hardware GPIO | CRITICAL |

---

#### LocalGpio

**Plik:** `local_gpio.h` + `local_gpio.cpp`
**Odpowiedzialnosc:** Driver lokalnych kart GPIO MeasurementComputing (przez RDGpio z librd).
**Komunikacja:** RDGpio (ioctl-based)
**GPIO:** Konfigurowane (gpio_gpis, gpio_gpos)
**Sloty:** gpiChangedData, gpoChangedData, gpiOneshotData
**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| MeasurementComputing GPIO (rdgpio) | Dostep do kart GPIO | HIGH |

---

#### ModemLines

**Plik:** `modemlines.h` + `modemlines.cpp`
**Odpowiedzialnosc:** Driver GPIO wykorzystujacy linie modemowe portu szeregowego (CTS, DSR, DCD, RI jako wejscia; DTR, RTS jako wyjscia).
**Komunikacja:** Serial TTY modem lines (RDTty + raw fd)
**GPIO:** 4 GPI (linie modemowe wejsciowe) + 2 GPO (linie modemowe wyjsciowe), polling co 100ms
**Sloty:** pollTtyData, gpiOneshotData, gpoResetData

---

### Switcher Drivers -- Grupa specjalna (satellite/intercom)

#### Am16

**Plik:** `am16.h` + `am16.cpp`
**Odpowiedzialnosc:** Driver audio switchera 360 Systems AM-16 przez MIDI. Zlozony protokol crosspoint updates przez SysEx MIDI messages z patch workaround (patrz komentarz w headerze).
**Komunikacja:** MIDI (raw socket, QSocketNotifier), SysEx protocol
**GPIO:** Brak
**Sloty:** readyReadData (MIDI input), timeoutData (abort po 1000ms bez odpowiedzi)

---

#### StarGuide3

**Plik:** `starguide3.h` + `starguide3.cpp`
**Odpowiedzialnosc:** Driver odbiornika satelitarnego StarGuide III. Zarzadza feedami (StarGuideFeed) i przelacza miedzy providerami/serwisami.
**Komunikacja:** Serial TTY (RDTTYDevice)
**GPIO:** Brak
**Sloty:** Brak
**Zaleznosci od innych klas tego artifaktu:** StarGuideFeed (kontener danych feed)

---

#### Unity4000

**Plik:** `unity4000.h` + `unity4000.cpp`
**Odpowiedzialnosc:** Driver systemu intercom Unity 4000. Zarzadza feedami (UnityFeed) audio.
**Komunikacja:** Serial TTY (RDTTYDevice)
**GPIO:** Brak
**Sloty:** Brak
**Zaleznosci od innych klas tego artifaktu:** UnityFeed (kontener danych feed)

---

### Klasy pomocnicze (plain C++, bez Q_OBJECT)

#### StarGuideFeed

**Plik:** `starguide_feed.h` + `starguide_feed.cpp`
**Odpowiedzialnosc:** Kontener danych feed dla StarGuide III -- przechowuje provider ID, service ID i mode.

**Publiczne API:**
| Metoda | Parametry | Efekt |
|--------|-----------|-------|
| providerId / setProviderId | int | ID providera satelitarnego |
| serviceId / setServiceId | int | ID serwisu audio |
| mode / setMode | RDMatrix::Mode | Tryb odbioru |
| clear | -- | Reset do wartosci domyslnych |

---

#### UnityFeed

**Plik:** `unity_feed.h` + `unity_feed.cpp`
**Odpowiedzialnosc:** Kontener danych feed dla Unity 4000 -- przechowuje nazwe feedu i mode.

**Publiczne API:**
| Metoda | Parametry | Efekt |
|--------|-----------|-------|
| feed / setFeed | QString | Nazwa feedu audio |
| mode / setMode | RDMatrix::Mode | Tryb |
| clear | -- | Reset do wartosci domyslnych |

---

## Wzorzec drivera -- podsumowanie

Wszystkie 41 driverow Switcher implementuja identyczny interfejs publiczny (6 pure virtual + 2 virtual):

| Metoda | Typ | Opis |
|--------|-----|------|
| type() | pure virtual | Zwraca RDMatrix::Type tego drivera |
| gpiQuantity() | pure virtual | Liczba pinow GPI |
| gpoQuantity() | pure virtual | Liczba pinow GPO |
| primaryTtyActive() | pure virtual | Czy uzywa primary TTY |
| secondaryTtyActive() | pure virtual | Czy uzywa secondary TTY |
| processCommand(RDMacro*) | pure virtual | Przetwarza komende RML |
| sendGpi() | virtual | Wysyla stan GPI (domyslnie no-op) |
| sendGpo() | virtual | Wysyla stan GPO (domyslnie no-op) |

**Kategorie komunikacji:**
| Kategoria | Drivery | Komunikacja |
|-----------|---------|-------------|
| Serial TTY (prosty) | Bt10x1, Bt16x1, Bt8x2, BtSs124, BtSs21, Sas64000, RossNkScp, StarGuide3, Unity4000 | RDTTYDevice |
| Serial TTY + polling GPIO | Bt16x2, BtAcs82, BtAdms4422, BtGpi16, BtSrc16, BtSrc8Iii, BtSs164, BtSs41Mlr, BtSs42, BtSs44, BtSs82, Sas16000, Sas64000Gpi | RDTTYDevice + timer polling |
| Serial TTY + command queue | Sas32000 | RDTTYDevice + timer-driven queue |
| Serial + socket notifier | Acu1p, Am16 | RDTTYDevice + QSocketNotifier |
| TCP (prosty) | Gvc7000, Harlond, Modbus, BtSentinel4Web, BtU41MlrWeb, WheatnetLio, WheatnetSlio | QTcpSocket + reconnect/watchdog |
| TCP lub Serial (konfigurowane) | Quartz1, SasUsi, SoftwareAuthority, VGuest | QTcpSocket lub RDTTYDevice |
| TCP przez RDLiveWire | LiveWireLwrpAudio, LiveWireLwrpGpio | RDLiveWire helper |
| Multicast UDP | LiveWireMcastGpio | Raw multicast sockets |
| Hardware API | LocalAudio (HPI), LocalGpio (RDGpio), KernelGpio (RDKernelGpio) | Kernel/library API |
| Serial modem lines | ModemLines | Raw fd + modem control lines |

---

## Missing Coverage

| Klasa | Plik | Powod braku |
|-------|------|-------------|

(Wszystkie 46 klas z discovery-state.md maja wpis w inventory)

---

## Conflicts

| ID | Klasa | Opis konfliktu | Status |
|----|-------|----------------|--------|

(Brak konfliktow)
