---
partial_id: "030"
artifact: ADM
window_name: "RDAdmin - Edit Host Variable"
class_name: EditHostvar
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_host_variable_dialog.png
mockup: mockups/EditHostvar.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Edit Host Variable

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditHostvar |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Host Variable |
| Modalność | modal |
| Rodzic | ListHostvars |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_hostvar.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_host_variable_dialog.png |
| Mockup HTML | ✅ | mockups/EditHostvar.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | ListHostvars | tak |
| var | QString | Nazwa zmiennej (readOnly) | tak |
| varvalue | QString* | Wartość zmiennej (in/out) | tak |
| remark | QString* | Komentarz (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_name_edit | QLineEdit | Variable Name: | Wyświetla nazwę zmiennej (readOnly) | - |
| edit_varvalue_edit | QLineEdit | Variable Value: | Edycja wartości zmiennej (max 255) | - |
| edit_remark_edit | QLineEdit | Remark: | Edycja komentarza (max 255) | - |
| ok_button | QPushButton | &OK | Zapisuje i zamyka (done(0)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Nazwa readOnly, wartość i remark edytowalne | ok_button.default=true, edit_name_edit readOnly |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListHostvars → EditHostvar | Klik "Edit"/double-click | QString station, QString var, QString* varvalue/remark |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Edit Host Variable" | "RDAdmin - Edit Host Variable" | Screenshot nie pokazuje pełnego tytułu paska |
