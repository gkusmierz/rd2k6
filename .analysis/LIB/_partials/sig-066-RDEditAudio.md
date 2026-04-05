---
partial_id: 066
class_name: RDEditAudio
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDEditAudio

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| (brak publicznych sygnałów) | — | — | Dialog modalny — wynik przekazywany przez `done(0)` (zapis) lub `done(1)` (anulowanie) |

## Połączenia przychodzące (klasa jako odbiorca — zewnętrzne)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `rda->cae()` (RDCae) | `playing(int)` | `playedData(int)` | `lib/rdedit_audio.cpp:91` |
| `rda->cae()` (RDCae) | `playStopped(int)` | `pausedData(int)` | `lib/rdedit_audio.cpp:92` |
| `rda->cae()` (RDCae) | `playPositionChanged(int, unsigned)` | `positionData(int, unsigned)` | `lib/rdedit_audio.cpp:93-94` |

## Połączenia przychodzące — wewnętrzne (self-connections)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `button` (QPushButton — Save) | `clicked()` | `saveData()` | `lib/rdedit_audio.cpp:136` |
| `cancel_button` (QPushButton) | `clicked()` | `cancelData()` | `lib/rdedit_audio.cpp:148` |
| `edit_play_cursor_button` | `clicked()` | `playCursorData()` | `lib/rdedit_audio.cpp:158-159` |
| `edit_play_start_button` | `clicked()` | `playStartData()` | `lib/rdedit_audio.cpp:166-167` |
| `edit_pause_button` | `clicked()` | `pauseData()` | `lib/rdedit_audio.cpp:174` |
| `edit_stop_button` | `clicked()` | `stopData()` | `lib/rdedit_audio.cpp:182` |
| `edit_loop_button` | `clicked()` | `loopData()` | `lib/rdedit_audio.cpp:188` |
| `edit_hscroll` (QScrollBar) | `valueChanged(int)` | `hscrollData(int)` | `lib/rdedit_audio.cpp:197` |
| `y_up_button` | `clicked()` | `yUp()` | `lib/rdedit_audio.cpp:207` |
| `y_down_button` | `clicked()` | `yDown()` | `lib/rdedit_audio.cpp:211` |
| `x_full_in_button` | `clicked()` | `xFullIn()` | `lib/rdedit_audio.cpp:222` |
| `x_up_button` | `clicked()` | `xUp()` | `lib/rdedit_audio.cpp:226` |
| `x_down_button` | `clicked()` | `xDown()` | `lib/rdedit_audio.cpp:230` |
| `x_full_button` | `clicked()` | `xFullOut()` | `lib/rdedit_audio.cpp:235` |
| `goto_cursor_button` | `clicked()` | `gotoCursorData()` | `lib/rdedit_audio.cpp:246` |
| `goto_home_button` | `clicked()` | `gotoHomeData()` | `lib/rdedit_audio.cpp:251` |
| `goto_end_button` | `clicked()` | `gotoEndData()` | `lib/rdedit_audio.cpp:256` |
| `button_mapper` (QSignalMapper) | `mapped(int)` | `cuePointData(int)` | `lib/rdedit_audio.cpp:262` |
| `edit_mapper` (QSignalMapper) | `mapped(int)` | `cueEditData(int)` | `lib/rdedit_audio.cpp:264` |
| `esc_mapper` (QSignalMapper) | `mapped(int)` | `cueEscData(int)` | `lib/rdedit_audio.cpp:266` |
| `edit_cursor_edit[Start/End/TalkStart/TalkEnd/SegueStart/SegueEnd/FadeUp/FadeDown/HookStart/HookEnd]` (RDMarkerEdit) | `returnPressed()` | `edit_mapper->map()` | `lib/rdedit_audio.cpp:276,305,334,363,394,424,452,480,510,541` |
| `edit_cursor_edit[*]` (RDMarkerEdit) | `escapePressed()` | `esc_mapper->map()` | `lib/rdedit_audio.cpp:278,307,336,365,396,426,454,482,512,543` |
| `edit_cue_button[*]` (RDMarkerButton) | `clicked()` | `button_mapper->map()` | `lib/rdedit_audio.cpp:294,323,352,381,413,441,469,497,530,559` |
| `trim_start_button` | `clicked()` | `trimHeadData()` | `lib/rdedit_audio.cpp:582` |
| `trim_end_button` | `clicked()` | `trimTailData()` | `lib/rdedit_audio.cpp:590` |
| `edit_gain_edit` (RDMarkerEdit) | `returnPressed()` | `gainChangedData()` | `lib/rdedit_audio.cpp:601` |
| `gain_up_button` | `pressed()` | `gainUpPressedData()` | `lib/rdedit_audio.cpp:610` |
| `gain_up_button` | `released()` | `gainReleasedData()` | `lib/rdedit_audio.cpp:611` |
| `gain_down_button` | `pressed()` | `gainDownPressedData()` | `lib/rdedit_audio.cpp:617` |
| `gain_down_button` | `released()` | `gainReleasedData()` | `lib/rdedit_audio.cpp:618` |
| `edit_gain_timer` (QTimer) | `timeout()` | `gainTimerData()` | `lib/rdedit_audio.cpp:620` |
| `edit_remove_button` | `clicked()` | `removeButtonData()` | `lib/rdedit_audio.cpp:632` |
| `edit_meter_timer` (QTimer) | `timeout()` | `meterData()` | `lib/rdedit_audio.cpp:689` |
| `edit_menu` (Q3PopupMenu) | `aboutToShow()` | `updateMenuData()` | `lib/rdedit_audio.cpp:711` |

## Połączenia wychodzące (klasa jako nadawca connect)

(brak — dialog nie emituje sygnałów do zewnętrznych odbiorców)

## Mechanizm przekazywania wyników

| Wynik | Mechanizm | Opis |
|-------|-----------|------|
| Zapisane markery | `saveData()` → `SaveMarkers()` → `done(0)` | Zapis markerów bezpośrednio do bazy Rivendell przed zamknięciem |
| Anulowanie | `cancelData()` → `done(1)` | Brak zapisu zmian |

## Wywołujący (zewnętrzni użytkownicy)

| Plik | Metoda/Kontekst | Użycie |
|------|----------------|--------|
| `rdlibrary/audio_cart.cpp:509-511` | `editCutData()` | Edycja markerów audio z biblioteki RDLibrary |
| `rdcatch/catch_listview.cpp:57-58` | (kontekst catch) | Edycja audio z RDCatch |
| `rdlogedit/voice_tracker.cpp:1254-1255` | (voice tracker) | Edycja audio w voice tracker |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| `rda->cae()` (RDCae) | CAE daemon | `playing(int)`, `playStopped(int)`, `playPositionChanged(int,unsigned)` | Odbieranie statusu odtwarzania z Audio Engine — aktualizacja kursora i liczników |
| `rda->cae()->play()` | CAE daemon | Wywołanie play | Uruchomienie podglądu audio (pre-roll) |
| `rda->cae()->stop()` | CAE daemon | Wywołanie stop | Zatrzymanie podglądu audio |
