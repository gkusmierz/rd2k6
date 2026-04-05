---
partial_id: 166
artifact: LIB
class_name: RDTimeEdit
header_file: lib/rdtimeedit.h
source_file: lib/rdtimeedit.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTimeEdit

## Typ Qt
Widget (dziedziczy Q3Frame)

## Odpowiedzialność (WHAT)
Edytor czasu (HH:MM:SS.mmm) — widget do wprowadzania wartości czasowych z precyzją do milisekund. Używany w schedulerze i edytorze logów.

## Sygnały
valueChanged(QTime) — zmiana wartości

## Publiczne API
time/setTime, setRange, setDisplay(show_hours, show_minutes, show_seconds, show_tenths)

## Zależności
Brak
