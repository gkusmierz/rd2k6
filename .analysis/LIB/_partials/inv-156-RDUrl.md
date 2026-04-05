---
partial_id: 156
artifact: LIB
class_name: RDUrl
header_file: lib/rdurl.h
source_file: lib/rdurl.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDUrl

## Typ Qt
Q3Url derivative (Qt3 compat)

## Odpowiedzialność (WHAT)
Rozszerzony Q3Url dodający wsparcie dla schematów sftp:// i ftps://. Qt3 Q3Url nie rozpoznaje tych protokołów — RDUrl je emuluje.

## Publiczne API
Dziedziczone z Q3Url + obsługa sftp/ftps

## Zależności
Q3Url (Qt3Support)
