---
partial_id: "029"
class: RDSvc
source_files:
  - lib/rdsvc.h
  - lib/rdsvc.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDSvc — Inventory Partial

## 1. Class Purpose

RDSvc represents a broadcast service configuration. A service defines how logs (daily playlists) are generated, how traffic and music data are imported from external scheduling systems, and how those imports are linked into the generated logs. It is the central entity connecting clocks, events, logs, and external scheduling data.

## 2. Inheritance & QObject Status

- **Parent class:** QObject
- **Q_OBJECT macro:** Yes
- **Constructor:**
  - `RDSvc(QString svcname, RDStation *station, RDConfig *config, QObject *parent)` — stores service name, station reference, and config. No DB query in constructor.

## 3. Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `ImportField` | CartNumber=0, ExtData=3, ExtEventId=4, ExtAnncType=5, Title=6, StartHours=7, StartMinutes=8, StartSeconds=9, LengthHours=10, LengthMinutes=11, LengthSeconds=12 | Field identifiers for import parser configuration |
| `ShelflifeOrigin` | OriginAirDate=0, OriginCreationDate=1 | Determines when log shelflife countdown starts |
| `SubEventInheritance` | ParentEvent=0, SchedFile=1 | Determines how sub-events (track markers, labels) inherit title: from parent event or from scheduling file |
| (implicit) `ImportSource` | Traffic, Music | Source type for import operations (used as parameter) |

## 4. Signals

| Signal | Parameters | Emitted When |
|--------|------------|--------------|
| `generationProgress(int step)` | Step number (0-24+) | During log generation and link operations to report progress |

## 5. Slots

None declared.

## 6. Key Properties (getter/setter pairs via DB)

All properties persisted to the `SERVICES` MySQL table.

### Identity & Description
| Property | Type | Description |
|----------|------|-------------|
| name | QString | Service name (read-only, set at construction) |
| exists | bool | Whether service exists in DB |
| description / set | QString | Human-readable description |
| programCode / set | QString | Program code identifier |

### Log Generation Templates
| Property | Type | Description |
|----------|------|-------------|
| nameTemplate / set | QString | Template for generating log names (supports date macros like %m%d) |
| descriptionTemplate / set | QString | Template for log descriptions (supports %d/%m/%Y macros) |

### Scheduling Groups
| Property | Type | Description |
|----------|------|-------------|
| trackGroup / set | QString | Voice track group name |
| autospotGroup / set | QString | Auto-spot group name |

### Log Lifecycle
| Property | Type | Description |
|----------|------|-------------|
| autoRefresh / set | bool | Whether logs auto-refresh |
| defaultLogShelflife / set | int | Days before log is purged |
| logShelflifeOrigin / set | ShelflifeOrigin | Whether shelflife counts from air date or creation date |
| elrShelflife / set | int | Days to keep edit log records |
| includeImportMarkers / set | bool | Whether to include import markers in generated logs |
| chainto / set | bool | Whether to chain to next day's log |
| subEventInheritance / set | SubEventInheritance | How sub-events inherit properties |

### Import Configuration (per source: Traffic/Music)
| Property | Type | Description |
|----------|------|-------------|
| importTemplate / set | QString | Name of import template (from IMPORT_TEMPLATES table) |
| breakString / set | QString | String that marks inline breaks in import file |
| trackString / set | QString | String that marks track markers in import file |
| labelCart / set | QString | String that marks label/note carts |
| trackCart / set | QString | String that marks track carts |
| importPath / set | QString | Path to import file (supports date macros) |
| preimportCommand / set | QString | Shell command to run before import |
| importOffset / set | int | Field offset for import parsing |
| importLength / set | int | Field length for import parsing |

## 7. Key Methods

### Log Generation
| Method | Returns | Description |
|--------|---------|-------------|
| `generateLog(date, logname, nextname, *report, user, *err_msg)` | bool | Creates a new log for the given date. Removes existing log if present (with locking). Creates log via RDLog::create(), sets description from template. Iterates 24 hours, loading the assigned clock for each hour (from SERVICE_CLOCKS) and generating events. Appends chain-to entry if enabled. Updates link quantities. Emits generationProgress 0-25. |

### Traffic/Music Import
| Method | Returns | Description |
|--------|---------|-------------|
| `import(src, date, break_str, track_str, resolve_implied_times)` | bool | Parses external scheduling file (traffic or music). Reads parser config from SERVICES or IMPORT_TEMPLATES table. Opens file, runs optional preimport command, then parses each line extracting: cart number, start time (H:M:S), length (H:M:S), ext data, event ID, annc type, title using configured offsets/lengths. Identifies line types: Cart (valid cart number), Inline Break (contains break_str), Track Marker, Label/Note Cart. Saves parsed lines to IMPORTER_LINES temp table. Optionally resolves implied start times for inline events. |
| `importFilename(src, date)` | QString | Returns the resolved import file path for a given source and date (applies date macros via RDDateDecode). |

### Log Linking
| Method | Returns | Description |
|--------|---------|-------------|
| `linkLog(src, date, logname, *report, user, *err_msg)` | bool | Links imported traffic/music data into an existing log. Acquires log lock. Calls import() to parse external file. For Music source, resolves inline events. Iterates log lines: for link-type entries, loads the referenced event and calls its linkLog() to expand into actual cart entries. Produces exception report of unplaced events. Cleans up IMPORTER_LINES. |
| `clearLogLinks(src, logname, user, *err_msg)` | bool | Removes all linked entries from a log for a given source (Music or Traffic). Acquires log lock, filters out lines matching the source, saves the remaining log. Resets link state. |

### Service Lifecycle (static)
| Method | Returns | Description |
|--------|---------|-------------|
| `create(name, *err_msg, exemplar, config)` | bool (static) | Creates new service. Validates no whitespace in name, checks uniqueness. If exemplar is empty: creates with default templates, adds all groups to AUDIO_PERMS, all stations to SERVICE_PERMS, initializes 168 SERVICE_CLOCKS (7 days x 24 hours). If exemplar provided: clones all settings, parser configs, clock assignments, permissions, autofills from exemplar. |
| `remove(name)` | void (static) | Deletes service and all related data: AUDIO_PERMS, SERVICE_PERMS, EVENT_PERMS, CLOCK_PERMS, AUTOFILLS, REPORT_SERVICES, SERVICE_CLOCKS, STACK_LINES + STACK_SCHED_CODES, ELR_LINES, LOG_LINES, REC tables, LOGS. Clears RDAIRPLAY default_service references. |
| `remove()` | void (instance) | Calls static remove with this service's name |

### Serialization
| Method | Returns | Description |
|--------|---------|-------------|
| `xml()` | QString | Returns XML representation: `<service><name>...<description>...</service>` |

### Helpers (private)
| Method | Purpose |
|--------|---------|
| `TryLock(lock, *err_msg)` | Attempts to acquire log lock, returns false with message on failure |
| `SourceString(src)` | Returns "TFC" or "MUS" prefix for import source |
| `FieldString(field)` | Returns DB column suffix for an ImportField enum value |
| `SetRow` (2 overloads) | Generic DB setter for SERVICES table |
| `GetParserStrings(src, ...)` | Loads break/track/label/cart strings for import source |
| `CheckId(event_name)` | Validates an event reference |
| `MakeErrorLine(...)` | Formats error line for exception reports |
| `ResolveInlineEvents(logname, *err_msg)` | Resolves inline traffic events embedded in music import |

## 8. SQL Tables Accessed

| Table | Operations | Purpose |
|-------|-----------|---------|
| `SERVICES` | SELECT, INSERT, UPDATE, DELETE | Primary service configuration |
| `SERVICE_CLOCKS` | SELECT, INSERT, DELETE | 168-slot (7x24) clock assignment grid |
| `SERVICE_PERMS` | SELECT, INSERT, DELETE | Station-to-service permissions |
| `AUDIO_PERMS` | SELECT, INSERT, DELETE | Group-to-service audio permissions |
| `EVENT_PERMS` | SELECT, INSERT, DELETE | Event-to-service permissions |
| `CLOCK_PERMS` | SELECT, INSERT, DELETE | Clock-to-service permissions |
| `AUTOFILLS` | SELECT, INSERT, DELETE | Auto-fill cart list |
| `IMPORT_TEMPLATES` | SELECT | Named import parser configurations |
| `IMPORTER_LINES` | INSERT, SELECT, UPDATE, DELETE | Temp table for parsed import lines (keyed by STATION_NAME + PROCESS_ID) |
| `LOG_LINES` | SELECT, INSERT | Log content lines |
| `LOGS` | SELECT, DELETE | Log metadata |
| `STACK_LINES` / `STACK_SCHED_CODES` | SELECT, DELETE | Scheduler stack data |
| `ELR_LINES` | DELETE | Edit log records |
| `REPORT_SERVICES` | DELETE | Report associations |
| `RDAIRPLAY` | UPDATE | Clear default service reference |
| `GROUPS` | SELECT | For creating default audio perms |
| `STATIONS` | SELECT | For creating default station perms |

## 9. Key SQL Queries

- Clock lookup per hour: `SELECT CLOCK_NAME FROM SERVICE_CLOCKS WHERE SERVICE_NAME=? AND HOUR=?` (HOUR = 24*(dayOfWeek-1)+hour)
- Import parser config: SELECT 22 offset/length columns from SERVICES or IMPORT_TEMPLATES
- Importer line insert: INSERT INTO IMPORTER_LINES with parsed fields (cart, start time, length, ext data, type)
- Service clone: SELECT all 70 columns from SERVICES, INSERT with modified NAME
- Service removal: cascading DELETE across 10+ related tables
- Implied time resolution: UPDATE IMPORTER_LINES SET START_HOUR, START_SECS, LENGTH for events without explicit times

## 10. External Dependencies

- **RDClock**: Clock loading and log event generation per hour
- **RDLog** / **RDLogEvent** / **RDLogLine**: Log creation, loading, modification, saving
- **RDLogLock**: Exclusive log locking for concurrent access protection
- **RDEventLine**: Event expansion during log linking
- **RDStation**: Station reference for per-station operations
- **RDConfig**: System configuration
- **RDDateDecode**: Macro substitution in file paths and templates (%m, %d, %Y, etc.)
- **RDSqlQuery**: All DB operations

## 11. Linux-Specific

- `system()` — executes preimport command before parsing import file
- `fopen()` / `fgets()` / `fclose()` — C-style file I/O for import file parsing
- `getpid()` — process ID used as key in IMPORTER_LINES temp table to support concurrent imports
