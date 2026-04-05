---
partial_id: "044"
class: RDCatchConf
source_files:
  - lib/rdcatch_conf.h
  - lib/rdcatch_conf.cpp
phase: 2
status: done
---

# RDCatchConf — RDCatch Application Configuration (DB)

## Purpose
Manages per-station configuration for the RDCatch scheduling/recording application. This is the simplest DB-backed config class — currently stores only the error RML macro.

## Data Source
- **Table**: `RDCATCH`
- **Key**: `STATION` column (station name)

## Constructor
`RDCatchConf(station)` — creates row in RDCATCH if not exists for this station.

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## DB Table: RDCATCH

| Column | Accessor | Description |
|--------|----------|-------------|
| ERROR_RML | `errorRml()` / `setErrorRml()` | RML macro to execute when an error occurs |

## Key Methods
- `station()` — returns the station name
- `SetRow(param, value)` — generic DB column write helper

## Notes
This is a minimal configuration class. The error RML macro is triggered when a scheduled recording or event fails, allowing station-specific error handling (e.g., sending GPIO signals, triggering alerts).
