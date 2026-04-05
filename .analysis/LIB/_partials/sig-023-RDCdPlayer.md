---
partial_id: 023
class_name: RDCdPlayer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCdPlayer

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `ejected()` | `clockData()` | `ioctl(CDROM_MEDIA_CHANGED)` zwraca błąd AND poprzedni stan był "jest nośnik" | Nośnik CD wysunięty |
| `mediaChanged()` | `clockData()` | `ioctl(CDROM_MEDIA_CHANGED)` zwraca OK AND poprzedni stan był "brak nośnika" | Nowy nośnik CD włożony |
| `played(int track)` | `clockData()` | `CDROMSUBCHNL` → `CDROM_AUDIO_PLAY` AND zmiana stanu | Odtwarzanie CD rozpoczęte; parametr = numer ścieżki |
| `paused()` | `clockData()` | `CDROMSUBCHNL` → `CDROM_AUDIO_PAUSED` AND zmiana stanu | Odtwarzanie CD wstrzymane |
| `stopped()` | `clockData()` | `CDROMSUBCHNL` → COMPLETED / ERROR / NO_STATUS AND zmiana stanu; lub brak danych subkanału | Odtwarzanie CD zatrzymane |
| `leftVolumeChanged(int vol)` | `setLeftVolume(int vol)` | Nowa wartość != aktualna głośność kanału 0 | Zmiana głośności lewego kanału |
| `rightVolumeChanged(int vol)` | `setRightVolume(int vol)` | Nowa wartość != aktualna głośność kanału 1 | Zmiana głośności prawego kanału |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer` (cdrom_button_timer) | `timeout()` | `buttonTimerData()` | `lib/rdcdplayer.cpp:51` (konstruktor) |
| `QTimer` (cdrom_clock) | `timeout()` | `clockData()` | `lib/rdcdplayer.cpp:57` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `ejected()` | `DiskRipper` | `ejectedData()` | `rdlibrary/disk_ripper.cpp:68` |
| `ejected()` | `CdRipper` | `ejectedData()` | `rdlibrary/cdripper.cpp:71` |
| `ejected()` | `RDDiscImport` | `ejectData()` | `utils/rddiscimport/rddiscimport.cpp:90` |
| `mediaChanged()` | `DiskRipper` | `mediaChangedData()` | `rdlibrary/disk_ripper.cpp:69` |
| `mediaChanged()` | `CdRipper` | `mediaChangedData()` | `rdlibrary/cdripper.cpp:72` |
| `mediaChanged()` | `RDDiscImport` | `mediaChangedData()` | `utils/rddiscimport/rddiscimport.cpp:89` |
| `played(int)` | `DiskRipper` | `playedData(int)` | `rdlibrary/disk_ripper.cpp:70` |
| `played(int)` | `CdRipper` | `playedData(int)` | `rdlibrary/cdripper.cpp:73` |
| `stopped()` | `DiskRipper` | `stoppedData()` | `rdlibrary/disk_ripper.cpp:71` |
| `stopped()` | `CdRipper` | `stoppedData()` | `rdlibrary/cdripper.cpp:74` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| ioctl (CDROM) | Kernel CD-ROM driver | CDROMPLAYMSF, CDROMPAUSE, CDROMRESUME, CDROMSTOP, CDROMEJECT, CDROM_LOCKDOOR | Kontrola fizycznego napędu CD przez interfejs jądra systemu |

## Uwagi
Klasa odpytuje stan napędu co `RDCDPLAYER_CLOCK_INTERVAL` ms (timer). Operacje na napędzie (Play/Pause/Stop/Eject) są kolejkowane przez `PushButton()` i wykonywane przez osobny timer buttonowy z opóźnieniem `RDCDPLAYER_BUTTON_DELAY`. Odczyt TOC przy `mediaChanged`.
