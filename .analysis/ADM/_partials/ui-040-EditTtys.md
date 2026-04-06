---
partial_id: "040"
artifact: ADM
window_name: "Edit Serial Ports"
class_name: EditTtys
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_serial_ports_dialog.png
mockup: mockups/EditTtys.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Serial Ports

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditTtys |
| Typ | Dialog |
| Tytuł okna | RDAdmin- Edit Serial Ports |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_ttys.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_serial_ports_dialog.png |
| Mockup HTML | ✅ | mockups/EditTtys.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | caller (station name) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_port_box | QComboBox | Port ID: | Serial0..Serial{MAX_TTYS-1} | activated → idSelectedData |
| edit_enable_button | QCheckBox | Enabled | Włącza/wyłącza port | stateChanged → enableButtonData |
| edit_port_edit | QLineEdit | TTY Device: | Ścieżka urządzenia (np. /dev/ttyS0) | - |
| edit_baudrate_box | QComboBox | Baud Rate: | 50-230400 (18 opcji) | - |
| edit_parity_box | QComboBox | Parity: | None/Even/Odd | - |
| edit_databits_box | QComboBox | Data Bits: | 5/6/7/8 | - |
| edit_stopbits_box | QComboBox | Stop Bits: | 1/2 | - |
| edit_termination_box | QComboBox | Terminator: | None/CR/LF/CR-LF | - |
| close_button | QPushButton | &Close | Zapisuje i zamyka, wysyła RML reload | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Port enabled | checkbox checked | Wszystkie pola edycji aktywne | - |
| Port disabled | checkbox unchecked | TTY Device, Baud Rate, Parity, Data/Stop Bits, Terminator disabled | All fields disabled |
| Port in use (disable attempt) | Próba wyłączenia portu używanego przez Switcher/GPIO | Info o macierzy używającej port, checkbox wraca do checked | QMessageBox::information |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Port in use | Nie można wyłączyć portu używanego przez macierz | "This port is currently in use by the following Switcher/GPIO device: Matrix: N, Type: X, Description: Y" | Uncheck when in use | QMessageBox::information |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Serial Ports button | station name (QString) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Rozmiar | ~300x290 | sizeHint 300x290 | Zgodne |
| Tytuł | "Edit Serial Ports" | "RDAdmin- Edit Serial Ports" (brak spacji) | Drobny bug w kodzie |
