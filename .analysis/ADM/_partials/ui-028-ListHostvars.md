---
partial_id: "028"
artifact: ADM
window_name: "RDAdmin - Host Variables for {station}"
class_name: ListHostvars
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.host_variables_dialog.png
mockup: mockups/ListHostvars.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Host Variables for {station}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListHostvars |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Host Variables for {station} |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_hostvars.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.host_variables_dialog.png |
| Mockup HTML | ✅ | mockups/ListHostvars.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | EditStation (nazwa stacji) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | Q3ListView | Host Variables | Tabela 3-kolumnowa: NAME, VALUE, REMARK | - |
| list_view (doubleClicked) | Q3ListView | - | Otwiera EditHostvar | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddHostvar | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditHostvar dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybraną zmienną po potwierdzeniu | deleteData() |
| list_ok_button | QPushButton | &OK | Zapisuje wszystkie zmienne do DB i zamyka (done(0)) | okData() |
| list_cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |
| list_title_label | QLabel | Host Variables | Etykieta nad tabelą | - |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lista zmiennych z DB dla stacji, 3 przyciski + OK/Cancel | list_ok_button.default=true |
| Brak zaznaczenia | selectedItem == NULL | Edit/Delete nie robią nic (early return) | - |
| Po dodaniu | Po powrocie z AddHostvar | Nowy element w liście | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Potwierdzenie usunięcia | "Are you sure you want to delete the variable {name}?" | deleteData() | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation → ListHostvars | Klik "Host Variables" | QString station |
| ListHostvars → AddHostvar | Klik "Add" | QString station, QString* varname/value/remark |
| ListHostvars → EditHostvar | Klik "Edit"/double-click | QString station, var name, QString* value/remark |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Host Variables for GAZERBEAM" | Dynamiczny z parametrem station | Zgodne |
