# Requirements Document

## Introduction

RDMonitor is the Rivendell system health monitor -- a compact, always-on-top desktop widget that provides continuous at-a-glance visibility into database connectivity, schema integrity, and audio storage availability. It displays a color-coded health indicator (green/red) and a hover-activated status tooltip with detailed error descriptions. The widget supports configurable screen positioning across multiple monitors and can launch the system configuration selector when multiple configurations exist.

This specification covers five functional areas: periodic health validation, status display, widget positioning, configuration selection launch, and graceful process lifecycle.

## Requirements

### Requirement 1: Periodic Health Validation
**Objective:** As a broadcast operator, I want the system monitor to continuously check database and audio storage health, so that I am immediately aware of infrastructure problems that could affect broadcast operations.

#### Acceptance Criteria
1. The system shall perform a health validation cycle every 5 seconds.
2. When a validation cycle runs, the system shall check database connectivity by querying the schema version table.
3. When a validation cycle runs, the system shall check that the database schema version matches the expected application schema version.
4. When a validation cycle runs, the system shall verify that the audio storage filesystem is accessible.
5. When all three checks pass (database reachable, schema version correct, audio store mounted), the system shall display a green health indicator.
6. If any of the three checks fails, then the system shall display a red health indicator.
7. When a validation cycle runs, the system shall reload the system configuration to reflect any external changes to the station name.

### Requirement 2: Status Tooltip Display
**Objective:** As a broadcast operator, I want to see detailed health status on hover, so that I can quickly diagnose which subsystem is experiencing problems.

#### Acceptance Criteria
1. When the mouse enters the monitor widget area, the system shall display a floating status label with the current health details.
2. When the mouse leaves the monitor widget area, the system shall hide the floating status label.
3. When all health checks pass, the status label shall display "Status: OK".
4. If the database connection fails, then the status label shall display "Database: CONNECTION FAILED".
5. If the database is reachable but the schema version does not match the expected version, then the status label shall display "Database: SCHEMA SKEWED".
6. If the audio storage filesystem is not accessible, then the status label shall display "Audio Store: FAILED".
7. When multiple failures occur simultaneously, the status label shall display all applicable error messages combined.

### Requirement 3: Widget Screen Positioning
**Objective:** As a broadcast operator, I want to configure which screen corner the monitor widget occupies, so that it does not interfere with other broadcast applications while remaining visible.

#### Acceptance Criteria
1. The system shall support six screen positions: upper-left, upper-center, upper-right, lower-left, lower-center, and lower-right.
2. The system shall support positioning on any connected display screen.
3. Where position offsets are configured, the system shall apply horizontal and vertical pixel offsets (0 to 99 pixels each) from the selected corner.
4. The system shall size the widget width dynamically to accommodate the station name label plus indicator icons.
5. When the computed position would place the widget outside the desktop bounds, the system shall clamp the position to keep the widget fully visible.
6. When the user right-clicks the monitor widget, the system shall open a position configuration dialog.
7. When the user confirms the position configuration dialog, the system shall save the selected screen, position, and offsets to a persistent configuration file.
8. When the user cancels the position configuration dialog, the system shall discard changes and leave the position unchanged.
9. When the position configuration is saved, the system shall immediately reposition the widget to the new location.

### Requirement 4: Configuration Selector Launch
**Objective:** As a system administrator, I want to switch between multiple system configurations from the monitor widget, so that I can manage multi-configuration stations without leaving the desktop.

#### Acceptance Criteria
1. When the user double-clicks the monitor widget and multiple system configuration files exist, the system shall launch the configuration selector application.
2. If only one or zero configuration files exist, then the system shall ignore the double-click action.
3. When the configuration selector exits successfully, the system shall perform an immediate health validation cycle.
4. If the configuration selector crashes, then the system shall display an error dialog indicating the crash.
5. If the configuration selector exits with a non-zero exit code, then the system shall display an error dialog showing the exit code and error output.

### Requirement 5: Process Lifecycle
**Objective:** As a system administrator, I want the monitor to start and stop cleanly, so that it integrates reliably with system service management.

#### Acceptance Criteria
1. The system shall display a frameless, always-on-top widget that remains visible above other windows.
2. When the application starts, the system shall initialize the health validation timer, load position configuration, and position the widget on the configured screen.
3. When a termination signal is received, the system shall exit cleanly with a success code.
4. The system shall display the station name from the system configuration file as the widget label.
