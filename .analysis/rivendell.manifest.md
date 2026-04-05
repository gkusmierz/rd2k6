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
| LIB | librd | library | LIB | 0 | done | done | done | pending | pending | pending | pending |
| HPI | librdhpi | library | HPI | 0 | pending | pending | pending | pending | pending | pending | pending |
| CAE | caed (Core Audio Engine) | daemon | CAE | 1 | pending | pending | pending | pending | pending | pending | pending |
| RPC | ripcd (RPC/IPC Daemon) | daemon | RPC | 1 | pending | pending | pending | pending | pending | pending | pending |
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
