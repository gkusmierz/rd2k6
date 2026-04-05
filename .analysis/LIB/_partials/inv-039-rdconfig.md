---
partial_id: "039"
class: RDConfig
source_files:
  - lib/rdconfig.h
  - lib/rdconfig.cpp
phase: 2
status: done
---

# RDConfig — System Configuration (rd.conf)

## Purpose
Reads and stores the entire system-wide Rivendell configuration from an INI-style file (`rd.conf`). This is the foundational config class — every Rivendell daemon and application reads it on startup. Unlike other config classes, it does NOT use the database; it reads from a flat file via `RDProfile`.

## Data Source
- **File**: `/etc/rd.conf` (default, configurable via `setFilename()`)
- **Format**: INI sections parsed by `RDProfile`
- **No SQL** — purely file-based

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## Enums

### RDSelectExitCode
Exit codes for the `rdselect` configuration-switching tool:
`RDSelectOk=0`, `RDSelectInvalidArguments=1`, `RDSelectNoSuchConfiguration=2`, `RDSelectModulesActive=3`, `RDSelectNotRoot=4`, `RDSelectSystemctlCrashed=5`, `RDSelectRivendellShutdownFailed=6`, `RDSelectAudioUnmountFailed=7`, `RDSelectAudioMountFailed=8`, `RDSelectRivendellStartupFailed=9`, `RDSelectNoCurrentConfig=10`, `RDSelectSymlinkFailed=11`, `RDSelectInvalidName=12`, `RDSelectMountCrashed=13`, `RDSelectCantAccessAutomount=14`

## Configuration Sections & Settings

### [Identity]
| Setting | Accessor | Description |
|---------|----------|-------------|
| StationName | `stationName()` | Hostname of this station (default: system hostname) |
| Password | `password()` | Station password |
| AudioOwner / AudioGroup | `audioOwner()` / `audioGroup()` | Unix owner/group for audio files |
| PypadOwner / PypadGroup | `pypadOwner()` / `pypadGroup()` | Unix owner/group for PAD scripts |
| RnRmlOwner / RnRmlGroup | `rnRmlOwner()` / `rnRmlGroup()` | Unix owner/group for RML operations |
| Label | `label()` | Station label string |
| HttpUserAgent | `userAgent()` | Custom HTTP user-agent |
| SyslogFacility | `syslogFacility()` | Syslog facility code |

### [AudioStore]
| Setting | Accessor | Description |
|---------|----------|-------------|
| MountSource | `audioStoreMountSource()` | NFS/mount source for audio store |
| MountType | `audioStoreMountType()` | Filesystem type for mounting |
| MountOptions | `audioStoreMountOptions()` | Mount options |
| CaeHostname | `audioStoreCaeHostname()` | CAE hostname (default: localhost) |
| XportHostname | `audioStoreXportHostname()` | Xport hostname (default: localhost) |

### [Fonts]
| Setting | Accessor | Description |
|---------|----------|-------------|
| Family | `fontFamily()` | Font family override |
| ButtonSize | `fontButtonSize()` | Button font size (-1 = default) |
| LabelSize | `fontLabelSize()` | Label font size (-1 = default) |
| DefaultSize | `fontDefaultSize()` | Default font size (-1 = default) |

### [Provisioning]
| Setting | Accessor | Description |
|---------|----------|-------------|
| CreateHost | `provisioningCreateHost()` | Auto-create host on first connect |
| NewHostTemplate | `provisioningHostTemplate()` | Template for new hosts |
| NewHostIpAddress | `provisioningHostIpAddress()` | Network interface for IP resolution |
| NewHostShortNameRegex | `provisioningHostShortName()` | Regex for short hostname extraction |
| CreateService | `provisioningCreateService()` | Auto-create service |
| NewServiceTemplate | `provisioningServiceTemplate()` | Template for new services |
| NewServiceNameRegex | `provisioningServiceName()` | Regex for service name extraction |

### [mySQL]
| Setting | Accessor | Description |
|---------|----------|-------------|
| Hostname | `mysqlHostname()` | MySQL server hostname |
| Loginname | `mysqlUsername()` | MySQL username |
| Database | `mysqlDbname()` | Database name |
| Password | `mysqlPassword()` | MySQL password (default: station password) |
| Driver | `mysqlDriver()` | Qt SQL driver name |
| HeartbeatInterval | `mysqlHeartbeatInterval()` | Connection keepalive interval |
| Engine | `mysqlEngine()` | MySQL storage engine |

### [Cae]
| Setting | Accessor | Description |
|---------|----------|-------------|
| AudioRoot | `audioRoot()` | Root path for audio files |
| AudioExtension | `audioExtension()` | Audio file extension |

### [Alsa]
| Setting | Accessor | Description |
|---------|----------|-------------|
| PeriodQuantity | `alsaPeriodQuantity()` | ALSA buffer period count |
| PeriodSize | `alsaPeriodSize()` | ALSA buffer period size |
| ChannelsPerPcm | `alsaChannelsPerPcm()` | Channels per ALSA PCM device |

### [Hacks]
| Setting | Accessor | Description |
|---------|----------|-------------|
| DisableMaintChecks | `disableMaintChecks()` | Skip maintenance checks |
| SuppressMusicImportLinks | `suppressMusicImportLinks()` | Hide music import links |
| SaveWebgetFilesDirectory | `saveWebgetFilesDirectory()` | Debug: save webget files |
| LockRdairplayMemory | `lockRdairplayMemory()` | Lock rdairplay pages in RAM |
| MeterPortBaseNumber | `meterBasePort()` | UDP base port for meters |
| MeterPortRange | `meterPortRange()` | UDP port range for meters |
| SuppressLinkParameterInheritance | `suppressLinkParameterInheritance()` | Services to skip link param inheritance |

### [Tuning]
| Setting | Accessor | Description |
|---------|----------|-------------|
| UseRealtime | `useRealtime()` | Enable realtime scheduling |
| RealtimePriority | `realtimePriority()` | RT priority (default: 9) |
| TranscodingDelay | `transcodingDelay()` | Transcoding delay in ms |
| ServiceTimeout | `serviceTimeout()` | Service timeout |
| TempDirectory | `tempDirectory()` | Temp directory path |

### [Caed]
| Setting | Accessor | Description |
|---------|----------|-------------|
| EnableMixerLogging | `enableMixerLogging()` | Log mixer changes |

### [Logs]
| Setting | Accessor | Description |
|---------|----------|-------------|
| LogXloadDebugData | `logXloadDebugData()` | Debug logging for xload |

### [SASFilter]
| Setting | Accessor | Description |
|---------|----------|-------------|
| Station | `sasStation()` | SAS filter station |
| Matrix | `sasMatrix()` | SAS matrix number |
| BaseCart | `sasBaseCart()` | SAS base cart number |
| TtyDevice | `sasTtyDevice()` | SAS TTY device path |

### [RDBackup]
| Setting | Accessor | Description |
|---------|----------|-------------|
| Destination1..N | `destination(n)` | Backup destinations (enumerated) |

## Key Methods
- `load()` — parses `rd.conf`, populates all fields, resolves network interface IP
- `clear()` — resets all fields to defaults
- `audioFileName(cartnum, cutnum, ext)` — constructs audio file path from cart/cut numbers
- `createTablePostfix(engine)` — returns SQL postfix for table creation based on engine type
- `rdselectExitCodeText(code)` — human-readable text for exit codes

## Global Accessor
- `RDConfiguration()` — global function returning singleton `RDConfig*`
