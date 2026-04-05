---
partial_id: 131
artifact: LIB
class_name: RDMacro
header_file: lib/rdmacro.h
source_file: lib/rdmacro.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDMacro

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Reprezentacja pojedynczego makra RML (Rivendell Macro Language). Parsuje i serializuje komendy RML w formacie tekstowym (np. "PX 1 0 0!" — Play Cart 1 na maszynie 0, porcie 0). Przechowuje: komendę, argumenty, adres docelowy, port, rolę.

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| Command | ~80 komend (PX, ST, SP, PN, PS, LB, LC, LL, PM, PE, ...) | Wszystkie komendy RML |
| Role | Cmd/Reply/None | Rola makra w komunikacji |

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| command/setCommand | Typ komendy RML |
| role/setRole | Cmd/Reply/None |
| address/setAddress | Adres IP docelowy |
| arg/addArg/setArg | Zarządzanie argumentami |
| toString/fromString | Serializacja/deserializacja z formatu "CMD arg1 arg2!" |
| acknowledge | Tworzy makro-odpowiedź |
| rollupArgs | Łączy argumenty od indeksu N w jeden string |

## Reguły biznesowe
- Format RML: 2-literowa komenda + argumenty oddzielone spacjami + terminator "!"
- ~80 różnych komend sterujących wszystkimi aspektami systemu radiowego

## Tabele DB
Brak

## Zależności
Brak (self-contained value object)
