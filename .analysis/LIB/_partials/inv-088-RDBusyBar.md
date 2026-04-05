---
partial_id: "088"
class: RDBusyBar
source_files:
  - lib/rdbusybar.h
  - lib/rdbusybar.cpp
phase: 2
status: done
---

# RDBusyBar

## Rola
Animated busy/progress indicator bar. Displays a moving highlight segment inside a frame to indicate an ongoing operation (indeterminate progress).

## Dziedziczenie
- **Bazowa:** QFrame
- **Q_OBJECT:** tak

## Signals
Brak.

## Public Slots
| Slot | Parametry | Opis |
|------|-----------|------|
| `activate(bool state)` | state | Wlacza/wylacza animacje (start/stop timera) |
| `strobe()` | -- | Jeden krok animacji -- przesuwa podswietlony segment |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDBusyBar(QWidget *parent, Qt::WFlags f)` | Konstruktor |

## Metody prywatne
| Metoda | Opis |
|--------|------|
| `Update()` | Przelicza pozycje i rozmiar podswietlonego segmentu |

## Pola prywatne
- `QLabel *bar_label` -- podswietlony segment (QLabel z kolorem highlight)
- `int bar_pos` -- biezaca pozycja animacji
- `QTimer *bar_timer` -- timer animacji

## Zachowanie
- Tworzy wewnetrzny QLabel jako podswietlony segment z kolorem palety Highlight.
- `activate(true)` uruchamia timer; `activate(false)` zatrzymuje go i chowa segment.
- `strobe()` (slot timera) przesuwa segment tam i z powrotem wewnatrz ramki.
- Ramka stylizowana jako StyledPanel|Sunken.
