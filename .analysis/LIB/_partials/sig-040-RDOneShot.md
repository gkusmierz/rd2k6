---
partial_id: 040
class_name: RDOneShot
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDOneShot

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `timeout(int value)` | `timeoutData(int id)` | Po upłynięciu czasu timera skojarzonego z danym `id` | Zakończenie jednorazowego odliczania — rozgłasza wartość powiązaną z timerem |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QSignalMapper* shot_mapper` (wewnętrzny) | `mapped(int)` | `timeoutData(int)` | `lib/rdoneshot.cpp:31` (konstruktor) |
| `QTimer* shot_zombie_timer` (wewnętrzny) | `timeout()` | `zombieData()` | `lib/rdoneshot.cpp:37` (konstruktor) |
| `QTimer* shot_timers[n]` (tworzony w `start()`) | `timeout()` | `shot_mapper::map()` | `lib/rdoneshot.cpp:46` (metoda `start()`) |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `timeout(int)` | `ripcd/KernelGpio` (`gpio_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/kernelgpio.cpp:66` |
| `timeout(int)` | `ripcd/BtSs42` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btss42.cpp:70` |
| `timeout(int)` | `ripcd/BtSs42` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btss42.cpp:72` |
| `timeout(int)` | `ripcd/BtSs44` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btss44.cpp:70` |
| `timeout(int)` | `ripcd/BtSs44` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btss44.cpp:72` |
| `timeout(int)` | `ripcd/BtSrc16` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btsrc16.cpp:68` |
| `timeout(int)` | `ripcd/BtSrc16` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btsrc16.cpp:70` |
| `timeout(int)` | `ripcd/BtSs82` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btss82.cpp:70` |
| `timeout(int)` | `ripcd/BtSs82` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btss82.cpp:72` |
| `timeout(int)` | `ripcd/Bt16x2` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/bt16x2.cpp:69` |
| `timeout(int)` | `ripcd/Bt16x2` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/bt16x2.cpp:71` |
| `timeout(int)` | `ripcd/LocalGpio` (`gpio_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/local_gpio.cpp:65` |
| `timeout(int)` | `ripcd/Sas64000Gpi` (`sas_gpo_oneshot`) | (slot z SIGNAL spec) | `ripcd/sas64000gpi.cpp:58` |
| `timeout(int)` | `ripcd/Vguest` (`vguest_gpio_oneshot`) | `(vguest slot)` | `ripcd/vguest.cpp:223` |
| `timeout(int)` | `ripcd/BtSs41Mlr` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btss41mlr.cpp:71` |
| `timeout(int)` | `ripcd/BtSs41Mlr` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btss41mlr.cpp:73` |
| `timeout(int)` | `ripcd/LocalAudio` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/local_audio.cpp:50` |
| `timeout(int)` | `ripcd/ModemLines` (`gpio_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/modemlines.cpp:77` |
| `timeout(int)` | `ripcd/BtSs164` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btss164.cpp:70` |
| `timeout(int)` | `ripcd/BtSs164` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btss164.cpp:72` |
| `timeout(int)` | `ripcd/BtSrc8iii` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/btsrc8iii.cpp:68` |
| `timeout(int)` | `ripcd/BtSrc8iii` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/btsrc8iii.cpp:70` |
| `timeout(int)` | `ripcd/Acu1p` (`bt_gpi_oneshot`) | `gpiOneshotData(int)` | `ripcd/acu1p.cpp:72` |
| `timeout(int)` | `ripcd/Acu1p` (`bt_gpo_oneshot`) | `gpoOneshotData(int)` | `ripcd/acu1p.cpp:74` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — klasa jest czysto in-process; używana przez sterowniki GPIO w ripcd do debouncing/one-shot timing)
