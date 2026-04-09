# Implementation Plan

- [ ] 1. Define domain value objects and enumerations for the audio hardware abstraction
- [ ] 1.1 (P) Create the adapter information value object
  - Define a pure C++ value object that holds all hardware adapter metadata: serial number, HPI version (major, minor, point), DSP firmware version (major, minor), PCB version, and assembly version
  - All fields are unsigned integers with a clear/reset method that sets everything to zero
  - Implement getters, setters, and equality comparison
  - Place in the domain layer with no Qt dependencies
  - _Requirements: 1.3_

- [ ] 1.2 (P) Define domain enumerations and constants
  - Define scoped enumerations for: playback state (stopped, playing, paused), recording state (stopped, record-ready, recording, record-started, paused), channel mode (normal, swap, left-only, right-only), fade profile (linear, logarithmic), source node types (line-in, digital audio input, and unsupported markers), and clock source
  - Define playback error codes: ok, no-file, no-stream, already-open
  - Define recording error codes: ok, no-file, no-stream, already-open
  - Define system-wide constants: maximum adapters, maximum streams per adapter, maximum ports/nodes per adapter
  - All enumerations must use enum class; all constants must be constexpr
  - _Requirements: 2.9, 2.10, 2.11, 3.9, 3.10, 3.11, 4.6, 4.8, 4.11_

- [ ] 1.3 (P) Define the audio format descriptor value object
  - Create a value object that describes an audio format including sample type (PCM bit depths: 8, 16, 24, 32; compressed layers), sample rate, and channel count
  - This object is used by both playback and recording streams when querying hardware format support
  - _Requirements: 7.1, 7.2_

- [ ] 2. Define port interfaces for the hardware abstraction layer
- [ ] 2.1 (P) Define the outbound port interface for hardware API access
  - Create a pure virtual interface that abstracts all direct audio hardware API calls: adapter probing, stream acquisition/release, stream start/stop/reset, buffer read/write/query, mixer control handle acquisition, volume/level/mode/mux setting, meter reading, format support querying, and error description retrieval
  - This interface is the sole boundary between the library and the actual hardware programming interface
  - All methods accept card, stream, and port indices as parameters
  - Include error code return values on all hardware-facing methods
  - Place in the ports/outbound layer
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3_

- [ ] 2.2 (P) Define the outbound port interface for logging
  - Create a pure virtual interface for system logging that accepts a message, severity level, and source location (file and line)
  - This interface wraps all logging calls so that the library does not depend directly on any logging framework
  - _Requirements: 8.1, 8.2_

- [ ] 2.3 (P) Define the outbound port interface for configuration access
  - Create a pure virtual interface that provides the meter polling interval and any other configurable parameters the library needs from the core library configuration
  - _Requirements: 5.7_

- [ ] 3. Implement the Sound Card Manager service -- discovery and capability probing
- [ ] 3.1 Implement adapter discovery and capability enumeration
  - On construction, probe all installed audio adapters through the hardware port interface and store the total adapter count
  - For each detected adapter, discover: number of input streams, output streams, input ports, and output ports
  - For each adapter, retrieve hardware information and populate an adapter information value object
  - For each adapter, retrieve human-readable descriptions for the adapter itself, each stream, and each port
  - Detect 6xxx-series adapters and flag them as timescale-capable
  - Detect 5111/5211-type adapters and flag them for stream-level multiplexer control instead of port-level
  - All card/stream/port indices must be bounds-validated before any hardware access
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 8.4_

- [ ] 3.2 Implement capability matrix discovery for mixer controls
  - During initialization, for each adapter discover which mixer controls are available per stream and port: volume controls (input stream, output stream), level/trim controls (input port, output port), mode controls (input port, output stream), VOX controls (input stream), multiplexer controls (input port or input stream depending on adapter type), meter availability (all streams and ports), and passthrough volume support (input port to output port pairs)
  - Store capabilities as boolean matrices indexed by card, stream/port
  - Hardware API handles for each discovered control must be acquired and cached for later use
  - _Requirements: 1.5, 4.12, 5.8, 5.9_

- [ ] 4. Implement the Sound Card Manager service -- mixer and volume control
- [ ] 4.1 (P) Implement volume and level control operations
  - Implement setting input stream volume (gain) on a specified card, stream, and port
  - Implement setting output stream volume (gain) on a specified card, stream, and port
  - Implement getting current input and output volume values
  - Implement setting input port level (trim) and output port level (trim)
  - All operations must check the capability matrix before invoking hardware; silently return if the control is unsupported
  - All operations must validate card/stream/port bounds before hardware access
  - Log any non-zero hardware error codes at warning level with error description and source location
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.12, 8.1, 8.2, 8.3, 8.4_

- [ ] 4.2 (P) Implement volume fade support
  - Implement output volume fade that transitions volume to a target level over a specified duration
  - Support two fade profiles: linear and logarithmic
  - Provide getter and setter for the current fade profile
  - _Requirements: 4.3, 4.11_

- [ ] 4.3 (P) Implement channel mode and multiplexer control
  - Implement setting the input port channel mode (normal, swap, left-only, right-only) and publish a mode change event when successful
  - Implement setting the output stream channel mode and publish a mode change event when successful
  - Implement setting the input port multiplexer source; accept only line-in and digital audio input as valid sources, reject unsupported node types by returning false
  - Implement getting the current input port multiplexer source
  - For adapters flagged as stream-level mux, route mux operations to the stream handle instead of the port handle
  - _Requirements: 4.6, 4.7, 4.8, 4.9_

- [ ] 4.4 (P) Implement passthrough volume control
  - Implement querying whether passthrough volume is available between a given input port and output port pair
  - Implement setting the passthrough volume level between an input port and output port
  - _Requirements: 4.10_

- [ ] 5. Implement the Sound Card Manager service -- metering and error monitoring
- [ ] 5.1 Implement meter reading for all stream and port types
  - Implement input stream meter reading returning left and right channel peak levels
  - Implement output stream meter reading returning left and right channel peak levels
  - Implement input port meter reading returning left and right channel peak levels
  - Implement output port meter reading returning left and right channel peak levels
  - Return false without hardware access if the requested card, stream, or port index is out of range
  - Return false without hardware access if the meter capability is not available for the requested location
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.8, 5.9_

- [ ] 5.2 Implement periodic metering and error polling timer
  - Set up a periodic timer at the configured meter interval (read from configuration port)
  - On each tick, read all available meters and publish individual events for each channel and location: left/right input stream, left/right output stream, left/right input port, left/right output port
  - On each tick, poll digital audio error status for all input ports; when the error word changes, publish an input port error event identifying the card and port
  - _Requirements: 5.5, 5.6, 5.7_

- [ ] 6. Implement the Playback Stream service
- [ ] 6.1 Implement playback stream lifecycle management
  - Implement opening a wave file through the core library wave file facility; return a no-file error if no file is available
  - Implement starting playback: acquire an output stream through the hardware port, configure the audio format, start the stream, and publish played and state-changed events; return a no-stream error if no stream is available, and an already-open error if the stream is already in use
  - Implement pausing playback: suspend audio output while retaining position, publish paused and state-changed events
  - Implement stopping playback: halt output, release the hardware stream, reset position to zero, publish stopped and state-changed events
  - Implement automatic stop when the audio buffer is fully drained
  - Enforce the state machine: stopped to playing, playing to paused, playing to stopped, paused to playing, paused to stopped
  - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.9, 2.10, 2.11, 2.12_

- [ ] 6.2 Implement playback buffer management and position tracking
  - Set up a periodic timer that drives buffer filling
  - On each tick, query the hardware buffer status and write audio data from the wave file into the buffer
  - Report the current playback position in samples by publishing a position event
  - Detect buffer drain condition and trigger automatic transition to stopped state
  - _Requirements: 2.2, 2.5_

- [ ] 6.3 (P) Implement playback seek, speed control, and length limiting
  - Implement repositioning playback to a specified sample offset
  - Implement speed change with independent pitch and rate control; verify the adapter supports timescaling before applying, return false if unsupported
  - Implement play length limiting that automatically pauses playback after the configured duration
  - _Requirements: 2.6, 2.7, 2.8_

- [ ] 6.4 (P) Implement audio format support validation for playback
  - Implement format support querying that checks the hardware for PCM format support at specific bit depths (8, 16, 24, 32) and compressed audio format support at specific compression layers
  - Return a boolean indicating whether the format is supported on the current output stream
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 7. Implement the Recording Stream service
- [ ] 7.1 Implement recording stream lifecycle management
  - Implement creating a wave file through the core library wave file facility; return a no-file error if file creation fails
  - Implement preparing for recording: acquire an input stream through the hardware port, configure the audio format, reset the stream to ready state, and publish a ready and state-changed event; return a no-stream error if no stream is available, and an already-open error if the stream is already in use
  - Implement starting recording: begin capturing audio from the hardware input stream, publish recording and state-changed events
  - Implement pausing recording: suspend capture while retaining position and file state, publish paused and state-changed events
  - Implement stopping recording: halt capture, release the hardware stream, close the output file, reset position to zero, publish stopped and state-changed events
  - Enforce the state machine: stopped to record-ready, record-ready to recording, recording to record-started (on first data), record-started to paused, record-started to stopped, recording to paused, recording to stopped, paused to stopped
  - _Requirements: 3.1, 3.2, 3.5, 3.6, 3.9, 3.10, 3.11, 3.12_

- [ ] 7.2 Implement recording buffer management and position tracking
  - Set up a periodic timer that drives buffer draining
  - On each tick, query the hardware buffer status and read audio data from the input stream buffer
  - Write captured data to the output wave file
  - Report the current recording position in samples by publishing a position event
  - On receiving the first audio data, publish a record-started event to distinguish preparation from actual data capture
  - _Requirements: 3.3, 3.4_

- [ ] 7.3 (P) Implement VOX support and record length limiting
  - Implement configuring a VOX threshold on the input stream when the hardware supports it
  - Implement querying whether VOX is available for the current stream
  - Implement record length limiting that automatically pauses recording after the configured duration
  - _Requirements: 3.7, 3.8_

- [ ] 7.4 (P) Implement audio format support validation for recording
  - Implement format support querying for recording streams that checks the hardware for PCM format support at specific bit depths and compressed audio format support at specific compression layers
  - Return a boolean indicating whether the format is supported on the current input stream
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 8. Implement the Sound Selector Widget
- [ ] 8.1 Implement device selection list population and event handling
  - On initialization, query the Sound Card Manager for all detected adapters and their ports, and build a flat list of "adapter description -- port description" entries
  - Support separate instances for playback devices (output ports) and recording devices (input ports)
  - When the user selects an item from the list, decode the selection into card and port indices
  - Publish a changed event with the selected card and port indices
  - Publish a card-changed event when the card selection changes
  - Publish a port-changed event when the port selection changes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9. Implement hardware API adapter and error handling infrastructure
- [ ] 9.1 Implement the hardware API adapter
  - Create a concrete adapter implementing the hardware API outbound port interface, wrapping the actual audio hardware programming interface (AudioScience HPI or equivalent)
  - Every hardware API call that returns a non-zero error code must be logged at warning level through the logging port, including error description text and source location
  - Error codes must be propagated to callers after logging
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 9.2 (P) Implement the logging adapter
  - Create a concrete adapter implementing the logging outbound port, routing log messages to the core library logging facility
  - Include error text and source location (file and line number) in all logged messages
  - _Requirements: 8.1, 8.2_

- [ ] 10. Integration testing and system wiring
- [ ] 10.1 Implement unit tests for domain value objects and state machines
  - Test adapter information getter/setter round-trip and clear/reset behavior
  - Test all enumeration values and constant definitions
  - Test playback and recording state machine transitions follow the defined diagrams exactly (valid transitions succeed, invalid transitions are rejected)
  - Test audio format descriptor construction and comparison
  - _Requirements: 1.3, 2.12, 3.12_

- [ ] 10.2 Implement unit tests for bounds validation and capability guards
  - Test that all Sound Card Manager methods reject out-of-range card, stream, and port indices without invoking the hardware port
  - Test that volume, level, mode, and mux control methods are silently no-ops when the capability is absent
  - Test that multiplexer source validation accepts only line-in and digital audio input, rejecting all other node types
  - Test that meter reads return false for non-existent streams, ports, and cards beyond the adapter count
  - _Requirements: 4.9, 4.12, 5.8, 5.9, 8.4_

- [ ] 10.3 Implement integration tests with mock hardware API
  - Test full Sound Card Manager initialization: probe discovers adapters, capabilities, and descriptions through the mock hardware port
  - Test full playback stream lifecycle: open file, play, timer tick fills buffer and reports position, stop releases stream
  - Test full recording stream lifecycle: create file, prepare, record, timer tick drains buffer and reports position, first-data event fires, stop closes file
  - Test meter polling: timer triggers meter reads, events are published with correct card/stream/port and level values
  - Test digital audio error monitoring: error word change triggers input port error event with correct card and port identifiers
  - Test mixer control flow: set volumes, levels, modes on a multi-stream adapter and verify the mock hardware port received correct calls
  - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2, 2.12, 3.1, 3.3, 3.4, 3.12, 4.1, 4.2, 4.6, 5.5, 5.6, 5.7_

- [ ] 10.4 Wire all components together in the composition root
  - Create the factory or wiring code that constructs the hardware API adapter, logging adapter, configuration adapter, Sound Card Manager, and exposes the library API to consumers (Audio Engine daemon, IPC daemon)
  - Verify that all port interfaces are satisfied and dependency injection is complete
  - _Requirements: 1.1, 8.1_
