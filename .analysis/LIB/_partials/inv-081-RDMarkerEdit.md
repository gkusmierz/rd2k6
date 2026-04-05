---
partial_id: "081"
class: RDMarkerEdit
source: lib/rdmarker_edit.h, lib/rdmarker_edit.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDMarkerEdit

## Rola
Specjalizowane pole tekstowe (QLineEdit) do edycji wartości markerów audio. Przechwytuje klawisz Escape i emituje sygnał `escapePressed()`, co pozwala anulować edycję markera bez zatwierdzania. Używany w RDEditAudio jako pole wejściowe dla każdego z 11 typów markerów oraz dla wartości gainu.

## Hierarchia
- **Dziedziczy z:** QLineEdit
- **Brak kompozycji** — minimalistyczny widget

## Konstruktory
```
RDMarkerEdit(QWidget *parent)
RDMarkerEdit(const QString &contents, QWidget *parent)
```

## Sygnały
| Sygnał | Opis |
|--------|------|
| `escapePressed()` | Emitowany gdy użytkownik naciśnie Escape w polu edycji |

## Sloty
Brak zadeklarowanych slotów.

## Zdarzenia
- `keyPressEvent(QKeyEvent*)` — przechwytuje Escape i emituje `escapePressed()`, pozostałe klawisze przekazuje do QLineEdit

## Zależności
- **QLineEdit** — klasa bazowa
