# Implementation Plan

- [ ] 1. Core message buffer with framing logic
- [ ] 1.1 (P) Implement the per-source metadata buffer as a domain-level component
  - Create the buffer that accumulates raw bytes from a single source
  - Implement detection of the `\r\n\r\n` message terminator to mark a message as complete
  - Implement the two-state cycle: Committed and Accumulating
  - When new data arrives after a committed message, clear the buffer before appending
  - Expose a method to check whether the buffer currently holds a committed (complete) message
  - Expose a method to retrieve the buffer contents for broadcasting
  - The buffer treats all data as an opaque byte stream with no content interpretation
  - _Requirements: 3.1, 3.2, 3.4, 3.5_
  - _Contracts: MetadataBuffer State_

- [ ] 1.2 (P) Unit tests for message buffer framing and state transitions
  - Verify that appending data without the terminator keeps the buffer in Accumulating state
  - Verify that appending data ending with `\r\n\r\n` transitions to Committed state
  - Verify correct detection when the terminator arrives split across multiple writes
  - Verify that the first append after Committed clears the old buffer before accumulating new data
  - Verify that retrieving the buffer returns the complete accumulated content
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ] 2. Client connection management over TCP
- [ ] 2.1 (P) Implement the client manager that handles TCP consumer connections
  - Accept new client connections from the TCP server and register them in an active-client map keyed by connection identifier
  - Handle client disconnect events by removing the connection from the map and cleaning up resources
  - When a disconnect references an unknown identifier, log a warning to standard error and continue operation
  - Expose the active-client map so the relay engine can iterate over connected clients for broadcasting
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Contracts: ClientManager Service_

- [ ] 2.2 Unit tests for client connection lifecycle
  - Verify that connecting a client adds it to the active-client map
  - Verify that disconnecting a known client removes it and cleans up
  - Verify that disconnecting an unknown client logs a warning but does not crash
  - Verify that the active-client map correctly reflects the current set of connections
  - Depends on 2.1
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Source connection management over local IPC
- [ ] 3.1 (P) Implement the source manager that handles IPC source connections
  - Accept new source connections from the IPC server and register them with a per-source metadata buffer
  - Route incoming data from each source to its corresponding buffer
  - When the buffer signals a complete message, trigger the relay engine to broadcast
  - Handle source disconnect events by removing the connection and its associated buffer
  - When a disconnect references an unknown identifier, log a warning to standard error and continue
  - If a pending connection acceptance returns null, log the error to standard error and terminate with a non-zero exit code
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.3_
  - _Contracts: SourceManager Service_

- [ ] 3.2 Unit tests for source connection lifecycle and data routing
  - Verify that connecting a source creates a new metadata buffer for it
  - Verify that incoming data is routed to the correct per-source buffer
  - Verify that source disconnect removes the connection and its buffer
  - Verify that disconnecting an unknown source logs a warning without crashing
  - Depends on 3.1 and 1.1
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 4. Relay engine for broadcasting and state replay
- [ ] 4.1 Implement the relay engine that broadcasts completed messages to all clients
  - When a source buffer completes a message, send the full buffer contents to every active client connection
  - Implement the state-replay capability: when a new client connects, iterate all source buffers and send each committed buffer to the new client
  - If no sources have committed messages, accept the client without sending initial data
  - Messages are broadcast in the order they are completed
  - Depends on 1.1 (MetadataBuffer), 2.1 (ClientManager), 3.1 (SourceManager)
  - _Requirements: 3.3, 4.1, 4.2_
  - _Contracts: RelayEngine Service, RelayEngine Event_

- [ ] 4.2 Unit tests for broadcast and state replay
  - Verify that a completed message is sent to all connected clients
  - Verify that a newly connected client receives committed buffers from all active sources
  - Verify that a newly connected client receives nothing when no sources have committed messages
  - Verify correct broadcast ordering when multiple sources complete messages
  - Depends on 4.1
  - _Requirements: 3.3, 4.1, 4.2_

- [ ] 5. Daemon startup, port binding, and lifecycle
- [ ] 5.1 Implement the daemon controller that bootstraps and runs the service
  - Bind the TCP server to the designated client port on all network interfaces at startup
  - If the TCP binding fails, print an error identifying the port to standard error and terminate with non-zero exit code
  - Bind the IPC server to the designated local socket address at startup
  - If the IPC binding fails, print an error with the failure reason to standard error and terminate with non-zero exit code
  - Wire together the source manager, client manager, and relay engine
  - Enter the event loop and run as a headless background service with no graphical interface
  - Depends on 2.1, 3.1, 4.1
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Contracts: DaemonController Service_

- [ ] 5.2 Unit tests for startup failure handling
  - Verify that a TCP port binding failure produces the correct error message and non-zero exit
  - Verify that an IPC socket binding failure produces the correct error message and non-zero exit
  - Depends on 5.1
  - _Requirements: 5.2, 5.4_

- [ ] 6. End-to-end integration tests
- [ ] 6.1 Source-to-client relay and multi-client broadcast integration test
  - Connect a source and a client, send a complete message from the source, verify the client receives the exact buffer
  - Connect multiple clients, send a message from the source, verify all clients receive it
  - Send partial data without the terminator, verify no broadcast occurs; then send the remaining data with the terminator and verify broadcast
  - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.3, 3.4_

- [ ] 6.2 State replay and lifecycle integration test
  - Connect a source, send a committed message, then connect a new client, verify it receives the current state
  - Disconnect a source, verify cleanup occurs and subsequent client operations are not affected
  - Rapidly connect and disconnect both sources and clients under load to verify lifecycle robustness
  - _Requirements: 2.3, 4.1, 4.2_
