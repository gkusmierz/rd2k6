---
partial_id: "inv-004"
artifact: LIB
source_header: lib/rdlog_event.h
source_impl: lib/rdlog_event.cpp
class: RDLogEvent
status: done
agent: PHASE-2-inventory-subagent
date: 2026-04-05
---

# RDLogEvent — Inventory Partial

## Classification

- **Type:** Plain C++ class (no QObject, no signals/slots, no Q_PROPERTY)
- **Role:** In-memory container and persistence manager for an ordered list of broadcast log events (lines)
- **Responsibility:** Load, save, validate, manipulate, and serialize the sequence of `RDLogLine` entries that comprise a single broadcast log

## Inheritance

None. Standalone class.

## Dependencies

| Dependency | Role |
|---|---|
| `RDLogLine` | Individual log line/event — the element this class manages a collection of |
| `RDLog` | Log-level metadata (nextId, updateTracks) |
| `RDCart` | Cart type enums used during validation |
| `RDCut` | Cut number extraction during track pointer loading |
| `RDSqlQuery` | All database access |
| `RDConfig` | Passed to save operations (not directly used by this class) |
| `RDEscapeString` | SQL string escaping utility |
| `RDBool` / `RDDowCode` | Conversion helpers |

## Fields (State)

| Field | Type | Purpose |
|---|---|---|
| `log_name` | `QString` | Name/identifier of the log being managed |
| `log_service_name` | `QString` | Service name this log belongs to (loaded from LOGS table) |
| `log_max_id` | `int` | Highest line ID seen; used for auto-incrementing new line IDs |
| `log_line` | `std::vector<RDLogLine*>` | Ordered collection of log line pointers — the core data structure |

## Public API — Methods

### Existence Checks

| Method | Signature | Behavior |
|---|---|---|
| `exists()` | `bool exists()` | Delegates to `RDLog::exists(log_name)` — checks if the log exists in DB |
| `exists(line)` | `bool exists(int line)` | Returns true if the given line index is within the current collection size |
| `exists(hard_time, except_line)` | `bool exists(const QTime&, int)` | Scans all lines for a hard-timed event at the given time, optionally excluding one line |

### Accessors

| Method | Signature | Behavior |
|---|---|---|
| `logName()` | `QString logName() const` | Returns the log name |
| `setLogName()` | `void setLogName(QString)` | Sets the log name |
| `serviceName()` | `QString serviceName() const` | Returns the service name (populated during load) |
| `size()` | `int size() const` | Returns the number of lines in the log |
| `logLine(line)` | `RDLogLine* logLine(int) const` | Returns pointer to the log line at the given index |
| `setLogLine(line, ll)` | `void setLogLine(int, RDLogLine*)` | Replaces the log line at the given index |
| `loglineById(id)` | `RDLogLine* loglineById(int, bool) const` | Finds a log line by its unique ID (optionally ignoring holdovers) |
| `lineById(id)` | `int lineById(int, bool) const` | Returns the index of a log line given its ID |
| `lineByStartHour(hour, type)` | `int lineByStartHour(int, RDLogLine::StartTimeType) const` | Finds a line by start hour and time type |
| `lineByStartHour(hour)` | `int lineByStartHour(int) const` | Finds a line by start hour (any time type) |
| `nextId()` | `int nextId() const` | Returns the next available line ID (log_max_id + 1) |
| `nextLinkId()` | `int nextLinkId() const` | Returns the next available link ID |

### Load / Save / Persistence

| Method | Signature | Behavior |
|---|---|---|
| `load(track_ptrs)` | `int load(bool)` | Clears and loads all lines from DB. Reads service name from LOGS table, fetches next ID from RDLog, then delegates to LoadLines. Optionally loads cut pointers for voice tracking. Returns line count. |
| `save(config, update_tracks, line)` | `void save(RDConfig*, bool, int)` | If line < 0 (default): deletes all LOG_LINES rows for this log and bulk-inserts all in-memory lines. If line >= 0: replaces only that single line row. Updates RDLog nextId and optionally track counts. |
| `saveModified(config, update_tracks)` | `void saveModified(RDConfig*, bool)` | Iterates all lines; calls save() for each line that has the modified flag set |
| `append(logname, track_ptrs)` | `int append(const QString&, bool)` | Appends lines from another log (by name) to the current collection, offsetting IDs by log_max_id |
| `clear()` | `void clear()` | Removes all lines from the in-memory collection |
| `refresh(line)` | `void refresh(int)` | Reloads a single line from the database |

### Manipulation

| Method | Signature | Behavior |
|---|---|---|
| `insert(line, num_lines, preserve_trans)` | `void insert(int, int, bool)` | Inserts blank RDLogLine entries at the given position. Unless preserve_trans is true, clears custom transition points on adjacent lines. Auto-assigns incrementing IDs. |
| `remove(line, num_lines, preserve_trans)` | `void remove(int, int, bool)` | Removes lines from the collection. Unless preserve_trans is true, clears transition points on adjacent lines. Frees memory. |
| `move(from, to)` | `void move(int, int)` | Moves a line from one position to another within the collection |
| `copy(from, to)` | `void copy(int, int)` | Copies a line from one position to another |
| `removeCustomTransition(line)` | `void removeCustomTransition(int)` | Removes custom transition settings on a specific line |

### Calculation / Query

| Method | Signature | Behavior |
|---|---|---|
| `length(from, to, sched_time)` | `int length(int, int, QTime*)` | Calculates total duration (ms) between two lines. Uses segue points when next line is a segue; otherwise uses forced length. Stops at hard time boundaries. |
| `lengthToStop(from, sched_time)` | `int lengthToStop(int, QTime*)` | Calculates total duration from a line until the next stop point |
| `blockLength(nominal, actual, line)` | `bool blockLength(int*, int*, int)` | Calculates nominal and actual block lengths for a given line |
| `blockStartTime(line)` | `QTime blockStartTime(int)` | Returns the start time of the block containing the given line |
| `nextTimeStart(after)` | `int nextTimeStart(QTime)` | Finds the next hard-timed start after a given time |
| `nextTransType(line)` | `RDLogLine::TransType nextTransType(int)` | Returns the transition type of the next line |

### Validation

| Method | Signature | Behavior |
|---|---|---|
| `validate(report, date)` | `int validate(QString*, const QDate&)` | Generates an exception report for the log on a given airdate. Checks each line's cart: (1) verifies the cart exists in CART table, (2) for audio carts verifies at least one playable cut exists in CUTS considering date/time/daypart/day-of-week constraints. Returns error count. |

### Serialization

| Method | Signature | Behavior |
|---|---|---|
| `xml()` | `QString xml() const` | Serializes the entire log as XML `<logList>` wrapping each line's XML representation |

## Private Methods

| Method | Signature | Behavior |
|---|---|---|
| `LoadLines(logname, id_offset, track_ptrs)` | `int LoadLines(const QString&, int, bool)` | Core DB loader. Executes a large JOIN query (LOG_LINES LEFT JOIN CART) ordered by COUNT. Populates RDLogLine objects with all fields. Handles Cart, Macro, Marker, Track, and Chain line types differently. Loads group colors from GROUPS. Optionally loads cut pointers from CUTS for voice tracking. Calls LoadNowNext at end. |
| `SaveLine(line)` | `void SaveLine(int)` | Saves a single line by building insert values and calling InsertLines |
| `InsertLines(values)` | `void InsertLines(QString)` | Executes bulk INSERT into LOG_LINES with pre-built values string |
| `InsertLineValues(query, line)` | `void InsertLineValues(QString*, int)` | Builds the VALUES clause for a single log line INSERT |
| `LoadNowNext(from_line)` | `void LoadNowNext(unsigned)` | Loads ENABLE_NOW_NEXT flags from GROUPS table and applies them to each line based on group membership |

## Database Tables Accessed

| Table | Operations | Purpose |
|---|---|---|
| `LOG_LINES` | SELECT (load), DELETE + INSERT (save) | Primary storage — each row is one log line with scheduling, transition, and external data |
| `LOGS` | SELECT (service name, description for Chain lines) | Log metadata — service association |
| `CART` | SELECT (joined with LOG_LINES on load; queried during validation) | Cart metadata — type, title, artist, lengths, group, etc. |
| `CUTS` | SELECT (validation: playable cut check; track_ptrs: cut details) | Cut-level data — availability windows, dayparts, day-of-week, audio points |
| `GROUPS` | SELECT (color table, now/next flags) | Group configuration — display colors and now/next enable flags |

## Key LOG_LINES Columns (from LoadLines query)

LINE_ID, CART_NUMBER, START_TIME, TIME_TYPE, TRANS_TYPE, START_POINT, END_POINT, SEGUE_START_POINT, SEGUE_END_POINT, TYPE, COMMENT, LABEL, GRACE_TIME, SOURCE, EXT_START_TIME, EXT_LENGTH, EXT_DATA, EXT_EVENT_ID, EXT_ANNC_TYPE, EXT_CART_NAME, FADEUP_POINT, FADEUP_GAIN, FADEDOWN_POINT, FADEDOWN_GAIN, SEGUE_GAIN, LINK_EVENT_NAME, LINK_START_TIME, LINK_LENGTH, LINK_ID, LINK_EMBEDDED, ORIGIN_USER, ORIGIN_DATETIME, LINK_START_SLOP, LINK_END_SLOP, DUCK_UP_GAIN, DUCK_DOWN_GAIN, EVENT_LENGTH, LOG_NAME, COUNT

## Line Types Handled

| RDLogLine::Type | Special Loading Behavior |
|---|---|
| `Cart` | Full cart metadata, audio points, fade/segue/duck gains, external data, validity, dates |
| `Macro` | Cart metadata subset, async flag, forced length as segue length |
| `Marker` | No additional fields beyond common |
| `Track` | No additional fields beyond common |
| `Chain` | Loads chained log description from LOGS table into marker comment |

## Behavioral Notes

- The class acts as an **ordered, mutable list** of `RDLogLine*` pointers backed by `std::vector`
- **ID management**: Every new line gets an auto-incremented ID from `log_max_id`. On save, the maximum ID is persisted back to the LOGS table via RDLog.
- **Transition preservation**: Insert/remove operations reset custom transition points on adjacent lines unless `preserve_trans=true`
- **Bulk save strategy**: Full save deletes all rows first, then bulk-inserts. Single-line save deletes and re-inserts only that line's row.
- **Append merges logs**: `append()` loads another log's lines with an ID offset, enabling log concatenation
- **Validation is date-aware**: Checks cut availability against date, time-of-day, daypart, and day-of-week constraints
- **Now/Next flagging**: After loading lines, each line's now/next enabled status is set based on its group's configuration in GROUPS table
- **Voice tracker support**: When `track_ptrs=true`, loads representative cut pointers (start/end/segue/talk/hook/fade points) for each audio cart line
- **No Qt object features**: This is a pure data container with no signals, slots, or properties
