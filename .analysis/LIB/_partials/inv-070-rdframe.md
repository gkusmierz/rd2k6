# inv-070 — RDFrame

partial_id: 070
status: done
sources: lib/rdframe.h, lib/rdframe.cpp

---

## Class: RDFrame

**Inherits:** QFrame (Qt), RDFontEngine (multiple inheritance)

**Purpose:** Base class for Rivendell QFrame-based widgets. Provides DPI-aware font engine to frame containers.

**Q_OBJECT:** yes

### Constructors

| Signature | Description |
|-----------|-------------|
| `RDFrame(QWidget *parent=0, Qt::WindowFlags f=0)` | Default — initializes RDFontEngine from widget's current font, applies defaultFont() |
| `RDFrame(RDConfig *config, QWidget *parent=0, Qt::WindowFlags f=0)` | With explicit config — passes config to RDFontEngine |

### Signals

None.

### Slots

None.

### Key Behaviors

- On construction, initializes RDFontEngine with the widget's current font
- Applies defaultFont() from RDFontEngine to the frame
- Used as base for frame-based compound widgets (panels, groups, visual containers)
- All font presets available through inherited RDFontEngine methods

### Dependencies

- **RDFontEngine** — font calculation engine (multiple inheritance mixin)
- **RDConfig** — optional explicit configuration source
- **QFrame** — Qt frame widget base class
