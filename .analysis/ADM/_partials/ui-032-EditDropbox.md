---
partial_id: "032"
artifact: ADM
window_name: "RDAdmin - Dropbox Configuration [ID: N]"
class_name: EditDropbox
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.dropbox_configuration_dialog.png
mockup: mockups/EditDropbox.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Dropbox Configuration [ID: N]

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditDropbox |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Dropbox Configuration [ID: {id}] |
| Modalność | modal (implicit, no setModal call but exec()) |
| Rodzic | ListDropboxes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_dropbox.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.dropbox_configuration_dialog.png |
| Mockup HTML | ✅ | mockups/EditDropbox.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int | ListDropboxes (dropbox ID) | tak |
| duplicate | bool | true jeśli duplikacja | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| box_group_name_box | QComboBox | Default Group: | Wybór grupy docelowej z DB | - |
| box_path_edit | QLineEdit | &Path Spec: | Ścieżka dropboxa (max 255) | - |
| (path select button) | QPushButton | Select | Otwiera QFileDialog (dir) | selectPathData() |
| box_to_cart_edit | QLineEdit | To &Cart: | Numer carta docelowego (1-999999, max 6 znaków) | - |
| box_select_cart_button | QPushButton | Select | Otwiera RDCartDialog | selectCartData() |
| box_delete_cuts_box | QCheckBox | Delete cuts before importing | Toggle delete cuts | - |
| box_metadata_pattern_edit | QLineEdit | &Metadata Pattern: | Wzorzec metadanych (max 64) | - |
| box_user_defined_edit | QLineEdit | &User Defined: | Pole użytkownika (max 255) | - |
| box_log_to_syslog_check | QCheckBox | Log events in Syslog | Toggle syslog logging | disables log_path_edit |
| box_log_path_edit | QLineEdit | &Log File: | Ścieżka pliku logu (max 255) | - |
| box_log_path_button | QPushButton | Select | Otwiera QFileDialog (save) | selectLogPathData() |
| box_schedcodes_button | QPushButton | Scheduler Codes | Otwiera RDSchedCodesDialog | schedcodesData() |
| box_delete_source_box | QCheckBox | Delete source files after import | Toggle delete source | - |
| box_send_email_box | QCheckBox | Send e-mail reports | Toggle email reports | - |
| box_force_to_mono_box | QCheckBox | Force to Monaural | Toggle mono | - |
| box_normalization_box | QCheckBox | Normalize Levels | Toggle normalizacji | normalizationToggledData() |
| box_normalization_level_spin | QSpinBox | Level: {dBFS} | Poziom normalizacji (-100..-1) | - |
| box_autotrim_box | QCheckBox | Autotrim Cuts | Toggle autotrim | autotrimToggledData() |
| box_autotrim_level_spin | QSpinBox | Level: {dBFS} | Poziom autotrim (-100..-1) | - |
| box_segue_box | QCheckBox | Insert Segue Markers | Toggle segue | segueToggledData() |
| box_segue_level_spin | QSpinBox | Segue Level: {dBFS} | Poziom segue (-100..0) | - |
| box_segue_length_spin | QSpinBox | Segue Length: {msec} | Długość segue (0-180000) | - |
| box_use_cartchunk_id_box | QCheckBox | Get cart number from CartChunk CutID | Toggle CartChunk ID | - |
| box_title_from_cartchunk_id_box | QCheckBox | Get cart title from CartChunk CutID | Toggle title from CartChunk | - |
| box_fix_broken_formats_box | QCheckBox | Attempt to work around malformatted input files | Toggle fix broken | - |
| box_startoffset_spin | QSpinBox | Offset start date by {days} | Offset daty startu (-7..7) | - |
| box_endoffset_spin | QSpinBox | Offset end date by {days} | Offset daty końca (-7..7) | - |
| box_create_dates_box | QCheckBox | Create Dates when no Dates Exist | Toggle tworzenia dat | createDatesToggledData() |
| box_create_startdate_offset_spin | QSpinBox | Create start date offset: {days} | Offset daty startu (-180..180) | - |
| box_create_enddate_offset_spin | QSpinBox | Create end date offset: {days} | Offset daty końca (-180..180) | - |
| reset_button | QPushButton | &Reset | Resetuje listę zaimportowanych plików | resetData() |
| ok_button | QPushButton | &OK | Zapisuje konfigurację i zamyka (done(true)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(false)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Wszystkie pola wypełnione z DB | ok_button.default=true |
| Duplicate mode | duplicate=true | OK disabled do zmiany ścieżki | ok_button.enabled=false, focus na box_path_edit |
| Normalization off | box_normalization_box unchecked | Level spin/label/unit disabled | normalizationToggledData(false) |
| Autotrim off | box_autotrim_box unchecked | Level spin/label/unit disabled | autotrimToggledData(false) |
| Segue off | box_segue_box unchecked | Segue level/length/labels disabled, values reset | segueToggledData(false) |
| Create dates off | box_create_dates_box unchecked | Start/end date offset spins disabled, values reset to 0 | createDatesToggledData(false) |
| Syslog on | box_log_to_syslog_check checked | Log file path/button/label disabled | toggled(bool) |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| box_to_cart_edit | QIntValidator(1-999999) | (blokuje input) | input | QIntValidator |
| create dates | EndDate offset >= StartDate offset | "The Create EndDate Offset is less than the Create Start Date Offset!" | okData() | QMessageBox::warning |
| reset | Potwierdzenie | "Resetting the dropbox will clear the list of already imported files..." + "Reset the dropbox?" | resetData() | QMessageBox::question |
| reset | Info po resecie | "The dropbox has been reset." | resetData() po OK | QMessageBox::information |
| duplicate | Ścieżka musi być zmieniona | OK disabled gdy ścieżka nie zmieniona | pathChangedData() | ok_button.setEnabled() |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListDropboxes → EditDropbox | Add/Edit/Duplicate | int id, bool duplicate |
| EditDropbox → QFileDialog | Select (path) | directory selection |
| EditDropbox → RDCartDialog | Select (cart) | cart number |
| EditDropbox → QFileDialog | Select (log) | file save selection |
| EditDropbox → RDSchedCodesDialog | Scheduler Codes | QStringList schedcodes |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Screenshot niskiej rozdzielczości | Zgodne z kodem | sizeHint=490x666 |
