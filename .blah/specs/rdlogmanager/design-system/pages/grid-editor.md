# RDLogManager - Grid Editor

> Page-level overrides for the Grid Editor dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Modal dialog, 960x680px, non-resizable (or fit to screen).

```
+--------------------------------------------------------------+
| Grid Editor — Radio Rivendell                        [X]     |
+--------------------------------------------------------------+
| 7x24 BUTTON MATRIX (fills available space)                   |
|      | Mon  | Tue  | Wed  | Thu  | Fri  | Sat  | Sun        |
| 00:00| btn  | btn  | btn  | btn  | btn  | btn  | btn        |
| ...  |      |      |      |      |      |      |            |
| 23:00| btn  | btn  | btn  | btn  | btn  | btn  | btn        |
+--------------------------------------------------------------+
| [Set All Clocks]                                     [Close] |
+--------------------------------------------------------------+
```

## Grid Matrix Specifications

### Cell Design
- Size: flex width (min 72px), 28px height
- Font: Fira Code 10px/600
- Content: clock short code (max 4 chars)
- Background: clock color at 60% opacity (assigned) or `--grid-empty` (unassigned)
- Border: 1px `--grid-border`
- Hover: overlay `--grid-hover`
- Active/pressed: slight scale (0.95)
- Click: opens clock picker dialog
- Right-click: context menu

### Context Menu
- "Edit Clock" — opens clock editor for assigned clock
- "Clear" — removes clock assignment (button returns to empty state)

### Headers
- Day headers (top row): `--grid-header-bg`, Fira Sans 11px/600
  - Full names at >= 960px, 3-letter abbreviations below
- Hour headers (left column): `--grid-header-bg`, Fira Code 10px
  - Format: "00:00", "01:00", ... "23:00"

### Color Legend
- Below grid or as tooltip: show which clock code maps to which color
- Optional collapsible panel showing all clocks used in this grid

### "Set All Clocks" Button
- Opens clock picker, then fills all 168 cells with selected clock
- Confirmation dialog before applying ("This will overwrite all existing assignments")
