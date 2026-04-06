---
partial_id: "048"
artifact: ADM
window_name: "PyPAD Instances"
class_name: ListPypads
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.pypad_instances_dialog.png
mockup: mockups/ListPypads.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: PyPAD Instances

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListPypads |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - PyPAD Instances on {station_name}" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 600x400 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_pypads.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.pypad_instances_dialog.png |
| Mockup HTML | ✅ | mockups/ListPypads.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | RDListView | (lista instancji) | Wyświetla PyPAD instances | doubleClickedData() -> editData() |
| list_add_button | QPushButton | "&Add" | Dodaje nową instancję PyPAD | addData() |
| list_edit_button | QPushButton | "&Edit" | Edytuje wybraną instancję | editData() |
| list_delete_button | QPushButton | "&Delete" | Usuwa wybraną instancję | deleteData() |
| list_error_button | QPushButton | "&Error Log" | Pokazuje log błędów | errorData() |
| list_close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

### Kolumny listy
| # | Nagłówek | Wyrównanie | Dane |
|---|----------|-----------|------|
| 0 | (status icon) | Center | Zielona/czerwona ikonka (running/stopped) |
| 1 | ID | Right | Numer ID instancji |
| 2 | Description | Left | Opis instancji |
| 3 | Script Path | Left | Ścieżka do skryptu Python |
| 4 | Exit Code | Right | Kod wyjścia procesu |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Running | IS_RUNNING='Y' | Zielona ikonka w kolumnie 0 | - |
| Stopped | IS_RUNNING='N' | Czerwona ikonka w kolumnie 0 | - |
| Empty list | brak instancji | Pusta lista | - |
| No selection | nic nie zaznaczone | Edit/Delete/Error nic nie robią | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (delete) | Potwierdzenie | "Are you sure you want to delete this instance?" | deleteData() | QMessageBox::question (Yes/No) |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "PyPAD Instances" | station |
| ListPypads | "Add" button | -> QFileDialog (skrypt .py) -> EditPypad (nowy ID) |
| ListPypads | "Edit" button / doubleclick | -> EditPypad (existing ID) |
| ListPypads | "Error Log" button | -> ViewPypadErrors (ID) |

## Logika biznesowa
- Timer 3000ms odświeża statusy IS_RUNNING i EXIT_CODE z DB (updateData)
- Przy Add: szuka pliku .exemplar obok skryptu i wczytuje jako domyślną konfigurację
- Po Add/Edit: wysyła RDNotification (PypadType, Add/ModifyAction) przez RIPC
- Po Delete: wysyła RDNotification (PypadType, DeleteAction) przez RIPC

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |
