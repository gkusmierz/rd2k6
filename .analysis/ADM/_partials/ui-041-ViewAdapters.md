---
partial_id: "041"
artifact: ADM
window_name: "Audio Resource Information"
class_name: ViewAdapters
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.audio_resource_information_dialog.png
mockup: mockups/ViewAdapters.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Audio Resource Information

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ViewAdapters |
| Typ | Dialog (read-only viewer) |
| Tytuł okna | RDADmin - Audio Resource Information |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/view_adapters.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.audio_resource_information_dialog.png |
| Mockup HTML | ✅ | mockups/ViewAdapters.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| rdstation | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| view_title_label | QLabel | Audio Resources on {station} | Tytuł z nazwą stacji | - |
| view_text_edit | Q3TextEdit (readOnly) | (brak) | Wyświetla raport audio resources | - |
| view_close_button | QPushButton | &Close | Zamyka dialog (default) | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Scanned | station scanned=true | Raport: Audio Drivers, Import/Export Formats, Audio Adapters (cards 0-7) | - |
| Not scanned | station scanned=false | "NO DATA AVAILABLE" + instrukcja uruchomienia daemonów | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | Read-only view | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Audio Resources button | station_station (RDStation*) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Audio Resource Information" | "RDADmin - Audio Resource Information" (typo: RDADmin) | Bug w kodzie: duże D |
| Rozmiar | ~460x290 | sizeHint 460x290 | Zgodne, resizable |
