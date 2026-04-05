---
partial_id: 56
class_name: RDPushButton
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDPushButton

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `centerPressed()` | `mousePressEvent()` | `Qt::MidButton` wciśnięty | Środkowy przycisk myszy wciśnięty |
| `rightPressed()` | `mousePressEvent()` | `Qt::RightButton` wciśnięty | Prawy przycisk myszy wciśnięty |
| `centerReleased()` | `mouseReleaseEvent()` | `Qt::MidButton` zwolniony | Środkowy przycisk myszy zwolniony |
| `centerClicked()` | `mouseReleaseEvent()` | `Qt::MidButton` + kursor wewnątrz widgetu | Kliknięcie środkowym przyciskiem (bez parametrów) |
| `centerClicked(int id, const QPoint &pt)` | `mouseReleaseEvent()` | `Qt::MidButton` + kursor wewnątrz widgetu | Kliknięcie środkowym przyciskiem z ID i pozycją |
| `rightReleased()` | `mouseReleaseEvent()` | `Qt::RightButton` zwolniony | Prawy przycisk myszy zwolniony |
| `rightClicked()` | `mouseReleaseEvent()` | `Qt::RightButton` + kursor wewnątrz widgetu | Kliknięcie prawym przyciskiem (bez parametrów) |
| `rightClicked(int id, const QPoint &pt)` | `mouseReleaseEvent()` | `Qt::RightButton` + kursor wewnątrz widgetu | Kliknięcie prawym przyciskiem z ID i pozycją |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `flash_timer` (QTimer, wewnętrzny) | `timeout()` | `tickClock()` | `lib/rdpushbutton.cpp:349` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `rightClicked(int, const QPoint &)` | rdlogmanager/edit_grid (edit_hour_button[i][j]) | `rightHourButtonData(int, const QPoint &)` | `rdlogmanager/edit_grid.cpp:63,79` |

## Uwagi

RDPushButton rozszerza QPushButton o obsługę środkowego i prawego przycisku myszy. Standardowy `clicked()` z QPushButton jest dziedziczony i szeroko używany (np. w rdlogmanager). Sygnały środkowe/prawe używane w griddzie harmonogramu (edit_grid) do kontekstowych operacji na slotach godzinowych.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
