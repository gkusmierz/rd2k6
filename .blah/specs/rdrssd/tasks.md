# Implementation Plan

- [ ] 1. Domain entities and value objects for feeds and podcasts
- [ ] 1.1 (P) Implement the Feed domain entity
  - Create the feed entity with properties: identifier, key name, superfeed flag, last build datetime, channel metadata, base URL, and autopost setting
  - Include a predicate to check whether the feed is a superfeed (used to exclude from processing)
  - Track the last build datetime to determine whether content changes require XML regeneration
  - Use value objects for the key name (fixed-length identifier) and the superfeed flag (scoped enum)
  - Mark all getters as nodiscard; use value semantics and immutability where appropriate
  - _Requirements: 2.1, 2.2_

- [ ] 1.2 (P) Implement the Podcast (Episode) domain entity
  - Create the podcast entity with properties: identifier, parent feed reference, status, effective datetime, expiration datetime, title, audio filename, and audio length
  - Include predicates for checking whether the episode is expired (expiration datetime in the past) and whether it has become newly effective (effective datetime in the past relative to a reference datetime)
  - These predicates are the core business logic for deciding purge vs. repost actions
  - Use standard chrono types for datetimes; use optional where absence is meaningful
  - _Requirements: 2.3, 2.9, 2.10_

- [ ] 2. Outbound port interfaces
- [ ] 2.1 (P) Define the feed repository port
  - Declare an interface for querying all non-superfeed feeds from persistence
  - Declare a method to load a single feed by its key name
  - Declare a method to update the last build datetime after successful XML regeneration
  - Use only domain types in the interface signatures
  - _Requirements: 2.1, 2.2_

- [ ] 2.2 (P) Define the podcast repository port
  - Declare an interface for querying podcasts that need action within a given feed (expired or newly effective since last build)
  - Declare a method to delete a podcast record by its identifier
  - Use only domain types in the interface signatures
  - _Requirements: 2.3, 2.4, 2.9, 2.10_

- [ ] 2.3 (P) Define the audio storage port
  - Declare an interface for removing an audio file associated with a podcast episode
  - The removal operation must return a success/failure result (failure is non-fatal to the caller)
  - _Requirements: 2.3, 2.8_

- [ ] 2.4 (P) Define the RSS XML posting port
  - Declare an interface for regenerating and uploading a feed's RSS XML document
  - The operation must return a success/failure result so the caller can log failures without stopping
  - _Requirements: 2.9, 2.10, 2.12_

- [ ] 2.5 (P) Define the notification port
  - Declare an interface for broadcasting feed modification notifications and feed item deletion notifications
  - Each notification type takes the relevant feed and item identifiers
  - _Requirements: 2.5, 2.6, 2.11_

- [ ] 3. Feed processing application service
- [ ] 3.1 Implement the feed scanning and processing orchestration
  - Create the application service that, when triggered, queries all non-superfeed feeds and processes each one
  - For each feed, query podcasts that need action (expired or newly effective since the feed's last build datetime)
  - Superfeeds must be excluded from the query results entirely
  - After processing all feeds, signal that the cycle is complete so the timer can restart
  - _Requirements: 2.1, 2.2, 2.13_

- [ ] 3.2 Implement expired podcast purge logic
  - When a podcast is expired, attempt to remove its audio file via the audio storage port
  - If audio removal fails, log a warning but continue (non-fatal)
  - Delete the podcast record from persistence via the podcast repository port
  - Broadcast a feed modification notification and a feed item deletion notification via the notification port
  - Log the purge operation at informational level including episode title and feed key
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 3.3 Implement RSS XML regeneration on content changes
  - When a podcast has become newly effective or has been expired since the feed's last build, trigger XML regeneration and upload via the RSS XML posting port
  - On successful upload, broadcast a feed modification notification
  - On failure, log a warning identifying the feed key and the triggering episode
  - Update the feed's last build datetime after successful regeneration
  - _Requirements: 2.9, 2.10, 2.11, 2.12_

- [ ] 4. Daemon controller and lifecycle management
- [ ] 4.1 Implement command-line argument parsing and validation
  - Accept the `--process-interval` argument with a positive integer value for the polling interval in seconds
  - Default to 30 seconds when the argument is not provided
  - Reject non-numeric or invalid values by printing an error and exiting with code 1
  - Reject unrecognized options by logging the unknown option and exiting with code 2
  - _Requirements: 1.4, 1.5, 1.6, 1.9_

- [ ] 4.2 Implement privilege dropping at startup
  - When running as root, drop to the configured non-privileged group identity first, then the user identity
  - If setting the group identity fails, log the failure and exit with code 1
  - If setting the user identity fails, log the failure and exit with code 1
  - The order (group then user) is critical and must be enforced
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 4.3 Implement database connection and IPC initialization
  - Attempt to establish the database connection at startup using the application framework
  - If the connection fails, print the error and exit with code 1
  - Connect to the IPC daemon for broadcasting notifications to other system components
  - _Requirements: 1.7, 1.8_

- [ ] 4.4 Implement the polling timer and processing cycle trigger
  - Set up a single-shot timer that fires the feed processing service on timeout
  - On startup, configure the timer with an initial delay of zero (immediate first run)
  - After each processing cycle completes, restart the timer with the configured polling interval
  - The timer must be single-shot to prevent overlapping processing cycles
  - _Requirements: 1.8, 1.9, 2.13_

- [ ] 5. Persistence and infrastructure adapters
- [ ] 5.1 (P) Implement the feed repository adapter
  - Query the FEEDS table for all records where the superfeed flag is not set
  - Support loading a single feed by key name
  - Support updating the last build datetime field
  - Use the shared database connection provided at construction via dependency injection
  - _Requirements: 2.1, 2.2_

- [ ] 5.2 (P) Implement the podcast repository adapter
  - Query the PODCASTS table for episodes belonging to a given feed that have expired or become effective since a reference datetime
  - Support deleting a podcast record by identifier
  - Translate database errors into domain error types
  - _Requirements: 2.3, 2.4, 2.9, 2.10_

- [ ] 5.3 (P) Implement the audio storage adapter
  - Remove audio files from the configured storage location given a podcast's audio filename
  - Return a structured result indicating success or failure (do not throw or abort on failure)
  - _Requirements: 2.3, 2.8_

- [ ] 5.4 (P) Implement the RSS XML posting adapter
  - Regenerate the RSS XML document from the current feed and episode data, then upload it to the configured storage location
  - Return a structured result indicating success or failure
  - _Requirements: 2.9, 2.10, 2.12_

- [ ] 5.5 (P) Implement the notification adapter
  - Send feed modification and feed item deletion notifications to the IPC daemon
  - Use the IPC client connection established during daemon startup
  - _Requirements: 2.5, 2.6, 2.11_

- [ ] 6. Composition root and daemon wiring
- [ ] 6.1 Wire all ports to adapters and assemble the daemon
  - Create the composition root that instantiates all adapters (feed repository, podcast repository, audio storage, XML posting, notification)
  - Inject adapters into the feed processing application service
  - Connect the polling timer's timeout to the processing service's scan trigger
  - Integrate privilege dropping, CLI parsing, database connection, and IPC initialization into the daemon startup sequence
  - Ensure the startup order is: parse CLI, open database, drop privileges, connect IPC, start timer
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 7. Unit tests
- [ ] 7.1 (P) Test domain entity business logic
  - Verify the feed superfeed predicate correctly identifies superfeed and non-superfeed feeds
  - Verify the podcast expiration predicate detects past expiration datetimes
  - Verify the podcast effective predicate detects past effective datetimes relative to a reference datetime
  - Test edge cases: expiration exactly at current time, effective datetime in the future, missing datetimes
  - _Requirements: 2.1, 2.2, 2.3, 2.9, 2.10_

- [ ] 7.2 (P) Test CLI argument validation
  - Verify valid positive integer values for process interval are accepted
  - Verify non-numeric values are rejected with exit code 1
  - Verify unrecognized options are rejected with exit code 2
  - Verify the default 30-second interval when no argument is provided
  - _Requirements: 1.4, 1.5, 1.6, 1.9_

- [ ] 7.3 (P) Test feed processing service with mock ports
  - Mock all outbound ports (repositories, audio storage, XML posting, notification)
  - Verify that superfeeds are excluded from processing
  - Verify that expired podcasts trigger audio removal, record deletion, and both notification types
  - Verify that audio removal failure does not prevent record deletion
  - Verify that newly effective podcasts trigger XML regeneration and feed modification notification
  - Verify that XML upload failure is logged but does not stop processing
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12_

- [ ] 8. Integration tests
- [ ] 8.1 Test the full feed processing cycle with real persistence
  - Set up an in-memory database with test feed and podcast records
  - Insert a feed with an expired podcast episode, trigger the processing cycle
  - Verify the expired podcast record is deleted from the database
  - Verify notification broadcasts were dispatched (mock only the IPC layer)
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 8.2 Test XML regeneration triggered by newly effective episodes
  - Insert a podcast with a recently passed effective datetime and a feed with an older last build datetime
  - Trigger the processing cycle and verify the XML posting adapter is called
  - Verify the feed's last build datetime is updated after successful regeneration
  - _Requirements: 2.9, 2.10, 2.11_

- [ ] 8.3 Test audio purge failure tolerance
  - Configure the audio storage adapter to simulate a failure on file removal
  - Trigger processing for a feed with an expired episode
  - Verify the podcast record is still deleted despite the audio removal failure
  - Verify a warning is logged for the audio failure
  - _Requirements: 2.8_

- [ ] 8.4 Test startup failure scenarios
  - Verify that a simulated database connection failure causes exit with code 1
  - Verify that invalid CLI arguments produce the correct exit codes (1 for bad interval, 2 for unknown option)
  - _Requirements: 1.5, 1.6, 1.7_
