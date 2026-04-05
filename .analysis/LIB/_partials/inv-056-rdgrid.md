---
partial_id: "056"
class: RDGrid
sources:
  - lib/rdgrid.h
  - lib/rdgrid.cpp
status: done
phase: 2
---

# RDGrid — Clock Grid (Weekly Schedule)

## Purpose

Represents a 7-day x 24-hour grid of clocks for a given service. Each cell (day-of-week, hour) holds an RDClock pointer defining the programming structure for that time slot. Used by the Log Manager to define the weekly schedule template for automatic log generation.

## Constructor

- `RDGrid(QString svc_name, RDStation *station)` — Initializes a 7x24 matrix of RDClock objects for the named service.

## Public Interface

| Method | Returns | Description |
|--------|---------|-------------|
| `serviceName()` | `QString` | Returns the service name this grid belongs to |
| `setServiceName(name)` | `void` | Changes the service name |
| `clock(dayofweek, hour)` | `RDClock*` | Returns the clock for a given day (0-6) and hour (0-23). Returns NULL if out of bounds. |
| `setClock(dayofweek, hour, clock)` | `void` | Assigns a clock to a time slot (deep copy) |
| `load()` | `bool` | Currently returns false (stub/unimplemented) |
| `save()` | `void` | Currently empty (stub/unimplemented) |
| `clear()` | `void` | Resets grid name and clears all 168 clock objects |

## Database Mapping

No direct SQL in this class. Load/save are stubs. The actual grid persistence is handled elsewhere (likely via the service-level `SVC_CLOCKS` table pattern used by higher-level code).

## Internal Storage

- `grid_clocks[7][24]` — Fixed 2D array of `RDClock*` pointers (7 days x 24 hours = 168 slots)
- `grid_station` — Pointer to the `RDStation` object
- `grid_name` — Service name

## Notes

- The bounds check in `clock()` and `setClock()` has a bug: checks `dayofweek>1` instead of `dayofweek>6`, limiting access to only days 0 and 1.
- `load()` and `save()` are unimplemented stubs, suggesting grid persistence is handled at a higher abstraction level.

## Dependencies

- Not a QObject, plain C++ class
- Depends on `RDClock` and `RDStation`
