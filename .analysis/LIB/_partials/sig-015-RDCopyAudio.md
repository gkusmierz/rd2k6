---
partial_id: 15
class_name: RDCopyAudio
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCopyAudio

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma Q_OBJECT ani sekcji `signals:`)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie jest QObject, nie ma sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — klasa nie jest QObject)*

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| — | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)
*(brak)*

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|------------|---------|--------------|------------------------------|
| — | — | — | — |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runCopy()` → `curl_easy_perform()` | Wysyła żądanie skopiowania audio między cięciami na serwerze przez rdxport API |

## Użytkownicy klasy (wywołania z zewnątrz)
- `lib/rdcut.cpp` — `RDCut::copyTo()` (lub podobna statyczna/instancyjna metoda) tworzy `RDCopyAudio(station, config)`, ustawia source/destination cart/cut i wywołuje `runCopy()`

## Uwagi
- Klasa NIE dziedziczy z QObject — brak mechanizmu sygnałów.
- `runCopy()` blokuje synchronicznie do zakończenia operacji HTTP.
- Operacja serwer-side: kopiowanie odbywa się na serwerze rdxport, nie ma transferu danych binarnych do klienta.
- Parametry: source cart/cut number + destination cart/cut number.
