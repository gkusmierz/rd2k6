---
partial_id: 11
class_name: RDAudioInfo
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDAudioInfo

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma sekcji `signals:`)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie deklaruje żadnych sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDAudioInfo nie ma publicznych slotów)*

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
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runInfo()` → `curl_easy_perform()` | Pobiera metadane audio (format, kanały, sample rate, bitrate, frames, length) z serwera przez rdxport API |

## Użytkownicy klasy (wywołania z zewnątrz)
- `lib/rdedit_audio.cpp` — tworzy instancję, wywołuje `runInfo()` by pobrać sample_rate/frames/channels dla edytora
- `utils/rdexport/rdexport.cpp` — `MainObject::ExportCut()` pobiera info o audio przed eksportem
- `utils/rdmarkerset/rdmarkerset.cpp` — `MainObject::ClearAutoTrim()` sprawdza długość audio

## Uwagi
- Klasa jest synchroniczna — `runInfo()` blokuje do zakończenia zapytania HTTP.
- Wynik dostępny przez gettery: `format()`, `channels()`, `sampleRate()`, `bitRate()`, `frames()`, `length()`.
- Parsuje XML odpowiedzi przez prywatną metodę `ParseInt()`.
