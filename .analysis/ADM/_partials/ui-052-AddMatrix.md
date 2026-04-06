---
partial_id: "052"
artifact: ADM
window_name: "Add Switcher"
class_name: AddMatrix
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddMatrix.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add Switcher

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddMatrix |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Switcher |
| Modalność | modal |
| Rodzic | ListMatrices |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_matrix.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddMatrix.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | ListMatrices | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_matrix_box | QSpinBox | &New Matrix Number: | Wybór numeru matrycy (0..MAX_MATRICES-1) | - |
| add_type_box | QComboBox | &Switcher Type: | Wybór typu switcher (RDMatrix::Type enum) | - |
| ok_button | QPushButton | &OK | Sprawdza duplikat, tworzy rekord MATRICES, done(matrix_num) | okData() |
| cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | SpinBox ustawiony na pierwszy wolny numer matrycy | - |
| Brak wolnych | Wszystkie numery zajęte | SpinBox bez wolnego numeru (GetNextMatrix() zwraca -1) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Matrix Number | Nie może być duplikatem | "Matrix already exists!" | OK kliknięty, istnieje w DB | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListMatrices | addData() -> exec() | station |
| AddMatrix -> ListMatrices | done(matrix_num) lub done(-1) | numer matrycy lub -1 (anulowano) |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
