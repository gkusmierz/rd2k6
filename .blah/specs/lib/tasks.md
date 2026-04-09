# Implementation Plan

- [ ] 1. Project scaffolding and build system setup
- [ ] 1.1 Set up the QMake project structure with subdirectory template
  - Create the top-level `.pro` file with SUBDIRS for domain, ports, adapters, app, ui, and tests
  - Configure the domain library to compile as a static library with `QT -= core gui` to enforce framework isolation
  - Configure ports as header-only static library with `QT -= core gui`
  - Configure adapters to link Qt Core, SQL, Multimedia, and Network, plus domain and ports libraries
  - Configure app layer with minimal Qt (signal/slot support) linking domain and ports
  - Set up the tests subdirectory mirroring the source structure (unit/domain, unit/adapters, integration, e2e)
  - Enable C++20 standard, strict compiler warnings (`-Wall -Wextra -Wpedantic -Werror`), and clang-tidy
  - _Requirements: 12.1_

- [ ] 1.2 (P) Define the domain error types and common value objects
  - Implement the ErrorInfo struct with ErrorCategory and ErrorSeverity enumerations in pure C++
  - Implement foundational value objects: CartNumber, CartType (Audio, Macro), Duration, CutName
  - Ensure all value objects are immutable after construction with `constexpr` constructors and `operator<=>` where appropriate
  - Use `std::optional` for optional values, `[[nodiscard]]` on all getters
  - _Requirements: 1.1, 1.2, 20.1_

- [ ] 2. Cart and cut domain entities
- [ ] 2.1 Implement the Cart domain entity with metadata and business rules
  - Create the Cart entity with fields: number, type, title, artist, group, forced length, average length, play order, validity status, and scheduler codes
  - Implement cart creation validation: non-empty title, group assignment, cart number range enforcement against group configuration
  - Implement title uniqueness validation when the system-wide setting requires it
  - Implement auto-assignment of the next available cart number from the group's configured range
  - Implement cart removal logic that cascades to all associated cuts, scheduler codes, and related data
  - Implement XML representation generation for cart metadata
  - Implement bulk metadata operations via a wave data transfer object (get/set metadata)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.9, 1.10, 1.11_

- [ ] 2.2 Implement the Cut domain entity with markers and validity rules
  - Create the Cut entity with fields: cut number, markers (start, end, segue start/end, talk start/end, hook start/end, fade-up, fade-down), date range, daypart, day-of-week, weight, play counter, and audio length
  - Implement sequential cut numbering within a cart when adding new cuts
  - Implement cut validity evaluation across multiple dimensions: date range, daypart, time of day, day of week, and audio existence (length greater than zero)
  - Return validity status as one of: never valid, conditionally valid, always valid, or future daypart valid
  - Implement copy, auto-trim, and auto-segue operations on cuts
  - Implement gain adjustment in 0.01 dB increments
  - _Requirements: 1.8, 2.3, 2.4, 7.1, 7.8_

- [ ] 2.3 Implement cut rotation algorithms (weighted and sequential)
  - Implement weighted rotation: select the cut with the lowest play-count-to-weight ratio among valid cuts
  - Implement sequential rotation: follow play order, wrap at end
  - Increment the selected cut's local counter after weighted rotation selection
  - Implement evergreen cut fallback: if no valid cuts exist, select the evergreen cut
  - Report that the cart has no playable content when no valid or evergreen cuts exist
  - _Requirements: 2.1, 2.2, 2.5, 2.6_

- [ ] 3. Cart and cut ports and persistence adapters
- [ ] 3.1 Define outbound port interfaces for cart and cut persistence
  - Define ICartRepository with operations: find by number, find all, find by group, save, remove, check existence, get next available number for group
  - Define ICutRepository with operations: find by cart and cut number, find all for cart, save, remove, check existence
  - Define IGroupRepository with operations: find by name, get cart number range, check title uniqueness setting
  - All interfaces use only domain types in their signatures
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 3.2 (P) Implement SQL persistence adapters for cart, cut, and group repositories
  - Implement SqlCartRepository using Qt SQL to persist and query the CART and CART_SCHED_CODES tables
  - Implement SqlCutRepository for the CUTS table with all marker fields
  - Implement SqlGroupRepository for the GROUPS table with cart number range and permission queries
  - Translate SQL errors to domain ErrorInfo structs
  - _Requirements: 1.1, 1.7, 1.8, 1.9_

- [ ] 3.3 (P) Unit tests for cart and cut domain logic
  - Test cart number range validation against group configuration
  - Test title uniqueness enforcement with system setting toggle
  - Test auto-assignment of next available cart number
  - Test cut validity across all dimensions (date, daypart, day-of-week, audio existence)
  - Test weighted rotation algorithm: correct selection by play-count-to-weight ratio
  - Test sequential rotation: correct ordering and wrap-around
  - Test evergreen fallback when no valid cuts exist
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 4. Log domain entities and management
- [ ] 4.1 Implement Log, LogEvent, and LogLine domain entities
  - Create the Log entity representing a broadcast playout log with service assignment, date, lock state, and metadata
  - Create LogLine as an ordered element carrying: cart number, transition type (play, segue, stop), time type (relative, hard), source (manual, traffic, music, template, tracker), playback status, and type (cart, marker, chain, track, link)
  - Create LogEvent as the ordered collection of LogLine objects supporting size and range queries
  - Enforce valid service assignment during log creation; produce error when no service is selected
  - _Requirements: 3.1, 3.2, 3.3, 3.9_

- [ ] 4.2 Implement log manipulation and validation operations
  - Implement insert, remove, move, and copy operations on log lines while preserving transition types
  - Implement log validation: verify referenced carts exist and have valid cuts for the log date
  - Implement total length calculation for a log or any sub-range of lines
  - Implement XML representation generation for a log and its lines
  - Implement log locking to prevent concurrent edits by multiple users
  - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 4.3 Define log persistence ports and implement SQL adapters
  - Define ILogRepository with operations: find by name, save, remove, lock, unlock, check lock, list by service/date
  - Implement SqlLogRepository for the LOGS and LOG_LINES tables
  - Translate SQL errors to domain ErrorInfo
  - _Requirements: 3.1, 3.4, 3.7, 3.8_

- [ ] 4.4 (P) Unit tests for log domain logic
  - Test log line insert, remove, move, and copy with transition preservation
  - Test log validation detecting missing carts and invalid cuts for date
  - Test log length calculation for full log and sub-ranges
  - Test log line effective length, talk length, and segue length calculations
  - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.9_

- [ ] 5. Audio engine client and playback deck
- [ ] 5.1 Define audio engine port interfaces
  - Define IAudioEngine outbound port with operations: connect, load for playback, play, pause, stop, unload, load for recording, start recording, stop recording, set input volume, set output volume, fade output volume, and connection state query
  - Define event contracts for: play loaded, playing, play stopped, play position changed, record loaded, recording, record stopped, record unloaded, timescaling supported, input status changed, connection state changed
  - _Requirements: 4.1, 4.6, 4.7, 4.10, 4.11, 4.12_

- [ ] 5.2 Implement the audio engine TCP client adapter
  - Implement a TCP socket client that connects to the audio engine daemon and sends/receives commands
  - Parse incoming messages and emit the corresponding domain events
  - Handle connection loss and publish connection state change events
  - Support variable-speed playback commands with optional pitch correction parameters
  - _Requirements: 4.1, 4.6, 4.10_

- [ ] 5.3 Implement the Playback Deck service
  - Create the playback deck abstraction managing the lifecycle of a single audio stream: load, play, pause, stop, and clear
  - Track playback position and publish position updates at approximately 100ms intervals
  - Detect and publish marker events: segue start/end, talk start/end, hook start/end
  - Maintain deck state as one of: stopped, playing, or paused (state machine per design)
  - Support audio ducking with configurable level and fade duration
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.8, 4.9_

- [ ] 5.4 (P) Unit tests for playback deck
  - Test state transitions: stopped to playing, playing to paused, paused to stopped, etc.
  - Test position update emission at regular intervals
  - Test marker event detection and publication at correct positions
  - Test ducking behavior with volume level and fade duration
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.8, 4.9_

- [ ] 6. Log playback engine
- [ ] 6.1 Implement the log playback engine orchestrating multi-deck sequential playback
  - Extend LogEvent with real-time playback state management
  - Manage multiple playback decks for overlapping segue transitions
  - Implement transition handling: play (simple start), segue (start next before current finishes, overlapping at segue point), and stop
  - Publish events for: line played, line paused, line stopped, line inserted, line removed, line modified, and transport state changes
  - Support make-next operation to set any line as the next to play
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ] 6.2 Implement log playback live update and refresh capabilities
  - Respond to IPC notifications for cart and log changes by refreshing affected log lines
  - Support log refresh to pick up external changes while maintaining current playback state
  - Track and publish the next stop time, post point, and active/next event changes
  - Update playback behavior when the on-air flag changes
  - Support multiple operation modes for log playback
  - _Requirements: 5.5, 5.7, 5.8, 5.9_

- [ ] 7. Audio file processing
- [ ] 7.1 Define audio file I/O port interfaces
  - Define IAudioFileReader with operations: open, read samples, get duration, get energy/waveform data, close
  - Define IAudioFileWriter with operations: create, write samples, close
  - Define IAudioConverter with operations: set source, set destination, set settings (format, channels, sample rate, bitrate), set range, set speed ratio, convert
  - Define supported format enumeration: PCM 8/16/24-bit, MPEG Layer 1/2/3, Ogg Vorbis, FLAC, AIFF, M4A
  - Define audio conversion error codes: Ok, InvalidSource, NoSource, NoDestination, Internal, NoSpace, Unsupported, NoDisc, FormatError
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7.2 Implement audio file adapter for multi-format read/write
  - Implement audio file reading and writing for all supported formats using appropriate libraries
  - Implement the three-stage conversion pipeline: decode source, process, encode destination
  - Support time-stretching during format conversion via configurable speed ratio
  - Support range-based conversion for extracting portions of source files
  - Validate source file existence during import and produce appropriate error when missing
  - Prompt for overwrite confirmation when the target file already exists during export
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 7.3 (P) Implement audio auto-trim and auto-segue detection
  - Implement auto-trimming of silence from audio based on a configurable threshold level
  - Implement auto-setting of segue markers based on level detection
  - Provide energy and waveform data for visual display of audio content
  - _Requirements: 6.8, 6.9, 6.10_

- [ ] 7.4 Implement the log renderer service
  - Render a complete log to a single audio file or cart/cut, mixing all log lines with their transitions
  - Publish progress events including current line and total lines during rendering
  - Support the rendering flow: feed manager triggers renderer, renderer uses audio converter for each line
  - _Requirements: 6.11, 6.12_

- [ ] 8. IPC client and notification system
- [ ] 8.1 Define IPC port interfaces and notification types
  - Define IIPCClient outbound port with operations: connect, send notification, send RML command, query GPIO state, send on-air flag
  - Define Notification domain type with categories: cart, log, feed, catch event, and dropbox changes
  - Define RML Macro command structure with two-letter command code, role (command, reply, notify), and variable arguments
  - Define GPIO state types: input state, output state, mask, and cart associations
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 8.2 Implement the IPC TCP client adapter
  - Implement a TCP socket client connecting to the IPC daemon
  - Parse and dispatch incoming messages: user changed, notification received, GPIO state changes, on-air flag changed, RML received
  - Support sending system notifications for cart, log, feed, catch event, and dropbox changes
  - Support sending and receiving the on-air flag
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 8.3 (P) Implement the catch daemon client adapter
  - Implement a TCP client connecting to the catch daemon for scheduled recording management
  - Publish events for: connected, status changed, meter level, heartbeat failed
  - Detect heartbeat failures and publish heartbeat failure events
  - _Requirements: 14.6, 14.7_

- [ ] 8.4 (P) Implement multicast UDP communication for meter level data
  - Implement multicast UDP sender and receiver for audio meter level data
  - Support configurable base port and port range for metering network parameters
  - _Requirements: 14.8, 12.7_

- [ ] 9. RML macro execution engine
- [ ] 9.1 Implement macro command parsing and serialization
  - Represent macro commands as structured objects with two-letter command code, role, and variable arguments
  - Implement serialization and deserialization of macro commands to and from string format
  - Support approximately 80 distinct macro command codes
  - _Requirements: 15.1, 15.2, 15.5_

- [ ] 9.2 Implement the macro execution engine
  - Execute macro command sequences in order when a macro cart is played
  - Publish events when macro execution starts, finishes, or is stopped
  - Integrate with the log playback engine for macro cart handling
  - _Requirements: 15.3, 15.4_

- [ ] 9.3 (P) Unit tests for macro command parsing
  - Test serialization and deserialization round-trip for all command code categories
  - Test variable argument count handling
  - Test role classification (command, reply, notify)
  - _Requirements: 15.1, 15.2, 15.5_

- [ ] 10. User authentication and permission management
- [ ] 10.1 Implement the User domain entity with authentication and permissions
  - Create the User entity with password verification for standard and web user modes
  - Implement per-user boolean permission checking for all permission types: admin configuration, cart CRUD (create/delete/modify), audio editing, log CRUD (create/delete), log playout, log arrangement, voice tracking, panel configuration, and podcast CRUD (add/edit/delete)
  - Implement group-based authorization: check if user can access carts in specific groups
  - Implement feed-based authorization: check if user can manage specific feeds
  - Implement password change with confirmation matching; produce error when passwords don't match
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6, 13.7_

- [ ] 10.2 (P) Define user persistence port and implement SQL adapter
  - Define IUserRepository with operations: find by name, authenticate, get permissions, get authorized groups, get authorized feeds
  - Implement SqlUserRepository for the USERS, USER_PERMS, AUDIO_PERMS, and FEED_PERMS tables
  - Support publishing a user-changed event when the authenticated user changes
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 10.3 (P) Unit tests for user permissions
  - Test password verification for standard and web user modes
  - Test each boolean permission flag independently
  - Test group-based and feed-based authorization
  - Test password change validation (matching and mismatching confirmation)
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6, 13.7_

- [ ] 11. System configuration and application context
- [ ] 11.1 Implement configuration loading and application context initialization
  - Implement configuration file loading at startup: database connection parameters, station identity, audio file storage paths, and audio device settings
  - Implement the singleton application context that initializes database connection, audio engine client, and IPC client
  - Support station name override from configuration (use configured name instead of hostname)
  - Support auto-provisioning: automatically create host and service records on first connection when enabled
  - _Requirements: 12.1, 12.2, 12.3, 12.8_

- [ ] 11.2 (P) Implement station and system configuration entities
  - Implement Station entity with per-station settings: IP address, audio card configuration, assigned audio device drivers, and capability flags
  - Implement per-application configuration for: airplay, library, log editor, and catch modules
  - Support font configuration: apply configured font family and sizes to all UI elements
  - Define persistence ports and SQL adapters for STATIONS, AUDIO_CARDS, SYSTEM, and per-app config tables
  - _Requirements: 12.4, 12.5, 12.6_

- [ ] 12. Scheduling and log generation engine
- [ ] 12.1 Implement scheduling domain entities (Service, Clock, EventLine)
  - Create Service entity with clock assignments per hour and traffic/music import configuration
  - Create Clock entity defining a one-hour template with event lines at specific start times
  - Create EventLine entity with cart selection rules and scheduling constraints
  - _Requirements: 10.1, 10.2_

- [ ] 12.2 Implement the scheduling rules engine
  - Implement scheduler rule enforcement: maximum appearances per log, minimum wait between same-cart plays, not-after rules, or-after rules, artist separation, and title separation
  - Select carts for scheduled events respecting all scheduling rules
  - _Requirements: 10.3_

- [ ] 12.3 Implement log generation and traffic/music import
  - Generate daily playout logs by determining which clock applies for each hour and populating events from clock event lines
  - Import traffic and music data from external files using configurable field mappings
  - Link imported traffic/music data to logs by replacing link markers with imported data
  - Support clearing and re-linking log links for a specific import source and date
  - Publish progress events during log generation
  - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6, 10.7_

- [ ] 12.4 (P) Unit tests for scheduling rules
  - Test maximum appearances per log enforcement
  - Test minimum wait between same-cart plays
  - Test not-after and or-after rules
  - Test artist separation and title separation constraints
  - _Requirements: 10.3_

- [ ] 13. Podcasting and RSS feed management
- [ ] 13.1 Implement Feed and Podcast domain entities
  - Create Feed entity managing podcast episodes and feed images
  - Create Podcast entity representing individual episodes with metadata
  - Support super-feeds that aggregate content from multiple feeds
  - Generate valid RSS XML including all episode metadata
  - _Requirements: 11.1, 11.6, 11.8_

- [ ] 13.2 Implement podcast posting workflow
  - Support posting audio from multiple sources: an existing cart/cut, an external file, or a rendered log
  - Upload audio and update the RSS XML feed when a podcast episode is posted
  - Produce error when RSS XML upload fails
  - Support managing feed images: upload and remove
  - Publish progress events during podcast posting
  - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.7_

- [ ] 14. File transfer and network services
- [ ] 14.1 (P) Define network service port interfaces
  - Define IFileTransfer outbound port with operations: download file, upload file, HTTP DELETE for resource removal
  - Define ITCPSocket port for client-server protocol communication
  - Define data rate control for paced data transmission
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 14.2 (P) Implement file transfer and socket adapters
  - Implement file download from remote servers
  - Implement file upload to remote servers
  - Implement HTTP DELETE operations for remote resource removal
  - Implement TCP socket communication for client-server protocols
  - Implement data rate control for paced data transmission
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 15. Hardware interface abstractions
- [ ] 15.1 (P) Define hardware abstraction port interfaces
  - Define IAudioPort for audio device control: card/port selection, input/output mode, volume levels, and passthrough routing
  - Define IGPIOController for general purpose I/O hardware control
  - Define ITTYDevice for serial/TTY device communication
  - Define IMatrix for audio routing matrices with configurable inputs, outputs, and GPIO lines
  - Define INetworkedAudioProtocol for source and destination management
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 15.2 (P) Implement CD player and CD ripper abstractions
  - Implement a CD player interface with play, pause, stop, and eject controls (available where hardware is present)
  - Implement a CD ripping interface with metadata lookup via online databases (available where hardware is present)
  - Implement CD player state machine: NoMedium, Stopped, Playing, Paused (per design)
  - _Requirements: 19.6, 19.7_

- [ ] 16. Reporting service
- [ ] 16.1 (P) Implement the report generation service
  - Generate reports from ELR (electronic log record) data for a specified date range
  - Support multiple export filter formats for different reporting standards
  - Check whether report output already exists for a given date range before regenerating
  - Support filtering reports by station and service
  - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 17. Utility services
- [ ] 17.1 (P) Implement datetime, string, and parsing utilities
  - Implement datetime parsing and formatting utilities
  - Implement SQL and shell string escaping utilities
  - Implement SHA-1 hashing for audio file integrity verification
  - Implement INI file parsing for configuration files
  - Implement command-line argument parsing
  - Implement CSV and URL parsing utilities
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.7, 20.8_

- [ ] 17.2 (P) Implement system-level utility services
  - Implement email sending capabilities
  - Implement temporary directory management with automatic cleanup
  - Implement process-level instance locking to prevent duplicate instances
  - Implement database heartbeat mechanism to detect connection loss
  - _Requirements: 20.6, 20.9, 20.10, 20.11_

- [ ] 17.3 (P) Implement timer and event utilities
  - Implement a one-shot timer for deferred single-execution events
  - Implement a time-event scheduler for triggering actions at specific times of day
  - Implement a code-sequence detector for detecting specific input patterns
  - _Requirements: 20.12, 20.13, 20.14_

- [ ] 18. Reusable UI components - shared dialogs
- [ ] 18.1 Implement base dialog and widget classes with consistent styling
  - Create base classes for dialogs and widgets that apply consistent font settings from configuration
  - Ensure all UI components inherit from common base for uniform appearance
  - _Requirements: 17.1_

- [ ] 18.2 Implement the cart selection dialog
  - Provide search filtering by text, group, and scheduler code with result limiting
  - Display cart metadata in search results
  - _Requirements: 17.2_

- [ ] 18.3 (P) Implement the cut selection dialog
  - Provide cart browsing and cut selection with preview playback
  - _Requirements: 17.3_

- [ ] 18.4 (P) Implement the audio import/export widget
  - Provide format selection, normalization, auto-trim, and progress display
  - Support all audio format options from the audio file processing layer
  - _Requirements: 17.4_

- [ ] 19. Reusable UI components - shared widgets
- [ ] 19.1 (P) Implement audio level meters
  - Implement stereo VU meter displaying left and right channel levels
  - Implement segmented level meter for compact level display
  - Implement playback level meter for per-stream monitoring
  - _Requirements: 17.5_

- [ ] 19.2 (P) Implement transport control buttons
  - Provide play, stop, pause, record, and other standard transport action buttons with appropriate icons
  - _Requirements: 17.6_

- [ ] 19.3 (P) Implement specialized input widgets
  - Implement time editor for hours:minutes:seconds.milliseconds input
  - Implement date picker with calendar grid
  - Implement enhanced slider widget
  - _Requirements: 17.7_

- [ ] 19.4 (P) Implement content display and selection widgets
  - Implement dual-list selector for adding/removing items between available and selected lists
  - Implement log filter widget with service dropdown and text search
  - Implement marker bar widget for displaying audio marker positions visually
  - Implement image picker widget driven by a data model
  - _Requirements: 17.8, 17.9, 17.10, 17.11_

- [ ] 19.5 (P) Implement RSS category selector
  - Implement hierarchical category selection for RSS feed management
  - _Requirements: 17.12_

- [ ] 20. Audio marker editing
- [ ] 20.1 Implement the waveform editor with marker editing
  - Provide a waveform editor with visual display of audio and marker positions for all marker types (start, end, segue start/end, talk start/end, hook start/end, fade-up, fade-down)
  - Support zoom (horizontal and vertical) and scroll navigation of the waveform
  - Display a VU meter during audition playback within the editor
  - Support playback from the start or from the cursor position within the editor
  - _Requirements: 7.1, 7.2, 7.5, 7.6, 7.7_

- [ ] 20.2 Implement marker save validation with warnings
  - When markers are saved and less than half of the audio is playable, warn the user and request confirmation
  - When markers are saved and more than half of the audio will be faded, warn the user and request confirmation
  - _Requirements: 7.3, 7.4_

- [ ] 21. Sound panel and cart slot
- [ ] 21.1 Implement the sound panel with configurable button grid
  - Provide a panel of buttons arranged in a configurable grid (rows and columns)
  - When a button is pressed with an audio cart assignment, start playback of that cart
  - When a button is pressed with a macro cart assignment, execute the macro commands
  - Display a countdown timer on the button while its cart is playing
  - Support button flash states for visual feedback
  - Publish events when audio channels start and stop
  - Support hook-mode playback (playing only the hook segment of a cut)
  - Support configuring each button with a cart assignment, label, and color
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 21.2 (P) Implement the cart slot display and interaction
  - Provide a slot display showing cart metadata: number, title, artist, length, and playback progress
  - Support drag-and-drop of a cart onto a slot to load it
  - Start playback when the start button is pressed on a loaded slot
  - Support configuring slot options: playback mode, assigned cart, and service filter
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 22. Integration and end-to-end wiring
- [ ] 22.1 Wire composition root and dependency injection
  - Implement the application startup sequence that creates all adapters, injects them into application services, and exposes UI adapter models to QML
  - Verify the complete dependency chain: domain entities use no framework types, ports reference only domain types, adapters implement ports with Qt, app layer orchestrates through ports
  - _Requirements: 12.1, 12.2_

- [ ] 22.2 Integration tests for cross-layer workflows
  - Test audio playback pipeline: application to log playback to playback deck to audio engine client
  - Test IPC notification flow: IPC client to application context to log playback to sound panel
  - Test macro execution flow: macro event engine to log playback engine
  - Test log rendering flow: feed manager to renderer to audio converter
  - Test cart selection dialog: text filter plus group filter plus scheduler code filter through database query to result display
  - Test catch daemon client: connection, heartbeat, status updates
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 8.1, 11.2, 14.1, 15.3_

- [ ] 22.3 End-to-end tests for critical user workflows
  - Test cart creation with group range enforcement and title uniqueness
  - Test cut rotation with weighted and sequential algorithms
  - Test log generation from service clocks with scheduler rule enforcement
  - Test audio import/export with format conversion
  - Test podcast posting from cart, file, and rendered log
  - Test sound panel button press triggering audio and macro playback
  - Test user permission enforcement across all privileged operations
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.3, 6.1, 8.1, 10.1, 11.2, 13.1, 13.2_
