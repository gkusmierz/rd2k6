---
partial_id: "045"
class: RDMonitorConfig
source_files:
  - lib/rdmonitor_config.h
  - lib/rdmonitor_config.cpp
phase: 2
status: done
---

# RDMonitorConfig — RDMonitor Window Configuration (File)

## Purpose
Manages the display position and screen assignment for the RDMonitor system-tray/status application. Like RDConfig, this reads from a flat file — NOT from the database.

## Data Source
- **File**: `~/.rdmonitorrc` (user's home directory)
- **Format**: INI-style, parsed by `RDProfile`
- **No SQL** — purely file-based
- Supports both reading (`load()`) and writing (`save()`)

## Constructor
`RDMonitorConfig()` — sets default filename to `~/.rdmonitorrc`

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## Enums

### Position
Screen position for the monitor widget:
`UpperLeft=0`, `UpperCenter=1`, `UpperRight=2`, `LowerLeft=3`, `LowerCenter=4`, `LowerRight=5`

## Configuration: [Monitor] section

| Setting | Accessor | Default | Description |
|---------|----------|---------|-------------|
| ScreenNumber | `screenNumber()` / `setScreenNumber()` | 0 | Which screen/display to show on |
| Position | `position()` / `setPosition()` | UpperLeft | Corner/edge position on screen |
| XOffset | `xOffset()` / `setXOffset()` | 0 | Horizontal pixel offset from position |
| YOffset | `yOffset()` / `setYOffset()` | 0 | Vertical pixel offset from position |

## Key Methods
- `load()` — reads configuration from INI file
- `save()` — writes configuration back to INI file (direct fprintf, not RDProfile)
- `clear()` — resets all settings to defaults
- `positionText(Position)` — static, returns human-readable position name (e.g., "Top Left", "Bottom Right")
