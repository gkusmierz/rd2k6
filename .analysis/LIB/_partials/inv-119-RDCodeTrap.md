---
partial_id: 119
class: RDCodeTrap
source_files:
  - lib/rdcodetrap.h
  - lib/rdcodetrap.cpp
status: done
phase: 2
---

# RDCodeTrap — Character Sequence Pattern Matcher

## Purpose

Monitors a stream of raw bytes for registered character sequences (codes). When a complete sequence is detected in the scanned data, emits a signal with the trap's ID. Used for detecting control codes, serial port commands, or other byte-level protocol triggers in broadcast automation.

## Supporting Struct: RDTrapEvent

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Trap identifier (caller-assigned) |
| `code` | char* | Target byte sequence to match |
| `length` | int | Length of the byte sequence |
| `istate` | int | Current match position (state machine index into `code`) |

## Inheritance

- **Parent class:** QObject

## Constructor

```cpp
RDCodeTrap(QObject *parent = 0)
```

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `trapped(int id)` | trap ID | A registered byte sequence is fully matched in scanned data |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `addTrap(int id, const char *code, int length)` | void | Registers a byte sequence to watch for; no-op if exact same id+code already exists |
| `removeTrap(int id)` | void | Removes all traps with given ID |
| `removeTrap(const char *code, int length)` | void | Removes all traps matching given byte sequence |
| `removeTrap(int id, const char *code, int length)` | void | Removes traps matching both ID and byte sequence |
| `scan(const char *buf, int length)` | void | Feeds a buffer of bytes through all active traps; emits `trapped()` on complete matches |
| `clear()` | void | Removes all traps |

## Internal Behavior

- **State machine matching**: Each trap maintains an `istate` index tracking how many consecutive bytes of the target sequence have been matched. On each `scan()` call, each byte in the buffer is compared against `code[istate]`:
  - Match: advance `istate`
  - Mismatch: reset `istate` to 0
  - Full match (`istate == length`): emit `trapped(id)` and reset `istate`
- **Multiple traps**: All registered traps are checked independently against the same input buffer. Multiple traps can fire from a single `scan()` call.
- **Incremental scanning**: State persists across `scan()` calls, so a sequence can span multiple buffers.
- **Deduplication**: `addTrap` skips if the exact (id, code, length) combination already exists.

## Dependencies

- `QList<RDTrapEvent>` (trap storage)
- No timers, no external dependencies -- purely synchronous pattern matching
