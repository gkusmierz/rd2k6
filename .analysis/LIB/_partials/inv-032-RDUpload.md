# INV-032: RDUpload

- **partial_id:** 032
- **status:** done
- **agent:** PHASE-2-inventory-subagent
- **date:** 2026-04-05

## Class Overview

| Property | Value |
|----------|-------|
| Class | `RDUpload` |
| Inherits | `RDTransfer` (-> `QObject`) |
| Role | Uploads a local file to a remote or local URL destination |
| Q_OBJECT | Yes |
| Header | `lib/rdupload.h` |
| Source | `lib/rdupload.cpp` |

**Purpose:** Performs file uploads using libcurl. Supports file, ftp, ftps, and sftp protocols (notably NOT http/https -- upload is write-only protocols). Provides progress reporting, abort capability, and structured error codes. Synchronous (blocking) transfer with Qt event loop pumping during progress callbacks.

## Enum: ErrorCode

| Value | Int | Meaning |
|-------|-----|---------|
| `ErrorOk` | 0 | Transfer succeeded |
| `ErrorUnsupportedProtocol` | 1 | URL scheme not in supported list |
| `ErrorNoSource` | 2 | Unable to open source file for reading |
| `ErrorNoDestination` | 3 | Unable to create destination file |
| `ErrorInvalidHostname` | 4 | DNS resolution failed |
| `ErrorInternal` | 5 | curl initialization failed |
| `ErrorRemoteServer` | 6 | Remote server error |
| `ErrorUrlInvalid` | 7 | Malformed URL |
| `ErrorUnspecified` | 8 | Catch-all for unmapped curl errors |
| `ErrorInvalidUser` | 9 | Local file: transfer with invalid system user credentials |
| `ErrorAborted` | 10 | Transfer aborted by user |
| `ErrorInvalidLogin` | 11 | Remote login denied (wrong username/password) |
| `ErrorRemoteAccess` | 12 | Remote access denied (permissions) |
| `ErrorRemoteConnection` | 13 | Could not connect to remote server |

## Constructor

| Signature | Parameters | Behavior |
|-----------|------------|----------|
| `RDUpload(RDConfig *c, QObject *parent=0)` | `c` - system configuration; `parent` - QObject parent | Calls RDTransfer base. Initializes aborting flag to false. |

## Public Methods

| Method | Signature | Returns | Behavior |
|--------|-----------|---------|----------|
| `supportedSchemes` | `QStringList supportedSchemes() const` | `{"file","ftp","sftp","ftps"}` | Overrides pure virtual. No http/https -- upload only supports writable protocols. |
| `setSourceFile` | `void setSourceFile(const QString &filename)` | void | Sets local source file path. Also reads file size for progress tracking. |
| `setDestinationUrl` | `void setDestinationUrl(const QString &url)` | void | Sets the remote/local destination URL for the upload. |
| `totalSteps` | `int totalSteps() const` | int | Returns source file size (used for progress bar range). |
| `runUpload` | `ErrorCode runUpload(const QString &username, const QString &password, const QString &id_filename, bool use_id_filename, bool log_debug)` | ErrorCode | **Main operation.** Performs the synchronous upload. See behavioral notes below. |
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
| `UploadProgressCallback` | curl progress callback. Updates progress via `UpdateProgress()`, pumps Qt event loop via `qApp->processEvents()`, returns 1 (abort) if aborting flag is set. |
| `UploadErrorCallback` | curl debug callback. Logs curl debug messages to syslog at LOG_DEBUG level. Only processes CURLINFO_TEXT type. |

## Private State

| Field | Type | Purpose |
|-------|------|---------|
| `conv_src_filename` | `QString` | Local source file path |
| `conv_dst_url` | `QUrl` | Destination URL to upload to |
| `conv_aborting` | `bool` | Abort flag, checked during progress callbacks |
| `conv_src_size` | `uint` | Source file size (progress range and CURLOPT_INFILESIZE) |

## Dependencies

| Dependency | Role |
|------------|------|
| `RDTransfer` | Base class (URL validation, config access) |
| `libcurl` | FTP/SFTP transfer engine |
| `RDConfig` | System configuration (user agent string) |
| `RDSystemUser` | Local user credential validation for `file:` scheme |
| `RDApplication (rda)` | Syslog logging, config access |
| `QApplication` | Event loop pumping during transfer |

## Platform / Linux-Specific

- **`_XOPEN_SOURCE` define:** Defined before system headers for POSIX compliance.
- **`pwd.h` include:** Included for passwd struct access (user lookup).
- **UID/GID switching:** For `file:` scheme transfers when running as root (UID 0), validates the provided username/password against the local system user database (`RDSystemUser`). Temporarily switches effective UID/GID to that user for the file operation, then restores original UID/GID afterward.
- **System headers:** Uses `sys/types.h`, `sys/stat.h`, `unistd.h`, `fcntl.h`, `syslog.h`, `pwd.h` -- POSIX/Linux only.
- **syslog:** Error/debug logging goes to syslog via `rda->syslog()`.

## Behavioral Notes

### runUpload sequence:
1. Validates destination URL scheme against supported list.
2. For `file:` transfers running as root: validates local user credentials.
3. Initializes curl session; opens source file for reading.
4. Encodes URL (strips user info, encodes `#` as `%23`).
5. **Authentication strategy:**
   - SFTP with identity file: uses SSH private key + passphrase.
   - All other protocols: uses username:password pair.
6. Configures curl: upload mode, read from file, infilesize, timeout (`RD_CURL_TIMEOUT`), progress callback, user agent.
7. Optionally enables verbose curl debug logging.
8. Performs blocking transfer (curl_easy_perform) with event loop pumping in progress callbacks.
9. On success: `CURLE_OK` and `CURLE_PARTIAL_FILE` both treated as success (partial file is tolerated for upload).
10. Maps curl error codes to `ErrorCode` enum.
11. Restores UID/GID if switched; logs failure if debug enabled; cleans up curl and file handles.
12. Returns structured error code.

### Key differences from RDDownload:
- **Supported schemes:** No http/https (write-only protocols only).
- **curl mode:** Uses `CURLOPT_UPLOAD=1`, `CURLOPT_READDATA`, and `CURLOPT_INFILESIZE` instead of `CURLOPT_WRITEDATA`.
- **Partial file tolerance:** `CURLE_PARTIAL_FILE` treated as success (download treats it as error).
- **No HTTP response code check:** Upload does not check HTTP response codes (not applicable since no HTTP support).
- **Source file size:** Tracked for both progress reporting and curl's `INFILESIZE` option.
- **Extra headers:** `pwd.h` and `_XOPEN_SOURCE` for POSIX user lookup.

### Abort mechanism:
- Same as RDDownload: caller invokes `abort()` slot, progress callback checks flag, returns non-zero to curl.
- Event loop pumped via `qApp->processEvents()` to allow abort slot delivery.
