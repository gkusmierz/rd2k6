---
partial_id: 59
class_name: RDLineEdit
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDLineEdit

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `escapePressed()` | `keyPressEvent()` | `e->key() == Qt::Key_Escape` | Użytkownik nacisnął klawisz Escape w polu tekstowym |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak zewnętrznych connect() do RDLineEdit — obsługuje zdarzenia klawiaturowe bezpośrednio) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak znalezionych connect() z SIGNAL(escapePressed) poza zakresem wyszukiwania) | — | — | — |

## Uwagi

RDLineEdit rozszerza QLineEdit o obsługę klawisza Escape. Sygnał `escapePressed()` umożliwia anulowanie edycji. Klasa jest minimalnym wrapperem — jedyna różnica w stosunku do QLineEdit to `keyPressEvent()` i sygnał `escapePressed()`. Używana jako baza lub bezpośrednio w formularzach wymagających obsługi Escape.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
