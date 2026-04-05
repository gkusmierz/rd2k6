---
artifact: LIB
class: RDAudioInfo
sources:
  - lib/rdaudioinfo.h
  - lib/rdaudioinfo.cpp
phase: 2-inventory
status: done
agent: PHASE-2-inventory-subagent
date: 2026-04-05
---

# RDAudioInfo -- Inventory

## 1. Identity

| Property | Value |
|----------|-------|
| Class | `RDAudioInfo` |
| Inherits | `QObject` |
| Header | `lib/rdaudioinfo.h` |
| Implementation | `lib/rdaudioinfo.cpp` |
| Q_OBJECT | Yes |
| Signals | None |
| Slots | None |

## 2. Purpose

Remote service client that retrieves audio metadata (format, channels, sample rate, bit rate, frame count, length) for a specific cart/cut from the Rivendell web service (RDXport). Sends an HTTP POST request, then parses the XML response to populate audio info properties. No local audio file access -- all data comes from the server.

## 3. Constructor

```
RDAudioInfo(QObject *parent = 0)
```

Lightweight constructor -- no station/config injection. Uses the global `rda` application object at runtime to obtain station and config references.

Initializes: cart/cut to 0, format to `RDWaveFile::Pcm16`, all numeric properties to 0.

## 4. Enum: ErrorCode

| Value | Int | Meaning |
|-------|-----|---------|
| `ErrorOk` | 0 | Operation successful |
| `ErrorInternal` | 5 | Internal/CURL error |
| `ErrorUrlInvalid` | 7 | Cannot reach the server |
| `ErrorService` | 8 | RDXport returned unexpected HTTP status |
| `ErrorInvalidUser` | 9 | Invalid credentials (declared but not returned by runInfo) |
| `ErrorNoAudio` | 10 | HTTP 404 -- audio not found |

## 5. Public Methods

### Setters

| Method | Signature | Behavior |
|--------|-----------|----------|
| `setCartNumber` | `void setCartNumber(unsigned cartnum)` | Sets cart number for info request |
| `setCutNumber` | `void setCutNumber(unsigned cutnum)` | Sets cut number for info request |

### Getters (populated after successful runInfo)

| Method | Returns | Description |
|--------|---------|-------------|
| `format()` | `RDWaveFile::Format` | Audio encoding format (PCM16, etc.) |
| `channels()` | `unsigned` | Number of audio channels |
| `sampleRate()` | `unsigned` | Sample rate in Hz |
| `bitRate()` | `unsigned` | Bit rate |
| `frames()` | `unsigned` | Total frame count |
| `length()` | `unsigned` | Audio length in ms |

### Core Operation

| Method | Signature | Behavior |
|--------|-----------|----------|
| `runInfo` | `ErrorCode runInfo(const QString &username, const QString &password)` | Executes the audio info request. Posts COMMAND=RDXPORT_COMMAND_AUDIOINFO with LOGIN_NAME, PASSWORD, CART_NUMBER, CUT_NUMBER to the station's web service URL via CURL. On HTTP 200, parses XML to extract: format, channels, sampleRate, bitRate, frames, length. Returns ErrorCode. |
| `errorText` | `static QString errorText(ErrorCode err)` | Translatable human-readable error message. |

## 6. Private Methods

| Method | Signature | Behavior |
|--------|-----------|----------|
| `ParseInt` | `int ParseInt(const QString &tag, const QString &xml)` | Ad-hoc XML parser extracting integer value of a named tag. Returns -1 if tag not found. |

## 7. Web Service Contract

- **Endpoint**: `rda->station()->webServiceUrl(rda->config())` (global app object)
- **Method**: HTTP POST (multipart form)
- **Command**: `RDXPORT_COMMAND_AUDIOINFO`
- **Request fields**: LOGIN_NAME, PASSWORD, CART_NUMBER, CUT_NUMBER
- **Response XML tags**: `format`, `channels`, `sampleRate`, `bitRate`, `frames`, `length`
- **HTTP 200**: success, parse XML
- **HTTP 404**: no audio for that cart/cut

## 8. State

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `conv_cart_number` | `unsigned` | 0 | Target cart number |
| `conv_cut_number` | `unsigned` | 0 | Target cut number |
| `conv_format` | `RDWaveFile::Format` | Pcm16 | Audio format |
| `conv_channels` | `unsigned` | 0 | Channel count |
| `conv_sample_rate` | `unsigned` | 0 | Sample rate (Hz) |
| `conv_bit_rate` | `unsigned` | 0 | Bit rate |
| `conv_frames` | `unsigned` | 0 | Frame count |
| `conv_length` | `unsigned` | 0 | Length in ms |
| `conv_xml` | `QString` | "" | Raw XML response buffer |

## 9. SQL / DB

None. This class does not interact with the database directly.

## 10. Signals & Slots

None.

## 11. Design Notes

- Unlike RDTrimAudio and RDAudioStore, this class does NOT take RDStation/RDConfig in the constructor. Instead it accesses the global `rda` singleton at runtime (`rda->station()`, `rda->config()`).
