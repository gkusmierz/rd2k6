---
partial_id: "051"
artifact: ADM
window_name: "Rivendell Switcher List"
class_name: ListMatrices
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_switcher_list_dialog.png
mockup: mockups/ListMatrices.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell Switcher List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListMatrices |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Switcher List |
| Modalność | modal |
| Rodzic | EditStation (switcher configuration) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_matrices.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_switcher_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListMatrices.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | EditStation parent | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | Q3ListView | Switchers: | Wyświetla listę switcherów (MATRIX, DESCRIPTION, TYPE) | - |
| list_view (dblclick) | Q3ListView | - | Dwuklik otwiera EditMatrix | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddMatrix, potem EditMatrix | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditMatrix dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany switcher (z potwierdzeniem) | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog, wysyła RDMacro::SZ dla zmodyfikowanych | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | Brak switcherów w DB | Pusta lista, wszystkie przyciski aktywne | - |
| Lista z elementami | Switchery istnieją w DB | Lista MATRIX/DESCRIPTION/TYPE | - |
| Brak zaznaczenia | Nie wybrano elementu | Edit/Delete nie działają (return early) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Delete | Potwierdzenie | "Are you sure you want to delete switcher X:Y on Z? ALL references to this switcher will be deleted!" | Kliknięcie Delete | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Otwiera jako modal | station (QString) |
| ListMatrices -> AddMatrix | addData() -> AddMatrix::exec() | station |
| ListMatrices -> EditMatrix | addData()/editData() -> EditMatrix::exec() | RDMatrix* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Rivendell Switcher List" | "RDAdmin - Rivendell Switcher List" | Screenshot obcina prefix |
| Kolumny | MATRIX, DESCRIPTION, TYPE | MATRIX, DESCRIPTION, TYPE | Zgodne |
| Przyciski | Add, Edit, Delete, Close | &Add, &Edit, &Delete, &Close | Zgodne |
