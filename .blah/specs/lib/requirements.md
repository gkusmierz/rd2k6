# Requirements Document

## Introduction

The Core Library (LIB) is the foundational shared library for the Rivendell radio automation system. All other artifacts in the system depend on this library. It provides domain entities, business logic, service clients, audio processing capabilities, reusable UI components, and utility functions that are consumed by every application, daemon, and tool in the platform.

This document captures the functional requirements of the library organized into logical feature clusters, expressed in technology-agnostic terms using the EARS format.

## Requirements

### Requirement 1: Cart and Cut Management

**Objective:** As a radio operator, I want to manage audio carts and their associated cuts, so that I can organize and maintain the station's audio content library.

#### Acceptance Criteria

1. The system shall support two cart types: audio carts and macro carts.
2. When a new cart is created, the system shall assign it to a group and require a non-empty title.
3. If the group enforces cart number ranges and the specified number is outside the permitted range, then the system shall block creation and display an error "cart number is outside permitted range."
4. If duplicate cart titles are disallowed system-wide and another cart already has the same title, then the system shall block creation and display an error "cart title must be unique."
5. When a cart is created without specifying a number, the system shall auto-assign the next available number from the group's configured range.
6. If no more cart numbers are available in the group's range, then the system shall display an error "no more available cart numbers for the group."
7. The system shall store cart metadata including: title, artist, group, forced length, average length, play order, validity status, and scheduler codes.
8. When a cut is added to a cart, the system shall assign it a sequential cut number within that cart.
9. When a cart is removed, the system shall remove all associated cuts, scheduler codes, and related data.
10. The system shall support generating an XML representation of a cart and its metadata.
11. The system shall support bulk metadata operations via a wave data transfer object (get/set metadata).

### Requirement 2: Cut Rotation and Validity

**Objective:** As a radio operator, I want the system to automatically select the appropriate cut for playback based on rotation rules and validity constraints, so that content scheduling is fair and time-appropriate.

#### Acceptance Criteria

1. When an audio cart is played, the system shall select the next cut using one of two algorithms: weighted rotation (lowest play-count-to-weight ratio wins) or sequential rotation (follows play order, wraps at end).
2. When a cut is selected via weighted rotation, the system shall increment the selected cut's local counter.
3. The system shall evaluate cut validity across multiple dimensions: date range, daypart (time of day), day of week, and audio existence (length greater than zero).
4. When a cut's validity is checked, the system shall return one of: never valid, conditionally valid, always valid, or future daypart valid.
5. If no valid cuts exist for a cart but an evergreen cut exists, then the system shall select the evergreen cut as a fallback.
6. If no valid or evergreen cuts exist, then the system shall report that the cart has no playable content.

### Requirement 3: Log Management

**Objective:** As a radio programmer, I want to create, edit, validate, and manage playout logs, so that I can schedule and organize broadcast content for specific dates.

#### Acceptance Criteria

1. The system shall represent a log as an ordered collection of log lines, where each line references a cart, marker, chain, track, or link.
2. When a new log is created, the system shall require a valid service assignment.
3. If no service is selected during log creation, then the system shall display an error "the service is invalid."
4. The system shall support insert, remove, move, and copy operations on log lines while preserving transition types.
5. When a log is validated, the system shall verify that referenced carts exist and have valid cuts for the log date.
6. The system shall calculate the total length of a log or any sub-range of lines.
7. The system shall support generating an XML representation of a log and its lines.
8. The system shall support log locking to prevent concurrent edits by multiple users.
9. Each log line shall carry metadata including: cart number, transition type (play, segue, stop), time type (relative, hard), source (manual, traffic, music, template, tracker), and playback status.

### Requirement 4: Audio Playback Engine

**Objective:** As a radio operator, I want to play, pause, stop, and monitor audio content through the playback engine, so that I can run live broadcasts and automated playout.

#### Acceptance Criteria

1. The system shall provide a playback deck abstraction that manages the lifecycle of a single audio stream: load, play, pause, stop, and clear.
2. While a playback deck is playing, the system shall publish position updates at regular intervals (approximately 100ms).
3. When playback reaches a segue start marker, the system shall publish a segue start event to trigger the next item.
4. When playback reaches talk start/end markers, the system shall publish corresponding talk events.
5. When playback reaches hook start/end markers, the system shall publish corresponding hook events.
6. The system shall support variable-speed playback with optional pitch correction where the audio device supports timescaling.
7. The system shall support volume control per stream: set input volume, set output volume, fade output volume over a specified duration.
8. The system shall support audio ducking (temporary volume reduction) with configurable level and fade duration.
9. The system shall maintain playback deck state as one of: stopped, playing, or paused.
10. When an audio engine connection is lost, the system shall publish a connection state change event.
11. The system shall support loading and unloading audio for both playback and recording channels.
12. When recording is stopped, the system shall report the recorded duration.

### Requirement 5: Log Playback

**Objective:** As a radio operator, I want to play through a log of scheduled audio items with automatic transitions, so that I can run continuous broadcast programming.

#### Acceptance Criteria

1. The system shall support playing individual log lines with configurable transition types: play, segue, and stop.
2. When a segue transition is triggered, the system shall start the next log line before the current one finishes, overlapping at the segue point.
3. The system shall support multiple operation modes for log playback.
4. The system shall publish events for: line played, line paused, line stopped, line inserted, line removed, line modified, and transport state changes.
5. When the on-air flag changes, the system shall update playback behavior accordingly.
6. The system shall support setting any line as the "next" line to play via a make-next operation.
7. When a system notification is received indicating a cart or log change, the system shall refresh affected log lines.
8. The system shall support log refresh to pick up external changes while maintaining playback state.
9. The system shall track and publish the next stop time, post point, and active/next event changes.

### Requirement 6: Audio File Processing

**Objective:** As a content producer, I want to import, export, convert, and edit audio files in multiple formats, so that I can manage broadcast-ready audio content.

#### Acceptance Criteria

1. The system shall support reading and writing audio files in formats including: PCM (8/16/24-bit), MPEG Layer 1/2/3, Ogg Vorbis, FLAC, AIFF, and M4A.
2. When converting between audio formats, the system shall use a three-stage pipeline (decode, process, encode).
3. The system shall support time-stretching during format conversion via a configurable speed ratio.
4. The system shall support range-based conversion (extracting a portion of the source file).
5. When importing audio, the system shall validate that the source file exists and that the destination format is supported.
6. If the source file does not exist during import, then the system shall display an error "file does not exist."
7. When exporting audio, if the target file already exists, then the system shall prompt for overwrite confirmation.
8. The system shall support auto-trimming silence from audio based on a configurable threshold level.
9. The system shall support auto-setting segue markers based on level detection.
10. The system shall provide energy/waveform data for visual display of audio content.
11. The system shall support rendering a complete log to a single audio file or cart/cut, mixing all log lines with their transitions.
12. When rendering a log, the system shall publish progress events including the current line and total lines.

### Requirement 7: Audio Marker Editing

**Objective:** As a content producer, I want to set and adjust audio markers (start, end, segue, talk, hook, fade) on cuts, so that I can control playback behavior precisely.

#### Acceptance Criteria

1. The system shall support the following marker types per cut: start point, end point, segue start/end, talk start/end, hook start/end, fade-up point, and fade-down point.
2. The system shall provide a waveform editor with visual display of the audio and marker positions.
3. When markers are saved and less than half of the audio is playable, the system shall warn "less than half of the audio is playable" and request confirmation.
4. When markers are saved and more than half of the audio will be faded, the system shall warn "more than half of the audio will be faded" and request confirmation.
5. The system shall support zoom (horizontal and vertical) and scroll navigation of the waveform.
6. The system shall display a VU meter during audition playback within the editor.
7. The system shall support playback from the start or from the cursor position within the editor.
8. The system shall support adjusting cut gain in 0.01 dB increments.

### Requirement 8: Sound Panel

**Objective:** As a radio operator, I want to trigger audio carts instantly from a configurable button grid, so that I can play sound effects, jingles, and stingers during live shows.

#### Acceptance Criteria

1. The system shall provide a panel of buttons arranged in a configurable grid (rows and columns).
2. When a button is pressed and it is assigned to an audio cart, the system shall start playback of that cart.
3. When a button is pressed and it is assigned to a macro cart, the system shall execute the macro commands.
4. While a button's cart is playing, the system shall display a countdown timer on the button.
5. The system shall support button flash states for visual feedback.
6. The system shall publish events when audio channels start and stop.
7. The system shall support hook-mode playback (playing only the hook segment of a cut).
8. The system shall support configuring each button with a cart assignment, label, and color.

### Requirement 9: Cart Slot

**Objective:** As a radio operator, I want to load and play individual carts from dedicated slot positions, so that I can manage on-demand content playback.

#### Acceptance Criteria

1. The system shall provide a slot display showing cart metadata: number, title, artist, length, and playback progress.
2. When a cart is dragged and dropped onto a slot, the system shall load that cart into the slot.
3. When the start button is pressed on a loaded slot, the system shall begin playback.
4. The system shall support configuring slot options including: playback mode, assigned cart, and service filter.

### Requirement 10: Scheduling and Log Generation

**Objective:** As a radio programmer, I want to automatically generate daily playout logs from configured clocks and scheduling rules, so that I can efficiently create consistent broadcast schedules.

#### Acceptance Criteria

1. When log generation is triggered for a service and date, the system shall determine which clock applies for each hour via the service-clock assignment.
2. The system shall populate each hour's events from the clock's event lines at their configured start times.
3. When selecting carts for scheduled events, the system shall respect scheduling rules: maximum appearances per log, minimum wait between same-cart plays, not-after rules, or-after rules, artist separation, and title separation.
4. The system shall support importing traffic and music data from external files using configurable field mappings.
5. When linking traffic/music data to a log, the system shall replace link markers with the imported data.
6. The system shall support clearing and re-linking log links for a specific import source and date.
7. The system shall publish progress events during log generation.

### Requirement 11: Podcasting and RSS Feed Management

**Objective:** As a content manager, I want to publish and manage podcast episodes via RSS feeds, so that I can distribute broadcast content as podcasts.

#### Acceptance Criteria

1. The system shall support creating and managing RSS feeds with associated podcast episodes.
2. When a podcast episode is posted, the system shall upload the audio and update the RSS XML feed.
3. The system shall support posting audio from multiple sources: an existing cart/cut, an external file, or a rendered log.
4. If RSS XML upload fails, then the system shall display an error "XML data upload failed."
5. The system shall support managing feed images: upload and remove.
6. The system shall support super-feeds that aggregate multiple feeds.
7. The system shall publish progress events during podcast posting.
8. The system shall generate valid RSS XML including all episode metadata.

### Requirement 12: System Configuration and Application Context

**Objective:** As a system administrator, I want to configure system-wide settings, station parameters, and application defaults, so that the platform operates correctly for each station in the network.

#### Acceptance Criteria

1. The system shall load configuration from a system configuration file at startup, including: database connection parameters, station identity, audio file storage paths, and audio device settings.
2. The system shall provide a singleton application context that initializes database connection, audio engine client, and IPC client.
3. Where configuration specifies a station name override, the system shall use the configured name instead of the hostname.
4. The system shall store per-station settings including: IP address, audio card configuration, assigned audio device drivers, and capability flags.
5. The system shall store per-application configuration for: airplay, library, log editor, and catch modules.
6. Where font configuration is specified, the system shall apply the configured font family and sizes to all UI elements.
7. The system shall support configuration of metering network parameters: base port and port range.
8. Where auto-provisioning is enabled, the system shall automatically create host and service records on first connection.

### Requirement 13: User and Permission Management

**Objective:** As a system administrator, I want to manage user accounts and their permissions, so that I can control who can access which features of the system.

#### Acceptance Criteria

1. The system shall authenticate users via password verification.
2. The system shall enforce per-user boolean permissions for: admin configuration, cart CRUD (create/delete/modify), audio editing, log CRUD (create/delete), log playout, log arrangement, voice tracking, panel configuration, and podcast CRUD (add/edit/delete).
3. The system shall enforce group-based authorization: a user can only access carts in groups they are authorized for.
4. The system shall enforce feed-based authorization: a user can only manage feeds they are authorized for.
5. When the authenticated user changes, the system shall publish a user-changed event to all connected components.
6. The system shall support changing passwords with confirmation matching.
7. If password and confirmation do not match, then the system shall display an error "the passwords don't match."

### Requirement 14: IPC and Notifications

**Objective:** As a system component, I want to communicate with other system daemons via inter-process communication, so that I can coordinate actions across the distributed system.

#### Acceptance Criteria

1. The system shall provide a client for connecting to the IPC daemon via TCP.
2. When connected to the IPC daemon, the system shall support sending and receiving system notifications (for cart, log, feed, catch event, and dropbox changes).
3. The system shall support sending and receiving RML (Rivendell Macro Language) commands via the IPC connection.
4. The system shall support querying and monitoring GPIO (General Purpose I/O) states: input state changes, output state changes, mask changes, and cart associations.
5. The system shall support sending and receiving the on-air flag.
6. The system shall provide a client for connecting to the catch daemon for scheduled recording management.
7. When a catch daemon connection heartbeat fails, the system shall publish a heartbeat failure event.
8. The system shall support multicast UDP communication for meter level data.

### Requirement 15: RML Macro Execution

**Objective:** As a radio operator, I want to execute sequences of automation commands (macros), so that I can trigger complex actions with a single operation.

#### Acceptance Criteria

1. The system shall represent macro commands as structured objects with a two-letter command code, a role (command, reply, or notify), and a variable number of arguments.
2. The system shall support serializing and deserializing macro commands to and from string format.
3. When a macro cart is played, the system shall execute the macro command sequence in order.
4. The system shall publish events when macro execution starts, finishes, or is stopped.
5. The system shall support approximately 80 distinct macro command codes.

### Requirement 16: Reporting

**Objective:** As a station manager, I want to generate playout reports from logged broadcast data, so that I can fulfill regulatory and licensing requirements.

#### Acceptance Criteria

1. The system shall support generating reports from ELR (electronic log record) data for a specified date range.
2. The system shall support multiple export filter formats for different reporting standards.
3. The system shall check whether report output already exists for a given date range before regenerating.
4. The system shall support filtering reports by station and service.

### Requirement 17: Reusable UI Components

**Objective:** As a UI developer, I want a library of reusable dialog and widget components, so that I can build consistent user interfaces across all applications.

#### Acceptance Criteria

1. The system shall provide base classes for dialogs and widgets that apply consistent font settings.
2. The system shall provide a cart selection dialog with search filtering by text, group, and scheduler code, with result limiting.
3. The system shall provide a cut selection dialog with cart browsing and cut preview.
4. The system shall provide an audio import/export widget with format selection, normalization, auto-trim, and progress display.
5. The system shall provide audio level meters: stereo VU meter (left/right channels), segmented level meter, and playback level meter.
6. The system shall provide transport control buttons: play, stop, pause, record, and other standard transport actions.
7. The system shall provide specialized input widgets: time editor (hours:minutes:seconds.milliseconds), date picker (calendar grid), and enhanced slider.
8. The system shall provide a dual-list selector widget for adding/removing items between available and selected lists.
9. The system shall provide a log filter widget with service dropdown and text search.
10. The system shall provide a marker bar widget for displaying audio marker positions visually.
11. The system shall provide an image picker widget driven by a data model.
12. The system shall provide an RSS category selector with hierarchical categories.

### Requirement 18: File Transfer and Network Services

**Objective:** As a system component, I want to upload and download files via network protocols, so that I can transfer audio and data between servers.

#### Acceptance Criteria

1. The system shall support file download from remote servers.
2. The system shall support file upload to remote servers.
3. The system shall support HTTP DELETE operations for remote resource removal.
4. The system shall provide TCP socket communication for client-server protocols.
5. The system shall support data rate control for paced data transmission.

### Requirement 19: Hardware Interface Abstraction

**Objective:** As a system integrator, I want abstract interfaces for hardware devices, so that the system can work with different audio and control hardware.

#### Acceptance Criteria

1. The system shall provide an abstraction for audio device control: card/port selection, input/output mode, volume levels, and passthrough routing.
2. The system shall provide an abstraction for GPIO (General Purpose I/O) hardware control.
3. The system shall provide an abstraction for serial/TTY device communication.
4. The system shall provide an abstraction for audio routing matrices with configurable inputs, outputs, and GPIO lines.
5. The system shall provide an abstraction for networked audio protocols for source and destination management.
6. Where CD playback hardware is available, the system shall provide a CD player interface with play, pause, stop, and eject controls.
7. Where CD ripping hardware is available, the system shall provide a CD ripping interface with metadata lookup via online databases.

### Requirement 20: Utility Services

**Objective:** As a developer, I want common utility functions and services, so that I can avoid duplicating infrastructure code across the system.

#### Acceptance Criteria

1. The system shall provide datetime parsing and formatting utilities.
2. The system shall provide SQL and shell string escaping utilities.
3. The system shall provide SHA-1 hashing for audio file integrity verification.
4. The system shall provide INI file parsing for configuration files.
5. The system shall provide command-line argument parsing.
6. The system shall provide email sending capabilities.
7. The system shall provide CSV parsing utilities.
8. The system shall provide URL parsing utilities.
9. The system shall provide temporary directory management with automatic cleanup.
10. The system shall provide process-level instance locking to prevent duplicate instances.
11. The system shall provide a database heartbeat mechanism to detect connection loss.
12. The system shall provide a one-shot timer for deferred single-execution events.
13. The system shall provide a time-event scheduler for triggering actions at specific times of day.
14. The system shall provide a code-sequence detector for detecting specific input patterns.
