# Airplay Playout - Design System

> **Inherits from:** `.blah/steering/design.md` (global design steering)
>
> This file contains ONLY airplay-specific overrides and additions.
> For typography, base palette, spacing, z-index, interaction rules, and accessibility baseline — see the global steering file.

---

## Style

- **Primary Style:** Real-Time Monitoring Dashboard
- **Secondary Style:** Data-Dense Dashboard
- **Mode:** Dark Mode (OLED-class deep blacks)

### Key Effects (Airplay-Specific)

- Status indicator pulse/glow for live/on-air state
- Real-time countdown animations (pie chart, post-point)
- Smooth audio meter updates
- Alert pulse for critical states (late, error)
- Every animation conveys state — no decorative motion

### Anti-Patterns

- Decorative animations that distract from timing information
- Hover-dependent information (operators may use touch or keyboard)
- Layout shifts during playback state changes
- Slow transitions (>150ms) on transport controls

---

## Additional Color Tokens

These extend the global palette for airplay-specific needs.

### Transport & Timing

| Token | Hex | Usage |
|-------|-----|-------|
| `--timing-early` | `#22C55E` | Post-point: ahead of schedule (green) |
| `--timing-on-time` | `#3B82F6` | Post-point: on schedule (blue) |
| `--timing-late` | `#EF4444` | Post-point: behind schedule (red) |
| `--pie-fill` | `#3B82F6` | Pie counter fill |
| `--pie-talk` | `#F59E0B` | Talk time marker region |
| `--pie-bg` | `#1E293B` | Pie counter background |

### Sound Panel States

| Token | Hex | Usage |
|-------|-----|-------|
| `--panel-idle` | `#1E293B` | Unloaded button |
| `--panel-loaded` | `#0F172A` | Loaded but stopped |
| `--panel-playing` | `#166534` | Currently playing |
| `--panel-text` | `#F8FAFC` | Button label text |

### Post Counter Backgrounds

| State | Text | Background |
|-------|------|------------|
| Early | `#22C55E` | `#052e16` (green-950) |
| On Time | `#3B82F6` | `#172554` (blue-950) |
| Late | `#EF4444` | `#450a0a` (red-950) |

---

## Layout

### Fixed-Size Window

The main window is a fixed-size, non-scrolling layout for broadcast monitors. **No responsive breakpoints** — this is a dedicated terminal application.

- Target: 1920x1080 (primary), 1280x1024 (secondary)
- All panels have fixed pixel sizes

```
+--------------------------------------------------------------+
|  [Wall Clock]  [Mode Display]  [ON AIR]  [Message Label]     |  <- Top Bar (48px)
+--------------------------------------------------------------+
|          |                              |                     |
|  Log     |  Log List View               |  Timing Displays    |
|  Control |  (scrollable log lines)      |  - Pie Counter      |
|  Buttons |                              |  - Post Counter     |
|          |                              |  - Stop Counter     |
|  [Play]  |  [Hour Selector Bar]         |  - Audio Meters     |
|  [Stop]  |                              |                     |
|  [Pause] |                              |                     |
+--------------------------------------------------------------+
|  Sound Panel (button grid)              |  [Tab: Main/Aux1/2] |
+--------------------------------------------------------------+
```

### Panel Priorities (1280x1024 fallback)

1. Transport controls + Log List — always full height
2. Timing displays — always visible, may reduce Pie Counter size
3. Sound Panel — may reduce button count or button size
4. Hour Selector — may become compact dropdown

---

## Component Specifications

### Transport Buttons (Play/Stop/Pause)

- Size: 56x56px (above global 44px minimum for broadcast use)
- Colors: green (`--button-positive`), red (`--button-negative`), amber (`--button-caution`)
- State change feedback: <50ms (instant)
- Active state: filled background; Idle: outlined or muted

### Log List View

- Fixed-height rows: 32-36px
- Playing item: `--status-playing` left border (4px)
- Next item: `--accent-primary` left border (2px)
- Alternating row backgrounds: `--bg-secondary` / `--bg-primary`
- Timing columns: right-aligned, Fira Code
- Transition type badges: PLAY (blue), SEGUE (green), STOP (red)

### Pie Counter

- SVG circular countdown, 200-240px diameter
- Center: remaining time (Fira Code 36px/600)
- Talk markers: amber arc overlay at 30% opacity
- Animation: linear arc decrease at 100ms intervals, instant reset on item change

### Audio Meters

- Vertical peak-hold bars, 24px wide, stereo (L/R with 2px gap)
- Gradient: green (-40 to -12dB) → amber (-12 to -6dB) → red (-6 to 0dB)
- Peak hold: 2px line, 1.5s hold then smooth decay

### Mode Display

- Pill/badge style with color-coded background:
  - Manual: blue (`--accent-primary`)
  - Automatic: green (`--status-playing`)
  - Live Assist: amber (`--status-warning`)

### ON AIR Indicator

- On air: bright red background (`--status-on-air`) with subtle pulse
- Off air: muted/dark
- `prefers-reduced-motion`: static red, no pulse

### Hour Selector

- 24 slots horizontal bar, 40-60px per slot, 28px tall
- Current hour: `--accent-primary` background
- Hours with events: dot indicator
- Click: scroll log view to first event in that hour

### Wall Clock

- Fira Code 48px/700, centered in top bar
- 12h/24h toggle on click
- Colon blinks at 1Hz (`prefers-reduced-motion`: static)

---

## Pre-Delivery Checklist (Airplay-Specific)

### Real-Time Performance
- [ ] 100ms timer updates don't cause frame drops
- [ ] Audio meters render smoothly at 60fps
- [ ] Countdown displays use monospace to prevent digit shifting
- [ ] No layout recalculation on timer ticks

### Broadcast Safety
- [ ] Exit protection (password/confirmation) is enforced
- [ ] Single-instance check prevents duplicate launches
- [ ] ON AIR indicator is always visible
- [ ] Transport button state matches actual playback state
