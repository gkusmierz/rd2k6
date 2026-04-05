---
partial_id: 005
class_name: RDPlayDeck
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDPlayDeck

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `stateChanged(int id, RDPlayDeck::State)` | `stop()` | Gdy deck był Paused — emituje Stopped | Deck przeszedł ze stanu Paused w Stopped |
| `stateChanged(int id, RDPlayDeck::State)` | `stop()` | Gdy deck był w domyślnym stanie | Deck zatrzymany (Stopped) |
| `stateChanged(int id, RDPlayDeck::State)` | `playingData()` (slot CAE) | Po potwierdzeniu startu przez CAE | Deck przeszedł w stan Playing |
| `stateChanged(int id, RDPlayDeck::State)` | `playStoppedData()` (slot CAE) | Gdy `pause_called==true` | Deck przeszedł w stan Paused |
| `stateChanged(int id, RDPlayDeck::State)` | `playStoppedData()` (slot CAE) | Gdy `stop_called==true` | Deck przeszedł w stan Stopped |
| `stateChanged(int id, RDPlayDeck::State)` | `playStoppedData()` (slot CAE) | Gdy ani stop ani pause — naturalne zakończenie | Deck przeszedł w stan Finished |
| `position(int id, int msecs)` | `positionTimerData()` | Co interwał POSITION_INTERVAL; w trybie hook — offset od hook start | Bieżąca pozycja odtwarzania w ms |
| `segueStart(int id)` | `pointTimerData(int)` | Gdy `point==Segue` i punkt dotąd nieaktywny | Punkt segue został osiągnięty (start segue) |
| `segueEnd(int id)` | `pointTimerData(int)` | Gdy `point==Segue` i punkt był aktywny | Koniec okna segue |
| `hookStart(int id)` | `pointTimerData(int)` | Gdy `point==Hook` i punkt dotąd nieaktywny | Punkt hook został osiągnięty |
| `hookEnd(int id)` | `pointTimerData(int)` | Gdy `point==Hook` i punkt był aktywny | Koniec okna hook |
| `talkStart(int id)` | `pointTimerData(int)` | Gdy `point==Talk` i punkt dotąd nieaktywny | Punkt talk-over został osiągnięty |
| `talkEnd(int id)` | `pointTimerData(int)` | Gdy `point==Talk` i punkt był aktywny | Koniec okna talk-over |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `RDCae *play_cae` | `playing(int)` | `playingData(int)` | `lib/rdplay_deck.cpp:53` (konstruktor) |
| `RDCae *play_cae` | `playStopped(int)` | `playStoppedData(int)` | `lib/rdplay_deck.cpp:54` (konstruktor) |
| `QSignalMapper *mapper` | `mapped(int)` | `pointTimerData(int)` | `lib/rdplay_deck.cpp:64` (konstruktor) |
| `QTimer *play_point_timer[i]` | `timeout()` | `mapper->map()` (→ pointTimerData) | `lib/rdplay_deck.cpp:67` (konstruktor, 3 timery) |
| `QTimer *play_position_timer` | `timeout()` | `positionTimerData()` | `lib/rdplay_deck.cpp:71` (konstruktor) |
| `QTimer *play_fade_timer` | `timeout()` | `fadeTimerData()` | `lib/rdplay_deck.cpp:74` (konstruktor) |
| `QTimer *play_stop_timer` | `timeout()` | `stop()` | `lib/rdplay_deck.cpp:76` (konstruktor) |
| `QTimer *play_duck_timer` | `timeout()` | `duckTimerData()` | `lib/rdplay_deck.cpp:78` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)

Sygnały RDPlayDeck są konsumowane przez:

| Sygnał | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane |
|--------|----------|---------------|--------------------|
| `stateChanged(int,RDPlayDeck::State)` | `RDLogPlay` | `playStateChangedData(int,RDPlayDeck::State)` | `lib/rdlogplay.cpp:2105` |
| `position(int,int)` | `RDLogPlay` | `positionData(int,int)` | `lib/rdlogplay.cpp:2107` |
| `segueStart(int)` | `RDLogPlay` | `segueStartData(int)` | `lib/rdlogplay.cpp:2109` |
| `segueEnd(int)` | `RDLogPlay` | `segueEndData(int)` | `lib/rdlogplay.cpp:2111` |
| `talkStart(int)` | `RDLogPlay` | `talkStartData(int)` | `lib/rdlogplay.cpp:2113` |
| `talkEnd(int)` | `RDLogPlay` | `talkEndData(int)` | `lib/rdlogplay.cpp:2115` |
| `stateChanged(int,RDPlayDeck::State)` | `RDCartSlot` | `stateChangedData(int,RDPlayDeck::State)` | `lib/rdcartslot.cpp:80` |
| `position(int,int)` | `RDCartSlot` | `positionData(int,int)` | `lib/rdcartslot.cpp:82` |
| `hookEnd(int)` | `RDCartSlot` | `hookEndData(int)` | `lib/rdcartslot.cpp:84` |
| `stateChanged(int,RDPlayDeck::State)` | `RDCueEdit` | `stateChangedData(int,RDPlayDeck::State)` | `lib/rdcueedit.cpp:184` |
| `position(int,int)` | `RDCueEdit` | `positionData(int,int)` | `lib/rdcueedit.cpp:186` |

## Q_PROPERTY reactive bindings

(brak — projekt Qt4)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| RDCae (IPC) | rdcaed daemon | `play_cae->play()` / `play_cae->stopPlay()` | Zlecenia odtwarzania/zatrzymania do silnika audio przez CAE connection; wyniki wracają przez sygnały `playing()` / `playStopped()` |
