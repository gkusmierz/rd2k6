# RDLibrary - Cart Editor Dialog

> Page-level overrides for the Cart Editor modal dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Modal dialog, 720x600px default, resizable (min 640x480). Two-tab layout for audio carts (Metadata + Cuts), single tab for macro carts (Metadata + Macros).

```
+--------------------------------------------------------------+
| Cart Editor - Cart 001234 (Audio)                    [X]     |
+--------------------------------------------------------------+
| [Metadata] [Cuts]                                     <- tabs |
+--------------------------------------------------------------+
| LEFT COLUMN (50%)          | RIGHT COLUMN (50%)              |
|                            |                                  |
| Cart Number: 001234 (RO)  | Enforce Length: [x] [00:03:30]   |
| Type: Audio (RO)          | Preserve Pitch: [x]              |
| Group: [MUSIC ▼]          | Cut Scheduling: [Weight ▼]       |
|                            |                                  |
| Title: [________________] | Year: [____]                     |
| Artist: [_______________] | BPM: [___]                       |
| Album: [________________] | Song ID: [________]              |
| Label: [________________] |                                  |
| Client: [_______________] | [Notes...] [Sched Codes...]      |
| Agency: [_______________] |                                  |
| Publisher: [_____________] |                                  |
| Conductor: [_____________] |                                  |
| Composer: [______________] |                                  |
| User Defined: [__________] |                                  |
+--------------------------------------------------------------+
| [OK]  [Cancel]                                               |
+--------------------------------------------------------------+
```

## Field Specifications

### Read-Only Fields
- Cart Number: Fira Code 14px/600, `--text-primary`
- Type: Badge (Audio/Macro), same style as cart list
- Display only, no input affordance

### Editable Fields
- All text inputs: 36px height, `--input-bg`, `--input-border`
- Label: Fira Sans 11px/500, `--text-secondary`, above input
- Focus: `--input-focus-border`
- Required (Title): asterisk indicator, `--status-error` on empty

### Group Selector
- Dropdown showing only groups the user has permission for
- Each option shows group name + color swatch (12x12px circle)

### Enforce Length
- Checkbox + time input (HH:MM:SS format, Fira Code)
- Warning icon appears if cut lengths exceed timescaling limits

### Bulk Edit Mode
- When multiple carts selected, only changed fields are applied
- Unchanged fields show placeholder: "(multiple values)"
- Visual indicator: amber top border on dialog

## Macro Cart Additions

When cart type is Macro, the right column shows:
- Synchronous Playback: checkbox
- Use Event Length: checkbox
- These replace the audio-specific fields (enforce length, preserve pitch)

## Tabs

### Cuts Tab (Audio Carts)
Switches to Audio Cut Manager view (see `cut-manager.md`)

### Macros Tab (Macro Carts)
Switches to Macro Editor view (see `macro-editor.md`)
