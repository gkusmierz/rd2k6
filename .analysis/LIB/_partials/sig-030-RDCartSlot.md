---
partial_id: 030
class_name: RDCartSlot
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCartSlot

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `tick()` | — | — | Sygnał zadeklarowany, brak bezpośrednich emit w cpp — propagowany przez timer zewnętrzny |
| `buttonFlash(bool state)` | — | — | Zadeklarowany, brak emit w cpp |
| `selectClicked(unsigned cartnum,int row,int col)` | — | — | Zadeklarowany, brak emit w cpp |

> Uwaga: RDCartSlot deklaruje te same sygnały co RDSoundPanel (dzielony interfejs z klasami zarządzającymi playbackiem), ale nie emituje ich samodzielnie — są przewidziane dla zewnętrznych orkiestratorów.

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `slot_deck` (RDPlayDeck) | `stateChanged(int,RDPlayDeck::State)` | `stateChangedData(int,RDPlayDeck::State)` | `rdcartslot.cpp:80` |
| `slot_deck` (RDPlayDeck) | `position(int,int)` | `positionData(int,int)` | `rdcartslot.cpp:82` |
| `slot_deck` (RDPlayDeck) | `hookEnd(int)` | `hookEndData(int)` | `rdcartslot.cpp:84` |
| `slot_cae` (RDCae) | `timescalingSupported(int,bool)` | `timescalingSupportedData(int,bool)` | `rdcartslot.cpp:85` |
| `slot_start_button` (QPushButton) | `clicked()` | `startData()` | `rdcartslot.cpp:95` |
| `slot_box` (RDSlotBox) | `doubleClicked()` | `doubleClickedData()` | `rdcartslot.cpp:107` |
| `slot_box` (RDSlotBox) | `cartDropped(unsigned)` | `cartDroppedData(unsigned)` | `rdcartslot.cpp:108` |
| `slot_load_button` (QPushButton) | `clicked()` | `loadData()` | `rdcartslot.cpp:119` |
| `slot_options_button` (QPushButton) | `clicked()` | `optionsData()` | `rdcartslot.cpp:129` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak — klasa nie jest źródłem zewnętrznych connect()) | — | — | — |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| `slot_cae` (RDCae) | rdcae daemon | `timescalingSupported` / play/stop commands | Komunikacja z CAE przez gniazdo |
| `slot_ripc` (RDRipc) | ripcd daemon | `onairFlag()` odczyt | Stan on-air przy logowaniu trafficu |
