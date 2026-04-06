---
partial_id: "074"
artifact: ADM
window_name: Rivendell Replicators
class_name: ListReplicators
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_replicators_dialog.png
mockup: mockups/ListReplicators.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell Replicators

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListReplicators |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Replicators |
| Modalność | modal |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_replicators.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_replicators_dialog.png |
| Mockup HTML | ✅ | mockups/ListReplicators.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_replicators_view | RDListView | Replicators: | Wyświetla listę replikatorów (NAME, TYPE, DESCRIPTION, HOST) | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddReplicator dialog | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditReplicator dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany replikator po potwierdzeniu | deleteData() |
| list_list_button | QPushButton | &List\nCarts | Otwiera ListReplicatorCarts dla wybranego | listData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (default button) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusta lista | Brak replikatorów w DB | Pusta tabela z nagłówkami kolumn | - |
| Lista z danymi | Istnieją replikatory | Tabela z wierszami (NAME, TYPE, DESCRIPTION, HOST) | - |
| Brak zaznaczenia | Nie wybrano wiersza | Edit/Delete/List Carts klikalne ale ignorowane (return) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Zaznaczenie (delete) | Wymaga wybranego itemu | "Are you sure you want to delete replicator \"{name}\"?" | Klik Delete | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Przycisk "Manage Replicators" | (nic) |
| ListReplicators → AddReplicator | Przycisk Add | QString *name (out) |
| ListReplicators → EditReplicator | Przycisk Edit / double-click | QString name (replicator name) |
| ListReplicators → ListReplicatorCarts | Przycisk List Carts | QString name (replicator name) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Zgodność | Pełna | Pełna | Screenshot dokładnie odpowiada kodowi |
