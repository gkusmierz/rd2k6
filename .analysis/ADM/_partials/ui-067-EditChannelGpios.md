---
partial_id: "067"
artifact: ADM
window_name: "Edit Channel GPIOs"
class_name: EditChannelGpios
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_channel_gpios_dialog.png
mockup: mockups/EditChannelGpios.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Channel GPIOs

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditChannelGpios |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Channel GPIOs |
| Modalność | modal |
| Rodzic | EditAudioPorts |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_channelgpios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_channel_gpios_dialog.png |
| Mockup HTML | ✅ | mockups/EditChannelGpios.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| conf | RDAirPlayConf* | EditAudioPorts | tak |
| chan | RDAirPlayConf::Channel | EditAudioPorts (enum kanału) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_title_label | QLabel | (dynamicznie: channelText(chan)) | tytuł kanału | - |
| edit_start_gpi_matrix_spin | QSpinBox | Start GPI: (matrix) | matryca start GPI (-1..MAX_MATRICES, -1=None) | startMatrixGpiChangedData() |
| edit_start_gpi_line_spin | QSpinBox | (line) | linia start GPI (1..MAX_GPIO_PINS) | - |
| edit_start_gpo_matrix_spin | QSpinBox | Start GPO: (matrix) | matryca start GPO (-1..MAX_MATRICES, -1=None) | startMatrixGpoChangedData() |
| edit_start_gpo_line_spin | QSpinBox | (line) | linia start GPO (1..MAX_GPIO_PINS) | - |
| edit_stop_gpi_matrix_spin | QSpinBox | Stop GPI: (matrix) | matryca stop GPI (-1..MAX_MATRICES, -1=None) | stopMatrixGpiChangedData() |
| edit_stop_gpi_line_spin | QSpinBox | (line) | linia stop GPI (1..MAX_GPIO_PINS) | - |
| edit_stop_gpo_matrix_spin | QSpinBox | Stop GPO: (matrix) | matryca stop GPO (-1..MAX_MATRICES, -1=None) | stopMatrixGpoChangedData() |
| edit_stop_gpo_line_spin | QSpinBox | (line) | linia stop GPO (1..MAX_GPIO_PINS) | - |
| edit_gpio_type_box | QComboBox | Signalling Type: | Edge / Level | - |
| edit_ok_button | QPushButton | OK | zapisuje i zamyka | okData() |
| edit_cancel_button | QPushButton | Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| SoundPanel / Cue channel | chan == SoundPanel1..5 lub Cue | Start GPI label + oba spiny disabled | Start GPI disabled |
| Matrix = None (-1) | matrix spin = -1 | Line spin disabled | Line spin disabled |
| Matrix >= 0 | matrix spin >= 0 | Line spin enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - wartości zawsze w zakresie spinboxów |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditAudioPorts | Otwiera EditChannelGpios | RDAirPlayConf*, Channel |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Main Log Output 1" | Dynamicznie z channelText(chan) | Zgadza się - screenshot pokazuje konkretny kanał |
| Layout | 4 wiersze GPI/GPO + Signalling Type + OK/Cancel | Zgadza się z kodem | Zgodność pełna |
