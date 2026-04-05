# INV-024: RDRehash

**Status:** done
**Agent:** PHASE-2-inventory-subagent
**Source files:** lib/rdrehash.h, lib/rdrehash.cpp

---

## 1. Class Overview

| Property | Value |
|----------|-------|
| Class | `RDRehash` |
| Inherits | `QObject` |
| Q_OBJECT | Yes |
| Purpose | Generates a SHA-1 hash of an audio file and writes it to the database via the RdXport web service |

RDRehash triggers server-side recalculation of the SHA-1 hash for a specific cart/cut audio file. The hash is stored in the database by the server. The client only sends the command -- no local hashing occurs.

---

## 2. Enums

### ErrorCode
| Value | Int | Meaning |
|-------|-----|---------|
| ErrorOk | 0 | Operation succeeded |
| ErrorInternal | 5 | Internal/curl failure |
| ErrorUrlInvalid | 7 | Malformed URL or unreachable host |
| ErrorService | 8 | RdXport service returned unexpected status |
| ErrorInvalidUser | 9 | Invalid credentials |
| ErrorNoAudio | 10 | Audio file does not exist (HTTP 404) |

---

## 3. Constructor

```
RDRehash(RDStation *station, RDConfig *config, QObject *parent = 0)
```
- Requires station and config for web service access.
- Initializes cart/cut numbers to 0.

---

## 4. Public Methods

### Setters
| Method | Parameter | Description |
|--------|-----------|-------------|
| `setCartNumber(unsigned)` | cart number | Target cart for rehash |
| `setCutNumber(unsigned)` | cut number | Target cut for rehash |

### runRehash
```
ErrorCode runRehash(const QString &username, const QString &password)
```
- Sends HTTP POST to RdXport with COMMAND (RDXPORT_COMMAND_REHASH), LOGIN_NAME, PASSWORD, CART_NUMBER, CUT_NUMBER.
- Response body is discarded (no-op write callback).
- HTTP 200 = success, 404 = no audio, other = service error.

### rehash (static convenience)
```
static ErrorCode rehash(RDStation *station, RDUser *user, RDConfig *config,
                        unsigned cartnum, int cutnum)
```
- One-shot convenience method: creates a temporary RDRehash instance, configures it, runs the rehash using user's name/password, returns result.
- Simplifies call sites that have an RDUser object.

### errorText (static)
```
static QString errorText(ErrorCode err)
```
- Maps ErrorCode to translatable human-readable string.

---

## 5. Signals & Slots

None declared (Q_OBJECT macro present but no signals/slots defined).

---

## 6. Dependencies

| Dependency | Role |
|------------|------|
| `RDStation` | Provides web service URL |
| `RDConfig` | Provides user agent string |
| `RDUser` | Used by static `rehash()` convenience method for credentials |
| `libcurl` | HTTP transport |
| `RdXport` | Server-side endpoint (RDXPORT_COMMAND_REHASH) |

---

## 7. SQL / Database

No direct SQL. The hash computation and database write happen server-side via RdXport.

---

## 8. Behavioral Notes

- Same configure-then-execute pattern as RDCopyAudio.
- The static `rehash()` method provides a fire-and-forget API for callers that already have an RDUser.
- Uses a no-op CURL write callback (`__RDRehashCallback`) to discard response data.
- Logs curl errors to stderr on transport failure.
