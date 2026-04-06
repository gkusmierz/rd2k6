---
partial_id: "022"
artifact: ADM
window_name: "RDAdmin - Services"
class_name: ListSvcs
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.services_dialog.png
mockup: mockups/ListSvcs.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Services

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListSvcs |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Services |
| Modalność | modal |
| Rodzic | QWidget *parent (main admin window) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_svcs.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.services_dialog.png |
| Mockup HTML | ✅ | mockups/ListSvcs.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box | Q3ListBox | Services: | Wyświetla listę nazw serwisów z DB (SERVICES.NAME) | - |
| list_box (doubleClicked) | Q3ListBox | - | Otwiera EditSvc dla wybranego serwisu | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddSvc dialog | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditSvc dla zaznaczonego serwisu | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany serwis po potwierdzeniu | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (done(0)) | closeData() |
| list_title_label | QLabel | &Services: | Etykieta nad listą | - |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lista serwisów z DB, 4 przyciski po prawej | list_close_button.default=true |
| Brak zaznaczenia | currentItem < 0 | Edit/Delete nie robią nic (early return) | - |
| Po dodaniu | Po powrocie z AddSvc | Lista odświeżona, nowy serwis zaznaczony | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Potwierdzenie usunięcia | "Are you sure you want to delete service {name}?" | deleteData() | QMessageBox::warning |
| delete | Potwierdzenie logów | "There are N logs owned by this service that will also be deleted.\nDo you still want to proceed?" | deleteData() gdy istnieją logi | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSvcs → AddSvc | Klik "Add" | QString *svcname (output) |
| ListSvcs → EditSvc | Klik "Edit" lub double-click | QString svc (currentText) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Zgodne | Zgodne | Layout dynamiczny via resizeEvent |
