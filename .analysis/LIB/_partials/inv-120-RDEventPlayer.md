---
partial_id: 120
class: RDEventPlayer
source_files:
  - lib/rdevent_player.h
  - lib/rdevent_player.cpp
status: done
phase: 2
---

# RDEventPlayer — Asynchronous RML Command Executor

## Purpose

Executes lists of RML (Rivendell Macro Language) commands asynchronously. Manages a fixed-size pool of `RDMacroEvent` execution slots. Each `exec()` call loads and runs an RML command string (or a cart number converted to an "EX" macro) in the next available slot. Finished macro events are garbage-collected via a deferred cleanup timer.

## Inheritance

- **Parent class:** QObject

## Constants

- `RDEVENT_PLAYER_MAX_EVENTS = 10` -- maximum concurrent macro event executions

## Constructor

```cpp
RDEventPlayer(RDRipc *ripc, QObject *parent = 0)
```

- `ripc`: pointer to the RDRipc (Rivendell Inter-Process Communication) connection, passed to each RDMacroEvent for RML dispatch

## Signals

None (no public signals).

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `exec(const QString &rml)` | bool | Finds an empty slot, creates an RDMacroEvent, loads the RML string, and executes it. Returns true on success, false if all slots are full or load fails. |
| `exec(unsigned cartnum)` | bool | Convenience: converts cart number to "EX {cartnum}!" RML command and calls exec(QString). Returns false if cartnum is 0. |

## Internal Behavior

- **Slot pool**: Fixed array of 10 `RDMacroEvent*` slots. NULL = available, non-NULL = in use.
- **Execution**: On `exec()`, scans for first NULL slot, creates a new `RDMacroEvent`, connects its `finished()` signal via QSignalMapper to `macroFinishedData(int id)`.
- **Completion**: When a macro event finishes, `macroFinishedData` marks the slot as inactive (`player_state[id]=false`) and starts a 1ms one-shot cleanup timer.
- **Deferred cleanup** (`macroTimerData`): Iterates all slots. For any slot that is inactive and non-NULL, deletes the RDMacroEvent and sets the slot to NULL. The deferred approach avoids deleting objects during their own signal emission.
- **Cart execution**: Cart numbers are converted to the RML format "EX {N}!" which triggers cart execution through the Rivendell macro system.

## Dependencies

- `RDMacroEvent` (rdmacro_event.h) -- loads and executes RML command lists
- `RDRipc` (rdripc.h) -- Rivendell IPC connection for sending RML commands to the system
- `RDMacro` (rdmacro.h) -- macro definitions
- `QSignalMapper` (maps finished events to slot indices)
- `QTimer` (deferred cleanup timer)
