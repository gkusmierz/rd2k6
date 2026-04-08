# Requirements Document

## Introduction

The IPC Daemon (ripcd) is the central hardware abstraction and inter-process communication daemon in the Rivendell radio automation system. It manages hardware switcher and GPIO (General Purpose Input/Output) matrices, processes RML (Rivendell Macro Language) commands, controls serial TTY devices, and provides notification multicasting between system components. It acts as the single point of control for all hardware I/O operations, translating logical commands from client applications into physical device actions through a pluggable driver architecture supporting over 40 hardware device types.

This daemon has no user interface. It operates as a background service, accepting TCP connections from authorized client applications, receiving UDP-based macro commands, and communicating with hardware devices via serial ports and TCP/IP network connections.

## Requirements

### Requirement 1: Client Connection Management

**Objective:** As a system operator, I want the daemon to accept and manage TCP client connections with authentication, so that only authorized applications can issue commands.

#### Acceptance Criteria

1. The system shall listen for TCP client connections on the configured daemon port.
2. When a client connects, the system shall assign a connection identifier and begin accepting commands.
3. When a client sends a password authentication command with a valid password, the system shall mark the connection as authenticated and respond with a success indicator.
4. If a client sends any privileged command without being authenticated, then the system shall reject the command with a failure indicator and not execute it.
5. When a client sends a disconnect command or the socket closes, the system shall mark the connection for deferred cleanup.
6. When the garbage collection timer fires, the system shall delete all connections marked for closing and free their resources for reuse.

### Requirement 2: RML Command Processing

**Objective:** As a client application, I want to send RML (Rivendell Macro Language) commands to the daemon, so that I can control hardware devices and trigger automation actions.

#### Acceptance Criteria

1. The system shall accept RML commands via both TCP client connections and UDP sockets (echo, no-echo, and reply ports).
2. When an RML command targets the local station address on the echo or no-echo port, the system shall process it locally instead of sending it over the network.
3. When an RML command targets a remote station address, the system shall forward it via UDP to the target host.
4. When a locally-processed RML command completes, the system shall broadcast the result to all authenticated TCP clients.
5. The system shall support legacy RML format conversion to the current format for backward compatibility.
6. When a macro timer command is received with a valid timer number, the system shall store the associated cart number and start a delay timer.
7. When a macro timer expires, the system shall execute the associated cart and clear the stored cart number.

### Requirement 3: Switcher Driver Management

**Objective:** As a system administrator, I want the daemon to dynamically load and manage hardware switcher drivers based on database configuration, so that diverse hardware devices are supported through a unified interface.

#### Acceptance Criteria

1. When the daemon starts, the system shall read the matrices configuration from the database and instantiate the appropriate driver for each configured matrix based on its type.
2. The system shall support a pluggable driver architecture with a common interface for all hardware switcher types.
3. If a matrix type is not recognized, then the system shall log a warning and skip that matrix without affecting other drivers.
4. If no driver is loaded for a target matrix, then the system shall silently ignore commands addressed to that matrix.
5. When a switcher command is received, the system shall validate that the matrix number is within the valid range before forwarding it to the driver.
6. If the matrix number is outside the valid range, then the system shall negatively acknowledge the command.
7. The system shall support the following switcher command types: crosspoint latch, fire salvo, GPIO output set, set crosspoint (take), set audio crosspoint, set display text, set GPIO, set relay, set input level, and set crosspoint extended.

### Requirement 4: GPIO State Management

**Objective:** As an automation controller, I want the daemon to track and manage GPIO input and output pin states, so that hardware events can trigger automated actions and client applications can query current states.

#### Acceptance Criteria

1. When the daemon starts, the system shall load GPI and GPO macro cart assignments from the database for all configured matrices.
2. When a hardware GPI state change is detected, the system shall update the internal state table and broadcast the new state (including mask status) to all authenticated clients.
3. When a GPI state changes and the GPI mask is enabled and a macro cart is assigned, the system shall execute the associated macro cart (on-cart for rising edge, off-cart for falling edge).
4. If a GPI line is masked (disabled), then the system shall broadcast the state change but shall not execute the associated macro cart.
5. When a GPO state changes and the GPO mask is enabled and a macro cart is assigned, the system shall execute the associated macro cart.
6. If a GPO line is masked (disabled), then the system shall broadcast the state change but shall not execute the associated macro cart.
7. When a GPIO state change occurs and the mask is enabled, the system shall log the event to the GPIO events table with station name, matrix, line number, type, edge direction, and timestamp.
8. When a client requests GPI or GPO status, mask states, or cart assignments for a matrix, the system shall respond with the current data.
9. When a client requests a reload of the GPIO table, the system shall re-read the cart assignments from the database.

### Requirement 5: GPIO Auto-Discovery

**Objective:** As a system administrator, I want the daemon to automatically discover and register GPIO lines for self-configuring network devices, so that manual configuration of GPIO counts is not required for supported protocols.

#### Acceptance Criteria

1. When a self-configuring device (such as Wheatnet or Livewire) reports its GPIO lines, the system shall check if corresponding entries exist in the GPIO tables.
2. If no entry exists for a discovered GPIO line, then the system shall insert a new record into the GPI or GPO table.
3. When new GPIO lines are discovered, the system shall update the matrices table with the total GPIO count.

### Requirement 6: Serial TTY Device Management

**Objective:** As a hardware integrator, I want the daemon to manage serial TTY ports for communicating with serial-attached switcher devices, so that legacy serial hardware is supported.

#### Acceptance Criteria

1. When the daemon starts, the system shall read TTY port configuration from the database and open all active serial ports with the configured baud rate, data bits, parity, and termination settings.
2. If a serial port cannot be opened, then the system shall log a warning and continue starting without that port.
3. When data is available on a TTY port, the system shall read the data and forward it to the appropriate driver.
4. When a serial code trap fires (pattern match on incoming TTY data), the system shall execute the associated cart.
5. When an RML binary output command is received, the system shall validate the TTY port number is within range before writing data.
6. If the TTY port number is outside the valid range, then the system shall negatively acknowledge the command.

### Requirement 7: Notification Multicasting

**Objective:** As a system component, I want the daemon to relay notifications between local clients and remote Rivendell stations via multicast, so that system-wide events are distributed to all interested parties.

#### Acceptance Criteria

1. When a client sends a notification command, the system shall broadcast it to all other authenticated local clients and send it to the multicast group.
2. When a multicast notification is received from the network, the system shall process it locally and broadcast it to all authenticated clients.
3. When a dropbox notification is received that matches the local station name, the system shall signal the service manager daemon to initiate a dropbox scan.
4. If a received notification cannot be parsed, then the system shall log an informational message with the sender address.

### Requirement 8: Network Driver Resilience

**Objective:** As a system operator, I want network-connected switcher drivers to automatically reconnect after connection failures, so that temporary network issues do not require manual intervention.

#### Acceptance Criteria

1. When a TCP connection to a network-attached switcher device is lost, the system shall log a warning with the device address.
2. When a connection is lost, the system shall start a reconnect timer and periodically attempt to re-establish the connection.
3. When a connection attempt is refused, the system shall log a warning and continue the reconnection cycle.
4. When a connection is successfully re-established, the system shall resume normal command processing and GPIO event handling.

### Requirement 9: Station State Management

**Objective:** As a client application, I want to query and set the station's on-air flag and current user, so that station-wide state is consistently managed across all connected clients.

#### Acceptance Criteria

1. When an RML on-air flag command is received with a valid argument, the system shall update the on-air flag state and broadcast it to all connected clients.
2. When a client requests the on-air flag state, the system shall respond with the current value.
3. When a set-user command is received, the system shall update the current user on the station.
4. When a client requests the current user, the system shall respond with the current user name.

### Requirement 10: System Command Execution

**Objective:** As an automation system, I want the daemon to execute operating system commands on behalf of RML macros, so that external processes can be triggered as part of automation workflows.

#### Acceptance Criteria

1. When an RML run-command is received, the system shall execute the specified system command with the configured user and group credentials.
2. The system shall execute commands asynchronously so that daemon operation is not blocked.

### Requirement 11: Daemon Lifecycle

**Objective:** As a system operator, I want the daemon to start up cleanly and shut down gracefully, so that no hardware state or client connections are left in an inconsistent state.

#### Acceptance Criteria

1. When the daemon starts, the system shall initialize all subsystems in order: bind network ports, load GPIO tables, load switcher drivers, open TTY ports, join the notification multicast group, and start the exit polling timer.
2. If the daemon TCP port cannot be bound, then the system shall log an error and terminate.
3. While the daemon is running, the system shall poll a global exit flag every 200 milliseconds.
4. When the exit flag is set, the system shall initiate a clean shutdown of all drivers and connections.
