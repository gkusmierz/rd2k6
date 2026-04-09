# RDLibrary - Audio Cut Manager

> Page-level overrides for the Audio Cut Manager panel (tab within Cart Editor).
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Fills the Cart Editor's tab content area. Contains a cut list and action toolbar.

```
+--------------------------------------------------------------+
| CUT LIST                                                     |
| # | Description | Length | Play Order | Weight | Validity    |
| 001_001 | Full ver | 3:30 | 1 | 100 | ● Always             |
| 001_002 | Edit ver | 2:15 | 2 | 50  | ◐ Conditional        |
| 001_003 | (empty)  | 0:00 | — | —   | ✕ Never              |
+--------------------------------------------------------------+
| [Add] [Delete] [Copy] [Paste] [Edit] [Record] [Rip] [Ext Ed]|
+--------------------------------------------------------------+
```

## Cut List

- Rows: 32px height
- Columns: Cut Name (Fira Code 11px), Description, Length (Fira Code), Play Order (Fira Code), Weight (Fira Code), Last Played, Origin, Validity
- Selection: single or multi-select with Ctrl/Shift
- Validity column: icon from MASTER.md validity indicators

## Action Toolbar

| Button | Icon | Style | Condition |
|--------|------|-------|-----------|
| Add | `plus` | Primary | Always enabled |
| Delete | `trash-2` | Destructive | Cut(s) selected |
| Copy | `copy` | Ghost | Single cut selected |
| Paste | `clipboard-paste` | Ghost | Clipboard not empty |
| Edit | `pencil` | Primary | Single cut selected |
| Record | `mic` | Accent (red tint) | Single cut selected |
| Rip | `disc` | Ghost | Single cut selected |
| Ext Editor | `external-link` | Ghost | Cut has audio |

Disabled state: 40% opacity, no cursor pointer.

## Cut Edit Dialog (Inline)

When Edit is clicked, opens a dialog with cut metadata:
- Description, Outcue, ISRC, ISCI, Source
- Weight (spinner), Play Order (spinner)
- Air Date: Start/End datetime pickers
- Daypart: Start/End time pickers
- Days of Week: 7 toggles (Mon-Sun) + Set All / Clear All
- Evergreen: checkbox (disables date/time fields when checked)
- Play Counter: read-only display
