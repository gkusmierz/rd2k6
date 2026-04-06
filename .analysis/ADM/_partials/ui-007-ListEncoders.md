---
partial_id: "007"
artifact: ADM
window_name: "RDAdmin - Encoder Profiles"
class_name: ListEncoders
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.encoder_profiles_dialog.png
mockup: mockups/ListEncoders.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Encoder Profiles Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListEncoders |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Encoder Profiles" |
| Modalność | modal (exec()) |
| Rodzic | EditSystem |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_encoders.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.encoder_profiles_dialog.png |
| Mockup HTML | ✅ | mockups/ListEncoders.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | Ładuje presety z DB (RDSettings::loadPreset) | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| c_list_label | QLabel | "Encoder Profiles" | display only (bigLabelFont) | - |
| c_list | RDListView | Kolumna: "Name" | Lista profili, double-click edits | doubleClickedData() |
| c_add_button | QPushButton | "Add" | Dodaje nowy profil (RDExportSettingsDialog) | addData() |
| c_edit_button | QPushButton | "Edit" | Edytuje wybrany profil | editData() |
| c_delete_button | QPushButton | "Delete" | Usuwa wybrany profil | deleteData() |
| c_close_button | QPushButton | "Close" | Zamyka dialog | closeData() |

## Layout (resizable)
Window size: 400 x 300 (minimum, resizable via resizeEvent).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Lista profili z presetów DB | - |
| delete_confirm | Klik Delete z zaznaczonym | QMessageBox::question "Are you sure..." | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Confirmation required | "Are you sure that you want to delete preset \"{name}\"?" | deleteData() | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSystem | encodersData() → edit_encoders_dialog->exec() | brak |
| c_add_button / c_edit_button | RDExportSettingsDialog | encoder settings |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Layout | Buttons at bottom (Add, Edit, Delete, Close) | Same | Zgodne |
| List columns | "Name" column | c_list->addColumn("Name") | Zgodne |
