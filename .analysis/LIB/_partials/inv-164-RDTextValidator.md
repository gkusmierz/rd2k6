---
partial_id: 164
artifact: LIB
class_name: RDTextValidator
header_file: lib/rdtextvalidator.h
source_file: lib/rdtextvalidator.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTextValidator

## Typ Qt
QValidator derivative

## Odpowiedzialność (WHAT)
Walidator tekstu Qt — odrzuca niedozwolone znaki (domyślnie: ', `, ", \). Używany w polach edycji do zapobiegania SQL injection i problemom z escapowaniem.

## Publiczne API
validate(input) → State, addBannedChar(char)

## Reguły biznesowe
- Domyślnie blokuje: apostrof, backtick, cudzysłów, backslash
- Można dodać dodatkowe zakazane znaki

## Zależności
Brak
