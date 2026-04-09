# System Settings - Page Override

> Inherits all rules from MASTER.md and entity-editor.md. Only deviations listed here.

## Layout Override

System Settings uses a single-form layout (not a CRUD list):

```
+--- Content Area -------------------------------------------+
| System Settings                                            |
+------------------------------------------------------------+
| [General] [Encoders] [System Info]                         |
+------------------------------------------------------------+
| (tab content)                                              |
+------------------------------------------------------------+
```

### General Tab

Single form with field groups:

1. **Audio** — Sample rate dropdown
2. **Content Rules** — Duplicate cart title toggle (with deprecation warning), max POST size
3. **Paths** — ISCI cross-reference path, temporary cart group
4. **Notifications** — Origin email, notification address
5. **Display** — User list visibility toggle
6. **Processing** — RSS processor station dropdown

### Encoders Tab

Standard CRUD list of encoder profiles within the tab.

### System Info Tab

Read-only display:

- System details in key-value pairs
- "View License" button opens license text in a read-only code block (NOT a modal — inline expand)

## Interaction Override

### Deprecation Warning (Duplicate Cart Titles)

When toggling "Allow Duplicate Cart Titles" from enabled to disabled:

- Inline warning appears below the toggle (not a modal)
- Yellow warning box: `--status-warning` border, `--bg-tertiary` background
- Text explains reliability implications
- "I understand, proceed" confirmation button within the warning
- Warning dismisses only on explicit confirmation
