# INV-064: RDSlotOptions

**Status:** done
**Source:** `lib/rdslotoptions.h`, `lib/rdslotoptions.cpp`
**Inherits:** (none -- plain C++ class, not a QObject)

## Purpose

Container/model class for cart slot configuration. Stores the operating mode, hook mode, stop action, cart number, service, and audio channel assignments for a single cart slot. Handles persistence to/from the CARTSLOTS database table.

## Constructor

```
RDSlotOptions(const QString &stationname, unsigned slotno)
```

On construction: checks if a CARTSLOTS record exists for this station+slot; if not, inserts one. Then calls `clear()` to initialize defaults.

## Enums

```cpp
enum Mode { CartDeckMode=0, BreakawayMode=1, LastMode=2 };
enum StopAction { UnloadOnStop=0, RecueOnStop=1, LoopOnStop=2, LastStop=3 };
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `mode()` / `setMode()` | Mode | CartDeckMode or BreakawayMode |
| `hookMode()` / `setHookMode()` | bool | Whether to play hook portion only |
| `stopAction()` / `setStopAction()` | StopAction | What happens when playout ends |
| `cartNumber()` / `setCartNumber()` | int | Assigned cart number (0 = none) |
| `service()` / `setService()` | QString | Breakaway service name |
| `card()` | int | Audio card number (read-only, from DB) |
| `inputPort()` | int | Input port number (read-only, from DB) |
| `outputPort()` | int | Output port number (read-only, from DB) |

## Key Methods

| Method | Behavior |
|--------|----------|
| `load()` | Reads configuration from CARTSLOTS table. Handles DEFAULT_* columns: if default is -1, uses the user-set value; otherwise forces the default. Returns true if record found. |
| `save()` | Writes user-configurable fields (MODE, HOOK_MODE, STOP_ACTION, CART_NUMBER, SERVICE_NAME) back to CARTSLOTS |
| `clear()` | Resets to defaults: CartDeckMode, no hook, UnloadOnStop, cart 0, empty service |
| `modeText(Mode)` | Static: returns display string for mode |
| `stopActionText(StopAction)` | Static: returns display string for stop action |

## SQL / DB Access

| Table | Operation | Context |
|-------|-----------|---------|
| `CARTSLOTS` | SELECT (existence check) | Constructor: ensures record exists |
| `CARTSLOTS` | INSERT | Constructor: creates record if missing |
| `CARTSLOTS` | SELECT | `load()`: reads all slot configuration fields |
| `CARTSLOTS` | UPDATE | `save()`: persists user-configurable settings |

### CARTSLOTS Columns Read

`CARD`, `INPUT_PORT`, `OUTPUT_PORT`, `MODE`, `DEFAULT_MODE`, `HOOK_MODE`, `DEFAULT_HOOK_MODE`, `STOP_ACTION`, `DEFAULT_STOP_ACTION`, `CART_NUMBER`, `DEFAULT_CART_NUMBER`, `SERVICE_NAME`

### Default Override Logic

Each setting has a user value and a DEFAULT_* value:
- DEFAULT = -1: use the user-set value
- DEFAULT >= 0: force that value regardless of user setting

This allows administrators to lock certain settings per station.
