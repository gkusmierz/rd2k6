---
phase: 3
artifact: LIB
artifact_name: librd
status: done
completed_at: 2026-04-05
windows_total: 0
dialogs_total: 19
panels_total: 5
agent_version: 1.1.0
---

# UI Contracts: librd

## Uwaga: biblioteka z programowym UI

librd jest biblioteką wspoldzielona -- NIE ma wlasnych okien MainWindow.
Wszystkie okna UI w librd to **dialogi modalne** i **widgety wielokrotnego uzytku**
uzywane przez aplikacje (rdairplay, rdlibrary, rdadmin, itd.).

Brak plikow .ui — cale UI jest budowane programowo w konstruktorach C++.

## Przeglad okien

| Klasa | Typ | Tytul | Otwierany przez | Modalnosc |
|-------|-----|-------|----------------|-----------|
| RDCartDialog | Dialog | "{caption} - Select Cart" | Rozne aplikacje | modal |
| RDCutDialog | Dialog | "{caption} - Select Cut" | Rozne aplikacje | modal |
| RDEditAudio | Dialog | "Edit Audio" | RDLibrary, inne | modal |
| RDImportAudio | Dialog | "{caption} - Import/Export Audio File" | RDLibrary, inne | modal |
| RDButtonDialog | Dialog | "{caption} - Edit Button" | RDSoundPanel | modal |
| RDCueEditDialog | Dialog | "{caption} - Set Cue Point" | Rozne | modal |
| RDWaveDataDialog | Dialog | "{caption} - Edit Cart Label" | RDLibrary, inne | modal |
| RDExportSettingsDialog | Dialog | "{caption} - Edit Audio Settings" | RDImportAudio, inne | modal |
| RDSlotDialog | Dialog | "{caption} - Edit Slot Options" | RDCartSlot | modal |
| RDSchedCodesDialog | Dialog | "Select Scheduler Codes" | RDAdmin, inne | modal |
| RDAddCart | Dialog | "{caption} - Add Cart" | RDLibrary | modal |
| RDAddLog | Dialog | "Add Log" | RDLogEdit, RDLogManager | modal |
| RDGetPasswd | Dialog | "Enter Password" | RDLogin, inne | modal |
| RDPasswd | Dialog | "Change Password" | RDAdmin | modal |
| RDGetAth | Dialog | "Enter ATH" | Rozne | modal |
| RDDateDialog | Dialog | "Select Date" | Rozne | modal |
| RDEditPanelName | Dialog | "Edit Panel Name" | RDSoundPanel | modal |
| RDBusyDialog | Dialog | (bez tytulu) | Rozne (operacje dlugotrawale) | modal |
| RDListLogs | Dialog | "Select Log" | RDAirPlay, inne | modal |
| RDListGroups | Dialog | "Select Group" | Rozne | modal |
| RDListSvcs | Dialog | "{caption} - Rivendell Services" | Rozne | modal |
| RDCddbLookup | Dialog | "{caption} - CDDB Query" | RDLibrary | modal |
| RDMbLookup | Dialog | "{caption} - MusicBrainz Lookup" | RDLibrary | modal |
| RDSoundPanel | Widget | (wbudowany) | RDAirPlay, RDPanel | modeless |
| RDCartSlot | Widget | (wbudowany) | RDCartSlots | modeless |
| RDSimplePlayer | Widget | (wbudowany) | RDCartDialog, inne | modeless |
| RDCueEdit | Widget | (wbudowany) | RDEditAudio | modeless |

## Navigation Flow

```
{Aplikacja (np. RDLibrary)}
    |-- [przycisk "Select Cart"] --> RDCartDialog (modal)
    |       |-- [double-click] --> zwraca cart_number
    |       |-- [Load From File] --> QFileDialog (import audio)
    |       |-- [Send to Editor] --> uruchamia zewnetrzny edytor
    |       +-- [wbudowany RDSimplePlayer] --> podsłuch carta
    |
    |-- [przycisk "Edit Audio"] --> RDEditAudio (modal)
    |       |-- [waveform click] --> ustawianie markerow
    |       +-- [play/stop/pause] --> odtwarzanie z prerollem
    |
    |-- [przycisk "Import"] --> RDImportAudio (modal)
    |       |-- [Select input] --> QFileDialog
    |       |-- [Set format] --> RDExportSettingsDialog (modal)
    |       +-- [Import/Cancel] --> import/anuluj
    |
    |-- [przycisk "Metadata"] --> RDWaveDataDialog (modal)
    |       +-- edycja metadanych audio
    |
    |-- [przycisk "Sched Codes"] --> RDSchedCodesDialog (modal)
    |       +-- dual-list (available/selected)
    |
    +-- [przycisk "Add Cart"] --> RDAddCart (modal)
            +-- wybor grupy, numeru, typu
```

---

## UI Contract: RDCartDialog

**Klasa:** `RDCartDialog`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "{caption} - Select Cart"
**Modalnosc:** modal
**Rodzic:** dowolna aplikacja Rivendell
**Otwierany przez:** przyciski "Select Cart" w roznych aplikacjach

### Dane wejsciowe

| Dane | Typ | Zrodlo | Wymagane |
|------|-----|--------|----------|
| filter | QString* | persistowany filtr | nie |
| group | QString* | persistowana grupa | nie |
| schedcode | QString* | persistowany scheduler code | nie |
| caption | QString | tytul okna | tak |

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja | Slot |
|--------|--------|----------|-------|------|
| cart_filter_edit | QLineEdit | "Cart Filter:" | wpisywanie tekstu | filterChangedData() |
| cart_search_button | QPushButton | "&Search" | wyszukiwanie | filterSearchedData() |
| cart_clear_button | QPushButton | "C&lear" | czyszczenie filtra | filterClearedData() |
| cart_group_box | RDComboBox | "Group:" | wybor grupy | groupActivatedData() |
| cart_schedcode_box | RDComboBox | "Scheduler Code:" | wybor kodu | schedcodeActivatedData() |
| cart_limit_box | QCheckBox | "Show Only First N Matches" | limit wynikow | limitChangedData() |
| cart_cart_list | RDListView | (lista cartow) | single-click = zaznaczenie, double-click = wybor | clickedData() / doubleClickedData() |
| cart_player | RDSimplePlayer | (odtwarzacz) | play/stop podglad | (wbudowany) |
| cart_editor_button | QPushButton | "Send to\nEditor" | uruchom zewn. edytor | editorData() |
| cart_file_button | QPushButton | "Load From\nFile" | import audio z pliku | loadFileData() |
| cart_ok_button | QPushButton | "&OK" | potwierdz wybor | okData() |
| cart_cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

Kolumny listy cartow: (icon), Number, Length, Title, Artist, Group, Composer, Conductor, Client, Agency, User Def, Start, End

### Stany widoku

| Stan | Kiedy | Co widzi uzytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| initial | otwarcie | lista cartow, filtr, grupy | play disabled jesli brak cue output |
| loading | ladowanie cartow | progress dialog "Please Wait..." | - |
| filtered | po wyszukiwaniu | przefiltrowana lista | - |
| empty | brak wynikow | pusta lista | OK disabled |
| selected | klikniecie na cart | podswietlony wiersz | play aktywny |

### Walidacje UI

| Pole | Regula | Komunikat | Kiedy |
|------|--------|-----------|-------|
| cart selection | musi byc zaznaczony cart | brak OK | przed zatwierdzeniem |

### Nawigacja

| Skad | Jak | Co przekazuje |
|------|-----|---------------|
| Dowolna aplikacja | przycisk / API call | filter, group, schedcode |

### Linux-specific elementy UI

| Element | Powod | Zastapic przez |
|---------|-------|---------------|
| cart_editor_button | Uruchamia zewnetrzny edytor (sciezka z RDStation) | platform-agnostic editor launcher |

---

## UI Contract: RDEditAudio

**Klasa:** `RDEditAudio`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog (pelnoekranowy edytor markerow)
**Tytul okna:** "Edit Audio"
**Modalnosc:** modal
**Rodzic:** RDLibrary, inne aplikacje
**Otwierany przez:** przycisk "Edit" przy cucie

### Dane wejsciowe

| Dane | Typ | Zrodlo | Wymagane |
|------|-----|--------|----------|
| cut | RDCut* | obiekt cuta | tak |
| card | int | karta audio | tak |
| port | int | port audio | tak |

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja | Slot |
|--------|--------|----------|-------|------|
| (waveform area) | custom paint | waveform audio | klikniecie = kursor, drag = zaznaczenie regionu | mousePressEvent/mouseMoveEvent |
| edit_hscroll | QScrollBar | (poziomy scroll) | przewijanie waveformu | hscrollData() |
| edit_cue_button[N] | QPushButton x10 | Start/End/SegueStart/SegueEnd/FadeUp/FadeDown/TalkStart/TalkEnd/HookStart/HookEnd | klikniecie = ustaw marker na pozycji kursora | cuePointData() |
| edit_play_start_button | RDTransportButton | Play (od startu) | odtwarzanie od startu markera | playStartData() |
| edit_play_cursor_button | RDTransportButton | Play (od kursora) | odtwarzanie od kursora | playCursorData() |
| edit_pause_button | RDTransportButton | Pause | pauza | pauseData() |
| edit_stop_button | RDTransportButton | Stop | zatrzymanie | stopData() |
| edit_loop_button | QPushButton | "Loop" | odtwarzanie w petli | loopData() |
| edit_gain_control | RDSlider | gain | regulacja glosnosci | gainChangedData() |
| edit_meter | RDStereoMeter | (VU meter) | wizualizacja poziomu | - |
| edit_trim_box | QComboBox | "Trim" | trim head/tail | trimHeadData()/trimTailData() |
| edit_remove_button | QPushButton | "Remove Marker" | usuwanie zaznaczonego markera | removeButtonData() |
| edit_overall_edit | RDMarkerEdit | (pozycja overall) | numeryczna edycja pozycji | - |
| edit_region_edit | RDMarkerEdit | (pozycja region) | numeryczna edycja regionu | - |

### Stany widoku

| Stan | Kiedy | Co widzi uzytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| initial | otwarcie | waveform z markerami, przyciski transportu | - |
| playing | odtwarzanie | animowany kursor, VU meter aktywny | pause aktywny |
| paused | pauza | kursor zatrzymany | play aktywny |
| stopped | stop | kursor na pozycji | stop disabled |
| marker_edit | edycja markera | podswietlony marker, przycisk Remove aktywny | - |

---

## UI Contract: RDImportAudio

**Klasa:** `RDImportAudio`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "{caption} - Import/Export Audio File"
**Modalnosc:** modal

### Dane wejsciowe

| Dane | Typ | Zrodlo | Wymagane |
|------|-----|--------|----------|
| cutname | QString | nazwa cuta | tak |
| caption | QString | tytul okna | tak |
| settings | RDAudioSettings* | domyslne ustawienia | nie |

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja | Slot |
|--------|--------|----------|-------|------|
| import_mode_group | QButtonGroup | Import/Export | przelaczenie trybu | - |
| import_in_filename_edit | QLineEdit | "Filename:" (import) | sciezka pliku zrodlowego | - |
| import_in_selector_button | QPushButton | "&Select" | dialog wyboru pliku | selectInputFileData() |
| import_in_metadata_box | QCheckBox | "Import file metadata" | uzyj metadanych z pliku | - |
| import_out_filename_edit | QLineEdit | "Filename:" (export) | sciezka pliku docelowego | - |
| import_out_selector_button | QPushButton | "&Select" | dialog zapisu pliku | selectOutputFileData() |
| import_out_format_button | QPushButton | "S&et" | ustawienia formatu | selectOutputFormatData() |
| import_normalize_box | QCheckBox | "Normalize" | normalizacja glosnosci | normalizeCheckData() |
| import_normalize_spin | QSpinBox | "Level:" (dBFS) | poziom normalizacji | - |
| import_autotrim_box | QCheckBox | "Autotrim" | automatyczne przycinanie | autotrimCheckData() |
| import_autotrim_spin | QSpinBox | "Level:" (dBFS) | prog autotrim | - |
| import_channels_box | QComboBox | "Channels:" | 1 (mono) / 2 (stereo) | - |
| import_bar | RDBusyBar | (progress) | animacja postep | - |
| import_import_button | QPushButton | "&Import" | uruchom import/eksport | importData() |
| import_cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

### Stany widoku

| Stan | Kiedy | Co widzi uzytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| import_mode | tryb importu | pola importu widoczne, eksportu ukryte | export fields hidden |
| export_mode | tryb eksportu | pola eksportu widoczne, importu ukryte | import fields hidden |
| running | import/eksport w toku | busy bar animowany | import/cancel active |
| idle | oczekiwanie | normalne UI | cancel active |

---

## UI Contract: RDWaveDataDialog

**Klasa:** `RDWaveDataDialog`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "{caption} - Edit Cart Label"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| title_edit | QLineEdit | "Title:" | edycja tytulu |
| artist_edit | QLineEdit | "Artist:" | edycja artysty |
| album_edit | QLineEdit | "Album:" | edycja albumu |
| year_spin | QSpinBox | "Year:" | edycja roku |
| label_edit | QLineEdit | "Label:" | edycja labelu |
| client_edit | QLineEdit | "Client:" | edycja klienta |
| agency_edit | QLineEdit | "Agency:" | edycja agencji |
| composer_edit | QLineEdit | "Composer:" | edycja kompozytora |
| conductor_edit | QLineEdit | "Conductor:" | edycja dyrygenta |
| song_id_edit | QLineEdit | "Song ID:" | edycja ID utworu |
| user_defined_edit | QLineEdit | "User Defined:" | pole uzytkownika |
| bpm_spin | QSpinBox | "Beats/Min:" | BPM |
| usage_box | QComboBox | "Usage:" | zastosowanie |
| ok_button | QPushButton | "&OK" | zapisz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDAddCart

**Klasa:** `RDAddCart`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "{caption} - Add Cart"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja | Slot |
|--------|--------|----------|-------|------|
| group_box | QComboBox | "Group:" | wybor grupy | groupActivatedData() |
| type_group | QButtonGroup | "Audio" / "Macro" | wybor typu | - |
| number_edit | QLineEdit | "Cart Number:" | numer carta (opcjonalny, auto-assign jesli pusty) | - |
| title_edit | QLineEdit | "Cart Title:" | tytul | - |
| ok_button | QPushButton | "&OK" | tworzenie carta | okData() |
| cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

### Walidacje UI

| Pole | Regula | Komunikat | Kiedy |
|------|--------|-----------|-------|
| group | musi byc wybrany | "You must select a group!" | przed OK |
| number | jesli podany, musi byc w zakresie grupy | "Invalid Cart Number!" | przed OK |
| title | wymagany | "You must enter a Cart Title!" | przed OK |

---

## UI Contract: RDExportSettingsDialog

**Klasa:** `RDExportSettingsDialog`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "{caption} - Edit Audio Settings"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| format_box | QComboBox | "Format:" | PCM16/PCM24/MPEG Layer 2/MPEG Layer 3/OggVorbis/FLAC |
| channels_box | QComboBox | "Channels:" | 1/2 |
| samprate_box | QComboBox | "Sample Rate:" | 16000/22050/32000/44100/48000 |
| bitrate_box | QComboBox | "Bit Rate:" | (zalezne od formatu) |
| quality_spin | QSpinBox | "Quality:" | (dla Ogg Vorbis) |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDSchedCodesDialog

**Klasa:** `RDSchedCodesDialog`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "Select Scheduler Codes"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| available_list | RDListView | "Available Codes" | lista dostepnych kodow |
| selected_list | RDListView | "Assigned Codes" | lista przypisanych kodow |
| add_button | QPushButton | "&Add >>" | przenies do assigned | addData() |
| remove_button | QPushButton | "<< &Remove" | przenies do available | removeData() |
| ok_button | QPushButton | "&OK" | zatwierdz | okData() |
| cancel_button | QPushButton | "&Cancel" | anuluj | cancelData() |

---

## UI Contract: RDButtonDialog

**Klasa:** `RDButtonDialog`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "{caption} - Edit Button"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| cart_button | QPushButton | "Select Cart" | otwiera RDCartDialog |
| clear_button | QPushButton | "Clear" | czysci przycisk |
| color_button | QPushButton | "Set Color" | dialog wyboru koloru |
| label_edit | QLineEdit | "Label:" | etykieta przycisku |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDListLogs

**Klasa:** `RDListLogs`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "Select Log"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| svc_box | RDComboBox | "Service:" | filtrowanie po serwisie |
| log_list | RDListView | (lista logow) | double-click = wybor |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDDateDialog

**Klasa:** `RDDateDialog`
**Plik .ui:** brak -- generowane w kodzie
**Typ:** Dialog
**Tytul okna:** "Select Date"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| date_picker | RDDatePicker | (kalendarz) | wybor daty |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDGetPasswd / RDPasswd

**Klasa:** `RDGetPasswd` / `RDPasswd`
**Typ:** Dialog
**Tytul okna:** "Enter Password" / "Change Password"
**Modalnosc:** modal

### Widgety i interakcje (RDGetPasswd)

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| password_edit | QLineEdit (echo=Password) | "Password:" | wprowadzenie hasla |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

### Widgety i interakcje (RDPasswd)

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| current_edit | QLineEdit (echo=Password) | "Current Password:" | aktualne haslo |
| new_edit | QLineEdit (echo=Password) | "New Password:" | nowe haslo |
| confirm_edit | QLineEdit (echo=Password) | "Confirm:" | potwierdzenie |
| ok_button | QPushButton | "&OK" | zmien haslo |
| cancel_button | QPushButton | "&Cancel" | anuluj |

### Walidacje UI

| Pole | Regula | Komunikat | Kiedy |
|------|--------|-----------|-------|
| new/confirm | musza byc identyczne | "Passwords don't match!" | przed OK |

---

## UI Contract: RDGetAth

**Klasa:** `RDGetAth`
**Typ:** Dialog
**Tytul okna:** "Enter ATH"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| username_edit | QLineEdit | "User Name:" | login |
| password_edit | QLineEdit (echo=Password) | "Password:" | haslo |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDSlotDialog

**Klasa:** `RDSlotDialog`
**Typ:** Dialog
**Tytul okna:** "{caption} - Edit Slot Options"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| mode_box | QComboBox | "Mode:" | tryb slotu (disabled/previous/static/breakaway) |
| cart_edit | QLineEdit | "Cart:" | numer carta |
| select_button | QPushButton | "Select" | RDCartDialog |
| svc_box | QComboBox | "Service:" | serwis |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDCutDialog

**Klasa:** `RDCutDialog`
**Typ:** Dialog
**Tytul okna:** "{caption} - Select Cut"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| filter_edit | QLineEdit | "Cart Filter:" | filtr wyszukiwania |
| search_button | QPushButton | "&Search" | wyszukaj |
| clear_button | QPushButton | "C&lear" | wyczysc filtr |
| group_box | RDComboBox | "Group:" | filtr grupy |
| cart_list | RDListView | (lista cartow) | wybor carta |
| cut_list | RDListView | (lista cutow) | wybor cuta |
| player | RDSimplePlayer | (podsluch) | play/stop |
| ok_button | QPushButton | "&OK" | zatwierdz |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## UI Contract: RDSoundPanel (Widget)

**Klasa:** `RDSoundPanel`
**Typ:** Widget (wbudowany)
**Modalnosc:** modeless (integrowany w okno rodzica)

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| panel_buttons[rows][cols] | RDPanelButton | (tytul carta) | klikniecie = play/stop, flash = odtwarzanie |
| panel_selector_box | QComboBox | (nr panelu) | przelaczanie stron panelu |
| panel_playmode_box | QComboBox | "Full/Hook" | tryb odtwarzania (caly/hook) |
| panel_setup_button | QPushButton | "Setup" | tryb konfiguracji |
| panel_reset_button | QPushButton | "Reset" | reset panelu |
| panel_all_button | QPushButton | "All" | stop all |

### Stany widoku

| Stan | Kiedy | Co widzi uzytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| normal | normalna praca | siatka przyciskow z tytulami cartow | setup hidden |
| setup | tryb konfiguracji | siatka z konfigurowalnym przelaczaniem | - |
| playing | odtwarzanie | migajacy przycisk, odliczanie czasu | - |
| paused | pauza | podswietlony przycisk, czas zatrzymany | - |

---

## UI Contract: RDCartSlot (Widget)

**Klasa:** `RDCartSlot`
**Typ:** Widget (wbudowany)
**Modalnosc:** modeless

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| slot_start_button | RDTransportButton | Play/Pause | odtwarzanie/pauza |
| slot_load_button | QPushButton | "Load" | zaladuj carta (otwiera RDCartDialog) |
| slot_options_button | QPushButton | "Options" | otwiera RDSlotDialog |
| slot_box | RDSlotBox | (metadane) | wyswietla tytul/artyste/czas |

---

## UI Contract: RDSimplePlayer (Widget)

**Klasa:** `RDSimplePlayer`
**Typ:** Widget (wbudowany odtwarzacz)
**Modalnosc:** modeless

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| play_button | RDTransportButton | Play | odtwarzanie carta |
| stop_button | RDTransportButton | Stop | zatrzymanie |

---

## UI Contract: Disc Lookup Dialogs

**Klasy:** `RDCddbLookup`, `RDMbLookup`
**Typ:** Dialog
**Tytul okna:** "{caption} - CDDB Query" / "{caption} - MusicBrainz Lookup"
**Modalnosc:** modal

### Widgety i interakcje

| Widget | Typ Qt | Etykieta | Akcja |
|--------|--------|----------|-------|
| result_list | RDListView | (wyniki wyszukiwania) | wybor wyniku |
| ok_button | QPushButton | "&OK" | zatwierdz wybor |
| cancel_button | QPushButton | "&Cancel" | anuluj |

---

## Linux-specific elementy UI (podsumowanie)

| Element | Klasa | Powod | Zastapic przez |
|---------|-------|-------|---------------|
| Edytor zewnetrzny | RDCartDialog | sciezka do edytora z RDStation | platform-agnostic editor launcher |
| CD device | RDCdPlayer | /dev/cdrom ioctl | platform-agnostic CD API |
| Audio device selector | RDCardSelector | karty HPI/JACK/ALSA | platform-agnostic audio device |
