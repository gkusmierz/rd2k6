---
partial_id: 113
class: RDCdPlayer
source_files:
  - lib/rdcdplayer.h
  - lib/rdcdplayer.cpp
status: done
phase: 2
---

# RDCdPlayer — Linux CD-ROM Player Abstraction

## Purpose

Abstracts a physical Linux CD-ROM drive as a controllable audio CD player. Provides transport controls (play, pause, stop, eject), volume management, TOC reading, CDDB disc identification, and media change detection. Communicates exclusively through Linux kernel CDROM ioctl interface.

## Inheritance

- **Parent class:** QObject

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `Status` | `NoStatusInfo`, `NoDriveDisc`, `TrayOpen`, `NotReady`, `Ok` | Drive hardware status (maps to CDS_* kernel constants) |
| `Medium` | `NoMediumInfo`, `NoMediumLoaded`, `AudioDisc`, `Data1`, `Data2`, `Xa21`, `Xa22`, `Mixed` | Disc media type (maps to CDS_* kernel constants) |
| `State` | `NoStateInfo=0`, `Stopped=1`, `Playing=2`, `Paused=3` | Audio playback state |
| `PlayMode` | `Single=0`, `Continuous=1` | Whether to play one track or all remaining tracks |
| `ButtonOp` | `Play=0`, `Pause=1`, `Resume=2`, `Stop=3`, `Eject=4`, `Lock=5`, `Unlock=6` | Internal queued button operations |

## Constructor

```cpp
RDCdPlayer(FILE *profile_msgs, QWidget *parent = 0)
```

- `profile_msgs`: optional FILE* for timestamped diagnostic logging (NULL to disable)

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `ejected()` | none | Media was removed (drive goes from disc-present to disc-absent) |
| `mediaChanged()` | none | New media inserted (TOC re-read automatically) |
| `played(int track)` | track number | Playback starts on a track |
| `paused()` | none | Playback paused |
| `stopped()` | none | Playback stopped (including audio completed/error/no-status) |
| `leftVolumeChanged(int vol)` | volume 0-255 | Left channel volume changed |
| `rightVolumeChanged(int vol)` | volume 0-255 | Right channel volume changed |

## Public Slots

| Slot | Parameters | Behavior |
|------|-----------|----------|
| `lock()` | none | Locks the CD tray door via queued button operation |
| `unlock()` | none | Unlocks the tray door (calls system "eject -i off") |
| `eject()` | none | Ejects the disc (calls system "eject") |
| `play(int track)` | track number | Starts playback; resumes if paused on same track |
| `pause()` | none | Pauses current playback |
| `stop()` | none | Stops playback |
| `setLeftVolume(int vol)` | volume value | Sets left channel volume via ioctl; emits signal if changed |
| `setRightVolume(int vol)` | volume value | Sets right channel volume via ioctl; emits signal if changed |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `device()` / `setDevice(QString)` | QString / void | Get/set CD device path (only settable when device is closed) |
| `open()` / `close()` | bool / void | Open/close the device file descriptor (O_RDONLY|O_NONBLOCK) |
| `status()` | Status | Queries drive hardware status via ioctl |
| `medium()` | Medium | Queries disc media type via ioctl |
| `tracks()` | int | Number of tracks from last TOC read |
| `isAudio(int track)` | bool | Whether specified track is audio (vs data) |
| `trackLength(int track)` | int | Track duration in milliseconds (MSF-based) |
| `trackOffset(int track)` | unsigned | Track offset in CD frames (75 fps) |
| `state()` | State | Current playback state |
| `leftVolume()` / `rightVolume()` | int | Read channel volumes via ioctl (0-255, -1 on error) |
| `playMode()` / `setPlayMode(PlayMode)` | PlayMode / void | Get/set single-track vs continuous playback |
| `setCddbRecord(RDDiscRecord*)` | void | Populates a CDDB disc record with TOC data for freedb lookup |

## Internal Behavior

- **Button queue**: All transport operations go through a FIFO queue (`PushButton`). A 100ms delay timer (`cdrom_button_timer`) processes one operation at a time, preventing ioctl contention.
- **Clock polling**: A 1-second repeating timer (`cdrom_clock`) polls media change status (`CDROM_MEDIA_CHANGED`) and audio subchannel status (`CDROMSUBCHNL`). On media insertion: reads TOC and emits `mediaChanged()`. On removal: emits `ejected()`. On audio state change: emits `played`/`paused`/`stopped`.
- **PlayMode**: In `Single` mode, play range covers one track. In `Continuous` mode, play range extends to disc end (leadout).
- **CDDB ID**: Computes freedb disc identifier from TOC using standard CDDB algorithm (digit sum of track start seconds, total disc length, track count).

## Linux-Specific

- Requires `<linux/cdrom.h>` header and Linux CDROM ioctl API
- Uses ioctls: `CDROM_DRIVE_STATUS`, `CDROM_DISC_STATUS`, `CDROM_MEDIA_CHANGED`, `CDROMSUBCHNL`, `CDROMPLAYMSF`, `CDROMPAUSE`, `CDROMRESUME`, `CDROMSTOP`, `CDROMEJECT`, `CDROM_LOCKDOOR`, `CDROMVOLREAD`, `CDROMVOLCTRL`, `CDROMREADTOCHDR`, `CDROMREADTOCENTRY`
- Eject and unlock use `system()` calls to the `eject` command-line tool
- Device opened with `O_RDONLY|O_NONBLOCK`

## Dependencies

- `RDDiscRecord` (for CDDB record population)
- `QTimer` (clock + button queue timers)
