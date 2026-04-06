---
partial_id: "066"
artifact: ADM
window_name: "Edit GPIO Source"
class_name: EditLiveWireGpio
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditLiveWireGpio.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit GPIO Source

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditLiveWireGpio |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit GPIO Source |
| Modalność | modal |
| Rodzic | ListLiveWireGpios |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_livewiregpio.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditLiveWireGpio.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| slot | int | ListLiveWireGpios | tak |
| source | int* | ListLiveWireGpios (in/out) | tak |
| addr | QHostAddress* | ListLiveWireGpios (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| label (title) | QLabel | GPIO Lines X - Y (dynamicznie: 5*slot+1 - 5*slot+5) | info header | - |
| edit_source_number_spin | QSpinBox | Livewire Source: | numer źródła (0-RD_LIVEWIRE_MAX_SOURCE, 0=None) | - |
| edit_ip_address_edit | QLineEdit | Surface Address: | adres IP surface | - |
| button (OK) | QPushButton | &OK | waliduje i zamyka | okData() |
| button (Cancel) | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | Pola wypełnione z parametrów wejściowych | - |
| Adres pusty | addr.isNull() | Pole Surface Address puste | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| edit_ip_address_edit | Poprawny adres IP (lub pusty, lub "0.0.0.0") | "The IP address is invalid!" | OK, niepoprawny IP | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListLiveWireGpios | editData() / double-click | slot, source*, addr* |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
