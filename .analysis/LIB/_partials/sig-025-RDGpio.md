---
partial_id: 025
class_name: RDGpio
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDGpio

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `inputChanged(int line, bool state)` | `inputTimerData()` | Zmiana bitu w masce wejść GPI (polling) | Zmiana stanu linii GPI (wejście GPIO); `false`=wyłącz, `true`=włącz |
| `outputChanged(int line, bool state)` | `inputTimerData()` | Zmiana bitu w masce wyjść GPO (polling) | Zmiana stanu linii GPO (wyjście GPIO); `false`=wyłącz, `true`=włącz |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer` (gpio_input_timer) | `timeout()` | `inputTimerData()` | `lib/rdgpio.cpp:41` (konstruktor) |
| `QSignalMapper` (gpio_revert_mapper) | `mapped(int)` | `revertData(int)` | `lib/rdgpio.cpp:348` (`RemapTimers()`) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `inputChanged(int, bool)` | `LocalGpio` (ripcd) | `gpiChangedData(int, bool)` | `ripcd/local_gpio.cpp:55` |
| `outputChanged(int, bool)` | `LocalGpio` (ripcd) | `gpoChangedData(int, bool)` | `ripcd/local_gpio.cpp:57` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| ioctl (GPIO_GETINFO, GPIO_GET_INPUTS, GPIO_GET_OUTPUTS, GPIO_SET_OUTPUT) | Kernel GPIO driver | Polling stanu GPI; ustawianie GPO | Sterowanie liniami GPIO przez interfejs kernela Rivendell |
| read() / EV_KEY | Linux input device (evdev) | Alternatywny tryb ApiInput dla urządzeń HID | Obsługa klawiaturowych urządzeń jako GPIO |

## Uwagi
Obsługuje dwa tryby: `ApiGpio` (dedykowany sterownik GPIO) i `ApiInput` (urządzenia input/evdev). Zegar polling = `GPIO_CLOCK_INTERVAL`. GPO może mieć auto-revert po określonym czasie (timer na każdą linię wyjściową). Wewnętrzne timery dla każdej linii GPO zarządzane przez `RemapTimers()`.
