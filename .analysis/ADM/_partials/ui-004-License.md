---
partial_id: "004"
artifact: ADM
window_name: "Rivendell Credits / GNU Public License v2"
class_name: License
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/License.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: License / Credits Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | License |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "Rivendell Credits" lub "GNU Public License v2" (zależy od trybu) |
| Modalność | modal (exec()) |
| Rodzic | InfoDialog |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/license.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/License.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| lic | License::Text (enum: Credits, GplV2) | exec() argument | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| license_edit | QTextEdit | (treść licencji/credits) | read-only text display | - |
| close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

## Layout (resizable)
Window size: 600 x 400 (minimum, resizable via resizeEvent).

| Widget | Opis |
|--------|------|
| license_edit | Fills most of the window |
| close_button | Bottom area |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Credits | exec(License::Credits) | PlainText credits, tytuł "Rivendell Credits" | - |
| GPL v2 | exec(License::GplV2) | RichText GPL license, tytuł "GNU Public License v2" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| InfoDialog (credits_button) | viewCreditsData() → License::Credits | License::Text enum |
| InfoDialog (license_button) | viewLicenseData() → License::GplV2 | License::Text enum |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |
