---
partial_id: "054"
artifact: ADM
window_name: "List Inputs / List Outputs"
class_name: ListEndpoints
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListEndpoints.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: List Endpoints (Inputs/Outputs)

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListEndpoints |
| Typ | Dialog |
| Tytuł okna | RDAdmin - List Inputs / RDAdmin - List Outputs |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_endpoints.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListEndpoints.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| endpoint | RDMatrix::Endpoint | EditMatrix (Input/Output) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | INPUTS/OUTPUTS | Lista endpointów z kolumnami zależnymi od typu switchera | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditEndpoint | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditEndpoint dla wybranego | editData() |
| list_ok_button | QPushButton | &OK | Zapisuje wszystkie endpointy do DB | okData() |
| list_cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

Kolumny Q3ListView zależą od typu matrycy:
- **Default**: INPUT/OUTPUT, LABEL
- **Unity4000 (Input)**: + SOURCE, MODE
- **LogitekVguest**: + ENGINE (Hex), DEVICE (Hex)
- **StarGuideIII (Input)**: + PROVIDER ID, SERVICE ID, MODE
- **LiveWireLwrpAudio**: + NODE, #

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Input mode | endpoint=RDMatrix::Input | Tytuł "List Inputs", kolumna "INPUT" | - |
| Output mode | endpoint=RDMatrix::Output | Tytuł "List Outputs", kolumna "OUTPUT" | - |
| Readonly | type=LiveWireLwrpAudio lub SasUsi | Edit disabled, brak doubleclick | edit_button disabled |
| Editable | inne typy | Edit aktywny, doubleclick działa | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak walidacji na tym poziomie | - | - | Walidacje w EditEndpoint |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | inputsButtonData()/outputsButtonData() | RDMatrix*, Input/Output |
| ListEndpoints -> EditEndpoint | editData() | type, endpoint, pointnum, pointname, feedname, mode, enginenum, devicenum |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
