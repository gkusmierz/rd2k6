# Requirements Document

## Introduction

The Service Manager is a headless daemon responsible for supervising all other Rivendell system daemons and performing periodic maintenance tasks. It acts as the process supervisor for an entire Rivendell station: launching daemons in the correct order at startup, monitoring their lifecycle, managing file import dropbox processes, scheduling maintenance routines, and orchestrating graceful shutdown. It has no graphical interface and operates as a background system service.

The Service Manager depends on the core library (LIB) for application framework, database connectivity, process management, and station configuration.

## Requirements

### Requirement 1: Daemon Lifecycle Management

**Objective:** As a system administrator, I want the Service Manager to supervise all Rivendell daemons on this station, so that I can start and stop the entire station with a single service.

#### Acceptance Criteria

1. When the Service Manager starts, the system shall verify that no prior instance is already running and exit with an error if a duplicate is detected.
2. When the Service Manager starts, the system shall verify that the database is reachable and exit with an error if the connection cannot be established.
3. When the Service Manager starts, the system shall terminate all stale daemon processes from any previous crashed run before launching new instances.
4. When stale processes are detected for a daemon, the system shall send a forced kill signal and wait until the processes are confirmed terminated before proceeding.
5. When the Service Manager starts with no startup target override, the system shall launch daemons in the following strict order: audio engine, RPC/IPC daemon, recording scheduler, PAD data daemon, PAD engine daemon, virtual airplay daemon.
6. When the audio engine, RPC/IPC daemon, recording scheduler, and PAD data daemon have been launched, the system shall wait briefly before launching the remaining daemons to allow socket readiness.
7. When a startup target is specified via command-line option, the system shall stop the startup sequence after launching the specified daemon without launching the remaining daemons.
8. If a daemon fails to start, then the system shall log the error and exit immediately.
9. When the Service Manager has successfully launched all daemons, the system shall write a PID file to indicate it is running.
10. If the PID file cannot be written, then the system shall log a warning but continue operation.
11. When the Service Manager receives a termination signal (SIGTERM or SIGINT), the system shall initiate graceful shutdown within 100 milliseconds.
12. When graceful shutdown is initiated, the system shall first stop all dropbox processes, then terminate daemon processes in reverse startup order.
13. When a daemon does not respond to a termination request during shutdown, the system shall force-kill the unresponsive daemon.
14. When all processes have been terminated during shutdown, the system shall delete the PID file and exit cleanly.

### Requirement 2: Dropbox Process Management

**Objective:** As a system administrator, I want the Service Manager to automatically launch and manage file import processes based on database configuration, so that configured dropbox directories are continuously monitored for incoming files.

#### Acceptance Criteria

1. When the Service Manager completes daemon startup, the system shall query the database for all dropbox configurations assigned to this station.
2. When dropbox configurations are found, the system shall launch one file import process per configured dropbox with the appropriate parameters.
3. When a dropbox configuration includes normalization level, autotrim level, date offsets, metadata patterns, or other import options, the system shall pass each configured option to the file import process.
4. When a dropbox has associated scheduler codes in the database, the system shall include those codes as parameters to the file import process.
5. If a dropbox import process fails to start, then the system shall log the error and exit.
6. When the Service Manager receives a reload signal (SIGUSR1), the system shall stop all currently running dropbox processes.
7. When dropbox processes have been stopped after a reload signal, the system shall re-query the database for current dropbox configurations and launch new import processes accordingly.
8. When dropbox reload is complete, the system shall re-install the reload signal handler to allow subsequent reloads.

### Requirement 3: Conditional Daemon Launching

**Objective:** As a system administrator, I want certain daemons to launch only when their corresponding features are configured for this station, so that unnecessary processes are not started.

#### Acceptance Criteria

1. When startup reaches the replication daemon phase, the system shall query the database for replicator configurations assigned to this station.
2. If replicator configurations exist for this station, then the system shall launch the replication daemon.
3. If no replicator configurations exist for this station, then the system shall skip launching the replication daemon.
4. When startup reaches the RSS daemon phase, the system shall query the database for the designated RSS processor station.
5. If this station is the designated RSS processor (case-insensitive comparison), then the system shall launch the RSS daemon.
6. If this station is not the designated RSS processor, then the system shall skip launching the RSS daemon.

### Requirement 4: Maintenance Scheduling

**Objective:** As a system administrator, I want the Service Manager to periodically run maintenance routines, so that the system stays healthy without manual intervention.

#### Acceptance Criteria

1. When the Service Manager starts and maintenance checks are enabled in the configuration, the system shall schedule the first maintenance check at a random interval between 15 and 60 minutes.
2. If maintenance checks are disabled in the configuration, then the system shall not start the maintenance timer and shall log that maintenance checks are disabled on this host.
3. When a maintenance check fires, the system shall reschedule the next check at a new random interval between 15 and 60 minutes.
4. When a maintenance check fires, the system shall run local maintenance as an ephemeral process.
5. When a maintenance check fires and system-wide maintenance is enabled for this station, the system shall check the last system maintenance timestamp in the database using an exclusive table lock for concurrency control.
6. When more than 60 minutes have elapsed since the last system maintenance, the system shall run system-wide maintenance as an ephemeral process.
7. When the --force-system-maintenance command-line option is specified, the system shall run system-wide maintenance on the first maintenance check regardless of the time threshold.
8. When forced system maintenance has been executed, the system shall clear the force flag so that subsequent checks use the normal time threshold.
9. Where an initial maintenance interval override is specified via command-line option, the system shall use the specified interval for the first maintenance delay instead of a random interval.

### Requirement 5: Ephemeral Process Management

**Objective:** As a system administrator, I want maintenance and other short-lived processes to be properly tracked and their outcomes logged, so that I can diagnose issues from the system log.

#### Acceptance Criteria

1. When an ephemeral process is started, the system shall register it in the process map and monitor its completion.
2. If an ephemeral process fails to start, then the system shall log a warning with the error details and remove the process from the process map.
3. When an ephemeral process crashes (non-normal termination), the system shall log a warning indicating the process crashed.
4. When an ephemeral process exits with a non-zero exit code, the system shall log a warning with the exit code.
5. When an ephemeral process completes (regardless of outcome), the system shall remove it from the process map.

### Requirement 6: Signal Handling and Event Loop Integration

**Objective:** As a system operator, I want the Service Manager to respond to operating system signals for shutdown and configuration reload, so that I can control the service using standard system administration tools.

#### Acceptance Criteria

1. The system shall handle SIGTERM and SIGINT signals by setting an internal exit flag.
2. The system shall handle SIGUSR1 signals by setting an internal dropbox reload flag.
3. The system shall poll the exit and reload flags at a 100-millisecond interval to bridge OS signal handling into the application event loop.
4. When the exit flag is detected, the system shall invoke the shutdown procedure.
5. When the reload flag is detected, the system shall invoke the dropbox reload procedure and then clear the flag.
6. If an unknown command-line option is provided, then the system shall print an error to standard error and exit.
7. If the --initial-maintenance-interval option has a non-integer value, then the system shall print an error and exit.
