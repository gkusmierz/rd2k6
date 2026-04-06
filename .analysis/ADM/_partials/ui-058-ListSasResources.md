---
partial_id: "058"
artifact: ADM
window_name: "SAS Switches"
class_name: ListSasResources
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListSasResources.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: SAS Switches

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListSasResources |
| Typ | Dialog |
| Tytuł okna | RDAdmin - SAS Switches |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_sas_resources.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListSasResources.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| size | int | EditMatrix (displays count) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | SAS Switches | Lista SAS resources | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditSasResource | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditSasResource | editData() |
| list_ok_button | QPushButton | &OK | Zapisuje do VGUEST_RESOURCES | okData() |
| list_cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

Kolumny Q3ListView:
- GPIO Line (3-digit)
- Console
- Source
- Opto/Relay

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista załadowana | Otwarcie | Lista GPIO lines z Console/Source/Relay | - |
| Puste pola | Brak resource | Puste kolumny Console/Source/Relay | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak na tym poziomie | - | - | Walidacja w EditSasResource |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | sasResourcesButtonData() | RDMatrix*, displays_count |
| ListSasResources -> EditSasResource | editData() | enginenum*, devicenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
