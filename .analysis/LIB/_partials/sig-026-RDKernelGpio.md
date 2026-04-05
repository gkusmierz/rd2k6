---
partial_id: 026
class_name: RDKernelGpio
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDKernelGpio

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `valueChanged(int gpio, bool state)` | `pollData()` | Stan GPIO zmienił się względem zapamiętanego stanu (`gpio_states[i]`) | Zmiana stanu linii GPIO; `gpio` = numer GPIO (kernel sysfs), `state` = nowy stan |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer` (gpio_poll_timer) | `timeout()` | `pollData()` | `lib/rdkernelgpio.cpp:27` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `valueChanged(int, bool)` | `KernelGpio` (ripcd) | `gpiChangedData(int, bool)` | `ripcd/kernelgpio.cpp:44` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| sysfs (Linux kernel GPIO) | `/sys/class/gpio/` | `addGpio()`, `removeGpio()`, `value()`, `setValue()`, `direction()`, `setDirection()`, `activeLow()` | Zarządzanie GPIO przez interfejs sysfs; polling stanu co `KERNELGPIO_POLL_INTERVAL` ms |

## Uwagi
Klasa zarządza listą numerów GPIO (`gpio_gpios`) rejestrowanych przez `addGpio()`/`removeGpio()`. Timer startuje przy pierwszym GPIO i zatrzymuje się gdy lista pusta. Polling co `KERNELGPIO_POLL_INTERVAL` ms przez odczyt z sysfs (`/sys/class/gpio/gpioN/value`). Obsługuje eksport/unexport przez `/sys/class/gpio/export`.
