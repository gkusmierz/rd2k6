# RDLogEdit - Log Editor Dialog

> Page-level overrides for the Log Editor modal dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Modal dialog, 900x650px, resizable (min 800x500).

```
+--------------------------------------------------------------+
| Log Editor — LOG_20260408                            [X]     |
+--------------------------------------------------------------+
| METADATA BAR (2 rows, 80px total)                            |
| Name: LOG_20260408 (RO)  Service: [Radio Rivendell ▼]       |
| Desc: [Morning show log___]  [x] Auto-Refresh               |
| Start: [04/08/26]  End: [04/08/26]  Purge: [04/15/26]       |
| Time: (o) 12h (o) 24h   VT: 5/12 complete                   |
+--------------------------------------------------------------+
| LOG LINE LIST (flex-grow, color-coded)                       |
+--------------------------------------------------------------+
| LINE TOOLBAR (36px)                                          |
| [Ins Cart] [Ins Meta] [Edit] [Del] [Cut] [Copy] [Paste]     |
| [Up] [Down]                                                  |
+--------------------------------------------------------------+
| ACTION BAR (48px)                                            |
| [Save] [Save As] [Render] [Reports]     [OK] [Cancel]       |
+--------------------------------------------------------------+
```

## Log Line List Details

### Columns

| Column | Width | Notes |
|--------|-------|-------|
| # | 40px | Line number, Fira Code 11px |
| Type | 28px | Icon: cart, marker, chain, voice track |
| Start Time | 72px | Fira Code 11px, computed |
| Trans | 52px | Badge: PLAY/SEGUE/STOP |
| Cart | 64px | Fira Code 11px |
| Group | 72px | Group name with color dot |
| Length | 56px | Fira Code 11px |
| Title | flex | Fira Sans 12px/400 |
| Artist | 120px | Fira Sans 12px/400 |
| Line ID | 48px | Fira Code 10px, muted |

### Row Color Coding

Each row gets a left border (4px) and subtle background tint based on cart validity:

| State | Left Border | Background |
|-------|-------------|------------|
| Valid | `--line-valid` | `--line-valid-bg` |
| Conditional | `--line-conditional` | `--line-conditional-bg` |
| Future | `--line-future` | `--line-future-bg` |
| Evergreen | `--line-evergreen` | `--line-evergreen-bg` |
| Invalid | `--line-invalid` | `--line-invalid-bg` |
| Disabled for service | `--line-disabled` | `--line-disabled-bg` |

Invalid carts show "[INVALID CART]" in place of title.

### Line Type Icons

- Cart: musical note (filled)
- Marker: flag icon
- Chain: link icon
- Voice Track: microphone icon

### Drag-and-Drop

- Internal reorder: grab handle on left, ghost row follows cursor
- External drop: blue insertion line between rows at drop target
- Drop zone highlight: 2px `--accent-primary` horizontal line
