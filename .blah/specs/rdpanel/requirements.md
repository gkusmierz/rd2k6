# Requirements Document

## Introduction

RDPanel is a standalone sound panel application within the Rivendell radio automation platform. It provides broadcast operators with a grid of configurable buttons for instant audio playback during live-assist or automated broadcasts. The application connects to the central audio engine and inter-process communication services, displays real-time audio level metering, and supports multiple panel pages with both station-wide and per-user button assignments. It is a lightweight, single-purpose tool focused exclusively on panel-based cart triggering.

## Requirements

### Requirement 1: Application Startup and Initialization
**Objective:** As a broadcast operator, I want the panel application to start reliably and connect to all required services, so that I can begin triggering audio immediately.

#### Acceptance Criteria
1. When the application starts, the system shall open a database connection, load station configuration, and establish connections to the audio engine and inter-process communication service.
2. If the application framework cannot initialize (database unavailable, configuration missing), then the system shall display a critical error dialog with the error message and terminate with a non-zero exit code.
3. If an unrecognized command-line option is provided, then the system shall display a critical error dialog showing the unknown option and terminate with a non-zero exit code.
4. When the application starts successfully, the system shall set the window title to include the application version, station name, and current user name.
5. When the audio engine connection is established, the system shall enable audio level metering on all configured output channels.
6. When a user change event is received from the inter-process communication service, the system shall update the window title with the new user name and send the on-air flag.

### Requirement 2: Sound Panel Display and Configuration
**Objective:** As a broadcast operator, I want a grid of sound panel buttons loaded from my station and personal configuration, so that I can trigger audio carts with a single click.

#### Acceptance Criteria
1. When station panels or user panels are configured (count greater than 0), the system shall create a sound panel widget with a 9-column by 7-row button grid.
2. When the sound panel is created, the system shall configure up to 5 audio output channels based on the panel audio configuration.
3. Where a sound panel channel (2 through 5) is not explicitly configured (card value less than 0), the system shall fall back to alternative channel assignments: channel 2 to main log 1 channel, channel 3 to main log 2 channel, channel 4 to sound panel 1 channel, and channel 5 to cue channel.
4. When the panel configuration includes start and stop macro strings for each channel, the system shall assign those macros to the corresponding sound panel output channels.
5. When a user change event is received, the system shall reload the sound panel to reflect the new user's panel button assignments.

### Requirement 3: Audio Level Metering
**Objective:** As a broadcast operator, I want to see real-time audio levels for all active output channels, so that I can monitor output quality during playback.

#### Acceptance Criteria
1. The system shall poll audio output levels at 50-millisecond intervals from the audio engine.
2. When multiple output channels share the same audio card and port, the system shall meter only the first occurrence and suppress duplicate metering to avoid double-counting audio levels.
3. When audio level data is received, the system shall aggregate power ratios across all valid outputs and update the stereo meter display with left and right peak values in decibels.
4. When assigning fader display numbers, the system shall give unique card and port combinations sequential numbers starting from 1 and assign duplicate combinations the number of their first occurrence.

### Requirement 4: Panel Navigation
**Objective:** As a broadcast operator, I want to quickly navigate between panel pages, so that I can access different sets of sound buttons without delay.

#### Acceptance Criteria
1. When the user scrolls the mouse wheel up on the main window, the system shall navigate to the previous panel page.
2. When the user scrolls the mouse wheel down on the main window, the system shall navigate to the next panel page.

### Requirement 5: Visual Customization
**Objective:** As a station administrator, I want to apply a custom skin to the panel application, so that it matches the station's branding.

#### Acceptance Criteria
1. Where a skin path is configured in the panel configuration, the system shall attempt to load the skin image.
2. When the skin image loads successfully and is at least 1024 by 738 pixels, the system shall apply it as the window background.
3. If the skin image is null or smaller than the required dimensions, then the system shall use the default window background.

### Requirement 6: Drag-and-Drop Cart Assignment
**Objective:** As a broadcast operator, I want to drag carts onto panel buttons, so that I can quickly reassign buttons during a broadcast.

#### Acceptance Criteria
1. Where the station has drag-and-drop enabled, the system shall display an empty cart widget for drag-and-drop operations.
2. If the station has drag-and-drop disabled, then the system shall hide the empty cart widget.

### Requirement 7: Remote Macro Language Support
**Objective:** As a system integrator, I want the panel application to receive and process remote macro commands, so that external systems can control panel behavior.

#### Acceptance Criteria
1. When a remote macro command is received from the inter-process communication service, the system shall delegate the command to the local macro handler.

### Requirement 8: Application Shutdown
**Objective:** As a broadcast operator, I want the application to close cleanly, so that no database connections or resources are leaked.

#### Acceptance Criteria
1. When the user closes the panel window, the system shall remove the database connection and terminate with exit code 0.
