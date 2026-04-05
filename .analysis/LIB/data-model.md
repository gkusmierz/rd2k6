---
phase: 2
artifact: LIB
status: done
tables_total: 82
crud_classes: 45
---

# Data Model: librd

## ERD — Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        varchar LOGIN_NAME PK
        varchar FULL_NAME
        varchar PHONE_NUMBER
        varchar EMAIL_ADDRESS
        varchar ENABLE_WEB
        varchar ADMIN_CONFIG_PRIV
    }
    STATIONS {
        varchar NAME PK
        varchar SHORT_NAME
        varchar DESCRIPTION
        varchar DEFAULT_NAME
        varchar HTTP_STATION
        varchar CAE_STATION
        int TIME_OFFSET
    }
    CART {
        int NUMBER PK
        int TYPE
        varchar GROUP_NAME FK
        varchar TITLE
        varchar ARTIST
        varchar AGENCY
        varchar FORCED_LENGTH
        int CUT_QUANTITY
        int LAST_CUT_PLAYED
    }
    CUTS {
        varchar CUT_NAME PK
        int CART_NUMBER FK
        varchar DESCRIPTION
        int WEIGHT
        int LENGTH
        int START_POINT
        int END_POINT
        int SEGUE_START_POINT
        int SEGUE_END_POINT
        varchar SHA1_HASH
        varchar ORIGIN_NAME
    }
    GROUPS {
        varchar NAME PK
        varchar DESCRIPTION
        int DEFAULT_CART_TYPE
        int DEFAULT_LOW_CART
        int DEFAULT_HIGH_CART
        varchar COLOR
    }
    LOGS {
        varchar NAME PK
        int TYPE
        varchar SERVICE FK
        varchar DESCRIPTION
        varchar ORIGIN_USER
        datetime ORIGIN_DATETIME
        int SCHEDULED_TRACKS
        int COMPLETED_TRACKS
    }
    SERVICES {
        varchar NAME PK
        varchar DESCRIPTION
        varchar NAME_TEMPLATE
        varchar DESCRIPTION_TEMPLATE
        varchar PROGRAM_CODE
        int AUTO_REFRESH
    }
    EVENTS {
        varchar NAME PK
        varchar REMARKS
        int PREIMPORT_CMD
        int POSTIMPORT_CMD
        varchar SCHED_GROUP FK
    }
    CLOCKS {
        varchar NAME PK
        varchar SHORT_NAME
        varchar COLOR
        varchar REMARKS
    }
    RECORDINGS {
        int ID PK
        varchar STATION_NAME FK
        int TYPE
        int CHANNEL
        varchar CUT_NAME FK
        time START_TIME
        time END_TIME
    }
    FEEDS {
        int ID PK
        varchar KEY_NAME
        varchar CHANNEL_TITLE
        varchar CHANNEL_DESCRIPTION
        varchar BASE_URL
        int MAX_SHELF_LIFE
    }
    PODCASTS {
        int ID PK
        int FEED_ID FK
        varchar ITEM_TITLE
        varchar ITEM_DESCRIPTION
        int STATUS
    }
    MATRICES {
        int ID PK
        varchar STATION_NAME FK
        int TYPE
        varchar NAME
        int INPUTS
        int OUTPUTS
        int GPIS
        int GPOS
    }
    DROPBOXES {
        int ID PK
        varchar STATION_NAME FK
        varchar GROUP_NAME FK
        varchar PATH
        int TO_CART
    }
    SYSTEM {
        int ID PK
        int DUP_CART_TITLES
        int FIX_DUP_CART_TITLES
        int SAMPLE_RATE
        varchar ISCI_XREFERENCE_PATH
    }

    GROUPS ||--o{ CART : "owns"
    CART ||--o{ CUTS : "contains"
    SERVICES ||--o{ LOGS : "produces"
    STATIONS ||--o{ RECORDINGS : "hosts"
    STATIONS ||--o{ MATRICES : "has"
    STATIONS ||--o{ DROPBOXES : "monitors"
    FEEDS ||--o{ PODCASTS : "publishes"
    GROUPS ||--o{ DROPBOXES : "targets"
    USERS ||--o{ USER_PERMS : "has"
    GROUPS ||--o{ USER_PERMS : "grants"
    EVENTS }o--|| GROUPS : "schedules from"
```

## Tabele główne (używane przez librd)

### CART
Centralny kontener audio — każdy cart ma unikalny NUMBER i zawiera 1+ cutów.

| Kolumna kluczowa | Typ | Opis |
|---------|-----|------|
| NUMBER | int PK | Numer carta (1-999999) |
| TYPE | int | 1=Audio, 2=Macro |
| GROUP_NAME | varchar FK→GROUPS | Grupa właścicielska |
| TITLE | varchar | Tytuł |
| ARTIST | varchar | Artysta |
| CUT_QUANTITY | int | Liczba cutów |
| FORCED_LENGTH | int | Wymuszona długość (ms) |

**Klasy CRUD:** RDCart (full CRUD), RDLogLine (READ), RDSvc (READ)
**Operacje:** CREATE / READ / UPDATE / DELETE (cascade)

### CUTS
Segment audio w carcie — dane o markerach, datach ważno��ci, audio metadata.

| Kolumna kluczowa | Typ | Opis |
|---------|-----|------|
| CUT_NAME | varchar PK | Format NNNNNN_NNN |
| CART_NUMBER | int FK→CART | Numer carta |
| LENGTH | int | Długość (ms) |
| START_POINT/END_POINT | int | Markery start/end (ms) |
| SEGUE_START/END_POINT | int | Markery segue (ms) |
| TALK_START/END_POINT | int | Markery talk (ms) |
| EVERGREEN | enum | Y/N |
| START_DATETIME/END_DATETIME | datetime | Zakres ważności |

**Klasy CRUD:** RDCut (full CRUD), RDLogEvent (READ), RDCart (READ/DELETE)

### LOGS
Playlista radiowa — uporządkowana lista eventów.

**Klasy CRUD:** RDLog (full CRUD), RDLogEvent (READ/WRITE via LOG_LINES)

### LOG_LINES (dynamicznie tworzone per log)
Linie logu — każdy log ma tabelę `{LOG_NAME}_LOG` z liniami eventów.

**Klasy CRUD:** RDLogEvent (full CRUD), RDLogLine (READ)

### USERS
Użytkownicy systemu z uprawnieniami.

**Klasy CRUD:** RDUser (full CRUD)

### STATIONS
Stacje robocze (hosty) z konfiguracją sprzętową.

**Klasy CRUD:** RDStation (full CRUD — cascade 30+ tabel)

### GROUPS
Grupy cartów z zakresami numeracji i regułami.

**Klasy CRUD:** RDGroup (full CRUD), RDCart (READ)

### SERVICES
Serwisy (stacje radiowe / programy).

**Klasy CRUD:** RDSvc (full CRUD)

### EVENTS
Eventy schedulera — definicje bloków programowych.

**Klasy CRUD:** RDEvent (full CRUD)

### CLOCKS
Zegary (szablony godzinne) schedulera.

**Klasy CRUD:** RDClock (full CRUD)

### RECORDINGS
Zaplanowane nagrania.

**Klasy CRUD:** RDRecording (full CRUD)

### FEEDS / PODCASTS
Podcasty i feedy RSS.

**Klasy CRUD:** RDFeed (full CRUD), RDPodcast (full CRUD)

### MATRICES
Matrycy audio switcherów.

**Klasy CRUD:** RDMatrix (READ/UPDATE)

### DROPBOXES
Auto-import (watchfolder).

**Klasy CRUD:** RDDropbox (full CRUD)

## Tabele konfiguracyjne

| Tabela | Klasa C++ | Zakres |
|--------|-----------|--------|
| RDAIRPLAY | RDAirplayConf | Konfiguracja per stacja |
| RDLIBRARY | RDLibraryConf | Konfiguracja per stacja |
| RDLOGEDIT | RDLogeditConf | Konfiguracja per stacja |
| RDCATCH | RDCatchConf | Konfiguracja per stacja |
| RDPANEL | — | Konfiguracja paneli per stacja |
| AUDIO_CARDS | RDStation (indirect) | Karty audio per stacja |
| AUDIO_INPUTS / AUDIO_OUTPUTS | RDAudioPort | Porty audio per karta |
| DECKS | RDDeck | Decki nagrywania per stacja |
| TTYS | RDTty | Porty szeregowe |
| SYSTEM | RDSystem | Ustawienia globalne |

## Tabele uprawnień (join tables)

| Tabela | Relacja | Klasa C++ |
|--------|---------|-----------|
| USER_PERMS | USERS ↔ GROUPS | RDUser |
| FEED_PERMS | USERS ↔ FEEDS | RDUser |
| AUDIO_PERMS | GROUPS ↔ SERVICES | — |
| SERVICE_PERMS | STATIONS ↔ SERVICES | — |
| CLOCK_PERMS | SERVICES ↔ CLOCKS | — |
| EVENT_PERMS | SERVICES ↔ EVENTS | — |
| USER_SERVICE_PERMS | USERS ↔ SERVICES | — |

## Tabele eventów/logów

| Tabela | Opis | Klasa C++ |
|--------|------|-----------|
| HOSTVARS | Zmienne hostowe (key-value per stacja) | RDRipc, RDMacroEvent |
| WEBAPI_AUTHS | Tokeny API (SHA1 + IP + expiry) | RDApplication, RDUser |
| CUT_EVENTS | Eventy cutów (play log) | RDCut |
| SCHED_CODES | Kody schedulera | RDSchedCode |
| CART_SCHED_CODES | Cart ↔ Sched Code mapping | RDCart |
| REPL_CART_STATE / REPL_CUT_STATE | Stan replikacji | RDCart, RDReplicator |

## Mapowanie Tabela ↔ Klasa C++

| Tabela DB | Klasa C++ | Wzorzec | Operacje |
|-----------|-----------|---------|----------|
| CART | RDCart | Active Record | CRUD |
| CUTS | RDCut | Active Record | CRUD |
| LOGS | RDLog | Active Record | CRUD |
| LOG_LINES (dynamic) | RDLogEvent | Active Record | CRUD |
| USERS | RDUser | Active Record | CRUD |
| STATIONS | RDStation | Active Record | CRUD (cascade 30+) |
| GROUPS | RDGroup | Active Record | CRUD |
| SERVICES | RDSvc | Active Record | CRUD |
| EVENTS | RDEvent | Active Record | CRUD |
| CLOCKS | RDClock | Active Record | CRUD |
| RECORDINGS | RDRecording | Active Record | CRUD |
| FEEDS | RDFeed | Active Record | CRUD |
| PODCASTS | RDPodcast | Active Record | CRUD |
| REPORTS | RDReport | Active Record | CRUD |
| MATRICES | RDMatrix | Active Record | RU |
| DROPBOXES | RDDropbox | Active Record | CRUD |
| REPLICATORS | RDReplicator | Active Record | CRUD |
| DECKS | RDDeck | Active Record | RU |
| TTYS | RDTty | Active Record | RU |
| RDAIRPLAY | RDAirplayConf | Config Reader | RU |
| RDLIBRARY | RDLibraryConf | Config Reader | RU |
| RDLOGEDIT | RDLogeditConf | Config Reader | RU |
| RDCATCH | RDCatchConf | Config Reader | RU |
| SYSTEM | RDSystem | Config Reader | RU |
| AUDIO_PORTS (via AUDIO_INPUTS/OUTPUTS) | RDAudioPort | Config Reader | RU |
| HOTKEYS | RDHotKeys/RDHotKeyList | Config Reader | CR |
| HOSTVARS | RDRipc (READ) | Lookup | R |
| WEBAPI_AUTHS | RDUser, RDApplication | Auth Token | CRUD |
| SCHED_CODES | RDSchedCode | Active Record | CRUD |
