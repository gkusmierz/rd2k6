# Requirements Document

## Introduction

RDLogEdit is the log editing application of the Rivendell broadcast automation system. It provides radio broadcast operators with the ability to create, edit, and manage broadcast logs -- ordered sequences of audio events (carts, markers, chains, voice tracks) that define a station's programming schedule. The application includes a voice tracking module for recording voice-over segments and a rendering engine for exporting logs to audio files. It depends on the core library (LIB) for data access, audio playback, and inter-client communication.

## Requirements

### Requirement 1: Log List Management

**Objective:** As a broadcast operator, I want to browse, filter, and manage my broadcast logs, so that I can quickly find and organize programming schedules.

#### Acceptance Criteria

1. The system shall display all available logs in a tabular list showing name, description, service, music link status, traffic link status, voice track progress, validity dates, auto-refresh flag, origin info, last linked date, and last modified date.
2. When the user types in the filter bar, the system shall filter the log list to show only matching entries.
3. When the user selects a service filter, the system shall restrict the list to logs belonging to that service.
4. When the user clicks "Add", the system shall create a new broadcast log and open it for editing.
5. When the user selects a log and clicks "Edit" or double-clicks a log, the system shall open the log editor dialog.
6. When the user selects one or more logs and clicks "Delete", the system shall prompt for confirmation before deleting.
7. If the log has voice tracks, then the system shall show a second confirmation stating the number of voice tracks that will also be deleted.
8. If the log is locked by another user, then the system shall display an error identifying the locking user and station, and skip deletion of that log.
9. When the user clicks "Voice Tracker", the system shall open the voice tracking window for the selected log.
10. When the user clicks "Log Report", the system shall open the reports dialog.
11. The system shall display status icons indicating log validity, link status, and completion state.
12. When a notification is received that another client has modified, added, or deleted a log, the system shall refresh the affected list entries.

### Requirement 2: Log Editing

**Objective:** As a broadcast operator, I want to edit the contents and metadata of a broadcast log, so that I can define the exact sequence of audio events for a broadcast schedule.

#### Acceptance Criteria

1. The system shall display log metadata fields: name, description, service, auto-refresh flag, start date, end date, purge date, time style (12-hour or 24-hour), origin info, and voice track count.
2. When the user modifies any metadata field, the system shall mark the log as changed.
3. The system shall display log lines in a tabular list showing type icon, start time, transition type, cart number, group, duration, title, artist, client, agency, label, source, external data, and line identifier.
4. When the user double-clicks a log line or clicks "Edit", the system shall open the appropriate editor based on line type (cart, marker, chain, or voice track marker).
5. When the user clicks "Insert Cart", the system shall open a cart selection dialog and insert the chosen cart at the current position.
6. When the user clicks "Insert Meta", the system shall offer a choice of marker, voice track marker, or log chain, and insert the selected type.
7. The system shall support cut, copy, and paste operations on log lines via a clipboard.
8. The system shall support reordering log lines via "Up" and "Down" controls.
9. When the user deletes a log line, the system shall remove it from the list and renumber remaining lines.
10. When the user drags a cart from an external source and drops it onto the log line list, the system shall insert the cart at the drop position.
11. When the user clicks "Save", the system shall persist the log to the database and publish a modification notification to other clients.
12. When the user clicks "Save As", the system shall prompt for a new log name and save a copy.
13. When the user clicks "OK", the system shall save and close the editor.
14. If the user clicks "Cancel" with unsaved changes, then the system shall present a three-way dialog: save and close, discard and close, or remain in the editor.
15. When the log is opened for editing, the system shall acquire an exclusive lock.
16. If the lock cannot be acquired because another user holds it, then the system shall display a warning identifying the locking user and station, and prevent editing.
17. Each log line shall be color-coded based on cart validity state: valid, conditionally valid, future valid, evergreen, invalid, or disabled for service.
18. When the user clicks "Render", the system shall open the render/export dialog.
19. When the user clicks "Reports", the system shall open the reports dialog.

### Requirement 3: Cart Line Editing

**Objective:** As a broadcast operator, I want to configure individual cart entries in a log, so that I can control audio playback timing and transitions.

#### Acceptance Criteria

1. The system shall allow the user to enter a cart number or select a cart via a selection dialog.
2. When the user selects a cart, the system shall display the cart title and artist as read-only information.
3. The system shall allow the user to set a hard start time, transition type (play, segue, stop), and grace time options.
4. The system shall allow the user to toggle an overlap option for segue behavior.
5. If the cart number field is empty when saving, then the system shall display a warning "Missing Cart" and prevent the save.
6. If the cart belongs to a group that is disabled for the log's assigned service, then the system shall display a warning "Disabled Cart" and prevent the save.
7. When no custom segue, end, or fadedown points are set and the overlap option is enabled, the system shall configure a hard segue (gain set to zero).
8. When no custom segue, end, or fadedown points are set and the overlap option is disabled, the system shall configure a gradual fade.

### Requirement 4: Marker, Chain, and Track Marker Editing

**Objective:** As a broadcast operator, I want to insert and configure non-audio events in a log, so that I can structure the broadcast with markers, links to other logs, and voice track placeholders.

#### Acceptance Criteria

1. The system shall allow the user to add a marker with a label and comment.
2. The system shall allow the user to add a log chain with a target log name, auto-filled description from the target log, and a selection dialog.
3. The system shall allow the user to add a voice track marker with a comment and overlap option.
4. The system shall allow configuration of hard start time, transition type, and grace time for all marker types.

### Requirement 5: Voice Tracking

**Objective:** As a broadcast operator, I want to record voice-over segments between audio events in a log, so that I can create pre-produced programming with natural-sounding transitions.

#### Acceptance Criteria

1. The system shall display a log line list, a waveform visualization area showing up to three tracks (pre-roll, recording, post-roll), and VU level meters.
2. When the user clicks "Track 1", the system shall begin playing the pre-roll audio and prepare the recording hardware.
3. When the user clicks "Record", the system shall start recording while fading down the pre-roll audio.
4. When the user clicks "Track 2", the system shall begin playing the post-roll audio while recording continues.
5. When the user clicks "Finished", the system shall stop recording, save the voice track, and calculate segue transition points.
6. The system shall support an import workflow as an alternative to recording, allowing the user to import an existing audio file as a voice track.
7. The system shall provide navigation controls ("Previous", "Next") to move between trackable positions in the log.
8. The system shall provide "Insert" and "Delete" controls for adding or removing voice track markers.
9. When the user right-clicks on the waveform display, the system shall show a context menu with options: edit cue markers, undo segue changes, set start point, set end point, and reset to hook markers.
10. The system shall allow the user to adjust segue and crossfade points by dragging on the waveform display.
11. While recording is in progress, the system shall display real-time VU meter levels and remaining time.
12. The system shall display the count of remaining voice tracks to complete.
13. If creating a new cart for the voice track fails, then the system shall display a warning and prevent recording.
14. When the user changes the transition type via the log list context menu, the system shall update the transition for the selected line.
15. If the user has unsaved changes when navigating away or closing, the system shall prompt to save changes.
16. Where the "enable second start" configuration is active, the system shall enable the "Track 2" (post-roll) button.

### Requirement 6: Log Rendering and Export

**Objective:** As a broadcast operator, I want to render a log or selected events to an audio file or cart, so that I can create consolidated audio output from a log sequence.

#### Acceptance Criteria

1. The system shall allow the user to select a render target: internal cart/cut or external audio file.
2. When the target is an external file, the system shall allow the user to browse and select an output file path.
3. The system shall allow the user to choose a virtual start time: current time or a manually specified time.
4. The system shall allow the user to configure audio format settings (codec, sample rate, channels, etc.).
5. The system shall allow the user to select which events to render: all events or only selected events.
6. The system shall provide an option to ignore stop transitions during rendering.
7. While rendering is in progress, the system shall display a progress indicator showing the current line and total lines.
8. When the user cancels during rendering, the system shall abort the render operation.

### Requirement 7: Report Generation

**Objective:** As a broadcast operator, I want to generate reports from log data, so that I can review log contents and identify scheduling exceptions.

#### Acceptance Criteria

1. The system shall offer three report types: log listing (text), log listing (CSV), and log exception report.
2. When the user selects the log exception report, the system shall allow the user to specify a date.
3. When the user clicks "Generate", the system shall produce the selected report and display or export it.

### Requirement 8: Service Validation

**Objective:** As a broadcast operator, I want the system to validate cart-to-service compatibility, so that I am warned before saving a log with carts that are disabled for the assigned service.

#### Acceptance Criteria

1. When the user saves a log that contains carts belonging to groups disabled for the selected service, the system shall display a warning.
2. The system shall allow the user to choose to save anyway or cancel the save operation.

### Requirement 9: Concurrent Editing Protection

**Objective:** As a broadcast operator, I want the system to prevent simultaneous editing of the same log, so that data conflicts are avoided.

#### Acceptance Criteria

1. When a user opens a log for editing, the system shall acquire an exclusive lock identifying the user and station.
2. If another user attempts to open the same log, then the system shall display a warning with the name and station of the locking user.
3. When the user closes the log editor, the system shall release the lock.

### Requirement 10: Inter-Client Notifications

**Objective:** As a broadcast operator, I want to see real-time updates when other users modify logs, so that I always work with current data.

#### Acceptance Criteria

1. When a log is created, modified, or deleted, the system shall publish a notification to all connected clients.
2. When a notification is received for a log visible in the current list, the system shall refresh the affected entry.
3. When a notification indicates a log was deleted, the system shall remove it from the list.

### Requirement 11: Application Configuration Persistence

**Objective:** As a broadcast operator, I want my window positions and display preferences to be saved, so that my workspace is restored when I reopen the application.

#### Acceptance Criteria

1. When the user closes the application, the system shall save the main window size and position.
2. When the user closes the log editor, the system shall save the editor window size.
3. When the application starts, the system shall restore previously saved window sizes and positions.
4. The system shall persist the time display style preference (12-hour or 24-hour) across sessions.
