# INV-063: RDSlotDialog

**Status:** done
**Source:** `lib/rdslotdialog.h`, `lib/rdslotdialog.cpp`
**Inherits:** RDDialog

## Purpose

Modal dialog for editing RDCartSlot options. Allows the user to configure slot mode, hook mode, and stop action for a cart slot.

## Constructor

```
RDSlotDialog(const QString &caption, QWidget *parent)
```

## Public Slots

| Slot | Purpose |
|------|---------|
| `exec(RDSlotOptions *opts)` | Opens dialog populated with current options; returns 0 on OK, -1 on Cancel |

## Dialog Fields

| Widget | Type | Options |
|--------|------|---------|
| `edit_mode_box` | QComboBox | CartDeckMode, BreakawayMode |
| `edit_hook_box` | QComboBox | Hook mode on/off |
| `edit_stop_action_box` | QComboBox | UnloadOnStop, RecueOnStop, LoopOnStop |

## Behavior

1. On `exec()`: populates combo boxes from RDSlotOptions values
2. Mode change (`modeActivatedData`) may show/hide hook and stop action controls based on mode
3. On OK: writes selected values back to the RDSlotOptions object and calls `opts->save()` to persist to DB
4. On Cancel: discards changes

## Signal/Slot Connections

| Source | Signal | Target | Slot |
|--------|--------|--------|------|
| `edit_mode_box` | `activated(int)` | this | `modeActivatedData(int)` |
| `edit_ok_button` | `clicked()` | this | `okData()` |
| `edit_cancel_button` | `clicked()` | this | `cancelData()` |

## Widget Dimensions

Fixed size dialog (resizable via `resizeEvent`).

## SQL / DB Access

None directly (persists via RDSlotOptions::save()).
