# Implementation Plan

- [ ] 1. Domain value objects and constants for the audio engine
- [ ] 1.1 (P) Define domain enumerations and constants for audio operations
  - Audio codec types (PCM16, MPEG Layer 2, MPEG Layer 3, PCM24, FLAC) as scoped enum
  - Input channel modes (Normal, Swap, LeftOnly, RightOnly) as scoped enum
  - Input types (Analog, AES/EBU digital) as scoped enum
  - Playback state machine states (Idle, Loaded, Playing, Paused, Stopped) as scoped enum
  - Recording state machine states (Idle, Ready, Recording, RecordActive, Stopped) as scoped enum
  - System-wide maximum constants: max cards, max ports, max streams, max handles (256)
  - Error info structures for audio engine error categories (Hardware, Validation, Internal)
  - _Requirements: 3.5, 3.6, 5.1, 5.2, 5.3, 5.4, 11.4, 12.1_

- [ ] 1.2 (P) Define domain value objects for audio engine identifiers and parameters
  - Card number value object with range validation
  - Port number value object with range validation
  - Stream number value object with range validation
  - Handle identifier value object for the 256-entry handle pool
  - Audio level value object (dB-based, for volume and metering)
  - Connection identifier value object for tracking client ownership
  - _Requirements: 2.1, 11.4, 12.1, 12.2_

- [ ] 2. Handle manager with circular pool allocation
- [ ] 2.1 Implement handle allocation, lookup, and lifecycle management
  - Circular allocation from a pool of 256 handles, wrapping index from 255 back to 0
  - Each handle maps to a card number, stream number, and owning connection identifier
  - Allocate returns a new handle for a given card, stream, and owner
  - Lookup returns the card, stream, and owner for a given handle (or nothing if unallocated)
  - Find-by-card-stream returns the handle currently mapped to a specific card and stream combination
  - Free releases a handle back to the pool
  - Stale handle detection: when allocating, if the same card and stream are already mapped to an existing handle, clear the stale handle and log a warning before allocating the new one
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 2.2 Unit tests for handle manager
  - Test basic allocate and lookup round-trip
  - Test circular wrap-around when pool index reaches 255
  - Test stale handle detection and automatic clearing
  - Test free releases handle correctly
  - Test find-by-card-stream lookup
  - Test allocation with near-full pool (stress test approaching 256 handles)
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 3. Audio driver interface (port definition)
- [ ] 3.1 Define the outbound port interface for audio device drivers
  - Lifecycle methods: initialize with station configuration, free resources, get driver version
  - Playback methods: load playback from file, unload playback, set playback position, play with length/speed/pitch parameters, stop playback, query timescale support
  - Recording methods: load recording with codec/channels/sample-rate/bit-rate/filename, unload recording (returning recorded length), start recording with length and VOX threshold, stop recording
  - Volume and level methods: set input volume, set output volume, fade output volume over duration, set input level, set output level
  - Configuration methods: set input mode, set output mode, set input VOX level, set input type, get input status, set clock source, set audio passthrough level
  - Metering methods: get input meters (left/right), get output meters (left/right), get stream output meters (left/right), get output positions
  - All methods use domain value objects for parameters and return types
  - Pure virtual interface with virtual destructor, no implementation logic
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.3, 5.5, 5.6, 6.1, 6.2, 6.3, 7.2, 8.1, 8.2, 9.1, 11.1, 11.2_

- [ ] 4. Command protocol parsing and connection management
- [ ] 4.1 Implement connection state management for TCP clients
  - Per-connection state: socket reference, authentication flag, command accumulator buffer, meter UDP port, metering enabled flag
  - One state instance per active TCP connection, created on connect, destroyed on disconnect
  - Track authentication status independently for each connection
  - Buffer partial command data until a complete newline-delimited line is received
  - _Requirements: 1.1, 10.6, 10.7_

- [ ] 4.2 Implement TCP command server accepting client connections
  - Listen on a configured TCP port for incoming connections
  - Accept new connections and create associated connection state
  - Read incoming data, accumulate in the per-connection buffer, and extract complete command lines
  - Parse each command line as space-delimited tokens with the first token being a two-letter command code
  - Support sending responses targeted to a specific connection or broadcast to all connections
  - Maintain a map of all active connections for enumeration
  - Close connections on disconnect command or socket close
  - If the TCP port cannot be bound, report a fatal startup error
  - _Requirements: 1.1, 1.5, 10.1, 10.2, 10.6, 10.7, 14.7_

- [ ] 4.3 Implement command dispatch for all 26 protocol commands
  - Parse and validate arguments for each two-letter command code (DC, PW, LP, UP, PP, PY, SP, TS, LR, UR, RD, SR, IV, OV, FV, IL, OL, IM, OM, IX, IT, IS, AL, CS, OS, ME)
  - Emit typed events for each recognized command with parsed parameters
  - Check authentication state before dispatching privileged commands; silently ignore commands from unauthenticated connections (except PW and DC)
  - Return generic error response for unrecognized commands
  - Format success responses with command code, parameters, and "+!" marker
  - Format failure responses with command code and "-!" marker
  - _Requirements: 1.4, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 4.4 Implement password authentication handling
  - Accept PW command with a password string from any connection
  - Compare against the configured authentication password
  - On match, mark the connection as authenticated and respond with success
  - On mismatch, keep the connection unauthenticated and respond with failure
  - _Requirements: 1.2, 1.3_

- [ ] 4.5 Unit tests for protocol parsing and authentication
  - Test parsing of all 26 command codes with valid arguments
  - Test parsing with invalid/missing arguments
  - Test unrecognized command returns generic error
  - Test successful authentication flow
  - Test failed authentication flow
  - Test that privileged commands are silently ignored before authentication
  - Test partial command buffering and multi-line extraction
  - _Requirements: 1.2, 1.3, 1.4, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 5. Audio engine controller with driver dispatch
- [ ] 5.1 Implement the central audio engine controller with driver strategy dispatch
  - Maintain per-card driver configuration: each card independently mapped to its audio driver instance
  - Dispatch all audio operations to the correct driver based on the card number in the command
  - Validate that card numbers, port numbers, and stream numbers are within the allowed maximum range before dispatching
  - Return error responses when a card has no configured driver
  - Support up to the maximum number of cards, each independently configured
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 5.2 Implement playback command handlers in the engine controller
  - Handle load playback: select driver for card, call driver load, allocate handle from handle manager, track ownership by connection, return handle and stream in response
  - Handle play: look up handle, dispatch play to driver with length, speed, and pitch parameters
  - Handle play position (seek): look up handle, dispatch seek to driver
  - Handle stop playback: look up handle, dispatch stop to driver
  - Handle unload playback: look up handle, dispatch unload to driver, free handle, clear ownership
  - Return error if card has no driver or driver fails to allocate stream
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 5.3 Implement recording command handlers in the engine controller
  - Handle load recording: validate codec (0-4) and channel count (max 2), dispatch to driver, track ownership by connection
  - Handle record: dispatch record to driver with length and VOX threshold
  - Handle stop recording: dispatch stop to driver
  - Handle unload recording: dispatch unload to driver, set file ownership to configured user/group identifiers, clear ownership
  - Reject commands with invalid codec or channel count values
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 5.4 (P) Implement volume and level control command handlers
  - Handle set input volume: dispatch to driver with card, stream, and level
  - Handle set output volume: dispatch to driver with card, stream, port, and level
  - Handle fade output volume: dispatch to driver with card, stream, port, target level, and duration for gradual transition
  - Handle set input level: dispatch to driver with card, port, and level
  - Handle set output level: dispatch to driver with card, port, and level
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5.5 (P) Implement input and output configuration command handlers
  - Handle set input mode: validate mode value (0-3), dispatch to driver
  - Handle set input type: validate type value (0-1), dispatch to driver
  - Handle set input VOX level: dispatch to driver with stream-level threshold
  - Handle get input status: query driver and return signal status
  - Handle set output mode: dispatch to driver with card, stream, and mode
  - Handle set output status flag: set or clear the flag for card, port, stream, and state
  - Handle set audio passthrough level: configure direct routing level between input and output ports
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3_

- [ ] 5.6 (P) Implement clock source and timescaling command handlers
  - Handle set clock source: dispatch to driver with card and input selection
  - Handle timescaling support query: query driver for timescale capability and return result
  - _Requirements: 8.1, 8.2_

- [ ] 5.7 (P) Implement RTP capture command handler
  - Handle open RTP capture channel: dispatch to driver with card, port, UDP port, sample rate, and channel count
  - _Requirements: 9.1_

- [ ] 6. Connection lifecycle and resource cleanup
- [ ] 6.1 Implement automatic resource cleanup on client disconnect
  - When a connection drops, identify all playback streams owned by that connection across all cards
  - Stop and unload each owned playback stream, freeing associated handles
  - Identify all recording streams owned by that connection across all cards
  - Stop and unload each owned recording stream
  - Clear all ownership references for the disconnected connection
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 6.2 Integration tests for connection lifecycle
  - Test that disconnecting a client with active playback streams stops and unloads all streams
  - Test that disconnecting a client with active recording streams stops and unloads all streams
  - Test that handles are freed when the owning client disconnects
  - Test that resources from one client are not affected when a different client disconnects
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 7. Real-time meter publisher
- [ ] 7.1 Implement meter enable command and UDP meter delivery
  - Handle meter enable command: store the UDP port and list of card numbers for the requesting connection, mark metering as enabled
  - Set up a periodic timer at the configured meter update interval
  - On each timer tick, for each connection with metering enabled, poll the driver for input meter levels, output meter levels, stream meter levels, playback position data, and output status
  - Package polled data and send as UDP packets to each connection's configured meter port
  - Stop sending meter data when a client disconnects (remove meter configuration)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7.2 (P) Integration tests for meter delivery
  - Test that enabling meters causes periodic UDP packets to be sent
  - Test that meter packets contain correct input, output, and stream level data
  - Test that disconnecting stops meter delivery for that connection
  - Test meter update interval matches configuration
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 8. Daemon startup, initialization, and provisioning
- [ ] 8.1 Implement configuration file reading and database connection
  - Read the configuration file at startup to obtain database credentials, station name, authentication password, file paths, provisioning settings, and file ownership identifiers
  - Open a database connection using the configured credentials
  - If the database connection cannot be established, log an error and terminate the process
  - _Requirements: 14.1, 14.8_

- [ ] 8.2 Implement auto-provisioning of station and service records
  - If auto-provisioning for station is enabled and the station record does not exist in the database, create it from the configured template station
  - If auto-provisioning for service is enabled and the service record does not exist, create it from the configured template service
  - If either provisioning operation fails, terminate with a non-zero exit code
  - _Requirements: 14.2, 14.3, 14.4_

- [ ] 8.3 Implement audio driver initialization and hardware probing
  - Initialize all configured audio device drivers for each card
  - Probe hardware capabilities (number of inputs, outputs, driver version) and store detected capabilities in the database station record
  - Clear stale driver entries in the database before writing fresh probe results
  - Load mixer settings from the database for all configured ports: input types, input levels, output levels, input modes, clock sources
  - _Requirements: 14.5, 14.6_

- [ ] 8.4 Implement codec detection at startup
  - Check for availability of the MP3 encoder library
  - Check for availability of the MP4 decoder library
  - Dynamically load the MP2 encoder library if available
  - Dynamically load the MP3 decoder library if available
  - Store detected codec capabilities in the station database record
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 8.5 Wire startup sequence: configuration, database, provisioning, drivers, codec detection, TCP server
  - Execute the full startup sequence in order: read config, connect database, provision if needed, initialize drivers, probe hardware, load mixer settings, detect codecs, start command server, start meter timer
  - Set up process signal handlers for SIGTERM, SIGINT, SIGHUP
  - Verify the daemon is ready to accept client connections after initialization completes
  - _Requirements: 14.1, 14.5, 14.6, 14.7_

- [ ] 9. Graceful shutdown
- [ ] 9.1 Implement signal-driven graceful shutdown
  - When the process receives SIGTERM, SIGINT, or SIGHUP, set an internal shutdown flag
  - On the next periodic timer cycle (meter timer), check the shutdown flag
  - When the shutdown flag is set, release all audio device driver resources across all cards
  - Exit cleanly with exit code 0 after all drivers are freed
  - _Requirements: 15.1, 15.2_

- [ ] 10. Integration and end-to-end tests
- [ ] 10.1 Integration tests for full playback lifecycle via TCP protocol
  - Connect to the daemon, authenticate, load a playback file, play it, stop, unload, and verify each response matches the protocol format
  - Test that commands are correctly dispatched to the driver and handle allocation works end-to-end
  - Test error responses when targeting a card with no configured driver
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 10.3, 10.4_

- [ ] 10.2 Integration tests for full recording lifecycle via TCP protocol
  - Connect, authenticate, load a recording with various codec settings, start recording, stop, unload, and verify responses
  - Test codec and channel validation rejections
  - Test file ownership is set correctly after unload
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 10.3 (P) Integration tests for concurrent multi-client access
  - Connect multiple clients simultaneously, each performing independent operations
  - Verify per-connection authentication state isolation
  - Verify per-connection meter configuration isolation
  - Verify resource ownership isolation across connections
  - _Requirements: 10.6, 10.7, 13.1_

- [ ] 10.4 End-to-end tests for startup and shutdown
  - Start the daemon, verify it provisions station/service if configured, probes hardware, and begins listening
  - Send SIGTERM and verify all drivers are released and the process exits with code 0
  - Test startup failure when TCP port is already bound
  - Test startup failure when database is unreachable
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.7, 14.8, 15.1, 15.2_

- [ ] 10.5 (P) End-to-end test for authentication enforcement
  - Connect without authenticating and verify all privileged commands are silently ignored
  - Authenticate and verify commands are accepted
  - Test disconnect command works regardless of authentication status
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
