---
partial_id: "026"
artifact: ADM
window_name: "RDAdmin - Test Traffic/Music Import"
class_name: TestImport
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.test_import_dialog.png
mockup: mockups/TestImport.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Test Traffic/Music Import

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | TestImport |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Test Traffic Import / RDAdmin - Test Music Import |
| Modalność | modal |
| Rodzic | EditSvc |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/test_import.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.test_import_dialog.png |
| Mockup HTML | ✅ | mockups/TestImport.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | RDSvc* | EditSvc (svc_svc) | tak |
| src | RDSvc::ImportSource | Traffic lub Music | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| test_date_edit | Q3DateEdit | Test Date: | Wybór daty testowej (default: dziś) | dateChangedData() |
| (select button) | QPushButton | &Select | Otwiera RDDateDialog | selectData() |
| test_import_button | QPushButton | &Import | Uruchamia import testowy | importData() |
| test_filename_edit | QLineEdit | Using source file: | Wyświetla ścieżkę pliku źródłowego (readOnly) | - |
| test_events_list | RDListView | Imported Events | Tabela wynikowa: ikona, Start Time, Cart, Len, Title, GUID, Event ID, Annc Type, Line | - |
| test_close_button | QPushButton | &Close | Zamyka dialog (done(0)) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Data = dziś, pusta lista eventów, ścieżka pliku wypełniona | - |
| Po imporcie | Po klik Import | Lista wypełniona importowanymi eventami z ikonami typu | - |
| Błąd importu | Import nie powiódł się | Komunikat "There was an error during import" | QMessageBox::information |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| import | Import musi się powieść | "There was an error during import\nplease check your settings and try again." | importData() | QMessageBox::information |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSvc → TestImport | Klik "Test Traffic"/"Test Music" | RDSvc*, RDSvc::ImportSource |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Test Music Import" | Dynamiczny (Traffic/Music) | Screenshot pokazuje wariant Music |
| Kolumna Annc Type | Nie widoczna (scrollbar) | Zdefiniowana w kodzie | Kolumna 7 |
