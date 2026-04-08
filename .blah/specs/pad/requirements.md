# Requirements Document

## Introduction

The PAD (Program Associated Data) relay daemon is a lightweight message broker service within the Rivendell radio automation system. It acts as a central hub that receives real-time metadata updates (such as Now Playing and Next track information) from audio playout sources and distributes them to all connected consumer clients. The daemon operates without a graphical interface and without direct database access, functioning purely as an in-memory message relay with a simple framing protocol.

Sources (e.g., the airplay log player) connect via a local inter-process communication socket and push metadata updates. Clients (e.g., the PAD engine daemon or external PAD scripts) connect via a TCP network socket and receive those updates in real time. New clients automatically receive the current state of all active sources upon connection.

## Requirements

### Requirement 1: Client Connection Management

**Objective:** As a PAD consumer client, I want to connect to the relay daemon via a well-known TCP port, so that I can receive real-time program-associated metadata.

#### Acceptance Criteria

1. The system shall accept TCP client connections on the designated PAD client port.
2. When a client connects, the system shall register the connection for lifecycle management.
3. When a client disconnects, the system shall clean up the associated connection resources.
4. If a disconnect event references an unknown connection identifier, then the system shall log a warning message indicating the unknown connection.

### Requirement 2: Source Connection Management

**Objective:** As a metadata source (e.g., audio playout engine), I want to connect to the relay daemon via a local inter-process communication socket, so that I can push program-associated metadata updates.

#### Acceptance Criteria

1. The system shall accept source connections on the designated local inter-process communication address.
2. When a source connects, the system shall register the connection for data reception and lifecycle management.
3. When a source disconnects, the system shall clean up the associated connection and its accumulated metadata buffer.
4. If a connection acceptance fails (pending connection returns null), then the system shall log an error to standard error and terminate with a non-zero exit code.
5. If a disconnect event references an unknown source identifier, then the system shall log a warning message indicating the unknown connection.

### Requirement 3: Message Framing and Relay

**Objective:** As a PAD consumer client, I want to receive complete metadata messages from sources, so that I can process program-associated data reliably.

#### Acceptance Criteria

1. The system shall accumulate incoming data from each source into a per-source buffer.
2. When the accumulated buffer ends with the message terminator sequence (`\r\n\r\n`), the system shall mark the message as complete.
3. When a message is marked as complete, the system shall broadcast the entire buffer contents to all connected clients.
4. While a message is incomplete (buffer does not end with the terminator), the system shall continue accumulating data without broadcasting.
5. When new data arrives after a completed message, the system shall clear the previous buffer before accumulating the new data.

### Requirement 4: State Replay for New Clients

**Objective:** As a newly connected PAD consumer client, I want to immediately receive the current metadata state, so that I can display up-to-date program information without waiting for the next update.

#### Acceptance Criteria

1. When a new client connects, the system shall send the last completed metadata buffer from each active source that has a committed message.
2. If no sources have committed messages, the system shall accept the client connection without sending any initial data.

### Requirement 5: Daemon Startup and Port Binding

**Objective:** As a system administrator, I want the relay daemon to validate its network bindings at startup, so that I am immediately notified of configuration conflicts.

#### Acceptance Criteria

1. The system shall attempt to bind the TCP client server to the designated port on all network interfaces at startup.
2. If the TCP client port binding fails, then the system shall print an error message identifying the port to standard error and terminate with a non-zero exit code.
3. The system shall attempt to bind the source server to the designated local inter-process communication address at startup.
4. If the source socket binding fails, then the system shall print an error message including the failure reason to standard error and terminate with a non-zero exit code.
5. The system shall run as a headless background service without a graphical user interface.
