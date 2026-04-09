# RDCatch - Main Window

> Page-level overrides for the Catch Event Manager main window.
> Inherits from: `design-system/MASTER.md` > `.blah/steering/design.md`

---

## Deck Monitor Row

Horizontal scrollable row of deck widgets. Each widget shows one configured deck.

### Widget Layout (240x100px)
```
┌──────────────────────────────────────┐
│ MAIN-STUDIO  Ch:1   ● Recording     │
│ Cut: 001234_001 — Morning Show       │
│ Desc: Daily recording 6-10am        │
│ [L █████░░] [R ████░░]  [✕] [🔊]   │
└──────────────────────────────────────┘
```

### Status States
| State | Background | Indicator | Label |
|-------|-----------|-----------|-------|
| Idle | `--deck-idle` | Grey dot | Idle |
| Ready | `--deck-idle` + cyan border | Cyan dot | Ready |
| Waiting | `--deck-waiting` | Amber dot, pulsing | Waiting |
| Recording | `--deck-recording` | Red dot, pulsing | Recording |
| Playing | `--deck-playing` | Green dot | Playing |
| Offline | `--deck-offline` | — | OFFLINE (dimmed) |

## Event List Columns

| Column | Width | Font | Notes |
|--------|-------|------|-------|
| Type | 28px | Icon | Color-coded event type icon |
| Description | flex | Fira Sans 12px | Main identifier |
| Station | 100px | Fira Sans 11px | Hostname |
| Deck | 40px | Fira Code 11px | Deck number |
| Start | 64px | Fira Code 11px | HH:MM:SS |
| End | 64px | Fira Code 11px | HH:MM:SS or length |
| Source | 80px | Fira Sans 11px | Input source |
| Dest | 80px | Fira Code 11px | Cart/cut or URL |
| Days | 112px | 7 pills | MTWTFSS toggles |
| Feed | 80px | Fira Sans 11px | RSS feed name |
| 1x | 24px | Icon | One-shot indicator |
| Status | 72px | Fira Sans 11px/600 | Status text |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Edit selected event |
| Delete | Delete selected event |
| Space | Head audition play |
| Ctrl+Space | Tail audition play |
| Escape | Stop audition |
