---
partial_id: "014"
artifact: ADM
window_name: "RDAdmin - User: {username}"
class_name: EditUserPerms
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditUserPerms.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit User Group Permissions

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditUserPerms |
| Typ | Dialog |
| Tytuł okna | RDAdmin - User: {username} |
| Modalność | modal |
| Rodzic | EditUser |
| Rozmiar | 400x212 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_user_perms.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditUserPerms.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| user | RDUser* | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| user_host_sel | RDListSelector | Available Groups / Enabled Groups | przenoszenie grup między listami | - |
| ok_button | QPushButton | &OK | zapisuje perms do DB | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | dwie listy: available i enabled groups | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | brak walidacji | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditUser | przycisk Group Permissions | RDUser* |

## Logika biznesowa
- Pobiera USER_PERMS i GROUPS z DB
- OK: dodaje nowe grupy do USER_PERMS, usuwa usunięte
- Cancel: done(1) bez zmian
