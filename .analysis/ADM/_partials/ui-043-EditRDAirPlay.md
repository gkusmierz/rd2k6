---
partial_id: "043"
artifact: ADM
window_name: "Configure RDAirPlay"
class_name: EditRDAirPlay
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.configure_rdairplay_dialog.png
mockup: mockups/EditRDAirPlay.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Configure RDAirPlay

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDAirPlay |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDAirPlay" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 1010x680 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdairplay.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdairplay_dialog.png (+ 7 section screenshots) |
| Mockup HTML | ✅ | mockups/EditRDAirPlay.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Channel Assignments (lewa strona)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_card_sel[0] | RDCardSelector | Main Log Output 1 | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[0] | QLineEdit | Start RML: | Komenda RML przy starcie | - |
| air_stop_rml_edit[0] | QLineEdit | Stop RML: | Komenda RML przy stopie | - |
| air_channel_button[0] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) via QSignalMapper |
| air_card_sel[1] | RDCardSelector | Main Log Output 2 | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[1] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[1] | QLineEdit | Stop RML: | Komenda RML | - |
| air_channel_button[1] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) |
| air_card_sel[4] | RDCardSelector | Aux Log 1 Output | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[4] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[4] | QLineEdit | Stop RML: | Komenda RML | - |
| air_channel_button[4] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) |
| air_card_sel[5] | RDCardSelector | Aux Log 2 Output | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[5] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[5] | QLineEdit | Stop RML: | Komenda RML | - |
| air_channel_button[5] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) |
| air_virtual_machine_box | QComboBox | "Log Machine:" (Virtual Log Outputs) | Wybór vLog | virtualLogActivatedData(int) |
| air_virtual_card_sel | RDCardSelector | (per-vLog) | Wybór karty/portu dla vLog | - |
| air_virtual_start_rml_edit | QLineEdit | Start RML: | RML per vLog | - |
| air_virtual_stop_rml_edit | QLineEdit | Stop RML: | RML per vLog | - |
| (button) | QPushButton | "Configure Hot Keys" | Otwiera EditHotkeys | editHotKeys() |

### Sekcja: Channel Assignments (prawa strona - SoundPanel)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_card_sel[2] | RDCardSelector | SoundPanel First Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[2] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[2] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[2] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[6] | RDCardSelector | SoundPanel Second Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[6] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[6] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[6] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[7] | RDCardSelector | SoundPanel Third Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[7] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[7] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[7] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[8] | RDCardSelector | SoundPanel Fourth Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[8] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[8] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[8] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[9] | RDCardSelector | SoundPanel Fifth and Later Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[9] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[9] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[9] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |

### Sekcja: Log Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_segue_edit | QLineEdit | Manual Segue: | Długość segue (msecs) | - |
| air_trans_edit | QLineEdit | Forced Segue: | Długość wymuszonego segue (msecs) | - |
| air_piecount_box | QSpinBox | Pie Counts Last: | 0-60 secs | - |
| air_countto_box | QComboBox | Pie Counts To: | "Cart End" / "Transition" | - |
| air_default_transtype_box | QComboBox | Default Trans. Type: | "Play" / "Segue" / "Stop" | - |
| air_defaultsvc_box | QComboBox | Default Service: | "[none]" + lista serwisów z DB | - |

### Sekcja: Sound Panel Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_station_box | QSpinBox | System Panels: | 0-MAX_PANELS, "None" | - |
| air_user_box | QSpinBox | User Panels: | 0-MAX_PANELS, "None" | - |
| air_flash_box | QCheckBox | Flash Active Buttons | toggle | - |
| air_panel_pause_box | QCheckBox | Enable Button Pausing | toggle | - |
| air_label_template_edit | QLineEdit | Label Template: | tekst szablonu | - |

### Sekcja: Miscellaneous Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_timesync_box | QCheckBox | Check TimeSync | toggle | - |
| air_auxlog_box[0] | QCheckBox | Show Auxlog 1 Button | toggle | - |
| air_auxlog_box[1] | QCheckBox | Show Auxlog 2 Button | toggle | - |
| air_clearfilter_box | QCheckBox | Clear Cart Search Filter | toggle | - |
| air_pause_box | QCheckBox | Enable Paused Events | toggle | - |
| air_show_counters_box | QCheckBox | Show Extra Buttons/Counters | toggle | - |
| air_hour_selector_box | QCheckBox | Show Hour Selector | toggle | - |
| air_audition_preroll_spin | QSpinBox | Audition Preroll: | 1-60 secs | - |
| air_bar_group | Q3ButtonGroup | Space Bar Action | "None" / "Start Next" (radio) | - |

### Sekcja: Start/Stop Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_exitpasswd_edit | QLineEdit | Exit Password: | hasło (echo=Password) | exitPasswordChangedData(QString) |
| air_logmachine_box | QComboBox | (log selector) | "Main Log" / "Aux 1 Log" / "Aux 2 Log" / "vLog N" | logActivatedData(int) |
| air_startmode_box | QComboBox | At Startup: | "start with empty log" / "load previous log" / "load specified log" | startModeChangedData(int) |
| air_autorestart_box | QCheckBox | Restart Log After Unclean Shutdown | toggle, disabled when mode=empty | - |
| air_startlog_edit | QLineEdit | Log: | nazwa logu (enabled only if mode=specified) | - |
| air_startlog_button | QPushButton | "Select" | Otwiera RDListLogs | selectData() |

### Sekcja: Display Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_skin_edit | QLineEdit | Background Image: | ścieżka do pliku | - |
| (button) | QPushButton | "Select" | QFileDialog | selectSkinData() |
| air_title_template_edit | QLineEdit | Title Template: | szablon tytułu | - |
| air_artist_template_edit | QLineEdit | Artist Template: | szablon artysty | - |
| air_outcue_template_edit | QLineEdit | Outcue Template: | szablon outcue | - |
| air_description_template_edit | QLineEdit | Description Template: | szablon opisu | - |

### Sekcja: Log Mode Control

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_modecontrol_box | QComboBox | Mode Control Style: | "Unified" / "Independent" | modeControlActivatedData(int) |
| air_logstartmode_box[0] | QComboBox | Main Log Startup Mode: | "Previous"/"LiveAssist"/"Automatic"/"Manual" | logStartupModeActivatedData(int) |
| air_logstartmode_box[1] | QComboBox | Aux 1 Log Startup Mode: | "Previous"/"LiveAssist"/"Automatic"/"Manual" | logStartupModeActivatedData(int) |
| air_logstartmode_box[2] | QComboBox | Aux 2 Log Startup Mode: | "Previous"/"LiveAssist"/"Automatic"/"Manual" | logStartupModeActivatedData(int) |
| air_virtual_logstartsel_box | QComboBox | (vLog selector) | vLog 1..N | virtualModeActivatedData(int) |
| air_virtual_logstartmode_box | QComboBox | (vLog startup mode) | "Previous"/"LiveAssist"/"Automatic"/"Manual" | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (ok) | QPushButton | "&OK" | Waliduje i zapisuje | okData() |
| (cancel) | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | cae_station->scanned() == false | QMessageBox info, card selectors disabled | Wszystkie air_card_sel disabled |
| MainLog2 disabled | MainLog1 i MainLog2 mają ten sam card+port | MainLog2 GPIO button i RML fields disabled | air_channel_button[1], RML edits |
| Startup mode=empty | air_startmode_box == 0 | Log edit/select disabled, autorestart disabled | air_startlog_edit, air_startlog_button, air_autorestart_box |
| Startup mode=previous | air_startmode_box == 1 | Log edit/select disabled | air_startlog_edit, air_startlog_button |
| Startup mode=specified | air_startmode_box == 2 | Log edit/select enabled | (all enabled) |
| Unified mode control | air_modecontrol_box == 0 | Changing any log startup mode syncs all 3 | - |
| Independent mode control | air_modecontrol_box == 1 | Each log startup mode independent | - |
| Audition/Cue (inactive) | always | Hidden (card_sel[3] + RML hidden) | air_card_sel[3] + labels hidden |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| air_segue_edit | Must be valid integer | "Data Error" / "Invalid Segue Length!" | okData() | QMessageBox::warning |
| air_trans_edit | Must be valid integer | "Data Error" / "Invalid Forced Segue Length!" | okData() | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDAirPlay" | station, cae_station |
| EditRDAirPlay | "Configure Hot Keys" button | air_conf->station(), "airplay" -> EditHotkeys |
| EditRDAirPlay | "Edit GPIOs" buttons | air_conf, channel -> EditChannelGpios |
| EditRDAirPlay | "Select" (log) button | -> RDListLogs (logname) |
| EditRDAirPlay | "Select" (skin) button | -> QFileDialog |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Audition/Cue section | Nie widoczne | Ukryte (hidden) | Sekcja card_sel[3] istnieje ale jest ukryta komentarzem INACTIVE |
| Virtual Log section | Widoczne na screenshot | Widoczne w kodzie | Zgodne |
