# INV-060: RDSoundPanel

**Status:** done
**Source:** `lib/rdsound_panel.h`, `lib/rdsound_panel.cpp`
**Inherits:** RDWidget

## Purpose

Main sound panel widget for RDAirPlay. Provides a grid of programmable buttons that play audio carts or execute macros. Supports multiple panels (station-level and user-level) with a panel selector, play mode switching (normal/hook), and button configuration.

## Constructor

```
RDSoundPanel(int cols, int rows, int station_panels, int user_panels,
             bool flash, const QString &caption,
             const QString &label_template, bool extended,
             RDEventPlayer *player, RDCartDialog *cart_dialog,
             QWidget *parent)
```

Parameters define the button grid size (rows x cols), number of station/user panels, flash behavior, and whether to use PANELS or EXTENDED_PANELS DB tables.

## Signals

| Signal | Parameters | Emitted When |
|--------|-----------|--------------|
| `tick()` | - | Clock tick for countdown timers on buttons |
| `buttonFlash(bool)` | flash state | Flash timer toggles (buttons blink during play) |
| `selectClicked(unsigned,int,int)` | cartnum, row, col | Button selected in copy/delete action mode |
| `channelStarted(int,int,int)` | mport, card, port | Audio playout starts on an output channel |
| `channelStopped(int,int,int)` | mport, card, port | Audio playout stops on an output channel |

## Public Slots

| Slot | Purpose |
|------|---------|
| `setButton(type,panel,row,col,cartnum,title)` | Assigns a cart to a specific button position |
| `acceptCartDrop(row,col,cartnum,color,title)` | Handles cart drag-and-drop onto a button |
| `changeUser()` | Reloads user panels when user changes (reloads panel names from DB) |
| `tickClock()` | Drives countdown timers on all active buttons |
| `panelUp()` / `panelDown()` | Navigate panel selector forward/backward |

## Key Private Slots

| Slot | Connected From | Purpose |
|------|---------------|---------|
| `buttonMapperData(int)` | QSignalMapper (button clicks) | Central click dispatcher; routes to PlayButton/StopButton/setup based on action mode |
| `playmodeActivatedData(int)` | playmode combo | Switches between normal and hook playback modes |
| `resetClickedData()` | Reset button | Enters reset mode (next clicked button gets cleared) |
| `allClickedData()` | All button | Stops all playing buttons |
| `setupClickedData()` | Setup button | Enters setup mode (next clicked button opens RDButtonDialog) |
| `stateChangedData(int,State)` | RDPlayDeck | Updates button visual state on play/pause/stop |
| `hookEndData(int)` | RDPlayDeck | Handles hook end — stops or transitions playback |
| `panelSetupData()` | panel selector setup | Opens panel naming dialog |
| `onairFlagChangedData(bool)` | RDRipc | Tracks on-air status for traffic logging |
| `scanPanelData()` | QTimer (10s interval) | Periodically refreshes panel data from DB |

## Key Private Methods

| Method | Behavior |
|--------|----------|
| `PlayButton(type,panel,row,col,src,hookmode,mport)` | Initiates playback — dispatches to PlayAudio or PlayMacro |
| `PlayAudio(button,cart,hookmode,mport)` | Allocates RDPlayDeck, loads cart, starts audio playout |
| `PlayMacro(button,cart)` | Executes cart macros via RDEventPlayer |
| `PauseButton(...)` | Pauses currently playing button |
| `StopButton(...)` | Stops button playout (with optional fade-out) |
| `LoadPanels()` | Creates RDButtonPanel objects for all station+user panels |
| `LoadPanel(type,panel)` | Loads button assignments from DB for one panel |
| `SaveButton(type,panel,row,col)` | Persists button assignment to DB (insert or update) |
| `LogPlayEvent(cartnum,cutnum)` | Logs playout event via RDCut |
| `LogTraffic(button)` / `LogTrafficMacro(button)` | Inserts playout records into ELR_LINES |

## Action Modes

Supports multiple action modes (RDAirPlayConf::ActionMode):
- **Normal** — clicking plays/stops
- **CopyFrom** / **CopyTo** — copy button configuration between positions
- **AddTo** — add cart to empty button
- **DeleteFrom** — remove cart from button
- **Setup** — open button editor dialog

## SQL / DB Access

| Table | Operation | Context |
|-------|-----------|---------|
| `PANELS` / `EXTENDED_PANELS` | SELECT, UPDATE, INSERT | Load/save button-to-cart assignments (label, cart number, color) |
| `PANEL_NAMES` / `EXTENDED_PANEL_NAMES` | SELECT, DELETE, INSERT | Panel naming (user renames panels) |
| `CART` (JOIN) | SELECT | Fetch cart metadata (length, hook length, type) for button display |
| `ELR_LINES` | INSERT | Traffic/playout logging with full metadata |

## Key Fields

- `panel_buttons: vector<RDButtonPanel*>` — all button panels (station + user)
- `panel_active_buttons[RD_MAX_STREAMS]` — currently playing buttons indexed by deck
- `panel_card[5] / panel_port[5]` — output audio routing (up to 5 outputs)
- `panel_mapper: QSignalMapper*` — maps button clicks to unified handler
- `panel_action_mode` — current action mode
- `panel_flash / panel_flash_state` — flash animation state
- `panel_scan_timer` — periodic DB refresh timer (10s)

## Widget Dimensions

- Button size: 88x80 px
- Max outputs: 5
- Scan interval: 10000ms
