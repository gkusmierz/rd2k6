# Timing Displays - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.
> Covers: Wall Clock, Pie Counter, Post Counter, Stop Counter, Audio Meter, Hour Selector

## Wall Clock

### Layout
- Full-width within top bar, centered or left-aligned
- Font: Fira Code 48px/700
- Color: `--text-primary` (#F8FAFC)

### Interaction
- Click toggles 12h/24h format
- `cursor-pointer` on clock area
- Display format stored in user config

### Animation
- Colon blinks at 1Hz (500ms on, 500ms off)
- `prefers-reduced-motion`: static colon (always visible)

---

## Pie Counter

### Layout
- Circular SVG, 200-240px diameter
- Center: remaining time (Fira Code 36px/600)
- Below center: transition type label (Fira Sans 12px/500)

### Visual Layers (bottom to top)
1. Background circle: `--pie-bg` (#1E293B)
2. Elapsed arc: transparent (reveals background)
3. Remaining arc: `--pie-fill` (#3B82F6)
4. Talk start marker: radial line, `--pie-talk` (#F59E0B)
5. Talk end marker: radial line, `--pie-talk` (#F59E0B)
6. Talk region: amber arc overlay at 30% opacity between markers
7. Center text: remaining time

### Animation
- Arc decreases smoothly as time passes (100ms update interval)
- On item change: instant reset to full circle, then begin countdown
- No easing -- linear countdown matches real time

---

## Post Counter

### Layout
- Numeric display showing time offset from scheduled post-point
- Font: Fira Code 24px/600
- Prefix: "+" (early) or "-" (late)

### Color Override (state-dependent)

| State | Text Color | Background |
|-------|-----------|------------|
| Early (ahead) | `#22C55E` (green-500) | `#052e16` (green-950, subtle) |
| On Time | `#3B82F6` (blue-500) | `#172554` (blue-950, subtle) |
| Late (behind) | `#EF4444` (red-500) | `#450a0a` (red-950, subtle) |

### Animation
- Color transitions: instant (no fade between states)
- Number updates: every 100ms, monospace prevents shifting

---

## Stop Counter

### Layout
- Shows next stop time (absolute time of day)
- Font: Fira Code 20px/500
- Color: `--text-secondary` (less emphasis than Post Counter)
- Label: "NEXT STOP" in Fira Sans 10px/600, uppercase, `--text-muted`

---

## Audio Meter

### Layout
- Vertical bar meters, 24px wide each, full panel height
- Stereo: two bars side by side (L + R) with 2px gap
- Scale markings on left side: 0dB, -6dB, -12dB, -20dB, -40dB

### Color Gradient (bottom to top)
- -40dB to -12dB: `#22C55E` (green)
- -12dB to -6dB: `#F59E0B` (amber)
- -6dB to 0dB: `#EF4444` (red)

### Peak Hold
- Thin horizontal line (2px) at peak level
- Holds for 1.5 seconds, then decays smoothly
- Color matches the level zone it's in

### Animation
- Update rate: matches master timer (100ms)
- Smooth bar height transitions (CSS transition or requestAnimationFrame)
- Peak hold uses separate decay timer

---

## Hour Selector

### Layout
- Horizontal bar, 24 slots, one per hour (00-23)
- Each slot: 40-60px wide, 28px tall
- Current hour: `--accent-primary` background
- Hours with events: dot indicator or subtle fill
- Empty hours: `--bg-tertiary` background

### Interaction
- Click hour: scroll log list to first event in that hour
- `cursor-pointer` on all hour slots
- Hover: slight brightness increase
- Current hour updates automatically via master timer
