---
partial_id: "044"
artifact: ADM
window_name: "Configure RDLibrary"
class_name: EditRDLibrary
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.configure_rdlibrary_dialog.png
mockup: mockups/EditRDLibrary.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Configure RDLibrary

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDLibrary |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDLibrary" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 405x630 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdlibrary.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdlibrary_dialog.png |
| Mockup HTML | ✅ | mockups/EditRDLibrary.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Audio I/O

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_input_card | RDCardSelector | Input | Wybór karty/portu wejścia | - |
| lib_output_card | RDCardSelector | Output | Wybór karty/portu wyjścia | - |

### Sekcja: Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_maxlength_time | Q3TimeEdit | Max Record Time: | Maks. czas nagrania | - |
| lib_vox_spin | QSpinBox | VOX Threshold: | -99..0 dbFS | - |
| lib_trim_spin | QSpinBox | AutoTrim Threshold: | -99..0 dbFS | - |
| lib_preroll_spin | QSpinBox | Tail Preroll: | 0..10000 ms, step 100 | - |
| lib_ripdev_edit | QLineEdit | Ripper Device: | ścieżka urządzenia | - |
| lib_paranoia_box | QComboBox | Paranoia Level: | "Normal"/"Low"/"None" | - |
| lib_isrc_box | QComboBox | Read ISRCs from CD: | "No"/"Yes" | - |
| lib_cd_server_type_box | QComboBox | CD Metadata Source: | Dummy/CDDB/MusicBrainz | cdServerTypeData(int) |
| lib_cddb_server_edit | QLineEdit | CDDB Server: | adres serwera (warunkowy) | - |
| lib_mb_server_edit | QLineEdit | MusicBrainz Server: | adres serwera (warunkowy) | - |
| lib_format_box | QComboBox | Format: | "PCM16"/"PCM24"/"MPEG Layer 2" | formatData(int) |
| lib_bitrate_box | QComboBox | Bitrate: | 32-192 kbps/chan (only MPEG) | - |
| lib_editor_box | QComboBox | Allow External Editing: | "No"/"Yes" | - |
| lib_converter_box | QComboBox | Sample Rate Converter: | lista z libsamplerate | - |
| lib_limit_search_box | QComboBox | Limit Searches at Startup: | "No"/"Yes"/"Previous" | - |

### Sekcja: Defaults

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_channels_box | QComboBox | Channels: | "1"/"2" | - |
| lib_recmode_box | QComboBox | Record Mode: | "Manual"/"VOX" | - |
| lib_trimstate_box | QComboBox | AutoTrim: | "On"/"Off" | - |
| lib_riplevel_spin | QSpinBox | Normalization Level: | -99..0 dbFS | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| ok_button | QPushButton | "&OK" | Zapisuje konfigurację | okData() |
| cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | cae_station->scanned() == false | QMessageBox info | lib_input_card, lib_output_card disabled |
| CD Source = Dummy | lib_cd_server_type_box == 0 | Server label/edit disabled | lib_cd_server_label, both server edits disabled |
| CD Source = CDDB | lib_cd_server_type_box == 1 | CDDB server edit visible | lib_mb_server_edit hidden, lib_cddb_server_edit shown |
| CD Source = MusicBrainz | lib_cd_server_type_box == 2 | MusicBrainz edit visible | lib_cddb_server_edit hidden, lib_mb_server_edit shown |
| Format = PCM16/PCM24 | lib_format_box == 0 or 1 | Bitrate disabled | lib_bitrate_box disabled |
| Format = MPEG L2 | lib_format_box == 2 | Bitrate enabled | lib_bitrate_box enabled, populated with rates |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| lib_ripdev_edit | RDTextValidator | (inline) | real-time | validator |
| lib_cddb_server_edit | RDTextValidator | (inline) | real-time | validator |
| lib_mb_server_edit | RDTextValidator | (inline) | real-time | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDLibrary" | station, cae_station |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |
