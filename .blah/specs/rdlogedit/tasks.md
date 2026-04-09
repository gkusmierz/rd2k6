# Implementation Plan

- [ ] 1. Domain entities, value objects, and domain services for log editing
- [ ] 1.1 (P) Implement the Log entity and LogLine entity with all fields described in the data model (name, description, service, dates, auto-refresh, origin info, line type, cart number, transition type, group name, duration, and identifiers)
  - Include the ordered-line relationship: a Log owns an ordered collection of LogLines
  - Support LogLine types: cart, marker, chain, and voice track
  - Provide methods for inserting, removing, and reordering lines with automatic renumbering
  - Use value semantics, pure C++, no Qt dependencies
  - _Requirements: 1.1, 2.1, 2.3, 2.8, 2.9_

- [ ] 1.2 (P) Implement domain value objects for log editing concerns
  - TransitionType (play, segue, stop) as enum class
  - LogLineType (cart, marker, chain, voice track) as enum class
  - CartValidityState (valid, conditionally valid, future valid, evergreen, invalid, disabled for service) as enum class
  - GraceTime and HardStartTime value objects
  - TimeDisplayStyle (twelve-hour, twenty-four-hour) as enum class
  - _Requirements: 2.3, 2.17, 3.3, 11.4_

- [ ] 1.3 (P) Implement domain services for log validation and cart validity assessment
  - LogValidationService: check whether carts in a log belong to groups enabled for the log's assigned service, return a validation report with descriptive failure messages
  - CartValidityResolver: determine the validity state of a cart given its group membership, service assignment, and scheduling dates, returning the appropriate CartValidityState for color coding
  - _Requirements: 3.5, 3.6, 8.1, 8.2, 2.17_

- [ ] 1.4 (P) Implement domain clipboard logic for log lines
  - Support cut, copy, and paste operations on one or more LogLine objects
  - Track whether the clipboard has content
  - Return an appropriate result when pasting from an empty clipboard
  - _Requirements: 2.7_

- [ ] 2. Outbound port interfaces for data access, audio, and notifications
- [ ] 2.1 (P) Define repository port interfaces for logs, log lines, carts, cuts, and services
  - ILogRepository: create, find all, find by name, save, delete, check existence
  - ILogLineRepository: load all lines for a log, save lines, support dynamic table-per-log storage
  - ICartRepository: find by number, check group membership
  - ICutRepository: save recorded cuts, find cuts for a cart
  - IServiceRepository: find all services, check group-service enabled status
  - Use only domain types in all signatures
  - _Requirements: 1.1, 2.11, 2.12, 5.5, 6.1_

- [ ] 2.2 (P) Define port interfaces for audio engine, lock management, notification, and configuration
  - IAudioEngine: load and play audio, start and stop recording, provide level meter data, report recording state changes via callbacks
  - ILockManager: try to acquire an exclusive lock with user and station identification, release lock, report lock conflict with locking user and station details
  - INotificationService: publish log created, modified, and deleted events; subscribe to notifications from other clients
  - IConfigStorage: save and load window geometry, persist user preferences (time display style)
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 9.1, 9.2, 9.3, 10.1, 10.2, 10.3, 11.1, 11.2, 11.3, 11.4_

- [ ] 3. Inbound port interfaces (use cases)
- [ ] 3.1 (P) Define inbound port interfaces for all application use cases
  - ILogManagementService: list logs with filtering by name and service, create log, delete log(s) with voice track awareness, open log for editing (acquires lock), save log, save log as copy
  - ILogEditingService: insert cart line, insert meta (marker, chain, voice track marker), delete line, move line, cut/copy/paste lines, validate log for service on save
  - IVoiceTrackingService: navigate to next/previous trackable position, start pre-roll, start recording, start post-roll, finish recording, import audio file as voice track, insert/delete voice track markers, get remaining track count
  - IRenderService: render log or selected events to cart/cut or external file with format settings, report progress, support cancellation
  - IReportService: generate log listing (text), log listing (CSV), and log exception report for a given date
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.18, 2.19, 3.1, 3.2, 3.3, 3.4, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.1, 7.2, 7.3_

- [ ] 4. Application services implementing inbound ports
- [ ] 4.1 Implement LogManagementService orchestrating log CRUD, filtering, locking, and deletion with voice track confirmation
  - On list: fetch all logs from repository, apply name and service filters, return display data including status icons (validity, link status, completion)
  - On create: create a new log entry in the repository and return it for editing
  - On delete: check for voice tracks and provide count for second confirmation, check lock status, skip locked logs with error identifying locking user/station
  - On open for editing: acquire exclusive lock via ILockManager, load log and lines from repositories, return lock conflict error if already locked
  - On save: persist log and lines, publish modification notification via INotificationService
  - On save-as: prompt for new name, persist as copy
  - Depends on task 2 port interfaces and task 1 domain entities
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 9.1, 9.2, 9.3_

- [ ] 4.2 Implement LogEditingService orchestrating line manipulation, cart selection, and clipboard operations
  - Insert cart line: open cart selection, validate cart exists and is not disabled for service, insert at current position
  - Insert meta line: present choice of marker, voice track marker, or log chain, insert selected type
  - Delete, reorder (up/down), and renumber lines
  - Cut, copy, paste via clipboard logic from task 1.4
  - Accept drag-drop cart insertion at specified position
  - On save: delegate to validation service, warn if disabled carts found, allow user to save anyway or cancel
  - Depends on tasks 1 and 2
  - _Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2_

- [ ] 4.3 Implement VoiceTrackingService managing the voice tracker state machine and audio coordination
  - Manage deck state transitions: Idle, PreRoll, Recording, PostRoll (as defined in design state machine)
  - On Track 1: begin playing pre-roll audio, prepare recording hardware
  - On Record: start recording, fade down pre-roll
  - On Track 2: begin playing post-roll while recording continues (enabled only when "enable second start" config is active)
  - On Finished: stop recording, save voice track to cut repository, calculate segue transition points
  - Support import workflow: allow selecting an existing audio file instead of recording
  - Navigation: move between trackable positions, insert/delete voice track markers
  - Track remaining voice track count
  - Handle cart creation failure with warning and recording prevention
  - Depends on tasks 1 and 2
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.12, 5.13, 5.14, 5.15, 5.16_

- [ ] 4.4 (P) Implement RenderService for log-to-audio rendering
  - Accept render target: internal cart/cut or external file path
  - Accept virtual start time: current time or user-specified
  - Accept audio format settings (codec, sample rate, channels)
  - Accept event selection: all events or only selected events
  - Provide option to ignore stop transitions
  - Report progress (current line / total lines) during rendering
  - Support cancellation by user
  - Depends on tasks 1 and 2
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [ ] 4.5 (P) Implement ReportService for log report generation
  - Support three report types: log listing text, log listing CSV, log exception report
  - For exception report: accept a date parameter
  - Generate report content and return for display or export
  - Depends on task 2 port interfaces
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 4.6 (P) Implement ConfigManager for window geometry and preference persistence
  - Save and restore main window size and position on close/open
  - Save and restore log editor window size
  - Persist time display style preference (12-hour / 24-hour) across sessions
  - Use IConfigStorage port for actual storage
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 5. Persistence and infrastructure adapters
- [ ] 5.1 Implement SQL persistence adapters for log and log line repositories
  - SqlLogRepository: CRUD operations against the LOGS table, handle the logExists flag, filter by service, support the dynamically-named line tables
  - SqlLogLineRepository: load and save log lines from/to per-log tables, handle line renumbering on insert/delete
  - Map between domain entities and database rows
  - Depends on task 2.1 port interfaces
  - _Requirements: 1.1, 2.1, 2.3, 2.11, 2.12_

- [ ] 5.2 (P) Implement SQL persistence adapters for cart, cut, and service repositories
  - SqlCartRepository: find cart by number, retrieve group membership
  - SqlCutRepository: save recorded voice track cuts, retrieve cuts for a cart
  - SqlServiceRepository: find all services, check group-to-service enabled status
  - Depends on task 2.1 port interfaces
  - _Requirements: 3.1, 3.2, 5.5, 8.1_

- [ ] 5.3 (P) Implement the lock manager adapter using database-level exclusive locks
  - Store lock records with user name and station identification
  - Return lock conflict error with locking user and station details when lock cannot be acquired
  - Release lock on editor close
  - Depends on task 2.2 port interfaces
  - _Requirements: 9.1, 9.2, 9.3, 2.15, 2.16_

- [ ] 5.4 (P) Implement the notification service adapter for inter-client communication
  - Publish log created, modified, and deleted events to connected clients via RPC daemon or equivalent
  - Subscribe to incoming notifications from other clients
  - Deliver notifications to registered listeners (UI components)
  - Depends on task 2.2 port interfaces
  - _Requirements: 10.1, 10.2, 10.3, 1.12_

- [ ] 5.5 (P) Implement the audio engine adapter for playback, recording, and level metering
  - Wrap the audio engine service for loading, playing, and stopping audio
  - Support simultaneous multi-deck playback (pre-roll, post-roll) and recording
  - Provide real-time VU level meter data and remaining time information
  - Emit state change signals: record loaded, recording, record stopped
  - Depends on task 2.2 port interfaces
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.11_

- [ ] 5.6 (P) Implement the configuration storage adapter
  - Persist window geometry and user preferences to local storage (INI file, QSettings, or equivalent)
  - Depends on task 2.2 port interfaces
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 6. UI adapter models and controllers (QML bridge layer)
- [ ] 6.1 Implement the log list model exposing log data to QML with filtering and status icons
  - Expose all log columns: name, description, service, music/traffic link status, voice track progress, validity dates, auto-refresh, origin, last linked, last modified
  - Support text filter and service filter properties
  - Expose status icon roles for validity, link status, and completion state
  - React to notification service events by refreshing affected rows, adding new entries, or removing deleted ones
  - Depends on tasks 4.1 and 5.4
  - _Requirements: 1.1, 1.2, 1.3, 1.11, 1.12, 10.2, 10.3_

- [ ] 6.2 Implement the log editor controller and log line list model for QML
  - Expose log metadata properties with change tracking (mark as changed on modification)
  - Expose log lines as a list model with roles for all columns: type icon, start time, transition, cart number, group, duration, title, artist, client, agency, label, source, external data, line ID
  - Expose color-coding role based on cart validity state
  - Expose actions: insert cart, insert meta, edit line, delete line, move up/down, cut, copy, paste, save, save-as, cancel with unsaved-changes three-way dialog
  - Support drag-drop insertion of carts at a specific position
  - Expose render and reports action triggers
  - Depends on tasks 4.1, 4.2, and 1.3
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 2.17, 2.18, 2.19_

- [ ] 6.3 Implement UI adapter controllers for cart line editor, marker editor, chain editor, and track marker editor dialogs
  - Cart line editor: expose cart number entry, cart selection trigger, read-only title/artist display, hard start time, transition type, grace time, overlap toggle, and validation messages (missing cart, disabled cart)
  - Marker editor: expose label and comment fields, hard start time, transition type, grace time
  - Chain editor: expose target log name with selection dialog trigger, auto-filled description from target, hard start time, transition type, grace time
  - Track marker editor: expose comment and overlap option, hard start time, transition type, grace time
  - Handle segue configuration: hard segue when overlap enabled with no custom points, gradual fade otherwise
  - Depends on task 4.2
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4_

- [ ] 6.4 Implement the voice tracker controller and waveform display model for QML
  - Expose transport button states (Track 1, Record, Track 2, Finished) enabled/disabled based on current deck state
  - Expose waveform data for up to three tracks (pre-roll, recording, post-roll) for the visualization area
  - Expose VU meter level data and remaining time while recording
  - Expose navigation controls (previous, next) and insert/delete track marker actions
  - Expose context menu actions on waveform: edit cue markers, undo segue changes, set start/end point, reset to hook markers
  - Expose segue/crossfade dragging interaction on waveform
  - Expose transition type change via log list context menu
  - Expose remaining voice track count
  - Expose import workflow trigger as alternative to recording
  - Handle unsaved changes prompt on navigation or close
  - Depends on tasks 4.3 and 5.5
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16_

- [ ] 6.5 (P) Implement the render dialog controller for QML
  - Expose target selection (internal cart/cut vs external file with browse)
  - Expose virtual start time options (current time or manual)
  - Expose audio format configuration (codec, sample rate, channels)
  - Expose event selection (all or selected only) and stop-transition ignore option
  - Expose progress indicator (current line / total) during rendering
  - Support cancellation during render
  - Depends on task 4.4
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [ ] 6.6 (P) Implement the reports dialog controller for QML
  - Expose three report type options: log listing text, log listing CSV, log exception report
  - Expose date selector for exception report
  - Expose generate action and result display/export
  - Depends on task 4.5
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 7. QML views and user interface
- [ ] 7.1 Build the main window QML view with log list, filter bar, action buttons, and status icons
  - Tabular log list displaying all columns from the log list model
  - Text filter bar and service filter dropdown
  - Action buttons: Add, Edit, Delete, Voice Tracker, Log Report
  - Status icons per row indicating validity, link status, and completion
  - Double-click or Edit button opens the log editor
  - Delete button with confirmation dialog and second voice-track-count confirmation when applicable
  - Lock error display when attempting to delete a locked log
  - Window geometry save/restore on close/open
  - Follow design system tokens from steering design.md
  - Depends on tasks 6.1 and 4.6
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 11.1, 11.3_

- [ ] 7.2 Build the log editor QML dialog with metadata fields, line list, and action toolbar
  - Metadata section: name (read-only), description, service selector, auto-refresh toggle, start/end/purge date pickers, time style selector (12h/24h), origin info (read-only), voice track count (read-only)
  - Log line list with all columns from the log line list model, color-coded rows per cart validity state
  - Line editing toolbar: Insert Cart, Insert Meta (with sub-menu for marker, voice track marker, chain), Edit, Delete, Up, Down, Cut, Copy, Paste
  - Save, Save As, Render, Reports, OK, and Cancel buttons
  - Cancel with unsaved changes: three-way dialog (save and close, discard and close, remain)
  - Drag-drop zone for external cart insertion
  - Lock acquisition on open with conflict warning dialog showing locking user and station
  - Editor window geometry save/restore
  - Depends on tasks 6.2 and 6.3
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 2.17, 2.18, 2.19, 8.1, 8.2, 9.1, 9.2, 9.3, 11.2_

- [ ] 7.3 Build the event editor QML dialogs for cart, marker, chain, and track marker line types
  - Cart line editor dialog: cart number input with selection dialog trigger, title and artist display, hard start time, transition type selector, grace time options, overlap toggle, validation warnings
  - Marker editor dialog: label and comment fields, hard start time, transition type, grace time
  - Chain editor dialog: target log name with selection dialog, auto-filled description, hard start time, transition type, grace time
  - Track marker editor dialog: comment, overlap option, hard start time, transition type, grace time
  - Depends on task 6.3
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4_

- [ ] 7.4 Build the voice tracker QML view with waveform display, transport controls, VU meters, and log line list
  - Log line list showing trackable positions with navigation
  - Three-track waveform visualization area for pre-roll, recording, and post-roll
  - Transport buttons: Track 1, Record, Track 2, Finished with state-dependent enable/disable
  - VU level meters showing real-time recording levels and remaining time
  - Remaining voice track count display
  - Context menu on waveform: edit cue markers, undo segue changes, set start/end point, reset to hook markers
  - Interactive segue/crossfade point dragging on waveform
  - Insert and Delete controls for voice track markers
  - Previous and Next navigation buttons
  - Import button as alternative to recording
  - Transition type change via log list context menu
  - Unsaved changes prompt on navigation or close
  - Depends on task 6.4
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16_

- [ ] 7.5 (P) Build the render dialog QML view
  - Target selection: radio buttons for internal cart/cut vs external file with browse button
  - Virtual start time: current time or manual time entry
  - Audio format settings: codec, sample rate, channels selectors
  - Event selection: all events or selected events only
  - Ignore stop transitions checkbox
  - Progress bar showing current line / total lines during rendering
  - Cancel button to abort rendering
  - Depends on task 6.5
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [ ] 7.6 (P) Build the reports dialog QML view
  - Report type selection: log listing text, log listing CSV, log exception report
  - Date selector for exception report
  - Generate button with result display area or export action
  - Depends on task 6.6
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 8. Application composition root and startup wiring
- [ ] 8.1 Wire all ports, adapters, application services, and UI controllers in the composition root
  - Instantiate all persistence adapters with database connection
  - Instantiate audio engine adapter
  - Instantiate lock manager, notification service, and configuration storage adapters
  - Construct all application services with injected port implementations
  - Construct all UI adapter models and controllers
  - Register all QML-facing objects with the QML engine
  - Set up notification service subscriptions for the main window
  - Restore window geometry from configuration on startup
  - Handle application initialization failure with error display and exit
  - Handle unknown command-line options with critical error and exit
  - _Requirements: 1.1, 2.15, 9.1, 10.1, 11.1, 11.3_

- [ ] 9. Unit tests for domain logic and application services
- [ ] 9.1 (P) Unit tests for domain entities and value objects
  - Test Log entity: add, remove, reorder lines with correct renumbering
  - Test LogLine entity: all type variants and field access
  - Test TransitionType, LogLineType, CartValidityState enumerations
  - Test value objects: equality, comparison, edge cases
  - _Requirements: 2.3, 2.8, 2.9_

- [ ] 9.2 (P) Unit tests for domain services
  - Test LogValidationService: carts from enabled and disabled groups, mixed logs, empty logs
  - Test CartValidityResolver: all six validity states based on cart state and group membership
  - Test clipboard logic: cut, copy, paste with empty and populated states, paste from empty clipboard
  - _Requirements: 3.5, 3.6, 8.1, 8.2, 2.7, 2.17_

- [ ] 9.3 Unit tests for application services
  - Test LogManagementService: list filtering, create, delete with voice track count, lock acquisition and conflict, save and notify
  - Test LogEditingService: insert/delete/move lines, clipboard operations, drag-drop insertion, validation on save
  - Test VoiceTrackingService: all state machine transitions (Idle, PreRoll, Recording, PostRoll), invalid transitions, Track 2 enable/disable based on config, cart creation failure handling
  - Test RenderService: progress reporting, cancellation, format configuration
  - Test ReportService: all three report types, date parameter for exception report
  - Test ConfigManager: save and restore geometry, persist time display preference
  - _Requirements: 1.2, 1.6, 1.7, 1.8, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.14, 5.2, 5.3, 5.4, 5.5, 5.13, 5.16, 6.7, 6.8, 7.1, 7.2, 7.3, 8.1, 8.2, 9.1, 9.2, 11.1, 11.4_

- [ ] 10. Integration tests
- [ ] 10.1 Integration tests for persistence adapters with real database
  - Test SqlLogRepository and SqlLogLineRepository: full CRUD cycle, dynamic table handling, service filtering
  - Test SqlCartRepository and SqlServiceRepository: group-service enabled status queries
  - Test SqlCutRepository: save and retrieve voice track cuts
  - Use in-memory SQLite for test isolation
  - _Requirements: 1.1, 2.11, 5.5, 8.1_

- [ ] 10.2 Integration tests for concurrent editing and inter-client notifications
  - Test lock manager: user A acquires lock, user B fails with conflict error showing locking user/station, user A releases, user B succeeds
  - Test notification service: user A saves log, user B receives modification notification, user A deletes log, user B receives deletion notification
  - _Requirements: 9.1, 9.2, 9.3, 10.1, 10.2, 10.3_

- [ ] 10.3 Integration tests for voice tracking and rendering audio flows
  - Test voice tracking audio flow: verify audio engine receives correct play, record, stop commands in the right sequence
  - Test drag-drop cart insertion: drop cart onto log line list, verify correct position
  - Test rendering flow: verify render engine receives format and event selection, produces output
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 6.7, 6.8_

- [ ] 11. End-to-end tests for critical user workflows
- [ ] 11.1 E2E test: create a new log, add cart lines, save, verify log appears in the list
  - _Requirements: 1.4, 2.5, 2.11, 1.1_

- [ ] 11.2 E2E test: open a log, edit metadata and lines, save, verify changes persist
  - _Requirements: 1.5, 2.1, 2.2, 2.4, 2.11_

- [ ] 11.3 E2E test: voice track a segment with pre-roll, record, post-roll, finish, verify track saved
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ] 11.4 E2E test: render a log to an audio file, verify output file created
  - _Requirements: 6.1, 6.7_

- [ ] 11.5 E2E test: delete a log with voice tracks, confirm both deletion prompts, verify removal
  - _Requirements: 1.6, 1.7_
