---
partial_id: "046"
artifact: ADM
window_name: "Configure RDPanel"
class_name: EditRDPanel
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.configure_rdpanel_dialog.png
mockup: mockups/EditRDPanel.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Configure RDPanel

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDPanel |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDPanel" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 630x496 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdpanel.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdpanel_dialog.png |
| Mockup HTML | ✅ | mockups/EditRDPanel.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Channel Assignments (lewa strona)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_card_sel[0] | RDCardSelector | SoundPanel First Play Output | Wybór karty/portu | - |
| air_start_rml_edit[0] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[0] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[1] | RDCardSelector | SoundPanel Second Play Output | Wybór karty/portu | - |
| air_start_rml_edit[1] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[1] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[2] | RDCardSelector | SoundPanel Third Play Output | Wybór karty/portu | - |
| air_start_rml_edit[2] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[2] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[3] | RDCardSelector | SoundPanel Fourth Play Output | Wybór karty/portu | - |
| air_start_rml_edit[3] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[3] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[4] | RDCardSelector | SoundPanel Fifth and Later Play Output | Wybór karty/portu | - |
| air_start_rml_edit[4] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[4] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[5] | RDCardSelector | SoundPanel Cue Output | Wybór karty/portu | - |
| air_start_rml_edit[5] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[5] | QLineEdit | Stop RML: | Komenda RML | - |

### Sekcja: Display Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_skin_edit | QLineEdit | Background Image: | ścieżka do pliku | - |
| (button) | QPushButton | "Select" | QFileDialog | selectSkinData() |

### Sekcja: Sound Panel Settings (prawa strona)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_station_box | QSpinBox | Host Panels: | 0-MAX_PANELS, "None" | - |
| air_user_box | QSpinBox | User Panels: | 0-MAX_PANELS, "None" | - |
| air_flash_box | QCheckBox | Flash Active Buttons | toggle | - |
| air_panel_pause_box | QCheckBox | Enable Button Pausing | toggle | - |
| air_clearfilter_box | QCheckBox | Clear Cart Search Filter | toggle | - |
| air_defaultsvc_box | QComboBox | Default Service: | "[none]" + serwisy z DB | - |
| air_label_template_edit | QLineEdit | Label Template: | szablon etykiety | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (ok) | QPushButton | "&OK" | Zapisuje konfigurację | okData() |
| (cancel) | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | station->scanned() == false | QMessageBox info | Wszystkie air_card_sel[0-5] disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| air_start_rml_edit[*] | RDTextValidator | (inline) | real-time | validator |
| air_stop_rml_edit[*] | RDTextValidator | (inline) | real-time | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDPanel" | station, cae_station |
| EditRDPanel | "Select" (skin) button | -> QFileDialog |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |
