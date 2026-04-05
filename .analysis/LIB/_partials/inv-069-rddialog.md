# inv-069 — RDDialog

partial_id: 069
status: done
sources: lib/rddialog.h, lib/rddialog.cpp

---

## Class: RDDialog

**Inherits:** QDialog (Qt), RDFontEngine (multiple inheritance)

**Purpose:** Base class for all Rivendell modal dialogs. Provides DPI-aware font engine and enforces modal behavior by default.

**Q_OBJECT:** yes

### Constructors

| Signature | Description |
|-----------|-------------|
| `RDDialog(QWidget *parent=0, Qt::WindowFlags f=0)` | Default — sets modal(true), initializes RDFontEngine, applies defaultFont() |
| `RDDialog(RDConfig *config, QWidget *parent=0, Qt::WindowFlags f=0)` | With explicit config — same as above but passes config to RDFontEngine |

### Signals

None.

### Slots

None.

### Key Behaviors

- Always created as modal (`setModal(true)` in constructor)
- Initializes RDFontEngine from widget's current font, then applies defaultFont()
- Every dialog subclass inherits consistent, config-driven fonts
- All font presets available through inherited RDFontEngine methods

### Dependencies

- **RDFontEngine** — font calculation engine (multiple inheritance mixin)
- **RDConfig** — optional explicit configuration source
- **QDialog** — Qt dialog base class
