---
partial_id: "042"
artifact: ADM
window_name: "JACK Configuration"
class_name: EditJack
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.jack_configuration_dialog.png
mockup: mockups/EditJack.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: JACK Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditJack |
| Typ | Dialog |
| Tytuł okna | RDAdmin - JACK Configuration for {station} |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_jack.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.jack_configuration_dialog.png |
| Mockup HTML | ✅ | mockups/EditJack.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_start_jack_box | QCheckBox | Start JACK Server | Włącza auto-start JACK | toggled → startJackData |
| edit_jack_server_name_edit | QLineEdit | JACK Server Name: | Nazwa serwera (default: "default") | - |
| edit_jack_command_line_edit | QLineEdit | JACK Command Line: | Komenda uruchomienia JACK | - |
| edit_jack_audio_ports_spin | QSpinBox | Active Audio Ports: | 0-24 portów | - |
| edit_jack_client_view | RDListView | JACK Clients to Start: | 2-kolumnowa lista (Client, Command Line) | doubleClicked → doubleClickedData |
| edit_add_button | QPushButton | &Add | Dodaje klienta JACK (otwiera EditJackClient) | clicked → addData |
| edit_edit_button | QPushButton | &Edit | Edytuje klienta JACK | clicked → editData |
| edit_delete_button | QPushButton | &Delete | Usuwa klienta JACK po potwierdzeniu | clicked → deleteData |
| edit_ok_button | QPushButton | &OK | Zapisuje do DB i zamyka (default) | clicked → okData |
| edit_cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | clicked → cancelData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Start JACK unchecked | checkbox off | JACK Command Line disabled | command_line disabled |
| Start JACK checked | checkbox on | JACK Command Line enabled | - |
| Pusta lista klientów | brak JACK_CLIENTS | Lista pusta, Add/Edit/Delete aktywne | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Delete client | Potwierdzenie Yes/No | "Are you sure you want to delete JACK Client \"{name}\"?" | Delete click | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | JACK Settings button | station_station (RDStation*) |
| EditJack → EditJackClient | Add/Edit/Double-click | &desc, &cmd (in/out params) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Rozmiar | ~450x352 | sizeHint 450x352, resizable | Zgodne |
| Server Name | Puste pole | Default "default" jeśli puste | Zgodne |
