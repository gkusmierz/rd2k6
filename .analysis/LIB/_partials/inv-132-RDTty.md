---
partial_id: 132
artifact: LIB
class_name: RDTty
header_file: lib/rdtty.h
source_file: lib/rdtty.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDTty

## Typ Qt
Plain C++ (Active Record)

## Odpowiedzialność (WHAT)
Konfiguracja portu szeregowego TTY — baud rate, data bits, parity, termination. Odczyt/zapis z tabeli TTYS. Używane do sterowania urządzeniami przez RS-232 (np. audio switcher, satellite receiver).

## Publiczne API
Gettery/settery: port, baudRate, dataBits, stopBits, parity, termination

## Tabele DB
TTYS (READ/UPDATE)

## Zależności
RDSqlQuery
