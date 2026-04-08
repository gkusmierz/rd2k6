# Requirements Document

## Introduction

The PAD Engine Daemon is a headless background service responsible for managing the lifecycle of PAD (Program Associated Data) script instances. It runs as a managed child process launched by the Service Manager daemon. The daemon starts, stops, restarts, and monitors PAD script processes for a given station, tracking their runtime status in the database. It receives commands from the administration application via inter-process notifications relayed through the IPC daemon.

PAD scripts are external interpreter-based scripts that process program-associated data (e.g., now-playing metadata) and send it to external systems. The PAD Engine Daemon ensures these scripts remain running, handles crash recovery, and supports dynamic add/delete/modify operations triggered by administrators.

## Requirements

### Requirement 1: Secure Process Initialization

**Objective:** As a system administrator, I want the PAD engine daemon to drop elevated privileges on startup, so that PAD scripts run under a restricted user account for security.

#### Acceptance Criteria

1. When the daemon starts with elevated privileges, the daemon shall drop to the configured PAD service user and group identifiers.
2. If the privilege drop for the group identifier fails, then the daemon shall log an error and terminate with exit code 1.
3. If the privilege drop for the user identifier fails, then the daemon shall log an error and terminate with exit code 1.
4. When the daemon starts, the daemon shall open a connection to the application framework (database, configuration, logging).
5. If the application framework connection fails, then the daemon shall output an error message and terminate with exit code 1.

### Requirement 2: IPC Connection and State Reset

**Objective:** As a system operator, I want the daemon to reset all script states and restart them when the IPC connection is established, so that script status is always consistent with actual runtime state.

#### Acceptance Criteria

1. When the IPC connection is established, the daemon shall reset all PAD instance records for this station to not-running with exit code 0 and no error text.
2. When the IPC connection is established and instance records are reset, the daemon shall start all configured PAD script instances for this station.

### Requirement 3: Notification-Driven Script Management

**Objective:** As an administrator, I want to add, remove, and modify PAD script instances at runtime via the administration application, so that script configurations can be changed without restarting the daemon.

#### Acceptance Criteria

1. When an add-instance notification is received, the daemon shall verify the instance belongs to this station and start the script.
2. When a delete-instance notification is received, the daemon shall set the no-restart flag and terminate the running script process.
3. When a modify-instance notification is received and the script is currently active, the daemon shall terminate the script (allowing auto-restart to apply the changes).
4. When a modify-instance notification is received and the script is not currently active, the daemon shall start the script.

### Requirement 4: Script Process Lifecycle

**Objective:** As a system operator, I want PAD scripts to be launched with the correct arguments and tracked in the database, so that script status is always visible and scripts can communicate with the PAD data service.

#### Acceptance Criteria

1. When a script is started, the daemon shall launch the interpreter with the script path, localhost address, PAD client TCP port, and a prefixed instance identifier as arguments.
2. When a script process starts successfully, the daemon shall update the database record to running status.
3. The daemon shall maintain an in-memory map of instance identifiers to managed process objects for all currently tracked scripts.

### Requirement 5: Auto-Restart on Clean Exit

**Objective:** As a system operator, I want PAD scripts that exit cleanly to be automatically restarted, so that transient script terminations do not cause prolonged service outages.

#### Acceptance Criteria

1. When a script process exits normally with exit code 0 and the no-restart flag is not set, the daemon shall automatically restart the script.
2. When a script process exits normally with exit code 0 and the no-restart flag is set, the daemon shall not restart the script.

### Requirement 6: Crash and Error Handling

**Objective:** As a system operator, I want crashed or errored scripts to be recorded with diagnostic information, so that I can investigate and resolve issues.

#### Acceptance Criteria

1. If a script process crashes (non-normal termination), then the daemon shall log a warning, update the database with exit code -1 and the captured error output, and not restart the script.
2. If a script process exits normally with a non-zero exit code and the daemon is not shutting down, then the daemon shall log a warning with the exit code and update the database with the exit code and error output.

### Requirement 7: Graceful Shutdown

**Objective:** As a system administrator, I want the daemon to shut down gracefully when receiving a termination signal, so that all scripts are properly stopped and database state is consistent.

#### Acceptance Criteria

1. When a termination signal (interrupt or terminate) is received, the daemon shall initiate a graceful shutdown sequence within 100 milliseconds.
2. While shutting down, the daemon shall terminate all running script instances with the no-restart flag set.
3. When all instances have been terminated, the daemon shall update all database records for this station to not-running status.
4. When shutdown processing is complete, the daemon shall exit with code 0.

### Requirement 8: Script Status Tracking

**Objective:** As an administrator, I want script runtime status, exit codes, and error text persisted in the database, so that the administration application can display current and historical script state.

#### Acceptance Criteria

1. The daemon shall update the instance database record with running status when a script starts.
2. The daemon shall update the instance database record with not-running status, exit code, and error text when a script stops.
3. When the IPC connection is re-established, the daemon shall reset all instance records to not-running to clear stale state.
