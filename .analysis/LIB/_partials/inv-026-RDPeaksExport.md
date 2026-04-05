# INV-026: RDPeaksExport

**Status:** done
**Agent:** PHASE-2-inventory-subagent
**Source files:** lib/rdpeaksexport.h, lib/rdpeaksexport.cpp

---

## 1. Class Overview

| Property | Value |
|----------|-------|
| Class | `RDPeaksExport` |
| Inherits | *(none)* |
| Q_OBJECT | No |
| Purpose | Exports peak (energy) data for a cart/cut from the RdXport web service and provides access to the resulting waveform energy array |

RDPeaksExport fetches audio peak/energy data from the server. After a successful export, callers can access the energy data frame-by-frame or in bulk. The data represents waveform amplitude levels used for visual display (waveform rendering).

---

## 2. Enums

### ErrorCode
| Value | Int | Meaning |
|-------|-----|---------|
| ErrorOk | 0 | Export succeeded |
| ErrorNoSource | 2 | Cart/cut does not exist |
| ErrorInternal | 5 | Internal/curl failure |
| ErrorUrlInvalid | 7 | Malformed URL or unreachable host |
| ErrorService | 8 | RdXport service error |
| ErrorInvalidUser | 9 | Invalid credentials (HTTP 403) |
| ErrorAborted | 10 | Operation aborted by callback |

---

## 3. Constructor / Destructor

```
RDPeaksExport(QObject *parent = 0)
~RDPeaksExport()
```
- Constructor: initializes energy data pointer to NULL, write pointer to 0.
- Destructor: frees the dynamically allocated energy data buffer.
- Note: does NOT require RDStation or RDConfig -- uses global `rda` singleton instead.

---

## 4. Public Methods

### Setters
| Method | Parameter | Description |
|--------|-----------|-------------|
| `setCartNumber(unsigned)` | cart number | Target cart for peak export |
| `setCutNumber(unsigned)` | cut number | Target cut for peak export |

### runExport
```
ErrorCode runExport(const QString &username, const QString &password)
```
- Sends HTTP POST to RdXport with COMMAND (RDXPORT_COMMAND_EXPORT_PEAKS), LOGIN_NAME, PASSWORD, CART_NUMBER, CUT_NUMBER.
- Response body (raw binary peak data) is accumulated into a dynamically growing buffer via `RDPeaksExportWrite` callback using `realloc()`.
- Uses global `rda->station()->webServiceUrl()` and `rda->config()->userAgent()`.
- HTTP 200 = success, 403 = invalid user, other = service error.

### energySize
```
unsigned energySize()
```
- Returns the number of energy frames received (total bytes / sizeof(unsigned short)).

### energy
```
unsigned short energy(unsigned frame)
```
- Returns the energy value at the specified frame index.
- No bounds checking.

### readEnergy
```
int readEnergy(unsigned short buf[], int count)
```
- Copies `count` energy frames into the provided buffer.
- Returns count (always copies exactly the requested amount).
- No bounds checking.

### errorText (static)
```
static QString errorText(ErrorCode err)
```
- Maps ErrorCode to translatable string.

---

## 5. Signals & Slots

None. Not a QObject (despite accepting QObject* parent in constructor).

---

## 6. Dependencies

| Dependency | Role |
|------------|------|
| `rda` (RDApplication singleton) | Provides station and config (web service URL, user agent) |
| `libcurl` | HTTP transport |
| `RdXport` | Server-side endpoint (RDXPORT_COMMAND_EXPORT_PEAKS) |

---

## 7. SQL / Database

No direct SQL. Peak data is fetched from the server via web service.

---

## 8. Behavioral Notes

- The energy data buffer grows dynamically via `realloc()` as the curl response streams in.
- Energy data is stored as raw `unsigned short` values -- binary format, not XML/JSON.
- The `RDPeaksExportWrite` callback is a friend function that directly writes into private members.
- Unlike RDCopyAudio/RDRehash, this class uses the `rda` global singleton for station/config instead of constructor-injected dependencies.
- No bounds checking on `energy()` and `readEnergy()` -- caller must use `energySize()` to stay within range.
- The class owns the energy buffer and frees it in the destructor.
