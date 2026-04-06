---
partial_id: "009"
artifact: ADM
window_name: "RDAdmin - Add Scheduler Code"
class_name: AddSchedCode
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddSchedCode.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add Scheduler Code Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddSchedCode |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Add Scheduler Code" |
| Modalność | modal (setModal(true)) |
| Rodzic | ListSchedCodes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_schedcodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddSchedCode.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| schedCode | QString* | output pointer | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| schedcode_name_edit | QLineEdit | "&New Code:" (max 10 chars) | Wpisanie kodu | - |
| ok_button | QPushButton | "&OK" (default) | Waliduje i tworzy kod | okData() |
| cancel_button | QPushButton | "&Cancel" | Anuluje | cancelData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| label | 10, 11, 90, 19 |
| schedcode_name_edit | 105, 11, 100, 19 |
| ok_button | 70, 60, 80, 50 |
| cancel_button | 160, 60, 80, 50 |

Window size: 250 x 120 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Puste pole kodu | - |
| error_empty | Puste pole, klik OK | QMessageBox "Invalid Name!" | - |
| error_exists | Kod już istnieje w DB | QMessageBox "Code Already Exists!" | - |
| success | Kod utworzony | Otwiera EditSchedCode do dodania opisu, potem zamyka | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| schedcode_name_edit | Nie może być puste | "Invalid Name!" | okData() | QMessageBox::warning |
| schedcode_name_edit | Nie może zawierać spacji | (validator blocks input) | inline | RDTextValidator + bannedChar(' ') |
| schedcode_name_edit | Max 10 znaków | (blocked by maxLength) | inline | setMaxLength(10) |
| schedcode_name_edit | Unikalny w DB | "Code Already Exists!" | okData() SQL insert | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSchedCodes | addData() → new AddSchedCode(&schedCode, this)->exec() | &schedCode output |
| okData() | Opens EditSchedCode(code, "") for description | code, empty description |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |
