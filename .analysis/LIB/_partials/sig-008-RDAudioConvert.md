---
partial_id: 8
class_name: RDAudioConvert
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDAudioConvert

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma sekcji `signals:` pomimo Q_OBJECT)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie deklaruje żadnych sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDAudioConvert nie ma slotów)*

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| — | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)
*(brak — RDAudioConvert nie inicjuje connect() na innych obiektach)*

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|------------|---------|--------------|------------------------------|
| — | — | — | — |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
*(brak — klasa operuje lokalnie na plikach audio, bez IPC)*

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| — | — | — | — |

## Uwagi
- Klasa jest synchroniczna — metoda `convert()` blokuje wywołujący wątek do zakończenia konwersji.
- ErrorCode zwracany bezpośrednio przez wartość z `convert()`.
- Używana przez `RDAudioImport`, `RDAudioExport` oraz `RDImportAudio` jako narzędzie low-level do konwersji formatu.
