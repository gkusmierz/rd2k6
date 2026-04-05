---
partial_id: 183
artifact: LIB
class_name: RDAudioExists
header_file: lib/rdaudio_exists.h
source_file: lib/rdaudio_exists.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDAudioExists (utility function)

## Typ Qt
Plain C++ (global function)

## Odpowiedzialność (WHAT)
Sprawdzanie czy plik audio istnieje na serwerze — odpytuje RDXport HTTP API o istnienie audio dla danego cart/cut.

## Publiczne API
RDAudioExists(cart, cut) → bool

## Zależności
RDXport HTTP API
