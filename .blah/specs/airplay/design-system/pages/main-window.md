# Main Window - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.

## Layout Override

The main window is a **fixed, non-resizable** layout optimized for broadcast monitors. Unlike typical web dashboards, it does NOT scroll -- all critical information must be visible at all times.

### Fixed Dimensions

- Target: 1920x1080 (primary), 1280x1024 (secondary)
- No responsive breakpoints -- this is a dedicated broadcast terminal
- All panels have fixed pixel sizes, not percentage-based

### Panel Priorities

When screen space is constrained (1280x1024):
1. **Transport controls + Log List** -- always full height
2. **Timing displays** -- always visible, may reduce Pie Counter size
3. **Sound Panel** -- may reduce button count or button size
4. **Hour Selector** -- may become a compact dropdown

## Interaction Override

- **Exit protection is mandatory** -- the close button must ALWAYS trigger password prompt or confirmation
- **Single-instance enforcement** -- display error dialog if second instance detected
- **Splash screen** -- show during initialization (audio engine + IPC connection), no interaction allowed

## Color Override

- **Message Label** (from RML LB/LC commands): supports custom text colors set by remote commands. These override the standard `--text-primary` token for the label area only.
