# INV-025: RDDelete

**Status:** done
**Agent:** PHASE-2-inventory-subagent
**Source files:** lib/rddelete.h, lib/rddelete.cpp

---

## 1. Class Overview

| Property | Value |
|----------|-------|
| Class | `RDDelete` |
| Inherits | `RDTransfer` (-> `QObject`) |
| Q_OBJECT | Yes |
| Purpose | Deletes a remote file from the audio store via multiple protocols (file, ftp, ftps, sftp) |

Unlike RDCopyAudio and RDRehash which delegate to the RdXport web service, RDDelete directly connects to remote file servers (FTP/SFTP) or the local filesystem to delete files. It supports protocol-specific delete commands.

---

## 2. Enums

### ErrorCode
| Value | Int | Meaning |
|-------|-----|---------|
| ErrorOk | 0 | Delete succeeded |
| ErrorUnsupportedProtocol | 1 | Protocol not supported by curl |
| ErrorInvalidHostname | 4 | Cannot resolve hostname |
| ErrorInternal | 5 | Internal error (curl init failure) |
| ErrorRemoteServer | 6 | Remote server error |
| ErrorUrlInvalid | 7 | Malformed URL |
| ErrorUnspecified | 8 | Unspecified error |
| ErrorInvalidUser | 9 | Invalid user |
| ErrorInvalidLogin | 11 | Login denied by server |
| ErrorRemoteAccess | 12 | Remote access denied |
| ErrorRemoteConnection | 13 | Cannot connect to remote host |
| ErrorUnknown | 14 | Unknown curl error |
| ErrorUnsupportedUrlScheme | 15 | URL scheme not in supported list |

---

## 3. Inheritance

```
QObject
  -> RDTransfer (provides: config(), supportedSchemes() virtual, urlIsSupported())
       -> RDDelete
```

RDTransfer is a base class for file transfer operations. It holds the RDConfig reference and provides URL scheme validation via `urlIsSupported()`.

---

## 4. Constructor

```
RDDelete(RDConfig *config, QObject *parent = 0)
```
- Passes config to RDTransfer base class.
- No station dependency (does not use RdXport web service).

---

## 5. Public Methods

### supportedSchemes
```
QStringList supportedSchemes() const
```
- Returns: `["file", "ftp", "sftp", "ftps"]`

### setTargetUrl
```
void setTargetUrl(const QString &url)
```
- Sets the URL of the file to delete.

### runDelete
```
ErrorCode runDelete(const QString &username, const QString &password,
                    const QString &id_filename, bool use_id_filename,
                    bool log_debug)
```
- Deletes the file at the configured target URL.
- **Protocol-specific behavior:**
  - `file://` -- Deletes locally via `unlink()`, no authentication.
  - `ftp://` / `ftps://` -- Sends FTP commands: `CWD` to directory, then `DELE` filename.
  - `sftp://` -- Sends `rm <path>` command. Supports SSH key authentication when `id_filename` is provided and `use_id_filename` is true.
- **Authentication:**
  - SFTP with key file: uses SSH private key + passphrase.
  - All other protocols: uses username:password via CURLOPT_USERPWD.
- **Tolerant error handling:** CURLE_REMOTE_ACCESS_DENIED, CURLE_QUOTE_ERROR, and CURLE_REMOTE_FILE_NOT_FOUND are all treated as success (file considered already gone).
- When `log_debug` is true, enables verbose curl output routed to syslog.

### errorText (static)
```
static QString errorText(ErrorCode err)
```
- Maps ErrorCode to translatable string.

---

## 6. Signals & Slots

None declared.

---

## 7. Dependencies

| Dependency | Role |
|------------|------|
| `RDTransfer` | Base class -- URL scheme validation, config access |
| `RDConfig` | Configuration (user agent) |
| `libcurl` | Multi-protocol file deletion (FTP, SFTP, FTPS) |
| `rda` (RDApplication singleton) | Syslog access for debug logging |

---

## 8. SQL / Database

No SQL. Operates exclusively on remote/local files.

---

## 9. Behavioral Notes

- This class does NOT use the RdXport web service -- it directly contacts file servers.
- URL scheme is validated against `supportedSchemes()` before attempting delete.
- FTP delete uses QUOTE commands (CWD + DELE), not CURLOPT_CUSTOMREQUEST.
- Error handling is lenient: "file not found" and "access denied" from FTP/SFTP are treated as success -- the intent is "ensure the file is gone."
- SFTP supports both password and SSH key authentication.
