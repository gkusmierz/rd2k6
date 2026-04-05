---
partial_id: "079"
class: RDEditAudio
source: lib/rdedit_audio.h, lib/rdedit_audio.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDEditAudio

## Rola
Zaawansowany edytor audio z wizualizacją waveform i pełnym zestawem markerów. Umożliwia precyzyjne ustawianie 11 typów cue pointów (Play, Start, End, Segue Start/End, Talk Start/End, Hook Start/End, FadeUp, FadeDown), nawigację po waveformie, zoom, playback z loopingiem, trim head/tail, oraz regulację gainu. Centralny dialog edycji audio w Rivendell (rdlibrary).

## Hierarchia
- **Dziedziczy z:** RDDialog
- **Zawiera:** RDMarkerButton[11], RDMarkerEdit[11], RDStereoMeter, RDTransportButton (loop/play_start/play_cursor/pause/stop), RDPeaksExport, RDCut, QScrollBar, Q3PopupMenu

## Konstruktor
```
RDEditAudio(RDCart *cart, QString cut_name, int card, int port,
            int preroll, int trim_level, QWidget *parent=0)
```

## Enumy
| Enum | Wartości | Opis |
|------|----------|------|
| `CuePoints` | Play=0, Start=1, End=2, SegueStart=3, SegueEnd=4, TalkStart=5, TalkEnd=6, HookStart=7, HookEnd=8, FadeUp=9, FadeDown=10, LastMarker=11 | Typy markerów audio |
| `Arrow` | None=0, Left=1, Right=2 | Kierunek strzałki kursora |
| `PlayMode` | FromStart=1, FromCursor=2, Region=3 | Tryby odtwarzania |
| `GainChange` | GainNone=0, GainUp=1, GainDown=2 | Kierunek zmiany gainu |

## Sygnały
Brak zadeklarowanych sygnałów (dialog modalny).

## Sloty prywatne — Transport
| Slot | Opis |
|------|------|
| `playStartData()` | Odtwarzanie od początku |
| `playCursorData()` | Odtwarzanie od pozycji kursora |
| `pauseData()` | Pauza odtwarzania |
| `stopData()` | Zatrzymanie odtwarzania |
| `loopData()` | Przełączenie trybu loopingu |
| `playedData(int handle)` | Zdarzenie rozpoczęcia playback |
| `pausedData(int handle)` | Zdarzenie pauzy |
| `positionData(int handle, unsigned pos)` | Aktualizacja pozycji playback |

## Sloty prywatne — Zoom/Nawigacja
| Slot | Opis |
|------|------|
| `xFullIn()` | Zoom do pełnego zbliżenia |
| `xUp()` | Zoom in (powiększenie) |
| `xDown()` | Zoom out (pomniejszenie) |
| `xFullOut()` | Zoom do pełnego widoku |
| `yUp()` | Zwiększenie amplitudy wyświetlania |
| `yDown()` | Zmniejszenie amplitudy wyświetlania |
| `gotoCursorData()` | Skok do pozycji kursora |
| `gotoHomeData()` | Skok do początku |
| `gotoEndData()` | Skok do końca |
| `hscrollData(int)` | Przewijanie poziome (scrollbar) |

## Sloty prywatne — Markery
| Slot | Opis |
|------|------|
| `cuePointData(int)` | Kliknięcie przycisku markera — aktywacja edycji |
| `cueEditData(int)` | Ręczna edycja wartości markera |
| `cueEscData(int)` | Anulowanie edycji markera (Escape) |
| `updateMenuData()` | Aktualizacja menu kontekstowego |
| `deleteSegueData()` | Usunięcie markerów Segue |
| `deleteFadeupData()` | Usunięcie markera FadeUp |
| `deleteFadedownData()` | Usunięcie markera FadeDown |
| `deleteTalkData()` | Usunięcie markerów Talk |
| `deleteHookData()` | Usunięcie markerów Hook |

## Sloty prywatne — Edycja audio
| Slot | Opis |
|------|------|
| `trimHeadData()` | Automatyczny trim początku (na podstawie poziomu) |
| `trimTailData()` | Automatyczny trim końca (na podstawie poziomu) |
| `gainUpPressedData()` | Rozpoczęcie zwiększania gainu |
| `gainDownPressedData()` | Rozpoczęcie zmniejszania gainu |
| `gainChangedData()` | Zmiana wartości gainu |
| `gainReleasedData()` | Zwolnienie przycisku gainu |
| `gainTimerData()` | Timer ciągłej zmiany gainu |
| `removeButtonData()` | Usunięcie audio (przycisk Remove) |
| `meterData()` | Odświeżanie wskazań VU-metra |
| `saveData()` | Zapis markerów i zamknięcie dialogu |
| `cancelData()` | Anulowanie i zamknięcie dialogu |

## Metody prywatne — Rendering
| Metoda | Opis |
|--------|------|
| `DrawMaps()` | Renderowanie bitmap waveform |
| `DrawWave(...)` | Rysowanie waveformu dla kanału |
| `DrawCursors(...)` | Rysowanie wszystkich kursorów na waveformie |
| `DrawCursor(...)` | Rysowanie pojedynczego kursora |
| `EraseCursor(...)` | Kasowanie kursora |
| `DrawPointers()` | Rysowanie wskaźników markerów |
| `UpdateCursors()` | Aktualizacja pozycji kursorów |
| `CenterDisplay()` | Centrowanie widoku na aktywnym kursorze |

## Metody prywatne — Logika
| Metoda | Opis |
|--------|------|
| `DeleteMarkerData(int id)` | Usuwanie markera o podanym ID |
| `PreRoll(int cursor, CuePoints)` | Odtwarzanie z pre-rollem przed markerem |
| `PositionCursor(int cursor, bool relative)` | Pozycjonowanie kursora |
| `ValidateMarkers()` | Walidacja spójności markerów (np. Start < End) |
| `SaveMarkers()` | Zapis markerów do bazy |
| `LoopRegion(int cursor0, int cursor1)` | Loop wybranego regionu |
| `UpdateCounters()` | Aktualizacja wyświetlaczy czasu |
| `GetTime(int samples)` | Konwersja próbek na czas |

## Zdarzenia UI
- `paintEvent` — renderowanie waveformu
- `mouseMoveEvent` — przeciąganie kursorów
- `mousePressEvent` / `mouseReleaseEvent` — interakcja z waveformem
- `keyPressEvent` — skróty klawiszowe
- `closeEvent` — zamykanie dialogu

## Stałe konfiguracyjne
| Stała | Wartość | Opis |
|-------|---------|------|
| `EDITAUDIO_WIDGET_WIDTH` | 834 | Szerokość dialogu |
| `EDITAUDIO_WIDGET_HEIGHT` | 680 | Wysokość dialogu |
| `EDITAUDIO_WAVEFORM_WIDTH` | 717 | Szerokość waveformu |
| `EDITAUDIO_WAVEFORM_HEIGHT` | 352 | Wysokość waveformu |
| `EDITAUDIO_TAIL_PREROLL` | 1500 | Pre-roll dla tail w ms |
| `EDITAUDIO_DEFAULT_GAIN` | -12 | Domyślny gain w dB |

## Stan wewnętrzny
- `edit_cut` — edytowany cut (RDCut)
- `edit_peaks` — dane peaks (RDPeaksExport)
- `edit_cursors[11]` — pozycje kursorów (sample-based)
- `edit_energy` / `energy_data` — dane energii audio
- `edit_factor_x` / `edit_max_factor_x` — zoom factor
- `is_playing`, `is_paused`, `is_stopped` — stan transportu
- `use_looping`, `is_looping` — tryb loopingu
- `edit_cue_point` — aktualnie edytowany marker
- `edit_play_mode` — aktualny tryb odtwarzania

## Zależności
- **RDCut** — dane audio/markery
- **RDCart** — karta (metadane)
- **RDPeaksExport** — pobranie danych peak z serwera
- **RDMarkerButton** — przyciski markerów (11 sztuk)
- **RDMarkerEdit** — pola edycji wartości markerów (11 + gain)
- **RDStereoMeter** — VU-metr stereo
- **RDTransportButton** — przyciski transportowe
