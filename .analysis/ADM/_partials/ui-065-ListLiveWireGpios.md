---
partial_id: "065"
artifact: ADM
window_name: "Livewire GPIO Source Assignments"
class_name: ListLiveWireGpios
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListLiveWireGpios.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Livewire GPIO Source Assignments

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListLiveWireGpios |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Livewire GPIO Source Assignments |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_livewiregpios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListLiveWireGpios.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| slot_quan | int | EditMatrix (liczba slotów GPIO) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | RDListView | Switchers: (columns: Lines, Source #, Surface Address) | wyświetla sloty GPIO | doubleClicked→doubleClickedData() |
| list_edit_button | QPushButton | &Edit | otwiera EditLiveWireGpio | editData() |
| list_ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| list_cancel_button | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista slotów | zawsze | Wiersze "X - Y" (grupy po 5 linii GPIO), Source # i Surface Address | - |
| Source = [none] | SOURCE_NUMBER == 0 | "[none]" w kolumnie Source # | - |
| Address = [all] | IP_ADDRESS puste | "[all]" w kolumnie Surface Address | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji na tym poziomie |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | Otwiera ListLiveWireGpios | matrix, slot_quan |
| ListLiveWireGpios → EditLiveWireGpio | Kliknięcie Edit / Double-click | slot number, source, address |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
