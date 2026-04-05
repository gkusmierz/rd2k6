# INV-061: RDCartSlot

**Status:** done
**Source:** `lib/rdcartslot.h`, `lib/rdcartslot.cpp`
**Inherits:** RDWidget

## Purpose

Cart slot widget used in RDAirPlay's cart slot deck. Each slot can hold one cart for playout, supporting two modes: standard cart deck mode and breakaway mode (auto-fill from service). Provides load/unload/play/pause/stop controls and playout logging.

## Constructor

```
RDCartSlot(int slotnum, RDRipc *ripc, RDCae *cae, RDStation *station,
           RDConfig *config, RDListSvcs *svcs_dialog, RDSlotDialog *slot_dialog,
           RDCartDialog *cart_dialog, RDCueEditDialog *cue_dialog,
           const QString &caption, RDAirPlayConf *conf, QWidget *parent)
```

Each slot is identified by `slotnum`. Receives shared dialog instances for cart selection, slot options, service selection, and cue editing.

## Signals

| Signal | Parameters | Emitted When |
|--------|-----------|--------------|
| `tick()` | - | Clock tick (forwarded to parent) |
| `buttonFlash(bool)` | state | Flash state change |
| `selectClicked(unsigned,int,int)` | cartnum, row, col | Cart selected |

## Public Slots

| Slot | Purpose |
|------|---------|
| `updateMeters()` | Refreshes audio level meters on the slot box |

## Key Public Methods

| Method | Behavior |
|--------|----------|
| `setUser(RDUser*)` | Sets current user for permission checks |
| `slotOptions()` | Returns the RDSlotOptions for this slot |
| `updateOptions()` | Reloads options from DB and reconfigures the slot |
| `setSvcNames(vector<QString>*)` | Sets available service names for breakaway mode |
| `setCart(RDCart*,break_len)` | Loads a cart into the slot with optional breakaway length |
| `load(cartnum,break_len)` | Loads cart by number |
| `unload()` | Unloads current cart |
| `play()` / `pause()` / `stop()` | Transport controls |
| `breakAway(msecs)` | Initiates breakaway — selects auto-fill cart for given duration |
| `pauseEnabled()` / `setPauseEnabled(bool)` | Controls pause capability |

## Key Private Slots

| Slot | Connected From | Purpose |
|------|---------------|---------|
| `startData()` | Start button click | Initiates play or select-cart action |
| `doubleClickedData()` | RDSlotBox double-click | Opens cue edit dialog |
| `loadData()` | Load button click | Opens cart selection dialog or service dialog |
| `optionsData()` | Options button click | Opens slot options dialog |
| `stateChangedData(int,State)` | RDPlayDeck | Handles state transitions (play/pause/stop/finish) |
| `positionData(int,int)` | RDPlayDeck | Updates position bar and countdown timer |
| `hookEndData(int)` | RDPlayDeck | Handles hook endpoint |
| `timescalingSupportedData(int,bool)` | RDCae | Tracks time-scaling capability |
| `cartDroppedData(unsigned)` | RDSlotBox cart drop | Loads dropped cart into slot |

## Key Private Methods

| Method | Behavior |
|--------|----------|
| `InitializeOptions()` | Loads slot options from DB and configures initial cart/mode |
| `SelectCart(svcname,msecs)` | Finds best-fit auto-fill cart from AUTOFILLS table for given duration |
| `SetInput(bool)` | Enables/disables audio passthrough on the slot's I/O ports |
| `LogPlayout(State)` | Logs playout event to ELR_LINES with full metadata |
| `ClearTempCart()` | Removes temporary cart created during breakaway |

## SQL / DB Access

| Table | Operation | Context |
|-------|-----------|---------|
| `AUTOFILLS` + `CART` (JOIN) | SELECT | Find auto-fill cart matching duration range for breakaway |
| `ELR_LINES` | INSERT | Full playout log record (service, cart, timing, metadata) |
| (via RDSlotOptions) | SELECT/UPDATE | Slot configuration (CARTSLOTS table) |

## Sub-Widgets

- `slot_start_button: QPushButton` — play/stop control
- `slot_load_button: QPushButton` — load cart
- `slot_options_button: QPushButton` — open options dialog
- `slot_box: RDSlotBox` — cart info display widget
- `slot_deck: RDPlayDeck` — audio playout deck

## Key Fields

- `slot_options: RDSlotOptions*` — configuration (mode, hook, stop action, etc.)
- `slot_logline: RDLogLine*` — current cart's log line data
- `slot_breakaway_cart / slot_breakaway_length` — breakaway state
- `slot_temp_cart: bool` — whether current cart is temporary (breakaway-created)
- `slot_timescaling_active: bool` — time-scaling capability
