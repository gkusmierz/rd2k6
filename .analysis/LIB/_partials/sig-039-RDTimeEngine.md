---
partial_id: 039
class_name: RDTimeEngine
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDTimeEngine

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `timeout(int id)` | `EmitEvents(int offset)` | Gdy zaplanowane zdarzenie czasowe osiągnie swój moment (iteracja wsteczna po liście zdarzeń w danym "offset") | Wystrzelenie timera zaplanowanego zdarzenia — nadawca rozgłasza ID zdarzenia |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer* engine_timer` (wewnętrzny) | `timeout()` | `timerData()` | `lib/rdtimeengine.cpp:31` (konstruktor `RDTimeEngine`) |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `timeout(int)` | `rdcatchd/MainObject` (`catch_engine`) | `engineData(int)` | `rdcatchd/rdcatchd.cpp:358` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — klasa jest czysto in-process)
