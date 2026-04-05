---
phase: 0
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
project_name: Rivendell
---

# Rivendell — Project Manifest

## Project Profile

| Pole | Wartość |
|------|---------|
| Nazwa | Rivendell Radio Automation System |
| Wersja | 3.6.7 |
| Język | C++ / Qt 4 (z Qt3Support) |
| Build system | autotools (configure.ac + Makefile.am); .pro tylko do i18n |
| Licencja | GPL v2 |
| Linie kodu (est.) | ~282 000 |
| Plików źródłowych (.cpp) | 561 |
| Plików nagłówkowych (.h) | 573 |
| Plików .ui | 0 (UI budowane programowo) |
| Plików .qml | 0 |

## Platform-specific Components (TO REPLACE in clone)

| Komponent | Technologia | Używany przez | Priorytet zastąpienia |
|-----------|-------------|---------------|----------------------|
| Audio engine | JACK + ALSA | CAE (caed), ripcd, rdalsaconfig | CRITICAL |
| Audio HW abstraction | AudioScience HPI (librdhpi) | CAE (caed), ripcd | CRITICAL |
| Database | MySQL / MariaDB | lib (rddb, rdconfig), rddbmgr, rddbconfig, importers | CRITICAL |
| Audio codec | libvorbis, FLAC, libsndfile, libsamplerate, SoundTouch, libid3/libtag | lib (rdaudioconvert, rdwavefile), caed, web CGIs | HIGH |
| CD ripping | cdparanoia (cdda_interface, cdda_paranoia) | lib (rdcdripper), rdlibrary | HIGH |
| Disc lookup | MusicBrainz (libmusicbrainz) | lib (rdmblookup), wszystkie aplikacje GUI | MEDIUM |
| IPC / GPIO | Modbus (nie D-Bus), serial TTY, kernel GPIO | ripcd | MEDIUM |
| Auth | PAM | lib (rduser) | MEDIUM |
| Crypto | OpenSSL (libcrypto) | lib | LOW |

## Artifacts

| ID | Nazwa | Typ | Pri | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|----|-------|-----|-----|----|----|----|----|----|----|-----|
| LIB | librd | library | 0 | done | done | done | done | done | done | done |
| HPI | librdhpi | library | 0 | done | done | pending | pending | pending | pending | pending |
| WCA | librivwebcapi | library | 0 | done | done | pending | pending | pending | pending | pending |
| CAE | caed | daemon | 1 | done | done | pending | pending | pending | pending | pending |
| RPC | ripcd | daemon | 1 | done | done | pending | pending | pending | pending | pending |
| AIR | rdairplay | application | 2 | done | pending | pending | pending | pending | pending | pending |
| ADM | rdadmin | application | 2 | done | pending | pending | pending | pending | pending | pending |
| RLB | rdlibrary | application | 3 | done | pending | pending | pending | pending | pending | pending |
| LGM | rdlogmanager | application | 3 | done | pending | pending | pending | pending | pending | pending |
| LGE | rdlogedit | application | 3 | done | pending | pending | pending | pending | pending | pending |
| CTH | rdcatch | application | 3 | done | pending | pending | pending | pending | pending | pending |
| CTD | rdcatchd | daemon | 3 | done | pending | pending | pending | pending | pending | pending |
| PNL | rdpanel | application | 4 | done | pending | pending | pending | pending | pending | pending |
| CST | rdcartslots | application | 4 | done | pending | pending | pending | pending | pending | pending |
| CSM | rdcastmanager | application | 4 | done | pending | pending | pending | pending | pending | pending |
| MON | rdmonitor | application | 5 | done | pending | pending | pending | pending | pending | pending |
| SEL | rdselect | application | 5 | done | pending | pending | pending | pending | pending | pending |
| LGN | rdlogin | application | 5 | done | pending | pending | pending | pending | pending | pending |
| SVC | rdservice | daemon | 5 | done | pending | pending | pending | pending | pending | pending |
| VAP | rdvairplayd | daemon | 5 | done | pending | pending | pending | pending | pending | pending |
| PAD | rdpadengined | daemon | 6 | done | pending | pending | pending | pending | pending | pending |
| PDD | rdpadd | daemon | 6 | done | pending | pending | pending | pending | pending | pending |
| RSS | rdrssd | daemon | 6 | done | pending | pending | pending | pending | pending | pending |
| RPL | rdrepld | daemon | 6 | done | pending | pending | pending | pending | pending | pending |
| XPT | rdxport.cgi | web | 7 | done | pending | pending | pending | pending | pending | pending |
| WGT | webget.cgi | web | 7 | done | pending | pending | pending | pending | pending | pending |
| IMP | importers | tool | 8 | done | pending | pending | pending | pending | pending | pending |
| UTL | utils (CLI) | tool | 8 | done | pending | pending | pending | pending | pending | pending |
| TST | tests | test | 10 | done | pending | pending | pending | pending | pending | pending |
| PYP | pypad (Python PAD) | api | 9 | done | pending | pending | pending | pending | pending | pending |

## Dependency Graph (inter-artifact)

Kolumna `Depends On` zawiera ID artefaktów które MUSZĄ mieć ukończoną analizę (P7=done)
zanim ten artefakt może być w pełni przeanalizowany. Orkiestratory MUSZĄ sprawdzić
te zależności przed uruchomieniem pipeline dla artefaktu.

**Reguła**: Artefakt może rozpocząć fazę N tylko gdy WSZYSTKIE jego zależności mają
fazę N ukończoną (P{N}=done). Wyjątek: faza 1 (structure scan) nie wymaga zależności.

| ID | Depends On | Uwagi |
|----|-----------|-------|
| LIB | — | root dependency, brak zależności |
| HPI | — | standalone library |
| WCA | — | standalone C API |
| CAE | LIB, HPI | audio engine, wymaga obu bibliotek |
| RPC | LIB, HPI | RPC service, wymaga obu bibliotek |
| AIR | LIB | GUI app |
| ADM | LIB | GUI app |
| RLB | LIB | GUI app |
| LGM | LIB | GUI app |
| LGE | LIB | GUI app |
| CTH | LIB | GUI app |
| CTD | LIB | daemon |
| PNL | LIB | GUI app |
| CST | LIB | GUI app |
| CSM | LIB | GUI app |
| MON | LIB | GUI app |
| SEL | LIB | GUI app |
| LGN | LIB | GUI app |
| SVC | LIB | daemon |
| VAP | LIB | daemon |
| PAD | LIB | daemon |
| PDD | LIB | daemon |
| RSS | LIB | daemon |
| RPL | LIB | daemon |
| XPT | LIB | web CGI |
| WGT | LIB | web CGI |
| IMP | LIB | importers |
| UTL | LIB | utils/CLI |
| TST | LIB, WCA | tests |
| PYP | LIB | Python PAD API |

## Sessions Log

| Artifact | Faza | Started | Completed | Uwagi |
|----------|------|---------|-----------|-------|
| LIB | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done |
| HPI | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 5 klas, 3025 LOC, brak testow |
| WCA | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. Pure C (nie Qt), 45 par .c/.h, 39 testow, curl+expat |
| CAE | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 3 klasy (MainObject, CaeServer, CaeServerConnection), ~7050 LOC, 3 drivery audio (HPI/JACK/ALSA), brak testow |
| RPC | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 46 klas Qt (MainObject + Switcher abstract + 43 drivery + LocalGpio), ~18800 LOC, strategy/driver pattern, brak testow |
| AIR | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 14 klas Qt (MainWidget + 13 widgetow), ~9030 LOC, UI budowane programowo, brak testow |
| ADM | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 83 klasy Qt (MainWidget + 82 dialogi RDDialog), ~26000 LOC, 80 par .h/.cpp, brak testow |
| CTD | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 2 klasy Qt (MainObject, EventPlayer) + 2 plain C++ (ServerConnection, CatchEvent), ~4840 LOC, 3 pary .h/.cpp + 2 standalone .cpp, brak testow |
| RLB | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 14 klas Qt (MainWidget + 6 RDDialog + 4 RDWidget + LibListView + NoteBubble + AudioControls), ~8990 LOC, 15 par .h/.cpp, brak testow |
| CTH | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 12 klas Qt (MainWidget + 6 RDDialog edycji + DeckMon + CatchListView + VBox + ListReports + AddRecording) + 2 plain C++ (CatchConnector, CatchMonitor), ~7680 LOC, 13 par .h/.cpp, brak testow |
| LGE | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 14 klas (MainWidget + 4 EditEvent subclasses + EditLog + VoiceTracker + RenderDialog + AddMeta + ListReports + 2 ListView + ListListViewItem), ~9100 LOC, 14 par .h/.cpp + 1 globals.h, brak testow |
| LGM | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 26 klas Qt (MainWidget + LogObject + 17 RDDialog + 2 RDWidget + 3 ListView), ~9080 LOC, 26 par .h/.cpp + 1 globals.h + 1 commandline_ops.cpp, dual mode (GUI+CLI), brak testow |
| CST | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainWidget : RDWidget), ~516 LOC, 1 para .h/.cpp + 1 standalone .cpp (local_macros), 4 komendy RML (DL/DP/DS/DX), brak testow |
| PNL | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainWidget : RDWidget), ~520 LOC, 1 para .h/.cpp + 1 globals.h, deleguje do RDSoundPanel/RDStereoMeter z librd, brak testow |
| CSM | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 6 klas Qt (MainWidget:RDWidget + 3 RDDialog + LogModel:QAbstractTableModel + RenderDialog), ~2310 LOC, 6 par .h/.cpp + 1 globals.h, podcast/RSS feed manager, brak testow |
| MON | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 2 klasy Qt (MainWidget:RDWidget + PositionDialog:RDDialog), ~818 LOC, 2 pary .h/.cpp, system monitor applet, brak testow |
| SEL | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainWidget:RDWidget), ~385 LOC, 1 para .h/.cpp, output/system selector, brak testow |
| LGN | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainWidget:RDWidget), ~380 LOC, 1 para .h/.cpp, login/logout utility, brak testow |
| SVC | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject), ~873 LOC, 1 para .h/.cpp + 3 standalone .cpp, supervisor pattern (zarzadza 8 demonami + dropboxy), brak testow |
| VAP | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject), ~1011 LOC, 1 para .h/.cpp + 1 standalone .cpp (local_macros), headless log player (virtual airplay), 11 komend RML, brak testow |
| PAD | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject), ~370 LOC, 1 para .h/.cpp, PyPAD script manager daemon, brak testow |
| RSS | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject), ~253 LOC, 1 para .h/.cpp, RSS feed processor daemon (timer-based), brak testow |
| PDD | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject) + 1 plain C++ (MetadataSource), ~285 LOC, 1 para .h/.cpp, PAD consolidation broker (UNIX socket sources -> TCP clients), brak testow |
| RPL | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject) + 3 plain C++ (ReplConfig, ReplFactory, CitadelXds), ~1199 LOC, 4 pary .h/.cpp, strategy pattern (replication daemon), brak testow |
| WGT | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (MainObject:QObject), ~1061 LOC, 1 para .h/.cpp + 1 webget.js (client-side), CGI pattern (setuid, konstruktor=logika), get/put audio via HTTP, brak testow |
| XPT | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 1 klasa Qt (Xport:QObject), ~4605 LOC, 1 para .h/.cpp + 17 standalone .cpp, CGI web service portal (45 komend API), 46 HTML test forms, 1 C++ test |
| IMP | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 6 programow CLI (MainObject:QObject kazdy), ~2536 LOC, 6 par .h/.cpp + 1 bash script (export_slax), 4 importery z obcych systemow + 2 kopiarki danych, brak testow |
| UTL | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 23 niezaleznych narzedzi (13 CLI + 8 GUI + 1 pure C + 1 dual-mode), ~14500 LOC, 45 .cpp + 35 .h + 2 .c, 33 klasy Qt (MainObject/MainWidget pattern), brak testow |
| PYP | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. Pure Python (nie C++/Qt), 2 klasy (Update, Receiver) w pypad.py (841 LOC), 20 skryptow plugin + 20 exemplar configs, 4 testy, ~2900 LOC, callback pattern (Receiver->Update) |
| TST | 1 | 2026-04-05 | 2026-04-05 | Structure Scan — done. 28 testow C++ (hand-rolled, nie QTest), 28 par .h/.cpp, ~4600 LOC, 45 HTML test forms (web API harness) + 2 JS, 6 testow z Q_OBJECT, 27/28 linkuje librd, pattern: MainObject:QObject constructor-as-test |
| HPI | 2 | 2026-04-05 | 2026-04-05 | Inventory Build — done. 5 klas (1 plain C++, 3 QObject, 1 Q3ListBox), 5 partials, 0 konfliktow, 0 missing. Klasy: RDHPIInformation (data container), RDHPISoundCard (mixer/metering/VOX/mux), RDHPIPlayStream (playback), RDHPIRecordStream (recording, 5-state FSM), RDHPISoundSelector (UI widget, Qt3Support). 10 enumow, ~40 sygnalow/slotow. CRITICAL: cala biblioteka zalezy od asihpi/hpi.h (AudioScience HPI SDK). |
| WCA | 2 | 2026-04-05 | 2026-04-05 | Inventory Build — done. Pure C (nie Qt), 15 struktur danych, 45 funkcji API, 8 utility, 6 helper. 4 partials, 0 konfliktow, 0 missing. Wzorzec: HTTP POST (curl) + XML parse (expat) -> struct. Domeny: cart/cut CRUD, audio import/export/trim, log management, group/service listing, podcast/RSS/image publishing, autentykacja ticket. Platform-agnostic, brak zaleznosci od Rivendell. |
| CAE | 2 | 2026-04-05 | 2026-04-05 | Inventory Build — done. 3 klasy (2 QObject, 1 plain C++), 3 partials, 0 konfliktow, 0 missing. Klasy: MainObject (glowny daemon, dispatch HPI/JACK/ALSA, 33 sloty, playback/record/mixer/metering), CaeServer (serwer TCP, protokol tekstowy 24 komend, 27 sygnalow, autentykacja PW), CaeServerConnection (value object stanu polaczenia). CRITICAL Linux-specific: ALSA, JACK, HPI, pthread/SCHED_FIFO, mlockall, dlopen (kodeki). |
| LIB | 2 | 2026-04-05 | 2026-04-05 | Inventory Build — done. 115 klas (36 QObject, 22 RDDialog, 17 QWidget, 1 QAbstractListModel, 39 plain C++), 191 par .h/.cpp + 13 export_*.cpp + 5 standalone .h. Kluczowe klasy: RDApplication (singleton env), RDCae (audio engine client), RDRipc (RPC/GPIO), RDCart/RDCut (Active Record, audio containers), RDLogPlay (playback engine, 7 deckow), RDSoundPanel (button grid), RDFeed (podcast RSS), RDAudioConvert (multi-codec). Linux-specific: linux/cdrom.h, cdparanoia, libmad/twolame/lame, libcurl, PAM, syslog, GPIO ioctl. |
| LIB | 3 | 2026-04-05 | 2026-04-05 | UI Extraction — done. 0 plikow .ui (wszystko programowe), 19 dialogow, 5 paneli/widgetow. Kluczowe: RDCartDialog (13-kolumnowa lista), RDEditAudio (waveform editor, 10 markerow), RDImportAudio (import/export), RDSoundPanel (siatka przyciskow). |
| LIB | 4 | 2026-04-05 | 2026-04-05 | Call Graph — done. ~180 polaczen connect(), ~85 unikalnych sygnalow, 35 klas emitujacych. 3 cross-artifact TCP: CAE, RIPC, CatchConnect. Kluczowe flow: log playback (segue chain), panel click, notification broadcast, RML commands. |
| LIB | 5 | 2026-04-05 | 2026-04-05 | Facts Mining — done. 65 faktow z kodu (brak testow, brak PDF). Kluczowe reguly: cut validity (dayparting/daty/evergreen), rotation (seq/random), timescaling (83.3%-125%), auth (lokalne/PAM), przejscia logu (segue/play/stop), hard time events. 35+ ograniczen z rd.h. |
| LIB | 6 | 2026-04-05 | 2026-04-05 | SPEC Synthesis — done. 14 sekcji, 4 quality gates. 20 use cases, 12 enumow, 5 state machines, 3 E2E features (log playback, audio import, podcast). Platform Independence Map: 16 komponentow Linux-specific. |
| LIB | 7 | 2026-04-05 | 2026-04-05 | Feature Decomposition — done. 13 FEAT plikow (LIB-001..LIB-013). Topological sort: LIB-013 (config) i LIB-001 (domain) -> LIB-002 (log) -> LIB-003 (playback) -> LIB-005 (panel). Rownoleglosc: LIB-004, LIB-008, LIB-010, LIB-011, LIB-012 moga byc realizowane rownolegle po LIB-001. |
| RPC | 2 | 2026-04-05 | 2026-04-05 | Inventory Build — done. 46 klas (2 QObject core + 41 Switcher driverow + 3 plain C++), 0 konfliktow, 0 missing. Klasy core: MainObject (daemon hub, TCP server, RML dispatch, GPIO tracking, 17 slotow, 17 komend TCP, 18 komend RML), Switcher (abstract base, 5 sygnalow, 6 pure virtual). 41 driverow: 4 kategorie komunikacji (serial TTY, TCP, multicast UDP, hardware API). Linux-specific: JACK, kernel GPIO, HPI, raw sockets, fork/exec, POSIX signals. Strategy/Driver pattern z factory w LoadSwitchDriver(). |
