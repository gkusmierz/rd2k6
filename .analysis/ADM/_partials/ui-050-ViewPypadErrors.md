---
partial_id: "050"
artifact: ADM
window_name: "Script Error Log"
class_name: ViewPypadErrors
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ViewPypadErrors.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Script Error Log

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ViewPypadErrors |
| Typ | Dialog |
| Tytuł okna | "Script Error Log [ID: {id}]" |
| Modalność | modal (inherited) |
| Rodzic | ListPypads |
| Rozmiar | 600x400 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/view_pypad_errors.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ViewPypadErrors.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int | ListPypads | tak (PYPAD_INSTANCES.ID) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| view_text | QTextEdit | (error log viewer) | Wyświetla ERROR_TEXT (readOnly) | - |
| view_close_button | QPushButton | "Close" | Zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Has errors | ERROR_TEXT not empty | Tekst błędów w widoku | - |
| No errors | ERROR_TEXT empty | Pusty widok | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListPypads | "Error Log" button | id (PYPAD_INSTANCES.ID) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
