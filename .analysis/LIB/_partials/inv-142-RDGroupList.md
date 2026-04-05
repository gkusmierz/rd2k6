---
partial_id: 142
artifact: LIB
class_name: RDGroupList
header_file: lib/rdgroup_list.h
source_file: lib/rdgroup_list.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDGroupList

## Typ Qt
Plain C++ (Collection)

## Odpowiedzialność (WHAT)
Lista grup dostępnych dla danego użytkownika. Filtrowana przez tabelę USER_PERMS — zwraca tylko grupy do których użytkownik ma uprawnienia.

## Publiczne API
groupName(index), size

## Tabele DB
GROUPS + USER_PERMS (READ)

## Zależności
RDSqlQuery
