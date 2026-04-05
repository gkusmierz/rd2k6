---
partial_id: 48
class_name: RDPlayMeter
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDPlayMeter

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| (brak — klasa nie deklaruje własnych sygnałów) | — | — | — |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak znalezionych connect() podłączających do RDPlayMeter) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak connect() w rdplaymeter.cpp) | — | — | — |

## Uwagi

RDPlayMeter jest czysto pasywnym widgetem do wyświetlania poziomu audio. Brak sygnałów — sterowany wyłącznie przez wywołania metod (setRange, setHighThreshold, setClipThreshold, setPeakBar, setSolidBar, setFloatingBar). Typowo używany w rdcatch, rdairplay do wizualizacji poziomu odtwarzania.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
