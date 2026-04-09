# RDLogManager - Clock Editor

> Page-level overrides for the Clock Editor dialog.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Layout

Modal dialog, 880x620px, resizable (min 760x500). Split-panel.

## Left Panel: Event Assignment List (40%)

### Event List
- Columns: Event Name (flex), Start Time (Fira Code 11px, 56px), End Time (56px)
- Rows: 32px height
- Row color: left border (4px) with event color
- Selected row: `--accent-primary` at 20% opacity

### Actions
- Add: opens Event Assignment dialog
- Clone: duplicates selected entry
- Edit: opens Event Editor for selected event
- Delete: removes entry from clock

### Clock Metadata
- Code: input (4 chars max), Fira Code 14px, mandatory
- Color: color picker button, shows current color swatch (24x24px)

### Scheduler Rules
- Button opens Scheduler Rules dialog
- Artist Separation: spinner
- Code Rules: list with max-in-a-row, min-wait, not-after/or-after

## Right Panel: Clock Visual (60%)

### Circular Pie Chart
- Centered in panel, 300x300px
- 60-minute circle (full hour)
- Event slices: colored arcs, proportional to duration
- Labels: event name inside slice if >5 min, outside if smaller
- Minute ticks: 60 marks around perimeter
- Hour labels: :00, :15, :30, :45 at cardinal positions
- Interactive: click slice to select corresponding event in list
- Updates in real-time as events are added/edited/removed
