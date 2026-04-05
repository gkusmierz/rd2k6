---
partial_id: 9
class_name: RDAudioExport
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDAudioExport

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `strobe()` | — | — | Zadeklarowany w `signals:`, lecz nie znaleziono `emit strobe()` w `rdaudioexport.cpp`. Sygnał prawdopodobnie zdefiniowany lecz nieużywany (martwy kod) lub emitowany przez callback CURL `ExportProgressCallback`. |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDAudioExport nie ma publicznych slotów)*

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
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runExport()` → `curl_easy_perform()` | Pobiera audio z serwera przez rdxport API; odpowiedź parsowana przez `ExportProgressCallback` |

## Użytkownicy klasy (wywołania z zewnątrz)
- `lib/rdimport_audio.cpp` — `RDImportAudio::Export()` tworzy instancję i wywołuje `runExport()` synchronicznie
- `utils/rdexport/rdexport.cpp` — `MainObject::ExportCut()` tworzy instancję i wywołuje `runExport()` synchronicznie

## Uwagi
- Klasa jest synchroniczna — `runExport()` blokuje do zakończenia transferu HTTP.
- `abort()` — metoda publiczna (nie slot) do przerwania trwającego eksportu.
- `strobe()` zadeklarowany jako sygnał, ale emisja nie jest widoczna w kodzie CPP — prawdopodobnie wywołany z callbacku CURL lub martwy kod.
