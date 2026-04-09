# Entity Editor (Form) - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.
> Applies to all entity edit views: User edit, Group edit, Station edit, etc.

## Layout Override

### Form Structure

```
+-------- Content Area ------------------------------------------+
| [Breadcrumb: Section > Entity Name]                            |
| [Section Tabs if applicable]                                   |
+----------------------------------------------------------------+
| Left Column (50%)           | Right Column (50%)               |
| Field Group 1               | Field Group 2                    |
| - Label                     | - Label                          |
| - Input                     | - Input                          |
| - Label                     | - Label                          |
| - Input                     | - Input                          |
|-----------------------------+----------------------------------|
| Full-Width Field Groups                                        |
| (e.g., permission selectors, import template editors)          |
+----------------------------------------------------------------+
| [Cancel]                                          [Save] [btn] |
+----------------------------------------------------------------+
```

- Two-column at >= 768px, stacks to single column below
- Field groups separated by `--border-subtle` divider + group label
- Sticky footer with Save/Cancel at bottom of scroll area

### Form Field Spacing

| Element | Spacing |
|---------|---------|
| Between fields | `--space-lg` (12px) |
| Between field groups | `--space-2xl` (24px) |
| Label to input | `--space-sm` (4px) |
| Error message to input | `--space-xs` (2px) |

## Interaction Override

- Tab order: top-to-bottom, left-to-right within two columns
- Required fields: asterisk (*) after label, `--status-error` color
- Dirty tracking: any field change marks form as dirty
- Save: validates all fields, scrolls to first error if any
- Cancel: if dirty, show "Discard changes?" confirmation

## Component-Specific: Dual-List Selector

Used for permission assignment (users to groups, services to hosts, etc.):

```
+--- Available -----+  [>>]  +--- Assigned ------+
| [Search filter]   |  [>]   | [Search filter]    |
| - Item 1          |  [<]   | - Assigned Item 1  |
| - Item 2          |  [<<]  | - Assigned Item 2  |
| - Item 3          |        | - Assigned Item 3  |
+-------------------+        +--------------------+
```

- Each list: 200px min-height, scrollable, Fira Sans 13px/400
- Arrow buttons: 32px wide, vertically centered between lists
- Filter: instant search (no debounce needed for < 1000 items)

## Component-Specific: Import Template Editor

For Service import configuration (Req 4):

- Code editor area: Fira Code 13px/400, `--input-bg` background
- Syntax highlighting: none (plain text with line numbers)
- Line numbers: `--text-muted`, right-aligned, 40px gutter
- Toolbar: "Copy to Clipboard", "Reset to Default"
