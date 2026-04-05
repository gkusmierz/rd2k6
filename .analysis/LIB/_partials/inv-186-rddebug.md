---
partial_id: 186
artifact: LIB
class_name: RDDebug
header_file: lib/rddebug.h
source_file: lib/rddebug.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDDebug (utility)

## Typ Qt
Plain C++ (global functions)

## Odpowiedzialność (WHAT)
Utility debugowania — RDLogLine (logowanie do syslog), hex dump, timestamp formatting.

## Publiczne API
RDLogLine(), hex dump utilities

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| syslog | Logowanie | HIGH |

## Zależności
Brak
