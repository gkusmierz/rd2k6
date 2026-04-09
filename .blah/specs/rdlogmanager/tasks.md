# Implementation Plan

- [ ] 1. Domain entities and value objects for scheduling building blocks
- [ ] 1.1 (P) Define the Event domain entity with all scheduling properties
  - Model an event with name, nested event reference, color, pre-position offset, hard start time, grace time options, first transition type, autofill with slop threshold, and import source configuration (none, scheduler, file)
  - Include scheduler import settings: scheduler group, artist separation, title separation, and up to two required scheduler codes
  - Include start/end slop times for import source configuration
  - Value objects for event name, transition type (play, segue, stop), import source type, and grace time mode (immediate, next event, wait with duration)
  - _Requirements: 1.1, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.25_

- [ ] 1.2 (P) Define the EventLine domain entity for import list items
  - Model import line items representing carts, note markers, and voice track markers within an event
  - Each line carries a transition type, ordering index, and optional text content (for notes and voice track annotations)
  - Support pre-import and post-import list classification
  - _Requirements: 1.8, 1.15, 1.16, 1.17, 1.18_

- [ ] 1.3 (P) Define the Clock domain entity with event assignments and scheduler rules
  - Model a clock with name, unique short code (3-character), color, and artist separation value
  - Include an ordered list of clock lines, each referencing an event with start/end times within the hour
  - Model scheduler rule lines with max-in-a-row, minimum-wait, and not-after/or-after code constraints
  - Value objects for clock short code and scheduler rule parameters
  - _Requirements: 2.1, 2.4, 2.5, 2.12, 2.13, 2.15, 2.16_

- [ ] 1.4 (P) Define the Grid domain model for weekly service schedules
  - Model a grid as 168 hour slots (7 days x 24 hours) per service, each mapping to an optional clock assignment
  - Provide day-of-week and hour index mapping utilities
  - _Requirements: 3.2, 3.4, 3.8_

- [ ] 1.5 (P) Define the Log generation state model and import link states
  - Model log lifecycle states: no log, log created, music merged, traffic merged, fully merged
  - Model import link states per source: link missing, link done, blocked (no markers)
  - Include voice track count tracking for recreation confirmation flow
  - Define domain rules for music-before-traffic ordering enforcement
  - _Requirements: 4.3, 4.4, 4.6, 4.7, 4.12, 4.13_

- [ ] 1.6 (P) Define domain validation services for events and clocks
  - Event name uniqueness check logic
  - Clock short code uniqueness check logic
  - Import list transition fixup rules: when pre-position or timed start is enabled, automatically set first transition to stop and adjust post-import permissions
  - Report date range validation (end date must not be before start date)
  - _Requirements: 1.4, 1.15, 2.3, 2.12, 2.13, 4.23, 5.1_

- [ ] 2. Port interfaces for all scheduling domains
- [ ] 2.1 (P) Define outbound port interfaces for event persistence
  - Repository interface for CRUD operations on events and event lines
  - Query events with optional service filter
  - Query event usage in clocks (for deletion warning)
  - Rename event with cascade to clock lines, event permissions, and event lines
  - _Requirements: 1.1, 1.2, 1.4, 1.19, 1.22, 1.23_

- [ ] 2.2 (P) Define outbound port interfaces for clock persistence
  - Repository interface for CRUD operations on clocks, clock lines, clock permissions, and rule lines
  - Query clocks with optional service filter
  - Rename clock with cascade to service clock assignments
  - Import scheduler rules from another clock
  - _Requirements: 2.1, 2.10, 2.17, 2.18, 2.19_

- [ ] 2.3 (P) Define outbound port interfaces for grid and log operations
  - Grid repository interface for reading and writing 168 hour-slot assignments per service
  - Bulk assignment for "set all clocks" operation
  - Log repository interface for checking log existence, voice track counts, and log record deletion
  - Import file availability check interface (filesystem port)
  - _Requirements: 3.2, 3.5, 3.8, 4.1, 4.3, 4.15, 4.16_

- [ ] 2.4 (P) Define outbound port interfaces for reporting and notifications
  - Report repository interface for querying available reports by service
  - Report output file generation and access
  - Notification port for publishing log change events
  - _Requirements: 4.17, 5.1, 5.2, 5.3_

- [ ] 2.5 (P) Define inbound port interfaces for all scheduling use cases
  - Event service interface covering list, create, edit, rename, delete, save, save-as operations
  - Clock service interface covering list, create, edit, rename, delete, save, save-as, clone event, import rules
  - Grid service interface covering get assignments, set hour clock, set all clocks, clear hour
  - Log generation service interface covering create log, merge music, merge traffic, check status, purge
  - Report service interface covering generate report, list reports, open report viewer
  - CLI handler interface covering log generation and report generation with flags
  - _Requirements: 1.1, 1.3, 1.19, 1.20, 2.1, 2.2, 2.10, 2.11, 3.1, 3.3, 3.5, 3.6, 4.2, 4.5, 4.8, 4.10, 4.15, 4.18, 5.1, 5.2_

- [ ] 3. Application services implementing scheduling business logic
- [ ] 3.1 Event management application service
  - Implement the event service inbound port, orchestrating domain validation and outbound repository
  - Create event flow: validate name uniqueness, insert into repository, return new event
  - Edit event flow: load event properties, apply changes, validate import list transitions, persist
  - Delete event flow: check clock references, report affected clocks, delete on confirmation
  - Rename event flow: cascade update to all references (clock lines, permissions, event lines)
  - Save-as flow: copy event with all import lines and permissions under a new name
  - Service permission assignment with dual-list of available and assigned services
  - Emit structured error signals for duplicate names, events in use, and persistence failures
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 1.19, 1.20, 1.21, 1.22, 1.23, 1.24, 1.25_

- [ ] 3.2 Clock management application service
  - Implement the clock service inbound port, orchestrating domain validation and outbound repository
  - Create clock flow: prompt for name, validate uniqueness, insert, open editor
  - Edit clock flow: load clock with event assignments and scheduler rules, manage modified state
  - Save flow: validate short code is non-empty and unique, persist all clock lines, permissions, and rules
  - Save-as flow: copy clock with all event assignments, permissions, and scheduler rules under a new name
  - Delete clock flow: remove clock and all associated lines, permissions, and rules
  - Rename clock flow: cascade update to service clock assignments
  - Clone event entry within clock (duplicate with same configuration)
  - Import scheduler rules from another clock
  - Emit structured errors for duplicate names, empty/duplicate short codes, and persistence failures
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 2.17, 2.18, 2.19, 2.20_

- [ ] 3.3 Grid management application service
  - Implement the grid service inbound port
  - Load service list with name and description
  - Load 168 hour-slot assignments for a service
  - Assign a clock to a specific hour slot, persisting immediately
  - Bulk-assign one clock to all 168 slots
  - Clear a specific hour assignment
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3.4 Log generation and lifecycle application service
  - Implement the log generation service inbound port
  - Create log flow: generate from service grid for a selected date, emit progress updates, publish notification
  - Recreate protection: check existing log, warn about data loss, check voice track count for secondary confirmation
  - Merge music flow: import music schedule file, check prior merge state, handle confirmation for remerge
  - Merge traffic flow: import traffic schedule file, enforce music-before-traffic ordering when both slots exist
  - Relink blocking: detect missing import markers when data source is already linked, block operation
  - Periodically scan for import file availability and track status (available/merged indicators)
  - Purge flow: query log existence dates, delete log records for a service and date on confirmation
  - Publish notification events on log creation and modification
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16, 4.17_

- [ ] 3.5 (P) Report generation application service
  - Implement the report service inbound port
  - List available reports filtered by service
  - Generate report for a date range and service, producing an output file
  - Provide file information for the generated report
  - Open report file in the system's configured external viewer
  - Emit error signal when report file cannot be opened
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3.6 CLI handler for batch log and report generation
  - Parse command-line arguments: service name, date offset, protect-existing flag, music/traffic merge flags
  - Execute log generation with protect-existing logic: exit with protected-output code if log exists and flag is set
  - Execute music merge with protect-existing logic: exit with link-failed code if music already imported
  - Detect missing import markers when data source is already linked, exit with link-failed code
  - Parse report command-line arguments: report name, service name, start/end date offsets
  - Validate date range (end offset must not be less than start offset)
  - Execute report generation with protect-existing flag for output file
  - Return specific exit codes for each error scenario (no interactive prompts)
  - _Requirements: 4.18, 4.19, 4.20, 4.21, 4.22, 4.23, 4.24_

- [ ] 4. Persistence adapters for all scheduling data
- [ ] 4.1 (P) SQL adapter for event and event line repositories
  - Implement outbound event repository port using Qt SQL
  - Query events table with optional service filter join through event permissions
  - CRUD for events and event lines tables
  - Cascade rename across clock lines, event permissions, and event lines
  - Query event usage in clocks table for deletion warning
  - Translate SQL errors to structured domain error info
  - _Requirements: 1.1, 1.2, 1.4, 1.19, 1.22, 1.23, 1.24_

- [ ] 4.2 (P) SQL adapter for clock, clock line, permission, and rule repositories
  - Implement outbound clock repository port using Qt SQL
  - CRUD for clocks, clock lines, clock permissions, and rule lines tables
  - Cascade rename across service clock assignments
  - Import scheduler rules from another clock (copy rule lines)
  - Short code uniqueness validation at the database level
  - Translate SQL errors to structured domain error info
  - _Requirements: 2.1, 2.10, 2.11, 2.12, 2.13, 2.17, 2.18, 2.19_

- [ ] 4.3 (P) SQL adapter for grid assignments and log records
  - Implement outbound grid repository port: read/write 168 service clock assignments
  - Implement bulk "set all clocks" as a batch operation
  - Implement log record queries: log existence check, voice track count, log record deletion
  - Query services table for service list display
  - _Requirements: 3.2, 3.5, 3.8, 4.1, 4.6, 4.7, 4.15, 4.16_

- [ ] 4.4 (P) Filesystem adapter for import file scanning and report output
  - Implement filesystem port for checking music and traffic import file availability
  - Implement periodic scanning with configurable interval
  - Implement report output file writing and external viewer launch
  - _Requirements: 4.3, 4.14, 5.2, 5.3, 5.4_

- [ ] 4.5 (P) Notification adapter for log change events
  - Implement notification port for publishing log creation and modification events
  - Integrate with the inter-process notification bus used by other Rivendell modules
  - _Requirements: 4.17_

- [ ] 5. UI adapters (QML models and controllers) for all domains
- [ ] 5.1 (P) Event list model and event editor controller
  - QAbstractListModel exposing events with name, properties, nested event, and color columns
  - Service filter property for restricting visible events
  - Controller for the event editor: library browser with text search, group filter, and audio/macro type filter
  - Controller managing pre-import and post-import lists, drag-and-drop handling, validation triggering
  - Expose timing configuration properties (pre-position, hard start, grace time, transitions, autofill, import source)
  - Expose scheduler import properties (group, artist separation, title separation, scheduler codes)
  - Support note marker and voice track marker insertion with text editing
  - Save and save-as operations exposed to QML
  - Service permissions dual-list model
  - Error signal propagation to QML
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.24_

- [ ] 5.2 (P) Clock list model and clock editor controller
  - QAbstractListModel exposing clocks with name, short code, and color columns
  - Support both list mode and picker mode for clock selection in grids and scheduler rule imports
  - Controller for the clock editor: manage event list with add, clone, edit, delete via context menu
  - Expose modified state tracking and three-way close prompt (save, discard, cancel)
  - Controller for event assignment dialog: event selection and time configuration
  - Save and save-as with short code validation
  - Service permissions dual-list model
  - Scheduler rules model with artist separation and per-code rule list
  - Code rule editor controller for max-in-a-row, minimum-wait, not-after/or-after constraints
  - Import rules from another clock
  - Error signal propagation to QML
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 2.17, 2.20_

- [ ] 5.3 (P) Grid editor controller
  - Controller exposing 168 hour-slot buttons organized by day of week
  - Display clock short code and color on each assigned button
  - Single-click opens clock picker, right-click shows context menu (edit clock, clear assignment)
  - "Set All Clocks" action exposed to QML
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 5.4 (P) Log generator controller and service log purge controller
  - Controller for log generation dialog: service selector, date picker, create/merge music/merge traffic actions
  - Expose status indicators (green/red/neutral) for music and traffic import file availability and merge state
  - Enforce button state rules: traffic disabled until music merged when both slots configured
  - Multi-level confirmation flow for log recreation (base warning + voice track warning)
  - Confirmation flow for music/traffic remerge
  - Block relink operation when no import markers and already linked
  - Progress indicator during log generation
  - Periodic import file availability scanning
  - Calendar widget controller for purge dialog: highlight dates with existing log data, handle delete confirmation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16_

- [ ] 5.5 (P) Report date picker and report viewer controllers
  - Controller for report date picker: date range selection, report selector filtered by service
  - Controller for report viewer: display report file info, open in external viewer
  - Error handling for file access failures
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. QML views for all application screens
- [ ] 6.1 Main window with navigation to all five panels
  - Top-level application window with navigation buttons: Events, Clocks, Grids, Logs, Reports
  - Follow global design system for dark theme, typography, spacing, and accessibility
  - Requires task 5 UI adapters to be available for binding
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 6.2 (P) Events panel views: events list, add event dialog, event editor with library browser and import lists
  - Events list view with filterable multi-column display, service filter dropdown, and CRUD buttons (add, edit, rename, delete)
  - Add event dialog with name input and duplicate name error display
  - Event editor with split-panel layout: library browser (text search, group filter, content type filter) on left, event properties on right
  - Pre-import and post-import list views with drag-and-drop from library, context menus for notes, voice tracks, and transition types
  - Timing configuration panel: pre-position toggle with time editor, hard start with grace time options, transition type selector
  - Import source configuration panel: source type selector (none, scheduler, file) with corresponding fields
  - Scheduler import panel: group selector, artist/title separation, scheduler code selectors
  - Service permissions dialog with dual-list layout
  - Delete confirmation dialog listing affected clocks
  - Rename dialog
  - Color picker for event color
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22, 1.23, 1.24, 1.25_

- [ ] 6.3 (P) Clocks panel views: clocks list, clock editor with visual representation, scheduler rules, and event assignment
  - Clocks list view with filterable display, CRUD buttons, and picker mode support
  - Clock editor with split-panel layout: event list with context menu (add, clone, edit, delete) on left, visual clock pie chart on right
  - Real-time update of visual clock representation when event list changes
  - Event assignment dialog: event picker integration, start/end time configuration
  - Three-way close prompt when changes are unsaved (save, discard, cancel)
  - Short code field with validation warnings
  - Save-as dialog
  - Service permissions dialog with dual-list layout
  - Scheduler rules dialog: artist separation field, code rule list with edit capability
  - Code rule editor dialog: max-in-a-row, minimum-wait, not-after/or-after fields
  - Import rules from another clock via clock picker
  - Rename dialog
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 2.17, 2.18, 2.19, 2.20_

- [ ] 6.4 (P) Grids panel views: services list and 7x24 grid editor
  - Services list showing name and description
  - Grid editor with 168 hour buttons arranged in a 7-day by 24-hour matrix
  - Buttons display clock short code and clock color
  - Single-click opens clock picker, right-click context menu for edit clock and clear assignment
  - "Set All Clocks" button
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 6.5 (P) Logs panel views: services list, log generator dialog, and purge dialog with calendar
  - Services list view with log date range information
  - Log generator dialog: service selector, date picker, create/merge music/merge traffic buttons
  - Color-coded status indicators: green (available/merged), red (missing/needed), neutral (not applicable)
  - Progress indicator during log generation
  - Multi-level confirmation dialogs: log recreation warning, voice track deletion warning, remerge confirmation
  - Relink error display when import markers are missing
  - Traffic button disabled state when music not yet merged
  - Purge dialog with calendar widget highlighting dates with existing log data
  - Delete confirmation dialog
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16, 4.17_

- [ ] 6.6 (P) Reports panel views: report date picker and report viewer
  - Report date picker with start/end date fields and report selector filtered by service
  - Generate button triggering report creation
  - Report viewer dialog showing file information and open-in-viewer button
  - Error display for file access failures
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7. Application composition and CLI entry point
- [ ] 7.1 Application composition root wiring all services together
  - Wire all outbound port adapters (SQL repositories, filesystem adapter, notification adapter) to application services via dependency injection
  - Wire all application services (inbound ports) to UI adapter models and controllers
  - Register all QML models and controllers with the QML engine
  - Set up the main window and navigation
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 7.2 CLI entry point with argument parsing and exit code handling
  - Detect CLI mode from command-line arguments versus GUI mode
  - Parse log generation arguments: service name, date offset, protect-existing flag, music/traffic flags
  - Parse report generation arguments: report name, service name, start/end date offsets, protect-existing flag
  - Execute operations without GUI, returning appropriate exit codes
  - _Requirements: 4.18, 4.19, 4.20, 4.21, 4.22, 4.23, 4.24_

- [ ] 8. Testing
- [ ] 8.1 (P) Unit tests for domain entities, value objects, and validation services
  - Test event name uniqueness validation
  - Test clock short code uniqueness validation
  - Test import list transition fixup logic (pre-position and timed start rules)
  - Test log link state transitions (missing, done, blocked without markers)
  - Test report date range validation
  - Test grid hour-to-day/hour index mapping for all 168 slots
  - _Requirements: 1.4, 1.15, 2.3, 2.12, 2.13, 4.12, 4.23_

- [ ] 8.2 (P) Integration tests for cross-domain workflows
  - Test event-to-clock dependency: create event, add to clock, verify deletion warning lists the clock name
  - Test clock-to-grid assignment: create clock, assign to grid hour, verify grid displays clock code and color
  - Test log generation pipeline: configure service grid, generate log, verify log records exist in database
  - Test music/traffic merge ordering: verify traffic button stays disabled until music is merged when both slots exist
  - Test CLI log generation with protect-existing flag: verify all exit codes for protection scenarios
  - _Requirements: 1.22, 2.5, 3.4, 4.5, 4.8, 4.10, 4.13, 4.18, 4.19, 4.20, 4.21_

- [ ] 8.3* E2E tests for critical user workflows
  - Test creating a new event with timing configuration and import items, verifying it appears in the events list
  - Test creating a clock with multiple event assignments, verifying the visual representation updates
  - Test assigning clocks to a service grid using the 7x24 editor, verifying assignments persist
  - Test generating a log, merging music and traffic, verifying status indicators update correctly
  - Test attempting to recreate a log with voice tracks, verifying two-level confirmation flow
  - _Requirements: 1.3, 1.8, 1.9, 2.2, 2.5, 2.20, 3.3, 3.4, 4.5, 4.7, 4.8, 4.10_
