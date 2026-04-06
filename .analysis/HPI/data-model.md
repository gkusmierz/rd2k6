---
phase: 2
artifact: HPI
status: done
tables_total: 0
crud_classes: 0
---

# Data Model: librdhpi

## ERD -- Entity Relationship Diagram

Biblioteka librdhpi nie korzysta z bazy danych. Jest to czysto sprzetowa warstwa abstrakcji nad AudioScience HPI SDK. Nie zawiera zadnych zapytan SQL, tabel, ani operacji CRUD.

## Tabele

Brak tabel -- librdhpi operuje wylacznie na API sprzetowym AudioScience HPI.

## Mapowanie Tabela <-> Klasa C++

| Tabela DB | Klasa C++ | Wzorzec | Operacje |
|-----------|-----------|---------|----------|
| (brak) | -- | -- | -- |

Wszystkie 5 klas w librdhpi to klasy hardware abstraction, nie Active Record/CRUD.
