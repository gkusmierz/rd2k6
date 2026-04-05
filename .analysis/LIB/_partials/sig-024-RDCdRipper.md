---
partial_id: 024
class_name: RDCdRipper
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCdRipper

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `progressChanged(int step)` | `rip(int first_track, int last_track)` | Na początku ripowania (step=0) | Inicjalizacja paska postępu |
| `progressChanged(int step)` | `rip(int first_track, int last_track)` | Co `step_size` sektorów (`sect > (step+1)*step_size`) | Postęp ripowania (step rośnie od 0 do 4 — `totalSteps()=4`) |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QPushButton` (rip_rip_button) | `clicked()` | `abort()` | `rdlibrary/cdripper.cpp:464`, `rdlibrary/disk_ripper.cpp` (podczas ripowania) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `progressChanged(int)` | `QProgressBar` (rip_bar) | `setValue(int)` | `rdlibrary/cdripper.cpp:466` |
| `progressChanged(int)` | `QProgressBar` (rip_track_bar) | `setValue(int)` | `rdlibrary/disk_ripper.cpp:1053-1054` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| libcdda (cdparanoia) | Napęd CD-ROM | `cdda_identify()`, `cdda_open()`, `cdda_read()` | Odczyt audio z CD jako PCM; zapis przez libsndfile do WAV |

## Uwagi
Operacja `rip()` jest synchroniczna (blokuje wątek UI, przeplata się z `qApp->processEvents()`). `totalSteps()` zawsze = 4 (4 kroki postępu niezależnie od długości ścieżki). Plik wynikowy to WAV 32-bit.
