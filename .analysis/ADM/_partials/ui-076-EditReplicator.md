---
partial_id: "076"
artifact: ADM
window_name: "Replicator: {name}"
class_name: EditReplicator
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.replicator_dialog.png
mockup: mockups/EditReplicator.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Replicator Editor

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditReplicator |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Replicator: {repl_name} |
| Modalność | modal |
| Rodzic | ListReplicators / AddReplicator |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_replicator.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.replicator_dialog.png |
| Mockup HTML | ✅ | mockups/EditReplicator.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| repl_name | const QString& | Nazwa replikatora z listy | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| repl_name_edit | QLineEdit | Name: | Wyświetla nazwę (readOnly, max 32) | - |
| repl_description_edit | QLineEdit | Description: | Opis replikatora (max 64) | - |
| repl_type_box | QComboBox | Type: | Wybór typu replikatora (RDReplicator::Type enum) | - |
| repl_station_box | QComboBox | Host System: | Wybór stacji z DB STATIONS | - |
| repl_url_edit | QLineEdit | Audio Upload URL: | URL do uploadu audio (max 255) | - |
| repl_username_edit | QLineEdit | Username: | Nazwa użytkownika (max 64) | - |
| repl_password_edit | QLineEdit | Password: | Hasło (echoMode=Password, max 64) | - |
| repl_format_edit | QLineEdit | Upload Format: | Opis formatu audio (readOnly) | - |
| repl_format_button | QPushButton | S&et | Otwiera RDExportSettingsDialog | setFormatData() |
| repl_normalize_box | QCheckBox | Normalize | Włącza/wyłącza normalizację | normalizeCheckData() |
| repl_normalize_spin | QSpinBox | Level: | Poziom normalizacji (-30 do -1 dBFS) | - |
| repl_groups_sel | RDListSelector | Available Groups / Active Groups | Przypisanie grup do replikatora | - |
| ok_button | QPushButton | &OK | Zapisuje zmiany (default) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Normalize ON | repl_normalize_box checked | Level spin + dBFS label aktywne | - |
| Normalize OFF | repl_normalize_box unchecked | Level spin + dBFS label disabled | repl_normalize_label, repl_normalize_spin, repl_normalize_unit_label disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak jawnych walidacji) | - | - | - | okData() zapisuje bez sprawdzeń |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReplicators | Edit / double-click | QString repl_name |
| AddReplicator | Po INSERT do DB | QString repl_name_edit->text() |
| EditReplicator → RDExportSettingsDialog | Przycisk Set | RDSettings* repl_settings |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Zgodność | Pełna | Pełna | Screenshot dokładnie odpowiada kodowi |
