# Requirements Document

## Introduction

Cart Slots Viewer is a secondary application in the Rivendell radio automation platform that provides a grid-based interface for managing and playing audio cart slots. Each slot functions as an independent audio playback deck that can be loaded with audio carts, played, stopped, and configured. The application supports both direct user interaction (via buttons on each slot widget) and remote control via Rivendell Macro Language (RML) commands dispatched through the inter-process communication layer.

The application reads its slot grid layout (rows and columns) from the station configuration and creates a corresponding grid of cart slot widgets at startup. It connects to the Core Audio Engine for audio metering and playback, and to the IPC daemon for user authentication and remote macro command processing.

## Requirements

### Requirement 1: Cart Slot Grid Display
**Objective:** As a broadcast operator, I want to see a grid of cart slot widgets on screen, so that I can monitor and control multiple audio playback decks at a glance.

#### Acceptance Criteria
1. When the application starts, the system shall display a grid of cart slot widgets arranged according to the station's configured column and row count.
2. The system shall calculate the window size dynamically based on the number of columns and rows.
3. The system shall use a fixed-size window policy so the layout remains stable during operation.
4. The system shall paint visual dividers between slot columns to clearly separate groups.
5. While the application is running, the system shall update audio level meters on each slot at a regular metering interval.
6. When the audio engine connection is established, the system shall query the slot configuration to determine which audio cards are in use and enable metering for those cards.
7. The system shall provide shared dialog instances for cart selection, slot configuration, cue point editing, and service selection, accessible from any slot in the grid.

### Requirement 2: Remote Deck Control
**Objective:** As a broadcast automation system, I want to send macro commands to control cart slots remotely, so that external systems and scheduled events can load, play, stop, and trigger breakaways on specific slots.

#### Acceptance Criteria
1. When a macro command is received, the system shall verify it is a command-type message before processing; non-command messages shall be silently ignored.
2. When a Deck Load (DL) command is received, the system shall validate that exactly 2 arguments are provided; if not, the system shall send a negative acknowledgment.
3. When a Deck Load command has valid argument count, the system shall validate that the slot number is a valid unsigned integer and within the range of configured slots; if not, the system shall send a negative acknowledgment.
4. When a Deck Load command targets a valid slot, the system shall verify the slot is in CartDeck mode; if not, the system shall send a negative acknowledgment.
5. When a Deck Load command targets a valid CartDeck slot with cart number 0, the system shall unload the slot.
6. When a Deck Load command targets a valid CartDeck slot with a cart number between 1 and 999999, the system shall load the specified cart into the slot.
7. When a Deck Play (DP) command is received with 1 argument, a valid slot number, and the slot in CartDeck mode, the system shall start playback on the specified slot.
8. When a Deck Stop (DS) command is received with 1 argument, a valid slot number, and the slot in CartDeck mode, the system shall stop playback on the specified slot.
9. When a Deck Breakaway (DX) command is received with 2 arguments and a valid slot number, the system shall initiate a breakaway on the specified slot for the given duration in milliseconds.
10. When any deck command is processed successfully, the system shall send a positive acknowledgment back through the IPC layer.
11. If any deck command fails validation, then the system shall send a negative acknowledgment.

### Requirement 3: Application Lifecycle
**Objective:** As a system administrator, I want the application to start up reliably, authenticate users, and shut down cleanly, so that the system operates predictably and does not leave stale resources.

#### Acceptance Criteria
1. When the application starts, the system shall establish a database connection; if the connection fails, the system shall display an error dialog and terminate with exit code 1.
2. If an unknown command-line option is provided at startup, then the system shall display an error dialog identifying the option and terminate with exit code 2.
3. When the audio engine connection is established, the system shall query slot configurations and enable audio metering for all configured audio cards.
4. When the IPC connection notifies of a user change, the system shall propagate the new user identity to all cart slot widgets and update the window title to reflect the current station name and user.
5. When the user closes the application window, the system shall explicitly release all cart slot resources to ensure temporary carts are properly cleaned up, and then terminate with exit code 0.
