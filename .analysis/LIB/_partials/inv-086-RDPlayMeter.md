---
partial_id: "086"
class: RDPlayMeter
source_files:
  - lib/rdplaymeter.h
  - lib/rdplaymeter.cpp
phase: 2
status: done
---

# RDPlayMeter

## Rola
Labeled audio level meter for playback use. Wraps an RDSegMeter and adds a text label beside it. Used in play-out panels to show channel levels with identifying label.

## Dziedziczenie
- **Bazowa:** RDWidget (custom base widget)
- **Q_OBJECT:** tak

## Kompozycja wewnętrzna
- Zawiera `RDSegMeter *meter` -- wlasciwy miernik segmentowy
- Zawiera `QString meter_label` -- etykieta
- Zawiera `QFont label_font` -- czcionka etykiety

## Signals
Brak.

## Public Slots
| Slot | Parametry | Opis |
|------|-----------|------|
| `setGeometry(int x, int y, int w, int h)` | xywh | Nadpisanie geometrii -- przelicza layout wewnetrzny |
| `setGeometry(QRect &rect)` | rect | j.w. wariant z QRect |
| `setSolidBar(int level)` | level | Deleguje do RDSegMeter::setSolidBar |
| `setFloatingBar(int level)` | level | Deleguje do RDSegMeter::setFloatingBar |
| `setPeakBar(int level)` | level | Deleguje do RDSegMeter::setPeakBar |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDPlayMeter(RDSegMeter::Orientation orient, QWidget *parent=0)` | Konstruktor z orientacja |
| `setRange(int min, int max)` | Deleguje zakres do miernika |
| `setDark*/setLow*/setHigh*/setClip*` | Konfiguracja kolorow (deleguje do RDSegMeter) |
| `setHighThreshold/setClipThreshold(int)` | Progi stref |
| `setSegmentSize/setSegmentGap(int)` | Geometria segmentow |
| `mode() / setMode(RDSegMeter::Mode)` | Tryb pracy |
| `setLabel(QString)` | Ustaw etykiete tekstowa |

## Pola prywatne
- `RDSegMeter *meter` -- wewnetrzny miernik
- `QString meter_label` -- tekst etykiety
- `QFont label_font` -- czcionka
- `RDSegMeter::Orientation orientation` -- orientacja
- `int meter_label_x` -- pozycja X etykiety

## Zachowanie
- Fasada nad RDSegMeter: deleguje wszystkie operacje na poziom do wewnetrznego miernika.
- Dodaje etykiete tekstowa obok miernika (np. nazwa kanalu).
- Przy zmianie geometrii przelicza rozmiar i pozycje wewnetrznego miernika i etykiety.
- `makeFont()` -- dopasowuje rozmiar czcionki do dostepnej przestrzeni.
