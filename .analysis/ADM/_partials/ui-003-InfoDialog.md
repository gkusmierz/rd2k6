---
partial_id: "003"
artifact: ADM
window_name: "RDAdmin - System Information"
class_name: InfoDialog
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/InfoDialog.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: System Information Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | InfoDialog |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - System Information" |
| Modalność | modal (exec()) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/info_dialog.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/InfoDialog.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| banner1 (label) | QLabel + QPixmap | banner image (460x35) | display only | - |
| banner2 (label) | QLabel + QPixmap | banner image (460x35) | display only | - |
| title_label | QLabel | "Rivendell" | display only (24pt DemiBold) | - |
| slogan_label | QLabel | "A Radio Automation System" | display only (14pt) | - |
| version_label | QLabel | "Version {VERSION}" | display only | - |
| schema_label | QLabel | "Database Schema {N}" | display only | - |
| copyright_label | QLabel | RD_COPYRIGHT_NOTICE | display only | - |
| disclaimer_label | QLabel | GPL disclaimer text | display only (word wrap) | - |
| credits_button | QPushButton | "View\n&Credits" | Opens License (Credits) | viewCreditsData() |
| license_button | QPushButton | "View\n&License" | Opens License (GplV2) | viewLicenseData() |
| close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| banner1 | 0, 0, 460, 35 |
| title_label | 10, 41, 120, 36 |
| slogan_label | 130, 52, 200, 18 |
| version_label | 10, 73, 200, 14 |
| schema_label | 210, 73, 240, 14 |
| copyright_label | 10, 87, 440, 14 |
| disclaimer_label | 10, 104, 440, 60 |
| credits_button | 85, 174, 80, 50 |
| license_button | 185, 174, 80, 50 |
| close_button | 370, 220, 80, 50 |
| banner2 | 0, 275, 460, 35 |

Window size: 460 x 310 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Zawsze | Informacje o systemie, wersja, licencja | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | systemInfoData() → new InfoDialog(this)->exec() | brak |
| credits_button | viewCreditsData() → License(Credits) | License::Credits |
| license_button | viewLicenseData() → License(GplV2) | License::GplV2 |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |
