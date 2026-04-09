# Implementation Plan

- [ ] 1. Domain value objects and validation service
- [ ] 1.1 Define import domain value objects
  - Implement WingsRecord value object: filename (string, max 8 chars), extension (string, max 3 chars), title, artist, album, group code (single char), length in milliseconds
  - Implement NexGenMetadata value object: title, artist, album, label, composer, content identifier, start/end dates, crossfade values, fade-up value, cart number
  - Implement PanelAssignment value object: type, owner, panel number, row, column, label, cart number, color
  - Implement SchedulingEvent entity: station name, type (switch/macro enum), channel, day-of-week flags (7 booleans), start time, description, active flag, input number, output number, cart number
  - Implement AudioEncoding enum class: Mpeg, Uncompressed, Unknown
  - All value objects are immutable after construction, use `[[nodiscard]]` on getters, `std::optional` for optional fields
  - Pure C++ only, no Qt headers
  - _Requirements: 1, 2, 3_

- [ ] 1.2 (P) Implement ValidationService with all precondition checks
  - Implement `validateDatabaseVersion(version, expectedVersion)` returning error on mismatch
  - Implement `validateGroupExists(groupName, repository)` verifying group is present
  - Implement `validateCartRange(start, end)` enforcing 1-999999 bounds and start <= end
  - Implement `validateCartNumber(cartNumber, group)` checking against group's configured low/high range
  - Implement `validateNormalizationLevel(level)` rejecting positive values
  - Implement `validateNotSelfCopy(sourceHost, destHost)` for panel copy
  - Implement `validateNotSelfCopy(sourceHost, sourceStation, destHost, destStation)` for catch event copy
  - All methods return Result types with structured error information
  - Pure C++ only
  - _Requirements: 4_

- [ ] 1.3 (P) Unit tests for validation service
  - Test database version mismatch detection with matching and non-matching versions
  - Test cart range: valid range, start > end, start = 0, end > 999999
  - Test cart number validation against group range boundaries
  - Test normalization level: zero (valid), negative (valid), positive (rejected)
  - Test self-copy detection: same host rejected, different hosts accepted
  - Test catch event self-copy: same host + same station rejected, same host + different station accepted
  - _Requirements: 4_

- [ ] 2. Source data parsers
- [ ] 2.1 Implement WingsRecordParser for fixed-width database format
  - Parse one record per line from Wings database file: fixed-width fields for filename, extension, title, artist, album, group, length
  - Implement trailing space trimming for fixed-width fields
  - Return a list of WingsRecord value objects
  - Handle end-of-file and malformed lines gracefully
  - Pure C++ only
  - _Requirements: 2_

- [ ] 2.2 (P) Implement NexGenXmlParser for XMLDAT metadata files
  - Parse NexGen XMLDAT files line by line, extracting tag/value pairs
  - Map NexGen XML tags to NexGenMetadata fields: title, artist, album, label, composer, content identifier (ISRC), start/end dates, crossfade/fade-up values, cart number
  - Parse NexGen datetime format into standard datetime representation
  - Handle XML entity unescaping
  - Return populated NexGenMetadata value object and optional audio filename
  - Pure C++ only
  - _Requirements: 2_

- [ ] 2.3 (P) Implement NexGenArchiveExtractor for PKT binary archives
  - Parse PKT archive format: 104-byte headers with "FR:" marker, file path, and 4-byte little-endian file length
  - Extract embedded files (XML metadata + audio) to a specified temporary directory
  - Identify XML and audio components among extracted files
  - Handle malformed archives gracefully (log warning, skip)
  - Pure C++ standard library I/O only (no Qt)
  - _Requirements: 2_

- [ ] 2.4 (P) Implement SasEventParser for fixed-width event format
  - Parse 79-character fixed-width SAS event lines
  - Extract: day-of-week activation flags (chars 0-6, 'X' = active for Mon-Sun), start time (chars 9-16, HH:MM:SS), description (chars 19-59), active flag (char 77, 'I' = inactive), output number (chars 62-64), input number (chars 67-69), GPO number (chars 73-74)
  - Classify each event: input > 0 and output > 0 produces switch event; GPO > 0 produces macro cart event
  - Calculate macro cart number as base cart + GPO number
  - Return list of SchedulingEvent entities
  - Pure C++ only
  - _Requirements: 3_

- [ ] 2.5 (P) Unit tests for all source data parsers
  - WingsRecordParser: parse valid record, handle short lines, verify space trimming, verify field boundaries
  - NexGenXmlParser: parse complete XMLDAT, handle missing optional tags, verify datetime parsing, verify entity unescaping
  - NexGenArchiveExtractor: parse valid PKT with multiple files, handle truncated archive, verify header parsing
  - SasEventParser: parse switch event line, parse macro event line, handle inactive flag, verify day-of-week extraction, verify cart calculation from GPO + base
  - _Requirements: 2, 3_

- [ ] 3. Outbound port interfaces
- [ ] 3.1 Define all outbound port interfaces for import operations
  - Define IPanelRepository: findAll, deleteAll, insertAll (operates on PanelAssignment value objects)
  - Define IEventRepository: findAllForStation, deleteAllForStation, deleteAll, insert (operates on SchedulingEvent entities)
  - Define IAudioFileStore: copyAudioFile (source path to destination cut ID), importWithNormalization (with level parameter)
  - Define IAudioDecoder: decode (source to destination path), detectEncoding (returns AudioEncoding enum)
  - Define ICatchDaemonControl: reset
  - Define IConfigProvider: getDatabaseVersion, getSasStation, getSasMatrix, getSasBaseCart, getStationName, getDatabaseCredentials
  - All interfaces are pure virtual with virtual destructor, I-prefix naming, header-only, domain types only in signatures
  - _Requirements: 1, 2, 3, 4_

- [ ] 4. Import domain services
- [ ] 4.1 Implement PanelCopyService
  - Accept source and destination IPanelRepository, IConfigProvider, and a confirmation callback
  - Validate not self-copy via ValidationService
  - Validate database versions via ValidationService
  - Invoke confirmation callback; abort if not confirmed
  - Delete all destination panels, copy all source panels
  - Return structured result with count of copied records or error
  - _Requirements: 1, 4_

- [ ] 4.2 (P) Implement CatchEventCopyService
  - Accept source and destination IEventRepository, IConfigProvider, and a confirmation callback
  - Validate not identical host+station via ValidationService
  - Validate database versions match
  - Validate both station names exist
  - Invoke confirmation callback; abort if not confirmed
  - Delete all destination station events, copy all source events with station name replacement
  - Return structured result with count of copied events or error
  - _Requirements: 1, 4_

- [ ] 4.3 (P) Implement WingsImportService
  - Accept ICartRepository, ICutRepository, IAudioFileStore, IGroupRepository, and configuration (default group, audio directory, audio extension)
  - Validate default group exists via ValidationService
  - Use WingsRecordParser to read source database file
  - For each record: resolve group (record's group if exists, else default), allocate next free cart number, create cart and cut, validate ATX audio header, copy audio to store
  - Skip records with corrupt audio headers (log warning)
  - Skip records when group has no available carts (log warning)
  - Return import summary: total records, imported count, skipped count with reasons
  - _Requirements: 2, 4_

- [ ] 4.4 (P) Implement RivendellImportService
  - Accept local and remote ICartRepository, ICutRepository, IAudioFileStore, IGroupRepository, IConfigProvider, and configuration (default group, cart range, remote audio directory)
  - Validate default group exists locally
  - Validate cart range via ValidationService
  - For each cart in range from remote: resolve group (fallback to default if not local), delete existing local cart and cuts, insert cart with all metadata, insert all cuts with all metadata and markers, copy audio file
  - Handle NULL/invalid datetime fields by storing as empty optional
  - Log warning for missing audio files, continue processing
  - Return transfer summary: total carts, transferred count, missing audio count
  - _Requirements: 2, 4_

- [ ] 4.5 (P) Implement NexGenImportService
  - Accept ICartRepository, ICutRepository, IAudioFileStore, IGroupRepository, IAudioDecoder, and configuration (group, audio directory, reject directory, cart offset, delete cuts flag, normalization level, verbose flag)
  - Validate group exists, validate normalization level via ValidationService
  - For each input file: determine type (XML or PKT)
  - PKT files: use NexGenArchiveExtractor to extract, locate XML + audio components
  - XML files: use NexGenXmlParser to parse metadata, locate audio in audio directory
  - Validate cart number (after offset): range 1-999999 and within group range; reject invalid to reject directory
  - Detect audio encoding via IAudioDecoder; decode MPEG if needed
  - Import audio with normalization via IAudioFileStore
  - Apply metadata to cart and cut: title, artist, album, label, composer, ISRC, dates, markers (segue from crossfade, start from fade-up)
  - Optionally delete existing cuts before import
  - Return import summary: total files, imported count, rejected count
  - _Requirements: 2, 4_

- [ ] 4.6 (P) Implement SasEventImportService
  - Accept IEventRepository, ICatchDaemonControl, IConfigProvider
  - Insert mode: use SasEventParser to parse event file, insert each event with configured station name and matrix channel
  - Delete mode: delete all events from database, reset catch daemon
  - After insert, reset catch daemon to pick up new events
  - Return summary: switch events imported, macro events imported (insert mode) or deletion confirmation (delete mode)
  - _Requirements: 3, 4_

- [ ] 4.7 (P) Unit tests for all import domain services
  - PanelCopyService: test self-copy rejection, version mismatch rejection, confirmation abort, successful copy count
  - CatchEventCopyService: test identical host+station rejection, same host different station allowed, station not found, successful copy with station name replacement
  - WingsImportService: test group fallback, corrupt ATX skip, group full skip, successful import
  - RivendellImportService: test cart range validation, group fallback, missing audio warning continuation, successful transfer
  - NexGenImportService: test cart offset application, out-of-range rejection to reject directory, MPEG detection and decode, delete-cuts flag, normalization application
  - SasEventImportService: test switch event creation, macro event creation from GPO + base cart, delete mode full wipe, daemon reset call
  - All tests use mock implementations of outbound ports
  - _Requirements: 1, 2, 3, 4_

- [ ] 5. Persistence and infrastructure adapters
- [ ] 5.1 Implement SqlPanelRepository adapter
  - Implement IPanelRepository using Qt SQL
  - findAll: SELECT TYPE, OWNER, PANEL_NO, ROW_NO, COLUMN_NO, LABEL, CART, DEFAULT_COLOR from PANELS
  - deleteAll: DELETE FROM PANELS
  - insertAll: INSERT INTO PANELS for each PanelAssignment
  - Support operating on configurable database connections (source vs destination)
  - _Requirements: 1_

- [ ] 5.2 (P) Implement SqlEventRepository adapter
  - Implement IEventRepository using Qt SQL
  - Map all RECORDINGS table columns to SchedulingEvent entity fields
  - Support station-scoped delete and full table delete
  - Insert events with all fields: IS_ACTIVE, TYPE, CHANNEL, CUT_NAME, day-of-week, DESCRIPTION, START_TYPE/TIME, END_TYPE/TIME, MACRO_CART, SWITCH_INPUT, SWITCH_OUTPUT
  - _Requirements: 1, 3_

- [ ] 5.3 (P) Implement AudioFileStoreAdapter
  - Implement IAudioFileStore using Qt Core file I/O
  - copyAudioFile: copy from source path to Rivendell audio store path derived from cut ID
  - importWithNormalization: delegate to audio import infrastructure with normalization parameter
  - Return structured errors for file-not-found and I/O failures
  - _Requirements: 2_

- [ ] 5.4 (P) Implement AudioDecoderAdapter
  - Implement IAudioDecoder using Qt Multimedia or appropriate audio library
  - detectEncoding: read file header bytes to distinguish MPEG from uncompressed audio
  - decode: convert MPEG audio to uncompressed format
  - Return structured errors for decode failures
  - _Requirements: 2_

- [ ] 5.5 (P) Implement CatchDaemonControlAdapter
  - Implement ICatchDaemonControl
  - reset: send reset command to catch scheduling daemon via network protocol
  - _Requirements: 3_

- [ ] 5.6 (P) Implement ConfigProviderAdapter
  - Implement IConfigProvider using Qt Core configuration file reading
  - Read database credentials, SAS-specific configuration (station, matrix, base cart), station name
  - Read database schema version from VERSION table
  - _Requirements: 1, 3, 4_

- [ ] 6. CLI entry points
- [ ] 6.1 Implement panel_copy CLI entry point
  - Parse -h (source host) and -H (destination host) arguments
  - Wire PanelCopyService with SqlPanelRepository adapters for both connections and ConfigProviderAdapter
  - Provide confirmation callback that prints warning and reads user input
  - Print progress and result summary
  - Exit with appropriate status code
  - _Requirements: 1, 4_

- [ ] 6.2 (P) Implement rdcatch_copy CLI entry point
  - Parse -h (source MySQL host), -s (source station), -H (destination MySQL host), -S (destination station)
  - Wire CatchEventCopyService with SqlEventRepository adapters and ConfigProviderAdapter
  - Reuse single database connection when source and destination hosts match
  - Provide confirmation callback
  - _Requirements: 1, 4_

- [ ] 6.3 (P) Implement wings_filter CLI entry point
  - Parse -g (default group), -d (database file), -A (audio directory), -e (audio extension, optional)
  - Wire WingsImportService with repository adapters, audio store adapter, and group repository
  - Print per-file import progress and final summary
  - _Requirements: 2, 4_

- [ ] 6.4 (P) Implement rivendell_filter CLI entry point
  - Parse -h (hostname), -u (username), -p (password), -A (audio directory), -g (default group), -s (start cart), -e (end cart)
  - Wire RivendellImportService with local and remote repository adapters
  - Print per-cart transfer progress and final summary
  - _Requirements: 2, 4_

- [ ] 6.5 (P) Implement nexgen_filter CLI entry point
  - Parse --group, --audio-dir, --reject-dir, --cart-offset, --delete-cuts, --normalization-level, --verbose, and positional input file arguments
  - Wire NexGenImportService with all required adapters
  - Print verbose progress when enabled and final summary
  - _Requirements: 2, 4_

- [ ] 6.6 (P) Implement sas_filter CLI entry point
  - Parse -d (delete mode) and -i (insert mode with file path)
  - Wire SasEventImportService with event repository, catch daemon control, and config provider adapters
  - Print import summary (switch count, macro count) or deletion confirmation
  - _Requirements: 3, 4_

- [ ] 7. Integration tests
- [ ] 7.1 Integration tests for import services with real database
  - WingsImportService: import test Wings database file into test database, verify cart/cut records and audio files
  - RivendellImportService: set up source and destination test databases, transfer cart range, verify complete metadata fidelity
  - NexGenImportService: process test XML file and test PKT archive, verify metadata application and marker calculation
  - PanelCopyService: copy panels between two test database connections, verify complete replacement
  - CatchEventCopyService: copy events with station name substitution, verify replacement
  - SasEventImportService: import test event file, verify switch and macro event classification and field values; test delete mode
  - _Requirements: 1, 2, 3, 4_

- [ ] 7.2 (P) Build system integration
  - Add importers to QMake SUBDIRS project structure
  - Configure each CLI tool as a separate executable target
  - Link domain library (no Qt), adapters library (Qt SQL, Qt Core, Qt Multimedia), and core library (LIB)
  - Verify domain code compiles without Qt (QT -= core gui)
  - Add test targets mirroring the source structure
  - _Requirements: 1, 2, 3, 4_
