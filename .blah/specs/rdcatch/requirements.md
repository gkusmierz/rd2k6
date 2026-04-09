# Requirements Document

## Introduction

RDCatch is the scheduled event management application for the Rivendell radio automation system. It provides broadcast operators with a centralized interface for creating, monitoring, and managing time-based automation events including audio recordings, playouts, file downloads, file uploads, macro cart execution, and audio switcher routing. The application connects to one or more catch daemons on remote stations and provides real-time deck status monitoring, audio level metering, and event audition capabilities.

## Requirements

### Requirement 1: Event List Management

**Objective:** As a broadcast operator, I want to view and manage all scheduled automation events in a central list, so that I can maintain oversight of all station automation activities.

#### Acceptance Criteria
1. The system shall display a scrollable list of all scheduled events with columns for description, location (station and deck), start time, end time, source, destination, day-of-week indicators, feed name, origin, one-shot flag, audio settings, and status.
2. When the operator selects an event and clicks Edit (or double-clicks a row), the system shall open the appropriate event editor dialog based on the event type.
3. When the operator clicks Add, the system shall present a dialog allowing selection of the event type (Recording, Playout, Download, Upload, Macro Cart, or Switch Event).
4. When the operator clicks Delete, the system shall display a confirmation dialog asking "Are you sure you want to delete event [description]?" and delete the event only if confirmed.
5. If the operator attempts to edit an event that is currently active (recording, playing, downloading, uploading, or waiting), then the system shall display an information dialog stating "You cannot edit an active event!" and cancel the edit action.
6. The system shall color-code event rows based on their current status: white for idle, cyan for ready, green for active, yellow for next scheduled, magenta for waiting for trigger, and pink for error.

### Requirement 2: Event Filtering

**Objective:** As a broadcast operator, I want to filter the event list by multiple criteria, so that I can quickly find relevant events among a large schedule.

#### Acceptance Criteria
1. Where the "Show Only Active Events" filter is enabled, the system shall display only events marked as active.
2. Where the "Show Only Today's Events" filter is enabled, the system shall display only events scheduled for the current day of week.
3. When the operator selects a day-of-week filter (All Days, Weekdays, or a specific day), the system shall show only events matching that day selection.
4. When the operator selects an event type filter (All Types, Recording, Playout, Download, Upload, Macro, or Switch), the system shall show only events of the selected type.
5. The system shall apply all active filters using AND logic, combining them to narrow the displayed results.

### Requirement 3: Recording Event Configuration

**Objective:** As a broadcast operator, I want to configure timed audio recording events with flexible start/end triggers, so that I can automate scheduled audio capture.

#### Acceptance Criteria
1. The system shall allow selection of a station and recording deck for the event.
2. The system shall support two start trigger types: hard start (exact time) and GPI start (wait for external trigger within a time window).
3. The system shall support three end trigger types: fixed length, hard end (exact time), and GPI end (wait for external trigger within a window).
4. When the operator configures a GPI-triggered recording and the start window end time is before the start window begin time, the system shall display a warning "The start GPI window cannot end before it begins!"
5. When the operator configures a hard-start, hard-end recording and the end time is before or equal to the start time, the system shall display a warning "The recording cannot end before it begins!"
6. If no record cut has been assigned when the operator clicks OK, then the system shall display a warning "You must assign a record cut!" and keep the dialog open.
7. If a GPI matrix or GPI line specified does not exist, then the system shall display an appropriate warning and reject the save.
8. The system shall allow configuration of audio source, channel count (mono/stereo), auto-trim level, normalization level, day-of-week schedule, active flag, one-shot flag, and multiple recordings permission.

### Requirement 4: Download Event Configuration

**Objective:** As a broadcast operator, I want to schedule file downloads from remote servers, so that I can automate content acquisition from external sources.

#### Acceptance Criteria
1. The system shall allow configuration of a station, start time, description, download URL, authentication credentials (username and password), and destination cart/cut.
2. If the URL is relative or ends with "/", then the system shall display a warning "The URL is invalid!"
3. If the URL protocol is not one of ftp, ftps, http, https, file, scp, or sftp, then the system shall display a warning "Unsupported URL protocol!"
4. If a file:// protocol URL is used and no username is specified, then the system shall display a warning "You must specify a username!"
5. The system shall allow configuration of channel count, auto-trim, normalization, day-of-week schedule, active flag, one-shot flag, metadata update flag, and event date offset.

### Requirement 5: Upload Event Configuration

**Objective:** As a broadcast operator, I want to schedule file uploads to remote servers with configurable audio export formats, so that I can automate content distribution.

#### Acceptance Criteria
1. The system shall allow configuration of a station, start time, description, source cart/cut, upload URL, authentication credentials, export audio format, and optional podcast feed association.
2. If the URL is relative or ends with "/", then the system shall display a warning "The URL is invalid!"
3. If the URL protocol is not one of ftp, ftps, file, scp, or sftp, then the system shall display a warning "Unsupported URL protocol!"
4. If a file:// protocol URL is used and no username is specified, then the system shall display a warning "You must specify a username!"
5. If the selected export format is not supported on the target host, then the system shall display a warning "The currently selected export format is unsupported on host [hostname]!"
6. The system shall allow configuration of normalization, day-of-week schedule, active flag, one-shot flag, metadata update flag, and event date offset.

### Requirement 6: Playout Event Configuration

**Objective:** As a broadcast operator, I want to schedule timed audio playout events, so that I can automate scheduled audio playback on specific decks.

#### Acceptance Criteria
1. The system shall allow selection of a station and playout deck for the event.
2. The system shall allow configuration of start time, description, destination cut, day-of-week schedule, active flag, and one-shot flag.
3. When the Add Event dialog is displayed and no playout decks are configured, the system shall disable the Playout button.

### Requirement 7: Switch Event Configuration

**Objective:** As a broadcast operator, I want to schedule audio switcher routing changes, so that I can automate signal path reconfiguration at specific times.

#### Acceptance Criteria
1. The system shall allow selection of a station and switch matrix from available matrices on that station.
2. The system shall populate input and output selectors based on the selected matrix configuration.
3. The system shall allow configuration of start time, description, input routing, output routing, day-of-week schedule, active flag, and one-shot flag.

### Requirement 8: Cart/Macro Event Configuration

**Objective:** As a broadcast operator, I want to schedule macro cart execution at specific times, so that I can automate complex sequences of system commands.

#### Acceptance Criteria
1. The system shall allow selection of a station, start time, description, and cart number.
2. If the specified cart does not exist in the system, then the system shall display an information dialog "That cart doesn't exist!" and reject the save.
3. The system shall allow configuration of day-of-week schedule, active flag, and one-shot flag.

### Requirement 9: Duplicate Event Prevention

**Objective:** As a broadcast operator, I want the system to prevent creation of duplicate events, so that scheduling conflicts are avoided.

#### Acceptance Criteria
1. When the operator saves any event and another event already exists with the same station, type, start time, and (for recording events) channel, the system shall display a warning "An event with these parameters already exists!" and reject the save.
2. The system shall apply duplicate checking on both Save and Save As New operations across all event types.

### Requirement 10: Real-Time Deck Monitoring

**Objective:** As a broadcast operator, I want to see real-time status of all recording and playout decks, so that I can monitor active automation operations.

#### Acceptance Criteria
1. The system shall display a deck monitor widget for each configured deck on each connected station.
2. While a deck is active, the system shall display the station name, channel, current status (Idle, Ready, Waiting, Recording, Offline), current cut information, and event description.
3. While a deck is recording or playing, the system shall display real-time left and right audio level meters.
4. When the operator clicks the Abort button on a deck monitor, the system shall abort the current recording on that deck.
5. When the operator clicks the Monitor button on a deck monitor, the system shall toggle audio monitoring for that deck.

### Requirement 11: Daemon Connectivity

**Objective:** As a broadcast operator, I want the application to maintain connections to all catch daemons and alert me to connectivity issues, so that I can ensure reliable automation operation.

#### Acceptance Criteria
1. When the application starts, the system shall establish connections to catch daemons on all configured stations.
2. If the application cannot initialize, then the system shall display a critical error dialog and exit.
3. If an unrecognized command line option is provided, then the system shall display a critical error showing the unknown option and exit.
4. If the connection to the IPC daemon fails, then the system shall display a warning "Unable to connect to ripcd!" and exit.
5. If the connection to the audio engine fails, then the system shall display a warning "Unable to connect to Core AudioEngine" and exit.
6. If a catch daemon heartbeat check times out, then the system shall display a warning "Control connection timed out to host [hostname]".

### Requirement 12: Event Audition

**Objective:** As a broadcast operator, I want to preview the audio of scheduled events, so that I can verify correct cut assignment before events execute.

#### Acceptance Criteria
1. When the operator selects an event and clicks the Head play button, the system shall play the beginning portion of the assigned cut.
2. When the operator selects an event and clicks the Tail play button, the system shall play the ending portion of the assigned cut.
3. While audition playback is active, the system shall disable the Head and Tail buttons.
4. When the operator clicks Stop, the system shall stop the current audition playback and re-enable the Head and Tail buttons.

### Requirement 13: Event Reports

**Objective:** As a broadcast operator, I want to generate reports of scheduled events, so that I can review and document the automation schedule.

#### Acceptance Criteria
1. When the operator clicks Reports, the system shall display a report selection dialog.
2. The system shall support generating an Event Report listing all events with type, description, station, start/end times, source, destination, day schedule, and status.
3. The system shall support generating an Upload/Download Report listing transfer events with URL, credentials, destination, and audio format details.
4. The system shall respect the current filter settings when generating reports (active-only and today-only flags, day of week).

### Requirement 14: Save As New

**Objective:** As a broadcast operator, I want to duplicate an existing event with modifications, so that I can quickly create similar events without re-entering all settings.

#### Acceptance Criteria
1. When the operator clicks Save As New in any event editor dialog, the system shall create a new event record with the current dialog settings.
2. The system shall apply the same validation rules (duplicate check, field validation) to Save As New as to regular Save operations.
