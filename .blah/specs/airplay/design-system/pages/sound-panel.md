# Sound Panel - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.

## Layout Override

- Grid layout: configurable N x M button grid
- Buttons are equal-sized squares or rectangles
- Minimum button size: 80x60px
- Maximum label length: 2 lines, truncated with ellipsis

## Interaction Override

- **Single click** = start/stop toggle playback
- **Double click** = open Event Properties Dialog
- **Drag onto button** = assign cart to button
- **Hotkeys** = configurable per-button keyboard shortcuts
- Touch target: entire button area (no small hit zones within a button)

## State Colors (Override Panel Tokens)

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Empty | `#0F172A` | none | `#64748B` (slate-500, "Empty" text) |
| Loaded (stopped) | `#1E293B` | `1px solid #334155` | `#F8FAFC` |
| Playing | `#166534` | `2px solid #22C55E` | `#F8FAFC` |
| Paused | `#713F12` | `2px solid #F59E0B` | `#F8FAFC` |

## Animation Override

- Playing state: subtle background brightness pulse (2s cycle)
- On `prefers-reduced-motion`: solid green background, no pulse
- Playback start/stop: instant color change (no transition)
