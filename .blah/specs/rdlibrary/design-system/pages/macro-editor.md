# RDLibrary - Macro Editor

> Page-level overrides for the Macro Editor panel (tab within Cart Editor).
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Fills the Cart Editor's tab content area when cart type is Macro.

```
+--------------------------------------------------------------+
| MACRO COMMAND LIST                                           |
| # | Command                                    | Duration    |
| 1 | PM 1 START!                               | 00:00       |
| 2 | SL 5000!                                  | 00:05       |
| 3 | PM 1 STOP!                                | 00:00       |
|                                                              |
| Total Duration: 00:05                                        |
+--------------------------------------------------------------+
| [Add] [Edit] [Delete] [Copy] [Paste] [Run Line] [Run Cart]  |
+--------------------------------------------------------------+
```

## Command List

- Rows: 32px height
- Line number: Fira Code 12px, 40px, `--text-muted`
- Command text: Fira Code 13px/400, `--text-primary`, flex width
- Duration: Fira Code 12px, 64px, right-aligned
- Selected row: `--accent-primary` at 20% opacity
- Total duration: Fira Code 14px/600, right-aligned below list

## Action Toolbar

| Button | Icon | Style | Notes |
|--------|------|-------|-------|
| Add | `plus` | Primary | Insert new line after selection |
| Edit | `pencil` | Primary | Open macro command editor |
| Delete | `trash-2` | Destructive | Remove selected line |
| Copy | `copy` | Ghost | Copy selected line |
| Paste | `clipboard-paste` | Ghost | Paste after selection |
| Run Line | `play` | Accent green | Execute selected command |
| Run Cart | `play-circle` | Accent green | Execute all commands |

## Macro Command Editor Dialog

Small dialog (400x200px) for editing a single macro command:

```
+------------------------------------------+
| Edit Macro Command                [X]    |
+------------------------------------------+
| Command: [________________________]      |
|                                          |
| [OK]  [Cancel]                           |
+------------------------------------------+
```

- Command input: full-width, Fira Code 14px/400
- Monospace input for RML command syntax
