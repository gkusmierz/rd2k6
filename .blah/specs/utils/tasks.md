# Implementation Plan

- [ ] 1. Database schema management
- [ ] 1.1 Implement SchemaMap value object with version-to-schema mappings
  - Create a pure C++ class mapping Rivendell version strings to schema numbers (e.g., "1.0" to 159, "3.6" to 347)
  - Implement bidirectional lookup: version string to schema number and schema number to version string
  - Validate version strings and return `std::optional<int>` for unknown versions
  - Support the full version range from 1.0 (schema 159) through 3.6 (schema 347)
  - _Requirements: 1_

- [ ] 1.2 Define ISchemaService and IDatabaseAdapter port interfaces
  - Define `ISchemaService` with operations: createDatabase, migrateSchema, revertSchema, checkIntegrity, currentSchemaVersion, printStatus
  - Define `IDatabaseAdapter` with operations: executeDdl, executeDml, queryScalar, queryRows, tableExists, databaseExists, createDatabase
  - All interfaces use domain types only (no database framework types in signatures)
  - _Requirements: 1_

- [ ] 1.3 Implement SchemaManager domain service
  - Implement the create flow: create database, create all base tables (~90 tables), populate initial data (default user, station, groups, services), insert default import templates and hotkey mappings, create per-service reconciliation tables, then apply all migrations to current version
  - Implement the modify flow: resolve target version via SchemaMap, apply incremental migrations sequentially from current to target version
  - Implement the revert flow: apply reverse migrations from current down to target version
  - Validate preconditions: administrative privileges, single command, no conflicting flags, valid schema range, explicit target for downgrades
  - _Requirements: 1_

- [ ] 1.4 Implement IntegrityChecker domain service
  - Implement orphaned cart detection (carts not in any valid group)
  - Implement orphaned cut detection (cuts not attached to any valid cart)
  - Implement orphaned audio detection (audio files without database records)
  - Implement orphaned voice track detection (voice track carts not referenced by any log)
  - Implement cut count verification (CART.CUT_QUANTITY vs actual CUTS count)
  - Implement pending cart detection (carts stuck in pending state)
  - Implement audio length validation (file length vs database LENGTH value)
  - Implement table attribute verification (charset, engine settings)
  - Implement audio relinking from alternate path (copy or move mode)
  - Implement content hash recalculation for specified carts/cuts
  - _Requirements: 1_

- [ ] 1.5 Implement SQL adapter for IDatabaseAdapter
  - Implement DDL execution for schema creation and migration statements
  - Implement DML execution for data population and modification
  - Implement query methods for schema version, table structure, record counts
  - Read database credentials from configuration file as fallback
  - Translate SQL errors to domain error types
  - _Requirements: 1_

- [ ] 1.6 Implement schema manager CLI composition root
  - Parse CLI arguments: --create, --modify, --check, --set-schema, --set-version, --verbose, --yes, --no, --orphan-group, --dump-cuts-dir, --relink-audio, --rehash, and all sub-options
  - Wire SchemaManager and IntegrityChecker to SQL adapter
  - Validate argument combinations and report errors
  - Print progress timestamps when --print-progress is enabled
  - _Requirements: 1_

- [ ] 1.7 (P) Unit tests for schema management
  - Test SchemaMap version-to-schema resolution for all known versions
  - Test SchemaMap returns empty for unknown versions
  - Test CLI argument validation: mutual exclusion of --yes/--no, single command requirement, schema range validation
  - Test precondition checks: privilege verification, dump directory validation, orphan group existence
  - _Requirements: 1_

- [ ] 2. Audio import
- [ ] 2.1 Define IImportService, IAudioStore, and INotificationService port interfaces
  - Define `IImportService` with operations: importFile, importBatch, runDropbox
  - Define `IAudioStore` with operations: writeAudio, readAudio, deleteAudio, fileExists, scanDirectory, calculateHash
  - Define `INotificationService` with operations: publishEvent, sendEmailNotification
  - _Requirements: 2_

- [ ] 2.2 Implement AudioImporter domain service
  - Implement single file import: open, validate, optionally repair headers, extract metadata from filename pattern or XML, find/create cart and cut slot, write audio to store, apply normalization and auto-trim, update metadata, send notification
  - Implement batch import: iterate files, track results in ImportJournal, report summary
  - Implement dropbox mode: monitor directories for new files, import on detection, use timestamp cache to avoid reimporting
  - Implement ISCI cross-reference matching for commercial content
  - Implement result codes: Success, FileBad, NoCart, NoCut, DuplicateTitle
  - _Requirements: 2_

- [ ] 2.3 Implement ImportJournal and MarkerCalculator domain helpers
  - ImportJournal: track successes and failures per notification address, aggregate and send grouped email notifications
  - MarkerCalculator: calculate auto-trim markers from silence threshold, calculate auto-segue markers from silence threshold, validate marker positions against audio length
  - _Requirements: 2, 9_

- [ ] 2.4 Implement audio import CLI composition root
  - Parse CLI arguments: group, cart number, mono mixdown, normalization level, auto-trim level, delete-source, delete-cuts, dropbox mode, metadata pattern, fix-broken-formats, XML, import-by-ISCI
  - Wire AudioImporter to adapters (audio store, cart repository, notification service, IPC client)
  - Authenticate via IPC daemon before proceeding
  - Report per-file results and exit with failure count as exit code
  - _Requirements: 2_

- [ ] 2.5 (P) Integration tests for audio import
  - Test importing a valid audio file creates cart, cut, and audio store entry
  - Test metadata pattern extraction from filename
  - Test broken format repair and reimport
  - Test duplicate title detection
  - Test import with normalization and auto-trim markers
  - _Requirements: 2_

- [ ] 3. Audio export
- [ ] 3.1 Implement AudioExporter domain service
  - Implement export by cart number: export all cuts in the cart to files
  - Implement export by group: query all carts in group, export each
  - Implement export by scheduler code: query matching carts, export each
  - Implement export by title pattern: query matching carts, export each
  - Implement output filename resolution from pattern using cart/cut metadata
  - Sanitize output file paths (remove invalid characters)
  - _Requirements: 3_

- [ ] 3.2 Implement audio export CLI composition root
  - Parse CLI arguments: cart number, group name, scheduler code, title pattern, output filename pattern, format settings, verbose
  - Wire AudioExporter to audio store and cart repository adapters
  - Authenticate via IPC daemon
  - _Requirements: 3_

- [ ] 4. Command-line log editor
- [ ] 4.1 Implement CliLogEditor domain service
  - Implement REPL loop: read command, dispatch to handler, display result
  - Implement commands: load, new, save, saveas, list, listlogs, listservices, deletelog, unload, help
  - Implement line operations: addcart, addchain, addmarker, addtrack, remove
  - Implement property setters: setcart, setcomment, setdesc, setenddate, setlabel, setpurgedate, setservice, setstartdate, settime, settrans, setautorefresh
  - _Requirements: 4_

- [ ] 4.2 Implement CLI log editor composition root
  - Wire CliLogEditor to log repository adapter and IPC client
  - Authenticate via IPC daemon
  - Present interactive prompt
  - _Requirements: 4_

- [ ] 5. Log-to-audio rendering
- [ ] 5.1 Implement LogRenderer domain service
  - Accept log name, output path or cart number, rendering options (start time, line range, ignore stops)
  - Retrieve log events, iterate audio entries, mix down to single output via audio rendering port
  - Report progress via callback/event
  - _Requirements: 5_

- [ ] 5.2 Implement log renderer CLI composition root
  - Parse CLI arguments: log name, output file, cart number, start time, first/last line, ignore-stops, format settings
  - Wire LogRenderer to log repository, audio store, and rendering adapter
  - Display progress messages
  - _Requirements: 5_

- [ ] 6. Audio format conversion
- [ ] 6.1 Implement AudioConverter domain service
  - Accept source file, destination file, format settings, optional start/end points, optional speed ratio
  - Read source audio, apply range extraction and speed adjustment, write to destination format
  - _Requirements: 6_

- [ ] 6.2 Implement audio converter CLI composition root
  - Parse CLI arguments: source, destination, format settings, start/end points, speed ratio
  - Wire AudioConverter to audio file adapter
  - _Requirements: 6_

- [ ] 7. Bulk content deletion
- [ ] 7.1 Implement BulkDeleter domain service
  - Implement cart deletion: remove cart record, all associated cuts, and audio files from store
  - Implement log deletion: remove log and all log lines
  - Support reading identifiers from command-line arguments or standard input
  - _Requirements: 7_

- [ ] 7.2 Implement bulk deleter CLI composition root
  - Parse CLI arguments: object type (cart/log), identifiers
  - Support piped input from standard input
  - Wire BulkDeleter to cart repository, log repository, and audio store
  - Authenticate via IPC daemon
  - _Requirements: 7_

- [ ] 8. System maintenance
- [ ] 8.1 Implement MaintenanceRunner domain service
  - Implement system maintenance: purge expired ELR records per service shelf life, remove stale dropbox paths, purge old GPIO events, purge expired web API auth tokens, trim scheduler stacks per service (cascade to scheduler codes), delete expired cuts, delete expired logs
  - Implement local maintenance: recalculate content hashes for flagged cuts
  - _Requirements: 8_

- [ ] 8.2 Implement maintenance CLI composition root
  - Parse CLI arguments: system/local mode selection
  - Wire MaintenanceRunner to database adapter and audio store
  - Authenticate via IPC daemon
  - _Requirements: 8_

- [ ] 8.3 (P) Integration tests for maintenance
  - Test ELR purge: seed records older than shelf life, verify deletion
  - Test dropbox path purge: seed paths to non-existent files, verify cleanup
  - Test scheduler stack trimming with cascade to associated records
  - Test expired cut and log deletion
  - _Requirements: 8_

- [ ] 9. Batch marker setting
- [ ] 9.1 Implement MarkerSetter domain service
  - Process all cuts in a specified group
  - Set auto-trim markers based on silence threshold
  - Set auto-segue markers based on silence threshold
  - Clear auto-trim markers when requested
  - Clear auto-segue markers when requested
  - _Requirements: 9_

- [ ] 9.2 Implement marker setter CLI composition root
  - Parse CLI arguments: group name, auto-trim level, auto-segue level, clear flags
  - Wire MarkerSetter to cut repository and audio store
  - Authenticate via IPC daemon
  - _Requirements: 9_

- [ ] 10. Cart metadata update
- [ ] 10.1 Implement MetadataUpdater domain service
  - Accept cart number and metadata fields (artist, title, album, year)
  - Accept scheduler code additions and removals
  - Update cart record and send notification event
  - _Requirements: 10_

- [ ] 10.2 Implement metadata updater CLI composition root
  - Parse CLI arguments: cart number, metadata fields, scheduler code additions/removals
  - Wire MetadataUpdater to cart repository and notification service
  - Authenticate via IPC daemon
  - _Requirements: 10_

- [ ] 11. Audio validation
- [ ] 11.1 Implement CutValidator domain service
  - Validate all cuts in a specified group: check audio file exists, is readable, matches expected length
  - Optionally render each cut to verify playback integrity
  - Report per-cut validation results
  - _Requirements: 11_

- [ ] 11.2 Implement cut validator CLI composition root
  - Parse CLI arguments: group name, render option
  - Wire CutValidator to cut repository and audio store
  - _Requirements: 11_

- [ ] 12. Database configuration UI
- [ ] 12.1 Implement DatabaseConfigView (QML)
  - Display connection info: hostname, username, database name, schema version
  - Create button: prompt for admin credentials (dialog), invoke schema service create
  - Backup button: invoke database dump to file
  - Restore button: select file, invoke restore from dump
  - Schema mismatch warning display
  - _Requirements: 12_

- [ ] 12.2 Implement database config composition root
  - Wire DatabaseConfigView to schema service and database adapter
  - _Requirements: 12_

- [ ] 13. Macro command sender
- [ ] 13.1 Implement MacroSender domain service and IMacroTransport port
  - Define `IMacroTransport` with sendCommand(host, port, command, protocol): Result<string, TransportError>
  - Support both UDP and TCP protocols
  - _Requirements: 13_

- [ ] 13.2 Implement macro sender GUI (QML)
  - Host address input, protocol selector (TCP/UDP), port input
  - Command text input, send button, response display
  - Poll for responses on a timer
  - _Requirements: 13_

- [ ] 13.3 Implement macro sender CLI mode
  - Read commands from file or standard input
  - Send each command sequentially to the specified host
  - _Requirements: 13_

- [ ] 13.4 Implement network adapter for IMacroTransport
  - UDP datagram sending and response reading via Qt Network
  - TCP socket connection and message exchange via Qt Network
  - Hostname resolution
  - _Requirements: 13_

- [ ] 14. Disc audio import
- [ ] 14.1 Define IDiscReader port interface
  - Define operations: detectMedia, listTracks, ripTrack (with progress callback), ejectMedia
  - Define MetaRecord value object: title, artist, album, year, ISRC, BPM, segue markers
  - Define MetaLibrary value object: collection of MetaRecord loaded from index file
  - _Requirements: 14_

- [ ] 14.2 Implement DiscImporter GUI (QML)
  - Index file browser and loader
  - Group selector dropdown
  - Track list with metadata display (editable on double-click)
  - Rip button, progress bars (overall and per-track)
  - Channels selector, auto-trim toggle with level, normalization toggle with level
  - Eject button, close button
  - _Requirements: 14_

- [ ] 14.3 Implement disc reader adapter
  - Detect inserted media and enumerate tracks via Qt Multimedia or platform adapter
  - Rip audio tracks to temporary files, report progress
  - Integrate with AudioImporter for final import to cart/cut system
  - _Requirements: 14_

- [ ] 15. Traffic data import
- [ ] 15.1 Implement TrafficParser domain service
  - Parse traffic events from external format file: extract time, length, ISCI code, title, client
  - Represent events as a list of TrafficEvent value objects
  - _Requirements: 15_

- [ ] 15.2 Implement TrafficImporter GUI (QML)
  - Service selector dropdown
  - File browser for traffic data file
  - Date picker
  - Process button, progress bar, messages text area
  - _Requirements: 15_

- [ ] 15.3 Implement traffic import processing flow
  - Load events via TrafficParser
  - For each event: check if spot exists in library, import audio if missing
  - Write formatted traffic file for the selected service
  - Report progress and missing spots
  - _Requirements: 15_

- [ ] 16. GPIO line monitor
- [ ] 16.1 Implement GpioMonitor domain service
  - Subscribe to GPIO state change events from IPC client
  - Track current state, mask, and cart assignments for all lines per matrix
  - Query historical GPIO events from database by date and state filter
  - _Requirements: 16_

- [ ] 16.2 Implement GPIO monitor GUI (QML)
  - GPI/GPO type selector, matrix selector
  - Grid of GPIO line widgets showing: line number, state indicator, on-cart label, off-cart label, mask state
  - Scroll up/down for matrices with many lines
  - Events section: date filter, state filter, event list, scroll toggle, report button
  - Real-time updates when state changes arrive
  - _Requirements: 16_

- [ ] 17. Macro soft-key panel
- [ ] 17.1 Implement SoftKeyPanel domain service and GUI (QML)
  - Read key map configuration file: button labels and associated macro commands
  - Display grid of labeled buttons, dynamically sized to configuration
  - On button click: send associated macro command via MacroSender/IMacroTransport
  - _Requirements: 17_

- [ ] 18. File collection and sorting utility
- [ ] 18.1 Implement FileCollector domain service and CLI
  - Scan specified source directories for data files
  - Read all lines, sort, deduplicate if needed
  - Write merged output to specified file
  - _Requirements: 18_

- [ ] 19. Directory cleanup utility
- [ ] 19.1 Implement DirectoryCleaner domain service and CLI
  - Scan target path for empty directories
  - Remove empty and stale directories
  - _Requirements: 19_

- [ ] 20. Configuration selector helper
- [ ] 20.1 Implement ConfigSelector domain service and CLI
  - Activate configuration: start automounter for network audio mounts, apply configuration
  - Deactivate configuration: stop automounter, release configuration
  - Detect concurrent instances and prevent parallel execution
  - _Requirements: 20_

- [ ] 21. Audio tone generator
- [ ] 21.1 Implement ToneGenerator and CLI
  - Generate WAV file with test tone at specified frequency and duration
  - Pure implementation with no framework dependencies (portable C++)
  - Support standard sample rates and bit depths
  - _Requirements: 21_

- [ ] 22. Popup notification utility
- [ ] 22.1 Implement PopupNotifier CLI
  - Accept message text as argument
  - Display a simple popup dialog with the message
  - Exit when dialog is dismissed
  - _Requirements: 22_
