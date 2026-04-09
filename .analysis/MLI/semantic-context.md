# MLI — MairList Integration: Schema Registry & Test Data

## Purpose
**Starting point for all implementations needing real radio data or database schema knowledge.**

This artifact serves as:
1. **Rivendell Schema Registry** — complete MySQL schema (v3.6, 90+ tables, schema version 347),
   consolidating definitions found across multiple source artifacts (LIB, ADM, UTL, etc.)
2. **Test Data Gateway** — access to real-world Radio 929 FM data (music, playlists, voicetracks)
   via hexagonal port/adapter architecture
3. **Migration Toolkit** — MairList→cart-based migration with Python scripts and 19 passing tests

Any future artifact that needs:
- Database table definitions → read `semantic-context.md` or `rivendell-schema.sql`
- Real audio files for testing → use `MediaFilePort` adapter
- Sample playlists/logs → use `SourceDataPort` adapter
- Pre-populated test database → run migration CLI

## Rivendell Schema Overview

### Cart-Based Content Model
Rivendell uses a **cart/cut** model where:
- **CART** = logical container (like a CD) with metadata (title, artist, group, scheduler codes)
- **CUT** = physical audio file within a cart (a cart can have multiple cuts for rotation)
- **GROUP** = organizational category for carts, with cart number ranges

### Core Domain Tables (migration-relevant)

| Table | Purpose | Rows (typical) |
|-------|---------|----------------|
| CART | Audio content metadata | ~thousands |
| CUTS | Physical audio cuts per cart | ~thousands |
| GROUPS | Cart groupings | ~tens |
| LOGS | Broadcast logs (playlists) | ~hundreds |
| LOG_LINES (dynamic) | Lines within a log | ~thousands/log |
| SERVICES | Broadcast services/channels | ~few |
| SCHED_CODES | Scheduler codes | ~tens |
| CLOCKS | Hourly scheduling templates | ~tens |
| EVENTS | Scheduling events | ~tens |

### Supporting Tables (configuration, not migrated)

| Table | Purpose |
|-------|---------|
| STATIONS | Station hardware config |
| USERS | User accounts and privileges |
| SYSTEM | Global system config |
| AUDIO_CARDS, AUDIO_INPUTS, AUDIO_OUTPUTS | Audio hardware |
| MATRICES, INPUTS, OUTPUTS, GPIS, GPOS | Audio switching |
| RECORDINGS, DECKS | Scheduled recordings |
| FEEDS, PODCASTS | Podcast management |
| RDAIRPLAY, RDLIBRARY, RDLOGEDIT, etc. | App-specific config |
| PANELS, EXTENDED_PANELS | Sound panel buttons |
| REPLICATORS, REPL_CART_STATE, REPL_CUT_STATE | Content replication |
| REPORTS, ELR_LINES | Reporting/reconciliation |
| DROPBOXES | Auto-import config |

### Dynamic Tables
- `{LOG_NAME}_LOG` — one table per log, containing log lines
- `{SERVICE}_SRT` — service reconciliation tables
- `{FEED_KEY}_FIELDS` — custom podcast fields
- `CLOCK_LINES` — lines within clock templates (per clock)
- `RULE_LINES` — scheduling rule lines (per event)

## MairList Schema Overview

MairList uses an **item-based** model (not cart/cut):
- **items** = flat table with all content (music, jingles, voicetracks, etc.)
- **playlist** = scheduled playlist entries per station/slot/position
- **playlistlog** = actual playback log
- **folders** = hierarchical organization (not cart ranges)
- **storages** = file storage locations (mapped to Windows drives)

### Key MairList Tables

| Table | Rows | Purpose |
|-------|------|---------|
| items | 2,296 | All media items |
| item_attributes | 43,162 | Key-value metadata per item |
| item_cuemarkers | 13,271 | Cue points (CueIn/Out, FadeOut, StartNext, Hook, etc.) |
| playlist | 15,092 | Scheduled playlist entries |
| playlistlog | 12,452 | Actual playback history |
| playlist_info | 558 | Playlist slot metadata |
| folders | 26 | Hierarchical folders |
| storages | 6 | File storage definitions |
| stations | 2 | Broadcast stations |

### MairList Item Types
| Type | Count |
|------|-------|
| Music | 2,079 |
| Instrumental | 152 |
| Jingle | 29 |
| Drop | 23 |
| Weather | 8 |
| News | 5 |

### MairList File Formats
| Format | Count |
|--------|-------|
| FLAC | 2,182 |
| WAV | 98 |
| MP3 | 14 |

## Test Data Source

| Resource | Path | Description |
|----------|------|-------------|
| MairList DB | `/data/929-sync-2025-03-14/dump/20250314.mldb` | SQLite database |
| Music files | `/data/929-sync-2025-03-14/mus/` | 2,086 files (FLAC/WAV) |
| Jingles | `/data/929-sync-2025-03-14/jin/` | 27 files + subfolders |
| Beds | `/data/929-sync-2025-03-14/bed/` | 132 files in subfolders |
| News | `/data/929-sync-2025-03-14/nws/` | 15 files + stories/ |
| Drones | `/data/929-sync-2025-03-14/drn/` | 20 files |
| VoiceTracks | `/data/929-sync-2025-03-14/vtx/` | 1,862 files (WAV) |
| Playlists (MairList) | `/data/929-sync-2025-03-14/ply/` | .mlp files |
| Logs (MusicMaster) | `/data/929-sync-2025-03-14/logi-mm/` | .TPI files |
| Playlist XML dump | `/data/929-sync-2025-03-14/dump/ply-xml/` | XML playlist exports |
| CSV export | `/data/929-sync-2025-03-14/dump/250314.csv` | Database CSV export |

### MairList Storages → Disk Mapping
| Storage ID | Name | MairList Path | Disk Path |
|------------|------|---------------|-----------|
| 1 | Mus | X:\mus | /data/929-sync-2025-03-14/mus/ |
| 2 | jin | X:\jin | /data/929-sync-2025-03-14/jin/ |
| 3 | bed | X:\bed | /data/929-sync-2025-03-14/bed/ |
| 4 | nws | X:\nws | /data/929-sync-2025-03-14/nws/ |
| 5 | drn | X:\drn | /data/929-sync-2025-03-14/drn/ |
| 6 | vtx | X:\vtx | /data/929-sync-2025-03-14/vtx/ |

### VoiceTrack Discovery
VoiceTracks in MairList are NOT stored as items in the database. They are referenced
inline in playlist XML data:
```xml
<PlaylistItem Class="File">
  <Filename>X:\vtx\VoiceTrack-{UUID}.wav</Filename>
  <Title>VoiceTrack-YYYYMMDD-HHMMSS</Title>
  <Type>Voice</Type>
  <Duration>23.661</Duration>
  <Markers>
    <Marker Type="StartNext" Position="4.703"/>
  </Markers>
</PlaylistItem>
```
- 702 playlist entries reference voicetracks
- 1,862 voicetrack WAV files on disk
- Voicetracks need to be imported as separate carts in Rivendell
