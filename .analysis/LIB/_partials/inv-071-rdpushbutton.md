# inv-071 — RDPushButton

partial_id: 071
status: done
sources: lib/rdpushbutton.h, lib/rdpushbutton.cpp

---

## Class: RDPushButton

**Inherits:** QPushButton (Qt), RDFontEngine (multiple inheritance)

**Purpose:** Extended push button with flashing capability, word-wrap text, middle/right-click signals, and configurable clock source for flash timing.

**Q_OBJECT:** yes

### Enums

| Enum | Values | Description |
|------|--------|-------------|
| `ClockSource` | `InternalClock=0, ExternalClock=1` | Whether flashing is driven by internal timer or external tick |

### Constructors

| Signature | Description |
|-----------|-------------|
| `RDPushButton(QWidget *parent, RDConfig *c=NULL)` | Basic — no text |
| `RDPushButton(const QString &text, QWidget *parent, RDConfig *c=NULL)` | With text label |
| `RDPushButton(const QIcon &icon, const QString &text, QWidget *parent, RDConfig *c=NULL)` | With icon and text |

### Properties (get/set)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| text | QString | "" | Button label text (managed separately from QPushButton::text for word-wrap) |
| wordWrap | bool | false | Enables automatic word wrapping with font size reduction |
| flashColor | QColor | Qt::blue | Background color shown during flash-on phase |
| flashPeriod | int | 300 ms | Interval between flash on/off toggles |
| clockSource | ClockSource | InternalClock | Timer source for flash animation |
| id | int | -1 | Application-assigned identifier, emitted with click signals |
| flashingEnabled | bool | false | Master switch for flash animation |

### Signals

| Signal | Description |
|--------|-------------|
| `centerClicked()` | Middle mouse button clicked inside button bounds |
| `centerClicked(int id, const QPoint &pt)` | Middle click with button ID and click position |
| `centerPressed()` | Middle mouse button pressed |
| `centerReleased()` | Middle mouse button released |
| `rightClicked()` | Right mouse button clicked inside button bounds |
| `rightClicked(int id, const QPoint &pt)` | Right click with button ID and click position |
| `rightPressed()` | Right mouse button pressed |
| `rightReleased()` | Right mouse button released |

### Public Slots

| Slot | Description |
|------|-------------|
| `setFlashingEnabled(bool state)` | Starts or stops flashing animation |
| `setPalette(const QPalette &)` | Overrides QPushButton palette, stores as "off" palette for flash toggling |
| `tickClock()` | External clock tick — toggles flash state (for ExternalClock mode) |
| `tickClock(bool state)` | External clock tick with explicit on/off state |

### Key Behaviors

- **Flashing:** Alternates between flash_palette (flash_color background with auto-contrast text) and off_palette. Uses internal QTimer or external tickClock() calls
- **Flash color auto-contrast:** When setting flash color, automatically calculates appropriate text color (white or black) based on HSV analysis of the flash color
- **Word wrap:** When enabled, ComposeText() iteratively reduces font size until text fits within 90% of button dimensions, splitting on spaces and adding newlines
- **Mouse handling:** Left-click delegates to QPushButton. Middle and right clicks emit dedicated signals with bounds checking (only emits "clicked" if release is within button geometry)
- **Clock source switching:** Changing from Internal to External stops the timer. Changing from External to Internal restarts flashing if enabled
- **Palette override:** setPalette() stores the palette as off_palette, ensuring flash toggle has correct "off" state

### Dependencies

- **RDFontEngine** — font calculation engine (multiple inheritance mixin)
- **RDConfig** — optional configuration
- **QTimer** — internal flash timer
- **QPushButton** — Qt base class
