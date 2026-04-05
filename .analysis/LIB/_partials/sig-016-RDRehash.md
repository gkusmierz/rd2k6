---
partial_id: 16
class_name: RDRehash
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDRehash

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma sekcji `signals:`)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie deklaruje żadnych sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDRehash nie ma publicznych slotów)*

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| — | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)
*(brak — klasa nie wywołuje connect() na innych obiektach)*

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|------------|---------|--------------|------------------------------|
| — | — | — | — |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runRehash()` → `curl_easy_perform()` | Zleca przeliczenie skrótu (hash) audio dla danego cięcia po stronie serwera rdxport |

## Użytkownicy klasy (wywołania z zewnątrz)
- `utils/rdmaint/rdmaint.cpp` — używa statycznej metody `RDRehash::rehash(station, user, config, cartnum, cutnum)` do rehashowania audio podczas konserwacji bazy
- `rdlibrary/record_cut.cpp` — wywołuje `RDRehash::rehash()` po nagraniu nowego cięcia
- `rdlogedit/voice_tracker.cpp` — wywołuje `RDRehash::rehash()` po zakończeniu nagrywania voice trackera

## Uwagi
- Klasa jest synchroniczna — `runRehash()` blokuje do zakończenia operacji HTTP.
- Istnieje statyczna metoda pomocnicza `RDRehash::rehash(station, user, config, cartnum, cutnum)` tworząca wewnętrznie instancję i zwracająca ErrorCode.
- Prywatna metoda `rehash()` (bez argumentów) jest właściwą implementacją operacji HTTP.
- Callback CURL: `__RDRehashCallback` (wolna funkcja plikowa).
