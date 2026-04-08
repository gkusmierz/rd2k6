# Requirements Document

## Introduction

The Audio Device Abstraction Library (HPI) provides an object-oriented abstraction layer for professional audio hardware used in broadcast environments. It encapsulates hardware probing, audio stream playback and recording, mixer control, metering, and audio device selection. This library is a foundational component (priority 0) that depends on the Core Library (LIB) and is consumed primarily by the Audio Engine daemon (CAE) and the IPC daemon (RPC).

The library enables broadcast automation systems to interact with professional sound cards without direct knowledge of the underlying hardware programming interface, supporting multi-adapter environments with multiple input/output streams, ports, and mixer controls per adapter.

## Requirements

### Requirement 1: Audio Device Discovery and Information

**Objective:** As a system integrator, I want the system to automatically detect and enumerate all installed professional audio adapters at startup, so that the broadcast system can use all available hardware without manual configuration.

#### Acceptance Criteria

1. When the audio device abstraction is initialized, the system shall probe all installed audio adapters and report the total number of detected adapters.
2. When an adapter is detected, the system shall discover its capabilities including: number of input streams, output streams, input ports, and output ports.
3. When an adapter is detected, the system shall retrieve hardware information including: serial number, interface version (major, minor, point), DSP firmware version (major, minor), PCB version, and assembly version.
4. When an adapter is detected, the system shall retrieve human-readable descriptions for the adapter, each input/output stream, and each input/output port.
5. When an adapter is detected, the system shall discover all available mixer controls including: volume, level, mode, VOX, and multiplexer controls for each stream and port.
6. When an adapter of the 6xxx series is detected, the system shall enable timescale support for that adapter.
7. When an adapter of type 5111 or 5211 is detected, the system shall configure multiplexer controls at the stream level instead of the port level.

### Requirement 2: Audio Playback Streaming

**Objective:** As a broadcast operator, I want to play audio files through a specific audio device stream, so that audio content can be broadcast on air.

#### Acceptance Criteria

1. When a playback request is initiated, the system shall acquire an available output stream, configure the audio format, and begin playback.
2. When playback is active, the system shall periodically fill the hardware buffer and report the current playback position in samples.
3. When playback is paused, the system shall suspend audio output while retaining the current position.
4. When playback is stopped, the system shall halt audio output, release the hardware stream, and reset the position to zero.
5. When the audio buffer is fully drained during playback, the system shall automatically transition to the stopped state.
6. When a seek position is requested, the system shall reposition playback to the specified sample offset.
7. When a playback speed change is requested, the system shall adjust the speed with independent pitch and rate control, provided the adapter supports timescaling.
8. When a play length limit is configured, the system shall automatically pause playback after the specified duration.
9. If a playback request is made but no audio file is loaded, the system shall return a "no file" error.
10. If a playback request is made but no output stream is available, the system shall return a "no stream" error.
11. If a playback request is made on an already-open stream, the system shall return an "already open" error.
12. When playback state changes, the system shall publish events indicating the new state (playing, paused, stopped) along with card and stream identifiers.

### Requirement 3: Audio Recording Streaming

**Objective:** As a broadcast operator, I want to record audio from a specific audio device stream to a file, so that incoming audio content can be captured for later use.

#### Acceptance Criteria

1. When a recording preparation request is made, the system shall acquire an input stream, configure the audio format, and reset the stream to a ready state.
2. When recording is started, the system shall begin capturing audio data from the hardware input stream.
3. When audio data is being captured, the system shall periodically drain the hardware buffer, write data to the output file, and report the current position in samples.
4. When the first audio data is received during recording, the system shall publish a "record started" event to distinguish preparation from actual data capture.
5. When recording is paused, the system shall suspend audio capture while retaining the current position and file state.
6. When recording is stopped, the system shall halt audio capture, release the hardware stream, close the output file, and reset the position to zero.
7. When a record length limit is configured, the system shall automatically pause recording after the specified duration.
8. Where voice-operated switching (VOX) is supported by the hardware, the system shall allow configuring a VOX threshold on the input stream.
9. If a recording request is made but no output file has been created, the system shall return a "no file" error.
10. If a recording request is made but no input stream is available, the system shall return a "no stream" error.
11. If a recording request is made on an already-open stream, the system shall return an "already open" error.
12. When recording state changes, the system shall publish events indicating the new state (ready, recording, record started, paused, stopped) along with card and stream identifiers.

### Requirement 4: Mixer and Volume Control

**Objective:** As a broadcast engineer, I want to control audio mixer settings (volumes, levels, channel modes, and signal routing) on the audio hardware, so that audio signals are properly routed and leveled for broadcast.

#### Acceptance Criteria

1. When an input stream volume change is requested, the system shall set the gain on the specified card, stream, and port.
2. When an output stream volume change is requested, the system shall set the gain on the specified card, stream, and port.
3. When an output volume fade is requested, the system shall automatically transition the volume to the target level over the specified duration.
4. When an input port level (trim) change is requested, the system shall adjust the trim level on the specified port.
5. When an output port level (trim) change is requested, the system shall adjust the trim level on the specified port.
6. When an input port channel mode change is requested, the system shall set the mode (normal, swap, left-only, right-only) and publish a mode change event.
7. When an output stream channel mode change is requested, the system shall set the mode and publish a mode change event.
8. When an input port multiplexer source is set to line-in or digital audio input, the system shall configure the hardware multiplexer accordingly.
9. If an input port multiplexer source is set to an unsupported node type, the system shall reject the request and return false.
10. Where passthrough volume control is supported between an input port and output port, the system shall allow setting the passthrough volume level.
11. The system shall support two fade profiles: linear and logarithmic.
12. If a volume, level, or mode control is requested on hardware that does not support that control, the system shall ignore the request without error.

### Requirement 5: Audio Metering and Monitoring

**Objective:** As a broadcast engineer, I want to monitor real-time audio levels and detect digital audio signal errors, so that I can ensure broadcast audio quality.

#### Acceptance Criteria

1. Where input stream metering is available, the system shall provide peak level readings for left and right channels.
2. Where output stream metering is available, the system shall provide peak level readings for left and right channels.
3. Where input port metering is available, the system shall provide peak level readings for left and right channels.
4. Where output port metering is available, the system shall provide peak level readings for left and right channels.
5. When meter level data is read, the system shall publish events with the level value for each channel (left/right) and location (stream/port).
6. When a digital audio input port has an error status change, the system shall publish an input port error event identifying the card and port.
7. The system shall periodically poll digital audio error status at a configured interval.
8. If a meter read is requested for a non-existent stream or port, the system shall return false without accessing hardware.
9. If a meter read is requested for a card index beyond the detected adapter count, the system shall return false without accessing hardware.

### Requirement 6: Audio Device Selection

**Objective:** As a broadcast operator, I want to select an audio device port from a list of available devices, so that I can configure which hardware port to use for playback or recording.

#### Acceptance Criteria

1. When the device selector is initialized, the system shall display a list of all available card and port combinations with human-readable descriptions.
2. When the user selects a device from the list, the system shall publish a change event with the selected card and port indices.
3. When the selected card changes, the system shall publish a card-changed event.
4. When the selected port changes, the system shall publish a port-changed event.
5. The system shall support separate selectors for playback devices and recording devices.

### Requirement 7: Audio Format Support Validation

**Objective:** As a system component, I want to verify whether a specific audio format is supported by the hardware before attempting playback or recording, so that incompatible formats are detected early.

#### Acceptance Criteria

1. When format support is queried for a PCM format, the system shall check the hardware for support of the specific bit depth (8-bit, 16-bit, 24-bit, 32-bit).
2. When format support is queried for a compressed audio format, the system shall check the hardware for support of the specific compression layer.
3. The system shall provide format validation for both playback and recording streams.

### Requirement 8: Error Handling and Logging

**Objective:** As a system administrator, I want all hardware interface errors to be logged with sufficient detail, so that hardware problems can be diagnosed.

#### Acceptance Criteria

1. When any hardware API call returns a non-zero error code, the system shall log the error description to the system log at warning level.
2. When a hardware error is logged, the system shall include the error text and the source location (file and line number).
3. The system shall propagate hardware error codes to callers after logging.
4. If any method is called with a card, stream, or port index outside the valid range, the system shall reject the call without invoking the hardware API.
