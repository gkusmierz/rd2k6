---
partial_id: 148
artifact: LIB
class_name: RDCmdCache
header_file: lib/rdcmd_cache.h
source_file: lib/rdcmd_cache.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCmdCache

## Typ Qt
Plain C++ (Collection)

## Odpowiedzialność (WHAT)
Cache kolejki komend — przechowuje listę komend (stringów) w buforze FIFO. Używany do buforowania komend IPC gdy połączenie nie jest gotowe.

## Publiczne API
load, append, command(n), quantity, clear

## Zależności
Brak
