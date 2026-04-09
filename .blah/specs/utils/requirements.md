# Requirements Document

## Introduction

The Utils artifact provides a collection of standalone command-line and graphical utility tools for the Rivendell radio automation platform. These tools handle database schema management, audio import/export, log editing, system maintenance, metadata management, audio format conversion, and various administrative functions. Each utility is an independent executable that connects to the Rivendell infrastructure (database, IPC daemon) as needed. The collection spans 23 sub-tools covering the full lifecycle of system administration, content management, and diagnostics.

## Requirements

### Requirement 1: Database Schema Management

**Objective:** As a system administrator, I want to create, upgrade, downgrade, and verify the Rivendell database schema, so that the system database stays consistent and up-to-date across releases.

#### Acceptance Criteria

1. When the administrator invokes the create command, the system shall create a new database with all tables at the base schema version and then apply all migrations to the current version.
2. When the administrator invokes the modify command with a target version, the system shall apply incremental schema migrations from the current version to the target version.
3. When the administrator invokes the modify command with a target version lower than the current version, the system shall revert schema migrations back to the target version.
4. When the administrator invokes the check command, the system shall verify database integrity including orphaned carts, orphaned cuts, orphaned audio files, orphaned voice tracks, cut count mismatches, pending carts, audio length validation, and table attribute correctness.
5. If the user is not running with administrative privileges, then the system shall exit with an error indicating that administrative privileges are required.
6. If more than one command (create, modify, check) is specified, then the system shall exit with an error indicating that exactly one command must be specified.
7. If both the auto-confirm and auto-deny flags are specified, then the system shall exit with an error indicating they are mutually exclusive.
8. If the target schema version is outside the supported range, then the system shall exit with an error indicating the version is unsupported.
9. If a schema downgrade is implied without an explicit target version, then the system shall exit with an error requesting the administrator to explicitly specify the target schema.
10. When the administrator invokes the check command with a dump directory, the system shall verify the directory exists, is a directory, and is writable before proceeding.
11. When the administrator invokes the check command with an orphan group name, the system shall verify the group exists in the database before proceeding.
12. The system shall print the current database schema version and status when requested.
13. The system shall support reading database credentials from the system configuration file as a fallback when not provided on the command line.
14. When the administrator invokes the check command with the rehash option, the system shall recalculate content hashes for the specified audio files.

### Requirement 2: Audio Import

**Objective:** As a content manager, I want to import audio files into the cart/cut system with metadata extraction and format repair, so that audio content is properly catalogued and available for broadcast.

#### Acceptance Criteria

1. When the user specifies one or more audio files, the system shall import each file into the target group as a new cart/cut entry.
2. When a metadata pattern is specified, the system shall extract metadata fields (title, artist, album, etc.) from the filename according to the pattern.
3. When the dropbox mode is enabled, the system shall continuously monitor designated directories for new audio files and import them automatically.
4. When the fix-broken-formats option is enabled, the system shall attempt to repair malformed audio file headers before import.
5. When the normalize option is enabled, the system shall adjust the audio level to the specified normalization target.
6. When the auto-trim option is enabled, the system shall set trim markers based on the specified silence threshold.
7. If an audio file cannot be read or decoded, then the system shall report a file-bad error and continue with remaining files.
8. If no cart slot is available in the target group, then the system shall report a no-cart error.
9. If no cut slot is available in the target cart, then the system shall report a no-cut error.
10. If a duplicate title is detected and duplicate checking is enabled, then the system shall report a duplicate-title error.
11. When the import-by-ISCI option is enabled, the system shall match files to carts using the ISCI cross-reference table.
12. When the delete-source option is enabled, the system shall remove the source file after successful import.
13. When the XML metadata option is enabled, the system shall read metadata from an accompanying XML file.
14. The system shall send a notification event after each successful import.
15. When import operations complete, the system shall send email notifications grouped by configured notification addresses summarizing successes and failures.

### Requirement 3: Audio Export

**Objective:** As a content manager, I want to export audio from the cart/cut system to files in various formats, so that I can distribute or archive broadcast content.

#### Acceptance Criteria

1. When the user specifies a cart number, the system shall export all cuts in that cart to audio files.
2. When the user specifies a group name, the system shall export all carts in that group.
3. When the user specifies a scheduler code, the system shall export all carts matching that code.
4. When the user specifies a title pattern, the system shall export carts matching the title.
5. When an output filename pattern is specified, the system shall resolve the pattern using cart/cut metadata to generate filenames.
6. The system shall sanitize output file paths to remove invalid characters.

### Requirement 4: Command-Line Log Editing

**Objective:** As a program director, I want to create, edit, and manage broadcast logs from the command line, so that I can automate log management in scripts and remote sessions.

#### Acceptance Criteria

1. The system shall provide an interactive command-line interface with a prompt for log editing commands.
2. When the user issues a load command with a log name, the system shall open the specified log for editing.
3. When the user issues an add-cart command with a cart number, the system shall append the cart to the current log.
4. When the user issues a remove command with a line number, the system shall remove that line from the current log.
5. When the user issues a save command, the system shall persist the current log to the database.
6. When the user issues a save-as command with a new name, the system shall save the current log under the new name.
7. When the user issues a new command with a service name, the system shall create a new empty log for that service.
8. When the user issues a list command, the system shall display all lines in the current log with their properties.
9. The system shall support setting log properties including description, service, start date, end date, purge date, and auto-refresh flag.
10. The system shall support setting line properties including cart number, transition type, time, comment, and label.
11. When the user issues a delete-log command, the system shall permanently delete the specified log.
12. When the user issues a list-logs command, the system shall display all available logs.
13. When the user issues a help command, the system shall display available commands and their syntax.

### Requirement 5: Log-to-Audio Rendering

**Objective:** As a broadcast operator, I want to render a broadcast log to a single audio file, so that I can produce pre-mixed program recordings for rebroadcast or archival.

#### Acceptance Criteria

1. When the user specifies a log name and output file, the system shall mix down all audio events in the log to a single output file.
2. Where a start time is specified, the system shall begin rendering from that time offset.
3. Where a line range is specified, the system shall render only the lines within that range.
4. Where the ignore-stops option is enabled, the system shall continue rendering past stop transitions.
5. When the user specifies a cart number instead of a file, the system shall store the rendered audio as a new cut in that cart.
6. The system shall report rendering progress via progress messages.

### Requirement 6: Audio Format Conversion

**Objective:** As an audio engineer, I want to convert audio files between formats with optional trimming and speed adjustment, so that I can prepare content for different distribution channels.

#### Acceptance Criteria

1. When the user specifies a source file and destination file, the system shall convert the audio to the target format.
2. Where start and end points are specified, the system shall extract only the specified range from the source audio.
3. Where a speed ratio is specified, the system shall adjust the playback speed of the output accordingly.

### Requirement 7: Bulk Content Deletion

**Objective:** As a content manager, I want to delete carts or logs in bulk from the command line, so that I can efficiently clean up obsolete content.

#### Acceptance Criteria

1. When the user specifies cart numbers on the command line, the system shall delete each specified cart and its associated audio files.
2. When the user specifies log names on the command line, the system shall delete each specified log.
3. When input is piped via standard input, the system shall read object identifiers from the pipe and delete them.

### Requirement 8: System Maintenance

**Objective:** As a system administrator, I want to run periodic maintenance tasks to purge expired data and validate audio integrity, so that the system remains clean and performant.

#### Acceptance Criteria

1. When system maintenance runs, the system shall delete event log records older than the configured shelf life for each service.
2. When system maintenance runs, the system shall remove dropbox path records pointing to files that no longer exist.
3. When system maintenance runs, the system shall delete GPIO event records older than the configured retention period.
4. When system maintenance runs, the system shall delete expired web API authentication tokens.
5. When system maintenance runs, the system shall trim scheduler stack entries to the configured maximum per service, removing associated scheduler code records.
6. When local maintenance runs, the system shall recalculate content hashes for audio cuts flagged for rehashing.
7. When system maintenance runs, the system shall delete audio cuts past their configured expiration date.
8. When system maintenance runs, the system shall delete logs past their configured purge date.

### Requirement 9: Batch Marker Setting

**Objective:** As an audio engineer, I want to set auto-trim and auto-segue markers for all cuts in a group, so that I can standardize audio transitions across content categories.

#### Acceptance Criteria

1. When the user specifies a group and auto-trim level, the system shall set trim markers on all cuts in that group based on the silence threshold.
2. When the user specifies a group and auto-segue level, the system shall set segue markers on all cuts in that group based on the silence threshold.
3. When the user specifies the clear option for trim, the system shall remove existing auto-trim markers from all cuts in the group.
4. When the user specifies the clear option for segue, the system shall remove existing auto-segue markers from all cuts in the group.

### Requirement 10: Cart Metadata Update

**Objective:** As a content manager, I want to update metadata on existing carts from the command line, so that I can batch-correct catalogue information.

#### Acceptance Criteria

1. When the user specifies a cart number and metadata fields, the system shall update those fields on the cart record.
2. The system shall support updating artist, title, album, and year fields.
3. When scheduler codes are specified for addition, the system shall add those codes to the cart.
4. When scheduler codes are specified for removal, the system shall remove those codes from the cart.
5. The system shall send a notification event after updating metadata.

### Requirement 11: Audio Validation

**Objective:** As a system administrator, I want to validate that audio cuts exist and are playable, so that I can detect missing or corrupt content before broadcast.

#### Acceptance Criteria

1. When the user specifies a group, the system shall validate all cuts in that group.
2. When validation detects a missing or unplayable cut, the system shall report the specific cut identifier and the nature of the problem.
3. Where the render option is enabled, the system shall attempt to render each cut to verify playback integrity.

### Requirement 12: Database Configuration UI

**Objective:** As a system administrator, I want a graphical interface for database creation, backup, and restoration, so that I can manage the database without memorizing command-line syntax.

#### Acceptance Criteria

1. The system shall display the current database connection information including hostname, username, database name, and schema version.
2. When the administrator clicks the create button, the system shall prompt for database administrator credentials and create a new Rivendell database.
3. When the administrator clicks the backup button, the system shall create a SQL dump of the current database to a file.
4. When the administrator clicks the restore button, the system shall restore the database from a SQL dump file.
5. If the detected schema version does not match the expected version, then the system shall display a mismatch warning.

### Requirement 13: Macro Command Sender

**Objective:** As a broadcast operator, I want to send Rivendell Macro Language commands to any station, so that I can remotely trigger automation actions.

#### Acceptance Criteria

1. The system shall provide both a graphical interface and a command-line interface for sending macro commands.
2. When the user enters a command and destination host, the system shall send the macro command via UDP to the specified host and port.
3. When a response is received, the system shall display the response text.
4. The system shall support both TCP and UDP transport protocols.
5. When running in command-line mode, the system shall read commands from a file or standard input and send them sequentially.

### Requirement 14: Disc Audio Import

**Objective:** As an audio engineer, I want to rip audio tracks from physical media and import them with metadata, so that I can digitize content for broadcast use.

#### Acceptance Criteria

1. When the user inserts media, the system shall detect the media and display available tracks.
2. When the user selects tracks and clicks rip, the system shall extract the audio and import it into the specified group.
3. When an index file is loaded, the system shall populate track metadata from the file.
4. The system shall display progress bars for both overall and per-track ripping progress.
5. Where normalization is enabled, the system shall normalize the ripped audio to the specified level.
6. Where auto-trim is enabled, the system shall set trim markers on the imported audio.
7. When the user double-clicks a track, the system shall allow editing the track metadata.

### Requirement 15: Traffic Data Import

**Objective:** As a traffic manager, I want to import scheduling data from external traffic systems, so that commercial spots are properly scheduled in broadcast logs.

#### Acceptance Criteria

1. When the user selects a traffic data file and a service, the system shall parse the traffic events from the file.
2. When the user clicks process, the system shall import audio for each event and write a formatted traffic file for the service.
3. The system shall display import progress and messages during processing.
4. If a spot referenced in the traffic data is missing from the library, then the system shall report the missing spot and continue processing.

### Requirement 16: GPIO Line Monitor

**Objective:** As a broadcast engineer, I want to monitor GPIO line states and event history in real time, so that I can diagnose hardware switching and automation trigger issues.

#### Acceptance Criteria

1. The system shall display the current state of all GPIO lines for the selected matrix.
2. When a GPIO state changes, the system shall update the display in real time.
3. The system shall display the on-action cart and off-action cart assigned to each GPIO line.
4. When the user selects a date, the system shall display historical GPIO events for that date.
5. The system shall support switching between input (GPI) and output (GPO) views.
6. When the user clicks report, the system shall generate a GPIO events report.
7. The system shall display GPIO mask states indicating which lines are enabled or disabled.

### Requirement 17: Macro Soft-Key Panel

**Objective:** As a broadcast operator, I want a configurable button panel that sends macro commands, so that I can trigger automation actions with a single click.

#### Acceptance Criteria

1. The system shall read a key map configuration file to determine button labels and associated macro commands.
2. When the user clicks a button, the system shall send the associated macro command via UDP to the configured host.
3. The system shall display a grid of labeled buttons arranged according to the key map configuration.

### Requirement 18: File Collection and Sorting

**Objective:** As a system administrator, I want to collect and merge multiple traffic/music data files into a single sorted output, so that data from multiple sources can be consolidated for import.

#### Acceptance Criteria

1. When the user specifies source directories and an output file, the system shall scan the directories for data files.
2. The system shall sort all collected lines and write them to the single output file.

### Requirement 19: Directory Cleanup

**Objective:** As a system administrator, I want to clean up empty or stale directories, so that the file system remains organized.

#### Acceptance Criteria

1. When the user specifies a target path, the system shall remove empty and stale directories within it.

### Requirement 20: Configuration Selector Helper

**Objective:** As a system administrator, I want to switch between multiple Rivendell configurations, so that different audio stores and system setups can be activated on demand.

#### Acceptance Criteria

1. When the user activates a configuration, the system shall start the automounter for the associated network audio mounts and apply the configuration.
2. When the user deactivates a configuration, the system shall stop the automounter and release the configuration.
3. If another instance of the configuration helper is already running, then the system shall detect it and prevent concurrent execution.

### Requirement 21: Audio Tone Generation

**Objective:** As a system administrator, I want to generate audio test tone files, so that I can verify audio paths and calibrate levels.

#### Acceptance Criteria

1. When the user specifies output parameters, the system shall generate a WAV file containing a test tone at the specified frequency and duration.

### Requirement 22: Popup Notification

**Objective:** As a system integrator, I want to display a simple popup dialog from a script, so that I can provide visual notifications to operators.

#### Acceptance Criteria

1. When invoked with a message, the system shall display a popup dialog with the specified text.
