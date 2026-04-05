---
partial_id: "057"
class: RDReplicator
sources:
  - lib/rdreplicator.h
  - lib/rdreplicator.cpp
status: done
phase: 2
---

# RDReplicator — Replication Configuration Model

## Purpose

Represents a replicator configuration -- a mechanism for exporting/replicating audio content to an external system. Provides property-level read/write access to a replicator record in the database, including audio format settings, target URL, credentials, and metadata options.

## Enums

### Type
| Value | Name | String Representation |
|-------|------|----------------------|
| 0 | `TypeCitadelXds` | "Citadel X-Digital Portal" |
| 1 | `TypeLast` | (sentinel) |

## Constructor

- `RDReplicator(const QString &name)` — Loads replicator by name (lazy: no initial DB read, values fetched on demand).

## Public Interface

| Method | Returns | Description |
|--------|---------|-------------|
| `name()` | `QString` | Replicator name (identifier) |
| `type()` / `setType(type)` | `Type` / `void` | Replicator type (see enum) |
| `stationName()` / `setStationName(str)` | `QString` / `void` | Station assigned to run replication |
| `description()` / `setDescription(str)` | `QString` / `void` | Human-readable description |
| `format()` / `setFormat(fmt)` | `RDSettings::Format` / `void` | Audio export format |
| `channels()` / `setChannels(chans)` | `unsigned` / `void` | Channel count |
| `sampleRate()` / `setSampleRate(rate)` | `unsigned` / `void` | Sample rate |
| `bitRate()` / `setBitRate(rate)` | `unsigned` / `void` | Bit rate |
| `quality()` / `setQuality(qual)` | `unsigned` / `void` | Quality level |
| `url()` / `setUrl(str)` | `QString` / `void` | Target URL for replication |
| `urlUsername()` / `setUrlUsername(str)` | `QString` / `void` | Authentication username |
| `urlPassword()` / `setUrlPassword(str)` | `QString` / `void` | Authentication password |
| `enableMetadate()` / `setEnableMetadata(state)` | `bool` / `void` | Whether to replicate metadata |
| `normalizeLevel()` / `setNormalizeLevel(lvl)` | `int` / `void` | Audio normalization level |
| `typeString()` | `QString` | Current type as display string |
| `typeString(type)` (static) | `QString` | Type enum to display string |

## Database Mapping

| Table | Key Column | Key Value | CRUD |
|-------|-----------|-----------|------|
| `REPLICATORS` | `NAME` | `replicator_name` | R/U |

### Columns Accessed

| DB Column | Property | Type |
|-----------|----------|------|
| `TYPE_ID` | type | unsigned (enum) |
| `STATION_NAME` | stationName | string |
| `DESCRIPTION` | description | string |
| `FORMAT` | format | unsigned (enum) |
| `CHANNELS` | channels | unsigned |
| `SAMPRATE` | sampleRate | unsigned |
| `BITRATE` | bitRate | unsigned |
| `QUALITY` | quality | unsigned |
| `URL` | url | string |
| `URL_USERNAME` | urlUsername | string |
| `URL_PASSWORD` | urlPassword | string |
| `ENABLE_METADATA` | enableMetadata | Y/N string |
| `NORMALIZATION_LEVEL` | normalizeLevel | int |

## Notes

- `enableMetadate()` reads column `ENABLE_PASSWORD` (likely a bug -- should read `ENABLE_METADATA`), while `setEnableMetadata()` correctly writes to `ENABLE_METADATA`.
- Lazy loading pattern: no data cached, every getter performs a SQL SELECT.

## Dependencies

- Not a QObject, plain C++ class
- Uses `RDSettings::Format` enum for audio format
