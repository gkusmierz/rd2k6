# RDAudioExport

- **Partial ID:** inv-018
- **Source files:** `lib/rdaudioexport.h`, `lib/rdaudioexport.cpp`
- **Base class:** QObject
- **Role:** Client-side proxy for exporting audio cuts from the Rivendell system via the RDXport web service. Converts a specified cart/cut to a destination file in the requested audio format by issuing an HTTP POST to the server.

---

## Enums

### ErrorCode
Describes the outcome of an export operation.

| Value | Name | Meaning |
|-------|------|---------|
| 0 | ErrorOk | Export completed successfully |
| 1 | ErrorInvalidSettings | Invalid or unsupported audio parameters |
| 2 | ErrorNoSource | Specified cart/cut does not exist |
| 3 | ErrorNoDestination | Unable to create destination file on disk |
| 5 | ErrorInternal | Internal error (libcurl init failure, HTTP errors, timeouts) |
| 7 | ErrorUrlInvalid | Malformed URL or server unreachable |
| 8 | ErrorService | RDXport service returned an application-level error |
| 9 | ErrorInvalidUser | Invalid username or password (HTTP 401) |
| 10 | ErrorAborted | Export was cancelled by user via abort() |
| 11 | ErrorConverter | Server-side audio converter error (detail from RDAudioConvert::ErrorCode) |

---

## Signals

| Signal | Description |
|--------|-------------|
| `strobe()` | Emitted during export to indicate progress (via libcurl progress callback). Allows UI to remain responsive. |

Note: The progress callback calls `qApp->processEvents()` and checks the abort flag each time libcurl reports progress. The `strobe()` signal is declared but the actual progress pumping happens through processEvents() in the callback.

---

## Public Slots

| Slot | Description |
|------|-------------|
| `abort()` | Sets the internal abort flag. The next libcurl progress callback will detect the flag and cancel the transfer. |

---

## Properties (get/set pairs)

| Property | Type | Description |
|----------|------|-------------|
| cartNumber | unsigned | Cart number identifying the source audio |
| cutNumber | unsigned | Cut number within the cart |
| destinationFile | QString | Local filesystem path for the exported audio file |
| destinationSettings | RDSettings* | Audio format settings (format, channels, sample rate, bit rate, quality, normalization level) |
| enableMetadata | bool | Whether to include metadata tags in the exported file |
| range (start_pt, end_pt) | int, int | Start and end points (in ms) to export; -1 means full range |

---

## Key Methods

### runExport(username, password, conv_err) -> ErrorCode
Performs the actual audio export operation.

**Behavior:**
1. Builds an HTTP POST with multipart form data containing: COMMAND (RDXPORT_COMMAND_EXPORT), credentials, cart/cut numbers, all audio settings (format, channels, sample rate, bit rate, quality, normalization level), range (start/end point), and metadata flag.
2. Sends the POST request to the station's web service URL (obtained from `rda->station()->webServiceUrl()`).
3. Writes the response body to the destination file.
4. Uses a progress callback that calls `qApp->processEvents()` and checks for abort requests.
5. On HTTP 200: returns ErrorOk.
6. On non-200: parses XML error response (via RDWebResult) to extract converter error code, then maps HTTP status to ErrorCode (400->ErrorService, 401->ErrorInvalidUser, 404->ErrorNoSource, other->ErrorConverter). Deletes the partial destination file.
7. On libcurl errors: maps to ErrorInternal, ErrorUrlInvalid, or ErrorAborted as appropriate.

**Out-parameter:** `conv_err` receives the RDAudioConvert::ErrorCode from the server response if the export fails with a converter error.

### errorText(err, conv_err) -> QString [static]
Returns a human-readable, translatable (tr()) error message for a given ErrorCode. For ErrorConverter, appends the converter-specific error text from RDAudioConvert::errorText().

### aborting() -> bool [const]
Returns the current state of the abort flag.

---

## Dependencies

| Dependency | Role |
|------------|------|
| RDSettings | Carries audio encoding parameters (format, channels, sample rate, bit rate, quality, normalization) |
| RDAudioConvert | Provides ErrorCode enum for server-side converter errors; provides errorText() for converter error messages |
| RDWebResult | Parses XML response from RDXport web service to extract converter error codes |
| libcurl | HTTP client used for the actual POST request to the web service |
| rda (global) | Accesses station config (web service URL) and user agent string |

---

## Linux-Specific

- Uses `unlink()` (POSIX) to delete partial destination files on error or abort.
- Uses `fopen()`/`fclose()` (C stdio) for writing the downloaded file.

---

## SQL

None. This class does not interact with the database directly. All data access is mediated through the RDXport HTTP web service.
