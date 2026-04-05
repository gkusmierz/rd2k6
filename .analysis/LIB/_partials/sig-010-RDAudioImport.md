---
partial_id: 10
class_name: RDAudioImport
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDAudioImport

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma sekcji `signals:`)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie deklaruje żadnych sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDAudioImport nie ma publicznych slotów)*

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
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runImport()` → `curl_easy_perform()` | Wysyła plik audio na serwer przez rdxport API |

## Użytkownicy klasy (wywołania z zewnątrz)
- `lib/rdimport_audio.cpp` — `RDImportAudio::Import()` tworzy instancję, ustawia parametry i wywołuje `runImport()` synchronicznie
- `lib/rdcart_dialog.cpp` — `RDCartDialog::loadFileData()` tworzy instancję i wywołuje `runImport()` synchronicznie
- `utils/rddiscimport/`, `utils/rdimport/`, `utils/rddgimport/`, `rdlibrary/` — różne miejsca importu audio

## Uwagi
- Klasa jest synchroniczna — `runImport()` blokuje do zakończenia transferu HTTP.
- Delegate do `RDAudioConvert` dla lokalnej konwersji formatu przed wysłaniem.
- `aborting()` — odczyt flagi przerwania; `abort()` — prawdopodobnie metoda publiczna ustawia flagę `conv_aborting`.
