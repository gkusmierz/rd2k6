# Airplay Playout - Design System

> Mission-critical broadcast radio playout application for the Rivendell radio automation system.
> Designed for continuous on-air use by broadcast operators in control-room environments.

---

## Design Philosophy

**Operational clarity over aesthetics.** Every pixel serves the operator's situational awareness. This is a control-room application where split-second decisions happen during live broadcasts. Readability, status visibility, and muscle-memory interactions take absolute priority.

**Dark-first.** Broadcast control rooms are low-light environments. Dark mode reduces eye strain during long shifts and makes status indicators more visible.

**Information density.** Operators need simultaneous access to log contents, transport controls, timing displays, sound panel, and audio meters. Maximize data visibility without clutter.

---

## Style

- **Primary Style:** Real-Time Monitoring Dashboard
- **Secondary Style:** Data-Dense Dashboard
- **Mode:** Dark Mode (OLED-class deep blacks)
- **Performance:** Excellent (real-time updates at 100ms intervals)
- **Accessibility:** WCAG AA minimum, AAA for critical status text
- **Complexity:** Medium-High (many widgets, but each is focused)

### Key Effects

- Status indicator pulse/glow for live/on-air state
- Real-time countdown animations (pie chart, post-point)
- Smooth data stream updates for audio meters
- Alert pulse for critical states (late, error)
- Minimal decorative animation -- every animation conveys state
- `prefers-reduced-motion`: disable pulse/glow, keep numeric countdowns

### Anti-Patterns to AVOID

- Decorative animations that distract from timing information
- Hover-dependent information (operators may use touch or keyboard)
- Low-contrast status indicators
- Layout shifts during playback state changes
- Slow transitions (>150ms) on transport controls -- they must feel instant
- Emojis as icons -- use SVG icons exclusively

---

## Color Palette

### Base (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#020617` | Main background (slate-950) |
| `--bg-secondary` | `#0F172A` | Panel/card background (slate-900) |
| `--bg-tertiary` | `#1E293B` | Elevated surfaces, input fields (slate-800) |
| `--border-default` | `#334155` | Panel borders (slate-700) |
| `--border-subtle` | `#1E293B` | Subtle separators (slate-800) |
| `--text-primary` | `#F8FAFC` | Primary text (slate-50) |
| `--text-secondary` | `#CBD5E1` | Secondary/label text (slate-300) |
| `--text-muted` | `#94A3B8` | Disabled/hint text (slate-400) |

### Status Colors (Critical for Broadcast)

| Token | Hex | Usage |
|-------|-----|-------|
| `--status-on-air` | `#DC2626` | ON AIR indicator, recording (red-600) |
| `--status-playing` | `#22C55E` | Currently playing, normal operation (green-500) |
| `--status-ready` | `#3B82F6` | Ready/loaded, informational (blue-500) |
| `--status-warning` | `#F59E0B` | Late, approaching deadline (amber-500) |
| `--status-error` | `#EF4444` | Error, critical failure (red-500) |
| `--status-paused` | `#A855F7` | Paused state (purple-500) |

### Transport & Timing

| Token | Hex | Usage |
|-------|-----|-------|
| `--timing-early` | `#22C55E` | Post-point: ahead of schedule (green) |
| `--timing-on-time` | `#3B82F6` | Post-point: on schedule (blue) |
| `--timing-late` | `#EF4444` | Post-point: behind schedule (red) |
| `--pie-fill` | `#3B82F6` | Pie counter fill (blue-500) |
| `--pie-talk` | `#F59E0B` | Talk time marker region (amber-500) |
| `--pie-bg` | `#1E293B` | Pie counter background (slate-800) |

### Interactive

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | `#3B82F6` | Primary interactive elements (blue-500) |
| `--accent-hover` | `#60A5FA` | Hover state (blue-400) |
| `--accent-active` | `#2563EB` | Active/pressed state (blue-600) |
| `--focus-ring` | `#60A5FA` | Focus indicator (blue-400) |
| `--button-play` | `#22C55E` | Play button (green-500) |
| `--button-stop` | `#EF4444` | Stop button (red-500) |
| `--button-pause` | `#F59E0B` | Pause button (amber-500) |

### Sound Panel

| Token | Hex | Usage |
|-------|-----|-------|
| `--panel-idle` | `#1E293B` | Unloaded panel button (slate-800) |
| `--panel-loaded` | `#0F172A` | Loaded but stopped (slate-900 + border) |
| `--panel-playing` | `#166534` | Currently playing (green-800) |
| `--panel-text` | `#F8FAFC` | Button label text (slate-50) |

---

## Typography

### Font Stack: Dashboard Data

- **Heading / Labels:** Fira Sans (weights: 400, 500, 600, 700)
- **Body / Log Lines:** Fira Sans (weights: 300, 400, 500)
- **Data / Timing / Counters:** Fira Code (monospace, weights: 400, 500, 600, 700)
- **Fallback:** system-ui, -apple-system, sans-serif / monospace

### Why This Pairing

- **Fira Code** for all numeric/timing displays -- monospace ensures digits don't shift during countdown, critical for readability of running timers
- **Fira Sans** for labels, titles, and log line text -- clean, neutral, highly readable at small sizes
- Same font family provides visual cohesion

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### Type Scale

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Wall Clock | Fira Code | 48px | 700 | 1.0 |
| Pie Counter Value | Fira Code | 36px | 600 | 1.0 |
| Post Counter Value | Fira Code | 24px | 600 | 1.2 |
| Stop Counter Value | Fira Code | 20px | 500 | 1.2 |
| Section Headers | Fira Sans | 16px | 600 | 1.4 |
| Log Line Title | Fira Sans | 14px | 500 | 1.4 |
| Log Line Detail | Fira Sans | 12px | 400 | 1.5 |
| Sound Panel Label | Fira Sans | 12px | 500 | 1.3 |
| Sound Panel Timer | Fira Code | 11px | 400 | 1.0 |
| Status Bar | Fira Sans | 11px | 400 | 1.4 |

---

## Layout

### Grid Structure

The main window is a fixed-size, non-scrolling layout optimized for 1920x1080 or 1280x1024 broadcast monitors.

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

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 2px | Tight element gaps |
| `--space-sm` | 4px | Within components (button padding) |
| `--space-md` | 8px | Between related elements |
| `--space-lg` | 12px | Between sections |
| `--space-xl` | 16px | Major section gaps |
| `--space-2xl` | 24px | Top-level layout gaps |

### Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base content | 0 | Log list, sound panel |
| Elevated panels | 10 | Timing displays, meters |
| Sticky controls | 20 | Transport buttons, hour selector |
| Dialogs | 30 | Log selection, event properties |
| Alerts / Toasts | 40 | Error messages, warnings |
| Modal overlay | 50 | Exit confirmation, password prompt |

---

## Component Guidelines

### Transport Buttons (Play/Stop/Pause)

- Minimum touch target: 44x44px (larger preferred: 56x56px for broadcast use)
- Use distinct, high-contrast colors: green (play), red (stop), amber (pause)
- State changes must be instant (<50ms visual feedback)
- Active state: filled background; Idle: outlined or muted
- `cursor-pointer` on all interactive buttons
- SVG icons from Lucide or Heroicons (no emojis)

### Log List View

- Fixed-height rows for stable layout during playback
- Current playing item: highlighted with `--status-playing` left border (4px)
- Next item: subtle `--accent-primary` left border (2px)
- Alternating row backgrounds for scannability (`--bg-secondary` / `--bg-primary`)
- Monospace timing columns (Fira Code) aligned right
- Transition type indicator: color-coded badge (PLAY, SEGUE, STOP)

### Pie Counter (Countdown)

- SVG-based circular countdown
- Fill color: `--pie-fill` (blue)
- Talk time region: `--pie-talk` (amber arc overlay)
- Background: `--pie-bg`
- Center text: remaining time in Fira Code, large and bold
- Transition type label below the pie

### Post Counter

- Color-coded numeric display:
  - Green (`--timing-early`): ahead of schedule
  - Blue (`--timing-on-time`): on schedule
  - Red (`--timing-late`): behind schedule
- Background shifts subtly to match state
- Monospace font prevents digit shifting

### Audio Meters

- Vertical bar meter, peak-hold style
- Gradient: green -> yellow -> red
- Peak hold indicator: thin line that decays over 1-2 seconds
- Scale markings at -6dB, -12dB, -20dB, -40dB
- Stereo: two bars side by side (L/R)

### Sound Panel Buttons

- Grid layout (configurable rows x columns)
- Each button shows: cart title (truncated), duration
- Playing state: green background with subtle pulse
- Loaded/idle: dark background with visible border
- Empty: darkest background, no border
- Drag-and-drop target highlight on hover

### Hour Selector Bar

- Horizontal bar with 24 hour slots
- Current hour: bright accent highlight
- Hours with events: subtle fill indicator
- Hours without events: empty/dark
- Click to scroll log view to that hour

### Wall Clock

- Large monospace digits, high contrast
- 12h/24h toggle on click
- Colon blinks at 1Hz (respect `prefers-reduced-motion`)
- Centered in top bar

### Mode Display

- Current mode text: MANUAL / AUTO / LIVE ASSIST
- Color-coded background:
  - Manual: blue
  - Automatic: green
  - Live Assist: amber
- Compact pill/badge style

### ON AIR Indicator

- When on air: bright red background with subtle pulse animation
- When off air: muted/dark
- Text: "ON AIR" in bold, all caps
- Respect `prefers-reduced-motion`: static red background without pulse

---

## Interaction Guidelines

### Keyboard Navigation

- All transport controls accessible via keyboard shortcuts
- Visible focus rings (`--focus-ring`, 2px offset)
- Tab order: transport controls -> log list -> sound panel -> timing displays
- Keyboard shortcuts for Play, Stop, Pause, Next, Mode Change
- No keyboard traps in dialogs

### Drag and Drop

- Cart drag: show ghost/preview of cart title
- Drop target: highlight valid drop zones with `--accent-primary` border
- Invalid drop: no highlight, cursor changes to not-allowed
- Smooth transition on drop completion

### Dialogs

- Modal with dark overlay (`rgba(0,0,0,0.7)`)
- Centered, max-width 640px
- Focus trapped within dialog
- Escape key closes (unless password-protected exit)
- Log Selection Dialog: filterable list with search input

### Real-Time Updates

- Master timer: 100ms interval drives all time-dependent widgets
- Audio meters: smooth animation, no jank
- Log line status updates: instant color/state change, no transition delay
- Countdown displays: update every 100ms with smooth decrement

---

## Accessibility Checklist

- [x] Color is never the sole indicator -- always paired with text, icon, or shape
- [x] All status colors pass 4.5:1 contrast ratio against their backgrounds
- [x] Transport buttons have aria-labels ("Play", "Stop", "Pause")
- [x] Log list rows are keyboard-navigable with role="listbox"
- [x] Dialogs trap focus and have aria-modal="true"
- [x] `prefers-reduced-motion`: disable pulse animations, keep numeric updates
- [x] All interactive elements have visible focus states
- [x] Sound panel buttons have aria-label with cart title
- [x] Audio meter has aria-live="polite" for screen reader updates
- [x] Time displays have aria-label for screen readers

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (use SVG: Lucide or Heroicons)
- [ ] All icons from consistent icon set
- [ ] Hover states don't cause layout shift
- [ ] Status colors are distinct and high-contrast

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Transport button feedback is instant (<50ms)
- [ ] Focus states visible for keyboard navigation
- [ ] Keyboard shortcuts documented and functional

### Real-Time Performance
- [ ] 100ms timer updates don't cause frame drops
- [ ] Audio meters render smoothly at 60fps
- [ ] Countdown displays use monospace to prevent digit shifting
- [ ] No layout recalculation on timer ticks

### Dark Mode
- [ ] All text passes 4.5:1 contrast ratio
- [ ] Status indicators visible against dark backgrounds
- [ ] Borders visible on all panel edges
- [ ] Glass/transparent elements avoided (use solid dark backgrounds)

### Layout
- [ ] Fixed layout -- no content hidden or overlapping
- [ ] All panels visible simultaneously (no scrolling required for key info)
- [ ] Dialogs properly centered with backdrop
- [ ] Sound panel grid scales to configured button count
