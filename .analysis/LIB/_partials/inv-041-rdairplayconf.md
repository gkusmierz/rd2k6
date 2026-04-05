---
partial_id: "041"
class: RDAirPlayConf
source_files:
  - lib/rdairplay_conf.h
  - lib/rdairplay_conf.cpp
phase: 2
status: done
---

# RDAirPlayConf — RDAirPlay Application Configuration (DB)

## Purpose
Manages per-station configuration for the RDAirPlay on-air playout application. This is the most complex configuration class, covering audio channels, GPIO triggers, log machines, operational modes, panel settings, and display options.

## Data Source
- **Primary table**: dynamic — constructor takes `tablename` parameter (typically `RDAIRPLAY`)
- **Additional tables**:
  - `RDAIRPLAY_CHANNELS` — per-channel audio card/port assignments and RML triggers
  - `LOG_MACHINES` — per-log-machine runtime state (start mode, current log, running state)
  - `LOG_MODES` — per-machine operation mode settings
- **Key**: `STATION` column (station name), `INSTANCE` for channels/machines

## Constructor
`RDAirPlayConf(station, tablename)` — creates row in primary table if not exists for this station.

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## Enums

### TimeMode
`TwelveHour=0`, `TwentyFourHour=1`

### OpModeStyle
Determines how operation mode is selected.

### OpMode
`Previous=0`, `LiveAssist=1`, `Auto=2`, `Manual=3`

### Channel
Audio output channel identifiers:
`MainLog1Channel=0`, `MainLog2Channel=1`, `SoundPanel1Channel=2`, `CueChannel=3`, `AuxLog1Channel=4`, `AuxLog2Channel=5`, `SoundPanel2Channel=6..5Channel=9`, `LastChannel=10`

### BarAction
`NoAction=0`, `StartNext=1` — what happens when progress bar completes

### PanelType
`StationPanel=0`, `UserPanel=1`

### ExitCode
`ExitClean=0`, `ExitDirty=1`

### StartMode
`StartEmpty=0`, `StartPrevious=1`, `StartSpecified=2` — how log machine starts

### GpioType
`EdgeGpio=0`, `LevelGpio=1` — GPIO trigger mode

## Settings by DB Table

### Primary table (RDAIRPLAY) — per station
| Setting Group | Accessors | Description |
|---------------|-----------|-------------|
| Segue/Trans length | `segueLength()`, `transLength()` | Default segue and transition durations |
| Op mode | `opModeStyle()`, `opMode()` | Operation mode configuration |
| PIE countdown | `pieCountLength()`, `pieEndPoint()` | Countdown timer settings |
| Timesync | `checkTimesync()` | Whether to verify time synchronization |
| Panel config | `panels()`, `showAuxButton()`, `clearFilter()`, `flashPanel()`, `panelPauseEnabled()` | Sound panel display options |
| Default transition | `defaultTransType()` | Default transition type |
| Bar action | `barAction()` | Action when progress bar ends |
| Button labels | `buttonLabelTemplate()`, `pauseEnabled()` | Button display templates |
| Service/display | `defaultSvc()`, `titleTemplate()`, `artistTemplate()`, `outcueTemplate()`, `descriptionTemplate()` | Display formatting templates |
| Hour selector | `hourSelectorEnabled()` | Show hour selector in UI |
| Exit control | `exitCode()`, `virtualExitCode()`, `exitPasswordValid()`, `setExitPassword()` | Exit security (password-protected) |
| Skin | `skinPath()` | Custom skin path |
| Counters | `showCounters()` | Show counter displays |
| Audition | `auditionPreroll()` | Audition preroll in ms |
| Log start | `logStartMode()` | How logs start on application launch |

### RDAIRPLAY_CHANNELS — per station + instance (channel)
| Setting | Accessors | Description |
|---------|-----------|-------------|
| CARD / PORT | `card(chan)`, `port(chan)` | Audio card and port assignment |
| START_RML / STOP_RML | `startRml(chan)`, `stopRml(chan)` | RML macros on start/stop |
| Virtual card/port/RML | `virtualCard(mach)`, `virtualPort(mach)`, `virtualStartRml(mach)`, `virtualStopRml(mach)` | Virtual output assignments |
| GPIO config | `gpioType()`, `startGpiMatrix/Line()`, `startGpoMatrix/Line()`, `stopGpiMatrix/Line()` | GPIO trigger matrix/line mappings |

### LOG_MACHINES — per station + machine number
| Setting | Accessors | Description |
|---------|-----------|-------------|
| START_MODE | `startMode(mach)` | How machine starts (empty/previous/specified) |
| AUTO_RESTART | `autoRestart(mach)` | Auto-restart on crash |
| LOG_NAME | `logName(mach)` | Assigned log name |
| CURRENT_LOG | `currentLog(mach)` | Currently loaded log |
| RUNNING | `logRunning(mach)` | Is log currently running |
| LOG_ID | `logId(mach)` | Current log ID |
| LOG_LINE | `logCurrentLine(mach)` | Current playback line |
| NOW_CART / NEXT_CART | `logNowCart(mach)`, `logNextCart(mach)` | Currently playing / next cart numbers |

### LOG_MODES — per station + machine
| Setting | Accessors | Description |
|---------|-----------|-------------|
| Mode settings | `GetLogMode()`, `SetLogMode()` | Operation mode per machine |

## Key Methods
- `channelText(chan)` — human-readable channel name
- `logModeText(mode)` — human-readable mode name
- `GetChannelValue()` / `SetChannelValue()` — generic helpers for RDAIRPLAY_CHANNELS table
- `SetRow()` — generic helpers for primary table (int, unsigned, string variants)
