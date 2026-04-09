# RDLogManager - Log Generation & Reports

> Page-level overrides for Log Generation and Reports dialogs.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Log Generation Dialog

Dialog: 520x480px, non-resizable.

```
+----------------------------------------------+
| Generate Logs                         [X]    |
+----------------------------------------------+
| Service: [Radio Rivendell ▼]                 |
| Date: [April 8, 2026 📅]                     |
+----------------------------------------------+
| STATUS                                       |
|  Log:     ● Created          [✓ green]       |
|  Music:   ● File available   [✓ green]       |
|           ○ Not merged       [✕ red]         |
|  Traffic: ○ File missing     [✕ red]         |
|           ○ Not merged       [— grey]        |
+----------------------------------------------+
| [Create] [Merge Music] [Merge Traffic]       |
+----------------------------------------------+
| PROGRESS (hidden until action starts)        |
| Generating log... Event 15 of 48             |
| [████████████░░░░░░░░░░░░] 31%               |
+----------------------------------------------+
| [Close]                                      |
+----------------------------------------------+
```

### Status Indicators
- Each status row: icon (12px circle) + label (Fira Sans 12px)
- Green circle `--gen-available`: data available/merged
- Red circle `--gen-missing`: data missing/needed
- Grey circle `--gen-neutral`: not applicable
- Status refreshes periodically (file scan)

### Action Button States
- Create: always enabled (warns if log exists)
- Merge Music: enabled when log exists + music file available
- Merge Traffic: enabled only after music is merged (business rule)
- During action: button shows spinner, other buttons disabled

## Log Purge Dialog

Dialog: 400x360px.

```
+----------------------------------------------+
| Purge Logs — Radio Rivendell          [X]    |
+----------------------------------------------+
| CALENDAR                                     |
| [    April 2026    ]                         |
| Mo Tu We Th Fr Sa Su                         |
|        1  2  3  4  5                         |
|  6 ●7 ●8  9 10 11 12                        |
| 13 14 15 16 17 18 19                         |
| 20 21 22 23 24 25 26                         |
| 27 28 29 30                                  |
| (● = has log data)                           |
+----------------------------------------------+
| Selected: April 8, 2026                      |
| [Delete] [Close]                             |
+----------------------------------------------+
```

### Calendar
- Dates with log data: highlighted with `--accent-primary` dot below number
- Selected date: `--accent-primary` filled background
- Delete button: enabled only when selected date has data

## Reports Dialog

Dialog: 480x320px.

```
+----------------------------------------------+
| Reports                               [X]    |
+----------------------------------------------+
| Start: [04/08/2026] End: [04/08/2026]       |
| Service: [Radio Rivendell ▼]                 |
| Report: [Traffic Report ▼]                   |
+----------------------------------------------+
| [Generate]                                   |
+----------------------------------------------+
| OUTPUT (after generation)                    |
| File: /var/snd/reports/traffic_20260408.txt  |
| [View in External Viewer]                    |
+----------------------------------------------+
| [Close]                                      |
+----------------------------------------------+
```
