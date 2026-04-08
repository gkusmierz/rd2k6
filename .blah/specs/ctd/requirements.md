# Requirements Document

## Introduction

The Catch Daemon is a background service responsible for scheduling and executing timed audio events in the Rivendell radio automation system. It manages a pool of events loaded from the database, including recordings, playouts, macro executions, switch operations, downloads, and uploads. The daemon monitors external hardware triggers (General Purpose Input), communicates with connected clients via a TCP socket protocol, and coordinates with the audio engine and IPC daemon for audio operations. It operates as a headless service with no direct user interface, serving as the execution engine for the Catch scheduling subsystem.

## Requirements

### Requirement 1: Event Scheduling and Dispatch

**Objective:** As a radio station operator, I want scheduled audio events to execute automatically at configured times and days, so that recordings, playouts, and other operations happen without manual intervention.

#### Acceptance Criteria

1. When the time engine fires for a scheduled event, the system shall verify that the event is active and that the current day of week is enabled before dispatching.
2. If the event is inactive or the current day of week is not enabled, then the system shall skip the event and log a diagnostic message.
3. When a scheduled event fires, the system shall dispatch it to the appropriate handler based on the event type (recording, playout, macro, switch, download, or upload).
4. If the referenced audio cut does not exist in the database, then the system shall write an exit code of "no cut", broadcast an error status, and abort the event.
5. When the daemon starts, the system shall load all events from the scheduled events table for the current station into memory.
6. When the daemon starts and finds events in uploading, downloading, or record-active state from a previous session, the system shall mark those events as interrupted.
7. When the daemon starts and finds events in waiting or play-active state, the system shall mark those events as completed.
8. When a one-shot event completes execution, the system shall delete the event from the database and remove it from the time engine.
9. When a notification is received that an event has been added, modified, or deleted, the system shall update the in-memory event list accordingly.
10. The system shall execute a configurable startup cart after a 10-second delay following daemon initialization.

### Requirement 2: Audio Recording Management

**Objective:** As a radio station operator, I want the system to manage audio recordings on configured decks with support for timed and hardware-triggered start/stop, so that audio content is captured reliably according to schedule.

#### Acceptance Criteria

1. When a hard-start recording event fires, the system shall load the recording deck and begin recording immediately.
2. When a hardware-trigger-start recording event fires, the system shall set the deck to waiting state and start a trigger window timer for the configured duration.
3. While the deck is in waiting state, when the configured hardware trigger input activates, the system shall begin recording.
4. If a hardware trigger start offset is configured, then the system shall delay recording start by the configured offset duration after the trigger activates.
5. If the hardware trigger window timer expires without a trigger, then the system shall return the deck to idle state.
6. When the recording end type is fixed-length, the system shall record for exactly the configured duration.
7. When the recording end type is hard-end, the system shall calculate the recording length from the current time to the configured end time.
8. When the recording end type is hardware-trigger-end, the system shall stop recording when the configured trigger input activates during the end window.
9. If a recording is attempted on a deck that is already busy, then the system shall write a "device busy" exit code and broadcast the error status.
10. When a recording completes and normalization is not configured, the system shall finalize the recorded cut directly (metadata update, trim, hash calculation).
11. When a recording completes and normalization is configured, the system shall spawn a batch subprocess to normalize and finalize the recording.
12. When hardware-trigger recording completes and multiple recordings are allowed, the system shall re-enter the trigger waiting state to capture the next recording.
13. When the recording end type is hardware-trigger-end, the system shall cap the maximum recording length at the configured maximum hardware-trigger recording length.

### Requirement 3: Audio Playout and Event Triggering

**Objective:** As a radio station operator, I want the system to play scheduled audio and execute macro carts and switch commands at configured times, so that on-air automation operates reliably.

#### Acceptance Criteria

1. When a playout event fires, the system shall load the audio cut and begin playback at the configured start point.
2. While a cut is playing, the system shall monitor timed event markers and fire macro cart executions at the correct audio positions.
3. When a macro event fires, the system shall allocate a macro execution slot and execute the referenced macro cart.
4. If all macro execution slots are occupied (maximum 64), then the system shall log a warning and skip the macro execution.
5. When a switch event fires, the system shall send the appropriate switching command to the IPC daemon.
6. The system shall support the following locally handled commands: insert cut event marker, copy audio cut, execute macro cart, start recording on a deck, and stop recording on a deck.
7. When a cut event marker command is received during recording, the system shall insert an event marker at the current recording position.
8. When a copy audio cut command is received, the system shall copy the source audio cut to the destination location.

### Requirement 4: Batch Processing and Podcast Publishing

**Objective:** As a radio station operator, I want the system to download, upload, and process audio files as scheduled batch operations with podcast publishing support, so that content is automatically transferred and published.

#### Acceptance Criteria

1. When a download event fires, the system shall spawn a batch subprocess to download the file from the configured URL.
2. When a download event has URL wildcards, the system shall resolve them with date and time values before downloading.
3. When a download completes, the system shall convert the downloaded file to the station's configured audio format and import it into the target cut.
4. When an upload event fires, the system shall spawn a batch subprocess to export the audio cut and upload it to the configured URL.
5. If a download or upload event has no configured username and the URL scheme is FTP, then the system shall use anonymous FTP credentials.
6. When an upload completes and a podcast feed is configured, the system shall delete any stale podcast entries for the same filename, create a new podcast entry, and update the feed's last build datetime.
7. When a batch subprocess completes, the system shall report its exit code to the parent daemon process via the TCP command protocol.
8. While batch operations are running, the system shall periodically check for progress updates at a 1-second interval.

### Requirement 5: Client Communication Protocol

**Objective:** As a client application, I want to connect to the catch daemon via TCP and receive real-time status updates, so that the user interface can display current deck states and event progress.

#### Acceptance Criteria

1. The system shall accept TCP client connections on a configurable port (default 6006).
2. When a client connects, the system shall require password authentication before accepting any commands other than authenticate and disconnect.
3. If an unauthenticated client sends a command other than authenticate or disconnect, then the system shall reject the command with an error response.
4. When a client requests deck status, the system shall send the current status of all decks (or a specific deck).
5. When a deck status changes, the system shall broadcast the new status to all authenticated clients.
6. While meter data is enabled for a client, the system shall periodically send audio level meter readings.
7. The system shall broadcast a heartbeat message to all connected clients at a configurable interval (default 10 seconds).
8. When a client sends a reload command, the system shall re-read all events from the database.
9. When a client sends a monitor command, the system shall enable or disable audio monitor passthrough for the specified deck.
10. The system shall execute a configurable system heartbeat cart at a configurable interval.
