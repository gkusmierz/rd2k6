# Implementation Plan

- [ ] 1. Domain layer: user entity and authentication service
- [ ] 1.1 (P) Define the UserEntity domain entity
  - Model a user with login name (string, max 8 chars), full name (string), and configuration admin privilege (boolean)
  - Implement as an immutable value object with getter methods marked `[[nodiscard]]`
  - Place in `src/domain/entities/` with no Qt dependencies
  - _Requirements: 3, 6_

- [ ] 1.2 (P) Implement the AuthenticationService domain service
  - Accept an optional user entity and a password string
  - Return true only when the user exists and the password matches
  - Handle the missing-user case gracefully (return false, no error)
  - Place in `src/domain/services/` with no Qt dependencies
  - _Requirements: 3_

- [ ] 1.3 (P) Unit tests for domain layer
  - Test AuthenticationService with valid user and correct password returns true
  - Test AuthenticationService with valid user and wrong password returns false
  - Test AuthenticationService with missing user returns false
  - Test UserEntity correctly reports admin privilege flag
  - Tests must compile and run without Qt linkage
  - _Requirements: 3, 6_

- [ ] 2. Ports: define all interface contracts
- [ ] 2.1 (P) Define the IUserRepository outbound port
  - Method: `findNonAdminUsers() -> list of UserEntity` (returns users without config admin privilege, ordered by login name)
  - Method: `findByLoginName(name: string) -> optional<UserEntity>`
  - Header-only, pure virtual interface in `src/ports/outbound/`
  - Use only domain types in signatures
  - _Requirements: 1, 6_

- [ ] 2.2 (P) Define the IStationConfig outbound port
  - Method: `getDefaultUserName() -> string`
  - Header-only, pure virtual interface in `src/ports/outbound/`
  - _Requirements: 4_

- [ ] 2.3 (P) Define the ISystemConfig outbound port
  - Method: `isUserListEnabled() -> bool`
  - Header-only, pure virtual interface in `src/ports/outbound/`
  - _Requirements: 2_

- [ ] 2.4 (P) Define the IIpcClient outbound port
  - Method: `connect(host: string, port: int, password: string) -> Result<void, ErrorInfo>`
  - Method: `setActiveUser(username: string) -> void`
  - Method: `currentUser() -> string`
  - Event: `userChanged()` signal equivalent
  - Event: `connected(state: bool)` signal equivalent
  - Header-only, pure virtual interface in `src/ports/outbound/`
  - _Requirements: 1, 3, 4, 8_

- [ ] 2.5 (P) Define the ILoginService inbound port
  - Method: `initialize() -> Result<LoginConfig, ErrorInfo>` where LoginConfig contains user list, display mode, current user
  - Method: `authenticate(username: string, password: string) -> Result<void, ErrorInfo>`
  - Method: `resetToDefaultUser() -> Result<string, ErrorInfo>`
  - Method: `currentUser() -> string`
  - Header-only, pure virtual interface in `src/ports/inbound/`
  - _Requirements: 1, 2, 3, 4_

- [ ] 3. Application layer: LoginService implementation
- [ ] 3.1 Implement LoginService initialization
  - Receive all outbound ports via constructor injection (IUserRepository, IStationConfig, ISystemConfig, IIpcClient)
  - On initialize(): connect IPC client, query system config for display mode, load non-admin user list
  - Return a LoginConfig struct with user list, display mode flag, and current user name
  - If IPC connection fails, return a critical ErrorInfo
  - _Requirements: 1, 2, 6_

- [ ] 3.2 Implement LoginService authentication
  - Look up user by login name via IUserRepository
  - Delegate credential validation to AuthenticationService
  - On success: call IpcClient.setActiveUser() and return success
  - On failure: return ErrorInfo with category Validation, code "INVALID_CREDENTIALS"
  - _Requirements: 3_

- [ ] 3.3 Implement LoginService default user reset
  - Read station default username from IStationConfig
  - Call IpcClient.setActiveUser() with the default username
  - Return the default username to the caller
  - _Requirements: 4_

- [ ] 3.4 Implement LoginService user change notification forwarding
  - Subscribe to IpcClient userChanged event
  - Forward the event so the UI adapter can update the current user display
  - _Requirements: 8_

- [ ] 3.5 Unit tests for LoginService
  - Test initialize() loads user list and determines display mode from mocked ports
  - Test authenticate() with valid credentials calls IPC setActiveUser
  - Test authenticate() with invalid credentials returns error without calling IPC
  - Test resetToDefaultUser() reads station config and calls IPC
  - Test initialization failure when IPC connection fails returns critical error
  - _Requirements: 1, 2, 3, 4, 6, 8_

- [ ] 4. Infrastructure adapters
- [ ] 4.1 (P) Implement SqlUserRepository adapter
  - Execute `SELECT LOGIN_NAME FROM USERS WHERE ADMIN_CONFIG_PRIV='N' ORDER BY LOGIN_NAME`
  - Map results to UserEntity domain objects
  - Implement findByLoginName with password retrieval for authentication
  - Use Qt SQL, place in `src/adapters/persistence/`
  - _Requirements: 1, 6_

- [ ] 4.2 (P) Implement SqlStationConfig adapter
  - Read the station's default user name from the STATIONS table
  - Use Qt SQL, place in `src/adapters/persistence/`
  - _Requirements: 4_

- [ ] 4.3 (P) Implement SqlSystemConfig adapter
  - Read the show-user-list system setting
  - Use Qt SQL, place in `src/adapters/persistence/`
  - _Requirements: 2_

- [ ] 4.4 (P) Implement RipcClientAdapter
  - Manage TCP connection to the IPC daemon
  - Implement setActiveUser command transmission
  - Implement currentUser query
  - Emit connected and userChanged signals on IPC events
  - Use Qt Network, place in `src/adapters/network/`
  - _Requirements: 1, 3, 4, 8_

- [ ] 4.5 Integration tests for adapters
  - Test SqlUserRepository returns only non-admin users ordered alphabetically (using in-memory SQLite)
  - Test SqlUserRepository.findByLoginName returns correct user or empty
  - Test SqlStationConfig reads default user name correctly
  - Test SqlSystemConfig reads show-user-list setting correctly
  - _Requirements: 1, 2, 4, 6_

- [ ] 5. UI adapter: LoginController
- [ ] 5.1 Implement LoginController QObject
  - Expose Q_PROPERTY: currentUser (string), userList (QStringList), displayMode (enum: dropdown/manual), errorMessage (string)
  - Expose Q_INVOKABLE: authenticate(username, password), resetToDefault(), cancel()
  - Calculate dynamic window width from longest username in user list (min 280px, max 1020px)
  - Emit errorOccurred(code, message) signal on authentication failure
  - Emit exitRequested(exitCode) signal on successful login, default user reset, or cancel
  - Forward user change notifications from LoginService to update currentUser property
  - Place in `src/adapters/ui/`
  - _Requirements: 2, 3, 4, 5, 7, 8_

- [ ] 5.2 Unit tests for LoginController
  - Test authenticate() emits exitRequested(0) on success
  - Test authenticate() emits errorOccurred on invalid credentials
  - Test resetToDefault() emits exitRequested(0)
  - Test cancel() emits exitRequested(0)
  - Test window width calculation: minimum 280px, capped at 1020px
  - Test user list model is populated excluding admin users
  - _Requirements: 2, 3, 4, 5, 7_

- [ ] 6. UI layer: QML login view
- [ ] 6.1 Implement the LoginView QML component
  - Read `design-system/MASTER.md` and `.blah/steering/design.md` before writing any visual code
  - Display "Current User: {name}" label at top of dialog, bound to LoginController.currentUser
  - Conditionally show dropdown (ComboBox) or text input based on LoginController.displayMode
  - Password field with masked input and maximum length enforcement
  - "Set User" button bound to LoginController.authenticate()
  - "Default User" button bound to LoginController.resetToDefault()
  - "Cancel" button bound to LoginController.cancel()
  - Enter key in password field triggers authentication
  - Dynamic window width from LoginController, fixed size policy
  - Place in `src/ui/views/`
  - _Requirements: 2, 3, 4, 5, 7_

- [ ] 6.2 Implement error dialog handling in QML
  - Connect to LoginController.errorOccurred signal
  - Display warning dialog for authentication failures
  - Display critical modal dialog for system errors (initialization failure, unknown CLI option)
  - _Requirements: 1, 3_

- [ ] 7. Application composition and entry point
- [ ] 7.1 Implement the composition root and main entry point
  - Parse command-line arguments; reject unknown options with critical error and exit code 2
  - Wire all adapters to ports via dependency injection
  - Create LoginService with all outbound port implementations
  - Create LoginController with LoginService
  - Load QML engine with LoginView
  - Connect LoginController.exitRequested to application quit
  - Place in `src/app/`
  - _Requirements: 1, 5_

- [ ] 7.2 E2E tests for complete login workflows
  - Test: launch -> select user from dropdown -> enter correct password -> click Set User -> application exits with code 0
  - Test: launch -> enter wrong password -> warning dialog shown -> application remains open
  - Test: launch -> click Default User -> application exits with code 0
  - Test: launch -> click Cancel -> application exits with code 0 without user change
  - Use qt-vnc-agent for UI automation
  - _Requirements: 1, 2, 3, 4, 5_
