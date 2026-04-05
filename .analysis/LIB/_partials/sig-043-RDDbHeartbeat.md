---
partial_id: 043
class_name: RDDbHeartbeat
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDDbHeartbeat

## Sygnały emitowane (klasa jako nadawca)

(no signals declared — klasa nie deklaruje sekcji `signals:` w nagłówku `lib/rddbheartbeat.h`)

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer* timer` (wewnętrzny, lokalny w konstruktorze) | `timeout()` | `intervalTimeoutData()` | `lib/rddbheartbeat.cpp:28` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)

(none — klasa nie definiuje żadnych connect() kierujących na zewnętrznych odbiorców)

## Zachowanie wewnętrzne

`intervalTimeoutData()` wykonuje `SELECT DB FROM VERSION` — podtrzymanie połączenia MySQL przez aktywność SQL w regularnych odstępach (`interval * 1000 ms`). Wywoływana też natychmiast w konstruktorze przed startem timera.

## Instancje w projekcie

| Miejsce tworzenia | Parametr `interval` | Uwagi |
|-------------------|---------------------|-------|
| `lib/rdapplication.cpp:193` | `app_config->mysqlHeartbeatInterval()` | Standardowa instancja w `RDApplication` |
| `lib/rddb.cpp:180` | `config->mysqlHeartbeatInterval()` | Instancja przy połączeniu DB (bez `parent`) |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — klasa działa wyłącznie lokalnie w procesie, podtrzymując połączenie MySQL)
