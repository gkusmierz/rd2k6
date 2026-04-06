---
partial_id: "033"
artifact: ADM
window_name: "Rivendell Host List"
class_name: ListStations
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_host_list_dialog.png
mockup: mockups/ListStations.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell Host List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListStations |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Host List |
| Modalność | modal |
| Rodzic | MainWidget (RDAdmin main window) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_stations.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_host_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListStations.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box | Q3ListBox | Hosts: | Wyświetla listę stacji z DB (STATIONS.NAME) | doubleClicked → doubleClickedData → editData |
| list_add_button | QPushButton | &Add | Otwiera AddStation dialog | clicked → addData |
| list_edit_button | QPushButton | &Edit | Otwiera EditStation dla wybranej stacji | clicked → editData |
| list_delete_button | QPushButton | &Delete | Usuwa wybraną stację po potwierdzeniu | clicked → deleteData |
| list_close_button | QPushButton | &Close | Zamyka dialog (default button) | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | Brak stacji w DB | Pusta lista, wszystkie przyciski aktywne | - |
| Lista załadowana | Stacje istnieją | Lista z nazwami stacji (STATIONS.NAME) | - |
| Brak zaznaczenia | Nic nie wybrano | Edit/Delete nie reagują (early return) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Usuwanie stacji | Potwierdzenie Yes/No | "Are you sure you want to delete host \"{name}\"?" | Klik Delete | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Przycisk "Manage Hosts" | (brak) |
| ListStations → AddStation | Przycisk Add | &stationname (out param) |
| ListStations → EditStation | Przycisk Edit / Double-click | list_box->currentText() (station name) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Rivendell Host List" | "RDAdmin - Rivendell Host List" | Screenshot obcina prefix |
| Rozmiar | ~500x300 | sizeHint 500x300 | Zgodne |
