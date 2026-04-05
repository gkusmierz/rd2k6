# inv-019 — RDAudioImport

**Plik H:** `lib/rdaudioimport.h`
**Plik CPP:** `lib/rdaudioimport.cpp`
**Klasa bazowa:** `QObject`
**Rola:** Client-side proxy for importing audio files into the Rivendell system via the RDXport web service (HTTP multipart POST using libcurl).

---

## Opis

RDAudioImport uploads a local audio file to the RDXport web service endpoint, targeting a specific cart/cut destination. The server-side service handles actual audio conversion and storage. The class supports cooperative abort (checked during upload progress callbacks) and translates HTTP response codes and CURL errors into a typed error code enum.

The class does NOT perform any local audio conversion or database access. It is purely an HTTP upload client.

---

## Enum: ErrorCode

| Wartość | Nazwa | Znaczenie |
|---------|-------|-----------|
| 0 | ErrorOk | Operation completed successfully |
| 1 | ErrorInvalidSettings | Invalid or unsupported audio parameters |
| 2 | ErrorNoSource | No such cart/cut |
| 3 | ErrorNoDestination | Unable to create destination file (HTTP 404) |
| 5 | ErrorInternal | Internal error (CURL failures, timeouts, OOM) |
| 7 | ErrorUrlInvalid | Malformed URL or host unreachable |
| 8 | ErrorService | RDXport service returned an error (HTTP 400) |
| 9 | ErrorInvalidUser | Invalid user or password (HTTP 401) |
| 10 | ErrorAborted | Upload aborted by user |
| 11 | ErrorConverter | Server-side audio converter error (detail from RDAudioConvert::ErrorCode) |

---

## Konstruktor

| Sygnatura | Opis |
|-----------|------|
| `RDAudioImport(QObject *parent = 0)` | Initializes all fields to defaults (cart=0, cut=0, settings=NULL, use_metadata=false, aborting=false) |

---

## Metody publiczne

| Metoda | Sygnatura | Opis |
|--------|-----------|------|
| `setCartNumber` | `void setCartNumber(unsigned cartnum)` | Sets the destination cart number for the import |
| `setCutNumber` | `void setCutNumber(unsigned cutnum)` | Sets the destination cut number for the import |
| `setSourceFile` | `void setSourceFile(const QString &filename)` | Sets the local file path of the audio file to upload |
| `setUseMetadata` | `void setUseMetadata(bool state)` | Controls whether embedded audio metadata should be extracted and applied |
| `setDestinationSettings` | `void setDestinationSettings(RDSettings *settings)` | Sets audio conversion parameters (channels, normalization level, autotrim level) via an RDSettings object |
| `runImport` | `ErrorCode runImport(const QString &username, const QString &password, RDAudioConvert::ErrorCode *conv_err)` | Executes the import operation — builds a multipart HTTP POST with all parameters and the source file, sends it to the station's web service URL via libcurl. Returns ErrorCode. On ErrorConverter, writes converter error detail into conv_err out-parameter. |
| `aborting` | `bool aborting() const` | Returns whether an abort has been requested |
| `errorText` | `static QString errorText(ErrorCode err, RDAudioConvert::ErrorCode conv_err)` | Translates error code pair into a human-readable, translatable (tr()) string |

---

## Sloty publiczne

| Slot | Sygnatura | Opis |
|------|-----------|------|
| `abort` | `void abort()` | Sets the aborting flag; checked during CURL progress callbacks to cancel an in-progress upload |

---

## Sygnaly

Brak. Klasa nie emituje sygnałów.

---

## Pola prywatne

| Pole | Typ | Opis |
|------|-----|------|
| `conv_cart_number` | `unsigned` | Destination cart number |
| `conv_cut_number` | `unsigned` | Destination cut number |
| `conv_src_filename` | `QString` | Local path to source audio file |
| `conv_settings` | `RDSettings*` | Audio conversion parameters (channels, normalization, autotrim) |
| `conv_use_metadata` | `bool` | Whether to use embedded metadata from audio file |
| `conv_aborting` | `bool` | Cooperative abort flag |

---

## Zależności

| Zależność | Typ | Rola |
|-----------|-----|------|
| `QObject` | Klasa bazowa | Qt object lifecycle, tr() support |
| `RDSettings` | Composition (pointer) | Carries audio conversion parameters (channels, normalization level, autotrim level) |
| `RDAudioConvert::ErrorCode` | Enum (external) | Used as out-parameter and in error text generation for server-side converter errors |
| `RDWebResult` | Utility | Parses XML response from the web service to extract converter error codes |
| `RDApplication (rda)` | Global singleton | Provides station web service URL and user agent string via `rda->station()->webServiceUrl()` and `rda->config()->userAgent()` |
| `libcurl` | External library | HTTP multipart POST transport layer |
| `RDXPORT_COMMAND_IMPORT` | Constant (from rdxport_interface.h) | Command identifier sent in the POST to indicate an import operation |

---

## Protokol HTTP (runImport)

**Transport:** HTTP multipart POST via libcurl
**Endpoint:** Station's web service URL (`rda->station()->webServiceUrl()`)
**Timeout:** `RD_CURL_TIMEOUT`

### Pola POST (multipart/form-data)

| Nazwa pola | Wartość |
|------------|---------|
| COMMAND | RDXPORT_COMMAND_IMPORT (numeric) |
| LOGIN_NAME | username parameter |
| PASSWORD | password parameter |
| CART_NUMBER | Destination cart number |
| CUT_NUMBER | Destination cut number |
| CHANNELS | From RDSettings::channels() |
| NORMALIZATION_LEVEL | From RDSettings::normalizationLevel() |
| AUTOTRIM_LEVEL | From RDSettings::autotrimLevel() |
| USE_METADATA | Boolean as numeric |
| FILENAME | Source file (uploaded as file attachment) |

### Mapowanie odpowiedzi HTTP

| HTTP Code | ErrorCode |
|-----------|-----------|
| 200 | ErrorOk |
| 400 | ErrorService |
| 401 | ErrorInvalidUser |
| 404 | ErrorNoDestination |
| other | ErrorConverter |

### Abort mechanism

During upload, libcurl calls `ImportProgressCallback` which invokes `qApp->processEvents()` (keeping the UI responsive) and checks `aborting()`. If true, returns 1 to abort the CURL transfer (results in `CURLE_ABORTED_BY_CALLBACK`).

---

## SQL

Brak. Klasa nie wykonuje żadnych operacji na bazie danych.

---

## Linux-specific

- Includes `syslog.h`, `sys/types.h`, `sys/stat.h`, `fcntl.h`, `unistd.h` (POSIX headers; not actively used in current code, likely legacy includes)
- Uses `qApp->processEvents()` in CURL progress callback to keep UI responsive during blocking upload

---

## Wzorce / obserwacje

- **Cooperative cancellation pattern:** abort() sets a flag checked via CURL progress callback, no signals involved.
- **No signals emitted:** Despite being a QObject, the class has no signals. Communication is purely synchronous via return values.
- **Blocking call:** `runImport()` is synchronous and blocking (libcurl performs transfer inline). UI responsiveness is maintained only through `processEvents()` in the progress callback.
- **Server-side conversion:** All audio format conversion happens server-side. This class only uploads the raw source file with desired target parameters.
