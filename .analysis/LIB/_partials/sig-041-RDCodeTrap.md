---
partial_id: 041
class_name: RDCodeTrap
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCodeTrap

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `trapped(int id)` | `scan(const char *buf, int length)` | Gdy sekwencja bajtów w buforze odpowiada zarejestrowanej pułapce (stan automatu `istate == length`) | Wykryto zarejestrowaną sekwencję znaków w strumieniu wejściowym — nadawca rozgłasza ID pułapki |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak — wywołanie przez `scan()` z zewnątrz, nie przez sygnał) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `trapped(int)` | `ripcd/MainObject` (via `ripcd_tty_trap[tty_port]`) | (slot TTY trap handler) | `ripcd/local_macros.cpp:221` |
| `trapped(int)` | `ripcd/MainObject` (via `ripcd_tty_trap[tty_port]`) | (slot TTY trap handler) | `ripcd/local_macros.cpp:891` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — klasa operuje na strumieniach szeregowych/TTY lokalnie w ripcd)
