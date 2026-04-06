---
partial_id: "034"
artifact: ADM
window_name: "Add Host"
class_name: AddStation
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddStation.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add Host

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddStation |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Host |
| Modalność | modal |
| Rodzic | ListStations |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_station.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddStation.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| stationname | QString* (out) | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_name_edit | QLineEdit | New &Host Name: | Nazwa nowej stacji, max 64 znaków, RDTextValidator | - |
| add_exemplar_box | QComboBox | Base Host On: | Wybór wzorca stacji ("Empty Host Config" + lista STATIONS) | - |
| ok_button | QPushButton | &OK | Tworzy stację i otwiera EditStation (default) | clicked → okData |
| cancel_button | QPushButton | &Cancel | Zamyka dialog z kodem -1 | clicked → cancelData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Nowa stacja | Otwarcie dialogu | Puste pole nazwy, exemplar = "Empty Host Config" | - |
| Klonowanie | Wybrany exemplar | Pole nazwy puste, wybrany wzorzec z listy | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| add_name_edit | Nie może być puste | "You must give the host a name!" | OK click | QMessageBox::warning |
| RDStation::create | Musi się powieść | "Unable to create host!" + err_msg | OK click, create fails | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListStations | Przycisk Add | &stationname (out param) |
| AddStation → EditStation | Po udanym create, automatycznie | add_name_edit->text() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | brak screenshota | - | - |
