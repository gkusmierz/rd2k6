---
partial_id: 141
artifact: LIB
class_name: RDHotKeyList
header_file: lib/rdhotkeylist.h
source_file: lib/rdhotkeylist.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHotKeyList

## Typ Qt
Plain C++ (Collection)

## Odpowiedzialność (WHAT)
Kolekcja skrótów klawiszowych załadowanych z tabeli HOTKEYS — mapowanie key string → akcja per moduł i stacja.

## Publiczne API
Gettery per indeks: keyValue, keyLabel + count

## Tabele DB
HOTKEYS (READ)

## Zależności
RDSqlQuery
