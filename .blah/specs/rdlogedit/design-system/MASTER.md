# RDLogEdit - Design System

> **Inherits from:** `.blah/steering/design.md` (global design steering)
>
> This file contains ONLY rdlogedit-specific overrides and additions.
> For typography, base palette, spacing, z-index, interaction rules, and accessibility baseline — see the global steering file.

---

## Style

- **Primary Style:** Broadcast Log Editor with Timeline View
- **Secondary Style:** Voice Tracking Studio Interface
- **Mode:** Dark Mode (inherits global OLED-class deep blacks)

### Design Philosophy Override

RDLogEdit is a precision scheduling tool. The main window is a filterable log list (browse/manage). Editing happens in modal dialogs with rich line lists. The voice tracker is a dedicated window with audio waveform visualization and recording transport — the most visually complex component in this module.

### Key Effects (RDLogEdit-Specific)

- Cart validity color-coding on log lines (6 states with distinct colors)
- Voice tracker waveform display with three overlapping audio tracks
- Real-time VU meters during voice tracking
- Drag-and-drop insertion of carts into log line lists
- Log status icons (validity, link status, completion state)
- Lock indicator showing which user holds the editing lock

### Anti-Patterns

- Allowing editing without acquiring a lock
- Hiding validity colors (they are critical for scheduling safety)
- Modal dialogs for navigation within the voice tracker (it must feel like a DAW)
- Slow waveform rendering (must be real-time at recording speed)

---

## Additional Color Tokens

### Cart Validity Colors (Log Lines)

| Token | Hex | Usage |
|-------|-----|-------|
| `--line-valid` | `#22C55E` | Always valid + enabled group (green-500) |
| `--line-valid-bg` | `#052e1610` | Valid line background tint |
| `--line-conditional` | `#F59E0B` | Conditionally valid (amber-500) |
| `--line-conditional-bg` | `#78350f10` | Conditional line background tint |
| `--line-future` | `#3B82F6` | Future valid (blue-500) |
| `--line-future-bg` | `#17255410` | Future line background tint |
| `--line-evergreen` | `#10B981` | Evergreen cart (emerald-500) |
| `--line-evergreen-bg` | `#06493510` | Evergreen line background tint |
| `--line-invalid` | `#EF4444` | Never valid / invalid cart (red-500) |
| `--line-invalid-bg` | `#450a0a15` | Invalid line background tint |
| `--line-disabled` | `#64748B` | Group disabled for service (slate-500) |
| `--line-disabled-bg` | `#33415510` | Disabled line background tint |

### Voice Tracker

| Token | Hex | Usage |
|-------|-----|-------|
| `--waveform-preroll` | `#3B82F6` | Pre-roll waveform color (blue-500) |
| `--waveform-record` | `#EF4444` | Recording waveform color (red-500) |
| `--waveform-postroll` | `#22C55E` | Post-roll waveform color (green-500) |
| `--waveform-bg` | `#0F172A` | Waveform background (slate-900) |
| `--waveform-grid` | `#1E293B` | Waveform grid lines (slate-800) |
| `--waveform-cursor` | `#F8FAFC` | Playback cursor (slate-50) |
| `--segue-marker` | `#F59E0B` | Segue point marker (amber-500) |
| `--crossfade-region` | `#F59E0B20` | Crossfade overlap region tint |
| `--vt-idle` | `#1E293B` | Voice tracker idle state (slate-800) |
| `--vt-preroll` | `#172554` | Pre-roll active state (blue-950) |
| `--vt-recording` | `#450a0a` | Recording active state (red-950) |
| `--vt-postroll` | `#052e16` | Post-roll active state (green-950) |

### Log Status Icons

| Token | Hex | Usage |
|-------|-----|-------|
| `--log-linked` | `#22C55E` | Fully linked log (green-500) |
| `--log-partial` | `#F59E0B` | Partially linked (amber-500) |
| `--log-unlinked` | `#64748B` | Not linked (slate-500) |
| `--log-locked` | `#EF4444` | Locked by another user (red-500) |

### Transition Type Badges

| Token | Hex | Usage |
|-------|-----|-------|
| `--trans-play` | `#3B82F6` | PLAY transition (blue-500) |
| `--trans-segue` | `#22C55E` | SEGUE transition (green-500) |
| `--trans-stop` | `#EF4444` | STOP transition (red-500) |

---

## Layout

### Main Window

```
+--------------------------------------------------------------+
| HEADER: [Station] - RDLogEdit - [User]                       |
+--------------------------------------------------------------+
| FILTER BAR                                                    |
| [Filter Input] [Service ▼]                                    |
+--------------------------------------------------------------+
| LOG LIST (scrollable table)                                   |
| Name | Description | Service | Music | Traffic | VT | Dates  |
+--------------------------------------------------------------+
| TOOLBAR                                                       |
| [Add] [Edit] [Delete] [Voice Track] [Reports] [Close]        |
+--------------------------------------------------------------+
```

### Log Editor Dialog

Modal dialog, 900x650px, resizable.

```
+--------------------------------------------------------------+
| Log Editor - LOG_20260408                            [X]     |
+--------------------------------------------------------------+
| METADATA                                                     |
| Name: LOG_20260408  Service: [Radio Riv ▼]  [x] Auto-Ref    |
| Start: [04/08/26]  End: [04/08/26]  Purge: [04/15/26]       |
+--------------------------------------------------------------+
| LOG LINE LIST (scrollable, color-coded by validity)          |
| # | Type | Start    | Trans | Cart   | Group | Len  | Title |
| 1 | Cart | 06:00:00 | PLAY  | 100001 | MUSIC | 3:30 | ...  |
| 2 | Cart | 06:03:30 | SEGUE | 100002 | MUSIC | 4:12 | ...  |
| 3 | Mark | 06:07:42 | PLAY  | —      | —     | —    | TOP  |
| 4 | VT   | 06:07:42 | SEGUE | 500001 | VOICE | 0:30 | ...  |
+--------------------------------------------------------------+
| [Ins Cart] [Ins Meta] [Edit] [Del] [Cut] [Copy] [Paste]     |
| [Up] [Down]  [Save] [Save As] [Render] [Reports] [OK] [Can] |
+--------------------------------------------------------------+
```

### Voice Tracker Window

Dedicated window, 1100x700px, resizable.

```
+--------------------------------------------------------------+
| Voice Tracker - LOG_20260408                         [X]     |
+--------------------------------------------------------------+
| LOG LINE LIST (compact, current position highlighted)        |
| [context menu: change transition type]                       |
+--------------------------------------------------------------+
| WAVEFORM DISPLAY (three tracks, time-aligned)                |
| Pre-Roll (blue)  ███████████████████████                     |
| Recording (red)            ██████████████████████             |
| Post-Roll (green)                    ███████████████████████  |
|                            ▼ segue ▼                         |
+--------------------------------------------------------------+
| VU METERS  |  TRANSPORT                  |  STATUS           |
| [L] [R]    |  [Track1] [REC] [Track2]    |  Remaining: 12    |
|            |  [Finished]                  |  Time: 00:15:30   |
|            |  [Prev] [Next] [Ins] [Del]   |                   |
+--------------------------------------------------------------+
```

---

## Component Specifications

### Log List Table

- Header: `--bg-tertiary`, Fira Sans 10px/600 uppercase
- Rows: 32px height, alternating `--bg-primary` / `--bg-secondary`
- Status icons: 14x14px inline SVGs
  - Music linked: musical note icon, `--log-linked`
  - Traffic linked: traffic icon, `--log-linked`
  - VT progress: "5/12" text format, Fira Code 10px
  - Locked: lock icon, `--log-locked`
- Hover: `--bg-tertiary`
- Double-click opens editor

### Log Line List (Editor)

- Rows: 28px height
- Background tint: based on cart validity state (see color tokens)
- Type icon column: 24px, cart/marker/chain/VT icons
- Cart number: Fira Code 12px
- Transition badge: PLAY/SEGUE/STOP with matching colors
- Time column: Fira Code 11px, right-aligned
- Drag handles on left for reorder
- Drop zone indicator: 2px blue line between rows

### Waveform Display

- Background: `--waveform-bg`
- Grid: vertical time markers every 1s, `--waveform-grid`
- Pre-roll waveform: `--waveform-preroll`, rendered left-to-right
- Recording waveform: `--waveform-record`, grows in real-time during recording
- Post-roll waveform: `--waveform-postroll`, rendered right-to-left (overlap)
- Playback cursor: 1px vertical line, `--waveform-cursor`
- Segue markers: draggable triangles, `--segue-marker`
- Crossfade overlap region: filled with `--crossfade-region`
- Min height: 200px, max: fills available space

### Voice Tracker Transport

- Button layout: horizontal row, center-aligned
- Track 1: 56x40px, `--waveform-preroll` when active
- Record: 56x40px circular indicator, `--waveform-record` when active
- Track 2: 56x40px, `--waveform-postroll` when active
- Finished: 56x40px, `--accent-primary`
- State-dependent enable/disable (grayed at 40% opacity when inactive)
- Background of transport area changes with state (`--vt-idle` / `--vt-preroll` / `--vt-recording` / `--vt-postroll`)

### VU Meters

- Same design as airplay audio meters
- Vertical, 24px wide, stereo L/R
- Height: 120px minimum
- Peak hold at 1.5s

---

## Pre-Delivery Checklist (RDLogEdit-Specific)

### Log Editing
- [ ] All 6 validity colors render correctly on log lines
- [ ] Drag-and-drop reordering works smoothly
- [ ] External cart drag-drop inserts at correct position
- [ ] Lock indicator shows correct user/station information
- [ ] Save/Cancel/OK three-way dialog works for unsaved changes

### Voice Tracking
- [ ] Waveform display renders at 60fps during recording
- [ ] Three tracks display correctly with overlapping regions
- [ ] Segue markers are draggable and snap to valid positions
- [ ] VU meters update in real-time during recording
- [ ] State machine transitions match specification exactly
- [ ] Import workflow functions as alternative to recording

### Reports & Rendering
- [ ] All three report types generate correctly
- [ ] Render progress indicator updates accurately
- [ ] Cancel during render aborts cleanly
