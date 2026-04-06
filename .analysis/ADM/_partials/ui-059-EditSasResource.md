---
partial_id: "059"
artifact: ADM
window_name: "Edit SAS Switch"
class_name: EditSasResource
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditSasResource.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit SAS Switch

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSasResource |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit SAS Switch |
| Modalność | modal |
| Rodzic | ListSasResources |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_sas_resource.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditSasResource.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| enginenum | int* | ListSasResources (in/out) | tak |
| devicenum | int* | ListSasResources (in/out) | tak |
| relaynum | int* | ListSasResources (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_enginenum_edit | QLineEdit | Console Number: | Numer konsoli SAS | - |
| edit_devicenum_edit | QLineEdit | Source Number: | Numer źródła SAS | - |
| edit_relaynum_edit | QLineEdit | Opto/Relay Number: | Numer opto/relay | - |
| ok_button | QPushButton | &OK | Waliduje, zapisuje do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Nowy | Wszystkie -1 | Puste pola | - |
| Edycja | Wartości >= 0 | Wypełnione pola | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Console Number | Poprawna liczba int | "The Console Number is Invalid!" | OK + niepuste + nie-int | QMessageBox::warning |
| Source Number | Poprawna liczba int | "The Source Number is Invalid!" | OK + niepuste + nie-int | QMessageBox::warning |
| Opto/Relay Number | Poprawna liczba int | "The Opto/Relay Number is Invalid!" | OK + niepuste + nie-int | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSasResources | editData() -> exec() | enginenum*, devicenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
