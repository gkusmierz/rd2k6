# Implementation Plan

- [ ] 1. Domain value objects and enumerations for the virtual airplay daemon
- [ ] 1.1 (P) Define the domain enumerations used throughout the daemon
  - Operation mode enumeration with Automatic, Live Assist, and Manual values
  - Start mode enumeration with Start Empty, Start Previous, and Start Specified values
  - Exit code enumeration with Clean and Dirty values
  - Transition type enumeration with Play, Segue, Stop, and No Transition values
  - All enumerations must be scoped enum classes with comparison operators where needed
  - _Requirements: 1.5, 1.6, 2.1, 2.7, 4.4, 7.1_

- [ ] 1.2 (P) Define the log machine index value object with validation logic
  - Encapsulate the valid machine number range (101-120) as a value type
  - Provide a factory or constructor that validates the range and returns an error for out-of-range values
  - Provide conversion from external machine number (101-120) to internal index (0-19)
  - Support the special "all machines" address as a distinct concept
  - Include cart number validation as a value object (max 999999)
  - _Requirements: 3.1, 3.2, 3.3, 6.3_

- [ ] 2. Configuration store port and adapter for reading and writing daemon settings
- [ ] 2.1 Define the outbound port interface for the configuration store
  - Declare operations for reading and writing exit codes (dirty on startup, clean on shutdown)
  - Declare operations for reading start mode, current log name, current line, running state, and auto-restart flag per machine
  - Declare operations for reading audio channel configuration per virtual machine (card, port, start/stop macros)
  - Declare operations for reading station hardware info (card driver type, output count)
  - Declare operation for reading the default service name and operation mode per machine
  - All methods must use domain types only (no Qt types in the interface)
  - _Requirements: 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2_

- [ ] 2.2 Implement the configuration store adapter using Qt SQL
  - Implement all configuration store port operations against the RDAIRPLAY and STATIONS database tables
  - Map database values to domain enumerations (exit codes, start modes, operation modes, driver types)
  - Handle database read/write errors by emitting structured error info rather than throwing exceptions
  - _Requirements: 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2_

- [ ] 3. Audio hardware validation logic at startup
- [ ] 3.1 Implement the audio hardware validation service
  - For each virtual log machine (0-19), read the configured card and port from the configuration store
  - If the card's driver type is "None", set the card and port to disabled values for that machine
  - If the configured port number exceeds the card's available output count, set card and port to disabled values
  - Disabled machines must still be addressable and accept remote commands; only audio output is suppressed
  - Return the validated audio channel assignments (card, port, start/stop macros) for each machine
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 4. Log playback engine integration port and wiring
- [ ] 4.1 Define the outbound port interface for the log playback engine
  - Declare operations for loading a log by name (with date/time macro expansion), unloading, appending, and refreshing
  - Declare operations for play (with line number and start source), stop (with optional fade duration), and make-next
  - Declare operations for inserting a cart at a given line position with a transition type
  - Declare operations for setting operation mode, audio channels, volume ducking (level, duration, optional line), now/next notification carts, default service name, and log name
  - Declare a method to query the next playback line
  - Declare event callbacks or signals for reload-completed and rename events
  - The interface must support 20 independent instances
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 7.1, 7.2, 8.1, 8.2, 8.3, 9.1, 9.2_

- [ ] 4.2 Implement the log playback engine adapter
  - Wrap the actual log playback engine library component behind the outbound port interface
  - Create and manage 20 engine instances, one per virtual machine slot
  - Connect engine signals (reloaded, renamed) to the port's event interface
  - Handle all technology-specific concerns (Qt parent-child ownership, signal/slot connections) within the adapter
  - _Requirements: 1.2, 4.1, 4.2, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ] 5. IPC connection port and adapter for receiving remote macro commands
- [ ] 5.1 Define the inbound port interface for receiving IPC commands
  - Declare event callbacks for connection state changes (connected/disconnected)
  - Declare event callbacks for remote macro command reception with command type and arguments
  - Declare event callbacks for user change notifications
  - Define a structured command representation (command type enum, machine target, arguments) using domain types
  - _Requirements: 1.1, 2.1, 3.1, 3.2_

- [ ] 5.2 Implement the IPC adapter for the remote macro command protocol
  - Connect to the IPC service and handle connection lifecycle
  - Parse incoming remote macro commands and translate them into the structured command representation
  - Emit connection events and command-received events through the port interface
  - Handle connection errors and emit structured error info
  - _Requirements: 1.1, 2.1, 3.1, 3.2_

- [ ] 6. Main controller: command dispatch and log machine index validation
- [ ] 6.1 Implement the command dispatcher in the main controller
  - Receive structured commands from the IPC port and route them by command type
  - For each incoming command, validate the log machine index using the domain value object (reject out-of-range with negative acknowledgment)
  - Convert valid machine numbers to internal indices (0-19) before forwarding to the playback engine port
  - Handle the special "all machines" address by iterating over all 20 engines
  - Send positive or negative acknowledgments back through the IPC port
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 6.2 Implement the Load Log command handler
  - When one argument is received (machine only), clear and unload the log from that machine
  - When two arguments are received (machine and log name), verify the log exists in the database before loading
  - If the log does not exist, reject the command with a negative acknowledgment
  - When three arguments are received and the start-line parameter is -2, load the log and conditionally start playback based on the first scheduled event's transition type (start for Play or Segue, do not start for Stop or No Transition)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6.3 Implement the Append Log and Refresh Log command handlers
  - When an Append Log command is received, delegate appending the specified log content to the target machine's playback engine
  - When a Refresh Log command is received, delegate log reload to the target machine's playback engine
  - _Requirements: 4.5, 4.6_

- [ ] 6.4 (P) Implement the playback control command handlers (Play Next, Start, Stop, Make Next)
  - Play Next: get the next scheduled line from the playback engine and start playback at that line
  - Start: start playback at the specified line number on the target machine
  - Stop for a specific machine: stop playback, applying a fade-out over the specified duration if provided
  - Stop for all machines: iterate over all 20 engines and stop each one
  - Make Next: set the specified line as the next line to play on the target machine
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 6.5 (P) Implement the cart insertion command handler (Add Next)
  - Validate the cart number is at most 999999; reject with negative acknowledgment if exceeded
  - Insert the cart at the next-play position on the target machine
  - If no next line exists, append the cart at the end and designate it as the next event
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 6.6 (P) Implement the operation mode command handler (Set Mode)
  - When a machine number is specified, set that machine to the given mode (Automatic, Live Assist, or Manual)
  - When no machine is specified (or the "all" address is used), set all 20 machines to the given mode
  - _Requirements: 7.1, 7.2_

- [ ] 6.7 (P) Implement the volume control command handler (Duck Machine)
  - Apply volume adjustment with the specified level (dBFS) and duration to the target machine
  - When the "all machines" address is used, apply the adjustment to all 20 machines
  - When a specific line is included, apply the adjustment only to that line
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 6.8 (P) Implement the now/next notification cart command handler (Set Now/Next)
  - When type is "now", set the default now-playing notification cart for the specified machine
  - When type is "next", set the default next-up notification cart for the specified machine
  - Validate the cart number is at most 999999
  - _Requirements: 9.1, 9.2_

- [ ] 7. Startup log loading and crash recovery logic
- [ ] 7.1 Implement the initial log loading sequence triggered by IPC connection
  - On IPC connection established, iterate over all 20 virtual machines and load logs based on each machine's configured start mode
  - For "start previous" mode, load the previously-playing log with date/time macro expansion
  - For "start specified" mode, load the configured log name with date/time macro expansion
  - For "start empty" mode, skip loading entirely
  - If a referenced log does not exist in the database, log a warning and skip that machine
  - _Requirements: 2.1, 2.4, 2.6, 2.7_

- [ ] 7.2 Implement the crash recovery behavior using exit code state
  - On startup, read the previous exit code from the configuration store
  - Immediately write a dirty exit code to the configuration store (for crash detection on subsequent startups)
  - For "start previous" with dirty exit: restore the saved line position and auto-start playback if auto-restart is enabled
  - For "start previous" with clean exit: start from line 0 without auto-starting
  - For "start specified" with dirty exit and matching log: restore the saved line position
  - Handle the reload-completed event from the playback engine to set the restored line and conditionally start playback
  - _Requirements: 1.6, 2.2, 2.3, 2.5_

- [ ] 8. Daemon lifecycle management (startup, signal handling, shutdown)
- [ ] 8.1 Implement the daemon initialization and startup sequence
  - Initialize the application context and open database connections
  - Connect to the audio engine service
  - Connect to the IPC service
  - Create all 20 log playback engine instances via the adapter, assigning machines 101-120
  - Configure each engine with its validated audio channels, operation mode, and default service name from the configuration store
  - Start a periodic poll timer (1-second interval) that checks a shutdown flag
  - _Requirements: 1.1, 1.2_

- [ ] 8.2 Implement signal handling and graceful shutdown
  - Register OS signal handlers for SIGINT and SIGTERM (cross-platform via Qt or portable signal abstraction)
  - When a termination signal is received, set the internal shutdown flag
  - On the next poll timer tick, detect the flag and begin the shutdown sequence
  - Destroy all 20 log playback engine instances
  - Write a clean exit code to the configuration store
  - Exit the process with code 0
  - _Requirements: 1.3, 1.4, 1.5_

- [ ] 9. Log existence verification via database query
- [ ] 9.1 (P) Implement the log existence check as an outbound port and adapter
  - Define an outbound port operation that checks whether a log name exists in the database
  - Implement the adapter using a direct SQL query against the LOGS table
  - Return a boolean result; do not load log content -- existence check only
  - Used by the Load Log command handler and the startup log loading sequence
  - _Requirements: 4.3, 2.6_

- [ ] 10. Integration wiring and composition root
- [ ] 10.1 Wire all ports, adapters, and the main controller in the application entry point
  - Instantiate the configuration store adapter with a database connection
  - Run audio hardware validation and obtain validated channel assignments
  - Instantiate the IPC adapter
  - Instantiate the log playback engine adapter (20 instances)
  - Instantiate the log existence check adapter
  - Inject all dependencies into the main controller via constructor
  - Connect IPC events to the main controller's command dispatcher and connection handler
  - Connect playback engine reload events to the main controller's recovery handler
  - Start the event loop
  - _Requirements: 1.1, 1.2, 10.1, 10.2, 10.3_

- [ ] 11. Unit tests for domain logic and command handling
- [ ] 11.1 (P) Unit tests for domain value objects and enumerations
  - Test log machine index validation: valid range (101-120) yields correct internal index (0-19), out-of-range values produce errors
  - Test the "all machines" address is correctly identified
  - Test cart number validation: values up to 999999 are accepted, values above are rejected
  - Test all domain enumeration conversions
  - _Requirements: 3.1, 3.2, 3.3, 6.3_

- [ ] 11.2 (P) Unit tests for command dispatch and business logic
  - Test Load Log command with 1 argument (clears), 2 arguments (loads), and 3 arguments with -2 start line (conditionally starts based on transition type)
  - Test Stop command dispatches to a single machine or all 20 machines
  - Test Set Mode with a specific machine sets one; without machine sets all 20
  - Test Add Next when no next line exists appends and designates as next
  - Test exit code management: dirty on startup, clean on shutdown
  - Test conditional start based on transition type (Play/Segue start; Stop/NoTransition do not)
  - _Requirements: 4.1, 4.2, 4.4, 5.3, 5.5, 6.2, 7.1, 7.2, 1.5, 1.6_

- [ ] 12. Integration tests for startup, crash recovery, and hardware validation
- [ ] 12.1 (P) Integration tests for IPC connection and command dispatch
  - Verify remote macro commands are received and dispatched to the correct log machine
  - Verify commands targeting all logs are applied to all 20 machines
  - _Requirements: 3.2, 3.3_

- [ ] 12.2 (P) Integration tests for crash recovery and startup log loading
  - Simulate a dirty exit code in the configuration store and verify the daemon resumes at the saved position with auto-start
  - Simulate a clean exit code and verify the daemon starts from line 0 without auto-starting
  - Verify "start specified" mode loads the configured log name
  - Verify a non-existent log at startup produces a warning and is skipped
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [ ] 12.3 (P) Integration tests for audio hardware validation
  - Verify machines configured with a "None" driver card have audio output disabled
  - Verify machines configured with a port exceeding the card's output count have audio output disabled
  - Verify disabled machines still accept and process remote commands
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 12.4 (P) Integration test for log existence verification
  - Verify the database query correctly identifies existing and non-existing logs
  - Verify a Load Log command for a non-existent log is rejected with a negative acknowledgment
  - _Requirements: 4.3, 2.6_

- [ ]* 13. End-to-end test for a full command lifecycle
  - Start the daemon with a test configuration containing known logs
  - Load a log, start playback, insert a cart, stop with fade, unload -- verify each step succeeds
  - Verify the startup-with-dirty-exit recovery path end-to-end
  - _Requirements: 1.1, 1.2, 1.5, 1.6, 2.2, 4.2, 5.1, 5.4, 6.1_
