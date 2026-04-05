---
partial_id: "046"
class: RDAudioPort
source_files:
  - lib/rdaudio_port.h
  - lib/rdaudio_port.cpp
phase: 2
status: done
---

# RDAudioPort — Audio Port Configuration (DB)

## Purpose
Manages per-station, per-card audio port configuration. Controls clock source, input port types/modes/levels, and output port levels for audio hardware. Port data is cached in arrays at construction time (unlike other config classes that query on each access).

## Data Source
- **Tables**:
  - `AUDIO_CARDS` — clock source per card
  - `AUDIO_INPUTS` — input port configuration (type, mode, level)
  - `AUDIO_OUTPUTS` — output port levels
- **Key**: `STATION_NAME` + `CARD_NUMBER` + `PORT_NUMBER`

## Constructor
`RDAudioPort(station, card)` — loads all input ports (type, mode, level) and output port levels into in-memory arrays via two SELECT queries at construction. This is a caching pattern: data is read once, then served from arrays.

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## Enums

### PortType
`Analog=0`, `AesEbu=1`, `SpDiff=2` — physical audio interface type

## DB Tables

### AUDIO_CARDS
| Column | Accessor | Description |
|--------|----------|-------------|
| CLOCK_SOURCE | `clockSource()` / `setClockSource()` | Audio clock source for the card |

### AUDIO_INPUTS (per port)
| Column | Accessor | Description |
|--------|----------|-------------|
| TYPE | `inputPortType(port)` / `setInputPortType(port, type)` | Port type (Analog/AES-EBU/S/PDIF) |
| MODE | `inputPortMode(port)` / `setInputPortMode(port, mode)` | Port mode |
| LEVEL | `inputPortLevel(port)` / `setInputPortLevel(port, level)` | Input level |

### AUDIO_OUTPUTS (per port)
| Column | Accessor | Description |
|--------|----------|-------------|
| LEVEL | `outputPortLevel(port)` / `setOutputPortLevel(port, level)` | Output level |

## Key Methods
- Constructor performs bulk SELECT to cache port data in arrays (`audio_input_port_level[]`, `audio_output_port_level[]`, `audio_input_port_type[]`, `audio_input_port_mode[]`)
- Setters write directly to DB via UPDATE queries
- `station()` / `card()` — identity accessors

## Pattern
Unlike other config classes (which query DB on every getter call), RDAudioPort reads all port data into arrays during construction. Getters return cached values. Setters update both the cache arrays and the DB.
