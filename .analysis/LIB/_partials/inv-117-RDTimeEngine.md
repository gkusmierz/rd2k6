---
partial_id: 117
class: RDTimeEngine
source_files:
  - lib/rdtimeengine.h
  - lib/rdtimeengine.cpp
status: done
phase: 2
---

# RDTimeEngine — Wall-Clock Event Timer Engine

## Purpose

Schedules events to fire at specific wall-clock times (QTime). Multiple events can be registered by ID and associated with a target time. The engine automatically manages a single QTimer to fire at the next upcoming event time, then emits signals for all events at that time. Supports a configurable time offset for testing or timezone adjustment.

## Inheritance

- **Parent class:** QObject

## Constructor

```cpp
RDTimeEngine(QObject *parent = 0)
```

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `timeout(int id)` | event ID | A scheduled event's target time is reached |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `clear()` | void | Removes all events and resets time offset to 0 |
| `event(int id)` | QTime | Returns the scheduled time for a given event ID (invalid QTime if not found) |
| `timeOffset()` / `setTimeOffset(int msecs)` | int / void | Get/set a millisecond offset applied to current time when calculating next event |
| `addEvent(int id, QTime time)` | void | Registers an event; if another event already exists at the same time, groups them together |
| `removeEvent(int id)` | void | Removes a specific event by ID; removes the time slot if it was the only event |
| `next()` | int | Returns the ID of the next pending event (-1 if none) |

## Internal Behavior

- **Event grouping**: Events at the same QTime are stored together in a single `RDTimeEvent` object, which holds multiple IDs. When the time fires, all IDs at that time slot emit `timeout()` signals (in reverse order of addition).
- **Timer management** (`SetTimer`): After any add/remove/clear, recalculates the next event:
  1. Finds the nearest future event from current time + offset
  2. If no future event today, wraps around midnight (adds remaining time to midnight + event offset from midnight)
  3. Arms a single one-shot QTimer for the computed interval
- **Max sentinel**: Uses 86400001 ms (>24h) as "no event found" sentinel value.

## Dependencies

- `RDTimeEvent` (rdtimeevent.h) -- stores a time + list of IDs
- `QTimer` (single one-shot timer for next event)
- `QTime` -- wall-clock time representation
