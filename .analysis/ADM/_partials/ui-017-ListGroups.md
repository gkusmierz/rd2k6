---
partial_id: "017"
artifact: ADM
window_name: "RDAdmin - Rivendell Group List"
class_name: ListGroups
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_group_list_dialog.png
mockup: mockups/ListGroups.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell Group List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListGroups |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Group List |
| Modalność | modal |
| Rodzic | MainWidget |
| Rozmiar | 640x480 (resizable, minimum) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_groups.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_group_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListGroups.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| - | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_groups_view | RDListView | Groups: | wyświetla listę grup z kolorami | doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera AddGroup dialog | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditGroup dialog | editData() |
| list_rename_button | QPushButton | &Rename | otwiera RenameGroup dialog | renameData() |
| list_delete_button | QPushButton | &Delete | usuwa wybraną grupę | deleteData() |
| list_report_button | QPushButton | Generate Report | generuje raport tekstowy | reportData() |
| list_close_button | QPushButton | &Close | zamyka dialog (default) | closeData() |

### Kolumny RDListView
| # | Nagłówek | Alignment | Źródło DB |
|---|----------|-----------|-----------|
| 0 | Name | left (bold, colored) | GROUPS.NAME + COLOR |
| 1 | Description | left | GROUPS.DESCRIPTION |
| 2 | Start Cart | center | GROUPS.DEFAULT_LOW_CART |
| 3 | End Cart | center | GROUPS.DEFAULT_HIGH_CART |
| 4 | Enforce Range | center | GROUPS.ENFORCE_CART_RANGE |
| 5 | Default Type | center | GROUPS.DEFAULT_CART_TYPE (Audio/Macro/[none]) |
| 6 | Traffic Report | center | GROUPS.REPORT_TFC |
| 7 | Music Report | center | GROUPS.REPORT_MUS |
| 8 | Now & Next | center | GROUPS.ENABLE_NOW_NEXT |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak grup w DB | pusta lista | brak |
| Lista wypełniona | są grupy | lista z kolorowymi nazwami grup | brak |
| Brak zaznaczenia | nic nie wybrane | Edit/Rename/Delete nie działają (early return) | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete confirm | - | "{N} member carts will be deleted along with group \"X\"! Are you sure you want to delete group \"X\"?" | deleteData | QMessageBox::warning Yes/No |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | przycisk "Manage Groups" | - |
| ListGroups → AddGroup | przycisk Add | QString* group (output) |
| ListGroups → EditGroup | przycisk Edit / double-click | groupname (text col 0) |
| ListGroups → RenameGroup | przycisk Rename | groupname (text col 0) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Kolumny Default Type, Traffic/Music Report, Now&Next | nie widoczne (obcięte) | obecne w kodzie | okno za wąskie na screenshot |
