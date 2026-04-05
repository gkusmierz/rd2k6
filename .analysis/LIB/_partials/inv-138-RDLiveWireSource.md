---
partial_id: 138
artifact: LIB
class_name: RDLiveWireSource
header_file: lib/rdlivewiresource.h
source_file: lib/rdlivewiresource.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDLiveWireSource

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Reprezentacja źródła audio w protokole Axia LiveWire. Przechowuje: numer kanału, nazwę, adres multicast stream. Używane przez RDLiveWire do modelowania wejść audio.

## Publiczne API
Gettery/settery: channelNumber, channelName, streamAddress

## Zależności
Brak
