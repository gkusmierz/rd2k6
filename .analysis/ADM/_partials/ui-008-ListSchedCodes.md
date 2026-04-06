---
partial_id: "008"
artifact: ADM
window_name: "RDAdmin - Rivendell Scheduler Codes List"
class_name: ListSchedCodes
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_scheduler_code_list_dialog.png
mockup: mockups/ListSchedCodes.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Scheduler Codes List Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListSchedCodes |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Rivendell Scheduler Codes List" |
| Modalność | modal (setModal(true)) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_schedcodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_scheduler_code_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListSchedCodes.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | Ładuje z SCHED_CODES table | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box_label | QLabel | "Scheduler Codes:" | display only (buttonFont) | - |
| list_schedCodes_view | Q3ListView | Kolumny: CODE, DESCRIPTION | Lista kodów, double-click edits | doubleClickedData() |
| list_add_button | QPushButton | "&Add" | Otwiera AddSchedCode | addData() |
| list_edit_button | QPushButton | "&Edit" | Otwiera EditSchedCode | editData() |
| list_delete_button | QPushButton | "&Delete" | Usuwa wybrany kod | deleteData() |
| list_close_button | QPushButton | "&Close" (default) | Zamyka dialog | closeData() |

## Layout (resizable)
Window size: 640 x 480 (minimum, resizable).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Lista scheduler codes z DB | - |
| delete_confirm | Klik Delete z zaznaczonym | QMessageBox::question confirm dialog | - |
| nothing_selected | Edit/Delete bez zaznaczenia | Brak akcji (early return) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Confirmation required | "This operation will delete the selected scheduler code and all of its associated data. This operation cannot be undone. Delete scheduler code \"{code}\"?" | deleteData() | QMessageBox::question |
| edit/delete | Item must be selected | (silent return) | editData()/deleteData() | null check |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | manageSchedCodes() → new ListSchedCodes(this)->exec() | brak |
| list_add_button | addData() → AddSchedCode | &schedCode (output) |
| list_edit_button | editData() → EditSchedCode(code, description) | code, description |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Title | "Rivendell Scheduler Codes List" | "RDAdmin - Rivendell Scheduler Codes List" | Screenshot pomija prefix "RDAdmin -" |
| Button layout | Buttons on right side (Add, Edit, Delete, Close) | Buttons positioned via resizeEvent | Zgodne z screenshot |
