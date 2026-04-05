---
partial_id: 172
artifact: LIB
class_name: RDLogFilter
header_file: lib/rdlogfilter.h
source_file: lib/rdlogfilter.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDLogFilter

## Typ Qt
Widget (dziedziczy QWidget)

## Odpowiedzialność (WHAT)
Widget filtra logów — pozwala filtrować listę logów po serwisie, typie i tekście. Generuje klauzulę WHERE SQL.

## Sygnały
filterChanged(QString) — zmiana filtra → nowy SQL WHERE

## Publiczne API
whereSql() → QString

## Tabele DB
SERVICES (READ — lista serwisów do filtra)

## Zależności
RDSqlQuery
