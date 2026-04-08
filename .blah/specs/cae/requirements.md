# Requirements Document

## Introduction

The Audio Engine Daemon (CAE) is the core audio processing service in the Rivendell radio automation system. It operates as a headless background service that manages audio playback, recording, volume control, metering, and audio routing across multiple sound cards. Client applications (such as the on-air playout application, library manager, and catch panel) connect to CAE over TCP to issue audio commands, while CAE sends real-time meter level updates back over UDP. CAE supports multiple audio device backends through a strategy-based driver dispatch architecture, abstracting hardware differences behind a uniform command protocol.

## Requirements

### Requirement 1: Client Authentication
**Objective:** As a system administrator, I want CAE to require password authentication from all connecting clients, so that only authorized applications can control audio hardware.

#### Acceptance Criteria
1. When a client connects to the audio engine via TCP, the audio engine shall accept the connection and await authentication.
2. When a client sends a valid password command with the correct password, the audio engine shall mark the connection as authenticated and respond with a success acknowledgment.
3. When a client sends a password command with an incorrect password, the audio engine shall mark the connection as not authenticated and respond with a failure acknowledgment.
4. If an unauthenticated client sends any audio command, then the audio engine shall silently ignore the command and send no response.
5. When a client sends a disconnect command, the audio engine shall close the connection regardless of authentication status.

### Requirement 2: Audio Playback Management
**Objective:** As an on-air operator, I want to load, play, seek, stop, and unload audio files through the audio engine, so that audio content can be played out over configured sound cards.

#### Acceptance Criteria
1. When a client sends a load playback command with a card number and filename, the audio engine shall open the audio file, allocate a playback stream on the specified card, assign a unique handle from the handle pool, and return the handle and stream number in the response.
2. When a client sends a play command with a handle, length, speed, and pitch flag, the audio engine shall start playback on the associated card and stream with the specified parameters.
3. When a client sends a play position command with a handle and position, the audio engine shall seek the playback stream to the specified position.
4. When a client sends a stop playback command with a handle, the audio engine shall stop playback on the associated card and stream.
5. When a client sends an unload playback command with a handle, the audio engine shall release the playback stream and free the handle.
6. If the specified card has no configured audio driver, then the audio engine shall return an error response and not attempt any driver operation.
7. If the audio driver fails to allocate a playback stream, then the audio engine shall return an error response to the client.

### Requirement 3: Audio Recording Management
**Objective:** As a production engineer, I want to record audio from input ports to files through the audio engine, so that audio content can be captured and stored.

#### Acceptance Criteria
1. When a client sends a load recording command with card, port, codec, channels, sample rate, bit rate, and filename, the audio engine shall create the output audio file and prepare a recording stream.
2. When a client sends a record command with card, stream, length, and VOX threshold, the audio engine shall start capturing audio from the input.
3. When a client sends a stop recording command, the audio engine shall stop the recording on the specified card and stream.
4. When a client sends an unload recording command, the audio engine shall close the audio file and release the recording stream.
5. The audio engine shall support recording in the following codecs: PCM 16-bit (0), MPEG Layer 2 (1), MPEG Layer 3 (2), PCM 24-bit (3), and FLAC (4).
6. If the codec value is outside the valid range (0-4), then the audio engine shall reject the command.
7. If the channel count exceeds 2, then the audio engine shall reject the command.
8. The audio engine shall set recorded file ownership to the configured user and group identifiers.

### Requirement 4: Volume and Level Control
**Objective:** As an on-air operator, I want to control input and output volume levels, so that audio can be mixed and routed at appropriate levels.

#### Acceptance Criteria
1. When a client sends a set input volume command with card, stream, and level (in dB), the audio engine shall adjust the input volume on the specified stream.
2. When a client sends a set output volume command with card, stream, port, and level (in dB), the audio engine shall adjust the output volume on the specified stream and port.
3. When a client sends a fade output volume command with card, stream, port, target level, and duration, the audio engine shall gradually transition the output volume to the target level over the specified duration.
4. When a client sends a set input level command with card, port, and level, the audio engine shall adjust the input level on the specified port.
5. When a client sends a set output level command with card, port, and level, the audio engine shall adjust the output level on the specified port.

### Requirement 5: Audio Input Configuration
**Objective:** As a system administrator, I want to configure input modes, types, and VOX levels, so that audio inputs are correctly set up for the station's hardware.

#### Acceptance Criteria
1. When a client sends a set input mode command, the audio engine shall set the input channel mode to one of: Normal (0), Swap (1), Left-only (2), or Right-only (3).
2. If the input mode value exceeds 3, then the audio engine shall reject the command.
3. When a client sends a set input type command, the audio engine shall set the input type to either Analog (0) or AES/EBU digital (1).
4. If the input type value exceeds 1, then the audio engine shall reject the command.
5. When a client sends a set input VOX level command, the audio engine shall set the voice-operated threshold for the specified stream.
6. When a client sends a get input status command, the audio engine shall query and return the signal status for the specified input port.

### Requirement 6: Audio Output Configuration
**Objective:** As a system administrator, I want to configure output modes and status flags, so that audio outputs are correctly routed.

#### Acceptance Criteria
1. When a client sends a set output mode command, the audio engine shall configure the output channel mode on the specified card and stream.
2. When a client sends a set output status flag command with card, port, stream, and state, the audio engine shall set or clear the output status flag.
3. When a client sends a set audio passthrough level command with card, input port, output port, and level, the audio engine shall configure the direct passthrough routing level between the specified ports.

### Requirement 7: Real-Time Metering
**Objective:** As an on-air operator, I want to receive real-time audio level meters, so that I can monitor audio levels during playback and recording.

#### Acceptance Criteria
1. When a client sends a meter enable command with a UDP port and list of card numbers, the audio engine shall begin sending meter updates to the client's UDP port.
2. While metering is enabled for a connection, the audio engine shall periodically poll audio levels from the driver and send input meter levels, output meter levels, stream meter levels, playback position data, and output status updates via UDP.
3. The audio engine shall update meters at the configured meter update interval.
4. When a client disconnects, the audio engine shall stop sending meter data for that connection.

### Requirement 8: Audio Clock and Timescaling
**Objective:** As a system administrator, I want to configure clock sources and query timescaling support, so that audio synchronization and speed control can be managed.

#### Acceptance Criteria
1. When a client sends a set clock source command with card and input, the audio engine shall configure the clock source for the specified card.
2. When a client sends a timescaling support query for a card, the audio engine shall return whether the card's driver supports timescaling (speed/pitch adjustment).

### Requirement 9: RTP Capture
**Objective:** As a system integrator, I want to open RTP capture channels, so that audio can be received from network streams.

#### Acceptance Criteria
1. When a client sends an open RTP capture channel command with card, port, UDP port, sample rate, and channel count, the audio engine shall configure the card to receive audio from the specified RTP stream.

### Requirement 10: Command Protocol
**Objective:** As a client application developer, I want a well-defined text-based command protocol, so that applications can reliably communicate with the audio engine.

#### Acceptance Criteria
1. The audio engine shall accept TCP connections and process text-based commands where each command is a line of space-delimited tokens terminated by a newline character.
2. The audio engine shall identify commands by a two-letter code as the first token.
3. When a command succeeds, the audio engine shall respond with the command code followed by relevant parameters and a success marker ("+!").
4. When a command fails, the audio engine shall respond with the command code followed by a failure marker ("-!").
5. If an unrecognized command is received, then the audio engine shall respond with a generic error.
6. The audio engine shall support multiple simultaneous client connections.
7. The audio engine shall track each connection independently with its own authentication state, meter configuration, and command buffer.

### Requirement 11: Driver Dispatch and Multi-Card Support
**Objective:** As a system administrator, I want the audio engine to support multiple sound cards with potentially different audio drivers, so that heterogeneous audio hardware can be used.

#### Acceptance Criteria
1. The audio engine shall support up to a maximum number of cards, each independently configured with its own audio device driver.
2. When an audio command is received for a specific card, the audio engine shall dispatch the operation to the driver configured for that card.
3. If a card has no driver configured, then the audio engine shall return an error response for any operation targeting that card.
4. The audio engine shall validate that card numbers, port numbers, and stream numbers are within the allowed maximum range before processing commands.

### Requirement 12: Handle Management
**Objective:** As a client application, I want stable playback handles that abstract card and stream numbers, so that I can reference active playback sessions consistently.

#### Acceptance Criteria
1. When a playback stream is loaded successfully, the audio engine shall allocate a handle from a pool of 256 handles using circular allocation.
2. The audio engine shall map each handle to its associated card number, stream number, and owning connection ID.
3. If a stale handle is detected (same card and stream already mapped to an existing handle), then the audio engine shall clear the stale handle, log a warning, and allocate a new one.
4. When a playback stream is unloaded, the audio engine shall free the associated handle.

### Requirement 13: Connection Lifecycle and Resource Cleanup
**Objective:** As a system operator, I want the audio engine to automatically clean up resources when clients disconnect, so that hardware resources are not permanently locked.

#### Acceptance Criteria
1. When a client connection drops, the audio engine shall identify all playback and recording streams owned by that connection.
2. When a disconnected client owned active playback streams, the audio engine shall stop and unload each playback stream.
3. When a disconnected client owned active recording streams, the audio engine shall stop and unload each recording stream.
4. When cleanup is complete, the audio engine shall clear all ownership references for the disconnected connection.

### Requirement 14: Daemon Startup and Initialization
**Objective:** As a system administrator, I want the audio engine to initialize all subsystems on startup, so that the service is ready to handle audio operations.

#### Acceptance Criteria
1. When the audio engine starts, the audio engine shall read its configuration file, open a database connection, and start the TCP command server.
2. When the configuration enables auto-provisioning and the station record does not exist in the database, the audio engine shall create the station record from the configured template.
3. When the configuration enables service auto-provisioning and the service record does not exist, the audio engine shall create the service record from the configured template.
4. If auto-provisioning fails, then the audio engine shall terminate with a non-zero exit code.
5. When the audio engine starts, it shall initialize all configured audio device drivers, probe hardware capabilities, and store detected capabilities in the database.
6. When the audio engine starts, it shall load mixer settings (input types, levels, modes, clock sources) from the database for all configured ports.
7. If the TCP port cannot be bound, then the audio engine shall log an error and terminate.
8. If the database connection cannot be established, then the audio engine shall log an error and terminate.

### Requirement 15: Graceful Shutdown
**Objective:** As a system administrator, I want the audio engine to shut down cleanly when receiving a termination signal, so that audio hardware is properly released.

#### Acceptance Criteria
1. When the audio engine receives a SIGTERM, SIGINT, or SIGHUP signal, the audio engine shall set a shutdown flag.
2. While the shutdown flag is set, on the next periodic timer cycle, the audio engine shall release all audio device driver resources and exit cleanly with code 0.

### Requirement 16: Codec Support Detection
**Objective:** As a system administrator, I want the audio engine to detect available audio codecs at startup, so that applications know which formats are supported.

#### Acceptance Criteria
1. When the audio engine starts, it shall check for the availability of the MP3 encoder library.
2. When the audio engine starts, it shall check for the availability of the MP4 decoder library.
3. When the audio engine starts, it shall dynamically load the MP2 encoder library if available.
4. When the audio engine starts, it shall dynamically load the MP3 decoder library if available.
5. The audio engine shall store detected codec capabilities in the station database record.
