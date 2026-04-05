---
partial_id: 182
artifact: LIB
class_name: RDCheckVersion
header_file: lib/rdcheck_version.h
source_file: lib/rdcheck_version.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCheckVersion (utility)

## Typ Qt
Plain C++ (global function)

## Odpowiedzialność (WHAT)
Sprawdzanie wersji schematu bazy danych — porównuje aktualną wersję DB z oczekiwaną. Raportuje mismatch.

## Publiczne API
RDCheckVersion() → bool

## Zależności
RDSqlQuery, dbversion.h
