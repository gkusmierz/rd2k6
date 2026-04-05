---
partial_id: "009"
class_name: RDApplication
source_files:
  - lib/rdapplication.h
  - lib/rdapplication.cpp
inherits:
  - QObject
has_signals: true
has_slots: true
has_enums: true
has_properties: false
singleton: true
status: done
---

# RDApplication

## Purpose

Central application singleton providing unified access to all Rivendell subsystem objects. Every Rivendell GUI and CLI module creates one RDApplication instance (globally accessible via `rda` pointer). Responsible for:

- Parsing command-line switches
- Loading system configuration (rd.conf)
- Opening and validating the database connection (with schema version check)
- Initializing all core subsystem accessors (station, user, CAE, RIPC, configs)
- Verifying that the Rivendell systemd service is active
- Managing user session lifecycle (ticket-based and RIPC-based authentication)
- Providing centralized syslog logging
- Tracking and cleaning up temporary files at exit

## Inheritance

```
QObject
  +-- RDApplication
```

## Global Singleton

- `extern RDApplication *rda` -- global pointer, used by all modules to access subsystems.

## Enums

### ErrorType
Identifies the category of error during `open()`:
| Value | Meaning |
|---|---|
| ErrorOk (0) | No error |
| ErrorDbVersionSkew (1) | Database schema version does not match expected version |
| ErrorNoHostEntry (2) | This host has no entry in the Hosts database table |
| ErrorNoService (3) | Rivendell systemd service is not running |

### ExitCode
Standardized process exit codes used across all Rivendell modules:
| Value | Meaning |
|---|---|
| ExitOk (0) | Success |
| ExitPriorInstance (1) | Another instance already running |
| ExitNoDb (2) | Unable to open database |
| ExitSvcFailed (3) | Unable to start a service component |
| ExitInvalidOption (4) | Unknown/invalid command option |
| ExitOutputProtected (5) | Unable to overwrite output (--P given) |
| ExitNoSvc (6) | No such service |
| ExitNoLog (7) | No such log |
| ExitNoReport (8) | No such report |
| ExitLogGenFailed (9) | Log generation failed |
| ExitLogLinkFailed (10) | Schedule import failed |
| ExitNoPerms (11) | Insufficient permissions |
| ExitReportFailed (12) | Report generation failed |
| ExitImportFailed (13) | One or more audio imports failed |
| ExitNoDropbox (14) | Unknown dropbox ID |
| ExitNoGroup (15) | No such group |
| ExitInvalidCart (16) | Invalid cart number |
| ExitNoSchedCode (17) | No such scheduler code |
| ExitBadTicket (18) | Bad authentication ticket |
| ExitLast (19) | Sentinel value |

## Signals

| Signal | Description |
|---|---|
| `userChanged()` | Emitted when the active user session changes (either via RIPC notification or ticket validation) |

## Slots (private)

| Slot | Trigger | Behavior |
|---|---|---|
| `userChangedData()` | Connected to `RDRipc::userChanged()` | Resolves the current user: if no ticket, reads user from RIPC; if ticket present, validates ticket+IP against WEBAPI_AUTHS table. On invalid ticket, terminates with ExitBadTicket. Emits `userChanged()` on success. |

## Public API -- Initialization

| Method | Signature | Behavior |
|---|---|---|
| Constructor | `RDApplication(module_name, cmdname, usage, parent=0)` | Stores module identity, NULLs all subsystem pointers, registers atexit callback for temp file cleanup |
| `open()` | `bool open(err_msg, err_type=NULL, check_svc=true)` | Full initialization sequence: (1) parse command switches (--skip-db-check, --ticket, --persistent-dropbox-id), (2) load rd.conf, (3) init syslog, (4) optionally check Rivendell service, (5) open DB + validate schema, (6) create DB heartbeat, (7) instantiate all subsystem accessors, (8) connect RIPC user-change signal. Returns false with error details on any failure. |

## Public API -- Subsystem Accessors

All return pointers to subsystem objects created during `open()`:

| Accessor | Returns | Subsystem |
|---|---|---|
| `airplayConf()` | `RDAirPlayConf*` | Airplay configuration for this station (RDAIRPLAY instance) |
| `panelConf()` | `RDAirPlayConf*` | Airplay configuration for this station (RDPANEL instance) |
| `cae()` | `RDCae*` | Core Audio Engine interface |
| `cmdSwitch()` | `RDCmdSwitch*` | Parsed command-line switches |
| `config()` | `RDConfig*` | System configuration from rd.conf |
| `libraryConf()` | `RDLibraryConf*` | Library module configuration for this station |
| `logeditConf()` | `RDLogeditConf*` | Log editor configuration for this station |
| `ripc()` | `RDRipc*` | Rivendell Inter-Process Communication daemon connection |
| `rssSchemas()` | `RDRssSchemas*` | RSS feed schema definitions |
| `station()` | `RDStation*` | Current station identity and settings |
| `system()` | `RDSystem*` | System-wide settings |
| `user()` | `RDUser*` | Currently authenticated user |

## Public API -- Utilities

| Method | Signature | Behavior |
|---|---|---|
| `dropTable()` | `bool dropTable(tbl_name)` | Safely drops a MySQL table if it exists; returns true if table was found and dropped |
| `addTempFile()` | `void addTempFile(pathname)` | Registers a file path for automatic deletion when the process exits (via atexit callback) |
| `syslog()` | `void syslog(priority, fmt, ...)` | Writes to syslog using the configured facility from rd.conf |
| `syslog()` (static) | `static void syslog(config, priority, fmt, ...)` | Static variant accepting an explicit RDConfig for use before singleton is initialized |
| `logAuthenticationFailure()` | `void logAuthenticationFailure(orig_addr, login_name="")` | Logs a failed WebAPI login attempt to syslog with originating IP (and optionally username) |
| `exitCodeText()` (static) | `static QString exitCodeText(code)` | Returns human-readable text for an ExitCode value |

## Private Methods

| Method | Behavior |
|---|---|
| `CheckService()` | Polls `systemctl show rivendell` to verify ActiveState==active. Retries up to serviceTimeout seconds (from config). Returns false with error message if service not running or systemctl fails. |

## Database Interaction

- `open()`: calls `RDOpenDb()` to establish MySQL connection, validates schema version against `RD_VERSION_DATABASE`
- `userChangedData()`: queries `WEBAPI_AUTHS` table to validate ticket-based authentication (TICKET + IPV4_ADDRESS + EXPIRATION_DATETIME)
- `dropTable()`: executes `SHOW TABLES` and `DROP TABLE` via `RDSqlQuery`
- `RDDbHeartbeat` created during `open()` to maintain periodic DB keepalive

## Platform/OS Dependencies

- Uses `systemctl` (systemd) to verify the Rivendell service is active -- Linux-specific
- Uses POSIX `openlog()`/`vsyslog()` for logging
- Uses POSIX `atexit()` + `unlink()` for temporary file cleanup
- Uses `sleep(1)` in service check retry loop

## Lifecycle

1. **Construction**: module identity stored, all subsystem pointers NULL, atexit callback registered
2. **open()**: full initialization -- config, logging, service check, DB, all accessors created
3. **Runtime**: subsystems accessed via `rda->` global pointer; user changes handled reactively via RIPC signal
4. **Destruction**: all subsystem objects deleted in reverse dependency order (heartbeat first, then config/station/library/user/cae/ripc)
5. **Exit**: atexit callback removes all registered temp files

## Key Relationships

- **RDConfig**: loaded first, provides DB credentials, syslog facility, station name, service timeout
- **RDRipc**: provides real-time user change notifications; connected via signal/slot
- **RDUser**: represents current authenticated user; set from RIPC or ticket validation
- **RDStation**: represents current host; checked for existence in DB after open
- **RDCae**: audio engine; initialized with station + config
- **RDDbHeartbeat**: keeps DB connection alive at configured interval
