# INV-023: RDCopyAudio

**Status:** done
**Agent:** PHASE-2-inventory-subagent
**Source files:** lib/rdcopyaudio.h, lib/rdcopyaudio.cpp

---

## 1. Class Overview

| Property | Value |
|----------|-------|
| Class | `RDCopyAudio` |
| Inherits | *(none)* |
| Q_OBJECT | No |
| Purpose | Copies audio data between cuts (source cart/cut -> destination cart/cut) via the RdXport web service |

RDCopyAudio is a simple, non-QObject utility class that delegates audio copy operations to the Rivendell web service (RdXport). It does not perform the copy locally -- it sends an HTTP POST request to the server which executes the actual copy.

---

## 2. Enums

### ErrorCode
| Value | Int | Meaning |
|-------|-----|---------|
| ErrorOk | 0 | Operation succeeded |
| ErrorNoCart | 1 | Referenced cart does not exist (HTTP 404) |
| ErrorInternal | 5 | Internal/curl failure (HTTP 400 or transport error) |
| ErrorUrlInvalid | 7 | Malformed URL or unreachable host |
| ErrorService | 8 | RdXport service returned unexpected HTTP status |
| ErrorInvalidUser | 9 | Invalid credentials |

---

## 3. Constructor

```
RDCopyAudio(RDStation *station, RDConfig *config)
```
- Requires station (provides web service URL) and config (provides user agent).
- Initializes source/destination cart/cut numbers to 0.

---

## 4. Public Methods

### Setters (configure the copy operation)
| Method | Parameter | Description |
|--------|-----------|-------------|
| `setSourceCartNumber(unsigned)` | cart number | Sets source cart to copy from |
| `setSourceCutNumber(unsigned)` | cut number | Sets source cut to copy from |
| `setDestinationCartNumber(unsigned)` | cart number | Sets destination cart to copy to |
| `setDestinationCutNumber(unsigned)` | cut number | Sets destination cut to copy to |

### runCopy
```
ErrorCode runCopy(const QString &username, const QString &password)
```
- Executes the copy operation via HTTP POST to the RdXport web service.
- Sends: COMMAND (RDXPORT_COMMAND_COPYAUDIO), LOGIN_NAME, PASSWORD, SOURCE_CART_NUMBER, SOURCE_CUT_NUMBER, DESTINATION_CART_NUMBER, DESTINATION_CUT_NUMBER.
- Returns ErrorCode based on curl transport result and HTTP response code.

### errorText (static)
```
static QString errorText(ErrorCode err)
```
- Maps ErrorCode enum to human-readable, translatable error string.

---

## 5. Signals & Slots

None. This class is not a QObject.

---

## 6. Dependencies

| Dependency | Role |
|------------|------|
| `RDStation` | Provides web service URL (`webServiceUrl()`) |
| `RDConfig` | Provides user agent string |
| `libcurl` | HTTP transport (POST multipart form) |
| `RdXport` | Server-side web service endpoint (RDXPORT_COMMAND_COPYAUDIO) |

---

## 7. SQL / Database

No direct SQL. All database operations happen server-side via the RdXport web service.

---

## 8. Behavioral Notes

- The class follows a configure-then-execute pattern: set source/destination, then call `runCopy()`.
- Authentication is passed per-call (username/password), not stored in the object.
- Uses `RD_CURL_TIMEOUT` for HTTP timeout.
- HTTP 200 = success, 404 = no cart, 400 = internal error, other = service error.
