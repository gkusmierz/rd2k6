---
partial_id: "006"
artifact: ADM
window_name: "RDAdmin - System-Wide Settings"
class_name: EditSystem
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.system_wide_settings_dialog.png
mockup: mockups/EditSystem.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: System-Wide Settings Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSystem |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - System-Wide Settings" |
| Modalność | modal (exec()) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_system.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.system_wide_settings_dialog.png |
| Mockup HTML | ✅ | mockups/EditSystem.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | Ładuje z RDSystem / DB | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_sample_rate_box | QComboBox | "System Sample Rate:" | Wybór sample rate (32000/44100/48000) | - |
| edit_sample_rate_unit_label | QLabel | "samples/second" | display only | - |
| edit_duplicate_carts_box | QCheckBox | "Allow Duplicate Cart Titles" | Toggle duplicate titles | duplicatesCheckedData(bool) |
| edit_fix_duplicate_carts_box | QCheckBox | "Auto-Correct Duplicate Cart Titles" | Toggle auto-correct | - |
| edit_show_user_list_box | QCheckBox | "Show User List in RDLogin" | Toggle user list visibility | - |
| edit_isci_path_edit | QLineEdit | "ISCI Cross Reference Path:" | ISCI path input | - |
| edit_origin_email_addr_edit | QLineEdit | "Origin E-Mail Address:" (max 64) | Email address | - |
| edit_notification_address_edit | QLineEdit | "Multicast Address for Notifications" | IP address | - |
| edit_maxpost_spin | QSpinBox | "Maximum Remote Post Length:" (1-1000) | Max POST size in MB | - |
| edit_maxpost_unit_label | QLabel | "Mbytes" | display only | - |
| edit_temp_cart_group_box | QComboBox | "Temporary Cart Group:" | Group selection from DB | - |
| edit_rss_processor_box | QComboBox | "Process RSS Updates On:" | Station selection ([none] + DB) | - |
| edit_duplicate_hidden_label | QLabel | "The following duplicate titles..." | Shown when duplicates exist | - |
| edit_duplicate_list | Q3ListView | Columns: Cart, Title | Shown when duplicates exist | - |
| edit_save_button | QPushButton | "&Save List" | Saves duplicate list to file | saveData() |
| edit_encoders_button | QPushButton | "Edit Encoder\nList" | Opens ListEncoders | encodersData() |
| edit_ok_button | QPushButton | "&OK" | Saves settings | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | Cancels dialog | cancelData() |

## Layout
Window size: 500 x 306 (initial, grows if duplicates shown via y_pos).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | duplicate_carts=true | fix_duplicate_carts disabled, main form | fix_duplicate_carts_box + label disabled |
| default | duplicate_carts=false | fix_duplicate_carts enabled | - |
| duplicates_found | okData() finds duplicates when disabling | Duplicate list shown, save button, warning label | Window grows, duplicate_list + save_button + hidden_label shown |
| deprecation_warning | User unchecks "Allow Duplicate" when currently allowed | QMessageBox::warning deprecation dialog | Reverts checkbox if user cancels |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| duplicate_carts_box | Deprecation warning on uncheck | "The ability to disallow duplicate cart titles has been deprecated..." | duplicatesCheckedData(false) | QMessageBox::warning |
| duplicate_carts_box (okData) | Check for actual duplicates in CART table | Duplicate list shown in Q3ListView | okData() when unchecking | Progress dialog + list |
| save_button (file) | File exists check | "The file ... exists. Overwrite?" | saveData() | QMessageBox::question |
| save_button (file) | File write error | "Unable to write file ..." | saveData() | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | systemSettingsData() → new EditSystem(this)->exec() | brak |
| edit_encoders_button | encodersData() → edit_encoders_dialog->exec() | brak |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Layout order | Checkboxes at top, then fields | Same order confirmed | Zgodne |
| "Show User List in RDLogin" | Widoczne | edit_show_user_list_box | Zgodne |
