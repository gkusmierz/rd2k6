---
partial_id: "053"
artifact: ADM
window_name: "Edit Switcher"
class_name: EditMatrix
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_switcher_dialog.png
mockup: mockups/EditMatrix.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Switcher

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditMatrix |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Switcher |
| Modalność | modal |
| Rodzic | ListMatrices |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_matrix.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_switcher_dialog.png |
| Mockup HTML | ✅ | mockups/EditMatrix.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | ListMatrices | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (label) | QLabel | Matrix Number: | Wyświetla numer matrycy (readonly) | - |
| (label) | QLabel | Switcher Type: | Wyświetla typ switchera (readonly) | - |
| edit_name_edit | QLineEdit | Description: | Nazwa switchera | - |
| edit_porttype_box | QComboBox | Type: (Primary) | Serial/TCP-IP/None | portTypeActivatedData() |
| edit_port_box | QComboBox | Serial Port: (Primary) | Lista portów serialnych | - |
| edit_ipaddress_edit | QLineEdit | IP Address: (Primary) | Adres IP primary | - |
| edit_ipport_spin | QSpinBox | IP Port: (Primary) | Port IP (0-65535) | - |
| edit_username_edit | QLineEdit | Username: (Primary) | Login primary | - |
| edit_password_edit | QLineEdit | Password: (Primary) | Hasło primary (EchoMode::Password) | - |
| edit_start_cart_edit | QLineEdit | Startup Cart: (Primary) | Numer cart startowego | - |
| edit_start_cart_button | QPushButton | Select (Primary Start) | Otwiera RDCartDialog | startCartData() |
| edit_stop_cart_edit | QLineEdit | Shutdown Cart: (Primary) | Numer cart zamykającego | - |
| edit_stop_cart_button | QPushButton | Select (Primary Stop) | Otwiera RDCartDialog | stopCartData() |
| edit_porttype2_box | QComboBox | Type: (Backup) | Serial/TCP-IP/None | portType2ActivatedData() |
| edit_port2_box | QComboBox | Serial Port: (Backup) | Lista portów serialnych backup | - |
| edit_ipaddress2_edit | QLineEdit | IP Address: (Backup) | Adres IP backup | - |
| edit_ipport2_spin | QSpinBox | IP Port: (Backup) | Port IP backup | - |
| edit_username2_edit | QLineEdit | Username: (Backup) | Login backup | - |
| edit_password2_edit | QLineEdit | Password: (Backup) | Hasło backup (EchoMode::Password) | - |
| edit_start_cart2_edit | QLineEdit | Startup Cart: (Backup) | Cart startowy backup | - |
| edit_start_cart2_button | QPushButton | Select (Backup Start) | Otwiera RDCartDialog | startCart2Data() |
| edit_stop_cart2_edit | QLineEdit | Shutdown Cart: (Backup) | Cart zamykający backup | - |
| edit_stop_cart2_button | QPushButton | Select (Backup Stop) | Otwiera RDCartDialog | stopCart2Data() |
| edit_card_box | QSpinBox | Card: | Numer karty (0-9999) | - |
| edit_inputs_box | QSpinBox | Inputs: | Liczba wejść (0-MAX_ENDPOINTS) | inputsChangedData() |
| edit_outputs_box | QSpinBox | Outputs: | Liczba wyjść (0-MAX_ENDPOINTS) | - |
| edit_device_edit | QLineEdit | Device: | Urządzenie GPIO | - |
| edit_gpis_box | QSpinBox | GPIs: | Liczba GPI (0-MAX_GPIO_PINS) | gpisChangedData() |
| edit_gpos_box | QSpinBox | GPOs: | Liczba GPO (0-MAX_GPIO_PINS) | gposChangedData() |
| edit_layer_box | QComboBox | Layer: | V,A-O | - |
| edit_displays_box | QSpinBox | Displays: | Liczba wyświetlaczy (0-1024) | - |
| edit_inputs_button | QPushButton | Configure Inputs | Otwiera ListEndpoints(Input) | inputsButtonData() |
| edit_outputs_button | QPushButton | Configure Outputs | Otwiera ListEndpoints(Output) | outputsButtonData() |
| edit_gpis_button | QPushButton | Configure GPIs | Otwiera ListGpis(GpioInput) | gpisButtonData() |
| edit_gpos_button | QPushButton | Configure GPOs | Otwiera ListGpis(GpioOutput) | gposButtonData() |
| edit_livewire_button | QPushButton | LiveWire Nodes | Otwiera ListNodes | livewireButtonData() |
| edit_livewire_gpio_button | QPushButton | LiveWire GPIOs | Otwiera ListLiveWireGpios | livewireGpioButtonData() |
| edit_vguestrelays_button | QPushButton | vGuest Switches | Otwiera ListVguestResources(Relay) | vguestRelaysButtonData() |
| edit_vguestdisplays_button | QPushButton | vGuest Displays | Otwiera ListVguestResources(Display) | vguestDisplaysButtonData() |
| edit_sasresources_button | QPushButton | SAS Switches | Otwiera ListSasResources | sasResourcesButtonData() |
| ok_button | QPushButton | &OK | WriteMatrix() -> done(0) | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Primary=Serial | portType=TtyPort | Serial Port enabled, IP disabled, carts disabled | IP/cart fields disabled |
| Primary=TCP/IP | portType=TcpPort | IP/Port enabled, Serial disabled | Serial port disabled |
| Primary=None | portType=NoPort | Wszystkie primary connection disabled | Wszystkie primary disabled |
| Backup=Serial | portType2=TtyPort | Backup serial enabled, IP disabled | Backup IP disabled |
| Backup=TCP/IP | portType2=TcpPort | Backup IP enabled, serial disabled | Backup serial disabled |
| Backup=None | portType2=NoPort | Wszystkie backup disabled | Wszystkie backup disabled |
| Type-dependent | RDMatrix::controlActive() | Widgety enabled/disabled wg typu switchera | Dynamicznie per matrix type |
| GPI/GPO linked | GpioInputsLinkedControl | Zmiana Inputs zmienia GPIs/GPOs | Linked spinboxes |
| Inputs=0 | inputs_box=0 | Configure Inputs disabled | edit_inputs_button disabled |
| GPIs=0 | gpis_box=0 | Configure GPIs disabled | edit_gpis_button disabled |
| GPOs=0 | gpos_box=0 | Configure GPOs disabled | edit_gpos_button disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Primary IP | Poprawny adres IP | "The primary IP address is invalid!" | OK + TCP/IP type | QMessageBox::warning |
| Backup IP | Poprawny adres IP | "The backup IP address is invalid!" | OK + Backup TCP/IP | QMessageBox::warning |
| Primary Serial | Port musi być aktywny | "The primary serial device is not active!" | OK + Serial type | QMessageBox::information |
| Backup Serial | Port musi być aktywny | "The backup serial device is not active!" | OK + Backup Serial | QMessageBox::information |
| Duplikat połączeń | Primary != Backup (IP+port lub serial) | "The primary and backup connections must be different!" | OK | QMessageBox::warning |
| Description | RDTextValidator | - | Inline validation | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListMatrices | editData()/addData() -> exec() | RDMatrix* |
| EditMatrix -> ListEndpoints | inputsButtonData()/outputsButtonData() | RDMatrix*, Input/Output |
| EditMatrix -> ListGpis | gpisButtonData()/gposButtonData() | RDMatrix*, GpioInput/GpioOutput |
| EditMatrix -> ListNodes | livewireButtonData() | RDMatrix* |
| EditMatrix -> ListLiveWireGpios | livewireGpioButtonData() | RDMatrix*, bundle_count |
| EditMatrix -> ListVguestResources | vguestRelaysButtonData()/vguestDisplaysButtonData() | RDMatrix*, VguestType, size |
| EditMatrix -> ListSasResources | sasResourcesButtonData() | RDMatrix*, displays_count |
| EditMatrix -> RDCartDialog | startCartData()/stopCartData()/startCart2Data()/stopCart2Data() | cart number |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Screenshot jest mały | Trudno odczytać szczegóły | Pełna struktura z kodem | Screenshot w niskiej rozdzielczości |
| Sekcje | Primary/Backup Connection widoczne | Grouped by drawn lines (paintEvent) | Zgodne |
