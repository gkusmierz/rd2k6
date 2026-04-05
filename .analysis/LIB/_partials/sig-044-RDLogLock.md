---
partial_id: 044
class_name: RDLogLock
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDLogLock

## Sygnały emitowane (klasa jako nadawca)

(no signals declared — klasa nie deklaruje sekcji `signals:` w nagłówku `lib/rdloglock.h`)

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer* lock_timer` (wewnętrzny) | `timeout()` | `updateLock()` | `lib/rdloglock.cpp:40` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)

(none — klasa nie definiuje żadnych connect() kierujących na zewnętrznych odbiorców)

## Zachowanie wewnętrzne

Slot `updateLock()` wywołuje statyczną `RDLogLock::updateLock(lock_log_name, lock_guid)` — odnawia blokadę edycji logu w DB w regularnych odstępach (`RD_LOG_LOCK_TIMEOUT / 2`). Timer startuje przy udanym `tryLock()`.

## Instancje w projekcie (wybrane)

| Miejsce tworzenia | Kontekst |
|-------------------|----------|
| `rdlogedit/edit_log.cpp:122` | Blokada edycji logu w rdlogedit |
| `rdlogedit/voice_tracker.cpp:234` | Blokada logu podczas śledzenia głosowego |
| `rdairplay/list_logs.cpp:177` | Blokada logu przy ładowaniu w rdairplay |
| `lib/rdsvc.cpp:829,838,931,1128` | Wewnętrzne blokady podczas generowania/linkowania logu |
| `utils/rdclilogedit/operations.cpp:110,244,380` | Blokady w narzędziu CLI |
| Statyczne API: `makeGuid`, `tryLock`, `clearLock`, `updateLock`, `validateLock` używane też przez `web/rdxport/logs.cpp` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — blokada jest realizowana przez wpisy w bazie MySQL, nie przez sygnały Qt)
