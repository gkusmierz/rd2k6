---
partial_id: "058"
class: RDDropbox
sources:
  - lib/rddropbox.h
  - lib/rddropbox.cpp
status: done
phase: 2
---

# RDDropbox — Dropbox (Auto-Import) Configuration Model

## Purpose

Represents a dropbox configuration -- a monitored filesystem directory that automatically imports audio files into the Rivendell cart library. Provides property-level read/write access to all dropbox settings including import behavior, normalization, date handling, metadata extraction, and logging options.

## Constructor

- `RDDropbox(int id, const QString &stationname="")` — If `id < 0`, creates a new dropbox record in DB for the given station and retrieves the auto-generated ID. If `id >= 0`, attaches to the existing record.

## Public Interface

### Identity & Assignment
| Method | Returns | Description |
|--------|---------|-------------|
| `id()` | `int` | Database record ID |
| `duplicate()` | `int` | Creates a full clone of this dropbox, returns new ID |
| `stationName()` / `setStationName(name)` | `QString` / `void` | Owning station |
| `groupName()` / `setGroupName(name)` | `QString` / `void` | Target cart group |

### Path & Import Behavior
| Method | Returns | Description |
|--------|---------|-------------|
| `path()` / `setPath(path)` | `QString` / `void` | Monitored directory path |
| `singleCart()` / `setSingleCart(state)` | `bool` / `void` | Import all files into one cart |
| `toCart()` / `setToCart(cart)` | `unsigned` / `void` | Specific target cart number |
| `useCartchunkId()` / `setUseCartchunkId(state)` | `bool` / `void` | Use CartChunk ID from file metadata for cart number |
| `titleFromCartchunkId()` / `setTitleFromCartchunkId(state)` | `bool` / `void` | Use CartChunk ID as cart title |
| `deleteCuts()` / `setDeleteCuts(state)` | `bool` / `void` | Delete existing cuts before import |
| `deleteSource()` / `setDeleteSource(state)` | `bool` / `void` | Delete source file after import |
| `metadataPattern()` / `setMetadataPattern(str)` | `QString` / `void` | Filename pattern for metadata extraction |
| `userDefined()` / `setUserDefined(str)` | `QString` / `void` | User-defined field value to set on import |
| `fixBrokenFormats()` / `setFixBrokenFormats(state)` | `bool` / `void` | Attempt to fix malformed audio files |

### Audio Processing
| Method | Returns | Description |
|--------|---------|-------------|
| `normalizationLevel()` / `setNormalizationLevel(lvl)` | `int` / `void` | Target normalization level (dBFS) |
| `autotrimLevel()` / `setAutotrimLevel(lvl)` | `int` / `void` | Auto-trim silence threshold (dBFS) |
| `forceToMono()` / `setForceToMono(state)` | `bool` / `void` | Downmix to mono |
| `segueLevel()` / `setSegueLevel(level)` | `int` / `void` | Segue detection level |
| `segueLength()` / `setSegueLength(length)` | `int` / `void` | Segue length |

### Date Scheduling
| Method | Returns | Description |
|--------|---------|-------------|
| `startdateOffset()` / `setStartdateOffset(offset)` | `int` / `void` | Days offset for start date |
| `enddateOffset()` / `setEnddateOffset(offset)` | `int` / `void` | Days offset for end date |
| `createDates()` / `setCreateDates(state)` | `bool` / `void` | Whether to create date range on import |
| `createStartdateOffset()` / `setCreateStartdateOffset(offset)` | `int` / `void` | Start date offset for newly created dates |
| `createEnddateOffset()` / `setCreateEnddateOffset(offset)` | `int` / `void` | End date offset for newly created dates |

### Notifications & Logging
| Method | Returns | Description |
|--------|---------|-------------|
| `sendEmail()` / `setSendEmail(state)` | `bool` / `void` | Send email on import |
| `logToSyslog()` / `setLogToSyslog(state)` | `bool` / `void` | Log to syslog |
| `logPath()` / `setLogPath(path)` | `QString` / `void` | Custom log file path |

## Database Mapping

| Table | Key Column | Key Value | CRUD |
|-------|-----------|-----------|------|
| `DROPBOXES` | `ID` | `box_id` | C/R/U |

### Columns Accessed

| DB Column | Property | Type |
|-----------|----------|------|
| `STATION_NAME` | stationName | string |
| `GROUP_NAME` | groupName | string |
| `PATH` | path | string |
| `NORMALIZATION_LEVEL` | normalizationLevel | int |
| `AUTOTRIM_LEVEL` | autotrimLevel | int |
| `SINGLE_CART` | singleCart | Y/N |
| `FORCE_TO_MONO` | forceToMono | Y/N |
| `TO_CART` | toCart | unsigned |
| `USE_CARTCHUNK_ID` | useCartchunkId | Y/N |
| `TITLE_FROM_CARTCHUNK_ID` | titleFromCartchunkId | Y/N |
| `DELETE_CUTS` | deleteCuts | Y/N |
| `DELETE_SOURCE` | deleteSource | Y/N |
| `SEND_EMAIL` | sendEmail | Y/N |
| `METADATA_PATTERN` | metadataPattern | string |
| `SET_USER_DEFINED` | userDefined | string |
| `STARTDATE_OFFSET` | startdateOffset | int |
| `ENDDATE_OFFSET` | enddateOffset | int |
| `FIX_BROKEN_FORMATS` | fixBrokenFormats | Y/N |
| `LOG_TO_SYSLOG` | logToSyslog | Y/N |
| `LOG_PATH` | logPath | string |
| `IMPORT_CREATE_DATES` | createDates | Y/N |
| `CREATE_STARTDATE_OFFSET` | createStartdateOffset | int |
| `CREATE_ENDDATE_OFFSET` | createEnddateOffset | int |
| `SEGUE_LEVEL` | segueLevel | int |
| `SEGUE_LENGTH` | segueLength | int |

## Key Behaviors

1. **Auto-create**: Passing `id=-1` creates a new DB row and retrieves the auto-incremented ID.
2. **Duplication**: `duplicate()` creates a complete copy with a new ID, preserving all settings.
3. **Lazy loading**: No caching -- every property getter issues a SQL SELECT.

## Dependencies

- Not a QObject, plain C++ class
