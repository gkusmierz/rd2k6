# Implementation Plan

- [ ] 1. Define domain value objects and entities for PAD instance management
- [ ] 1.1 (P) Create the PAD instance running status enumeration and exit code value type
  - Define a scoped enum representing the running state of a PAD instance (running vs. not-running)
  - Define a value type for exit codes that distinguishes normal exit, crash (-1), and error codes
  - Ensure all types are pure C++ with no framework dependencies
  - _Requirements: 4.1, 6.1, 6.2, 8.1, 8.2_

- [ ] 1.2 (P) Create the PAD script instance entity
  - Define the entity representing a configured PAD script instance with identity, station name, script path, description, configuration, running status, exit code, and error text
  - Ensure immutable identity fields and mutable runtime state fields
  - Follow domain entity conventions with proper value semantics
  - _Requirements: 4.3, 8.1, 8.2_

- [ ] 2. Define port interfaces for outbound dependencies
- [ ] 2.1 (P) Define the status repository port interface
  - Declare an outbound port for querying instance identifiers and script paths for a given station
  - Include operations for updating running status, exit code, and error text for individual instances
  - Include a bulk reset operation to set all instances for a station to not-running
  - Include a station ownership verification operation
  - All method signatures use domain types only, no framework types
  - _Requirements: 2.1, 4.2, 6.1, 6.2, 7.3, 8.1, 8.2, 8.3_
  - _Contracts: StatusRepository Service Interface_

- [ ] 2.2 (P) Define the IPC notification port interface
  - Declare an outbound port for connecting to the IPC daemon and subscribing to PAD-type notifications
  - Define notification data types for add, delete, and modify actions carrying instance identifiers
  - Include connection state change callback or event interface
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_
  - _Contracts: Main Controller Event Contract_

- [ ] 2.3 (P) Define the process management port interface
  - Declare an outbound port for launching child processes with specified arguments, terminating them, and receiving lifecycle events (started, finished with exit details)
  - Include the ability to track whether a process is active and to terminate all managed processes
  - _Requirements: 4.1, 5.1, 5.2, 6.1, 6.2, 7.2_
  - _Contracts: ProcessManager Service Interface_

- [ ] 3. Implement the Status Repository adapter
- [ ] 3.1 Implement the database-backed status repository
  - Implement the status repository port using the database abstraction layer
  - Query PAD instance identifiers and script paths filtered by station name
  - Update individual instance records with running status, exit code, and error text
  - Implement the bulk reset operation to clear all instance states for a station
  - Implement station ownership verification by checking the instance's station association
  - Handle database errors and translate them to structured error information
  - Requires: Task 2.1 (port interface definition)
  - _Requirements: 2.1, 4.2, 6.1, 6.2, 7.3, 8.1, 8.2, 8.3_
  - _Contracts: StatusRepository Service Interface_

- [ ] 3.2 Write unit tests for the status repository adapter
  - Test querying instance identifiers returns correct results for a given station
  - Test updating running status, exit code, and error text persists correctly
  - Test bulk reset sets all instances to not-running with exit code 0 and empty error text
  - Test station ownership verification returns correct boolean for matching and non-matching stations
  - Test database error handling produces structured error info
  - Use in-memory database for test isolation
  - _Requirements: 2.1, 8.1, 8.2, 8.3_

- [ ] 4. Implement the Process Manager service
- [ ] 4.1 Implement core process lifecycle management
  - Build the service that maintains an in-memory map of instance identifiers to managed process objects
  - Implement script launching: invoke the interpreter with the script path, localhost address, PAD client TCP port, and a prefixed instance identifier as command-line arguments
  - Update the status repository to running when a process starts successfully
  - Support a no-restart flag per instance to control auto-restart behavior
  - Requires: Tasks 2.1, 2.3 (port interfaces)
  - _Requirements: 4.1, 4.2, 4.3_
  - _Contracts: ProcessManager Service Interface_

- [ ] 4.2 Implement process exit handling and auto-restart logic
  - When a process exits normally with code 0 and the no-restart flag is not set, automatically restart the script
  - When a process exits normally with code 0 and the no-restart flag is set, do not restart
  - When a process crashes (non-normal termination), log a warning, update the database with exit code -1 and captured error output, and do not restart
  - When a process exits normally with a non-zero exit code during normal operation, log a warning and update the database with the exit code and error output
  - Requires: Task 4.1
  - _Requirements: 5.1, 5.2, 6.1, 6.2_

- [ ] 4.3 Implement terminate-all capability for shutdown
  - Provide a method to terminate all currently tracked processes with the no-restart flag set
  - Ensure process termination is orderly and all instances are cleaned up from the tracking map
  - Requires: Task 4.1
  - _Requirements: 7.2_

- [ ] 4.4 Write unit tests for the Process Manager
  - Test that starting a script launches the process with the correct argument order and format
  - Test that the in-memory tracking map correctly reflects active instances
  - Test auto-restart behavior: clean exit without no-restart flag triggers restart
  - Test auto-restart suppression: clean exit with no-restart flag does not restart
  - Test crash handling: non-normal termination records error and does not restart
  - Test non-zero exit code handling: warning logged and database updated
  - Test terminate-all stops all running processes with no-restart flag
  - Use mock implementations of the process management and status repository ports
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 6.1, 6.2, 7.2_

- [ ] 5. Implement the Main Controller (application orchestration)
- [ ] 5.1 Implement secure process initialization and application framework setup
  - On startup, open the application framework connection (database, configuration, logging)
  - Drop elevated privileges by switching to the configured PAD service user and group identifiers
  - If the group privilege drop fails, log an error and terminate with exit code 1
  - If the user privilege drop fails, log an error and terminate with exit code 1
  - If the application framework connection fails, output an error and terminate with exit code 1
  - Requires: Tasks 3.1, 4.1 (repository and process manager implementations)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 5.2 Implement IPC connection handling and state reset
  - When the IPC connection is established, reset all PAD instance records for this station to not-running with exit code 0 and no error text
  - After resetting, query all configured instances for this station and start each one
  - Handle IPC reconnection by performing the same reset and restart sequence
  - Requires: Task 5.1
  - _Requirements: 2.1, 2.2, 8.3_

- [ ] 5.3 Implement notification-driven script management
  - Dispatch incoming PAD-type notifications to the appropriate action based on the notification type
  - On add-instance notification: verify the instance belongs to this station and start the script
  - On delete-instance notification: set the no-restart flag and terminate the running script process
  - On modify-instance notification when the script is active: terminate it to trigger auto-restart with updated configuration
  - On modify-instance notification when the script is inactive: start the script
  - Requires: Task 5.2
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5.4 Implement graceful shutdown on termination signals
  - Register handlers for interrupt and terminate OS signals
  - When a termination signal is received, set the shutdown flag and initiate the shutdown sequence within 100 milliseconds
  - Terminate all running script instances with the no-restart flag set
  - After all instances are terminated, update all database records to not-running status
  - Exit with code 0 when shutdown processing is complete
  - Requires: Task 5.1
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5.5 Write unit tests for the Main Controller
  - Test that initialization failure in the application framework causes exit code 1
  - Test that privilege drop failures cause exit code 1 with appropriate error logging
  - Test that IPC connection triggers state reset and script startup for all configured instances
  - Test notification dispatch: add creates and starts, delete terminates with no-restart, modify restarts active or starts inactive
  - Test shutdown signal triggers orderly termination and database cleanup
  - Use mock implementations of all port interfaces
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4_

- [ ] 6. Implement the IPC notification adapter
- [ ] 6.1 Implement the IPC daemon client adapter
  - Implement the IPC notification port to connect to the IPC daemon over TCP
  - Parse incoming notifications and filter for PAD-type events
  - Extract the action type (add, delete, modify) and instance identifier from notification payloads
  - Report connection state changes to the Main Controller
  - Handle connection loss and reconnection attempts
  - Requires: Task 2.2 (port interface)
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

- [ ] 6.2 Write unit tests for the IPC notification adapter
  - Test that PAD-type notifications are correctly parsed into action and instance identifier
  - Test that non-PAD notifications are filtered out
  - Test that connection state changes are reported correctly
  - Test reconnection behavior on connection loss
  - _Requirements: 2.1, 3.1_

- [ ] 7. Implement the child process management adapter
- [ ] 7.1 Implement the OS child process adapter
  - Implement the process management port using the platform's child process API
  - Launch interpreter processes with the correct argument list: script path, localhost address, TCP port, prefixed instance identifier
  - Capture standard error output for crash and error diagnostics
  - Detect normal vs. abnormal termination and report lifecycle events with exit details
  - Handle process signal delivery for termination requests
  - Requires: Task 2.3 (port interface)
  - _Requirements: 4.1, 5.1, 6.1, 6.2_

- [ ] 7.2 Write unit tests for the child process adapter
  - Test that process launch assembles the correct command and arguments
  - Test that standard error capture works for error reporting
  - Test that normal and abnormal termination are correctly distinguished
  - Test that process termination signals are delivered correctly
  - _Requirements: 4.1, 6.1_

- [ ] 8. Integration testing and daemon entry point
- [ ] 8.1 Wire the composition root and daemon entry point
  - Create the daemon main entry point that instantiates all adapters and injects them into the services
  - Parse command-line arguments (station name, configuration)
  - Connect the IPC adapter, status repository, and process adapter to the Main Controller and Process Manager
  - Ensure the application event loop runs until shutdown is triggered
  - Reject unknown command-line options with exit code 2
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.4_

- [ ] 8.2 Write integration tests for the complete daemon lifecycle
  - Test the full startup sequence: framework initialization, privilege drop, IPC connection, state reset, script start
  - Test add/delete/modify notifications trigger the expected process lifecycle operations
  - Test auto-restart on clean script exit with the complete adapter stack
  - Test crash recording with real process exit status and captured error output
  - Test graceful shutdown terminates all processes and cleans up database state
  - Use a test harness with in-memory database and mock IPC/process adapters
  - _Requirements: 1.1, 1.4, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 5.1, 6.1, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3_

- [ ] 8.3* Write integration tests for IPC reconnection and concurrent script management
  - Test that IPC reconnection triggers full state reset and restart of all scripts
  - Test that multiple scripts run independently with isolated lifecycle tracking
  - Test that rapid add/delete/modify sequences are handled correctly without race conditions
  - _Requirements: 2.1, 2.2, 4.3, 8.3_
