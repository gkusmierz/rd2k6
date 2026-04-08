# Requirements Document

## Introduction

The Airplay module is the on-air playout application for the Rivendell radio automation system. It provides real-time audio playout from broadcast logs, supporting multiple log machines (Main Log, Aux 1, Aux 2) and a sound panel for instant audio playback. The application operates in three modes (Manual, Automatic, Live Assist) and can be controlled locally via the user interface, by keyboard shortcuts, or remotely via RML (Rivendell Macro Language) commands and GPI (General Purpose Input) triggers. It is designed for continuous, mission-critical on-air use in broadcast environments.

## Requirements

### Requirement 1: Application Lifecycle

**Objective:** As a broadcast operator, I want the playout application to start reliably and prevent accidental shutdowns, so that on-air continuity is maintained.

#### Acceptance Criteria

1. When a second instance of the playout application starts on the same station, the system shall display an error message indicating that multiple instances are not allowed and terminate the second instance.
2. When the application starts, the system shall connect to the audio engine and the inter-process communication daemon before becoming operational.
3. If the application fails to initialize (database connection failure, configuration error), then the system shall display an error message describing the failure and terminate.
4. If an unrecognized command-line option is provided, then the system shall display an error message identifying the unknown option and terminate.
5. Where memory locking is configured but the operating system refuses the lock, the system shall display a warning and continue operating.
6. When the user attempts to close the application and an exit password is configured, the system shall require the correct password before allowing shutdown.
7. When the user attempts to close the application and no exit password is configured, the system shall display a confirmation dialog requiring explicit approval before shutdown.

### Requirement 2: Log Playout

**Objective:** As a broadcast operator, I want to play audio items from a broadcast log in sequence, so that programming airs on schedule.

#### Acceptance Criteria

1. When the operator presses the Play button on a log machine, the system shall start playback of the selected or next item and update the transport display.
2. When the operator presses the Stop button on a playing item, the system shall stop playback and update the transport display.
3. Where pause is enabled, when the operator presses Pause during playback, the system shall suspend playback at the current position.
4. While the system is in Automatic mode, when the current item finishes playing, the system shall automatically start the next item in the log.
5. While the system is in Manual mode, the system shall require the operator to press Play for each item.
6. While the system is in Live Assist mode, the system shall automatically execute transitions between items while allowing the operator to override playback manually.
7. When the operating mode is changed (via the mode button or a remote command), the system shall update the mode display indicator and adjust playout behavior accordingly.
8. When a log item starts playing, the system shall update the pie chart countdown with the item duration, talk time markers, and transition type.

### Requirement 3: Log Management

**Objective:** As a broadcast operator, I want to load, save, and switch between broadcast logs, so that I can manage daily programming.

#### Acceptance Criteria

1. When the operator opens the log selection dialog, the system shall display a filterable list of available logs with name, description, and service columns.
2. The system shall filter available logs by date range, active status, and service permissions for the current station.
3. When the operator selects a log and clicks Load, the system shall load the log into the active log machine and display its contents.
4. When the operator clicks Save, the system shall persist the current log state to the database.
5. If the operator attempts to save a log that has not been refreshed after external changes, then the system shall display a warning and prevent the save until the log is refreshed.
6. If another user has locked the log, then the system shall display a warning identifying the locking user and station and prevent the save operation.
7. When the operator clicks Unload, the system shall remove the current log from the active log machine.
8. When the application starts, the system shall load the startup log according to the configured start mode (empty, previous, or specified log name).
9. Where the start mode is set to "previous" and the previous session ended abnormally, the system shall resume at the saved position and optionally auto-start playback.

### Requirement 4: Sound Panel

**Objective:** As a broadcast operator, I want instant-access buttons for frequently used audio, so that I can trigger sound effects, jingles, and stingers with a single action.

#### Acceptance Criteria

1. The system shall display a grid of buttons, each representing a loaded audio cart with its title and timing information.
2. When the operator clicks a sound panel button, the system shall start playback of the associated audio cart.
3. When the operator double-clicks a sound panel button, the system shall open the event properties dialog for that button.
4. When the operator drags a cart onto a sound panel button, the system shall assign the cart to that button.
5. When sound panel playback starts, the system shall publish a channel-started event to the main application.
6. When sound panel playback stops, the system shall publish a channel-stopped event to the main application.

### Requirement 5: Log Editing

**Objective:** As a broadcast operator, I want to modify the running log during a broadcast, so that I can respond to schedule changes in real time.

#### Acceptance Criteria

1. When the operator clicks Add and selects a cart, the system shall insert the cart at the selected position in the log.
2. When the operator clicks Delete and selects an item, the system shall remove the item from the log.
3. When the operator clicks Move, selects a source item, and then selects a destination, the system shall relocate the item within the log.
4. When the operator clicks Copy, selects a source item, and then selects a destination, the system shall duplicate the item at the destination position.
5. When the operator drags a cart from the cart browser onto a log line, the system shall insert or replace the cart at that position.
6. When the operator double-clicks a log line, the system shall open the event properties dialog for that item.
7. When the operator modifies event properties (hard start time, transition type, grace time, overlap), the system shall update the log line and recalculate affected timing.
8. If the operator sets a hard start time that conflicts with an existing scheduled event, then the system shall display a warning and prevent the duplicate scheduling.

### Requirement 6: Timing and Display

**Objective:** As a broadcast operator, I want real-time timing information and status indicators, so that I can maintain precise on-air timing.

#### Acceptance Criteria

1. The system shall display the current time of day, updated every 100 milliseconds.
2. When the operator clicks the clock display, the system shall toggle between 12-hour and 24-hour time formats.
3. While an item is playing, the system shall display a pie chart countdown showing remaining time, with talk start and talk end markers.
4. While an item is playing, the system shall display the post-point countdown indicating whether the broadcast is early, on-time, or late (with color coding).
5. The system shall display the next stop time based on the current log position.
6. The system shall display the current operating mode for the active log machine.
7. The system shall display real-time audio level meters in peak mode.
8. The system shall display an hour selector bar highlighting hours that contain scheduled events.
9. When the operator selects an hour on the hour selector, the system shall scroll the log view to the first event in that hour.

### Requirement 7: Remote Control

**Objective:** As a broadcast engineer, I want to control playout remotely via macro commands and hardware triggers, so that the system can be integrated with external automation.

#### Acceptance Criteria

1. When an RML macro command is received, the system shall execute the corresponding action (start, stop, load log, set mode, make next, and others as defined in the macro command set).
2. When a "Load Log" command is received with a log name and machine number, the system shall load the specified log into the designated log machine.
3. When a "Set Mode" command is received, the system shall change the operating mode of the specified log machine.
4. When a "Start" command is received with a machine and line number, the system shall begin playback at the specified position.
5. When a "Label" command is received, the system shall update the on-screen message display with the provided text.
6. When a GPI state change is detected on a configured input, the system shall trigger the associated channel play or stop action.
7. While a channel lockout interval is active after a GPI trigger, the system shall ignore subsequent GPI triggers on the same input to prevent rapid re-triggering.
8. When a "Select Widget" command is received, the system shall switch the visible view to the specified log machine or sound panel.
