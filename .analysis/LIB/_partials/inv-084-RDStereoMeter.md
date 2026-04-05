---
partial_id: "084"
class: RDStereoMeter
source_files:
  - lib/rdstereometer.h
  - lib/rdstereometer.cpp
phase: 2
status: done
---

# RDStereoMeter

## Rola
Stereo audio level meter widget. Displays two side-by-side segmented meters (left/right channels) with a label, reference level adjustment, and clip indicator light.

## Dziedziczenie
- **Bazowa:** QWidget
- **Q_OBJECT:** tak

## Kompozycja wewnętrzna
- Zawiera dwa `RDSegMeter*` (left_meter, right_meter) -- deleguje wyswietlanie poziomow do nich.

## Enums
Brak wlasnych. Uzywa `RDSegMeter::Mode` (Independent / Peak).

## Signals
| Signal | Parametry | Opis |
|--------|-----------|------|
| `clip()` | -- | Emitowany gdy poziom lewego kanalu osiagnie prog clip |

## Public Slots
| Slot | Parametry | Opis |
|------|-----------|------|
| `setLeftSolidBar(int level)` | level (dBFS) | Ustaw poziom solid bar lewego kanalu |
| `setRightSolidBar(int level)` | level (dBFS) | Ustaw poziom solid bar prawego kanalu |
| `setLeftFloatingBar(int level)` | level | Ustaw floating bar lewego kanalu |
| `setRightFloatingBar(int level)` | level | Ustaw floating bar prawego kanalu |
| `setLeftPeakBar(int level)` | level | Ustaw peak bar lewego kanalu |
| `setRightPeakBar(int level)` | level | Ustaw peak bar prawego kanalu |
| `resetClipLight()` | -- | Resetuj wskaznik clip |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDStereoMeter(QWidget *parent=0)` | Konstruktor -- tworzy 2 RDSegMetery |
| `setReference(int level)` | Ustaw poziom referencyjny (offset stosowany do wartosci) |
| `setClipLight(int level)` | Ustaw prog zapalania lampki clip |
| `setDarkLowColor/setDarkHighColor/setDarkClipColor(QColor)` | Kolory segmentow wygaszonych |
| `setLowColor/setHighColor/setClipColor(QColor)` | Kolory segmentow zapalonych |
| `setHighThreshold/setClipThreshold(int)` | Progi przejscia kolorow |
| `setSegmentSize/setSegmentGap(int)` | Rozmiar i przerwa miedzy segmentami |
| `setLabel(QString)` | Etykieta tekstowa miernika |
| `mode() / setMode(RDSegMeter::Mode)` | Tryb: Independent albo Peak |

## Pola prywatne
- `RDSegMeter *left_meter, *right_meter` -- dwa mierniki segmentowe
- `int ref_level` -- poziom referencyjny (offset)
- `int clip_light_level` -- prog clip light
- `bool clip_light_on` -- stan lampki clip
- `int label_x` -- pozycja X etykiety
- `QString meter_label` -- tekst etykiety
- `QFont meter_label_font, meter_scale_font` -- czcionki

## Zachowanie
- Poziomy solid bar sa korygowane o `ref_level` przed przekazaniem do RDSegMeter.
- Gdy poziom lewego kanalu >= 0 dBFS, zapala clip light i emituje signal `clip()`.
- `resetClipLight()` gasi lampke clip.
- Malowanie (`paintEvent`) rysuje etykiete, skale i lampke clip obok dwoch miernikow.
