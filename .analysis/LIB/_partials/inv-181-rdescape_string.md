---
partial_id: 181
artifact: LIB
class_name: RDEscapeString
header_file: lib/rdescape_string.h
source_file: lib/rdescape_string.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDEscapeString (utility function)

## Typ Qt
Plain C++ (global function)

## Odpowiedzialność (WHAT)
Escapowanie stringów dla SQL — zamienia apostrof na \', backslash na \\. Używane wszędzie przy budowaniu SQL query.

## Publiczne API
RDEscapeString(input) → QString

## Zależności
Brak
