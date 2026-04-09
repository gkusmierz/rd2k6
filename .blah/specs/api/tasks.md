# Implementation Plan

- [ ] 1. Foundation: Data Models and Utility Functions
- [ ] 1.1 Define all domain data structures for the API client library
  - Create value objects for Cart, Cut, Group, Log, LogLine, Service, SystemSettings, SchedCode, AudioInfo, AudioStore, ImportResult, TicketInfo, and TrimResult with all fields matching the logical data model
  - Create partial-update parameter structures for CartEditValues and CutEditValues with per-field inclusion flags that allow selective field updates
  - Create LogHeaderValues and LogLineValues parameter structures for log save operations
  - Define error code conventions: 0 for success, -1 for network error, HTTP status codes for server errors
  - All structures use value semantics, immutable after population
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 4.3, 9.1, 9.2, 9.3_

- [ ] 1.2 (P) Implement datetime and time conversion utilities
  - Convert datetime strings to datetime structures and back (round-trip safe)
  - Convert time strings to milliseconds and back
  - Validate datetime structures for correctness (range checking on year, month, day, hour, minute, second)
  - Parse boolean values from string representations
  - Retrieve local timezone offset from the system
  - Return library version information and user agent string
  - All functions are pure local computations with no network dependency
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 1.3 (P) Build the HTTP communication and XML parsing infrastructure
  - Implement a shared HTTP POST executor that sends form-encoded requests to the web service endpoint
  - Include authentication parameters (hostname, username, password, ticket) in every request as form fields
  - Support custom User-Agent header when provided by the caller
  - Implement a callback-based XML response parser that populates data structures from server responses
  - Return 0 on HTTP 2xx success, the HTTP status code on non-2xx responses, and -1 on network errors
  - When debug output is enabled, log network error details to standard error
  - _Requirements: 8.1, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 2. Authentication Service
- [ ] 2.1 Implement ticket creation
  - Submit a ticket creation request with hostname, username, and password to the web service
  - Parse the XML response to extract the session ticket string and its expiration datetime
  - Return the populated TicketInfo structure on success
  - Follow the standard error handling pattern for network and HTTP errors
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 3. Cart Management Service
- [ ] 3.1 (P) Implement cart creation and deletion
  - Create a cart by submitting group name, cart type, and optional cart number; return the populated Cart record
  - Delete a cart by submitting its cart number
  - Both operations follow the standard HTTP POST and XML parsing lifecycle
  - _Requirements: 1.1, 1.3_

- [ ] 3.2 (P) Implement cart query and listing
  - Query a single cart by cart number and return the full Cart record
  - List carts with optional group name, text filter, and type filter; return all matching Cart records and a total count
  - _Requirements: 1.4, 1.5_

- [ ] 3.3 Implement cart editing with partial updates
  - Accept a CartEditValues structure where each field has a companion use-flag
  - Iterate all fields and include only those with the use-flag set in the POST request
  - Parse the XML response and return the updated Cart record
  - _Requirements: 1.2_

- [ ] 3.4 Implement cart queries with embedded cuts
  - Query a single cart with the include-cuts option and return the Cart record with all associated Cut records embedded
  - List carts with the include-cuts option and return all matching Cart records with embedded Cut records
  - Parse the combined cart-and-cut XML response into nested data structures
  - _Requirements: 1.6, 1.7_

- [ ] 4. Cut Management Service
- [ ] 4.1 (P) Implement cut creation and deletion
  - Create a cut by submitting a cart number; return the populated Cut record
  - Delete a cut by submitting cart number and cut number
  - _Requirements: 2.1, 2.3_

- [ ] 4.2 (P) Implement cut query and listing
  - Query a single cut by cart number and cut number; return the full Cut record
  - List all cuts for a cart by cart number; return all Cut records and a total count
  - _Requirements: 2.4, 2.5_

- [ ] 4.3 Implement cut editing with partial updates
  - Accept a CutEditValues structure with per-field inclusion flags
  - Serialize only flagged fields into the POST request
  - Return the updated Cut record from the parsed XML response
  - _Requirements: 2.2_

- [ ] 5. Audio Operations Service
- [ ] 5.1 Implement audio import
  - Accept cart number, cut number, audio file path, and processing parameters (channels, normalization level, autotrim level, metadata usage)
  - Upload the file to the server via multipart HTTP POST
  - Parse the response to extract the import result including assigned cart and cut numbers
  - _Requirements: 3.1_

- [ ] 5.2 (P) Implement audio export and peak data export
  - Export audio by submitting cart number, cut number, output format parameters (format, channels, sample rate, bit rate, quality), and optional start/end points; download to the specified local file path
  - Export peak data by submitting cart number and cut number; download to the specified local file path
  - Both operations write binary data received from the server to local files
  - _Requirements: 3.2, 3.7_

- [ ] 5.3 (P) Implement audio deletion and copy
  - Delete audio by submitting cart number and cut number
  - Copy audio between cuts by submitting source and destination cart/cut numbers
  - Both are server-side operations with no local file I/O
  - _Requirements: 3.3, 3.4_

- [ ] 5.4 (P) Implement audio info, storage query, and trim calculation
  - Query audio metadata by cart number and cut number; return format, channels, sample rate, frame count, and duration
  - Query audio store capacity; return available and total storage
  - Calculate trim points by submitting cart number, cut number, and trim level; return start and end trim points
  - _Requirements: 3.5, 3.6, 3.8_

- [ ] 6. Log Management Service
- [ ] 6.1 (P) Implement log creation and deletion
  - Create a log by submitting log name and service name
  - Delete a log by submitting log name
  - _Requirements: 4.1, 4.2_

- [ ] 6.2 Implement log save with transition encoding
  - Accept log header values and an array of log line values with a line count
  - Encode transition type integer values to their string names (0 to PLAY, 1 to SEGUE, 2 to STOP) when serializing each log line
  - Submit the complete log content to the server
  - _Requirements: 4.3, 4.4_

- [ ] 6.3 (P) Implement log content and listing queries
  - Query log contents by log name; return all LogLine records and a total count
  - List logs with optional service name, log name filter, trackable flag, text filter, and recent flag; return all matching Log records and a total count
  - _Requirements: 4.5, 4.6_

- [ ] 7. Scheduler Code Management Service
- [ ] 7.1 (P) Implement scheduler code assignment and unassignment
  - Assign a scheduler code to a cart by submitting cart number and code
  - Unassign a scheduler code from a cart by submitting cart number and code
  - _Requirements: 5.1, 5.2_

- [ ] 7.2 (P) Implement scheduler code listing
  - List all available scheduler codes; return all SchedCode records and a total count
  - List all codes assigned to a specific cart by cart number; return all assigned SchedCode records and a total count
  - _Requirements: 5.3, 5.4_

- [ ] 8. System Query Service
- [ ] 8.1 (P) Implement group queries
  - Query a single group by group name; return the Group record including name, description, cart range limits, and configuration flags
  - List all groups; return all Group records and a total count
  - _Requirements: 6.1, 6.2_

- [ ] 8.2 (P) Implement service listing and system settings query
  - List services with optional trackable filter; return all matching Service records and a total count
  - Query system settings; return the SystemSettings record including sample rate, duplicate title policy, maximum POST length, and temporary cart group
  - _Requirements: 6.3, 6.4_

- [ ] 9. Media Publishing Service
- [ ] 9.1 (P) Implement podcast operations
  - Publish a podcast by submitting a podcast identifier
  - Upload a podcast file by submitting a podcast identifier and file path
  - Delete a podcast by submitting a podcast identifier
  - Remove a podcast by submitting a podcast identifier
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9.2 (P) Implement RSS feed and image operations
  - Publish an RSS feed by submitting a feed identifier
  - Remove an RSS feed by submitting a feed identifier
  - Publish an image by submitting an image identifier
  - Remove an image by submitting an image identifier
  - _Requirements: 7.5, 7.6, 7.7, 7.8_

- [ ] 10. Unit Tests for Utilities and Data Conversion
- [ ] 10.1 (P) Test datetime and time conversion functions
  - Test datetime string to datetime structure conversion with various formats and edge cases
  - Test datetime structure to string conversion with round-trip validation
  - Test time string to milliseconds conversion and reverse
  - Test boolean parsing from string values (true/false, yes/no, 1/0 patterns)
  - Test datetime structure validation with valid and invalid dates
  - Test timezone offset retrieval and version/user-agent information functions
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 10.2 (P) Test partial update field serialization
  - Verify that cart edit values with selected use-flags produce POST data containing only the flagged fields
  - Verify that cut edit values with selected use-flags produce POST data containing only the flagged fields
  - Verify that fields with use-flag unset are excluded from serialized output
  - _Requirements: 1.2, 2.2_

- [ ] 10.3 (P) Test transition type encoding
  - Verify that transition type 0 encodes to PLAY
  - Verify that transition type 1 encodes to SEGUE
  - Verify that transition type 2 encodes to STOP
  - _Requirements: 4.4_

- [ ] 11. Integration Tests for API Operations
- [ ] 11.1 Test cart CRUD lifecycle
  - Create a cart, read it back, edit with partial update, verify changes, delete and confirm removal
  - Test cart listing with group, type, and text filters
  - Test embedded cuts retrieval for single cart and cart listing
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 11.2 Test cut CRUD lifecycle
  - Add a cut to a cart, read it back, edit with partial update, verify changes, remove and confirm deletion
  - Test cut listing for a cart and verify total count
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 11.3 Test audio operations round-trip
  - Import an audio file with processing parameters, verify the import result
  - Export the audio to a local file, verify the file was created
  - Query audio info and verify metadata matches the imported file
  - Copy audio between cuts and verify the copy exists
  - Delete audio and confirm removal
  - Test audio store capacity query and peak data export
  - Test trim calculation and verify returned trim points
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 11.4 Test log management workflow
  - Create a log, save with header and multiple log lines including transition types, list contents and verify line count, delete and confirm
  - Test log listing with service name, filter, trackable, and recent parameters
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 11.5 Test authentication and error handling
  - Create a ticket with valid credentials, verify ticket string and expiration datetime
  - Verify correct error code for invalid credentials (401/403)
  - Verify -1 return on simulated network failure
  - Verify correct HTTP status code passthrough for 404 and 500 responses
  - Verify custom user agent is included in HTTP request headers
  - _Requirements: 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 11.6 Test scheduler code and system query operations
  - Assign a code to a cart, list cart codes, unassign, verify removal
  - List all scheduler codes and verify count
  - Query a group, list all groups, list services with trackable filter, query system settings
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_

- [ ] 11.7 Test media publishing operations
  - Publish, upload, delete, and remove a podcast
  - Publish and remove an RSS feed
  - Publish and remove an image
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
