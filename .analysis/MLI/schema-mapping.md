# Schema Mapping: MairList → Rivendell (Cart-Based)

## Migration Scope

### In-Scope (data to migrate)
1. **Music library** (items → CART + CUTS)
2. **Cue points** (item_cuemarkers → CUTS marker fields)
3. **Metadata attributes** (item_attributes → CART fields)
4. **Playlists/Logs** (playlist → LOGS + LOG_LINES)
5. **VoiceTracks** (playlist xmldata → CART + CUTS)
6. **Groups** (folders/storages → GROUPS)
7. **Playback history** (playlistlog → ELR_LINES or custom log)

### Out-of-Scope
- Station hardware config (STATIONS, AUDIO_CARDS, MATRICES, etc.)
- User accounts and permissions
- Recording schedules (RECORDINGS, DECKS)
- Podcast feeds
- Panel/button assignments
- Replication config
- Import templates and dropboxes

---

## Table-Level Mapping

### 1. Items → CART + CUTS

#### CART (from items)

| Rivendell CART | Type | MairList Source | Transform |
|----------------|------|-----------------|-----------|
| NUMBER | int unsigned | Auto-generated | Sequential from group range |
| TYPE | int unsigned | items.type | Music→1, Macro→2 |
| GROUP_NAME | char(10) | items.type + storage | Map type→group |
| TITLE | char(255) | items.title | Direct copy |
| ARTIST | char(255) | items.artist | Direct copy |
| ALBUM | char(255) | item_attributes['Album'] | Lookup |
| YEAR | date | item_attributes['Year'] | Parse year→date |
| COMPOSER | char(64) | item_attributes['COMPOSER'] | Lookup |
| PUBLISHER | char(64) | item_attributes['PUBLISHER'] | Lookup |
| SONG_ID | char(32) | items.externalid | Direct copy |
| BPM | int unsigned | item_attributes['BPM'] | Parse int |
| AVERAGE_LENGTH | int unsigned | items.duration * 1000 | Seconds→milliseconds |
| CUT_QUANTITY | int unsigned | 1 | Always 1 (single cut per cart) |
| LAST_CUT_PLAYED | int unsigned | 0 | Reset |
| PLAY_ORDER | int unsigned | 0 | Sequential |
| VALIDITY | int unsigned | 2 | Valid always |
| ENFORCE_LENGTH | enum | 'N' | Default |
| SCHED_CODES | varchar(255) | items.type | Map to scheduler codes |
| MACROS | text | NULL | Not applicable |
| NOTES | text | items.comment | Direct copy |
| METADATA_DATETIME | datetime | items.updated | Direct copy |

#### CUTS (from items)

| Rivendell CUTS | Type | MairList Source | Transform |
|----------------|------|-----------------|-----------|
| CUT_NAME | char(12) | Generated | Format: {CART_NUM:06d}_{001} |
| CART_NUMBER | int unsigned | From CART.NUMBER | FK reference |
| DESCRIPTION | char(64) | items.title | Truncate to 64 |
| ISRC | char(12) | item_attributes['ISRC'] | Lookup |
| LENGTH | int unsigned | items.duration * 1000 | Seconds→ms |
| ORIGIN_DATETIME | datetime | items.created | Direct copy |
| ORIGIN_NAME | char(64) | 'MairList Import' | Constant |
| WEIGHT | int unsigned | 1 | Default |
| PLAY_COUNTER | int unsigned | 0 | Reset |
| CODING_FORMAT | int unsigned | From file extension | FLAC=4, WAV=0, MP3=1 |
| SAMPLE_RATE | int unsigned | 44100 | Default (verify from files) |
| BIT_RATE | int unsigned | 0 | Varies |
| CHANNELS | int unsigned | 2 | Default stereo |
| PLAY_GAIN | int | items.amplification * 100 | dB→centidB |
| START_POINT | int | cuemarker['CueIn'] * 1000 | Seconds→ms, -1 if absent |
| END_POINT | int | cuemarker['CueOut'] * 1000 | Seconds→ms, -1 if absent |
| FADEUP_POINT | int | cuemarker['FadeIn'] * 1000 | Seconds→ms, -1 if absent |
| FADEDOWN_POINT | int | cuemarker['FadeOut'] * 1000 | Seconds→ms, -1 if absent |
| SEGUE_START_POINT | int | cuemarker['StartNext'] * 1000 | Seconds→ms, -1 if absent |
| SEGUE_END_POINT | int | LENGTH | End of cut |
| HOOK_START_POINT | int | cuemarker['HookIn'] * 1000 | Seconds→ms, -1 if absent |
| HOOK_END_POINT | int | cuemarker['HookOut'] * 1000 | Seconds→ms, -1 if absent |
| TALK_START_POINT | int | cuemarker['Ramp1'] * 1000 | Ramp→talk start |
| TALK_END_POINT | int | cuemarker['Ramp2'] * 1000 | Ramp end→talk end, -1 if absent |

### 2. Cue Marker Mapping

| MairList Marker | Rivendell CUTS Field | Notes |
|-----------------|----------------------|-------|
| CueIn | START_POINT | Start trim |
| CueOut | END_POINT | End trim |
| FadeIn | FADEUP_POINT | Fade-in end |
| FadeOut | FADEDOWN_POINT | Fade-out start |
| StartNext | SEGUE_START_POINT | Segue trigger |
| HookIn | HOOK_START_POINT | Hook preview start |
| HookOut | HOOK_END_POINT | Hook preview end |
| Ramp1 | TALK_START_POINT | Talk-over ramp start |
| Ramp2 | TALK_END_POINT | Talk-over ramp end |
| Ramp3 | (not mapped) | No Rivendell equivalent |
| LoopIn | (not mapped) | No Rivendell equivalent |
| LoopOut | (not mapped) | No Rivendell equivalent |
| Preroll | (not mapped) | No Rivendell equivalent |
| Anchor | (not mapped) | No Rivendell equivalent |
| FadeEnd | (not mapped) | Covered by FADEDOWN_POINT + duration |
| Outro | (not mapped) | Could map to custom field |

### 3. EndType Mapping

| MairList EndType | Meaning | Rivendell Equivalent |
|------------------|---------|---------------------|
| C | Cold end | SEGUE_START = END_POINT (no segue) |
| F | Fade out | FADEDOWN_POINT set |
| D | Defined end (segue) | SEGUE_START_POINT set |
| V | Voice-over capable | TALK markers set |
| CV | Cold + voice | Both patterns |
| FV | Fade + voice | Both patterns |
| DV | Defined + voice | Both patterns |

### 4. Groups Mapping

| MairList Type/Storage | Rivendell GROUP | Cart Range |
|-----------------------|-----------------|------------|
| Music (storage: Mus) | MUSIC | 010000-019999 |
| Instrumental | INSTRU | 020000-029999 |
| Jingle (storage: jin) | JINGLE | 030000-039999 |
| Drop | DROP | 040000-049999 |
| Weather | WEATHER | 050000-059999 |
| News | NEWS | 060000-069999 |
| VoiceTrack | VOICE | 070000-079999 |
| Bed (storage: bed) | BED | 080000-089999 |
| Drone (storage: drn) | DRONE | 090000-099999 |

### 5. Playlist → LOG

#### LOGS (from playlist unique slots)

| Rivendell LOGS | MairList Source | Transform |
|----------------|-----------------|-----------|
| NAME | playlist.slot (date) | Format: YYYY-MM-DD-HH |
| SERVICE | stations.name | Map to service code |
| DESCRIPTION | Generated | "Imported from MairList {date}" |
| ORIGIN_USER | 'mairlist-import' | Constant |
| ORIGIN_DATETIME | NOW() | Import timestamp |
| START_DATE | playlist.slot (date) | Extract date |

#### LOG_LINES (from playlist rows)

| Rivendell LOG_LINE | MairList Source | Transform |
|--------------------|-----------------|-----------|
| COUNT | Auto-increment | Per log |
| ID | Auto-increment | Global |
| CART_NUMBER | playlist.item → items → CART.NUMBER | Cross-reference |
| TRANS_TYPE | 0 | Default (PLAY) |
| START_TIME | playlist.fixtime | Parse from xmldata |
| TYPE | 0 | Default (CART) |
| SOURCE | 0 | Default |
| TIME_TYPE | Hard if fixtime set, else Relative | From xmldata/timing |

### 6. VoiceTrack Import

VoiceTracks from MairList need special handling:
1. Parse playlist xmldata for `<Type>Voice</Type>` entries
2. Extract filename UUID: `VoiceTrack-{UUID}.wav`
3. Create CART in VOICE group
4. Create CUT with audio file reference
5. Map StartNext marker from voicetrack xmldata to SEGUE_START_POINT
6. Insert into LOG_LINES at correct position

---

## Key Differences and Implications

### 1. Single Item vs Cart/Cut
- **MairList:** One item = one file, flat structure
- **Rivendell:** Cart (metadata) → multiple Cuts (audio files)
- **Implication:** Each MairList item becomes one CART with exactly one CUT

### 2. External ID vs Cart Number
- **MairList:** String `externalid` (e.g., "0001M01")
- **Rivendell:** Integer `NUMBER` in defined ranges per group
- **Implication:** Need mapping table from externalid → cart number

### 3. Metadata Storage
- **MairList:** Key-value pairs in `item_attributes` table
- **Rivendell:** Fixed columns on CART table
- **Implication:** Many attributes (BPM, ISRC, Album, etc.) become direct columns

### 4. Cue Points
- **MairList:** Named markers with float positions (seconds)
- **Rivendell:** Fixed-name fields with integer positions (milliseconds)
- **Implication:** Direct mapping with unit conversion (×1000), some markers lost

### 5. Playlists vs Logs
- **MairList:** Station + slot + position composite key, items by reference + inline XML
- **Rivendell:** Named logs with per-log dynamic tables, items by cart number
- **Implication:** Need to group playlist entries by date/hour into named logs

### 6. VoiceTracks
- **MairList:** Inline in playlist XML, not in items table
- **Rivendell:** Full carts in a VOICE group, referenced in log lines
- **Implication:** Must extract from XML, create carts, link in logs

### 7. Audio File Storage
- **MairList:** Direct file paths per storage (Windows-style X:\mus\filename.flac)
- **Rivendell:** Standardized paths: /var/snd/{CUT_NAME}.wav
- **Implication:** Files need conversion to WAV and renaming to CUT_NAME format

### 8. Amplification/Gain
- **MairList:** Float dB value (e.g., -7.0)
- **Rivendell:** Integer centidB (e.g., -700)
- **Implication:** Multiply by 100 and round

### 9. Duration
- **MairList:** Float seconds (e.g., 269.468994)
- **Rivendell:** Integer milliseconds (e.g., 269469)
- **Implication:** Multiply by 1000 and round
