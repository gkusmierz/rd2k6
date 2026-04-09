# Implementation Plan

- [ ] 1. Domain value objects and event model
- [ ] 1.1 (P) Define the catch event value object that represents a scheduled event with all its configuration properties
  - Model the full set of event attributes: type (recording, playout, macro, switch, download, upload), timing (start time, end time, length), day-of-week activation flags, audio format settings, trigger configuration, and transfer settings (URL, credentials, feed ID)
  - Support URL wildcard resolution that substitutes date and time values into URL templates
  - Implement a clear/reset operation that returns the event to default state
  - Support one-shot flag to mark events that should be deleted after execution
  - _Requirements: 1.1, 1.2, 1.3, 1.8, 4.2_

- [ ] 1.2 (P) Define domain enumerations for event types, deck states, exit codes, and recording modes
  - Event types: recording, playout, macro execution, switch operation, download, upload
  - Deck status: Offline, Idle, Waiting, Recording, Playing
  - Exit codes: Ok, NoCut, DeviceBusy, Interrupted, and transfer error variants
  - Recording start types: hard start, hardware trigger start
  - Recording end types: fixed length, hard end, hardware trigger end
  - _Requirements: 1.4, 1.6, 1.7, 2.1, 2.2, 2.6, 2.7, 2.8, 2.9_

- [ ] 1.3 (P) Define domain entities for recording deck and playout deck with state tracking
  - Recording deck holds card/stream assignment, current status, active event reference, and hardware trigger configuration
  - Playout deck holds card assignment, current status, and active event reference
  - Each deck type supports up to 8 concurrent instances with independent state
  - Recording deck transitions: Offline -> Idle -> Waiting -> Recording -> Idle (per state machine in design)
  - Playout deck transitions: Offline -> Idle -> Playing -> Idle (per state machine in design)
  - _Requirements: 2.1, 2.2, 2.9, 3.1_

- [ ] 1.4 (P) Define domain logic for event day-of-week filtering and recording length calculation
  - Day-of-week check: given an event and current day, determine if the event should fire
  - Fixed-length calculation: return the configured duration directly
  - Hard-end calculation: compute duration from current time to configured end time
  - Hardware-trigger-end: cap recording length at the configured maximum hardware-trigger recording length
  - _Requirements: 1.1, 1.2, 2.6, 2.7, 2.8, 2.13_

- [ ] 2. Port interfaces for external system communication
- [ ] 2.1 (P) Define outbound port interfaces for audio engine interaction
  - Recording operations: load recording deck (card, stream, format), start recording (card, stream, length), stop recording
  - Playout operations: load playout deck, start playout at configured start point, stop playout
  - Monitor passthrough: enable/disable audio monitor for a given deck
  - Meter data retrieval: obtain current audio level readings for active decks
  - _Requirements: 2.1, 2.6, 2.7, 2.8, 3.1, 5.6, 5.9_

- [ ] 2.2 (P) Define outbound port interfaces for IPC daemon interaction
  - Send switch commands for scheduled switch events
  - Execute macro carts via RML command protocol
  - Subscribe to hardware input state change notifications (GPI events)
  - Subscribe to event modification notifications (add, modify, delete)
  - _Requirements: 1.9, 2.3, 3.3, 3.5_

- [ ] 2.3 (P) Define outbound port interfaces for database operations
  - Load all scheduled events for a station
  - Update event exit codes
  - Delete one-shot events after execution
  - Check cut existence and load cut metadata (start/end points)
  - Load deck configuration (card, stream, monitor port)
  - Load and manage cut event markers
  - Load station configuration (heartbeat cart, heartbeat interval)
  - Manage podcast feed entries (create, delete stale, update last build datetime)
  - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.8, 2.10, 4.6_

- [ ] 2.4 (P) Define outbound port interface for file transfer operations
  - Download a file from a given URL (FTP, HTTP, SCP) with optional credentials
  - Upload a file to a given URL with optional credentials
  - Support anonymous FTP when no username is configured
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 2.5 (P) Define outbound port interface for audio format conversion
  - Convert a downloaded audio file to the station's configured format and import into the target cut location
  - Support normalization processing with configurable level
  - _Requirements: 4.3, 2.11_

- [ ] 3. Event scheduling and dispatch engine
- [ ] 3.1 Implement the event scheduler that loads and maintains scheduled events from the database
  - On startup, load all events for the current station into memory and register them with the time engine
  - Detect events left in uploading, downloading, or record-active state from a previous session and mark them as interrupted
  - Detect events left in waiting or play-active state and mark them as completed
  - Execute a configurable startup cart after a 10-second post-initialization delay
  - Respond to live notifications for event additions, modifications, and deletions by updating the in-memory event list and time engine
  - Provide a full reload capability that re-reads all events from the database
  - _Requirements: 1.5, 1.6, 1.7, 1.9, 1.10_

- [ ] 3.2 Implement the event dispatcher that routes timed events to type-specific handlers
  - When the time engine fires, validate the event is active and the current day of week is enabled before dispatching
  - Skip inactive events or events not enabled for the current day, logging a diagnostic message
  - Verify that the referenced audio cut exists in the database before dispatching recording, playout, and download events; write a "no cut" exit code and broadcast error status if missing
  - Route events to the appropriate handler based on type: recording manager, playout manager, macro executor, switch controller, or batch processor
  - After successful execution of a one-shot event, delete it from the database and remove it from the time engine
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.8_

- [ ] 4. Recording management
- [ ] 4.1 Implement hard-start and hardware-trigger recording initiation
  - For hard-start events, load the recording deck and begin recording immediately
  - For hardware-trigger-start events, set the deck to waiting state and start a trigger window timer for the configured duration
  - If the trigger window expires without activation, return the deck to idle state
  - If a hardware trigger start offset is configured, delay recording start by the offset duration after trigger activation
  - Reject recording attempts on a busy deck with a "device busy" exit code and broadcast the error
  - Broadcast deck status changes to all connected clients
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.9_

- [ ] 4.2 Implement recording end type handling and finalization
  - For fixed-length recordings, record for exactly the configured duration
  - For hard-end recordings, calculate recording length from current time to the configured end time
  - For hardware-trigger-end recordings, stop when the configured end trigger input activates; cap maximum length at the configured maximum hardware-trigger recording length
  - When recording completes without normalization configured, finalize the cut directly (update metadata, trim, calculate hash)
  - When normalization is configured, spawn a batch subprocess to normalize and then finalize the recording
  - _Requirements: 2.6, 2.7, 2.8, 2.10, 2.11, 2.13_

- [ ] 4.3 Implement multiple sequential hardware-triggered recordings
  - When a hardware-triggered recording completes and multiple recordings are allowed, re-enter the trigger waiting state to capture the next recording
  - Maintain the trigger window and offset configuration across sequential recordings
  - _Requirements: 2.12_

- [ ] 5. Playout, macro execution, and switch control
- [ ] 5.1 (P) Implement playout deck management and audio playback
  - Load the audio cut and begin playback at the configured start point when a playout event fires
  - Coordinate with the event player to monitor timed event markers and fire macro cart executions at the correct audio positions during playout
  - Track playout deck state transitions (Idle -> Playing -> Idle)
  - _Requirements: 3.1, 3.2_

- [ ] 5.2 (P) Implement the macro executor with slot pooling
  - Maintain a pool of up to 64 concurrent macro execution slots
  - Allocate a free slot for each incoming macro execution request
  - Periodically clean up completed execution slots
  - When all 64 slots are occupied, log a warning and skip the macro execution
  - _Requirements: 3.3, 3.4_

- [ ] 5.3 (P) Implement the switch controller for scheduled switch events
  - Translate scheduled switch events into the appropriate switching commands
  - Send switch commands to the IPC daemon
  - _Requirements: 3.5_

- [ ] 5.4 (P) Implement locally handled RML commands
  - Handle insert cut event marker command by inserting an event marker at the current recording position
  - Handle copy audio cut command by copying the source audio cut to the destination location
  - Handle execute macro cart, start recording on deck, and stop recording on deck commands
  - _Requirements: 3.6, 3.7, 3.8_

- [ ] 6. Batch processing for downloads, uploads, and podcast publishing
- [ ] 6.1 Implement download batch processing
  - Spawn a batch subprocess when a download event fires
  - Resolve URL wildcards with current date and time values before downloading
  - Download the file from the configured URL using the appropriate protocol (FTP, HTTP, SCP)
  - Use anonymous FTP credentials when no username is configured and the URL scheme is FTP
  - Convert the downloaded file to the station's configured audio format and import it into the target cut
  - Finalize the imported recording (metadata update, trim, hash calculation)
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 6.2 Implement upload batch processing with podcast publishing
  - Spawn a batch subprocess when an upload event fires
  - Export the audio cut and upload it to the configured URL
  - When a podcast feed is configured, delete any stale podcast entries for the same filename, create a new podcast entry, and update the feed's last build datetime
  - _Requirements: 4.4, 4.6_

- [ ] 6.3 Implement batch subprocess lifecycle management
  - Report exit codes from batch subprocesses to the parent daemon process via the TCP command protocol
  - Periodically check for batch operation progress updates at a 1-second interval
  - Handle subprocess completion and error reporting
  - _Requirements: 4.7, 4.8_

- [ ] 7. TCP client communication protocol
- [ ] 7.1 Implement the TCP server and client connection management
  - Accept TCP client connections on a configurable port (default 6006)
  - Track per-client connection state including authentication status and meter data preference
  - Buffer incoming command data until the command terminator character is received
  - Support graceful connection close with resource cleanup
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 7.2 Implement authentication and command routing
  - Require password authentication before accepting any commands other than authenticate and disconnect
  - Reject commands from unauthenticated clients with an error response
  - Parse the text-based command protocol (commands terminated by '!' character)
  - Route authenticated commands to the appropriate handlers (reload, status request, stop, monitor, set exit code)
  - _Requirements: 5.2, 5.3, 5.8, 5.9_

- [ ] 7.3 Implement status broadcasting and periodic updates
  - Send current status of all decks (or a specific deck) when a client requests deck status
  - Broadcast deck status changes to all authenticated clients when status changes occur
  - Send periodic heartbeat messages to all connected clients at a configurable interval (default 10 seconds)
  - Send audio level meter readings periodically while meter data is enabled for a client
  - Execute a configurable system heartbeat cart at a configurable interval
  - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.10_

- [ ] 8. Adapter implementations
- [ ] 8.1 (P) Implement the database adapter for event persistence and configuration queries
  - Implement all database operations defined in the outbound port: load events, update exit codes, delete one-shot events, check cut existence, load deck configuration, manage cut event markers, load station configuration, manage podcast entries
  - Map database rows to domain entities and value objects
  - Handle database error conditions and translate to domain error types
  - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.8, 2.10, 4.6_

- [ ] 8.2 (P) Implement the audio engine adapter for recording and playout control
  - Implement all audio engine operations defined in the outbound port: load/start/stop recording, load/start/stop playout, monitor passthrough, meter data retrieval
  - Handle audio engine connection state and error conditions
  - Translate audio engine callbacks (record loaded, record stopped, record unloaded with duration) to domain events
  - _Requirements: 2.1, 2.6, 2.7, 2.8, 3.1, 5.6, 5.9_

- [ ] 8.3 (P) Implement the IPC daemon adapter for hardware triggers, notifications, and switch commands
  - Implement hardware input state change subscription for GPI trigger events
  - Implement event modification notification subscription (add, modify, delete)
  - Implement switch command sending
  - Implement macro cart execution via RML commands
  - _Requirements: 1.9, 2.3, 3.3, 3.5_

- [ ] 8.4 (P) Implement the file transfer adapter for download and upload operations
  - Support FTP, HTTP, and SCP protocols
  - Support anonymous FTP credentials when no username is configured
  - Handle transfer error conditions and report appropriate exit codes
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 8.5 (P) Implement the audio format conversion adapter
  - Convert downloaded audio files to the station's configured format
  - Support normalization processing with configurable level
  - Import converted audio into the target cut location
  - _Requirements: 4.3, 2.11_

- [ ] 9. Daemon composition and startup wiring
- [ ] 9.1 Wire all components together in the application composition root
  - Create and inject all adapter instances into their respective port consumers
  - Initialize the event scheduler with database and time engine dependencies
  - Connect the event dispatcher to all type-specific handlers (recording manager, playout manager, macro executor, switch controller, batch processor)
  - Connect hardware trigger handler to the recording manager
  - Connect IPC daemon notifications to the event scheduler
  - Wire the TCP server and client protocol to deck managers for status broadcasting
  - Start the daemon event loop and configure signal handling for clean shutdown
  - _Requirements: 1.5, 1.10, 5.1_

- [ ] 9.2 Implement daemon lifecycle management
  - Execute the startup cart after a 10-second post-initialization delay
  - Configure the system heartbeat cart execution at the configured interval
  - Handle daemon restart by cleaning up interrupted events from the previous session
  - Ensure graceful shutdown stops active recordings, disconnects clients, and flushes pending database writes
  - _Requirements: 1.6, 1.7, 1.10, 5.7, 5.10_

- [ ] 10. Testing
- [ ] 10.1 (P) Unit tests for domain logic
  - Test event day-of-week filtering: verify events fire only on enabled days
  - Test recording length calculation for each end type (fixed-length, hard-end, hardware-trigger-end with cap)
  - Test URL wildcard resolution with various date and time patterns
  - Test one-shot event detection and purge logic
  - Test deck state machine transitions for both recording and playout decks
  - Test catch event value object construction, wildcard resolution, and clear/reset
  - _Requirements: 1.1, 1.2, 1.8, 2.6, 2.7, 2.8, 2.13, 4.2_

- [ ] 10.2 (P) Unit tests for TCP command parsing and routing
  - Test command terminator detection and buffering
  - Test authentication flow (accept, reject, error for unauthenticated commands)
  - Test parsing of all supported commands (PW, DC, RS, RD, RO, RE, RM, SR, RH, MN, SC)
  - Test status broadcast message formatting
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10.3 Integration tests for recording lifecycle
  - Test full hard-start recording lifecycle: schedule, start, record, finalize with metadata and hash
  - Test hardware-triggered recording with offset delay: schedule, wait, trigger, offset, record, stop
  - Test multiple sequential hardware-triggered recordings
  - Test deck busy rejection when attempting concurrent recording on the same deck
  - Test recording with normalization spawning a batch subprocess
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.9, 2.10, 2.11, 2.12_

- [ ] 10.4 Integration tests for batch operations and client protocol
  - Test download batch lifecycle: spawn subprocess, download, convert, import, report exit code
  - Test upload with podcast publishing: export, upload, create podcast entry, update feed
  - Test client authentication and command protocol end-to-end
  - Test status broadcasting to multiple connected clients on deck state changes
  - Test heartbeat delivery and meter data streaming
  - _Requirements: 4.1, 4.3, 4.4, 4.6, 4.7, 5.1, 5.4, 5.5, 5.7_

- [ ] 10.5 Integration test for daemon restart recovery
  - Test that events in uploading, downloading, or record-active state are marked as interrupted on restart
  - Test that events in waiting or play-active state are marked as completed on restart
  - Test startup cart execution after the 10-second delay
  - _Requirements: 1.6, 1.7, 1.10_
