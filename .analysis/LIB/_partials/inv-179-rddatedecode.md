---
partial_id: 179
artifact: LIB
class_name: RDDateDecode
header_file: lib/rddatedecode.h
source_file: lib/rddatedecode.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDDateDecode (utility function)

## Typ Qt
Plain C++ (global function)

## Odpowiedzialność (WHAT)
Dekodowanie tokenów daty w stringach — zamienia %d,%m,%Y,%H,%M,%S na aktualne wartości. Używane w automatycznym generowaniu nazw plików (rdcatch, dropbox).

## Publiczne API
RDDateDecode(string, date, station, svc, cartnum) → QString

## Zależności
Brak
