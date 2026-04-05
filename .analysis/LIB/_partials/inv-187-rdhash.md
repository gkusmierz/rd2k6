---
partial_id: 187
artifact: LIB
class_name: RDHash
header_file: lib/rdhash.h
source_file: lib/rdhash.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHash (utility function)

## Typ Qt
Plain C++ (global function)

## Odpowiedzialność (WHAT)
Obliczanie SHA-1 hash pliku audio — odczytuje plik blokami i generuje hex digest. Używane do weryfikacji integralności plików audio.

## Publiczne API
RDSha1Hash(filepath) → QString (hex SHA1)

## Zależności
OpenSSL (SHA1)
