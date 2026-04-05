---
partial_id: 115
class: RDGpio
source_files:
  - lib/rdgpio.h
  - lib/rdgpio.cpp
status: done
phase: 2
---

# RDGpio — General-Purpose I/O Device Driver

## Purpose

Abstracts GPIO hardware devices for radio broadcast automation. Supports two distinct hardware APIs: a custom GPIO kernel driver (`/dev/gpio*`) with full input/output support, and the Linux input event subsystem (`/dev/input/event*`) for input-only operation. Provides input change detection via polling, output control with optional timed auto-reversion, and per-line state tracking.

## Inheritance

- **Parent class:** QObject

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `Mode` | `Auto`, `Input`, `Output` | GPIO operating mode (maps to GPIO_MODE_* kernel driver constants) |
| `Api` | `ApiGpio=0`, `ApiInput=1` | Internal: which hardware API is in use |

## Constants

- `GPIO_CLOCK_INTERVAL = 100` -- input poll interval in ms
- `GPIO_MAX_LINES = 24` -- maximum number of GPIO lines

## Constructor

```cpp
RDGpio(QObject *parent = 0)
```

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `inputChanged(int line, bool state)` | line index, new state | An input line changes state (detected by polling) |
| `outputChanged(int line, bool state)` | line index, new state | An output line changes state (detected by polling) |

## Public Slots

| Slot | Parameters | Behavior |
|------|-----------|----------|
| `gpoSet(int line, unsigned interval=0)` | line, optional revert time (ms) | Sets an output line HIGH; if interval > 0, auto-reverts after timeout |
| `gpoReset(int line, unsigned interval=0)` | line, optional revert time (ms) | Sets an output line LOW; if interval > 0, auto-reverts after timeout |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `device()` / `setDevice(QString)` | QString / void | Get/set device path |
| `description()` | QString | Human-readable device description (from driver or "Unknown Device") |
| `mode()` / `setMode(Mode)` | Mode / void | Get/set operating mode (ApiGpio only) |
| `open()` / `close()` | bool / void | Opens device, auto-detects API (GPIO ioctl first, then input event), starts polling |
| `inputs()` / `outputs()` | int | Number of input/output lines (0 if not open) |
| `inputMask()` | unsigned | Current input state as bitmask (per-line bits) |
| `inputState(int line)` | bool | State of a specific input line |
| `outputMask()` | unsigned | Current output state as bitmask (ApiGpio only; ApiInput returns 0) |

## Internal Behavior

- **Auto-detection**: On `open()`, tries GPIO ioctl first (`GPIO_GETINFO`). If that fails, tries Linux input event API (`EVIOCGVERSION`). Otherwise returns false.
- **Input polling**: A 100ms timer reads input and output masks, compares with previous state, and emits `inputChanged`/`outputChanged` for each changed line.
- **Output reversion**: Each output line has a dedicated one-shot QTimer. When `gpoSet`/`gpoReset` is called with a non-zero interval, a timer starts. On expiry, the line toggles back (revertData slot). Managed via QSignalMapper.
- **Input event API**: Maps Linux EV_KEY event codes to GPIO line indices via `gpio_key_map[KEY_MAX]`. Only supports inputs (no outputs).
- **GPIO API**: Uses custom kernel driver ioctls for full I/O: `GPIO_GETINFO`, `GPIO_SETMODE`, `GPIO_GET_INPUTS`, `GPIO_GET_OUTPUTS`, `GPIO_SET_OUTPUT`, `GPIO_SET_FILTERS`, `GPIO_CAP_FILTER`.

## Linux-Specific

- Requires `<linux/input.h>` for EV_KEY, KEY_MAX, input_event, EVIOCGVERSION, EVIOCGNAME, EVIOCGBIT
- Requires `<gpio.h>` for custom GPIO kernel driver structs and ioctls
- Device opened with `O_RDONLY|O_NONBLOCK`
- Input filters enabled if hardware supports `GPIO_CAP_FILTER`

## Dependencies

- `QTimer` (input polling + per-line revert timers)
- `QSignalMapper` (maps revert timer timeouts to line indices)
- Custom GPIO kernel driver (`gpio.h`)
