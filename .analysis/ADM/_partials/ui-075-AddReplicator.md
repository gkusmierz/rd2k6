---
partial_id: "075"
artifact: ADM
window_name: Add Replicator
class_name: AddReplicator
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddReplicator.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add Replicator

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddReplicator |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Replicator |
| Modalność | modal |
| Rodzic | ListReplicators |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_replicator.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddReplicator.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| rname | QString* | ListReplicators (out param) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| repl_name_edit | QLineEdit | Replicator Name: | Wpisz nazwę replikatora (max 10 znaków, RDTextValidator) | - |
| ok_button | QPushButton | &OK | Tworzy replikator w DB, otwiera EditReplicator (default) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka dialog z kodem -1 | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie dialogu | Pusty QLineEdit + OK/Cancel | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| repl_name_edit | Nie może być pusty | "You must give the replicator a name!" | Klik OK | QMessageBox::warning "Invalid Name" |
| repl_name_edit | Unikalna nazwa w DB | "A replicator with that name already exists!" | Klik OK, INSERT fails | QMessageBox::warning "Replicator Exists" |
| repl_name_edit | Max 10 znaków | (walidator Qt) | Podczas wpisywania | setMaxLength(10) |
| repl_name_edit | RDTextValidator | (blokuje niedozwolone znaki) | Podczas wpisywania | setValidator() |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReplicators | Przycisk Add | QString* rname (out) |
| AddReplicator → EditReplicator | Po INSERT do DB | QString repl_name_edit->text() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |
