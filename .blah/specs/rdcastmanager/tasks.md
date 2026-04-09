# Implementation Plan

- [ ] 1. Domain entities and value objects
- [ ] 1.1 Implement the Feed domain entity
  - Create the Feed entity with fields: id, keyName, channelTitle, channelDescription, channelCategory, channelLink, channelCopyright, channelWebmaster, channelLanguage, channelImageId, isSuperFeed, rssSchema, baseUrl, basePreamble, purgeUrl, purgeUsername, purgePassword, headerXml, channelXml, itemXml, castOrder, maxShelfLife, lastBuildDatetime, originDatetime, enableAutopost, keepMetadata, uploadFormat, uploadChannels, uploadSampleRate, uploadBitrate, uploadQuality, uploadExtension, normalizeLevel, redirectPath, mediaLinkMode
  - Implement publicUrl computation from baseUrl and keyName
  - Implement isSuperFeed predicate for enforcing read-only policy on superfeeds
  - Use immutable value semantics, `[[nodiscard]]` on all getters, `std::optional` for nullable fields
  - _Requirements: 1, 2, 4_

- [ ] 1.2 Implement the Podcast domain entity with lifecycle state management
  - Create the Podcast entity with fields: id, feedId, status, itemTitle, itemDescription, itemCategory, itemLink, itemComments, itemAuthor, itemSourceText, itemSourceUrl, itemExplicit, itemImageId, audioFilename, audioLength, audioTime, shelfLife, sha1Hash, originDatetime, originLoginName, originStation, effectiveDatetime, expirationDatetime
  - Implement CastStatus enum class with values: Pending, Active, Expired
  - Implement lifecycle state transition rules: Pending to Active (user activation), Active to Expired (date-based), Expired is terminal
  - Implement status display color derivation: green (active, effective now/past), blue (active, future effective), red (pending), white (expired)
  - Implement expiration date validation: expiration must be after effective date, expiration must be in the future
  - _Requirements: 3, 9, 10_

- [ ] 1.3 Implement FeedPermission and FeedImage value objects
  - Create FeedPermission value object with fields: id, userName, keyName
  - Create FeedImage value object with fields: id, feedId, feedKeyName, width, height, depth, description, fileExtension, data (binary)
  - Both are immutable after construction
  - _Requirements: 1, 3_

- [ ] 1.4 Implement domain events
  - Define FeedItemAdded(feedId, podcastId) event
  - Define FeedItemModified(feedId, podcastId) event
  - Define FeedItemDeleted(feedId, podcastId) event
  - Define FeedModified(feedId) event
  - _Requirements: 6, 7, 8, 10_

- [ ] 1.5 Unit tests for domain entities
  - Test Feed publicUrl computation
  - Test Podcast lifecycle state transitions: Pending to Active, Active to Expired, Expired is terminal
  - Test Podcast status display color derivation for all four states
  - Test expiration validation: before air date rejected, past date rejected, valid future date accepted
  - Test FeedPermission and FeedImage immutability
  - _Requirements: 1, 3, 9_

- [ ] 2. Port interfaces (inbound and outbound)
- [ ] 2.1 Define outbound port interfaces for persistence
  - Define IFeedRepository with: findByKeys(keys) -> list of Feed, findById(id) -> optional Feed, getActiveCastCount(feedId) -> int, getTotalCastCount(feedId) -> int, updateLastBuildDatetime(feedId, datetime) -> void
  - Define IPodcastRepository with: findByFeed(feedId, filter, activeOnly) -> list of Podcast, findById(id) -> optional Podcast, create(podcast) -> int, update(podcast) -> void, delete(id) -> void
  - Define IFeedPermissionRepository with: findByUser(userName) -> list of FeedPermission, getUserPrivileges(userName) -> PodcastPrivileges (addPodcast, editPodcast, deletePodcast flags)
  - All interfaces use only domain types in signatures
  - _Requirements: 1, 3, 5, 9, 10_

- [ ] 2.2 Define outbound port interfaces for network operations
  - Define IRssPublisher with: regenerateFeed(feedId) -> Result of void or PublishError
  - Define IAudioUploader with: uploadFromCut(feedId, cutId, progressCallback) -> Result, uploadFromFile(feedId, filePath, progressCallback) -> Result, uploadFromRenderedLog(feedId, logName, renderParams, progressCallback) -> Result, dropRemoteAudio(castId) -> Result
  - Define INotificationService with: notify(event) -> void
  - _Requirements: 6, 7, 8, 10_

- [ ] 2.3 Define inbound port interfaces for use cases
  - Define IFeedService with: loadPermittedFeeds(userName) -> list of Feed (with cast counts and images), openFeed(feedId) -> Feed
  - Define IPodcastService with: listCasts(feedId, filter, activeOnly) -> list of Podcast, getCast(castId) -> Podcast, saveCast(podcast) -> Result, deleteCast(castId) -> Result, postFromCut(feedId, cutId) -> Result of int, postFromFile(feedId, filePath) -> Result of int, postFromLog(feedId, logName, renderParams) -> Result of int
  - _Requirements: 1, 2, 3, 6, 7, 8, 9, 10_

- [ ] 3. Domain services
- [ ] 3.1 Implement PermissionChecker domain service
  - Implement getPermittedFeedKeys(userName) that queries IFeedPermissionRepository and returns the set of feed key names the user may access
  - Implement canAddPodcast, canEditPodcast, canDeletePodcast methods using privilege flags from the repository
  - Return empty list when user has no feed permissions (resulting in empty feed list)
  - _Requirements: 1, 4, 5_

- [ ] 3.2 Implement PostService domain service
  - Implement postFromCut: call IAudioUploader.uploadFromCut, create Podcast record via IPodcastRepository, regenerate RSS via IRssPublisher, send notifications via INotificationService
  - Implement postFromFile: call IAudioUploader.uploadFromFile, create Podcast record, regenerate RSS, send notifications
  - Implement postFromLog: call IAudioUploader.uploadFromRenderedLog, create Podcast record, regenerate RSS, send notifications
  - On upload failure, return error with details without creating podcast record
  - _Requirements: 6, 7, 8_

- [ ] 3.3 Implement FeedService and PodcastService application services
  - FeedService.loadPermittedFeeds: use PermissionChecker to get permitted keys, then IFeedRepository.findByKeys, enrich with cast counts and images
  - PodcastService.listCasts: delegate to IPodcastRepository.findByFeed with filter and activeOnly parameters
  - PodcastService.saveCast: validate expiration constraints, delegate to IPodcastRepository.update, conditionally regenerate RSS
  - PodcastService.deleteCast: attempt remote audio drop via IAudioUploader, delete record via IPodcastRepository, update feed build timestamp, regenerate RSS; handle partial failures with user decision points
  - _Requirements: 1, 2, 3, 9, 10_

- [ ] 3.4 Unit tests for domain services
  - Test PermissionChecker with mocked repository: user with permissions sees correct feeds, user without permissions sees empty list
  - Test PostService with mocked adapters: successful post creates record and regenerates RSS, failed upload returns error without creating record
  - Test PodcastService.saveCast: expiration validation rejects invalid dates, valid dates save successfully
  - Test PodcastService.deleteCast: remote drop failure prompts user decision, successful deletion updates build timestamp and regenerates RSS
  - _Requirements: 1, 5, 6, 7, 8, 9, 10_

- [ ] 4. Persistence adapters
- [ ] 4.1 Implement SqlFeedRepository
  - Implement findByKeys using SELECT with IN clause on KEY_NAME, joining FEED_IMAGES for channel image
  - Implement findById with full feed data including image join
  - Implement getActiveCastCount and getTotalCastCount using SELECT COUNT on PODCASTS table with STATUS filter
  - Implement updateLastBuildDatetime using UPDATE on FEEDS table
  - Map database enum fields ('N'/'Y') to domain bool types
  - _Requirements: 1, 2_

- [ ] 4.2 Implement SqlPodcastRepository
  - Implement findByFeed with optional text filter (using SQL LIKE on title, description, category, author fields) and activeOnly flag (filtering by status and expiration)
  - Implement findById with full podcast data including feed and image joins
  - Implement create with INSERT returning generated ID
  - Implement update for all mutable podcast metadata fields
  - Implement delete with DELETE by ID
  - _Requirements: 3, 6, 7, 8, 9, 10_

- [ ] 4.3 Implement SqlFeedPermissionRepository
  - Implement findByUser using SELECT on FEED_PERMS where USER_NAME matches
  - Implement getUserPrivileges to retrieve addPodcast, editPodcast, deletePodcast privilege flags from the user configuration
  - _Requirements: 1, 5_

- [ ] 4.4 (P) Integration tests for persistence adapters
  - Test SqlFeedRepository: create test feeds, verify findByKeys returns only matching feeds, verify cast count queries
  - Test SqlPodcastRepository: create test podcasts, verify filter and activeOnly queries, verify CRUD operations
  - Test SqlFeedPermissionRepository: create test permissions, verify user filtering
  - Use real database (SQLite for test isolation)
  - _Requirements: 1, 3, 5_

- [ ] 5. Network adapters
- [ ] 5.1 Implement RssPublishAdapter
  - Implement regenerateFeed: generate RSS XML from feed and podcast data, upload to configured purge URL with credentials
  - Handle network errors and return structured PublishError
  - Use Qt Network for HTTP operations
  - _Requirements: 6, 7, 8, 9, 10_

- [ ] 5.2 Implement AudioUploadAdapter
  - Implement uploadFromCut: encode audio from cart/cut, upload to feed's base URL
  - Implement uploadFromFile: upload file directly to feed's base URL
  - Implement uploadFromRenderedLog: render log segment to audio, upload to feed's base URL
  - Implement dropRemoteAudio: send delete request for remote audio file
  - Report progress via callback during upload operations
  - Handle network errors and return structured UploadError or DropError
  - _Requirements: 6, 7, 8, 10_

- [ ] 6. UI adapter models and controllers
- [ ] 6.1 Implement FeedListModel (QAbstractListModel)
  - Expose roles: keyName, channelTitle, activeCastCount, totalCastCount, publicUrl, feedImage (thumbnail), isSuperFeed
  - Implement refresh on user change signal
  - Implement refresh on feed notification signal
  - Display "[superfeed]" for superfeed entries instead of cast counts
  - _Requirements: 1, 2_

- [ ] 6.2 Implement CastListModel (QAbstractListModel)
  - Expose roles: itemTitle, statusColor, effectiveDatetime, expirationDatetime (or "Never"), audioTime, feedKey, itemCategory, postedBy, sha1Hash, itemImage
  - Implement text filter property that rebuilds the filtered list
  - Implement activeOnly toggle property
  - Implement statusColor derivation from CastStatus and effective date
  - Refresh on feed item notification signal
  - _Requirements: 3, 4, 5_

- [ ] 6.3 Implement CastEditorController
  - Expose Q_PROPERTY for each editable field: itemTitle, itemAuthor, itemCategory, itemLink, itemDescription, itemExplicit, itemImageId, itemComments, effectiveDatetime, expirationMode, expirationDatetime, isActive
  - Expose read-only Q_PROPERTY for origin and cast status
  - Implement save method that validates expiration constraints and calls PodcastService.saveCast
  - Emit error signals for validation failures (expirationBeforeAirDate, expirationInPast)
  - Disable expiration mode selector and active checkbox when status is Expired
  - _Requirements: 9_

- [ ] 6.4 Implement RenderController and LogEventModel
  - RenderController: expose properties for startTimeMode (fromLog, asSpecified), startTime, ignoreStops, selectedEventRange
  - LogEventModel: implement QAbstractTableModel with columns for start time, transition, cart, group, length, title, artist, client, agency, label, source, ext data, line ID, count
  - Support multi-row contiguous selection returning min/max row as start/end line
  - Validate at least one event is selected before allowing OK
  - _Requirements: 8_

- [ ] 7. QML views
- [ ] 7.1 Implement Feed List view (main application window)
  - Display feed list using FeedListModel with columns: image thumbnail, key name, feed name, cast count or "[superfeed]", public URL
  - Wire "View Feed" button to open cast list for selected feed
  - Wire "Copy URL to Clipboard" button to copy selected feed's public URL
  - Wire "Online Feed Report" button to generate report for selected feed
  - Wire "Close" button to quit the application
  - Disable action buttons when no feed is selected
  - Display application title with version, host station, and current user
  - Follow design system tokens from `.blah/steering/design.md` and `design-system/MASTER.md`
  - _Requirements: 1, 2_

- [ ] 7.2 Implement Cast List view (dialog)
  - Display cast list using CastListModel with columns: image, title, status indicator, start date, expiration, length, feed, category, posted by, SHA1
  - Wire filter text input and active checkbox to CastListModel properties
  - Wire "Post From Cart", "Post From File", "Post From Log" buttons with privilege and superfeed guards
  - Wire "Edit" button to open CastEditorController for selected cast
  - Wire "Delete" button to trigger deletion flow with confirmation
  - Display progress dialog during post operations
  - Follow design system tokens
  - _Requirements: 3, 4, 5, 6, 7, 8, 10_

- [ ] 7.3 Implement Cast Editor view (dialog)
  - Display form fields bound to CastEditorController properties: origin (read-only), title, author, category, link, description, explicit checkbox, image picker, comments URL, air date/time with select button, expiration mode, expiration date/time with select button, active checkbox
  - Disable expiration and active controls when status is Expired
  - Enable/disable expiration date/time based on expiration mode
  - Display validation error messages from CastEditorController error signals
  - Wire OK and Cancel buttons
  - Follow design system tokens
  - _Requirements: 9_

- [ ] 7.4 Implement Render Options and Log Selector views (dialogs)
  - Render Options: start time mode combo (from log, as specified), start time edit (enabled when "as specified"), ignore stops combo, event range label, select button, OK/Cancel
  - Log Selector: table view using LogEventModel, multi-row selection, OK/Cancel
  - Validate at least one event selected before enabling OK in Log Selector
  - Follow design system tokens
  - _Requirements: 8_

- [ ] 8. Application composition and startup
- [ ] 8.1 Implement application composition root
  - Wire all port interfaces to their adapter implementations via dependency injection
  - Initialize database connection and verify schema compatibility
  - Set up notification service connections for cross-application events
  - Handle application configuration loading; emit critical error and exit on failure
  - Handle unknown command-line options; emit critical error and exit
  - Create temporary directory for operations; warn on failure
  - _Requirements: 11_

- [ ] 8.2 (P) E2E tests
  - Test feed list loads only permitted feeds for current user
  - Test post from cart: select cut, verify progress dialog, verify editor opens with new cast
  - Test post from file: select file, verify upload and editor
  - Test post from log: select log, configure render, select events, verify post
  - Test edit cast: modify metadata, trigger expiration validation errors, verify save
  - Test delete cast: confirm dialog, handle remote drop failure prompt, verify list update
  - Test superfeed restrictions: verify all modification buttons disabled for superfeed
  - Test privilege enforcement: verify button states match user privilege configuration
  - Test filter and active toggle: verify cast list filtering
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11_
