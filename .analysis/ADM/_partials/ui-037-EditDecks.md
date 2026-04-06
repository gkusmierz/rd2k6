---
partial_id: "037"
artifact: ADM
window_name: "Configure RDCatch"
class_name: EditDecks
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.configure_rdcatch_dialog.png
mockup: mockups/EditDecks.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Configure RDCatch

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditDecks |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Configure RDCatch |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_decks.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdcatch_dialog.png |
| Mockup HTML | ✅ | mockups/EditDecks.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | caller | tak |
| cae_station | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_record_deck_box | QComboBox | Record Deck | Wybór decku nagrywającego 1-MAX_DECKS | activated → recordDeckActivatedData |
| edit_record_selector | RDCardSelector | Card/Port | Wybór karty/portu nagrywania | cardChanged → recordCardChangedData |
| edit_monitor_box | QSpinBox | Monitor Port: | -1(None)..MAX_PORTS-1 | valueChanged → monitorPortChangedData |
| edit_default_on_box | QComboBox | Monitor defaults to | Off/On | - |
| edit_format_box | QComboBox | Format: | PCM16/PCM24/MPEG Layer 2 | activated → formatActivatedData |
| edit_bitrate_box | QComboBox | Bit Rate: | 32-192 kbps/chan (10 opcji) | - |
| edit_swstation_box | QComboBox | Switcher Host: | [none] + STATIONS | activated → stationActivatedData |
| edit_swmatrix_box | QComboBox | Switcher Matrix: | Aktywne macierze wyjść | activated → matrixActivatedData |
| edit_swoutput_box | QComboBox | Switcher Output: | Wyjścia macierzy | - |
| edit_swdelay_box | QSpinBox | Switcher Delay: | 0-20 (1/10 sec) | - |
| edit_channels_box | QComboBox | Channels: | 1/2 | - |
| edit_threshold_box | QSpinBox | Trim Threshold: | -100..0 dB | - |
| edit_errorrml_edit | QLineEdit | Error RML: | RML komenda błędu (host-wide) | - |
| edit_play_deck_box | QComboBox | Play Deck | Wybór decku odtwarzającego | activated → playDeckActivatedData |
| edit_play_selector | RDCardSelector | Card/Port | Karta/port odtwarzania | settingsChanged → playSettingsChangedData |
| edit_event_edits[0..15] | QLineEdit | 1:-16: | Numery cartów zdarzeń | - |
| edit_event_buttons[0..15] | QPushButton | Select | Wybór carta zdarzenia | clicked → eventCartSelectedData (via mapper) |
| close_button | QPushButton | &Close | Zapisuje i zamyka (default) | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| CAE nie przeskanowane | !scanned | Info msg, record/play/monitor selectors disabled | Selectors disabled |
| Format != MPEG | format != 2 | Bit Rate disabled | bitrate disabled |
| Format == MPEG | format == 2 | Bit Rate enabled | - |
| Switcher = none | "[none]" selected | Matrix/Output/Delay disabled | All disabled |
| Switcher selected | host selected | Matrix/Output/Delay enabled | - |
| Matrix empty | no matrix text | Output/Delay disabled | - |
| Monitor port = None (-1) | -1 | "Monitor defaults to" disabled | default_on disabled |
| Play card/port unset | card<0 or port<0 | Event Carts section disabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | Auto-save on deck switch | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | RDCatch button | station_station, station_cae_station |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Switcher Delay | Widoczny na screenshot | Hidden w kodzie (hide()) | Ukryty domyślnie, pojawia się gdy aktywny |
| Layout | 2 kolumny (Record/Play) | Zgodne | - |
