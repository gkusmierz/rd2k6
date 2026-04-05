---
partial_id: 149
artifact: LIB
class_name: RDCartSearchText
header_file: lib/rdcart_search_text.h
source_file: lib/rdcart_search_text.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCartSearchText

## Typ Qt
Plain C++ (Query Builder)

## Odpowiedzialność (WHAT)
Budowanie klauzuli WHERE SQL do wyszukiwania cartów. Generuje złożone warunki filtrujące po tekście (title/artist/agency/client), grupie, typie, scheduler codes, zakresie numerów. Obsługuje AND/OR łączenie tokenów wyszukiwania.

## Publiczne API
Funkcje globalne: RDCartSearchText() — zwraca SQL WHERE string

## Tabele DB
Brak (generuje SQL, nie wykonuje)

## Zależności
Brak
