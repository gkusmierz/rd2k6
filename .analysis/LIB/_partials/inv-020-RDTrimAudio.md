---
artifact: LIB
class: RDTrimAudio
sources:
  - lib/rdtrimaudio.h
  - lib/rdtrimaudio.cpp
phase: 2-inventory
status: done
agent: PHASE-2-inventory-subagent
date: 2026-04-05
---

# RDTrimAudio — Inventory

## 1. Identity

| Property | Value |
|----------|-------|
| Class | `RDTrimAudio` |
| Inherits | `QObject` |
| Header | `lib/rdtrimaudio.h` |
| Implementation | `lib/rdtrimaudio.cpp` |
| Q_OBJECT | Yes |
| Signals | None |
| Slots | None |

## 2. Purpose

Remote service client that requests audio silence-trim analysis for a specific cart/cut from the Rivendell web service (RDXport). Sends an HTTP POST with cart number, cut number, and trim level, then parses the XML response to extract the start and end trim points (milliseconds). Does not perform audio processing locally -- delegates entirely to the server.

## 3. Constructor

```
RDTrimAudio(RDStation *station, RDConfig *config, QObject *parent = 0)
```

Dependencies injected:
- **RDStation** -- provides the web service URL
- **RDConfig** -- provides user agent string

Initializes cart/cut to 0, start/end points to -1 (meaning "not yet computed").

## 4. Enum: ErrorCode

| Value | Int | Meaning |
|-------|-----|---------|
| `ErrorOk` | 0 | Operation successful |
| `ErrorInternal` | 5 | Internal/CURL error |
| `ErrorUrlInvalid` | 7 | Cannot reach the server (bad URL, DNS, connection refused) |
| `ErrorService` | 8 | RDXport returned non-200/non-404 HTTP status |
| `ErrorInvalidUser` | 9 | Invalid credentials (declared but not used in runTrim) |
| `ErrorNoAudio` | 10 | HTTP 404 -- audio not found |

## 5. Public Methods

### Setters

| Method | Signature | Behavior |
|--------|-----------|----------|
| `setCartNumber` | `void setCartNumber(unsigned cartnum)` | Sets cart number for trim request |
| `setCutNumber` | `void setCutNumber(unsigned cutnum)` | Sets cut number for trim request |
| `setTrimLevel` | `void setTrimLevel(int lvl)` | Sets trim threshold level |

### Getters

| Method | Returns | Behavior |
|--------|---------|----------|
| `startPoint()` | `int` | Start trim point in ms (-1 if not yet computed) |
| `endPoint()` | `int` | End trim point in ms (-1 if not yet computed) |

### Core Operation

| Method | Signature | Behavior |
|--------|-----------|----------|
| `runTrim` | `ErrorCode runTrim(const QString &username, const QString &password)` | Executes the trim analysis request. Posts COMMAND=RDXPORT_COMMAND_TRIMAUDIO with LOGIN_NAME, PASSWORD, CART_NUMBER, CUT_NUMBER, TRIM_LEVEL to the station's web service URL via CURL. On success (HTTP 200), parses XML response to extract `startTrimPoint` and `endTrimPoint`. Returns ErrorCode. |
| `errorText` | `static QString errorText(ErrorCode err)` | Translatable human-readable error message for a given error code. |

## 6. Private Methods

| Method | Signature | Behavior |
|--------|-----------|----------|
| `ParseXml` | `bool ParseXml(const QString &xml)` | Ad-hoc XML parser extracting `startTrimPoint` value. Returns true if found. |
| `ParsePoint` | `int ParsePoint(const QString &tag, const QString &xml)` | Ad-hoc XML parser extracting integer value of a named tag. Returns -1 if tag not found. |

## 7. Web Service Contract

- **Endpoint**: `RDStation::webServiceUrl(RDConfig*)`
- **Method**: HTTP POST (multipart form)
- **Command**: `RDXPORT_COMMAND_TRIMAUDIO`
- **Request fields**: LOGIN_NAME, PASSWORD, CART_NUMBER, CUT_NUMBER, TRIM_LEVEL
- **Response XML tags**: `startTrimPoint`, `endTrimPoint` (integer values, ms)
- **HTTP 200**: success, parse XML
- **HTTP 404**: no audio for that cart/cut

## 8. State

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `conv_station` | `RDStation*` | ctor | Station providing web service URL |
| `conv_config` | `RDConfig*` | ctor | Configuration providing user agent |
| `conv_cart_number` | `unsigned` | 0 | Target cart number |
| `conv_cut_number` | `unsigned` | 0 | Target cut number |
| `conv_trim_level` | `int` | - | Silence threshold level |
| `conv_start_point` | `int` | -1 | Computed start trim point (ms) |
| `conv_end_point` | `int` | -1 | Computed end trim point (ms) |
| `conv_xml` | `QString` | "" | Raw XML response buffer |

## 9. SQL / DB

None. This class does not interact with the database directly.

## 10. Signals & Slots

None.
