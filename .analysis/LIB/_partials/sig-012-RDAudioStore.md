---
partial_id: 12
class_name: RDAudioStore
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDAudioStore

## Sygnały emitowane (klasa jako nadawca)
*(brak — klasa nie ma sekcji `signals:`)*

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| — | — | — | Klasa nie deklaruje żadnych sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
*(brak — RDAudioStore nie ma publicznych slotów)*

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
| HTTP/CURL (libcurl) | rdxport (serwer Rivendell) | `runStore()` → `curl_easy_perform()` | Pobiera informacje o zajętości dysku audio z serwera przez rdxport API |

## Użytkownicy klasy (wywołania z zewnątrz)
- `rdlibrary/disk_gauge.cpp` — `DiskGauge::update()` (wywoływane przez QTimer co 100ms) tworzy instancję i odpytuje `runStore()` dla wyświetlenia wskaźnika wolnego miejsca
- `rdmonitor/rdmonitor.cpp` — `MainWidget::validate()` odpytuje `RDAudioStoreValid()` (free function wrapper)
- `rdselect/rdselect.cpp` — `MainWidget::SetCurrentItem()` odpytuje `RDAudioStoreValid()`

## Uwagi
- Klasa jest synchroniczna — `runStore()` blokuje do zakończenia zapytania HTTP.
- Wynik dostępny przez: `freeBytes()`, `totalBytes()`.
- Istnieje wolna funkcja `RDAudioStoreValid(RDConfig*)` jako uproszczony wrapper.
