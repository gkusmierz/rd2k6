---
partial_id: 145
artifact: LIB
class_name: RDProfile
header_file: lib/rdprofile.h
source_file: lib/rdprofile.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDProfile

## Typ Qt
Plain C++ (Parser)

## Odpowiedzialność (WHAT)
Parser plików konfiguracyjnych w stylu INI. Parsuje sekcje [Section] i pary Tag=Value. Używany głównie do odczytu rd.conf (RDConfig).

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| setSource(filename) | Załaduj plik |
| setSourceString(string) | Załaduj ze stringa |
| stringValue(section, tag, default) | Odczyt wartości string |
| intValue/hexValue/floatValue/doubleValue/boolValue | Typowane odczyty |

## Helper classes
- RDProfileSection — jedna sekcja [Name]
- RDProfileLine — jedna para Tag=Value

## Zależności
Brak
