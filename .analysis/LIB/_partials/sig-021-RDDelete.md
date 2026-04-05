---
partial_id: 021
class_name: RDDelete
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDDelete

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| (brak) | — | — | Klasa nie posiada sygnałów Qt |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak) | — | — | Brak slotów |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak) | — | — | Klasa nie definiuje connect() |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| CURL (libcurl) | Serwer HTTP/FTP | `runDelete()` (synchroniczny) | Usunięcie zasobu pod URL za pomocą HTTP DELETE lub odpowiednika FTP |

## Użytkownicy klasy
- `web/rdxport/podcasts.cpp` — usuwanie plików podcastów
- `rdadmin/edit_feed.cpp` — walidacja URL
- `rdrepld/citadelxds.cpp` — usuwanie replikowanych plików
- `tests/delete_test.cpp` — testy
- Wywołanie synchroniczne `runDelete()` — brak połączeń Qt
