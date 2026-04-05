---
partial_id: 007
class_name: RDEventPlayer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDEventPlayer

## Sygnały emitowane (klasa jako nadawca)

(brak — klasa nie definiuje żadnych sygnałów Qt; nie zawiera sekcji `signals:` w nagłówku)

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QSignalMapper *player_mapper` | `mapped(int)` | `macroFinishedData(int)` | `lib/rdevent_player.cpp:34` (konstruktor) |
| `QTimer *player_timer` | `timeout()` | `macroTimerData()` | `lib/rdevent_player.cpp:37` (konstruktor) |
| `RDMacroEvent *player_events[i]` | `finished()` | `player_mapper->map()` (→ macroFinishedData) | `lib/rdevent_player.cpp:55` (dynamicznie w `exec()`) |

## Połączenia wychodzące (klasa jako nadawca connect)

RDEventPlayer nie emituje sygnałów — komunikuje się przez aggregację RDMacroEvent.

## Wzorzec działania (bez sygnałów)

RDEventPlayer jest fasadą do asynchronicznego wykonania RML. Używa puli `RDEVENT_PLAYER_MAX_EVENTS` (10) obiektów RDMacroEvent. Gdy skrypt zakończy działanie (`finished()`), `macroTimerData()` usuwa (delete) zakończone obiekty. Klasa jest wywoływana przez:
- `RDLogPlay` — do wykonania RML przy starcie/zatrzymaniu kanału
- `RDCueEdit` — do wykonania start/stop RML przy audycji
- `RDSoundPanel` — do obsługi przycisków panelu dźwiękowego
- `rdairplay`, `rdvairplayd`, `rdpanel`, `rdcartslots` — tworzą instancję `RDEventPlayer` i przekazują do modułów bibliotecznych

## Q_PROPERTY reactive bindings

(brak — projekt Qt4)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| Przez RDMacroEvent → RDRipc | Sieć RML | `player_events[i]->exec()` | Pośrednio wysyła polecenia RML przez RDRipc do zdalnych stacji |
| Przez RDMacroEvent → RDRipc | Lokalny RIPC | `exec(unsigned cartnum)` → EX komenda | Wykonuje cart makro przez RIPC (konwersja cartnum→RML string) |
