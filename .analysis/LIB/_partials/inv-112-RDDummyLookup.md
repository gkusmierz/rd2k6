---
partial_id: 112
artifact: LIB
class_name: RDDummyLookup
header_file: lib/rddummylookup.h
source_file: lib/rddummylookup.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDDummyLookup

## Typ Qt
Dialog (dziedziczy RDDiscLookup)

## Odpowiedzialność (WHAT)
Stub/null implementacja disc lookup — używana gdy żaden serwis lookup nie jest skonfigurowany. Natychmiast zwraca pusty wynik.

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| lookupRecord() | Natychmiast zwraca — brak lookup |

## Reguły biznesowe
- Wzorzec Null Object — zapobiega null checks w kodzie wywołującym

## Zależności
RDDiscLookup (base)
