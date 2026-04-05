---
partial_id: "077"
class: RDCueEdit
source: lib/rdcueedit.h, lib/rdcueedit.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDCueEdit

## Rola
Widget edytora cue pointów dla zdarzeń opartych na RDLogLine. Umożliwia ustawienie pozycji Start i End w ramach audio, audycję (podgląd dźwiękowy) wybranego fragmentu, oraz kontrolę odtwarzania ze sliderem pozycji. Używany wewnątrz RDCueEditDialog.

## Hierarchia
- **Dziedziczy z:** RDWidget
- **Zawiera:** RDPlayDeck, RDSlider, RDMarkerBar, RDMarkerEdit (przyciski start/end), RDTransportButton (audition/pause/stop), RDEventPlayer, QTimer

## Konstruktor
```
RDCueEdit(QWidget *parent=0)
```

## Sygnały
Brak zadeklarowanych sygnałów.

## Sloty publiczne
| Slot | Opis |
|------|------|
| `recue()` | Powrót do pozycji początkowej (re-cue) |

## Sloty prywatne
| Slot | Opis |
|------|------|
| `sliderPressedData()` | Reakcja na naciśnięcie slidera |
| `sliderReleasedData()` | Reakcja na puszczenie slidera |
| `sliderChangedData(int pos)` | Zmiana pozycji slidera |
| `auditionButtonData()` | Kliknięcie przycisku audycji (play) |
| `pauseButtonData()` | Kliknięcie przycisku pauzy |
| `stopButtonData()` | Kliknięcie przycisku stop |
| `stateChangedData(int id, RDPlayDeck::State state)` | Zmiana stanu odtwarzacza |
| `positionData(int id, int msecs)` | Aktualizacja pozycji odtwarzania |
| `startClickedData()` | Ustawienie markera Start na bieżącą pozycję |
| `endClickedData()` | Ustawienie markera End na bieżącą pozycję |
| `auditionTimerData()` | Timer audycji (timeout odtwarzania) |

## Metody publiczne
| Metoda | Opis |
|--------|------|
| `sizeHint() -> QSize` | Preferowany rozmiar widgetu |
| `sizePolicy() -> QSizePolicy` | Polityka rozmiaru |
| `setRml(RDEventPlayer*, QString start, QString stop)` | Ustawia komendy RML start/stop |
| `initialize(RDLogLine*) -> bool` | Inicjalizuje edytor danymi z linii logu |
| `playPosition(RDMarkerBar::Marker) -> unsigned` | Zwraca pozycję markera w ms |
| `stop()` | Zatrzymuje odtwarzanie |

## Metody prywatne
| Metoda | Opis |
|--------|------|
| `SetStartMode(bool)` | Przełącza tryb edycji markera Start |
| `SetEndMode(bool)` | Przełącza tryb edycji markera End |
| `Playing(int id)` | Obsługa stanu Playing |
| `Paused(int id)` | Obsługa stanu Paused |
| `Stopped(int id)` | Obsługa stanu Stopped |
| `UpdateCounters()` | Aktualizacja wyświetlaczy czasu |
| `ClearChannel()` | Czyszczenie kanału audio |

## Obsługa zdarzeń
- `wheelEvent` — scroll kółkiem myszy (zmiana pozycji)
- `mousePressEvent` — kliknięcie myszy
- `keyPressEvent` / `keyReleaseEvent` — obsługa klawiatury (Shift do przełączania trybu)

## Stan wewnętrzny
- `edit_logline` — wskaźnik na aktualną linię logu
- `edit_play_deck` — deck odtwarzania
- `edit_slider` — slider pozycji (RDSlider)
- `edit_position_bar` — pasek markerów (RDMarkerBar)
- `edit_start_pos` — pozycja Start w ms
- `edit_slider_pressed` — czy slider jest trzymany
- `edit_shift_pressed` — czy Shift wciśnięty
- `edit_right_click_stop` — prawy klik zatrzymuje

## Zależności
- **RDPlayDeck** — deck audio do odtwarzania
- **RDSlider** — slider pozycji
- **RDMarkerBar** — wizualizacja markerów
- **RDTransportButton** — przyciski transportowe
- **RDEventPlayer** — obsługa komend RML
- **RDLogLine** — dane linii logu (źródło audio)
