# Entity List (CRUD Table) - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.
> Applies to all entity list views: Users, Groups, Services, Stations, Reports, etc.

## Layout Override

- Toolbar: 48px height, flex row — search input (flex-1) + action buttons (right)
- Table: full width, fixed header (sticky top), scrollable body
- Row height: 40px
- Columns: auto-sized with min-widths, last column (actions) fixed 100px

### Empty State

- Centered illustration (subtle SVG) + "No {entities} found" message
- "Add First {Entity}" primary button below message
- Fira Sans 14px/400, `--text-muted`

### Pagination

- Bottom bar: 40px height
- "Showing X-Y of Z" left-aligned, `--text-muted` Fira Sans 12px/400
- Page controls right-aligned: Previous / page numbers / Next

## Interaction Override

- Click row: select row (highlight with `--row-selected`)
- Double-click row: open inline edit (expand row into form) OR navigate to edit view
- Action buttons (edit/delete): appear on hover, always visible on mobile
- Multi-select: checkbox column (first), bulk actions appear in toolbar
- Sort: click column header, toggle asc/desc, active sort shown with arrow icon

## Typography Override

- Table header: Fira Sans 10px/600, uppercase, `--text-muted`
- Table data: Fira Sans 13px/400, `--text-primary`
- Monospace data (IDs, IPs, cart numbers): Fira Code 12px/400
