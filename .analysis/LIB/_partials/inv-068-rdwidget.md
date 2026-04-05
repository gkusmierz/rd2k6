# inv-068 — RDWidget

partial_id: 068
status: done
sources: lib/rdwidget.h, lib/rdwidget.cpp

---

## Class: RDWidget

**Inherits:** QWidget (Qt), RDFontEngine (multiple inheritance)

**Purpose:** Base class for all Rivendell non-dialog, non-frame widgets. Provides DPI-aware font engine to every widget in the system.

**Q_OBJECT:** yes

### Constructors

| Signature | Description |
|-----------|-------------|
| `RDWidget(QWidget *parent=0, Qt::WindowFlags f=0)` | Default — initializes RDFontEngine from widget's current font, then applies defaultFont() |
| `RDWidget(RDConfig *config, QWidget *parent=0, Qt::WindowFlags f=0)` | With explicit config — passes config to RDFontEngine for font settings |

### Signals

None.

### Slots

None.

### Key Behaviors

- On construction, initializes RDFontEngine with the widget's current font (via `font()`)
- Immediately sets the widget's font to `defaultFont()` from RDFontEngine
- This means every RDWidget subclass automatically gets consistent, config-driven fonts
- All font presets (buttonFont, labelFont, timerFont, etc.) are available through inherited RDFontEngine methods

### Dependencies

- **RDFontEngine** — font calculation engine (multiple inheritance mixin)
- **RDConfig** — optional explicit configuration source
- **QWidget** — Qt base widget class
