---
partial_id: "001"
artifact: ADM
window_name: "RDAdmin vX.Y.Z - Host: {hostname}"
class_name: MainWidget
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.rdadmin_screenshot.png
mockup: mockups/MainWidget.html
window_type: Widget
phase: 3
status: done
---

# UI Contract: RDAdmin Main Window

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | MainWidget |
| Typ | Widget (top-level) |
| Tytuł okna | `"RDAdmin v" + VERSION + " - Host: " + stationName` |
| Modalność | N/A (main window) |
| Rodzic | brak (root widget) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/rdadmin.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rdadmin_screenshot.png |
| Mockup HTML | ✅ | mockups/MainWidget.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| config | RDConfig* | aplikacja | tak |
| admin_username | QString | Login dialog | tak |
| admin_password | QString | Login dialog | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| name_label | QLabel | "User: {username}" | display only | - |
| description_label | QLabel | "{user description}" | display only | - |
| users_button | QPushButton | "Manage\n&Users" | Otwiera ListUsers | manageUsersData() |
| groups_button | QPushButton | "Manage\n&Groups" | Otwiera ListGroups | manageGroupsData() |
| services_button | QPushButton | "Manage\n&Services" | Otwiera ListSvcs | manageServicesData() |
| stations_button | QPushButton | "Manage\nHo&sts" | Otwiera ListStations | manageStationsData() |
| reports_button | QPushButton | "Manage\nR&eports" | Otwiera ListReports | reportsData() |
| podcasts_button | QPushButton | "Manage\n&Feeds" | Otwiera ListFeeds | podcastsData() |
| system_button | QPushButton | "System\nSettings" | Otwiera EditSystem | systemSettingsData() |
| schedcodes_button | QPushButton | "Scheduler\nCodes" | Otwiera ListSchedCodes | manageSchedCodes() |
| repl_button | QPushButton | "Manage\nReplicators" | Otwiera ListReplicators | manageReplicatorsData() |
| info_button | QPushButton | "System\nInfo" | Otwiera InfoDialog | systemInfoData() |
| quit_button | QPushButton | "&Quit" | Zamyka aplikację | quitMainWidget() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| name_label | 0, 5, 370, 20 |
| description_label | 0, 24, 370, 14 |
| users_button | 10, 50, 80, 60 |
| services_button | 100, 50, 80, 60 |
| reports_button | 190, 50, 80, 60 |
| podcasts_button | 280, 50, 80, 60 |
| groups_button | 10, 120, 80, 60 |
| stations_button | 100, 120, 80, 60 |
| system_button | 190, 120, 80, 60 |
| schedcodes_button | 280, 120, 80, 60 |
| repl_button | 100, 190, 80, 60 |
| info_button | 190, 190, 80, 60 |
| quit_button | 10, 260, 350, 60 |

Window size: 370 x 330 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| config_priv=true, rss_priv=true | User has admin config + rss privileges | Wszystkie przyciski aktywne | - |
| config_priv=true, rss_priv=false | User has admin config only | Wszystkie przyciski aktywne | - |
| config_priv=false, rss_priv=true | User has rss only | Tylko podcasts_button i info_button enabled | users, groups, services, stations, reports, system, schedcodes, repl disabled |
| Login failed | Błędne hasło | QMessageBox::warning "Login Failed" → exit(1) | - |
| Insufficient privileges | Brak obu uprawnień | QMessageBox::warning "Insufficient Priviledges" → exit(1) | - |
| DB error | Nie można otworzyć bazy | QMessageBox::critical "Error" → exit(1) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| login | checkPassword() | "Login Failed!" | Po Login dialog | QMessageBox::warning |
| privileges | adminConfig \|\| adminRss | "Insufficient Priviledges" | Po sprawdzeniu uprawnień | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| Start aplikacji | uruchomienie rdadmin | config |
| Login dialog | exec() → username, password | admin_username, admin_password |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| "Backup Database" | Widoczny na screenshot | Brak w kodzie | Może z innej wersji lub z pluginu |
| "Restore Database" | Widoczny na screenshot | Brak w kodzie | Może z innej wersji lub z pluginu |
| Grid layout | 4x3 grid widoczny na screenshot | 3x3 + quit w kodzie (10 przycisków) | Screenshot ma 12 przycisków, kod 10 + quit |
