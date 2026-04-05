---
artifact: LIB
class: RDAudioStore
sources:
  - lib/rdaudiostore.h
  - lib/rdaudiostore.cpp
phase: 2-inventory
status: done
agent: PHASE-2-inventory-subagent
date: 2026-04-05
---

# RDAudioStore -- Inventory

## 1. Identity

| Property | Value |
|----------|-------|
| Class | `RDAudioStore` |
| Inherits | `QObject` |
| Header | `lib/rdaudiostore.h` |
| Implementation | `lib/rdaudiostore.cpp` |
| Q_OBJECT | Yes |
| Signals | None |
| Slots | None |

## 2. Purpose

Remote service client that queries the Rivendell web service (RDXport) for audio storage capacity information. Returns total and free bytes available on the audio store. No cart/cut targeting -- this is a system-level storage query.

## 3. Constructor

```
RDAudioStore(RDStation *station, RDConfig *config, QObject *parent = 0)
```

Dependencies injected:
- **RDStation** -- provides the web service URL
- **RDConfig** -- provides user agent string

Initializes free and total bytes to 0.

## 4. Enum: ErrorCode

| Value | Int | Meaning |
|-------|-----|---------|
| `ErrorOk` | 0 | Operation successful |
| `ErrorInternal` | 5 | Internal/CURL error |
| `ErrorUrlInvalid` | 7 | Cannot reach the server |
| `ErrorService` | 8 | RDXport returned unexpected HTTP status |
| `ErrorInvalidUser` | 9 | Invalid credentials (declared but not returned by runStore) |
| `ErrorNoAudio` | 10 | HTTP 404 |

## 5. Public Methods

### Getters (populated after successful runStore)

| Method | Returns | Description |
|--------|---------|-------------|
| `freeBytes()` | `uint64_t` | Free bytes available in audio storage |
| `totalBytes()` | `uint64_t` | Total bytes capacity of audio storage |

### Core Operation

| Method | Signature | Behavior |
|--------|-----------|----------|
| `runStore` | `ErrorCode runStore(const QString &username, const QString &password)` | Executes the storage info request. Posts COMMAND=RDXPORT_COMMAND_AUDIOSTORE with LOGIN_NAME, PASSWORD to the station's web service URL via CURL. On HTTP 200, parses XML to extract `freeBytes` and `totalBytes`. Returns ErrorCode. |
| `errorText` | `static QString errorText(ErrorCode err)` | Translatable human-readable error message. |

## 6. Private Methods

| Method | Signature | Behavior |
|--------|-----------|----------|
| `ParseInt` | `uint64_t ParseInt(const QString &tag, const QString &xml)` | Ad-hoc XML parser extracting uint64 value of a named tag. Returns -1 (wraps to max uint64) if tag not found. Uses `toLongLong()`. |

## 7. Web Service Contract

- **Endpoint**: `RDStation::webServiceUrl(RDConfig*)`
- **Method**: HTTP POST (multipart form)
- **Command**: `RDXPORT_COMMAND_AUDIOSTORE`
- **Request fields**: LOGIN_NAME, PASSWORD (no cart/cut -- system-level query)
- **Response XML tags**: `freeBytes`, `totalBytes` (uint64 values, bytes)
- **HTTP 200**: success, parse XML
- **HTTP 404**: no audio store info

## 8. State

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `conv_station` | `RDStation*` | ctor | Station providing web service URL |
| `conv_config` | `RDConfig*` | ctor | Configuration providing user agent |
| `conv_xml` | `QString` | "" | Raw XML response buffer |
| `conv_free_bytes` | `uint64_t` | 0 | Free storage bytes |
| `conv_total_bytes` | `uint64_t` | 0 | Total storage bytes |

## 9. SQL / DB

None. This class does not interact with the database directly.

## 10. Signals & Slots

None.

## 11. Design Notes

- Simplest of the three audio HTTP clients: no cart/cut parameters, only authentication.
- Uses `uint64_t` for byte counts (unlike RDAudioInfo which uses `int`/`unsigned` for its ParseInt).
