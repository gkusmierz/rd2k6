---
partial_id: "020"
artifact: ADM
window_name: "RDAdmin - Rename Group"
class_name: RenameGroup
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rename_group_dialog.png
mockup: mockups/RenameGroup.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rename Group

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | RenameGroup |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rename Group |
| Modalność | modal |
| Rodzic | ListGroups |
| Rozmiar | 300x130 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/rename_group.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rename_group_dialog.png |
| Mockup HTML | ✅ | mockups/RenameGroup.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| group | QString (current group name) | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| group_name_edit | QLineEdit | Current Group Name: | readonly, maxLength=10 | - |
| group_newname_edit | QLineEdit | New &Group Name: | edycja, maxLength=10, validator | - |
| ok_button | QPushButton | &OK | zmienia nazwę / merge | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | current name (readonly) + empty new name field | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| group_newname_edit | nie może być pusty | "The group name is invalid!" | okData | QMessageBox::warning |
| group_newname_edit | jeśli nazwa istnieje w DB | "A \"{name}\" group already exists. Do you want to combine the two?" | okData | QMessageBox::question Yes/No |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListGroups | przycisk Rename | group name |

## Logika biznesowa
- Jeśli nowa nazwa nie istnieje: rename (UPDATE) GROUPS, AUDIO_PERMS, USER_PERMS, CART, EVENTS, REPLICATOR_MAP, DROPBOXES
- Jeśli nowa nazwa istnieje (merge): przenosi CART, EVENTS, REPLICATOR_MAP, DROPBOXES do istniejącej grupy, usuwa starą grupę i jej perms
- done(0) = sukces, done(-1) = anulowanie

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Rename Group" (bez RDAdmin prefix) | "RDAdmin - Rename Group" | screenshot może być przycięty |
