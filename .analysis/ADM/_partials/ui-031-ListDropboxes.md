---
partial_id: "031"
artifact: ADM
window_name: "RDAdmin - Rivendell Dropbox Configurations on {station}"
class_name: ListDropboxes
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_dropbox_configurations_dialog.png
mockup: mockups/ListDropboxes.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Rivendell Dropbox Configurations on {station}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListDropboxes |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Dropbox Configurations on {stationname} |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_dropboxes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_dropbox_configurations_dialog.png |
| Mockup HTML | ✅ | mockups/ListDropboxes.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| stationname | const QString& | EditStation (nazwa stacji) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_dropboxes_view | RDListView | (tabela) | 11 kolumn: ID, Group, Path, Normalization Level, Autotrim Level, To Cart, Use CartChunk ID, Delete Cuts, Metadata Pattern, Fix Broken Formats, User Defined | - |
| list_dropboxes_view (doubleClicked) | RDListView | - | Otwiera EditDropbox | doubleClickedData() |
| list_add_button | QPushButton | &Add | Tworzy nowy dropbox, otwiera EditDropbox | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditDropbox dla wybranego | editData() |
| list_duplicate_button | QPushButton | D&uplicate | Duplikuje dropbox, otwiera EditDropbox | duplicateData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany dropbox (bez potwierdzenia) | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (done(0)) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lista dropboxów z DB, 5 przycisków po prawej | list_close_button.default=true |
| Brak zaznaczenia | selectedItem == NULL | Edit/Duplicate/Delete nie robią nic (early return) | - |
| Po dodaniu | Po powrocie z EditDropbox (OK) | Nowy element w liście, zaznaczony | Wysyła RDNotification::AddAction |
| Po duplikacji | Po powrocie z EditDropbox (OK) | Zduplikowany element w liście | Wysyła RDNotification::AddAction |
| Po edycji | Po powrocie z EditDropbox (OK) | Element odświeżony | Wysyła RDNotification::ModifyAction |
| Po usunięciu | deleteData() | Element usunięty z listy | Wysyła RDNotification::DeleteAction |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | Usunięcie bez potwierdzenia | - | deleteData() | Bezpośrednie usunięcie |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation → ListDropboxes | Klik "Dropboxes" | const QString& stationname |
| ListDropboxes → EditDropbox | Add/Edit/Duplicate | int id, bool duplicate |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Przycisk "Duplicate" | Widoczny | W kodzie | Zgodne |
| Kolumny | Częściowo widoczne (scrollbar) | 11 kolumn w kodzie | Screenshot obcięty |
