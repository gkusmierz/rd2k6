---
partial_id: "039"
artifact: ADM
window_name: "Hot Key Configuration"
class_name: EditHotkeys
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rdairplay_hotkey_configuration_dialog.png
mockup: mockups/EditHotkeys.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Hot Key Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditHotkeys |
| Typ | Dialog |
| Tytuł okna | RDAdmin - {MODULE} Hot Key Configuration for {station} |
| Modalność | modal |
| Rodzic | EditRDAirPlay / EditRDPanel (via EditStation sub-dialogs) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_hotkeys.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rdairplay_hotkey_configuration_dialog.png |
| Mockup HTML | ✅ | mockups/EditHotkeys.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | caller | tak |
| module | QString | caller (np. "airplay", "panel") | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | Q3ListView | Host Hot Key Configurations | 2-kolumnowa lista (Button/Function, KeyStroke) | clicked/doubleClicked → showCurrentKey |
| keystroke | QLineEdit | (brak etykiety) | Wyświetla bieżący skrót klawiaturowy, przechwytuje klawisze | keyPressEvent/keyReleaseEvent |
| set_button | QPushButton | Set | Przypisuje bieżący keystroke do wybranej pozycji | clicked → SetButtonClicked |
| clear_button | QPushButton | Clear | Czyści bieżący keystroke | clicked → clearCurrentItem |
| clear_all_button | QPushButton | Clear All Hotkeys | Czyści wszystkie skróty po potwierdzeniu | clicked → clearAll_Hotkeys |
| clone_from_host_box | QComboBox | Set From Host: | Klonuje hotkeys z innej stacji | activated → Clone_RefreshList |
| save_button | QPushButton | Save | Zapisuje do DB (RDHOTKEYS) | clicked → save |
| cancel_button | QPushButton | Cancel | Zamyka bez zapisu (z potwierdzeniem jeśli zmienione) | clicked → cancel |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista załadowana | Otwarcie | Hotkeys z DB dla station+module | - |
| Brak zaznaczenia | Nic nie wybrane w list_view | Set nie reaguje ("Please Select an Item") | - |
| Keystroke captured | Klawisze naciśnięte | keystroke field pokazuje kombinację (Alt/Ctrl + key) | - |
| Dane zmienione | keyupdated=true | Cancel pyta o potwierdzenie | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| list_view selection | Musi być wybrana pozycja | "Please Select an Item From the List" | Set bez zaznaczenia | QMessageBox::warning |
| Duplikaty | Brak duplikatów klawiszy | "Duplicate Hotkey defined {key}" | Save | QMessageBox::warning |
| Cancel z zmianami | Potwierdzenie Yes/No | "Are you sure - All Hot Keys changes will be Lost!" | Cancel + keyupdated | QMessageBox::warning |
| Clear All | Potwierdzenie Yes/No | "Are you sure - This will Clear All Hot Key Settings!" | Clear All | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditRDAirPlay / EditRDPanel | Hotkeys button | station name, module name |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "AIRPLAY Hot Key Configuration for gazerbeam" | Dynamic: module.upper() + " Hot Key Configuration for " + station | Zgodne |
| Rozmiar | ~400x500 | sizeHint 400x500 | Zgodne |
