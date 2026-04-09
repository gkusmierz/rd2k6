# RDLogEdit - Main Window

> Page-level overrides for the Log Editor main window (log list view).
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

```
+--------------------------------------------------------------+
| FILTER BAR (48px)                                            |
| [Filter Input (300px)] [Service ▼ (160px)]                   |
+--------------------------------------------------------------+
| LOG LIST (flex-grow, scrollable)                             |
| Sortable columns, status icons, double-click to edit         |
+--------------------------------------------------------------+
| TOOLBAR (48px)                                               |
| [Add] [Edit] [Delete] [Voice Track] [Reports] [Close]       |
+--------------------------------------------------------------+
```

## Log List Columns

| Column | Width | Font | Align | Sortable | Notes |
|--------|-------|------|-------|----------|-------|
| Name | 160px | Fira Sans 13px/500 | Left | Yes | Log identifier |
| Description | flex | Fira Sans 12px/400 | Left | Yes | |
| Service | 120px | Fira Sans 12px/400 | Left | Yes | |
| Music | 40px | Icon | Center | Yes | Linked/partial/unlinked icon |
| Traffic | 40px | Icon | Center | Yes | Same icon set |
| Voice Tracks | 64px | Fira Code 11px | Center | Yes | "5/12" format |
| Start | 80px | Fira Code 11px | Center | Yes | |
| End | 80px | Fira Code 11px | Center | Yes | |
| Auto-Ref | 32px | Icon | Center | Yes | Checkbox icon |
| Modified | 120px | Fira Code 10px | Center | Yes | Datetime |
| Lock | 24px | Icon | Center | No | Lock icon if locked |

## Status Icons

- Music/Traffic linked: filled circle `--log-linked`
- Music/Traffic partial: half circle `--log-partial`
- Music/Traffic unlinked: empty circle `--log-unlinked`
- Locked: lock icon `--log-locked` with tooltip "Locked by {user} on {station}"
