---
partial_id: "061"
artifact: ADM
window_name: "Edit vGuest Switch / Edit vGuest Display"
class_name: EditVguestResource
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditVguestResource.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit vGuest Resource

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditVguestResource |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit vGuest Switch / RDADmin - Edit vGuest Display |
| Modalność | modal |
| Rodzic | ListVguestResources |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_vguest_resource.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditVguestResource.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| type | RDMatrix::VguestType | ListVguestResources | tak |
| enginenum | int* | ListVguestResources (in/out) | tak |
| devicenum | int* | ListVguestResources (in/out) | tak |
| surfacenum | int* | ListVguestResources (in/out) | tak |
| relaynum | int* | ListVguestResources (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_enginenum_edit | QLineEdit | Engine (Hex): | Numer engine Logitek (hex) | - |
| edit_devicenum_edit | QLineEdit | Device (Hex): | Numer device Logitek (hex) | - |
| edit_surfacenum_edit | QLineEdit | Surface (Hex): | Numer surface Logitek (hex) | - |
| edit_relaynum_edit | QLineEdit | Bus/Relay (Hex): | Numer bus/relay (hex) | - |
| ok_button | QPushButton | &OK | Waliduje hex, zapisuje do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Switch mode | type=VguestTypeRelay | Tytuł "Edit vGuest Switch", Bus/Relay enabled | - |
| Display mode | type=VguestTypeDisplay | Tytuł "Edit vGuest Display", Bus/Relay disabled | edit_relaynum_edit disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Engine (Hex) | Poprawna liczba hex | "The Engine Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |
| Device (Hex) | Poprawna liczba hex | "The Device Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |
| Surface (Hex) | Poprawna liczba hex | "The Surface Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |
| Bus/Relay (Hex) | Poprawna liczba hex | "The Bus/Relay Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListVguestResources | editData() -> exec() | VguestType, enginenum*, devicenum*, surfacenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
| Tytuł Display | - | "RDADmin" (literówka w kodzie) | Typo: "RDADmin" zamiast "RDAdmin" |
