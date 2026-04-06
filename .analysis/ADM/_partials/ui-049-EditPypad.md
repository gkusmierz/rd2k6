---
partial_id: "049"
artifact: ADM
window_name: "Edit PyPAD Instance"
class_name: EditPypad
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_pypad_instance_dialog.png
mockup: mockups/EditPypad.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit PyPAD Instance

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditPypad |
| Typ | Dialog |
| Tytuł okna | "Edit PyPAD Instance [ID: {id}]" |
| Modalność | modal (inherited) |
| Rodzic | ListPypads |
| Rozmiar | 600x660 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_pypad.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_pypad_instance_dialog.png |
| Mockup HTML | ✅ | mockups/EditPypad.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int | ListPypads | tak (PYPAD_INSTANCES.ID) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_script_path_edit | QLineEdit | Script Path: | Ścieżka skryptu (readOnly) | - |
| edit_description_edit | QLineEdit | Description: | Opis instancji (edytowalny) | - |
| edit_config_text | QTextEdit | Configuration | Konfiguracja (plaintext, word wrap) | - |
| edit_ok_button | QPushButton | "OK" | Zapisuje do DB | okData() |
| edit_cancel_button | QPushButton | "Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | Script Path (readonly) + Description + Configuration textarea | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak walidacji explicite | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListPypads | "Add"/"Edit" button | id (PYPAD_INSTANCES.ID) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |
