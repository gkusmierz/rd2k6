# RDLibrary - Design System

> **Inherits from:** `.blah/steering/design.md` (global design steering)
>
> This file contains ONLY rdlibrary-specific overrides and additions.
> For typography, base palette, spacing, z-index, interaction rules, and accessibility baseline — see the global steering file.

---

## Style

- **Primary Style:** Media Asset Management Panel
- **Secondary Style:** Data-Dense CRUD Interface with Embedded Dialogs
- **Mode:** Dark Mode (inherits global OLED-class deep blacks)

### Design Philosophy Override

The Library Manager is an asset management tool used daily by broadcast operators. The UI must balance information density (large cart lists with many columns) with clear action paths (add, edit, delete, rip, record). The main window is a filterable list view with toolbar actions. Editing happens in modal dialogs stacked from the main window — this is a deliberate choice as library operations are discrete, modal tasks (unlike the SPA pattern used in RDAdmin).

### Key Effects (RDLibrary-Specific)

- Cart list row color-coding by group assignment
- Note bubble tooltips on cart hover (when enabled)
- Drag-and-drop visual feedback when drag mode is active
- Cut validity indicators: color-coded icons for always-valid, conditional, future, never-valid
- Real-time filter updates (synchronous mode) or explicit search trigger (asynchronous mode)
- Recording level meters with peak hold in recording dialog
- CD rip progress bars (per-track and overall)

### Anti-Patterns

- Inline editing in the cart list (all edits happen in modal dialogs)
- Hiding filter controls to save space (filters must always be visible)
- Using the SPA pattern — library operations are inherently modal/dialog-based
- Decorative animations during list updates
- Nested modals deeper than 2 levels

---

## Additional Color Tokens

These extend the global palette for rdlibrary-specific needs.

### Group Color System

Cart rows are color-coded by their group assignment. Groups have user-defined colors stored in the database. The UI applies these as row text/background tints.

| Token | Hex | Usage |
|-------|-----|-------|
| `--group-row-opacity` | `0.15` | Background opacity for group color tint |
| `--group-text-opacity` | `1.0` | Text color opacity when group-colored |

### Cart Type Indicators

| Token | Hex | Usage |
|-------|-----|-------|
| `--cart-audio` | `#3B82F6` | Audio cart type badge (blue-500) |
| `--cart-macro` | `#A855F7` | Macro cart type badge (purple-500) |

### Cut Validity States

| Token | Hex | Usage |
|-------|-----|-------|
| `--validity-always` | `#22C55E` | Always valid cut (green-500) |
| `--validity-conditional` | `#F59E0B` | Conditionally valid (amber-500) |
| `--validity-future` | `#3B82F6` | Future valid (blue-500) |
| `--validity-never` | `#EF4444` | Never valid (red-500) |
| `--validity-evergreen` | `#10B981` | Evergreen cut (emerald-500) |

### Recording States

| Token | Hex | Usage |
|-------|-----|-------|
| `--rec-idle` | `#1E293B` | Not recording (slate-800) |
| `--rec-active` | `#DC2626` | Recording in progress (red-600) |
| `--rec-active-bg` | `#450a0a` | Recording background tint (red-950) |
| `--rec-playing` | `#22C55E` | Playback preview (green-500) |

### Rip Progress

| Token | Hex | Usage |
|-------|-----|-------|
| `--rip-progress` | `#3B82F6` | Progress bar fill (blue-500) |
| `--rip-progress-bg` | `#1E293B` | Progress bar background (slate-800) |
| `--rip-complete` | `#22C55E` | Completed track indicator (green-500) |

### Filter & Search

| Token | Hex | Usage |
|-------|-----|-------|
| `--filter-bg` | `#0F172A` | Filter input background (slate-900) |
| `--filter-border` | `#334155` | Filter input border (slate-700) |
| `--filter-active-border` | `#3B82F6` | Active filter indicator (blue-500) |
| `--filter-match-bg` | `#172554` | Matched text highlight (blue-950) |

---

## Layout

### Main Window Structure

The main window uses a vertical stack layout with a toolbar, filter bar, cart list, and optional audio player strip.

```
+--------------------------------------------------------------+
| HEADER: [Station] - RDLibrary - [User]          [Close]      |  <- Title Bar
+--------------------------------------------------------------+
| FILTER BAR                                                    |  <- 48px
| [Filter Input] [Search] [Clear] [Group ▼] [Sched1 ▼] [S2 ▼] |
| [x] Audio  [x] Macro  [x] Matches  [x] Drag  [x] Notes      |  <- 32px toggles
+--------------------------------------------------------------+
|                                                               |
| CART LIST (multi-column, scrollable)                          |
| Cart# | Group | Len | Title | Artist | Start | End | ...     |
|  001  | MUSIC | 3:30| Song  | Band   | 01/01 | 12/31        |
|   └── Cut 001_001  | 3:30  | Full version  | Always Valid   |  <- Child row
|  002  | NEWS  | 0:45| Intro | —      | —     | —            |
|                                                               |
+--------------------------------------------------------------+
| TOOLBAR                                                       |  <- 48px
| [Add] [Add Macro] [Edit] [Delete] [Rip CD] [Reports] [Close] |
+--------------------------------------------------------------+
| AUDIO PLAYER (optional)                                       |  <- 36px
| [▶] [■]  Now Playing: Cart 001 - Song Title    [====--] 2:15 |
+--------------------------------------------------------------+
```

### Dialog Stack Pattern

All edit operations open as modal dialogs over the main window:

```
Level 0: Main Window (cart list)
  Level 1: Cart Editor Dialog (metadata + cut list)
    Level 2a: Recording Dialog (transport + meters)
    Level 2b: Single Track Ripper (CD track list + rip)
    Level 2c: Macro Command Editor (command editing)
    Level 2d: Notes Editor (free text)
    Level 2e: Scheduler Codes Editor (code assignment)
  Level 1: Batch CD Ripper Dialog (multi-track rip)
  Level 1: Reports Dialog (report selection + output)
```

### Dialog Sizing

| Dialog | Width | Height | Resizable |
|--------|-------|--------|-----------|
| Cart Editor | 720px | 600px | Yes (min 640x480) |
| Audio Cut Manager (tab) | — | — | Part of Cart Editor |
| Recording Dialog | 560px | 520px | No |
| Batch CD Ripper | 800px | 600px | Yes (min 720x500) |
| Single Track Ripper | 480px | 400px | No |
| Macro Editor (tab) | — | — | Part of Cart Editor |
| Notes Editor | 480px | 360px | Yes |
| Reports Dialog | 560px | 400px | No |

---

## Component Specifications

### Filter Bar

- Height: 48px (inputs) + 32px (toggles) = 80px total
- Background: `--bg-secondary` (#0F172A)
- Filter input: 300px width, `--filter-bg`, `--filter-border`, Fira Sans 14px/400
- Group dropdown: 160px width
- Scheduler code dropdowns: 140px width each
- Search/Clear buttons: 36px height, `--accent-primary` / ghost style
- Toggle checkboxes: Fira Sans 12px/400, `--text-secondary`, 4px gap

### Cart List (Tree View)

- Header row: `--bg-tertiary` background, Fira Sans 10px/600 uppercase, sticky
- Cart rows: 32px height, alternating `--bg-primary` / `--bg-secondary`
- Cut child rows: 28px height, 24px left indent, slightly muted text
- Group color: applied as left border (4px) + text color tint
- Selected row: `--accent-primary` background at 20% opacity
- Hover: `--bg-tertiary`
- Columns: cart number (Fira Code 12px), group, length (Fira Code), title, artist, dates, album, etc.
- Sortable columns: click header to sort, arrow indicator

### Cart Type Badge

- Inline pill badge next to cart number
- Audio: `--cart-audio` background, "A" label, 6px radius
- Macro: `--cart-macro` background, "M" label, 6px radius
- Size: 18x18px, Fira Sans 10px/700

### Validity Indicator

- Small circle icon (12px) in validity column
- Always valid: `--validity-always` filled circle
- Conditional: `--validity-conditional` half-filled circle
- Future: `--validity-future` clock icon
- Never valid: `--validity-never` X icon
- Evergreen: `--validity-evergreen` leaf icon
- Tooltip on hover shows validity reason

### Toolbar

- Height: 48px
- Background: `--bg-secondary`
- Buttons: 36px height, Fira Sans 13px/500
- Primary actions (Add, Edit): `--accent-primary` background
- Destructive actions (Delete): `--button-negative` background
- Neutral actions (Reports, Close): ghost style with `--text-secondary`
- Spacing: 8px gap between buttons
- Icon + label layout for each button (Lucide icons, 18px)

### Note Bubble

- Trigger: hover over cart row (when "Show Note Bubbles" enabled)
- Appearance: `--bg-tertiary` background, `--border-default` border, 8px radius
- Max width: 320px
- Content: Fira Sans 12px/400, `--text-primary`
- Shadow: 0 4px 12px rgba(0,0,0,0.3)
- Delay: 300ms hover before showing
- z-index: 40 (alerts layer)

### Audio Player Strip

- Height: 36px
- Background: `--bg-secondary`
- Transport buttons: 28x28px, Play/Stop
- Track info: Fira Sans 12px/400, `--text-secondary`
- Progress bar: 4px height, `--accent-primary` fill, `--bg-tertiary` track
- Time display: Fira Code 12px/400

### Disk Space Gauge

- Used in recording dialog
- Width: 100%, height: 20px
- Gradient fill: green (>50%) -> amber (20-50%) -> red (<20%)
- Label: "Disk Space: XX%" Fira Sans 11px/400

---

## Recording Dialog Specifics

### Transport Controls

- Record button: 48x48px circular, `--rec-active` when recording
- Play button: 48x48px circular, `--rec-playing` when playing
- Stop button: 48x48px circular, `--button-negative`
- Layout: horizontal center, 12px gaps

### Audio Level Meters

- Same design as airplay meters (see `.blah/specs/airplay/design-system/MASTER.md`)
- Vertical peak-hold bars, 24px wide, stereo (L/R)
- Gradient: green (-40 to -12dB) -> amber (-12 to -6dB) -> red (-6 to 0dB)
- Peak hold: 2px line, 1.5s hold

### Recording Timer

- Fira Code 36px/600, centered above transport controls
- Format: HH:MM:SS.ms
- Color: `--text-primary` when idle, `--rec-active` when recording

---

## CD Ripper Dialog Specifics

### Track List

- Header: "Track | Title | Artist | Length | Destination Cart"
- Rows: 32px height, alternating backgrounds
- Checkbox per track for selection
- Destination cart field: editable input, Fira Code 12px

### Progress Display

- Per-track: inline progress bar in track row, `--rip-progress` fill
- Overall: bottom bar, full width, `--rip-progress` fill
- Completed tracks: `--rip-complete` checkmark icon
- Status text: "Ripping track 3 of 12..." Fira Sans 12px/400

---

## Pre-Delivery Checklist (RDLibrary-Specific)

### Cart List Performance
- [ ] Cart list renders 10,000+ rows without frame drops
- [ ] Real-time filter updates feel instant (<100ms)
- [ ] Group colors render correctly for all group assignments
- [ ] Tree view expand/collapse is smooth

### Dialog Workflows
- [ ] All modal dialogs open centered over parent
- [ ] Focus trapped within active dialog
- [ ] Escape key closes topmost dialog
- [ ] Dialog stacking (level 2 over level 1) works correctly

### Recording
- [ ] Audio meters update at 60fps during recording
- [ ] Recording timer counts accurately
- [ ] Auto-trim applies correctly after stop
- [ ] Disk space gauge reflects actual available space

### CD Ripping
- [ ] Track list populates on CD insert
- [ ] Metadata lookup fills fields automatically
- [ ] Progress bars update smoothly during rip
- [ ] Multi-track sequential rip completes without errors

### Data Integrity
- [ ] Delete confirmation prevents accidental deletion
- [ ] Voice tracker carts are protected from deletion
- [ ] Clipboard operations work correctly (copy/paste)
- [ ] Notifications from other clients update display in real-time
