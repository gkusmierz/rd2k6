---
partial_id: 14
class_name: RDPeaksExport
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDPeaksExport

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
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runExport()` → `curl_easy_perform()` | Pobiera dane energii (peaks) dla cięcia z serwera przez rdxport API; odpowiedź trafia do bufora przez `RDPeaksExportWrite` callback |

## Użytkownicy klasy (wywołania z zewnątrz)
- `lib/rdedit_audio.cpp` — tworzy `RDPeaksExport`, wywołuje `runExport()`, następnie odczytuje energię przez `readEnergy()` dla renderowania waveformu
- `lib/rdwavepainter.cpp` — tworzy `RDPeaksExport()`, ładuje peaks dla wyświetlania w waveform painterze

## Uwagi
- Klasa NIE dziedziczy z QObject mimo `Q_OBJECT` nieobecnego — nie ma mechanizmu sygnałów.
- `runExport()` blokuje synchronicznie do zakończenia transferu HTTP.
- Dane peaks dostępne przez: `energySize()`, `energy(frame)`, `readEnergy(buf, count)`.
- Bufor `conv_energy_data` wypełniany przez callback CURL `RDPeaksExportWrite` podczas `runExport()`.
