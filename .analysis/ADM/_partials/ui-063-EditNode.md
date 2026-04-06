---
partial_id: "063"
artifact: ADM
window_name: "Edit LiveWire Node"
class_name: EditNode
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditNode.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit LiveWire Node

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditNode |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit LiveWire Node |
| Modalność | modal |
| Rodzic | ListNodes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_node.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditNode.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int* | ListNodes (-1 = nowy) | tak |
| matrix | RDMatrix* | ListNodes | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_hostname_edit | QLineEdit | Hostname: | wprowadzenie hostname noda | - |
| edit_tcpport_spin | QSpinBox | Port: | TCP port (0-65535) | - |
| edit_description_edit | QLineEdit | Description: | opis noda | - |
| edit_output_spin | QSpinBox | First Output: | bazowy output (0-32767, 0=None) | - |
| edit_password_edit | QLineEdit | Password: | hasło (EchoMode=Password) | passwordChangedData() |
| button (View Node Info) | QPushButton | &View Node Info | otwiera ViewNodeInfo | viewData() |
| button (OK) | QPushButton | &OK | zapisuje i zamyka | okData() |
| button (Cancel) | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Tryb Add | id < 0 | Puste pola, TCP port = RD_LIVEWIRE_DEFAULT_TCP_PORT | - |
| Tryb Edit | id >= 0 | Pola wypełnione z DB, hasło = "********" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| hostname + port | Unikalność w matrycy (STATION + MATRIX + HOSTNAME + TCP_PORT) | "That node is already listed for this matrix!" | OK w trybie Add, duplikat | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListNodes (Add) | addData() | id=-1, matrix |
| ListNodes (Edit) | editData() | id wybranego noda, matrix |
| EditNode → ViewNodeInfo | Kliknięcie View Node Info | hostname, port, password, base_output |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
