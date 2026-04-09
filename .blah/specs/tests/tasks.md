# Tasks

## Task 1: Test Infrastructure Foundation

**Requirements:** 13
**Components:** TestInitializer
**Priority:** P0 (all other tasks depend on this)

### Description

Create the test infrastructure foundation: directory structure, QMake build configuration, and the TestInitializer component that provides standardized initialization across three modes (full application, legacy config, standalone).

### Subtasks

1.1. Create test directory structure following steering conventions:
  - `tests/unit/domain/` -- pure C++ domain tests (no Qt dependency)
  - `tests/unit/adapters/` -- adapter tests with mock ports
  - `tests/integration/` -- multi-layer tests with real adapters
  - `tests/fixtures/` -- shared test data files (audio, text)

1.2. Create QMake build configuration:
  - `tests/tests.pro` with SUBDIRS template
  - `tests/unit/domain/domain_tests.pro` -- links domain library only, `QT -= core gui`
  - `tests/unit/adapters/adapter_tests.pro` -- links Qt Test + adapters
  - `tests/integration/integration_tests.pro` -- links Qt Test + all layers

1.3. Implement `TestInitializer` class:
  - `initializeFull(testName)` -- bootstrap full application context with in-memory SQLite database
  - `initializeLegacy(configPath)` -- load configuration file and open database connection
  - `initializeStandalone()` -- minimal setup, no database, no configuration
  - `teardown()` -- clean shutdown, close database, release resources
  - Each mode returns a `TestContext` struct with access to initialized services

1.4. Implement `TestArgumentParser` utility wrapping the standard argument parser for test-specific switches.

1.5. Copy test data files to `tests/fixtures/`:
  - `rivendell_standard.txt`
  - `visualtraffic.txt`
  - Generate minimal test audio files (short sine wave in PCM16 WAV format)

### Acceptance Criteria Verified
- 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7

---

## Task 2: Audio Processing Tests -- Conversion

**Requirements:** 1
**Components:** AudioProcessingTests (conversion subset)
**Priority:** P0

### Description

Implement audio format conversion tests validating all supported format pairs and input parameter validation.

### Subtasks

2.1. Create `tests/integration/test_audio_convert.cpp` using Qt Test framework.

2.2. Implement conversion tests for each supported format:
  - PCM16 to/from MPEG Layer 2
  - PCM16 to/from MPEG Layer 3
  - PCM16 to/from FLAC
  - PCM16 to/from Ogg Vorbis
  - PCM24 to/from supported formats
  - Use data-driven tests (`_data()` pattern) for format matrix

2.3. Implement validation tests:
  - Cart number = 0 --> validation error
  - Cart number > 999999 --> validation error
  - Normalization level > 0 --> validation error
  - Speed ratio <= 0 --> validation error
  - Bit rate AND quality both set --> mutually exclusive error
  - Unsupported format --> validation error
  - Metadata cart exceeds max or does not exist --> validation error

### Acceptance Criteria Verified
- 1.1, 1.8, 1.10, 1.13, 1.14

---

## Task 3: Audio Processing Tests -- Import and Export

**Requirements:** 1
**Components:** AudioProcessingTests (import/export subset)
**Priority:** P0

### Description

Implement audio import and export tests validating file operations and parameter constraints.

### Subtasks

3.1. Create `tests/integration/test_audio_import.cpp` using Qt Test framework.

3.2. Implement import tests:
  - Import PCM WAV file into cart/cut
  - Import with normalization (valid negative level)
  - Import with autotrim (valid negative level)
  - Verify imported metadata matches source

3.3. Implement import validation tests:
  - Cart number out of range --> validation error
  - Cut number out of range --> validation error
  - Normalization level > 0 --> validation error
  - Autotrim level > 0 --> validation error

3.4. Create `tests/integration/test_audio_export.cpp` using Qt Test framework.

3.5. Implement export tests:
  - Export cart/cut to PCM WAV file
  - Export with format conversion
  - Verify exported file is valid audio

3.6. Implement export validation tests:
  - Cart number out of range --> validation error
  - Cut number out of range --> validation error
  - Bit rate AND quality both set --> mutually exclusive error
  - Unsupported format --> validation error

### Acceptance Criteria Verified
- 1.2, 1.3, 1.8, 1.9, 1.10, 1.11, 1.12, 1.14

---

## Task 4: Audio Processing Tests -- Metadata, Peaks, and WAV Parsing

**Requirements:** 1
**Components:** AudioProcessingTests (metadata/peaks/wav subset)
**Priority:** P1

### Description

Implement tests for audio metadata reading, peaks/energy data, wave file basic operations, and RIFF chunk parsing.

### Subtasks

4.1. Create `tests/unit/adapters/test_audio_metadata.cpp`:
  - Read metadata from PCM WAV test file
  - Read metadata from MPEG test file (if available)
  - Verify all standard metadata fields are populated

4.2. Create `tests/unit/adapters/test_audio_peaks.cpp`:
  - Read peaks/energy data from test audio file
  - Verify peaks data structure is valid

4.3. Create `tests/unit/adapters/test_wave_file.cpp`:
  - Open valid WAV file and verify properties (sample rate, channels, bit depth)
  - Attempt to open nonexistent file --> file access error

4.4. Create `tests/unit/adapters/test_wav_chunk.cpp`:
  - Parse RIFF chunks from WAV file
  - Verify expected chunks are present (RIFF, fmt, data at minimum)
  - Report chunk identifiers and sizes

### Acceptance Criteria Verified
- 1.4, 1.5, 1.6, 1.7, 1.15

---

## Task 5: File Transfer Tests

**Requirements:** 2
**Components:** FileTransferTests
**Priority:** P1

### Description

Implement upload, download, and delete tests against local filesystem or mock endpoints.

### Subtasks

5.1. Create `tests/integration/test_file_upload.cpp`:
  - Upload file to local file:// destination
  - Verify destination file matches source

5.2. Create `tests/integration/test_file_download.cpp`:
  - Download file from local file:// source
  - Verify downloaded file matches source

5.3. Create `tests/integration/test_file_delete.cpp`:
  - Delete file via local file:// URL
  - Verify file no longer exists
  - Invalid/relative URL --> validation error

### Acceptance Criteria Verified
- 2.1, 2.2, 2.3, 2.4

---

## Task 6: Date and Time Tests

**Requirements:** 3
**Components:** DateTimeTests
**Priority:** P1

### Description

Implement date/time parsing and formatting tests for RFC 822, XML, and auto-detect modes.

### Subtasks

6.1. Create `tests/unit/domain/test_date_parse.cpp`:
  - Parse RFC 822 datetime strings (various valid formats)
  - Parse XML datetime strings
  - Auto-detect format and parse
  - Parse XML time strings
  - Mutual exclusivity: datetime + time specified --> error

6.2. Create `tests/unit/domain/test_date_format.cpp`:
  - Format date as XML date string
  - Format time as XML time string
  - Format datetime as XML datetime string
  - Format datetime as RFC 822 datetime string
  - Use data-driven tests for format/print-type matrix

6.3. Create `tests/unit/domain/test_date_decode.cpp`:
  - Decode date with format pattern
  - Decode datetime with format pattern
  - Verify decoded output matches expected human-readable string

### Acceptance Criteria Verified
- 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9

---

## Task 7: String Encoding and XML Tests

**Requirements:** 4
**Components:** StringEncodingTests
**Priority:** P1

### Description

Implement string encoding/decoding and XML parsing tests.

### Subtasks

7.1. Create `tests/unit/domain/test_string_encoding.cpp`:
  - XML escape: special characters (&, <, >, ", ') are properly escaped
  - XML unescape: escaped sequences are restored
  - URL escape: reserved characters are percent-encoded
  - URL unescape: percent-encoded sequences are restored
  - Round-trip: escape then unescape returns original string

7.2. Create `tests/unit/domain/test_xml_parse.cpp`:
  - Parse valid XML document containing cart data
  - Verify reconstructed cart data matches expected values
  - Handle XML with various metadata fields

### Acceptance Criteria Verified
- 4.1, 4.2, 4.3, 4.4, 4.5

---

## Task 8: Cart and Log Management Tests

**Requirements:** 5
**Components:** CartLogTests
**Priority:** P1

### Description

Implement cart reservation, log unlink, and metadata wildcard resolution tests.

### Subtasks

8.1. Create `tests/integration/test_reserve_carts.cpp`:
  - Reserve carts in a valid group
  - Verify reserved cart numbers are within group range
  - Nonexistent group --> validation error

8.2. Create `tests/integration/test_log_unlink.cpp`:
  - Set up service with traffic/music import source
  - Trigger log unlink via IPC user change event (async)
  - Verify log is unlinked from source
  - Uses event loop with timeout for async completion

8.3. Create `tests/unit/domain/test_metadata_wildcard.cpp`:
  - Resolve wildcard tokens in log line text
  - Verify all standard wildcards are expanded
  - Handle log lines with no wildcards (passthrough)

### Acceptance Criteria Verified
- 5.1, 5.2, 5.3, 5.4

---

## Task 9: Networking and IPC Tests

**Requirements:** 6
**Components:** NetworkingTests
**Priority:** P2

### Description

Implement multicast receive and notification delivery tests using asynchronous event-driven patterns.

### Subtasks

9.1. Create `tests/integration/test_multicast_recv.cpp`:
  - Set up multicast receiver on localhost
  - Send test multicast packet
  - Verify received data matches sent data and sender address is correct
  - Port = 0 --> validation error
  - Port >= 65536 --> validation error
  - Uses event loop with timeout

9.2. Create `tests/integration/test_notification.cpp`:
  - Connect to IPC service (mock)
  - Subscribe to notifications
  - Trigger test notification
  - Verify notification event is received with correct data
  - Uses event loop with timeout

### Acceptance Criteria Verified
- 6.1, 6.2, 6.3

---

## Task 10: Feed Image Management Tests

**Requirements:** 7
**Components:** FeedTests
**Priority:** P2

### Description

Implement podcast feed image list, push, and pop operations.

### Subtasks

10.1. Create `tests/integration/test_feed_image.cpp`:
  - Push image to feed (store in database)
  - List images for feed (verify pushed image appears)
  - Pop image from feed (retrieve binary data, verify matches original)
  - Full cycle: push --> list --> pop
  - Nonexistent feed --> validation error
  - Multiple commands specified --> mutual exclusivity error

### Acceptance Criteria Verified
- 7.1, 7.2, 7.3, 7.4, 7.5

---

## Task 11: Utility Tests

**Requirements:** 8
**Components:** UtilityTests
**Priority:** P2

### Description

Implement command-line parser, process ID lookup, file hashing, and timer accuracy tests.

### Subtasks

11.1. Create `tests/unit/domain/test_cmdline_parser.cpp`:
  - Parse known switches with values
  - Parse boolean flags
  - Detect missing required arguments --> error
  - Detect unknown options --> error

11.2. Create `tests/unit/domain/test_getpids.cpp`:
  - Look up process IDs for a known process name
  - Handle nonexistent process name (empty result)

11.3. Create `tests/unit/domain/test_hash.cpp`:
  - Compute SHA-1 hash of test file
  - Verify against known hash digest
  - Handle nonexistent file --> error

11.4. Create `tests/integration/test_timer.cpp`:
  - Start periodic timer with known interval
  - Measure actual callback intervals
  - Verify accuracy is within acceptable tolerance
  - Uses event loop with multiple timer callbacks

### Acceptance Criteria Verified
- 8.1, 8.2, 8.3, 8.4, 8.5, 8.6

---

## Task 12: Authentication Tests

**Requirements:** 9
**Components:** AuthenticationTests
**Priority:** P2

### Description

Implement PAM authentication conversation tests.

### Subtasks

12.1. Create `tests/integration/test_pam_auth.cpp`:
  - Test authentication with valid credentials (mock PAM)
  - Test password prompt response (echo off)
  - Test text prompt response (echo on)
  - Test error message display
  - Verify conversation callback dispatches correctly by prompt type

### Acceptance Criteria Verified
- 9.1, 9.2, 9.3, 9.4

---

## Task 13: Database Integrity Tests

**Requirements:** 10
**Components:** DatabaseTests
**Priority:** P2

### Description

Implement database character set and collation verification tests.

### Subtasks

13.1. Create `tests/integration/test_db_charset.cpp`:
  - Query database character set configuration
  - Verify character set is UTF-8 compatible
  - Query collation configuration
  - Verify collation is appropriate for multilingual content

### Acceptance Criteria Verified
- 10.1, 10.2

---

## Task 14: Email and Disc Tests

**Requirements:** 11, 12
**Components:** EmailTests, DiscTests
**Priority:** P2

### Description

Implement email sending and CD/disc reading tests.

### Subtasks

14.1. Create `tests/integration/test_sendmail.cpp`:
  - Send email with recipient, subject, and body text
  - Verify send operation reports success
  - Body text + body file both specified --> mutual exclusivity error

14.2. Create `tests/unit/domain/test_readcd.cpp`:
  - Validate ISRC code format (valid codes pass, invalid codes fail)
  - Note: actual CD hardware reading requires physical device; use mock disc adapter for CI

### Acceptance Criteria Verified
- 11.1, 11.2, 12.1, 12.2

---

## Dependency Order

```
Task 1 (Infrastructure) --> all other tasks
Tasks 2, 3 (Audio core) --> Task 4 (Audio metadata/peaks)
Tasks 2-8 can proceed in parallel after Task 1
Tasks 9-14 can proceed in parallel after Task 1
```

## Summary

| Task | Title | Priority | Requirements | Est. Complexity |
|------|-------|----------|--------------|-----------------|
| 1 | Test Infrastructure Foundation | P0 | 13 | Medium |
| 2 | Audio Conversion Tests | P0 | 1 | Medium |
| 3 | Audio Import/Export Tests | P0 | 1 | Medium |
| 4 | Audio Metadata/Peaks/WAV Tests | P1 | 1 | Low |
| 5 | File Transfer Tests | P1 | 2 | Low |
| 6 | Date/Time Tests | P1 | 3 | Medium |
| 7 | String Encoding/XML Tests | P1 | 4 | Low |
| 8 | Cart/Log Management Tests | P1 | 5 | Medium |
| 9 | Networking/IPC Tests | P2 | 6 | Medium |
| 10 | Feed Image Tests | P2 | 7 | Low |
| 11 | Utility Tests | P2 | 8 | Low |
| 12 | Authentication Tests | P2 | 9 | Low |
| 13 | Database Integrity Tests | P2 | 10 | Low |
| 14 | Email/Disc Tests | P2 | 11, 12 | Low |
