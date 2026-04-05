---
partial_id: "042"
class: RDLibraryConf
source_files:
  - lib/rdlibrary_conf.h
  - lib/rdlibrary_conf.cpp
phase: 2
status: done
---

# RDLibraryConf — RDLibrary Application Configuration (DB)

## Purpose
Manages per-station configuration for the RDLibrary cart/cut management application. Covers audio recording defaults, CD ripper settings, metadata server selection, and search behavior.

## Data Source
- **Table**: `RDLIBRARY`
- **Key**: `STATION` column (station name)
- Also reads `SAMPLE_RATE` from `SYSTEM` table (in `getSettings()`)

## Constructor
`RDLibraryConf(station)` — creates row in RDLIBRARY if not exists for this station.

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## Enums

### RecordMode
`Manual=0`, `Vox=1` — recording trigger mode

### SearchLimit
`LimitNo=0`, `LimitYes=1`, `LimitPrevious=2` — search result limiting

### CdServerType
`DummyType=0` (None), `CddbType=1` (CDDB), `MusicBrainzType=2` (MusicBrainz)

## DB Table: RDLIBRARY

| Column | Accessor | Description |
|--------|----------|-------------|
| INPUT_CARD / INPUT_PORT | `inputCard()` / `inputPort()` | Audio input card and port for recording |
| OUTPUT_CARD / OUTPUT_PORT | `outputCard()` / `outputPort()` | Audio output card and port for playback |
| VOX_THRESHOLD | `voxThreshold()` | VOX activation threshold (dBFS) |
| TRIM_THRESHOLD | `trimThreshold()` | Auto-trim threshold (dBFS) |
| DEFAULT_FORMAT | `defaultFormat()` | Default recording format (PCM16/MPEG L2) |
| DEFAULT_CHANNELS | `defaultChannels()` | Default channel count |
| DEFAULT_LAYER | `defaultLayer()` | Default MPEG layer |
| DEFAULT_BITRATE | `defaultBitrate()` | Default encoding bitrate |
| DEFAULT_RECORD_MODE | `defaultRecordMode()` | Manual or VOX recording |
| DEFAULT_TRIM_STATE | `defaultTrimState()` | Auto-trim enabled by default |
| MAX_LENGTH | `maxLength()` | Maximum recording length |
| TAIL_PREROLL | `tailPreroll()` | Tail preroll for editing |
| RIPPER_DEVICE | `ripperDevice()` | CD ripper device path |
| PARANOIA_LEVEL | `paranoiaLevel()` | CD paranoia error correction level |
| RIPPER_LEVEL | `ripperLevel()` | Ripper normalization level |
| CD_SERVER_TYPE | `cdServerType()` | Metadata lookup service type |
| CDDB_SERVER | `cddbServer()` | CDDB server hostname |
| MB_SERVER | `mbServer()` | MusicBrainz server hostname |
| READ_ISRC | `readIsrc()` | Read ISRC codes from CD |
| ENABLE_EDITOR | `enableEditor()` | Enable waveform editor |
| SRC_CONVERTER | `srcConverter()` | Sample rate converter type |
| LIMIT_SEARCH | `limitSearch()` | Search result limit mode |
| SEARCH_LIMITED | `searchLimited()` | Search is currently limited |

## Key Methods
- `getSettings(RDSettings*)` — populates an `RDSettings` object with recording defaults (channels, format, bitrate, levels) + system sample rate
- `cdServerTypeText(type)` — human-readable CD server type name
- `cdServerLogo(type)` — logo resource path for CD server type
- `SetRow()` — generic DB column write (int, unsigned, string variants)
