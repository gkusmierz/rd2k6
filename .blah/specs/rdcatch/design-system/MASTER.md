# RDCatch - Design System

> **Inherits from:** `.blah/steering/design.md` (global design steering)
>
> This file contains ONLY rdcatch-specific overrides and additions.
> For typography, base palette, spacing, z-index, interaction rules, and accessibility baseline — see the global steering file.

---

## Style

- **Primary Style:** Real-Time Monitoring Dashboard with Event Scheduler
- **Secondary Style:** Multi-Station Deck Monitor Panel
- **Mode:** Dark Mode (inherits global OLED-class deep blacks)

### Design Philosophy Override

RDCatch is a monitoring-first application. The top section displays real-time deck status widgets with audio meters — always visible. Below sits the event list with color-coded status rows. The focus is on situational awareness: operators must see at a glance what's recording, what's next, and what's failed. Event editors are modal dialogs opened from the list.

### Key Effects (RDCatch-Specific)

- Real-time deck status widgets with audio level meters
- Event row color-coding by status (6 states)
- Day-of-week indicator pills (MTWTFSS) per event
- GPI trigger indicators (waiting/triggered states)
- Heartbeat connectivity indicators per station
- Audition transport controls (head/tail preview)

### Anti-Patterns

- Hiding deck monitors (they must always be visible during operation)
- Slow meter updates (must be real-time, same spec as airplay)
- Modal editors blocking deck monitoring view
- Hiding event status colors (critical for operational awareness)

---

## Additional Color Tokens

### Event Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--evt-idle` | `#F8FAFC` | Idle event (slate-50 text on dark bg) |
| `--evt-idle-bg` | `transparent` | Idle background |
| `--evt-ready` | `#22D3EE` | Ready / armed (cyan-400) |
| `--evt-ready-bg` | `#083344` | Ready background (cyan-950) |
| `--evt-active` | `#22C55E` | Active / in progress (green-500) |
| `--evt-active-bg` | `#052e16` | Active background (green-950) |
| `--evt-next` | `#FACC15` | Next scheduled (yellow-400) |
| `--evt-next-bg` | `#422006` | Next background (amber-950) |
| `--evt-waiting` | `#D946EF` | Waiting for GPI trigger (fuchsia-500) |
| `--evt-waiting-bg` | `#4a044e` | Waiting background (fuchsia-950) |
| `--evt-error` | `#FB7185` | Error state (rose-400) |
| `--evt-error-bg` | `#4c0519` | Error background (rose-950) |

### Event Type Icons

| Type | Icon | Color |
|------|------|-------|
| Recording | `mic` | `#EF4444` (red-500) |
| Playout | `play-circle` | `#22C55E` (green-500) |
| Download | `download` | `#3B82F6` (blue-500) |
| Upload | `upload` | `#A855F7` (purple-500) |
| Macro | `terminal` | `#F59E0B` (amber-500) |
| Switch | `git-branch` | `#06B6D4` (cyan-500) |

### Deck Monitor

| Token | Hex | Usage |
|-------|-----|-------|
| `--deck-idle` | `#1E293B` | Idle deck background (slate-800) |
| `--deck-recording` | `#450a0a` | Recording deck background (red-950) |
| `--deck-playing` | `#052e16` | Playing deck background (green-950) |
| `--deck-waiting` | `#422006` | Waiting deck background (amber-950) |
| `--deck-offline` | `#0F172A` | Offline deck (slate-900, dimmed) |
| `--deck-border` | `#334155` | Deck widget border (slate-700) |

### Connectivity

| Token | Hex | Usage |
|-------|-----|-------|
| `--conn-ok` | `#22C55E` | Connected (green-500) |
| `--conn-warn` | `#F59E0B` | Latency warning (amber-500) |
| `--conn-fail` | `#EF4444` | Disconnected (red-500) |

---

## Layout

### Main Window

```
+--------------------------------------------------------------+
| HEADER: RDCatch — [Station] — [User]                        |
+--------------------------------------------------------------+
| DECK MONITORS (horizontal row, scrollable if many)           |
| [Deck 1: Rec]  [Deck 2: Play]  [Deck 3: Idle]  [Deck 4]   |
| with VU meters, status, cut info, abort/monitor buttons      |
+--------------------------------------------------------------+
| FILTER BAR                                                    |
| [x] Active Only  [x] Today Only  Day: [All ▼]  Type: [All▼] |
+--------------------------------------------------------------+
| EVENT LIST (scrollable, color-coded by status)               |
| Desc | Station | Deck | Start | End | Source | Dest | MTWTFSS|
+--------------------------------------------------------------+
| TOOLBAR                                                       |
| [Add] [Edit] [Delete] [▶Head] [▶Tail] [■Stop] [Reports]    |
+--------------------------------------------------------------+
```

---

## Component Specifications

### Deck Monitor Widget

- Width: 240px, height: 100px
- Background: status-based (`--deck-idle`, `--deck-recording`, etc.)
- Border: 1px `--deck-border`, 8px radius
- Layout:
  ```
  [Station: MAIN] [Ch: 1]  [● Recording]
  Cut: 001234_001 — Morning Show
  Desc: Daily recording 6-10am
  [L ████░░] [R ███░░░]    [Abort] [Mon]
  ```
- Station label: Fira Sans 11px/600
- Status indicator: colored dot + label
- Cut info: Fira Code 11px
- VU meters: horizontal, 80px wide, same gradient as airplay meters
- Buttons: 24x24px icon buttons (abort = red, monitor = blue)
- Offline state: dimmed to 40% opacity, "OFFLINE" label

### Event List

- Header: `--bg-tertiary`, 10px/600 uppercase
- Rows: 32px height
- Status background: uses `--evt-*-bg` tokens
- Status text color: uses `--evt-*` tokens
- Type column: 28px, icon from Event Type Icons table
- Day-of-week: 7 small pills (16x16px each)
  - Active day: `--accent-primary` background
  - Inactive day: `--bg-tertiary`
  - Labels: M T W T F S S
- One-shot flag: single-use icon (if set)
- Double-click opens event editor

### Filter Bar

- Height: 36px
- Background: `--bg-secondary`
- Checkboxes: "Active Only", "Today Only"
- Day dropdown: All Days / Weekdays / Mon / Tue / ... / Sun
- Type dropdown: All Types / Recording / Playout / Download / Upload / Macro / Switch
- All inline, horizontal layout

### Audition Transport

- Part of toolbar, grouped together
- Head play: small green play button
- Tail play: small green play button
- Stop: red stop button
- Disabled state: 40% opacity when no event selected or during playback
- Size: 28x28px each

---

## Pre-Delivery Checklist (RDCatch-Specific)

### Deck Monitoring
- [ ] Deck widgets update in real-time
- [ ] VU meters animate during recording/playback
- [ ] Status colors change correctly across all states
- [ ] Abort stops active recording immediately
- [ ] Offline decks show dimmed state with label

### Event Management
- [ ] All 6 event types create correctly via Add dialog
- [ ] Duplicate prevention works across all event types
- [ ] Active events cannot be edited (error dialog)
- [ ] Event status colors render correctly for all 6 states
- [ ] Day-of-week pills display correct schedule

### Connectivity
- [ ] Heartbeat timeout triggers warning
- [ ] Connection status indicators update per station
- [ ] Reconnection attempted after failure
