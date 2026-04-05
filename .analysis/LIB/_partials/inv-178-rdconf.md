---
partial_id: 178
artifact: LIB
class_name: RDConf
header_file: lib/rdconf.h
source_file: lib/rdconf.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDConf (utility functions)

## Typ Qt
Plain C++ (global functions — nie klasa)

## Odpowiedzialność (WHAT)
Zbiór globalnych utility: RDGetTimeLength() (konwersja ms→string "HH:MM:SS.t"), RDSetTimeLength() (string→ms), RDGetPathPart/RDGetBasePart (parsowanie ścieżek), RDEscapeString (SQL escaping), RDCheckDaemon (sprawdzanie procesu).

## Publiczne API
RDGetTimeLength(), RDSetTimeLength(), RDGetPathPart(), RDGetBasePart(), RDEscapeString(), RDCheckDaemon()

## Zależności
Brak
