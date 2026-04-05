---
partial_id: 143
artifact: LIB
class_name: RDCastSearch
header_file: lib/rdcastsearch.h
source_file: lib/rdcastsearch.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCastSearch

## Typ Qt
Plain C++ (Query Builder)

## Odpowiedzialność (WHAT)
Budowanie klauzuli WHERE SQL do wyszukiwania podcastów. Generuje warunek filtrujący po statusie (Active/Pending/Expired) na podstawie dat.

## Publiczne API
Konstruktor z parametrami filtrów → generuje SQL string

## Tabele DB
Brak (generuje SQL, nie wykonuje)

## Zależności
Brak
