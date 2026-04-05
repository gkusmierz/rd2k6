---
partial_id: "028"
class: RDPodcast
source_files:
  - lib/rdpodcast.h
  - lib/rdpodcast.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDPodcast — Inventory Partial

## 1. Class Purpose

RDPodcast represents a single podcast episode/item within a feed. It manages podcast metadata (title, description, author, audio info, status, expiration) persisted in the PODCASTS table. Provides operations for removing podcast audio from the remote store and deleting the DB record.

## 2. Inheritance & QObject Status

- **Parent class:** None (plain C++ class, no QObject inheritance despite being described as QObject in task)
- **Q_OBJECT macro:** No
- **Constructor:**
  - `RDPodcast(RDConfig *config, unsigned id)` — loads by numeric ID. Resolves the feed key name via JOIN of PODCASTS and FEEDS tables.

## 3. Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `Status` | StatusPending=1, StatusActive=2, StatusExpired=3 | Podcast lifecycle status. Only Active items appear in RSS output. |

## 4. Signals

None. Not a QObject.

## 5. Slots

None. Not a QObject.

## 6. Key Properties (getter/setter pairs via DB)

All properties read/write from the `PODCASTS` MySQL table via `RDGetSqlValue`/`SetRow` pattern.

### Identity
| Property | Type | Description |
|----------|------|-------------|
| id | unsigned | Unique podcast ID (read-only) |
| keyName | QString | Parent feed's key name (read-only, resolved via JOIN) |
| exists | bool | Whether record exists in DB |
| feedId / setFeedId | unsigned | Parent feed's numeric ID |

### Item Metadata
| Property | Type | Description |
|----------|------|-------------|
| itemTitle / set | QString | Episode title |
| itemDescription / set | QString | Episode description |
| itemExplicit / set | bool | Explicit content flag |
| itemImageId / set | int | Image reference for this item |
| itemCategory / set | QString | Episode category |
| itemLink / set | QString | Episode link URL |
| itemAuthor / set | QString | Episode author |
| itemComments / set | QString | Comments URL |
| itemSourceText / set | QString | Source attribution text |
| itemSourceUrl / set | QString | Source attribution URL |

### Origin & Scheduling
| Property | Type | Description |
|----------|------|-------------|
| originLoginName / set | QString | User who created this podcast |
| originStation / set | QString | Station where podcast was created |
| originDateTime / set | QDateTime | Creation timestamp |
| effectiveDateTime / set | QDateTime | When podcast becomes visible in RSS |
| expirationDateTime / set | QDateTime | When podcast expires from RSS (NULL=never) |
| status / set | Status enum | Current lifecycle status (Pending/Active/Expired) |

### Audio
| Property | Type | Description |
|----------|------|-------------|
| audioFilename / set | QString | Filename on the remote store |
| audioLength / set | unsigned | Audio file size in bytes |
| audioTime / set | unsigned | Audio duration in milliseconds |
| sha1Hash / set | QString | SHA-1 hash of audio content |

## 7. Key Methods

### Audio & Lifecycle Operations
| Method | Returns | Description |
|--------|---------|-------------|
| `dropAudio(feed, *err_text, log_debug)` | bool | Removes podcast from remote store, then deletes DB record. Two-step: removePodcast() + DeletePodcast(). |
| `removePodcast()` | bool | Removes podcast audio from remote file store via web service (RDXPORT_COMMAND_REMOVE_PODCAST, libcurl multipart POST). |
| `guid(url, filename, feed_id, cast_id)` | QString (static) | Generates globally unique ID: url + "/" + filename + "_NNNNNN_NNNNNN" |
| `guid(full_url, feed_id, cast_id)` | QString (static) | Alternate GUID format: full_url + "_NNNNNN_NNNNNN" |

### Helpers (private)
| Method | Purpose |
|--------|---------|
| `DeletePodcast(cast_id)` | Deletes podcast from DB and remote store via web service (RDXPORT_COMMAND_DELETE_PODCAST, libcurl) |
| `SetupCurlLogging(curl)` / `ProcessCurlLogging(tag, msgs)` | Debug logging for HTTP operations |
| `SetRow` (3 overloads) | Generic DB setter for different value types |

## 8. SQL Tables Accessed

| Table | Operations | Purpose |
|-------|-----------|---------|
| `PODCASTS` | SELECT, UPDATE, (via DeletePodcast: server-side delete) | Primary podcast storage |
| `FEEDS` | SELECT (JOIN) | Resolve feed key name from feed ID |

## 9. Key SQL Queries

- Constructor lookup: `SELECT FEEDS.KEY_NAME FROM PODCASTS LEFT JOIN FEEDS ON (PODCASTS.FEED_ID=FEEDS.ID) WHERE PODCASTS.ID=?`
- All property getters: `RDGetSqlValue("PODCASTS", "ID", podcast_id, "COLUMN_NAME")`
- All property setters: `SetRow("COLUMN_NAME", value)` which internally does UPDATE PODCASTS SET ... WHERE ID=?

## 10. External Dependencies

- **libcurl**: Remote podcast removal and deletion via multipart HTTP POST to web service
- **RDConfig**: System configuration
- **RDSqlQuery**: All DB operations
- **rda global**: Access to user credentials, station info, web service URL

## 11. Linux-Specific

None identified. All platform-specific operations are handled via libcurl.
