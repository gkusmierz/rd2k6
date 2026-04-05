---
partial_id: 49
class_name: RDSlider
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDSlider

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `valueChanged(int value)` | `keyPressEvent()` | Gdy wartość się zmienia + `tracking_enabled == true` | Klawisz Home/End/PgUp/PgDn zmienił pozycję suwaka |
| `valueChanged(int value)` | `mouseMoveEvent()` | Gdy wartość się zmienia + `tracking_enabled == true` | Ruch myszy zmienił pozycję suwaka |
| `valueChanged(int value)` | `wheelEvent()` | Gdy wartość się zmienia + `tracking_enabled == true` | Kółko myszy zmieniło pozycję suwaka |
| `valueChanged(int value)` | `mouseReleaseEvent()` | `deferred_change == true` (tracking wyłączony) | Zwolnienie myszy po ruchu (tryb non-tracking) |
| `sliderMoved(int value)` | `keyPressEvent()` | Po każdym ruchu klawiaturą | Suwak przesunięty przez klawiaturę |
| `sliderMoved(int value)` | `mouseMoveEvent()` | Po każdym ruchu myszą | Suwak przesunięty przez mysz |
| `sliderMoved(int value)` | `wheelEvent()` | Po każdym ruchu kółkiem | Suwak przesunięty przez kółko myszy |
| `sliderPressed()` | `mousePressEvent()` | `Qt::LeftButton` | Użytkownik wcisnął suwak |
| `sliderReleased()` | `mouseReleaseEvent()` | `Qt::LeftButton` | Użytkownik puścił suwak |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| RDSlider (wewnętrzny — self) | (brak zewnętrznych) | — | — |
| RDCueEdit (jako `edit_slider`) | — używa SIGNAL/SLOT | `sliderMoved`, `sliderPressed`, `sliderReleased` | `lib/rdcueedit.cpp:77-81` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `sliderMoved(int)` | RDCueEdit | `sliderChangedData(int)` | `lib/rdcueedit.cpp:77` |
| `sliderPressed()` | RDCueEdit | `sliderPressedData()` | `lib/rdcueedit.cpp:79` |
| `sliderReleased()` | RDCueEdit | `sliderReleasedData()` | `lib/rdcueedit.cpp:80` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
