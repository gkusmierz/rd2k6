# Requirements Document

## Introduction

The Replication Daemon is a background service responsible for synchronizing audio content from a broadcast automation system to external distribution servers. It operates as a headless daemon, periodically scanning for audio carts that need to be replicated, converting them to the required format, and uploading them to configured remote destinations. The daemon supports pluggable replicator strategies, with the initial implementation targeting the Citadel XDS (Cross-Distribution System) protocol.

The daemon is managed by the Service Manager (SVC) and runs continuously on a per-station basis. It requires no user interface and communicates exclusively through database state and file system operations.

## Requirements

### Requirement 1: Periodic Replication Scan

**Objective:** As a station operator, I want the replication daemon to automatically scan for content changes on a regular interval, so that audio content is distributed without manual intervention.

#### Acceptance Criteria

1. While the daemon is running, the system shall execute a full replication cycle every 10 seconds.
2. When a replication cycle begins, the system shall load all replicator configurations assigned to this station.
3. When replicators are loaded, the system shall process all carts in the mapped groups for each replicator.
4. When cart processing completes, the system shall release all replicator instances before starting the next cycle.
5. The system shall continue scanning until the daemon process is terminated.

### Requirement 2: Replicator Configuration Management

**Objective:** As a system administrator, I want replicator configurations to be stored in the database and loaded dynamically, so that replication targets can be managed without restarting the daemon.

#### Acceptance Criteria

1. When loading replicators, the system shall query the database for all replicator records matching this station's name.
2. When a replicator record is found, the system shall instantiate the correct replicator type based on the type identifier.
3. The system shall support the following configuration properties per replicator: name, description, station name, audio format, channels, sample rate, bit rate, quality, destination URL, authentication credentials, metadata enablement, and normalization level.
4. When a replicator type is not recognized, the system shall skip that replicator without error.

### Requirement 3: Cart Staleness Detection and Processing

**Objective:** As a station operator, I want only changed carts to be reprocessed, so that bandwidth and server resources are used efficiently.

#### Acceptance Criteria

1. When processing carts, the system shall check each cart in the replicator's mapped groups.
2. When a cart's metadata timestamp is newer than the last recorded replication timestamp, the system shall invoke the replicator to process that cart.
3. When a cart has no replication state record, the system shall treat it as stale and process it.
4. When a cart's metadata timestamp is equal to or older than the last replication timestamp, the system shall skip that cart.
5. When a cart is successfully processed, the system shall update the replication state record with the current timestamp.
6. If a cart processing attempt fails, the system shall leave the replication state unchanged so it is retried on the next cycle.

### Requirement 4: ISCI Cross-Reference Management

**Objective:** As a station operator, I want the system to automatically load and refresh ISCI cross-reference data from an external file, so that cart-to-filename mappings stay current with the distribution provider's schedule.

#### Acceptance Criteria

1. When the replicator starts processing, the system shall check whether the ISCI cross-reference file has been modified since the last load.
2. When the file has been modified, the system shall clear the existing cross-reference data and reload it entirely from the file.
3. When the file is successfully loaded, the system shall record the current timestamp as the last reference update time.
4. When the cross-reference file is reloaded, the system shall purge remote files that are no longer referenced.
5. If the cross-reference file does not exist, the system shall emit a warning and continue without reloading.
6. If the cross-reference file cannot be opened, the system shall emit a warning with the error details.
7. When the file has not been modified since the last load, the system shall skip the reload.

### Requirement 5: ISCI CSV File Parsing and Validation

**Objective:** As a system administrator, I want the ISCI cross-reference file to be validated during import, so that invalid data does not corrupt the replication mappings.

#### Acceptance Criteria

1. The system shall parse the cross-reference file as a comma-separated format with 9 fields per record, supporting quoted values.
2. When a record has a valid cart number, date, and filename, the system shall insert it into the cross-reference data store.
3. If a record does not contain exactly 9 fields, the system shall log a warning and skip that record.
4. If a record contains an invalid or out-of-range cart number, the system shall log a debug message and skip that record.
5. If a record contains a date that is not in valid MM/DD/YY format, the system shall log a warning and skip that record.
6. If a record contains a filename with illegal characters (space, quotation mark, percent, asterisk, plus, slash, colon, semicolon, angle brackets, equals, question mark, at sign, square brackets, backslash, caret, curly braces, pipe), the system shall log a warning and skip that record.

### Requirement 6: Audio Export and Upload

**Objective:** As a station operator, I want audio carts to be automatically converted to the required format and uploaded to the distribution server, so that content reaches external platforms in the correct format.

#### Acceptance Criteria

1. When a cart has a valid cross-reference entry with type "R" (regular) or "B" (bonus) and has not expired, the system shall export and upload the first cut of that cart.
2. When exporting audio, the system shall convert it to the configured format, channels, sample rate, bit rate, and quality settings.
3. Where normalization is configured, the system shall apply the configured normalization level during conversion.
4. When the cart has forced-length enforcement enabled, the system shall apply a speed ratio adjustment during conversion.
5. When conversion and upload succeed, the system shall log an informational message with the cut identifier and destination.
6. When conversion and upload succeed, the system shall clean up the temporary file.
7. If the cut does not exist, the system shall skip it and report failure.
8. If the cut exists but has zero length, the system shall skip it without error.
9. If audio conversion fails, the system shall log a warning with error details and report failure.
10. If the upload fails, the system shall log a warning, clean up the temporary file, and report failure.

### Requirement 7: Stale Remote File Purging

**Objective:** As a station operator, I want files that are no longer in the cross-reference to be automatically removed from the remote server, so that the distribution server does not contain outdated content.

#### Acceptance Criteria

1. When the cross-reference data is reloaded, the system shall check all existing replication state records against the new cross-reference data.
2. When a replication state record references a filename that no longer exists in the cross-reference data, the system shall delete the corresponding remote file.
3. When the remote file is successfully deleted, the system shall remove the replication state record and log an informational message.
4. If remote file deletion fails, the system shall log a warning and retain the replication state record for retry.

### Requirement 8: Daemon Lifecycle Management

**Objective:** As a system administrator, I want the replication daemon to start and stop cleanly, so that it integrates properly with the system's process management.

#### Acceptance Criteria

1. When the daemon starts, the system shall establish a database connection.
2. When the daemon starts successfully, the system shall write a process identifier file and log a startup message.
3. When the daemon starts, the system shall register handlers for termination and interrupt signals.
4. When a termination or interrupt signal is received, the system shall delete the process identifier file and exit cleanly.
5. When a child process termination signal is received, the system shall reap the child process.
6. If the database connection cannot be established, the system shall print an error message and exit with a non-zero status.
7. If an unknown command-line option is provided, the system shall print an error message and exit with a non-zero status.
8. The system shall accept a debug flag ("-d") as the only valid command-line option.
