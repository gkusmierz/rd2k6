---
partial_id: "035"
artifact: ADM
window_name: "Host"
class_name: EditStation
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.host_dialog.png
mockup: mockups/EditStation.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Host Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditStation |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Host: {sname} |
| Modalność | modal |
| Rodzic | ListStations / AddStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_station.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.host_dialog.png |
| Mockup HTML | ✅ | mockups/EditStation.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| sname | QString | caller (station name) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| station_name_edit | QLineEdit (readOnly) | Ho&st Name: | Wyświetla nazwę stacji | - |
| station_short_name_edit | QLineEdit | Short Name: | Krótka nazwa, max 64 | - |
| station_description_edit | QLineEdit | &Description: | Opis, max 64, RDTextValidator | - |
| station_default_name_edit | QComboBox | Default &User: | Lista użytkowników z USERS.LOGIN_NAME | - |
| station_address_edit | QLineEdit | &IP Address: | Adres IP stacji, max 15 | - |
| station_audio_editor_edit | QLineEdit | Audio Editor: | Ścieżka do edytora audio, max 191 | - |
| station_report_editor_edit | QLineEdit | Report Editor: | Ścieżka do edytora raportów, max 191 | - |
| station_web_browser_edit | QLineEdit | Web Browser: | Ścieżka przeglądarki, max 191 | - |
| station_ssh_identity_file_edit | QLineEdit | SSH Ident. File: | Ścieżka klucza SSH, max 191 | - |
| station_timeoffset_box | QSpinBox | &Time Offset: | Offset czasu w mS, range -MAX..+MAX | - |
| station_startup_cart_edit | QLineEdit | &Startup Cart: | Numer cart startowego, walidator 1-MAX_CART | - |
| station_startup_select_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → selectClicked |
| station_cue_sel | RDCardSelector | Cue &Output: | Wybór karty/portu wyjścia cue | - |
| station_start_cart_edit | QLineEdit | Start Cart: | Cart startu cue, macro validator | - |
| station_start_cart_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → startCartClickedData |
| station_stop_cart_edit | QLineEdit | Stop Cart: | Cart stopu cue, macro validator | - |
| station_stop_cart_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → stopCartClickedData |
| station_heartbeat_box | QCheckBox | Enable Heartbeat | Włącza heartbeat | toggled → heartbeatToggledData |
| station_filter_box | QCheckBox | Use Realtime Filtering | Filtrowanie synchroniczne | - |
| station_hbcart_edit | QLineEdit | Cart: | Numer cart heartbeat | - |
| station_hbcart_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → heartbeatClickedData |
| station_hbinterval_spin | QSpinBox | Interval: | 1-300 secs | - |
| station_maint_box | QCheckBox | Include in System Maintenance Pool | System maintenance | - |
| station_dragdrop_box | QCheckBox | Enable Drag & Drop | Drag & drop | toggled → enables panel_enforce |
| station_panel_enforce_box | QCheckBox | Allow Drops on Panels not in Setup Mode | Setup mode enforcement | - |
| station_http_station_box | QComboBox | HTTP Xport: | HTTP service host (localhost + STATIONS) | - |
| station_cae_station_box | QComboBox | Core Audio Engine: | CAE service host | activated → caeStationActivatedData |
| station_rdlibrary_button | QPushButton | RD&Library | Otwiera EditRDLibrary | clicked → editLibraryData |
| station_rdcatch_button | QPushButton | RDCatch | Otwiera EditDecks | clicked → editDeckData |
| station_rdairplay_button | QPushButton | RDAirPlay | Otwiera EditRDAirPlay | clicked → editAirPlayData |
| station_rdpanel_button | QPushButton | RDPanel | Otwiera EditRDPanel | clicked → editPanelData |
| station_rdlogedit_button | QPushButton | RDLogEdit | Otwiera EditRDLogedit | clicked → editLogEditData |
| station_rdcartslots_button | QPushButton | RDCart\nSlots | Otwiera EditCartSlots | clicked → editCartSlotsData |
| station_dropboxes_button | QPushButton | Dropboxes | Otwiera ListDropboxes | clicked → editDropboxesData |
| station_switchers_button | QPushButton | Switchers\nGPIO | Otwiera ListMatrices | clicked → editSwitcherData |
| station_hostvars_button | QPushButton | Host\nVariables | Otwiera ListHostvars | clicked → editHostvarsData |
| station_audioports_button | QPushButton | ASI Audio\nPorts | Otwiera EditAudioPorts | clicked → editAudioData |
| station_ttys_button | QPushButton | Serial\nPorts | Otwiera EditTtys | clicked → editTtyData |
| station_adapters_button | QPushButton | Audio\nResources | Otwiera ViewAdapters | clicked → viewAdaptersData |
| station_jack_button | QPushButton | JACK\nSettings | Otwiera EditJack | clicked → jackSettingsData |
| station_pypad_button | QPushButton | PyPAD\nInstances | Otwiera ListPypads | clicked → pypadInstancesData |
| station_ok_button | QPushButton | &OK | Zapisuje ustawienia (default) | clicked → okData |
| station_cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | clicked → cancelData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| CAE nie przeskanowane | station not scanned | Info message, Cue Output disabled | station_cue_sel disabled |
| Heartbeat off | checkbox unchecked | Cart, Interval, Select disabled | hbcart/interval/button disabled |
| Heartbeat on | checkbox checked | Cart, Interval, Select enabled | - |
| Drag&Drop off | checkbox unchecked | Panel enforce disabled | panel_enforce_box/label disabled |
| Drag&Drop on | checkbox checked | Panel enforce enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| station_maint_box | Min 1 stacja w maintenance pool | "At least one host must belong to the system maintenance pool!" | OK, unchecked, no others | QMessageBox::warning |
| station_address_edit | Valid IP address | "The specified IP address is invalid!" | OK click | QMessageBox::warning |
| station_hbcart_edit | Cart > 0 && <= 999999 | "The Heartbeat Cart number is invalid!" | OK + heartbeat on | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListStations | Edit button / Double-click | station name (QString) |
| AddStation | Auto po create | station name (QString) |
| EditStation → EditRDLibrary | RDLibrary button | station_station, station_cae_station |
| EditStation → EditDecks | RDCatch button | station_station, station_cae_station |
| EditStation → EditRDAirPlay | RDAirPlay button | station_station, station_cae_station |
| EditStation → EditRDPanel | RDPanel button | station_station, station_cae_station |
| EditStation → EditRDLogedit | RDLogEdit button | station_station, station_cae_station |
| EditStation → EditCartSlots | RDCartSlots button | station_station, station_cae_station |
| EditStation → ListDropboxes | Dropboxes button | station name |
| EditStation → ListMatrices | Switchers button | station name |
| EditStation → ListHostvars | Host Variables button | station name |
| EditStation → EditAudioPorts | Audio Ports button | station name |
| EditStation → EditTtys | Serial Ports button | station name |
| EditStation → ViewAdapters | Audio Resources button | station_station (RDStation*) |
| EditStation → EditJack | JACK Settings button | station_station (RDStation*) |
| EditStation → ListPypads | PyPAD Instances button | station_station (RDStation*) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Screenshot mały | Niskiej rozdzielczości miniaturka | sizeHint 415x765 | Zgodna proporcja |
| System Services groupbox | Widoczny na screenshot | station_systemservices_groupbox | Zgodne |
