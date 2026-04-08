# Log List View - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.

## Layout Override

- Scrollable vertical list with fixed-height rows (32-36px per row)
- Column layout: Status | Line# | Cart# | Title | Artist | Length | Trans | Start Time
- **Status column**: color-coded left border (4px) + small icon
- Timing columns (Length, Start Time): right-aligned, Fira Code monospace
- Title/Artist: left-aligned, Fira Sans, truncated with ellipsis
- Selected row: `--bg-tertiary` background
- Playing row: `--status-playing` left border, slightly brighter background
- Next row: `--accent-primary` left border (2px), subtle highlight

## Interaction Override

### Action Modes (Add/Delete/Move/Copy)

When an action mode is active, the log list enters a special interaction state:

- **Add mode**: cursor changes to crosshair, click on row = insert position
- **Delete mode**: click on row = mark for deletion (confirmation required)
- **Move mode**: first click = source (highlighted), second click = destination
- **Copy mode**: first click = source (highlighted), second click = destination
- Active mode indicator: show mode name in transport control area
- Cancel: Escape key or clicking the mode button again

### Drag and Drop

- Drag source: external cart picker / cart browser
- Drop indicator: horizontal line between rows showing insertion point
- Drop highlight: blue accent line (`--accent-primary`)
- Invalid drop (on playing item): no indicator, cursor = not-allowed

## Typography Override

- Log line rows use a slightly more compact type scale:
  - Title: Fira Sans 13px/500
  - Artist: Fira Sans 12px/400, `--text-secondary`
  - Timing: Fira Code 12px/400

## Transition Type Badges

| Type | Background | Text |
|------|-----------|------|
| PLAY | `#1E40AF` (blue-800) | `#BFDBFE` (blue-200) |
| SEGUE | `#166534` (green-800) | `#BBF7D0` (green-200) |
| STOP | `#991B1B` (red-800) | `#FECACA` (red-200) |
