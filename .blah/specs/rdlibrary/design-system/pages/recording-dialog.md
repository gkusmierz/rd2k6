# RDLibrary - Recording Dialog

> Page-level overrides for the Recording Dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Fixed-size dialog: 560x520px, non-resizable. Three zones: metadata, transport, scheduling.

```
+--------------------------------------------------------------+
| Record - Cut 001234_001                              [X]     |
+--------------------------------------------------------------+
| CUT METADATA                                                 |
| Description: [_________________________]                     |
| Outcue: [______________________________]                     |
| ISRC: [____________]  ISCI: [____________]                   |
| Source: [______________________________]                     |
+--------------------------------------------------------------+
|                    TRANSPORT                                  |
|                                                              |
|            [Disk Space: ========== 78%]                      |
|                                                              |
|                   00:00:00.0                                 |
|               [REC]  [PLAY]  [STOP]                          |
|                                                              |
|            [L ████████░░░░]  [R ████████░░░░]                |
|                                                              |
|            Channels: (o) Mono  (o) Stereo                    |
+--------------------------------------------------------------+
| SCHEDULING                                                   |
| Air Date: [start]_____ to [end]_____                         |
| Daypart:  [start]_____ to [end]_____                         |
| Days: [M][T][W][T][F][S][S]  [All] [None]                   |
| [x] Evergreen                                               |
| Weight: [100 ▲▼]                                             |
+--------------------------------------------------------------+
| [OK]  [Cancel]                                               |
+--------------------------------------------------------------+
```

## Transport Section

### Recording Timer
- Fira Code 36px/600, centered
- `--text-primary` when idle
- `--rec-active` (#DC2626) when recording, with subtle pulse glow

### Transport Buttons
- Circular, 48x48px
- Record: `--rec-idle` default, `--rec-active` when recording (filled red circle)
- Play: `--status-playing` when playing
- Stop: `--button-negative`
- Spacing: 16px between buttons

### Audio Meters
- Same spec as airplay audio meters
- Vertical, 24px wide each, stereo L/R
- Height: 120px
- Peak hold at 1.5s

### Disk Space Gauge
- Full-width bar, 20px height
- Green fill >50%, amber 20-50%, red <20%
- Label: percentage + available time estimate

## Scheduling Section

### Date/Time Pickers
- Datetime inputs: Fira Code 12px, `--input-bg`, `--input-border`
- Calendar popup for date selection

### Day-of-Week Toggles
- 7 square toggle buttons, 32x32px each
- Active: `--accent-primary` background, white text
- Inactive: `--bg-tertiary`, `--text-muted`
- Labels: M T W T F S S

### Evergreen Checkbox
- When checked: disables and dims all date/time/day fields
- Visual: fields get 40% opacity overlay

## Alarm Indicator

- When audio input has alarm condition:
- Red blinking border around meters area
- Text: "SIGNAL ALARM" in `--status-error`, Fira Sans 11px/700
- `prefers-reduced-motion`: static red border, no blink
