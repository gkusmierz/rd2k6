---
phase: 3
artifact: LIB
artifact_name: librd
status: done
completed_at: 2026-04-05
ui_mode: B
windows_total: 43
dialogs_total: 24
panels_total: 7
controls_total: 12
screenshots_mapped: 11
mockups_generated: 0
spot_check_issues: 0
agent_version: 1.2.0
---

# UI Contracts: librd

## Tryb ekstrakcji

| Parametr | Wartość |
|----------|---------|
| Tryb UI | B (Code-first) |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Programowy UI (C++) | 43 komponentów |
| Screenshots zmapowane | 11 |
| Mockupy wygenerowane | 0 |

## Przegląd komponentów UI

### Dialogi (24)

| Klasa | Tytuł | Modalność | Screenshot |
|-------|-------|-----------|-----------|
| RDCartDialog | Select Cart | modal | ✅ |
| RDCutDialog | Select Cut | modal | ✅ |
| RDEditAudio | Edit Audio | modal | ✅ |
| RDImportAudio | Import/Export Audio File | modal | ✅ |
| RDWaveDataDialog | Edit Cart Label | modal | ❌ |
| RDExportSettingsDialog | Edit Audio Settings | modal | ❌ |
| RDButtonDialog | Edit Button | modal | ❌ |
| RDAddCart | Add Cart | modal | ❌ |
| RDAddLog | Create Log | modal | ❌ |
| RDGetPasswd | Enter Password | modal | ❌ |
| RDGetAth | Enter ATH | modal | ❌ |
| RDPasswd | Change Password | modal | ❌ |
| RDEditPanelName | Edit Panel Name | modal | ❌ |
| RDSchedCodesDialog | Select Scheduler Codes | modal | ✅ |
| RDDateDialog | Select Date | modal | ✅ |
| RDCueEditDialog | Set Cue Point | modal | ❌ |
| RDBusyDialog | (dynamic caption) | modeless | ❌ |
| RDListLogs | Select Log | modal | ✅ |
| RDListGroups | Select Group | modal | ❌ |
| RDListSvcs | Rivendell Services | modal | ❌ |
| RDSlotDialog | Edit Slot Options | modal | ✅ |
| RDDiscLookup | Multiple Matches Found! | modal | ✅ |
| RDCddbLookup | CDDB Query | modal | ❌ |
| RDMbLookup | MusicBrainz Lookup | modal | ❌ |

### Widgety (7)

| Klasa | Opis | Screenshot |
|-------|------|-----------|
| RDSoundPanel | Sound Panel Grid | ✅ |
| RDCartSlot | Cart Slot Widget | ❌ |
| RDSlotBox | Cart Slot Display Box | ❌ |
| RDCueEdit | Cue Point Editor | ❌ |
| RDDatePicker | Date Picker Calendar | ❌ |
| RDCardSelector | Audio Card/Port Selector | ❌ |
| RDListSelector | Dual-List Selector | ❌ |

### Kontrolki (12)

| Klasa | Opis | Screenshot |
|-------|------|-----------|
| RDLogFilter | Log Filter Widget | ❌ |
| RDGpioSelector | GPIO Pin Selector | ❌ |
| RDStereoMeter | Stereo Level Meter | ✅ |
| RDSegMeter | Segmented Bar-Graph Meter | ❌ |
| RDSimplePlayer | Simple Player Widget | ❌ |
| RDTimeEdit | Time Editor | ❌ |
| RDPushButton | Extended Push Button with Flash | ❌ |
| RDTransportButton | Audio Transport Icon Button | ❌ |
| RDPanelButton | Sound Panel Button | ❌ |
| RDMarkerButton | Marker Button | ❌ |
| RDComboBox | Extended Combo Box | ❌ |
| RDImagePickerBox | Image Picker Combo Box | ❌ |

## Navigation Flow (inter-dialog)

```
Aplikacja (np. RDLibrary)
    ├── RDCartDialog (modal) → Select Cart
    │   ├── [Load From File] → RDImportAudio (modal)
    │   ├── [Edit] → otwiera edytor cartu z aplikacji
    │   └── RDSimplePlayer (embedded audition)
    ├── RDCutDialog (modal) → Select Cut
    ├── RDEditAudio (modal) → Edit Audio
    │   └── RDMarkerButton × 10 (embedded marker controls)
    ├── RDImportAudio (modal) → Import/Export Audio
    │   └── RDExportSettingsDialog (modal) → Set format
    ├── RDWaveDataDialog (modal) → Edit Cart Label
    │   └── RDSchedCodesDialog (modal) → Assign codes
    ├── RDButtonDialog (modal) → Edit Button
    │   ├── RDCartDialog (modal) → Select cart for button
    │   └── QColorDialog → Choose color
    ├── RDAddCart (modal) → Add Cart
    ├── RDAddLog (modal) → Create Log
    ├── RDListLogs (modal) → Select Log
    ├── RDListGroups (modal) → Select Group
    ├── RDListSvcs (modal) → Select Service
    ├── RDSlotDialog (modal) → Edit Slot Options
    ├── RDDateDialog (modal) → Select Date
    │   └── RDDatePicker (embedded calendar)
    ├── RDCueEditDialog (modal) → Set Cue Point
    │   └── RDCueEdit (embedded cue editor)
    ├── RDGetPasswd / RDPasswd (modal) → Password
    ├── RDGetAth (modal) → Audio Threshold
    ├── RDEditPanelName (modal) → Edit Panel Name
    ├── RDBusyDialog (modeless) → Progress indicator
    └── RDDiscLookup (modal) → CD Lookup
        ├── RDCddbLookup → CDDB protocol
        └── RDMbLookup → MusicBrainz API
    
Embedded widgets (osadzane w aplikacjach):
    RDSoundPanel → zawiera RDPanelButton grid
    RDCartSlot → zawiera RDSlotBox + RDTransportButton + RDStereoMeter
    RDCardSelector → wbudowany w konfigurację audio
    RDListSelector → wbudowany w dialogi konfiguracji
    RDLogFilter → wbudowany w RDListLogs i inne listy
    RDSimplePlayer → wbudowany w RDCartDialog
```

---

# UI Contract: Select Cart

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCartDialog |
| Typ | Dialog |
| Tytuł okna | {caption} + " - Select Cart" |
| Modalność | modal (via QDialog::exec) |
| Rodzic | dowolny QWidget (przekazywany jako parent) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcart_dialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| filter | QString* | konstruktor | nie (może być NULL, tworzy lokalny) |
| group | QString* | konstruktor | tak |
| schedcode | QString* | konstruktor | tak |
| caption | const QString& | konstruktor | tak |
| parent | QWidget* | konstruktor | nie |

## Dane wejściowe (parametry exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| cartnum | int* | exec | tak (wyjście: wybrany numer cartu) |
| type | RDCart::Type | exec | tak (All/Audio/Macro) |
| svcname | QString* | exec | nie |
| svc_quan | int | exec | tak |
| username | const QString& | exec | tak |
| passwd | const QString& | exec | tak |
| temp_allowed | bool* | exec | nie (może być NULL) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| cart_filter_edit | QLineEdit | "Cart Filter:" | wpisanie tekstu filtra | filterChangedData(const QString&) |
| cart_search_button | QPushButton | "&Search" | kliknięcie uruchamia wyszukiwanie | filterSearchedData() |
| cart_clear_button | QPushButton | "C&lear" | czyści filtr | filterClearedData() |
| cart_group_box | RDComboBox | "Group:" | wybór grupy | groupActivatedData(const QString&) |
| cart_schedcode_box | RDComboBox | "Scheduler Code:" | wybór kodu schedulera | schedcodeActivatedData(const QString&) |
| cart_limit_box | QCheckBox | "Show Only First N Matches" | limitowanie wyników | limitChangedData(int) |
| cart_cart_list | RDListView | "Carts" | lista cartów (13 kolumn) | clickedData(), doubleClickedData() |
| cart_player | RDSimplePlayer | (play/stop buttons) | odtwarzanie audio cartu | (wbudowane) |
| cart_editor_button | QPushButton | "Send to\n&Editor" | wysyła do zewnętrznego edytora | editorData() |
| cart_file_button | QPushButton | "Load From\n&File" | ładuje audio z pliku | loadFileData() |
| cart_ok_button | QPushButton | "&OK" | potwierdza wybór | okData() |
| cart_cancel_button | QPushButton | "&Cancel" | anuluje | cancelData() |
| cart_progress_dialog | QProgressDialog | "Please Wait..." | postęp ładowania | (wbudowane) |
| cart_busy_dialog | RDBusyDialog | - | wskaźnik zajętości | (wbudowane) |

### Kolumny listy cartów (cart_cart_list)
| # | Kolumna | Wyrównanie |
|---|---------|-----------|
| 0 | (ikona) | center |
| 1 | Number | center |
| 2 | Length | right (TimeSort) |
| 3 | Title | left (200px) |
| 4 | Artist | left |
| 5 | Group | left |
| 6 | Composer | left |
| 7 | Conductor | left |
| 8 | Client | left |
| 9 | Agency | left |
| 10 | User Def | left |
| 11 | Start | left |
| 12 | End | left |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Macro mode | type==RDCart::Macro | Bez przycisku edytora, bez player | cart_editor_button hidden, player hidden |
| Audio mode | type==Audio/All | Pełny widok z player i edytorem | (zależy od editorPath) |
| No editor path | editorPath().isEmpty() | Brak przycisku edytora i pliku | cart_editor_button hidden, cart_file_button hidden |
| Temp allowed | temp_allowed!=NULL | Przycisk Load From File widoczny | cart_file_button shown |
| No cart selected | cartnum==0 | OK disabled | cart_ok_button disabled |
| Sync filter | FilterSynchronous | Brak search button | cart_search_button hidden |
| Async filter | FilterAsynchronous | Search button jako default | cart_search_button default |
| No cue device | cueCard<0 or cuePort<0 | Brak playera | cart_player==NULL |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| cart selection | musi być wybrany item | (brak komunikatu, return) | okData - brak zaznaczenia | rdcart_dialog.cpp:582 |
| temp import | plik musi istnieć | "Cart Error" / "Unable to create temporary cart for import!" | loadFileData - błąd tworzenia cartu | rdcart_dialog.cpp:525 |
| import | import musi się powieść | "Import Error" + errorText | loadFileData - błąd importu | rdcart_dialog.cpp:553 |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| dowolny moduł | exec(cartnum, type, svcname, ...) | typ cartu, usługa, nazwa użytkownika |
| double-click na liście | doubleClickedData → okData | natychmiastowe potwierdzenie |
| editor button | editorData | otwiera zewnętrzny edytor audio |
| file button | loadFileData | import audio z pliku do tymczasowego cartu |

---

# UI Contract: Select Cut

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCutDialog |
| Typ | Dialog |
| Tytuł okna | {caption} + " - Select Cut" |
| Modalność | modal (via QDialog::exec) |
| Rodzic | dowolny QWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcut_dialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| cutname | QString* | konstruktor | tak (wejście/wyjście) |
| caption | const QString& | konstruktor | tak |
| filter | QString* | konstruktor | nie (może być NULL) |
| group | QString* | konstruktor | nie |
| schedcode | QString* | konstruktor | nie |
| show_clear | bool | konstruktor | tak |
| allow_add | bool | konstruktor | tak |
| exclude_tracks | bool | konstruktor | tak |
| parent | QWidget* | konstruktor | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| cut_filter_edit | QLineEdit | "Cart Filter:" | tekst filtra | filterChangedData(const QString&) |
| cut_search_button | QPushButton | "&Search" | wyszukiwanie | searchButtonData() |
| cut_clear_button | QPushButton | "C&lear" | czyszczenie filtra | clearData() |
| cut_group_box | QComboBox | "Group:" | wybór grupy | groupActivatedData(const QString&) |
| cut_schedcode_box | QComboBox | "Scheduler Code:" | wybór sched code | groupActivatedData(const QString&) |
| cart_limit_box | QCheckBox | "Show Only First N Matches" | limitowanie | limitChangedData(int) |
| cut_cart_list | RDListView | "Carts" | lista cartów (4 kolumny) | cartClickedData(), selectionChangedData() |
| cut_cut_list | Q3ListView | "Cuts" | lista cutów (2 kolumny) | (brak bezpośredniego slotu) |
| add_button | QPushButton | "&Add New\nCart" | dodaj nowy cart | addButtonData() |
| clear_button | QPushButton | "&Clear" | wyczyść wybór | clearButtonData() |
| cut_ok_button | QPushButton | "&OK" | potwierdź | okData() |
| cut_cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |
| cut_progress_dialog | QProgressDialog | "Please Wait..." | postęp | (wbudowane) |

### Kolumny listy cartów (cut_cart_list)
| # | Kolumna | Wyrównanie |
|---|---------|-----------|
| 0 | (ikona) | center |
| 1 | Number | center |
| 2 | Title | left |
| 3 | Group | center |

### Kolumny listy cutów (cut_cut_list)
| # | Kolumna | Wyrównanie |
|---|---------|-----------|
| 0 | Description | left |
| 1 | Number | left |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Fixed size | zawsze | Stały rozmiar okna | min==max |
| Allow add | allow_add==true | Przycisk "Add New Cart" widoczny | show |
| No add | allow_add==false | Brak przycisku Add | hidden |
| Show clear | show_clear==true | Przycisk "Clear" widoczny | show |
| No clear | show_clear==false | Brak Clear | hidden |
| Empty cutname | cutname->isEmpty() | OK disabled | cut_ok_button disabled |
| Sync filter | FilterSynchronous | Brak search button | cut_search_button hidden |
| Async filter | FilterAsynchronous | Search jako default | cut_search_button default |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| selection | cart i cut muszą być zaznaczone | (brak komunikatu) | okData - brak zaznaczenia, jeśli allow_clear to czyści cutname | rdcut_dialog.cpp:414 |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| dowolny moduł | konstruktor + QDialog::exec | cutname (wejście/wyjście), filtry |
| kliknięcie cartu | cartClickedData → RefreshCuts | odświeża listę cutów |
| OK | okData | zwraca "cartnum_cutnum" w cutname |

---

# UI Contract: Edit Audio

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDEditAudio |
| Typ | Dialog |
| Tytuł okna | "RDLibrary - Edit Audio" |
| Modalność | modal (via QDialog::exec, implicit) |
| Rodzic | dowolny QWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdedit_audio.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| cart | RDCart* | konstruktor | tak |
| cut_name | QString | konstruktor | tak |
| card | int | konstruktor | tak (karta audio) |
| port | int | konstruktor | tak (port audio) |
| preroll | int | konstruktor | tak (ms preroll) |
| trim_level | int | konstruktor | tak (poziom trymowania) |
| parent | QWidget* | konstruktor | nie |

## Widgety i interakcje

### Transport Controls
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_play_cursor_button | RDTransportButton (PlayBetween) | - | play between markers | playCursorData() |
| edit_play_start_button | RDTransportButton (Play) | - | play from start | playStartData() |
| edit_pause_button | RDTransportButton (Pause) | - | pauza | pauseData() |
| edit_stop_button | RDTransportButton (Stop) | - | stop | stopData() |
| edit_loop_button | RDTransportButton (Loop) | - | toggle loop | loopData() |

### Waveform & Navigation
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_hscroll | QScrollBar | - | przewijanie widoku waveform | hscrollData(int) |
| (waveform area) | (custom paint) | - | wyświetla kształt fali | paintEvent |

### Amplitude Controls (GroupBox "Amplitude")
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| y_up_button | RDTransportButton (Up) | - | zoom in Y | yUp() |
| y_down_button | RDTransportButton (Down) | - | zoom out Y | yDown() |

### Time Controls (GroupBox "Time")
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| x_full_in_button | QPushButton | "Full\nIn" | max zoom in | xFullIn() |
| x_up_button | RDTransportButton (Up) | - | zoom in X | xUp() |
| x_down_button | RDTransportButton (Down) | - | zoom out X | xDown() |
| x_full_button | QPushButton | "Full\nOut" | max zoom out | xFullOut() |

### Goto Controls (GroupBox "Goto")
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| goto_cursor_button | QPushButton | "Cursor" | przejdź do kursora | gotoCursorData() |
| goto_home_button | QPushButton | "Home" | przejdź do początku | gotoHomeData() |
| goto_end_button | QPushButton | "End" | przejdź do końca | gotoEndData() |

### Marker Buttons & Edits (8 par: button + edit)
| Widget (name) | Typ Qt | Etykieta | Kolor | Slot |
|---------------|--------|----------|-------|------|
| edit_cue_button[Start] | RDMarkerButton | "Cut\nStart" | RD_START_END_MARKER_COLOR | cuePointData(Start) |
| edit_cursor_edit[Start] | RDMarkerEdit | - | - | cueEditData(Start), cueEscData(Start) |
| edit_cue_button[End] | RDMarkerButton | "Cut\nEnd" | RD_START_END_MARKER_COLOR | cuePointData(End) |
| edit_cursor_edit[End] | RDMarkerEdit | - | - | cueEditData(End), cueEscData(End) |
| edit_cue_button[TalkStart] | RDMarkerButton | "Talk\nStart" | RD_TALK_MARKER_COLOR | cuePointData(TalkStart) |
| edit_cursor_edit[TalkStart] | RDMarkerEdit | - | - | cueEditData(TalkStart) |
| edit_cue_button[TalkEnd] | RDMarkerButton | "Talk\nEnd" | RD_TALK_MARKER_COLOR | cuePointData(TalkEnd) |
| edit_cursor_edit[TalkEnd] | RDMarkerEdit | - | - | cueEditData(TalkEnd) |
| edit_cue_button[SegueStart] | RDMarkerButton | "Segue\nStart" | RD_SEGUE_MARKER_COLOR | cuePointData(SegueStart) |
| edit_cursor_edit[SegueStart] | RDMarkerEdit | - | - | cueEditData(SegueStart) |
| edit_cue_button[SegueEnd] | RDMarkerButton | "Segue\nEnd" | RD_SEGUE_MARKER_COLOR | cuePointData(SegueEnd) |
| edit_cursor_edit[SegueEnd] | RDMarkerEdit | - | - | cueEditData(SegueEnd) |
| edit_cue_button[FadeUp] | RDMarkerButton | "Fade\nUp" | RD_FADE_MARKER_COLOR | cuePointData(FadeUp) |
| edit_cursor_edit[FadeUp] | RDMarkerEdit | - | - | cueEditData(FadeUp) |
| edit_cue_button[FadeDown] | RDMarkerButton | "Fade\nDown" | RD_FADE_MARKER_COLOR | cuePointData(FadeDown) |
| edit_cursor_edit[FadeDown] | RDMarkerEdit | - | - | cueEditData(FadeDown) |
| edit_cue_button[HookStart] | RDMarkerButton | "Hook\nStart" | RD_HOOK_MARKER_COLOR | cuePointData(HookStart) |
| edit_cursor_edit[HookStart] | RDMarkerEdit | - | - | cueEditData(HookStart) |
| edit_cue_button[HookEnd] | RDMarkerButton | "Hook\nEnd" | RD_HOOK_MARKER_COLOR | cuePointData(HookEnd) |
| edit_cursor_edit[HookEnd] | RDMarkerEdit | - | - | cueEditData(HookEnd) |

### AutoTrim & Gain Controls
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_trim_box | QSpinBox | "Threshold" (-99..0 dB) | ustawienie progu trymowania | (odczyt) |
| trim_start_button | QPushButton | "Trim\nStart" | auto-trim początku | trimHeadData() |
| trim_end_button | QPushButton | "Trim\nEnd" | auto-trim końca | trimTailData() |
| edit_gain_edit | RDMarkerEdit | "Cut Gain" | ręczna edycja gain | gainChangedData() |
| gain_up_button | RDTransportButton (Up) | - | zwiększenie gain | gainUpPressedData(), gainReleasedData() |
| gain_down_button | RDTransportButton (Down) | - | zmniejszenie gain | gainDownPressedData(), gainReleasedData() |

### Other Controls
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_remove_button | RDPushButton | "Remove\nMarker" | usuwanie markerów (toggle) | removeButtonData() |
| edit_overlap_box | QCheckBox | "No Fade on Segue Out" | disable fade on segue | (odczyt przy save) |
| edit_overall_edit | QLineEdit | "Position" | wyświetla pozycję (readonly) | - |
| edit_region_edit | QLineEdit | "Region" | wyświetla region (readonly) | - |
| edit_size_edit | QLineEdit | "Length" | wyświetla długość (readonly) | - |
| edit_meter | RDStereoMeter | - | VU meter | meterData() |
| save_button | QPushButton | "&Save" | zapisz markery | saveData() |
| cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

### Context Menu (edit_menu - Q3PopupMenu)
| Pozycja | Slot |
|---------|------|
| "Delete Talk Markers" | deleteTalkData() |
| "Delete Segue Markers" | deleteSegueData() |
| "Delete Hook Markers" | deleteHookData() |
| "Delete Fade Up Marker" | deleteFadeupData() |
| "Delete Fade Down Marker" | deleteFadedownData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Fixed size | zawsze | Stały rozmiar (EDITAUDIO_WIDGET_WIDTH x HEIGHT) | min==max |
| No audio device | card<0 or port<0 | Transport buttons disabled | all transport disabled |
| Not editing allowed | !user->editAudio() or cart has owner | Marker edits readonly, buttons disabled | cue_buttons disabled, remove disabled, gain disabled, trim disabled, overlap disabled |
| Playing | is_playing==true | Play button on, stop off | - |
| Paused | is_paused==true | Pause button red | - |
| Stopped | is_stopped==true | Stop button red | - |
| Looping | is_looping==true | Loop button on | - |
| Marker active | cue_button toggled | Button flashes, cursor editable | edit writable for active marker |
| Delete mode | edit_remove_button toggled | Remove button flashes red | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| peak data | musi się pobrać | "Rivendell Web Service" / "Unable to download peak data..." | konstruktor - błąd pobrania | rdedit_audio.cpp:700 |
| trim | auto-trim musi się powieść | "Edit Audio" + errorText | trimHeadData/trimTailData | rdedit_audio.cpp:1463,1491 |
| markers (playable) | >50% audio musi być playable | "Marker Warning" / "Less than half of the audio is playable..." (Yes/No) | saveData → SaveMarkers | rdedit_audio.cpp:2117 |
| markers (fade) | <50% audio powinno być fade | "Marker Warning" / "More than half of the audio will be faded..." (Yes/No) | saveData → SaveMarkers | rdedit_audio.cpp:2130 |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDLibrary cut editor | konstruktor + exec | cart, cut_name, card, port, preroll, trim_level |
| Save | saveData | zapisuje markery do bazy, done(0) |
| Cancel | cancelData | zamyka bez zapisu |

---

# UI Contract: Import/Export Audio File

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDImportAudio |
| Typ | Dialog |
| Tytuł okna | {caption} + " - Import/Export Audio File" |
| Modalność | modal (via QDialog::exec, implicit) |
| Rodzic | dowolny QWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdimport_audio.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| cutname | QString | konstruktor | tak |
| path | QString* | konstruktor | tak (persystentna ścieżka) |
| settings | RDSettings* | konstruktor | tak (ustawienia audio) |
| import_metadata | bool* | konstruktor | tak (wejście/wyjście) |
| wavedata | RDWaveData* | konstruktor | nie (może być NULL) |
| clipboard | RDCut* | konstruktor | nie |
| running | bool* | konstruktor | tak |
| caption | const QString& | konstruktor | tak |
| parent | QWidget* | konstruktor | nie |

## Widgety i interakcje

### Import Section (RadioButton group)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| import_importmode_button | QRadioButton | "Import File" | przełącz na tryb import | modeClickedData(0) |
| import_in_filename_edit | QLineEdit | "Filename:" | ścieżka pliku wejściowego | filenameChangedData(const QString&) |
| import_in_selector_button | QPushButton | "&Select" | wybór pliku do importu | selectInputFileData() |
| import_in_metadata_box | QCheckBox | "Import file metadata" | import metadanych | (odczyt) |
| import_channels_box | QComboBox | "Channels:" | wybór kanałów (1/2) | (odczyt) |
| import_autotrim_box | QCheckBox | "Autotrim" | włącz autotrim | autotrimCheckData(bool) |
| import_autotrim_spin | QSpinBox | "Level:" (-99..0) | poziom autotrim | (odczyt) |

### Export Section (RadioButton group)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| import_exportmode_button | QRadioButton | "Export File" | przełącz na tryb export | modeClickedData(1) |
| import_out_filename_edit | QLineEdit | "Filename:" (readonly) | ścieżka pliku wyjściowego | filenameChangedData(const QString&) |
| import_out_selector_button | QPushButton | "&Select" | wybór pliku wyjściowego | selectOutputFileData() |
| import_out_metadata_box | QCheckBox | "Export file metadata" | export metadanych | (odczyt) |
| import_format_edit | QLineEdit | "Format:" (readonly) | wyświetla format | (odczyt) |
| import_out_format_button | QPushButton | "S&et" | wybór formatu eksportu | selectOutputFormatData() |

### Common Controls
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| import_bar | RDBusyBar | - | pasek postępu operacji | (wbudowane) |
| import_normalize_box | QCheckBox | "Normalize" | włącz normalizację | normalizeCheckData(bool) |
| import_normalize_spin | QSpinBox | "Level:" (-30..0) | poziom normalizacji | (odczyt) |
| import_import_button | QPushButton | "&Import" / "&Export" | uruchom operację | importData() |
| import_cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Fixed size | zawsze | Stały rozmiar | min==max |
| Import mode (id=0) | import radio selected | Sekcja import aktywna, export disabled | export controls disabled |
| Export mode (id=1) | export radio selected | Sekcja export aktywna, import disabled | import controls disabled |
| Import running | import_conv!=NULL | Przycisk zmienia się na "Abort" | - |
| Export running | export_conv!=NULL | Przycisk zmienia się na "Abort" | - |
| No wavedata | wavedata==NULL | Metadata checkbox disabled | import_in_metadata_box disabled |
| Autotrim off | unchecked | Spin/label disabled | spin+label disabled |
| Normalize off | unchecked | Spin/label disabled | spin+label disabled |
| Button text | mode dependent | "Import" w trybie import, "Export" w trybie export | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| input file | plik musi istnieć | "Import Audio File" / "File does not exist!" | Import() - brak pliku | rdimport_audio.cpp:519 |
| import result | import musi się powieść | "Import Error" + errorText | Import() - błąd konwersji | rdimport_audio.cpp:563 |
| import success | - | "Import Complete" / "Import complete!" | Import() - sukces | rdimport_audio.cpp:558 |
| output file exists | plik już istnieje | "File Exists" / "The selected file already exists!\nDo you want to overwrite it?" (Yes/No) | Export() - plik istnieje | rdimport_audio.cpp:590 |
| export result | export musi się powieść | "Export Error" + errorText | Export() - błąd | rdimport_audio.cpp:624 |
| export success | - | "Export Complete" / "Export complete!" | Export() - sukces | rdimport_audio.cpp:619 |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDLibrary / inne moduły | konstruktor + exec | cutname, settings, wavedata |
| Select (input) | selectInputFileData | otwiera QFileDialog |
| Select (output) | selectOutputFileData | otwiera QFileDialog |
| Set format | selectOutputFormatData | otwiera RDExportSettingsDialog |
| Import/Export | importData → Import()/Export() | wykonuje konwersję audio |

---

# UI Contract: Edit Cart Label

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDWaveDataDialog |
| Typ | Dialog |
| Tytuł okna | {caption} + " - Edit Cart Label" |
| Modalność | modal (via QDialog::exec) |
| Rodzic | dowolny QWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdwavedata_dialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora + exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | konstruktor | tak |
| parent | QWidget* | konstruktor | nie |
| data | RDWaveData* | exec | tak (wejście/wyjście metadanych) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| wave_title_edit | QLineEdit | "Title:" | edycja tytułu (max 255) | - |
| wave_artist_edit | QLineEdit | "Artist:" | edycja artysty (max 255) | - |
| wave_year_edit | QLineEdit | "Year:" | edycja roku (max 4, walidator 1980-8000) | - |
| wave_usage_box | QComboBox | "Usage:" | wybór kodu użycia (RDCart::UsageCode enum) | - |
| wave_sched_button | QPushButton | "Scheduler Codes" | otwiera dialog kodów schedulera | schedClickedData() |
| wave_songid_edit | QLineEdit | "Song ID:" | edycja ID piosenki (max 32) | - |
| wave_bpm_spin | QSpinBox | "Beats per Minute:" | BPM (0-300, 0="Unknown") | - |
| wave_album_edit | QLineEdit | "Album:" | edycja albumu (max 255) | - |
| wave_label_edit | QLineEdit | "Label:" | edycja labelu (max 64) | - |
| wave_client_edit | QLineEdit | "Client:" | edycja klienta (max 64) | - |
| wave_agency_edit | QLineEdit | "Agency:" | edycja agencji (max 64) | - |
| wave_publisher_edit | QLineEdit | "Publisher:" | edycja wydawcy (max 64) | - |
| wave_composer_edit | QLineEdit | "Composer:" | edycja kompozytora (max 64) | - |
| wave_conductor_edit | QLineEdit | "Conductor:" | edycja dyrygenta (max 64) | - |
| wave_userdef_edit | QLineEdit | "User Defined:" | edycja pola użytkownika (max 255) | - |
| wave_ok_button | QPushButton | "OK" | zapisz i zamknij | okData() |
| wave_cancel_button | QPushButton | "Cancel" | anuluj | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Default | zawsze | Wszystkie pola edytowalne, pre-filled z data | - |
| Year empty | releaseYear==0 | Pole roku puste | - |
| BPM unknown | bpm==0 | Wyświetla "Unknown" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| year | QIntValidator 1980-8000 | (walidator inline) | wpisywanie | konstruktor |
| (brak dodatkowych) | okData nie waliduje | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| dowolny moduł | konstruktor + exec(data) | RDWaveData* z metadanymi |
| Scheduler Codes | schedClickedData | otwiera RDSchedCodesDialog |
| OK | okData | kopiuje pola do RDWaveData, done(0) |
| Cancel | cancelData | zamyka bez zmian |

---

# UI Contract: Edit Audio Settings

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDExportSettingsDialog |
| Typ | Dialog |
| Tytuł okna | {caption} + " - Edit Audio Settings" |
| Modalność | modal (via RDDialog::exec) |
| Rodzic | dowolny QWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdexport_settings_dialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora + exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | konstruktor | tak |
| parent | QWidget* | konstruktor | nie |
| s | RDSettings* | exec | tak (wejście/wyjście) |
| id | unsigned | exec | tak (0=new, >0=preset ID) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_name_edit | QLineEdit | "Name:" | nazwa presetu (tylko gdy id>0) | - |
| lib_format_box | QComboBox | "Format:" | wybór formatu audio | formatData(const QString&) |
| lib_channels_box | QComboBox | "Channels:" | wybór kanałów (1/2) | - |
| lib_samprate_box | QComboBox | "Sample Rate:" | wybór częstotliwości | samprateData(const QString&) |
| lib_bitrate_box | QComboBox | "Bitrate:" | wybór bitrate | bitrateData(const QString&) |
| lib_quality_spin | QSpinBox | "Quality:" (0-10) | ustawienie jakości | - |
| lib_normalization_level_spin | QSpinBox | "Normalization Level:" (-100..0) | poziom normalizacji | - |
| lib_normalization_level_unit_label | QLabel | "dBFS" | jednostka | - |
| lib_autotrim_level_spin | QSpinBox | "Autotrim Level:" (-100..0) | poziom autotrim | - |
| lib_autotrim_level_unit_label | QLabel | "dBFS" | jednostka | - |
| lib_ok_button | QPushButton | "&OK" | potwierdź | okData() |
| lib_cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

### Dostępne formaty (wypełniane dynamicznie w exec)
| Format | Warunek |
|--------|---------|
| PCM16 | zawsze |
| PCM24 | zawsze |
| FLAC | station->haveCapability(HaveFlac) |
| MPEG Layer 2 | zawsze |
| MPEG Layer 3 | station->haveCapability(HaveLame) |
| OggVorbis | station->haveCapability(HaveOggenc) |

### Sample rates (stałe)
16000, 22050, 24000, 32000, 44100, 48000

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| New settings (id==0) | exec z id=0 | Brak pola Name | lib_name_label hidden, lib_name_edit hidden |
| Edit preset (id>0) | exec z id>0 | Pole Name widoczne | lib_name_label shown, lib_name_edit shown |
| Normalization shown | setShowNormalizationLevel(true) | Widoczne normalization controls | shown + rozmiar okna powiększony |
| Normalization hidden | default | Normalization ukryte | hidden |
| Autotrim shown | setShowAutotrimLevel(true) | Widoczne autotrim controls | shown + rozmiar okna powiększony |
| Autotrim hidden | default | Autotrim ukryte | hidden |
| PCM format | PCM16/PCM24 selected | Bitrate/Quality nieistotne | - |
| MPEG format | MPEG L2/L3 selected | Bitrate widoczny, quality gdy VBR | ShowBitRates dynamically |
| Ogg format | OggVorbis selected | Quality range -1..10 | - |
| FLAC format | FLAC selected | Brak bitrate/quality | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| name (preset) | unikalna nazwa w ENCODER_PRESETS | "Duplicate Name" / "The name \"...\" is already in use." | okData - id>0 i duplikat | rdexport_settings_dialog.cpp:320 |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDImportAudio | selectOutputFormatData → exec | RDSettings*, id |
| dowolny moduł | konstruktor + exec(settings, id) | ustawienia eksportu |
| OK | okData | zapisuje format/channels/rate/bitrate do RDSettings, done(true) |
| Cancel | cancelData | zamyka bez zmian |

---

# UI Contract: Edit Button

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDButtonDialog |
| Typ | Dialog |
| Tytuł okna | {caption} + " - Edit Button" |
| Modalność | modal (setModal(true)) |
| Rodzic | dowolny QWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdbutton_dialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station_name | QString | konstruktor | tak |
| caption | const QString& | konstruktor | tak |
| label_template | const QString& | konstruktor | tak (szablon etykiety) |
| cart_dialog | RDCartDialog* | konstruktor | tak (referencja do dialogu wyboru cartu) |
| svcname | const QString& | konstruktor | tak |
| parent | QWidget* | konstruktor | nie |

## Dane wejściowe (parametry exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| button | RDPanelButton* | exec | tak (przycisk do edycji) |
| hookmode | bool | exec | tak |
| username | const QString& | exec | tak |
| passwd | const QString& | exec | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_label_edit | QLineEdit | "Label:" | edycja etykiety przycisku | - |
| edit_cart_edit | QLineEdit | "Cart:" (readonly) | wyświetla numer/tytuł cartu | - |
| set_cart_button | QPushButton | "Set\nCart" | otwiera dialog wyboru cartu | setCartData() |
| clear_button | QPushButton | "Clear" | czyści przypisanie cartu | clearCartData() |
| edit_color_button | QPushButton | "Set\nColor" | otwiera dialog wyboru koloru | setColorData() |
| ok_button | QPushButton | "&OK" | potwierdź | okData() |
| cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Fixed size | zawsze | Stały rozmiar okna | min==max |
| Cart assigned | edit_cart>0 | Pole cart wyświetla numer i tytuł | - |
| No cart | edit_cart==0 | Pole cart puste | - |
| Color set | edit_color valid | Kolor przycisku "Set Color" zmieniony | palette updated |
| Default label | cart>0 && label empty | Automatyczna etykieta z szablonu | resolveWildcards przy okData |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak walidacji) | okData nie sprawdza | - | - | - |

## Logika okData
- Jeśli cart>0 i label pusty: automatycznie generuje label z `RDLogLine::resolveWildcards(cart, label_template)`
- Ustawia kolor, cart, label, length na RDPanelButton
- Ustawia hook length (z averageHookLength lub forcedLength)

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDAirPlay / RDPanel | konstruktor + exec(button, hookmode, ...) | RDPanelButton do edycji |
| Set Cart | setCartData | otwiera RDCartDialog (przekazany w konstruktorze) |
| Set Color | setColorData | otwiera QColorDialog |
| Clear | clearCartData | czyści edit_cart do 0 |
| OK | okData | zapisuje na RDPanelButton, done(0) |
| Cancel | cancelData | zamyka bez zmian |

---

# UI Contract: Add Cart

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDAddCart |
| Typ | Dialog |
| Tytuł okna | `{caption} - Add Cart` (dynamiczny prefix z parametru caption) |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x160 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdadd_cart.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| group | QString* | in/out — preselected group, returns chosen group | tak |
| type | RDCart::Type* | in/out — filter (All/Audio/Macro), returns chosen type | tak |
| title | QString* | out — returns entered title | tak |
| username | const QString& | filtrowanie grup po USER_PERMS | tak |
| caption | const QString& | prefix tytułu okna | tak |
| system | RDSystem* | konfiguracja systemu (duplicate titles) | tak |
| parent | QWidget* | rodzic | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| cart_group_box | QComboBox | "&Group:" | Wybór grupy, ładuje grupy z USER_PERMS dla username | groupActivatedData(const QString&) |
| cart_number_edit | QLineEdit | "&New Cart Number:" | Numer cartu, max 6 znaków, QIntValidator 1-999999 | — |
| cart_type_box | QComboBox | "&New Cart Type:" | Typ cartu: "Audio" i/lub "Macro" wg filtra type | — |
| cart_title_edit | QLineEdit | "&New Cart Title:" | Tytuł cartu, max 255 znaków, domyślnie "[new cart]" | — |
| ok_button | QPushButton | "&OK" | Walidacja + zamknięcie z done(num) | okData() |
| cancel_button | QPushButton | "&Cancel" | Zamknięcie z done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie dialogu | Grupa preselected, numer auto-wyliczony (nextFreeCart), typ wg filtra, tytuł "[new cart]" | — |
| Brak wolnych numerów | nextFreeCart()==0 && enforceCartRange | cart_number_edit pusty, QMessageBox warning "There are no more available cart numbers for the group!" | — |
| Zmiana grupy | activated na combo | Nowy numer auto-wyliczony dla nowej grupy | — |
| Typ All | type==RDCart::All | Oba typy w combo, default z DEFAULT_CART_TYPE grupy | — |
| Typ Audio only | type==RDCart::Audio | Tylko "Audio" w combo | — |
| Typ Macro only | type==RDCart::Macro | Tylko "Macro" w combo | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| cart_number_edit | Musi być liczbą > 0 | "Invalid Cart Number!" | okData | QMessageBox::warning |
| cart_title_edit | Nie może być pusty | "You must enter a cart title!" | okData | QMessageBox::warning |
| cart_title_edit | Musi być unikalny (jeśli system nie pozwala na duplikaty) | "The cart title must be unique!" | okData | QMessageBox::warning |
| cart_number_edit | Musi być w zakresie grupy (jeśli enforceCartRange) | "The cart number is outside of the permitted range for this group!" | okData | QMessageBox::warning |
| cart_number_edit | Numer nie może już istnieć w DB | "This cart already exists." | okData | QMessageBox::information |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (np. RDLibrary) | exec() | group, type, title, username, caption, system |
| Dialog → Wywołujący | done(num) przy OK, done(-1) przy Cancel | Numer cartu jako return code; group, type, title przez wskaźniki |

---

# UI Contract: Create Log

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDAddLog |
| Typ | Dialog |
| Tytuł okna | "Create Log" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x132 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdadd_log.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| logname | QString* | out — zwraca wpisaną nazwę loga | tak |
| svcname | QString* | out — zwraca wybrany serwis | tak |
| mode | RDLogFilter::FilterMode | filtrowanie serwisów (NoFilter/UserFilter/StationFilter) | tak |
| caption | const QString& | (nie używany w kodzie do tytułu — tytuł hardcoded) | tak |
| parent | QWidget* | rodzic | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_name_edit | QLineEdit | "&New Log Name:" | Nazwa loga, max 64 znaków, RDIdValidator (spacje zabronione) | nameChangedData(const QString&) |
| add_service_box | QComboBox | "&Service:" | Wybór serwisu, ładowany wg FilterMode | — |
| add_ok_button | QPushButton | "&OK" | Walidacja + done(0) | okData() |
| add_cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | Puste pole nazwy, serwisy załadowane, OK disabled | add_ok_button disabled |
| Nazwa wpisana | textChanged z niepustym str | OK enabled | — |
| Nazwa pusta | textChanged z pustym str | OK disabled | add_ok_button disabled |
| NoFilter | mode==NoFilter | Wszystkie serwisy z tabeli SERVICES | — |
| UserFilter | mode==UserFilter | Serwisy z USER_SERVICE_PERMS dla bieżącego usera | — |
| StationFilter | mode==StationFilter | Serwisy z SERVICE_PERMS dla bieżącej stacji | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| add_name_edit | Nie może być pusty (przycisk OK disabled) | — (brak komunikatu, button disabled) | nameChangedData | logika enabled/disabled |
| add_name_edit | Spacje zabronione (RDIdValidator) | — (walidator blokuje input) | w trakcie wpisywania | RDIdValidator |
| add_service_box | Serwis nie może być pusty | "The service is invalid!" | okData | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (np. RDLogEdit) | exec() | logname, svcname, mode, caption |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | logname i svcname przez wskaźniki |

---

# UI Contract: Enter Password

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDGetPasswd |
| Typ | Dialog |
| Tytuł okna | "Enter Password" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 190x120 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdgetpasswd.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| passwd | QString* | out — zwraca wpisane hasło | tak |
| parent | QWidget* | rodzic | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| label | QLabel | "Enter password" | Etykieta informacyjna (wycentrowana) | — |
| pw_password_edit | QLineEdit | — | Pole hasła, EchoMode::Password (maskowanie znaków) | — |
| ok_button | QPushButton | "&OK" | Zapisuje hasło, done(0) | okData() |
| cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | Puste pole hasła z maskowaniem, etykieta "Enter password" | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| — | Brak walidacji | — | — | — |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący | exec() | passwd (wskaźnik na QString) |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | hasło przez wskaźnik passwd |

---

# UI Contract: Enter ATH

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDGetAth |
| Typ | Dialog |
| Tytuł okna | "Enter ATH" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 250x160 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdget_ath.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| ath | double* | out — zwraca wpisaną wartość ATH | tak |
| parent | QWidget* | rodzic | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| label | QLabel | "Enter the agreggate tuning hours (ATH)\nfigure for the report period.\n(Supplied by your streaming provider)." | Tekst informacyjny (wieloliniowy) | — |
| ath_ath_edit | QLineEdit | "ATH:" | Wartość ATH, QDoubleValidator (min 0.0) | — |
| ok_button | QPushButton | "&OK" | Walidacja + done(0) | okData() |
| cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | Tekst objaśniający, puste pole ATH | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| ath_ath_edit | Nie może być pusty | "You must provide a valid ATH figure!" | okData | QMessageBox::warning |
| ath_ath_edit | QDoubleValidator >= 0.0 | — (walidator blokuje input) | w trakcie wpisywania | QDoubleValidator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (raportowanie) | exec() | ath (wskaźnik na double) |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | wartość ATH przez wskaźnik |

---

# UI Contract: Change Password

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDPasswd |
| Typ | Dialog |
| Tytuł okna | "Change Password" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 450x125 (fixed, resizable layout via resizeEvent) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdpasswd.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| password | QString* | out — zwraca nowe hasło | tak |
| parent | QWidget* | rodzic | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| passwd_password_1_edit | QLineEdit | "&Password:" | Nowe hasło, EchoMode::Password, max RD_MAX_PASSWORD_LENGTH, RDTextValidator, autoFocus | — |
| passwd_password_2_edit | QLineEdit | "C&onfirm:" | Potwierdzenie hasła, EchoMode::Password, max RD_MAX_PASSWORD_LENGTH, RDTextValidator | — |
| passwd_ok_button | QPushButton | "&OK" | Walidacja + done(0) | okData() |
| passwd_cancel_button | QPushButton | "&Cancel" | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | Dwa puste pola hasła z maskowaniem, fokus na pierwszym | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| passwd_password_1_edit, passwd_password_2_edit | Hasła muszą być identyczne | "The passwords don't match,\nplease try again!" | okData | QMessageBox::warning |
| passwd_password_1_edit | RDTextValidator | — (walidator blokuje niedozwolone znaki) | w trakcie wpisywania | RDTextValidator |
| passwd_password_2_edit | RDTextValidator | — (walidator blokuje niedozwolone znaki) | w trakcie wpisywania | RDTextValidator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (np. RDAdmin) | exec() | password (wskaźnik na QString) |
| Dialog → Wywołujący | done(0) przy OK (hasła zgodne), done(1) przy Cancel | nowe hasło przez wskaźnik |

---

# UI Contract: Edit Panel Name

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDEditPanelName |
| Typ | Dialog |
| Tytuł okna | "Edit Panel Name" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x110 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdedit_panel_name.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| panelname | QString* | in/out — bieżąca nazwa panelu, zwraca nową | tak |
| parent | QWidget* | rodzic | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| panel_name_edit | QLineEdit | "Panel &Name:" | Edycja nazwy panelu, max 64 znaków, pre-filled z *panelname, selectAll() | — |
| ok_button | QPushButton | "&OK" | Zapisuje nazwę, done(0) | okData() |
| cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | Pole z bieżącą nazwą panelu (zaznaczony cały tekst) | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| — | Brak walidacji | — | — | — |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (SoundPanel) | exec() | panelname (wskaźnik na QString) |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | nowa nazwa panelu przez wskaźnik |

---

# UI Contract: Select Scheduler Codes

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDSchedCodesDialog |
| Typ | Dialog |
| Tytuł okna | "Select Scheduler Codes" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x292 (single mode) lub 800x292 (dual mode, gdy remove_codes!=NULL) — fixed |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdschedcodes_dialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| parent | QWidget* | rodzic | nie |

## Dane wejściowe (parametry exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| sched_codes | QStringList* | in/out — lista przypisanych kodów schedulera | tak |
| remove_codes | QStringList* | in/out — lista kodów do usunięcia (NULL = tryb single) | nie (może być NULL) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| codes_sel | RDListSelector | source: "Available Codes", dest: "Assigned Codes" lub "ASSIGN to Carts" | Przenoszenie kodów między listami (assign) | — |
| remove_codes_sel | RDListSelector | source: "Available Codes", dest: "REMOVE from Carts" | Przenoszenie kodów między listami (remove) | — |
| edit_ok_button | QPushButton | "&OK" | Zbiera kody z obu selektorów, done(0) | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Single mode | exec(sched_codes, NULL) | Jeden RDListSelector (codes_sel) — "Available Codes" / "Assigned Codes", szerokość 400 | remove_codes_sel hidden |
| Dual mode (bulk) | exec(sched_codes, remove_codes) | Dwa RDListSelector obok siebie z linią rozdzielającą — lewy: "ASSIGN to Carts", prawy: "REMOVE from Carts", szerokość 800 | codes_sel hidden, remove_codes_sel visible |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| — | Brak walidacji | — | — | — |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący | exec(sched_codes, remove_codes) | listy kodów schedulera |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | zaktualizowane listy przez wskaźniki |

---

# UI Contract: Select Date

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDDateDialog |
| Typ | Dialog |
| Tytuł okna | "Select Date" |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | dynamiczny — RDDatePicker.sizeHint().width()+20 x RDDatePicker.sizeHint().height()+60 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rddatedialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| low_year | int | dolna granica zakresu lat w date picker | tak |
| high_year | int | górna granica zakresu lat w date picker | tak |
| parent | QWidget* | rodzic | nie |

## Dane wejściowe (parametry exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| date | QDate* | in/out — bieżąca data, zwraca wybraną datę | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| date_picker | RDDatePicker | — | Widget kalendarza z zakresem lat low_year..high_year | — |
| ok_button | QPushButton | "&OK" | Zapisuje wybraną datę, done(0) | okData() |
| cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | exec(date) | RDDatePicker z preselected datą z parametru | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| — | Brak walidacji (RDDatePicker zarządza zakresem) | — | — | — |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący | exec(date) | wskaźnik na QDate |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | wybrana data przez wskaźnik |

---

# UI Contract: Set Cue Point

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCueEditDialog |
| Typ | Dialog |
| Tytuł okna | `{caption} - Set Cue Point` (dynamiczny prefix z parametru caption) |
| Modalność | modal (exec) |
| Rodzic | QWidget *parent |
| Rozmiar | dynamiczny — RDCueEdit.sizeHint().width() x RDCueEdit.sizeHint().height()+10 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcueeditdialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| cae | RDCae* | Core Audio Engine (do odtwarzania audio) | tak |
| play_card | int | numer karty audio do odtwarzania | tak |
| play_port | int | numer portu audio do odtwarzania | tak |
| caption | const QString& | prefix tytułu okna | tak |
| parent | QWidget* | rodzic | nie |

## Dane wejściowe (parametry exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| logline | RDLogLine* | in/out — linia loga z punktami cue do edycji | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| cue_edit | RDCueEdit | — | Złożony widget do edycji punktów cue (start/end), inicjalizowany z logline | — |
| ok_button | QPushButton | "&OK" | Zapisuje zmienione pozycje cue do logline, done(0) | okData() |
| cancel_button | QPushButton | "&Cancel" | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | exec(logline) | RDCueEdit z wizualizacją audio i markerami start/end | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| — | Brak walidacji na poziomie dialogu (RDCueEdit zarządza wewnętrznie) | — | — | — |

## Logika okData
- Porównuje playPosition(Start) z logline->playPosition() — jeśli zmienione, ustawia nową pozycję i flagę playPositionChanged
- Porównuje playPosition(End) z logline->endPoint() — jeśli zmienione, ustawia nowy endPoint (LogPointer) i flagę playPositionChanged

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (np. log editor) | exec(logline) | RDLogLine z punktami cue |
| Dialog → Wywołujący | done(0) przy OK, done(-1) przy Cancel | zmienione pozycje start/end w logline + flaga playPositionChanged |

---

# UI Contract: Busy/Progress Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDBusyDialog |
| Typ | Dialog (non-modal, show/hide) |
| Tytuł okna | dynamiczny — ustawiany w show(caption, label) |
| Modalność | non-modal (show/hide, nie exec) |
| Rodzic | QWidget *parent |
| Rozmiar | 200x80 (sizeHint, resizable via resizeEvent) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdbusydialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| parent | QWidget* | rodzic | nie |
| f | Qt::WFlags | flagi okna (domyślnie 0) | nie |

## Dane wejściowe (parametry show)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | tytuł okna | tak |
| label | const QString& | tekst etykiety (opis operacji) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| bar_label | QLabel | (dynamiczny tekst z show()) | Wycentrowany tekst opisujący trwającą operację, progressFont() | — |
| bar_bar | RDBusyBar | — | Animowany pasek busy (aktywowany/deaktywowany przy show/hide) | — |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Ukryty | Przed show() lub po hide() | Dialog niewidoczny, bar_bar deaktywowany | cały dialog hidden |
| Aktywny | Po show(caption, label) | Tytuł okna = caption, etykieta = label, animowany pasek busy | — |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| — | Brak walidacji | — | — | — |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Wywołujący (dowolny moduł) | show(caption, label) | tekst tytułu i etykiety |
| Wywołujący | hide() | nic — zamyka i deaktywuje animację |

## Uwagi
- Dialog nie ma przycisków OK/Cancel — jest czystym wskaźnikiem zajętości
- Nie jest modalny — wywoływany przez show(), a nie exec()
- RDBusyBar to animowany pasek (nie progress bar z procentami)
- Layout zarządzany przez resizeEvent: etykieta w górnej połowie, pasek w dolnej

---

# UI Contract: Select Log

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDListLogs |
| Typ | Dialog |
| Tytuł okna | "Select Log" |
| Modalność | modal (exec()) |
| Rodzic | QWidget *parent |
| Rozmiar | min 500x300, resizable |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rdlist_logs.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| logname | QString* | parametr konstruktora (in/out) | tak |
| mode | RDLogFilter::FilterMode | parametr konstruktora | tak |

## Dane wyjściowe
| Dane | Typ | Kiedy |
|------|-----|-------|
| *logname | QString | OK - ustawiane na wybraną nazwę loga |
| done(true) | int | OK - log wybrany |
| done(false) | int | Cancel - anulowano |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_filter_widget | RDLogFilter | (composite: Service combo, Filter edit, Clear button, Recent checkbox) | Filtruje listę logów | filterChangedData(const QString &) |
| list_log_list | Q3ListView | kolumny: "Name", "Description", "Service" | Wyświetla logi; double-click = OK | doubleClickedData() |
| list_ok_button | QPushButton | "OK" | Potwierdza wybór | okButtonData() |
| list_cancel_button | QPushButton | "Cancel" (default) | Zamyka bez wyboru | cancelButtonData() |

## Kolumny listy logów
| # | Nagłówek | Wyrównanie | Źródło danych |
|---|----------|------------|---------------|
| 0 | Name | Left | LOGS.NAME |
| 1 | Description | Left | LOGS.DESCRIPTION |
| 2 | Service | Left | LOGS.SERVICE |

## Filtrowanie danych (SQL)
Tabela: LOGS. Warunki bazowe:
- TYPE=0 (standard log)
- LOG_EXISTS="Y"
- START_DATE <= today OR null/0000-00-00
- END_DATE >= today OR null/0000-00-00
- + dynamiczny WHERE z RDLogFilter::whereSql()

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Lista pusta | Brak logów pasujących do filtra | Pusta lista, przyciski aktywne | - |
| Lista z selekcją | Istnieje log o nazwie *logname | Lista z podświetlonym logiem (ensureItemVisible) | - |
| Lista bez selekcji | logname nie pasuje do żadnego | Lista bez podświetlenia | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Selekcja listy | Musi być wybrany element | (brak komunikatu - OK ignoruje klik) | okButtonData() | kod: if(item==NULL) return |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Dowolny moduł potrzebujący wybrać log | new RDListLogs(&logname, mode, parent)->exec() | QString *logname, FilterMode |
| Dialog -> caller | done(true/false) | *logname wypełnione nazwą wybranego loga |

---

# UI Contract: Select Group

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDListGroups |
| Typ | Dialog |
| Tytuł okna | "Select Group" |
| Modalność | modal (exec()) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x370 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rdlist_groups.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| groupname | QString* | parametr konstruktora (in/out) | tak |
| username | const QString& | parametr konstruktora | tak |

## Dane wyjściowe
| Dane | Typ | Kiedy |
|------|-----|-------|
| *groupname | QString | OK (done(0)) - ustawiane na wybraną grupę |
| done(0) | int | OK - grupa wybrana |
| done(-1) | int | Cancel - anulowano |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| group_group_list | Q3ListView | kolumny: "NAME" (center), "DESCRIPTION" (left) | Wyświetla grupy; double-click = OK | doubleClickedData() |
| ok_button | QPushButton | "&OK" (default) | Potwierdza wybór | okData() |
| cancel_button | QPushButton | "&Cancel" | Zamyka bez wyboru | cancelData() |

## Kolumny listy grup
| # | Nagłówek | Wyrównanie | Źródło danych |
|---|----------|------------|---------------|
| 0 | NAME | Center | USER_PERMS.GROUP_NAME |
| 1 | DESCRIPTION | Left | GROUPS.DESCRIPTION |

## Filtrowanie danych (SQL)
Tabela: USER_PERMS LEFT JOIN GROUPS ON USER_PERMS.GROUP_NAME=GROUPS.NAME
Warunek: USER_NAME = {username}
(Wyświetla tylko grupy, do których użytkownik ma uprawnienia)

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Lista z selekcją | Istnieje grupa o nazwie *groupname | Lista z podświetloną grupą (ensureItemVisible) | - |
| Lista bez selekcji | groupname nie pasuje | Lista bez podświetlenia | - |
| Lista pusta | Użytkownik nie ma uprawnień do żadnej grupy | Pusta lista | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Selekcja listy | Musi być wybrany element | (brak komunikatu - OK ignoruje klik) | okData() | kod: if(item==NULL) return |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Dowolny moduł potrzebujący wybrać grupę | new RDListGroups(&groupname, username, parent)->exec() | QString *groupname, username |
| Dialog -> caller | done(0) lub done(-1) | *groupname wypełnione wybraną nazwą grupy |

---

# UI Contract: Rivendell Services

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDListSvcs |
| Typ | Dialog |
| Tytuł okna | "{caption} - Rivendell Services" |
| Modalność | modal (exec()) |
| Rodzic | QWidget *parent |
| Rozmiar | min 300x240, resizable |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rdlistsvcs.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe (konstruktor)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | parametr konstruktora | tak |

## Dane wejściowe (exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svcname | QString* | parametr exec() (in/out) | tak |

## Dane wyjściowe
| Dane | Typ | Kiedy |
|------|-----|-------|
| *svcname | QString | OK (done(0)) - ustawiane na wybraną usługę |
| return 0 | int | OK - usługa wybrana |
| return -1 | int | Cancel - anulowano |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_svc_list | Q3ListBox | (bez nagłówka, prosta lista nazw) | Wyświetla usługi; double-click = OK | doubleClickedData() |
| edit_ok_button | QPushButton | "&OK" (default) | Potwierdza wybór | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | Zamyka bez wyboru | cancelData() |

## Filtrowanie danych (SQL)
Tabela: SERVICES
Query: SELECT NAME FROM SERVICES ORDER BY NAME
(Wszystkie usługi, sortowane alfabetycznie)

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Lista z selekcją | svcname pasuje do pozycji na liście | Lista z podświetloną usługą | - |
| Lista bez selekcji | svcname nie pasuje | Lista bez podświetlenia | - |
| Lista pusta | Brak usług w DB | Pusta lista | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Selekcja listy | currentItem() >= 0 | (brak - akceptuje nawet bez selekcji, done(0)) | okData() | kod: if >= 0 ustawia svcname |

## Uwagi
- Dialog jest reusable: konstruowany raz, wywoływany wielokrotnie przez exec(svcname).
- Dane ładowane w exec(), nie w konstruktorze - lista odświeżana przy każdym otwarciu.

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Dowolny moduł potrzebujący wybrać usługę | RDListSvcs dlg(caption, parent); dlg.exec(&svcname) | QString *svcname |
| Dialog -> caller | return 0 lub -1 | *svcname wypełnione wybraną nazwą usługi |

---

# UI Contract: Edit Slot Options

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDSlotDialog |
| Typ | Dialog |
| Tytuł okna | "{caption} - Edit Slot Options" |
| Modalność | modal (exec()) |
| Rodzic | QWidget *parent |
| Rozmiar | min 350x142, resizable |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rdslotdialog.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe (konstruktor)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | parametr konstruktora | tak |

## Dane wejściowe (exec)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| opt | RDSlotOptions* | parametr exec() (in/out) | tak |

## Dane wyjściowe
| Dane | Typ | Kiedy |
|------|-----|-------|
| opt->setMode() | RDSlotOptions::Mode | OK - zapisuje wybrany tryb |
| opt->setHookMode() | bool (0/1) | OK - zapisuje tryb odtwarzania |
| opt->setStopAction() | RDSlotOptions::StopAction | OK - zapisuje akcję po zakończeniu |
| return 0 | int | OK |
| return -1 | int | Cancel |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_mode_box | QComboBox | "Slot Mode:" | Wybór trybu slota; zmienia dostępność pól poniżej | modeActivatedData(int) |
| edit_mode_label | QLabel | "Slot Mode:" | - | - |
| edit_hook_box | QComboBox | "Play Mode:" (wartości: "Full Cart", "Hook") | Wybór trybu odtwarzania | - |
| edit_hook_label | QLabel | "Play Mode:" | - | - |
| edit_stop_action_box | QComboBox | "At Playout End:" | Wybór akcji po zakończeniu odtwarzania | - |
| edit_stop_action_label | QLabel | "At Playout End:" | - | - |
| edit_ok_button | QPushButton | "&OK" (default) | Zapisuje ustawienia | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Wartości combo boxów
### Slot Mode (RDSlotOptions::Mode)
| Index | Wartość | Enum |
|-------|---------|------|
| 0 | CartDeck (tekst z modeText()) | CartDeckMode |
| 1 | Breakaway (tekst z modeText()) | BreakawayMode |

### Play Mode
| Index | Wartość |
|-------|---------|
| 0 | Full Cart |
| 1 | Hook |

### Stop Action (RDSlotOptions::StopAction)
| Index | Wartość | Enum |
|-------|---------|------|
| 0 | Unload (tekst z stopActionText()) | UnloadOnStop |
| 1 | Recue (tekst z stopActionText()) | RecueOnStop |
| 2 | Loop (tekst z stopActionText()) | LoopOnStop |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| CartDeck mode | edit_mode_box = CartDeckMode | Wszystkie pola aktywne | - |
| Breakaway mode | edit_mode_box = BreakawayMode | Play Mode i At Playout End wyszarzone (disabled) | edit_hook_box, edit_hook_label, edit_stop_action_box, edit_stop_action_label disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | Zawsze akceptuje | - | - | - |

## Uwagi
- Dialog reusable: konstruowany raz, wywoływany wielokrotnie przez exec(opt).
- Przy exec() wartości combo boxów ustawiane z RDSlotOptions, a modeActivatedData() aktualizuje enabled/disabled.

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Moduł zarządzający cart slotami | RDSlotDialog dlg(caption, parent); dlg.exec(&opts) | RDSlotOptions* |
| Dialog -> caller | return 0 lub -1 | Zmodyfikowany obiekt RDSlotOptions |

---

# UI Contract: CD Metadata Lookup (Base)

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDDiscLookup (abstract base) |
| Typ | Dialog |
| Tytuł okna | (ustawiany przez podklasy) |
| Modalność | modal (exec() wywoływane wewnętrznie przez podklasy przy multiple matches) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x140 |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rddisclookup.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe (konstruktor)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | parametr konstruktora | tak |
| profile_msgs | FILE* | parametr konstruktora (debug log output) | nie (może być NULL) |

## Dane wejściowe (API)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| RDDiscRecord* | setCddbRecord(rec) | ustawiane przed lookup() | tak |

## Dane wyjściowe
| Dane | Typ | Kiedy |
|------|-----|-------|
| lookupDone(Result, err_msg) | signal | Po zakończeniu wyszukiwania |
| exec() return | int (index wybranego tytułu) | Przy multiple matches (wewnętrzne) |

## Widgety i interakcje (bazowe UI)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lookup_titles_label | QLabel | "Multiple Matches Found!" (centered, bold) | Informacja | - |
| lookup_titles_box | QComboBox | (lista tytułów do wyboru) | Wybór tytułu z wielu dopasowań | - |
| lookup_ok_button | QPushButton | "OK" | Potwierdza wybór tytułu | okData() |
| lookup_cancel_button | QPushButton | "Cancel" | Anuluje wybór | cancelData() |

## Sygnały
| Sygnał | Parametry | Kiedy emitowany |
|--------|-----------|-----------------|
| lookupDone | RDDiscLookup::Result, const QString &err_msg | Po zakończeniu procesu lookup (ExactMatch/NoMatch/LookupError) |

## Proces lookup()
1. Odczytuje CD-TEXT z urządzenia rippera (cdda2wav)
2. Pobiera disc ID via libdiscid (discid_read_sparse)
3. Ustawia discId, discMbId, mbSubmissionUrl na RDDiscRecord
4. Wywołuje lookupRecord() (wirtualna - implementacja w podklasach)
5. processLookup() opcjonalnie czyta ISRC z CD (discid_read - wolne!)
6. Emituje lookupDone()

## Stany widoku (dialog multiple matches)
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Chooser visible | Podklasa wywołuje exec() | Label "Multiple Matches Found!", combo z tytułami, OK/Cancel | - |
| Chooser accepted | Użytkownik kliknie OK | done(currentIndex) | - |
| Chooser cancelled | Użytkownik kliknie Cancel | done(-1) | - |

## Komunikaty błędów (QMessageBox::warning)
| Komunikat | Kiedy |
|-----------|-------|
| "Unable to create temporary directory" + path + error | Nie udało się utworzyć katalogu tymczasowego w konstruktorze |
| "Unable to read CD." + error | discid_read_sparse() lub discid_read() się nie powiedzie |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | Zawsze akceptuje wybrany index | - | - | - |

## Klasy pochodne
- RDCddbLookup (CDDB/FreeDB)
- RDMbLookup (MusicBrainz)
- RDDummyLookup (null-object stub - brak UI)

## Metody dostępne dla podklas (protected)
| Metoda | Zwraca | Opis |
|--------|--------|------|
| titlesBox() | QComboBox* | Combo z tytułami do wypełnienia |
| titlesKey() | QStringList* | Klucze wewnętrzne tytułów |
| discRecord() | RDDiscRecord* | Rekord CD |
| caption() | QString | Caption dialogu |
| profile(msg) | void | Debug logging |
| tempDirectoryPath() | QString | Ścieżka do katalogu tymczasowego |
| processLookup(result, err_msg) | void | Finalizacja lookup (ISRC + emit) |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDCdRipper / moduł rippujący CD | lookup->setCddbRecord(rec); lookup->lookup() | RDDiscRecord* |
| Wewnętrznie (podklasa) | exec() przy multiple matches | Index wybranego tytułu |
| lookup -> caller | signal lookupDone(Result, err_msg) | Wynik wyszukiwania |

---

# UI Contract: CDDB Query

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCddbLookup |
| Typ | Dialog (dziedziczy RDDiscLookup) |
| Tytuł okna | "{caption} - CDDB Query" |
| Modalność | modal (exec() przy multiple matches) |
| Rodzic | QWidget *parent |
| Rozmiar | 400x140 (odziedziczone z RDDiscLookup) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rdcddblookup.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe (konstruktor)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | parametr konstruktora | tak |
| profile_msgs | FILE* | parametr konstruktora | nie |

## Co dodaje ponad RDDiscLookup
- Ustawia windowTitle na "{caption} - CDDB Query"
- Tworzy QTcpSocket do komunikacji z serwerem CDDB
- Nie dodaje nowych widgetów UI - korzysta z odziedziczonych (titlesBox, titlesLabel, OK/Cancel)

## Dodatkowe widgety
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lookup_socket | QTcpSocket | (niewidoczny) | Komunikacja TCP z CDDB | readyReadData(), errorData() |

## Override: sourceName()
Zwraca: "CDDB"

## Override: lookupRecord()
Protokół CDDB over TCP (port 8880):
1. Łączy się z rda->libraryConf()->cddbServer()
2. Maszyna stanowa (lookup_state 0-6):
   - 0: Login Banner -> hello handshake
   - 1: Handshake Response -> proto 6
   - 2: Protocol Level -> cddb query {discid} {tracks} {offsets} {length}
   - 3: Query Response:
     - 200/201: Exact match -> cddb read
     - 210: Multiple matches -> state 4 (zbiera do listy)
     - 202/211/230: No match
   - 4: Multiple matches -> wypełnia titlesBox(), exec() -> user wybiera -> cddb read
   - 5: Read Response -> state 6
   - 6: Record Lines -> parsuje DTITLE, DYEAR, EXTD, TTITLE, EXTT

## Stany widoku (dodane)
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Lookup in progress | lookupRecord() wywołane | Wait cursor (hourglass) | - |
| Multiple matches | Serwer zwrócił kod 210 | Dialog z combo tytułów (odziedziczony z RDDiscLookup) | - |
| Exact match | Serwer zwrócił kod 200/201 | Brak dialogu - automatycznie czyta rekord | - |
| No match | Serwer zwrócił 202/211 | Brak dialogu - lookupDone(NoMatch) | - |
| Error | Błąd sieci/protokołu | Brak dialogu - lookupDone(LookupError) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak dodatkowych) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Moduł rippujący CD | lookup->setCddbRecord(rec); lookup->lookup() | RDDiscRecord* |
| Wewnętrznie | exec() przy multiple matches (state 4) | Index wybranego tytułu |
| lookup -> caller | signal lookupDone(Result, err_msg) | Wynik: ExactMatch/NoMatch/LookupError |

---

# UI Contract: MusicBrainz Lookup

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDMbLookup |
| Typ | Dialog (dziedziczy RDDiscLookup) |
| Tytuł okna | "{caption} - MusicBrainz Lookup" |
| Modalność | modal (exec() przy multiple matches) |
| Rodzic | QWidget *parent |
| Rozmiar | 500x160 (override sizeHint - większy niż baza) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | done | lib/rdmblookup.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | brak | brak |
| Mockup HTML | brak | brak |

## Dane wejściowe (konstruktor)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| caption | const QString& | parametr konstruktora | tak |
| profile_msgs | FILE* | parametr konstruktora | nie |

## Co dodaje/zmienia ponad RDDiscLookup
- Ustawia windowTitle na "{caption} - MusicBrainz Lookup"
- Ustawia titlesBox()->setIconSize(QSize(60,60)) - combo z okładkami albumów
- Tworzy cover_art_default_icon z wbudowanego XPM (60x60 px)
- Tworzy własny temp_directory do cache'owania okładek
- sizeHint() = 500x160 (vs 400x140 w bazie) - szerszy dla okładek

## Dodatkowe widgety
Brak nowych widgetów - modyfikuje odziedziczony titlesBox() (ikony 60x60).

## Override: sourceName()
Zwraca: "MusicBrainz"

## Override: sourceLogo()
Zwraca: RDLibraryConf::cdServerLogo(RDLibraryConf::MusicBrainzType)

## Override: sourceUrl()
Zwraca: "https://{mbServer}/release/{discReleaseMbId}" (lub pusty jeśli brak mbId)

## Override: lookupRecord()
Lookup via libmusicbrainz5 C++ API:
1. Tworzy CQuery z rivendell-{VERSION} user agent, serwer z rda->libraryConf()->mbServer()
2. Query("discid", discMbId)
3. Jeśli 1 release: ProcessRelease() - automatyczny exact match
4. Jeśli >1 releases: Wypełnia titlesBox() z tytułami + cover art + format + UPC barcode, exec() -> user wybiera
5. ProcessRelease() wyciąga: tytuł, artyści (NameCreditList), label, year, per-track: title, recording MbId, ISRC
6. Obsługa wyjątków: ConnectionError, TimeoutError, AuthenticationError, FetchError, RequestError, ResourceNotFoundError

## Elementy w combo (multiple matches)
Każdy element titlesBox() zawiera:
- Ikona: okładka albumu (pobrana z Cover Art Archive) lub domyślna 60x60
- Tekst: "{Title}\n [{Format}] [UPC {barcode}]"

## Cover Art (GetReleaseCover)
- Pobiera front cover z CoverArtArchive API
- Cache: QPixmapCache z kluczem "$coverart-front-{mbid}"
- Zapisuje tymczasowo do pliku, ładuje jako QPixmap, usuwa plik
- Fallback: cover_art_default_icon (wbudowany XPM)
- Błędy logowane do syslog, nie pokazywane użytkownikowi

## Stany widoku (dodane/zmienione)
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Lookup in progress | lookupRecord() wywołane | Wait cursor | - |
| Multiple matches | >1 release w MusicBrainz | Dialog z combo z okładkami albumów, formatem, UPC | - |
| Exact match | 1 release | Brak dialogu - automatycznie przetwarza | - |
| No match | Brak releasu lub user anulował | lookupDone(NoMatch) | - |
| Error | Wyjątek API (connection, timeout, auth, fetch, request) | lookupDone(LookupError, szczegóły) | - |
| Resource not found | CResourceNotFoundError | lookupDone(NoMatch) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak dodatkowych) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Moduł rippujący CD | lookup->setCddbRecord(rec); lookup->lookup() | RDDiscRecord* |
| Wewnętrznie | exec() przy multiple matches | Index wybranego release |
| lookup -> caller | signal lookupDone(Result, err_msg) | Wynik: ExactMatch/NoMatch/LookupError |

---

# UI Contract: Sound Panel Grid

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDSoundPanel |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | RDAirPlay main window |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdsound_panel.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| cols | int | konfiguracja panelu (liczba kolumn przycisków) | tak |
| rows | int | konfiguracja panelu (liczba wierszy przycisków) | tak |
| station_panels | int | liczba paneli stacji | tak |
| user_panels | int | liczba paneli użytkownika | tak |
| flash | bool | czy przyciski migają | tak |
| caption | QString | tytuł okna nadrzędnego | tak |
| label_template | QString | szablon etykiet przycisków | tak |
| extended | bool | false=PANELS, true=EXTENDED_PANELS (tablica DB) | tak |
| player | RDEventPlayer* | odtwarzacz zdarzeń RML | tak |
| cart_dialog | RDCartDialog* | dialog wyboru karty | tak |
| parent | QWidget* | widget nadrzędny | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| panel_buttons[] | RDButtonPanel* (vector) | siatka cols x rows przycisków RDPanelButton | kliknięcie przycisku w siatce | buttonMapperData(int) via QSignalMapper |
| panel_selector_box | RDComboBox | "[S:N] Panel S:N" / "[U:N] Panel U:N" | wybór aktywnego panelu (station/user) | panelActivatedData(int) |
| panel_selector_box | RDComboBox | (setup click) | kliknięcie prawym/setup | panelSetupData() |
| panel_playmode_box | QComboBox | "Play All" / "Play Hook" | wybór trybu odtwarzania (cały/hook) | playmodeActivatedData(int) |
| panel_reset_button | RDPushButton | "Reset" | reset aktywnych odtwarzań panelu | resetClickedData() |
| panel_all_button | RDPushButton | "All" | akcja na wszystkich przyciskach (ukryty domyślnie) | allClickedData() |
| panel_setup_button | RDPushButton | "Setup" | wejście w tryb konfiguracji przycisków | setupClickedData() |
| panel_button_dialog | RDButtonDialog | (dialog) | edycja przypisania karty do przycisku | exec() z buttonMapperData |
| panel_scan_timer | QTimer | (timer) | cykliczny skan panelu | scanPanelData() |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| tick() | brak | cyklicznie (odświeżanie zegara) |
| buttonFlash(bool state) | stan migania | zmiana stanu migania przycisków |
| selectClicked(unsigned cartnum, int row, int col) | numer karty, wiersz, kolumna | kliknięcie przycisku w trybie CopyFrom/CopyTo/AddTo/DeleteFrom |
| channelStarted(int mport, int card, int port) | port miksera, karta, port | rozpoczęcie odtwarzania na kanale |
| channelStopped(int mport, int card, int port) | port miksera, karta, port | zatrzymanie odtwarzania na kanale |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Normal | domyślnie | siatka przycisków z etykietami, selector, playmode, reset, setup | panel_all_button hidden |
| Setup mode | po kliknięciu Setup | kliknięcie przycisku otwiera dialog edycji (panel_button_dialog) | - |
| Reset mode | po kliknięciu Reset | kliknięcie przycisku zatrzymuje odtwarzanie na nim; reset_button miga | - |
| Playing | przycisk odtwarza cart | przycisk zmienia kolor na kolor odtwarzania | - |
| Paused | pause_enabled && kliknięcie grającego | przycisk w stanie pauzy | - |
| Disabled | brak paneli (station=0, user=0) | cały widget disabled | cały widget |
| Play All mode | playmode_box index 0 | odtwarzanie pełnej długości | - |
| Play Hook mode | playmode_box index 1 | odtwarzanie tylko hook | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDAirPlay | osadzenie w głównym oknie | konfiguracja paneli, card/port audio |
| panel_selector_box | zmiana panelu | typ panelu (Station/User) + numer |
| panel_button_dialog | edycja przycisku (Setup mode) | cart number, label, kolor |
| DB: PANELS / EXTENDED_PANELS | LoadPanel() | ROW_NO, COLUMN_NO, LABEL, CART, DEFAULT_COLOR |
| DB: PANEL_NAMES | LoadPanels() → selector items | PANEL_NO, NAME |

---

# UI Contract: Cart Slot Widget

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCartSlot |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | RDAirPlay panel area (cart decks) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcartslot.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| slotnum | int | numer slotu (0-based) | tak |
| ripc | RDRipc* | połączenie RIPC | tak |
| cae | RDCae* | Core Audio Engine | tak |
| station | RDStation* | konfiguracja stacji | tak |
| config | RDConfig* | konfiguracja systemu | tak |
| svcs_dialog | RDListSvcs* | dialog wyboru serwisów | tak |
| slot_dialog | RDSlotDialog* | dialog opcji slotu | tak |
| cart_dialog | RDCartDialog* | dialog wyboru karty | tak |
| cue_dialog | RDCueEditDialog* | dialog edycji cue | tak |
| caption | QString | tytuł okna nadrzędnego | tak |
| conf | RDAirPlayConf* | konfiguracja AirPlay | tak |
| parent | QWidget* | widget nadrzędny | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| slot_start_button | QPushButton | "{slotnum+1}" (numer slotu) | start/pause/resume odtwarzania | startData() |
| slot_box | RDSlotBox | (wyświetla metadane karty) | podwójne kliknięcie, drag & drop kart | doubleClickedData(), cartDroppedData(unsigned) |
| slot_load_button | QPushButton | "Load" / "Unload" | załaduj/wyładuj kartę | loadData() |
| slot_options_button | QPushButton | "Options\n[Full]" / "Options\n[Hook]" / "Options\n[Breakaway]" | otwórz dialog opcji slotu | optionsData() |
| slot_deck | RDPlayDeck | (wewnętrzny) | odtwarzanie audio | stateChangedData(), positionData(), hookEndData() |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| tick() | brak | cyklicznie (odświeżanie) |
| buttonFlash(bool state) | stan migania | zmiana stanu migania |
| selectClicked(unsigned cartnum, int row, int col) | numer karty, wiersz, kolumna | wybór karty z przyciskiem |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Empty | brak załadowanej karty | slot_box pusty, start_button disabled | slot_start_button disabled |
| Loaded (CartDeck mode) | karta załadowana, tryb CartDeck | metadane karty w slot_box, start enabled, load="Unload" | - |
| Loaded (Breakaway mode) | tryb Breakaway | "Waiting for break...", start disabled, options="[Breakaway]" | slot_start_button disabled |
| Playing | odtwarzanie | start_button kolor playing (BUTTON_PLAY_BACKGROUND_COLOR), progress bar w slot_box | - |
| Ready | załadowane, gotowe | start_button kolor ready (BUTTON_STOPPED_BACKGROUND_COLOR), load="Unload" | - |
| Hook mode | opcja hookMode=true | options_button="Options\n[Hook]" | - |
| Full mode | opcja hookMode=false | options_button="Options\n[Full]" | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDAirPlay | osadzenie w panelu cart slots | slotnum, ripc, cae, station, config |
| slot_load_button | kliknięcie Load → RDCartDialog | cart number do załadowania |
| slot_options_button | kliknięcie Options → RDSlotDialog | RDSlotOptions (tryb, karta, port, hookMode) |
| slot_box (double click) | doubleClickedData → RDCueEditDialog | RDLogLine do edycji cue |
| slot_box (drag & drop) | cartDroppedData(unsigned) | numer upuszczonej karty |

---

# UI Contract: Cart Slot Display Box

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDSlotBox |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | RDCartSlot |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdslotbox.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| deck | RDPlayDeck* | deck odtwarzania (do mierników) | tak |
| conf | RDAirPlayConf* | konfiguracja AirPlay | tak |
| parent | QWidget* | widget nadrzędny (RDCartSlot) | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| line_meter[0] | RDPlayMeter | "L" (lewy kanał) | wyświetla poziom audio lewego kanału | - (aktualizacja przez updateMeters) |
| line_meter[1] | RDPlayMeter | "R" (prawy kanał) | wyświetla poziom audio prawego kanału | - (aktualizacja przez updateMeters) |
| line_up_label | QLabel | (count up timer) | wyświetla czas od początku | hidden domyślnie |
| line_position_bar | QProgressBar | (pasek pozycji) | wyświetla postęp odtwarzania | hidden domyślnie |
| line_down_label | QLabel | (count down timer) | wyświetla czas do końca | hidden domyślnie |
| line_icon_label | QLabel | (ikona typu: play/rml) | wyświetla ikonę typu karty | - |
| line_cart_label | QLabel | (numer karty 6-cyfrowy) | wyświetla numer karty | - |
| line_cut_label | QLabel | (numer cutu) | wyświetla numer cutu | - |
| line_group_label | QLabel | (nazwa grupy) | wyświetla grupę karty (pogrubiona) | - |
| line_title_label | QLabel | (tytuł karty) | wyświetla tytuł (pogrubiona) | - |
| line_artist_label | QLabel | (artysta) | wyświetla artystę | hidden domyślnie |
| line_description_label | QLabel | (opis cutu) | wyświetla opis cutu | - |
| line_outcue_label | QLabel | (outcue, kursywa) | wyświetla outcue | - |
| line_talktime_label | QLabel | (czas intro/talk) | wyświetla czas talk (wyrównanie prawe) | - |
| line_length_label | QLabel | (długość MM:SS) | wyświetla długość karty (wyrównanie prawe) | - |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| doubleClicked() | brak | podwójne kliknięcie na widget (mouseDoubleClickEvent) |
| cartDropped(unsigned cartnum) | numer karty | upuszczenie karty przez drag & drop (dropEvent) |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Empty | brak karty (clear()) | puste etykiety, kolor tła LABELBOX_BACKGROUND_COLOR | up/down/position hidden |
| Cart loaded | setCart() z RDLogLine | numer karty, tytuł, artysta, grupa, długość, outcue, ikona typu | position bar może być widoczny |
| Playing (bar mode) | setBarMode(true) + pozycja | progress bar widoczny, count up/down widoczne | - |
| Stopped (no bar) | setBarMode(false) | progress bar ukryty, count up/down ukryte | up/down/position hidden |
| Service mode (Breakaway) | setMode(BreakawayMode) | wyświetla serwis i status line | - |
| Timescale active | logline->timescalingActive() | kolor tekstu LABELBOX_TIMESCALE_COLOR (fioletowy) | - |
| Hard time | logline z hard time | kolor tekstu LOG_HARDTIME_TEXT_COLOR | - |

## Palety kolorów
| Paleta | Zastosowanie |
|--------|-------------|
| line_unchanged_stop_palette | BAR_UNCHANGED_STOPPING_COLOR - pasek pozycji, normalny stop |
| line_unchanged_play_palette | BAR_UNCHANGED_TRANSITION_COLOR - pasek pozycji, normalne odtwarzanie |
| line_changed_stop_palette | BAR_CHANGED_STOPPING_COLOR - pasek, zmieniony stop |
| line_changed_play_palette | BAR_CHANGED_TRANSITION_COLOR - pasek, zmienione odtwarzanie |
| line_time_palette | czas |
| line_hard_palette | LOG_HARDTIME_TEXT_COLOR - hard time |
| line_timescale_palette | LABELBOX_TIMESCALE_COLOR - timescaling aktywne |
| line_text_palette | czarny tekst |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDCartSlot | osadzenie (slot_box) | RDPlayDeck, RDAirPlayConf |
| setCart(RDLogLine*) | załadowanie karty | RDLogLine z metadanymi |
| updateMeters(short[2]) | aktualizacja mierników audio | poziomy L/R |
| setTimer(int) | aktualizacja pozycji | pozycja w ms |

---

# UI Contract: Cue Point Editor

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCueEdit |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | dialog lub okno nadrzędne (RDCueEditDialog, inne) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcueedit.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| parent | QWidget* | widget nadrzędny | nie |

## Konfiguracja runtime (metody po konstrukcji)
| Metoda | Parametry | Opis |
|--------|-----------|------|
| setRml(player, start_rml, stop_rml) | RDEventPlayer*, QString, QString | ustawia odtwarzacz RML i komendy start/stop |
| initialize(logline) | RDLogLine* | inicjalizuje edytor z danymi karty/cutu |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| edit_position_label | QLabel (ramka) | (kontener na pasek + timery) | tło białe, ramka Box|Plain | - |
| edit_position_bar | RDMarkerBar | (pasek markerów Start/End/Play) | wizualizacja pozycji i markerów | - |
| edit_up_label | QLabel | "00:00:00" (count up) | wyświetla czas od pozycji Start | - |
| edit_down_label | QLabel | "00:00:00" (count down) | wyświetla czas do pozycji End | - |
| edit_slider | RDSlider (Right) | (suwak pozycji) | przeciąganie zmienia pozycję/marker | sliderChangedData(int), sliderPressedData(), sliderReleasedData() |
| (button area label) | QLabel | (szare tło pod przyciskami transportu) | kontener wizualny | - |
| edit_audition_button | RDTransportButton (PlayBetween) | (odtwarzaj między markerami) | odtwarzanie fragmentu Start..End | auditionButtonData() |
| edit_pause_button | RDTransportButton (Pause) | (pauza) | pauza odtwarzania | pauseButtonData() |
| edit_stop_button | RDTransportButton (Stop) | (stop) | zatrzymanie odtwarzania | stopButtonData() |
| edit_start_button | RDPushButton (toggle) | "Start" | ustaw marker Start (toggle, miga gdy aktywny) | startClickedData() |
| edit_end_button | RDPushButton (toggle) | "End" | ustaw marker End (toggle, miga gdy aktywny) | endClickedData() |
| edit_recue_button | RDPushButton (toggle) | "&Recue" | resetuj marker Start do 0 | recue() |
| edit_audition_timer | QTimer | (timer) | zatrzymanie odtwarzania po osiągnięciu End | auditionTimerData() |
| edit_play_deck | RDPlayDeck | (wewnętrzny deck) | odtwarzanie audio przez cue card/port | stateChangedData(), positionData() |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| (brak sygnałów publicznych) | - | RDCueEdit nie emituje sygnałów; komunikuje się przez metody playPosition() i stop() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Not initialized | przed initialize() | puste timery "00:00:00", slider na 0 | - |
| Stopped | po initialize() lub stop | stop_button on, slider na pozycji Play, markery widoczne | - |
| Playing (audition) | po kliknięciu audition_button | audition_button podświetlony (play color), pozycja się przesuwa | - |
| Paused | po kliknięciu pause_button | pause_button aktywny, pozycja zatrzymana | - |
| Start marker edit | edit_start_button toggled on | slider przesuwa marker Start, przycisk miga | edit_end_button off |
| End marker edit | edit_end_button toggled on | slider przesuwa marker End, przycisk miga | edit_start_button off |
| No cue hardware | cueCard < 0 lub cuePort < 0 | przyciski transportu (audition, pause, stop) disabled | audition/pause/stop disabled |
| Scheduled/Paused logline | logline status Scheduled lub Paused | start/end buttons widoczne | - |
| Active logline | logline w innym stanie | start/end buttons ukryte | edit_start_button, edit_end_button hidden |

## Interakcje klawiszowe
| Klawisz | Akcja |
|---------|-------|
| Shift (press) | ustawia edit_shift_pressed=true |
| Shift (release) | ustawia edit_shift_pressed=false |
| Prawy przycisk myszy | zatrzymuje odtwarzanie (edit_right_click_stop) |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDCueEditDialog | osadzenie | RDLogLine (przez initialize()) |
| RDCartSlot | via RDCueEditDialog | RDLogLine do edycji cue pointów |
| initialize() | ustawia markery | playPosition, endPoint, forcedLength z RDLogLine |
| playPosition(marker) | odczyt pozycji markera | pozycja Start/End/Play |

---

# UI Contract: Date Picker Calendar

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDDatePicker |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | RDDateDialog lub inny kontener |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rddatepicker.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| low_year | int | dolna granica zakresu lat | tak |
| high_year | int | górna granica zakresu lat | tak |
| parent | QWidget* | widget nadrzędny | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| pick_month_box | QComboBox | nazwy miesięcy (January..December) | wybór miesiąca | monthActivatedData(int) |
| pick_year_box | QComboBox | lata (gdy zakres <= 10 lat) | wybór roku (wariant combobox) | yearActivatedData(int) |
| pick_year_spin | QSpinBox | lata (gdy zakres > 10 lat) | wybór roku (wariant spinbox) | yearChangedData(int) |
| (day-of-week labels) | QLabel x7 | "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su" | nagłówki kolumn (Sa/Su z ciemniejszym tłem) | - |
| pick_date_label[6][7] | QLabel (siatka 6x7) | numery dni miesiąca | kliknięcie myszy wybiera dzień | mousePressEvent() |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| (brak publicznych sygnałów) | - | RDDatePicker nie deklaruje sygnałów; parent odczytuje datę przez date() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Initialized | po setDate() | siatka kalendarza z dniami bieżącego miesiąca, wybrany dzień podświetlony | - |
| Year via ComboBox | high_year - low_year <= 10 | combobox z listą lat | pick_year_spin = NULL |
| Year via SpinBox | high_year - low_year > 10 | spinbox z zakresem lat | pick_year_box = NULL |
| Weekend columns | Sa i Su | kolumny z ciemniejszym tłem (palette Mid) | - |
| Selected day | po kliknięciu dnia | wybrany dzień wyróżniony wizualnie (PrintDays) | - |

## Layout
- Rozmiar: 220 x 175 px (sizeHint)
- Wiersz 0: pick_month_box (0,0,120,26) + pick_year_box/spin (130/160, 0, 90/60, 26)
- Wiersz 1: nagłówki dni tygodnia (Mo-Su) od RDDATEPICKER_X_ORIGIN, y=30, szerokosc 30, odstep RDDATEPICKER_X_INTERVAL
- Wiersze 2-7: siatka 6x7 etykiet z dniami miesiąca

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| RDDateDialog | osadzenie | low_year, high_year, data początkowa |
| setDate(QDate) | ustawia datę | data, waliduje zakres lat |
| date() | odczytuje wybraną datę | QDate |
| mousePressEvent | kliknięcie w siatkę dni | oblicza dzień z pozycji kursora (dow, week) |

---

# UI Contract: Audio Card/Port Selector

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDCardSelector |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | dialogi konfiguracji audio (RDAdmin, inne) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcardselector.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| parent | QWidget* | widget nadrzędny | nie |

## Konfiguracja runtime (metody po konstrukcji)
| Metoda | Parametry | Opis |
|--------|-----------|------|
| setId(int) | id | ustawia identyfikator selektora (emitowany w settingsChanged) |
| setTitle(QString) | tytuł | ustawia tytuł nad selektorem; pusty=ukryty, zmienia yoffset |
| setCard(int) | numer karty | ustawia wybraną kartę |
| setPort(int) | numer portu | ustawia wybrany port |
| setMaxCards(int) | liczba | ustawia maksymalną liczbę kart |
| setMaxPorts(int card, int num) | karta, liczba portów | ustawia liczbę portów dla danej karty |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| card_title | QLabel | (tytuł opcjonalny, wyśrodkowany) | wyświetla tytuł selektora | - (hidden domyślnie) |
| card_card_box | QSpinBox | wartość karty (-1=None, 0..RD_MAX_CARDS-1) | wybór numeru karty audio | cardData(int) |
| card_card_label | QLabel | "Card:" | etykieta dla card_card_box | - |
| card_port_box | QSpinBox | wartość portu (-1=None, 0..RD_MAX_PORTS-1) | wybór numeru portu audio | portData(int) |
| card_port_label | QLabel | "Port:" | etykieta dla card_port_box | - |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| settingsChanged(int id, int card, int port) | id selektora, karta, port | zmiana portu (portData) |
| cardChanged(int card) | numer karty | zmiana wartości karty (cardData) |
| portChanged(int port) | numer portu | zmiana wartości portu (portData) |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| No card selected | card=-1 | card_card_box="None", port disabled | card_port_box disabled |
| Card selected, no port | card>=0 ale port=-1 lub max_ports=0 | karta wybrana, port="None" disabled | card_port_box disabled (gdy max_ports[card]=0) |
| Card + port selected | card>=0 i port>=0 | obie wartości ustawione | - |
| With title | setTitle(non-empty) | tytuł widoczny nad polami, yoffset=22 | card_title shown |
| Without title | setTitle("") lub domyślnie | brak tytułu, yoffset=0 | card_title hidden |

## Layout
- Rozmiar: 110 x (41 + yoffset) px (sizeHint)
- Bez tytułu (yoffset=0): Card [spinbox] na y=0, Port [spinbox] na y=22
- Z tytułem (yoffset=22): tytuł na y=0, Card na y=22, Port na y=66
- Etykiety wyrównane do prawej, spinboxy na x=60

## Logika walidacji
- Zmiana karty automatycznie aktualizuje zakres portów (card_max_ports[card])
- Jeśli max_ports[card] = 0, port jest disabled i ustawiany na -1
- Zmiana karty emituje cardChanged; zmiana portu emituje portChanged i settingsChanged

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Dialogi konfiguracji | osadzenie | setCard/setPort/setMaxPorts z konfiguracji stacji |
| cardChanged signal | zmiana karty | numer karty do parenta |
| portChanged signal | zmiana portu | numer portu do parenta |
| settingsChanged signal | zmiana portu | id + card + port do parenta |

---

# UI Contract: Dual-List Selector

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDListSelector |
| Typ | Widget |
| Tytuł okna | N/A (embedded widget) |
| Modalność | N/A |
| Rodzic | dialogi konfiguracji (np. serwisy, grupy) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdlistselector.cpp |
| Plik .ui | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ❌ | brak |

## Dane wejściowe (parametry konstruktora)
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| parent | QWidget* | widget nadrzędny | nie |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|----------------|--------|----------|-------|------|
| list_source_label | QLabel | "Available Services" (domyślnie) | etykieta listy źródłowej | - |
| list_source_box | Q3ListBox | (lista dostępnych elementów) | wyświetla elementy do dodania | - |
| list_add_button | QPushButton | "Add >>" | przenosi wybrany element z source do dest | addData() |
| list_remove_button | QPushButton | "<< Remove" | przenosi wybrany element z dest do source | removeData() |
| list_dest_label | QLabel | "Active Services" (domyślnie) | etykieta listy docelowej | - |
| list_dest_box | Q3ListBox | (lista aktywnych elementów) | wyświetla wybrane elementy | - |

## Sygnały emitowane (widgets expose signals to parent)
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| (brak publicznych sygnałów) | - | RDListSelector nie deklaruje sygnałów; parent odczytuje stan przez API metod |

## API programistyczne (metody dostępu)
| Metoda | Zwraca | Opis |
|--------|--------|------|
| sourceCount() | uint | liczba elementów w liście źródłowej |
| destCount() | uint | liczba elementów w liście docelowej |
| sourceSetLabel(label) | void | zmiana etykiety listy źródłowej |
| destSetLabel(label) | void | zmiana etykiety listy docelowej |
| sourceInsertItem(text, index) | void | wstaw element do listy źródłowej (auto-sort) |
| destInsertItem(text, index) | void | wstaw element do listy docelowej (auto-sort) |
| sourceRemoveItem(index) | void | usuń element z listy źródłowej |
| destRemoveItem(index) | void | usuń element z listy docelowej |
| sourceText(index) / destText(index) | QString | tekst elementu |
| sourceCurrentItem() / destCurrentItem() | int | indeks aktualnie wybranego |
| sourceCurrentText() / destCurrentText() | QString | tekst aktualnie wybranego |
| clear() | void | wyczyść obie listy |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|-----------------|
| Empty | po konstrukcji lub clear() | obie listy puste, oba przyciski disabled | list_add_button disabled, list_remove_button disabled |
| Source only | elementy tylko w source | lista źródłowa z elementami, "Add >>" enabled po wybraniu | list_remove_button disabled |
| Dest only | elementy tylko w dest | lista docelowa z elementami, "<< Remove" enabled po wybraniu | list_add_button disabled |
| Both populated | elementy w obu listach | obie listy z elementami, oba przyciski potencjalnie enabled | - |
| Add clicked | kliknięcie "Add >>" | element przeniesiony z source do dest, obie listy posortowane | list_add_button disabled jeśli source puste |
| Remove clicked | kliknięcie "<< Remove" | element przeniesiony z dest do source, obie listy posortowane | list_remove_button disabled jeśli dest puste |

## Layout (resizeEvent)
- Trzy kolumny: source (1/3 szerokości) | przyciski (1/3) | dest (1/3)
- list_source_label: (0, 0, w/3, 12)
- list_source_box: (0, 12, w/3, h-12)
- list_add_button: (w/3+20, 20, w/3-40, 25)
- list_remove_button: (w/3+20, 2*h/3-3, w/3-40, 25)
- list_dest_label: (2*w/3, 0, w/3, 12)
- list_dest_box: (2*w/3, 12, w/3, h-12)

## Logika interakcji
- Po "Add >>": przenosi currentText z source do dest, sortuje dest, czyści zaznaczenie w source
- Po "<< Remove": przenosi currentText z dest do source, sortuje source, czyści zaznaczenie w dest
- Przyciski aktywowane/dezaktywowane przez CheckButtons() na podstawie niepustości list
- Elementy w obu listach automatycznie sortowane alfabetycznie

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Dialogi konfiguracji | osadzenie | wypełnienie list przez sourceInsertItem/destInsertItem |
| sourceSetLabel / destSetLabel | zmiana etykiet | kontekstowe nazwy kolumn |
| sourceCount / destCount | odczyt stanu | parent sprawdza ile elementów w każdej liście |

---

# UI Contract: Log Filter Widget

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDLogFilter |
| Typ | Widget (custom control) |
| Rodzic | QWidget |
| Opis | Composite filter widget for picking Rivendell logs by service, text, and recency |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdlogfilter.cpp |
| Header | ✅ | lib/rdlogfilter.h |

## Układ wizualny
Dwa rzędy:
- Row 1: [Service label (70px)] [Service combo (140px)] [Filter label (50px)] [Filter text edit (stretches)] [Clear button (50px)]
- Row 2: [Checkbox (15px)] [Label "Show Only Recent Logs"]

Preferred size: 400x60, policy: MinimumExpanding x Fixed.

## Enum: FilterMode
| Wartość | Opis |
|---------|------|
| NoFilter (0) | All services from SERVICES table |
| UserFilter (1) | Services filtered by USER_SERVICE_PERMS for current user |
| StationFilter (2) | Services filtered by SERVICE_PERMS for current station |

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| whereSql() | QString | Returns SQL WHERE clause fragment based on current filter state |
| changeUser() | slot | Refreshes service list (only in UserFilter mode) |
| sizeHint() | QSize | Returns QSize(400,60) |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| filterChanged | const QString &where_sql | Emitted when any filter element changes (service, text, recent checkbox) |

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| changeUser | none | Refreshes service combo based on current user permissions |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| All services | Service combo at index 0 | "ALL" selected, SQL filters by all available services |
| Specific service | Service combo > index 0 | Single service selected, SQL filters by that service |
| Text filter active | Filter edit has text | SQL adds LIKE conditions on NAME, DESCRIPTION, SERVICE |
| Recent logs | Checkbox checked | SQL adds ORDER BY ORIGIN_DATETIME DESC LIMIT N |

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| mode | RDLogFilter::FilterMode | Tak |
| parent | QWidget* | Nie |

## Zachowanie SQL
- Service combo at "ALL": generates OR clause for all available services
- Service combo at specific: generates `SERVICE="name"` clause
- Text filter: adds LIKE on LOGS.NAME, LOGS.DESCRIPTION (and LOGS.SERVICE when ALL)
- Recent checkbox: appends `ORDER BY ORIGIN_DATETIME DESC LIMIT RD_LOGFILTER_LIMIT_QUAN`

---

# UI Contract: GPIO Pin Selector

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDGpioSelector |
| Typ | Widget (custom control) |
| Rodzic | QWidget |
| Opis | Simple spinbox-based selector for GPIO pin number |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdgpioselector.cpp |
| Header | ✅ | lib/rdgpioselector.h |

## Układ wizualny
Single row: [Label "Pin:" (55px, right-aligned)] [SpinBox (50px)]

Fixed size: 110x87.

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| pin() | int | Returns current pin number (-1 = None) |
| setPin(int) | void | Sets the current pin number |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| pinChanged | int card | Emitted when spinbox value changes |

## Sloty publiczne
Brak.

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| None | value == -1 | Spinbox shows "None" (specialValueText) |
| Pin selected | value >= 0 | Spinbox shows pin number (0 to MAX_GPIO_PINS-1) |

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| parent | QWidget* | Nie |

---

# UI Contract: Stereo Level Meter

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDStereoMeter |
| Typ | Widget (custom control) |
| Rodzic | QWidget |
| Opis | Dual-channel stereo audio level meter with L/R labels, dB scale, clip indicator |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdstereometer.cpp |
| Header | ✅ | lib/rdstereometer.h |

## Układ wizualny
Black background, fixed size 335x60 (or 335x80 with label).

Layout:
- Left column: "L" at y=20, "R" at y=50 (white text on black)
- Center: Two horizontal RDSegMeter bars (300x10 each) at y=10 (left) and y=40 (right)
- Scale labels between bars: -30, -25, -20, -15, -10, -5, 0, +8
- "CLIP" text in red appears at right side when clip_light_on
- Optional label below meters (centered, 18px bold font)

Default meter range: -4600 to -800 (hundredths of dB).
Default high threshold: -1600, clip threshold: -1100.

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| setReference(int) | void | Set reference level offset (applied to all bar setters) |
| setClipLight(int) | void | Set clip light trigger level |
| setLabel(QString) | void | Set optional label below meters (resizes widget to 335x80) |
| mode() | RDSegMeter::Mode | Current mode (Independent or Peak) |
| setMode(Mode) | void | Set meter mode for both channels |
| setDarkLowColor(QColor) | void | Set dark (unlit) low-range segment color |
| setDarkHighColor(QColor) | void | Set dark high-range segment color |
| setDarkClipColor(QColor) | void | Set dark clip-range segment color |
| setLowColor(QColor) | void | Set lit low-range segment color |
| setHighColor(QColor) | void | Set lit high-range segment color |
| setClipColor(QColor) | void | Set lit clip-range segment color |
| setHighThreshold(int) | void | Set threshold between low and high ranges |
| setClipThreshold(int) | void | Set threshold between high and clip ranges |
| setSegmentSize(int) | void | Set segment width in pixels |
| setSegmentGap(int) | void | Set gap between segments in pixels |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| clip | none | Emitted when any bar level reaches clip_light_level |

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| setLeftSolidBar | int level | Set left channel solid bar level (ref-adjusted) |
| setRightSolidBar | int level | Set right channel solid bar level (ref-adjusted) |
| setLeftFloatingBar | int level | Set left channel floating bar level (ref-adjusted) |
| setRightFloatingBar | int level | Set right channel floating bar level (ref-adjusted) |
| setLeftPeakBar | int level | Set left channel peak bar level (ref-adjusted) |
| setRightPeakBar | int level | Set right channel peak bar level (ref-adjusted) |
| resetClipLight | none | Turn off the CLIP indicator |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Normal | clip_light_on == false | Two segmented bars with scale labels, no CLIP text |
| Clip | clip_light_on == true | Red "CLIP" text appears at position (274,35) |
| With label | meter_label non-empty | Widget height 80px, label centered below meters |
| Without label | meter_label empty | Widget height 60px |

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| parent | QWidget* | Nie |

## Relacje
- Contains two RDSegMeter instances (left_meter, right_meter)
- Delegates all color/threshold/segment settings to both meters
- Reference level is subtracted from all level values before passing to meters

---

# UI Contract: Segmented Bar-Graph Meter

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDSegMeter |
| Typ | Widget (custom control) |
| Rodzic | QWidget |
| Opis | Single-channel segmented audio level meter with configurable orientation, colors, and modes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdsegmeter.cpp |
| Header | ✅ | lib/rdsegmeter.h |

## Enum: Orientation
| Wartość | Opis |
|---------|------|
| Left (0) | Bar grows from right to left |
| Right (1) | Bar grows from left to right |
| Up (2) | Bar grows from bottom to top |
| Down (3) | Bar grows from top to bottom |

## Enum: Mode
| Wartość | Opis |
|---------|------|
| Independent (0) | Solid bar and floating bar are set independently |
| Peak (1) | Floating bar shows peak hold, auto-decays after PEAK_HOLD_TIME (750ms) |

## Układ wizualny
Black background, custom-painted segmented bar. Each segment = seg_size pixels wide, with seg_gap pixel gap.

Three color ranges:
- Low range: range_min to high_threshold (default: green / dark green)
- High range: high_threshold to clip_threshold (default: yellow / dark yellow)
- Clip range: clip_threshold to range_max (default: red / dark red)

Unlit segments drawn in dark colors, lit segments in bright colors.
Optional floating segment drawn in the color corresponding to its level.

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| setRange(int min, int max) | void | Set value range (default: -3000 to 0) |
| setDarkLowColor(QColor) | void | Unlit low-range color |
| setDarkHighColor(QColor) | void | Unlit high-range color |
| setDarkClipColor(QColor) | void | Unlit clip-range color |
| setLowColor(QColor) | void | Lit low-range color |
| setHighColor(QColor) | void | Lit high-range color |
| setClipColor(QColor) | void | Lit clip-range color |
| setHighThreshold(int) | void | Threshold between low and high (default: -14) |
| setClipThreshold(int) | void | Threshold between high and clip (default: 0) |
| setSegmentSize(int) | void | Segment width in pixels (default: 2) |
| setSegmentGap(int) | void | Gap between segments in pixels (default: 1) |
| mode() | Mode | Current mode |
| setMode(Mode) | void | Set mode (starts/stops peak timer) |

## Sygnały
Brak.

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| setSolidBar | int level | Set main bar level (Independent mode only) |
| setFloatingBar | int level | Set floating marker level (Independent mode only) |
| setPeakBar | int level | Set bar + auto-peak (Peak mode only) |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Idle | level < range_min | All segments dark |
| Low only | level < high_threshold | Green segments lit up to level |
| Low+High | level < clip_threshold | Green + yellow segments lit |
| Low+High+Clip | level >= clip_threshold | Green + yellow + red segments lit |
| Peak hold | Mode=Peak, after peak | Floating segment lingers at peak, decays after 750ms |

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| o | RDSegMeter::Orientation | Tak |
| parent | QWidget* | Nie |

## Rendering
- Custom paintEvent with double-buffered QPixmap
- Orientation handled by QPainter translate/rotate for Left/Up directions
- Segments painted as filled rectangles: i*seg_total offset, seg_size width

---

# UI Contract: Simple Player Widget

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDSimplePlayer |
| Typ | Widget (custom control) |
| Rodzic | QWidget |
| Opis | Minimal play/stop widget for previewing Rivendell carts with two transport buttons |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdsimpleplayer.cpp |
| Header | ✅ | lib/rdsimpleplayer.h |

## Układ wizualny
Widget is hidden (hide() in constructor). It exposes two RDTransportButton instances (Play and Stop) which are created with the parent widget, not this widget. The caller is responsible for positioning the buttons via playButton() and stopButton() accessors.

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| setCart(unsigned) | void | Set cart number to play |
| setCart(QString) | void | Set cart (and optionally cut) from "CART_CUT" format string |
| setCut(QString) | void | Set specific cut name |
| isPlaying() | bool | Returns true if currently playing |
| playButton() | RDTransportButton* | Returns the Play transport button |
| stopButton() | RDTransportButton* | Returns the Stop transport button |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| played | none | Emitted when playback starts (CAE reports playing) |
| stopped | none | Emitted when playback stops |

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| play | none | Start playback from beginning |
| play | int start_pos | Start playback from given position (ms) |
| stop | none | Stop current playback |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Stopped | is_playing == false | Play button off, Stop button on (highlighted) |
| Playing | is_playing == true | Play button on (highlighted), Stop button off |
| Disabled | card < 0 or port < 0 | Both buttons disabled |

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| cae | RDCae* | Tak |
| ripc | RDRipc* | Tak |
| card | int | Tak |
| port | int | Tak |
| start_cart | unsigned | Tak (event cart for play start) |
| end_cart | unsigned | Tak (event cart for play stop) |
| parent | QWidget* | Nie |

## Zachowanie
- On play: selects cut if not specified, loads via CAE, positions, plays with gain from CUTS table
- On stop: calls CAE stopPlay
- Uses RDEventPlayer to trigger start_cart/end_cart events on play/stop
- Manages a queue of handles for overlapping play requests

---

# UI Contract: Time Editor

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDTimeEdit |
| Typ | Widget (custom control) |
| Rodzic | Q3Frame |
| Opis | Custom time editor with HH:MM:SS.t precision and up/down transport buttons |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdtimeedit.cpp |
| Header | ✅ | lib/rdtimeedit.h |

## Układ wizualny
Sunken frame with inline labels for each time segment, separated by ":" and "." characters, plus Up/Down arrow buttons on the right.

Layout: [HH] [:] [MM] [:] [SS] [.] [t] [Up btn / Down btn]

Each segment is a QLabel with centered text. Separators are also QLabels.
Up/Down are RDTransportButton (Up/Down type), stacked vertically at right edge.

## Enum: Display (bitmask)
| Wartość | Hex | Opis |
|---------|-----|------|
| Hours | 0x01 | Show hours field |
| Minutes | 0x02 | Show minutes field |
| Seconds | 0x04 | Show seconds field |
| Tenths | 0x08 | Show tenths-of-second field |

Default display: Hours | Minutes | Seconds.

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| time() | QTime | Returns current time value |
| isReadOnly() | bool | Whether editing is disabled |
| display() | uint | Current display bitmask |
| setDisplay(uint) | void | Configure which fields are visible |
| setFont(QFont) | void | Set font (recalculates sizes) |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| valueChanged | const QTime &time | Emitted on any value change (buttons, keys, wheel) |

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| setTime | const QTime &time | Set displayed time |
| setReadOnly | bool state | Enable/disable editing |
| setFocus | none | Focus current section (highlights it) |
| setGeometry | int x,y,w,h | Position and layout all child widgets |
| setGeometry | const QRect &r | Overloaded version |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Normal | no focus | White background, black text |
| Focused section | setFocus called | Active section highlighted (system highlight color) |
| Read-only | setReadOnly(true) | Focus policy NoFocus, no editing |

## Interakcja
- **Mouse click**: Selects section based on click x-position
- **Mouse wheel**: Up/down on current section
- **Arrow keys**: Left/Right switch sections, Up/Down adjust value
- **Number keys**: Direct digit entry (two-digit for HH/MM/SS, one-digit for tenths)
- **Up/Down buttons**: Increment/decrement current section with wrapping (23->0 for hours, 59->0 for min/sec, 9->0 for tenths)

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| parent | QWidget* | Nie |

---

# UI Contract: Extended Push Button with Flash

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDPushButton |
| Typ | Widget (custom control) |
| Rodzic | QPushButton + RDFontEngine |
| Opis | Push button with flashing capability, word wrap, middle/right click signals, and configurable clock source |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdpushbutton.cpp |
| Header | ✅ | lib/rdpushbutton.h |

## Enum: ClockSource
| Wartość | Opis |
|---------|------|
| InternalClock (0) | Flash driven by internal QTimer |
| ExternalClock (1) | Flash driven by external tickClock() calls |

## Stałe
| Nazwa | Wartość | Opis |
|-------|---------|------|
| RDPUSHBUTTON_DEFAULT_FLASH_PERIOD | 300 | Default flash period in ms |
| RDPUSHBUTTON_DEFAULT_FLASH_COLOR | Qt::blue | Default flash color |

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| text() | QString | Get plain text |
| setText(QString) | void | Set text (triggers word-wrap recomposition if enabled) |
| wordWrap() | bool | Whether word wrap is enabled |
| setWordWrap(bool) | void | Enable/disable auto word wrap |
| flashColor() | QColor | Current flash color |
| setFlashColor(QColor) | void | Set flash color (auto-computes text contrast color) |
| flashPeriod() | int | Flash period in ms |
| setFlashPeriod(int) | void | Set flash period |
| clockSource() | ClockSource | Current clock source |
| setClockSource(ClockSource) | void | Switch between internal/external clock |
| id() | int | Button ID for signal identification |
| setId(int) | void | Set button ID |
| flashingEnabled() | bool | Whether flashing is active |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| centerClicked | none | Middle mouse button click |
| centerClicked | int id, const QPoint &pt | Middle click with button ID and position |
| centerPressed | none | Middle mouse button pressed |
| centerReleased | none | Middle mouse button released |
| rightClicked | none | Right mouse button click |
| rightClicked | int id, const QPoint &pt | Right click with button ID and position |
| rightPressed | none | Right mouse button pressed |
| rightReleased | none | Right mouse button released |

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| setFlashingEnabled | bool state | Start/stop flashing |
| setPalette | const QPalette & | Set off-state palette |
| tickClock | none | Toggle flash state (for external clock) |
| tickClock | bool state | Set flash state explicitly (for external clock) |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Normal | flashing disabled | Standard button appearance with off_palette |
| Flash ON | flashing enabled, flash_state=false | flash_palette (flash_color background, auto-contrast text) |
| Flash OFF | flashing enabled, flash_state=true | off_palette (normal appearance) |

## Word Wrap
When enabled, ComposeText() iteratively reduces font size until text fits within 90% of button area, splitting on spaces. Maximum font starts at height/2, decreases by 2pt each iteration, minimum 6pt.

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| parent | QWidget* | Nie (=0) |
| c | RDConfig* | Nie (=NULL) |

Overloaded constructors also accept: `const QString &text` and/or `const QIcon &icon`.

---

# UI Contract: Audio Transport Icon Button

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDTransportButton |
| Typ | Widget (custom control) |
| Rodzic | QPushButton |
| Opis | Push button with programmatically drawn transport icons (play, stop, record, etc.) and On/Off/Flashing states |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdtransportbutton.cpp |
| Header | ✅ | lib/rdtransportbutton.h |

## Enum: TransType (icon types)
| Wartość | Ikona |
|---------|-------|
| Play (0) | Right-pointing triangle |
| Stop (1) | Filled square |
| Record (2) | Filled circle |
| FastForward (3) | Double right-pointing triangles |
| Rewind (4) | Double left-pointing triangles |
| Eject (5) | Upward triangle + horizontal bar |
| Pause (6) | Two vertical bars |
| PlayFrom (7) | Vertical line + right triangle |
| PlayBetween (8) | Vertical line + right triangle + vertical line |
| Loop (9) | Arc + arrow triangle |
| Up (10) | Upward-pointing triangle |
| Down (11) | Downward-pointing triangle |
| PlayTo (12) | Right triangle + vertical line |

## Enum: TransState
| Wartość | Opis |
|---------|------|
| On (0) | Button shows on_cap (colored icon) |
| Off (1) | Button shows off_cap (grey icon) |
| Flashing (2) | Button alternates between on_cap and off_cap |

## Stałe
| Nazwa | Wartość |
|-------|---------|
| RDTRANSPORTBUTTON_DEFAULT_ON_COLOR | Qt::green |

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| getType() | TransType | Current icon type |
| setType(TransType) | void | Change icon type |
| onColor() | QColor | Color used for "on" state icon |
| setOnColor(QColor) | void | Set on-state color (redraws both caps) |
| accentColor() | QColor | Accent color for icon edges |
| setAccentColor(QColor) | void | Set accent color (redraws both caps) |
| setState(TransState) | void | Set button state |

## Sygnały
Inherited from QPushButton (clicked(), pressed(), released()).

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| on | none | setState(On) |
| off | none | setState(Off) |
| flash | none | setState(Flashing) |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| On | setState(On) | Icon drawn in on_color (default green) with 3D edges |
| Off | setState(Off) | Icon drawn in grey/shadow color |
| Flashing | setState(Flashing) | Timer alternates between on_cap and off_cap |

## Rendering
- Two QPixmaps: on_cap (colored) and off_cap (grey)
- Each cap has a bitmap mask shaped to the icon type
- Icons are vector-drawn using QPainter with 3D edge effects (shadow, dark, light lines)
- Icon size scales to 60% of button area (3*edge/10 from center)
- Caps are redrawn on resize

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| type | RDTransportButton::TransType | Tak |
| parent | QWidget* | Nie |

---

# UI Contract: Sound Panel Button

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDPanelButton |
| Typ | Widget (custom control) |
| Rodzic | RDPushButton |
| Opis | Rich sound panel button for RDAirPlay with cart assignment, countdown timer, color states, drag-and-drop, and flash effects |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdpanel_button.cpp |
| Header | ✅ | lib/rdpanel_button.h |

## Układ wizualny
Custom-painted keycap via WriteKeycap():
- Top 3 lines: Cart title text (word-wrapped to fit button width, using buttonFont())
- Bottom-left: Countdown timer or total length (using smallTimerFont/timerFont)
- Bottom-right: Output text (using timerFont)
- Background color: button_color (changes based on state)
- Text color: Auto-computed contrast via RDGetTextColor()

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| clear() | void | Reset all fields to defaults |
| text() / setText(QString) | QString/void | Cart title text |
| outputText() / setOutputText(QString) | QString/void | Output label text (bottom-right) |
| state() / setState(bool) | bool/void | Active/inactive state |
| defaultColor() / setDefaultColor(QColor) | QColor/void | Default background color |
| setColor(QColor) | void | Set current background color |
| cart() / setCart(unsigned) | unsigned/void | Assigned cart number |
| cutName() / setCutName(QString) | QString/void | Assigned cut name |
| deck() / setDeck(int) | int/void | Playout deck index |
| startTime() / setStartTime(QTime) | QTime/void | Playback start time |
| hookMode() / setHookMode(bool) | bool/void | Hook play mode |
| playDeck() / setPlayDeck(RDPlayDeck*) | ptr/void | Associated play deck |
| output() / setOutput(int) | int/void | Audio output number |
| length(bool hookmode) / setLength(bool,int) | int/void | Track length (normal/hook) |
| setActiveLength(int) | void | Currently active length for countdown |
| reset() | void | Reset to default state (keeps cart) |
| pauseWhenFinished() / setPauseWhenFinished(bool) | bool/void | Pause mode flag |
| duckVolume() / setDuckVolume(int) | int/void | Duck volume level |
| setAllowDrags(bool) | void | Enable/disable drag-and-drop |
| resetCounter() | void | Reset countdown display |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| cartDropped | int row, int col, unsigned cartnum, const QColor &color, const QString &title | When a cart is dropped onto this button |

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| tickClock | none | Update countdown timer based on current time vs end_time |
| flashButton | bool state | Toggle flash state (for external flash coordination) |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Empty | cart == 0 | Light grey, no text |
| Loaded (idle) | cart > 0, state == false | button_color background, title + length display |
| Active | state == true, flash off | button_color background, countdown timer |
| Active + flashing | state == true, flash == true, flash_state alternates | Alternates between button_color and default_color |
| Countdown > 8s | secs > 8 | Normal timer font, MM:SS format |
| Countdown <= 8s | secs <= 8 | Large timer font, ":N" format (seconds only) |
| Pause when finished | pauseWhenFinished == true, idle | Shows "Finished" text |
| No audio | active_length < 0 | Shows "No Audio" text |

## Drag and Drop
- Drag: After 10 mouseMoveEvents, creates RDCartDrag with cart number, title, and color
- Drop: Accepts RDCartDrag when allow_drags is true and button is not playing (play_deck NULL or Stopped)
- Drop emits cartDropped signal

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| row | int | Tak (grid row position) |
| col | int | Tak (grid column position) |
| station | RDStation* | Tak (for time offset) |
| flash | bool | Tak (enable flash capability) |
| parent | QWidget* | Nie |

---

# UI Contract: Marker Button

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDMarkerButton |
| Typ | Widget (custom control) |
| Rodzic | RDPushButton |
| Opis | Trivial RDPushButton subclass that ignores all key press events (keyboard-inert button for marker editing in RDLibrary) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdmarker_button.cpp |
| Header | ✅ | lib/rdmarker_button.h |

## API publiczne
Inherits all API from RDPushButton. No additional methods.

## Sygnały
Inherits all signals from RDPushButton.

## Sloty publiczne
Inherits all slots from RDPushButton.

## Stany wizualne
Same as RDPushButton. The only behavioral difference is that keyPressEvent is overridden to call e->ignore(), preventing keyboard interaction.

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| parent | QWidget* | Tak |

Overloaded constructors: `(const QString &text, QWidget *parent)` and `(const QIcon &icon, const QString &text, QWidget *parent)`.

---

# UI Contract: Extended Combo Box

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDComboBox |
| Typ | Widget (custom control) |
| Rodzic | QComboBox |
| Opis | Extended combo box with unique item insertion, setup mode (click intercept), and key filtering |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdcombobox.cpp |
| Header | ✅ | lib/rdcombobox.h |

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| insertItem(QString, bool unique) | void | Insert item; if unique=true, skips duplicates |
| setSetupMode(bool) | void | Enable setup mode: mouse clicks emit setupClicked instead of opening dropdown |
| addIgnoredKey(int) | void | Add a key code to ignore list (keyPressEvent ignores these keys) |

## Sygnały
| Sygnał | Parametry | Kiedy |
|--------|-----------|-------|
| setupClicked | none | Mouse press in setup mode |

## Sloty publiczne
Brak (beyond inherited QComboBox slots).

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Normal | setup_mode == false | Standard QComboBox behavior |
| Setup mode | setup_mode == true | Click does not open dropdown, emits setupClicked signal instead |

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| parent | QWidget* | Nie |

---

# UI Contract: Image Picker Combo Box

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RDImagePickerBox |
| Typ | Widget (custom control) |
| Rodzic | QComboBox |
| Opis | Combo box that displays images from a database table via RDImagePickerModel, with category filtering and auto-scaling thumbnails |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | lib/rdimagepickerbox.cpp |
| Header | ✅ | lib/rdimagepickerbox.h |

## API publiczne
| Metoda/Property | Typ | Opis |
|-----------------|-----|------|
| currentImageId() | int | Returns image ID of currently selected item (-1 if none) |
| refresh() | void | Refresh model data, preserving current selection |

## Sygnały
Inherited from QComboBox (currentIndexChanged, etc.).

## Sloty publiczne
| Slot | Parametry | Efekt |
|------|-----------|-------|
| setCurrentImageId | int img_id | Select item by image ID |
| setCategoryId | int id | Filter images by category, resets selection to first |

## Stany wizualne
| Stan | Kiedy | Wygląd |
|------|-------|--------|
| Populated | model has images | Combo shows image thumbnails (scaled to height-4 px square) as icons |
| Empty | no images for category | Empty combo box |

## Zachowanie resize
On resize, rescales all thumbnails to (height-4, height-4) via model, preserving current selection index.

## Dane wejściowe (konstruktor)
| Dane | Typ | Wymagane |
|------|-----|----------|
| tbl_name | const QString & | Tak (database table name) |
| cat_id_col | const QString & | Tak (category ID column name) |
| img_id_col | const QString & | Tak (image ID column name) |
| parent | QWidget* | Nie |

## Relacje
- Uses RDImagePickerModel as the data model (MVC pattern)
- Model handles DB queries, image scaling, and category filtering

---

## Mapowanie screenshotów

| Klasa | Screenshot | Tytuł z screenshota |
|-------|-----------|---------------------|
| RDCartDialog | docs/opsguide/rdcartslots.select_cart_dialog.png | Select Cart |
| RDCutDialog | docs/opsguide/rdcastmanager.select_cut_dialog.png | Select Cut |
| RDEditAudio | docs/opsguide/rdlibrary.edit_marker_dialog.png | Edit Audio |
| RDImportAudio | docs/opsguide/rdlibrary.import_export_dialog.png | Import/Export Audio File |
| RDListLogs | docs/opsguide/rdairplay.select_a_log_dialog.png | Select Log |
| RDSlotDialog | docs/opsguide/rdcartslots.rdcartslots.edit_slot_options_dialog.png | Edit Slot Options |
| RDSchedCodesDialog | docs/opsguide/rdadmin.select_scheduler_codes_dialog.png | Select Scheduler Codes |
| RDDateDialog | docs/opsguide/rdlogmanager.select_date_dialog.png | Select Date |
| RDStereoMeter | docs/opsguide/rdairplay.audio_meter.png | Audio Meter |
| RDSoundPanel | docs/opsguide/rdairplay.soundpanel_widget.png | Sound Panel |
| RDDiscLookup | docs/opsguide/rdlibrary.cd_ripper_dialog.png | Rip CD |
