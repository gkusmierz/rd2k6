---
partial_id: "087"
class: RDSlider
source_files:
  - lib/rdslider.h
  - lib/rdslider.cpp
phase: 2
status: done
---

# RDSlider

## Rola
Custom slider widget (replacement for QSlider). Provides a draggable knob with configurable orientation, color, tick marks, page/line stepping, and value tracking.

## Dziedziczenie
- **Bazowe:** QWidget, Q3RangeControl (dual inheritance -- widget + range value management)
- **Q_OBJECT:** tak

## Enums
| Enum | Wartosci | Opis |
|------|----------|------|
| `TickSetting` | NoTicks=0, TicksLeft=1, TicksRight=2, TicksAbove=3, TicksBelow=4, TicksBothSides=5 | Pozycja znacznikow skali |
| `Orientation` | Left=0, Right=1, Up=2, Down=3 | Kierunek slidera |

## Signals
| Signal | Parametry | Opis |
|--------|-----------|------|
| `valueChanged(int value)` | value | Emitowany gdy wartosc slidera sie zmieni |
| `sliderPressed()` | -- | Emitowany przy nacisnieciu knoba |
| `sliderMoved(int value)` | value | Emitowany podczas przesuwania knoba |
| `sliderReleased()` | -- | Emitowany przy puszczeniu knoba |

## Public Slots
| Slot | Parametry | Opis |
|------|-----------|------|
| `setGeometry(int x, int y, int w, int h)` | xywh | Nadpisanie geometrii |
| `setGeometry(QRect &rect)` | rect | j.w. |
| `setValue(int value)` | value | Ustaw wartosc slidera programowo |
| `addStep()` | -- | Zwieksz wartosc o line step |
| `subtractStep()` | -- | Zmniejsz wartosc o line step |

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDSlider(QWidget *parent)` | Konstruktor domyslny |
| `RDSlider(Orientation orient, QWidget *parent)` | Konstruktor z orientacja |
| `RDSlider(int min, int max, int pageStep, int value, Orientation, QWidget*)` | Pelny konstruktor |
| `orientation() / setOrientation(Orientation)` | Orientacja slidera |
| `setTracking(bool) / tracking()` | Tracking: emituj valueChanged podczas przesuwania |
| `setTickInterval(int)` | Odleglosc miedzy tickami |
| `setTickmarks(TickSetting)` | Pozycja tickow |
| `setMinValue/setMaxValue/setRange(int,int)` | Zakres wartosci |
| `setLineStep/setPageStep(int)` | Kroki line/page |
| `setKnobColor(QColor) / setKnobColor(QPalette::ColorRole,QColor)` | Kolor uchwytu |
| `setKnobSize(int) / setKnobSize(int,int)` | Rozmiar uchwytu |

## Pola prywatne
- `Orientation rdslider_orient` -- biezaca orientacja
- `QColor knob_color` -- kolor uchwytu
- `QRect curr_knob, prev_knob` -- biezaca/poprzednia pozycja uchwytu
- `QRect page_up, page_down` -- strefy page up/down
- `QSize knob_size` -- rozmiar uchwytu
- `QPixmap *knob_map` -- pixmapa uchwytu
- `int base_x, base_y` -- pozycja bazowa
- `bool rdslider_moving` -- czy uchwyt jest przesuwany
- `int page_step, line_step` -- kroki
- `bool tracking_enabled` -- czy tracking wlaczony
- `bool deferred_change` -- czy jest odlozony sygnal zmiany
- `int tick_interval` -- interwaly tickow
- `TickSetting tick_setting` -- ustawienie tickow

## Zachowanie
- Rysuje track (szyne) i knob (uchwyt) w paintEvent.
- Obsluguje mouse events: press na knob zaczyna drag, move aktualizuje pozycje, release konczy.
- Click poza knobem: page up/page down w zaleznosci od strony klikniecia.
- Tracking: gdy wlaczony, emituje valueChanged podczas kazdego ruchu; gdy wylaczony -- dopiero przy release.
- `calcKnob()` przelicza pozycje knoba z wartosci i odwrotnie.
