---
partial_id: 176
artifact: LIB
class_name: RDTimEvent
header_file: lib/rdtimeevent.h
source_file: lib/rdtimeevent.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTimEvent

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Zdarzenie czasowe — przechowuje czas i callback ID dla RDTimeEngine. Reprezentuje zaplanowany event do odpalenia o danej godzinie.

## Publiczne API
time/setTime, id/setId

## Zależności
RDTimeEngine (konsument)
