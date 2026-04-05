---
partial_id: 52
class_name: RDGpioSelector
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDGpioSelector

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `pinChanged(int card)` | `pinData(int)` (private slot) | Zawsze po zmianie numeru pinu | Użytkownik wybrał nowy numer pinu GPIO |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `gpio_pin_box` (QSpinBox) | `valueChanged(int)` | `pinData(int)` | `lib/rdgpioselector.cpp:52` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak znalezionych external connect() z pinChanged w całej bazie kodu) | — | — | — |

## Uwagi

RDGpioSelector jest minimalistycznym widgetem — pojedynczy QSpinBox do wyboru numeru pinu GPIO. Sygnał `pinChanged` emitowany, ale brak connect() w przeszukanych plikach cpp — prawdopodobnie konsumenci łączą się z nim w niezależnych modułach nie objętych wyszukiwaniem.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
