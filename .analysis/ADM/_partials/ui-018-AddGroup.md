---
partial_id: "018"
artifact: ADM
window_name: "RDAdmin - Add Group"
class_name: AddGroup
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddGroup.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add Group

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddGroup |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Group |
| Modalność | modal |
| Rodzic | ListGroups |
| Rozmiar | 250x152 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_group.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddGroup.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| group | QString* | konstruktor arg (output) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| group_name_edit | QLineEdit | &New Group Name: | wpisz nazwę grupy (maxLength=10, validator) | - |
| group_users_box | QCheckBox | Enable Group for All Users | domyślnie checked | - |
| group_svcs_box | QCheckBox | Enable Group for All Services | domyślnie checked | - |
| ok_button | QPushButton | &OK | tworzy grupę, otwiera EditGroup | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | puste pole + dwa checkboxy (oba checked) + OK/Cancel | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| group_name_edit | nie może być pusty | "You must give the group a name!" | okData | QMessageBox::warning |
| group_name_edit | unikalność w DB | "Group Already Exists!" | okData (insert fails) | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListGroups | przycisk Add | QString* group (output) |
| AddGroup → EditGroup | automatycznie po insert | group name (text) |

## Logika biznesowa
- Po wstawieniu grupy do GROUPS:
  - Jeśli group_users_box checked: tworzy USER_PERMS dla wszystkich użytkowników
  - Jeśli group_svcs_box checked: tworzy AUDIO_PERMS dla wszystkich serwisów
- Otwiera EditGroup; jeśli EditGroup jest anulowany (exec < 0), usuwa grupę i perms
- done(0) = sukces, done(-1) = anulowanie
