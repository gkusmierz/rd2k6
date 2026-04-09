# RDCatch - Event Editor Dialogs

> Page-level overrides for the six event editor dialogs.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Common Editor Layout

All event editors share a common structure:

```
+----------------------------------------------+
| [Event Type] Editor                   [X]    |
+----------------------------------------------+
| IDENTITY                                     |
| Station: [▼]  Description: [____________]    |
+----------------------------------------------+
| TYPE-SPECIFIC CONFIGURATION                  |
| (varies by event type)                       |
+----------------------------------------------+
| SCHEDULE                                     |
| Days: [M][T][W][T][F][S][S]  [Set All][None]|
| [x] Active  [x] One-Shot                    |
+----------------------------------------------+
| [OK] [Save As New] [Cancel]                  |
+----------------------------------------------+
```

### Common Elements
- Station selector: dropdown, all configured stations
- Description: text input, 100% width
- Day toggles: 7 square buttons (32x32px), same style as recording dialog
- Active checkbox, One-shot checkbox
- OK / Save As New / Cancel button bar

## Recording Editor (520x560px)

### Start Trigger Section
- Radio: Hard Start / GPI Start
- Hard Start: time input (HH:MM:SS)
- GPI Start: window begin/end time + matrix selector + GPI line

### End Trigger Section
- Radio: Fixed Length / Hard End / GPI End
- Fixed Length: duration input
- Hard End: time input
- GPI End: window begin/end time + matrix/line

### Audio Settings
- Source: selector
- Channels: Mono / Stereo radio
- Auto-trim: level spinner (dBFS)
- Normalization: level spinner (dBFS)
- Cut assignment: cart/cut selector + browse button

## Download Editor (480x420px)

- URL: text input, full width
- Username / Password: text inputs
- Destination: cart/cut selector
- Audio settings: channels, auto-trim, normalization
- Metadata update: checkbox
- Event date offset: spinner

## Upload Editor (520x480px)

- Source: cart/cut selector
- URL: text input, full width
- Username / Password: text inputs
- Export format: dropdown (WAV, MP2, MP3, FLAC, etc.)
- Podcast feed: dropdown (optional)
- Normalization: level spinner

## Playout Editor (400x320px)

- Deck: selector (playout decks only)
- Start time: time input
- Cut: cart/cut selector

## Switch Event Editor (440x360px)

- Matrix: selector (available matrices on station)
- Input: selector (populated from matrix config)
- Output: selector (populated from matrix config)
- Start time: time input

## Cart/Macro Event Editor (400x300px)

- Cart: number input + browse button
- Start time: time input
- Validation: "That cart doesn't exist!" if invalid
