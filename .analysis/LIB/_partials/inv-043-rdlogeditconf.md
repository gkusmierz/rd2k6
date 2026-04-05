---
partial_id: "043"
class: RDLogeditConf
source_files:
  - lib/rdlogedit_conf.h
  - lib/rdlogedit_conf.cpp
phase: 2
status: done
---

# RDLogeditConf — RDLogEdit Application Configuration (DB)

## Purpose
Manages per-station configuration for the RDLogEdit log editing application. Covers audio I/O settings, recording defaults, voicetrack parameters, and macro cart triggers.

## Data Source
- **Table**: `RDLOGEDIT`
- **Key**: `STATION` column (station name)
- Also reads `SAMPLE_RATE` from `SYSTEM` table (in `getSettings()`)

## Constructor
`RDLogeditConf(station)` — creates row in RDLOGEDIT if not exists for this station.

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## DB Table: RDLOGEDIT

| Column | Accessor | Description |
|--------|----------|-------------|
| INPUT_CARD / INPUT_PORT | `inputCard()` / `inputPort()` | Audio input card and port for voicetrack recording |
| OUTPUT_CARD / OUTPUT_PORT | `outputCard()` / `outputPort()` | Audio output card and port for playback |
| FORMAT | `format()` | Recording format (PCM16/MPEG L2) |
| DEFAULT_CHANNELS | `defaultChannels()` | Default channel count |
| LAYER | `layer()` | MPEG layer |
| BITRATE | `bitrate()` | Encoding bitrate |
| ENABLE_SECOND_START | `enableSecondStart()` | Enable second start button |
| MAX_LENGTH | `maxLength()` | Maximum recording length |
| TAIL_PREROLL | `tailPreroll()` | Tail preroll for editing |
| WAVEFORM_CAPTION | `waveformCaption()` | Waveform display caption mode |
| START_CART | `startCart()` | Cart to execute on voicetrack start |
| END_CART | `endCart()` | Cart to execute on voicetrack end |
| REC_START_CART | `recStartCart()` | Cart to execute on record start |
| REC_END_CART | `recEndCart()` | Cart to execute on record end |
| TRIM_THRESHOLD | `trimThreshold()` | Auto-trim threshold (dBFS) |
| RIPPER_LEVEL | `ripperLevel()` | Normalization level |
| DEFAULT_TRANS_TYPE | `defaultTransType()` | Default transition type |

## Key Methods
- `getSettings(RDSettings*)` — populates an `RDSettings` object with recording defaults (channels, format, bitrate, levels) + system sample rate from SYSTEM table
- `SetRow()` — generic DB column write (int, unsigned, string, bool variants)
