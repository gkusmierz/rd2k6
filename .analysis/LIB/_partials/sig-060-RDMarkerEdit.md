---
partial_id: 60
class_name: RDMarkerEdit
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDMarkerEdit

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `escapePressed()` | `keyPressEvent()` | `e->key() == Qt::Key_Escape` | Użytkownik nacisnął Escape podczas edycji markera |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak zewnętrznych connect() — obsługuje zdarzenia klawiaturowe bezpośrednio) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[Start]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:278` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[End]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:307` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[TalkStart]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:336` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[TalkEnd]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:365` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[SegueStart]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:396` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[SegueEnd]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:426` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[FadeUp]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:454` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[FadeDown]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:482` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[HookStart]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:512` |
| `escapePressed()` | `lib/rdedit_audio` (edit_cursor_edit[HookEnd]) | `esc_mapper->map()` | `lib/rdedit_audio.cpp:543` |

## Uwagi

RDMarkerEdit rozszerza QLineEdit (nie RDLineEdit) o obsługę Escape. Używany wyłącznie w `lib/rdedit_audio.cpp` jako pola edycji pozycji markerów audio (Start, End, TalkStart, TalkEnd, SegueStart, SegueEnd, FadeUp, FadeDown, HookStart, HookEnd + edit_gain_edit). Escape jest routowany przez QSignalMapper (`esc_mapper`) do ujednoliconego handlera. Instancje są zwykle w trybie `readOnly` — edycja przez mysz na falogramie.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
