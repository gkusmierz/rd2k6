---
partial_id: 064
class_name: RDTimeEdit
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDTimeEdit

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `valueChanged(const QTime &time)` | `upClickedData()` | Po każdej zmianie wartości (strzałka w górę) dla sekcji: sekundy, minuty, tenths, godziny | Użytkownik zwiększył wartość wybranej sekcji czasu |
| `valueChanged(const QTime &time)` | `downClickedData()` | Po każdej zmianie wartości (strzałka w dół) dla sekcji: sekundy, minuty, tenths, godziny | Użytkownik zmniejszył wartość wybranej sekcji czasu |
| `valueChanged(const QTime &time)` | `ProcessKey(int key)` | Po wprowadzeniu cyfry z klawiatury (fokus na polu) | Użytkownik wpisał cyfrę bezpośrednio w polu czasu |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `edit_up_button` (RDTransportButton::Up) | `clicked()` | `upClickedData()` | `lib/rdtimeedit.cpp:68` |
| `edit_down_button` (RDTransportButton::Down) | `clicked()` | `downClickedData()` | `lib/rdtimeedit.cpp:71` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `valueChanged(const QTime &)` | `EditEvent` (rdlogedit) | `timeChangedData(const QTime &)` | `rdlogedit/edit_event.cpp:53-54` |
| `valueChanged(const QTime &)` | `EditEvent` (rdairplay) | `timeChangedData(const QTime &)` | `rdairplay/edit_event.cpp:46-47` |

## Uwagi architektoniczne

- Widget używa trybu wyświetlania (`display`) ustawiany przez `setDisplay(uint)` — kombinacja flag: `Hours | Minutes | Seconds | Tenths`.
- `rdlogmanager/edit_eventline.cpp` i `rdlibrary/edit_cart.cpp` tworzą instancje RDTimeEdit, ale nie podłączają `valueChanged` — używają wartości tylko przy zatwierdzeniu (OK).
- Zdarzenia myszy (`mousePressEvent`, `wheelEvent`) i klawiatury (`keyPressEvent`) obsługiwane bezpośrednio bez sygnałów — delegują do `ProcessKey()` i metod up/down.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(brak — widget lokalny bez komunikacji IPC)
