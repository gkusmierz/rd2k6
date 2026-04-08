# Design System — Global Steering

Shared visual identity for all application modules in this project. Individual specs inherit from this file and may override specific tokens in their own `design-system/MASTER.md`.

## Design Philosophy

**Operational clarity over aesthetics.** These are professional broadcast-automation tools used in control rooms during live broadcasts. Every visual decision serves operator situational awareness, readability, and reliability.

**Dark-first.** Broadcast control rooms are low-light environments. Dark mode reduces eye strain during long shifts and makes status indicators more prominent.

**Information density.** Operators need simultaneous access to multiple data panels. Maximize data visibility without clutter. Avoid decorative whitespace.

---

## Typography

### Font Stack: Fira Family (Dashboard Data)

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Labels, UI text, headings | Fira Sans | 300, 400, 500, 600, 700 | All non-numeric UI text |
| Numeric data, timing, counters | Fira Code | 400, 500, 600, 700 | Countdowns, clocks, IDs, durations |
| Fallback (sans) | system-ui, -apple-system, sans-serif | — | When web fonts unavailable |
| Fallback (mono) | monospace | — | When web fonts unavailable |

### Why Fira

- **Fira Code** (monospace): digits don't shift during countdown — critical for running timers
- **Fira Sans**: clean, neutral, highly readable at small sizes (12-14px)
- Same family = visual cohesion across all modules

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### Type Scale (Base)

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Large display (clocks) | Fira Code | 48px | 700 | 1.0 |
| Primary counter | Fira Code | 36px | 600 | 1.0 |
| Secondary counter | Fira Code | 24px | 600 | 1.2 |
| Tertiary counter | Fira Code | 20px | 500 | 1.2 |
| Section headers | Fira Sans | 16px | 600 | 1.4 |
| Primary body | Fira Sans | 14px | 500 | 1.4 |
| Secondary body | Fira Sans | 12px | 400 | 1.5 |
| Compact labels | Fira Sans | 11px | 400 | 1.4 |
| Small mono data | Fira Code | 11px | 400 | 1.0 |

---

## Color Palette

### Base (Dark Theme)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `--bg-primary` | `#020617` | slate-950 | Main background |
| `--bg-secondary` | `#0F172A` | slate-900 | Panel/card background |
| `--bg-tertiary` | `#1E293B` | slate-800 | Elevated surfaces, inputs |
| `--border-default` | `#334155` | slate-700 | Panel borders |
| `--border-subtle` | `#1E293B` | slate-800 | Subtle separators |
| `--text-primary` | `#F8FAFC` | slate-50 | Primary text |
| `--text-secondary` | `#CBD5E1` | slate-300 | Secondary/label text |
| `--text-muted` | `#94A3B8` | slate-400 | Disabled/hint text |

### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--status-on-air` | `#DC2626` | ON AIR, recording |
| `--status-playing` | `#22C55E` | Currently active, normal |
| `--status-ready` | `#3B82F6` | Ready, informational |
| `--status-warning` | `#F59E0B` | Warning, approaching limit |
| `--status-error` | `#EF4444` | Error, critical failure |
| `--status-paused` | `#A855F7` | Paused state |

### Interactive

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | `#3B82F6` | Primary interactive (blue-500) |
| `--accent-hover` | `#60A5FA` | Hover state (blue-400) |
| `--accent-active` | `#2563EB` | Active/pressed (blue-600) |
| `--focus-ring` | `#60A5FA` | Focus indicator (blue-400) |

### Semantic Actions

| Token | Hex | Usage |
|-------|-----|-------|
| `--button-positive` | `#22C55E` | Confirm, play, start |
| `--button-negative` | `#EF4444` | Cancel, stop, delete |
| `--button-caution` | `#F59E0B` | Pause, warning action |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 2px | Tight element gaps |
| `--space-sm` | 4px | Within components |
| `--space-md` | 8px | Between related elements |
| `--space-lg` | 12px | Between sections |
| `--space-xl` | 16px | Major section gaps |
| `--space-2xl` | 24px | Top-level layout gaps |

## Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base content | 0 | Lists, panels, grids |
| Elevated panels | 10 | Counters, meters |
| Sticky controls | 20 | Transport buttons, nav bars |
| Dialogs | 30 | Selection dialogs, property editors |
| Alerts / Toasts | 40 | Error messages, warnings |
| Modal overlay | 50 | Confirmation, password prompts |

---

## Common Interaction Rules

- **Touch targets:** minimum 44x44px
- **Transport buttons:** prefer 56x56px for broadcast use
- **Cursor:** `cursor-pointer` on all interactive elements
- **Focus rings:** 2px `--focus-ring` with 2px offset, visible on all focusable elements
- **Transitions:** 150-300ms for UI feedback; <50ms for transport controls (must feel instant)
- **Icons:** SVG only (Lucide or Heroicons). No emojis as icons.
- **`prefers-reduced-motion`:** disable pulse/glow animations, keep numeric updates and instant state changes

## Accessibility Baseline

- WCAG AA minimum, AAA for critical status text
- Color is never the sole indicator — always paired with text, icon, or shape
- All status colors pass 4.5:1 contrast against their backgrounds
- All interactive elements have aria-labels
- Dialogs trap focus and have `aria-modal="true"`
- Keyboard navigation: tab order matches visual order, no keyboard traps

---

_This file is the global Source of Truth. Per-spec `design-system/MASTER.md` files should reference this document and only define spec-specific overrides (additional colors, layout structure, component-specific rules)._
