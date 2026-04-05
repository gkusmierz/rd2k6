---
partial_id: "092"
class: RDListView
source_files:
  - lib/rdlistview.h
  - lib/rdlistview.cpp
phase: 2
status: done
---

# RDListView

## Rola
Extended Q3ListView with support for multiple sort types per column, hard (forced) sort column, contiguous selection mode, and line-based row selection.

## Dziedziczenie
- **Bazowa:** Q3ListView (Qt3 compat multi-column list widget)
- **Q_OBJECT:** tak

## Enums
| Enum | Wartosci | Opis |
|------|----------|------|
| `SortType` | NormalSort=0, TimeSort=1, LineSort=2, GpioSort=3, NumericSort=4, DateTimeSort=5 | Typ sortowania per kolumna |

## Signals
Brak wlasnych (dziedziczy z Q3ListView).

## Private Slots
| Slot | Opis |
|------|------|
| `mouseButtonClickedData(int button, Q3ListViewItem *item, const QPoint &pt, int col)` | Obsluga klikniecia -- wymusza contiguous selection jesli wlaczona |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDListView(QWidget *parent)` | Konstruktor |
| `hardSortColumn() / setHardSortColumn(int)` | Kolumna wymuszajaca sortowanie (ignoruje klikniecia uzytkow.) |
| `setContiguous(bool) / contiguous()` | Tryb contiguous selection |
| `columnSortType(int) / setColumnSortType(int, SortType)` | Typ sortowania per kolumna |
| `addColumn(const QString &label, int width=-1)` | Dodaj kolumne z etykieta |
| `addColumn(const QIcon &iconset, const QString &label, int width=-1)` | Dodaj kolumne z ikona |
| `selectLine(int line)` | Zaznacz wiersz po numerze linii (szuka RDListViewItem z matching line) |

## Pola prywatne
- `int list_hard_sort_column` -- wymuszona kolumna sortowania (-1 = brak)
- `bool list_contiguous` -- tryb ciaglego zaznaczania
- `std::vector<SortType> sort_type` -- typ sortowania per kolumna

## Zachowanie
- `addColumn()` nadpisane: rejestruje domyslny SortType per kolumna.
- `setHardSortColumn()` wymusza sortowanie po danej kolumnie niezaleznie od klikniec uzytkownika.
- Contiguous selection: gdy wlaczony, klikniecie zaznacza ciagly zakres wierszy.
- `selectLine()` iteruje po itemach i zaznacza ten z pasujacym numerem linii (RDListViewItem::line()).
- Typ sortowania per kolumna pozwala na rozne porownania (numeryczne, czasowe, GPIO, itp.) -- delegowane do RDListViewItem::compare().
