# INV-065: RDPanelButton

**Status:** done
**Source:** `lib/rdpanel_button.h`, `lib/rdpanel_button.cpp`
**Inherits:** RDPushButton

## Purpose

Individual button widget for the sound panel grid. Each button represents one cart assignment with visual state (idle, playing, paused), countdown timer display, color coding, flash animation, and drag-and-drop support.

## Constructor

```
RDPanelButton(int row, int col, RDStation *station, bool flash, QWidget *parent)
```

Row/col identify the button's position in the grid. Flash enables blinking animation during playback.

## Signals

| Signal | Parameters | Emitted When |
|--------|-----------|--------------|
| `cartDropped(int,int,unsigned,QColor,QString)` | row, col, cartnum, color, title | A cart is drag-dropped onto this button |

## Public Slots

| Slot | Purpose |
|------|---------|
| `tickClock()` | Updates countdown display (called every tick from RDSoundPanel) |
| `flashButton(bool)` | Toggles flash state (visual blink during playback) |

## Key Public Methods

| Method | Behavior |
|--------|----------|
| `clear()` | Resets all state: text, cart, color, deck, timers, lengths |
| `text()` / `setText()` | Button label text (triggers keycap redraw) |
| `outputText()` / `setOutputText()` | Output routing text |
| `state()` / `setState()` | Playing state (active or idle) |
| `defaultColor()` / `setDefaultColor()` | Configured background color |
| `setColor(QColor)` | Sets current display color |
| `cart()` / `setCart()` | Assigned cart number |
| `cutName()` / `setCutName()` | Current cut name |
| `deck()` / `setDeck()` | Assigned deck index |
| `startTime()` / `setStartTime()` | Playout start time (for countdown) |
| `hookMode()` / `setHookMode()` | Hook playback mode |
| `playDeck()` / `setPlayDeck()` | Associated RDPlayDeck |
| `output()` / `setOutput()` | Output channel number |
| `length(hookmode)` / `setLength(hookmode,msecs)` | Full and hook lengths |
| `setActiveLength(msecs)` | Sets the displayed length (-1 = "No Audio") |
| `reset()` | Restores default color |
| `pauseWhenFinished()` / `setPauseWhenFinished()` | Pause-when-done flag |
| `duckVolume()` / `setDuckVolume()` | Duck volume level |
| `setAllowDrags(bool)` | Enables/disables drag initiation |
| `resetCounter()` | Redraws keycap without countdown |

## Visual Rendering (WriteKeycap)

Custom-painted button using QPainter on QPixmap:
- Background filled with current color (alternates with default color when flashing)
- Text color auto-selected for contrast (RDGetTextColor)
- Up to 3 lines of wrapped title text
- Bottom area shows: countdown timer (seconds remaining) or static length or "No Audio" or "Finished"
- During final 8 seconds: switches to larger timer font
- Button size constant: 88x80 px (PANEL_BUTTON_SIZE)

## Drag & Drop

- `mousePressEvent` — starts move counter (threshold = 10 moves)
- `mouseMoveEvent` — after threshold, initiates RDCartDrag with cart number, text, color
- `dragEnterEvent` — accepts RDCartDrag if drags allowed and button not actively playing
- `dropEvent` — decodes dropped cart, emits `cartDropped(row,col,cartnum,color,title)`

## Key Fields

- `button_length[2]` — stores both normal [0] and hook [1] lengths
- `button_active_length` — currently displayed length
- `button_secs` — last displayed countdown seconds (avoids unnecessary redraws)
- `button_flash / button_flashing / button_flash_state` — flash animation control
- `button_move_count` — drag threshold counter
- `button_row / button_col` — grid position

## SQL / DB Access

None (state set by parent RDSoundPanel).
