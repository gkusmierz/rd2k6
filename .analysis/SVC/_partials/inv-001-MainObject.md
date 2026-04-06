---
partial_id: 001
artifact: SVC
class_name: MainObject
header_file: rdservice/rdservice.h
source_file: rdservice/rdservice.cpp
phase: 2
status: done
agent_version: 1.3.0
---

# MainObject

## Typ Qt
QObject (Service — headless daemon, QCoreApplication)

## Odpowiedzialnosc (WHAT)
MainObject is the Rivendell Service Manager daemon's sole class. It manages the lifecycle of all Rivendell backend daemons (caed, ripcd, rdcatchd, rdpadd, rdpadengined, rdvairplayd, rdrepld, rdrssd) and dropbox instances (rdimport processes). It starts them in a defined order at boot, monitors for crashes, handles graceful shutdown on SIGTERM/SIGINT, reloads dropboxes on SIGUSR1, and periodically runs local and system-wide maintenance routines via rdmaint.

## Sygnaly
Brak wlasnych sygnalow (MainObject nie emituje zadnych sygnalow).

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| processFinishedData | int id | private | Reaguje na zakonczenie procesu efemerycznego (maintenance). Loguje status zakonczenia (normalny, crash, non-zero exit code) i usuwa proces z mapy. |
| checkMaintData | - | private | Slot timera utrzymania. Planuje nastepny interwat, uruchamia lokalne utrzymanie, sprawdza czy ten host powinien uruchomic utrzymanie systemowe (bazujac na LAST_MAINT_DATETIME z tabeli VERSION i flagi systemMaint stacji). |
| exitData | - | private | Slot timera exit (100ms polling). Sprawdza globalna flage SIGTERM/SIGINT — jesli ustawiona, wykonuje Shutdown i exit. Sprawdza flage SIGUSR1 — jesli ustawiona, przeladowuje dropboxy. |

## Stan (Q_PROPERTY)
Brak Q_PROPERTY.

## Publiczne API (metody z znaczeniem biznesowym)
Brak publicznego API (wszystkie metody sa private). Jedynym publicznym punktem jest konstruktor.

| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| MainObject() | QObject *parent | Otwiera DB, sprawdza prior instance, parsuje CLI, instaluje signal handlers, uruchamia wszystkie uslugi, konfiguruje timer utrzymania | Musi byc jedyna instancja rdservice |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| StartupTarget | TargetCaed=0, TargetRipcd=1, TargetRdcatchd=2, TargetRdpadd=3, TargetRdpadengined=4, TargetRdvairplayd=5, TargetRdrepld=6, TargetRdrssd=7, TargetAll=8 | Pozwala na czesciowe uruchomienie — daemon moze zatrzymac sie po uruchomieniu wybranego targetu (--end-startup-after-X). TargetAll = pelny startup. |

## Reguly biznesowe (z implementacji)
- Regula: Przed uruchomieniem uslug, rdservice MUSI zabic wszystkie ewentualne stale (zombie) instancje kazdego daemona (KillProgram z SIGKILL).
- Zrodlo: Startup()

- Regula: Uslugi sa uruchamiane w scisle okreslonej kolejnosci: caed → ripcd → rdcatchd → rdpadd → (sleep 1s) → rdpadengined → rdvairplayd → rdrepld (warunkowy) → rdrssd (warunkowy) → dropboxy.
- Zrodlo: Startup()

- Regula: rdrepld uruchamiany TYLKO jesli w tabeli REPLICATORS istnieja wpisy dla tej stacji.
- Zrodlo: Startup()

- Regula: rdrssd uruchamiany TYLKO jesli ta stacja jest oznaczona jako RSS_PROCESSOR_STATION w tabeli SYSTEM.
- Zrodlo: Startup()

- Regula: Dropboxy sa uruchamiane jako procesy rdimport z argumentami CLI budowanymi z konfiguracji w tabeli DROPBOXES (per stacja).
- Zrodlo: StartDropboxes()

- Regula: Shutdown zamyka uslugi w odwrotnej kolejnosci (LIFO). Najpierw SIGTERM, czeka na zakonczenie, jesli nie — SIGKILL.
- Zrodlo: Shutdown()

- Regula: Dropboxy zamykane sa SIGKILL (bez SIGTERM — nie maja graceful shutdown).
- Zrodlo: ShutdownDropboxes()

- Regula: Interwat utrzymania jest losowy w zakresie [RD_MAINT_MIN_INTERVAL, RD_MAINT_MAX_INTERVAL] (jitter).
- Zrodlo: GetMaintInterval()

- Regula: Utrzymanie systemowe uruchamiane TYLKO jesli stacja ma wlaczone systemMaint() ORAZ uplynal RD_MAINT_MAX_INTERVAL od ostatniego uruchomienia (tabela VERSION.LAST_MAINT_DATETIME). Uzywa blokady tabeli (LOCK TABLES VERSION WRITE).
- Zrodlo: checkMaintData()

- Regula: Utrzymanie lokalne uruchamiane bezwarunkowo przy kazdym tyknieciu timera.
- Zrodlo: checkMaintData()

- Regula: Utrzymanie delegowane do zewnetrznego procesu rdmaint (--system dla systemowego, bez flag dla lokalnego).
- Zrodlo: RunSystemMaintRoutine(), RunLocalMaintRoutine()

- Regula: Tylko jedna instancja rdservice moze dzialac (sprawdzenie RDGetPids("rdservice").size()>1 przy starcie).
- Zrodlo: MainObject()

- Regula: Jesli nie mozna otworzyc bazy danych, rdservice konczy sie z ExitNoDb.
- Zrodlo: MainObject()

- Regula: Mozna wymusic utrzymanie systemowe flaga --force-system-maintenance.
- Zrodlo: MainObject()

- Regula: Mozna ustawic poczatkowy interwal utrzymania z CLI (--initial-maintenance-interval).
- Zrodlo: MainObject()

- Regula: Mozna wylaczyc sprawdzanie utrzymania calkowicie (config->disableMaintChecks()).
- Zrodlo: MainObject()

- Regula: SIGUSR1 powoduje przeladowanie dropboxow (shutdown + restart).
- Zrodlo: SigHandler(), exitData()

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| signal.h (SIGTERM, SIGINT, SIGUSR1) | Unix signal handling do graceful shutdown i reload dropboxow | HIGH |
| kill() / SIGKILL | Zabijanie stalych procesow | HIGH |
| syslog | Logowanie do systemowego syslog | MEDIUM |
| pid file (RD_PID_DIR) | Zapis PID do /var/run | MEDIUM |
| sleep(1) | Band-aid delay miedzy uruchomieniem rdpadd a rdpadengined | MEDIUM |
| RDGetPids() | Odczyt listy PID procesow z /proc | HIGH |
| getuid() | Sprawdzenie UID procesu | LOW |

## Zaleznosci od innych klas tego artifaktu
Brak — MainObject jest jedyna klasa w SVC.

## Zaleznosci od shared libraries
- librd::RDApplication — inicjalizacja aplikacji, dostep do DB, syslog, command line switch parsing
- librd::RDProcess — wrapper na QProcess do zarzadzania procesami potomnymi
- librd::RDSqlQuery — wrapper na QSqlQuery
- librd::RDStation — informacje o stacji (systemMaint(), name())
- librd::RDConfig — konfiguracja (stationName(), disableMaintChecks())
- librd::RDGetPids() — pomocnicza funkcja do odczytu PID z /proc
- librd::RDWritePid() / RDDeletePid() — zarzadzanie plikiem PID
- librd::RDEscapeString() — SQL escaping
- librd::RDGetTimeLength() — formatowanie czasu
- librd::RDBool() — konwersja Y/N na bool
- librd::RDCmdSwitch — parsing argumentow CLI
