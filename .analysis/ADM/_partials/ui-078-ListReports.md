---
partial_id: "078"
artifact: ADM
window_name: Rivendell Report List
class_name: ListReports
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListReports.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell Report List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListReports |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Report List |
| Modalność | modal |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_reports.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListReports.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box | Q3ListBox | R&eports: | Wyświetla listę nazw raportów z DB REPORTS | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddReport, potem EditReport | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditReport dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany raport po potwierdzeniu | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (default) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusta lista | Brak raportów w DB | Pusta lista | - |
| Lista z danymi | Istnieją raporty | Lista nazw raportów | - |
| Brak zaznaczenia | Nie wybrano elementu | Edit/Delete klikalne ale ignorowane | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Zaznaczenie (delete) | Wymaga wybranego itemu | "Are you sure you want to delete report \"{name}\"?" | Klik Delete | QMessageBox::warning "Delete Report" |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Przycisk "Manage Reports" | (nic) |
| ListReports → AddReport | Przycisk Add | QString* rptname (out) |
| ListReports → EditReport | Przycisk Edit / double-click / po Add | QString rptname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |
