# Implementation Plan

- [ ] 1. Foundation: domain entities, value objects, and validation service
- [ ] 1.1 (P) Create domain entities for all administrable entity types
  - Define domain entity classes for User, Group, Service, Station, Feed, Report, Replicator, SchedulerCode, HostVariable, Matrix, Dropbox, and related sub-entities (automation plugin, encoder profile, network audio node)
  - Each entity must be pure C++ with no Qt dependencies, using value semantics, `std::optional` for absent values, and `[[nodiscard]]` on getters
  - User entity must carry privilege flags for admin configuration and admin RSS access
  - Group entity must include cart number range (low/high), color, cart type, shelf life, and cut life
  - Station entity must include IP address, system maintenance pool flag, heartbeat cart, startup/stop carts, and audio engine assignment
  - Matrix entity must include type, connection parameters (IP address, port), and matrix number
  - Feed entity must include RSS metadata fields, encoding format, base URL, and superfeed membership
  - _Requirements: 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15_

- [ ] 1.2 (P) Create domain value objects for admin-specific types
  - Define value objects for privilege level (admin configuration, admin RSS), IP address, cart number range, port configuration parameters, URL, scheduler code identifier, and matrix type
  - All value objects must be immutable after construction, support comparison operators, and compile without Qt
  - CartNumberRange value object must support overlap detection against another range
  - IpAddress value object must support format validation
  - _Requirements: 3, 5, 8, 16_

- [ ] 1.3 (P) Create ErrorInfo domain type for rdadmin error categories
  - Define structured error codes covering all rdadmin validation and business constraint failures: empty name, duplicate entity, invalid IP, invalid cart number, self-deletion, maintenance pool minimum, serial port conflict, overlapping cart range, duplicate hotkey, image in use, and duplicate matrix connection
  - Each error code must be a machine-readable string with a human-readable message template
  - _Requirements: 16_

- [ ] 1.4 Implement validation service with shared rules for all entity operations
  - Implement non-empty name validation that returns a structured error when the name field is blank
  - Implement entity name uniqueness check that queries the database for existing entities of the same type
  - Implement IP address format validation
  - Implement cart number validation (range and format)
  - Implement URL format validation for feed and replicator URLs
  - Implement numeric range validation for port numbers, offsets, and segue lengths
  - All validation returns domain ErrorInfo on failure, never throws exceptions
  - _Requirements: 16_
  - _Contracts: ValidationService interface_

- [ ] 2. Authentication and authorization service
- [ ] 2.1 Implement authentication service for credential verification and privilege determination
  - Verify username and password against the user database through an outbound repository port
  - Return an authentication result containing user ID, username, description, admin configuration privilege flag, and admin RSS privilege flag
  - Return structured errors for invalid credentials, user not found, and database errors
  - _Requirements: 1_
  - _Contracts: AuthenticationService interface_

- [ ] 2.2 Implement privilege gating logic for main window menu access
  - When the user has admin configuration privilege, enable access to Users, Groups, Services, Stations, Reports, System Settings, Scheduler Codes, and Replicators
  - When the user has admin configuration or admin RSS privilege, enable access to Podcasts and System Info
  - Expose current username and description for display in the main window header
  - _Requirements: 1_

- [ ] 3. Outbound ports and persistence adapters for all entity types
- [ ] 3.1 (P) Define outbound repository port interfaces for all entity types
  - Define repository interfaces for User, Group, Service, Station, Feed, Report, Replicator, SchedulerCode, HostVariable, Matrix, Dropbox, and all sub-entities
  - Each repository must support find-all, find-by-key, save, and delete operations using domain types only
  - User repository must support credential lookup and privilege query
  - Group repository must support cart range overlap detection query
  - Station repository must support system maintenance pool membership query
  - Matrix repository must support duplicate connection (IP/port) detection
  - _Requirements: 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15_

- [ ] 3.2 (P) Implement SQL persistence adapters for user, group, and service repositories
  - Implement user repository with credential verification, permission flag queries, associated log/voice track lookup for deletion guard, and web connection record cleanup on delete
  - Implement group repository with cart range overlap detection across all groups, and multi-table rename cascade support
  - Implement service repository with clone-from-existing capability, log existence check for deletion guard, and host permission management
  - All adapters use Qt SQL, translate SQL errors to domain ErrorInfo, and emit error signals
  - _Requirements: 2, 3, 4_

- [ ] 3.3 (P) Implement SQL persistence adapters for station, matrix, and dropbox repositories
  - Implement station repository with exemplar cloning (including encoder profile records), system maintenance pool membership query, and cascade to sub-entity records
  - Implement matrix repository with cascade delete of all child records (inputs, outputs, nodes, GPIs, GPOs, vendor resources), and duplicate connection detection
  - Implement dropbox repository with duplication support and cascade delete of path and scheduler code records
  - _Requirements: 5, 8, 9_

- [ ] 3.4 (P) Implement SQL persistence adapters for feed, report, replicator, scheduler code, host variable, and system settings repositories
  - Implement feed repository with cascade delete of podcasts, images, permissions, and superfeed map entries, and image in-use protection check
  - Implement report repository with filter sub-records (services, stations, groups)
  - Implement replicator repository with cascade delete of map and state records, and cart replication state query with repost support
  - Implement scheduler code repository with cascade delete of dropbox scheduler code references
  - Implement host variable repository scoped to station name
  - Implement system settings repository for global configuration values and encoder profile management
  - _Requirements: 10, 11, 12, 13, 14, 15_

- [ ] 4. Cascade and rename domain services
- [ ] 4.1 Implement cascade delete service for multi-table delete operations
  - Implement feed cascade delete: remove podcasts, images, permissions, superfeed maps, then the feed record, all within a transaction
  - Implement matrix cascade delete: remove inputs, outputs, nodes, GPIs, GPOs, vendor resources, then the matrix record, all within a transaction
  - Implement replicator cascade delete: remove map entries, cart state, cut state, then the replicator record, all within a transaction
  - Implement group cascade delete: count member carts for warning, remove user permissions, audio permissions, then the group record
  - _Requirements: 3, 8, 10, 12_
  - _Contracts: CascadeDeleteService interface_

- [ ] 4.2 Implement group rename service for multi-table name cascade
  - Update all cart records referencing the old group name
  - Update all event records, replicator map entries, and dropbox entries referencing the old group name
  - Replace group, audio permission, and user permission records with the new name
  - All rename operations must be transactional — rollback on any failure
  - Validate new name uniqueness before starting the cascade
  - _Requirements: 3_
  - _Contracts: GroupRenameService interface_

- [ ] 5. Inbound ports and application services
- [ ] 5.1 Define inbound port interfaces for all administration use cases
  - Define use case interfaces for user management, group management, service management, station management, feed management, report management, replicator management, scheduler code management, host variable management, and system settings management
  - Each interface must expose list, create, update, delete operations and entity-specific business operations (rename group, test import, clone station, repost feed content)
  - Include a system info use case for displaying system details and license
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15_

- [ ] 5.2 Implement application services for user and group management
  - User management service must enforce: unique username on create, self-deletion prevention, deletion guard for users with existing logs or voice tracks, web connection cleanup on delete, and permission flag cascading when toggling admin configuration privilege
  - Group management service must enforce: unique group name, cart range overlap warning (listing all conflapping groups), cascade rename through all referencing tables, and cascade delete with cart count warning
  - All business constraint violations must emit structured error signals
  - _Requirements: 2, 3, 16_

- [ ] 5.3 (P) Implement application services for service and station management
  - Service management must support: clone from existing service on create, traffic/music import template editing with unsaved change tracking, test import execution with date selection, autofill cart configuration, and deletion guard when logs exist (requiring second confirmation)
  - Station management must support: exemplar cloning with encoder profiles, IP address validation, system maintenance pool minimum enforcement, and navigation to all sub-configuration areas (application profiles, hardware, serial ports, adapters, routing, dropboxes, host variables, plugins)
  - _Requirements: 4, 5, 6, 7_

- [ ] 5.4 (P) Implement application services for feed, report, replicator, scheduler code, host variable, and system settings management
  - Feed management must support: RSS metadata editing, XML template sections, encoding format configuration, image management with in-use protection, superfeed aggregation, cascade delete, and repost/unpost operations
  - Report management must support: filter criteria configuration, station type selection, and selection filters for services/stations/groups
  - Replicator management must support: connection settings, group selection, cart state viewing with periodic auto-refresh, repost operations, and cascade delete
  - Scheduler code management must support: description editing and cascade delete of dropbox references
  - Host variable management must support: per-station variable CRUD with name, value, and remark
  - System settings must support: editing all global configuration values, duplicate cart title deprecation warning with confirmation, encoder profile management, and system info/license display
  - _Requirements: 10, 11, 12, 13, 14, 15_

- [ ] 6. UI adapters: models and controllers for QML
- [ ] 6.1 Implement UI adapter for login, main window, and permission selector
  - Create a login controller that accepts username and password, invokes the authentication service, and exposes the authentication result and error state to QML
  - Create a main window controller that exposes the current user identity, privilege-gated button enabled states, and navigation actions to open each entity management area
  - Create a reusable permission selector model (dual-list: available items and assigned items) with move-left, move-right operations, used by user permissions, service permissions, and feed permissions
  - _Requirements: 1, 2, 4_
  - _Contracts: MainWindow state, PermissionSelectorWidget state_

- [ ] 6.2 (P) Implement UI adapter models and controllers for user and group management
  - Create user list model exposing all users with add, edit, and delete actions
  - Create user editor controller exposing all user fields (password, permission flags, group/service/feed permission selectors) with save and validation error feedback
  - Create group list model exposing all groups with add, edit, rename, and delete actions
  - Create group editor controller exposing group fields (cart range, allowed services, color, type, shelf/cut life) with overlap warning feedback
  - Create group rename controller with new name input and cascade progress feedback
  - _Requirements: 2, 3, 16_

- [ ] 6.3 (P) Implement UI adapter models and controllers for service management
  - Create service list model with add (including clone-from selection), edit, and delete actions
  - Create service editor controller exposing all service fields: traffic and music import templates, voice group, autospot group, log shelf life, host permission selector, copy-from-service action, test import with date selection, and autofill cart configuration
  - Create import field mapper model for traffic and music column offset/length mapping (cart, title, time fields, announcement type, data, event ID)
  - Track unsaved import template changes and prompt before discarding
  - _Requirements: 4, 16_

- [ ] 6.4 (P) Implement UI adapter models and controllers for station management
  - Create station list model with add (including exemplar clone selection), edit, and delete actions
  - Create station editor controller exposing core fields: IP address, system maintenance pool, heartbeat settings, startup/stop carts, drag-and-drop settings, audio engine assignment, and navigation buttons to all sub-configuration dialogs
  - Create network adapter info viewer model
  - _Requirements: 5, 16_

- [ ] 6.5 (P) Implement UI adapter models and controllers for station application profiles
  - Create on-air profile editor controller: audio card/port assignments, virtual log machines, segue/transition settings, start modes, skin selection, hotkeys, and GPIO channel assignments
  - Create hotkey editor controller with keystroke capture, duplicate detection warning, and clone-from-host capability
  - Create library profile editor controller: input/output card, audio format, channels, bitrate, recording mode, trim settings, CD metadata server type
  - Create log editor profile controller: input/output card, audio format, waveform caption, start/end/record carts, default transition type
  - Create panel profile editor controller: card selection, default service, skin, flash and pause settings
  - Create deck editor controller: record/play/audition decks with format, channels, bitrate, switcher assignment, threshold, and event carts
  - _Requirements: 6_

- [ ] 6.6 (P) Implement UI adapter models and controllers for station hardware configuration
  - Create audio port editor controller: clock source, port type, mode, input/output settings per card, and help dialog content
  - Create serial port editor controller: baud rate, data bits, stop bits, parity, termination per port, with in-use conflict detection feedback
  - Create audio server editor controller: server name, command line, audio ports, client list management
  - Create automation plugin list model with add, edit, delete, and error log viewing
  - Create automation plugin editor controller: script path, description, configuration text
  - Create cart slot editor controller: grid rows/columns, mode, play mode, stop action, service, card/input/output per slot
  - _Requirements: 7_

- [ ] 6.7 (P) Implement UI adapter models and controllers for switcher/matrix management
  - Create matrix list model for a given station with add, edit, and delete actions
  - Create matrix editor controller: type selection, connection parameters, and navigation to sub-dialogs for inputs, outputs, crosspoints, GPI triggers, GPO triggers, nodes, GPIO assignments, and vendor resources
  - Create endpoint list model for matrix input and output name/property editing
  - Create node list model with add, edit, and delete; node editor controller with hostname uniqueness validation per matrix
  - Create GPI/GPO editor controller with cart assignment and invalid cart number validation
  - _Requirements: 8, 16_

- [ ] 6.8 (P) Implement UI adapter models and controllers for dropbox management
  - Create dropbox list model for a given station with add (including duplicate), edit, and delete actions
  - Create dropbox editor controller: monitored path, target cart, log file path, normalization, auto-trim, segue, metadata pattern, scheduler codes, date offsets with validation, and reset-to-defaults action
  - _Requirements: 9, 16_

- [ ] 6.9 (P) Implement UI adapter models and controllers for feed/podcast management
  - Create feed list model with add, edit, and delete actions
  - Create feed editor controller: RSS schema, channel metadata, XML templates (header, channel, item) with clipboard copy, encoding format, purge URL, superfeed membership selection
  - Create image list model with add, view, and delete actions, including in-use protection feedback
  - Expose repost and unpost operations on feed content
  - _Requirements: 10, 16_

- [ ] 6.10 (P) Implement UI adapter models and controllers for report, replicator, scheduler code, host variable, and system settings
  - Create report list/editor models: filter criteria, station type, cart digits, pagination, export path, daypart settings, and selection filters for services/stations/groups
  - Create replicator list/editor models: type, station, URL, credentials, format, normalization, group selection; cart state viewer with auto-refresh timer and repost action
  - Create scheduler code list/editor models: code name and description
  - Create host variable list/editor models scoped to a station: name, value, remark
  - Create system settings editor controller: all global settings, duplicate cart title deprecation warning with confirmation flow, encoder profile list, and system info/license display
  - _Requirements: 11, 12, 13, 14, 15, 16_

- [ ] 7. QML views: authentication, main window, and shared components
- [ ] 7.1 Build login dialog and main window views
  - Implement login dialog with username and password fields, submit action, and error display for failed login or insufficient privileges
  - Implement main window view displaying current user identity in the header and a privilege-gated grid of navigation buttons for each management area
  - On failed authentication or insufficient privileges, show modal error dialog and terminate application
  - Follow dark theme and design system tokens from steering
  - _Requirements: 1_

- [ ] 7.2 (P) Build shared dialog components and permission selector widget
  - Build reusable modal confirmation dialog with customizable message and Yes/No buttons, used by all entity delete confirmations
  - Build reusable error/warning dialog for validation failures and business constraint messages
  - Build reusable entity list view component with add, edit, and delete toolbar buttons and a scrollable list
  - Build reusable dual-list permission selector widget (available/assigned columns with move buttons)
  - Build reusable form field components: text input, numeric input, dropdown selector, checkbox, color picker
  - All components must follow design system spacing, typography, and accessibility rules (focus rings, keyboard navigation, aria labels)
  - _Requirements: 16_

- [ ] 8. QML views: entity management dialogs
- [ ] 8.1 (P) Build user and group management views
  - Build user list dialog showing all users with add, edit, and delete buttons
  - Build user editor dialog with tabs/sections for: identity (password, full name), permission flags (carts, logs, podcasts, panels, catches, voice tracking, web, admin), and three permission selectors (groups, services, feeds)
  - Build group list dialog showing all groups with add, edit, rename, and delete buttons
  - Build group editor dialog with fields for cart range, allowed services, color, type, shelf life, and cut life; display overlap warning inline when detected
  - Build group rename dialog with new name input and cascade progress indication
  - _Requirements: 2, 3_

- [ ] 8.2 (P) Build service management views
  - Build service list dialog with add (clone selector), edit, and delete buttons
  - Build service editor dialog with sections for: general settings, traffic import template with field mapper, music import template with field mapper, host permissions, test import with date picker, and autofill cart configuration
  - Build import field mapper sub-view for column offset and length mapping of cart, title, time, announcement type, data, and event ID fields
  - Display unsaved change indicator on import templates and prompt before discarding
  - _Requirements: 4_

- [ ] 8.3 (P) Build station core and sub-navigation views
  - Build station list dialog with add (exemplar clone selector), edit, and delete buttons
  - Build station editor dialog with core fields and navigation buttons to open: application profiles, audio hardware, serial ports, network adapters, audio routing, dropboxes, host variables, and automation plugins
  - Build network adapter info view (read-only display)
  - _Requirements: 5_

- [ ] 8.4 (P) Build station application profile views
  - Build on-air profile editor with card/port assignment fields, virtual log machine configuration, segue/transition settings, start mode selection, skin selector, hotkey editor access, and GPIO channel assignment
  - Build hotkey editor with keystroke capture, duplicate detection warning, and clone-from-host selector
  - Build library profile editor with input/output card, format, channels, bitrate, recording mode, trim settings, and CD metadata server
  - Build log editor profile editor with input/output card, format, waveform caption, start/end/record carts, and transition type
  - Build panel profile editor with card selector, default service, skin, flash and pause settings
  - Build deck configuration editor with record/play/audition deck settings including format, channels, bitrate, switcher assignment, threshold, and event carts
  - _Requirements: 6_

- [ ] 8.5 (P) Build station hardware configuration views
  - Build audio port configuration dialog with per-card settings for clock source, port type, mode, and input/output; include help dialog button
  - Build serial port configuration dialog with per-port baud rate, data bits, stop bits, parity, and termination; display in-use conflict error with matrix details
  - Build audio server configuration dialog with server name, command line, audio ports, and client list
  - Build automation plugin list dialog with add, edit, delete, and error log viewing
  - Build automation plugin editor dialog with script path, description, and configuration text
  - Build cart slot configuration dialog with grid layout, per-slot mode, play mode, stop action, service, and card/input/output
  - _Requirements: 7_

- [ ] 8.6 (P) Build switcher/matrix management views
  - Build matrix list dialog for a station with add, edit, and delete buttons
  - Build matrix editor dialog with type selector, connection parameters, and navigation buttons to: inputs, outputs, crosspoints, GPI triggers, GPO triggers, nodes, GPIO assignments, and vendor resources
  - Build endpoint list dialogs for input and output name/property editing
  - Build node list and editor dialogs with hostname, TCP port, description, password, and output count
  - Build GPI/GPO trigger editor with cart assignment per event and on/off state
  - _Requirements: 8_

- [ ] 8.7 (P) Build dropbox, feed, report, replicator, scheduler code, host variable, and system settings views
  - Build dropbox list dialog with add (duplicate), edit, and delete; dropbox editor dialog with all fields including scheduler code selection, date offset validation, and reset-to-defaults button
  - Build feed list dialog with add, edit, and delete; feed editor dialog with RSS metadata, XML templates with clipboard copy, encoding, superfeed, and image management sub-dialog
  - Build image list dialog with add, view (inline preview), and delete with in-use protection
  - Build report list dialog with add, edit, and delete; report editor dialog with filter criteria, station type, cart digits, pagination, export path, daypart, and service/station/group selection filters
  - Build replicator list dialog with add, edit, and delete; replicator editor dialog with type, station, URL, credentials, format, normalization, and group selection; cart state viewer with auto-refresh and repost button
  - Build scheduler code list dialog with add, edit, and delete; scheduler code editor with description
  - Build host variable list dialog with add, edit, and delete; host variable editor with name, value, and remark
  - Build system settings editor with all global fields, duplicate cart title deprecation warning confirmation flow, encoder profile list, system info dialog, and license viewer
  - _Requirements: 9, 10, 11, 12, 13, 14, 15_

- [ ] 9. Application composition root and wiring
- [ ] 9.1 Wire all services, adapters, and UI controllers in the application composition root
  - Instantiate all outbound repository adapters with the database connection
  - Instantiate all domain services (validation, cascade delete, group rename) and application services with their dependencies injected via constructor
  - Instantiate all UI adapter models and controllers, connecting them to the appropriate application services
  - Register all QML-exposed models and controllers with the QML engine context
  - Implement the application startup sequence: load configuration, initialize database connection, open login dialog, authenticate, configure main window privilege state, and present the main menu
  - Ensure application terminates on authentication failure or insufficient privileges
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16_

- [ ] 10. Unit tests for domain and validation logic
- [ ] 10.1 (P) Implement unit tests for validation rules and domain value objects
  - Test empty name rejection for all entity types
  - Test IP address format validation (valid and invalid cases)
  - Test cart number range validation
  - Test URL format validation
  - Test cart number range overlap detection (overlapping, adjacent, non-overlapping)
  - Test privilege gate logic: admin config enables correct items, admin RSS enables correct items, both enables all
  - _Requirements: 16_

- [ ] 10.2 (P) Implement unit tests for business constraint logic
  - Test self-deletion guard: current user ID matches delete target is blocked
  - Test system maintenance pool check: block removal of last station from pool
  - Test serial port conflict detection: port already assigned to a matrix is blocked with detail
  - Test hotkey duplicate detection: same keystroke assigned to two functions raises warning
  - Test group cart range overlap listing: return all overlapping group names
  - _Requirements: 2, 3, 5, 6, 7_

- [ ] 11. Integration tests for cascade operations and multi-table workflows
- [ ] 11.1 (P) Implement integration tests for authentication and permission workflows
  - Test login dialog through authentication service to user database through privilege check to menu state
  - Test user-group, user-service, and user-feed permission assignment and removal flows
  - _Requirements: 1, 2_

- [ ] 11.2 (P) Implement integration tests for cascade delete and rename operations
  - Test feed cascade delete: verify all child records across podcasts, images, permissions, and superfeed maps tables are removed
  - Test matrix cascade delete: verify all child records across inputs, outputs, nodes, GPIs, GPOs, and vendor resource tables are removed
  - Test replicator cascade delete: verify map and state records are removed
  - Test group rename cascade: verify all referencing records across carts, events, replicator maps, dropboxes, groups, audio permissions, and user permissions are updated
  - Test station exemplar cloning: verify encoder profile records are duplicated
  - _Requirements: 3, 5, 8, 10, 12_

- [ ] 12. End-to-end tests for critical admin workflows
- [ ] 12.1 Implement E2E tests covering login, user CRUD, group CRUD with cascade, and station configuration
  - Test valid login grants access; invalid credentials terminate; insufficient privileges terminate
  - Test create user, edit permissions, attempt self-delete (blocked), delete other user
  - Test create group, set cart range with overlap detection, rename with cascade, delete with cart warning
  - Test create station with exemplar cloning, configure application profiles and hardware, delete
  - _Requirements: 1, 2, 3, 5, 6, 7_

- [ ] 12.2 (P) Implement E2E tests covering service, feed, matrix, dropbox, replicator, and system settings workflows
  - Test create service, configure import templates, test import, delete with log warning
  - Test create feed, manage images, configure superfeed, delete with cascade
  - Test create matrix, add endpoints and nodes, assign GPI/GPO carts, delete with cascade
  - Test create dropbox, configure import rules, duplicate, delete
  - Test create replicator, view cart state with auto-refresh, delete
  - Test change system settings, toggle duplicate cart titles (deprecation warning), manage encoders
  - _Requirements: 4, 8, 9, 10, 12, 14_
