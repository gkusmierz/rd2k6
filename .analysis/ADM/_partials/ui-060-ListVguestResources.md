---
partial_id: "060"
artifact: ADM
window_name: "vGuest Switches / vGuest Displays"
class_name: ListVguestResources
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListVguestResources.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: vGuest Switches / Displays

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListVguestResources |
| Typ | Dialog |
| Tytuł okna | RDAdmin - vGuest Switches / RDAdmin - vGuest Displays |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_vguest_resources.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListVguestResources.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| type | RDMatrix::VguestType | EditMatrix (VguestTypeRelay/VguestTypeDisplay) | tak |
| size | int | EditMatrix (gpos_count / displays_count) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | - | Lista vGuest resources | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditVguestResource | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditVguestResource | editData() |
| list_ok_button | QPushButton | &OK | Zapisuje do VGUEST_RESOURCES | okData() |
| list_cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

Kolumny Q3ListView dla Relay mode:
- GPIO LINE (3-digit)
- ENGINE (Hex)
- DEVICE (Hex)
- SURFACE (Hex)
- BUS/RELAY (Hex)

Kolumny Q3ListView dla Display mode:
- DISPLAY (3-digit)
- ENGINE (Hex)
- DEVICE (Hex)
- SURFACE (Hex)

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Relay mode | type=VguestTypeRelay | Tytuł "vGuest Switches", 5 kolumn | - |
| Display mode | type=VguestTypeDisplay | Tytuł "vGuest Displays", 4 kolumny (bez BUS/RELAY) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak na tym poziomie | - | - | Walidacja w EditVguestResource |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | vguestRelaysButtonData()/vguestDisplaysButtonData() | RDMatrix*, VguestType, size |
| ListVguestResources -> EditVguestResource | editData() | VguestType, enginenum*, devicenum*, surfacenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
