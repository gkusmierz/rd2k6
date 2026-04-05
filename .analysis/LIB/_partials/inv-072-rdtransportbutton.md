# inv-072 — RDTransportButton

partial_id: 072
status: done
sources: lib/rdtransportbutton.h, lib/rdtransportbutton.cpp

---

## Class: RDTransportButton

**Inherits:** QPushButton (Qt)

**Purpose:** Audio transport button widget that renders standard transport icons (Play, Stop, Record, etc.) as pixmap caps with configurable colors and On/Off/Flashing states.

**Q_OBJECT:** yes

**Note:** Does NOT inherit RDFontEngine (unlike other RD* widgets). This is a purely visual icon button.

### Enums

| Enum | Values | Description |
|------|--------|-------------|
| `TransType` | `Play=0, Stop=1, Record=2, FastForward=3, Rewind=4, Eject=5, Pause=6, PlayFrom=7, PlayBetween=8, Loop=9, Up=10, Down=11, PlayTo=12` | Type of transport icon to render |
| `TransState` | `On=0, Off=1, Flashing=2` | Visual state of the button |

### Constructor

| Signature | Description |
|-----------|-------------|
| `RDTransportButton(TransType type, QWidget *parent=0)` | Creates button with specified transport icon type |

### Properties (get/set)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type (getType/setType) | TransType | (constructor arg) | Transport icon type |
| onColor | QColor | Qt::green | Color used for the "on" state cap |
| accentColor | QColor | colorGroup().shadow() | Accent/outline color for icon drawing |

### Public Slots

| Slot | Description |
|------|-------------|
| `on()` | Sets state to On (shows on_cap pixmap) |
| `off()` | Sets state to Off (shows off_cap pixmap) |
| `flash()` | Sets state to Flashing (alternates between on_cap and off_cap) |

### Signals

None (inherits QPushButton clicked/pressed/released).

### Key Behaviors

- **Pixmap-based rendering:** Maintains two pixmaps (on_cap, off_cap) that are drawn with transport icons (triangles, squares, circles, arrows etc.) using QPainter
- **State management:** Three states — On (shows on_cap), Off (shows off_cap), Flashing (timer toggles between both)
- **Flash animation:** Internal QTimer-based flash with flashClock() private slot
- **Color change redraws:** Changing onColor or accentColor triggers immediate redraw of both caps and display update
- **Resize handling:** Redraws caps at new size on resizeEvent
- **No focus policy:** Sets Qt::NoFocus — purely mouse-operated transport control
- **13 transport types:** Covers standard audio transport operations including Play, Stop, Record, FF, Rewind, Eject, Pause, and Rivendell-specific variants (PlayFrom, PlayBetween, PlayTo, Loop, Up, Down)

### Dependencies

- **QPushButton** — Qt base class
- **QTimer** — flash animation timer
- **QPixmap** — on_cap and off_cap icon pixmaps
- **QPainter** — icon drawing
