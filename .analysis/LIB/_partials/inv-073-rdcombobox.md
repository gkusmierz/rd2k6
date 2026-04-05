# inv-073 — RDComboBox

partial_id: 073
status: done
sources: lib/rdcombobox.h, lib/rdcombobox.cpp

---

## Class: RDComboBox

**Inherits:** QComboBox (Qt)

**Purpose:** Extended combo box with setup mode (intercepts clicks to emit a config signal), unique item insertion, and key filtering.

**Q_OBJECT:** yes

**Note:** Does NOT inherit RDFontEngine.

### Constructor

| Signature | Description |
|-----------|-------------|
| `RDComboBox(QWidget *parent=0)` | Default — combo_setup_mode starts as false |

### Public Methods

| Method | Description |
|--------|-------------|
| `insertItem(const QString &str, bool unique=false)` | Inserts item; if unique=true, skips if item text already exists in the list |
| `setSetupMode(bool state)` | Enables/disables setup mode — when true, clicks emit setupClicked() instead of opening dropdown |
| `addIgnoredKey(int key)` | Registers a key code to be ignored (passed to parent) during keyPressEvent |

### Signals

| Signal | Description |
|--------|-------------|
| `setupClicked()` | Emitted on mouse press when setup mode is active |

### Key Behaviors

- **Setup mode:** When enabled, mouse press does NOT open dropdown. Instead emits `setupClicked()` signal, allowing the combo box to serve as a trigger for configuration dialogs
- **Unique insertion:** `insertItem()` with `unique=true` checks all existing items and silently skips duplicates
- **Key filtering:** Keys registered via `addIgnoredKey()` are intercepted in keyPressEvent and marked as ignored (propagated to parent widget). All other keys pass through normally to QComboBox

### Dependencies

- **QComboBox** — Qt base class
- **std::vector<int>** — stores ignored key codes
