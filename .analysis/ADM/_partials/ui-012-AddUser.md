---
partial_id: "012"
artifact: ADM
window_name: "RDAdmin - Add User"
class_name: AddUser
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddUser.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add User

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddUser |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add User |
| Modalność | modal |
| Rodzic | ListUsers |
| Rozmiar | 400x110 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_user.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddUser.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| username | QString* | konstruktor arg (output) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| user_name_edit | QLineEdit | &New User Name: | wpisz nazwę użytkownika (maxLength=255) | - |
| ok_button | QPushButton | &OK | tworzy użytkownika, otwiera EditUser | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | pusty QLineEdit + OK/Cancel | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| user_name_edit | nie może być pusty | "You must give the user a name!" | okData | QMessageBox::warning |
| user_name_edit | unikalność w DB | "User Already Exists!" | okData (insert fails) | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListUsers | przycisk Add | QString* username (output) |
| AddUser → EditUser | automatycznie po insert | username (text) |

## Logika biznesowa
- Po wstawieniu użytkownika do USERS, automatycznie tworzy USER_PERMS dla wszystkich istniejących grup
- Otwiera EditUser; jeśli EditUser jest anulowany (exec < 0), usuwa utworzonego użytkownika i jego perms
- done(0) = sukces, done(-1) = anulowanie
