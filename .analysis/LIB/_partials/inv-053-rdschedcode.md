---
partial_id: "053"
class: RDSchedCode
sources:
  - lib/rdschedcode.h
  - lib/rdschedcode.cpp
status: done
phase: 2
---

# RDSchedCode — Scheduler Code Entity

## Purpose

Represents a single scheduler code entry. Scheduler codes are labels assigned to carts that the scheduling engine uses to enforce rotation and separation rules. This class provides read/write access to a scheduler code record in the database.

## Constructor

- `RDSchedCode(const QString &code)` — Loads a scheduler code by its code string. On construction, if the code exists in the DB, re-reads the canonical casing from the database.

## Public Interface

| Method | Returns | Description |
|--------|---------|-------------|
| `code()` | `QString` | Returns the scheduler code identifier |
| `exists()` | `bool` | Checks whether this code exists in DB |
| `description()` | `QString` | Returns human-readable description of the code |
| `setDescription(desc)` | `void` | Updates the description |
| `xml()` | `QString` | Serializes to XML fragment (`<schedCode>` with `<code>` and `<description>`) |

## Database Mapping

| Table | Key Column | Key Value | CRUD |
|-------|-----------|-----------|------|
| `SCHED_CODES` | `CODE` | `sched_code` (constructor param) | R/U |

### Columns Accessed

- `CODE` — scheduler code identifier (read in constructor for canonical casing)
- `DESCRIPTION` — human-readable description (read/write)

## Dependencies

- No inheritance, not a QObject
- Uses `RDGetSqlValue`, `RDDoesRowExist`, `RDEscapeString`, `RDXmlField` utility functions
