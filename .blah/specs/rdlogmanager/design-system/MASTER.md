# RDLogManager - Design System

> **Inherits from:** `.blah/steering/design.md` (global design steering)
>
> This file contains ONLY rdlogmanager-specific overrides and additions.
> For typography, base palette, spacing, z-index, interaction rules, and accessibility baseline — see the global steering file.

---

## Style

- **Primary Style:** Multi-Panel Scheduling Dashboard
- **Secondary Style:** Visual Clock/Grid Builder
- **Mode:** Dark Mode (inherits global OLED-class deep blacks)

### Design Philosophy Override

Log Manager is the most complex scheduling application in the Rivendell suite, with 22 UI screens organized around 5 domains: Events, Clocks, Grids, Logs, and Reports. The main window uses a tabbed interface to switch between these domains. The Event and Clock editors use split-panel layouts with content libraries and visual representations. The Grid editor is a unique 7x24 color-coded button matrix. All editors are modal dialogs.

### Key Effects (RDLogManager-Specific)

- Visual clock representation: circular 60-minute pie chart showing event time slots
- 7x24 weekly grid with color-coded hour buttons matching clock colors
- Event color coding throughout (lists, clock editor, grid buttons)
- Log generation status indicators (green/red/neutral for merge state)
- Calendar date picker with highlighted dates for existing log data
- Dual-list selectors for service permissions
- Drag-and-drop from content library to import lists
- Real-time library filtering with group/type selectors

### Anti-Patterns

- Flattening the domain hierarchy (events-clocks-grids must remain distinct)
- Hiding the visual clock (the pie chart is essential for understanding hourly composition)
- Using text-only grid view (color-coded buttons are critical for quick scanning)
- Merging traffic before music (business rule: music must be merged first)

---

## Additional Color Tokens

### Event Colors (User-Defined)

Events have user-assigned colors for visual identification. These are stored in the database and rendered as:
- Event list row: left border (4px) + subtle background tint
- Clock editor: event slice in pie chart
- Grid editor: hour button background

| Token | Usage |
|-------|-------|
| `--event-color-opacity` | 0.15 for background tint, 1.0 for border and pie chart |

### Log Generation Status

| Token | Hex | Usage |
|-------|-----|-------|
| `--gen-available` | `#22C55E` | File available / data merged (green-500) |
| `--gen-missing` | `#EF4444` | File missing / merge needed (red-500) |
| `--gen-neutral` | `#64748B` | Not applicable (slate-500) |
| `--gen-progress` | `#3B82F6` | Generation in progress (blue-500) |

### Clock Visual

| Token | Hex | Usage |
|-------|-----|-------|
| `--clock-bg` | `#0F172A` | Clock pie background (slate-900) |
| `--clock-ring` | `#334155` | Clock outline ring (slate-700) |
| `--clock-tick` | `#475569` | Clock minute tick marks (slate-600) |
| `--clock-hour-mark` | `#94A3B8` | Clock hour marks 12/3/6/9 (slate-400) |
| `--clock-selected` | `#3B82F6` | Selected event slice highlight (blue-500) |

### Grid Editor

| Token | Hex | Usage |
|-------|-----|-------|
| `--grid-empty` | `#1E293B` | Unassigned hour slot (slate-800) |
| `--grid-border` | `#334155` | Grid cell border (slate-700) |
| `--grid-hover` | `#475569` | Hovered grid cell (slate-600) |
| `--grid-header-bg` | `#0F172A` | Day/hour header background (slate-900) |

### Import List

| Token | Hex | Usage |
|-------|-----|-------|
| `--import-cart` | `#3B82F6` | Cart import line (blue-500) |
| `--import-marker` | `#F59E0B` | Marker import line (amber-500) |
| `--import-voice` | `#A855F7` | Voice track marker (purple-500) |
| `--import-drop-zone` | `#3B82F620` | Drop target highlight (blue-500/12%) |

---

## Layout

### Main Window — Tabbed Interface

```
+--------------------------------------------------------------+
| HEADER: RDLogManager — [Station] — [User]                    |
+--------------------------------------------------------------+
| TABS: [Events] [Clocks] [Grids] [Logs] [Reports]            |
+--------------------------------------------------------------+
| TAB CONTENT (full height, varies by tab)                     |
|                                                              |
| Events: filter + event list + action buttons                 |
| Clocks: filter + clock list + action buttons                 |
| Grids: service list + action buttons                         |
| Logs: service list + generation button + purge button        |
| Reports: date picker + report selector + generate button     |
+--------------------------------------------------------------+
```

### Event Editor — Split Panel

```
+--------------------------------------------------------------+
| Event Editor — "Morning Music Block"                 [X]     |
+--------------------------------------------------------------+
| LEFT (45%): Content Library    | RIGHT (55%): Event Config   |
| [Search____] [Group▼] [Type▼] |                              |
| Cart# | Title      | Artist   | [Timing Section]             |
| 1234  | Bohemian.. | Queen    | Start: [07:00] Hard: [x]     |
| 1235  | Hotel Ca.. | Eagles   | Grace: (o) Immediate         |
|                                | Trans: [SEGUE ▼]             |
| ── Pre-Import List ──         |                              |
| [drag here]                   | [Import Section]             |
| 1. Cart 003001 Station ID     | Source: (o) Scheduler        |
|                                | Group: [MUSIC ▼]             |
| ── Post-Import List ──        | Artist Sep: [15 ▲▼]          |
| [drag here]                   | Title Sep: [0 ▲▼]            |
| 1. Cart 003010 Weather Jingle | Code 1: [HOT ▼]              |
|                                | Code 2: [None ▼]             |
|                                | Autofill: [x] Slop: [1:00]  |
|                                |                              |
|                                | [Svc Permissions...]         |
+--------------------------------------------------------------+
| [Save] [Save As]                           [OK] [Cancel]     |
+--------------------------------------------------------------+
```

### Clock Editor — Split Panel

```
+--------------------------------------------------------------+
| Clock Editor — "Morning Drive"                       [X]     |
+--------------------------------------------------------------+
| LEFT (40%): Event List         | RIGHT (60%): Clock Visual   |
| Event          | Start | End   |                              |
| Morning Music  | :00   | :20   |  ┌────────────────────┐      |
| News Block     | :20   | :30   |  │   Circular Pie     │      |
| Music Fill     | :30   | :55   |  │   Chart (60 min)   │      |
| Station Close  | :55   | :00   |  │                    │      |
|                                |  │   Color-coded      │      |
| [Add] [Clone] [Edit] [Del]    |  │   event slices     │      |
|                                |  └────────────────────┘      |
| Code: [MDRV]                  |                              |
| Color: [●]                    | [Scheduler Rules...]         |
+--------------------------------------------------------------+
| [Save] [Save As]     [Svc Permissions]     [OK] [Cancel]     |
+--------------------------------------------------------------+
```

### Grid Editor — 7x24 Matrix

```
+--------------------------------------------------------------+
| Grid Editor — Service: Radio Rivendell               [X]     |
+--------------------------------------------------------------+
|      | Mon   | Tue   | Wed   | Thu   | Fri   | Sat   | Sun   |
| 00:00| OVER  | OVER  | OVER  | OVER  | OVER  | WEEK  | WEEK  |
| 01:00| OVER  | OVER  | OVER  | OVER  | OVER  | WEEK  | WEEK  |
| ...  |       |       |       |       |       |       |       |
| 06:00| MDRV  | MDRV  | MDRV  | MDRV  | MDRV  | WEEK  | WEEK  |
| 07:00| MDRV  | MDRV  | MDRV  | MDRV  | MDRV  | WEEK  | WEEK  |
| ...  |       |       |       |       |       |       |       |
| 23:00| OVER  | OVER  | OVER  | OVER  | OVER  | WEEK  | WEEK  |
+--------------------------------------------------------------+
| [Set All Clocks]                                     [Close] |
+--------------------------------------------------------------+
```

Each cell is a clickable button colored by clock color, showing clock short code.

---

## Component Specifications

### Tab Bar

- Height: 40px
- Background: `--bg-secondary`
- Active tab: `--accent-primary` bottom border (3px), `--text-primary`
- Inactive tab: no border, `--text-secondary`
- Icons: optional, 16px Lucide icons per tab
- Tab labels: Events, Clocks, Grids, Logs, Reports

### Clock Pie Chart

- Size: 300x300px (scalable)
- Background: `--clock-bg` circle
- Ring: 2px `--clock-ring` border
- Tick marks: 60 minor ticks around perimeter, `--clock-tick`
- Hour marks: 4 labels (12, 3, 6, 9 o'clock), `--clock-hour-mark`, Fira Code 11px
- Event slices: filled arcs using event colors, stroke at slice boundaries
- Selected slice: `--clock-selected` inner highlight ring
- Hover: slight brightness increase on slice
- Empty time: `--clock-bg` (unfilled)

### 7x24 Grid Matrix

- Cell size: min 64x28px
- Cell font: Fira Code 10px/600, clock short code
- Cell background: clock color at 80% opacity, or `--grid-empty` if unassigned
- Cell border: 1px `--grid-border`
- Cell hover: `--grid-hover` overlay
- Day headers: `--grid-header-bg`, Fira Sans 11px/600, uppercase abbreviations
- Hour headers: `--grid-header-bg`, Fira Code 10px, ":00" suffix
- Right-click: context menu (Edit Clock, Clear)

### Dual-List Selector

- Same pattern as RDAdmin (see rdadmin design-system)
- Available (left) / Assigned (right) lists
- Arrow buttons between (assign/unassign)
- Search filter at top of each list

### Content Library Browser (Event Editor)

- Search input: 100% width, `--filter-bg`, placeholder "Search carts..."
- Group dropdown: below search, full width
- Type toggle: Audio / Macro radio buttons
- List: cart#, title, artist columns, 28px row height
- Drag handle: left side for drag-to-import

### Import List (Pre/Post)

- Section headers: "Pre-Import" / "Post-Import", Fira Sans 11px/600 uppercase
- Rows: 28px, numbered
- Item types: Cart (blue icon), Note Marker (amber icon), Voice Track (purple icon)
- Drop zone: `--import-drop-zone` highlight when dragging over
- Transition badge per item: PLAY/SEGUE/STOP

### Log Generation Dialog

- Service selector: dropdown
- Date picker: calendar with single-date selection
- Status indicators: 3 rows (Log, Music, Traffic)
  - Each row: label + status icon (green circle, red circle, or grey circle)
- Action buttons: Create, Merge Music, Merge Traffic
  - Disabled states when not applicable (Traffic disabled before Music merge)
- Progress bar during generation: `--gen-progress` fill

---

## Pre-Delivery Checklist (RDLogManager-Specific)

### Events
- [ ] Event list filters by service correctly
- [ ] Drag-and-drop from library to import lists works
- [ ] Event color displays in list, clock editor, and grid
- [ ] Nested event references resolve correctly
- [ ] Rename updates all references (clocks, permissions)
- [ ] Delete warns about clock usage

### Clocks
- [ ] Pie chart renders event slices with correct colors and proportions
- [ ] Pie chart updates in real-time as events are added/modified
- [ ] Clock short code validates uniqueness
- [ ] Scheduler rules dialog works correctly
- [ ] Save As creates independent copy with permissions

### Grids
- [ ] 7x24 grid renders with clock colors
- [ ] Click opens clock picker
- [ ] Right-click context menu works
- [ ] Set All Clocks fills entire grid
- [ ] Grid persists correctly per service

### Log Generation
- [ ] Status indicators update correctly for file availability
- [ ] Create, Merge Music, Merge Traffic execute in correct order
- [ ] Confirmation dialogs appear for destructive operations
- [ ] Voice track warning appears with correct count
- [ ] Progress indicator updates during generation
- [ ] CLI mode works with all flag combinations
