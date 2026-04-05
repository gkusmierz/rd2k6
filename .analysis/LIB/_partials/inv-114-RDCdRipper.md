---
partial_id: 114
class: RDCdRipper
source_files:
  - lib/rdcdripper.h
  - lib/rdcdripper.cpp
status: done
phase: 2
---

# RDCdRipper — CD Audio Track Ripper

## Purpose

Rips one or more audio tracks from a physical CD to a WAV file on disk. Uses the cdparanoia library (`cdda_*` functions) for digital audio extraction and libsndfile for WAV output. Supports progress reporting and abort capability.

## Inheritance

- **Parent class:** QObject (Q_OBJECT macro present)

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `ErrorCode` | `ErrorOk=0`, `ErrorNoDevice=1`, `ErrorNoDestination=2`, `ErrorInternal=3`, `ErrorNoDisc=4`, `ErrorNoTrack=5`, `ErrorAborted=6` | Rip operation result codes |

## Constructor

```cpp
RDCdRipper(FILE *profile_msgs, QObject *parent = 0)
```

- `profile_msgs`: optional FILE* for timestamped diagnostic logging

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `progressChanged(int step)` | step number (0-4) | Rip progress advances (4 steps total) |

## Public Slots

| Slot | Parameters | Behavior |
|------|-----------|----------|
| `abort()` | none | Sets abort flag; rip loop checks this and returns `ErrorAborted` |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `setDevice(const QString&)` | void | Sets the CD device path for ripping |
| `setDestinationFile(const QString&)` | void | Sets the output WAV file path |
| `totalSteps()` | int | Always returns 4 (fixed number of progress steps) |
| `rip(int track)` | ErrorCode | Rips a single track (delegates to range overload) |
| `rip(int first_track, int last_track)` | ErrorCode | Rips a range of tracks into a single WAV file |
| `errorText(ErrorCode)` | QString | Static method: converts error code to human-readable string |

## Rip Behavior

1. Opens the CD device via `cdda_identify()` / `cdda_open()`
2. Validates track range against actual disc tracks
3. Creates destination WAV file (32-bit PCM, 44100 Hz, channels from CD track)
4. Reads audio data in chunks (`RIPPER_MAX_SECTORS` at a time)
5. Emits `progressChanged()` at ~25% intervals
6. Checks abort flag between chunks; if set, deletes partial output file
7. On completion, closes both CD drive and output file

## Linux-Specific

- Uses cdparanoia library functions: `cdda_identify`, `cdda_open`, `cdda_close`, `cdda_tracks`, `cdda_track_firstsector`, `cdda_track_lastsector`, `cdda_track_channels`, `cdda_read`
- Uses libsndfile for WAV output (`sf_open`, `sf_writef_short`, `sf_close`)
- Calls `qApp->processEvents()` during rip to keep UI responsive (synchronous rip operation)

## Dependencies

- `cdparanoia` (cdda_interface.h) -- CD digital audio extraction
- `libsndfile` (sndfile.h) -- audio file I/O
- `RDPaths`, `rd.h` -- Rivendell path constants (RIPPER_MAX_SECTORS)
