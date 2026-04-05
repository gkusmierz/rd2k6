---
partial_id: 033
class_name: RDSimplePlayer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDSimplePlayer

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `played()` | `playingData(int handle)` | gdy handle pasuje do ostatniego w kolejce | Odtwarzanie koszyka/cięcia faktycznie się rozpoczęło |
| `stopped()` | `playStoppedData(int handle)` | gdy handle pasuje do ostatniego w kolejce | Odtwarzanie zakończyło się (naturalnie lub przez stop()) |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `play_cae` (RDCae) | `playing(int)` | `playingData(int)` | `rdsimpleplayer.cpp:45` |
| `play_cae` (RDCae) | `playStopped(int)` | `playStoppedData(int)` | `rdsimpleplayer.cpp:46` |
| `play_start_button` (RDTransportButton) | `clicked()` | `play()` | `rdsimpleplayer.cpp:58` |
| `play_stop_button` (RDTransportButton) | `clicked()` | `stop()` | `rdsimpleplayer.cpp:66` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `played()` | `RDLogPlay` | `auditionHeadData()` | `rdlogplay.cpp:143` |
| `stopped()` | `RDLogPlay` | `auditionTailData()` | `rdlogplay.cpp:145` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| `play_cae` (RDCae) | rdcae daemon | `loadPlay` / `play` / `stopPlay` commands | Sterowanie odtwarzaniem przez gniazdo CAE |
| `play_event_player` | ripcd | exec RML | Wykonanie makra RML przy start/stop |
