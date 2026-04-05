---
partial_id: "085"
class: RDSegMeter
source_files:
  - lib/rdsegmeter.h
  - lib/rdsegmeter.cpp
phase: 2
status: done
---

# RDSegMeter

## Rola
Single-channel segmented level meter widget. Renders a bar composed of colored segments indicating audio level. Supports horizontal and vertical orientations, three color zones (low/high/clip), and two display modes (independent, peak-hold).

## Dziedziczenie
- **Bazowa:** QWidget
- **Q_OBJECT:** tak

## Enums
| Enum | Wartosci | Opis |
|------|----------|------|
| `Mode` | Independent=0, Peak=1 | Independent: segmenty reaguja natychmiast; Peak: trzyma szczyty z fadeout |
| `Orientation` | Left=0, Right=1, Up=2, Down=3 | Kierunek rysowania miernika |

## Signals
Brak.

## Public Slots
| Slot | Parametry | Opis |
|------|-----------|------|
| `setSolidBar(int level)` | level | Ustaw poziom ciagly (solid bar) |
| `setFloatingBar(int level)` | level | Ustaw poziom floating bar |
| `setPeakBar(int level)` | level | Ustaw poziom peak bar |

## Private Slots
| Slot | Opis |
|------|------|
| `peakData()` | Timer callback -- obsługuje opadanie szczytu w trybie Peak |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDSegMeter(Orientation o, QWidget *parent=0)` | Konstruktor z orientacja |
| `setRange(int min, int max)` | Zakres wartosci miernika |
| `setDarkLowColor/setDarkHighColor/setDarkClipColor(QColor)` | Kolory segmentow wygaszonych (3 strefy) |
| `setLowColor/setHighColor/setClipColor(QColor)` | Kolory segmentow zapalonych (3 strefy) |
| `setHighThreshold/setClipThreshold(int)` | Progi przejscia miedzy strefami |
| `setSegmentSize/setSegmentGap(int)` | Rozmiar segmentu i przerwa miedzy nimi |
| `mode() / setMode(Mode)` | Tryb pracy (Independent / Peak) |

## Pola prywatne
- `Orientation orient` -- orientacja
- `Mode seg_mode` -- tryb pracy
- `QTimer *peak_timer` -- timer dla trybu Peak
- `int range_min, range_max` -- zakres
- `QColor dark_low_color, dark_high_color, dark_clip_color` -- kolory wygaszone
- `QColor low_color, high_color, clip_color` -- kolory zapalone
- `int high_threshold, clip_threshold` -- progi stref
- `int solid_bar, floating_bar` -- biezace poziomy
- `int seg_size, seg_gap` -- geometria segmentow

## Zachowanie
- Rysuje segmenty od min do max, kolorujac je na podstawie progów (low -> high -> clip).
- Solid bar: ciagly wypelniony pasek do danego poziomu.
- Floating bar: pojedynczy segment na danym poziomie (np. peak indicator).
- W trybie Peak: peak_timer cyklicznie obniza floating_bar, tworzac efekt opadajacego szczytu.
