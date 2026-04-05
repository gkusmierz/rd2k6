---
partial_id: 130
artifact: LIB
class_name: RDAudioSettings
header_file: lib/rdaudiosettings.h
source_file: lib/rdaudiosettings.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDAudioSettings

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Zaawansowane ustawienia audio per kanał — format, sample rate, bitrate, kanały. Odczyt/zapis z tabeli RDLIBRARY (kolumny DEFAULT_CHANNELS, DEFAULT_SAMPRATE, DEFAULT_FORMAT, DEFAULT_BITRATE). Jedna instancja per kombinacja stacja+ustawienia.

## Publiczne API
Gettery/settery: format, channels, sampleRate, bitRate + load/save z DB

## Tabele DB
RDLIBRARY (READ/UPDATE)

## Zależności
RDSqlQuery
