---
partial_id: sig-001
class_name: RDCae
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCae

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `isConnected(bool state)` | `DispatchCommand()` (~rdcae.cpp:497,500) | PW response: `+` = true, else false | Odpowiedź na uwierzytelnienie hasłem z caed — powiadamia czy połączenie zostało zaakceptowane |
| `playing(int handle)` | `DispatchCommand()` (~rdcae.cpp:548) | PY response z `+` | caed potwierdził start odtwarzania strumienia |
| `playStopped(int handle)` | `DispatchCommand()` (~rdcae.cpp:554) | SP response z `+` | caed potwierdził zatrzymanie odtwarzania |
| `playPositioned(int handle, unsigned pos)` | `DispatchCommand()` (~rdcae.cpp:542) | PP response z `+` | Odtwarzanie zostało pozycjonowane na wskazanej pozycji |
| `playPositionChanged(int handle, unsigned sample)` | `clockData()` (~rdcae.cpp:474) | Pozycja strumienia różni się od poprzedniej | Taktujący update pozycji odtwarzania (tick-driven) |
| `playUnloaded(int handle)` | `DispatchCommand()` (~rdcae.cpp:527) | UP response z `+` | Strumień odtwarzania został wyładowany z caed |
| `timescalingSupported(int card, bool state)` | `DispatchCommand()` (~rdcae.cpp:561,564) | TS response: `+` = true, else false | karta dźwiękowa obsługuje (lub nie) timescaling |
| `recordLoaded(int card, int stream)` | `DispatchCommand()` (~rdcae.cpp:571) | LR response z `+` | Strumień nagrywania załadowany w caed |
| `recordUnloaded(int card, int stream, unsigned msecs)` | `DispatchCommand()` (~rdcae.cpp:577) | UR response z `+` | Strumień nagrywania wyładowany; msecs = czas trwania |
| `recording(int card, int stream)` | `DispatchCommand()` (~rdcae.cpp:587) | RS response z `+` | Nagrywanie faktycznie się rozpoczęło |
| `recordStopped(int card, int stream)` | `DispatchCommand()` (~rdcae.cpp:593) | SR response z `+` | Nagrywanie zatrzymane |
| `inputStatusChanged(int card, int stream, bool state)` | `DispatchCommand()` (~rdcae.cpp:600,607) | IS response: `0` = false, `1` = true | Status wejścia audio zmienił się (np. brak sygnału / sygnał) |

**Sygnały zadeklarowane w nagłówku, ale nieemitowane w rdcae.cpp:**
- `playLoaded(int handle)` — brak `emit` w kodzie; LP response loguje błąd i wywołuje `unloadPlay()` zamiast emitować sygnał
- `gpiInputChanged(int line, bool state)` — zadeklarowany, lecz nieemitowany (GPI w tym kliencie nie jest obsługiwane)
- `connected(bool state)` — zadeklarowany lecz nieemitowany w RDCae; używany przez RDRipc (inna klasa)

## Połączenia przychodzące (klasa jako odbiorca)

RDCae nie posiada sygnałów Qt emitowanych przez inne klasy połączonych ze swoimi slotami z zewnątrz.
Wewnętrzne private sloty są podłączone tylko do wewnętrznych timerów/socketów (patrz sekcja poniżej).

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer` (wewnętrzny) | `timeout()` | `clockData()` | rdcae.cpp:95 — konstruktor RDCae |
| `QTimer` (wewnętrzny, poll) | `timeout()` | `readyData()` | rdcae.cpp:111 — metoda `connectToServer()` |

## Połączenia wychodzące (klasa jako nadawca connect)

RDCae sam ustanawia connect() tylko do swoich własnych prywatnych slotów:

| Sygnał (nadawca) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-----------------|---------|--------------|------------------------------|
| `QTimer::timeout()` | `this` (RDCae) | `clockData()` | rdcae.cpp:95 |
| `QTimer::timeout()` | `this` (RDCae) | `readyData()` | rdcae.cpp:111 |

## Połączenia zewnętrzne — kto podłącza się do sygnałów RDCae

| Subscriber (klasa) | Sygnał RDCae | Slot subskrybenta | Lokalizacja connect() |
|-------------------|-------------|------------------|----------------------|
| `RDEditAudio` | `playing(int)` | `playedData(int)` | rdedit_audio.cpp:91 |
| `RDEditAudio` | `playStopped(int)` | `pausedData(int)` | rdedit_audio.cpp:92 |
| `RDEditAudio` | `playPositionChanged(int,unsigned)` | `positionData(int,unsigned)` | rdedit_audio.cpp:93 |
| `RDPlayDeck` | `playing(int)` | `playingData(int)` | rdplay_deck.cpp:53 |
| `RDPlayDeck` | `playStopped(int)` | `playStoppedData(int)` | rdplay_deck.cpp:54 |
| `RDSimplePlayer` | `playing(int)` | `playingData(int)` | rdsimpleplayer.cpp:45 |
| `RDSimplePlayer` | `playStopped(int)` | `playStoppedData(int)` | rdsimpleplayer.cpp:46 |
| `RDLogPlay` | `timescalingSupported(int,bool)` | `timescalingSupportedData(int,bool)` | rdlogplay.cpp:120 |
| `RDSoundPanel` | `timescalingSupported(int,bool)` | `timescalingSupportedData(int,bool)` | rdsound_panel.cpp:190 |
| `RDCartSlot` | `timescalingSupported(int,bool)` | `timescalingSupportedData(int,bool)` | rdcartslot.cpp:85 |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| TCP socket (`Q3SocketDevice`) | `caed` daemon (Core Audio Engine) | `connectToServer(RDStation*, RDConfig*)` | Nawiązanie połączenia z caed na porcie `CAED_TCP_PORT`; komunikacja poleceniami tekstowymi kończącymi się `!` |
| TCP polling (timer 10ms) | `caed` | `readyData()` slot | Odczyt odpowiedzi z caed i dispatch do `DispatchCommand()` |
| UDP socket (`Q3SocketDevice`) | `caed` meter port | `UpdateMeters()` | Odbiór danych poziomów audio (VU metery) z portu UDP `cae_meter_base_port + card*10 + port` |
| Protokół binarny → sygnały Qt | wewnętrznie | `DispatchCommand(RDCmdCache*)` | Tłumaczenie odpowiedzi protokołu CAE (PW/LP/UP/PP/PY/SP/TS/LR/UR/RS/SR/IS) na sygnały Qt |
