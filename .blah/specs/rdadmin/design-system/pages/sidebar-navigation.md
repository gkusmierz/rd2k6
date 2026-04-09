# Sidebar Navigation - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.

## Layout Override

- Fixed position, full height minus 48px header
- Width: 240px expanded, 56px collapsed
- Scroll: independent of content area (overflow-y: auto)
- Collapse toggle: chevron button at bottom of sidebar, 36px height

### Collapsed State

- Only icons visible (centered in 56px width)
- Tooltips on hover showing section name
- Group headers hidden
- Badge counts hidden (show dot indicator instead)

### Mobile Overlay (< 1024px)

- Triggered by hamburger button in header
- Full-height overlay from left, 280px width
- Backdrop: `--bg-primary` at 60% opacity
- Close: X button or tap backdrop
- z-index: 40 (dialog level from global scale)

## Interaction Override

- Click nav item: instant content switch, no transition on sidebar itself
- Keyboard: Up/Down arrows within group, Tab to next group
- Section with sub-tabs: expand/collapse on click, chevron rotates 90deg
- Active indicator: 4px left border appears instantly (no slide animation)

## Animation Override

- Content area fade-in: 150ms opacity transition on section switch
- Sidebar expand/collapse: 200ms width transition
- No animations on nav item state changes (instant)
