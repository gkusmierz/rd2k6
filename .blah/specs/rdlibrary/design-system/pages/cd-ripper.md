# RDLibrary - CD Ripper Dialogs

> Page-level overrides for Batch CD Ripper and Single Track Ripper dialogs.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Batch CD Ripper

### Layout

Dialog: 800x600px, resizable (min 720x500).

```
+--------------------------------------------------------------+
| Batch CD Ripper                                      [X]     |
+--------------------------------------------------------------+
| DISC INFO                                                    |
| Album: [___________________]  Artist: [___________________]  |
| [Lookup] [Browser]                                           |
+--------------------------------------------------------------+
| TRACK LIST                                                   |
| [x] | # | Title              | Artist    | Len  | Cart/Cut  |
| [x] | 1 | Track One          | Artist    | 4:12 | [001234▼] |
| [x] | 2 | Track Two          | Artist    | 3:45 | [001235▼] |
| [ ] | 3 | Track Three        | Artist    | 5:01 | [      ]  |
| ...                                                          |
+--------------------------------------------------------------+
| SETTINGS                                       PROGRESS      |
| Normalize: [-14 ▲▼] dBFS                      Track 2/12    |
| Auto-Trim: [-40 ▲▼] dBFS                      [████░░] 67%  |
| Channels: (o) Mono (o) Stereo                 Overall:       |
|                                                [██░░░░] 17%  |
+--------------------------------------------------------------+
| [Rip Disk] [Eject] [Play] [Stop] [Close]                    |
+--------------------------------------------------------------+
```

### Track List
- Checkbox column: 32px, for track selection
- Track number: Fira Code 12px, 40px width
- Title/Artist: Fira Sans 13px, flex
- Length: Fira Code 12px, 56px, right-aligned
- Cart/Cut destination: editable input, Fira Code 12px, 100px
- Row height: 32px
- When ripping: in-progress track shows inline progress bar overlay

### Progress Display
- Per-track progress: 200px wide bar, `--rip-progress` fill
- Overall progress: 200px wide bar, `--rip-progress` fill
- Completed tracks: row gets `--rip-complete` checkmark replacing checkbox
- Status text: Fira Sans 12px/400, `--text-secondary`

### Settings Panel
- Normalize level: numeric spinner, -30 to 0 dBFS range
- Auto-Trim level: numeric spinner, -60 to -20 dBFS range
- Channel selector: radio buttons (Mono/Stereo)

---

## Single Track Ripper

### Layout

Dialog: 480x400px, non-resizable.

```
+----------------------------------------------+
| Rip Track                            [X]     |
+----------------------------------------------+
| Track: [Track Title]                         |
| Artist: [Artist Name]                        |
| Album: [Album Name]                          |
| Label: [Label Name]                          |
+----------------------------------------------+
| TRACKS                                       |
| # | Title              | Length              |
| 1 | Track One          | 4:12   (selected)  |
| 2 | Track Two          | 3:45               |
+----------------------------------------------+
| Normalize: [-14 ▲▼]  Channels: (o) S (o) M  |
| Progress: [████████░░░░░░░] 55%              |
+----------------------------------------------+
| [Rip] [Eject] [Play] [Stop] [Close]         |
+----------------------------------------------+
```

### Differences from Batch
- Single track selection (radio, not checkbox)
- No cart/cut destination column (target is pre-set)
- Metadata fields (title, artist, album, label) are editable — returned to caller
- Simpler progress: single bar only
