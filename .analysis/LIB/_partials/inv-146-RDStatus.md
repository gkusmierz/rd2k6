---
partial_id: 146
artifact: LIB
class_name: RDStatus
header_file: lib/rdstatus.h
source_file: lib/rdstatus.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDStatus

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Status komponentu systemu — przechowuje stan (Idle/Active/Error) z opisem. Używany do raportowania stanu daemon'ów i podsystemów.

## Publiczne API
Gettery/settery: station, cardNumber, streamNumber, state, description

## Zależności
Brak
