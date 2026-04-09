# Implementation Plan

- [ ] 1. Foundation: domain entities, value objects, and enums
- [ ] 1.1 (P) Create SystemConfig domain entity
  - Define a pure C++ entity class with label (string), filePath (string), and isActive (boolean) fields
  - Entity must be immutable after construction with `[[nodiscard]]` getters
  - No Qt dependencies; compiles with C++ standard library only
  - Namespace: `rd::domain`
  - _Requirements: 1_

- [ ] 1.2 (P) Create HealthStatus domain value object
  - Define a pure C++ value object with three boolean fields: databaseReachable, schemaCorrect, audioStoreAccessible
  - Provide `[[nodiscard]] isHealthy()` method that returns true only when all three fields are true
  - Support equality comparison
  - Namespace: `rd::domain`
  - _Requirements: 2_

- [ ] 1.3 (P) Create SwitchExitCode enum and SwitchResult value object
  - Define `SwitchExitCode` as `enum class` with 12 values: Ok (0), InvalidArguments (1), NoSuchConfiguration (2), ModulesActive (3), NotRoot (4), ServiceManagerCrashed (5), ShutdownFailed (6), AudioUnmountFailed (7), AudioMountFailed (8), StartupFailed (9), NoCurrentConfig (10), SymlinkFailed (11)
  - Provide a free function `toDisplayText(SwitchExitCode) -> string` returning human-readable error descriptions
  - Provide a free function `fromExitCode(int) -> SwitchExitCode` for converting integer exit codes
  - Define `SwitchResult` value object with exitCode (SwitchExitCode) and normalTermination (boolean)
  - SwitchResult provides `[[nodiscard]] isSuccess()` (normalTermination && exitCode == Ok) and `[[nodiscard]] errorText()` methods
  - No Qt dependencies; pure C++
  - Namespace: `rd::domain`
  - _Requirements: 3, 4_

- [ ] 1.4 Create ErrorInfo codes for rdselect-specific errors
  - Define machine-readable error codes: "HELPER_CRASHED", "SWITCH_FAILED", "NO_CONFIGS_FOUND"
  - Each code has a human-readable message template
  - Uses the project-wide `rd::domain::ErrorInfo` struct
  - _Requirements: 3, 4_

- [ ] 2. Outbound port interfaces
- [ ] 2.1 (P) Define IConfigRepository outbound port
  - Pure virtual interface with: `scanConfigDirectory() -> vector<SystemConfig>` and `resolveActiveSymlink() -> optional<string>`
  - Uses only domain types in signatures (no Qt types)
  - Header-only, virtual destructor
  - Namespace: `rd::ports::outbound`
  - _Requirements: 1_

- [ ] 2.2 (P) Define IHealthChecker outbound port
  - Pure virtual interface with: `validateHealth(SystemConfig) -> HealthStatus`
  - Uses only domain types in signatures
  - Header-only, virtual destructor
  - Namespace: `rd::ports::outbound`
  - _Requirements: 2_

- [ ] 2.3 (P) Define IProcessLauncher outbound port
  - Pure virtual interface with: `launchHelper(string configFilename) -> SwitchResult`
  - Uses only domain types in signatures
  - Header-only, virtual destructor
  - Namespace: `rd::ports::outbound`
  - _Requirements: 3, 4_

- [ ] 3. Inbound port interfaces
- [ ] 3.1 (P) Define IConfigDiscoveryService inbound port
  - Pure virtual interface with: `discoverConfigurations() -> vector<pair<SystemConfig, optional<HealthStatus>>>`
  - Returns all configs; active config includes health status, non-active configs have nullopt for health
  - Header-only, virtual destructor
  - Namespace: `rd::ports::inbound`
  - _Requirements: 1, 2_

- [ ] 3.2 (P) Define IConfigSwitchService inbound port
  - Pure virtual interface with: `switchConfiguration(string configFilename) -> SwitchResult`
  - Header-only, virtual destructor
  - Namespace: `rd::ports::inbound`
  - _Requirements: 3, 4_

- [ ] 4. Application services
- [ ] 4.1 Implement ConfigDiscoveryService
  - Implements IConfigDiscoveryService
  - Receives IConfigRepository and IHealthChecker via constructor injection (unique_ptr)
  - Discovery flow: resolve active symlink, scan config directory, mark active config, validate health of active config only
  - If no active symlink, all configs have nullopt health status
  - Returns structured results, no exceptions
  - Namespace: `rd::app`
  - _Requirements: 1, 2_
  - _Contracts: IConfigDiscoveryService interface_

- [ ] 4.2 Implement ConfigSwitchService
  - Implements IConfigSwitchService
  - Receives IProcessLauncher via constructor injection (unique_ptr)
  - Delegates to IProcessLauncher and returns SwitchResult
  - Translates abnormal termination into a SwitchResult with normalTermination=false
  - Returns structured results, no exceptions
  - Namespace: `rd::app`
  - _Requirements: 3, 4_
  - _Contracts: IConfigSwitchService interface_

- [ ] 5. Infrastructure adapters
- [ ] 5.1 Implement FilesystemConfigRepository adapter
  - Implements IConfigRepository
  - Uses QDir to scan the configuration directory for *.conf files
  - Uses QFile::symLinkTarget to resolve the active configuration symlink
  - Loads each config file to extract label (delegates to a config parser port or reads the label field directly)
  - Translates Qt filesystem errors to domain error signals
  - Configuration directory path and symlink path are injected via constructor, not hardcoded
  - Namespace: `rd::adapters::filesystem`
  - _Requirements: 1_

- [ ] 5.2 Implement DbAudioHealthChecker adapter
  - Implements IHealthChecker
  - Validates database connectivity and schema version via a database validation function (port to core library)
  - Validates audio store accessibility via an audio store validation function (port to core library)
  - Returns HealthStatus with all three fields populated
  - Uses Qt SQL for database validation
  - Namespace: `rd::adapters::persistence`
  - _Requirements: 2_

- [ ] 5.3 Implement HelperProcessLauncher adapter
  - Implements IProcessLauncher
  - Uses QProcess to launch the helper binary with the config filename as argument
  - Waits for process completion synchronously (blocking call, acceptable for this utility)
  - Captures exit code and exit status (normal vs. crash)
  - Translates QProcess results to SwitchResult domain value
  - Helper binary path is injected via constructor, not hardcoded
  - Namespace: `rd::adapters::process`
  - _Requirements: 3, 4_

- [ ] 6. UI adapter and QML view
- [ ] 6.1 Implement ConfigListModel (UI adapter)
  - Extends QAbstractListModel
  - Exposes roles: label (string), filePath (string), isActive (bool), healthStatus (enum: healthy/unhealthy/unchecked)
  - On construction, calls ConfigDiscoveryService to populate the model
  - Provides Q_INVOKABLE `requestSwitch(int index)` method that calls ConfigSwitchService
  - Emits `switchSucceeded()` signal on success (QML closes app)
  - Emits `errorOccurred(QString code, QString message)` signal on failure (QML shows dialog)
  - Exposes `currentSystemName` property (Q_PROPERTY with NOTIFY) showing active config label or "None"
  - Namespace: `rd::adapters::ui`
  - _Requirements: 1, 2, 3, 5_

- [ ] 6.2 Implement SelectorView QML
  - Single-window QML view with fixed size (400x300 logical pixels)
  - Header area showing "Current System: {name}" bound to ConfigListModel.currentSystemName
  - "Available Systems" label above the list
  - ListView bound to ConfigListModel displaying config labels with health status icons (green checkmark for healthy, red X for unhealthy, no icon for unchecked)
  - "Select" button triggering requestSwitch() on the selected item
  - "Cancel" button closing the application
  - Double-click on list item triggers requestSwitch()
  - Error dialog (modal) shown on errorOccurred signal
  - Window positioning: read monitor position preference and apply offset to avoid monitor widget overlap
  - All user-visible strings wrapped in qsTr() for internationalization
  - Follow global design system (dark theme, Fira fonts, spacing tokens)
  - _Requirements: 1, 2, 3, 5, 6_

- [ ] 7. Application composition root
- [ ] 7.1 Implement application entry point and dependency wiring
  - Create QML application engine
  - Instantiate adapters: FilesystemConfigRepository, DbAudioHealthChecker, HelperProcessLauncher
  - Inject adapters into application services: ConfigDiscoveryService, ConfigSwitchService
  - Inject services into ConfigListModel
  - Expose ConfigListModel to QML context
  - Load SelectorView QML
  - Load translation files based on system locale
  - Namespace: `rd::app`
  - _Requirements: 1, 2, 3, 4, 5, 6_

- [ ] 8. Tests
- [ ] 8.1 Unit tests for domain layer
  - Test SystemConfig construction and getters
  - Test HealthStatus.isHealthy() with all combinations (8 cases)
  - Test SwitchExitCode fromExitCode() for all 12 codes plus out-of-range
  - Test SwitchExitCode toDisplayText() for all 12 codes
  - Test SwitchResult.isSuccess() and errorText() for success, failure, and crash scenarios
  - Pure C++ tests, no Qt dependency
  - _Requirements: 1, 2, 3, 4_

- [ ] 8.2 Unit tests for application services
  - Test ConfigDiscoveryService with mock IConfigRepository and mock IHealthChecker
  - Verify: active config gets health check, non-active configs do not
  - Verify: empty config directory returns empty list
  - Verify: no active symlink results in all nullopt health statuses
  - Test ConfigSwitchService with mock IProcessLauncher
  - Verify: success result when exit code is Ok
  - Verify: failure result with correct error text for each exit code
  - Verify: crash detection when normalTermination is false
  - _Requirements: 1, 2, 3, 4_

- [ ] 8.3 Integration tests for adapters
  - Test FilesystemConfigRepository with a temporary directory containing sample .conf files and a symlink
  - Test HelperProcessLauncher with a mock helper script that exits with configurable codes
  - Test DbAudioHealthChecker with test database (or verify error handling when DB is unavailable)
  - _Requirements: 1, 2, 3_

- [ ] 8.4 E2E tests for full application
  - Test: application starts and shows discovered configurations
  - Test: active healthy config displays green checkmark
  - Test: active unhealthy config displays red X
  - Test: double-click triggers switch flow
  - Test: error dialog shown on switch failure
  - Test: application closes on successful switch
  - Uses qt-vnc-agent for UI automation
  - _Requirements: 1, 2, 3, 4, 5_
