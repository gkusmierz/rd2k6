---
partial_id: 118
class: RDOneShot
source_files:
  - lib/rdoneshot.h
  - lib/rdoneshot.cpp
status: done
phase: 2
---

# RDOneShot — One-Shot Timer Pool

## Purpose

Provides dynamically created one-shot (single-use) timers. Each call to `start()` creates a new QTimer that fires once after the specified delay, emits a `timeout` signal with an associated value, and then auto-cleans itself via a garbage collection mechanism.

## Inheritance

- **Parent class:** QObject

## Constructor

```cpp
RDOneShot(QObject *parent = 0)
```

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `timeout(int value)` | caller-provided value | A one-shot timer expires |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `start(int value, int msecs)` | void | Creates a new one-shot timer; fires `timeout(value)` after `msecs` milliseconds |

## Internal Behavior

- **Timer creation**: Each `start()` call allocates a new QTimer with a unique internal ID (`shot_count`, monotonically increasing). The timer is connected to a QSignalMapper that maps its `timeout()` to the internal ID.
- **Signal routing**: When a timer fires, `timeoutData(int id)` looks up the caller's value from `shot_values[id]` and emits `timeout(value)`.
- **Garbage collection**: After each timer fires, a 10ms zombie timer starts. On expiry, `zombieData()` iterates all timers, deletes inactive ones, and removes them from the maps. This deferred cleanup avoids deleting objects during signal emission.
- **No duplicate protection**: Multiple timers with the same value can be active simultaneously; each gets a unique internal ID.

## Dependencies

- `QTimer` (per-shot timers + zombie cleanup timer)
- `QSignalMapper` (routes timer signals to internal IDs)
- `std::map<int, QTimer*>` (timer pool)
- `std::map<int, int>` (value mapping)
