---
partial_id: 165
artifact: LIB
class_name: RDIdValidator
header_file: lib/rdidvalidator.h
source_file: lib/rdidvalidator.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDIdValidator

## Typ Qt
QIntValidator derivative

## Odpowiedzialność (WHAT)
Walidator identyfikatorów numerycznych — rozszerza QIntValidator o dodatkowe reguły (np. odrzucanie wartości 0, wymuszanie zakresu).

## Publiczne API
validate(input) → State + dziedziczone z QIntValidator

## Zależności
Brak
