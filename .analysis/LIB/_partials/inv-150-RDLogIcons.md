---
partial_id: 150
artifact: LIB
class_name: RDLogIcons
header_file: lib/rdlog_icons.h
source_file: lib/rdlog_icons.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDLogIcons

## Typ Qt
Plain C++ (Utility)

## Odpowiedzialność (WHAT)
Mapowanie typów linii logu na ikony (QPixmap). Zwraca ikonę dla danego typu eventu (Cart/Macro/Marker/Track/Chain/MusicLink/TrafficLink).

## Publiczne API
typeIcon(RDLogLine::Type) → QPixmap

## Zależności
RDLogLine (enums)
