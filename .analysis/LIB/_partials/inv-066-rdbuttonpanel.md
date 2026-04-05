# INV-066: RDButtonPanel

**Status:** done
**Source:** `lib/rdbutton_panel.h`, `lib/rdbutton_panel.cpp`
**Inherits:** (none -- plain C++ class, not a QObject)

## Purpose

Container class that manages a grid of RDPanelButton widgets for one panel page. Handles creation, layout, visibility, and bulk operations on the button grid. Each RDSoundPanel contains multiple RDButtonPanel instances (one per station/user panel).

## Constructor

```
RDButtonPanel(RDAirPlayConf::PanelType type, int panel, int cols, int rows,
              RDStation *station, bool flash, QWidget *parent)
```

Creates a `rows x cols` grid of RDPanelButton instances. During construction:
- Each button is positioned using fixed geometry (88x80 px with 15px spacing)
- If station has drag-drop enabled and panel setup is not enforced, buttons accept drops
- Connects parent's `buttonFlash(bool)` signal to each button's `flashButton(bool)` slot
- Connects each button's `cartDropped(...)` signal to parent's `acceptCartDrop(...)` slot
- All buttons start hidden

## Key Methods

| Method | Behavior |
|--------|----------|
| `panelButton(row,col)` | Returns the RDPanelButton at given grid position |
| `setActionMode(ActionMode)` | Updates all button colors based on action mode |
| `setAllowDrags(bool)` | Enables/disables drag on all buttons |
| `setAcceptDrops(bool)` | Enables/disables drop acceptance on all buttons |
| `hide()` / `show()` | Hides/shows all buttons in the grid |
| `clear()` | Calls clear() on all buttons |

## Action Mode Color Logic

| Mode | Button Color Behavior |
|------|----------------------|
| Normal | Playing buttons get PLAY color, paused get PAUSED color, idle buttons reset to default |
| CopyFrom | Buttons with carts get FROM highlight color |
| CopyTo | Empty/idle buttons get TO color, playing/paused buttons keep state colors |
| AddTo | Empty buttons get TO color |
| DeleteFrom | Non-playing buttons get FROM color |

## Grid Dimensions

- Max columns: 20 (`PANEL_MAX_BUTTON_COLUMNS`)
- Max rows: 20 (`PANEL_MAX_BUTTON_ROWS`)
- Button size: 88x80 px
- Button spacing: 15 px

## Key Fields

- `panel_button[20][20]` — fixed-size 2D array of RDPanelButton pointers
- `panel_button_columns / panel_button_rows` — actual grid dimensions
- `panel_station: RDStation*` — station reference

## SQL / DB Access

None (data managed by parent RDSoundPanel).
