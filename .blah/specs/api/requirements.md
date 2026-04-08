# Requirements Document

## Introduction

The Web API Client Library (rivwebcapi) provides a programmatic interface for external applications to interact with the Rivendell radio automation system. It is a standalone client library that communicates with the Rivendell web service via HTTP POST requests. It wraps all web API operations into callable functions, handling HTTP communication, XML response parsing, and data serialization transparently. The library supports full CRUD operations on carts, cuts, audio files, logs, scheduler codes, and media publishing resources, as well as read-only access to groups, services, and system settings.

The library is consumed by third-party integrators and automation scripts that need to manage Rivendell resources without using the native GUI applications.

## Requirements

### Requirement 1: Cart Management

**Objective:** As an API consumer, I want to create, read, update, and delete carts through the web API, so that I can programmatically manage the cart library.

#### Acceptance Criteria

1. When a cart creation request is submitted with a group name, cart type, and optional cart number, the system shall create the cart on the server and return the populated cart record.
2. When a cart edit request is submitted with selective field updates, the system shall send only the fields marked for update and return the updated cart record.
3. When a cart removal request is submitted with a cart number, the system shall delete the cart on the server.
4. When a single cart query is submitted with a cart number, the system shall return the full cart record.
5. When a cart listing request is submitted with optional group name, text filter, and type filter, the system shall return all matching cart records and a total count.
6. When a cart query is submitted with the include-cuts option, the system shall return the cart record with all associated cut records embedded.
7. When a cart listing request is submitted with the include-cuts option, the system shall return all matching cart records with their associated cut records embedded.

### Requirement 2: Cut Management

**Objective:** As an API consumer, I want to create, read, update, and delete cuts within carts, so that I can manage individual audio segments.

#### Acceptance Criteria

1. When a cut creation request is submitted with a cart number, the system shall add a new cut to the specified cart and return the populated cut record.
2. When a cut edit request is submitted with selective field updates, the system shall send only the fields marked for update and return the updated cut record.
3. When a cut removal request is submitted with a cart number and cut number, the system shall delete the cut on the server.
4. When a single cut query is submitted with a cart number and cut number, the system shall return the full cut record.
5. When a cut listing request is submitted with a cart number, the system shall return all cut records for the specified cart and a total count.

### Requirement 3: Audio Operations

**Objective:** As an API consumer, I want to import, export, copy, delete, and analyze audio files, so that I can manage audio content programmatically.

#### Acceptance Criteria

1. When an audio import request is submitted with a cart number, cut number, audio file path, and processing parameters (channels, normalization level, autotrim level, metadata usage), the system shall upload the file to the server and return the import result including assigned cart and cut numbers.
2. When an audio export request is submitted with a cart number, cut number, output format parameters (format, channels, sample rate, bit rate, quality), and optional start/end points, the system shall download the audio to the specified local file path.
3. When an audio deletion request is submitted with a cart number and cut number, the system shall delete the audio file on the server.
4. When an audio copy request is submitted with source and destination cart/cut numbers, the system shall copy the audio file between the specified cuts on the server.
5. When an audio info request is submitted with a cart number and cut number, the system shall return the audio metadata including format, channels, sample rate, frame count, and duration.
6. When an audio store query is submitted, the system shall return the available and total storage capacity.
7. When a peak data export request is submitted with a cart number and cut number, the system shall download the peak data to the specified local file path.
8. When an audio trim request is submitted with a cart number, cut number, and trim level, the system shall calculate and return the start and end trim points.

### Requirement 4: Log Management

**Objective:** As an API consumer, I want to create, read, save, and delete program logs, so that I can manage broadcast schedules programmatically.

#### Acceptance Criteria

1. When a log creation request is submitted with a log name and service name, the system shall create a new empty log on the server.
2. When a log deletion request is submitted with a log name, the system shall delete the log on the server.
3. When a log save request is submitted with header values and an array of log line values, the system shall save the complete log content on the server.
4. When a log save request includes a log line with a transition type value, the system shall encode the integer value as the corresponding transition name (0 maps to "PLAY", 1 maps to "SEGUE", 2 maps to "STOP").
5. When a log content query is submitted with a log name, the system shall return all log line records and a total count.
6. When a log listing request is submitted with optional service name, log name filter, trackable flag, text filter, and recent flag, the system shall return all matching log records and a total count.

### Requirement 5: Scheduler Code Management

**Objective:** As an API consumer, I want to assign, unassign, and list scheduler codes, so that I can manage scheduling metadata for carts.

#### Acceptance Criteria

1. When a scheduler code assignment request is submitted with a cart number and code, the system shall assign the code to the specified cart on the server.
2. When a scheduler code unassignment request is submitted with a cart number and code, the system shall remove the code from the specified cart on the server.
3. When a scheduler code listing request is submitted, the system shall return all available scheduler codes and a total count.
4. When a cart scheduler code listing request is submitted with a cart number, the system shall return all codes assigned to the specified cart and a total count.

### Requirement 6: System Queries

**Objective:** As an API consumer, I want to query groups, services, and system settings, so that I can retrieve configuration data from the server.

#### Acceptance Criteria

1. When a single group query is submitted with a group name, the system shall return the group record including name, description, cart range limits, and configuration flags.
2. When a group listing request is submitted, the system shall return all group records and a total count.
3. When a service listing request is submitted with an optional trackable filter, the system shall return all matching service records and a total count.
4. When a system settings query is submitted, the system shall return the system configuration record including sample rate, duplicate title policy, maximum POST length, and temporary cart group.

### Requirement 7: Media Publishing

**Objective:** As an API consumer, I want to publish, upload, and remove podcasts, RSS feeds, and images, so that I can manage media distribution programmatically.

#### Acceptance Criteria

1. When a podcast publish request is submitted with a podcast identifier, the system shall publish the podcast on the server.
2. When a podcast file upload request is submitted with a podcast identifier and file path, the system shall upload the file to the server.
3. When a podcast deletion request is submitted with a podcast identifier, the system shall delete the podcast on the server.
4. When a podcast removal request is submitted with a podcast identifier, the system shall remove the podcast from the server.
5. When an RSS feed publish request is submitted with a feed identifier, the system shall publish the RSS feed on the server.
6. When an RSS feed removal request is submitted with a feed identifier, the system shall remove the RSS feed from the server.
7. When an image publish request is submitted with an image identifier, the system shall publish the image on the server.
8. When an image removal request is submitted with an image identifier, the system shall remove the image from the server.

### Requirement 8: Authentication

**Objective:** As an API consumer, I want to authenticate with the server and obtain session tickets, so that I can make authorized API calls.

#### Acceptance Criteria

1. The system shall require hostname, username, password, and ticket parameters for every API call.
2. When a ticket creation request is submitted with valid credentials, the system shall return a session ticket string and its expiration datetime.
3. The system shall include login name, password, and ticket in every HTTP POST request as form fields.

### Requirement 9: Error Handling and Communication

**Objective:** As an API consumer, I want consistent error reporting across all operations, so that I can handle failures predictably.

#### Acceptance Criteria

1. When an API call receives an HTTP response with a 2xx status code, the system shall return success (0) and populate the output data structures.
2. If an API call receives an HTTP response with a non-2xx status code, then the system shall return the HTTP status code as the error value.
3. If a network error occurs during an API call, then the system shall return -1.
4. Where debug output is enabled, the system shall log network error details to the standard error stream.
5. When a custom user agent string is provided, the system shall include it as the User-Agent header in the HTTP request.

### Requirement 10: Data Conversion Utilities

**Objective:** As an API consumer, I want data conversion and validation utilities, so that I can correctly format datetime values and time durations for API calls.

#### Acceptance Criteria

1. The system shall provide a function to convert a datetime string to a datetime structure.
2. The system shall provide a function to convert a datetime structure to a datetime string.
3. The system shall provide a function to convert a time string to milliseconds.
4. The system shall provide a function to convert milliseconds to a time string.
5. The system shall provide a function to validate a datetime structure.
6. The system shall provide a function to parse a boolean value from a string.
7. The system shall provide a function to retrieve the local timezone offset.
8. The system shall provide a function to return the library version.
9. The system shall provide a function to return the user agent information.
