---
partial_id: 147
artifact: LIB
class_name: RDCmdSwitch
header_file: lib/rdcmd_switch.h
source_file: lib/rdcmd_switch.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCmdSwitch

## Typ Qt
Plain C++ (Utility)

## Odpowiedzialność (WHAT)
Parser argumentów wiersza poleceń. Parsuje argc/argv do par key-value (--key=value). Śledzenie processed state per argument. Używany przez wszystkie moduły Rivendell do parsowania CLI args.

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| keys() | Liczba argumentów |
| key(n)/value(n) | Pobranie n-tego klucza/wartości |
| processed(n)/setProcessed(n) | Śledzenie przetworzonych args |
| allProcessed() | Czy wszystkie args przetworzone |
| debugActive() | Czy --debug jest aktywne |

## Zależności
Brak
