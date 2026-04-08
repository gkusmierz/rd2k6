---
project: Rivendell
version: 3.6.7
analyzed_at: 2026-04-08
agent_version: 2.0.0
loc_estimate: ~307000
artifacts_count: 28
---

# Project Manifest: Rivendell

## Overview

| Field | Value |
|-------|-------|
| Project | Rivendell |
| Version | 3.6.7 |
| Build System | autotools (Makefile.am) + qmake (.pro) |
| LOC (est.) | ~307,000 |
| Artifacts | 28 |
| Analysis Date | 2026-04-08 |

## Artifacts

| ID | Name | Type | Pri | Folder | Files | Depends On |
|----|------|------|-----|--------|-------|------------|
| LIB | librd | library | 0 | lib/ | 399 | -- |
| HPI | librdhpi | library | 0 | rdhpi/ | 10 | LIB |
| API | rivwebcapi | library | 0 | apis/rivwebcapi/ | 140 | -- |
| CAE | caed | daemon | 1 | cae/ | 7 | LIB, HPI |
| RPC | ripcd | daemon | 1 | ripcd/ | 100 | LIB, HPI |
| SVC | rdservice | daemon | 1 | rdservice/ | 5 | LIB |
| CTD | rdcatchd | daemon | 1 | rdcatchd/ | 8 | LIB |
| RPL | rdrepld | daemon | 1 | rdrepld/ | 8 | LIB |
| VAD | rdvairplayd | daemon | 1 | rdvairplayd/ | 3 | LIB |
| PDD | rdpadengined | daemon | 1 | rdpadengined/ | 2 | LIB |
| PAD | rdpadd | daemon | 1 | rdpadd/ | 2 | LIB |
| RSS | rdrssd | daemon | 1 | rdrssd/ | 2 | LIB |
| AIR | rdairplay | application | 2 | rdairplay/ | 31 | LIB |
| ADM | rdadmin | application | 2 | rdadmin/ | 163 | LIB |
| LBR | rdlibrary | application | 2 | rdlibrary/ | 32 | LIB |
| LGE | rdlogedit | application | 2 | rdlogedit/ | 29 | LIB |
| LGM | rdlogmanager | application | 2 | rdlogmanager/ | 54 | LIB |
| CTH | rdcatch | application | 2 | rdcatch/ | 28 | LIB |
| PNL | rdpanel | application | 3 | rdpanel/ | 3 | LIB |
| CST | rdcartslots | application | 3 | rdcartslots/ | 3 | LIB |
| CSM | rdcastmanager | application | 3 | rdcastmanager/ | 13 | LIB |
| MON | rdmonitor | application | 3 | rdmonitor/ | 4 | LIB |
| SEL | rdselect | application | 3 | rdselect/ | 2 | LIB |
| LGN | rdlogin | application | 3 | rdlogin/ | 2 | LIB |
| UTL | utils | tool | 4 | utils/ | 80 | LIB |
| IMP | importers | tool | 4 | importers/ | 12 | LIB |
| WEB | web (rdxport, webget) | api | 5 | web/ | 21 | LIB |
| TST | tests | test | 9 | tests/ | 56 | LIB |

## Pipeline Status

| ID | Name | Discovery | Extraction | Bridge | Tasks | Impl |
|----|------|-----------|------------|--------|-------|------|
| LIB | librd | done | done | done | pending | pending |
| HPI | librdhpi | done | done | done | pending | pending |
| API | rivwebcapi | done | done | done | pending | pending |
| CAE | caed | done | done | done | pending | pending |
| RPC | ripcd | done | done | done | pending | pending |
| SVC | rdservice | done | done | done | pending | pending |
| CTD | rdcatchd | done | done | done | pending | pending |
| RPL | rdrepld | done | done | done | pending | pending |
| VAD | rdvairplayd | done | done | done | pending | pending |
| PDD | rdpadengined | done | done | done | pending | pending |
| PAD | rdpadd | done | done | done | pending | pending |
| RSS | rdrssd | done | done | done | pending | pending |
| AIR | rdairplay | done | done | done | pending | pending |
| ADM | rdadmin | done | done | pending | pending | pending |
| LBR | rdlibrary | done | done | pending | pending | pending |
| LGE | rdlogedit | done | done | pending | pending | pending |
| LGM | rdlogmanager | done | pending | pending | pending | pending |
| CTH | rdcatch | done | pending | pending | pending | pending |
| PNL | rdpanel | done | pending | pending | pending | pending |
| CST | rdcartslots | done | pending | pending | pending | pending |
| CSM | rdcastmanager | done | pending | pending | pending | pending |
| MON | rdmonitor | done | pending | pending | pending | pending |
| SEL | rdselect | done | pending | pending | pending | pending |
| LGN | rdlogin | done | pending | pending | pending | pending |
| UTL | utils | done | pending | pending | pending | pending |
| IMP | importers | done | pending | pending | pending | pending |
| WEB | web | done | pending | pending | pending | pending |
| TST | tests | done | pending | pending | pending | pending |

Status values: `pending` | `in-progress` | `done` | `failed` | `skip`

## Platform-Specific Components

| Component | Technology | Files Affected | Replacement Needed |
|-----------|-----------|----------------|-------------------|
| Audio Engine (CAE) | ALSA | cae/cae_alsa.cpp, cae/cae.h, cae/cae.cpp | Yes |
| Audio Engine (CAE) | JACK | cae/cae_jack.cpp, cae/cae.h, cae/cae.cpp | Yes |
| Audio Engine (CAE) | HPI (AudioScience) | cae/cae.h, cae/cae.cpp (via librdhpi) | Yes |
| ALSA Config Utility | ALSA | utils/rdalsaconfig/*.cpp, utils/rdalsaconfig/*.h | Yes |
| IPC Daemon (ripcd) | JACK | ripcd/ripcd.cpp, ripcd/ripcd.h | Yes |
| IPC Daemon (ripcd) | HPI | ripcd/ripcd.cpp, ripcd/ripcd.h, ripcd/loaddrivers.cpp | Yes |
| IPC Daemon (ripcd) | Serial/TTY (ModBus) | ripcd/modbus.cpp, ripcd/modbus.h, ripcd/modemlines.cpp | Yes |
| Core Library | ALSA/JACK config | lib/rdconfig.cpp, lib/rdconfig.h, lib/rdstation.cpp, lib/rdstation.h | Yes |
| Core Library | CD Player (/dev/) | lib/rdcdplayer.cpp, lib/rdcdplayer.h | Yes |
| Core Library | Unix Sockets | lib/rdunixsocket.cpp, lib/rdunixserver.cpp | Evaluate |
| Core Library | Ring Buffer | lib/rdringbuffer.cpp, lib/rdringbuffer.h | Evaluate |
| Core Library | TTY Device | lib/rdttydevice.cpp | Evaluate |
| Core Library | GPIO | lib/gpio.h, lib/rdgpio.h, lib/rdgpio.cpp | Yes |
| HPI Library | AudioScience HPI | rdhpi/*.cpp, rdhpi/*.h | Yes |
| Admin App | JACK config UI | rdadmin/edit_jack.cpp, rdadmin/edit_jack.h, rdadmin/edit_jack_client.* | Yes |
| Admin App | ALSA/JACK references | rdadmin/edit_audios.cpp, rdadmin/edit_station.cpp, rdadmin/view_adapters.cpp | Yes |
| DB Manager | ALSA/JACK schema refs | utils/rddbmgr/create.cpp, utils/rddbmgr/updateschema.cpp, utils/rddbmgr/revertschema.cpp | Evaluate |
| PyPAD API | Python PAD scripting | apis/pypad/ | Evaluate |

## Dependency Graph

```mermaid
graph TD
    %% Libraries (priority 0)
    LIB[LIB: librd]
    HPI[HPI: librdhpi]
    API[API: rivwebcapi]

    %% Daemons (priority 1)
    CAE[CAE: caed]
    RPC[RPC: ripcd]
    SVC[SVC: rdservice]
    CTD[CTD: rdcatchd]
    RPL[RPL: rdrepld]
    VAD[VAD: rdvairplayd]
    PDD[PDD: rdpadengined]
    PAD[PAD: rdpadd]
    RSS[RSS: rdrssd]

    %% Applications (priority 2)
    AIR[AIR: rdairplay]
    ADM[ADM: rdadmin]
    LBR[LBR: rdlibrary]
    LGE[LGE: rdlogedit]
    LGM[LGM: rdlogmanager]
    CTH[CTH: rdcatch]

    %% Secondary Applications (priority 3)
    PNL[PNL: rdpanel]
    CST[CST: rdcartslots]
    CSM[CSM: rdcastmanager]
    MON[MON: rdmonitor]
    SEL[SEL: rdselect]
    LGN[LGN: rdlogin]

    %% Tools (priority 4)
    UTL[UTL: utils]
    IMP[IMP: importers]

    %% API/Web (priority 5)
    WEB[WEB: web]

    %% Tests (priority 9)
    TST[TST: tests]

    %% Dependencies
    HPI --> LIB
    CAE --> LIB
    CAE --> HPI
    RPC --> LIB
    RPC --> HPI
    SVC --> LIB
    CTD --> LIB
    RPL --> LIB
    VAD --> LIB
    PDD --> LIB
    PAD --> LIB
    RSS --> LIB
    AIR --> LIB
    ADM --> LIB
    LBR --> LIB
    LGE --> LIB
    LGM --> LIB
    CTH --> LIB
    PNL --> LIB
    CST --> LIB
    CSM --> LIB
    MON --> LIB
    SEL --> LIB
    LGN --> LIB
    UTL --> LIB
    IMP --> LIB
    WEB --> LIB
    TST --> LIB
```

## Sessions Log

| Date | Agent | Artifact | Phase | Duration | Status |
|------|-------|----------|-------|----------|--------|
| 2026-04-08 | Discovery v2.0.0 | ALL | Discovery | -- | done |
