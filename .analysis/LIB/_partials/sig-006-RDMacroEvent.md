---
partial_id: 006
class_name: RDMacroEvent
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDMacroEvent

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `started()` | `ExecList(int line)` | Gdy `line==0` — uruchomienie listy od początku | Cała lista makr rozpoczęła wykonanie |
| `started(int line)` | `exec(int line)` | Na początku wykonania pojedynczego polecenia | Polecenie RML na pozycji `line` rozpoczęło wykonanie |
| `finished()` | `ExecList()` | Po wykonaniu ostatniego polecenia w liście | Cała lista makr zakończyła wykonanie |
| `finished(int line)` | `exec(int line)` | Po wykonaniu polecenia CC (SendCommand) — sukces | Polecenie RML na pozycji `line` zakończyło wykonanie (CC — sukces) |
| `finished(int line)` | `exec(int line)` | Gdy adres stacji w CC jest nieprawidłowy (null) | Polecenie RML na pozycji `line` zakończyło wykonanie (CC — błąd adresu) |
| `finished(int line)` | `exec(int line)` | Dla wszystkich poleceń domyślnych (nie CC, nie SP) | Polecenie RML na pozycji `line` zostało wysłane przez RIPC |
| `finished(int line)` | `sleepTimerData()` | Po upływie czasu sleep (SP command) | Polecenie SP na pozycji `event_sleeping_line` zakończyło oczekiwanie |
| `stopped()` | `stop()` | Gdy `event_sleep_timer->isActive()` — anulowanie SP | Oczekujący sleep (SP) został przerwany |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer *event_sleep_timer` | `timeout()` | `sleepTimerData()` | `lib/rdmacro_event.cpp:39` (konstruktor wariant 1) |
| `QTimer *event_sleep_timer` | `timeout()` | `sleepTimerData()` | `lib/rdmacro_event.cpp:53` (konstruktor wariant 2) |

## Połączenia wychodzące (klasa jako nadawca connect)

Sygnały RDMacroEvent są konsumowane przez:

| Sygnał | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane |
|--------|----------|---------------|--------------------|
| `started()` | `RDLogPlay` | `macroStartedData()` | `lib/rdlogplay.cpp:113` |
| `finished()` | `RDLogPlay` | `macroFinishedData()` | `lib/rdlogplay.cpp:114` |
| `stopped()` | `RDLogPlay` | `macroStoppedData()` | `lib/rdlogplay.cpp:115` |
| `finished()` | `RDEventPlayer` (przez QSignalMapper) | `macroFinishedData(int)` | `lib/rdevent_player.cpp:55` |

## Q_PROPERTY reactive bindings

(brak — projekt Qt4)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| RDRipc `sendRml()` | Sieć RML / rdripc | `event_ripc->sendRml(...)` | Wysyła polecenie RML do zdalnej stacji (command CC) lub lokalnie przez RIPC |
| RDRipc `sendRml()` | Sieć RML / rdripc | `event_ripc->sendRml(event_cmds[line])` | Wysyła polecenie RML domyślne (nie-CC, nie-SP) przez RIPC |
| QTimer `event_sleep_timer` | lokalne opóźnienie | `start(ms, true)` dla SP (Sleep) | Asynchroniczne opóźnienie w ms — po upływie wznawia wykonanie listy |
