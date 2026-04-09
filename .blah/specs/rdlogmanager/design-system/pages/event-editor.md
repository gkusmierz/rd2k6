# RDLogManager - Event Editor

> Page-level overrides for the Event Editor dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Modal dialog, 960x680px, resizable (min 800x550). Split-panel.

## Left Panel: Content Library (45%)

### Search & Filters
- Search input: 100% width, 36px height
- Group dropdown: 100% width, below search
- Type toggle: Audio / Macro, radio buttons, inline

### Cart List
- Columns: Cart# (Fira Code 11px, 64px), Title (flex, Fira Sans 12px), Artist (120px)
- Rows: 28px height
- Drag affordance: grab cursor on hover

### Import Lists
- Section divider: "PRE-IMPORT" / "POST-IMPORT" label, Fira Sans 10px/700 uppercase
- Items: numbered, icon (cart/note/voice), name, transition badge
- Drop zone: 2px dashed border `--import-drop-zone` when dragging
- Context menu on items: Insert Note, Insert Voice Track, Delete, Change Transition

## Right Panel: Event Configuration (55%)

### Timing Section
- Start time: time input (HH:MM), Fira Code 12px
- Hard start: checkbox, enables grace time options below
- Grace time: radio group (Immediate / Next Event / Wait [duration])
- Pre-position: checkbox + offset time input
- First transition: dropdown (Play/Segue/Stop)

### Import Section
- Source: radio group (None / Scheduler / File)
- Scheduler config (when selected):
  - Group: dropdown
  - Artist Separation: spinner (0-999)
  - Title Separation: spinner (0-999)
  - Sched Code 1: dropdown
  - Sched Code 2: dropdown
- File config (when selected):
  - File path input + Browse button
- Autofill: checkbox + slop time input
- Start/End slop: time inputs

### Service Permissions
- Button opens dual-list selector dialog
- Available services (left) / Assigned services (right)
