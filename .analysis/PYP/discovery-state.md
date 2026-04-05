---
phase: 1
artifact: PYP
artifact_name: pypad (Python PAD API)
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: pypad (Python PAD API)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | apis/pypad/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | rivendell_PYTHON = pypad.py (instalacja do pyexecdir) |
| Typ | api (Python library + plugin scripts) |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .py (API) | 1 |
| Pliki .py (scripts/plugins) | 20 |
| Pliki .py (tests) | 4 |
| Pliki .exemplar (config templates) | 20 |
| Pliki Makefile.am | 4 |
| Pliki .h | 0 |
| Pliki .cpp | 0 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Linie kodu Python (est.) | ~2900 |

## Uwaga: jezyk i technologia

PYP to **Pure Python** -- NIE C++/Qt. Nie ma tu klas Qt, sygnalow/slotow, ani Qt framework.
Zamiast tego:
- Standardowa biblioteka Python (socket, selectors, configparser, json, datetime, syslog, signal)
- MySQLdb (bezposredni dostep do bazy Rivendell)
- Zewnetrzne zaleznosci per skrypt: requests, serial (pyserial), xml.etree

## Architektura

PyPAD to framework pluginowy do przetwarzania Program Associated Data (PAD) z Rivendell.

### Warstwa API (apis/pypad/api/pypad.py)

Dwie klasy:

1. **`Update`** -- reprezentuje pojedyncza aktualizacje PAD
   - Parsuje dane JSON z TCP PAD feed
   - 28 publicznych accessor metod (dateTime, hostName, machine, mode, onairFlag, hasService, serviceName, etc.)
   - System wildcard resolution: `resolvePadFields()` -- zamienia %a/%t/%l itp. na wartosci metadanych
   - System filepath wildcard resolution: `resolveFilepath()` -- zamienia %Y/%m/%d itp. na daty
   - System datetime pattern resolution: `__resolveDatetimeWildcards()` -- tokenization/detokenization Qt-compatible patterns
   - Metoda `shouldBeProcessed()` -- filtrowanie po log machine i grupach
   - Metoda `escape()` -- 4 tryby (NONE, XML, URL, JSON)
   - Metoda `syslog()` -- logowanie z konfigurowalnym facility

2. **`Receiver`** -- glowna petla odbiorcza PAD
   - Laczy sie z rdpadd/rdpadengined po TCP (domyslny port 34289)
   - Event loop oparty na `selectors` (nie Qt event loop)
   - Callback pattern: `setPadCallback(fn)` + opcjonalnie `setTimerCallback(interval, fn)`
   - Konfiguracja z pliku INI lub z bazy danych (prefix '$' = ID w tabeli PYPAD_INSTANCES)
   - Filtrowanie po grupach (NowGroups/NextGroups)
   - Czyta `/etc/rd.conf` dla credentials MySQL i syslog facility
   - Parsuje JSON line-delimited (separator: \r\n)

### Stale modulu

| Kategoria | Stale |
|-----------|-------|
| Escape types | ESCAPE_NONE=0, ESCAPE_XML=1, ESCAPE_URL=2, ESCAPE_JSON=3 |
| PAD types | TYPE_NOW='now', TYPE_NEXT='next' |
| Field names | 27 stalych FIELD_* (FIELD_TITLE, FIELD_ARTIST, FIELD_ALBUM, etc.) |
| Default port | PAD_TCP_PORT=34289 |

### Funkcja standalone

- **`SigHandler(signo, stack)`** -- handler SIGTERM, wywoluje sys.exit(0)

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| API module | api/pypad.py | import pypad | Glowny modul API, importowany przez wszystkie skrypty |
| Plugin entry | scripts/pypad_*.py | rcvr=pypad.Receiver(); rcvr.start() | Kazdy skrypt to standalone proces z callback pattern |

## Skrypty pluginowe (scripts/)

Kazdy skrypt implementuje ten sam wzorzec:
1. Definiuje `ProcessPad(update)` callback
2. Tworzy `pypad.Receiver()`
3. Ustawia config file z `sys.argv[3]`
4. Ustawia callback i startuje receiver

| Nr | Skrypt | Cel | Protokol/Interfejs |
|----|--------|-----|-------------------|
| 001 | pypad_ando.py | Transmitter updates (Ando) | UDP/TCP |
| 002 | pypad_filewrite.py | Zapis PAD do plikow lokalnych | Filesystem (write/append) |
| 003 | pypad_httpget.py | HTTP GET z metadanymi | HTTP (requests) |
| 004 | pypad_icecast2.py | Update Icecast2 mountpoint metadata | HTTP (requests, admin API) |
| 005 | pypad_inno713.py | Inovonics 713 RDS encoder | UDP |
| 006 | pypad_ino713_tcp.py | Inovonics 713 RDS encoder (TCP) | TCP |
| 007 | pypad_liqcomp.py | Liquidsoap companion | TCP |
| 008 | pypad_live365.py | Live365 streaming metadata | HTTP (requests) |
| 009 | pypad_nautel.py | Nautel transmitter | HTTP (requests) |
| 010 | pypad_serial.py | Serial port output | Serial (pyserial) |
| 011 | pypad_shoutcast1.py | Shoutcast v1 metadata update | HTTP (requests) |
| 012 | pypad_spinitron.py | Spinitron playlist reporting | HTTP (requests) |
| 013 | pypad_spottrap.py | Spot/commercial trap | Filesystem |
| 014 | pypad_tunein.py | TuneIn AIR API | HTTP (requests) |
| 015 | pypad_udp.py | Generic UDP output | UDP |
| 016 | pypad_urlwrite.py | URL write (POST/PUT) | HTTP (requests) |
| 017 | pypad_walltime.py | Wall time clock display | Filesystem |
| 018 | pypad_xcmd.py | X-Command RDS encoder | TCP + Serial (pyserial) |
| 019 | pypad_xds.py | XDS/RBDS data | Serial (pyserial) |
| 020 | pypad_xmpad.py | XM satellite PAD | TCP |

## Pliki zrodlowe

### API (core library)

| Nr | Plik | LOC | Opis |
|----|------|-----|------|
| 001 | api/pypad.py | 841 | Core API: klasy Update + Receiver + stale + SigHandler |

### Skrypty pluginowe (.py + .exemplar pairs)

| Nr | Script (.py) | LOC | Config (.exemplar) |
|----|-------------|-----|-------------------|
| 001 | pypad_ando.py | 76 | pypad_ando.exemplar |
| 002 | pypad_filewrite.py | 50 | pypad_filewrite.exemplar |
| 003 | pypad_httpget.py | 79 | pypad_httpget.exemplar |
| 004 | pypad_icecast2.py | 81 | pypad_icecast2.exemplar |
| 005 | pypad_inno713.py | 89 | pypad_inno713.exemplar |
| 006 | pypad_ino713_tcp.py | 79 | pypad_ino713_tcp.exemplar |
| 007 | pypad_liqcomp.py | 62 | pypad_liqcomp.exemplar |
| 008 | pypad_live365.py | 66 | pypad_live365.exemplar |
| 009 | pypad_nautel.py | 159 | pypad_nautel.exemplar |
| 010 | pypad_serial.py | 59 | pypad_serial.exemplar |
| 011 | pypad_shoutcast1.py | 74 | pypad_shoutcast1.exemplar |
| 012 | pypad_spinitron.py | 114 | pypad_spinitron.exemplar |
| 013 | pypad_spottrap.py | 60 | pypad_spottrap.exemplar |
| 014 | pypad_tunein.py | 80 | pypad_tunein.exemplar |
| 015 | pypad_udp.py | 52 | pypad_udp.exemplar |
| 016 | pypad_urlwrite.py | 59 | pypad_urlwrite.exemplar |
| 017 | pypad_walltime.py | 59 | pypad_walltime.exemplar |
| 018 | pypad_xcmd.py | 156 | pypad_xcmd.exemplar |
| 019 | pypad_xds.py | 109 | pypad_xds.exemplar |
| 020 | pypad_xmpad.py | 146 | pypad_xmpad.exemplar |

### Pliki konfiguracyjne (.exemplar)

20 plikow INI-format. Kazdy definiuje sekcje per instancja (np. [Udp1], [File1], [Icecast1])
ze wspolnymi opcjami:
- FormatString (z wildcardami PAD)
- Encoding (0=none, 1=XML, 2=URL)
- ProcessNullUpdates (0-3)
- Log Selection (MasterLog, Aux1Log, Aux2Log, VLog101-VLog120)
- NowGroups / NextGroups (filtrowanie po grupach)
Plus opcje specyficzne per protokol (IpAddress, UdpPort, TcpPort, Device, Speed, etc.)

## Pliki testowe

| Nr | Plik | LOC | Testowane funkcje |
|----|------|-----|-------------------|
| 001 | tests/pad_test.py | 141 | Regression test: wszystkie accessor metody Update (now+next) |
| 002 | tests/now_and_next.py | 63 | Przyklad: barebones now/next display |
| 003 | tests/filepath_test.py | 72 | Regression test: wszystkie filepath wildcards resolveFilepath() |
| 004 | tests/xcmd_server.py | 75 | Mock TCP server dla testow pypad_xcmd (XcmdTCPHandler) |

Framework testowy: brak (nie QTest, nie pytest/unittest). Testy to standalone skrypty
ktore lacza sie z dzialajacym Rivendell i wypisuja output na stdout.
xcmd_server.py to mock server (socketserver.TCPServer).

## Build System

Autotools (Makefile.am), **nie CMake**:

- `apis/pypad/Makefile.am` -- SUBDIRS: api, scripts, tests
- `apis/pypad/api/Makefile.am` -- instaluje pypad.py do `$(pyexecdir)` jako modul Python
- `apis/pypad/scripts/Makefile.am` -- instaluje 20 skryptow .py + 20 .exemplar do `$(prefix)/@RD_LIB_PATH@/rivendell/pypad/`
  - Uzywa `helpers/install_python.sh` do instalacji skryptow (prawdopodobnie podmienia `%PYTHON_BANGPATH%`)
- `apis/pypad/tests/Makefile.am` -- EXTRA_DIST only (testy nie sa instalowane)

## Zaleznosci

| Biblioteka | Typ | Opis |
|------------|-----|------|
| MySQLdb (mysqlclient) | Python package | Bezposredni dostep do bazy Rivendell |
| configparser | stdlib | Parsowanie INI config |
| socket/selectors | stdlib | TCP komunikacja z PAD feed |
| json | stdlib | Parsowanie PAD JSON messages |
| syslog | stdlib | Logowanie systemowe |
| signal | stdlib | SIGTERM handling |
| requests | Python package | HTTP (w icecast2, httpget, live365, nautel, shoutcast1, spinitron, tunein, urlwrite) |
| serial (pyserial) | Python package | Serial port (w serial, xcmd, xds) |
| xml.etree.ElementTree | stdlib | XML (w xcmd, xmpad, icecast2) |
| socketserver | stdlib | Mock TCP server (xcmd_server.py test only) |
| /etc/rd.conf | system config | MySQL credentials + syslog facility |
| rdpadd/rdpadengined | Rivendell daemon | Zrodlo danych PAD (TCP port 34289) |

## Powiazania z innymi artefaktami

- **PAD (rdpadengined)** -- PYP laczy sie z nim po TCP, odbiera JSON PAD updates
- **PDD (rdpadd)** -- PAD consolidation broker, alternatywne zrodlo PAD feed
- **LIB (librd)** -- `RDLogLine::resolveWildcards()` to C++ odpowiednik `Update.resolvePadFields()` (musza byc zsynchronizowane -- patrz komentarz MAINTAINER'S NOTE w pypad.py linia 405-408)
- **AIR (rdairplay)** -- generuje PAD events ktore PYP przetwarza
- Baza MySQL -- PYP czyta konfiguracje z tabeli PYPAD_INSTANCES i /etc/rd.conf
