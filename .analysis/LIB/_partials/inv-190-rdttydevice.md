---
partial_id: 190
artifact: LIB
class_name: RDTtyDevice
header_file: lib/rdttydevice.h
source_file: lib/rdttydevice.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTtyDevice

## Typ Qt
QIODevice derivative

## Odpowiedzialność (WHAT)
Urządzenie TTY jako QIODevice — umożliwia użycie portu szeregowego z Qt I/O framework (read/write/open/close). Wrapper wokół POSIX termios z Qt interface.

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| /dev/ttyS* | Port szeregowy | CRITICAL |
| termios/POSIX | Konfiguracja | CRITICAL |

## Zależności
POSIX termios
