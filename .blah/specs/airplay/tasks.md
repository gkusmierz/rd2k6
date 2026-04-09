# Implementation Plan

- [ ] 1. Domain value objects and entities for playout
- [ ] 1.1 Create the operating mode enumeration and transition logic
  - Define a domain enumeration for the three operating modes: Manual, Automatic, and Live Assist
  - Implement a domain service that validates mode transitions (all three modes can transition to any other)
  - Include a default-mode constant (Manual) for startup initialization
  - _Requirements: 2.4, 2.5, 2.6, 2.7_

- [ ] 1.2 (P) Create the action mode state machine
  - Define a domain enumeration for action modes: Normal, AddFrom, AddTo, DeleteFrom, MoveFrom, MoveTo, CopyFrom, CopyTo
  - Implement transition logic that enforces the valid state transitions (Normal to each operation entry, through selection, back to Normal)
  - Return the expected next state given the current state and an incoming event (button click, selection, cancellation)
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 1.3 (P) Create the transport state enumeration and log line value object
  - Define a domain enumeration for playback button states: Stop, Play, Pause, Disabled, Error
  - Define a value object representing a single log line with its properties: line number, cart number, title, artist, duration, transition type, hard start time, grace time, overlap, and status
  - Include a transition type enumeration (Play, Segue, Stop) used by log lines
  - _Requirements: 2.1, 2.2, 2.3, 2.8_

- [ ] 1.4 (P) Create the time mode value object and timing domain types
  - Define a time mode enumeration for 12-hour and 24-hour display formats
  - Define value objects for post-point state (early, on-time, late) with associated timing offset
  - Define a hard start time validation service that checks for duplicate hard start times within a log
  - _Requirements: 5.7, 5.8, 6.1, 6.2, 6.4_

- [ ] 1.5 (P) Create the RML command domain model
  - Define a domain enumeration for all RML command codes: LB, LC, LL, AL, MN, PB, PC, PE, PL, PM, PN, PP, PS, MD, PT, PU, PD, PW, PX, RL, SN
  - Define a value object representing a parsed macro command with its code and argument list
  - Include argument count validation rules per command code (minimum and maximum arguments)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 1.6 (P) Create the GPI trigger and channel lockout domain model
  - Define a value object for a GPI input event (input number, state)
  - Implement a lockout timer domain service that tracks per-channel lockout intervals after a GPI trigger
  - Return whether a new trigger should be accepted or ignored based on the lockout state
  - _Requirements: 7.6, 7.7_

- [ ] 2. Outbound port interfaces
- [ ] 2.1 (P) Define the audio engine port
  - Define a port interface for connecting to the audio engine, loading audio, starting playback, stopping playback, pausing, and resuming
  - Include methods for querying real-time audio levels (peak meter data)
  - Include methods for channel assignment and resource allocation
  - _Requirements: 1.2, 2.1, 2.2, 2.3, 6.7_

- [ ] 2.2 (P) Define the IPC daemon port
  - Define a port interface for connecting to the inter-process communication daemon
  - Include methods for receiving incoming macro commands and GPI state change events
  - Include methods for user authentication queries
  - _Requirements: 1.2, 7.1, 7.6_

- [ ] 2.3 (P) Define the log repository port
  - Define a port interface for loading and saving broadcast logs
  - Include methods for listing available logs with filtering by date range, active status, and service permissions
  - Include methods for acquiring and releasing log locks, and querying lock ownership
  - Include methods for checking log existence and loading startup logs by name
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 2.4 (P) Define the airplay configuration port
  - Define a port interface for loading station-specific playout configuration from persistent storage
  - Include startup mode (empty, previous, specified log name), default operating mode, channel assignments, exit password, pause enablement, and sound panel layout
  - _Requirements: 1.6, 1.7, 2.3, 3.8, 3.9_

- [ ] 3. Inbound port interfaces (use cases)
- [ ] 3.1 Define the playout service port
  - Define a use case interface for log playout operations: play, stop, pause, resume, make-next, load log, unload log, save log, refresh log
  - Include methods for querying current transport state, current position, and next stop time
  - Include methods for log editing operations: add cart, delete line, move line, copy line
  - Depends on domain types from task 1
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.3, 3.4, 3.7, 5.1, 5.2, 5.3, 5.4_

- [ ] 3.2 (P) Define the sound panel service port
  - Define a use case interface for sound panel operations: load cart into button, play button, stop button, pause button
  - Include methods for querying button state and assignment
  - Include event publication for channel started/stopped notifications
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_

- [ ] 3.3 (P) Define the remote control service port
  - Define a use case interface that accepts a parsed macro command and dispatches it to the appropriate playout or panel operation
  - Include methods for GPI event handling with lockout enforcement
  - Include a method for switching the visible widget (log machine or sound panel)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

- [ ] 4. Application services (business logic orchestration)
- [ ] 4.1 Implement the playout service
  - Implement the playout service inbound port by orchestrating the log repository, audio engine, and mode manager
  - Handle automatic mode: when the current item finishes, start the next item automatically
  - Handle live assist mode: execute transitions automatically but allow manual overrides
  - Handle manual mode: require explicit play for each item
  - Manage log line status updates and transport state changes
  - Emit events for transport changes, position updates, and log modifications
  - Depends on tasks 1.1, 1.3, 2.1, 2.3, 3.1
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.3, 3.4, 3.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 4.2 Implement the sound panel service
  - Implement the sound panel service inbound port by orchestrating the audio engine and cart data access
  - Start playback when a panel button is triggered, stop on re-trigger or explicit stop
  - Publish channel-started and channel-stopped events to the main application
  - Support drag-and-drop cart assignment to panel buttons
  - Depends on tasks 2.1, 2.3, 3.2
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 4.3 Implement the remote control service
  - Implement the remote control service inbound port by parsing RML command codes and dispatching to the playout service, sound panel service, and mode manager
  - Handle all 21 RML commands (LB, LC, LL, AL, MN, PB, PC, PE, PL, PM, PN, PP, PS, MD, PT, PU, PD, PW, PX, RL, SN)
  - Handle GPI events with per-channel lockout enforcement
  - Handle widget selection commands to switch the visible view
  - Depends on tasks 1.5, 1.6, 3.3, 4.1, 4.2
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

- [ ] 4.4 Implement the startup and lifecycle service
  - Implement single-instance enforcement via lock file acquisition at startup
  - Establish connections to the audio engine and IPC daemon before becoming operational
  - Load startup logs according to the configured start mode (empty, previous, or specified log name)
  - Handle crash recovery: when start mode is "previous" and the previous session ended abnormally, resume at saved position with optional auto-start
  - Implement exit protection: password prompt when configured, confirmation dialog otherwise
  - Handle initialization failures (database, configuration) with error display and termination
  - Handle unrecognized command-line options with error display and termination
  - Handle memory lock warnings (non-fatal)
  - Depends on tasks 2.1, 2.2, 2.4
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 3.8, 3.9_

- [ ] 5. UI adapter layer (QML models and controllers)
- [ ] 5.1 Implement the log list model and transport controller
  - Create a list model exposing log lines to QML with roles for title, artist, duration, transition type, status, hard start time, and line number
  - Create a transport controller exposing play, stop, pause, take-next, scroll-to-hour, and refresh operations to QML
  - Emit signals for transport state changes, line status updates, and log reload events
  - Support action mode state propagation to the UI (add, delete, move, copy visual states)
  - Depends on tasks 3.1, 4.1
  - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 5.2 (P) Implement the sound panel model and controller
  - Create a grid model exposing sound panel buttons to QML with roles for cart title, timing information, and playback state
  - Create a controller exposing play, stop, and cart assignment operations to QML
  - Emit channel-started and channel-stopped signals for the main window to consume
  - Support drag-and-drop by accepting cart data and forwarding to the sound panel service
  - Depends on tasks 3.2, 4.2
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 5.3 (P) Implement the timing display controllers
  - Create a wall clock controller that updates current time at 100ms intervals and supports 12h/24h toggle
  - Create a pie counter controller that receives transport events and calculates remaining time, talk start/end markers, and transition type for the countdown display
  - Create a post counter controller that calculates early/on-time/late status relative to the post point
  - Create a stop counter controller that computes the next stop time from the current log position
  - Create a mode display controller that reflects the current operating mode
  - Create an audio meter controller that receives real-time peak level data from the audio engine
  - Create an hour selector controller that exposes which hours contain scheduled events and handles hour-click navigation
  - Depends on tasks 2.1, 4.1
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ] 5.4 (P) Implement the log selection dialog model
  - Create a model exposing available logs to QML with roles for log name, description, and service
  - Support filtering by date range, active status, and station service permissions
  - Expose load, save, save-as, and unload operations with log lock enforcement
  - Display lock owner information when a log is locked by another user
  - Enforce the refresh-before-save rule
  - Depends on tasks 2.3, 4.1
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 5.5 (P) Implement the event properties dialog controller
  - Create a controller that loads a log line's editable properties: hard start time, grace time, transition type, and overlap settings
  - Validate that no duplicate hard start times exist when the operator saves changes
  - Return updated properties to the log list for recalculation of affected timing
  - Depends on tasks 1.4, 4.1
  - _Requirements: 5.6, 5.7, 5.8_

- [ ] 6. QML UI implementation
- [ ] 6.1 Implement the main window layout and view switching
  - Build the top-level QML window with the layout defined in the design system: timing displays at top, log list and sound panel as switchable central views, transport controls
  - Implement view switching between Main Log, Aux 1, Aux 2, and Sound Panel via tab bar or selector buttons
  - Connect the master timer (100ms tick) to all time-dependent child components
  - Wire the exit protection flow: password dialog when configured, confirmation dialog otherwise
  - Read and apply all tokens from the design system hierarchy (global steering, spec MASTER, page overrides)
  - _Requirements: 1.6, 1.7, 7.8_

- [ ] 6.2 Implement the log list view
  - Build a scrollable list displaying log lines with title, artist, duration, transition type, hard start time, and status indicators
  - Implement transport buttons (Play, Stop, Pause, Take, Head, Tail) connected to the transport controller
  - Implement action mode buttons (Add, Delete, Move, Copy) with visual state feedback reflecting the current action mode
  - Support drag-and-drop of carts onto log line positions for insertion or replacement
  - Support double-click on a log line to open the event properties dialog
  - Read and apply visual specifications from the log-list-view design system page
  - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 6.3 (P) Implement the sound panel view
  - Build a grid of buttons displaying cart title and timing information per button
  - Start playback on single click, open event properties on double-click
  - Support drag-and-drop of carts onto buttons for assignment
  - Show playback state visually (idle, playing, paused) per button
  - Read and apply visual specifications from the sound-panel design system page
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6.4 (P) Implement the timing display widgets
  - Build the wall clock display with current time updated at 100ms, click-to-toggle between 12h and 24h formats
  - Build the pie chart countdown widget showing remaining time as a depleting arc with talk start and talk end markers, colored by transition type
  - Build the post-point counter with color-coded early (green), on-time (green), and late (red) indication
  - Build the stop counter showing the next stop time
  - Build the mode display indicator showing the current operating mode
  - Build the stereo audio level meter in peak mode
  - Build the hour selector bar with hour cells highlighted when events exist, click-to-scroll navigation
  - Read and apply visual specifications from the timing-displays design system page
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ] 6.5 (P) Implement the log selection dialog
  - Build a dialog with a filterable list of available logs showing name, description, and service columns
  - Provide filter controls for date range, active status, and service
  - Provide Load, Save, Save As, and Unload action buttons
  - Display lock warnings when a log is locked by another user
  - Display refresh-required warnings when the log has been externally modified
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 6.6 (P) Implement the event properties dialog
  - Build a dialog for editing log line properties: hard start time, grace time, transition type, and overlap
  - Display audio cue point editor for fine-tuning playback positions
  - Display cart notes as read-only information
  - Show validation error when a duplicate hard start time is detected
  - Return OK or Cancel result to the calling view
  - _Requirements: 5.6, 5.7, 5.8_

- [ ] 7. Persistence and infrastructure adapters
- [ ] 7.1 (P) Implement the audio engine adapter
  - Implement the audio engine port using Qt Multimedia for playback control (connect, load, play, stop, pause, resume)
  - Implement real-time peak level reporting for audio meters
  - Translate audio engine errors into structured domain error information
  - _Requirements: 1.2, 2.1, 2.2, 2.3, 6.7_

- [ ] 7.2 (P) Implement the IPC daemon adapter
  - Implement the IPC daemon port using Qt Network for communication with the inter-process daemon
  - Parse incoming macro commands into the RML command domain model
  - Forward GPI state change events to the application layer
  - Support user authentication queries
  - _Requirements: 1.2, 7.1, 7.6_

- [ ] 7.3 (P) Implement the log repository adapter
  - Implement the log repository port using Qt SQL for log data access
  - Implement available logs listing with date range, active status, and service permission filtering
  - Implement log lock acquisition, release, and ownership queries
  - Implement log existence checks and startup log loading
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 7.4 (P) Implement the airplay configuration adapter
  - Implement the configuration port using Qt SQL to load station-specific playout settings
  - Load startup mode, default operating mode, channel assignments, exit password, pause enablement, and sound panel layout
  - _Requirements: 1.6, 1.7, 2.3, 3.8, 3.9_

- [ ] 8. Application wiring and composition root
- [ ] 8.1 Wire the airplay application entry point
  - Create the composition root that instantiates all adapters and injects them into application services
  - Connect to the database, create repository adapters, create the audio engine adapter, create the IPC daemon adapter
  - Instantiate playout service, sound panel service, remote control service, and lifecycle service
  - Create all UI adapter models and controllers, expose them to the QML engine
  - Initialize the master timer (100ms) and connect it to all time-dependent components
  - Implement the startup sequence: splash screen, connections, configuration load, log machine creation, startup log loading, splash clear
  - Verify that all components integrate correctly end-to-end
  - Depends on all previous tasks
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.8, 3.9_

- [ ] 9. Testing
- [ ] 9.1 (P) Unit tests for domain value objects and state machines
  - Test operating mode transitions: all valid transitions between Manual, Automatic, and Live Assist
  - Test action mode state machine: complete cycle for add, delete, move, copy operations including cancellation paths
  - Test transport state transitions: stop to play, play to pause, pause to play, play to stop, disabled to stop
  - Test RML command parsing: each command code with valid arguments, invalid argument counts, and unknown codes
  - Test hard start time duplicate detection with various log line configurations
  - Test GPI lockout timer: trigger accepted, trigger ignored during lockout, trigger accepted after lockout expires
  - _Requirements: 1.5, 2.4, 2.5, 2.6, 2.7, 5.8, 7.1, 7.7_

- [ ] 9.2 (P) Unit tests for application services
  - Test playout service: play, stop, pause operations and their effect on transport state
  - Test automatic mode auto-advance: when an item finishes, the next item starts
  - Test manual mode: items do not auto-advance
  - Test live assist mode: transitions execute automatically with manual override capability
  - Test sound panel service: play, stop, cart assignment, channel started/stopped event emission
  - Test remote control service: dispatch of each RML command category to the correct handler
  - Test startup log loading: empty mode, previous mode, specified mode
  - Test exit protection: password path and confirmation path
  - _Requirements: 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.2, 4.5, 4.6, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 9.3 Integration tests for playout and log management
  - Test full playout flow: load log from database, play item, verify audio engine receives correct commands, verify transport state updates
  - Test log save with lock enforcement: acquire lock, save, verify lock conflict when another session holds the lock
  - Test log refresh-before-save enforcement: external change detected, save blocked until refresh
  - Test startup crash recovery: previous session ended abnormally, resume at saved position
  - Test IPC daemon connection and RML command routing: receive macro, verify correct playout action executed
  - Test GPI trigger to channel play/stop with lockout timing
  - _Requirements: 1.2, 2.1, 2.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 7.1, 7.6, 7.7_

- [ ] 9.4* E2E tests for operator workflows
  - Test start application, load a log, play an item, verify timing displays update correctly
  - Test switching between Manual, Automatic, and Live Assist modes and observing behavior changes
  - Test add, delete, move, and copy operations on a running log
  - Test loading and triggering sound panel buttons
  - Test sending RML commands externally and verifying playout responds
  - Test exit protection: verify password prompt blocks shutdown, confirm dialog allows shutdown
  - _Requirements: 1.1, 1.6, 1.7, 2.1, 2.4, 2.5, 2.6, 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 7.1, 7.5_
