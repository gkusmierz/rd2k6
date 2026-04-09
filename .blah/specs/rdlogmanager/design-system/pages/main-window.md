# RDLogManager - Main Window

> Page-level overrides for the Main Window with tabbed interface.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Tab Content Layouts

### Events Tab
```
[Filter____] [Service ▼]
Event List: Name | Properties | Nested | Color
[Add] [Edit] [Delete] [Rename]
```

### Clocks Tab
```
[Filter____]
Clock List: Name | Code | Color
[Add] [Edit] [Delete] [Rename]
```

### Grids Tab
```
Service List: Name | Description
[Edit Grid]
```

### Logs Tab
```
Service List: Name | Date Range
[Generate Logs] [Purge]
```

### Reports Tab
```
Start Date: [____] End Date: [____]
Report: [Select Report ▼] Service: [▼]
[Generate] [View]
```

## List Styles

All domain lists share common styling:
- Header: `--bg-tertiary`, 10px/600 uppercase
- Rows: 32px, alternating backgrounds
- Selected row: `--accent-primary` at 20% opacity
- Color column (events/clocks): 12px circle swatch + Fira Sans 12px name
