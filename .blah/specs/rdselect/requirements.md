# Requirements Document

## Introduction

RDSelect is the Rivendell system configuration selector application. It provides a graphical interface for broadcast operators and system administrators to view available Rivendell system configurations, validate their health (database connectivity and audio store accessibility), and switch between configurations. The application delegates privileged operations (symlink updates, service restarts) to a helper process, ensuring secure configuration transitions in multi-station broadcast environments.

## Requirements

### Requirement 1: Configuration Discovery
**Objective:** As a system administrator, I want the application to discover all available system configurations at startup, so that I can see which environments are available and which one is currently active.

#### Acceptance Criteria
1. When the application starts, the system shall scan the configuration directory for all configuration files.
2. When configuration files are found, the system shall load each file and display its label in the configuration list.
3. When the active configuration symlink exists, the system shall identify the currently active configuration by resolving the symlink target.
4. When the active configuration is identified, the system shall highlight it in the list and display its name in the "Current System" label.
5. If no configuration files are found, the system shall display an empty list.
6. If no active configuration symlink exists, the system shall display "None" as the current system.

### Requirement 2: Configuration Validation
**Objective:** As a system administrator, I want the active configuration to be validated for database connectivity and audio store accessibility, so that I can immediately see whether the current environment is healthy.

#### Acceptance Criteria
1. When the active configuration is displayed, the system shall validate the database connection and schema version.
2. When the active configuration is displayed, the system shall validate audio store accessibility.
3. When the database is reachable with the correct schema version and the audio store is accessible, the system shall display a green checkmark icon next to the active configuration.
4. If the database is unreachable, the schema version is incorrect, or the audio store is inaccessible, the system shall display a red X icon next to the active configuration.
5. The system shall display status icons only for the active configuration; non-active configurations shall have no status icon.

### Requirement 3: Configuration Switching
**Objective:** As a system administrator, I want to switch the active system configuration, so that I can transition between different Rivendell environments (e.g., production, staging, test).

#### Acceptance Criteria
1. When the user selects a configuration and clicks "Select", the system shall launch the configuration switch helper process with the selected configuration filename.
2. When the user double-clicks a configuration in the list, the system shall initiate the same configuration switch as clicking "Select".
3. When the helper process completes successfully (exit code 0), the system shall close the application.
4. If the helper process exits with a non-zero exit code, the system shall display a critical error dialog with the decoded failure reason.
5. If the helper process terminates abnormally (crash), the system shall display a critical error dialog stating that the helper process crashed.
6. When a configuration switch fails, the system shall remain open so the user can retry or choose a different configuration.

### Requirement 4: Helper Process Exit Codes
**Objective:** As a system administrator, I want meaningful error messages when a configuration switch fails, so that I can diagnose and resolve the issue.

#### Acceptance Criteria
1. If the helper process reports invalid arguments, the system shall display the corresponding error text.
2. If the helper process reports that the configuration was not found, the system shall display the corresponding error text.
3. If the helper process reports that Rivendell modules are still active, the system shall display the corresponding error text.
4. If the helper process reports insufficient privileges (not root), the system shall display the corresponding error text.
5. If the helper process reports a service management failure (service stop, service start, or service manager crash), the system shall display the corresponding error text.
6. If the helper process reports an audio store mount or unmount failure, the system shall display the corresponding error text.
7. If the helper process reports a symlink creation failure or missing current configuration, the system shall display the corresponding error text.

### Requirement 5: Window Positioning
**Objective:** As a broadcast operator, I want the application window to appear at a predictable screen position that does not overlap the monitor widget, so that I can quickly access it during operations.

#### Acceptance Criteria
1. When the monitor position preference is set, the system shall position the application window at the configured screen location (upper-left, upper-center, upper-right, lower-left, lower-center, or lower-right).
2. When the window is positioned at an upper position, the system shall offset the window vertically to avoid overlapping the monitor widget area.
3. When the window is positioned at a lower position, the system shall offset the window vertically to avoid overlapping the monitor widget area.
4. Where the monitor position preference is set to "last position", the system shall use the default window placement.

### Requirement 6: Internationalization
**Objective:** As a broadcast operator, I want the application interface to be available in my language, so that I can use the tool comfortably in my locale.

#### Acceptance Criteria
1. The system shall support translation of all user-visible strings.
2. The system shall load appropriate translation files based on the system locale at startup.
