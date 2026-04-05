---
partial_id: 116
class: RDKernelGpio
source_files:
  - lib/rdkernelgpio.h
  - lib/rdkernelgpio.cpp
status: done
phase: 2
---

# RDKernelGpio — Linux SysFS GPIO Interface

## Purpose

Controls GPIO pins through the Linux kernel SysFS interface (`/sys/class/gpio`). Allows exporting/unexporting GPIO pins, reading/writing values, setting direction and active-low polarity. Includes polling-based change detection with signal notification.

## Inheritance

- **Parent class:** QObject (Q_OBJECT macro present)

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `Direction` | `In=0`, `Out=1` | GPIO pin direction |
| `Edge` | `None=0`, `Rising=1`, `Falling=2`, `Both=3` | Edge detection mode (declared but not actively used in implementation) |

## Constants

- `KERNELGPIO_SYS_FILE = "/sys/class/gpio"` -- SysFS base path
- `KERNELGPIO_POLL_INTERVAL = 20` -- poll interval in ms

## Constructor

```cpp
RDKernelGpio(QObject *parent = 0)
```

## Signals

| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `valueChanged(int gpio, bool state)` | GPIO pin number, new state | A monitored GPIO pin's value changes (detected by polling) |

## Public Slots

| Slot | Parameters | Behavior |
|------|-----------|----------|
| `setValue(int gpio, bool state)` | GPIO pin number, desired state | Writes value to SysFS `value` node; returns true on success |

## Key Public Methods

| Method | Returns | Behavior |
|--------|---------|----------|
| `addGpio(int gpio)` | bool | Exports a GPIO pin via SysFS; starts polling if first pin; no-op if already added |
| `removeGpio(int gpio)` | bool | Unexports a GPIO pin from SysFS |
| `direction(int gpio, bool *ok)` | Direction | Reads pin direction from SysFS ("in"/"out") |
| `setDirection(int gpio, Direction)` | bool | Writes pin direction to SysFS |
| `activeLow(int gpio, bool *ok)` | bool | Reads active_low polarity from SysFS |
| `setActiveLow(int gpio, bool state)` | bool | Writes active_low polarity to SysFS |
| `value(int gpio, bool *ok)` | bool | Reads current pin value from SysFS |

## Internal Behavior

- **SysFS interaction**: All GPIO access goes through file I/O on `/sys/class/gpio/` nodes. The `OpenNode` helper constructs paths like `/sys/class/gpio/export`, `/sys/class/gpio/gpio{N}/value`, etc.
- **Polling**: A 20ms QTimer polls all registered GPIO pins. For each pin, reads current value and compares with cached state. If changed, updates cache and emits `valueChanged()`.
- **Lifecycle**: Polling timer starts on first `addGpio()` call. Destructor unexports all registered GPIOs.
- **Error handling**: Methods return bool success/failure. The `ok` out-parameter on read methods indicates whether the SysFS node could be opened.

## Linux-Specific

- Operates entirely through Linux SysFS GPIO interface (`/sys/class/gpio/`)
- See kernel documentation: https://www.kernel.org/doc/Documentation/gpio/sysfs.txt
- Uses C stdio (`fopen`/`fprintf`/`fscanf`/`fclose`) for SysFS file access

## Dependencies

- `QTimer` (polling timer)
- Linux SysFS GPIO subsystem
