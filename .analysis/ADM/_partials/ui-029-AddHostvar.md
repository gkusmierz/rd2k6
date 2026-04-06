---
partial_id: "029"
artifact: ADM
window_name: "RDAdmin - Add Host Variable"
class_name: AddHostvar
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddHostvar.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Add Host Variable

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddHostvar |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Host Variable |
| Modalność | modal |
| Rodzic | ListHostvars |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_hostvar.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddHostvar.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | ListHostvars | tak |
| var | QString* | output - nazwa zmiennej | tak |
| varvalue | QString* | output - wartość zmiennej | tak |
| remark | QString* | output - komentarz | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_name_edit | QLineEdit | Variable Name: | Wpisz nazwę zmiennej (max 32) | - |
| add_varvalue_edit | QLineEdit | Variable Value: | Wpisz wartość zmiennej (max 255) | - |
| add_remark_edit | QLineEdit | Remark: | Wpisz komentarz (max 255) | - |
| ok_button | QPushButton | &OK | Waliduje i zamyka (done(0)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | 3 puste pola, OK/Cancel | ok_button.default=true |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| add_name_edit | Musi zaczynać i kończyć się na %, min 3 znaki | "The variable name is invalid." | okData() | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListHostvars → AddHostvar | Klik "Add" | QString station, QString* var/varvalue/remark |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | sizeHint=385x150 |
