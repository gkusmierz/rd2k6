# Requirements Document

## Introduction

The Virtual Airplay Daemon (VAD) is a headless background service within the Rivendell radio automation system. It manages up to 20 "virtual" log playback machines (numbered 101-120) that operate without a graphical user interface. The daemon receives remote macro commands over an inter-process communication (IPC) connection and delegates playback operations to log playback engines. It supports crash recovery by tracking exit state and resuming playback from the last known position after an unclean shutdown.

This daemon is intended for broadcast environments where automated, unattended log playback is required across multiple virtual channels simultaneously.

## Requirements

### Requirement 1: Daemon Lifecycle Management

**Objective:** As a system administrator, I want the virtual airplay daemon to start, initialize, and shut down cleanly, so that virtual log machines are reliably available for automated playback.

#### Acceptance Criteria

1. When the daemon starts, the system shall initialize the application context, connect to the audio engine service, and connect to the IPC service.
2. When the daemon starts, the system shall create 20 virtual log playback engine instances (log machines 101 through 120).
3. When the daemon starts, the system shall register operating system signal handlers for graceful termination.
4. When a termination signal is received, the system shall set an internal shutdown flag and begin a clean shutdown sequence.
5. When the shutdown sequence executes, the system shall release all 20 log playback engine instances and record a clean exit code in the configuration store.
6. When the daemon starts, the system shall immediately record a dirty exit code in the configuration store to enable crash detection on subsequent startups.

### Requirement 2: Startup Log Loading and Crash Recovery

**Objective:** As a broadcast engineer, I want the daemon to resume playback from where it left off after a crash, so that broadcast continuity is maintained even after unexpected failures.

#### Acceptance Criteria

1. When the IPC connection is established and the start mode is "start previous", the system shall load the previously-playing log (with date/time macro expansion) into the corresponding log machine.
2. When the IPC connection is established and the start mode is "start previous" and the previous exit was dirty, the system shall restore the saved line position and auto-start playback if auto-restart is enabled.
3. When the IPC connection is established and the start mode is "start previous" and the previous exit was clean, the system shall start from line 0 without auto-starting playback.
4. When the IPC connection is established and the start mode is "start specified", the system shall load the configured log name (with date/time macro expansion).
5. When the IPC connection is established and the start mode is "start specified" and the previous exit was dirty and the specified log matches the previously-playing log, the system shall restore the saved line position.
6. If the referenced log does not exist in the database, then the system shall log a warning message and skip loading that log.
7. When the start mode is "start empty", the system shall not load any log on startup.

### Requirement 3: Log Machine Index Validation

**Objective:** As a system operator, I want invalid log machine addresses to be rejected, so that commands only affect valid virtual log machines.

#### Acceptance Criteria

1. If a remote command targets a log machine number outside the valid range (101-120), then the system shall reject the command with a negative acknowledgment.
2. When a remote command targets a valid log machine number (101-120), the system shall convert it to the corresponding internal index (0-19) and process the command.
3. When a remote command uses the special "all logs" address, the system shall apply the command to all 20 virtual log machines.

### Requirement 4: Log Loading and Unloading

**Objective:** As a broadcast automation system, I want to load, unload, and append logs into virtual log machines remotely, so that playlists can be managed without manual intervention.

#### Acceptance Criteria

1. When a Load Log command is received with one argument (machine only), the system shall clear and unload the log from that machine.
2. When a Load Log command is received with two arguments (machine and log name), the system shall verify the log exists and load it into the machine.
3. If a Load Log command references a log that does not exist, then the system shall reject the command with a negative acknowledgment.
4. When a Load Log command is received with three arguments and the start line parameter is -2, the system shall load the log and conditionally start playback based on the first scheduled event's transition type: start if the transition type is Play or Segue, do not start if the transition type is Stop or No Transition.
5. When an Append Log command is received, the system shall append the specified log content to the existing log in the target machine.
6. When a Refresh Log command is received, the system shall reload the log from the database for the target machine.

### Requirement 5: Playback Control

**Objective:** As a broadcast automation system, I want to control playback on virtual log machines remotely, so that audio playout can be started, stopped, and managed programmatically.

#### Acceptance Criteria

1. When a Play Next command is received, the system shall start playback of the next scheduled event on the target log machine.
2. When a Start command is received with a line number, the system shall start playback at the specified line on the target log machine.
3. When a Stop command is received targeting a specific machine, the system shall stop playback on that machine.
4. When a Stop command is received targeting a specific machine with a fade duration, the system shall stop playback with a fade-out over the specified duration.
5. When a Stop command is received targeting all log machines, the system shall stop playback on all 20 virtual log machines.
6. When a Make Next command is received, the system shall set the specified line as the next line to play on the target machine.

### Requirement 6: Cart Insertion

**Objective:** As a broadcast automation system, I want to insert audio carts into the play queue remotely, so that ad-hoc content can be scheduled into running logs.

#### Acceptance Criteria

1. When an Add Next command is received with a valid cart number (at most 999999), the system shall insert the cart at the next-play position on the target log machine.
2. If an Add Next command is received and no next line exists in the log, then the system shall append the cart at the end and designate it as the next event.
3. If an Add Next command specifies a cart number greater than 999999, then the system shall reject the command with a negative acknowledgment.

### Requirement 7: Operation Mode Control

**Objective:** As a broadcast engineer, I want to change the operation mode of virtual log machines remotely, so that playback behavior can be adjusted between automatic and manual control.

#### Acceptance Criteria

1. When a Set Mode command is received with a mode and a specific machine, the system shall set that machine to the specified mode (Automatic, Live Assist, or Manual).
2. When a Set Mode command is received with a mode and no machine specified, the system shall set all 20 virtual log machines to the specified mode.

### Requirement 8: Volume Control (Ducking)

**Objective:** As a broadcast automation system, I want to adjust the volume of virtual log machines remotely, so that audio ducking can be applied for voice-overs and announcements.

#### Acceptance Criteria

1. When a Duck Machine command is received with a machine, level (in dBFS), and duration, the system shall adjust the volume on the target log machine to the specified level over the specified duration.
2. When a Duck Machine command targets all log machines, the system shall adjust the volume on all 20 virtual log machines.
3. Where a specific line is included in the Duck Machine command, the system shall apply the volume adjustment only to that line.

### Requirement 9: Now/Next Notification Cart Configuration

**Objective:** As a broadcast engineer, I want to configure default "now playing" and "next up" notification carts remotely, so that external systems can be notified of what is currently airing.

#### Acceptance Criteria

1. When a Set Now/Next command is received with type "now", a machine, and a cart number (at most 999999), the system shall set the default "now playing" notification cart for that log machine.
2. When a Set Now/Next command is received with type "next", a machine, and a cart number (at most 999999), the system shall set the default "next up" notification cart for that log machine.

### Requirement 10: Audio Hardware Validation

**Objective:** As a system administrator, I want the daemon to validate audio hardware configuration at startup, so that log machines are not assigned to non-existent or unconfigured audio devices.

#### Acceptance Criteria

1. If a virtual log machine is configured with an audio card whose driver type is "None", then the system shall disable audio output for that log machine (set card and port to disabled).
2. If a virtual log machine is configured with a port number that exceeds the audio card's available output count, then the system shall disable audio output for that log machine.
3. Where audio output is disabled for a log machine, the system shall still accept and process remote commands for that machine.
