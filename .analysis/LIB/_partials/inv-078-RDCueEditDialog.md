---
partial_id: "078"
class: RDCueEditDialog
source: lib/rdcueeditdialog.h, lib/rdcueeditdialog.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDCueEditDialog

## Rola
Modalne okno dialogowe opakowujące widget RDCueEdit. Zapewnia standardowy interfejs OK/Cancel do edycji cue pointów dla danej linii logu (RDLogLine). Używany w różnych częściach systemu, gdy użytkownik chce szybko ustawić markery Start/End.

## Hierarchia
- **Dziedziczy z:** RDDialog
- **Zawiera:** RDCueEdit (główny widget edycji)

## Konstruktor
```
RDCueEditDialog(RDCae *cae, int play_card, int play_port,
                const QString &caption, QWidget *parent=0)
```
Wymaga silnika audio (RDCae), karty/portu dźwiękowego i tytułu okna.

## Sygnały
Brak zadeklarowanych sygnałów.

## Sloty publiczne
| Slot | Opis |
|------|------|
| `exec(RDLogLine*) -> int` | Otwiera dialog modalnie dla danej linii logu, zwraca QDialog::Accepted/Rejected |

## Sloty prywatne
| Slot | Opis |
|------|------|
| `okData()` | Obsługa kliknięcia OK — zatwierdzenie zmian |
| `cancelData()` | Obsługa kliknięcia Cancel — odrzucenie zmian |

## Metody publiczne
| Metoda | Opis |
|--------|------|
| `sizeHint() -> QSize` | Preferowany rozmiar dialogu |
| `sizePolicy() -> QSizePolicy` | Polityka rozmiaru |

## Stan wewnętrzny
- `edit_logline` — wskaźnik na edytowaną linię logu
- `cue_edit` — osadzony widget RDCueEdit

## Zależności
- **RDCueEdit** — widget edycji cue pointów (kompozycja)
- **RDCae** — silnik audio (przekazywany dalej)
- **RDLogLine** — dane linii logu
- **RDDialog** — bazowa klasa dialogów Rivendell
