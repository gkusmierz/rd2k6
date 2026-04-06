---
partial_id: "011"
artifact: ADM
window_name: "RDAdmin - Rivendell User List"
class_name: ListUsers
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rivendell_user_list_dialog.png
mockup: mockups/ListUsers.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell User List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListUsers |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell User List |
| Modalność | modal |
| Rodzic | MainWidget |
| Rozmiar | 640x480 (resizable, minimum) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_users.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_user_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListUsers.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| admin_name | QString | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_users_view | RDListView | Users: | wyświetla listę użytkowników z ikonami | doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera AddUser dialog | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditUser dialog | editData() |
| list_delete_button | QPushButton | &Delete | usuwa wybranego użytkownika | deleteData() |
| list_close_button | QPushButton | &Close | zamyka dialog (default) | closeData() |

### Kolumny RDListView
| # | Nagłówek | Alignment | Źródło DB |
|---|----------|-----------|-----------|
| 0 | (icon) | - | ADMIN_CONFIG_PRIV / ADMIN_RSS_PRIV / LOCAL_AUTH |
| 1 | Login Name | left | USERS.LOGIN_NAME |
| 2 | Full Name | left | USERS.FULL_NAME |
| 3 | Description | left | USERS.DESCRIPTION |
| 4 | E-Mail Address | left | USERS.EMAIL_ADDRESS |
| 5 | Phone Number | left | USERS.PHONE_NUMBER |
| 6 | Local Auth | center | USERS.LOCAL_AUTH |

### Ikony użytkowników
| Ikona | Warunek |
|-------|---------|
| admin.xpm | ADMIN_CONFIG_PRIV == "Y" |
| rss.xpm | ADMIN_RSS_PRIV == "Y" (i nie admin) |
| localuser.xpm | LOCAL_AUTH == "Y" (i nie admin/rss) |
| user.xpm | domyślna |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak użytkowników w DB | pusta lista | brak |
| Lista wypełniona | są użytkownicy | lista z ikonami i danymi | brak |
| Brak zaznaczenia | nic nie wybrane | Edit/Delete nie działają (early return) | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete self | admin_name == selected user | "You cannot delete yourself!" | deleteData | QMessageBox::warning |
| delete default user | user jest default na stacji | "This user is set as the default user for the following hosts:..." | deleteData | QMessageBox::warning |
| delete confirm | - | "Are you sure you want to delete user \"X\"?" | deleteData | QMessageBox::warning Yes/No |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | przycisk "Manage Users" | admin_name |
| ListUsers → AddUser | przycisk Add | pointer na QString (out: username) |
| ListUsers → EditUser | przycisk Edit / double-click | username (text col 1) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Kolumna Phone Number | nie widoczna (obcięta) | obecna w kodzie | okno za wąskie na screenshot |
| Kolumna Local Auth | nie widoczna (obcięta) | obecna w kodzie | j.w. |
