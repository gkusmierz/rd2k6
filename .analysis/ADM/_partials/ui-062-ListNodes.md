---
partial_id: "062"
artifact: ADM
window_name: "Livewire Node List"
class_name: ListNodes
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListNodes.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Livewire Node List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListNodes |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Livewire Node List |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_nodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListNodes.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix parent | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | RDListView | (columns: HOSTNAME, DESCRIPTION, FIRST OUTPUT, TCP PORT) | wyświetla listę nodów LiveWire | doubleClicked→doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera EditNode w trybie add | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditNode w trybie edit | editData() |
| list_delete_button | QPushButton | &Delete | usuwa wybrany node | deleteData() |
| list_close_button | QPushButton | &Close | zamyka dialog, purge endpoints | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak nodów w SWITCHER_NODES | Pusta lista, przyciski aktywne | - |
| Lista z elementami | istnieją nody | Lista z kolumnami HOSTNAME, DESCRIPTION, FIRST OUTPUT, TCP PORT | - |
| FIRST OUTPUT = [none] | BASE_OUTPUT == 0 | Tekst "[none]" w kolumnie FIRST OUTPUT | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Wybrany element (delete) | Potwierdzenie usunięcia | "Are your sure you want to delete this node?" | Kliknięcie Delete | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | Otwiera ListNodes | RDMatrix* matrix |
| ListNodes → EditNode (Add) | Kliknięcie Add | id=-1 (nowy), matrix |
| ListNodes → EditNode (Edit) | Kliknięcie Edit / Double-click | id wybranego noda, matrix |
| closeData | Purge INPUTS + OUTPUTS endpoints, done(0) | - |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
