# Requirements Document

## Introduction

The Tests specification defines the requirements for the Rivendell test infrastructure -- a comprehensive suite of automated verification programs that validate the core library's functionality across all major domains. The test suite covers audio processing, file transfer, date/time handling, string encoding, cart/log management, networking, podcasting, authentication, database integrity, email, and system utilities.

The original test infrastructure consists of 28 standalone CLI test executables, each exercising specific library capabilities. This specification captures the behavioral requirements for a modernized test suite that validates the same functional domains using a proper test framework, structured assertions, and the project's hexagonal architecture.

## Requirements

### Requirement 1: Audio Processing Tests

**Objective:** As a developer, I want automated tests for audio format conversion, import, export, metadata reading, and waveform analysis, so that audio processing reliability is verified before deployment.

#### Acceptance Criteria

1. When an audio conversion test is executed with valid source format, destination format, and cart number, the test suite shall convert the audio and report the operation result.
2. When an audio export test is executed with a valid cart number and cut number, the test suite shall export audio from the cart/cut to a file and report the result.
3. When an audio import test is executed with a valid cart number, cut number, and source file, the test suite shall import the audio file into the cart/cut and report the result.
4. When an audio metadata test is executed with a valid audio file, the test suite shall read and display all metadata fields from the file.
5. When an audio peaks test is executed with a valid audio file, the test suite shall read and report energy/peaks data.
6. When a wave file test is executed with a valid file path, the test suite shall open the file and verify basic wave file properties.
7. When a WAV chunk parsing test is executed, the test suite shall iterate all RIFF chunks in the file and report chunk identifiers and sizes.
8. If the cart number is out of range (zero or greater than 999999), then the test suite shall reject the input with a validation error.
9. If the cut number is out of range (zero or greater than 999), then the test suite shall reject the input with a validation error.
10. If the normalization level is positive (above zero dB), then the test suite shall reject the input with a validation error.
11. If the autotrim level is positive (above zero dB), then the test suite shall reject the input with a validation error.
12. If both bit rate and quality are specified simultaneously, then the test suite shall reject the input as mutually exclusive parameters.
13. If the speed ratio is zero or negative, then the test suite shall reject the input with a validation error.
14. If the audio format is not in the supported format list (PCM16, PCM24, MPEG Layer 2, MPEG Layer 2 WAV, MPEG Layer 3, FLAC, Ogg Vorbis), then the test suite shall reject the input with a validation error.
15. If the input audio file cannot be opened, then the test suite shall report a file access error.

### Requirement 2: File Transfer Tests

**Objective:** As a developer, I want automated tests for file upload, download, and remote deletion operations, so that file transfer functionality is verified against real or simulated endpoints.

#### Acceptance Criteria

1. When an upload test is executed with a valid source file and destination URL, the test suite shall upload the file and report the operation result.
2. When a download test is executed with a valid source URL and destination path, the test suite shall download the file and report the operation result.
3. When a delete test is executed with a valid remote URL, the test suite shall delete the remote file and report the operation result.
4. If the URL is relative or invalid, then the test suite shall reject the input with a validation error.

### Requirement 3: Date and Time Tests

**Objective:** As a developer, I want automated tests for date/time parsing and formatting across multiple standards, so that date handling correctness is verified for broadcast scheduling.

#### Acceptance Criteria

1. When a date parsing test is executed with an RFC 822 formatted datetime string, the test suite shall parse it and display the resulting datetime value.
2. When a date parsing test is executed with an XML formatted datetime string, the test suite shall parse it and display the resulting datetime value.
3. When a date parsing test is executed with automatic format detection, the test suite shall detect the format, parse the string, and display the result.
4. When a date formatting test is executed with a print type of Date and XML format, the test suite shall produce a valid XML date string.
5. When a date formatting test is executed with a print type of Time and XML format, the test suite shall produce a valid XML time string.
6. When a date formatting test is executed with a print type of DateTime and XML format, the test suite shall produce a valid XML datetime string.
7. When a date formatting test is executed with a print type of DateTime and RFC 822 format, the test suite shall produce a valid RFC 822 datetime string.
8. When a date decode test is executed with a format pattern and a date value, the test suite shall decode the date into a human-readable string using the pattern.
9. If both datetime and time parsing modes are specified simultaneously, then the test suite shall reject the input as mutually exclusive.

### Requirement 4: String Encoding and XML Tests

**Objective:** As a developer, I want automated tests for XML escaping/unescaping and URL encoding/decoding, so that string encoding correctness is verified.

#### Acceptance Criteria

1. When an XML escape test is executed with a string containing special characters, the test suite shall produce properly escaped XML output.
2. When an XML unescape test is executed with an escaped XML string, the test suite shall restore the original string.
3. When a URL escape test is executed with a string containing reserved characters, the test suite shall produce properly encoded URL output.
4. When a URL unescape test is executed with an encoded URL string, the test suite shall restore the original string.
5. When an XML parsing test is executed with a valid XML document containing cart data, the test suite shall parse the XML and reconstruct the cart data structure.

### Requirement 5: Cart and Log Management Tests

**Objective:** As a developer, I want automated tests for cart reservation, log unlinking, and metadata wildcard resolution, so that cart/log management logic is verified.

#### Acceptance Criteria

1. When a cart reservation test is executed with a valid group name, the test suite shall reserve carts within that group and report the reserved cart numbers.
2. When a log unlink test is executed with a valid service name and log name, the test suite shall unlink the log from its traffic/music source and report the result.
3. When a metadata wildcard test is executed with a log line containing wildcard tokens, the test suite shall resolve all wildcards and display the expanded string.
4. If the specified group does not exist, then the test suite shall report a validation error.

### Requirement 6: Networking and IPC Tests

**Objective:** As a developer, I want automated tests for multicast communication and inter-process notification delivery, so that distributed communication is verified.

#### Acceptance Criteria

1. When a multicast receive test is executed with a valid multicast address and port, the test suite shall listen for multicast data and display received messages with sender address.
2. When a notification test is executed, the test suite shall connect to the IPC service, subscribe to notifications, and display each received notification event.
3. If the multicast port is zero or greater than or equal to 65536, then the test suite shall reject the input with a validation error.

### Requirement 7: Podcast and Feed Management Tests

**Objective:** As a developer, I want automated tests for podcast feed image management (list, push, pop), so that feed operations are verified.

#### Acceptance Criteria

1. When a feed image list command is executed with a valid feed identifier, the test suite shall query stored images and display each image's identifier, dimensions, description, and filename.
2. When a feed image push command is executed with a valid feed identifier and image file, the test suite shall store the image in the feed's image storage and report success.
3. When a feed image pop command is executed with a valid feed identifier and image identifier, the test suite shall retrieve the image data and save it to the specified output path.
4. If the specified feed does not exist, then the test suite shall report a validation error.
5. If multiple commands (list, push, pop) are specified simultaneously, then the test suite shall reject the input as mutually exclusive.

### Requirement 8: Utility Tests

**Objective:** As a developer, I want automated tests for command-line parsing, process identification, file hashing, and timer accuracy, so that general utility functions are verified.

#### Acceptance Criteria

1. When a command-line parser test is executed with a set of arguments, the test suite shall parse the arguments and display recognized switches and their values.
2. When a process ID lookup test is executed with a process name, the test suite shall find matching process IDs and display them.
3. When a file hash test is executed with a valid file path, the test suite shall compute the SHA-1 hash and display the hex digest.
4. When a timer accuracy test is executed, the test suite shall start a periodic timer and measure the actual interval between callbacks, reporting the measured accuracy.
5. If a required argument is missing, then the test suite shall report a clear error identifying the missing argument.
6. If an unknown option is encountered, then the test suite shall report a clear error identifying the unknown option.

### Requirement 9: Authentication Tests

**Objective:** As a developer, I want automated tests for PAM-based user authentication, so that login security is verified.

#### Acceptance Criteria

1. When a PAM authentication test is executed with valid credentials, the test suite shall perform the authentication conversation and report the result.
2. When a PAM prompt of type password (echo off) is received, the test suite shall respond with the configured password.
3. When a PAM prompt of type text (echo on) is received, the test suite shall respond with the configured text.
4. When a PAM error message is received, the test suite shall display the error message.

### Requirement 10: Database Integrity Tests

**Objective:** As a developer, I want automated tests for database character set and collation configuration, so that database encoding correctness is verified.

#### Acceptance Criteria

1. When a database charset test is executed, the test suite shall query the database server's character set variables and display all character_set settings.
2. When a database charset test is executed, the test suite shall query the database server's collation variables and display all collation settings.

### Requirement 11: Email Tests

**Objective:** As a developer, I want automated tests for email sending, so that notification delivery is verified.

#### Acceptance Criteria

1. When an email send test is executed with recipient, subject, and body, the test suite shall send the email and report the result.
2. If both body text and body file are specified simultaneously, then the test suite shall reject the input as mutually exclusive.

### Requirement 12: CD/Disc Tests

**Objective:** As a developer, I want automated tests for CD disc reading and ISRC validation, so that physical media handling is verified.

#### Acceptance Criteria

1. When a CD read test is executed with a valid disc device, the test suite shall read the disc information and display track data.
2. When an ISRC validation test is executed with an ISRC code, the test suite shall validate the code format and report whether it is valid.

### Requirement 13: Test Infrastructure

**Objective:** As a developer, I want a consistent test infrastructure with standardized initialization, argument parsing, result reporting, and exit codes, so that all tests behave uniformly and can be run in automated pipelines.

#### Acceptance Criteria

1. The test suite shall use a standardized test framework with structured assertions for all test programs.
2. The test suite shall support three initialization modes: full application bootstrap (with database connection), legacy configuration loading (with database connection), and standalone (no database).
3. When a test completes successfully, the test suite shall exit with code 0.
4. When a test encounters a fatal validation error, the test suite shall exit with a non-zero exit code.
5. The test suite shall accept command-line arguments for test configuration using a standardized argument parser.
6. The test suite shall print all test results to standard output in a parseable format.
7. If the application bootstrap fails (database connection error, configuration error), then the test suite shall report the error and exit with a non-zero exit code.
