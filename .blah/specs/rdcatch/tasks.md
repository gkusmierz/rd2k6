# Implementation Plan

- [ ] 1. Domain layer foundation for scheduled events
- [ ] 1.1 Define the event entity with type discrimination and all shared fields
  - Create the central event aggregate covering all six event variants (recording, playout, download, upload, macro, switch)
  - Model the type discriminator as a scoped enum, with variant-specific fields accessible per type
  - Include all scheduling fields: day-of-week flags, active flag, one-shot flag, start/end times, description
  - Model start trigger types (hard start, GPI start) and end trigger types (fixed length, hard end, GPI end) as scoped enums
  - Include audio settings fields: channel count, normalization level, trim threshold, sample rate, bit rate, format
  - Include transfer fields: URL, credentials, metadata flag, feed reference, date offsets
  - Include switch fields: matrix, input, output
  - Include macro field: cart number reference
  - Include exit code and exit text for completed event status
  - _Requirements: 1, 3, 4, 5, 6, 7, 8_

- [ ] 1.2 (P) Define domain value objects for event scheduling
  - Create a value object for event identity
  - Create value objects for station name, channel number, cart number, cut name
  - Create a value object for GPI configuration (matrix, line, trigger)
  - Create a time window value object representing start/end time ranges
  - Create a URL value object encapsulating protocol, host, path, and credential presence
  - All value objects must be immutable after construction, use value semantics, and support equality comparison
  - _Requirements: 3, 4, 5, 7_

- [ ] 1.3 Define domain validation services for event business rules
  - Implement recording validation: GPI time window ordering (start window end must not precede start window begin), hard start/end time ordering (end must be after start), cut assignment required
  - Implement download URL validation: reject relative URLs, reject trailing slash, verify supported protocols (ftp, ftps, http, https, file, scp, sftp), require username for file:// protocol
  - Implement upload URL validation: reject relative URLs, reject trailing slash, verify supported protocols (ftp, ftps, file, scp, sftp), require username for file:// protocol, verify export format support on target host
  - Implement cart existence validation for macro events
  - Implement GPI matrix and line existence validation
  - Implement duplicate event detection: match on station, type, start time, and channel (for recordings)
  - All validation returns structured error information (no exceptions)
  - _Requirements: 3, 4, 5, 7, 8, 9_

- [ ] 1.4 (P) Define domain enumerations for event status and exit codes
  - Model deck status states: idle, ready, waiting, recording, offline
  - Model event exit codes: ok, short, low level, high level, interrupted, device busy, no cut, unknown format, server error, internal error, downloading, uploading, record active, play active, waiting
  - Model event types: recording, playout, download, upload, macro event, switch event
  - _Requirements: 1, 10_

- [ ] 2. Port interfaces for event management
- [ ] 2.1 (P) Define outbound port for event persistence
  - Declare interface for finding events by ID, listing events with filter criteria, saving events, saving as new (clone with new ID), deleting events, and checking for duplicates
  - Filter criteria must support active-only, today-only, day-of-week, and event type dimensions
  - All methods use domain types only, no framework dependencies
  - _Requirements: 1, 2, 9, 14_

- [ ] 2.2 (P) Define outbound port for catch daemon communication
  - Declare interface for connecting to a station daemon, sending event reload notifications, sending abort commands, sending monitor toggle commands
  - Declare event callbacks for status changes, meter levels, heartbeat failures, event updates, and event purges
  - Include connection state tracking per station
  - _Requirements: 10, 11_

- [ ] 2.3 (P) Define outbound port for audio engine interaction
  - Declare interface for loading and playing audio cuts for audition (head and tail playback)
  - Declare callbacks for playback started and playback stopped events
  - _Requirements: 12_

- [ ] 2.4 (P) Define outbound port for reference data access
  - Declare interface for listing stations, listing decks per station, listing matrices and their inputs/outputs per station, verifying cart existence, and listing podcast feeds
  - Declare interface for checking export format support on a given host
  - _Requirements: 3, 5, 6, 7, 8_

- [ ] 2.5 (P) Define inbound port for event management use cases
  - Declare use case interface covering: list events with filters, add event by type, edit event, delete event with confirmation, save as new, get event details
  - Declare use case interface for audition control: play head, play tail, stop audition
  - Declare use case interface for deck operations: abort recording, toggle monitoring
  - Declare use case interface for report generation: event report and upload/download report with current filters
  - _Requirements: 1, 2, 12, 13, 14_

- [ ] 3. Application services implementing event management use cases
- [ ] 3.1 Implement the event list management service
  - Orchestrate event CRUD operations: add, edit, delete with confirmation, save as new
  - On add: create new event record of selected type, return event ID for editor
  - On delete: validate event is not active before deletion, display confirmation
  - On save: run all applicable validations (type-specific + duplicate check) before persisting
  - On save as new: clone current event settings, apply same validations, insert as new record
  - After any write: send reload notification to the appropriate catch daemon
  - Emit structured errors for all failure conditions
  - _Requirements: 1, 5, 9, 14_

- [ ] 3.2 Implement the filter service
  - Apply four-dimensional AND filtering: active-only, today-only, day-of-week selection, event type selection
  - Day-of-week options: all days, weekdays, or individual day
  - Event type options: all types, recording, playout, download, upload, macro, switch
  - Filter state is transient (not persisted between sessions)
  - _Requirements: 2_

- [ ] 3.3 (P) Implement the audition playback service
  - Handle head play requests: load and play the beginning portion of the cut assigned to the selected event
  - Handle tail play requests: load and play the ending portion of the assigned cut
  - Track playback state: disable head/tail while playing, re-enable on stop
  - Handle stop requests: immediately stop current audition playback
  - _Requirements: 12_

- [ ] 3.4 (P) Implement the report generation service
  - Generate event report listing all filtered events with type, description, station, start/end times, source, destination, day schedule, and status
  - Generate upload/download report listing transfer events with URL, credentials, destination, and audio format details
  - Respect current filter settings (active-only, today-only, day-of-week) when producing report data
  - _Requirements: 13_

- [ ] 3.5 Implement the daemon connectivity service
  - Establish connections to catch daemons on all configured stations at startup
  - Monitor heartbeats and detect timeouts per station
  - Route incoming status updates, meter levels, and event changes to the appropriate handlers
  - Emit critical errors for initialization failures, IPC daemon connection failures, and audio engine connection failures
  - Emit warnings for per-station heartbeat timeouts (non-fatal)
  - _Requirements: 11_

- [ ] 4. Persistence adapter for event data
- [ ] 4.1 Implement the event repository adapter using the database
  - Map all columns of the RECORDINGS table to domain event entity fields
  - Implement filtered queries joining events with cuts and feeds data
  - Implement duplicate detection query (match station, type, start time, channel)
  - Implement save-as-new with new ID generation and full field copy
  - Translate database errors to domain error info
  - _Requirements: 1, 2, 9, 14_

- [ ] 4.2 (P) Implement the reference data repository adapter
  - Implement station listing, deck listing per station, matrix listing with inputs/outputs
  - Implement cart existence check against the CART table
  - Implement podcast feed listing from the FEEDS table
  - Implement export format support check per host
  - All read-only queries against shared reference tables
  - _Requirements: 3, 5, 6, 7, 8_

- [ ] 5. Network adapters for daemon and audio engine communication
- [ ] 5.1 Implement the catch daemon connection adapter
  - Establish WebSocket connection to each configured station's catch daemon
  - Parse incoming messages for deck status changes, meter levels, event updates, event purges
  - Implement heartbeat monitoring with configurable timeout
  - Send event reload, abort, and monitor commands
  - Handle reconnection and connection state tracking
  - Emit signals for all received events using domain types
  - _Requirements: 10, 11_

- [ ] 5.2 (P) Implement the audio engine client adapter
  - Connect to the audio engine daemon for audition playback
  - Implement load-and-play for head and tail portions of audio cuts
  - Emit playback started and stopped signals
  - Translate audio engine errors to domain error info
  - _Requirements: 12_

- [ ] 6. UI adapter models and controllers
- [ ] 6.1 Implement the event list model for the main window
  - Expose the event list as a list model with all required columns: description, location (station and deck), start time, end time, source, destination, day-of-week indicators, feed name, origin, one-shot flag, audio settings, status
  - Provide color-coded status roles: white for idle, cyan for ready, green for active, yellow for next scheduled, magenta for waiting, pink for error
  - Support row-level refresh when individual events are updated externally
  - Track which event is "next scheduled" for auto-scroll
  - _Requirements: 1, 2_

- [ ] 6.2 Implement the deck monitor model
  - Expose per-deck state: station name, channel, status label, current cut info, event description
  - Expose left and right audio meter level values for real-time binding
  - Expose monitor toggle state and abort action
  - Provide status color role matching deck state (idle, ready, waiting, recording, offline)
  - _Requirements: 10_

- [ ] 6.3 Implement the filter controller for the main window
  - Expose filter properties for QML binding: show active only, show today only, day-of-week selection, event type selection
  - Notify the event list model to re-filter on any filter change
  - _Requirements: 2_

- [ ] 6.4 (P) Implement the audition controller for QML
  - Expose head play, tail play, and stop actions to QML
  - Expose playback state property (playing/stopped) for button enable/disable binding
  - _Requirements: 12_

- [ ] 6.5 Implement editor controllers for each event type
  - Implement recording editor controller: expose station/deck selection, start/end trigger configuration, GPI settings, cut assignment, audio settings, scheduling fields; invoke domain validation on save
  - Implement download editor controller: expose station, start time, URL, credentials, destination cart/cut, audio settings, scheduling fields; invoke URL and field validation on save
  - Implement upload editor controller: expose station, start time, URL, credentials, source cart/cut, export format, feed association, scheduling fields; invoke URL, format, and field validation on save
  - Implement playout editor controller: expose station/deck selection, start time, destination cut, scheduling fields
  - Implement switch event editor controller: expose station, matrix selection with dynamic input/output population, scheduling fields
  - Implement cart/macro editor controller: expose station, start time, cart number with existence validation, scheduling fields
  - All controllers validate and emit structured errors for display in QML dialogs
  - All controllers support both save and save-as-new operations with duplicate checking
  - _Requirements: 3, 4, 5, 6, 7, 8, 9, 14_

- [ ] 7. QML user interface views
- [ ] 7.1 Build the main window view with event list, toolbar, and filter bar
  - Render the event list table with all columns from the event list model, color-coded rows by status
  - Render the filter bar with active-only toggle, today-only toggle, day-of-week selector, and event type selector
  - Render action buttons: Add, Edit, Delete, Reports
  - Render audition controls: Head play, Tail play, Stop buttons with enable/disable based on playback state
  - Display current time clock and next scheduled event information
  - Handle double-click on rows to trigger edit action
  - Prevent editing of active events with appropriate message
  - Support window geometry save and restore
  - _Requirements: 1, 2, 5, 12_

- [ ] 7.2 Build the deck monitor panel
  - Render a deck monitor widget for each configured deck on each connected station
  - Display station name, channel, status label with color, cut info, and event description
  - Render left and right audio level meter bars with real-time updates
  - Render abort and monitor toggle buttons per deck
  - _Requirements: 10_

- [ ] 7.3 Build the add event type selection dialog
  - Present buttons for each event type: Recording, Playout, Download, Upload, Macro Cart, Switch Event
  - Disable the Playout button when no playout decks are configured
  - Return the selected event type to the caller
  - _Requirements: 1, 6_

- [ ] 7.4 Build the recording event editor dialog
  - Render station and deck selectors, start trigger type with time/GPI options, end trigger type with length/time/GPI options
  - Render GPI configuration fields (matrix, line, start/end windows) conditionally based on trigger type
  - Render cut assignment selector, audio source, channel count, auto-trim level, normalization level
  - Render scheduling controls: day-of-week checkboxes, active toggle, one-shot toggle, allow multiple recordings
  - Render Save, Save As New, and Cancel buttons
  - Display validation error dialogs for time window ordering, missing cut, invalid GPI, and duplicate events
  - _Requirements: 3, 9, 14_

- [ ] 7.5 (P) Build the download event editor dialog
  - Render station selector, start time, description, URL field, username and password fields, destination cart/cut selector
  - Render audio settings: channel count, auto-trim, normalization
  - Render scheduling controls: day-of-week, active, one-shot, metadata update, event date offset
  - Render Save, Save As New, and Cancel buttons
  - Display validation error dialogs for invalid URL, unsupported protocol, missing username, and duplicates
  - _Requirements: 4, 9, 14_

- [ ] 7.6 (P) Build the upload event editor dialog
  - Render station selector, start time, description, source cart/cut selector, URL field, credentials
  - Render export audio format selector with host compatibility check
  - Render optional podcast feed association selector
  - Render scheduling controls: day-of-week, active, one-shot, normalization, metadata update, event date offset
  - Render Save, Save As New, and Cancel buttons
  - Display validation error dialogs for invalid URL, unsupported protocol, missing username, unsupported format, and duplicates
  - _Requirements: 5, 9, 14_

- [ ] 7.7 (P) Build the playout event editor dialog
  - Render station and deck selectors, start time, description, destination cut selector
  - Render scheduling controls: day-of-week, active, one-shot
  - Render Save, Save As New, and Cancel buttons
  - _Requirements: 6, 9, 14_

- [ ] 7.8 (P) Build the switch event editor dialog
  - Render station selector and matrix selector with dynamic input/output population
  - Render start time, description, input routing selector, output routing selector
  - Render scheduling controls: day-of-week, active, one-shot
  - Render Save, Save As New, and Cancel buttons
  - _Requirements: 7, 9, 14_

- [ ] 7.9 (P) Build the cart/macro event editor dialog
  - Render station selector, start time, description, cart number selector with existence validation
  - Render scheduling controls: day-of-week, active, one-shot
  - Render Save, Save As New, and Cancel buttons
  - Display validation error for non-existent cart
  - _Requirements: 8, 9, 14_

- [ ] 7.10 Build the report selection and generation dialog
  - Present report type selection: Event Report and Upload/Download Report
  - Respect current filter settings when generating report content
  - Display formatted report output with type, description, station, times, source, destination, day schedule, status
  - For upload/download reports include URL, credentials, destination, and audio format details
  - _Requirements: 13_

- [ ] 8. Application startup and dependency wiring
- [ ] 8.1 Wire all components in the composition root
  - Instantiate all outbound adapters: event repository, reference data repository, catch daemon connections, audio engine client
  - Instantiate all application services: event list, filter, audition, reports, daemon connectivity
  - Instantiate all UI adapter models and controllers, inject application services
  - Register all models and controllers with the QML engine
  - _Requirements: 11_

- [ ] 8.2 Implement startup validation and error handling
  - Detect and report initialization failures with critical error dialog and exit
  - Detect and report unrecognized command line options with error message and exit
  - Detect and report IPC daemon connection failure with warning and exit
  - Detect and report audio engine connection failure with warning and exit
  - Establish connections to all configured catch daemons during startup
  - _Requirements: 11_

- [ ] 9. Unit tests for domain validation and filtering logic
- [ ] 9.1 (P) Test URL validation rules
  - Verify relative URLs are rejected, trailing-slash URLs are rejected
  - Verify each supported protocol is accepted (ftp, ftps, http, https, file, scp, sftp for downloads; ftp, ftps, file, scp, sftp for uploads)
  - Verify unsupported protocols are rejected
  - Verify file:// protocol requires a username
  - _Requirements: 4, 5_

- [ ] 9.2 (P) Test time window and recording validation rules
  - Verify GPI start window end-before-begin is rejected
  - Verify hard start/end with end-before-or-equal-to-start is rejected
  - Verify valid time ranges are accepted
  - Verify missing cut assignment is rejected
  - Verify invalid GPI matrix/line references are rejected
  - _Requirements: 3_

- [ ] 9.3 (P) Test duplicate event detection logic
  - Verify matching station, type, start time, and channel triggers duplicate detection
  - Verify differing any one parameter passes duplicate check
  - Test duplicate checking across all event types
  - _Requirements: 9_

- [ ] 9.4 (P) Test filter logic with AND combination of all four dimensions
  - Verify active-only filter shows only active events
  - Verify today-only filter shows only events for the current day of week
  - Verify day-of-week filter correctly narrows by all days, weekdays, or individual day
  - Verify event type filter correctly narrows by each type
  - Verify combined filters produce correct intersection of results
  - _Requirements: 2_

- [ ] 9.5 (P) Test exit code display formatting for all exit code enum values
  - Verify each exit code maps to the correct human-readable text
  - Verify status color mapping for each deck state
  - _Requirements: 1, 10_

- [ ] 10. Integration tests for multi-layer workflows
- [ ] 10.1 Test daemon connection status update flow
  - Connect to a catch daemon stub, receive a status update, verify the deck monitor model reflects the new status
  - _Requirements: 10, 11_

- [ ] 10.2 Test event creation and persistence workflow
  - Create an event via the editor controller, verify database record, verify reload notification sent to daemon
  - _Requirements: 1, 3_

- [ ] 10.3 (P) Test audition playback command flow
  - Trigger head and tail audition, verify the audio engine client receives correct play commands
  - Verify button state changes during playback
  - _Requirements: 12_

- [ ] 10.4 (P) Test heartbeat timeout handling
  - Simulate heartbeat timeout on one station, verify warning emitted and other stations continue normally
  - _Requirements: 11_

- [ ] 10.5 (P) Test save-as-new creates a new record with a new ID
  - Clone an existing event via save-as-new, verify new record in database with distinct ID and identical field values
  - _Requirements: 14_

- [ ] 11. End-to-end tests for critical user journeys
- [ ] 11.1 Test creating a recording event with hard start/end and verifying list display
  - Navigate to Add, select Recording, configure settings, save, verify event appears in list with correct details and color
  - _Requirements: 1, 3_

- [ ] 11.2 Test creating a download event and verifying list display
  - Navigate to Add, select Download, enter valid URL and settings, save, verify event in list
  - _Requirements: 1, 4_

- [ ] 11.3 Test duplicate event rejection
  - Create an event, attempt to create a duplicate with same station/type/time/channel, verify warning dialog
  - _Requirements: 9_

- [ ] 11.4 Test filtering events by type and day
  - Create events of different types and day schedules, apply filters, verify correct items shown and hidden
  - _Requirements: 2_

- [ ] 11.5 Test deleting an event with confirmation
  - Select an event, click Delete, confirm in dialog, verify removal from list
  - _Requirements: 1_
