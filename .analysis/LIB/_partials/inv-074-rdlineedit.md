# inv-074 — RDLineEdit

partial_id: 074
status: done
sources: lib/rdlineedit.h, lib/rdlineedit.cpp

---

## Class: RDLineEdit

**Inherits:** QLineEdit (Qt)

**Purpose:** Extended line edit that emits a signal when the Escape key is pressed, enabling parent widgets to handle cancel/dismiss actions.

**Q_OBJECT:** yes

**Note:** Does NOT inherit RDFontEngine.

### Constructors

| Signature | Description |
|-----------|-------------|
| `RDLineEdit(QWidget *parent)` | Empty line edit |
| `RDLineEdit(const QString &contents, QWidget *parent)` | Pre-filled with contents |

### Signals

| Signal | Description |
|--------|-------------|
| `escapePressed()` | Emitted when the Escape key is pressed (before passing event to QLineEdit) |

### Key Behaviors

- **Escape key interception:** On Key_Escape, emits `escapePressed()` signal, then still calls `QLineEdit::keyPressEvent()` for default handling
- All other keys are passed through to QLineEdit without modification
- Minimal extension — sole purpose is Escape key notification

### Dependencies

- **QLineEdit** — Qt base class
