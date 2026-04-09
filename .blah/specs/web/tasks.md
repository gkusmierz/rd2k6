# Implementation Plan

- [ ] 1. Authentication and session middleware
- [ ] 1.1 (P) Define domain value objects for authentication
  - Define Ticket value object with token string, expiration datetime, and associated username
  - Define AuthenticatedUser value object with username and permission set
  - Define AuthError enum class: InvalidCredentials, TicketExpired, MissingCredentials
  - All types in domain layer with zero framework dependencies
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 1.2 (P) Define authentication and ticket outbound ports
  - Define ITicketRepository port: createTicket(username) -> Result<Ticket>, validateTicket(token) -> Result<AuthenticatedUser>, removeExpiredTickets()
  - Define IUserAuthPort port: verifyPassword(username, password) -> Result<AuthenticatedUser>
  - Ports reference only domain types
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 1.3 Implement AuthMiddleware as an inbound web adapter
  - Extract authentication credentials from HTTP request (ticket or username+password)
  - Validate ticket via ITicketRepository; on success, return authenticated user
  - If no ticket, validate username+password via IUserAuthPort; on success, create new ticket and return authenticated user
  - On failure, return 403 with "Invalid User" error response
  - _Requirements: 1.1, 1.2, 1.3, 1.6_

- [ ] 1.4 Implement PermissionMiddleware
  - Define OperationType enum covering all gated operations: CreateCart, ModifyCart, DeleteCart, EditAudio, CreateLog, DeleteLog, SaveLog, AddPodcast, DeletePodcast, AdminConfig, WebgetLogin
  - For cart-related denials, return 404 "No such cart" (security by obscurity)
  - For other denials, return 403
  - Check compound permissions (e.g., SaveLog requires add + remove + arrange)
  - _Requirements: 10.1, 10.2_

- [ ] 1.5 Implement privilege management for the HTTP server process
  - On startup, drop root privileges to the configured system user and group
  - If privilege drop fails, terminate with HTTP 500 error
  - If process remains root after drop attempt, terminate with HTTP 500 error
  - _Requirements: 1.4, 1.5_

- [ ] 2. HTTP server and request routing infrastructure
- [ ] 2.1 (P) Set up persistent HTTP server with request routing
  - Create the HTTP server using Qt Network (replacing legacy CGI-per-request model)
  - Register route table mapping endpoint paths to handler components
  - Wire AuthMiddleware and PermissionMiddleware into the request pipeline
  - Accept only POST for API endpoints; reject other methods with error
  - _Requirements: 1.6, 2-8 (all API requirements depend on routing)_

- [ ] 2.2 Implement XML response serializer
  - Serialize domain objects (carts, cuts, logs, groups, services, scheduler codes, podcasts, system settings) to XML format matching legacy API schema
  - Serialize error responses as XML with status code and message
  - Support "OK" result XML for mutation acknowledgments
  - _Requirements: 2-8 (all endpoints return XML)_

- [ ] 2.3 Implement notification integration for mutation endpoints
  - After successful cart create/modify/delete, publish CartAdded/CartModified/CartDeleted notification via INotificationPort
  - After successful log create/modify, publish LogAdded/LogModified notification
  - Fire-and-forget delivery; notification failure must not cause request failure
  - _Requirements: 2.10_

- [ ] 3. Cart management endpoints
- [ ] 3.1 (P) Implement AddCart handler
  - Accept GROUP_NAME and TYPE as required parameters; optional CART_NUMBER
  - Verify user has cart creation permission
  - Validate cart number is within group range if specified
  - Create cart via ILibraryService and return cart XML
  - Publish CartAdded notification
  - _Requirements: 2.1, 2.7, 2.10_

- [ ] 3.2 Implement ListCarts and ListCart handlers
  - ListCarts: return all carts with optional GROUP_NAME, FILTER, TYPE, INCLUDE_CUTS filtering
  - ListCart: return single cart by CART_NUMBER with optional INCLUDE_CUTS
  - Verify cart authorization before returning data
  - _Requirements: 2.2, 2.3, 2.6_

- [ ] 3.3 Implement EditCart handler
  - Accept CART_NUMBER and updateable fields (TITLE, ARTIST, ALBUM, YEAR, GROUP_NAME, etc.)
  - Verify user has cart modification permission
  - Validate duplicate title rules when title changes
  - Validate macro syntax for macro-type carts
  - Validate cart number range when group changes
  - Publish CartModified notification
  - _Requirements: 2.4, 2.7, 2.8, 2.9, 2.10_

- [ ] 3.4 Implement RemoveCart handler
  - Accept CART_NUMBER; verify user has cart deletion permission
  - Delete cart and all associated data (cuts, audio, events)
  - Publish CartDeleted notification
  - _Requirements: 2.5, 2.6, 2.10_

- [ ] 4. Cut management endpoints
- [ ] 4.1 Implement AddCut and RemoveCut handlers
  - AddCut: accept CART_NUMBER, verify audio editing permission, create cut, return cut XML
  - RemoveCut: accept CART_NUMBER + CUT_NUMBER, verify permission, delete cut
  - _Requirements: 3.1, 3.5_

- [ ] 4.2 Implement ListCuts, ListCut, and EditCut handlers
  - ListCuts: return all cuts for a cart
  - ListCut: return single cut by cart/cut number
  - EditCut: update cut metadata, validate pointer values (start, end, segue, fade points)
  - _Requirements: 3.2, 3.3, 3.4, 3.6_

- [ ] 5. Audio operation endpoints
- [ ] 5.1 (P) Implement Import handler
  - Accept audio file upload with CART_NUMBER, CUT_NUMBER, format parameters (CHANNELS, NORMALIZATION_LEVEL, AUTOTRIM_LEVEL, USE_METADATA)
  - Support optional CREATE mode with GROUP_NAME and TITLE for auto-creating cart
  - Validate permissions: editAudio required, createCarts if auto-creating
  - Validate duplicate title rules when metadata is used
  - Import audio through IAudioService
  - _Requirements: 4.1, 4.2, 4.8_

- [ ] 5.2 Implement Export handler
  - Accept CART_NUMBER, CUT_NUMBER, FORMAT, CHANNELS, SAMPLE_RATE, BIT_RATE, QUALITY, START_POINT, END_POINT, NORMALIZATION_LEVEL, ENABLE_METADATA
  - Convert audio via IAudioConverter and stream binary result
  - Map conversion errors: unsupported format -> 415, missing source -> 404, other -> 500
  - _Requirements: 4.3, 4.4, 4.5_

- [ ] 5.3 Implement remaining audio handlers
  - DeleteAudio: remove audio file and energy data; require deleteCarts or admin permission
  - CopyAudio: copy audio between source and destination cart/cut pairs
  - TrimAudio: analyze audio at specified trim level, return calculated trim points
  - AudioInfo: return audio file metadata (frames, channels, sample rate, bit rate)
  - AudioStore: return storage capacity information
  - ExportPeaks: return binary waveform peak energy data
  - Rehash: recalculate and update the audio file integrity hash
  - _Requirements: 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12_

- [ ] 6. Log management endpoints
- [ ] 6.1 (P) Implement AddLog, DeleteLog, ListLogs, and ListLog handlers
  - AddLog: accept LOG_NAME + SERVICE_NAME, verify createLog permission
  - DeleteLog: accept LOG_NAME, verify deleteLog permission
  - ListLogs: return logs with optional SERVICE_NAME, LOG_NAME filter, TRACKABLE
  - ListLog: return log with all lines by NAME
  - Verify user has permission for the log's service
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.9_

- [ ] 6.2 Implement SaveLog handler with locking
  - Accept LOG_NAME, SERVICE_NAME, DESCRIPTION, dates, and LINE_QUANTITY with per-line fields
  - Verify user has add + remove + arrange log permissions
  - If LOCK_GUID provided, validate existing lock before saving
  - If no LOCK_GUID, acquire new lock for the save operation
  - Reject save with "invalid log lock" if lock validation fails
  - Return event count on success
  - _Requirements: 5.5, 5.6, 5.7_

- [ ] 6.3 Implement LockLog handler
  - Accept LOG_NAME, OPERATION (create/update/clear), LOCK_GUID
  - Create: acquire new lock, return lock identifier
  - Update: validate and refresh existing lock
  - Clear: release lock
  - _Requirements: 5.8_

- [ ] 7. Group, scheduler code, service, and system settings endpoints
- [ ] 7.1 Implement group and scheduler code handlers
  - ListGroups: return groups the authenticated user has access to
  - ListGroup: return single group details by name
  - ListSchedCodes: return all scheduler codes
  - AssignSchedCode: assign code to cart
  - UnassignSchedCode: remove code from cart
  - ListCartSchedCodes: return codes assigned to a specific cart
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 7.2 Implement service and system settings handlers
  - ListServices: return services with optional TRACKABLE filtering
  - ListSystemSettings: return system-wide configuration values
  - _Requirements: 7.1, 7.2_

- [ ] 8. Podcast and RSS feed endpoints
- [ ] 8.1 Implement podcast episode handlers
  - SavePodcast: save episode metadata; require addPodcast + feedAuthorized or adminConfig
  - GetPodcast: return episode by ID
  - DeletePodcast: delete episode; require deletePodcast + feedAuthorized or adminConfig
  - PostPodcast: upload audio to configured remote server via IRemoteUploadPort
  - RemovePodcast: delete audio from remote server
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8.2 Implement RSS feed and image handlers
  - PostRss: generate RSS XML from feed data, upload to remote server; require adminConfig
  - RemoveRss: delete RSS feed from remote server; require adminConfig
  - PostImage: upload feed image to remote server; require adminConfig
  - RemoveImage: delete feed image from remote server; require adminConfig
  - _Requirements: 8.6, 8.7, 8.8, 8.9_

- [ ] 9. Browser-based audio transfer (webget)
- [ ] 9.1 (P) Implement login and form serving
  - On GET request, serve login page with username and password fields
  - On POST with credentials, authenticate and verify webgetLogin permission
  - On successful auth, create ticket and serve audio transfer form
  - Populate format preset dropdown from encoder presets
  - Populate group dropdown from user-authorized groups (audio-type only)
  - Show upload section only if user has createCarts permission
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 9.2 Implement audio download (direction=get)
  - Accept TICKET, title, preset as parameters
  - Look up cart by title; fail if not found
  - Load encoder preset settings for the selected format
  - Convert audio to requested format via IAudioService
  - Stream binary audio with appropriate content type (audio/x-wav, audio/x-mpeg, etc.)
  - _Requirements: 9.4_

- [ ] 9.3 Implement audio upload (direction=put)
  - Accept TICKET, group, filename (file upload)
  - Verify createCarts + editAudio permissions and group authorization
  - Check title uniqueness against system policy
  - If archive directory is configured, save copy of uploaded file before importing
  - Import audio via IAudioService (equivalent to rdimport functionality)
  - On duplicate title failure, send email notification to configured address
  - _Requirements: 9.6, 9.7, 9.8_

- [ ] 9.4 Implement session expiry handling
  - When a request arrives with an expired or invalid ticket, redirect to login form
  - Return appropriate HTTP 403 status for expired sessions
  - _Requirements: 9.9_

- [ ] 10. Testing
- [ ] 10.1 (P) Unit tests for authentication middleware
  - Verify ticket validation accepts valid tickets and rejects expired/invalid ones
  - Verify password authentication creates a new ticket on success
  - Verify missing credentials return 403 with "Invalid User"
  - Verify privilege drop failure terminates with 500
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 10.2 (P) Unit tests for permission middleware
  - Verify each operation type maps to the correct permission check
  - Verify compound permissions for SaveLog (add + remove + arrange)
  - Verify cart access denial returns 404 (not 403)
  - Verify admin override for podcast and audio delete operations
  - _Requirements: 10.1, 10.2_

- [ ] 10.3 (P) Unit tests for cart and cut handlers
  - Verify AddCart with valid group creates cart and returns XML
  - Verify cart number range enforcement rejects out-of-range numbers
  - Verify duplicate title prevention when system disallows duplicates
  - Verify macro syntax validation rejects lines without terminator
  - Verify EditCut validates pointer values
  - _Requirements: 2.1, 2.7, 2.8, 2.9, 3.6_

- [ ] 10.4 (P) Unit tests for log handlers
  - Verify SaveLog with valid lock succeeds
  - Verify SaveLog with invalid/expired lock fails with "invalid log lock"
  - Verify LockLog create/update/clear operations
  - Verify concurrent lock contention is properly rejected
  - _Requirements: 5.5, 5.6, 5.7, 5.8_

- [ ] 10.5 (P) Unit tests for audio operation handlers
  - Verify Import with valid file and parameters succeeds
  - Verify Export maps conversion errors to correct HTTP status codes (415, 404, 500)
  - Verify auto-create mode validates createCarts permission
  - _Requirements: 4.1, 4.3, 4.4, 4.5_

- [ ] 10.6 Integration tests for full request lifecycle
  - Test complete API request: HTTP POST -> auth -> permission -> handler -> XML response
  - Test audio import with format conversion end-to-end
  - Test audio export with binary streaming and correct content type
  - Test podcast upload to mock remote server
  - Test notification publishing after cart/log mutations
  - _Requirements: 1-8, 2.10_

- [ ] 10.7 Integration tests for webget flows
  - Test browser login: GET login page, POST credentials, receive audio form
  - Test audio download: authenticate, request by title, receive audio binary
  - Test audio upload: authenticate, upload file to group, verify cart created
  - Test session expiry: use expired ticket, verify redirect to login
  - Test permission enforcement: login as restricted user, verify upload section absent
  - _Requirements: 9.1, 9.2, 9.4, 9.6, 9.9_

- [ ] 10.8 Performance tests
  - Test concurrent API requests (multiple simultaneous CRUD operations)
  - Test large audio file export streaming (verify memory-efficient streaming)
  - Test bulk cart listing response time with large datasets
  - _Requirements: 4.3, 2.2_
