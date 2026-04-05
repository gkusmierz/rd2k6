---
partial_id: 177
artifact: LIB
class_name: RDMatrix
header_file: lib/rdmatrix.h
source_file: lib/rdmatrix.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDMatrix

## Typ Qt
Plain C++ (Active Record)

## Odpowiedzialność (WHAT)
Model matrycy (audio switcher/router). Reprezentuje fizyczny lub wirtualny switcher audio z portami wejścia/wyjścia, liniami GPIO, konfiguracją RS-232/TCP. Obsługuje wiele typów switcherów (Quartz, SAS, LiveWire, etc.).

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| Type | LocalGpio/GenericGpo/GenericSerial/SasUsi/Sas32000/SasSrc/Quartz/BtSs82/BtAcs82/SasUsi2/BtGpi16/... ~30 typów | Typ hardware switcher |

## Publiczne API
Gettery/settery: type, name, portType, ipAddress, port, card, inputs, outputs, gpis, gpos + konfig RS-232 (baudRate, dataBits, etc.)

## Tabele DB
MATRICES (READ/UPDATE)

## Zależności
RDSqlQuery
