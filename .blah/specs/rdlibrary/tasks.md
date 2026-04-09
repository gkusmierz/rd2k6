# Implementation Plan

- [ ] 1. Domain entities, value objects, and core business rules
- [ ] 1.1 Define the Cart entity with all metadata fields (number, type, group, title, artist, album, year, label, client, agency, publisher, conductor, composer, user-defined field, song ID, BPM, forced length, average length, cut quantity, start/end datetime, notes, enforce-length flag, preserve-pitch flag, synchronous-playback flag, use-event-length flag, ownership, cut scheduling mode)
  - Include factory or builder for creating audio and macro cart variants
  - Business rule: title is mandatory in single-edit mode
  - Business rule: title uniqueness is configurable system-wide
  - Business rule: carts owned by voice tracking sessions cannot be deleted
  - _Requirements: 2, 3_

- [ ] 1.2 (P) Define the Cut entity with scheduling and playback metadata (cut name, cart number, description, outcue, ISRC, ISCI, source, length, weight, play order, play counter, evergreen flag, start/end datetime, start/end daypart, day-of-week flags)
  - Business rule: cuts with zero length are never valid
  - Business rule: duplicate play order values within a cart are prohibited
  - _Requirements: 4, 5, 9_

- [ ] 1.3 (P) Define value objects for type-safe identifiers and enumerations (cart number, cut name, cart type, group name, scheduler code, cart validity status, cut validity status, error info)
  - Use strong typing with comparison operators and constexpr construction
  - Cart validity: always-valid, conditionally-valid, future-valid, never-valid
  - Cut validity: always-valid, evergreen-valid, future-valid, never-valid
  - _Requirements: 1, 9_

- [ ] 1.4 Implement the cut validation domain service that evaluates scheduling eligibility
  - Priority evaluation order: (1) any cut always-valid marks cart as always-valid, (2) length must be greater than zero, (3) evergreen bypasses all date/time checks, (4) day-of-week match, (5) date range check, (6) daypart range check
  - Aggregate cut-level validity into cart-level validity
  - A single always-valid cut makes the entire cart always-valid
  - Depends on Cut entity and validity value objects from 1.2 and 1.3
  - _Requirements: 9_

- [ ] 1.5 (P) Define domain events for cross-component communication (cart added, cart modified, cart deleted, cut data changed, macro length changed)
  - Pure C++ event structs carrying relevant identifiers
  - _Requirements: 2, 4, 8, 13_

- [ ] 1.6* Unit tests for all domain entities, value objects, and the cut validation service
  - Test cart creation with mandatory title enforcement
  - Test title uniqueness checking logic
  - Test cut validity for each rule in the priority chain (zero length, evergreen, day-of-week, date range, daypart)
  - Test cart-level validity aggregation from multiple cuts
  - Test duplicate play order detection
  - Pure C++ tests with no Qt dependency
  - _Requirements: 2, 3, 4, 9_

- [ ] 2. Port interfaces (inbound and outbound contracts)
- [ ] 2.1 (P) Define outbound port interfaces for data persistence (cart repository, cut repository, group repository, scheduler code repository)
  - Cart repository: find by number, find all with filter criteria, save, remove, check title uniqueness, check recording event references
  - Cut repository: find by cart number, save, remove, check recording event references, check clipboard reference
  - Group repository: find all accessible groups for a user, get group colors
  - Scheduler code repository: find all codes, find codes for a cart, assign/remove codes
  - _Requirements: 1, 2, 3, 4, 10_

- [ ] 2.2 (P) Define outbound port interfaces for external services (audio engine, CD player, disc lookup, audio import, notification service, external editor launcher)
  - Audio engine: start recording, stop recording, play, stop, get meter levels, get alarm status
  - CD player: open device, eject, get track list, play track, stop
  - Disc lookup: query metadata by disc ID, return album/artist/track titles
  - Audio import: import audio file into a cut
  - Notification service: publish and subscribe to cart add/modify/delete events
  - External editor: launch configured editor for a given cut
  - _Requirements: 5, 6, 7, 11, 12, 13_

- [ ] 2.3 Define inbound port interfaces for application use cases (library service, cart editing service, cut management service, recording service, CD ripping service, macro editing service, reporting service)
  - Library service: search/filter carts, create cart, delete cart, get cart details
  - Cart editing service: load cart for editing, save cart metadata, bulk edit carts, validate before save
  - Cut management service: add cut, delete cut, copy/paste cut, import audio, launch external editor
  - Recording service: start/stop recording, configure channels, get recording status
  - CD ripping service: detect disc, lookup metadata, rip single track, rip batch, configure normalization and auto-trim
  - Macro editing service: add/edit/delete/copy/paste macro lines, run single line, run full cart, calculate total duration
  - Reporting service: generate cart report, cut report, CSV export
  - Depends on domain types from task 1
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 10_

- [ ] 3. Application services (business logic orchestration)
- [ ] 3.1 Implement the library service that orchestrates cart browsing, creation, and deletion
  - Build filter queries combining text, group, scheduler codes, and cart type filters
  - Support synchronous and asynchronous filtering modes based on station configuration
  - Handle cart creation (audio and macro types) with notification publishing
  - Handle cart deletion with safety checks: recording event references, voice tracking ownership, clipboard warnings
  - Publish add/modify/delete notification events after operations
  - _Requirements: 1, 2, 13_

- [ ] 3.2 Implement the cart editing service that manages metadata editing and validation
  - Load cart for single or bulk editing
  - Validate mandatory title, title uniqueness, enforce-length compatibility with timescaling limits
  - Detect and warn on duplicate play order values
  - Support group reassignment within user permissions
  - Manage notes and scheduler code assignment
  - Handle macro-specific options (synchronous playback, use-event-length)
  - _Requirements: 3_

- [ ] 3.3 Implement the cut management service for audio cut lifecycle operations
  - Add new cuts with maximum cut count enforcement
  - Delete cuts with recording event and clipboard safety checks
  - Copy/paste with single-selection validation, empty clipboard detection, and overwrite confirmation
  - Import audio files into cuts
  - Launch external editor with audio-exists validation
  - Publish data-changed events on any cut modification
  - _Requirements: 4_

- [ ] 3.4 (P) Implement the recording service for capturing audio into cuts
  - Manage transport state (record, play, stop) via the audio engine port
  - Apply auto-trim after recording stops
  - Manage channel count configuration (mono/stereo)
  - Forward meter levels and alarm status to the UI layer
  - _Requirements: 5_

- [ ] 3.5 (P) Implement the CD ripping service for both batch and single-track modes
  - Detect disc and retrieve track list via CD player port
  - Perform online metadata lookup via disc lookup port
  - Batch mode: manage track-to-cart assignments, rip all assigned tracks sequentially, report per-track and overall progress
  - Single-track mode: rip selected track into target cut, return metadata to caller
  - Configure normalization, auto-trim, and channel count
  - Publish notification events for newly created carts after ripping
  - _Requirements: 6, 7_

- [ ] 3.6 (P) Implement the macro editing service for managing macro command sequences
  - Add, edit, delete, copy, and paste macro lines
  - Execute a single macro line or the entire macro sequence
  - Calculate and maintain total macro duration
  - Publish length-changed events when duration changes
  - _Requirements: 8_

- [ ] 3.7 (P) Implement the reporting service for generating library reports and exports
  - Cart report: formatted output of carts matching current filter context
  - Cut report: formatted output including cut-level detail
  - CSV data dump with optional header row
  - All reports respect active filter state (text, type, group, scheduler code)
  - _Requirements: 10_

- [ ] 3.8 Implement the session manager for multi-user session handling and edit locking
  - Track current user session state
  - Lock session when editor dialogs open, deferring incoming deletion notifications
  - Process deferred notifications when editor closes
  - Detect user change during edit and refresh permissions and group list
  - _Requirements: 13_

- [ ] 3.9 Implement the notification manager for receiving and dispatching cross-client events
  - Subscribe to cart add/modify/delete events from the notification service port
  - On add: check if new cart matches current filter, signal UI to add it
  - On modify: signal UI to refresh the affected cart row
  - On delete: signal UI to remove cart, or defer if editor is open (coordinate with session manager)
  - Depends on session manager from 3.8
  - _Requirements: 2, 13_

- [ ] 3.10* Unit tests for application services with mock outbound ports
  - Test filter query construction for all criteria combinations
  - Test cart deletion safety checks (recording events, voice tracking, clipboard)
  - Test bulk editing applies changes to all selected carts
  - Test cut validity integration within cart editing (enforce-length warnings)
  - Test session locking and deferred notification processing
  - Test report generation correctness for all three report types
  - _Requirements: 1, 2, 3, 4, 9, 10, 13_

- [ ] 4. Persistence adapters (database access)
- [ ] 4.1 Implement the SQL cart repository adapter
  - Query carts with JOIN to group table for color, filtered by user permissions, text search, type, group, and scheduler codes
  - Save and update cart metadata
  - Remove carts from the database
  - Check for recording event references before deletion
  - Check for title uniqueness when system setting is enabled
  - _Requirements: 1, 2, 3_

- [ ] 4.2 (P) Implement the SQL cut repository adapter
  - Query cuts by cart number, ordered by play order or weight
  - Save and update cut metadata including scheduling fields
  - Remove cuts from the database
  - Check for recording event references before deletion
  - _Requirements: 4, 5, 9_

- [ ] 4.3 (P) Implement the SQL group repository adapter
  - Query all groups accessible by the current user based on permission table
  - Return group name and display color for cart list coloring
  - _Requirements: 1, 13_

- [ ] 4.4 (P) Implement the SQL scheduler code repository adapter
  - Query all available scheduler codes
  - Query codes assigned to a specific cart
  - Assign and remove scheduler code associations
  - _Requirements: 1, 3_

- [ ] 4.5 (P) Implement the report generator adapter
  - Generate formatted cart report from filtered query results
  - Generate formatted cut report with cut-level detail
  - Generate CSV export with configurable header row
  - _Requirements: 10_

- [ ] 4.6* Integration tests for persistence adapters with in-memory SQLite
  - Test cart CRUD operations with filter criteria
  - Test cut CRUD and ordering
  - Test group permission filtering
  - Test scheduler code assignment and removal
  - Test report output format for all three report types
  - _Requirements: 1, 2, 3, 4, 10_

- [ ] 5. External service adapters
- [ ] 5.1 (P) Implement the audio engine adapter for recording and playback
  - Connect to the audio engine service for record, play, and stop operations
  - Provide meter level updates and alarm status signals
  - Handle auto-trim configuration
  - Support mono and stereo channel selection
  - _Requirements: 5, 11_

- [ ] 5.2 (P) Implement the CD player and disc lookup adapters
  - CD player: open device, detect media changes, get track list, play/stop tracks, eject
  - Disc lookup: query online metadata service for album, artist, and track titles
  - Support launching browser to the disc lookup service for additional metadata
  - _Requirements: 6, 7_

- [ ] 5.3 (P) Implement the audio import adapter
  - Import audio files into cuts, supporting configured encoding formats
  - Handle normalization level and auto-trim settings during import
  - Support channel count configuration
  - _Requirements: 4, 6, 7_

- [ ] 5.4 (P) Implement the notification service adapter for inter-client communication
  - Publish cart add/modify/delete events to the notification bus
  - Subscribe to events from other clients
  - Best-effort delivery semantics
  - _Requirements: 2, 13_

- [ ] 5.5 (P) Implement the external editor launcher adapter
  - Launch the configured external audio editor application for a given cut
  - Validate that audio exists in the cut before launching
  - _Requirements: 4_

- [ ] 6. UI adapter layer (QML models and controllers)
- [ ] 6.1 Implement the cart list model exposing filtered cart data to QML
  - Expose all cart columns as model roles (number, group, length, talk time, title, artist, dates, etc.)
  - Support hierarchical display with cuts as child items under parent carts
  - Apply group color coding to rows
  - Handle real-time list updates from notification events (add, modify, remove cart rows)
  - Expose filter controls: text, group dropdown, scheduler code dropdowns, type checkboxes, matches-only toggle
  - Support both synchronous and asynchronous filter update modes
  - Expose drag-and-drop capability toggle and drag data provision
  - _Requirements: 1, 2, 12, 13_

- [ ] 6.2 Implement the cart editor controller for metadata editing
  - Expose all editable cart fields as properties with change notifications
  - Support bulk-edit mode where changes apply to multiple carts
  - Expose validation feedback (missing title, duplicate title, enforce-length warnings, duplicate play orders)
  - Expose group selection limited to user-permitted groups
  - Provide actions for opening notes editor and scheduler codes editor
  - Handle macro-specific options for macro cart type
  - _Requirements: 3_

- [ ] 6.3 Implement the audio cut manager model and controller
  - Expose cut list for the current cart with all metadata columns
  - Provide actions for add, delete, copy, paste, import, edit, record, rip, and external editor
  - Expose validation feedback (max cuts reached, clipboard empty, single selection required, overwrite warning)
  - Forward data-changed events to parent cart editor
  - _Requirements: 4_

- [ ] 6.4 (P) Implement the recording dialog controller
  - Expose cut metadata fields (description, outcue, ISRC, ISCI, source, weight, play dates, play counter)
  - Expose transport controls (record, play, stop) with state management
  - Expose meter levels and recording timer
  - Expose channel count configuration (mono/stereo)
  - Expose air date scheduling, daypart scheduling, day-of-week selection with set-all/clear-all
  - Expose evergreen flag toggle
  - Expose alarm status indicator
  - _Requirements: 5_

- [ ] 6.5 (P) Implement the batch CD ripper controller
  - Expose CD track list with metadata from disc lookup
  - Expose track-to-cart assignment management (single and multi-track modes)
  - Expose rip action with overall and per-track progress indicators
  - Expose transport controls (play, stop, eject)
  - Expose normalization, auto-trim, and channel count configuration
  - Expose action to open browser for disc lookup service
  - Expose action to modify cart label for a selected track assignment
  - _Requirements: 6_

- [ ] 6.6 (P) Implement the single-track ripper controller
  - Expose CD track list with metadata from disc lookup
  - Expose rip action for selected track with progress indicator
  - Expose transport controls (play, stop, eject)
  - Expose normalization, auto-trim, and channel count configuration
  - Return metadata (title, artist, album, label) to the calling component on completion
  - _Requirements: 7_

- [ ] 6.7 (P) Implement the macro editor model and controller
  - Expose macro line list with command details and durations
  - Provide actions for add, edit, delete, copy, paste macro lines
  - Provide actions for run-line and run-cart execution
  - Expose total macro duration with change notification to parent cart editor
  - _Requirements: 8_

- [ ] 6.8 (P) Implement the reports dialog controller
  - Expose report type selection (cart report, cut report, CSV dump)
  - Provide generate action that produces the selected report from current filter context
  - Expose CSV header row toggle option
  - _Requirements: 10_

- [ ] 6.9 (P) Implement the note bubble and audio player controllers
  - Note bubble: expose cart notes tooltip data triggered by hover events
  - Audio player: expose play/stop controls for previewing the selected cart's audio
  - Support keyboard shortcut toggle for playback
  - _Requirements: 11_

- [ ] 7. QML views and dialogs
- [ ] 7.1 Build the main window view with cart list, filter controls, and action toolbar
  - Multi-column list displaying all cart fields with group color coding
  - Hierarchical display with cuts as expandable child items
  - Filter bar with text field, group dropdown, two scheduler code dropdowns, type checkboxes, matches-only toggle
  - Synchronous or asynchronous filter mode (search button appears in async mode)
  - Clear button to reset filter and refresh
  - Action toolbar with buttons for add audio cart, add macro cart, edit, delete, rip CD
  - Drag-and-drop toggle checkbox (visible when station configuration enables it)
  - Note bubble tooltip on cart row hover (when enabled)
  - Embedded audio player for preview
  - Station name and current user in window title
  - Window geometry save/restore between sessions
  - _Requirements: 1, 2, 11, 12_

- [ ] 7.2 Build the cart editor dialog view
  - Read-only display of cart type, number, and group
  - Editable fields for all metadata (title, artist, album, year, label, client, agency, publisher, conductor, composer, user-defined, song ID, BPM)
  - Enforce-length toggle with forced length input
  - Cut scheduling mode selector (weight-based or play-order)
  - Buttons for notes editor and scheduler codes editor
  - Macro-specific controls (synchronous playback, use-event-length) visible only for macro carts
  - Group selector dropdown limited to permitted groups
  - Embedded audio cut manager panel (for audio carts) or macro editor panel (for macro carts)
  - Validation error display area
  - _Requirements: 3, 4, 8_

- [ ] 7.3 (P) Build the recording dialog view
  - Cut metadata display and editing fields
  - Transport controls (record, play, stop) with visual state feedback
  - Audio level meters and recording timer
  - Channel count selector (mono/stereo)
  - Air date scheduling with datetime range pickers
  - Daypart scheduling with time-of-day range pickers
  - Day-of-week checkboxes with set-all and clear-all buttons
  - Evergreen flag toggle
  - Alarm status indicator
  - _Requirements: 5_

- [ ] 7.4 (P) Build the batch CD ripper dialog view
  - CD track list with metadata columns (populated from disc lookup)
  - Track-to-cart assignment controls for single and multi-track modes
  - Rip button with overall and per-track progress bars
  - Transport controls (play, stop, eject)
  - Normalization level, auto-trim, and channel count settings
  - Browser link to disc lookup service
  - Cart label modification for selected track assignment
  - _Requirements: 6_

- [ ] 7.5 (P) Build the single-track ripper dialog view
  - CD track list with metadata columns
  - Rip button with progress indicator
  - Transport controls (play, stop, eject)
  - Normalization, auto-trim, and channel count settings
  - _Requirements: 7_

- [ ] 7.6 (P) Build the macro editor and macro command editor views
  - Macro line list with command and duration columns
  - Buttons for add, edit, delete, copy, paste
  - Run-line and run-cart execution buttons
  - Total duration display
  - Macro command editor sub-dialog for editing individual commands
  - _Requirements: 8_

- [ ] 7.7 (P) Build the reports dialog view
  - Report type radio selection (cart report, cut report, CSV dump)
  - CSV header row checkbox (visible when CSV selected)
  - Generate button
  - Report output display area
  - _Requirements: 10_

- [ ] 7.8 (P) Build the notes editor and scheduler codes editor dialog views
  - Notes editor: free-text editor for cart notes
  - Scheduler codes editor: list of available codes with assign/remove controls
  - _Requirements: 3_

- [ ] 8. Application composition and system integration
- [ ] 8.1 Wire the composition root connecting all ports, adapters, and application services
  - Instantiate all persistence adapters with database connection
  - Instantiate all external service adapters
  - Instantiate application services with injected outbound ports
  - Instantiate UI adapter models and controllers with injected inbound ports
  - Expose models and controllers to the QML engine
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13_

- [ ] 8.2 Implement window lifecycle management (geometry save/restore, session change handling)
  - Save and restore main window geometry between sessions
  - Refresh group list and cart display on user session change
  - Handle application startup command-line option validation
  - _Requirements: 1, 13_

- [ ] 8.3 Connect notification flow end-to-end across all layers
  - Verify cart add/modify/delete notifications propagate from application services through adapters to QML views
  - Verify deferred deletion processing when editor dialog is open and then closed
  - Verify that user change during edit triggers permission refresh
  - _Requirements: 2, 13_

- [ ] 9. Integration and end-to-end testing
- [ ] 9.1 Integration tests for multi-layer workflows
  - Create an audio cart, add a cut, import audio, verify it appears in filtered list
  - Edit cart metadata, save, verify changes persist across layers
  - Multi-client notification: create a cart in one session, verify it appears in another session's filtered view
  - Session locking: receive a delete notification while editor is open, verify deferred processing after close
  - _Requirements: 1, 2, 3, 13_

- [ ] 9.2 Integration tests for recording and CD ripping flows
  - Recording flow: connect to audio engine, record, stop, verify auto-trim applied and cut length updated
  - CD ripping with metadata lookup: detect disc, verify lookup integration, rip track, verify metadata populated
  - Cut validation: create cuts with various scheduling configurations, verify computed validity states match expected values
  - _Requirements: 5, 6, 7, 9_

- [ ] 9.3* End-to-end tests for critical user journeys via QML UI automation
  - Browse library, apply filters, verify cart list updates correctly
  - Open cart editor, edit metadata, save, verify persistence
  - Delete cart with confirmation, verify removal and notification
  - Rip CD track, verify metadata populated from disc lookup
  - Generate each report type and verify content matches filter
  - _Requirements: 1, 2, 3, 6, 10_
