---
partial_id: "059"
class: RDDeck
sources:
  - lib/rddeck.h
  - lib/rddeck.cpp
status: done
phase: 2
---

# RDDeck — Record/Play Deck Configuration Model

## Purpose

Represents the configuration of a record/play deck (audio input channel) on a Rivendell station. Each deck maps to a specific sound card, stream, and port, with default recording settings and optional switcher matrix integration. Used by RDCatch and other recording modules.

## Enums

### Status
| Value | Name | Description |
|-------|------|-------------|
| 0 | `Offline` | Deck not available |
| 1 | `Idle` | Deck available but not in use |
| 2 | `Ready` | Deck armed for recording |
| 3 | `Recording` | Actively recording |
| 4 | `Waiting` | Waiting for trigger |

## Constructor

- `RDDeck(QString station, unsigned channel, bool create=false)` — Attaches to the deck for the given station and channel number. If `create=true` and no record exists, inserts a new row into DECKS.

## Public Interface

### Identity & Status
| Method | Returns | Description |
|--------|---------|-------------|
| `isActive()` | `bool` | True if deck has valid card and port numbers (both >= 0) |
| `station()` | `QString` | Station name |
| `channel()` | `int` | Channel number |

### Hardware Mapping
| Method | Returns | Description |
|--------|---------|-------------|
| `cardNumber()` / `setCardNumber(card)` | `int` / `void` | Sound card number |
| `streamNumber()` / `setStreamNumber(stream)` | `int` / `void` | Stream number on the card |
| `portNumber()` / `setPortNumber(port)` | `int` / `void` | Input port number |
| `monitorPortNumber()` / `setMonitorPortNumber(port)` | `int` / `void` | Monitor output port number |
| `defaultMonitorOn()` / `setDefaultMonitorOn(state)` | `bool` / `void` | Monitor enabled by default |

### Default Recording Settings
| Method | Returns | Description |
|--------|---------|-------------|
| `defaultFormat()` / `setDefaultFormat(format)` | `RDSettings::Format` / `void` | Default audio format |
| `defaultChannels()` / `setDefaultChannels(chan)` | `int` / `void` | Default channel count |
| `defaultBitrate()` / `setDefaultBitrate(rate)` | `int` / `void` | Default bit rate |
| `defaultThreshold()` / `setDefaultThreshold(level)` | `int` / `void` | Default record trigger threshold |

### Switcher Matrix Integration
| Method | Returns | Description |
|--------|---------|-------------|
| `switchStation()` / `setSwitchStation(str)` | `QString` / `void` | Station hosting the switch matrix |
| `switchMatrix()` / `setSwitchMatrix(matrix)` | `int` / `void` | Matrix number |
| `switchMatrixName()` | `QString` | Looks up matrix name from MATRICES table |
| `switchOutput()` / `setSwitchOutput(output)` | `int` / `void` | Output number on the matrix |
| `switchOutputName()` | `QString` | Looks up output name from OUTPUTS table |
| `switchDelay()` / `setSwitchDelay(delay)` | `int` / `void` | Delay before switching (ms) |

## Database Mapping

| Table | Key Columns | Key Values | CRUD |
|-------|------------|------------|------|
| `DECKS` | `STATION_NAME`, `CHANNEL` | `deck_station`, `deck_channel` | C/R/U |
| `MATRICES` | `STATION_NAME`, `MATRIX` | (via switchStation, switchMatrix) | R |
| `OUTPUTS` | `STATION_NAME`, `MATRIX`, `NUMBER` | (via switchStation, switchMatrix, switchOutput) | R |

### DECKS Columns Accessed

| DB Column | Property | Type |
|-----------|----------|------|
| `CARD_NUMBER` | cardNumber | int |
| `STREAM_NUMBER` | streamNumber | int |
| `PORT_NUMBER` | portNumber | int |
| `MON_PORT_NUMBER` | monitorPortNumber | int |
| `DEFAULT_MONITOR_ON` | defaultMonitorOn | Y/N |
| `DEFAULT_FORMAT` | defaultFormat | int (enum) |
| `DEFAULT_CHANNELS` | defaultChannels | int |
| `DEFAULT_BITRATE` | defaultBitrate | int |
| `DEFAULT_THRESHOLD` | defaultThreshold | int |
| `SWITCH_STATION` | switchStation | string |
| `SWITCH_MATRIX` | switchMatrix | int |
| `SWITCH_OUTPUT` | switchOutput | int |
| `SWITCH_DELAY` | switchDelay | int |

## Key Behaviors

1. **Auto-create**: With `create=true`, checks if deck record exists; if not, creates it.
2. **Active check**: `isActive()` verifies both CARD_NUMBER and PORT_NUMBER are >= 0 in the DB.
3. **Cross-table lookups**: `switchMatrixName()` and `switchOutputName()` query MATRICES and OUTPUTS tables respectively.
4. **Lazy loading**: No caching -- every property getter issues a SQL SELECT.

## Dependencies

- Not a QObject, plain C++ class
- Uses `RDSettings::Format` for audio format enum
- Cross-references MATRICES and OUTPUTS tables for switcher integration
