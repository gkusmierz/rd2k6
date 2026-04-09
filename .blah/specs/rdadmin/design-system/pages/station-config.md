# Station Configuration - Page Override

> Inherits all rules from MASTER.md and entity-editor.md. Only deviations listed here.
> The Stations section is the most complex in rdadmin, with 6 content tabs covering 4 requirements.

## Layout Override

### Tab Structure

When a station is selected for editing, the content area shows a tabbed interface:

```
+----------------------------------------------------------------+
| [Back to Station List]  Station: MAIN-STUDIO                   |
+----------------------------------------------------------------+
| [Core] [App Profiles] [Hardware] [Switchers] [Dropboxes] [Vars]|
+----------------------------------------------------------------+
| (Tab content here)                                             |
+----------------------------------------------------------------+
```

- Tab bar: sticky below breadcrumb
- Tab count: 6 (may require horizontal scroll on narrow viewports)
- Each tab loads its sub-content within the same scrollable area

### App Profiles Sub-Tabs (Req 6)

Within the "App Profiles" tab, a secondary tab row:

```
| [AirPlay] [Library] [Log Editor] [Panel] [Decks] [Hotkeys] |
```

- Secondary tabs: smaller (28px height), `--bg-tertiary` background
- Active: `--accent-primary` underline

### Hardware Sub-Tabs (Req 7)

Within the "Hardware" tab:

```
| [Audio Ports] [Serial Ports] [Audio Server] [Plugins] [Cart Slots] |
```

## AirPlay Profile Integration

### Split View

When the AirPlay sub-tab is active, the content splits:

```
+------ AirPlay Profile Form (60%) ------+------ Preview (40%) -------+
| Audio Configuration                     |  +-- Mini Playout -------+ |
| - Card: [dropdown]                      |  | [Clock] [Mode] [ONAIR]| |
| - Port 1 Input: [dropdown]             |  | [Log List area]       | |
| - Port 1 Output: [dropdown]            |  | [Sound Panel grid]    | |
|                                         |  +------------------------+ |
| Log Machine Configuration               |  Preview updates as you   |
| - Virtual Log 1: [checkbox] [settings] |  change settings above    |
| - Virtual Log 2: [checkbox] [settings] |                           |
|                                         |                           |
| Visual & Behavior                       |                           |
| - Skin: [dropdown with preview]        |                           |
| - Start Mode: [radio group]            |                           |
| - Segue Length: [number input]         |                           |
|                                         |                           |
| GPIO Channels                           |                           |
| - Channel assignment grid              |                           |
+-----------------------------------------+---------------------------+
```

### Mini-Preview Component

The preview panel renders a scaled-down (non-interactive) version of the airplay playout
window using the design tokens from `.blah/specs/airplay/design-system/MASTER.md`:

- Scale: approximately 40% of actual playout window
- Background: `--bg-primary` with `--border-default` border
- Shows: top bar (clock, mode), log list (3-4 sample rows), sound panel (button grid)
- Transport controls: visible but non-interactive (grayed overlay)
- Updates reactively: changing log machine count updates visible log tabs,
  changing sound panel grid size updates preview grid

### Mini-Preview Color Tokens

Reuses airplay tokens directly:
- `--timing-early`, `--timing-on-time`, `--timing-late` for sample timing display
- `--panel-idle`, `--panel-loaded`, `--panel-playing` for sample sound buttons
- Transport button colors: `--button-positive`, `--button-negative`, `--button-caution`

## Switcher Config (Req 8)

### Matrix List + Inline Detail

- Top: list of matrices for this station (compact table)
- Bottom (or expand): matrix detail form when a matrix is selected
- Detail includes tabbed sub-sections: Connection, Inputs, Outputs, GPI, GPO, Nodes

### Endpoint Grid

For matrix inputs/outputs:

- Grid view: numbered slots, name editable inline
- Color-coded: connected (green dot), disconnected (gray), error (red dot)

## Dropbox Config (Req 9)

- Standard entity list with inline expand for editing
- "Duplicate" button in addition to standard Add/Edit/Delete
- Path field: text input with folder icon (no file picker — plain text)

## Host Variables (Req 15)

- Simple three-column table: Name, Value, Remark
- Inline editing: click cell to edit
- No separate form — all editing happens in-table
