# Implementation Plan

- [ ] 1. Domain value objects and entities for replication
- [ ] 1.1 Create the replicator configuration value object
  - Define a pure C++ value object that holds all replicator properties: type identifier, name, station name, description, audio format, channels, sample rate, bit rate, quality, destination URL, credentials, metadata enablement, and normalization level
  - Provide a clear/reset method that restores all fields to their defaults
  - Ensure the value object is immutable after construction (value semantics, no Qt dependency)
  - _Requirements: 2.3_

- [ ] 1.2 (P) Create the replication state value object
  - Define a value object representing per-cart replication tracking: replicator name, cart number, posted filename, last-replication timestamp, and repost flag
  - Support comparison of the item timestamp against cart metadata timestamps for staleness checks
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 1.3 (P) Create the ISCI cross-reference entry value object
  - Define a value object for a single cross-reference record: cart number, ISCI code, filename, latest date, type (Regular/Bonus), advertiser name, product name, creative title, region name
  - Include a domain-level type enumeration for the R/B type codes
  - _Requirements: 5.2_

- [ ] 1.4 (P) Implement filename validation as a domain service
  - Create a domain service that checks a filename string against the full set of illegal characters defined by the Citadel specification (space, quotation mark, percent, asterisk, plus, slash, colon, semicolon, angle brackets, equals, question mark, at sign, square brackets, backslash, caret, curly braces, pipe)
  - Return a clear valid/invalid result so the caller can decide how to handle rejection
  - _Requirements: 5.6_

- [ ] 1.5 (P) Implement date parsing and validation as a domain service
  - Create a domain service that parses MM/DD/YY date strings and returns a typed date value or an error indication
  - Handle edge cases: invalid month/day ranges, two-digit year interpretation, malformed input
  - _Requirements: 5.5_

- [ ] 2. Outbound port interfaces for replication infrastructure
- [ ] 2.1 (P) Define the replicator repository port
  - Define a port interface for loading replicator configurations by station name from persistent storage
  - Include methods to query mapped groups for a given replicator
  - Include methods to query carts within a group along with their metadata timestamps
  - _Requirements: 2.1, 1.2, 1.3_

- [ ] 2.2 (P) Define the replication state repository port
  - Define a port interface for reading and writing per-cart replication state records
  - Include a method to query the replication state for a given replicator and cart number
  - Include a method to update the replication timestamp after successful processing
  - Include a method to list all state records for a replicator (needed for stale purging)
  - Include a method to remove a state record by replicator name and posted filename
  - _Requirements: 3.2, 3.3, 3.5, 3.6, 7.3_

- [ ] 2.3 (P) Define the ISCI cross-reference repository port
  - Define a port interface for managing the cross-reference data store
  - Include methods to clear all entries for a replicator, bulk-insert new entries, and query entries by cart number
  - Include a method to retrieve the last cross-reference update timestamp and to record a new one
  - _Requirements: 4.2, 4.3, 5.2_

- [ ] 2.4 (P) Define the audio converter port
  - Define a port interface for converting audio from a source path to a destination path with configurable format, channels, sample rate, bit rate, quality, normalization level, and speed ratio
  - Return success/failure with error details on failure
  - _Requirements: 6.2, 6.3, 6.4_

- [ ] 2.5 (P) Define the remote file transfer port
  - Define a port interface for uploading a local file to a remote URL with credentials
  - Define a method for deleting a remote file by URL and filename with credentials
  - Return success/failure with error details on failure
  - _Requirements: 6.5, 7.2_

- [ ] 3. Replicator strategy interface and factory
- [ ] 3.1 Define the replicator strategy interface
  - Create an abstract interface with two operations: start processing (initialization after config load) and process a single cart (returns success/failure)
  - Require that the configuration is accessible from the interface for the daemon controller to inspect
  - Depends on task 1.1 for the configuration value object
  - _Requirements: 2.2, 2.4_

- [ ] 3.2 Implement the replicator factory
  - Create a factory that receives a type identifier and a configuration, and returns the correct strategy implementation
  - For the Citadel XDS type, produce the Citadel XDS strategy instance
  - For unrecognized types, return a null/empty result so the caller can skip gracefully
  - Depends on task 3.1 for the strategy interface
  - _Requirements: 2.2, 2.4_

- [ ] 4. Citadel XDS replicator strategy implementation
- [ ] 4.1 Implement ISCI cross-reference file change detection
  - On start-process invocation, check whether the ISCI cross-reference file has been modified since the last recorded load time
  - If unmodified, skip the reload entirely
  - If the file does not exist, emit a warning and continue without reloading
  - If the file cannot be opened, emit a warning with OS error details and continue
  - Depends on tasks 2.3, 3.1
  - _Requirements: 4.1, 4.5, 4.6, 4.7_

- [ ] 4.2 Implement ISCI CSV file parsing and record validation
  - Parse the cross-reference file as comma-separated values with 9 fields per record, handling quoted values correctly
  - Validate each record: check field count (skip with warning if not 9), cart number validity (skip with debug if invalid), date format (skip with warning if not MM/DD/YY), and filename legality (skip with warning if illegal characters)
  - Insert valid records into the cross-reference data store after clearing existing data
  - Record the current timestamp as the last update time after successful load
  - Depends on tasks 1.3, 1.4, 1.5, 2.3
  - _Requirements: 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 4.3 Implement stale remote file purging on cross-reference reload
  - After reloading cross-reference data, compare all existing replication state records against the new cross-reference entries
  - For each state record whose filename no longer appears in the cross-reference, delete the corresponding remote file
  - On successful deletion, remove the state record and log an informational message
  - On deletion failure, log a warning and retain the state record for retry on the next cycle
  - Depends on tasks 2.2, 2.5
  - _Requirements: 4.4, 7.1, 7.2, 7.3, 7.4_

- [ ] 4.4 Implement cart processing with audio export and upload
  - When processing a cart, look up its cross-reference entries filtered to type R or B that have not expired
  - For each valid entry, export the first cut of the cart by converting audio to the configured format, channels, sample rate, bit rate, and quality
  - Apply normalization when configured; apply speed ratio adjustment when the cart has forced-length enforcement
  - Upload the converted file to the remote destination with the filename from the cross-reference
  - On success, log an informational message and clean up the temporary file; on cut-not-found or zero-length cut, skip appropriately; on conversion or upload failure, log warnings with details and report failure
  - Depends on tasks 2.4, 2.5, 4.2
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

- [ ] 5. Daemon controller and main processing loop
- [ ] 5.1 Implement command-line argument parsing and daemon initialization
  - Accept only the debug flag ("-d") as a valid command-line option; reject unknown options with an error message and non-zero exit
  - Establish the database connection at startup; exit with error if it fails
  - Write a process identifier file and log a startup message on successful initialization
  - Depends on adapter availability (task 6)
  - _Requirements: 8.1, 8.2, 8.6, 8.7, 8.8_

- [ ] 5.2 Implement signal handling for clean shutdown
  - Register handlers for termination and interrupt signals that set a shutdown flag
  - On receiving a shutdown signal, delete the process identifier file and exit cleanly
  - Handle child process termination signals by reaping child processes
  - _Requirements: 8.3, 8.4, 8.5_

- [ ] 5.3 Implement the periodic replication scan loop
  - Set up a 10-second timer that triggers the main processing cycle
  - On each cycle, load all replicator configurations for this station from the database using the replicator repository
  - Instantiate replicator strategies via the factory for each configuration
  - Call start-process on each replicator, then iterate through all carts in mapped groups
  - For each cart, check staleness by comparing its metadata timestamp against the replication state; process stale carts via the replicator strategy; update state on success
  - Free all replicator instances after the cycle completes, then wait for the next timer event
  - Continue until the shutdown flag is set
  - Depends on tasks 2.1, 2.2, 3.2, 5.1, 5.2
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 6. Persistence and infrastructure adapters
- [ ] 6.1 (P) Implement the replicator repository adapter
  - Implement the replicator repository port using Qt SQL to query the REPLICATORS table filtered by station name
  - Implement group mapping queries against the REPLICATOR_MAP table
  - Implement cart queries that join through groups to return cart numbers with metadata timestamps
  - _Requirements: 2.1, 1.2, 1.3_

- [ ] 6.2 (P) Implement the replication state repository adapter
  - Implement the replication state repository port using Qt SQL against the REPL_CART_STATE table
  - Support reading state by replicator+cart, updating timestamps, listing all states for a replicator, and removing state records
  - _Requirements: 3.2, 3.3, 3.5, 3.6, 7.3_

- [ ] 6.3 (P) Implement the ISCI cross-reference repository adapter
  - Implement the cross-reference repository port using Qt SQL against the ISCI_XREFERENCE table
  - Support bulk clear, bulk insert, query by cart number, and timestamp tracking
  - _Requirements: 4.2, 4.3, 5.2_

- [ ] 6.4 (P) Implement the audio converter adapter
  - Implement the audio converter port by wrapping the shared library's audio conversion functionality
  - Support all configuration parameters: format, channels, sample rate, bit rate, quality, normalization level, speed ratio
  - Translate conversion errors into structured domain error information
  - _Requirements: 6.2, 6.3, 6.4, 6.9_

- [ ] 6.5 (P) Implement the remote file transfer adapter
  - Implement the remote file transfer port using Qt Network or the shared library's upload/delete functionality
  - Support URL-based destinations with username/password authentication
  - Translate transfer errors into structured domain error information
  - _Requirements: 6.5, 6.10, 7.2, 7.4_

- [ ] 7. Application wiring and composition root
- [ ] 7.1 Wire the daemon application entry point
  - Create the composition root that instantiates all adapters and injects them into the daemon controller
  - Connect the database, create repository adapters, create the replicator factory with the Citadel XDS strategy registered
  - Initialize the timer and start the daemon loop
  - Verify that all components integrate correctly end-to-end
  - Depends on all previous tasks
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 8.1, 8.2_

- [ ] 8. Testing
- [ ] 8.1 (P) Unit tests for domain value objects and services
  - Test replicator configuration defaults and clear/reset behavior
  - Test filename validation against all specified illegal characters, including boundary cases with valid filenames
  - Test date parsing for valid MM/DD/YY inputs, invalid formats, and edge cases
  - Test replication state staleness comparison logic
  - _Requirements: 2.3, 3.2, 3.4, 5.5, 5.6_

- [ ] 8.2 (P) Unit tests for CSV parsing and record validation
  - Test 9-field parsing with quoted values
  - Test rejection of records with wrong field count, invalid cart numbers, invalid dates, and illegal filenames
  - Verify correct log levels for each rejection type (warning vs. debug)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 8.3 (P) Unit tests for replicator factory dispatch
  - Test that known type identifiers produce the correct strategy implementation
  - Test that unknown type identifiers return a null result for graceful skipping
  - _Requirements: 2.2, 2.4_

- [ ] 8.4 Integration tests for the replication pipeline
  - Test database replicator loading: verify correct instances are created from configuration records
  - Test the full cart processing flow: stale cart detected, audio converted, file uploaded, state updated
  - Test cross-reference reload: verify table is cleared and repopulated, stale files are identified for purging
  - Test interaction between adapter implementations and real database (in-memory SQLite)
  - _Requirements: 1.2, 1.3, 2.1, 3.2, 3.5, 4.2, 4.3, 6.1, 6.2, 6.5, 6.6_

- [ ] 8.5 Integration tests for error handling paths
  - Test that missing ISCI file produces a warning and processing continues
  - Test that audio conversion failure leaves replication state unchanged for retry
  - Test that upload failure cleans up temporary files and leaves state for retry
  - Test that remote deletion failure retains the state record
  - _Requirements: 4.5, 4.6, 6.7, 6.9, 6.10, 7.4_

- [ ] 8.6* E2E tests for daemon lifecycle and periodic operation
  - Verify the daemon starts, writes a PID file, and logs startup
  - Verify the 10-second scan cycle executes load-process-free correctly
  - Verify clean shutdown on termination signal: PID file removed, process exits with zero status
  - Verify rejection of unknown command-line options
  - _Requirements: 1.1, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
