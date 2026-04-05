---
partial_id: "093"
class: RDListViewItem
source_files:
  - lib/rdlistviewitem.h
  - lib/rdlistviewitem.cpp
phase: 2
status: done
---

# RDListViewItem

## Rola
Extended Q3ListViewItem with custom painting support (background color, text color/weight), line number tracking, integer ID, and multi-type sorting (cooperates with RDListView::SortType).

## Dziedziczenie
- **Bazowa:** Q3ListViewItem (Qt3 compat list view item)
- **Q_OBJECT:** nie (nie jest QObject)

## Signals
Brak.

## Slots
Brak.

## Konstruktory
| Konstruktor | Opis |
|-------------|------|
| `RDListViewItem(Q3ListView *parent)` | Element top-level w liscie |
| `RDListViewItem(RDListViewItem *parent)` | Element potomny (child item) |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `line() / setLine(int)` | Numer linii (uzywany przez RDListView::selectLine) |
| `id() / setId(int)` | Identyfikator calkowity (dowolne ID biznesowe) |
| `backgroundColor() / setBackgroundColor(QColor)` | Kolor tla wiersza |
| `textColor() / setTextColor(QColor)` | Kolor tekstu |
| `setTextColor(QColor, int weight)` | Kolor tekstu + grubosc czcionki |
| `paintCell(QPainter*, QColorGroup&, int col, int w, int align)` | Nadpisane malowanie komorki -- stosuje niestandardowe kolory |
| `compare(Q3ListViewItem*, int col, bool asc)` | Nadpisane porownanie -- deleguje do SortType z RDListView |

## Pola prywatne
- `int item_line` -- numer linii
- `int item_id` -- identyfikator
- `QColor item_text_color` -- kolor tekstu
- `int item_text_weight` -- grubosc czcionki (QFont::Weight)
- `QColor item_background_color` -- kolor tla
- `RDListView *list_parent` -- referencja do rodzica RDListView

## Zachowanie
- `paintCell()` nadpisane: rysuje komorke z niestandardowym kolorem tla i tekstu/grubosci czcionki.
- `compare()` nadpisane: sprawdza SortType kolumny z rodzica RDListView i stosuje odpowiednie porownanie:
  - NormalSort: domyslne porownanie stringowe
  - TimeSort: porownanie jako czas (HH:MM:SS)
  - LineSort: porownanie po numerze linii
  - GpioSort: porownanie GPIO
  - NumericSort: porownanie numeryczne
  - DateTimeSort: porownanie daty i czasu
- `line()` / `id()` umozliwiaja identyfikacje wiersza niezaleznie od pozycji w liscie.
