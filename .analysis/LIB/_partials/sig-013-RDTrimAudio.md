---
partial_id: 13
class_name: RDTrimAudio
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDTrimAudio

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma sekcji `signals:`)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie deklaruje żadnych sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDTrimAudio nie ma publicznych slotów)*

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
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runTrim()` → `curl_easy_perform()` | Wysyła żądanie auto-trim do rdxport; serwer oblicza start/end point i zwraca w XML |

## Użytkownicy klasy (wywołania z zewnątrz)
- `utils/rdmarkerset/rdmarkerset.cpp` — `MainObject::SetAutoTrim()` tworzy instancję, ustawia cart/cut/level, wywołuje `runTrim()` synchronicznie; po sukcesie odczytuje `startPoint()`/`endPoint()` i aktualizuje cut markers

## Uwagi
- Klasa jest synchroniczna — `runTrim()` blokuje do zakończenia operacji HTTP.
- Wynik dostępny przez: `startPoint()`, `endPoint()` po sukcesie.
- `trimLevel` podawany w 1/100 dB (np. `-4000` = -40 dBFS).
- Parsuje XML odpowiedzi przez prywatne metody `ParseXml()`/`ParsePoint()`.
