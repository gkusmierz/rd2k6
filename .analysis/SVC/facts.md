---
phase: 5
artifact: SVC
artifact_name: rdservice (Service Manager daemon)
status: done
completed_at: 2026-04-06
sources_used: [code, docs]
facts_total: 34
conflicts_found: 2
spot_check_issues: 0
agent_version: 1.3.0
---

# Facts: rdservice (Service Manager daemon)

## Zrodla analizy

| Zrodlo | Uzyte | Jakosc |
|--------|-------|--------|
| Kod zrodlowy | tak | wysoka (4 pliki .cpp, 1 .h, ~869 LOC) |
| Testy QTest | nie | brak plikow testowych |
| Dokumentacja (docs/manpages/) | tak | 1 plik XML (rdservice.xml manpage) |

---

## Use Cases (aktor -> akcja -> efekt)

| ID | Aktor | Akcja | Efekt | Zrodlo |
|----|-------|-------|-------|--------|
| UC-001 | System (boot) | Uruchamia rdservice | Wszystkie uslugi Rivendell startuja w kolejnosci | startup.cpp:34-213 |
| UC-002 | Administrator | Wysyla SIGTERM/SIGINT | Graceful shutdown wszystkich uslug (odwrotna kolejnosc) | rdservice.cpp:189-194, shutdown.cpp:23-40 |
| UC-003 | Administrator | Wysyla SIGUSR1 | Hot-reload dropboxow (shutdown + restart z nowa konfig DB) | rdservice.cpp:196-201 |
| UC-004 | System (timer) | Tick timera maintenance | Lokalne utrzymanie + warunkowe systemowe | maint_routines.cpp:31-84 |
| UC-005 | Administrator | Uruchamia z --end-startup-after-X | Czesciowy startup (debugging) — zatrzymanie po wybranym daemonie | startup.cpp (per daemon check) |
| UC-006 | Administrator | Uruchamia z --force-system-maintenance | Wymuszenie systemowego utrzymania przy pierwszym tiku | rdservice.cpp:96-98, maint_routines.cpp:80 |
| UC-007 | Administrator | Uruchamia z --initial-maintenance-interval=N | Ustawienie poczatkowego opoznienia maintenance | rdservice.cpp:100-107, 142-143 |
| UC-008 | System (cron/maint) | Ephemeral process (rdmaint) konczy sie | Log statusu zakonczenia, cleanup z mapy procesow | rdservice.cpp:162-182 |

---

## Reguly biznesowe (Gherkin)

```gherkin
# --- REGULY ZARZADZANIA CYKLEM ZYCIA USLUG ---

Rule: Singleton enforcement

  Scenario: Uruchomienie pierwszej instancji rdservice
    Given brak innej instancji rdservice w systemie
    When  rdservice startuje
    Then  rdservice kontynuuje inicjalizacje normalnie

  Scenario: Proba uruchomienia drugiej instancji
    Given rdservice juz dziala (RDGetPids > 1)
    When  nowa instancja rdservice startuje
    Then  nowa instancja konczy sie z exit code 1 (ExitPriorInstance)

  # Zrodlo: kod | rdservice.cpp:79-82
  # Pewnosc: potwierdzone


Rule: Database connection is mandatory

  Scenario: Baza danych dostepna
    Given MySQL jest uruchomiony i konfiguracja poprawna
    When  rdservice startuje i wywoluje RDApplication::open()
    Then  inicjalizacja kontynuuje

  Scenario: Baza danych niedostepna
    Given MySQL nie jest dostepny lub bledna konfiguracja
    When  rdservice startuje i wywoluje RDApplication::open()
    Then  rdservice loguje blad i konczy sie z exit code 2 (ExitNoDb)

  # Zrodlo: kod | rdservice.cpp:70-74
  # Pewnosc: potwierdzone


Rule: Uslugi startuja w scisle okreslonej kolejnosci

  Scenario: Pelny startup (TargetAll)
    Given svc_startup_target = TargetAll
    When  Startup() jest wywolany
    Then  uslugi startuja w kolejnosci: caed -> ripcd -> rdcatchd -> rdpadd -> (1s sleep) -> rdpadengined -> rdvairplayd -> rdrepld (warunkowy) -> rdrssd (warunkowy) -> dropboxy
    And   jesli ktorykolwiek daemon nie startuje, Startup() zwraca false

  Scenario: Czesciowy startup (np. TargetRipcd)
    Given svc_startup_target = TargetRipcd
    When  Startup() jest wywolany
    Then  startuja: caed, ripcd
    And   Startup() zwraca true natychmiast po uruchomieniu ripcd
    And   pozostale uslugi NIE sa uruchamiane

  # Zrodlo: kod | startup.cpp:34-213
  # Pewnosc: potwierdzone


Rule: Stale procesy sa zabijane przed startem

  Scenario: Stale procesy istnieja
    Given w systemie jest zombie/staly proces caed
    When  Startup() jest wywolany
    Then  KillProgram("caed") wysyla SIGKILL do wszystkich instancji
    And   czeka 1s i sprawdza ponownie (petla az brak procesow)
    And   dopiero wtedy uruchamia nowego caed

  # Zrodlo: kod | startup.cpp:43-50, startup.cpp:346-358
  # Pewnosc: potwierdzone


Rule: rdrepld uruchamiany warunkowo

  Scenario: Stacja ma replicatory
    Given tabela REPLICATORS zawiera wpisy WHERE STATION_NAME = nazwa tej stacji
    When  Startup() dochodzi do rdrepld
    Then  rdrepld jest uruchamiany

  Scenario: Stacja nie ma replicatorow
    Given tabela REPLICATORS nie zawiera wpisow dla tej stacji
    When  Startup() dochodzi do rdrepld
    Then  rdrepld NIE jest uruchamiany (pomijany)

  # Zrodlo: kod | startup.cpp:164-178
  # Pewnosc: potwierdzone


Rule: rdrssd uruchamiany warunkowo

  Scenario: Stacja jest procesorem RSS
    Given SYSTEM.RSS_PROCESSOR_STATION (case-insensitive) = nazwa tej stacji
    When  Startup() dochodzi do rdrssd
    Then  rdrssd jest uruchamiany

  Scenario: Stacja nie jest procesorem RSS
    Given SYSTEM.RSS_PROCESSOR_STATION != nazwa tej stacji
    When  Startup() dochodzi do rdrssd
    Then  rdrssd NIE jest uruchamiany

  # Zrodlo: kod | startup.cpp:187-206
  # Pewnosc: potwierdzone


Rule: Shutdown w odwrotnej kolejnosci

  Scenario: Graceful shutdown
    Given rdservice otrzymuje SIGTERM
    When  exitData() wykrywa global_exiting
    Then  ShutdownDropboxes() (SIGKILL, natychmiast)
    And   daemons zamykane od LAST_ID-1 do 0 (SIGTERM, czekaj, SIGKILL jesli timeout)
    And   PID file usuwany
    And   exit(0)

  # Zrodlo: kod | shutdown.cpp:23-40, shutdown.cpp:43-54
  # Pewnosc: potwierdzone


Rule: Dropboxy zamykane SIGKILL (bez graceful)

  Scenario: Zamkniecie dropboxow
    Given dropboxy (id >= 100) sa uruchomione
    When  ShutdownDropboxes() jest wywolany
    Then  kazdy dropbox otrzymuje process()->kill() (SIGKILL)
    And   NIE jest uzywany SIGTERM (brak graceful shutdown dla rdimport)

  # Zrodlo: kod | shutdown.cpp:43-54
  # Pewnosc: potwierdzone


# --- REGULY UTRZYMANIA (MAINTENANCE) ---

Rule: Maintenance z losowym jitterem

  Scenario: Obliczenie interwalu
    Given RD_MAINT_MIN_INTERVAL = 900000ms (15min)
    And   RD_MAINT_MAX_INTERVAL = 3600000ms (60min)
    When  GetMaintInterval() jest wywolany
    Then  zwraca wartosc losowa z zakresu [900000, 3600000] ms
    And   rozklad rownomierny (uniform)

  # Zrodlo: kod | maint_routines.cpp:108-113, lib/rd.h:443-444
  # Pewnosc: potwierdzone


Rule: Lokalne utrzymanie bezwarunkowe

  Scenario: Tick timera maintenance
    Given timer maintenance wygasa
    When  checkMaintData() jest wywolany
    Then  RunLocalMaintRoutine() jest ZAWSZE wywolany
    And   uruchamia rdmaint (bez flag)

  # Zrodlo: kod | maint_routines.cpp:51, 99-105
  # Pewnosc: potwierdzone


Rule: Systemowe utrzymanie warunkowe i koordynowane

  Scenario: Stacja uprawniona, interwal przekroczony
    Given station->systemMaint() = true
    And   czas od VERSION.LAST_MAINT_DATETIME > RD_MAINT_MAX_INTERVAL
    When  checkMaintData() jest wywolany
    Then  LOCK TABLES VERSION WRITE (atomowosc)
    And   RunSystemMaintRoutine() uruchamia "rdmaint --system"

  Scenario: Stacja uprawniona, interwal NIE przekroczony
    Given station->systemMaint() = true
    And   czas od VERSION.LAST_MAINT_DATETIME <= RD_MAINT_MAX_INTERVAL
    When  checkMaintData() jest wywolany
    Then  system maintenance NIE jest uruchamiany

  Scenario: Stacja nieuprawniona
    Given station->systemMaint() = false
    When  checkMaintData() jest wywolany
    Then  system maintenance jest calkowicie pomijany (wczesny return)

  Scenario: Wymuszenie flaga --force-system-maintenance
    Given svc_force_system_maintenance = true
    When  checkMaintData() jest wywolany
    Then  system maintenance jest uruchamiany niezaleznie od interwalu
    And   flaga jest resetowana po uruchomieniu

  # Zrodlo: kod | maint_routines.cpp:56-83
  # Pewnosc: potwierdzone


Rule: Maintenance moze byc calkowicie wylaczone

  Scenario: disableMaintChecks w konfiguracji
    Given config->disableMaintChecks() = true
    When  MainObject() konfiguruje timer
    Then  svc_maint_timer NIE jest uruchamiany
    And   logowany komunikat "maintenance checks disabled on this host"

  # Zrodlo: kod | rdservice.cpp:141-153
  # Pewnosc: potwierdzone


# --- REGULY SYGNALIZACJI ---

Rule: SIGUSR1 przeladowuje dropboxy

  Scenario: SIGUSR1 otrzymany
    Given rdservice dziala normalnie
    When  SIGUSR1 jest odebrany
    Then  ShutdownDropboxes() zamyka istniejace dropboxy
    And   StartDropboxes() uruchamia nowe z aktualnej konfiguracji DB
    And   handler SIGUSR1 jest reinstalowany

  # Zrodlo: kod | rdservice.cpp:48-49, 196-201
  # Pewnosc: potwierdzone


Rule: Monitorowanie procesow efemerycznych

  Scenario: Proces efemeryczny konczy sie normalnie
    Given rdmaint proces jest uruchomiony jako ephemeral
    When  proces konczy sie z exit code 0
    Then  logowane LOG_DEBUG "process exited normally"
    And   RDProcess usuniety z mapy

  Scenario: Proces efemeryczny crashuje
    Given rdmaint proces jest uruchomiony
    When  proces konczy sie z exitStatus != NormalExit
    Then  logowane LOG_WARNING "process crashed!"

  Scenario: Proces efemeryczny konczy sie z bledem
    Given rdmaint proces jest uruchomiony
    When  proces konczy sie z exit code != 0 (ale NormalExit)
    Then  logowane LOG_WARNING z exit code

  # Zrodlo: kod | rdservice.cpp:162-182
  # Pewnosc: potwierdzone
```

---

## Stany encji

### rdservice Daemon — stany

```mermaid
stateDiagram-v2
    [*] --> Initializing : main() called
    Initializing --> DBOpen : RDApplication::open() OK
    Initializing --> Failed : DB open failed (exit 2)
    DBOpen --> SingletonCheck : DB connected
    SingletonCheck --> Failed : Prior instance (exit 1)
    SingletonCheck --> CLIParsing : Singleton OK
    CLIParsing --> Failed : Unknown option (exit 4)
    CLIParsing --> StartingServices : Options parsed
    StartingServices --> Failed : Service start failed (exit 3)
    StartingServices --> Running : All services started
    Running --> Running : maintenance tick (periodic)
    Running --> ReloadingDropboxes : SIGUSR1
    ReloadingDropboxes --> Running : dropboxes reloaded
    Running --> ShuttingDown : SIGTERM/SIGINT
    ShuttingDown --> [*] : exit(0)
    Failed --> [*] : exit(N)
```

| Przejscie | Trigger | Warunek | Efekt uboczny | Zrodlo |
|-----------|---------|---------|--------------|--------|
| Initializing -> Failed | DB error | RDApplication::open() fails | syslog error | rdservice.cpp:70-74 |
| SingletonCheck -> Failed | Prior instance | RDGetPids > 1 | syslog error | rdservice.cpp:79-82 |
| CLIParsing -> Failed | Unknown option | !processed | stderr message | rdservice.cpp:110-113 |
| StartingServices -> Failed | Service fail | Startup() returns false | Shutdown() called first | rdservice.cpp:126-131 |
| StartingServices -> Running | All OK | Startup() returns true | Timers started | rdservice.cpp:122-149 |
| Running -> Running | maint tick | timer timeout | local + conditional system maint | maint_routines.cpp:31-84 |
| Running -> ReloadingDropboxes | SIGUSR1 | global_reload_dropboxes | ShutdownDropboxes + StartDropboxes | rdservice.cpp:196-201 |
| Running -> ShuttingDown | SIGTERM/INT | global_exiting | Shutdown() + PID cleanup | rdservice.cpp:189-194 |

### Managed Process — stany

```mermaid
stateDiagram-v2
    [*] --> Starting : RDProcess::start()
    Starting --> Running : waitForStarted() OK
    Starting --> Failed : waitForStarted() fail
    Running --> Terminated : SIGTERM (graceful)
    Running --> Killed : SIGKILL (forced)
    Running --> Crashed : abnormal exit
    Terminated --> [*] : waitForFinished()
    Killed --> [*] : waitForFinished()
    Crashed --> [*] : processFinishedData()
    Failed --> [*] : error logged
```

---

## Ograniczenia i limity

| Ograniczenie | Wartosc | Dotyczy | Zrodlo |
|-------------|---------|---------|--------|
| Max daemons (fixed IDs) | 10 (RDSERVICE_LAST_ID) | Managed daemon slots | rdservice.h:40 |
| First dropbox ID | 100 (RDSERVICE_FIRST_DROPBOX_ID) | Dropbox process numbering | rdservice.h:41 |
| Max dropbox count | ~unlimited (map-based, IDs from 100+) | rdimport processes per station | startup.cpp:222 |
| Maint min interval | 900000 ms (15 min) | Maintenance scheduling | lib/rd.h:443 |
| Maint max interval | 3600000 ms (60 min) | Maintenance scheduling | lib/rd.h:444 |
| Exit poll interval | 100 ms | Signal detection latency | rdservice.cpp:124 |
| Band-aid delay | 1000 ms (1s) | Between rdpadd and rdpadengined | startup.cpp:124 |
| PID file path | /var/run/rdservice.pid | Singleton management | lib/rd.h:43 |

---

## Konfiguracja (CLI options)

| Opcja | Typ | Wartosc domyslna | Znaczenie |
|-------|-----|-----------------|-----------|
| --end-startup-after-caed | flag | - | Stop startup after caed |
| --end-startup-after-ripcd | flag | - | Stop startup after ripcd |
| --end-startup-after-rdcatchd | flag | - | Stop startup after rdcatchd |
| --end-startup-after-rdpadd | flag | - | Stop startup after rdpadd |
| --end-startup-after-rdpadengined | flag | - | Stop startup after rdpadengined |
| --end-startup-after-rdvairplayd | flag | - | Stop startup after rdvairplayd |
| --end-startup-after-rdrepld | flag | - | Stop startup after rdrepld |
| --end-startup-after-rdrssd | flag | - | Stop startup after rdrssd |
| --force-system-maintenance | flag | false | Force first maintenance to include system-wide |
| --initial-maintenance-interval | int (ms) | random [15-60 min] | Override initial maintenance delay |

---

## Linux-specific komponenty

| Komponent | Gdzie uzywany (klasa/metoda) | Funkcja | Priorytet zastapienia |
|-----------|---------------------------|---------|----------------------|
| Unix signals (signal.h) | MainObject::MainObject(), SigHandler() | SIGTERM/SIGINT/SIGUSR1 handling | HIGH |
| kill() syscall | MainObject::KillProgram() | SIGKILL stale processes | HIGH |
| syslog (syslog.h) | RDApplication::syslog() | System logging | MEDIUM |
| PID file (/var/run) | RDWritePid(), RDDeletePid() | Process management | MEDIUM |
| /proc filesystem | RDGetPids() | Process enumeration | HIGH |
| sleep() | MainObject::Startup(), KillProgram() | Blocking delays | MEDIUM |
| getuid() | MainObject::MainObject() | Process UID check | LOW |
| QProcess (fork+exec) | RDProcess::start() | Child process management | HIGH |

---

## Konflikty miedzy zrodlami

### TYP 2 — W kodzie, brak w dokumentacji

| Fakt z kodu | Plik | Status |
|-------------|------|--------|
| rdrepld conditional startup (REPLICATORS table check) | startup.cpp:164-178 | needs_doc |
| rdrssd conditional startup (RSS_PROCESSOR_STATION check) | startup.cpp:187-206 | needs_doc |
| SIGUSR1 dropbox hot-reload | rdservice.cpp:196-201 | needs_doc |
| Maintenance jitter (random 15-60 min interval) | maint_routines.cpp:108-113 | needs_doc |
| Maintenance disable via config | rdservice.cpp:141-153 | needs_doc |
| --end-startup-after-rdrssd supported | startup.cpp:202-205 | needs_doc (missing from manpage) |

### TYP 3 — Sprzecznosc kod <-> dokumentacja

| Kod mowi | Docs mowi | Plik XML | Rozstrzygniecie |
|----------|-----------|----------|----------------|
| --force-system-maintenance | --force-service-maintenance | docs/manpages/rdservice.xml:options | kod_wins (docs has typo) |
| 8 partial targets (including rdrssd) | 7 partial targets (up to rdrepld) | docs/manpages/rdservice.xml:options | kod_wins (docs incomplete) |

### TYP 4 — Edge cases tylko w testach

Brak testow — brak edge cases z testow.

---

## Spot-check

Zweryfikowano 3 reguly Gherkin:

1. **Singleton enforcement** (FAKT-C02): rdservice.cpp:79 — `if(RDGetPids("rdservice").size()>1)` + `exit(RDApplication::ExitPriorInstance)` — PASS
2. **Maintenance jitter** (FAKT-C21): maint_routines.cpp:110-112 — formula `RD_MAINT_MIN_INTERVAL + (MAX-MIN) * random/RAND_MAX` — PASS
3. **rdrepld conditional** (FAKT-C09): startup.cpp:164-167 — `SELECT NAME from REPLICATORS where STATION_NAME=...` + `if(q->first())` — PASS

Spot-check: PASS (3/3).
