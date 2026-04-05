---
partial_id: 170
artifact: LIB
class_name: RDCardSelector
header_file: lib/rdcardselector.h
source_file: lib/rdcardselector.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCardSelector

## Typ Qt
Widget (Q_OBJECT, dziedziczy RDWidget)

## Odpowiedzialność (WHAT)
Selektor karty i portu audio — dwa combobox'y (karta + port) z filtrowaniem dostępnych portów na podstawie wybranej karty. Odczytuje konfigurację z AUDIO_CARDS.

## Sygnały
cardChanged(int), portChanged(int)

## Publiczne API
card/setCard, port/setPort, setMaxCards, setMaxPorts

## Tabele DB
AUDIO_CARDS (READ)

## Zależności
RDSqlQuery
