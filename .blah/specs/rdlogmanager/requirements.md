# Requirements Document

## Introduction

Log Manager is a broadcast scheduling application within the Rivendell radio automation suite. It enables program directors and traffic managers to define scheduling building blocks (events and clocks), assemble them into weekly service grids, and then generate daily broadcast logs that merge music and traffic content. It also provides report generation and log lifecycle management (purge/delete). The application supports both an interactive GUI mode and a command-line interface for automated/scripted operations.

The system depends on the core library (LIB) for data models, service logic, configuration, and shared UI components.

## Requirements

### Requirement 1: Event Management

**Objective:** As a program director, I want to create, edit, rename, and delete scheduling events with detailed timing, import, and content rules, so that I can define reusable scheduling building blocks for broadcast logs.

#### Acceptance Criteria

1. When the user opens the Events panel, the system shall display a filterable list of all events showing name, properties, nested event reference, and color.
2. When the user selects a service filter, the system shall show only events permitted for that service.
3. When the user creates a new event, the system shall prompt for a name and open the event editor.
4. If an event with the same name already exists, then the system shall display an informational message and prevent creation.
5. When the user opens the event editor, the system shall display a split-panel interface with a content library browser on the left and event properties on the right.
6. When the user types in the library search field, the system shall filter the content library in real time by the entered text.
7. When the user selects a group filter or content type (audio/macro), the system shall restrict the library list accordingly.
8. When the user drags a content item from the library to the pre-import or post-import list, the system shall add it and trigger validation.
9. When the user enables pre-position, the system shall display a time editor for the pre-position offset.
10. When the user enables hard start time, the system shall display grace time options (immediate, next event, wait with configurable duration).
11. When the user changes the first event transition type, the system shall update all affected import transitions accordingly.
12. When the user enables autofill, the system shall allow configuration of a warning threshold (slop time).
13. When the user selects an import source (none, scheduler, file), the system shall show the corresponding configuration fields including start/end slop times.
14. When the user configures scheduler-based import, the system shall allow selection of a scheduler group, artist separation, title separation, and up to two required scheduler codes.
15. When the import list changes and pre-position or timed start is enabled, the system shall automatically set the first transition to stop and adjust post-import transition permissions.
16. When the user inserts a note marker into an import list, the system shall open a text editor for the note content.
17. When the user inserts a voice track marker into an import list, the system shall open a text editor for the track annotation.
18. When the user sets import list item transitions, the system shall allow choosing between play, segue, and stop transition types.
19. When the user clicks Save, the system shall persist the event configuration and all import lines to the database.
20. When the user clicks Save As, the system shall prompt for a new name and save a copy of the event, including permissions.
21. When the user assigns service permissions to an event, the system shall display a dual-list selector of available and assigned services.
22. When the user attempts to delete an event that is used in one or more clocks, the system shall display a warning listing the affected clocks and require confirmation.
23. When the user renames an event, the system shall update all references in clock lines, event permissions, and event lines.
24. When the user sets an event color, the system shall store it and display it in the event list.
25. The system shall support nested events, allowing one event to reference another by name.

### Requirement 2: Clock Management

**Objective:** As a program director, I want to create, edit, rename, and delete scheduling clocks that group events into one-hour time blocks, so that I can compose hourly broadcast schedules.

#### Acceptance Criteria

1. When the user opens the Clocks panel, the system shall display a filterable list of all clocks showing name, short code, and color.
2. When the user creates a new clock, the system shall prompt for a name and open the clock editor.
3. If a clock with the same name already exists, then the system shall prevent creation.
4. When the user opens the clock editor, the system shall display a split-panel interface with an event list on the left and a visual clock representation on the right.
5. When the user adds an event to a clock, the system shall open an event assignment dialog to select the event and configure start/end times within the hour.
6. When the user selects an event in the assignment dialog, the system shall open the events list in picker mode for selection.
7. When the user clones an event entry in the clock, the system shall duplicate the event assignment with the same configuration.
8. When the user edits a clock event via the context menu, the system shall open the corresponding event in the event editor.
9. When the user modifies the clock and attempts to close without saving, the system shall prompt with a three-way dialog: save, discard, or cancel.
10. When the user saves the clock, the system shall persist all event assignments, scheduler rules, and rule lines to the database.
11. When the user clicks Save As, the system shall prompt for a new name and save a copy including permissions.
12. If the clock short code field is empty on save, then the system shall display a warning requiring a clock code.
13. If the clock short code is already used by another clock, then the system shall display an error and prevent saving.
14. When the user assigns service permissions to a clock, the system shall display a dual-list selector of available and assigned services.
15. When the user opens scheduler rules for a clock, the system shall display artist separation and a list of scheduler code rules.
16. When the user edits a scheduler code rule, the system shall allow configuring maximum-in-a-row, minimum-wait, and not-after/or-after code constraints.
17. When the user imports scheduler rules, the system shall load rules from another clock.
18. When the user deletes a clock, the system shall remove it and all associated clock lines, permissions, and scheduler rules.
19. When the user renames a clock, the system shall update all references in service clock assignments.
20. When the clock event list changes, the system shall update the visual clock representation in real time.

### Requirement 3: Grid Management

**Objective:** As a program director, I want to assign clocks to each hour of a weekly service schedule grid, so that I can define the complete weekly programming structure for each broadcast service.

#### Acceptance Criteria

1. When the user opens the Grids panel, the system shall display a list of all services with their name and description.
2. When the user edits a service grid, the system shall display a 7-day by 24-hour button grid (168 hour slots).
3. When the user clicks an hour button, the system shall open the clocks list in picker mode for clock selection.
4. When a clock is assigned to an hour, the system shall display the clock short code on the button and color it with the clock color.
5. When the user clicks "Set All Clocks," the system shall assign the selected clock to all 168 hour slots.
6. When the user right-clicks an hour button, the system shall display a context menu with options to edit the assigned clock or clear the hour assignment.
7. When the user clears an hour assignment, the system shall remove the clock reference for that hour slot.
8. The system shall persist grid assignments to the database per service, storing one clock assignment per hour of the week.

### Requirement 4: Log Generation and Lifecycle

**Objective:** As a traffic manager, I want to generate daily broadcast logs from service grids and merge music and traffic schedules into them, so that the automation system has complete playlists for each broadcast day.

#### Acceptance Criteria

1. When the user opens the Logs panel, the system shall display a list of services with their log date range information.
2. When the user selects a service and opens log generation, the system shall display a dialog with service selector, date picker, and action buttons for create, merge music, and merge traffic.
3. When the user selects a date, the system shall display status indicators showing: whether music/traffic import files are available on disk, and whether music/traffic data has already been merged.
4. The system shall use color-coded indicators: green for available/merged, red for missing/needed, and neutral for not applicable.
5. When the user clicks Create, the system shall generate a new log from the service grid for the selected date and display a progress indicator.
6. If a log already exists for the selected date, then the system shall display a confirmation dialog warning that recreation will remove merged music and traffic data.
7. If the existing log contains completed voice tracks, then the system shall display an additional warning stating the number of voice tracks that will be deleted, requiring secondary confirmation.
8. When the user clicks Merge Music, the system shall import the music schedule file into the log.
9. If music data has already been merged, then the system shall display a confirmation dialog before remerging.
10. When the user clicks Merge Traffic, the system shall import the traffic schedule file into the log.
11. If traffic data has already been merged, then the system shall display a confirmation dialog before remerging.
12. If the log does not contain import markers and the data source is already linked, then the system shall display an error stating the log cannot be relinked and block the operation.
13. While music has not been merged and the log has both music and traffic import slots, the system shall keep the Traffic button disabled.
14. The system shall periodically scan for import file availability and update the status indicators automatically.
15. When the user opens the purge dialog for a service, the system shall display a calendar widget highlighting dates that have existing log data.
16. When the user selects a date with existing log data and clicks Delete, the system shall display a confirmation dialog and delete the log records for that service and date upon confirmation.
17. When a log is created or modified, the system shall publish a notification event indicating the action and log name.

#### Command-Line Interface

18. The system shall support command-line log generation by specifying a service name, date offset, and optional flags for protecting existing logs and controlling music/traffic merge.
19. If the protect-existing flag is set and a log already exists, then the system shall exit with a protected-output error code without modifying the existing log.
20. If the protect-existing flag is set and music is already imported, then the system shall exit with a link-failed error code.
21. If the log does not contain import markers and the data source is already linked, then the system shall exit with a link-failed error code.
22. The system shall support command-line report generation by specifying a report name, service name, and date offset range.
23. If the end date offset is less than the start date offset, then the system shall display an error about invalid date range.
24. If the protect-existing flag is set and the report output file already exists, then the system shall exit with a protected-output error code.

### Requirement 5: Reporting

**Objective:** As a station manager, I want to generate and view reports for specific date ranges and services, so that I can analyze broadcast log data and comply with reporting requirements.

#### Acceptance Criteria

1. When the user opens the Reports panel, the system shall display a date range picker with start date, end date, and a report selector filtered by available services.
2. When the user selects a report and date range and clicks Generate, the system shall produce the report output file.
3. When the report is complete, the system shall display a dialog showing the report file information with an option to open it in an external viewer.
4. When the user clicks the view button, the system shall open the report file in the system's configured external viewer.
5. If the report file cannot be opened, then the system shall display a warning about the file access error.
