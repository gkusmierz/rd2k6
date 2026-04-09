# RDAdmin - Design System

> **Inherits from:** `.blah/steering/design.md` (global design steering)
>
> This file contains ONLY rdadmin-specific overrides and additions.
> For typography, base palette, spacing, z-index, interaction rules, and accessibility baseline — see the global steering file.

---

## Style

- **Primary Style:** SPA Settings Panel (sidebar + content area)
- **Secondary Style:** Data-Dense Administration Dashboard
- **Mode:** Dark Mode (inherits global OLED-class deep blacks)

### Design Philosophy Override

The original rdadmin used 78 modal dialog windows — a typical early-2000s pattern. The re-implementation replaces this with a **single-page application (SPA) settings panel**:

- **Left sidebar** with collapsible navigation listing all admin sections
- **Right content area** displaying the selected section's CRUD interface
- **NO modal dialogs for navigation** — only for confirmations and critical warnings
- Think: macOS System Preferences / VS Code Settings / modern cloud admin consoles

This approach eliminates deep dialog nesting, reduces cognitive load, and provides persistent navigation context.

### Key Effects (RDAdmin-Specific)

- Sidebar navigation transitions: instant highlight, no animation on nav item change
- Content area transitions: subtle 150ms fade-in when switching sections
- Form validation: inline error messages with `--status-error` color
- Save/unsaved indicator: subtle dot on section nav item when changes are pending
- Confirmation modals: only for delete operations and irreversible changes

### Anti-Patterns

- Modal dialogs for navigation (the entire point of the SPA redesign)
- Deep nesting beyond 2 levels (sidebar section > content tab)
- Full-page reloads or heavy transitions when switching sections
- Hiding nav sidebar on desktop (always visible at >= 1024px)
- Wizard-style flows for simple CRUD operations

---

## Additional Color Tokens

These extend the global palette for rdadmin-specific needs.

### Navigation States

| Token | Hex | Usage |
|-------|-----|-------|
| `--nav-active-bg` | `#1E293B` | Active sidebar item background (slate-800) |
| `--nav-active-border` | `#3B82F6` | Active sidebar item left accent (blue-500) |
| `--nav-active-text` | `#F8FAFC` | Active sidebar item text (slate-50) |
| `--nav-hover-bg` | `#0F172A80` | Hovered sidebar item (slate-900 50%) |
| `--nav-group-text` | `#64748B` | Section group header text (slate-500) |

### Form States

| Token | Hex | Usage |
|-------|-----|-------|
| `--input-bg` | `#0F172A` | Form input background (slate-900) |
| `--input-border` | `#334155` | Form input border (slate-700) |
| `--input-focus-border` | `#3B82F6` | Focused input border (blue-500) |
| `--input-error-border` | `#EF4444` | Invalid input border (red-500) |
| `--input-error-bg` | `#450a0a20` | Invalid input background tint |

### CRUD Table States

| Token | Hex | Usage |
|-------|-----|-------|
| `--row-hover` | `#1E293B` | Table row hover (slate-800) |
| `--row-selected` | `#172554` | Selected table row (blue-950) |
| `--row-alt` | `#0F172A` | Alternating row background (slate-900) |

### Badge/Tag Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--badge-admin` | `#7C3AED` | Admin privilege badge (violet-600) |
| `--badge-rss` | `#F59E0B` | RSS privilege badge (amber-500) |
| `--badge-active` | `#22C55E` | Active/enabled status (green-500) |
| `--badge-inactive` | `#64748B` | Disabled/inactive status (slate-500) |

---

## Layout

### SPA Shell Structure

The application uses a fixed, full-viewport shell with three zones:

```
+-------+---------------------------------------------------+
| HEADER (full width, 48px)                                  |
| [Logo] RDAdmin   [user: admin]  [Station: MAIN]  [Logout] |
+-------+---------------------------------------------------+
|       |                                                    |
| SIDE  |  CONTENT AREA                                      |
| BAR   |  (scrollable, padded)                              |
|       |                                                    |
| 240px |  - Section header + breadcrumb                     |
| fixed |  - Content: list/table OR edit form                |
|       |  - Sub-tabs for complex sections                   |
|       |                                                    |
|       |                                                    |
+-------+---------------------------------------------------+
```

### Header Bar

- Height: 48px
- Background: `--bg-secondary` (#0F172A)
- Content: app logo/name (left), current user + station selector (right)
- Border: 1px bottom `--border-default`
- Position: fixed top, full width

### Sidebar

- Width: 240px (expanded), 56px (collapsed icons-only)
- Background: `--bg-secondary` (#0F172A)
- Position: fixed left, full height minus header
- Border: 1px right `--border-default`
- Scroll: auto (if nav items exceed viewport height)
- Collapse: toggle button at bottom; auto-collapse at < 1024px viewport width
- Section groups: uppercase 10px labels (`--nav-group-text`)
- Nav items: 36px height, 12px left padding, 4px left border when active

### Content Area

- Position: fills remaining space (right of sidebar, below header)
- Padding: 24px (`--space-2xl`)
- Scroll: vertical auto
- Max content width: 1200px (centered within area for very wide screens)
- Background: `--bg-primary` (#020617)

### Sub-Navigation (Content Tabs)

For sections with sub-views (e.g., Station config with Core / App Profiles / Hardware):

- Tab bar: 36px height, bottom-bordered, inside content area top
- Active tab: `--accent-primary` bottom border (2px), `--text-primary`
- Inactive tab: no border, `--text-secondary`
- Hover: `--text-primary`

### Responsive Behavior

| Breakpoint | Sidebar | Content |
|-----------|---------|---------|
| >= 1280px | 240px expanded | Full width minus sidebar |
| 1024-1279px | 56px collapsed (icons only) | Full width minus collapsed sidebar |
| < 1024px | Hidden (hamburger menu overlay) | Full width |

---

## Component Specifications

### Sidebar Navigation Item

```
[4px accent] [24px icon] [label text]        [badge/count]
```

- Height: 36px
- Padding: 0 12px
- Icon: 20x20px, Lucide icon set, `--text-muted` (inactive), `--text-primary` (active)
- Label: Fira Sans 13px/500
- Active: `--nav-active-bg` background, `--nav-active-border` left border (4px), `--nav-active-text`
- Hover: `--nav-hover-bg` background
- Badge: small pill right-aligned for counts (e.g., user count)

### Section Group Header

- Text: Fira Sans 10px/600, uppercase, `--nav-group-text`
- Padding: 16px top, 12px left
- No interaction (purely organizational)

### CRUD List/Table

Standard entity list used by all sections:

- Header row: `--bg-tertiary` background, Fira Sans 10px/600 uppercase
- Data rows: 40px height, alternating `--bg-primary` / `--row-alt`
- Hover: `--row-hover` background
- Selected: `--row-selected` background
- Actions column: icon buttons (edit pencil, delete trash) 32x32px
- Toolbar above table: search input + "Add New" button

### Entity Edit Form

Standard form layout for editing any entity:

- Two-column layout at >= 768px, single column below
- Label: Fira Sans 12px/500, `--text-secondary`, above input
- Input: 40px height, `--input-bg` background, `--input-border` border, 1px
- Input focus: `--input-focus-border` border, subtle glow
- Error: `--input-error-border` border, error message below in `--status-error` Fira Sans 11px/400
- Save/Cancel buttons: bottom of form, right-aligned
- Section dividers: 1px `--border-subtle` with Fira Sans 11px/600 uppercase label

### Dual-List Selector (Permission Assignment)

Used for user/group, user/service, user/feed, service/host permissions:

- Two side-by-side lists with arrow buttons between
- Left list: "Available" items
- Right list: "Assigned" items
- Arrow buttons: right-arrow (assign), left-arrow (unassign)
- Each list: scrollable, 200px min height, search filter at top

### Confirmation Modal

The ONLY type of modal in the SPA design:

- Overlay: `--bg-primary` at 60% opacity
- Dialog: `--bg-secondary` background, `--border-default` border, 8px radius
- Max width: 480px
- Title: Fira Sans 16px/600
- Body: Fira Sans 14px/400, `--text-secondary`
- Actions: right-aligned, "Cancel" (ghost) + "Confirm" (destructive red or primary blue)
- z-index: 50 (modal overlay from global scale)

### Unsaved Changes Indicator

- Small dot (6px) next to nav item label, `--status-warning` color
- Appears when form has pending unsaved changes
- Attempting to navigate away triggers a "Discard changes?" confirmation

---

## Sidebar Navigation Structure

Maps the 16 requirements to sidebar sections:

### Group: SYSTEM

| Nav Item | Icon | Requirement | Sub-tabs |
|----------|------|-------------|----------|
| System Settings | `settings` | 14 | General, Encoders, System Info |
| Scheduler Codes | `calendar` | 13 | — |

### Group: USERS & ACCESS

| Nav Item | Icon | Requirement | Sub-tabs |
|----------|------|-------------|----------|
| Users | `users` | 2 | List, (inline edit) |
| Groups | `layers` | 3 | List, (inline edit) |

### Group: BROADCAST

| Nav Item | Icon | Requirement | Sub-tabs |
|----------|------|-------------|----------|
| Services | `radio` | 4 | List, Import Config |
| Reports | `file-text` | 11 | List, (inline edit) |
| Podcasts & Feeds | `rss` | 10 | Feeds, Images |

### Group: INFRASTRUCTURE

| Nav Item | Icon | Requirement | Sub-tabs |
|----------|------|-------------|----------|
| Stations | `server` | 5 | Core, App Profiles, Hardware, Switchers, Dropboxes, Host Variables |
| Replicators | `copy` | 12 | List, Cart State |

### Station Sub-tabs Detail

The Stations section is the most complex, with these content tabs:

1. **Core** (Req 5): Station identity, IP, maintenance pool, startup/stop carts
2. **App Profiles** (Req 6): Sub-tabs for AirPlay, Library, Log Editor, Panel, Decks, Hotkeys
3. **Hardware** (Req 7): Sub-tabs for Audio Ports, Serial Ports, Audio Server, Plugins, Cart Slots
4. **Switchers** (Req 8): Matrix list with inline configuration
5. **Dropboxes** (Req 9): Dropbox list with inline configuration
6. **Host Variables** (Req 15): Variable list with inline editing

---

## Airplay Profile Integration

When editing Station > App Profiles > AirPlay, the content area shows an integrated
view that references the airplay playout design from `.blah/specs/airplay/`.

### Layout

The AirPlay profile editor is split into two zones:

```
+------------------------------------------+-------------------+
| AirPlay Profile Configuration            | Live Preview      |
| (form fields: cards, ports, modes, etc.) | (mini playout)    |
+------------------------------------------+-------------------+
```

- Left (60%): Standard form with all AirPlay profile settings
- Right (40%): Miniature preview of the playout window layout showing how the configured
  settings map to the actual playout interface (read-only visual reference)

### Preview Panel

The mini-preview uses the same design tokens from `.blah/specs/airplay/design-system/MASTER.md`:

- Scaled-down representation of the playout window
- Shows: log machine labels, sound panel grid size, skin selection preview
- Non-interactive (purely visual reference)
- Updates live as form fields change (e.g., changing log machine count updates preview)

---

## Pre-Delivery Checklist (RDAdmin-Specific)

### SPA Navigation
- [ ] All 16 requirement sections are reachable from sidebar
- [ ] Active section is clearly highlighted in sidebar
- [ ] Breadcrumb shows current path (e.g., Stations > MAIN > App Profiles > AirPlay)
- [ ] Back navigation works (browser back button / breadcrumb clicks)
- [ ] Sidebar collapse/expand works at all breakpoints

### Forms & CRUD
- [ ] All entity lists support: search, add, edit, delete
- [ ] Inline validation on all required fields
- [ ] Unsaved changes indicator appears when form is dirty
- [ ] Navigation away from dirty form triggers confirmation
- [ ] Delete operations always require confirmation modal
- [ ] Cascade delete warnings show affected entity counts

### Accessibility
- [ ] Sidebar keyboard navigation (arrow keys within group, tab between groups)
- [ ] All form inputs have associated labels
- [ ] Focus trapped in confirmation modals
- [ ] Color is never sole indicator (icons + text alongside status colors)
- [ ] WCAG AA contrast on all text
