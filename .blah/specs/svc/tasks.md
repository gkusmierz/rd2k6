# Implementation Plan

- [ ] 1. Process map and child process lifecycle tracking
- [ ] 1.1 (P) Define the domain model for managed process slots and lifecycle states
  - Establish numeric slot identifiers for daemon processes (slots 0-10) and dropbox processes (slots 100+)
  - Define process lifecycle states: not started, running, finished, crashed
  - Model the process map as a container that tracks active child processes by slot ID
  - Provide lookup, insertion, removal, and iteration over tracked processes
  - _Requirements: 1.3, 1.4, 1.12, 2.2, 5.1, 5.5_

- [ ] 1.2 (P) Implement process finished event handling with crash and error logging
  - When a tracked process terminates, determine the exit reason (normal, crash, non-zero exit code)
  - Log a warning when a process crashes with non-normal termination
  - Log a warning with the exit code when a process exits with a non-zero code
  - Remove the process from the map after handling its completion
  - Ensure slot cleanup completes before the slot can be reused
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ] 1.3 Implement process launch, termination, and force-kill capabilities
  - Provide the ability to start a child process with a given executable path and argument list, registering it in a specific slot
  - Provide graceful termination request for a tracked process
  - Provide forced kill for unresponsive processes that do not terminate after a graceful request
  - Detect and report launch failures (process fails to start) so callers can handle the error
  - _Requirements: 1.5, 1.8, 1.13, 2.5, 5.1, 5.2_

- [ ] 2. Signal bridge: OS signal handling bridged to the event loop
- [ ] 2.1 (P) Install OS signal handlers and implement flag-based signal bridge
  - Install handlers for SIGTERM, SIGINT, and SIGUSR1 using async-signal-safe flag setting
  - Set an internal exit flag when SIGTERM or SIGINT is received
  - Set an internal reload flag when SIGUSR1 is received
  - Start a 100-millisecond polling timer that checks both flags each tick
  - When the exit flag is detected, invoke the shutdown procedure
  - When the reload flag is detected, invoke the dropbox reload procedure and then clear the flag
  - Re-install the SIGUSR1 handler after each invocation to support platforms that reset handlers
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 3. Startup sequencer: ordered daemon launching with stale process cleanup
- [ ] 3.1 Implement stale process detection and cleanup before daemon launch
  - Before launching each daemon, query the system for any leftover processes from a previous crashed run
  - Send a forced kill signal to each stale process found
  - Wait until the stale processes are confirmed terminated before proceeding to launch
  - Repeat the check-and-kill cycle until no matching stale processes remain
  - _Requirements: 1.3, 1.4_

- [ ] 3.2 Implement the ordered daemon startup sequence
  - Launch daemons in strict fixed order: audio engine, RPC/IPC daemon, recording scheduler, PAD data daemon
  - After the first batch, insert a brief delay to allow socket readiness before launching the next batch
  - Launch the second batch: PAD engine daemon, virtual airplay daemon
  - Register each launched daemon in the process map at the appropriate slot
  - If any daemon fails to start, log the error and exit immediately
  - _Requirements: 1.5, 1.6, 1.8_

- [ ] 3.3 Implement startup target support for partial startup
  - Accept an optional startup target from command-line arguments
  - When a target is specified, stop the startup sequence after the target daemon has been launched
  - When no target is specified, continue through the full startup sequence including conditional daemons and dropboxes
  - _Requirements: 1.7_

- [ ] 3.4 Implement conditional daemon launching based on database configuration
  - After the core daemon sequence completes, query the database for replicator configurations assigned to this station
  - Launch the replication daemon only if replicator configurations exist; skip it otherwise
  - Query the database for the designated RSS processor station
  - Launch the RSS daemon only if this station matches the RSS processor (case-insensitive comparison); skip it otherwise
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 4. Dropbox process management with hot-reload capability
- [ ] 4.1 Implement dropbox configuration loading and process launching
  - After daemon startup completes, query the database for all dropbox configurations assigned to this station
  - For each dropbox, launch one file import process with all configured parameters: normalization level, autotrim level, date offsets, metadata patterns, cart chunk ID options, delete source/cuts flags, logging options, mono forcing, segue settings, and email notifications
  - Query associated scheduler codes for each dropbox and include them as parameters
  - Use dropbox slot numbering starting at slot 100 to separate from daemon slots
  - If a dropbox process fails to start, log the error and exit
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4.2 Implement dropbox hot-reload triggered by SIGUSR1
  - When the reload signal is received, stop all currently running dropbox processes
  - After all dropbox processes have stopped, re-query the database for the current dropbox configurations
  - Launch new import processes according to the refreshed configuration
  - Re-install the reload signal handler to allow subsequent reloads
  - _Requirements: 2.6, 2.7, 2.8_

- [ ] 5. Maintenance scheduling with local and system-wide routines
- [ ] 5.1 Implement the maintenance timer with randomized intervals
  - When maintenance checks are enabled in the station configuration, schedule the first check at a random interval between 15 and 60 minutes
  - When maintenance checks are disabled, log that maintenance is disabled on this host and do not start the timer
  - When an initial interval override is provided via command-line, use the specified value for the first delay instead of a random one
  - Each time a maintenance check fires, reschedule the next check at a new random interval between 15 and 60 minutes
  - _Requirements: 4.1, 4.2, 4.3, 4.9_

- [ ] 5.2 Implement local and system-wide maintenance execution
  - On each maintenance check, run local maintenance by launching the maintenance utility as an ephemeral process
  - When system-wide maintenance is enabled for this station, acquire an exclusive lock on the version table and read the last system maintenance timestamp
  - If more than 60 minutes have elapsed since the last system maintenance, run system-wide maintenance as an ephemeral process
  - When the force-system-maintenance flag is active, run system-wide maintenance on the first check regardless of the time threshold
  - After forced maintenance executes, clear the force flag so subsequent checks use the normal time threshold
  - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8_

- [ ] 6. Service manager coordinator: initialization, PID management, and shutdown
- [ ] 6.1 Implement service initialization and duplicate instance detection
  - Open the application framework and establish a database connection at startup
  - Verify that the database is reachable; exit with an error if the connection fails
  - Check for a prior running instance; exit with an error if a duplicate is detected
  - Parse command-line options: startup target, force-system-maintenance, initial-maintenance-interval
  - Reject unknown command-line options by printing an error to standard error and exiting
  - Reject non-integer values for the initial-maintenance-interval option with an appropriate error message
  - _Requirements: 1.1, 1.2, 6.6, 6.7_

- [ ] 6.2 Implement PID file management
  - After all daemons have been successfully launched, write a PID file to indicate the service is running
  - If the PID file cannot be written, log a warning but continue operation
  - During shutdown, delete the PID file before final exit
  - _Requirements: 1.9, 1.10, 1.14_

- [ ] 6.3 Implement graceful shutdown with reverse-order daemon termination
  - When the exit flag is detected, initiate shutdown within the next signal poll tick (100ms)
  - Stop all dropbox processes first
  - Terminate daemon processes in reverse startup order
  - Force-kill any daemon that does not respond to the termination request
  - After all processes are terminated, delete the PID file and exit cleanly
  - _Requirements: 1.11, 1.12, 1.13, 1.14_

- [ ] 7. Integration wiring and end-to-end startup flow
- [ ] 7.1 Wire all components together in the application composition root
  - Instantiate the process map, signal bridge, startup sequencer, dropbox manager, and maintenance scheduler
  - Connect the signal bridge exit event to the service manager shutdown procedure
  - Connect the signal bridge reload event to the dropbox manager reload procedure
  - Connect process finished events from the process map to the appropriate logging and cleanup handlers
  - Execute the full startup flow: initialization, stale cleanup, daemon startup, dropbox launch, maintenance timer start, PID file write, enter event loop
  - _Requirements: 1.1, 1.2, 1.5, 1.9, 2.1, 4.1, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 8. Testing
- [ ] 8.1 (P) Unit tests for process map and ephemeral process handling
  - Verify process slot registration and removal on completion
  - Verify crash, non-zero exit, and normal exit are logged with appropriate severity
  - Verify stale process cleanup loop continues until no matching processes remain
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8.2 (P) Unit tests for startup sequencer and conditional launching
  - Verify daemons are launched in the correct strict order
  - Verify partial startup stops at the specified target daemon
  - Verify replication daemon launches only when replicator configurations exist
  - Verify RSS daemon launches only when this station is the designated processor (case-insensitive)
  - _Requirements: 1.5, 1.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 8.3 (P) Unit tests for maintenance scheduling
  - Verify random interval generation always falls between 15 and 60 minutes
  - Verify timer reschedules after each maintenance check
  - Verify system maintenance runs only when elapsed time exceeds 60 minutes
  - Verify forced maintenance flag triggers on first check and clears afterward
  - _Requirements: 4.1, 4.3, 4.5, 4.6, 4.7, 4.8_

- [ ] 8.4 (P) Unit tests for dropbox parameter construction
  - Verify each dropbox configuration field maps to the correct import process argument
  - Verify scheduler codes are included as parameters for each dropbox
  - _Requirements: 2.2, 2.3, 2.4_

- [ ] 8.5 Integration tests for full lifecycle scenarios
  - Test full startup and graceful shutdown: verify daemons launched in order, SIGTERM triggers reverse-order shutdown
  - Test dropbox reload via SIGUSR1: verify old processes stop and new processes launch from refreshed configuration
  - Test duplicate instance prevention: verify second instance exits with error
  - Test forced system maintenance: verify system maintenance runs on first check regardless of timestamp
  - _Requirements: 1.1, 1.5, 1.11, 1.12, 1.14, 2.6, 2.7, 4.7_
