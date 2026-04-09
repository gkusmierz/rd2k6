# Implementation Plan

- [ ] 1. Domain value objects and channel assignment logic
- [ ] 1.1 (P) Implement PanelConfig, ChannelConfig, ResolvedChannel, and FaderInfo value objects
  - Create PanelConfig value object with fields: station panel count, user panel count, flash enabled, pause enabled, button label template, skin path, default service name
  - Create ChannelConfig value object with fields: card number, port number, start macro string, stop macro string
  - Create ResolvedChannel value object with fields: effective card, effective port, origin (explicit or fallback source identifier)
  - Create FaderInfo value object with fields: display number, meter validity flag
  - All value objects are immutable after construction, use value semantics
  - Place in `src/domain/value_objects/`
  - _Requirements: 2, 3_

- [ ] 1.2 (P) Implement ChannelAssignment domain service
  - Accept 5 channel configurations and a fallback configuration
  - For channels where card is less than 0, apply fallback: channel 2 to main log 1, channel 3 to main log 2, channel 4 to sound panel 1, channel 5 to cue
  - Return resolved list of 5 channels with effective card/port and origin
  - Pure C++ with no Qt dependency
  - Place in `src/domain/services/`
  - _Requirements: 2, 3_

- [ ] 1.3 (P) Implement FaderNumbering domain service
  - Accept resolved list of 5 channel assignments
  - Assign sequential display numbers starting from 1 to unique card/port combinations
  - Duplicate card/port combinations share the display number of their first occurrence
  - Mark only the first occurrence of each card/port as meter-valid
  - Return list of 5 FaderInfo objects
  - Pure C++ with no Qt dependency
  - Place in `src/domain/services/`
  - _Requirements: 3_

- [ ] 1.4 Unit tests for domain value objects and services
  - Test ChannelAssignment: all channels explicitly configured, no fallback applied
  - Test ChannelAssignment: channels 2-5 not configured, correct fallback assignments
  - Test ChannelAssignment: mixed explicit and fallback channels
  - Test FaderNumbering: all unique card/port combinations get sequential numbers 1-5
  - Test FaderNumbering: two channels sharing same card/port get same display number
  - Test FaderNumbering: only first occurrence of shared card/port is meter-valid
  - Test FaderNumbering: complex scenario with multiple duplicates
  - Depends on 1.1, 1.2, 1.3
  - _Requirements: 2, 3_

- [ ] 2. Port interfaces for panel application
- [ ] 2.1 (P) Define outbound port interfaces
  - Create IAudioEngine port with methods: connectHost, enableMetering(card, port), getOutputMeterLevel(card, port) returning left/right levels
  - Create IIpcService port with methods: connectHost, sendOnairFlag; subscribed events: userChanged, macroReceived
  - Create IStationConfig port with methods: stationName, enableDragDrop, skinPath, panelConfig (returns PanelConfig)
  - Create IPanelRepository port with methods: loadPanelButtons(stationOrUser, page) returning button assignments
  - All ports are pure virtual interfaces using domain types only, no Qt types
  - Place in `src/ports/outbound/`
  - _Requirements: 1, 2, 3, 6, 7_

- [ ] 2.2 (P) Define inbound port interface IPanelService
  - Define methods: initialize(config) returning Result, shutdown, currentPage, navigateToPage(index), navigateNext, navigatePrevious, reloadPanels
  - Pure virtual interface with domain types only
  - Place in `src/ports/inbound/`
  - _Requirements: 1, 2, 4, 8_

- [ ] 3. Application service (composition root)
- [ ] 3.1 Implement PanelApplication service
  - Implement IPanelService inbound port
  - Constructor receives all outbound port implementations via dependency injection
  - On initialize: open database connection, load station config, connect audio engine and IPC
  - If initialization fails, return error result (caller displays error dialog)
  - Apply skin image if configured and meets minimum size (1024x738)
  - Use ChannelAssignment service to resolve 5 output channels
  - Use FaderNumbering service to assign display numbers and meter validity
  - Create sound panel with 9 columns, 7 rows, and resolved channel configuration
  - On user change event: update window title, send on-air flag, trigger panel reload
  - On macro received event: delegate to local macro handler
  - On shutdown: remove database connection
  - Depends on 1.1, 1.2, 1.3, 2.1, 2.2
  - Place in `src/app/`
  - _Requirements: 1, 2, 5, 7, 8_

- [ ] 3.2 Integration tests for PanelApplication service
  - Test successful initialization: database, audio engine, IPC all connect
  - Test initialization failure: returns error when database unavailable
  - Test unknown command-line option: returns error with option name
  - Test user change: window title updated, on-air flag sent, panels reloaded
  - Test channel resolution: verify fallback logic is applied via ChannelAssignment
  - Test skin application: valid skin applied, invalid skin ignored
  - Uses mock outbound ports
  - Depends on 3.1
  - _Requirements: 1, 2, 5, 6, 7, 8_

- [ ] 4. Audio metering adapter
- [ ] 4.1 Implement MeterAdapter
  - Create adapter with 50ms polling timer
  - On each tick: iterate over 5 output channels, skip meter-invalid channels (from FaderNumbering)
  - Read left/right audio levels from IAudioEngine for each valid channel
  - Accumulate power ratios across all valid outputs
  - Convert aggregated values to decibels
  - Expose leftPeakDb and rightPeakDb as QML-bindable properties
  - Provide start() and stop() methods to control the polling timer
  - Place in `src/adapters/ui/`
  - Depends on 2.1, 1.3
  - _Requirements: 3_

- [ ] 4.2 Unit tests for MeterAdapter
  - Test meter polling with mock audio engine returning known levels
  - Test meter-invalid channels are skipped
  - Test power ratio aggregation across multiple valid outputs
  - Test dB conversion produces correct values
  - Test start/stop controls the polling timer
  - Depends on 4.1
  - _Requirements: 3_

- [ ] 5. Sound panel UI adapter
- [ ] 5.1 Implement SoundPanelAdapter
  - Create QAbstractListModel or QAbstractTableModel exposing a 9x7 grid of panel buttons
  - Expose button properties: cart title, cart number, color, playing state
  - Support panel page navigation: navigateNext(), navigatePrevious(), currentPage property
  - Handle mouse wheel events via a QML-accessible method: wheelUp -> previous page, wheelDown -> next page
  - On user change: reload panel data from IPanelRepository
  - Configure 5 output channels with start/stop macro strings
  - Place in `src/adapters/ui/`
  - Depends on 2.1, 2.2, 3.1
  - _Requirements: 2, 4_

- [ ] 5.2 (P) Implement CartDialogAdapter and EmptyCartWidget visibility logic
  - Create adapter bridging the cart picker dialog for drag-and-drop button assignment
  - Query IStationConfig for drag-and-drop enabled setting
  - Expose a boolean property `dragDropEnabled` to QML for controlling empty cart widget visibility
  - Place in `src/adapters/ui/`
  - Depends on 2.1
  - _Requirements: 6_

- [ ] 6. QML views
- [ ] 6.1 Implement main panel QML view
  - Create the main window view with fixed layout
  - Embed the sound panel grid (9 columns x 7 rows) bound to SoundPanelAdapter model
  - Embed the stereo meter view at the bottom bound to MeterAdapter properties
  - Embed the empty cart widget, visibility bound to CartDialogAdapter.dragDropEnabled
  - Wire mouse wheel events on the main area to SoundPanelAdapter.navigateNext/navigatePrevious
  - Apply skin image as window background when available (property from PanelApplication)
  - Set window title from PanelApplication (version, station, user)
  - Follow design system tokens from `.blah/steering/design.md`
  - Place in `src/ui/views/`
  - Depends on 4.1, 5.1, 5.2
  - _Requirements: 1, 2, 3, 4, 5, 6_

- [ ] 6.2 Implement stereo meter QML component
  - Create a reusable stereo meter component displaying left/right peak bars
  - Bind to leftPeakDb and rightPeakDb properties from MeterAdapter
  - Display peak mode with appropriate scale (dB markings)
  - Follow design system color tokens for meter levels
  - Place in `src/ui/components/`
  - Depends on 4.1
  - _Requirements: 3_

- [ ] 7. Persistence and infrastructure adapters
- [ ] 7.1 (P) Implement SqlPanelRepository adapter
  - Implement IPanelRepository port using Qt SQL
  - Load panel button assignments for station panels and user panels
  - Read cart metadata for assigned buttons
  - Read-only access; writes delegated to sound panel component
  - Place in `src/adapters/persistence/`
  - Depends on 2.1
  - _Requirements: 2_

- [ ] 7.2 (P) Implement QtAudioEngineAdapter for metering
  - Implement the metering portion of IAudioEngine using Qt Multimedia
  - Support connectHost, enableMetering, and getOutputMeterLevel operations
  - Translate framework-specific audio level data to domain-level values
  - Place in `src/adapters/audio/`
  - Depends on 2.1
  - _Requirements: 1, 3_

- [ ] 7.3 (P) Implement IpcServiceAdapter
  - Implement IIpcService port using Qt Network (TCP)
  - Support connectHost, sendOnairFlag
  - Emit userChanged and macroReceived events as Qt signals bridged to port callbacks
  - Place in `src/adapters/network/`
  - Depends on 2.1
  - _Requirements: 1, 7_

- [ ] 7.4 (P) Implement StationConfigAdapter
  - Implement IStationConfig port using Qt SQL
  - Read station name, drag-drop enabled flag, skin path, and panel configuration from database
  - Map database rows to PanelConfig domain value object
  - Place in `src/adapters/persistence/`
  - Depends on 2.1
  - _Requirements: 1, 2, 5, 6_

- [ ] 8. Application entry point and wiring
- [ ] 8.1 Implement main() and composition root wiring
  - Parse command-line arguments; if unrecognized option found, show error dialog and exit with code 2
  - Instantiate all adapters (SqlPanelRepository, QtAudioEngineAdapter, IpcServiceAdapter, StationConfigAdapter)
  - Inject into PanelApplication service
  - Register UI adapters (SoundPanelAdapter, MeterAdapter, CartDialogAdapter) with QML engine
  - Load main QML view
  - On initialization failure: show error dialog and exit with code 1
  - On close event: call PanelApplication.shutdown(), remove database connection, exit with code 0
  - Place in `src/app/`
  - Depends on 3.1, 4.1, 5.1, 5.2, 6.1, 7.1, 7.2, 7.3, 7.4
  - _Requirements: 1, 8_

- [ ] 9. End-to-end tests
- [ ] 9.1* E2E test: panel button playback
  - Start rdpanel with test database containing panel button assignments
  - Click a panel button and verify audio playback is triggered on the configured output channel
  - _Requirements: 1, 2_

- [ ] 9.2* E2E test: panel page navigation
  - Start rdpanel with multiple panel pages configured
  - Scroll mouse wheel and verify panel page changes
  - _Requirements: 4_

- [ ] 9.3* E2E test: skin application and drag-drop visibility
  - Start rdpanel with a valid skin image configured
  - Verify the skin is applied as window background
  - Start rdpanel with drag-drop disabled and verify empty cart widget is hidden
  - _Requirements: 5, 6_

- [ ] 9.4* E2E test: startup error handling
  - Start rdpanel with invalid database configuration
  - Verify error dialog is displayed and application exits with non-zero code
  - Start rdpanel with an unrecognized command-line option
  - Verify error dialog shows the unknown option and application exits
  - _Requirements: 1_
