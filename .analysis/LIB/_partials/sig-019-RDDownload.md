---
partial_id: 019
class_name: RDDownload
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDDownload

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `progressChanged(int step)` | `UpdateProgress(int step)` | Wywołanie przez curl callback `DownloadProgressCallback` w trakcie pobierania | Zmiana postępu pobierania pliku (step = ilość pobranych bajtów) |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak bezpośrednich Qt-connects) | — | — | `UpdateProgress()` wywoływane przez C-callback curl, nie przez Qt signal |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `progressChanged(int)` | `QProgressBar` (rip_track_bar / rip_bar) | `setValue(int)` | `rdlibrary/disk_ripper.cpp:1053`, `rdlibrary/cdripper.cpp:466` (przez RDCdRipper wrapper) |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| CURL (libcurl) | Serwer HTTP/FTP/SFTP | `runDownload()` (synchroniczny) | Pobieranie pliku z URL; obsługa: file://, ftp://, ftps://, http://, https://, sftp:// |

## Użytkownicy klasy
- `rdcatchd/batch.cpp` — pobieranie pliku dla zadań nagrań
- `tests/download_test.cpp` — testy
- Wywołanie synchroniczne `runDownload()` — brak połączeń Qt do klasy z zewnątrz
