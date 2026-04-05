---
partial_id: 55
class_name: RDCueEdit
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCueEdit

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| (brak — klasa nie deklaruje własnych sygnałów; nagłówek nie zawiera sekcji `signals:`) | — | — | — |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `edit_slider` (RDSlider) | `sliderMoved(int)` | `sliderChangedData(int)` | `lib/rdcueedit.cpp:77` |
| `edit_slider` (RDSlider) | `sliderPressed()` | `sliderPressedData()` | `lib/rdcueedit.cpp:79` |
| `edit_slider` (RDSlider) | `sliderReleased()` | `sliderReleasedData()` | `lib/rdcueedit.cpp:80` |
| `edit_audition_button` (RDTransportButton) | `clicked()` | `auditionButtonData()` | `lib/rdcueedit.cpp:104` |
| `edit_pause_button` (RDTransportButton) | `clicked()` | `pauseButtonData()` | `lib/rdcueedit.cpp:117` |
| `edit_stop_button` (RDTransportButton) | `clicked()` | `stopButtonData()` | `lib/rdcueedit.cpp:130` |
| `edit_start_button` (QPushButton) | `clicked()` | `startClickedData()` | `lib/rdcueedit.cpp:144` |
| `edit_end_button` (QPushButton) | `clicked()` | `endClickedData()` | `lib/rdcueedit.cpp:158` |
| `edit_recue_button` (QPushButton) | `clicked()` | `recue()` | `lib/rdcueedit.cpp:172` |
| `edit_audition_timer` (QTimer) | `timeout()` | `auditionTimerData()` | `lib/rdcueedit.cpp:178` |
| `edit_play_deck` (RDPlayDeck) | `stateChanged(int, RDPlayDeck::State)` | `stateChangedData(int, RDPlayDeck::State)` | `lib/rdcueedit.cpp:184` |
| `edit_play_deck` (RDPlayDeck) | `position(int, int)` | `positionData(int, int)` | `lib/rdcueedit.cpp:186` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak — RDCueEdit jest terminalnym konsumentem, nie emituje własnych sygnałów) | — | — | — |

## Uwagi

RDCueEdit jest złożonym widgetem audycji cue (start/end marker editing + playback). Używany przez:
- `lib/rdcueeditdialog.cpp` — dialog wrapper (użyty przez rdcartslots i rdairplay/edit_event)
- `rdairplay/edit_event.cpp` — bezpośrednio jako edit_cue_edit

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
