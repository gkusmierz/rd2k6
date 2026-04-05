---
partial_id: 020
class_name: RDUpload
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDUpload

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `progressChanged(int step)` | `UpdateProgress(int step)` | Wywołanie przez curl callback `UploadProgressCallback` w trakcie wysyłania | Zmiana postępu wysyłania pliku (step = ilość wysłanych bajtów) |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak bezpośrednich Qt-connects) | — | — | `UpdateProgress()` wywoływane przez C-callback curl |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `progressChanged(int)` | `QProgressBar` | `setValue(int)` | Brak — użytkownicy nie łączą progressChanged z RDUpload (wywołanie synchroniczne) |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| CURL (libcurl) | Serwer FTP/SFTP/FTPS/file | `runUpload()` (synchroniczny) | Wysyłanie pliku na URL; obsługa: file://, ftp://, ftps://, sftp:// |

## Użytkownicy klasy
- `rdcatchd/batch.cpp` — wysyłanie pliku po nagraniu
- `web/rdxport/podcasts.cpp` — upload podcastów
- `rdadmin/edit_feed.cpp` — walidacja URL
- `rdrepld/citadelxds.cpp` — replikacja
- `tests/upload_test.cpp` — testy
- Wywołanie synchroniczne `runUpload()` — brak połączeń Qt do klasy z zewnątrz
