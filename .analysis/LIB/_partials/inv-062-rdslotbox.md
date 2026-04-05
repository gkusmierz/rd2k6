# INV-062: RDSlotBox

**Status:** done
**Source:** `lib/rdslotbox.h`, `lib/rdslotbox.cpp`
**Inherits:** RDWidget

## Purpose

Cart slot label/display widget used within RDCartSlot. Displays cart metadata (cart number, title, artist, group, description, outcue, length, talk time), a position progress bar, and stereo audio level meters. Supports drag-and-drop of carts.

## Constructor

```
RDSlotBox(RDPlayDeck *deck, RDAirPlayConf *conf, QWidget *parent)
```

Takes a reference to the playout deck and airplay configuration.

## Signals

| Signal | Parameters | Emitted When |
|--------|-----------|--------------|
| `doubleClicked()` | - | User double-clicks the slot box |
| `cartDropped(unsigned)` | cartnum | Cart dragged and dropped onto this box |

## Key Public Methods

| Method | Behavior |
|--------|----------|
| `logLine()` | Returns the current RDLogLine |
| `setCart(RDLogLine*)` | Populates all labels with cart metadata (number, title, artist, group, length, etc.) |
| `setMode(RDSlotOptions::Mode)` | Displays current mode (CartDeck/Breakaway) |
| `setService(QString)` | Displays breakaway service name |
| `setStatusLine(QString)` | Shows status text in title area |
| `setTimer(int msecs)` | Updates countdown timer display |
| `clear()` | Resets all labels to empty/default |
| `setBarMode(bool changed)` | Sets position bar palette (transitioning vs stopping, changed vs unchanged) |
| `setAllowDrags(bool)` | Enables/disables drag initiation from this widget |
| `updateMeters(short[2])` | Updates left/right audio level meters |

## Display Elements

| Label | Content |
|-------|---------|
| `line_icon_label` | Cart type icon (audio playout or macro/RML) |
| `line_cart_label` | 6-digit cart number |
| `line_cut_label` | Cut number |
| `line_group_label` | Group name (colored by group color) |
| `line_title_label` | Cart title (with origin user/date if available, or resolved from template) |
| `line_description_label` | Cut description |
| `line_artist_label` | Artist name |
| `line_outcue_label` | Outcue text |
| `line_length_label` | Formatted length (with timescale palette when active) |
| `line_talktime_label` | Talk time |
| `line_up_label` / `line_down_label` | Count up/down timers |
| `line_position_bar` | QProgressBar showing playback position |
| `line_meter[2]` | Stereo RDPlayMeter audio levels |

## Visual States

- **Normal background** — LABELBOX_BACKGROUND_COLOR
- **Missing cart** — LABELBOX_MISSING_COLOR (cart not found or no audio)
- **Evergreen** — LABELBOX_EVERGREEN_COLOR
- **Position bar** — different palettes for unchanged/changed, stopping/transitioning
- **Time-scaling active** — special palette on length label

## Drag & Drop

- `mousePressEvent` — initiates drag tracking
- `dragEnterEvent` — accepts RDCartDrag
- `dropEvent` — decodes cart number, emits `cartDropped(unsigned)`
- `mouseDoubleClickEvent` — emits `doubleClicked()`

## Enum

```
BarMode { Transitioning=0, Stopping=1 }
```

## Widget Dimensions

- Full height: 85 px, Half height: 50 px
- Width: 393 px (from sizeHint)

## SQL / DB Access

None directly (data comes from RDLogLine/RDCart/RDCut objects passed in).
