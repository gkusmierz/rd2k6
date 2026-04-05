---
partial_id: 160
artifact: LIB
class_name: RDTextFile
header_file: lib/rdtextfile.h
source_file: lib/rdtextfile.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTextFile

## Typ Qt
Plain C++ (Utility — global functions)

## Odpowiedzialność (WHAT)
Utility do czytania/pisania plików tekstowych — RDReadTextFile(), RDWriteTextFile(). Prosta warstwa abstrakcji nad QFile.

## Publiczne API
RDReadTextFile(path) → QString, RDWriteTextFile(path, contents)

## Zależności
Brak
