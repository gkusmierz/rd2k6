---
partial_id: 169
artifact: LIB
class_name: RDGpioSelector
header_file: lib/rdgpioselector.h
source_file: lib/rdgpioselector.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDGpioSelector

## Typ Qt
Widget (dziedziczy QWidget)

## Odpowiedzialność (WHAT)
Selektor linii GPIO — pozwala wybrać matrycę i linię GPI/GPO z listy skonfigurowanych w systemie.

## Sygnały
matrixChanged, lineChanged

## Publiczne API
matrix/setMatrix, line/setLine

## Tabele DB
MATRICES, GPIS, GPOS (READ)

## Zależności
RDMatrix, RDSqlQuery
