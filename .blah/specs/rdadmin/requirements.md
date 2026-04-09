# Requirements Document

## Introduction

RDAdmin is the central administration application for the Rivendell broadcast automation system. It provides a comprehensive graphical interface for system administrators to configure and manage all aspects of the broadcast infrastructure, including users, groups, services, stations, podcast feeds, reports, audio switchers, content replication, scheduled operations, and system-wide settings. The application enforces role-based access control, requiring administrator privileges for all operations. It depends on the core library (LIB) for data access and shared UI components.

RDAdmin manages configuration for approximately 43 database tables spanning user/group permissions, station hardware assignments, audio routing matrices, podcast distribution, content scheduling, and per-station application profiles. All entity management follows a consistent list-add-edit-delete pattern with modal dialog navigation.

## Requirements

### Requirement 1: Authentication and Authorization

**Objective:** As a system administrator, I want to authenticate with credentials and have my access restricted by privilege level, so that only authorized personnel can modify system configuration.

#### Acceptance Criteria

1. When the application starts, the system shall present a login dialog requesting username and password.
2. When the user submits credentials, the system shall verify the password against the user database.
3. If the password verification fails, then the system shall display a "Login Failed" error and terminate the application.
4. If the authenticated user has neither the "admin configuration" nor the "admin RSS" privilege, then the system shall display an "Insufficient Privileges" error and terminate the application.
5. When the user has the "admin configuration" privilege, the system shall enable access to: Users, Groups, Services, Stations, Reports, System Settings, Scheduler Codes, and Replicators.
6. When the user has the "admin configuration" or "admin RSS" privilege, the system shall enable access to: Podcasts and System Info.
7. The system shall always display the current username and description in the main window header.

### Requirement 2: User Management

**Objective:** As a system administrator, I want to create, edit, and delete user accounts with granular permission control, so that each operator has precisely the access they need.

#### Acceptance Criteria

1. When the administrator opens user management, the system shall display a list of all user accounts.
2. When the administrator adds a new user, the system shall require a non-empty, unique username.
3. If the username already exists, then the system shall display a "User Already Exists" error.
4. When editing a user, the system shall allow configuration of: password, permission flags for carts, logs, podcasts, panels, catches, voice tracking, web access, and admin capabilities.
5. When editing a user, the system shall allow assignment of group permissions via a dual-list selector (available/assigned groups).
6. When editing a user, the system shall allow assignment of service permissions via a dual-list selector.
7. When editing a user, the system shall allow assignment of feed permissions via a dual-list selector.
8. When the administrator toggles the "admin configuration" privilege, the system shall update related admin capability flags accordingly.
9. If the administrator attempts to delete their own account, then the system shall display "You cannot delete yourself!" and block the deletion.
10. If the administrator attempts to delete a user who has created logs or voice tracks, then the system shall display a warning listing the affected logs and block the deletion.
11. When deleting a user, the system shall request confirmation before proceeding.
12. When a user is deleted, the system shall also remove associated web connection records.

### Requirement 3: Group Management

**Objective:** As a system administrator, I want to manage groups that define cart number ranges, audio permissions, and content policies, so that library content is properly organized and access-controlled.

#### Acceptance Criteria

1. When the administrator opens group management, the system shall display a list of all groups.
2. When adding a new group, the system shall require a non-empty, unique group name.
3. If the group name already exists, then the system shall display a "Group Already Exists" error.
4. When adding a group, the system shall optionally create default user permission and service entries.
5. When editing a group, the system shall allow configuration of: cart number range (low/high), allowed services, display color, cart type, shelf life, and cut life.
6. If the group's cart number range overlaps with another group's range, then the system shall display a conflict warning listing all overlapping groups and allow the user to proceed or cancel.
7. When renaming a group, the system shall cascade the name change across all referencing records: carts, events, replicator maps, dropboxes, audio permissions, and user permissions.
8. When deleting a group that contains carts, the system shall warn that the member carts will also be deleted and display the cart count.
9. When deleting a group, the system shall request confirmation before proceeding.

### Requirement 4: Service Management

**Objective:** As a system administrator, I want to configure broadcast services with traffic/music import templates and host permissions, so that each service can receive and process scheduling data correctly.

#### Acceptance Criteria

1. When the administrator opens service management, the system shall display a list of all services.
2. When adding a new service, the system shall require a non-empty, unique service name and optionally clone configuration from an existing service.
3. If the service name already exists, then the system shall display a "Service Already Exists" error.
4. When editing a service, the system shall allow configuration of: traffic and music import templates, voice group, autospot group, log shelf life, and import field mappings.
5. When editing a service, the system shall allow assignment of permitted hosts via a dual-list selector.
6. When editing a service, the system shall allow copying traffic or music import configuration from another service.
7. When editing a service, the system shall provide a test import function to validate traffic/music import configuration with a selectable date.
8. When editing a service, the system shall provide an autofill cart configuration interface.
9. When editing a service, the system shall embed an import field mapper widget for both traffic and music that maps column offsets and lengths for cart, title, time fields, announcement type, data, and event ID.
10. When the administrator changes import template text, the system shall track unsaved changes.
11. If the administrator deletes a service that has existing logs, then the system shall display a "Logs Exist" warning and require a second confirmation.
12. When deleting a service, the system shall request confirmation before proceeding.

### Requirement 5: Station Core Configuration

**Objective:** As a system administrator, I want to configure station identity, system services, and host-level settings, so that each broadcast workstation operates correctly within the system.

#### Acceptance Criteria

1. When the administrator opens station management, the system shall display a list of all stations.
2. When adding a new station, the system shall require a hostname and optionally clone configuration from an exemplar station, including encoder profile records.
3. When editing a station, the system shall allow configuration of: IP address, system maintenance pool membership, heartbeat monitoring with associated cart, startup/stop carts, drag-and-drop settings, and audio engine station assignment.
4. If the administrator unchecks "system maintenance pool" and no other station is in the pool, then the system shall block the save with "At least one host must belong to the system maintenance pool."
5. If the IP address is invalid, then the system shall display "The specified IP address is invalid!" and block the save.
6. When editing a station, the system shall provide navigation buttons to open sub-configuration dialogs for: application profiles, audio hardware, serial ports, network adapters, audio routing, dropboxes, host variables, and automation plugins.
7. When editing a station, the system shall allow viewing of network adapter information.
8. When deleting a station, the system shall request confirmation before proceeding.

### Requirement 6: Station Application Profiles

**Objective:** As a system administrator, I want to configure per-station settings for each broadcast application module, so that each workstation has appropriate application behavior.

#### Acceptance Criteria

1. When the administrator opens the on-air application profile, the system shall allow configuration of: audio card/port assignments, virtual log machines, segue/transition settings, start modes, visual skin, hotkeys, and GPIO channel assignments.
2. If the segue length is invalid, then the system shall display "Invalid Segue Length!" and block the save.
3. When the administrator edits hotkeys, the system shall allow keystroke capture and assignment with clone-from-host capability.
4. If a hotkey keystroke is already assigned to another function, then the system shall display a "Duplicate Entries" warning.
5. When the administrator opens the library application profile, the system shall allow configuration of: input/output card, audio format, channels, bitrate, recording mode, trim settings, and CD metadata server type.
6. When the administrator opens the log editor application profile, the system shall allow configuration of: input/output card, audio format, waveform caption, start/end/record carts, and default transition type.
7. When the administrator opens the panel application profile, the system shall allow configuration of: card selection, default service, visual skin, flash and pause settings.
8. When the administrator opens the deck configuration, the system shall allow configuration of: record/play/audition decks with format, channels, bitrate, switcher matrix/output assignment, threshold, and event carts.

### Requirement 7: Station Hardware Configuration

**Objective:** As a system administrator, I want to configure audio hardware, serial ports, audio server settings, and automation plugins for each station, so that physical broadcast equipment is properly integrated.

#### Acceptance Criteria

1. When the administrator opens audio port configuration, the system shall allow configuration of clock source, port type, mode, and input/output settings per audio card.
2. When the administrator opens audio port configuration, the system shall provide a help dialog explaining audio port concepts.
3. When the administrator opens serial port configuration, the system shall allow configuration of baud rate, data bits, stop bits, parity, and termination for each port.
4. If a serial port is already assigned to a switcher/GPIO device, then the system shall display a detailed error identifying the matrix number, type, and name using the port.
5. When the administrator opens audio server configuration, the system shall allow configuration of server name, command line, audio ports, and client list management.
6. When the administrator opens automation plugin management, the system shall display a list of plugin instances with add, edit, delete, and error log viewing capabilities.
7. When editing an automation plugin instance, the system shall allow configuration of script path, description, and configuration text.
8. When the administrator opens cart slot configuration, the system shall allow configuration of a grid with rows/columns, mode, play mode, stop action, service, and card/input/output per slot.

### Requirement 8: Switcher and Matrix Management

**Objective:** As a system administrator, I want to configure audio switchers and routing matrices with their inputs, outputs, control interfaces, and automation triggers, so that audio routing is properly managed.

#### Acceptance Criteria

1. When the administrator opens switcher management from a station, the system shall display a list of all matrices assigned to that station.
2. When adding a new matrix, the system shall require selection of a matrix type and matrix number.
3. When editing a matrix, the system shall allow configuration of connection parameters and provide access to manage: inputs, outputs, crosspoints, GPI triggers, GPO triggers, network audio nodes, network audio GPIO assignments, and vendor-specific resources.
4. If the IP address/port combination is already used by another matrix, then the system shall display a "Duplicate Connections" warning and block the save.
5. When managing network audio nodes, the system shall allow adding, editing, and deleting nodes with hostname, TCP port, description, password, and output count.
6. If a node with the same hostname already exists for this matrix, then the system shall display "That node is already listed for this matrix!" and block the save.
7. When managing GPI/GPO triggers, the system shall allow assignment of carts to trigger events with on/off states.
8. If an invalid cart number is assigned to a GPI/GPO event, then the system shall display "Invalid Cart Number!" and block the save.
9. When managing matrix endpoints, the system shall allow editing of input and output names and properties.
10. When deleting a matrix, the system shall cascade-delete all associated inputs, outputs, nodes, GPI/GPO assignments, and vendor-specific resources.
11. When deleting a matrix, the system shall request confirmation before proceeding.

### Requirement 9: Dropbox Management

**Objective:** As a system administrator, I want to configure file dropboxes for automatic audio import with processing rules, so that audio files placed in monitored directories are automatically ingested.

#### Acceptance Criteria

1. When the administrator opens dropbox management from a station, the system shall display a list of all dropboxes assigned to that station.
2. When adding or editing a dropbox, the system shall allow configuration of: monitored path, target cart, log file path, normalization, auto-trim, segue, metadata pattern, scheduler codes, and date offsets.
3. When the administrator adds a dropbox, the system shall support duplicating an existing dropbox configuration.
4. If the start/end date offsets are invalid, then the system shall display "Invalid Offsets" and block the save.
5. When editing a dropbox, the system shall allow resetting all fields to default values.
6. When deleting a dropbox, the system shall also remove associated path and scheduler code records.
7. When deleting a dropbox, the system shall request confirmation before proceeding.

### Requirement 10: Podcast and Feed Management

**Objective:** As a system administrator, I want to manage podcast feeds with channel metadata, encoding settings, image assets, and superfeed aggregation, so that audio content can be distributed via RSS.

#### Acceptance Criteria

1. When the administrator opens podcast management, the system shall display a list of all feeds.
2. When adding a new feed, the system shall require a unique key name and optionally configure user access.
3. When editing a feed, the system shall allow configuration of: RSS schema, channel metadata, XML templates (header, channel, item), audio encoding format, purge URL, and superfeed membership.
4. When editing a feed, the system shall provide image management with add, view, and delete operations.
5. If the administrator attempts to delete an image that is referenced by active podcasts or feeds, then the system shall display "Image in Use" and block the deletion.
6. If the base URL or other URL fields are invalid, then the system shall display an error and block the save.
7. When editing a feed, the system shall allow copying XML template sections to the clipboard.
8. When deleting a feed, the system shall cascade-delete all associated podcasts, images, permissions, and superfeed map entries.
9. When deleting a feed, the system shall request confirmation before proceeding.
10. When managing feeds, the system shall support repost and unpost operations on feed content.

### Requirement 11: Report Management

**Objective:** As a system administrator, I want to define report configurations with filters and export settings, so that broadcast logs and traffic data can be reported accurately.

#### Acceptance Criteria

1. When the administrator opens report management, the system shall display a list of all reports.
2. When adding a new report, the system shall require a non-empty, unique report name.
3. If the report name already exists, then the system shall display a "Report Already Exists" error.
4. When editing a report, the system shall allow configuration of: filter criteria, station type, cart digit count, line pagination, export path, daypart time settings, and selection filters for services, stations, and groups.
5. When deleting a report, the system shall request confirmation before proceeding.

### Requirement 12: Replicator Management

**Objective:** As a system administrator, I want to manage content replicators with connection settings and group assignments, so that audio content can be distributed to remote systems.

#### Acceptance Criteria

1. When the administrator opens replicator management, the system shall display a list of all replicators.
2. When adding a new replicator, the system shall require a non-empty, unique replicator name.
3. If the replicator name already exists, then the system shall display a "Replicator Already Exists" error.
4. When editing a replicator, the system shall allow configuration of: replication type, station, URL, credentials, audio format, normalization level, and group selection.
5. When viewing replicator carts, the system shall display the replication state of each cart with automatic periodic refresh and support repost operations.
6. When deleting a replicator, the system shall also remove associated map and state records.
7. When deleting a replicator, the system shall request confirmation before proceeding.

### Requirement 13: Scheduler Code Management

**Objective:** As a system administrator, I want to manage scheduler codes that classify content for scheduling rules, so that automated log generation can apply appropriate placement logic.

#### Acceptance Criteria

1. When the administrator opens scheduler code management, the system shall display a list of all scheduler codes.
2. When adding a new scheduler code, the system shall require a non-empty, unique code name.
3. If the scheduler code already exists, then the system shall display a "Code Already Exists" error.
4. When editing a scheduler code, the system shall allow modifying the code description.
5. When deleting a scheduler code, the system shall also remove associated dropbox scheduler code references.
6. When deleting a scheduler code, the system shall request confirmation before proceeding.

### Requirement 14: System Settings

**Objective:** As a system administrator, I want to configure system-wide settings including audio parameters, duplicate detection, and notification addresses, so that the entire broadcast system operates with consistent global configuration.

#### Acceptance Criteria

1. When the administrator opens system settings, the system shall display current values for: audio sample rate, duplicate cart title detection, maximum HTTP POST size, ISCI cross-reference path, origin email address, temporary cart group, RSS processor station, user list visibility, and notification address.
2. When the administrator saves system settings, the system shall persist all values to the database.
3. If the administrator disables "Allow Duplicate Cart Titles" when currently enabled, then the system shall display a deprecation warning explaining potential reliability issues and require confirmation to proceed.
4. When the administrator opens the encoder list from system settings, the system shall display encoder profiles with add, edit, and delete capabilities.
5. When the administrator opens system information, the system shall display system details and provide access to view the software license.

### Requirement 15: Host Variable Management

**Objective:** As a system administrator, I want to manage custom host variables per station, so that broadcast automation scripts and templates can reference station-specific values.

#### Acceptance Criteria

1. When the administrator opens host variable management from a station, the system shall display a list of all variables for that station.
2. When adding a host variable, the system shall require a non-empty name, value, and optional remark.
3. When editing a host variable, the system shall allow modification of the value and remark.
4. When deleting a host variable, the system shall request confirmation before proceeding.

### Requirement 16: Universal Entity Validation

**Objective:** As a system administrator, I want consistent validation across all entity creation and modification, so that data integrity is maintained throughout the system.

#### Acceptance Criteria

1. When creating any named entity, the system shall require a non-empty name.
2. If the name field is empty, then the system shall display an "Invalid Name" or "You must give the entity a name!" error.
3. If an entity with the same name already exists, then the system shall display an "Already Exists" error.
4. When deleting any entity, the system shall display a confirmation dialog with "Are you sure you want to delete [entity type] '[name]'?" and Yes/No options.
5. The system shall use modal dialog navigation throughout, where parent windows open child dialogs and process the accepted/rejected result upon return.
