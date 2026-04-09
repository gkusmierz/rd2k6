# RDLibrary - Main Window

> Page-level overrides for the Library Manager main window.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Full-viewport window with 4 stacked zones: filter bar, cart list, toolbar, audio player.

```
+--------------------------------------------------------------+
| FILTER BAR (80px)                                            |
| [Filter] [Search] [Clear] [Group ▼] [SC1 ▼] [SC2 ▼]        |
| [x] Audio  [x] Macro  [x] Matches  [x] Drag  [x] Notes     |
+--------------------------------------------------------------+
| CART LIST (flex-grow, scrollable)                             |
| Tree view: carts as parents, cuts as children                |
| 20+ columns, horizontally scrollable                         |
+--------------------------------------------------------------+
| TOOLBAR (48px)                                               |
| [Add] [Add Macro] [Edit] [Delete] [Rip CD] [Reports] [Close]|
+--------------------------------------------------------------+
| AUDIO PLAYER (36px, optional)                                |
| [▶][■] Cart Title - Artist            [progress] 2:15/3:30  |
+--------------------------------------------------------------+
```

## Filter Bar Details

### Row 1: Search & Dropdowns (48px)

| Element | Width | Type | Notes |
|---------|-------|------|-------|
| Filter input | 300px | Text input | Placeholder: "Search carts..." |
| Search button | 72px | Primary button | Only visible in async mode |
| Clear button | 72px | Ghost button | Resets all filters |
| Group dropdown | 160px | Select | "All Groups" default |
| Sched Code 1 | 140px | Select | "All Codes" default |
| Sched Code 2 | 140px | Select | "All Codes" default |

### Row 2: Toggle Filters (32px)

Horizontal row of checkboxes with labels:
- Show Audio Carts (default: checked)
- Show Macro Carts (default: checked)
- Show Matches Only (default: unchecked)
- Enable Drag Mode (default: unchecked, only when station config enables it)
- Show Note Bubbles (default: unchecked)

Checkbox style: 16x16px, `--accent-primary` when checked, `--border-default` when unchecked.

## Cart List Columns

Default visible columns (user-configurable):

| Column | Width | Font | Align | Sortable |
|--------|-------|------|-------|----------|
| Cart # | 80px | Fira Code 12px | Left | Yes |
| Type | 32px | Badge | Center | Yes |
| Group | 80px | Fira Sans 12px | Left | Yes |
| Length | 64px | Fira Code 12px | Right | Yes |
| Talk | 56px | Fira Code 12px | Right | Yes |
| Title | flex | Fira Sans 13px | Left | Yes |
| Artist | 160px | Fira Sans 13px | Left | Yes |
| Start Date | 90px | Fira Code 11px | Center | Yes |
| End Date | 90px | Fira Code 11px | Center | Yes |
| Album | 140px | Fira Sans 12px | Left | Yes |
| Cuts | 40px | Fira Code 12px | Center | Yes |
| Validity | 32px | Icon | Center | Yes |

Additional columns (scrollable): Label, Composer, Conductor, Publisher, Client, Agency, User Defined, Song ID, BPM, Last Cut Played, Enforce Length, Preserve Pitch, Length Deviation, Owner.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Edit selected cart |
| Delete | Delete selected cart(s) |
| Ctrl+N | Add new audio cart |
| Ctrl+M | Add new macro cart |
| Space | Toggle playback preview |
| Ctrl+F | Focus filter input |
| Escape | Clear filter |
