---
partial_id: 140
artifact: LIB
class_name: RDHotkeys
header_file: lib/rdhotkeys.h
source_file: lib/rdhotkeys.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHotkeys

## Typ Qt
Plain C++ (Active Record)

## Odpowiedzialność (WHAT)
Zarządzanie skrótami klawiszowymi per stacja i moduł. Odczyt z tabeli HOTKEYS. Zwraca etykiety wierszy (opisy akcji) dla danego modułu.

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| station() | Nazwa stacji |
| inputCard() | Karta audio input |
| GetRowLabel() | Etykieta akcji dla danego wiersza |
| InsertHotkeys() | Wstaw domyślne skróty do DB |

## Tabele DB
HOTKEYS (READ/CREATE)

## Zależności
RDSqlQuery
