---
partial_id: 50
class_name: RDCardSelector
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCardSelector

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `cardChanged(int card)` | `cardData(int)` (private slot) | Zawsze po zmianie numeru karty | Użytkownik wybrał nowy numer karty dźwiękowej |
| `settingsChanged(int id, int card, int port)` | `cardData(int)` (private slot) | Zawsze po zmianie karty | Kompletny zestaw ustawień (id+karta+port) się zmienił |
| `portChanged(int port)` | `portData(int)` (private slot) | Zawsze po zmianie numeru portu | Użytkownik wybrał nowy numer portu |
| `settingsChanged(int id, int card, int port)` | `portData(int)` (private slot) | Zawsze po zmianie portu | Kompletny zestaw ustawień (id+karta+port) się zmienił |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `card_card_box` (QSpinBox) | `valueChanged(int)` | `cardData(int)` | `lib/rdcardselector.cpp:54` |
| `card_port_box` (QSpinBox) | `valueChanged(int)` | `portData(int)` | `lib/rdcardselector.cpp:68` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `cardChanged(int)` | rdadmin/edit_decks (edit_record_selector) | `recordCardChangedData(int)` | `rdadmin/edit_decks.cpp:88` |
| `settingsChanged(int,int,int)` | rdadmin/edit_decks (edit_play_selector) | `playSettingsChangedData(int,int,int)` | `rdadmin/edit_decks.cpp:263` |
| `settingsChanged(int,int,int)` | rdadmin/edit_rdairplay (air_card_sel[0..9]) | `audioSettingsChangedData(int,int,int)` | `rdadmin/edit_rdairplay.cpp:120,153,186,219,282,329,362,395,428,461` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
