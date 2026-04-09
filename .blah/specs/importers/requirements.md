# Requirements Document

## Introduction

The Importers artifact provides a collection of standalone command-line tools for migrating data into and between Rivendell broadcast automation system instances. These tools enable radio station engineers and system administrators to import audio content, metadata, panel configurations, and automation events from various external broadcast systems (Wings, NexGen, SAS) as well as from other Rivendell installations. Each tool operates as an independent batch-processing utility that reads from source data (files or remote databases), validates input, and writes to the local Rivendell database and audio store.

This artifact does not define any database tables of its own; all tools operate on tables defined in the core library (LIB). The tools have no graphical user interface and interact with users exclusively through command-line arguments and console output.

## Requirements

### Requirement 1: Database Copy Operations

**Objective:** As a system administrator, I want to copy panel button assignments and catch events between Rivendell database instances, so that I can replicate station configurations across multiple installations without manual re-entry.

#### Acceptance Criteria

1. When the administrator invokes the panel copy tool with source and destination database hosts, the system shall connect to both databases using credentials from the configuration file and copy all panel button assignments from the source to the destination.
2. When the administrator invokes the catch event copy tool with source and destination hosts and station identifiers, the system shall copy all scheduled recording and switch events from the source station to the destination station, replacing the station identifier in each event.
3. If the source and destination database hosts are identical for panel copy, then the system shall reject the operation with the error "cannot copy a database onto itself".
4. If the source and destination host and station are both identical for catch event copy, then the system shall reject the operation with the error "cannot copy a host configuration onto itself".
5. When the source and destination use the same database host but different station identifiers, the system shall reuse a single database connection and proceed with the copy.
6. When a copy operation is about to begin, the system shall display a warning that all existing data at the destination will be overwritten and wait for the user to confirm before proceeding.
7. When the user presses the interrupt key during the confirmation prompt, the system shall abort the operation without modifying any data.
8. The system shall delete all existing target records at the destination before inserting copied records.

### Requirement 2: Audio and Metadata Import from External Systems

**Objective:** As a system administrator, I want to import audio files and metadata from Wings, remote Rivendell, and NexGen broadcast systems, so that I can migrate content libraries when transitioning to Rivendell.

#### Acceptance Criteria

1. When the administrator invokes the Wings import tool with a group name, database file path, and audio directory, the system shall read the fixed-width Wings database file, locate corresponding audio files, and create new carts and cuts in the Rivendell database with the imported metadata (title, artist, album, group, length).
2. When importing a Wings record, the system shall validate the audio file header integrity before importing; if the header is corrupt, the system shall log a warning and skip the file.
3. When importing a Wings record, the system shall assign the cart to the record's original group if it exists locally, otherwise fall back to the specified default group.
4. When the administrator invokes the Rivendell-to-Rivendell import tool with remote database credentials, a default group, and a cart number range, the system shall transfer all carts and cuts within the specified range from the remote database to the local database, including audio file copying.
5. When transferring a cart whose original group does not exist locally, the system shall silently assign it to the default group.
6. When an audio file cannot be found during Rivendell-to-Rivendell transfer, the system shall log a warning and continue processing the remaining carts.
7. When the administrator invokes the NexGen import tool with a group name and one or more input files, the system shall process each file: XML files are read for metadata and paired with audio from a specified audio directory; PKT archive files are extracted and their XML and audio components processed.
8. When processing a NexGen PKT archive, the system shall parse the proprietary binary format (fixed-size headers followed by file data), extract the XML metadata and audio components, and process them as paired files.
9. When importing NexGen audio, the system shall detect the encoding format; if the file is MPEG-encoded, the system shall decode it to uncompressed audio before import; if it is uncompressed, the system shall use it directly.
10. When a NexGen import completes successfully, the system shall apply all available metadata to the cart and cut records, including title, artist, album, label, composer, content identifier, date ranges, and audio markers (segue, start, fade).
11. When a NexGen import specifies a normalization level, the system shall apply audio normalization at the specified level during import.
12. When importing from NexGen with a cart offset, the system shall apply the offset to all cart numbers derived from the source metadata.

### Requirement 3: Automation Event Import

**Objective:** As a system administrator, I want to import switch and macro event schedules from SAS (Sierra Automated Systems) into the catch event table, so that I can migrate timed automation events from SAS-controlled routing to Rivendell catch scheduling.

#### Acceptance Criteria

1. When the administrator invokes the SAS import tool in insert mode with an event file, the system shall parse each fixed-width event record and create corresponding scheduling events in the database.
2. When parsing a SAS event line, the system shall extract the day-of-week activation flags, start time, description, active/inactive flag, output number, input number, and general-purpose output number.
3. If a SAS event line specifies both an input and output number greater than zero, then the system shall create a switch-type scheduling event.
4. If a SAS event line specifies a general-purpose output number greater than zero, then the system shall create a macro cart scheduling event, calculating the cart number from the configured base cart offset plus the general-purpose output number.
5. When the administrator invokes the SAS import tool in delete mode, the system shall remove all existing scheduling events from the database and reset the catch scheduling daemon.
6. When import completes, the system shall reset the catch scheduling daemon to pick up the new events.
7. Where SAS station, matrix, and base cart values are configured, the system shall use those configured values for station identification, matrix channel, and cart number calculation.

### Requirement 4: Import Validation and Error Handling

**Objective:** As a system administrator, I want all import tools to validate preconditions before modifying data, so that I can trust that import operations will not corrupt the target database.

#### Acceptance Criteria

1. When any cross-database tool connects to a database, the system shall verify that the database schema version matches the expected version; if the versions do not match, the system shall exit with the error "database version mismatch".
2. When any import tool requiring a default group starts, the system shall verify that the specified group exists in the local database; if it does not exist, the system shall exit with an error.
3. If a cart number range is specified and the start value is zero, greater than 999999, or greater than the end value, then the system shall exit with an error indicating an invalid cart value.
4. If a NexGen cart number after offset calculation is less than 1 or greater than 999999, then the system shall log the error, write the source metadata file to the reject directory, and skip the import.
5. If a NexGen cart number falls outside the target group's configured cart range, then the system shall log the error, write the source metadata file to the reject directory, and skip the import.
6. If the normalization level is specified as a positive value, then the system shall reject the operation with the error "positive normalization level is invalid".
7. When a group has no more available cart numbers, the system shall log a warning and skip the current record.
8. When any tool encounters a database connection failure, the system shall exit with a descriptive error identifying the failing connection.
9. When any tool receives invalid or missing command-line arguments, the system shall exit with an error describing the invalid argument.
