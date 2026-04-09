---
artifact: IMP
project: Rivendell
status: done
agent_version: 2.0.0
extracted_at: 2026-04-08T12:00:00Z
serena_bootstrap: true
sections_completed: [A, B, C, D, E, F]
source_files_count: 13
classes_count: 7
tables_count: 0
connections_count: 0
rules_count: 14
ui_windows_count: 0
---

# Semantic Context: IMP (importers)

## Files & Symbols

### Source Files

| File | Type | Symbols | LOC (est) |
|------|------|---------|-----------|
| panel_copy.h | header | MainObject | ~12 |
| panel_copy.cpp | source | MainObject::MainObject, main | ~170 |
| wings_filter.h | header | WingsRecord, MainObject | ~22 |
| wings_filter.cpp | source | MainObject::MainObject, MainObject::ImportCut, MainObject::ReadLine, MainObject::TrimSpaces, main | ~250 |
| rivendell_filter.h | header | MainObject | ~8 |
| rivendell_filter.cpp | source | MainObject::MainObject, main | ~400 |
| nexgen_filter.h | header | MainObject | ~32 |
| nexgen_filter.cpp | source | MainObject::MainObject, MainObject::ProcessArchive, MainObject::ProcessXmlFile, MainObject::OpenXmlFile, MainObject::ProcessXmlLine, MainObject::PreprocessAudio, MainObject::WriteReject, MainObject::GetDateTime, MainObject::SwapCase, MainObject::IsXmlFile, MainObject::Print, main | ~570 |
| rdcatch_copy.h | header | MainObject | ~12 |
| rdcatch_copy.cpp | source | MainObject::MainObject, main | ~300 |
| sas_filter.h | header | MainObject | ~18 |
| sas_filter.cpp | source | MainObject::MainObject, MainObject::InsertList, MainObject::DeleteList, MainObject::InjectLine, MainObject::InjectSwitchEvent, MainObject::InjectCartEvent, main | ~200 |
| export_slax | script | (shell script) | ~unknown |

**Note:** Each .cpp/.h pair produces a separate standalone command-line tool (executable). `export_slax` is a non-C++ script.

### Symbol Index

| Symbol | Kind | File | Qt Class? |
|--------|------|------|-----------|
| MainObject (panel_copy) | Class | panel_copy.h | Yes (Q_OBJECT, inherits QObject) |
| MainObject (wings_filter) | Class | wings_filter.h | Yes (Q_OBJECT, inherits QObject) |
| MainObject (rivendell_filter) | Class | rivendell_filter.h | Yes (Q_OBJECT, inherits QObject) |
| MainObject (nexgen_filter) | Class | nexgen_filter.h | Yes (Q_OBJECT, inherits QObject) |
| MainObject (rdcatch_copy) | Class | rdcatch_copy.h | Yes (Q_OBJECT, inherits QObject) |
| MainObject (sas_filter) | Class | sas_filter.h | Yes (Q_OBJECT, inherits QObject) |
| WingsRecord | Struct | wings_filter.h | No |

### Tool Executables

Each source pair compiles to a standalone CLI tool:

| Tool | Source Files | Purpose |
|------|-------------|---------|
| panel_copy | panel_copy.h/cpp | Copy sound panel button assignments between two MySQL databases |
| wings_filter | wings_filter.h/cpp | Import audio and metadata from Wings broadcast system (ATX files) |
| rivendell_filter | rivendell_filter.h/cpp | Import carts, cuts, and audio files from a remote Rivendell database |
| nexgen_filter | nexgen_filter.h/cpp | Import audio from Prophet NexGen system (XML metadata + PKT archives) |
| rdcatch_copy | rdcatch_copy.h/cpp | Copy RDCatch recording/switch events between stations across databases |
| sas_filter | sas_filter.h/cpp | Import SAS (Sierra Automated Systems) switch/macro event lists into RDCatch |
| export_slax | export_slax (script) | Export script for Slax format |

---

## Class API Surface

### MainObject [panel_copy] [Service - Database Copy Tool]
- **File:** panel_copy.h / panel_copy.cpp
- **Inherits:** QObject
- **Qt Object:** Yes (Q_OBJECT)
- **Category:** CLI Service - cross-database panel button copier

#### Signals
None.

#### Slots
None.

#### Public Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| MainObject() | (ctor) | (QObject *parent=0) | Parses CLI args, connects two MySQL DBs, copies PANELS table rows |

#### Fields
| Field | Type | Description |
|-------|------|-------------|
| src_db | QSqlDatabase | Source MySQL connection |
| dest_db | QSqlDatabase | Destination MySQL connection |
| rd_config | RDConfig* | Rivendell configuration loader |

#### CLI Usage
```
panel_copy -h <src-mysql-host> -H <dest-mysql-host>
```

#### Behavior
1. Reads `-h` (source host) and `-H` (destination host) switches
2. Opens two MySQL database connections using credentials from `rd.conf`
3. Validates database versions match `RD_VERSION_DATABASE`
4. Prompts user for confirmation (WARNING: overwrites all panel assignments)
5. Deletes all rows from destination `PANELS` table
6. Copies all rows from source `PANELS` table to destination

---

### MainObject [wings_filter] [Service - Audio Import Tool]
- **File:** wings_filter.h / wings_filter.cpp
- **Inherits:** QObject
- **Qt Object:** Yes (Q_OBJECT)
- **Category:** CLI Service - Wings broadcast system audio importer

#### Signals
None.

#### Slots
None.

#### Public Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| MainObject() | (ctor) | (QObject *parent=0) | Parses CLI args, reads Wings DB file, imports audio cuts |

#### Private Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| ImportCut() | bool | (RDGroup*, WingsRecord*, RDWaveFile*) | Creates cart/cut in Rivendell DB, copies audio file |
| ReadLine() | bool | (FILE*, WingsRecord*) | Reads one fixed-width record from Wings DB file |
| TrimSpaces() | void | (char*) | Trims trailing spaces from fixed-width field |

#### CLI Usage
```
wings_filter -g <default-group> -d <db-file> -A <audio-dir> [-e <audio-ext>]
```

#### Behavior
1. Opens Rivendell database via `RDApplication`
2. Connects to RIPCD
3. Reads Wings fixed-width database file line by line
4. For each record, opens corresponding audio file (ATX format by default)
5. Validates ATX header integrity
6. Assigns cart to group (record's group if exists, else default group)
7. Creates new cart (INSERT into CART) and cut (RDCut::create + UPDATE CUTS)
8. Copies audio data (PCM or MPEG layer 2) to Rivendell audio store

---

### WingsRecord [Value Object - Import DTO]
- **File:** wings_filter.h
- **Inherits:** (none, C struct)
- **Qt Object:** No

#### Fields
| Field | Type | Description |
|-------|------|-------------|
| filename | char[9] | Source audio filename (8 chars max) |
| extension | char[4] | Audio file extension |
| title | char[30] | Track title |
| artist | char[30] | Artist name |
| album | char[30] | Album name |
| group | char[2] | Single-character group code |
| length | int | Track length in milliseconds |

---

### MainObject [rivendell_filter] [Service - Database Import Tool]
- **File:** rivendell_filter.h / rivendell_filter.cpp
- **Inherits:** QObject
- **Qt Object:** Yes (Q_OBJECT)
- **Category:** CLI Service - remote Rivendell database importer

#### Signals
None.

#### Slots
None.

#### Public Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| MainObject() | (ctor) | (QObject *parent=0) | Parses CLI args, connects to local and remote DBs, transfers carts/cuts/audio |

#### CLI Usage
```
rivendell_filter -h <hostname> -u <username> -p <password> -A <audio-dir> -g <default-group> -s <start-cartnum> -e <end-cartnum>
```

#### Behavior
1. Opens local Rivendell database via `RDConfig`
2. Opens remote Rivendell database with provided credentials
3. Validates default group exists locally
4. For each cart in range [start_cartnum, end_cartnum] from remote DB:
   a. Validates group exists locally (falls back to default group)
   b. Purges existing local cuts (deletes audio files via `unlink`)
   c. Deletes existing local CUTS and CART rows
   d. Inserts new CART row with all metadata from remote
   e. Inserts new CUTS rows with all metadata from remote
   f. Copies audio files via `RDCopy()` from source audio directory
5. Handles NULL datetime/daypart fields gracefully

---

### MainObject [nexgen_filter] [Service - NexGen Import Tool]
- **File:** nexgen_filter.h / nexgen_filter.cpp
- **Inherits:** QObject
- **Qt Object:** Yes (Q_OBJECT)
- **Category:** CLI Service - Prophet NexGen broadcast system importer

#### Signals
None.

#### Slots
None.

#### Public Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| MainObject() | (ctor) | (QObject *parent=0) | Parses CLI args, processes XML or PKT archive files |

#### Private Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| ProcessArchive() | void | (const QString& filename) | Extracts PKT archive (proprietary binary format) to temp dir, processes XML+WAV |
| ProcessXmlFile() | void | (const QString& xml, const QString& wavname, const QString& arcname) | Reads XML metadata, validates cart number, runs rdimport, applies metadata |
| OpenXmlFile() | bool | (const QString& xml, RDWaveData*, int* cartnum, QString* filename) | Parses NexGen XMLDAT file line by line |
| ProcessXmlLine() | void | (const QString& line, RDWaveData*, int*, QString*, int*, int*, int*) | Parses individual XML tag/value pairs into RDWaveData |
| PreprocessAudio() | bool | (QString filename) | Detects MPEG vs PCM; decodes MPEG via madplay if needed |
| WriteReject() | void | (const QString& filename) | Copies failed XML files to reject directory |
| GetDateTime() | QDateTime | (const QString&) | Parses NexGen datetime format |
| SwapCase() | QString | (const QString&) | Swaps filename case for case-insensitive file matching |
| IsXmlFile() | bool | (const QString&) | Checks if filename has .xml extension |
| Print() | void | (const QString&) | Conditional verbose output |

#### Fields
| Field | Type | Description |
|-------|------|-------------|
| filter_group | RDGroup* | Target Rivendell group for imports |
| filter_audio_dir | QDir* | Directory containing NexGen audio files |
| filter_reject_dir | QDir* | Directory for failed XML files (NULL = /dev/null) |
| filter_temp_dir | QDir* | Temporary working directory |
| filter_temp_audiofile | QString | Path to temporary audio file in temp dir |
| filter_cart_offset | int | Integer offset applied to NexGen cart numbers |
| filter_delete_cuts | bool | Whether to delete existing cuts before import |
| filter_normalization_level | int | Audio normalization level in dBFS (0 = off) |
| filter_verbose | bool | Verbose output flag |

#### CLI Usage
```
nexgen_filter [options] <xml-file>|<pkt-file> [...]

Options:
  --group=<group-name>              Rivendell group (mandatory)
  --audio-dir=<path>                Audio files directory (mandatory for XML)
  --reject-dir=<path>               Failed XML destination (default: /dev/null)
  --cart-offset=<offset>            Cart number offset (default: 0)
  --delete-cuts                     Delete existing cuts before import
  --normalization-level=<level>     Normalization in dBFS (default: 0 = off)
  --verbose                         Print status messages
```

#### Behavior
1. Opens Rivendell database via `RDApplication`
2. Connects to RIPCD
3. Validates group exists and audio directory is readable
4. Creates temporary working directory
5. For each input file:
   - If XML: reads metadata, locates audio in `--audio-dir`, imports via `rdimport` CLI
   - If PKT archive: extracts binary archive (proprietary NexGen format with `FR:` headers), finds XML+WAV components, processes
6. PKT archive format: 104-byte headers (`FR:` + path + 4-byte little-endian length), followed by file data
7. Audio preprocessing: detects MPEG (byte 20 == 80) and decodes via `madplay` to WAV; PCM files are symlinked
8. Imports via external `rdimport` command with normalization and cart targeting
9. Applies metadata (title, artist, album, label, composer, ISRC, dates, markers) to cart/cut after import
10. Calculates segue markers from crossfade values, start markers from fadeup values

---

### MainObject [rdcatch_copy] [Service - Event Copy Tool]
- **File:** rdcatch_copy.h / rdcatch_copy.cpp
- **Inherits:** QObject
- **Qt Object:** Yes (Q_OBJECT)
- **Category:** CLI Service - RDCatch event copier between stations

#### Signals
None.

#### Slots
None.

#### Public Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| MainObject() | (ctor) | (QObject *parent=0) | Parses CLI args, connects two DBs, copies RECORDINGS table rows |

#### Fields
| Field | Type | Description |
|-------|------|-------------|
| src_db | QSqlDatabase | Source MySQL connection |
| dest_db | QSqlDatabase | Destination MySQL connection |
| rd_config | RDConfig* | Rivendell configuration loader |

#### CLI Usage
```
rdcatch_copy -h <src-mysql-host> -s <src-rd-host> -H <dest-mysql-host> -S <dest-rd-host>
```

#### Behavior
1. Reads `-h` (source MySQL host), `-s` (source Rivendell station), `-H` (dest MySQL host), `-S` (dest station)
2. Opens MySQL connections (reuses same connection if same host but different station)
3. Validates database versions match `RD_VERSION_DATABASE`
4. Validates both station names exist in STATIONS table
5. Prompts user for confirmation (WARNING: overwrites all RDCatch events)
6. Deletes all RECORDINGS for destination station
7. Copies all RECORDINGS from source station, replacing STATION_NAME with destination

---

### MainObject [sas_filter] [Service - SAS Event Import Tool]
- **File:** sas_filter.h / sas_filter.cpp
- **Inherits:** QObject
- **Qt Object:** Yes (Q_OBJECT)
- **Category:** CLI Service - SAS switch/macro event importer

#### Signals
None.

#### Slots
None.

#### Public Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| MainObject() | (ctor) | (QObject *parent=0) | Parses CLI args, either inserts or deletes event list |

#### Private Methods
| Method | Return | Parameters | Brief |
|--------|--------|-----------|-------|
| InsertList() | void | () | Reads SAS event file line by line, injects into RECORDINGS table |
| DeleteList() | void | () | Deletes ALL rows from RECORDINGS table, resets RDCatchd |
| InjectLine() | void | (char* line) | Parses 79-char fixed-width SAS event line into SQL |
| InjectSwitchEvent() | void | (QString sql, int input, int output) | Inserts TYPE=2 (switch) event into RECORDINGS |
| InjectCartEvent() | void | (QString sql, int gpo) | Inserts TYPE=1 (macro cart) event into RECORDINGS |

#### Fields
| Field | Type | Description |
|-------|------|-------------|
| filter_connect | RDCatchConnect* | Connection to RDCatchd daemon |
| filter_switch_count | int | Counter for imported switch events |
| filter_macro_count | int | Counter for imported macro events |

#### CLI Usage
```
sas_filter -d          (delete all events)
sas_filter -i <file>   (insert events from file)
```

#### Behavior
1. Opens Rivendell database via `RDApplication`
2. Connects to RIPCD and RDCatchd
3. Mode `-d`: Deletes ALL rows from RECORDINGS, resets RDCatchd
4. Mode `-i`: Reads fixed-width (79 chars/line) SAS event file:
   - Chars 0-6: Day-of-week flags (X = active for Mon-Sun)
   - Chars 9-16: Start time (HH:MM:SS)
   - Chars 19-59: Description/title
   - Char 77: Active flag ('I' = inactive)
   - Chars 62-64: Output number
   - Chars 67-69: Input number
   - Chars 73-74: GPO number
   - If input>0 and output>0: creates switch event (TYPE=2)
   - If gpo>0: creates macro cart event (TYPE=1, cart = gpo + sasBaseCart config)
5. Uses config values: `sasStation`, `sasMatrix`, `sasBaseCart` from rd.conf
6. Resets RDCatchd after import

---

## Data Model

No tables are created by this artifact. All tools operate on tables defined in the LIB (librd) artifact.

### Tables Used (CRUD Operations)

| Table | Tool(s) | Operations | Details |
|-------|---------|-----------|---------|
| PANELS | panel_copy | SELECT, DELETE, INSERT | Full copy from source to destination DB |
| VERSION | panel_copy, rdcatch_copy | SELECT | Database version validation |
| CART | wings_filter, rivendell_filter, nexgen_filter | SELECT, DELETE, INSERT | Cart metadata management |
| CUTS | wings_filter, rivendell_filter, nexgen_filter | SELECT, DELETE, INSERT, UPDATE | Cut metadata and audio pointer management |
| GROUPS | wings_filter, rivendell_filter, nexgen_filter | SELECT | Group existence validation |
| STATIONS | rdcatch_copy | SELECT | Station existence validation |
| RECORDINGS | rdcatch_copy, sas_filter | SELECT, DELETE, INSERT | RDCatch event management |

### Table Access Patterns

#### PANELS (panel_copy)
- **Read:** SELECT TYPE, OWNER, PANEL_NO, ROW_NO, COLUMN_NO, LABEL, CART, DEFAULT_COLOR from PANELS
- **Delete:** DELETE from PANELS (all rows on destination)
- **Write:** INSERT into PANELS set TYPE, OWNER, PANEL_NO, ROW_NO, COLUMN_NO, LABEL, CART, DEFAULT_COLOR

#### CART (rivendell_filter)
- **Read:** SELECT NUMBER, TYPE, GROUP_NAME, TITLE, ARTIST, ALBUM, YEAR, LABEL, CLIENT, AGENCY, PUBLISHER, COMPOSER, USER_DEFINED, USAGE_CODE, FORCED_LENGTH, AVERAGE_LENGTH, LENGTH_DEVIATION, AVERAGE_SEGUE_LENGTH, AVERAGE_HOOK_LENGTH, CUT_QUANTITY, LAST_CUT_PLAYED, PLAY_ORDER, VALIDITY, ENFORCE_LENGTH, PRESERVE_PITCH, ASYNCRONOUS, OWNER, MACROS, SCHED_CODES from CART
- **Delete:** DELETE from CART where NUMBER=N
- **Write:** INSERT into CART with all above columns

#### CUTS (rivendell_filter)
- **Read:** SELECT CUT_NAME, EVERGREEN, DESCRIPTION, OUTCUE, ISRC, LENGTH, ORIGIN_DATETIME, START_DATETIME, END_DATETIME, SUN-SAT, START_DAYPART, END_DAYPART, ORIGIN_NAME, WEIGHT, VALIDITY, CODING_FORMAT, BIT_RATE, CHANNELS, PLAY_GAIN, START_POINT, END_POINT, FADEUP_POINT, FADEDOWN_POINT, SEGUE_START_POINT, SEGUE_END_POINT, SEGUE_GAIN, HOOK_START_POINT, HOOK_END_POINT, TALK_START_POINT, TALK_END_POINT from CUTS
- **Delete:** DELETE from CUTS where CART_NUMBER=N
- **Write:** INSERT into CUTS with all above columns

#### RECORDINGS (rdcatch_copy, sas_filter)
- **Read:** SELECT IS_ACTIVE, TYPE, CHANNEL, CUT_NAME, SUN-SAT, DESCRIPTION, START_TYPE/TIME/LENGTH/MATRIX/LINE/OFFSET, END_TYPE/TIME/LENGTH/MATRIX/LINE, LENGTH, TRIM_THRESHOLD, NORMALIZE_LEVEL, STARTDATE_OFFSET, ENDDATE_OFFSET, FORMAT, CHANNELS, SAMPRATE, BITRATE, QUALITY, MACRO_CART, SWITCH_INPUT, SWITCH_OUTPUT, EXIT_CODE, ONE_SHOT, URL, URL_USERNAME, URL_PASSWORD
- **Delete:** DELETE from RECORDINGS where STATION_NAME=X (rdcatch_copy) or all rows (sas_filter -d)
- **Write:** INSERT into RECORDINGS with all above columns

---

## Reactive Architecture

### Signal/Slot Connections
None. All tools in this artifact are pure CLI batch-processing tools with no Qt signal/slot connections.

### Event Flow
These tools do not use Qt's event loop for reactive behavior. They execute linearly:
1. Parse command-line arguments
2. Open database connections
3. Process data (read/transform/write)
4. Exit with status code

### Cross-Artifact Dependencies

| External Class | From Artifact | Used In | Purpose |
|---------------|---------------|---------|---------|
| RDConfig | LIB | panel_copy, rivendell_filter, rdcatch_copy | Configuration file reader (rd.conf) |
| RDCmdSwitch | LIB | panel_copy, rdcatch_copy | Command-line argument parser |
| RDApplication | LIB | wings_filter, nexgen_filter, sas_filter | Application bootstrap (DB + config) |
| RDGroup | LIB | wings_filter, nexgen_filter | Group validation and cart range management |
| RDWaveFile | LIB | wings_filter | Audio file reader/writer (WAV/MPEG) |
| RDWaveData | LIB | nexgen_filter | Audio metadata container |
| RDCart | LIB | nexgen_filter | Cart metadata writer |
| RDCut | LIB | wings_filter, rivendell_filter, nexgen_filter | Cut path resolution and creation |
| RDCatchConnect | LIB | sas_filter | Connection to RDCatchd daemon (for reset) |
| RDEscapeString | LIB | all tools | SQL string escaping |
| RDCheckDateTime | LIB | rivendell_filter | Safe datetime formatting (handles NULL/invalid) |
| RDCopy | LIB | rivendell_filter, nexgen_filter | File copy utility |
| RDTempDirectory | LIB | nexgen_filter | Temp directory path provider |
| RDSqlQuery | LIB | wings_filter, nexgen_filter, sas_filter | SQL query wrapper |
| RDXmlUnescape | LIB | nexgen_filter | XML entity unescaping |
| RDGetBasePart | LIB | nexgen_filter | Extract filename from path |

### External Tool Dependencies

| Tool | Used By | Purpose |
|------|---------|---------|
| rdimport | nexgen_filter | Audio import with normalization and cart targeting |
| madplay | nexgen_filter | MPEG to WAV audio decoding |

---

## Business Rules

### Rule: Database Version Must Match
- **Source:** panel_copy.cpp, rdcatch_copy.cpp
- **Trigger:** Database connection established
- **Condition:** `VERSION.DB != RD_VERSION_DATABASE`
- **Action:** Exit with error "database version mismatch"
- **Gherkin:**
  ```gherkin
  Scenario: Database version mismatch prevents copy
    Given a source database with version X
    And the tool expects version Y
    When the tool connects to the database
    Then the tool exits with error "database version mismatch"
  ```

### Rule: Cannot Copy Database Onto Itself
- **Source:** panel_copy.cpp:99
- **Trigger:** CLI arguments parsed
- **Condition:** `src_hostname == dest_hostname`
- **Action:** Exit with error "cannot copy a database onto itself"
- **Gherkin:**
  ```gherkin
  Scenario: Same host rejected for panel copy
    Given source and destination hostnames are identical
    When panel_copy is invoked
    Then the tool exits with error "cannot copy a database onto itself"
  ```

### Rule: Cannot Copy Host Config Onto Itself
- **Source:** rdcatch_copy.cpp
- **Trigger:** CLI arguments parsed
- **Condition:** `src_hostname == dest_hostname AND src_station == dest_station`
- **Action:** Exit with error "cannot copy a host configuration onto itself"
- **Note:** Same host with different station is allowed (shared DB connection reused)

### Rule: Cart Range Validation
- **Source:** rivendell_filter.cpp
- **Trigger:** CLI arguments parsed
- **Condition:** `start_cartnum == 0 OR start_cartnum > 999999` (same for end), or `start > end`
- **Action:** Exit with error "invalid cart value"

### Rule: Group Must Exist Locally
- **Source:** rivendell_filter.cpp, wings_filter.cpp
- **Trigger:** Before import begins
- **Condition:** Default group not found in local GROUPS table
- **Action:** Exit with error "default group does not exist" / "no such default group"

### Rule: Group Fallback on Transfer
- **Source:** rivendell_filter.cpp
- **Trigger:** During cart transfer loop
- **Condition:** Cart's original group not found locally
- **Action:** Use default group instead (no error, silent fallback)

### Rule: Missing Audio Warning
- **Source:** rivendell_filter.cpp
- **Trigger:** Audio file copy via RDCopy fails
- **Condition:** Audio file not found at expected path
- **Action:** Print "[WARNING -- NO AUDIO FOUND]", continue processing (non-fatal)

### Rule: ATX Header Validation
- **Source:** wings_filter.cpp
- **Trigger:** Opening audio file for import
- **Condition:** `wavefile->type() != RDWaveFile::Atx`
- **Action:** Print "ATX header appears corrupt, skipping", skip this file

### Rule: No Available Carts in Group
- **Source:** wings_filter.cpp (ImportCut)
- **Trigger:** Attempting to create new cart
- **Condition:** `group->nextFreeCart() == 0`
- **Action:** Print "No more available carts in group", skip this record

### Rule: NexGen Cart Number Validation
- **Source:** nexgen_filter.cpp (ProcessXmlFile)
- **Trigger:** After XML parsing, before import
- **Condition:** `cartnum < 1 OR cartnum > 999999`
- **Action:** Print error, write XML to reject directory, skip

### Rule: NexGen Cart Range Enforcement
- **Source:** nexgen_filter.cpp (ProcessXmlFile)
- **Trigger:** After cart number calculation
- **Condition:** Group enforces cart range AND cart number outside group's low/high range
- **Action:** Print error, write XML to reject directory, skip

### Rule: NexGen Normalization Level Must Be Non-Positive
- **Source:** nexgen_filter.cpp (constructor)
- **Trigger:** CLI argument parsing
- **Condition:** `--normalization-level > 0`
- **Action:** Exit with error "positive --normalization-level is invalid"

### Rule: User Confirmation Required for Destructive Operations
- **Source:** panel_copy.cpp, rdcatch_copy.cpp
- **Trigger:** After database connections established, before any writes
- **Condition:** Always (interactive prompt)
- **Action:** Print WARNING, wait for RETURN key (or CTRL-C to abort)
- **Gherkin:**
  ```gherkin
  Scenario: User must confirm destructive copy operation
    Given the tool is ready to overwrite destination data
    When the user is prompted for confirmation
    Then pressing RETURN proceeds with the copy
    And pressing CTRL-C aborts the operation
  ```

### Rule: SAS Delete Wipes All Events
- **Source:** sas_filter.cpp (DeleteList)
- **Trigger:** `-d` command-line flag
- **Condition:** Always
- **Action:** DELETE ALL rows from RECORDINGS table (no WHERE clause), reset RDCatchd

### Configuration Keys

| Key | Source | Used By | Description |
|-----|--------|---------|-------------|
| rd.conf (RD_CONF_FILE) | RDConfig | panel_copy, rivendell_filter, rdcatch_copy | MySQL credentials, hostname |
| sasStation | RDConfig | sas_filter | Station name for RECORDINGS.STATION_NAME |
| sasMatrix | RDConfig | sas_filter | Matrix channel for RECORDINGS.CHANNEL |
| sasBaseCart | RDConfig | sas_filter | Base cart offset for GPO-to-macro-cart calculation |
| password | RDConfig | wings_filter, nexgen_filter, sas_filter | RIPCD/RDCatchd connection password |
| stationName | RDConfig | wings_filter | Origin station for CUTS.ORIGIN_NAME |

### Error Patterns

| Error | Severity | Tool | Condition | Message |
|-------|----------|------|-----------|---------|
| DB connect failure | fatal | all | MySQL connection fails | "unable to connect to [source/destination] mySQL server" |
| DB version mismatch | fatal | panel_copy, rdcatch_copy | VERSION.DB != expected | "database version mismatch" |
| Invalid arguments | fatal | all | Missing/malformed CLI args | "invalid argument" |
| Self-copy | fatal | panel_copy | Same src/dest host | "cannot copy a database onto itself" |
| Group not found | fatal | rivendell_filter, wings_filter | Default group missing | "default group does not exist" |
| Cart range invalid | fatal | rivendell_filter | Cart numbers invalid | "invalid [start/end] cart value" |
| Audio not found | warning | rivendell_filter | Audio file missing | "[WARNING -- NO AUDIO FOUND]" |
| ATX corrupt | warning | wings_filter | Bad ATX header | "ATX header appears corrupt, skipping" |
| Group full | warning | wings_filter | No free carts | "No more available carts in group" |
| XML parse failure | warning | nexgen_filter | Invalid XML | "unable to parse XML file" |
| Cart out of range | warning | nexgen_filter | Cart outside group range | "calculated cart number is invalid for group" |
| Audio open failure | warning | nexgen_filter | File not found | "unable to open audio file" |
| MPEG decode failure | warning | nexgen_filter | madplay fails | "MPEG converter error with file" |
| Normalization positive | fatal | nexgen_filter | Level > 0 | "positive --normalization-level is invalid" |

---

## UI Contracts

No UI. All tools in this artifact are command-line interface (CLI) batch processing tools with no graphical user interface, no .ui files, no QML, and no programmatic widget creation.

### Console I/O

| Tool | Input | Output |
|------|-------|--------|
| panel_copy | stdin (RETURN for confirmation) | stdout (progress), stderr (errors) |
| wings_filter | (none) | stdout (import progress per file), stderr (errors/warnings) |
| rivendell_filter | (none) | stdout (transfer progress per cart), stderr (errors/warnings) |
| nexgen_filter | (none) | stdout (verbose import progress), stderr (errors/warnings) |
| rdcatch_copy | stdin (RETURN for confirmation) | stdout (progress), stderr (errors) |
| sas_filter | (none) | stdout (import summary), stderr (errors) |
