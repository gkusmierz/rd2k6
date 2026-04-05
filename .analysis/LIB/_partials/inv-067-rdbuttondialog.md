# INV-067: RDButtonDialog

**Status:** done
**Source:** `lib/rdbutton_dialog.h`, `lib/rdbutton_dialog.cpp`
**Inherits:** RDDialog

## Purpose

Modal dialog for editing a single sound panel button's properties. Allows the user to assign a cart, set a label, and choose a background color for a panel button.

## Constructor

```
RDButtonDialog(QString station_name, const QString &caption,
               const QString &label_template, RDCartDialog *cart_dialog,
               const QString &svcname, QWidget *parent)
```

Takes station name, caption, label template (for auto-generating labels from cart metadata), a shared cart selection dialog, and the service name.

## Public Slots

| Slot | Purpose |
|------|---------|
| `exec(RDPanelButton *button, bool hookmode, const QString &username, const QString &passwd)` | Opens dialog for the given button; returns 0 on OK, -1 on Cancel |

## Dialog Fields

| Widget | Type | Purpose |
|--------|------|---------|
| `edit_label_edit` | QLineEdit | Button label text (editable) |
| `edit_cart_edit` | QLineEdit | Cart display (number + title, read-only) |
| `edit_color_button` | QPushButton | Color preview/selector button |

## Private Slots

| Slot | Connected From | Purpose |
|------|---------------|---------|
| `setCartData()` | "Select Cart" button | Opens RDCartDialog to pick a cart |
| `clearCartData()` | "Clear" button | Clears cart assignment, resets color to light gray, clears label |
| `setColorData()` | Color button | Opens QColorDialog for background color selection |
| `okData()` | OK button | Applies changes to the RDPanelButton (see below) |
| `cancelData()` | Cancel button | Closes dialog without changes |

## OK Behavior

When user confirms:
1. Sets cart number on the button
2. Sets display and default color
3. If cart assigned and label empty: auto-generates label using `RDLogLine::resolveWildcards()` with the label template
4. Otherwise: uses the user-entered label text
5. Sets normal length from `cart->forcedLength()`
6. Sets hook length from `cart->averageHookLength()` (falls back to forced length if 0)
7. Sets active length based on current hook mode
8. Sets hook mode on the button

## Private Methods

| Method | Behavior |
|--------|----------|
| `DisplayCart(int cartnum)` | Updates cart display field: shows "NNNNNN - Title" or "NOT FOUND" |

## Widget Dimensions

Fixed size: 370x190 px.

## Signal/Slot Connections

| Source | Signal | Target | Slot |
|--------|--------|--------|------|
| "Select Cart" button | `clicked()` | this | `setCartData()` |
| "Clear" button | `clicked()` | this | `clearCartData()` |
| Color button | `clicked()` | this | `setColorData()` |
| OK button | `clicked()` | this | `okData()` |
| Cancel button | `clicked()` | this | `cancelData()` |

## SQL / DB Access

None directly (uses RDCart objects for metadata lookup; persistence handled by parent's SaveButton call).
