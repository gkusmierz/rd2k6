---
partial_id: "045"
artifact: ADM
window_name: "Configure RDLogedit"
class_name: EditRDLogedit
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.configure_rdlogedit_dialog.png
mockup: mockups/EditRDLogedit.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Configure RDLogedit

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDLogedit |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDLogedit" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 395x500 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdlogedit.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdlogedit_dialog.png |
| Mockup HTML | ✅ | mockups/EditRDLogedit.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Audio I/O

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_input_card | RDCardSelector | INPUT | Wybór karty/portu wejścia | - |
| lib_output_card | RDCardSelector | OUTPUT | Wybór karty/portu wyjścia | - |

### Sekcja: Voice Tracker Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_maxlength_time | Q3TimeEdit | Max Record Time: | Maks. czas nagrania | - |
| lib_threshold_spin | QSpinBox | AutoTrim Threshold: | -99..0 dbFS | - |
| lib_normalization_spin | QSpinBox | Normalization Level: | -99..0 dbFS | - |
| lib_preroll_spin | QSpinBox | Audio Margin: | 0..10000 ms, step 100 | - |
| lib_format_box | QComboBox | Format: | "PCM16"/"PCM24"/"MPEG Layer 2" | formatData(int) |
| lib_bitrate_box | QComboBox | Bitrate: | 32-192 kbps/chan (only MPEG) | - |
| lib_enable_second_start_box | QComboBox | Enable 2nd Start Button: | "No"/"Yes" | - |
| lib_waveform_caption_edit | QLineEdit | WaveForm Caption: | tekst | - |
| lib_startcart_edit | QLineEdit | Play Start Cart: | numer koszyka (1-999999) | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectStartData() |
| lib_endcart_edit | QLineEdit | Play End Cart: | numer koszyka | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectEndData() |
| lib_recstartcart_edit | QLineEdit | Record Start Cart: | numer koszyka | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectRecordStartData() |
| lib_recendcart_edit | QLineEdit | Record End Cart: | numer koszyka | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectRecordEndData() |
| lib_channels_box | QComboBox | Channels: | "1"/"2" | - |
| lib_default_transtype_box | QComboBox | Default Transition: | "Play"/"Segue"/"Stop" | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| ok_button | QPushButton | "&OK" | Zapisuje konfigurację | okData() |
| cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | cae_station->scanned() == false | QMessageBox info | lib_input_card, lib_output_card disabled |
| Format = PCM | lib_format_box == 0 or 1 | Bitrate disabled | lib_bitrate_box disabled |
| Format = MPEG L2 | lib_format_box == 2 | Bitrate enabled with rate list | lib_bitrate_box enabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| lib_startcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |
| lib_endcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |
| lib_recstartcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |
| lib_recendcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDLogedit" | station, cae_station |
| EditRDLogedit | "Select" buttons | -> RDCartDialog (Macro type) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |
