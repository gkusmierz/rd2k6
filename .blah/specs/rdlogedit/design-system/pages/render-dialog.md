# RDLogEdit - Render & Reports Dialogs

> Page-level overrides for Render and Reports dialogs.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Render Dialog

Dialog: 520x420px, non-resizable.

```
+----------------------------------------------+
| Render Log                            [X]    |
+----------------------------------------------+
| TARGET                                       |
| (o) Internal Cart/Cut  [Cart: ____] [Cut: _] |
| (o) External File      [Browse...]           |
|                                              |
| TIMING                                       |
| (o) Current Time                             |
| (o) Specified: [__:__:__]                    |
|                                              |
| AUDIO FORMAT                                 |
| Codec: [PCM WAV ▼]  Rate: [44100 ▼]         |
| Channels: (o) Stereo (o) Mono               |
|                                              |
| SCOPE                                        |
| (o) All Events  (o) Selected Events Only     |
| [x] Ignore STOP Transitions                  |
+----------------------------------------------+
| PROGRESS (hidden until render starts)        |
| Rendering line 5 of 48...                    |
| [████████████░░░░░░░░░░░░] 35%               |
+----------------------------------------------+
| [Render] [Cancel] [Close]                    |
+----------------------------------------------+
```

### Progress Bar
- Height: 8px
- Fill: `--accent-primary`
- Track: `--bg-tertiary`
- Status text: Fira Sans 12px/400, `--text-secondary`
- Cancel button changes to "Abort" during render

## Reports Dialog

Dialog: 480x320px, non-resizable.

```
+----------------------------------------------+
| Log Reports                           [X]    |
+----------------------------------------------+
| REPORT TYPE                                  |
| (o) Log Listing (Text)                       |
| (o) Log Listing (CSV)                        |
| (o) Log Exception Report                     |
|                                              |
| OPTIONS                                      |
| Date: [04/08/2026] (exception report only)   |
+----------------------------------------------+
| [Generate] [Close]                           |
+----------------------------------------------+
```
