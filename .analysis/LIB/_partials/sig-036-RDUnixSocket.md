---
partial_id: 036
class_name: RDUnixSocket
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDUnixSocket

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| (brak zadeklarowanych sygnałów Qt) | — | — | Klasa nie deklaruje własnych sygnałów — dziedziczy z QTcpSocket |

> Uwaga: RDUnixSocket dziedziczy z QTcpSocket. Używa standardowych sygnałów Qt (connected, disconnected, readyRead itp.) odziedziczonych z QTcpSocket. Klasa dostarcza tylko dwie metody: `connectToPathname()` i `connectToAbstract()` — obie zwracają false (stub/niezaimplementowane?).

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak wewnętrznych connect w cpp — klasa to cienki wrapper) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (standardowe sygnały QTcpSocket) | `RDLogPlay` i inne | zależnie od kontekstu użycia | `lib/rdlogplay.cpp:79` (connectToAbstract do rdpadd) |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| UNIX abstract socket | rdpadd | `connectToAbstract(RD_PAD_SOURCE_UNIX_ADDRESS)` | Połączenie klienta z PAD source server przez abstract namespace |
