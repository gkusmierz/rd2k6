---
partial_id: 031
class_name: RDSlotBox
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDSlotBox

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `doubleClicked()` | `mouseDoubleClickEvent(QMouseEvent*)` | zawsze przy podwójnym kliknięciu | Użytkownik otworzył widget podwójnym kliknięciem (edit koszyka) |
| `cartDropped(unsigned cartnum)` | `dropEvent(QDropEvent*)` | gdy drop zawiera poprawny numer koszyka | Koszyk został upuszczony na slot; cartnum=0 jeśli brak koszyka |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak wewnętrznych connect — klasa obsługuje eventy myszy bezpośrednio przez override) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `doubleClicked()` | `RDCartSlot` | `doubleClickedData()` | `rdcartslot.cpp:107` |
| `cartDropped(unsigned)` | `RDCartSlot` | `cartDroppedData(unsigned)` | `rdcartslot.cpp:108` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
