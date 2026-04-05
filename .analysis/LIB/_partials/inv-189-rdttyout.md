---
partial_id: 189
artifact: LIB
class_name: RDTtyOut
header_file: lib/rdttyout.h
source_file: lib/rdttyout.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTtyOut

## Typ Qt
Plain C++ (Utility)

## Odpowiedzialność (WHAT)
Wysyłanie danych na port szeregowy (TTY output) — otwiera urządzenie /dev/ttyS*, konfiguruje baud rate, wysyła dane. Używane do sterowania urządzeniami przez RS-232.

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| /dev/ttyS* | Port szeregowy | CRITICAL |
| termios | Konfiguracja portu | CRITICAL |

## Zależności
POSIX termios
