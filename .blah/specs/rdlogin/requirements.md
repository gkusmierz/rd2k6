# Requirements Document

## Introduction

RDLogin is the Rivendell user login/switch application. It provides a compact dialog window that allows broadcast operators and system administrators to authenticate and change the active user on a Rivendell workstation. The application communicates user changes to the system through inter-process communication with the IPC daemon, rather than writing directly to the database.

RDLogin supports two modes of username entry: a dropdown list populated from the user database, or a manual text input field, controlled by a system-wide configuration setting. Administrative users (those with configuration privileges) are excluded from the dropdown list. The application validates credentials against the user database and, on success, sets the active user via IPC and exits.

## Requirements

### Requirement 1: Application Startup and Initialization

**Objective:** As a broadcast operator, I want the login application to initialize and connect to the system services on launch, so that I can switch the active user on my workstation.

#### Acceptance Criteria
1. When the application starts, the system shall establish a connection to the IPC daemon using the configured host and port.
2. When the application starts, the system shall query the user database for all users without configuration administration privileges.
3. When the application starts, the system shall display the current active user at the top of the window.
4. If the application fails to initialize (connection or configuration error), then the system shall display a critical error dialog with the error details and exit with code 1.
5. If an unrecognized command-line option is provided, then the system shall display a critical error dialog with the unknown option and exit with code 2.

### Requirement 2: User List Display Mode

**Objective:** As a system administrator, I want to control whether the login screen shows a user dropdown or a manual entry field, so that I can balance convenience with security for each station.

#### Acceptance Criteria
1. Where the system setting "show user list" is enabled, the system shall display a dropdown selector populated with all non-admin users, ordered alphabetically by login name.
2. Where the system setting "show user list" is disabled, the system shall display a text input field for manual username entry.
3. When the display mode is "dropdown", the system shall hide the manual text input field.
4. When the display mode is "manual entry", the system shall hide the dropdown selector.

### Requirement 3: User Authentication

**Objective:** As a broadcast operator, I want to authenticate with my username and password, so that the system recognizes me as the active user.

#### Acceptance Criteria
1. When the user selects or enters a username, enters a password, and activates the "Set User" action, the system shall validate the credentials against the user database.
2. When valid credentials are provided, the system shall set the authenticated user as the active user via IPC and exit with code 0.
3. If invalid credentials are provided (user does not exist or password is incorrect), then the system shall display a warning dialog with the message "Invalid Username or Password!".
4. If invalid credentials are provided, then the system shall keep the application open for another attempt.
5. When the user presses Enter in the password field, the system shall trigger the same authentication action as the "Set User" button.
6. The system shall mask the password input so characters are not visible.
7. The system shall enforce a maximum password length.

### Requirement 4: Default User Reset

**Objective:** As a broadcast operator, I want to quickly reset to the station's default user, so that I can return the workstation to its default state without knowing the default user's credentials.

#### Acceptance Criteria
1. When the user activates the "Default User" action, the system shall retrieve the station's configured default username.
2. When the user activates the "Default User" action, the system shall set the default user as the active user via IPC.
3. When the user activates the "Default User" action, the system shall select the default username in the dropdown (if visible) and exit with code 0.

### Requirement 5: Cancel and Exit

**Objective:** As a broadcast operator, I want to cancel the login dialog without making changes, so that I can dismiss the window when I decide not to switch users.

#### Acceptance Criteria
1. When the user activates the "Cancel" action, the system shall exit the application with code 0 without changing the active user.

### Requirement 6: Admin User Filtering

**Objective:** As a system administrator, I want configuration-privileged admin accounts excluded from the login dropdown, so that admin accounts are not casually switchable from the login dialog.

#### Acceptance Criteria
1. When populating the user list, the system shall exclude all users that have the configuration administration privilege enabled.
2. The system shall order the filtered user list alphabetically by login name.

### Requirement 7: Dynamic Window Sizing

**Objective:** As a broadcast operator, I want the login window to adapt its width to fit the longest username, so that all usernames are fully visible without scrolling.

#### Acceptance Criteria
1. When the application starts, the system shall calculate the display width of the longest username in the user list.
2. The system shall set the window width to accommodate the longest username, with a minimum width of 280 pixels.
3. If the calculated username display width exceeds 900 units, then the system shall cap the window width at 1020 pixels to prevent excessively wide windows.
4. The system shall use a fixed-size policy (not user-resizable).

### Requirement 8: Active User Change Notification

**Objective:** As a broadcast operator, I want the login dialog to reflect user changes made elsewhere in the system, so that I always see the current active user.

#### Acceptance Criteria
1. When the IPC daemon notifies that the active user has changed, the system shall update the "Current User" display label with the new username.
