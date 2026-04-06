---
partial_id: "010"
artifact: ADM
window_name: "RDAdmin - Scheduler Code: {code}"
class_name: EditSchedCode
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.scheduler_code_dialog.png
mockup: mockups/EditSchedCode.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Scheduler Code Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSchedCode |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Scheduler Code: {code}" |
| Modalność | modal (setModal(true)) |
| Rodzic | ListSchedCodes / AddSchedCode |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_schedcodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.scheduler_code_dialog.png |
| Mockup HTML | ✅ | mockups/EditSchedCode.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| schedcode | QString | from ListSchedCodes/AddSchedCode | tak |
| description | QString | from ListSchedCodes/AddSchedCode | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| schedcode_name_edit | QLineEdit | "Scheduler Code:" (readOnly, max 10) | Display only | - |
| schedcode_description_edit | QLineEdit | "Code Description:" (max 255) | Edycja opisu | - |
| ok_button | QPushButton | "&OK" (default) | Zapisuje opis do DB | okData() |
| cancel_button | QPushButton | "&Cancel" | Anuluje | cancelData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| schedcode_name_label | 10, 11, 110, 19 |
| schedcode_name_edit | 125, 11, 100, 19 |
| schedcode_description_label | 10, 32, 110, 19 |
| schedcode_description_edit | 125, 32, 265, 19 |
| ok_button | 220, 80, 80, 50 |
| cancel_button | 310, 80, 80, 50 |

Window size: 400 x 140 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Kod (readonly) + opis do edycji | schedcode_name_edit readonly |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| schedcode_description_edit | RDTextValidator | (inline) | typing | validator |
| schedcode_description_edit | Max 255 znaków | (blocked by maxLength) | inline | setMaxLength(255) |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSchedCodes | editData() → EditSchedCode(code, description)->exec() | code, description |
| AddSchedCode | okData() → EditSchedCode(code, "")->exec() | code, empty description |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Title | "Scheduler Code: WCR-E" | "RDAdmin - Scheduler Code: WCR-E" | Screenshot pomija "RDAdmin -" prefix |
| Layout | Zgodne z kodem | Zgodne | OK |
