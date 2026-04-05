---
partial_id: "082"
class: RDMarkerBar
source: lib/rdmarker_bar.h, lib/rdmarker_bar.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDMarkerBar

## Rola
Pasek wizualizacji markerów audio dla widgetu RDCueEdit. Wyświetla graficznie pozycje trzech markerów (Play, Start, End) na osi czasu. Renderuje się jako kolorowy pasek z zaznaczonymi punktami.

## Hierarchia
- **Dziedziczy z:** QLabel
- **Brak kompozycji** — samodzielny widget wizualizacyjny

## Enum
| Enum | Wartości | Opis |
|------|----------|------|
| `Marker` | Play=0, Start=1, End=2, MaxSize=3 | Typy markerów (3 pozycje) |

## Konstruktor
```
RDMarkerBar(QWidget *parent=0)
```

## Sygnały
Brak zadeklarowanych sygnałów.

## Sloty publiczne
| Slot | Opis |
|------|------|
| `length() -> int` | Zwraca długość audio w ms |
| `setLength(int msecs)` | Ustawia długość audio w ms (zakres osi) |
| `marker(Marker) -> int` | Zwraca pozycję markera w ms |
| `setMarker(Marker, int msecs)` | Ustawia pozycję markera i odświeża widok |

## Metody publiczne
| Metoda | Opis |
|--------|------|
| `sizeHint() -> QSize` | Preferowany rozmiar |
| `sizePolicy() -> QSizePolicy` | Polityka rozmiaru |

## Metody prywatne
| Metoda | Opis |
|--------|------|
| `DrawMap()` | Renderowanie mapy bitowej paska z markerami |

## Stan wewnętrzny
- `marker_pos[MaxSize]` — pozycje 3 markerów w ms
- `marker_length` — całkowita długość audio w ms

## Zależności
- **QLabel** — klasa bazowa (wyświetlanie piksmap)
- **rd.h** — stałe systemowe Rivendell
