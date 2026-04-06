---
phase: 0
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
project_name: rivendell
---

# Rivendell — Project Manifest

## Project Profile

| Pole | Wartość |
|------|---------|
| Nazwa | Rivendell Radio Automation System |
| Wersja | 3.6.7 |
| Język | C++ / Qt4 (QtCore, QtGui, QtNetwork, QtSql, QtXml, Qt3Support) |
| Build system | autotools (configure.ac + Makefile.am); qmake tylko do i18n |
| Licencja | GPL v2 |
| Linie kodu (est.) | ~282 000 |
| Plików źródłowych (.cpp + .h) | 1134 |
| Plików .ui | 0 (UI budowane kodem) |
| Plików .qml | 0 |
| Plików .py (pypad API) | 27 |

## Platform-specific Components (TO REPLACE in clone)

| Komponent | Technologia | Używany przez | Priorytet zastąpienia |
|-----------|-------------|---------------|----------------------|
| Audio engine | ALSA, JACK, AudioScience HPI | CAE (caed) | CRITICAL |
| Audio routing / switchers | Serial protocols (BT, Quartz, SAS, Starguide, Logitek, Harlequin, ...) | RPC (ripcd) | CRITICAL |
| Database | MySQL / MariaDB (via QtSql) | LIB (librd), wszystkie aplikacje | CRITICAL |
| Audio codecs | libvorbis, libsndfile, FLAC, libsamplerate | LIB, CAE, rdxport | HIGH |
| Disc metadata | MusicBrainz (libdiscid, libmusicbrainz5, libcoverart) | LIB | MEDIUM |
| GPIO | Kernel GPIO (/dev/gpio) | RPC (ripcd) | MEDIUM |
| IPC | TCP socket protocol (nie D-Bus) | CAE↔apps, RIPC (rdripc w lib) | HIGH |

## Artifacts

| ID | Nazwa | Typ | Prefix | Pri | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|----|-------|-----|--------|-----|----|----|----|----|----|----|-----|
| LIB | librd | library | LIB | 0 | done | done | done | done | done | done | done |
| HPI | librdhpi | library | HPI | 0 | done | done | done | done | done | done | done |
| CAE | caed (Core Audio Engine) | daemon | CAE | 1 | done | done | done | done | done | done | done |
| RPC | ripcd (RPC/IPC Daemon) | daemon | RPC | 1 | done | done | done | done | done | done | done |
| SVC | rdservice (Service Manager) | daemon | SVC | 2 | pending | pending | pending | pending | pending | pending | pending |
| ADM | rdadmin | application | ADM | 3 | pending | pending | pending | pending | pending | pending | pending |
| AIR | rdairplay | application | AIR | 3 | pending | pending | pending | pending | pending | pending | pending |
| RLB | rdlibrary | application | RLB | 3 | pending | pending | pending | pending | pending | pending | pending |
| LGE | rdlogedit | application | LGE | 3 | pending | pending | pending | pending | pending | pending | pending |
| LGM | rdlogmanager | application | LGM | 4 | pending | pending | pending | pending | pending | pending | pending |
| PNL | rdpanel | application | PNL | 4 | pending | pending | pending | pending | pending | pending | pending |
| CTH | rdcatch | application | CTH | 4 | pending | pending | pending | pending | pending | pending | pending |
| CTD | rdcatchd | daemon | CTD | 4 | pending | pending | pending | pending | pending | pending | pending |
| CST | rdcastmanager | application | CST | 5 | pending | pending | pending | pending | pending | pending | pending |
| CSM | rdcartslots | application | CSM | 5 | pending | pending | pending | pending | pending | pending | pending |
| SEL | rdselect | application | SEL | 6 | pending | pending | pending | pending | pending | pending | pending |
| LGN | rdlogin | application | LGN | 6 | pending | pending | pending | pending | pending | pending | pending |
| MON | rdmonitor | application | MON | 6 | pending | pending | pending | pending | pending | pending | pending |
| RPL | rdrepld (Replication Daemon) | daemon | RPL | 6 | pending | pending | pending | pending | pending | pending | pending |
| PDD | rdpadengined (PAD Engine) | daemon | PDD | 6 | pending | pending | pending | pending | pending | pending | pending |
| PAD | rdpadd (PAD Daemon) | daemon | PAD | 6 | pending | pending | pending | pending | pending | pending | pending |
| RSS | rdrssd (RSS Daemon) | daemon | RSS | 6 | pending | pending | pending | pending | pending | pending | pending |
| VAD | rdvairplayd (Virtual Airplay) | daemon | VAD | 6 | pending | pending | pending | pending | pending | pending | pending |
| IMP | importers (nexgen/sas/wings_filter) | tool | IMP | 7 | pending | pending | pending | pending | pending | pending | pending |
| PYP | pypad (Python PAD API) | api | PYP | 7 | pending | pending | pending | pending | pending | pending | pending |
| RWC | rivwebcapi (C Web API) | api | RWC | 7 | pending | pending | pending | pending | pending | pending | pending |
| WEB | rdxport.cgi + webget.cgi | web | WEB | 7 | pending | pending | pending | pending | pending | pending | pending |

Statusy kolumn P1-P7: `pending` -> `in-progress` -> `done` | `failed` | `skip`
Fazy wypelniaja sie od lewej do prawej. Orkiestratory czytaja te tabele jako jedyne zrodlo prawdy.

### Utilities (niski priorytet, potencjalnie skip)

| Narzędzie | Opis |
|-----------|------|
| rddbmgr | Database schema manager (create/update/revert) |
| rddbconfig | Database configuration UI |
| rdimport | CLI audio importer |
| rdexport | CLI audio exporter |
| rdrender | Log renderer |
| rdclilogedit | CLI log editor |
| rmlsend | RML (macro language) sender |
| rdgpimon | GPIO monitor UI |
| rddiscimport | Disc import UI |
| rddgimport | DG Systems importer |
| rdalsaconfig | ALSA configuration UI |
| rdsoftkeys | Soft keys UI |
| rdgen | Audio generator |
| rddelete | Cart/cut deleter |
| rdmaint | Maintenance tool |
| rdcollect | Audio collector |
| rdcheckcuts | Cut integrity checker |
| rdmetadata | Metadata tool |
| rdcleandirs | Directory cleaner |
| rdmarkerset | Marker setter |
| rdpopup | Popup utility |
| rdconvert | Audio converter |
| rdselect_helper | Select helper |

Utilities korzystają z librd (@LIB_RDLIBS@) ale nie wnoszą nowej logiki biznesowej.
Rekomendacja: skip lub analizuj wybiórczo (rddbmgr ma 10k+ LOC — kluczowy dla schematu DB).

## Dependency Graph (inter-artifact)

| ID | Depends On | Uwagi |
|----|-----------|-------|
| LIB | — | root dependency, wszystkie targety linkują @LIB_RDLIBS@ |
| HPI | — | standalone library, opcjonalna (AudioScience hardware) |
| CAE | LIB, HPI | Core Audio Engine, linkuje ALSA/JACK/HPI |
| RPC | LIB, HPI | IPC daemon, linkuje JACK/HPI, driver switchers |
| SVC | LIB | Service manager daemon |
| ADM | LIB | Admin UI, linkuje libsamplerate |
| AIR | LIB | Main playout application |
| RLB | LIB | Library/cart manager |
| LGE | LIB | Log editor |
| LGM | LIB | Log manager |
| PNL | LIB | Sound panel |
| CTH | LIB | Catch (scheduled events) UI |
| CTD | LIB | Catch daemon |
| CST | LIB | Podcast/cast manager |
| CSM | LIB | Cart slots display |
| SEL | LIB | System selector |
| LGN | LIB | Login |
| MON | LIB | System monitor |
| RPL | LIB | Replication daemon |
| PDD | LIB | PAD engine daemon |
| PAD | LIB | PAD daemon |
| RSS | LIB | RSS feed daemon |
| VAD | LIB | Virtual airplay daemon |
| IMP | LIB | Import filters |
| PYP | — | Python API, standalone |
| RWC | — | C API (librivwebcapi), standalone |
| WEB | LIB | CGI web services (rdxport, webget) |

## Sessions Log

| Artifact | Faza | Started | Completed | Uwagi |
|----------|------|---------|-----------|-------|
| LIB | 1 | 2026-04-05 | 2026-04-05 | Structure Scan |
| LIB | 2 | 2026-04-05 | 2026-04-05 | Inventory Build — 193 klas, 82 tabele DB, ERD + class diagrams |
| LIB | 3 | 2026-04-05 | 2026-04-05 | UI Extraction — 43 UI contracts (24 dialogs, 7 widgets, 12 controls), TRYB B, 11 screenshotów zmapowanych, spot-check 3/3 PASS |
| LIB | 4 | 2026-04-06 | 2026-04-06 | Signal & Call Graph — 97 connect(), 78 sygnałów, 28 klas emitujących, 9 cross-artifact (TCP/IPC/UDP), 2 circular deps (intentional), 4 sequence diagrams + dependency graph Mermaid, spot-check 3/3 PASS |
| LIB | 5 | 2026-04-06 | 2026-04-06 | Facts Mining — 3 źródła (kod+testy+docs XML), 135 faktów, 40+ reguł Gherkin, 3 state machines, 2 konflikty kod↔doc, 14 edge cases z testów, 32 potwierdzone cross-source, spot-check 3/3 PASS |
| LIB | 6 | 2026-04-06 | 2026-04-06 | SPEC Synthesis — nawigacyjny PRD, 16 sekcji, 21 use cases, 10 kluczowych reguł Gherkin, 3 state machines, 4 protokoły TCP (CAE/RIPC/Catch + metering UDP), 45 RDXport HTTP komend, 3 E2E scenariusze, 4/4 Quality Gates PASS |
| LIB | 7 | 2026-04-06 | 2026-04-06 | Feature Decomposition — 9 FEAT plików (LIB-001..LIB-009), 21 UC pokrytych, topological sort bez cykli, ~260KB łącznie, ~57 Working Packages |
| HPI | 1 | 2026-04-06 | 2026-04-06 | Structure Scan — 5 klas (RDHPISoundCard, RDHPIPlayStream, RDHPIRecordStream, RDHPISoundSelector, RDHPIInformation), 10 plików źródłowych, ~3480 LOC, warunkowa kompilacja (ifdef HPI), brak testów |
| HPI | 2 | 2026-04-06 | 2026-04-06 | Inventory Build — 5 klas (3 QObject, 1 Q3ListBox, 1 plain C++), 0 tabel DB, class diagrams Mermaid, spot-check 3/3 PASS |
| HPI | 3 | 2026-04-06 | 2026-04-06 | UI Extraction — 1 widget (RDHPISoundSelector Q3ListBox), TRYB B, brak .ui/.qml, spot-check 1/1 PASS |
| HPI | 4 | 2026-04-06 | 2026-04-06 | Signal & Call Graph — 5 connect(), 34 emit(), 23 sygnaly, 4 klasy emitujace, 2 cross-artifact (CAE/RPC via #ifdef HPI), 0 circular deps, 3 sequence diagrams + dependency graph, spot-check 3/3 PASS |
| HPI | 5 | 2026-04-06 | 2026-04-06 | Facts Mining — 1 zrodlo (kod), 42 fakty, 18 regul Gherkin, 2 state machines, 6 edge cases, 0 konfliktow, spot-check 3/3 PASS |
| HPI | 6 | 2026-04-06 | 2026-04-06 | SPEC Synthesis — nawigacyjny PRD, 16 sekcji, 8 use cases, 8 regul Gherkin, 2 state machines, 0 protokolow (pure library), 3 E2E scenariusze, 4/4 Quality Gates PASS |
| HPI | 7 | 2026-04-06 | 2026-04-06 | Feature Decomposition — 3 FEAT pliki (HPI-001..HPI-003), 8 UC pokrytych, topological sort bez cykli, ~14 Working Packages |
| CAE | 1 | 2026-04-06 | 2026-04-06 | Structure Scan — 3 klasy (MainObject, CaeServer, CaeServerConnection), 7 plikow zrodlowych, ~7423 LOC, 3 audio drivers (ALSA/JACK/HPI), brak testow |
| CAE | 2 | 2026-04-06 | 2026-04-06 | Inventory Build — 3 klasy (2 QObject, 1 plain C++), 0 wlasnych tabel DB (3 uzywane z librd), 27 sygnalow CaeServer, ~30 slotow MainObject, 3 drivery audio z identycznym interfejsem, class diagrams + ERD Mermaid, spot-check 3/3 PASS |
| CAE | 3 | 2026-04-06 | 2026-04-06 | UI Extraction — N/A (headless daemon, QCoreApplication), 0 okien/dialogow/widgetow, brak .ui/.qml, protokol TCP/UDP jako jedyny interfejs |
| CAE | 4 | 2026-04-06 | 2026-04-06 | Signal & Call Graph — 31 connect(), 27 sygnalow CaeServer, 1 klasa emitujaca, 1 cross-artifact (TCP protocol), 0 circular deps, 4 sequence diagrams + dependency graph Mermaid, pelna referencja protokolu CAE (26 komend), spot-check 3/3 PASS |
| CAE | 5 | 2026-04-06 | 2026-04-06 | Facts Mining — 1 zrodlo (kod), 52 fakty, 14 use cases, 8 regul Gherkin, 3 state machines (Playback/Recording/Connection), 14 ograniczen/limitow, 11 komponentow Linux-specific, 0 konfliktow, spot-check 3/3 PASS |
| CAE | 6 | 2026-04-06 | 2026-04-06 | SPEC Synthesis — nawigacyjny PRD, 16 sekcji, 14 use cases, 5 regul Gherkin, 3 state machines, pelna referencja protokolu CAE (26 komend TCP + 4 typy UDP), 14 komponentow Platform Independence Map, 3 E2E scenariusze, 4/4 Quality Gates PASS |
| CAE | 7 | 2026-04-06 | 2026-04-06 | Feature Decomposition — 6 FEAT plikow (CAE-001..CAE-006), 14 UC pokrytych, topological sort bez cykli, ~38 Working Packages |
| RPC | 1 | 2026-04-06 | 2026-04-06 | Structure Scan — 47 klas (MainObject, Switcher base, 42 drivery, RipcdConnection, 2 DTOs), 51 .cpp + 49 .h, ~18801 LOC, autotools target, brak testow wlasnych |
| RPC | 2 | 2026-04-06 | 2026-04-06 | Inventory Build — 47 klas (2 QObject core, 42 Switcher subclass, 3 plain C++), 7 tabel DB (MATRICES, GPIS, GPOS, TTYS, INPUTS, OUTPUTS, VGUEST_RESOURCES), class diagrams + ERD Mermaid, spot-check 3/3 PASS |
| RPC | 3 | 2026-04-06 | 2026-04-06 | UI Extraction — N/A (headless daemon, QApplication false), 0 okien/dialogow/widgetow, protokol TCP/UDP jako jedyny interfejs |
| RPC | 4 | 2026-04-06 | 2026-04-06 | Signal & Call Graph — ~120 connect(), ~300+ emit(), 43 klasy emitujace, 4 cross-artifact (RIPC TCP, RML UDP x3, multicast), 0 circular deps, 4 sequence diagrams + dependency graph Mermaid, pelna referencja protokolow RIPC + RML, spot-check 3/3 PASS |
| RPC | 5 | 2026-04-06 | 2026-04-06 | Facts Mining — 2 zrodla (kod + docs/apis/ripc.xml), 58 faktow, 14 use cases, 10+ regul Gherkin, 3 state machines, 17 ograniczen/limitow, 9 komponentow Linux-specific, 0 konfliktow, spot-check 3/3 PASS |
| RPC | 6 | 2026-04-06 | 2026-04-06 | SPEC Synthesis — nawigacyjny PRD, 16 sekcji, 14 use cases, 5 kluczowych regul Gherkin, 3 state machines, pelna referencja protokolow RIPC (13 komend) + RML (27 komend), 8 komponentow Platform Independence Map, 3 E2E scenariusze, 4/4 Quality Gates PASS |
| RPC | 7 | 2026-04-06 | 2026-04-06 | Feature Decomposition — 6 FEAT plikow (RPC-001..RPC-006), 14 UC pokrytych, topological sort bez cykli, ~37 Working Packages |
