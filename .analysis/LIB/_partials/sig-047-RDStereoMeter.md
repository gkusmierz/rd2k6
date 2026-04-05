---
partial_id: 47
class_name: RDStereoMeter
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDStereoMeter

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `clip()` | `setLeftSolidBar()` | `level >= 0 && !clip_light_on` | Lewy kanał osiągnął poziom clippingu (solid bar) |
| `clip()` | `setRightSolidBar()` | `level >= clip_light_level && !clip_light_on` | Prawy kanał osiągnął poziom clippingu (solid bar) |
| `clip()` | `setLeftFloatingBar()` | `level >= clip_light_level && !clip_light_on` | Lewy kanał osiągnął poziom clippingu (floating bar) |
| `clip()` | `setRightFloatingBar()` | `level >= clip_light_level && !clip_light_on` | Prawy kanał osiągnął poziom clippingu (floating bar) |
| `clip()` | `setLeftPeakBar()` | `level >= clip_light_level && !clip_light_on` | Lewy kanał osiągnął poziom clippingu (peak bar) |
| `clip()` | `setRightPeakBar()` | `level >= clip_light_level && !clip_light_on` | Prawy kanał osiągnął poziom clippingu (peak bar) |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak znalezionych connect() podłączających do RDStereoMeter) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak connect() w rdstereometer.cpp) | — | — | — |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
