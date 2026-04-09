# RDLibrary - Reports Dialog

> Page-level overrides for the Reports Dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Dialog: 560x400px, non-resizable.

```
+----------------------------------------------+
| Library Reports                       [X]    |
+----------------------------------------------+
| REPORT TYPE                                  |
| (o) Cart Report                              |
| (o) Cut Report                               |
| (o) Cart Data Dump (CSV)                     |
|                                              |
| OPTIONS                                      |
| [x] Include field names as header (CSV only) |
| Filter: Using current main window filter     |
|                                              |
+----------------------------------------------+
| [Generate] [Close]                           |
+----------------------------------------------+
```

## Report Type Selector

- Radio button group, vertical stack
- Fira Sans 14px/400
- Active: `--accent-primary` radio fill
- Description below each option in `--text-muted` 11px

## Options

- Header row checkbox: only enabled when CSV type selected
- Filter status: read-only text showing active filter summary
- Fira Sans 12px/400, `--text-secondary`

## Generated Report View

After clicking Generate, a report viewer appears (or system save dialog for CSV):

- Cart/Cut reports: rendered as formatted text in a scrollable viewer
- Font: Fira Code 12px/400 for data, Fira Sans for headers
- Background: `--bg-primary`
- Print button available for formatted reports
- CSV: triggers system save-file dialog
