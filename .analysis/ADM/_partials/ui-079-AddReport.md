---
partial_id: "079"
artifact: ADM
window_name: Add Report
class_name: AddReport
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddReport.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add Report

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddReport |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Report |
| Modalność | modal |
| Rodzic | ListReports |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_report.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddReport.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| rptname | QString* | ListReports (out param) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_name_edit | QLineEdit | &Report Name: | Wpisz nazwę raportu (max 64 znaków, RDTextValidator) | - |
| ok_button | QPushButton | &OK | Tworzy raport w DB (default) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka dialog z kodem -1 | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie dialogu | Pusty QLineEdit + OK/Cancel | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| add_name_edit | Nie może być pusty | "You must provide a report name!" | Klik OK | QMessageBox::warning "Invalid Name" |
| add_name_edit | Unikalna nazwa w DB | "A report with that name already exists!" | Klik OK, SELECT finds existing | QMessageBox::warning "Report Exists" |
| add_name_edit | Max 64 znaków | (walidator Qt) | Podczas wpisywania | setMaxLength(64) |
| add_name_edit | RDTextValidator | (blokuje niedozwolone znaki) | Podczas wpisywania | setValidator() |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReports | Przycisk Add | QString* rptname (out) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |
