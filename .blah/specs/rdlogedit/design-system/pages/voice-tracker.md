# RDLogEdit - Voice Tracker Window

> Page-level overrides for the Voice Tracker window.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Dedicated window (not a dialog), 1100x700px, resizable (min 900x550).

```
+--------------------------------------------------------------+
| Voice Tracker — LOG_20260408                         [X]     |
+--------------------------------------------------------------+
| MINI LOG LIST (200px, scrollable, compact)                   |
| Current track position highlighted with accent               |
| Right-click context menu: change transition type             |
+--------------------------------------------------------------+
| WAVEFORM DISPLAY (flex-grow, min 200px)                      |
| Three-track overlay with time axis                           |
| - Pre-roll (blue waveform)                                   |
| - Recording (red waveform, grows in real-time)               |
| - Post-roll (green waveform)                                 |
| Segue markers (draggable amber triangles)                    |
| Playback cursor (white vertical line)                        |
+--------------------------------------------------------------+
| CONTROL BAR (80px)                                           |
| [VU L/R] | [Track1] [REC] [Track2] [Finished] | Remaining:12|
|           | [Prev] [Next] [Insert] [Delete]    | Time: 15:30 |
+--------------------------------------------------------------+
```

## Waveform Display Details

### Time Axis
- Bottom of waveform area, Fira Code 9px, `--text-muted`
- Major gridlines every 5s, minor every 1s
- Format: MM:SS

### Track Rendering
- Pre-roll: rendered from left, `--waveform-preroll` fill at 60% opacity
- Recording: rendered center, `--waveform-record` fill at 80% opacity
- Post-roll: rendered from right, `--waveform-postroll` fill at 60% opacity
- Overlapping regions show blended colors with `--crossfade-region` tint

### Interactive Elements
- Segue markers: small triangles (8px) at top and bottom of waveform
  - Color: `--segue-marker`
  - Draggable along time axis
  - Cursor: `col-resize` when hovering
- Right-click context menu:
  - Edit Cue Markers
  - Undo Segue Changes
  - Set Start Point
  - Set End Point
  - Reset to Hook Markers

### State-Based Background
The entire waveform area changes background subtly based on transport state:
- Idle: `--vt-idle`
- Pre-roll playing: `--vt-preroll`
- Recording: `--vt-recording`
- Post-roll playing: `--vt-postroll`

## Transport Controls

```
[Track 1]  [● REC]  [Track 2]  [✓ Finished]
[◀ Prev]   [▶ Next]   [+ Insert]   [✕ Delete]
```

### Button States

| Button | Idle | Active | Disabled |
|--------|------|--------|----------|
| Track 1 | Ghost | `--waveform-preroll` bg | 40% opacity |
| Record | Ghost with red dot | `--waveform-record` bg, pulsing | 40% opacity |
| Track 2 | Ghost | `--waveform-postroll` bg | 40% opacity |
| Finished | `--accent-primary` | `--accent-active` | 40% opacity |

### State Machine → Button Mapping

| State | Track 1 | Record | Track 2 | Finished |
|-------|---------|--------|---------|----------|
| Idle | Enabled | Enabled | Disabled | Enabled (save) |
| PreRoll | Active | Enabled | Disabled | Enabled (abort) |
| Recording | Disabled | Active | Enabled* | Enabled |
| PostRoll | Disabled | Disabled | Active | Enabled |

*Track 2 enabled only if "enable second start" is configured.

## Status Panel

- Remaining tracks: Fira Code 24px/600, `--text-primary`
- Time display: Fira Code 16px/500, `--text-secondary`
- Format: "Remaining: 12 tracks" / "Time: 00:15:30"
