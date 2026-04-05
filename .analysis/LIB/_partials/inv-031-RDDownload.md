# INV-031: RDDownload

- **partial_id:** 031
- **status:** done
- **agent:** PHASE-2-inventory-subagent
- **date:** 2026-04-05

## Class Overview

| Property | Value |
|----------|-------|
| Class | `RDDownload` |
| Inherits | `RDTransfer` (-> `QObject`) |
| Role | Downloads a file from a remote or local URL to a local filesystem path |
| Q_OBJECT | Yes |
| Header | `lib/rddownload.h` |
| Source | `lib/rddownload.cpp` |

**Purpose:** Performs file downloads using libcurl. Supports multiple protocols (file, ftp, ftps, http, https, sftp). Provides progress reporting, abort capability, and structured error codes. Synchronous (blocking) transfer with Qt event loop pumping during progress callbacks.

## Enum: ErrorCode

| Value | Int | Meaning |
|-------|-----|---------|
| `ErrorOk` | 0 | Transfer succeeded |
| `ErrorUnsupportedProtocol` | 1 | URL scheme not in supported list |
| `ErrorNoSource` | 2 | Unable to access source file |
| `ErrorNoDestination` | 3 | Unable to create destination file for writing |
| `ErrorInvalidHostname` | 4 | DNS resolution failed |
| `ErrorInternal` | 5 | curl initialization failed |
| `ErrorRemoteServer` | 6 | Remote server error |
| `ErrorUrlInvalid` | 7 | Malformed URL or HTTP non-200 response |
| `ErrorUnspecified` | 8 | Catch-all for unmapped curl errors |
| `ErrorInvalidUser` | 9 | Local file: transfer with invalid system user credentials |
| `ErrorAborted` | 10 | Transfer aborted by user |
| `ErrorInvalidLogin` | 11 | Remote login denied (wrong username/password) |
| `ErrorRemoteAccess` | 12 | Remote access denied (permissions) |
| `ErrorRemoteConnection` | 13 | Could not connect to remote server |

## Constructor

| Signature | Parameters | Behavior |
|-----------|------------|----------|
| `RDDownload(RDConfig *config, QObject *parent=0)` | `config` - system configuration; `parent` - QObject parent | Calls RDTransfer base. Initializes aborting flag to false. |

## Public Methods

| Method | Signature | Returns | Behavior |
|--------|-----------|---------|----------|
| `supportedSchemes` | `QStringList supportedSchemes() const` | `{"file","ftp","ftps","http","https","sftp"}` | Overrides pure virtual. Declares all protocols this class can download from. |
| `setSourceUrl` | `void setSourceUrl(const QString &url)` | void | Sets the remote/local source URL for the download. |
| `setDestinationFile` | `void setDestinationFile(const QString &filename)` | void | Sets local destination file path. Also reads current file size for progress tracking. |
| `totalSteps` | `int totalSteps() const` | int | Returns destination file size (used for progress bar range). |
| `runDownload` | `ErrorCode runDownload(const QString &username, const QString &password, const QString &id_filename, bool use_id_filename, bool log_debug)` | ErrorCode | **Main operation.** Performs the synchronous download. See behavioral notes below. |
| `aborting` | `bool aborting() const` | bool | Returns current abort flag state. |
| `errorText` | `static QString errorText(ErrorCode err)` | Translated human-readable error string | Maps each ErrorCode to a localized message via `tr()`. |

## Signals

| Signal | Parameters | Emitted When |
|--------|------------|-------------|
| `progressChanged` | `int step` | During transfer, reports number of bytes transferred so far. Emitted from curl progress callback. |

## Public Slots

| Slot | Signature | Behavior |
|------|-----------|----------|
| `abort` | `void abort()` | Sets abort flag. On next curl progress callback, the transfer will be cancelled. |

## Private Methods

| Method | Signature | Behavior |
|--------|-----------|----------|
| `UpdateProgress` | `void UpdateProgress(int step)` | Emits `progressChanged` signal. Called from curl progress callback. |

## Friend Functions (curl callbacks)

| Function | Role |
|----------|------|
| `DownloadProgressCallback` | curl progress callback. Updates progress via `UpdateProgress()`, pumps Qt event loop via `qApp->processEvents()`, returns 1 (abort) if aborting flag is set. |
| `DownloadErrorCallback` | curl debug callback. Logs curl debug messages to syslog at LOG_DEBUG level. Only processes CURLINFO_TEXT type. |

## Private State

| Field | Type | Purpose |
|-------|------|---------|
| `conv_src_url` | `QUrl` | Source URL to download from |
| `conv_dst_filename` | `QString` | Local destination file path |
| `conv_aborting` | `bool` | Abort flag, checked during progress callbacks |
| `conv_dst_size` | `uint` | Destination file size at setup time (progress range) |

## Dependencies

| Dependency | Role |
|------------|------|
| `RDTransfer` | Base class (URL validation, config access) |
| `libcurl` | HTTP/FTP/SFTP transfer engine |
| `RDConfig` | System configuration (user agent string) |
| `RDSystemUser` | Local user credential validation for `file:` scheme |
| `RDApplication (rda)` | Syslog logging |
| `QApplication` | Event loop pumping during transfer |

## Platform / Linux-Specific

- **UID/GID switching:** For `file:` scheme transfers when running as root (UID 0), validates the provided username/password against the local system user database (`RDSystemUser`). Temporarily switches effective UID/GID to that user for the file operation, then restores original UID/GID afterward.
- **System headers:** Uses `sys/types.h`, `sys/stat.h`, `unistd.h`, `fcntl.h`, `syslog.h` -- POSIX/Linux only.
- **syslog:** Error/debug logging goes to syslog via `rda->syslog()`.

## Behavioral Notes

### runDownload sequence:
1. Validates source URL scheme against supported list.
2. For `file:` transfers running as root: validates local user credentials.
3. Initializes curl session; opens destination file for writing.
4. Encodes URL (strips user info, encodes `#` as `%23`).
5. **Authentication strategy:**
   - SFTP with identity file: uses SSH private key + passphrase.
   - All other protocols: uses username:password pair.
6. Configures curl: timeout (`RD_CURL_TIMEOUT`), follow redirects, progress callback, user agent from config.
7. Optionally enables verbose curl debug logging.
8. Performs blocking transfer (curl_easy_perform) with event loop pumping in progress callbacks.
9. For HTTP: checks response code is 200; non-200 treated as `ErrorUrlInvalid`.
10. Maps curl error codes to `ErrorCode` enum.
11. Restores UID/GID if switched; logs failure if debug enabled; cleans up curl and file handles.
12. Returns structured error code.

### Abort mechanism:
- Caller invokes `abort()` slot (e.g., from UI button).
- Next curl progress callback checks `aborting()` and returns non-zero to curl, which cancels the transfer.
- Event loop is pumped in callbacks via `qApp->processEvents()`, allowing the abort slot to be delivered.
