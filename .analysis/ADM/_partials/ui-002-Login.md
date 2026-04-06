---
partial_id: "002"
artifact: ADM
window_name: "RDAdmin"
class_name: Login
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.login_dialog.png
mockup: mockups/Login.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Login Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | Login |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin" |
| Modalność | modal (exec()) |
| Rodzic | MainWidget (constructor) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/login.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.login_dialog.png |
| Mockup HTML | ✅ | mockups/Login.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| username | QString* | output pointer | tak |
| password | QString* | output pointer | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| login_name_edit | QLineEdit | "User &Name:" | Wpisanie nazwy użytkownika | - |
| login_password_edit | QLineEdit | "&Password:" | Wpisanie hasła (EchoMode::Password) | - |
| ok_button | QPushButton | "&OK" | Zatwierdza login | okData() |
| cancel_button | QPushButton | "&Cancel" | Anuluje login | cancelData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| login_name_label | 10, 10, 85, 19 |
| login_name_edit | 100, 10, 100, 19 |
| login_password_label | 10, 31, 85, 19 |
| login_password_edit | 100, 31, 100, 19 |
| ok_button | 10, 60, 100, 55 |
| cancel_button | 120, 60, 100, 55 |

Window size: 230 x 125 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| initial | Otwarcie dialogu | Puste pola, focus na login_name_edit | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| login_name_edit | RDTextValidator | brak | inline validation | validator |
| login_password_edit | RDTextValidator, maxLength=16 | brak | inline validation | validator |
| login_name_edit | maxLength=RD_MAX_PASSWORD_LENGTH | brak | inline | setMaxLength |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget constructor | new Login(&username, &password, this)->exec() | username, password (pointers) |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Window title | "Login" | "RDAdmin" | Screenshot pokazuje "Login" jako tytuł, kod ustawia "RDAdmin" |
