---
partial_id: "038"
artifact: ADM
window_name: "Edit CartSlots"
class_name: EditCartSlots
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.configure_rdcartslots_dialog.png
mockup: mockups/EditCartSlots.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit CartSlots

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditCartSlots |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit CartSlots |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_cartslots.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdcartslots_dialog.png |
| Mockup HTML | ✅ | mockups/EditCartSlots.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | caller | tak |
| cae_station | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_slot_columns_spin | QSpinBox | Slot Columns: | 1-MAX_COLUMNS | valueChanged → quantityChangedData |
| edit_slot_rows_spin | QSpinBox | Slot Rows: | 1-MAX_ROWS | valueChanged → quantityChangedData |
| edit_slot_box | QComboBox | Slot | Wybór slotu (dynamiczna lista cols*rows) | activated → slotChangedData |
| edit_card_spin | QSpinBox | Card: | -1(None)..cards-1 | valueChanged → cardChangedData |
| edit_input_spin | QSpinBox | Input Port: | -1(None)..MAX_PORTS-1 | - |
| edit_output_spin | QSpinBox | Output Port: | -1(None)..MAX_PORTS-1 | - |
| edit_service_box | QComboBox | Service: | Lista SERVICES.NAME z DB | - |
| edit_mode_box | QComboBox | Slot Mode: | User previous + SlotOptions modes | activated → modeData |
| edit_play_mode_box | QComboBox | Play Mode: | Use previous/Full/Hook | - |
| edit_cartaction_box | QComboBox | At Startup: | Use previous cart/Do Nothing/Load Specified Cart | activated → cartActionData |
| edit_cart_edit | QLineEdit (readOnly) | Cart: | Numer wybranego carta | - |
| edit_cart_button | QPushButton | Select | Otwiera RDCartDialog | clicked → cartSelectData |
| edit_stop_action_box | QComboBox | At Playout End: | Use previous action + StopAction options | - |
| button (close) | QPushButton | Close | Zapisuje i zamyka | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Card = None (-1) | card < 0 | Input/Output port disabled, set to None | Input/Output disabled |
| Mode != Breakaway | mode != BreakawayMode | Play Mode, At Startup, At Playout End disabled | Multiple disabled |
| Mode = Breakaway | mode == BreakawayMode | Play Mode, At Startup, At Playout End enabled | - |
| At Startup != Load Specified | action != 2 | Cart + Select disabled | Cart disabled |
| At Startup = Load Specified | action == 2 | Cart + Select enabled | - |
| Slot count changed | cols*rows zmienione | Info "Slot selected has changed!" jeśli slot > new max | QMessageBox::information |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak walidacji) | - | - | Auto-save on slot switch/close | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | RDCartSlots button | station_station, station_cae_station |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Rozmiar | ~300x455 | sizeHint 300x455 | Zgodne |
| Sekcje | Global/Slot/Channel/Default | Zgodne | - |
