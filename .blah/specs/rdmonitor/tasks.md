# Implementation Plan

- [ ] 1. Domain value objects and enumerations
- [ ] 1.1 (P) Define HealthState value object and ScreenPosition enum
  - Define `ScreenPosition` scoped enum with values: UpperLeft, UpperCenter, UpperRight, LowerLeft, LowerCenter, LowerRight
  - Define `PositionSettings` value object: screenNumber (int), position (ScreenPosition), xOffset (int, 0-99), yOffset (int, 0-99)
  - Define `HealthState` value object: databaseReachable (bool), schemaCorrect (bool), audioStoreAccessible (bool), summaryHealthy (computed bool), statusText (string)
  - Implement status text generation logic: "Status: OK" when all pass; "Database: CONNECTION FAILED" when unreachable; "Database: SCHEMA SKEWED" when schema mismatch; "Audio Store: FAILED" when inaccessible; combine multiple failures
  - All types are pure C++ with no framework dependencies
  - _Requirements: 1.5, 1.6, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1_

- [ ] 2. Port interfaces
- [ ] 2.1 (P) Define outbound port interfaces for all external dependencies
  - Define `IDbValidator` with `checkConnection() -> Result<SchemaInfo, DbError>` returning reachability and schema version
  - Define `IAudioStoreValidator` with `isAccessible() -> bool`
  - Define `ISystemConfig` with `reload()`, `stationName()`, `configDirectoryPath()`, `expectedSchemaVersion()`
  - Define `IPositionConfig` with `load() -> Result<PositionSettings, Error>`, `save(PositionSettings) -> Result<void, Error>`, `clear()`
  - Define `IProcessLauncher` with `launch(executable, args) -> Result<ProcessResult, LaunchError>` returning exit code, stderr, and crash flag
  - All interfaces are pure virtual C++ classes in the ports layer
  - _Requirements: 1.2, 1.3, 1.4, 3.7, 4.1, 4.4, 4.5_

- [ ] 3. Application services
- [ ] 3.1 Health Validator service
  - Implement periodic health validation using a 5-second timer
  - On each tick: reload system config, check audio store accessibility, check database connectivity and schema version
  - Compute composite health state: all three checks must pass for healthy
  - Publish health state changed event and status text changed event
  - Expose `validateNow()` for on-demand validation (after config selector exits)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 3.2 (P) Position Manager service
  - Implement position geometry calculation for all six screen positions with screen index and pixel offsets
  - Calculate absolute screen coordinates using the target screen geometry plus position enum plus offsets
  - Clamp computed position to keep the widget within desktop bounds
  - Compute companion positions for the position dialog popup and config selector launch relative to the widget
  - Delegate load/save to IPositionConfig port
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.9_

- [ ] 3.3 (P) Config Selector Launcher service
  - Check filesystem for number of config files in the config directory
  - If more than one config file exists, launch the config selector process with geometry arguments
  - Wait for process completion and classify result: success (exit 0), crash, or error (non-zero exit)
  - Return structured result to caller for UI handling
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 4. Adapter implementations
- [ ] 4.1 (P) Database Validator Adapter
  - Open a database connection using credentials from system configuration
  - Execute `SELECT DB FROM VERSION` to retrieve the schema version
  - Close the connection after each check (no persistent connection)
  - Return reachability status and schema version number
  - _Requirements: 1.2, 1.3_

- [ ] 4.2 (P) Audio Store Validator Adapter
  - Inspect the system mount table to verify the audio storage filesystem is accessible
  - For local storage: confirm no external mount covers the audio root path
  - For remote storage (NFS): confirm the configured mount source is present in the mount table
  - _Requirements: 1.4_

- [ ] 4.3 (P) System Config Adapter
  - Read the station configuration file to obtain database credentials, audio root path, audio store mount source, and station label
  - Support reload to pick up external changes
  - Provide the expected schema version constant
  - Provide the config directory path for config selector file enumeration
  - _Requirements: 1.7, 4.1, 5.4_

- [ ] 4.4 (P) Position Config File Adapter
  - Read and write position settings from an INI-style configuration file
  - Map ScreenPosition enum to integer values (0-5) for file storage
  - Support clear operation to reset to defaults (screen 0, upper-left, zero offsets)
  - _Requirements: 3.7, 3.8_

- [ ] 4.5 (P) Process Launcher Adapter
  - Launch an external process with executable path and argument list
  - Wait for process completion (blocking)
  - Return structured result: exit code, stderr output, and crash detection
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 5. UI layer: Monitor Widget view
- [ ] 5.1 Monitor Widget main view
  - Create a frameless, always-on-top window with no title bar
  - Display the station name label occupying most of the widget width
  - Display green/red health indicator icon in the top-right area (mutually exclusive)
  - Draw a border rectangle around the widget
  - Dynamically size width to accommodate station name text plus indicator icons
  - Bind health indicator visibility to Health Validator state
  - Bind station name label to System Config station name
  - _Requirements: 1.5, 1.6, 5.1, 5.2, 5.4_

- [ ] 5.2 Status Tooltip floating label
  - Create a separate floating label widget for detailed status display
  - Show the label when mouse enters the monitor widget, hide on mouse leave
  - Position the tooltip relative to the monitor widget based on current screen position config
  - Bind text content to Health Validator status text
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 5.3 Mouse interaction handlers
  - Right-click: open Position Dialog
  - Double-click (left button): invoke Config Selector Launcher; display error dialog on crash or error exit; trigger re-validation on success
  - Other clicks: pass through (no action)
  - _Requirements: 3.6, 4.1, 4.3, 4.4, 4.5_

- [ ] 6. UI layer: Position Dialog view
- [ ] 6.1 Position Dialog modal form
  - Create a fixed-size modal dialog (approximately 240x170)
  - Include a screen selector dropdown populated dynamically from the display environment
  - Include a position selector dropdown with the six position labels (Upper Left through Lower Right)
  - Include horizontal and vertical offset spinboxes with range 0-99
  - Populate form fields from current position configuration on open
  - OK button: write selections to Position Manager and close with accept
  - Cancel button: close with reject, discarding changes
  - _Requirements: 3.1, 3.2, 3.3, 3.6, 3.7, 3.8, 3.9_

- [ ] 7. Application composition and lifecycle
- [ ] 7.1 Wire all components in the composition root
  - Instantiate all adapters, port implementations, and application services
  - Connect Health Validator events to Monitor Widget view bindings
  - Connect Position Manager to both Monitor Widget and Position Dialog
  - Connect Config Selector Launcher to Monitor Widget double-click handler
  - Start the health validation timer
  - Load position configuration and perform initial widget positioning
  - Install signal handlers for SIGTERM and SIGINT to trigger clean exit
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Testing
- [ ] 8.1 (P) Unit tests for domain value objects
  - Verify HealthState summary computation: all-pass yields healthy, any single failure yields unhealthy
  - Verify status text generation for every failure combination: DB fail, schema mismatch, audio fail, DB+audio, schema+audio, all three
  - Verify PositionSettings validation: offsets clamped to 0-99 range
  - _Requirements: 1.5, 1.6, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 8.2 (P) Unit tests for Position Manager geometry calculation
  - Verify correct coordinates for all six positions on a single screen
  - Verify multi-screen positioning uses the correct screen geometry
  - Verify widget clamping when offsets would push it outside screen bounds
  - Verify companion dialog and config selector positions are computed relative to widget
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 8.3 (P) Unit tests for Config Selector Launcher
  - Verify launch is blocked when 0 or 1 config files exist
  - Verify launch proceeds when multiple config files exist
  - Verify crash detection returns correct error type
  - Verify non-zero exit code returns exit code and stderr
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 8.4 Integration tests for health validation cycle
  - Verify timer fires and calls all three validators
  - Verify health state transitions from unknown to healthy to unhealthy and back
  - Verify system config reload is called each cycle
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7_

- [ ] 8.5 Integration tests for position configuration persistence
  - Verify save and reload produces identical PositionSettings
  - Verify clear resets to defaults
  - _Requirements: 3.7, 3.8_

- [ ] 8.6* E2E tests for monitor widget interactions
  - Verify widget appears on configured screen with station name displayed
  - Verify hover shows status tooltip with correct text, leave hides it
  - Verify right-click opens position dialog, OK repositions widget, Cancel leaves position unchanged
  - Verify red/green indicator transitions when simulating database or audio store failures
  - _Requirements: 1.5, 1.6, 2.1, 2.2, 3.6, 3.7, 3.8, 5.1, 5.2_
