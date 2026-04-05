---
partial_id: "027"
class: RDFeed
source_files:
  - lib/rdfeed.h
  - lib/rdfeed.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDFeed — Inventory Partial

## 1. Class Purpose

RDFeed manages podcast/RSS feed configuration and content publishing. It represents a single podcast feed identified by a unique key name, providing CRUD operations on feed metadata, RSS XML generation, audio content posting (from cuts, files, or rendered logs), and image management. Supports "superfeed" aggregation of multiple sub-feeds.

## 2. Inheritance & QObject Status

- **Parent class:** QObject
- **Q_OBJECT macro:** Yes
- **Constructors:**
  - `RDFeed(const QString &keyname, RDConfig *config, QObject *parent)` — lookup by key name, resolves ID from FEEDS table
  - `RDFeed(unsigned id, RDConfig *config, QObject *parent)` — lookup by numeric ID, resolves key name from FEEDS table
  - Also reads SERVER_NAME environment variable for CGI hostname detection

## 3. Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `Error` | ErrorOk=0, ErrorNoFile=1, ErrorCannotOpenFile=2, ErrorUnsupportedType=3, ErrorUploadFailed=4, ErrorGeneral=5, ErrorNoLog=6, ErrorRenderError=7 | Error codes for posting operations |

## 4. Signals

| Signal | Parameters | Emitted When |
|--------|------------|--------------|
| `postProgressChanged(int step)` | Current step number | During multi-step posting operations (postCut, postFile, postLog) |
| `postProgressRangeChanged(int min, int max)` | Range bounds | At start of posting to define progress range |

## 5. Slots

| Slot | Visibility | Purpose |
|------|------------|---------|
| `renderMessage(const QString &msg)` | private | Receives progress messages during log rendering |
| `renderLineStartedData(int,int)` | private | Receives line-started notifications during log rendering |

## 6. Key Properties (getter/setter pairs via DB)

All properties are persisted to the `FEEDS` MySQL table. The pattern is: getter reads from DB via `RDGetSqlValue`, setter writes via `SetRow`.

### Channel Metadata
| Property | Type | Description |
|----------|------|-------------|
| keyName | QString | Unique key name identifier (immutable after creation) |
| id | unsigned | Numeric ID (auto-assigned) |
| exists | bool | Whether feed record exists in DB |
| isSuperfeed / setIsSuperfeed | bool | Whether this feed aggregates sub-feeds |
| channelTitle / set | QString | RSS channel title |
| channelDescription / set | QString | RSS channel description |
| channelCategory / set | QString | Primary category |
| channelSubCategory / set | QString | Sub-category |
| channelLink / set | QString | Channel link URL |
| channelCopyright / set | QString | Copyright notice |
| channelEditor / set | QString | Managing editor |
| channelAuthor / set | QString | Channel author |
| channelAuthorIsDefault / set | bool | Whether author is default for items |
| channelOwnerName / set | QString | Owner name (iTunes) |
| channelOwnerEmail / set | QString | Owner email (iTunes) |
| channelWebmaster / set | QString | Webmaster contact |
| channelLanguage / set | QString | Language code |
| channelExplicit / set | bool | Explicit content flag |
| channelImageId / set | int | Channel-level image reference |
| defaultItemImageId / set | int | Default image for new items |

### Publishing Configuration
| Property | Type | Description |
|----------|------|-------------|
| baseUrl / set | QString | Base URL for published content (overloaded: with/without feed_id parameter) |
| basePreamble / set | QString | URL preamble |
| purgeUrl / set | QString | URL for content purging |
| purgeUsername / set | QString | Purge authentication username |
| purgePassword / set | QString | Purge authentication password |
| purgeUseIdFile / set | bool | Whether to use SSH identity file for purge |
| rssSchema / set | RDRssSchemas enum | RSS schema type (including Custom) |
| headerXml / set | QString | Custom header XML template |
| channelXml / set | QString | Custom channel XML template |
| itemXml / set | QString | Custom item XML template |
| castOrder / set | QString | Podcast item ordering (asc/desc) |
| maxShelfLife / set | int | Maximum days before expiration (0=never) |
| lastBuildDateTime / set | QDateTime | Last RSS build timestamp |
| originDateTime / set | QDateTime | Feed creation timestamp |
| enableAutopost / set | bool | Auto-activate new podcasts |

### Upload Audio Settings
| Property | Type | Description |
|----------|------|-------------|
| uploadFormat / set | RDSettings format | Audio encoding format |
| uploadChannels / set | unsigned | Audio channel count |
| uploadQuality / set | int | Encoding quality |
| uploadBitRate / set | unsigned | Audio bit rate |
| uploadSampleRate / set | unsigned | Audio sample rate |
| uploadExtension / set | QString | File extension for uploads |
| uploadMimetype / set | QString | MIME type for uploads |
| normalizeLevel / set | int | Audio normalization level (divided by 100 when used) |

## 7. Key Methods

### Content Posting
| Method | Returns | Description |
|--------|---------|-------------|
| `postCut(cutname, *err)` | unsigned (cast_id) | Exports audio from a library cut, converts to upload format, creates podcast entry, uploads to remote store, updates RSS XML. 5-step progress. |
| `postFile(srcfile, *err)` | unsigned (cast_id) | Converts an external audio file, creates podcast entry, uploads, updates RSS. Extracts metadata (title) from wave file. 6-step progress. |
| `postLog(logname, start_time, stop_at_stop, start_line, end_line, *err)` | unsigned (cast_id) | Renders a log (range of log lines) to audio, creates podcast, uploads. Uses RDRenderer. Progress proportional to line count. |
| `postPodcast(cast_id)` | bool | Uploads a podcast audio file to the web service (RDXPORT_COMMAND_POST_PODCAST via libcurl). |
| `postXml()` | bool | Triggers RSS XML regeneration on the server (RDXPORT_COMMAND_POST_RSS via libcurl). |
| `postXmlConditional(caption, widget)` | bool | Calls postXml() with a warning dialog on failure. |

### RSS Generation
| Method | Returns | Description |
|--------|---------|-------------|
| `rssXml(*err_msg, now, *ok)` | QString | Generates complete RSS XML document. Loads channel data from FEEDS, resolves schema templates (or custom XML), renders channel and item sections. For superfeeds, aggregates items from all member feeds. Filters items by StatusActive, effective/expiration dates. |
| `feedUrl()` | QString | Returns the full RSS feed URL: purgeUrl + "/" + keyName + ".rss" |
| `audioUrl(cast_id)` | QString | Returns the full URL of a podcast's audio file |
| `imageUrl(img_id)` | QString | Returns the full URL of a feed image |

### Image Management
| Method | Returns | Description |
|--------|---------|-------------|
| `importImageFile(pathname, *err_msg, desc)` | int (image_id) | Loads image from file, validates dimensions against schema min/max, stores as BLOB in FEED_IMAGES table |
| `deleteImage(img_id)` | void | Removes an image |
| `postImage(img_id)` | bool | Uploads image to remote store via web service |
| `removeImage(img_id)` | bool | Removes image from remote store |
| `removeAllImages()` | void | Iterates all images for this feed and removes each |
| `imageData(img_id)` | QByteArray | Retrieves image binary data |

### Feed Lifecycle
| Method | Returns | Description |
|--------|---------|-------------|
| `create(keyname, enable_users, *err_msg)` | unsigned (static) | Creates new feed in FEEDS table. Checks for duplicate key name. Optionally creates default FEED_PERMS for non-admin users. |
| `removeRss()` | bool | Removes the RSS XML from the remote store (RDXPORT_COMMAND_REMOVE_RSS) |
| `subfeedNames()` | QStringList | Returns key names of member feeds (from SUPERFEED_MAPS table) |
| `isSubfeedOf(keyname)` | bool | Checks if this feed is a sub-feed of another |

### Helpers (private)
| Method | Purpose |
|--------|---------|
| `CreateCast(*filename, bytes, msecs)` | Creates PODCASTS DB record with metadata inherited from feed channel. Sets status based on enableAutopost. Generates filename pattern `NNNNNN_NNNNNN.ext`. |
| `SavePodcast(cast_id, src_filename)` | Uploads audio file to web service via multipart POST (RDXPORT_COMMAND_SAVE_PODCAST) |
| `ResolveChannelWildcards(template, query, now)` | Substitutes placeholders in RSS channel template |
| `ResolveItemWildcards(template, query, chan_query)` | Substitutes placeholders in RSS item template |
| `GetTempFilename()` | Generates temporary file path |
| `SetupCurlLogging(curl)` / `ProcessCurlLogging(tag, msgs)` | Debug logging for HTTP transfers |
| `SetRow` (3 overloads) | Generic DB setter for different value types |

## 8. SQL Tables Accessed

| Table | Operations | Purpose |
|-------|-----------|---------|
| `FEEDS` | SELECT, INSERT, UPDATE | Primary feed configuration storage |
| `PODCASTS` | SELECT, INSERT, UPDATE | Individual podcast items |
| `FEED_IMAGES` | SELECT, INSERT, DELETE | Feed and item images (with BLOB data) |
| `SUPERFEED_MAPS` | SELECT | Superfeed-to-subfeed membership |
| `FEED_PERMS` | INSERT | Per-user feed access permissions |
| `USERS` | SELECT | User lookup for default permissions |

## 9. Key SQL Queries

- Feed lookup: `SELECT ID FROM FEEDS WHERE KEY_NAME=?`
- RSS generation: Complex JOIN of FEEDS + FEED_IMAGES for channel data
- Podcast items: JOIN of PODCASTS + FEEDS + FEED_IMAGES, filtered by STATUS=Active, EFFECTIVE_DATETIME<=now(), EXPIRATION_DATETIME>now() or NULL
- Superfeed aggregation: SELECT MEMBER_FEED_ID FROM SUPERFEED_MAPS, then OR-joined PODCASTS.FEED_ID conditions
- Image import: INSERT INTO FEED_IMAGES with BLOB data

## 10. External Dependencies

- **libcurl**: All remote operations (POST/REMOVE podcast, RSS, image) use libcurl multipart form POST
- **RDAudioConvert** / **RDAudioExport**: Audio format conversion for postFile/postCut
- **RDRenderer**: Log rendering to audio for postLog
- **RDRssSchemas**: RSS template loading and schema validation (image size constraints)
- **RDConfig**: System configuration
- **RDSqlQuery**: All DB operations
- **SERVER_NAME env var**: CGI hostname detection

## 11. Linux-Specific

- `getenv("SERVER_NAME")` — reads CGI environment variable
- `unlink()` — temp file cleanup after audio conversion
