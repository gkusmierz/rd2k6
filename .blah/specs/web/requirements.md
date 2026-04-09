# Requirements Document

## Introduction

The Web API artifact provides the HTTP-based interface to the Rivendell radio automation system. It consists of two CGI services: (1) the primary REST-like API endpoint that handles all programmatic operations on carts, cuts, logs, groups, services, scheduler codes, podcasts, and system settings; and (2) a browser-based web application for simple audio download and upload. Both services authenticate every request, enforce granular permissions, and communicate with other system daemons for real-time change notifications. The Web API is the integration layer for external clients, remote automation tools, and the C API library.

## Requirements

### Requirement 1: Authentication and Session Management
**Objective:** As a system integrator, I want all API requests authenticated before processing, so that unauthorized access to the broadcast system is prevented.

#### Acceptance Criteria
1. When an HTTP POST request arrives without a valid authentication ticket or username/password credentials, the system shall reject the request with HTTP 403 and an "Invalid User" error response.
2. When a user authenticates with a valid username and password, the system shall create a new authentication ticket for subsequent requests without re-entering credentials.
3. When a user provides a valid authentication ticket, the system shall accept the request without requiring username and password.
4. If the CGI process cannot drop root privileges to the configured system user and group, then the system shall terminate with an HTTP 500 error.
5. If the process remains running as root after the privilege drop attempt, then the system shall terminate with an HTTP 500 error.
6. The system shall accept only HTTP POST requests for the API endpoint; non-POST requests shall be rejected with an "invalid web method" error.

### Requirement 2: Cart Management
**Objective:** As a content manager, I want to create, list, edit, and remove carts through the API, so that the media library can be managed remotely.

#### Acceptance Criteria
1. When a user with cart creation permission sends a create-cart request with a group name and type, the system shall create a new cart in the specified group and return the cart data.
2. When a user requests a list of carts, the system shall return cart data with optional filtering by group name, text filter, type, and whether to include cut details.
3. When a user requests a single cart by number, the system shall return the cart data with an option to include associated cuts.
4. When a user with cart modification permission sends an edit request with a cart number and updated fields, the system shall update the cart metadata and return the updated data.
5. When a user with cart deletion permission sends a remove request with a cart number, the system shall delete the cart and all associated data.
6. If a user does not have access to the cart's group, then the system shall return a 404 "No such cart" error to avoid revealing the cart's existence.
7. If a cart number is outside the allowed range for its group, then the system shall reject the operation with an appropriate error.
8. If the system disallows duplicate cart titles and a user attempts to set a title that already exists, then the system shall reject the operation with a "Duplicate Cart Title Not Allowed" error.
9. When editing a macro-type cart, if any macro line does not end with the macro terminator character, then the system shall reject the edit with an "Invalid macro data" error.
10. When a cart is created, modified, or deleted, the system shall publish a change notification event so that other connected components are informed in real time.

### Requirement 3: Cut Management
**Objective:** As a content manager, I want to create, list, edit, and remove cuts within carts, so that individual audio segments can be managed remotely.

#### Acceptance Criteria
1. When a user with audio editing permission sends an add-cut request with a cart number, the system shall create a new cut for that cart and return the cut data.
2. When a user requests all cuts for a cart, the system shall return the list of cuts.
3. When a user requests a specific cut by cart number and cut number, the system shall return the cut data.
4. When a user with audio editing permission sends an edit-cut request with updated fields, the system shall update the cut metadata and return the updated data.
5. When a user with cut removal permission sends a remove-cut request, the system shall delete the specified cut.
6. The system shall validate pointer values (start, end, segue, fade points) when editing a cut.

### Requirement 4: Audio Operations
**Objective:** As an audio engineer, I want to import, export, copy, and manage audio files through the API, so that audio content can be transferred to and from the system remotely.

#### Acceptance Criteria
1. When a user with audio editing permission sends an import request with an audio file, cart number, and cut number, the system shall import the audio file into the specified cut, applying the requested channel count, normalization level, and auto-trim settings.
2. Where cart creation is enabled in the import request, the system shall automatically create a new cart in the specified group before importing the audio.
3. When a user sends an export request with a cart number, cut number, and format parameters (format, channels, sample rate, bit rate, quality, start/end points, normalization), the system shall convert the audio and stream the binary result.
4. If the requested audio format is not supported, then the system shall return HTTP 415 with a format error message.
5. If the source audio file does not exist, then the system shall return HTTP 404.
6. When a user sends a delete-audio request, the system shall remove the audio file and associated energy data for the specified cut.
7. When a user sends a copy-audio request with source and destination cart/cut numbers, the system shall copy the audio between the specified cuts.
8. When a user sends a trim-audio request with a trim level, the system shall analyze the audio and return the calculated trim points.
9. When a user requests audio info for a cut, the system shall return the audio file metadata (frames, channels, sample rate, bit rate).
10. When a user requests audio store information, the system shall return the storage capacity details.
11. When a user requests peak data export for a cut, the system shall return the waveform peak energy data as binary.
12. When a user requests a rehash for a cut, the system shall recalculate and update the integrity hash of the audio file.

### Requirement 5: Log Management
**Objective:** As a program director, I want to create, list, edit, save, and delete broadcast logs through the API, so that playout schedules can be managed remotely.

#### Acceptance Criteria
1. When a user with log creation permission sends an add-log request with a log name and service name, the system shall create a new log.
2. When a user with log deletion permission sends a delete-log request, the system shall remove the log.
3. When a user requests a list of logs, the system shall return log data with optional filtering by service name, log name, and trackable status.
4. When a user requests a single log by name, the system shall return the log with all its lines.
5. When a user with log editing permissions (add, remove, arrange) sends a save-log request, the system shall save the complete log with all its lines.
6. When saving a log with a valid lock identifier, the system shall verify the lock and save the log while maintaining the lock.
7. If a user attempts to save a log with an invalid or expired lock identifier, then the system shall reject the save with an "invalid log lock" error.
8. When a user requests a lock operation (create, update, or clear), the system shall manage the log lock accordingly to prevent concurrent edit conflicts.
9. If a user does not have permission for the log's service, then the system shall deny the operation.

### Requirement 6: Group and Scheduler Code Management
**Objective:** As a system administrator, I want to list groups and manage scheduler codes through the API, so that content organization can be configured remotely.

#### Acceptance Criteria
1. When a user requests a list of groups, the system shall return only the groups the user has access to.
2. When a user requests a single group by name, the system shall return the group details.
3. When a user requests a list of scheduler codes, the system shall return all available codes.
4. When a user sends an assign-scheduler-code request with a cart number and code, the system shall assign the code to the cart.
5. When a user sends an unassign-scheduler-code request, the system shall remove the code from the cart.
6. When a user requests scheduler codes for a specific cart, the system shall return the assigned codes.

### Requirement 7: Service and System Settings
**Objective:** As a system integrator, I want to retrieve service and system configuration through the API, so that client applications can adapt to the system's configuration.

#### Acceptance Criteria
1. When a user requests a list of services, the system shall return available services with optional trackable filtering.
2. When a user requests system settings, the system shall return the system-wide configuration values.

### Requirement 8: Podcast and RSS Feed Management
**Objective:** As a content manager, I want to manage podcast episodes and RSS feeds through the API, so that broadcast content can be published to podcast platforms.

#### Acceptance Criteria
1. When a user with podcast addition permission and feed authorization sends a save-podcast request, the system shall save the podcast episode metadata.
2. When a user requests a podcast episode by ID, the system shall return the episode data.
3. When a user with podcast deletion permission sends a delete request, the system shall remove the podcast episode.
4. When a user with podcast addition permission sends a post-podcast request, the system shall upload the podcast audio to the configured remote server.
5. When a user sends a remove-podcast request, the system shall delete the podcast audio from the remote server.
6. When an administrator sends a post-RSS request for a feed, the system shall generate the RSS XML and upload it to the configured remote server.
7. When an administrator sends a remove-RSS request, the system shall delete the RSS feed from the remote server.
8. When an administrator sends a post-image request, the system shall upload the feed image to the remote server.
9. When an administrator sends a remove-image request, the system shall delete the feed image from the remote server.

### Requirement 9: Browser-Based Audio Transfer
**Objective:** As a broadcast operator, I want to download and upload audio files through a web browser, so that audio content can be transferred without specialized client software.

#### Acceptance Criteria
1. When a user navigates to the web audio transfer page, the system shall display a login form.
2. When a user submits valid credentials, the system shall authenticate the user and display the audio transfer form.
3. If the user does not have web audio transfer login permission, then the system shall deny access and redisplay the login form with HTTP 403.
4. When an authenticated user requests to download audio by cart title and format preset, the system shall look up the cart, convert the audio to the selected format, and stream the file to the browser.
5. While a user has cart creation and audio editing permissions, the system shall display the upload section allowing file upload to a selected group.
6. When a user uploads an audio file to a group, the system shall validate permissions, check title uniqueness, and import the audio via the import subsystem.
7. Where a file archive directory is configured, the system shall save a copy of the uploaded file to the archive directory before importing.
8. If an upload fails due to a duplicate title, then the system shall send an email notification to the configured address with the failure details.
9. When an authentication ticket expires during an active session, the system shall redirect the user to the login form.

### Requirement 10: Permission-Based Access Control
**Objective:** As a system administrator, I want all API operations gated by granular permissions, so that users can only perform operations they are authorized for.

#### Acceptance Criteria
1. The system shall enforce the following permission checks for each operation category:
   - Cart creation requires cart creation permission
   - Cart editing requires cart modification permission
   - Cart deletion requires cart deletion permission
   - Cut addition and editing requires audio editing permission
   - Audio import requires audio editing permission (and optionally cart creation permission for auto-create)
   - Audio deletion requires cart deletion permission or administrator privilege
   - Log creation requires log creation permission
   - Log deletion requires log deletion permission
   - Log saving requires add-to-log, remove-from-log, and arrange-log permissions
   - Podcast operations require podcast permission and feed authorization (or administrator privilege)
   - RSS and feed image operations require administrator privilege
2. If a user lacks the required permission for an operation, then the system shall deny the request with an intentionally vague error to prevent information disclosure.
