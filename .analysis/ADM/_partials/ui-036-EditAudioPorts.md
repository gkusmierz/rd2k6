---
partial_id: "036"
artifact: ADM
window_name: "Edit AudioScience Audio Ports"
class_name: EditAudioPorts
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_audio_ports_dialog.png
mockup: mockups/EditAudioPorts.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit AudioScience Audio Ports

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditAudioPorts |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit AudioScience Audio Ports |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_audios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_audio_ports_dialog.png |
| Mockup HTML | ✅ | mockups/EditAudioPorts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | caller (station name) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_card_box | QComboBox | Card: | Wybór karty 0-7 | activated → cardSelectedData |
| card_driver_edit | QLineEdit (readOnly) | Card Driver: | Wyświetla typ sterownika | - |
| edit_clock_box | QComboBox | Clock Source: | Internal/AES-EBU/SP-DIFF/Word Clock | - |
| edit_type_box[0..7] | QComboBox | Type: | Analog/AES-EBU/SP-DIFF per input port | activated → inputMapData (via mapper) |
| edit_mode_box[0..7] | QComboBox | Mode: | Normal/Swap/Left only/Right only per input port | activated → inputMapData (via mapper) |
| edit_input_box[0..7] | QSpinBox | Ref. Level: | -26..6 dB per input port | - |
| edit_output_box[0..7] | QSpinBox | Ref. Level: | -26..6 dB per output port | - |
| help_button | QPushButton | &Help | Otwiera HelpAudioPorts dialog | clicked → helpData |
| close_button | QPushButton | &Close | Zapisuje bieżącą kartę i zamyka | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| HPI driver | cardDriver==Hpi | Wszystkie kontrolki aktywne | - |
| JACK driver | cardDriver==Jack | Type, Ref.Level (input/output) disabled; Mode enabled | Clock disabled |
| ALSA driver | cardDriver==Alsa | Type, Mode, Ref.Level all disabled | Clock disabled |
| No driver | cardDriver==None | Wszystkie kontrolki disabled | Clock disabled |
| Analog input (HPI) | Type=Analog && HPI | Input Ref.Level enabled | - |
| Digital input (HPI) | Type!=Analog && HPI | Input Ref.Level disabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak walidacji formularza) | - | - | - | Auto-save on card switch and close |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | ASI Audio Ports button | station name (QString) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Edit Audio Ports" | "Edit AudioScience Audio Ports" | Screenshot krótszy |
| Porty 0-7 | 2 rzędy po 4 | Zgodne (j*4+i layout) | Układ grid 2x4 |
