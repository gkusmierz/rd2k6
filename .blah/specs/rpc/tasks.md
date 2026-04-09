# Implementation Plan

- [ ] 1. Domain value objects and core types for the IPC daemon
- [ ] 1.1 Define domain value objects for matrix identifiers, GPIO pin addresses, connection identifiers, macro command representation, and RML command codes
  - Create strongly-typed identifiers for matrix numbers (with valid range validation), GPIO line numbers, TTY port numbers, connection IDs, and macro timer numbers
  - Define an enumeration of all supported device types covering the 43+ hardware switcher types
  - Define an enumeration for all RML command codes (switcher, GPIO, TTY, timer, system, notification)
  - Create a macro command value object that holds command code, target matrix, arguments, originating address, and target port
  - Define GPIO state representation (pin state, mask state, on-cart and off-cart numbers)
  - Define error info codes specific to this daemon (authentication failure, invalid matrix, invalid TTY port, connection refused, parse error)
  - _Requirements: 1.1, 2.1, 3.1, 3.7, 4.1, 6.1_

- [ ] 1.2 (P) Define domain value objects for TTY configuration, notification messages, and station state
  - Create a TTY configuration value object holding port path, baud rate, data bits, parity, and termination settings
  - Define a notification message value object with message content and sender address
  - Define station state value objects for the on-air flag and current user
  - Create a GPIO event record value object for audit logging (station name, matrix, line, type, edge, timestamp)
  - _Requirements: 6.1, 7.1, 9.1, 4.7_

- [ ] 2. Port interfaces for the IPC daemon
- [ ] 2.1 Define outbound port interfaces for database access
  - Define a matrix configuration repository port that can load all matrix configurations for a station, returning device type, port, and I/O counts
  - Define a GPIO repository port for loading and saving GPI/GPO macro cart assignments, inserting new auto-discovered GPIO lines, and updating GPIO counts on matrices
  - Define a GPIO event logging port for inserting audit log entries when GPIO state changes occur
  - Define a TTY configuration repository port for loading serial port configurations for a station
  - _Requirements: 3.1, 4.1, 4.7, 4.9, 5.1, 5.2, 5.3, 6.1_

- [ ] 2.2 (P) Define outbound port interfaces for network and system operations
  - Define a UDP transport port for sending RML commands to remote stations and receiving commands on echo, no-echo, and reply ports
  - Define a multicast transport port for joining a multicast group, sending notifications, and receiving notifications
  - Define a system command executor port for running OS commands asynchronously with specified user and group credentials
  - Define a service manager notification port for signaling the service manager daemon about dropbox scan requests
  - _Requirements: 2.1, 2.3, 7.1, 7.3, 10.1, 10.2_

- [ ] 2.3 (P) Define inbound port interfaces for daemon use cases
  - Define an IPC daemon service port exposing client connection management (accept, authenticate, disconnect)
  - Define command dispatch use case covering RML command submission from both TCP and UDP sources
  - Define GPIO query use case for retrieving current GPI/GPO states, mask states, and cart assignments
  - Define station state query and update use case for on-air flag and current user
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 4.8, 9.1, 9.2, 9.3, 9.4_

- [ ] 3. Switcher driver abstraction and factory
- [ ] 3.1 Implement the base switcher driver interface
  - Define a common abstract interface that all hardware drivers implement, providing device type identification, GPI/GPO quantity reporting, TTY activity status, and command processing
  - Include event publication capabilities for GPI state changes, GPO state changes, initial state reports, and RML echo
  - Provide shared utility methods available to all drivers: execute a macro cart, log byte sequences, and insert GPIO event entries
  - Include virtual methods with default implementations for sending current GPI/GPO state snapshots
  - _Requirements: 3.2, 3.7, 4.2, 8.4_

- [ ] 3.2 Implement the driver factory that instantiates drivers based on database-configured matrix type
  - Map each device type enumeration value to the corresponding concrete driver class
  - When a matrix type is not recognized, log a warning and skip that matrix without affecting others
  - After instantiation, connect the driver's events (GPI changed, GPO changed, state reports, RML echo) to the main controller
  - _Requirements: 3.1, 3.3, 3.4_

- [ ] 4. Connection manager and client authentication
- [ ] 4.1 Implement TCP server that accepts client connections and manages their lifecycle
  - Listen for TCP connections on the configured daemon port
  - Assign a connection identifier to each new connection and begin accepting commands
  - Accumulate incoming data per connection until the command delimiter is received, then dispatch the complete command
  - When a disconnect command is received or the socket closes, mark the connection for deferred cleanup
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 4.2 Implement password authentication and garbage collection
  - When a client sends a password command, validate it against the configured password and mark the connection as authenticated on success, responding with a success indicator
  - Reject any privileged command from an unauthenticated connection with a failure indicator
  - Run a periodic garbage collection timer that deletes all connections marked for closing and frees their resources
  - _Requirements: 1.3, 1.4, 1.6_

- [ ] 5. Command dispatcher and RML processing
- [ ] 5.1 Implement TCP protocol command parsing and routing
  - Parse incoming commands by their protocol code (DC, PW, RU, SU, MS, ME, RG, GI, GO, GM, GN, GC, GD, ON, TA) and route each to the appropriate handler
  - Enforce the authentication requirement on all privileged commands before routing
  - _Requirements: 1.4, 2.1, 4.8_

- [ ] 5.2 Implement RML command dispatch with local loopback and remote forwarding
  - Accept RML commands from both TCP client connections and UDP sockets (echo, no-echo, and reply ports)
  - Detect when a command targets the local station address and process it locally instead of sending it over the network
  - Forward commands targeting remote station addresses via UDP to the target host
  - Broadcast the result of locally-processed commands to all authenticated TCP clients
  - Support legacy RML format conversion for backward compatibility
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5.3 Implement macro timer delayed execution
  - When a macro timer command is received with a valid timer number, store the associated cart number and start a delay timer
  - When the timer expires, execute the stored cart and clear the stored cart number
  - _Requirements: 2.6, 2.7_

- [ ] 6. GPIO state management
- [ ] 6.1 Implement GPIO state tables with mask logic and cart triggers
  - At startup, load GPI and GPO macro cart assignments from the database for all configured matrices
  - Maintain in-memory state tables for all GPI/GPO pins across all matrices
  - When a hardware GPI state change is detected, update the internal state table and broadcast the new state (including mask status) to all authenticated clients
  - When a GPI changes and the mask is enabled and a macro cart is assigned, execute the on-cart for rising edge or off-cart for falling edge
  - When a GPI line is masked, broadcast the state change but do not execute the macro cart
  - Apply the same mask and cart execution logic for GPO state changes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 6.2 Implement GPIO event logging and client query responses
  - When a GPIO state change occurs with the mask enabled, log the event to the database with station name, matrix, line number, type, edge direction, and timestamp
  - Respond to client requests for GPI status, GPO status, mask states, and cart assignments
  - Support reloading GPIO cart assignments from the database on client request
  - _Requirements: 4.7, 4.8, 4.9_

- [ ] 6.3 Implement GPIO auto-discovery for self-configuring network devices
  - When a self-configuring device (such as Wheatnet or Livewire) reports its GPIO lines, check if corresponding entries exist in the GPIO tables
  - If no entry exists for a discovered GPIO line, insert a new record into the GPI or GPO table
  - After discovering new lines, update the matrices table with the total GPIO count
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 7. Serial TTY device management
- [ ] 7.1 Implement TTY port initialization and data forwarding
  - At startup, read TTY port configuration from the database and open all active serial ports with configured baud rate, data bits, parity, and termination settings
  - If a serial port cannot be opened, log a warning and continue without that port
  - When data is available on a TTY port, read the data and forward it to the appropriate driver
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 7.2 Implement serial code traps and binary output commands
  - When a serial code trap fires (pattern match on incoming TTY data), execute the associated cart
  - When a binary output command is received, validate the TTY port number is within range before writing data
  - If the TTY port number is out of range, negatively acknowledge the command
  - _Requirements: 6.4, 6.5, 6.6_

- [ ] 8. Notification multicasting
- [ ] 8.1 Implement multicast notification transport
  - Join the notification multicast group at daemon startup
  - When a client sends a notification command, broadcast it to all other authenticated local clients and send it to the multicast group
  - When a multicast notification is received from the network, process it locally and broadcast it to all authenticated clients
  - When a dropbox notification matches the local station name, signal the service manager daemon to initiate a dropbox scan
  - If a notification cannot be parsed, log an informational message with the sender address
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9. Network driver resilience
- [ ] 9.1 Implement automatic reconnection for network-attached switcher drivers
  - When a TCP connection to a network device is lost, log a warning with the device address
  - Start a reconnect timer and periodically attempt to re-establish the connection
  - When a connection attempt is refused, log a warning and continue the reconnection cycle
  - When a connection is re-established, resume normal command processing and GPIO event handling
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Station state management and system command execution
- [ ] 10.1 (P) Implement on-air flag and current user management
  - When an on-air flag command is received with a valid argument, update the state and broadcast it to all connected clients
  - Respond to client queries for the current on-air flag value
  - When a set-user command is received, update the current user on the station
  - Respond to client queries for the current user name
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 10.2 (P) Implement asynchronous system command execution
  - When an RML run-command is received, execute the specified system command with the configured user and group credentials
  - Execute commands asynchronously so that daemon operation is not blocked
  - _Requirements: 10.1, 10.2_

- [ ] 11. Daemon lifecycle and startup orchestration
- [ ] 11.1 Implement the startup sequence that initializes all subsystems in order
  - Bind the TCP server on the daemon port; if binding fails, log an error and terminate
  - Bind the UDP sockets for echo, no-echo, and reply ports
  - Load GPIO tables from the database
  - Read matrix configurations and instantiate drivers via the factory
  - Open TTY ports with configured settings
  - Join the notification multicast group
  - Start the exit polling timer at 200ms interval
  - _Requirements: 11.1, 11.2_

- [ ] 11.2 Implement clean shutdown via exit flag polling
  - Poll a global exit flag every 200 milliseconds
  - When the exit flag is set, initiate a clean shutdown of all drivers, close all client connections, and release all resources
  - _Requirements: 11.3, 11.4_

- [ ] 12. Concrete driver implementations
- [ ] 12.1 Implement serial-based switcher drivers
  - Implement drivers for BroadcastTools serial devices (16x1, 10x1, 16x2, 8x2, SS series, ACS, ADMS, SRC, GPI-16) using the common switcher base interface
  - Implement drivers for SAS serial devices (64000, 64000 GPI, 32000, 16000)
  - Implement drivers for Ross/NK SCP, ACU-1 protocol, Unity 4000 satellite receiver, StarGuide III satellite receiver, 360 Systems AM-16, and Modem Lines
  - Each driver must implement device type identification, GPI/GPO quantity, TTY activity, and command processing
  - Each driver must publish GPIO state change events and RML echo events through the base interface
  - _Requirements: 3.1, 3.2, 3.7_

- [ ] 12.2 Implement network-based switcher drivers
  - Implement drivers for BroadcastTools network devices (U4.1 MLR Web, Sentinel 4 Web) using the common switcher base interface
  - Implement drivers for SAS USI, Logitek (vGuest, Harlond), Livewire (LWRP GPIO, LWRP Audio, Multicast GPIO), Wheatnet (SLIO, LIO), Quartz Type 1, GrassValley 7000, Software Authority, and Modbus TCP
  - All network drivers must incorporate the automatic reconnection logic from the resilience task
  - Network drivers for self-configuring protocols (Livewire, Wheatnet) must support GPIO auto-discovery
  - _Requirements: 3.1, 3.2, 3.7, 5.1, 5.2, 5.3, 8.1, 8.2, 8.3, 8.4_

- [ ] 12.3 (P) Implement local system drivers
  - Implement the Local GPIO driver that interfaces with the Linux kernel GPIO subsystem through a portable abstraction
  - Implement the Kernel GPIO driver for direct kernel GPIO device access
  - Implement the Local Audio driver that accesses audio adapter GPIO through the audio library
  - Each driver must conform to the common switcher base interface and publish GPIO events
  - _Requirements: 3.1, 3.2, 3.7_

- [ ] 13. Integration wiring and end-to-end validation
- [ ] 13.1 Wire all subsystems together in the main controller composition root
  - Connect the connection manager, command dispatcher, macro processor, GPIO state manager, driver factory, TTY manager, and notification transport
  - Wire driver events to the main controller's event handlers
  - Ensure the startup sequence invokes all subsystem initialization in the correct order
  - Verify that commands flow from TCP/UDP through dispatch to drivers and back as broadcasts
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 7.1, 11.1_

- [ ] 13.2 Implement integration tests for core workflows
  - Test client authentication flow: connect, authenticate, send privileged command, disconnect
  - Test RML command round-trip: send command from client, verify local processing and broadcast to other clients
  - Test GPIO event chain: simulate hardware GPI change, verify state update, client broadcast, macro cart execution, and database logging
  - Test notification relay: send notification from client, verify multicast send and local broadcast
  - Test driver factory: verify each matrix type produces the correct driver instance
  - Test GPIO mask logic: verify masked pins broadcast state but do not execute carts
  - Test local loopback: verify commands targeting local address are processed locally
  - Test TTY code trap: verify serial pattern match triggers cart execution
  - Test macro timer: verify delayed execution fires after specified interval
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4, 4.2, 4.3, 4.4, 7.1, 7.2_

- [ ]* 13.3 (P) Implement unit tests for command parsing, validation, and state management
  - Test TCP protocol command code parsing and routing for all command types
  - Test matrix range validation rejects out-of-range numbers
  - Test TTY port range validation rejects out-of-range numbers
  - Test GPIO state table operations: state updates, mask application, and cart lookup
  - Test RML legacy-to-current format conversion
  - Test connection lifecycle state transitions (connected, authenticated, closing, deleted)
  - _Requirements: 1.3, 1.4, 2.5, 3.5, 3.6, 6.5, 6.6_
