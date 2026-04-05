---
partial_id: "089"
class: RDBusyDialog
source_files:
  - lib/rdbusydialog.h
  - lib/rdbusydialog.cpp
phase: 2
status: done
---

# RDBusyDialog

## Rola
Modal "please wait" dialog with an animated busy bar. Blocks UI and shows an indeterminate progress indicator during long operations.

## Dziedziczenie
- **Bazowa:** RDDialog (custom dialog base class)
- **Q_OBJECT:** tak

## Kompozycja wewnętrzna
- Zawiera `QLabel *bar_label` -- etykieta tekstowa
- Zawiera `RDBusyBar *bar_bar` -- animowany pasek zajetosci

## Signals
Brak.

## Slots
Brak wlasnych (poza odziedziczonymi).

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDBusyDialog(QWidget *parent=0, Qt::WFlags f=0)` | Konstruktor |
| `~RDBusyDialog()` | Destruktor |
| `sizeHint()` | Rozmiar preferowany |
| `show(const QString &label, const QString &caption)` | Pokaz dialog z etykieta i tytulem, uruchom animacje |
| `hide()` | Schowaj dialog i zatrzymaj animacje |

## Metody chronione
| Metoda | Opis |
|--------|------|
| `resizeEvent(QResizeEvent*)` | Przelicza layout przy zmianie rozmiaru |

## Zachowanie
- `show()` ustawia tekst etykiety, tytul okna, aktywuje RDBusyBar i wyswietla dialog.
- `hide()` dezaktywuje RDBusyBar i chowa dialog.
- Dialog jest modalny -- blokuje interakcje z reszta aplikacji.
