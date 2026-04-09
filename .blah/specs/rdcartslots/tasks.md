# Implementation Plan

- [ ] 1. Domain value objects and command types
- [ ] 1.1 (P) Implement the MacroCommand value object in the domain layer
  - Define the command type enumeration: DeckLoad, DeckPlay, DeckStop, DeckBreakaway
  - Define the command role enumeration to distinguish command messages from non-command messages
  - Include fields for command type, role, argument list, and acknowledgment state
  - Keep this as pure C++ with no framework dependencies
  - _Requirements: 2.1_

- [ ] 1.2 (P) Implement the SlotMode value object in the domain layer
  - Define slot operating modes: CartDeck, Breakaway
  - Used by the RML command dispatcher to validate mode-restricted commands
  - _Requirements: 2.4_

- [ ] 2. RML command validation domain service
- [ ] 2.1 Implement the RML command validation logic as a domain service
  - Validate command role is Command type; reject others by returning an ignore result
  - Validate argument count per command type (DL: 2, DP: 1, DS: 1, DX: 2)
  - Validate slot number is a valid unsigned integer within the configured slot range
  - For DL/DP/DS commands, validate the target slot is in CartDeck mode
  - Return a structured validation result (valid with parsed parameters, or invalid with reason)
  - This is pure domain logic with no framework dependencies
  - Depends on 1.1, 1.2
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.9, 2.11_

- [ ] 2.2 Unit tests for RML command validation
  - Verify non-command messages return an ignore result
  - Verify DL with argument count != 2 returns invalid
  - Verify DL with non-numeric slot number returns invalid
  - Verify DL with slot number >= configured slot count returns invalid
  - Verify DL targeting a Breakaway-mode slot returns invalid
  - Verify DL with cart number 0 returns valid-unload result
  - Verify DL with cart number 1-999999 returns valid-load result
  - Verify DP with 1 argument and valid CartDeck slot returns valid
  - Verify DS with 1 argument and valid CartDeck slot returns valid
  - Verify DX with 2 arguments and valid slot returns valid (no mode check)
  - Depends on 2.1
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

- [ ] 3. Outbound port interfaces
- [ ] 3.1 (P) Define ICartSlotRepository outbound port
  - Method to query audio card numbers for all slots belonging to a given station
  - This is a header-only interface in the ports layer, referencing only domain types
  - _Requirements: 1.6, 3.3_

- [ ] 3.2 (P) Define IAudioEngine outbound port for metering
  - Method to enable metering for a set of audio card numbers
  - Event subscription interface for connection state changes
  - Header-only interface in the ports layer
  - _Requirements: 1.5, 1.6, 3.3_

- [ ] 3.3 (P) Define IIpcClient outbound port
  - Event subscription interface for user change notifications
  - Event subscription interface for incoming macro commands
  - Method to send acknowledgment (positive or negative) for a macro command
  - Header-only interface in the ports layer
  - _Requirements: 2.10, 2.11, 3.4_

- [ ] 4. Slot grid controller (application service)
- [ ] 4.1 Implement the SlotGridController application service
  - Accept station configuration (column count, row count) and create the slot grid model
  - On audio engine connected event: query ICartSlotRepository for audio cards, call IAudioEngine to enable metering
  - On user changed event: propagate user identity to all slot widgets, publish title update event
  - Start a periodic meter timer and trigger meter updates on all slots
  - Depends on 3.1, 3.2, 3.3
  - _Requirements: 1.1, 1.5, 1.6, 3.3, 3.4_

- [ ] 4.2 Unit tests for SlotGridController
  - Verify grid initialization creates columns * rows slot entries
  - Verify audio engine connected triggers card query and metering enablement
  - Verify user changed event propagates to all slots
  - Mock all outbound ports
  - Depends on 4.1
  - _Requirements: 1.1, 1.5, 1.6, 3.3, 3.4_

- [ ] 5. RML command dispatcher (application service)
- [ ] 5.1 Implement the RmlCommandDispatcher application service
  - Subscribe to IIpcClient macro command events
  - Delegate validation to the domain service from task 2.1
  - On valid command: execute the appropriate slot action (load, unload, play, stop, breakaway)
  - Send positive acknowledgment on success, negative acknowledgment on validation failure
  - Depends on 2.1, 3.3, 4.1
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11_

- [ ] 5.2 Unit tests for RmlCommandDispatcher
  - Verify DL command with cart 0 calls unload on correct slot
  - Verify DL command with valid cart calls load on correct slot
  - Verify DP command calls play on correct slot
  - Verify DS command calls stop on correct slot
  - Verify DX command calls breakaway with correct duration on correct slot
  - Verify positive acknowledgment sent on successful execution
  - Verify negative acknowledgment sent on validation failure
  - Depends on 5.1
  - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11_

- [ ] 6. Persistence and infrastructure adapters
- [ ] 6.1 (P) Implement SqlCartSlotRepository adapter
  - Query the cart_slots table for audio card numbers filtered by station name
  - Map database results to domain types
  - Use Qt SQL through the persistence adapter pattern
  - _Requirements: 1.6, 3.3_

- [ ] 6.2 (P) Implement AudioEngine adapter for metering
  - Connect to the audio engine daemon
  - Enable metering for specified audio cards
  - Emit connection state change events
  - Provide periodic meter data via timer-driven updates
  - _Requirements: 1.5, 1.6, 3.3_

- [ ] 6.3 (P) Implement IpcClient adapter
  - Connect to the IPC daemon
  - Emit user change events when user context changes
  - Emit macro command events when RML commands are received
  - Send acknowledgment messages back through the IPC connection
  - _Requirements: 2.10, 2.11, 3.4_

- [ ] 7. Application bootstrap and lifecycle
- [ ] 7.1 Implement the application composition root
  - Open database connection; on failure display error dialog and exit with code 1
  - Validate command-line options; on unknown option display error dialog and exit with code 2
  - Wire all adapters to ports and inject into application services
  - Connect to audio engine and IPC daemon
  - Start the meter update timer
  - Depends on 4.1, 5.1, 6.1, 6.2, 6.3
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7.2 Integration tests for application startup sequence
  - Verify database connection failure produces error dialog and exit code 1
  - Verify unknown CLI option produces error dialog and exit code 2
  - Verify successful startup connects to audio engine and IPC in correct order
  - Depends on 7.1
  - _Requirements: 3.1, 3.2_

- [ ] 8. Main window and QML grid view
- [ ] 8.1 Implement the main window QML view with cart slot grid
  - Display cart slot widgets in a grid layout driven by the SlotGridController model
  - Calculate window dimensions from column and row count
  - Apply fixed-size window policy
  - Paint visual column dividers between slot groups
  - Provide access to shared dialog instances (cart picker, slot configuration, cue editor, service picker)
  - Depends on 4.1
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7_

- [ ] 8.2 Implement the close handler for resource cleanup
  - On window close, explicitly release all cart slot widget resources
  - Ensure temporary carts are cleaned up before the application terminates
  - Exit with code 0
  - Depends on 8.1
  - _Requirements: 3.5_

- [ ] 8.3 Implement window title with station and user context
  - Display application name, version, station name, and current user in the window title
  - Update dynamically when user changes
  - Depends on 8.1, 4.1
  - _Requirements: 3.4_

- [ ] 9. E2E tests
- [ ] 9.1 E2E test: application displays correct grid dimensions
  - Configure station with specific column and row counts
  - Launch the application
  - Verify the grid contains the expected number of slot widgets
  - Depends on 8.1
  - _Requirements: 1.1_

- [ ] 9.2 E2E test: RML deck load command loads a cart into a slot
  - Send a DL command via IPC with a valid slot and cart number
  - Verify the target slot displays the loaded cart
  - Depends on 5.1, 8.1
  - _Requirements: 2.6_

- [ ] 9.3 E2E test: application shutdown cleans up resources
  - Load carts into slots, then close the application
  - Verify temporary cart cleanup occurs and exit code is 0
  - Depends on 8.2
  - _Requirements: 3.5_
