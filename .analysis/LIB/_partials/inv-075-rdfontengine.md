# inv-075 — RDFontEngine

partial_id: 075
status: done
sources: lib/rdfontengine.h, lib/rdfontengine.cpp

---

## Class: RDFontEngine

**Inherits:** (none — plain C++ class, used as mixin via multiple inheritance)

**Purpose:** DPI-aware font calculation engine that provides a consistent set of named font presets across all Rivendell UI widgets. Reads configuration from rd.conf and generates appropriately sized fonts.

**Q_OBJECT:** no

### Constructors

| Signature | Description |
|-----------|-------------|
| `RDFontEngine(const QFont &default_font, RDConfig *c=NULL)` | Uses provided font as base for generating font set |
| `RDFontEngine(RDConfig *c=NULL)` | Reads font family and default size from RDConfig to construct base font |

### Font Presets

Each preset provides both a `QFont` accessor and a `QFontMetrics*` accessor:

| Preset | Base Size | Weight | Typical Use |
|--------|-----------|--------|-------------|
| buttonFont | button_size (default 12px) | Bold | Standard button labels |
| hugeButtonFont | button_size + 24px | DemiBold | Extra-large button labels |
| bigButtonFont | button_size + 4px | DemiBold | Large button labels |
| subButtonFont | button_size - 2px | Normal | Secondary button text |
| sectionLabelFont | label_size + 2px | Bold | Section headers |
| bigLabelFont | label_size + 4px | Bold | Large labels |
| labelFont | label_size (default 11px) | Bold | Standard labels |
| subLabelFont | label_size | Normal | Secondary labels |
| progressFont | label_size + 4px | Bold | Progress indicators |
| bannerFont | 26px | Normal | Large banners/titles |
| timerFont | 20px | Normal | Timer displays |
| smallTimerFont | default_size + 2px | Normal | Compact timer displays |
| defaultFont | default_size (default 11px) | Normal | General text |

### Configuration Source

Font parameters are read from `RDConfig` (rd.conf):
- `fontFamily()` — overrides default "System" family
- `fontButtonSize()` — overrides default button_size=12
- `fontLabelSize()` — overrides default label_size=11
- `fontDefaultSize()` — overrides default default_size=11

If no RDConfig is provided, falls back to `rda->config()` (global application config singleton).

### Key Behaviors

- **Pixel-size based:** All fonts use `setPixelSize()` for DPI-independent rendering
- **Config-driven:** Three base sizes (button, label, default) are configurable. All 13 presets derive from these three bases
- **Mixin pattern:** Not a QObject — used via multiple inheritance with QWidget/QDialog/QFrame subclasses
- **Memory management:** Destructor frees all QFontMetrics pointers

### Usage Pattern

RDWidget, RDDialog, RDFrame, and RDPushButton all inherit from RDFontEngine. At construction, they:
1. Initialize RDFontEngine with the widget's current font
2. Call `setFont(defaultFont())` to apply the config-driven default font

This ensures every Rivendell widget uses the same font family and size scale defined in rd.conf.

### Dependencies

- **RDConfig** — configuration source for font family and sizes
- **rda (RDApplication)** — global app singleton, fallback config source
- **QFont / QFontMetrics** — Qt font classes
