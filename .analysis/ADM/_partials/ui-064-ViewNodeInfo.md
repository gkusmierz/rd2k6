---
partial_id: "064"
artifact: ADM
window_name: "Viewing Livewire Node"
class_name: ViewNodeInfo
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ViewNodeInfo.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Viewing Livewire Node

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ViewNodeInfo |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Viewing Livewire Node |
| Modalność | modal |
| Rodzic | EditNode |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/view_node_info.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ViewNodeInfo.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| hostname | QString | EditNode | tak |
| port | Q_UINT16 | EditNode | tak |
| passwd | QString | EditNode | tak |
| base_output | unsigned | EditNode | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| view_hostname_edit | QLineEdit (readOnly) | Hostname: | wyświetla hostname | - |
| view_tcpport_edit | QLineEdit (readOnly) | Port: | wyświetla TCP port | - |
| view_system_edit | QLineEdit (readOnly) | System Version: | wypełniane z LiveWire | connectedData() |
| view_protocol_edit | QLineEdit (readOnly) | Protocol Version: | wypełniane z LiveWire | connectedData() |
| view_sources_edit | QLineEdit (readOnly) | Sources: | liczba źródeł | connectedData() |
| view_destinations_edit | QLineEdit (readOnly) | Destinations: | liczba destynacji | connectedData() |
| view_channels_edit | QLineEdit (readOnly) | Channels: | liczba kanałów | connectedData() |
| view_gpis_edit | QLineEdit (readOnly) | GPIs: | liczba GPI (format: total [bundles X size]) | connectedData() |
| view_gpos_edit | QLineEdit (readOnly) | GPOs: | liczba GPO (format: total [bundles X size]) | connectedData() |
| view_sources_view | RDListView | Sources (columns: #, Input #, Name, Active, Shareable, Chans, Gain) | lista źródeł | sourceChangedData() |
| view_destinations_view | RDListView | Destinations (columns: #, Output #, Name, Chans, Load, Gain) | lista destynacji | destinationChangedData() |
| button (Close) | QPushButton | &Close | zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Łączenie | Tuż po otwarciu | Pola wersji puste, listy puste - oczekiwanie na połączenie | - |
| Połączono | connectedData() | Pola wersji wypełnione, listy wypełniają się dynamicznie | - |
| Source [unassigned] | channelNumber <= 0 | Input # = "[unassigned]" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - dialog read-only |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditNode | Kliknięcie "View Node Info" | hostname, port, password, base_output |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
