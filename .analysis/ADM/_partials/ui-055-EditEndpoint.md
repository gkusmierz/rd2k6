---
partial_id: "055"
artifact: ADM
window_name: "Edit Input / Edit Output"
class_name: EditEndpoint
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditEndpoint.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Endpoint (Input/Output)

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditEndpoint |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Input / RDAdmin - Edit Output |
| Modalność | modal |
| Rodzic | ListEndpoints |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_endpoint.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditEndpoint.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| type | RDMatrix::Type | ListEndpoints | tak |
| endpoint | RDMatrix::Endpoint | ListEndpoints | tak |
| pointnum | int | ListEndpoints | tak |
| pointname | QString* | ListEndpoints (in/out) | tak |
| feedname | QString* | ListEndpoints (in/out) | tak |
| mode | RDMatrix::Mode* | ListEndpoints (in/out) | tak |
| enginenum | int* | ListEndpoints (in/out) | tak |
| devicenum | int* | ListEndpoints (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_endpoint_edit | QLineEdit | Name: | Nazwa endpointu | - |
| edit_feed_edit | QLineEdit | Feed: | Feed name (Unity4000 Input only) | - |
| edit_mode_box | QComboBox | Mode: | Stereo/Left/Right (Unity4000/StarGuideIII Input only) | - |
| edit_enginenum_edit | QLineEdit | Engine (Hex): / Provider ID: | Numer engine (Logitek) lub Provider ID (StarGuide) | - |
| edit_devicenum_edit | QLineEdit | Device (Hex): / Service ID: | Numer device (Logitek) lub Service ID (StarGuide) | - |
| ok_button | QPushButton | &OK | Waliduje numery, zapisuje wyniki do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Default | Generic matrix type | Tylko Name field widoczny | Feed, Mode, Engine, Device hidden |
| Unity4000 Input | type=Unity4000, endpoint=Input | Name + Feed + Mode | Engine/Device hidden |
| Unity4000 Output | type=Unity4000, endpoint=Output | Tylko Name | Feed/Mode/Engine/Device hidden |
| LogitekVguest | type=LogitekVguest | Name + Engine (Hex) + Device (Hex) | Feed/Mode hidden |
| StarGuideIII Input | type=StarGuideIII, endpoint=Input | Name + Provider ID + Service ID + Mode | Feed hidden |
| StarGuideIII Output | type=StarGuideIII, endpoint=Output | Tylko Name | Reszta hidden |

Rozmiar okna zależny od typu:
- Unity4000 Input: 400x130
- StarGuideIII Input: 420x156
- Domyślny: 400x100

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Engine Number | Poprawna liczba hex (Logitek) lub decimal (StarGuide) | "The Engine Number is Invalid!" / "The Provider ID is Invalid!" | OK | QMessageBox::warning |
| Device Number | Poprawna liczba hex (Logitek) lub decimal (StarGuide) | "The Device Number is Invalid!" / "The Service ID is Invalid!" | OK | QMessageBox::warning |
| Name | RDTextValidator | - | Inline | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListEndpoints | editData() -> exec() | type, endpoint, pointnum, pointname*, feedname*, mode*, enginenum*, devicenum* |
| EditEndpoint -> ListEndpoints | done(0) z wynikami w pointerach | Zmodyfikowane pointname, feedname, mode, enginenum, devicenum |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
