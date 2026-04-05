---
partial_id: 53
class_name: RDDatePicker
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDDatePicker

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| (brak — klasa nie deklaruje własnych sygnałów; nagłówek nie zawiera sekcji `signals:`) | — | — | — |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `pick_month_box` (QComboBox) | `activated(int)` | `monthActivatedData(int)` | `lib/rddatepicker.cpp:40` |
| `pick_year_box` (QComboBox, tryb fixed-list) | `activated(int)` | `yearActivatedData(int)` | `lib/rddatepicker.cpp:52` |
| `pick_year_spin` (QSpinBox, tryb spin) | `valueChanged(int)` | `yearChangedData(int)` | `lib/rddatepicker.cpp:61` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak — widget nie emituje własnych sygnałów na zewnątrz) | — | — | — |

## Uwagi

RDDatePicker jest zamkniętym widgetem kalendarza. Stan daty pobierany jest synchronicznie przez `date()`. Odpowiedź na zmiany polega na polling/query, nie na sygnałach. Używany przez `lib/rddatedialog.cpp` jako dialog modalny. Zmiana daty przez kliknięcie na dzień obsługiwana przez `mousePressEvent()`.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
