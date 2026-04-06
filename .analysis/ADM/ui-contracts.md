---
phase: 3
artifact: ADM
artifact_name: rdadmin
status: done
completed_at: 2026-04-06
ui_mode: B
windows_total: 2
dialogs_total: 78
panels_total: 0
screenshots_used: 35
mockups_generated: 80
spot_check_issues: 0
agent_version: 1.2.0
---

# UI Contracts: rdadmin

## Tryb ekstrakcji

| Parametr | Wartość |
|----------|---------|
| Tryb UI | B (Code-first) |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Programowy UI (C++) | 80 dialogów/widgetów |
| Screenshots użyte | ~35 (z docs/opsguide/) |
| Mockupy wygenerowane | 80 |

## Przegląd okien

| Klasa | Typ | Tytuł | Screenshot | Mockup |
|-------|-----|-------|-----------|--------|
| MainWidget | Widget | RDAdmin vX.Y.Z - Host: {hostname} | ✅ | ✅ |
| Login | Dialog | RDAdmin | ✅ | ✅ |
| InfoDialog | Dialog | RDAdmin - System Information | ❌ | ✅ |
| License | Dialog | Rivendell Credits / GNU Public License v2 | ❌ | ✅ |
| HelpAudioPorts | Dialog | RDAdmin - Audio Ports Help | ❌ | ✅ |
| EditSystem | Dialog | RDAdmin - System-Wide Settings | ✅ | ✅ |
| ListEncoders | Dialog | RDAdmin - Encoder Profiles | ✅ | ✅ |
| ListSchedCodes | Dialog | RDAdmin - Rivendell Scheduler Codes List | ✅ | ✅ |
| AddSchedCode | Dialog | RDAdmin - Add Scheduler Code | ❌ | ✅ |
| EditSchedCode | Dialog | RDAdmin - Scheduler Code: {code} | ✅ | ✅ |
| ListUsers | Dialog | RDAdmin - Rivendell User List | ✅ | ✅ |
| AddUser | Dialog | RDAdmin - Add User | ❌ | ✅ |
| EditUser | Dialog | RDAdmin - User: {username} | ✅ | ✅ |
| EditUserPerms | Dialog | RDAdmin - User: {username} | ❌ | ✅ |
| EditUserServicePerms | Dialog | RDAdmin - User: {username} | ❌ | ✅ |
| EditFeedPerms | Dialog | RDAdmin - User: {username} | ❌ | ✅ |
| ListGroups | Dialog | RDAdmin - Rivendell Group List | ✅ | ✅ |
| AddGroup | Dialog | RDAdmin - Add Group | ❌ | ✅ |
| EditGroup | Dialog | RDAdmin - Group: {groupname} | ✅ | ✅ |
| RenameGroup | Dialog | RDAdmin - Rename Group | ✅ | ✅ |
| AutofillCarts | Dialog | RDAdmin - Autofill Carts - Service: {svcname} | ✅ | ✅ |
| ListSvcs | Dialog | RDAdmin - Services | ✅ | ✅ |
| AddSvc | Dialog | RDAdmin - Add Service | ❌ | ✅ |
| EditSvc | Dialog | RDAdmin - Edit Service | ✅ | ✅ |
| EditSvcPerms | Dialog | RDAdmin - Service: {name} | ❌ | ✅ |
| TestImport | Dialog | RDAdmin - Test Traffic/Music Import | ✅ | ✅ |
| ImportFields | Widget | Import Parser Fields | ✅ | ✅ |
| ListHostvars | Dialog | RDAdmin - Host Variables for {station} | ✅ | ✅ |
| AddHostvar | Dialog | RDAdmin - Add Host Variable | ❌ | ✅ |
| EditHostvar | Dialog | RDAdmin - Edit Host Variable | ✅ | ✅ |
| ListDropboxes | Dialog | RDAdmin - Rivendell Dropbox Configurations on {station} | ✅ | ✅ |
| EditDropbox | Dialog | RDAdmin - Dropbox Configuration [ID: N] | ✅ | ✅ |
| ListStations | Dialog | Rivendell Host List | ✅ | ✅ |
| AddStation | Dialog | Add Host | ❌ | ✅ |
| EditStation | Dialog | Host | ✅ | ✅ |
| EditAudioPorts | Dialog | Edit AudioScience Audio Ports | ✅ | ✅ |
| EditDecks | Dialog | Configure RDCatch | ✅ | ✅ |
| EditCartSlots | Dialog | Edit CartSlots | ✅ | ✅ |
| EditHotkeys | Dialog | Hot Key Configuration | ✅ | ✅ |
| EditTtys | Dialog | Edit Serial Ports | ✅ | ✅ |
| ViewAdapters | Dialog | Audio Resource Information | ✅ | ✅ |
| EditJack | Dialog | JACK Configuration | ✅ | ✅ |
| EditRDAirPlay | Dialog | Configure RDAirPlay | ✅ | ✅ |
| EditRDLibrary | Dialog | Configure RDLibrary | ✅ | ✅ |
| EditRDLogedit | Dialog | Configure RDLogedit | ✅ | ✅ |
| EditRDPanel | Dialog | Configure RDPanel | ✅ | ✅ |
| EditJackClient | Dialog | JACK Client Configuration | ❌ | ✅ |
| ListPypads | Dialog | PyPAD Instances | ✅ | ✅ |
| EditPypad | Dialog | Edit PyPAD Instance | ✅ | ✅ |
| ViewPypadErrors | Dialog | Script Error Log | ❌ | ✅ |
| ListMatrices | Dialog | Rivendell Switcher List | ✅ | ✅ |
| AddMatrix | Dialog | Add Switcher | ❌ | ✅ |
| EditMatrix | Dialog | Edit Switcher | ✅ | ✅ |
| ListEndpoints | Dialog | List Inputs / List Outputs | ❌ | ✅ |
| EditEndpoint | Dialog | Edit Input / Edit Output | ❌ | ✅ |
| ListGpis | Dialog | List GPIs / List GPOs | ✅ | ✅ |
| EditGpi | Dialog | Edit GPI | ✅ | ✅ |
| ListSasResources | Dialog | SAS Switches | ❌ | ✅ |
| EditSasResource | Dialog | Edit SAS Switch | ❌ | ✅ |
| ListVguestResources | Dialog | vGuest Switches / vGuest Displays | ❌ | ✅ |
| EditVguestResource | Dialog | Edit vGuest Switch / Edit vGuest Display | ❌ | ✅ |
| ListNodes | Dialog | Livewire Node List | ❌ | ✅ |
| EditNode | Dialog | Edit LiveWire Node | ❌ | ✅ |
| ViewNodeInfo | Dialog | Viewing Livewire Node | ❌ | ✅ |
| ListLiveWireGpios | Dialog | Livewire GPIO Source Assignments | ❌ | ✅ |
| EditLiveWireGpio | Dialog | Edit GPIO Source | ❌ | ✅ |
| EditChannelGpios | Dialog | Edit Channel GPIOs | ✅ | ✅ |
| ListFeeds | Dialog | Rivendell Feed List | ❌ | ✅ |
| AddFeed | Dialog | Add RSS Feed | ❌ | ✅ |
| EditFeed | Dialog | Feed Editor | ❌ | ✅ |
| EditSuperfeed | Dialog | RSS Superfeed | ❌ | ✅ |
| ListImages | Dialog | Image Manager | ❌ | ✅ |
| EditImage | Dialog | Image Viewer | ❌ | ✅ |
| ListReplicators | Dialog | Rivendell Replicators | ✅ | ✅ |
| AddReplicator | Dialog | Add Replicator | ❌ | ✅ |
| EditReplicator | Dialog | Replicator: {name} | ✅ | ✅ |
| ListReplicatorCarts | Dialog | {replname} Replicator Carts | ❌ | ✅ |
| ListReports | Dialog | Rivendell Report List | ❌ | ✅ |
| AddReport | Dialog | Add Report | ❌ | ✅ |
| EditReport | Dialog | Edit Report {rptname} | ❌ | ✅ |

## Navigation Flow

```
MainWidget (RDWidget)
    ├── Login (modal)
    ├── ListUsers → AddUser, EditUser → EditUserPerms, EditUserServicePerms, EditFeedPerms
    ├── ListGroups → AddGroup, EditGroup → AutofillCarts, RenameGroup
    ├── ListSvcs → AddSvc, EditSvc → EditSvcPerms, TestImport, ImportFields, ListHostvars → AddHostvar, EditHostvar, ListDropboxes → EditDropbox
    ├── ListStations → AddStation, EditStation → EditAudioPorts, EditDecks, EditCartSlots, EditHotkeys, EditTtys, ViewAdapters, EditJack → EditJackClient, EditRDAirPlay, EditRDLibrary, EditRDLogedit, EditRDPanel, ListPypads → EditPypad, ViewPypadErrors, ListMatrices → AddMatrix, EditMatrix → ListEndpoints → EditEndpoint, ListGpis → EditGpi, ListSasResources → EditSasResource, ListVguestResources → EditVguestResource, ListNodes → EditNode, ViewNodeInfo, ListLiveWireGpios → EditLiveWireGpio, EditChannelGpios
    ├── ListFeeds → AddFeed, EditFeed → EditSuperfeed, ListImages → EditImage
    ├── ListReplicators → AddReplicator, EditReplicator, ListReplicatorCarts
    ├── ListReports → AddReport, EditReport
    ├── ListSchedCodes → AddSchedCode, EditSchedCode
    ├── EditSystem → ListEncoders
    ├── InfoDialog → License
    └── HelpAudioPorts
```

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

---

# UI Contract: License / Credits Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | License |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "Rivendell Credits" lub "GNU Public License v2" (zależy od trybu) |
| Modalność | modal (exec()) |
| Rodzic | InfoDialog |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/license.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/License.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| lic | License::Text (enum: Credits, GplV2) | exec() argument | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| license_edit | QTextEdit | (treść licencji/credits) | read-only text display | - |
| close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

## Layout (resizable)
Window size: 600 x 400 (minimum, resizable via resizeEvent).

| Widget | Opis |
|--------|------|
| license_edit | Fills most of the window |
| close_button | Bottom area |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Credits | exec(License::Credits) | PlainText credits, tytuł "Rivendell Credits" | - |
| GPL v2 | exec(License::GplV2) | RichText GPL license, tytuł "GNU Public License v2" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| InfoDialog (credits_button) | viewCreditsData() → License::Credits | License::Text enum |
| InfoDialog (license_button) | viewLicenseData() → License::GplV2 | License::Text enum |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |

---

# UI Contract: Audio Ports Help Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | HelpAudioPorts |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Audio Ports Help" |
| Modalność | modal (setModal(true)) |
| Rodzic | EditAudioPorts (from station config) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/help_audios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/HelpAudioPorts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| help_edit | Q3TextEdit | Rich HTML help content | read-only, RichText | - |
| close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| help_edit | 10, 10, 580, 330 |
| close_button | 510, 340, 80, 50 |

Window size: 600 x 400 (fixed).

## Treść help_edit (RichText)
HTML table explaining Channel Mode behavior:
- Mono/Normal: L+R sum to mono
- Mono/Swap: R+L sum to mono (same as Normal)
- Mono/Left only: L -> mono
- Mono/Right only: R -> mono
- Stereo/Normal: Stereo
- Stereo/Swap: Swapped stereo
- Stereo/Left only: L -> L channel only, R silent
- Stereo/Right only: R -> R channel only, L silent

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Zawsze | Tabela z opisem trybów audio | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditAudioPorts | Help button | brak |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |

---

# UI Contract: System-Wide Settings Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSystem |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - System-Wide Settings" |
| Modalność | modal (exec()) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_system.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.system_wide_settings_dialog.png |
| Mockup HTML | ✅ | mockups/EditSystem.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | Ładuje z RDSystem / DB | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_sample_rate_box | QComboBox | "System Sample Rate:" | Wybór sample rate (32000/44100/48000) | - |
| edit_sample_rate_unit_label | QLabel | "samples/second" | display only | - |
| edit_duplicate_carts_box | QCheckBox | "Allow Duplicate Cart Titles" | Toggle duplicate titles | duplicatesCheckedData(bool) |
| edit_fix_duplicate_carts_box | QCheckBox | "Auto-Correct Duplicate Cart Titles" | Toggle auto-correct | - |
| edit_show_user_list_box | QCheckBox | "Show User List in RDLogin" | Toggle user list visibility | - |
| edit_isci_path_edit | QLineEdit | "ISCI Cross Reference Path:" | ISCI path input | - |
| edit_origin_email_addr_edit | QLineEdit | "Origin E-Mail Address:" (max 64) | Email address | - |
| edit_notification_address_edit | QLineEdit | "Multicast Address for Notifications" | IP address | - |
| edit_maxpost_spin | QSpinBox | "Maximum Remote Post Length:" (1-1000) | Max POST size in MB | - |
| edit_maxpost_unit_label | QLabel | "Mbytes" | display only | - |
| edit_temp_cart_group_box | QComboBox | "Temporary Cart Group:" | Group selection from DB | - |
| edit_rss_processor_box | QComboBox | "Process RSS Updates On:" | Station selection ([none] + DB) | - |
| edit_duplicate_hidden_label | QLabel | "The following duplicate titles..." | Shown when duplicates exist | - |
| edit_duplicate_list | Q3ListView | Columns: Cart, Title | Shown when duplicates exist | - |
| edit_save_button | QPushButton | "&Save List" | Saves duplicate list to file | saveData() |
| edit_encoders_button | QPushButton | "Edit Encoder\nList" | Opens ListEncoders | encodersData() |
| edit_ok_button | QPushButton | "&OK" | Saves settings | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | Cancels dialog | cancelData() |

## Layout
Window size: 500 x 306 (initial, grows if duplicates shown via y_pos).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | duplicate_carts=true | fix_duplicate_carts disabled, main form | fix_duplicate_carts_box + label disabled |
| default | duplicate_carts=false | fix_duplicate_carts enabled | - |
| duplicates_found | okData() finds duplicates when disabling | Duplicate list shown, save button, warning label | Window grows, duplicate_list + save_button + hidden_label shown |
| deprecation_warning | User unchecks "Allow Duplicate" when currently allowed | QMessageBox::warning deprecation dialog | Reverts checkbox if user cancels |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| duplicate_carts_box | Deprecation warning on uncheck | "The ability to disallow duplicate cart titles has been deprecated..." | duplicatesCheckedData(false) | QMessageBox::warning |
| duplicate_carts_box (okData) | Check for actual duplicates in CART table | Duplicate list shown in Q3ListView | okData() when unchecking | Progress dialog + list |
| save_button (file) | File exists check | "The file ... exists. Overwrite?" | saveData() | QMessageBox::question |
| save_button (file) | File write error | "Unable to write file ..." | saveData() | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | systemSettingsData() → new EditSystem(this)->exec() | brak |
| edit_encoders_button | encodersData() → edit_encoders_dialog->exec() | brak |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Layout order | Checkboxes at top, then fields | Same order confirmed | Zgodne |
| "Show User List in RDLogin" | Widoczne | edit_show_user_list_box | Zgodne |

---

# UI Contract: Encoder Profiles Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListEncoders |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Encoder Profiles" |
| Modalność | modal (exec()) |
| Rodzic | EditSystem |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_encoders.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.encoder_profiles_dialog.png |
| Mockup HTML | ✅ | mockups/ListEncoders.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | Ładuje presety z DB (RDSettings::loadPreset) | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| c_list_label | QLabel | "Encoder Profiles" | display only (bigLabelFont) | - |
| c_list | RDListView | Kolumna: "Name" | Lista profili, double-click edits | doubleClickedData() |
| c_add_button | QPushButton | "Add" | Dodaje nowy profil (RDExportSettingsDialog) | addData() |
| c_edit_button | QPushButton | "Edit" | Edytuje wybrany profil | editData() |
| c_delete_button | QPushButton | "Delete" | Usuwa wybrany profil | deleteData() |
| c_close_button | QPushButton | "Close" | Zamyka dialog | closeData() |

## Layout (resizable)
Window size: 400 x 300 (minimum, resizable via resizeEvent).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Lista profili z presetów DB | - |
| delete_confirm | Klik Delete z zaznaczonym | QMessageBox::question "Are you sure..." | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Confirmation required | "Are you sure that you want to delete preset \"{name}\"?" | deleteData() | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSystem | encodersData() → edit_encoders_dialog->exec() | brak |
| c_add_button / c_edit_button | RDExportSettingsDialog | encoder settings |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Layout | Buttons at bottom (Add, Edit, Delete, Close) | Same | Zgodne |
| List columns | "Name" column | c_list->addColumn("Name") | Zgodne |

---

# UI Contract: Scheduler Codes List Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListSchedCodes |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Rivendell Scheduler Codes List" |
| Modalność | modal (setModal(true)) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_schedcodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_scheduler_code_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListSchedCodes.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | Ładuje z SCHED_CODES table | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box_label | QLabel | "Scheduler Codes:" | display only (buttonFont) | - |
| list_schedCodes_view | Q3ListView | Kolumny: CODE, DESCRIPTION | Lista kodów, double-click edits | doubleClickedData() |
| list_add_button | QPushButton | "&Add" | Otwiera AddSchedCode | addData() |
| list_edit_button | QPushButton | "&Edit" | Otwiera EditSchedCode | editData() |
| list_delete_button | QPushButton | "&Delete" | Usuwa wybrany kod | deleteData() |
| list_close_button | QPushButton | "&Close" (default) | Zamyka dialog | closeData() |

## Layout (resizable)
Window size: 640 x 480 (minimum, resizable).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Lista scheduler codes z DB | - |
| delete_confirm | Klik Delete z zaznaczonym | QMessageBox::question confirm dialog | - |
| nothing_selected | Edit/Delete bez zaznaczenia | Brak akcji (early return) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Confirmation required | "This operation will delete the selected scheduler code and all of its associated data. This operation cannot be undone. Delete scheduler code \"{code}\"?" | deleteData() | QMessageBox::question |
| edit/delete | Item must be selected | (silent return) | editData()/deleteData() | null check |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | manageSchedCodes() → new ListSchedCodes(this)->exec() | brak |
| list_add_button | addData() → AddSchedCode | &schedCode (output) |
| list_edit_button | editData() → EditSchedCode(code, description) | code, description |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Title | "Rivendell Scheduler Codes List" | "RDAdmin - Rivendell Scheduler Codes List" | Screenshot pomija prefix "RDAdmin -" |
| Button layout | Buttons on right side (Add, Edit, Delete, Close) | Buttons positioned via resizeEvent | Zgodne z screenshot |

---

# UI Contract: Add Scheduler Code Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddSchedCode |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Add Scheduler Code" |
| Modalność | modal (setModal(true)) |
| Rodzic | ListSchedCodes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_schedcodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddSchedCode.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| schedCode | QString* | output pointer | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| schedcode_name_edit | QLineEdit | "&New Code:" (max 10 chars) | Wpisanie kodu | - |
| ok_button | QPushButton | "&OK" (default) | Waliduje i tworzy kod | okData() |
| cancel_button | QPushButton | "&Cancel" | Anuluje | cancelData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| label | 10, 11, 90, 19 |
| schedcode_name_edit | 105, 11, 100, 19 |
| ok_button | 70, 60, 80, 50 |
| cancel_button | 160, 60, 80, 50 |

Window size: 250 x 120 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Puste pole kodu | - |
| error_empty | Puste pole, klik OK | QMessageBox "Invalid Name!" | - |
| error_exists | Kod już istnieje w DB | QMessageBox "Code Already Exists!" | - |
| success | Kod utworzony | Otwiera EditSchedCode do dodania opisu, potem zamyka | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| schedcode_name_edit | Nie może być puste | "Invalid Name!" | okData() | QMessageBox::warning |
| schedcode_name_edit | Nie może zawierać spacji | (validator blocks input) | inline | RDTextValidator + bannedChar(' ') |
| schedcode_name_edit | Max 10 znaków | (blocked by maxLength) | inline | setMaxLength(10) |
| schedcode_name_edit | Unikalny w DB | "Code Already Exists!" | okData() SQL insert | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSchedCodes | addData() → new AddSchedCode(&schedCode, this)->exec() | &schedCode output |
| okData() | Opens EditSchedCode(code, "") for description | code, empty description |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |

---

# UI Contract: Edit Scheduler Code Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSchedCode |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Scheduler Code: {code}" |
| Modalność | modal (setModal(true)) |
| Rodzic | ListSchedCodes / AddSchedCode |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_schedcodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.scheduler_code_dialog.png |
| Mockup HTML | ✅ | mockups/EditSchedCode.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| schedcode | QString | from ListSchedCodes/AddSchedCode | tak |
| description | QString | from ListSchedCodes/AddSchedCode | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| schedcode_name_edit | QLineEdit | "Scheduler Code:" (readOnly, max 10) | Display only | - |
| schedcode_description_edit | QLineEdit | "Code Description:" (max 255) | Edycja opisu | - |
| ok_button | QPushButton | "&OK" (default) | Zapisuje opis do DB | okData() |
| cancel_button | QPushButton | "&Cancel" | Anuluje | cancelData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| schedcode_name_label | 10, 11, 110, 19 |
| schedcode_name_edit | 125, 11, 100, 19 |
| schedcode_description_label | 10, 32, 110, 19 |
| schedcode_description_edit | 125, 32, 265, 19 |
| ok_button | 220, 80, 80, 50 |
| cancel_button | 310, 80, 80, 50 |

Window size: 400 x 140 (fixed).

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Otwarcie | Kod (readonly) + opis do edycji | schedcode_name_edit readonly |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| schedcode_description_edit | RDTextValidator | (inline) | typing | validator |
| schedcode_description_edit | Max 255 znaków | (blocked by maxLength) | inline | setMaxLength(255) |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSchedCodes | editData() → EditSchedCode(code, description)->exec() | code, description |
| AddSchedCode | okData() → EditSchedCode(code, "")->exec() | code, empty description |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Title | "Scheduler Code: WCR-E" | "RDAdmin - Scheduler Code: WCR-E" | Screenshot pomija "RDAdmin -" prefix |
| Layout | Zgodne z kodem | Zgodne | OK |

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

---

# UI Contract: Edit User

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditUser |
| Typ | Dialog |
| Tytuł okna | RDAdmin - User: {username} |
| Modalność | modal (implicit) |
| Rodzic | ListUsers / AddUser |
| Rozmiar | 375x723 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_user.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.user_dialog.png |
| Mockup HTML | ✅ | mockups/EditUser.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| user | QString (login name) | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| user_name_edit | QLineEdit | &User Name: | readonly, maxLength=191 | - |
| user_full_name_edit | QLineEdit | &Full Name: | edycja, maxLength=191 | - |
| user_description_edit | QLineEdit | &Description: | edycja, maxLength=191 | - |
| user_email_address_edit | QLineEdit | E-Mail Address: | edycja, maxLength=191 | - |
| user_phone_edit | QLineEdit | &Phone: | edycja, maxLength=20 | - |
| user_localauth_check | QCheckBox | Authenticate This User Locally | toggle auth mode | localAuthToggledData(bool) |
| user_pamservice_edit | QLineEdit | PAM Service: | edycja, maxLength=32 | - |
| user_password_button | QPushButton | Change Password | otwiera RDPasswd dialog | passwordData() |
| user_webapi_auth_spin | QSpinBox | WebAPI Timeout: | 0-86400, special="Disabled" | - |
| user_admin_config_button | QCheckBox | Administer System | toggle admin priv | adminConfigToggledData(bool) |
| user_admin_rss_button | QCheckBox | Administer RSS Feeds | toggle RSS admin priv | adminRssToggledData(bool) |
| user_create_carts_button | QCheckBox | Create Carts | - | - |
| user_delete_carts_button | QCheckBox | Delete Carts | - | - |
| user_modify_carts_button | QCheckBox | Modify Carts | - | - |
| user_edit_audio_button | QCheckBox | Edit Audio | - | - |
| user_webget_login_button | QCheckBox | Allow WebGet Login | - | - |
| user_edit_catches_button | QCheckBox | Edit Netcatch Schedule | - | - |
| user_voicetrack_log_button | QCheckBox | Voicetrack Logs | - | - |
| user_create_log_button | QCheckBox | Create Log | - | - |
| user_delete_log_button | QCheckBox | Delete Log | - | - |
| user_delete_rec_button | QCheckBox | Delete Report Data | - | - |
| user_modify_template_button | QCheckBox | Modify Template | - | - |
| user_playout_log_button | QCheckBox | Playout Logs | - | - |
| user_arrange_log_button | QCheckBox | Rearrange Log Items | - | - |
| user_addto_log_button | QCheckBox | Add Log Items | - | - |
| user_removefrom_log_button | QCheckBox | Delete Log Items | - | - |
| user_config_panels_button | QCheckBox | Configure System Panels | - | - |
| user_add_podcast_button | QCheckBox | Create Podcast | - | - |
| user_edit_podcast_button | QCheckBox | Edit Podcast | - | - |
| user_delete_podcast_button | QCheckBox | Delete Podcast | - | - |
| user_web_box | QCheckBox | Allow Web Login | - | - |
| user_assign_perms_button | QPushButton | Group Permissions | otwiera EditUserPerms | groupsData() |
| user_assign_svcs_button | QPushButton | Service Permissions | otwiera EditUserServicePerms | servicesData() |
| user_assign_feeds_button | QPushButton | Podcast Feed Permissions | otwiera EditFeedPerms | feedsData() |
| ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

### Grupy QGroupBox
| Grupa | Etykieta | Zawiera |
|-------|----------|---------|
| user_admin_group | Administrative Rights | admin_config, admin_rss |
| user_prod_group | Production Rights | create/delete/modify carts, edit audio, webget login, edit catches, voicetrack |
| user_traffic_group | Traffic Rights | create/delete log, delete rec, modify template |
| user_onair_group | OnAir Rights | playout/arrange/addto/removefrom log, config panels |
| user_podcast_group | Podcasting Rights | add/edit/delete podcast, web login |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Admin Config ON | user_admin_config_button checked | wszystkie prawa prod/traffic/onair/podcast disabled, perms buttons disabled | admin_rss disabled |
| Admin RSS ON | user_admin_rss_button checked | j.w. | admin_config disabled |
| Local Auth ON | user_localauth_check checked | password button enabled, PAM service disabled | - |
| Local Auth OFF | user_localauth_check unchecked | password button disabled, PAM service enabled | - |
| Self-edit | edytujemy siebie (user==rda->user) | admin_config checkbox+label disabled | nie można się zdegradować |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | RDTextValidator na polach tekstowych | - | inline | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListUsers / AddUser | edit / double-click / po dodaniu | username |
| EditUser → EditUserPerms | przycisk Group Permissions | RDUser* |
| EditUser → EditUserServicePerms | przycisk Service Permissions | RDUser* |
| EditUser → EditFeedPerms | przycisk Podcast Feed Permissions | RDUser* |
| EditUser → RDPasswd | przycisk Change Password | QString* password |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Screenshot odpowiada kodowi |

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

---

# UI Contract: Edit User Service Permissions

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditUserServicePerms |
| Typ | Dialog |
| Tytuł okna | RDAdmin - User: {username} |
| Modalność | modal |
| Rodzic | EditUser |
| Rozmiar | 400x212 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_user_service_perms.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditUserServicePerms.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| user | RDUser* | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| user_host_sel | RDListSelector | Available Services / Enabled Services | przenoszenie serwisów między listami | - |
| ok_button | QPushButton | &OK | zapisuje perms do DB | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | dwie listy: available i enabled services | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | brak walidacji | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditUser | przycisk Service Permissions | RDUser* |

## Logika biznesowa
- Pobiera USER_SERVICE_PERMS i SERVICES z DB
- OK: dodaje nowe serwisy do USER_SERVICE_PERMS, usuwa usunięte
- Cancel: done(1) bez zmian

---

# UI Contract: Edit Feed Permissions

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditFeedPerms |
| Typ | Dialog |
| Tytuł okna | RDAdmin - User: {username} |
| Modalność | modal |
| Rodzic | EditUser |
| Rozmiar | 400x212 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_feed_perms.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditFeedPerms.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| user | RDUser* | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_host_sel | RDListSelector | Available Feeds / Enabled Feeds | przenoszenie feedów między listami | - |
| ok_button | QPushButton | &OK | zapisuje perms do DB | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | dwie listy: available i enabled feeds | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | brak walidacji | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditUser | przycisk Podcast Feed Permissions | RDUser* |

## Logika biznesowa
- Pobiera FEED_PERMS i FEEDS z DB
- OK: dodaje nowe feedy do FEED_PERMS, usuwa usunięte
- Cancel: done(1) bez zmian

---

# UI Contract: Rivendell Group List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListGroups |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Group List |
| Modalność | modal |
| Rodzic | MainWidget |
| Rozmiar | 640x480 (resizable, minimum) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_groups.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_group_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListGroups.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| - | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_groups_view | RDListView | Groups: | wyświetla listę grup z kolorami | doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera AddGroup dialog | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditGroup dialog | editData() |
| list_rename_button | QPushButton | &Rename | otwiera RenameGroup dialog | renameData() |
| list_delete_button | QPushButton | &Delete | usuwa wybraną grupę | deleteData() |
| list_report_button | QPushButton | Generate Report | generuje raport tekstowy | reportData() |
| list_close_button | QPushButton | &Close | zamyka dialog (default) | closeData() |

### Kolumny RDListView
| # | Nagłówek | Alignment | Źródło DB |
|---|----------|-----------|-----------|
| 0 | Name | left (bold, colored) | GROUPS.NAME + COLOR |
| 1 | Description | left | GROUPS.DESCRIPTION |
| 2 | Start Cart | center | GROUPS.DEFAULT_LOW_CART |
| 3 | End Cart | center | GROUPS.DEFAULT_HIGH_CART |
| 4 | Enforce Range | center | GROUPS.ENFORCE_CART_RANGE |
| 5 | Default Type | center | GROUPS.DEFAULT_CART_TYPE (Audio/Macro/[none]) |
| 6 | Traffic Report | center | GROUPS.REPORT_TFC |
| 7 | Music Report | center | GROUPS.REPORT_MUS |
| 8 | Now & Next | center | GROUPS.ENABLE_NOW_NEXT |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak grup w DB | pusta lista | brak |
| Lista wypełniona | są grupy | lista z kolorowymi nazwami grup | brak |
| Brak zaznaczenia | nic nie wybrane | Edit/Rename/Delete nie działają (early return) | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete confirm | - | "{N} member carts will be deleted along with group \"X\"! Are you sure you want to delete group \"X\"?" | deleteData | QMessageBox::warning Yes/No |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | przycisk "Manage Groups" | - |
| ListGroups → AddGroup | przycisk Add | QString* group (output) |
| ListGroups → EditGroup | przycisk Edit / double-click | groupname (text col 0) |
| ListGroups → RenameGroup | przycisk Rename | groupname (text col 0) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Kolumny Default Type, Traffic/Music Report, Now&Next | nie widoczne (obcięte) | obecne w kodzie | okno za wąskie na screenshot |

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

---

# UI Contract: Edit Group

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditGroup |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Group: {groupname} |
| Modalność | modal |
| Rodzic | ListGroups / AddGroup |
| Rozmiar | 500x524 (resizable, minimum) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_group.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.group_dialog.png |
| Mockup HTML | ✅ | mockups/EditGroup.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| group | QString (group name) | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| group_name_edit | QLineEdit | &Group Name: | readonly, maxLength=10 | - |
| group_description_edit | QLineEdit | Group &Description: | edycja, maxLength=255 | - |
| group_title_edit | QLineEdit | Default Import &Title: | edycja, maxLength=255 | - |
| group_notify_email_addrs_edit | QLineEdit | Notification E-Mail Addresses: | edycja | - |
| group_carttype_box | QComboBox | Default Cart &Type: | Audio / Macro | - |
| group_lowcart_box | QSpinBox | Default Cart Number: | 0-999999, special="None" | lowCartChangedData(int) |
| group_highcart_box | QSpinBox | to | 1-999999 | - |
| group_enforcerange_box | QCheckBox | Enforce Cart Range | - | - |
| group_traffic_check | QCheckBox | Include this group in Traffic reports | - | - |
| group_music_check | QCheckBox | Include this group in Music reports | - | - |
| group_cutlife_check | QCheckBox | Set End Date/Time to | toggle spin | cutLifeEnabledData(bool) |
| group_cutlife_spin | QSpinBox | (days) | 0-999 | - |
| group_shelflife_check | QCheckBox | Purge expired cuts after | toggle spin | purgeEnabledData(bool) |
| group_shelflife_spin | QSpinBox | (days) | 0-30 | - |
| group_delete_carts_check | QCheckBox | Delete cart if empty | - | - |
| group_nownext_check | QCheckBox | Transmit Now & Next data | - | - |
| group_svcs_sel | RDListSelector | Available Services / Active Services | przenoszenie serwisów | - |
| group_color_button | QPushButton | C&olor | otwiera QColorDialog | colorData() |
| group_ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| group_cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Low cart = 0 | domyślnie brak zakresu | high cart disabled, enforce range disabled | group_highcart_box, group_enforcerange_box |
| Low cart > 0 | ustawiony zakres | high cart enabled (min=low), enforce range enabled | - |
| Cut life unchecked | domyślnie | spin days disabled | group_cutlife_spin |
| Cut life checked | user włączył | spin days enabled | - |
| Shelf life unchecked | domyślnie | spin days disabled, delete carts disabled | group_shelflife_spin, group_delete_carts_check |
| Shelf life checked | user włączył | spin days enabled, delete carts enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| cart range | konflikt z innymi grupami | "The selected cart range conflicts with the following groups:...\nDo you still want to save?" | okData (CheckRange) | QMessageBox::warning Yes/No |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListGroups / AddGroup | edit / double-click / po dodaniu | group name |
| EditGroup → QColorDialog | przycisk Color | current color |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Screenshot odpowiada kodowi |

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

---

# UI Contract: Autofill Carts

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AutofillCarts |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Autofill Carts - Service: {svcname} |
| Modalność | modal |
| Rodzic | EditGroup (via service config) |
| Rozmiar | 375x310 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/autofill_carts.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.autofill_carts_dialog.png |
| Mockup HTML | ✅ | mockups/AutofillCarts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | RDSvc* | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_cart_list | Q3ListView | (Cart, Length, Title, Artist) | wyświetla listę autofill cartów | - |
| add_button | QPushButton | &Add | otwiera RDCartDialog (audio only) | addData() |
| delete_button | QPushButton | &Delete | usuwa wybrany cart z listy | deleteData() |
| ok_button | QPushButton | &OK | zapisuje do DB | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

### Kolumny Q3ListView
| # | Nagłówek | Alignment | Źródło |
|---|----------|-----------|--------|
| 0 | Cart | center | AUTOFILLS.CART_NUMBER (format %06d) |
| 1 | Length | right | CART.FORCED_LENGTH (RDGetTimeLength) |
| 2 | Title | left | CART.TITLE |
| 3 | Artist | left | CART.ARTIST |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak autofill cartów | pusta lista | brak |
| Lista wypełniona | są autofill carty | lista cartów z metadanymi | brak |
| Brak zaznaczenia | nic nie wybrane | Delete nie działa (early return) | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | brak walidacji | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditGroup (service config) | przycisk Autofill Carts | RDSvc* |
| AutofillCarts → RDCartDialog | przycisk Add | filter: RDCart::Audio |

## Logika biznesowa
- Lista sortowana po kolumnie Length (sortColumn=1)
- OK: czyści AUTOFILLS dla danego serwisu, wstawia od nowa
- Cancel: done(1) bez zmian

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Screenshot odpowiada kodowi |

---

# UI Contract: RDAdmin - Services

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListSvcs |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Services |
| Modalność | modal |
| Rodzic | QWidget *parent (main admin window) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_svcs.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.services_dialog.png |
| Mockup HTML | ✅ | mockups/ListSvcs.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box | Q3ListBox | Services: | Wyświetla listę nazw serwisów z DB (SERVICES.NAME) | - |
| list_box (doubleClicked) | Q3ListBox | - | Otwiera EditSvc dla wybranego serwisu | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddSvc dialog | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditSvc dla zaznaczonego serwisu | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany serwis po potwierdzeniu | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (done(0)) | closeData() |
| list_title_label | QLabel | &Services: | Etykieta nad listą | - |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lista serwisów z DB, 4 przyciski po prawej | list_close_button.default=true |
| Brak zaznaczenia | currentItem < 0 | Edit/Delete nie robią nic (early return) | - |
| Po dodaniu | Po powrocie z AddSvc | Lista odświeżona, nowy serwis zaznaczony | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Potwierdzenie usunięcia | "Are you sure you want to delete service {name}?" | deleteData() | QMessageBox::warning |
| delete | Potwierdzenie logów | "There are N logs owned by this service that will also be deleted.\nDo you still want to proceed?" | deleteData() gdy istnieją logi | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSvcs → AddSvc | Klik "Add" | QString *svcname (output) |
| ListSvcs → EditSvc | Klik "Edit" lub double-click | QString svc (currentText) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Zgodne | Zgodne | Layout dynamiczny via resizeEvent |

---

# UI Contract: RDAdmin - Add Service

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddSvc |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Service |
| Modalność | modal |
| Rodzic | ListSvcs |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_svc.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddSvc.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svcname | QString* | caller (output param) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_name_edit | QLineEdit | &New Service Name: | Wpisz nazwę serwisu (max 10 znaków, no spaces/tabs) | - |
| svc_exemplar_box | QComboBox | Base Service On: | Wybierz wzorzec (Empty Host Config lub istniejący serwis) | - |
| ok_button | QPushButton | &OK | Tworzy serwis, otwiera EditSvc | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka dialog (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Pusta nazwa, exemplar = "Empty Host Config" + lista serwisów | ok_button.default=true |
| Po OK | Walidacja OK | Tworzy serwis, otwiera EditSvc | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| svc_name_edit | Nie może być puste | "You must give the service a name!" | okData() | QMessageBox::warning |
| svc_name_edit | Max 10 chars, no spaces/tabs | (walidator blokuje input) | input | RDTextValidator |
| svc_name_edit | Serwis nie może istnieć | "Error" + err_msg | okData(), RDSvc::create fails | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSvcs → AddSvc | Klik "Add" | QString *svcname |
| AddSvc → EditSvc | Po udanym create | QString svc_name_edit->text() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: RDAdmin - Edit Service

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSvc |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Service |
| Modalność | modal |
| Rodzic | ListSvcs / AddSvc |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_svc.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_service_dialog.png |
| Mockup HTML | ✅ | mockups/EditSvc.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | QString | Nazwa serwisu (z ListSvcs/AddSvc) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_name_edit | QLineEdit | &Service Name: | Wyświetla nazwę serwisu (readOnly) | - |
| svc_description_edit | QLineEdit | Service &Description: | Opis serwisu (max 255) | - |
| svc_program_code_edit | QLineEdit | &Program Code: | Kod programowy (max 255) | - |
| svc_name_template_edit | QLineEdit | Log Name &Template: | Szablon nazwy logu (max 255, no spaces) | - |
| svc_description_template_edit | QLineEdit | Log &Description Template: | Szablon opisu logu (max 255) | - |
| svc_sub_event_inheritance_box | QComboBox | Inline Event Start/Length: | "From Relative Position" / "From Scheduler File" | textChangedData() |
| svc_voice_group_box | QComboBox | Voicetrack Group: | [none] + grupy z DB | - |
| svc_autospot_group_box | QComboBox | AutoSpot Group: | [none] + grupy z DB | - |
| svc_chain_box | QCheckBox | Insert CHAIN TO at log end | Toggle chain-to | - |
| svc_autorefresh_box | QCheckBox | Enable AutoRefresh By Default | Toggle auto-refresh | - |
| (autofill button) | QPushButton | Configure \n&Autofill Carts | Otwiera AutofillCarts dialog | autofillData() |
| (enable hosts button) | QPushButton | Enable &Hosts | Otwiera EditSvcPerms dialog | enableHostsData() |
| svc_loglife_box | QCheckBox | Set Logs to auto-delete | Włącza auto-usuwanie logów | toggles svc_loglife_spin |
| svc_loglife_spin | QSpinBox | (days) | Ilość dni (0-365) | - |
| svc_loglifeorigin_box | QComboBox | (after) | "air date" / "creation" | - |
| svc_shelflife_box | QCheckBox | Purge ELR Data | Włącza czyszczenie ELR | toggles svc_shelflife_spin |
| svc_shelflife_spin | QSpinBox | (days after airing) | Ilość dni (0-365) | - |
| svc_import_markers_check | QCheckBox | Include Import Markers in Finished Logs | Toggle import markers | - |
| svc_tfc_path_edit | QLineEdit | Import Path: | Ścieżka importu ruchu (max 191) | textChangedData() |
| svc_tfc_preimport_cmd_edit | QLineEdit | Preimport Command: | Komenda pre-import ruchu | textChangedData() |
| svc_tfc_label_cart_edit | QLineEdit | Insert Marker String: | String markera ruchu (max 32) | textChangedData() |
| svc_tfc_track_edit | QLineEdit | Insert Voice Track String: | String voice track ruchu (max 32) | textChangedData() |
| svc_tfc_import_template_box | QComboBox | Import Template: | [custom] + szablony z DB | tfcTemplateActivatedData() |
| svc_tfc_fields | ImportFields | (embedded widget) | Pola parsera ruchu (Offset/Length) | - |
| (tfc test button) | QPushButton | Test \n&Traffic | Otwiera TestImport (Traffic) | trafficData() |
| svc_tfc_copy_button | QPushButton | Copy To\nCustom | Kopiuje template do custom | trafficCopyData() |
| svc_mus_path_edit | QLineEdit | Import Path: | Ścieżka importu muzyki (max 191) | textChangedData() |
| svc_mus_preimport_cmd_edit | QLineEdit | Preimport Command: | Komenda pre-import muzyki | textChangedData() |
| svc_mus_label_cart_edit | QLineEdit | Insert Marker String: | String markera muzyki (max 32) | textChangedData() |
| svc_mus_track_edit | QLineEdit | Insert Voice Track String: | String voice track muzyki (max 255) | textChangedData() |
| svc_mus_break_edit | QLineEdit | Insert Traffic Break String: | String przerwy reklamowej (max 255) | textChangedData() |
| svc_mus_import_template_box | QComboBox | Import Template: | [custom] + szablony z DB | musTemplateActivatedData() |
| svc_mus_fields | ImportFields | (embedded widget) | Pola parsera muzyki (Offset/Length) | - |
| (mus test button) | QPushButton | Test \n&Music | Otwiera TestImport (Music) | musicData() |
| svc_mus_copy_button | QPushButton | Copy To\nCustom | Kopiuje template do custom | musicCopyData() |
| (ok button) | QPushButton | &OK | Zapisuje i zamyka (done(0)) | okData() |
| (cancel button) | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Wszystkie pola wypełnione z DB | svc_name_edit readOnly |
| Template != [custom] | Template wybrany | ImportFields disabled, Copy To Custom enabled | svc_tfc_fields/svc_mus_fields disabled |
| Template == [custom] | [custom] wybrany | ImportFields enabled, Copy To Custom disabled | svc_tfc_copy_button/svc_mus_copy_button disabled |
| Log auto-delete off | svc_loglife_box unchecked | Spin i origin disabled | svc_loglife_spin, svc_loglifeorigin_box, svc_loglifeorigin_label disabled |
| ELR purge off | svc_shelflife_box unchecked | Spin disabled | svc_shelflife_spin disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Copy Traffic | Potwierdzenie | "This action will overwrite your existing [custom] Traffic Data Import settings. Continue?" | trafficCopyData() | QMessageBox::question |
| Copy Music | Potwierdzenie | "This action will overwrite your existing [custom] Music Data Import settings. Continue?" | musicCopyData() | QMessageBox::question |
| Test import | Zapis wymagany | "Before testing, the import configuration\nmust be saved. Save now?" | trafficData()/musicData() gdy zmienione | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSvcs/AddSvc → EditSvc | Klik "Edit"/double-click/po create | QString svc (nazwa serwisu) |
| EditSvc → AutofillCarts | Klik "Configure Autofill Carts" | RDSvc *svc_svc |
| EditSvc → EditSvcPerms | Klik "Enable Hosts" | RDSvc *svc_svc |
| EditSvc → TestImport | Klik "Test Traffic"/"Test Music" | RDSvc *svc_svc, RDSvc::ImportSource |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Screenshot niskiej rozdzielczości | Zgodne z kodem | Layout statyczny, sizeHint=870x691 |

---

# UI Contract: RDAdmin - Service: {name}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSvcPerms |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Service: {svc_name} |
| Modalność | modal |
| Rodzic | EditSvc |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_svc_perms.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditSvcPerms.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | RDSvc* | EditSvc (svc_svc) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_host_sel | RDListSelector | Available Hosts / Enabled Hosts | Dual-list selector: przenoszenie hostów między listami | - |
| ok_button | QPushButton | &OK | Zapisuje uprawnienia do DB i zamyka (done(0)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lewa lista: Available Hosts (stacje bez uprawnienia), Prawa: Enabled Hosts (z uprawnieniami) | ok_button.default=true |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSvc → EditSvcPerms | Klik "Enable Hosts" | RDSvc *svc |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | sizeHint=400x212 |

---

# UI Contract: RDAdmin - Test Traffic/Music Import

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | TestImport |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Test Traffic Import / RDAdmin - Test Music Import |
| Modalność | modal |
| Rodzic | EditSvc |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/test_import.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.test_import_dialog.png |
| Mockup HTML | ✅ | mockups/TestImport.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | RDSvc* | EditSvc (svc_svc) | tak |
| src | RDSvc::ImportSource | Traffic lub Music | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| test_date_edit | Q3DateEdit | Test Date: | Wybór daty testowej (default: dziś) | dateChangedData() |
| (select button) | QPushButton | &Select | Otwiera RDDateDialog | selectData() |
| test_import_button | QPushButton | &Import | Uruchamia import testowy | importData() |
| test_filename_edit | QLineEdit | Using source file: | Wyświetla ścieżkę pliku źródłowego (readOnly) | - |
| test_events_list | RDListView | Imported Events | Tabela wynikowa: ikona, Start Time, Cart, Len, Title, GUID, Event ID, Annc Type, Line | - |
| test_close_button | QPushButton | &Close | Zamyka dialog (done(0)) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Data = dziś, pusta lista eventów, ścieżka pliku wypełniona | - |
| Po imporcie | Po klik Import | Lista wypełniona importowanymi eventami z ikonami typu | - |
| Błąd importu | Import nie powiódł się | Komunikat "There was an error during import" | QMessageBox::information |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| import | Import musi się powieść | "There was an error during import\nplease check your settings and try again." | importData() | QMessageBox::information |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSvc → TestImport | Klik "Test Traffic"/"Test Music" | RDSvc*, RDSvc::ImportSource |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Test Music Import" | Dynamiczny (Traffic/Music) | Screenshot pokazuje wariant Music |
| Kolumna Annc Type | Nie widoczna (scrollbar) | Zdefiniowana w kodzie | Kolumna 7 |

---

# UI Contract: Import Parser Fields

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ImportFields |
| Typ | Widget (RDWidget) |
| Tytuł okna | (brak - widget osadzony) |
| Modalność | N/A (embedded) |
| Rodzic | EditSvc (dwa instancje: svc_tfc_fields i svc_mus_fields) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/importfields.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.import_parser_fields.png |
| Mockup HTML | ✅ | mockups/ImportFields.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak konstruktor params) | - | - | - |
| svc + type (via setFields) | RDSvc*, RDSvc::ImportSource | EditSvc | tak (po konstrukcji) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| cart_offset_spin | QSpinBox | Cart Number: Offset: | Offset pola cart (0-1024) | valueChangedData() |
| cart_length_spin | QSpinBox | Length: | Długość pola cart (0-6) | valueChangedData() |
| title_offset_spin | QSpinBox | Title: Offset: | Offset pola title (0-1024) | valueChangedData() |
| title_length_spin | QSpinBox | Length: | Długość pola title (0-255) | valueChangedData() |
| hours_offset_spin | QSpinBox | Start Time - Hours: Offset: | Offset godzin startu (0-MAX) | valueChangedData() |
| hours_length_spin | QSpinBox | Length: | Długość godzin startu (0-8) | valueChangedData() |
| minutes_offset_spin | QSpinBox | Start Time - Minutes: Offset: | Offset minut startu (0-MAX) | valueChangedData() |
| minutes_length_spin | QSpinBox | Length: | Długość minut startu (0-8) | valueChangedData() |
| seconds_offset_spin | QSpinBox | Start Time - Seconds: Offset: | Offset sekund startu (0-MAX) | valueChangedData() |
| seconds_length_spin | QSpinBox | Length: | Długość sekund startu (0-8) | valueChangedData() |
| len_hours_offset_spin | QSpinBox | Length - Hours: Offset: | Offset godzin długości (0-MAX) | valueChangedData() |
| len_hours_length_spin | QSpinBox | Length: | Długość godzin długości (0-8) | valueChangedData() |
| len_minutes_offset_spin | QSpinBox | Length - Minutes: Offset: | Offset minut długości (0-MAX) | valueChangedData() |
| len_minutes_length_spin | QSpinBox | Length: | Długość minut długości (0-8) | valueChangedData() |
| len_seconds_offset_spin | QSpinBox | Length - Seconds: Offset: | Offset sekund długości (0-MAX) | valueChangedData() |
| len_seconds_length_spin | QSpinBox | Length: | Długość sekund długości (0-8) | valueChangedData() |
| data_offset_spin | QSpinBox | Globally Unique ID: Offset: | Offset GUID (0-MAX) | valueChangedData() |
| data_length_spin | QSpinBox | Length: | Długość GUID (0-32) | valueChangedData() |
| event_id_offset_spin | QSpinBox | Event ID: Offset: | Offset Event ID (0-MAX) | valueChangedData() |
| event_id_length_spin | QSpinBox | Length: | Długość Event ID (0-8) | valueChangedData() |
| annctype_offset_spin | QSpinBox | Annc. Type: Offset: | Offset typu ogłoszenia (0-MAX) | valueChangedData() |
| annctype_length_spin | QSpinBox | Length: | Długość typu ogłoszenia (0-8) | valueChangedData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po setFields() | Wszystkie spiny wypełnione z DB | - |
| Disabled | Template != [custom] | Wszystkie spiny disabled | setEnabled(false) |
| Enabled | Template == [custom] | Wszystkie spiny edytowalne | setEnabled(true) |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | Walidacja via QSpinBox range | (blokuje input) | input | QSpinBox min/max |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSvc (embedded) | Osadzony widget | setFields(RDSvc*, RDSvc::ImportSource) / readFields() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Zgodne | Zgodne | Screenshot pokazuje fragment EditSvc z ImportFields |

---

# UI Contract: RDAdmin - Host Variables for {station}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListHostvars |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Host Variables for {station} |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_hostvars.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.host_variables_dialog.png |
| Mockup HTML | ✅ | mockups/ListHostvars.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | EditStation (nazwa stacji) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | Q3ListView | Host Variables | Tabela 3-kolumnowa: NAME, VALUE, REMARK | - |
| list_view (doubleClicked) | Q3ListView | - | Otwiera EditHostvar | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddHostvar | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditHostvar dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybraną zmienną po potwierdzeniu | deleteData() |
| list_ok_button | QPushButton | &OK | Zapisuje wszystkie zmienne do DB i zamyka (done(0)) | okData() |
| list_cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |
| list_title_label | QLabel | Host Variables | Etykieta nad tabelą | - |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lista zmiennych z DB dla stacji, 3 przyciski + OK/Cancel | list_ok_button.default=true |
| Brak zaznaczenia | selectedItem == NULL | Edit/Delete nie robią nic (early return) | - |
| Po dodaniu | Po powrocie z AddHostvar | Nowy element w liście | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| delete | Potwierdzenie usunięcia | "Are you sure you want to delete the variable {name}?" | deleteData() | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation → ListHostvars | Klik "Host Variables" | QString station |
| ListHostvars → AddHostvar | Klik "Add" | QString station, QString* varname/value/remark |
| ListHostvars → EditHostvar | Klik "Edit"/double-click | QString station, var name, QString* value/remark |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Host Variables for GAZERBEAM" | Dynamiczny z parametrem station | Zgodne |

---

# UI Contract: RDAdmin - Add Host Variable

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddHostvar |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Host Variable |
| Modalność | modal |
| Rodzic | ListHostvars |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_hostvar.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddHostvar.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | ListHostvars | tak |
| var | QString* | output - nazwa zmiennej | tak |
| varvalue | QString* | output - wartość zmiennej | tak |
| remark | QString* | output - komentarz | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_name_edit | QLineEdit | Variable Name: | Wpisz nazwę zmiennej (max 32) | - |
| add_varvalue_edit | QLineEdit | Variable Value: | Wpisz wartość zmiennej (max 255) | - |
| add_remark_edit | QLineEdit | Remark: | Wpisz komentarz (max 255) | - |
| ok_button | QPushButton | &OK | Waliduje i zamyka (done(0)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | 3 puste pola, OK/Cancel | ok_button.default=true |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| add_name_edit | Musi zaczynać i kończyć się na %, min 3 znaki | "The variable name is invalid." | okData() | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListHostvars → AddHostvar | Klik "Add" | QString station, QString* var/varvalue/remark |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | sizeHint=385x150 |

---

# UI Contract: RDAdmin - Edit Host Variable

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditHostvar |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Host Variable |
| Modalność | modal |
| Rodzic | ListHostvars |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_hostvar.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_host_variable_dialog.png |
| Mockup HTML | ✅ | mockups/EditHostvar.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | ListHostvars | tak |
| var | QString | Nazwa zmiennej (readOnly) | tak |
| varvalue | QString* | Wartość zmiennej (in/out) | tak |
| remark | QString* | Komentarz (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_name_edit | QLineEdit | Variable Name: | Wyświetla nazwę zmiennej (readOnly) | - |
| edit_varvalue_edit | QLineEdit | Variable Value: | Edycja wartości zmiennej (max 255) | - |
| edit_remark_edit | QLineEdit | Remark: | Edycja komentarza (max 255) | - |
| ok_button | QPushButton | &OK | Zapisuje i zamyka (done(0)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Nazwa readOnly, wartość i remark edytowalne | ok_button.default=true, edit_name_edit readOnly |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListHostvars → EditHostvar | Klik "Edit"/double-click | QString station, QString var, QString* varvalue/remark |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Edit Host Variable" | "RDAdmin - Edit Host Variable" | Screenshot nie pokazuje pełnego tytułu paska |

---

# UI Contract: RDAdmin - Rivendell Dropbox Configurations on {station}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListDropboxes |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Dropbox Configurations on {stationname} |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_dropboxes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_dropbox_configurations_dialog.png |
| Mockup HTML | ✅ | mockups/ListDropboxes.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| stationname | const QString& | EditStation (nazwa stacji) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_dropboxes_view | RDListView | (tabela) | 11 kolumn: ID, Group, Path, Normalization Level, Autotrim Level, To Cart, Use CartChunk ID, Delete Cuts, Metadata Pattern, Fix Broken Formats, User Defined | - |
| list_dropboxes_view (doubleClicked) | RDListView | - | Otwiera EditDropbox | doubleClickedData() |
| list_add_button | QPushButton | &Add | Tworzy nowy dropbox, otwiera EditDropbox | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditDropbox dla wybranego | editData() |
| list_duplicate_button | QPushButton | D&uplicate | Duplikuje dropbox, otwiera EditDropbox | duplicateData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany dropbox (bez potwierdzenia) | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (done(0)) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lista dropboxów z DB, 5 przycisków po prawej | list_close_button.default=true |
| Brak zaznaczenia | selectedItem == NULL | Edit/Duplicate/Delete nie robią nic (early return) | - |
| Po dodaniu | Po powrocie z EditDropbox (OK) | Nowy element w liście, zaznaczony | Wysyła RDNotification::AddAction |
| Po duplikacji | Po powrocie z EditDropbox (OK) | Zduplikowany element w liście | Wysyła RDNotification::AddAction |
| Po edycji | Po powrocie z EditDropbox (OK) | Element odświeżony | Wysyła RDNotification::ModifyAction |
| Po usunięciu | deleteData() | Element usunięty z listy | Wysyła RDNotification::DeleteAction |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | Usunięcie bez potwierdzenia | - | deleteData() | Bezpośrednie usunięcie |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation → ListDropboxes | Klik "Dropboxes" | const QString& stationname |
| ListDropboxes → EditDropbox | Add/Edit/Duplicate | int id, bool duplicate |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Przycisk "Duplicate" | Widoczny | W kodzie | Zgodne |
| Kolumny | Częściowo widoczne (scrollbar) | 11 kolumn w kodzie | Screenshot obcięty |

---

# UI Contract: RDAdmin - Dropbox Configuration [ID: N]

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditDropbox |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Dropbox Configuration [ID: {id}] |
| Modalność | modal (implicit, no setModal call but exec()) |
| Rodzic | ListDropboxes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_dropbox.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.dropbox_configuration_dialog.png |
| Mockup HTML | ✅ | mockups/EditDropbox.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int | ListDropboxes (dropbox ID) | tak |
| duplicate | bool | true jeśli duplikacja | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| box_group_name_box | QComboBox | Default Group: | Wybór grupy docelowej z DB | - |
| box_path_edit | QLineEdit | &Path Spec: | Ścieżka dropboxa (max 255) | - |
| (path select button) | QPushButton | Select | Otwiera QFileDialog (dir) | selectPathData() |
| box_to_cart_edit | QLineEdit | To &Cart: | Numer carta docelowego (1-999999, max 6 znaków) | - |
| box_select_cart_button | QPushButton | Select | Otwiera RDCartDialog | selectCartData() |
| box_delete_cuts_box | QCheckBox | Delete cuts before importing | Toggle delete cuts | - |
| box_metadata_pattern_edit | QLineEdit | &Metadata Pattern: | Wzorzec metadanych (max 64) | - |
| box_user_defined_edit | QLineEdit | &User Defined: | Pole użytkownika (max 255) | - |
| box_log_to_syslog_check | QCheckBox | Log events in Syslog | Toggle syslog logging | disables log_path_edit |
| box_log_path_edit | QLineEdit | &Log File: | Ścieżka pliku logu (max 255) | - |
| box_log_path_button | QPushButton | Select | Otwiera QFileDialog (save) | selectLogPathData() |
| box_schedcodes_button | QPushButton | Scheduler Codes | Otwiera RDSchedCodesDialog | schedcodesData() |
| box_delete_source_box | QCheckBox | Delete source files after import | Toggle delete source | - |
| box_send_email_box | QCheckBox | Send e-mail reports | Toggle email reports | - |
| box_force_to_mono_box | QCheckBox | Force to Monaural | Toggle mono | - |
| box_normalization_box | QCheckBox | Normalize Levels | Toggle normalizacji | normalizationToggledData() |
| box_normalization_level_spin | QSpinBox | Level: {dBFS} | Poziom normalizacji (-100..-1) | - |
| box_autotrim_box | QCheckBox | Autotrim Cuts | Toggle autotrim | autotrimToggledData() |
| box_autotrim_level_spin | QSpinBox | Level: {dBFS} | Poziom autotrim (-100..-1) | - |
| box_segue_box | QCheckBox | Insert Segue Markers | Toggle segue | segueToggledData() |
| box_segue_level_spin | QSpinBox | Segue Level: {dBFS} | Poziom segue (-100..0) | - |
| box_segue_length_spin | QSpinBox | Segue Length: {msec} | Długość segue (0-180000) | - |
| box_use_cartchunk_id_box | QCheckBox | Get cart number from CartChunk CutID | Toggle CartChunk ID | - |
| box_title_from_cartchunk_id_box | QCheckBox | Get cart title from CartChunk CutID | Toggle title from CartChunk | - |
| box_fix_broken_formats_box | QCheckBox | Attempt to work around malformatted input files | Toggle fix broken | - |
| box_startoffset_spin | QSpinBox | Offset start date by {days} | Offset daty startu (-7..7) | - |
| box_endoffset_spin | QSpinBox | Offset end date by {days} | Offset daty końca (-7..7) | - |
| box_create_dates_box | QCheckBox | Create Dates when no Dates Exist | Toggle tworzenia dat | createDatesToggledData() |
| box_create_startdate_offset_spin | QSpinBox | Create start date offset: {days} | Offset daty startu (-180..180) | - |
| box_create_enddate_offset_spin | QSpinBox | Create end date offset: {days} | Offset daty końca (-180..180) | - |
| reset_button | QPushButton | &Reset | Resetuje listę zaimportowanych plików | resetData() |
| ok_button | QPushButton | &OK | Zapisuje konfigurację i zamyka (done(true)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(false)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Wszystkie pola wypełnione z DB | ok_button.default=true |
| Duplicate mode | duplicate=true | OK disabled do zmiany ścieżki | ok_button.enabled=false, focus na box_path_edit |
| Normalization off | box_normalization_box unchecked | Level spin/label/unit disabled | normalizationToggledData(false) |
| Autotrim off | box_autotrim_box unchecked | Level spin/label/unit disabled | autotrimToggledData(false) |
| Segue off | box_segue_box unchecked | Segue level/length/labels disabled, values reset | segueToggledData(false) |
| Create dates off | box_create_dates_box unchecked | Start/end date offset spins disabled, values reset to 0 | createDatesToggledData(false) |
| Syslog on | box_log_to_syslog_check checked | Log file path/button/label disabled | toggled(bool) |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| box_to_cart_edit | QIntValidator(1-999999) | (blokuje input) | input | QIntValidator |
| create dates | EndDate offset >= StartDate offset | "The Create EndDate Offset is less than the Create Start Date Offset!" | okData() | QMessageBox::warning |
| reset | Potwierdzenie | "Resetting the dropbox will clear the list of already imported files..." + "Reset the dropbox?" | resetData() | QMessageBox::question |
| reset | Info po resecie | "The dropbox has been reset." | resetData() po OK | QMessageBox::information |
| duplicate | Ścieżka musi być zmieniona | OK disabled gdy ścieżka nie zmieniona | pathChangedData() | ok_button.setEnabled() |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListDropboxes → EditDropbox | Add/Edit/Duplicate | int id, bool duplicate |
| EditDropbox → QFileDialog | Select (path) | directory selection |
| EditDropbox → RDCartDialog | Select (cart) | cart number |
| EditDropbox → QFileDialog | Select (log) | file save selection |
| EditDropbox → RDSchedCodesDialog | Scheduler Codes | QStringList schedcodes |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Screenshot niskiej rozdzielczości | Zgodne z kodem | sizeHint=490x666 |

---

# UI Contract: Rivendell Host List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListStations |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Host List |
| Modalność | modal |
| Rodzic | MainWidget (RDAdmin main window) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_stations.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_host_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListStations.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box | Q3ListBox | Hosts: | Wyświetla listę stacji z DB (STATIONS.NAME) | doubleClicked → doubleClickedData → editData |
| list_add_button | QPushButton | &Add | Otwiera AddStation dialog | clicked → addData |
| list_edit_button | QPushButton | &Edit | Otwiera EditStation dla wybranej stacji | clicked → editData |
| list_delete_button | QPushButton | &Delete | Usuwa wybraną stację po potwierdzeniu | clicked → deleteData |
| list_close_button | QPushButton | &Close | Zamyka dialog (default button) | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | Brak stacji w DB | Pusta lista, wszystkie przyciski aktywne | - |
| Lista załadowana | Stacje istnieją | Lista z nazwami stacji (STATIONS.NAME) | - |
| Brak zaznaczenia | Nic nie wybrano | Edit/Delete nie reagują (early return) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Usuwanie stacji | Potwierdzenie Yes/No | "Are you sure you want to delete host \"{name}\"?" | Klik Delete | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Przycisk "Manage Hosts" | (brak) |
| ListStations → AddStation | Przycisk Add | &stationname (out param) |
| ListStations → EditStation | Przycisk Edit / Double-click | list_box->currentText() (station name) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Rivendell Host List" | "RDAdmin - Rivendell Host List" | Screenshot obcina prefix |
| Rozmiar | ~500x300 | sizeHint 500x300 | Zgodne |

---

# UI Contract: Add Host

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddStation |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Host |
| Modalność | modal |
| Rodzic | ListStations |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_station.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddStation.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| stationname | QString* (out) | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_name_edit | QLineEdit | New &Host Name: | Nazwa nowej stacji, max 64 znaków, RDTextValidator | - |
| add_exemplar_box | QComboBox | Base Host On: | Wybór wzorca stacji ("Empty Host Config" + lista STATIONS) | - |
| ok_button | QPushButton | &OK | Tworzy stację i otwiera EditStation (default) | clicked → okData |
| cancel_button | QPushButton | &Cancel | Zamyka dialog z kodem -1 | clicked → cancelData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Nowa stacja | Otwarcie dialogu | Puste pole nazwy, exemplar = "Empty Host Config" | - |
| Klonowanie | Wybrany exemplar | Pole nazwy puste, wybrany wzorzec z listy | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| add_name_edit | Nie może być puste | "You must give the host a name!" | OK click | QMessageBox::warning |
| RDStation::create | Musi się powieść | "Unable to create host!" + err_msg | OK click, create fails | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListStations | Przycisk Add | &stationname (out param) |
| AddStation → EditStation | Po udanym create, automatycznie | add_name_edit->text() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | brak screenshota | - | - |

---

# UI Contract: Host Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditStation |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Host: {sname} |
| Modalność | modal |
| Rodzic | ListStations / AddStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_station.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.host_dialog.png |
| Mockup HTML | ✅ | mockups/EditStation.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| sname | QString | caller (station name) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| station_name_edit | QLineEdit (readOnly) | Ho&st Name: | Wyświetla nazwę stacji | - |
| station_short_name_edit | QLineEdit | Short Name: | Krótka nazwa, max 64 | - |
| station_description_edit | QLineEdit | &Description: | Opis, max 64, RDTextValidator | - |
| station_default_name_edit | QComboBox | Default &User: | Lista użytkowników z USERS.LOGIN_NAME | - |
| station_address_edit | QLineEdit | &IP Address: | Adres IP stacji, max 15 | - |
| station_audio_editor_edit | QLineEdit | Audio Editor: | Ścieżka do edytora audio, max 191 | - |
| station_report_editor_edit | QLineEdit | Report Editor: | Ścieżka do edytora raportów, max 191 | - |
| station_web_browser_edit | QLineEdit | Web Browser: | Ścieżka przeglądarki, max 191 | - |
| station_ssh_identity_file_edit | QLineEdit | SSH Ident. File: | Ścieżka klucza SSH, max 191 | - |
| station_timeoffset_box | QSpinBox | &Time Offset: | Offset czasu w mS, range -MAX..+MAX | - |
| station_startup_cart_edit | QLineEdit | &Startup Cart: | Numer cart startowego, walidator 1-MAX_CART | - |
| station_startup_select_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → selectClicked |
| station_cue_sel | RDCardSelector | Cue &Output: | Wybór karty/portu wyjścia cue | - |
| station_start_cart_edit | QLineEdit | Start Cart: | Cart startu cue, macro validator | - |
| station_start_cart_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → startCartClickedData |
| station_stop_cart_edit | QLineEdit | Stop Cart: | Cart stopu cue, macro validator | - |
| station_stop_cart_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → stopCartClickedData |
| station_heartbeat_box | QCheckBox | Enable Heartbeat | Włącza heartbeat | toggled → heartbeatToggledData |
| station_filter_box | QCheckBox | Use Realtime Filtering | Filtrowanie synchroniczne | - |
| station_hbcart_edit | QLineEdit | Cart: | Numer cart heartbeat | - |
| station_hbcart_button | QPushButton | Select | Otwiera RDCartDialog (macro) | clicked → heartbeatClickedData |
| station_hbinterval_spin | QSpinBox | Interval: | 1-300 secs | - |
| station_maint_box | QCheckBox | Include in System Maintenance Pool | System maintenance | - |
| station_dragdrop_box | QCheckBox | Enable Drag & Drop | Drag & drop | toggled → enables panel_enforce |
| station_panel_enforce_box | QCheckBox | Allow Drops on Panels not in Setup Mode | Setup mode enforcement | - |
| station_http_station_box | QComboBox | HTTP Xport: | HTTP service host (localhost + STATIONS) | - |
| station_cae_station_box | QComboBox | Core Audio Engine: | CAE service host | activated → caeStationActivatedData |
| station_rdlibrary_button | QPushButton | RD&Library | Otwiera EditRDLibrary | clicked → editLibraryData |
| station_rdcatch_button | QPushButton | RDCatch | Otwiera EditDecks | clicked → editDeckData |
| station_rdairplay_button | QPushButton | RDAirPlay | Otwiera EditRDAirPlay | clicked → editAirPlayData |
| station_rdpanel_button | QPushButton | RDPanel | Otwiera EditRDPanel | clicked → editPanelData |
| station_rdlogedit_button | QPushButton | RDLogEdit | Otwiera EditRDLogedit | clicked → editLogEditData |
| station_rdcartslots_button | QPushButton | RDCart\nSlots | Otwiera EditCartSlots | clicked → editCartSlotsData |
| station_dropboxes_button | QPushButton | Dropboxes | Otwiera ListDropboxes | clicked → editDropboxesData |
| station_switchers_button | QPushButton | Switchers\nGPIO | Otwiera ListMatrices | clicked → editSwitcherData |
| station_hostvars_button | QPushButton | Host\nVariables | Otwiera ListHostvars | clicked → editHostvarsData |
| station_audioports_button | QPushButton | ASI Audio\nPorts | Otwiera EditAudioPorts | clicked → editAudioData |
| station_ttys_button | QPushButton | Serial\nPorts | Otwiera EditTtys | clicked → editTtyData |
| station_adapters_button | QPushButton | Audio\nResources | Otwiera ViewAdapters | clicked → viewAdaptersData |
| station_jack_button | QPushButton | JACK\nSettings | Otwiera EditJack | clicked → jackSettingsData |
| station_pypad_button | QPushButton | PyPAD\nInstances | Otwiera ListPypads | clicked → pypadInstancesData |
| station_ok_button | QPushButton | &OK | Zapisuje ustawienia (default) | clicked → okData |
| station_cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | clicked → cancelData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| CAE nie przeskanowane | station not scanned | Info message, Cue Output disabled | station_cue_sel disabled |
| Heartbeat off | checkbox unchecked | Cart, Interval, Select disabled | hbcart/interval/button disabled |
| Heartbeat on | checkbox checked | Cart, Interval, Select enabled | - |
| Drag&Drop off | checkbox unchecked | Panel enforce disabled | panel_enforce_box/label disabled |
| Drag&Drop on | checkbox checked | Panel enforce enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| station_maint_box | Min 1 stacja w maintenance pool | "At least one host must belong to the system maintenance pool!" | OK, unchecked, no others | QMessageBox::warning |
| station_address_edit | Valid IP address | "The specified IP address is invalid!" | OK click | QMessageBox::warning |
| station_hbcart_edit | Cart > 0 && <= 999999 | "The Heartbeat Cart number is invalid!" | OK + heartbeat on | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListStations | Edit button / Double-click | station name (QString) |
| AddStation | Auto po create | station name (QString) |
| EditStation → EditRDLibrary | RDLibrary button | station_station, station_cae_station |
| EditStation → EditDecks | RDCatch button | station_station, station_cae_station |
| EditStation → EditRDAirPlay | RDAirPlay button | station_station, station_cae_station |
| EditStation → EditRDPanel | RDPanel button | station_station, station_cae_station |
| EditStation → EditRDLogedit | RDLogEdit button | station_station, station_cae_station |
| EditStation → EditCartSlots | RDCartSlots button | station_station, station_cae_station |
| EditStation → ListDropboxes | Dropboxes button | station name |
| EditStation → ListMatrices | Switchers button | station name |
| EditStation → ListHostvars | Host Variables button | station name |
| EditStation → EditAudioPorts | Audio Ports button | station name |
| EditStation → EditTtys | Serial Ports button | station name |
| EditStation → ViewAdapters | Audio Resources button | station_station (RDStation*) |
| EditStation → EditJack | JACK Settings button | station_station (RDStation*) |
| EditStation → ListPypads | PyPAD Instances button | station_station (RDStation*) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Screenshot mały | Niskiej rozdzielczości miniaturka | sizeHint 415x765 | Zgodna proporcja |
| System Services groupbox | Widoczny na screenshot | station_systemservices_groupbox | Zgodne |

---

# UI Contract: Edit AudioScience Audio Ports

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditAudioPorts |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit AudioScience Audio Ports |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_audios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_audio_ports_dialog.png |
| Mockup HTML | ✅ | mockups/EditAudioPorts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | caller (station name) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_card_box | QComboBox | Card: | Wybór karty 0-7 | activated → cardSelectedData |
| card_driver_edit | QLineEdit (readOnly) | Card Driver: | Wyświetla typ sterownika | - |
| edit_clock_box | QComboBox | Clock Source: | Internal/AES-EBU/SP-DIFF/Word Clock | - |
| edit_type_box[0..7] | QComboBox | Type: | Analog/AES-EBU/SP-DIFF per input port | activated → inputMapData (via mapper) |
| edit_mode_box[0..7] | QComboBox | Mode: | Normal/Swap/Left only/Right only per input port | activated → inputMapData (via mapper) |
| edit_input_box[0..7] | QSpinBox | Ref. Level: | -26..6 dB per input port | - |
| edit_output_box[0..7] | QSpinBox | Ref. Level: | -26..6 dB per output port | - |
| help_button | QPushButton | &Help | Otwiera HelpAudioPorts dialog | clicked → helpData |
| close_button | QPushButton | &Close | Zapisuje bieżącą kartę i zamyka | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| HPI driver | cardDriver==Hpi | Wszystkie kontrolki aktywne | - |
| JACK driver | cardDriver==Jack | Type, Ref.Level (input/output) disabled; Mode enabled | Clock disabled |
| ALSA driver | cardDriver==Alsa | Type, Mode, Ref.Level all disabled | Clock disabled |
| No driver | cardDriver==None | Wszystkie kontrolki disabled | Clock disabled |
| Analog input (HPI) | Type=Analog && HPI | Input Ref.Level enabled | - |
| Digital input (HPI) | Type!=Analog && HPI | Input Ref.Level disabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak walidacji formularza) | - | - | - | Auto-save on card switch and close |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | ASI Audio Ports button | station name (QString) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Edit Audio Ports" | "Edit AudioScience Audio Ports" | Screenshot krótszy |
| Porty 0-7 | 2 rzędy po 4 | Zgodne (j*4+i layout) | Układ grid 2x4 |

---

# UI Contract: Configure RDCatch

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditDecks |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Configure RDCatch |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_decks.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdcatch_dialog.png |
| Mockup HTML | ✅ | mockups/EditDecks.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | caller | tak |
| cae_station | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_record_deck_box | QComboBox | Record Deck | Wybór decku nagrywającego 1-MAX_DECKS | activated → recordDeckActivatedData |
| edit_record_selector | RDCardSelector | Card/Port | Wybór karty/portu nagrywania | cardChanged → recordCardChangedData |
| edit_monitor_box | QSpinBox | Monitor Port: | -1(None)..MAX_PORTS-1 | valueChanged → monitorPortChangedData |
| edit_default_on_box | QComboBox | Monitor defaults to | Off/On | - |
| edit_format_box | QComboBox | Format: | PCM16/PCM24/MPEG Layer 2 | activated → formatActivatedData |
| edit_bitrate_box | QComboBox | Bit Rate: | 32-192 kbps/chan (10 opcji) | - |
| edit_swstation_box | QComboBox | Switcher Host: | [none] + STATIONS | activated → stationActivatedData |
| edit_swmatrix_box | QComboBox | Switcher Matrix: | Aktywne macierze wyjść | activated → matrixActivatedData |
| edit_swoutput_box | QComboBox | Switcher Output: | Wyjścia macierzy | - |
| edit_swdelay_box | QSpinBox | Switcher Delay: | 0-20 (1/10 sec) | - |
| edit_channels_box | QComboBox | Channels: | 1/2 | - |
| edit_threshold_box | QSpinBox | Trim Threshold: | -100..0 dB | - |
| edit_errorrml_edit | QLineEdit | Error RML: | RML komenda błędu (host-wide) | - |
| edit_play_deck_box | QComboBox | Play Deck | Wybór decku odtwarzającego | activated → playDeckActivatedData |
| edit_play_selector | RDCardSelector | Card/Port | Karta/port odtwarzania | settingsChanged → playSettingsChangedData |
| edit_event_edits[0..15] | QLineEdit | 1:-16: | Numery cartów zdarzeń | - |
| edit_event_buttons[0..15] | QPushButton | Select | Wybór carta zdarzenia | clicked → eventCartSelectedData (via mapper) |
| close_button | QPushButton | &Close | Zapisuje i zamyka (default) | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| CAE nie przeskanowane | !scanned | Info msg, record/play/monitor selectors disabled | Selectors disabled |
| Format != MPEG | format != 2 | Bit Rate disabled | bitrate disabled |
| Format == MPEG | format == 2 | Bit Rate enabled | - |
| Switcher = none | "[none]" selected | Matrix/Output/Delay disabled | All disabled |
| Switcher selected | host selected | Matrix/Output/Delay enabled | - |
| Matrix empty | no matrix text | Output/Delay disabled | - |
| Monitor port = None (-1) | -1 | "Monitor defaults to" disabled | default_on disabled |
| Play card/port unset | card<0 or port<0 | Event Carts section disabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | Auto-save on deck switch | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | RDCatch button | station_station, station_cae_station |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Switcher Delay | Widoczny na screenshot | Hidden w kodzie (hide()) | Ukryty domyślnie, pojawia się gdy aktywny |
| Layout | 2 kolumny (Record/Play) | Zgodne | - |

---

# UI Contract: Edit CartSlots

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditCartSlots |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit CartSlots |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_cartslots.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdcartslots_dialog.png |
| Mockup HTML | ✅ | mockups/EditCartSlots.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | caller | tak |
| cae_station | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_slot_columns_spin | QSpinBox | Slot Columns: | 1-MAX_COLUMNS | valueChanged → quantityChangedData |
| edit_slot_rows_spin | QSpinBox | Slot Rows: | 1-MAX_ROWS | valueChanged → quantityChangedData |
| edit_slot_box | QComboBox | Slot | Wybór slotu (dynamiczna lista cols*rows) | activated → slotChangedData |
| edit_card_spin | QSpinBox | Card: | -1(None)..cards-1 | valueChanged → cardChangedData |
| edit_input_spin | QSpinBox | Input Port: | -1(None)..MAX_PORTS-1 | - |
| edit_output_spin | QSpinBox | Output Port: | -1(None)..MAX_PORTS-1 | - |
| edit_service_box | QComboBox | Service: | Lista SERVICES.NAME z DB | - |
| edit_mode_box | QComboBox | Slot Mode: | User previous + SlotOptions modes | activated → modeData |
| edit_play_mode_box | QComboBox | Play Mode: | Use previous/Full/Hook | - |
| edit_cartaction_box | QComboBox | At Startup: | Use previous cart/Do Nothing/Load Specified Cart | activated → cartActionData |
| edit_cart_edit | QLineEdit (readOnly) | Cart: | Numer wybranego carta | - |
| edit_cart_button | QPushButton | Select | Otwiera RDCartDialog | clicked → cartSelectData |
| edit_stop_action_box | QComboBox | At Playout End: | Use previous action + StopAction options | - |
| button (close) | QPushButton | Close | Zapisuje i zamyka | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Card = None (-1) | card < 0 | Input/Output port disabled, set to None | Input/Output disabled |
| Mode != Breakaway | mode != BreakawayMode | Play Mode, At Startup, At Playout End disabled | Multiple disabled |
| Mode = Breakaway | mode == BreakawayMode | Play Mode, At Startup, At Playout End enabled | - |
| At Startup != Load Specified | action != 2 | Cart + Select disabled | Cart disabled |
| At Startup = Load Specified | action == 2 | Cart + Select enabled | - |
| Slot count changed | cols*rows zmienione | Info "Slot selected has changed!" jeśli slot > new max | QMessageBox::information |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak walidacji) | - | - | Auto-save on slot switch/close | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | RDCartSlots button | station_station, station_cae_station |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Rozmiar | ~300x455 | sizeHint 300x455 | Zgodne |
| Sekcje | Global/Slot/Channel/Default | Zgodne | - |

---

# UI Contract: Hot Key Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditHotkeys |
| Typ | Dialog |
| Tytuł okna | RDAdmin - {MODULE} Hot Key Configuration for {station} |
| Modalność | modal |
| Rodzic | EditRDAirPlay / EditRDPanel (via EditStation sub-dialogs) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_hotkeys.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rdairplay_hotkey_configuration_dialog.png |
| Mockup HTML | ✅ | mockups/EditHotkeys.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | caller | tak |
| module | QString | caller (np. "airplay", "panel") | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | Q3ListView | Host Hot Key Configurations | 2-kolumnowa lista (Button/Function, KeyStroke) | clicked/doubleClicked → showCurrentKey |
| keystroke | QLineEdit | (brak etykiety) | Wyświetla bieżący skrót klawiaturowy, przechwytuje klawisze | keyPressEvent/keyReleaseEvent |
| set_button | QPushButton | Set | Przypisuje bieżący keystroke do wybranej pozycji | clicked → SetButtonClicked |
| clear_button | QPushButton | Clear | Czyści bieżący keystroke | clicked → clearCurrentItem |
| clear_all_button | QPushButton | Clear All Hotkeys | Czyści wszystkie skróty po potwierdzeniu | clicked → clearAll_Hotkeys |
| clone_from_host_box | QComboBox | Set From Host: | Klonuje hotkeys z innej stacji | activated → Clone_RefreshList |
| save_button | QPushButton | Save | Zapisuje do DB (RDHOTKEYS) | clicked → save |
| cancel_button | QPushButton | Cancel | Zamyka bez zapisu (z potwierdzeniem jeśli zmienione) | clicked → cancel |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista załadowana | Otwarcie | Hotkeys z DB dla station+module | - |
| Brak zaznaczenia | Nic nie wybrane w list_view | Set nie reaguje ("Please Select an Item") | - |
| Keystroke captured | Klawisze naciśnięte | keystroke field pokazuje kombinację (Alt/Ctrl + key) | - |
| Dane zmienione | keyupdated=true | Cancel pyta o potwierdzenie | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| list_view selection | Musi być wybrana pozycja | "Please Select an Item From the List" | Set bez zaznaczenia | QMessageBox::warning |
| Duplikaty | Brak duplikatów klawiszy | "Duplicate Hotkey defined {key}" | Save | QMessageBox::warning |
| Cancel z zmianami | Potwierdzenie Yes/No | "Are you sure - All Hot Keys changes will be Lost!" | Cancel + keyupdated | QMessageBox::warning |
| Clear All | Potwierdzenie Yes/No | "Are you sure - This will Clear All Hot Key Settings!" | Clear All | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditRDAirPlay / EditRDPanel | Hotkeys button | station name, module name |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "AIRPLAY Hot Key Configuration for gazerbeam" | Dynamic: module.upper() + " Hot Key Configuration for " + station | Zgodne |
| Rozmiar | ~400x500 | sizeHint 400x500 | Zgodne |

---

# UI Contract: Edit Serial Ports

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditTtys |
| Typ | Dialog |
| Tytuł okna | RDAdmin- Edit Serial Ports |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_ttys.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_serial_ports_dialog.png |
| Mockup HTML | ✅ | mockups/EditTtys.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | caller (station name) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_port_box | QComboBox | Port ID: | Serial0..Serial{MAX_TTYS-1} | activated → idSelectedData |
| edit_enable_button | QCheckBox | Enabled | Włącza/wyłącza port | stateChanged → enableButtonData |
| edit_port_edit | QLineEdit | TTY Device: | Ścieżka urządzenia (np. /dev/ttyS0) | - |
| edit_baudrate_box | QComboBox | Baud Rate: | 50-230400 (18 opcji) | - |
| edit_parity_box | QComboBox | Parity: | None/Even/Odd | - |
| edit_databits_box | QComboBox | Data Bits: | 5/6/7/8 | - |
| edit_stopbits_box | QComboBox | Stop Bits: | 1/2 | - |
| edit_termination_box | QComboBox | Terminator: | None/CR/LF/CR-LF | - |
| close_button | QPushButton | &Close | Zapisuje i zamyka, wysyła RML reload | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Port enabled | checkbox checked | Wszystkie pola edycji aktywne | - |
| Port disabled | checkbox unchecked | TTY Device, Baud Rate, Parity, Data/Stop Bits, Terminator disabled | All fields disabled |
| Port in use (disable attempt) | Próba wyłączenia portu używanego przez Switcher/GPIO | Info o macierzy używającej port, checkbox wraca do checked | QMessageBox::information |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Port in use | Nie można wyłączyć portu używanego przez macierz | "This port is currently in use by the following Switcher/GPIO device: Matrix: N, Type: X, Description: Y" | Uncheck when in use | QMessageBox::information |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Serial Ports button | station name (QString) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Rozmiar | ~300x290 | sizeHint 300x290 | Zgodne |
| Tytuł | "Edit Serial Ports" | "RDAdmin- Edit Serial Ports" (brak spacji) | Drobny bug w kodzie |

---

# UI Contract: Audio Resource Information

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ViewAdapters |
| Typ | Dialog (read-only viewer) |
| Tytuł okna | RDADmin - Audio Resource Information |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/view_adapters.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.audio_resource_information_dialog.png |
| Mockup HTML | ✅ | mockups/ViewAdapters.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| rdstation | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| view_title_label | QLabel | Audio Resources on {station} | Tytuł z nazwą stacji | - |
| view_text_edit | Q3TextEdit (readOnly) | (brak) | Wyświetla raport audio resources | - |
| view_close_button | QPushButton | &Close | Zamyka dialog (default) | clicked → closeData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Scanned | station scanned=true | Raport: Audio Drivers, Import/Export Formats, Audio Adapters (cards 0-7) | - |
| Not scanned | station scanned=false | "NO DATA AVAILABLE" + instrukcja uruchomienia daemonów | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | Read-only view | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Audio Resources button | station_station (RDStation*) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Audio Resource Information" | "RDADmin - Audio Resource Information" (typo: RDADmin) | Bug w kodzie: duże D |
| Rozmiar | ~460x290 | sizeHint 460x290 | Zgodne, resizable |

---

# UI Contract: JACK Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditJack |
| Typ | Dialog |
| Tytuł okna | RDAdmin - JACK Configuration for {station} |
| Modalność | modal |
| Rodzic | EditStation |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_jack.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.jack_configuration_dialog.png |
| Mockup HTML | ✅ | mockups/EditJack.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_start_jack_box | QCheckBox | Start JACK Server | Włącza auto-start JACK | toggled → startJackData |
| edit_jack_server_name_edit | QLineEdit | JACK Server Name: | Nazwa serwera (default: "default") | - |
| edit_jack_command_line_edit | QLineEdit | JACK Command Line: | Komenda uruchomienia JACK | - |
| edit_jack_audio_ports_spin | QSpinBox | Active Audio Ports: | 0-24 portów | - |
| edit_jack_client_view | RDListView | JACK Clients to Start: | 2-kolumnowa lista (Client, Command Line) | doubleClicked → doubleClickedData |
| edit_add_button | QPushButton | &Add | Dodaje klienta JACK (otwiera EditJackClient) | clicked → addData |
| edit_edit_button | QPushButton | &Edit | Edytuje klienta JACK | clicked → editData |
| edit_delete_button | QPushButton | &Delete | Usuwa klienta JACK po potwierdzeniu | clicked → deleteData |
| edit_ok_button | QPushButton | &OK | Zapisuje do DB i zamyka (default) | clicked → okData |
| edit_cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | clicked → cancelData |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Start JACK unchecked | checkbox off | JACK Command Line disabled | command_line disabled |
| Start JACK checked | checkbox on | JACK Command Line enabled | - |
| Pusta lista klientów | brak JACK_CLIENTS | Lista pusta, Add/Edit/Delete aktywne | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Delete client | Potwierdzenie Yes/No | "Are you sure you want to delete JACK Client \"{name}\"?" | Delete click | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | JACK Settings button | station_station (RDStation*) |
| EditJack → EditJackClient | Add/Edit/Double-click | &desc, &cmd (in/out params) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Rozmiar | ~450x352 | sizeHint 450x352, resizable | Zgodne |
| Server Name | Puste pole | Default "default" jeśli puste | Zgodne |

---

# UI Contract: Configure RDAirPlay

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDAirPlay |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDAirPlay" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 1010x680 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdairplay.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdairplay_dialog.png (+ 7 section screenshots) |
| Mockup HTML | ✅ | mockups/EditRDAirPlay.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Channel Assignments (lewa strona)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_card_sel[0] | RDCardSelector | Main Log Output 1 | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[0] | QLineEdit | Start RML: | Komenda RML przy starcie | - |
| air_stop_rml_edit[0] | QLineEdit | Stop RML: | Komenda RML przy stopie | - |
| air_channel_button[0] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) via QSignalMapper |
| air_card_sel[1] | RDCardSelector | Main Log Output 2 | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[1] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[1] | QLineEdit | Stop RML: | Komenda RML | - |
| air_channel_button[1] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) |
| air_card_sel[4] | RDCardSelector | Aux Log 1 Output | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[4] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[4] | QLineEdit | Stop RML: | Komenda RML | - |
| air_channel_button[4] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) |
| air_card_sel[5] | RDCardSelector | Aux Log 2 Output | Wybór karty/portu audio | audioSettingsChangedData(int,int,int) |
| air_start_rml_edit[5] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[5] | QLineEdit | Stop RML: | Komenda RML | - |
| air_channel_button[5] | QPushButton | "Edit GPIOs" | Otwiera EditChannelGpios | editGpiosData(int) |
| air_virtual_machine_box | QComboBox | "Log Machine:" (Virtual Log Outputs) | Wybór vLog | virtualLogActivatedData(int) |
| air_virtual_card_sel | RDCardSelector | (per-vLog) | Wybór karty/portu dla vLog | - |
| air_virtual_start_rml_edit | QLineEdit | Start RML: | RML per vLog | - |
| air_virtual_stop_rml_edit | QLineEdit | Stop RML: | RML per vLog | - |
| (button) | QPushButton | "Configure Hot Keys" | Otwiera EditHotkeys | editHotKeys() |

### Sekcja: Channel Assignments (prawa strona - SoundPanel)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_card_sel[2] | RDCardSelector | SoundPanel First Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[2] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[2] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[2] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[6] | RDCardSelector | SoundPanel Second Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[6] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[6] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[6] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[7] | RDCardSelector | SoundPanel Third Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[7] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[7] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[7] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[8] | RDCardSelector | SoundPanel Fourth Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[8] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[8] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[8] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |
| air_card_sel[9] | RDCardSelector | SoundPanel Fifth and Later Play Output | Wybór karty/portu | audioSettingsChangedData |
| air_start_rml_edit[9] | QLineEdit | Start RML: | RML | - |
| air_stop_rml_edit[9] | QLineEdit | Stop RML: | RML | - |
| air_channel_button[9] | QPushButton | "Edit GPIOs" | EditChannelGpios | editGpiosData |

### Sekcja: Log Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_segue_edit | QLineEdit | Manual Segue: | Długość segue (msecs) | - |
| air_trans_edit | QLineEdit | Forced Segue: | Długość wymuszonego segue (msecs) | - |
| air_piecount_box | QSpinBox | Pie Counts Last: | 0-60 secs | - |
| air_countto_box | QComboBox | Pie Counts To: | "Cart End" / "Transition" | - |
| air_default_transtype_box | QComboBox | Default Trans. Type: | "Play" / "Segue" / "Stop" | - |
| air_defaultsvc_box | QComboBox | Default Service: | "[none]" + lista serwisów z DB | - |

### Sekcja: Sound Panel Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_station_box | QSpinBox | System Panels: | 0-MAX_PANELS, "None" | - |
| air_user_box | QSpinBox | User Panels: | 0-MAX_PANELS, "None" | - |
| air_flash_box | QCheckBox | Flash Active Buttons | toggle | - |
| air_panel_pause_box | QCheckBox | Enable Button Pausing | toggle | - |
| air_label_template_edit | QLineEdit | Label Template: | tekst szablonu | - |

### Sekcja: Miscellaneous Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_timesync_box | QCheckBox | Check TimeSync | toggle | - |
| air_auxlog_box[0] | QCheckBox | Show Auxlog 1 Button | toggle | - |
| air_auxlog_box[1] | QCheckBox | Show Auxlog 2 Button | toggle | - |
| air_clearfilter_box | QCheckBox | Clear Cart Search Filter | toggle | - |
| air_pause_box | QCheckBox | Enable Paused Events | toggle | - |
| air_show_counters_box | QCheckBox | Show Extra Buttons/Counters | toggle | - |
| air_hour_selector_box | QCheckBox | Show Hour Selector | toggle | - |
| air_audition_preroll_spin | QSpinBox | Audition Preroll: | 1-60 secs | - |
| air_bar_group | Q3ButtonGroup | Space Bar Action | "None" / "Start Next" (radio) | - |

### Sekcja: Start/Stop Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_exitpasswd_edit | QLineEdit | Exit Password: | hasło (echo=Password) | exitPasswordChangedData(QString) |
| air_logmachine_box | QComboBox | (log selector) | "Main Log" / "Aux 1 Log" / "Aux 2 Log" / "vLog N" | logActivatedData(int) |
| air_startmode_box | QComboBox | At Startup: | "start with empty log" / "load previous log" / "load specified log" | startModeChangedData(int) |
| air_autorestart_box | QCheckBox | Restart Log After Unclean Shutdown | toggle, disabled when mode=empty | - |
| air_startlog_edit | QLineEdit | Log: | nazwa logu (enabled only if mode=specified) | - |
| air_startlog_button | QPushButton | "Select" | Otwiera RDListLogs | selectData() |

### Sekcja: Display Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_skin_edit | QLineEdit | Background Image: | ścieżka do pliku | - |
| (button) | QPushButton | "Select" | QFileDialog | selectSkinData() |
| air_title_template_edit | QLineEdit | Title Template: | szablon tytułu | - |
| air_artist_template_edit | QLineEdit | Artist Template: | szablon artysty | - |
| air_outcue_template_edit | QLineEdit | Outcue Template: | szablon outcue | - |
| air_description_template_edit | QLineEdit | Description Template: | szablon opisu | - |

### Sekcja: Log Mode Control

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_modecontrol_box | QComboBox | Mode Control Style: | "Unified" / "Independent" | modeControlActivatedData(int) |
| air_logstartmode_box[0] | QComboBox | Main Log Startup Mode: | "Previous"/"LiveAssist"/"Automatic"/"Manual" | logStartupModeActivatedData(int) |
| air_logstartmode_box[1] | QComboBox | Aux 1 Log Startup Mode: | "Previous"/"LiveAssist"/"Automatic"/"Manual" | logStartupModeActivatedData(int) |
| air_logstartmode_box[2] | QComboBox | Aux 2 Log Startup Mode: | "Previous"/"LiveAssist"/"Automatic"/"Manual" | logStartupModeActivatedData(int) |
| air_virtual_logstartsel_box | QComboBox | (vLog selector) | vLog 1..N | virtualModeActivatedData(int) |
| air_virtual_logstartmode_box | QComboBox | (vLog startup mode) | "Previous"/"LiveAssist"/"Automatic"/"Manual" | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (ok) | QPushButton | "&OK" | Waliduje i zapisuje | okData() |
| (cancel) | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | cae_station->scanned() == false | QMessageBox info, card selectors disabled | Wszystkie air_card_sel disabled |
| MainLog2 disabled | MainLog1 i MainLog2 mają ten sam card+port | MainLog2 GPIO button i RML fields disabled | air_channel_button[1], RML edits |
| Startup mode=empty | air_startmode_box == 0 | Log edit/select disabled, autorestart disabled | air_startlog_edit, air_startlog_button, air_autorestart_box |
| Startup mode=previous | air_startmode_box == 1 | Log edit/select disabled | air_startlog_edit, air_startlog_button |
| Startup mode=specified | air_startmode_box == 2 | Log edit/select enabled | (all enabled) |
| Unified mode control | air_modecontrol_box == 0 | Changing any log startup mode syncs all 3 | - |
| Independent mode control | air_modecontrol_box == 1 | Each log startup mode independent | - |
| Audition/Cue (inactive) | always | Hidden (card_sel[3] + RML hidden) | air_card_sel[3] + labels hidden |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| air_segue_edit | Must be valid integer | "Data Error" / "Invalid Segue Length!" | okData() | QMessageBox::warning |
| air_trans_edit | Must be valid integer | "Data Error" / "Invalid Forced Segue Length!" | okData() | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDAirPlay" | station, cae_station |
| EditRDAirPlay | "Configure Hot Keys" button | air_conf->station(), "airplay" -> EditHotkeys |
| EditRDAirPlay | "Edit GPIOs" buttons | air_conf, channel -> EditChannelGpios |
| EditRDAirPlay | "Select" (log) button | -> RDListLogs (logname) |
| EditRDAirPlay | "Select" (skin) button | -> QFileDialog |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Audition/Cue section | Nie widoczne | Ukryte (hidden) | Sekcja card_sel[3] istnieje ale jest ukryta komentarzem INACTIVE |
| Virtual Log section | Widoczne na screenshot | Widoczne w kodzie | Zgodne |

---

# UI Contract: Configure RDLibrary

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDLibrary |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDLibrary" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 405x630 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdlibrary.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdlibrary_dialog.png |
| Mockup HTML | ✅ | mockups/EditRDLibrary.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Audio I/O

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_input_card | RDCardSelector | Input | Wybór karty/portu wejścia | - |
| lib_output_card | RDCardSelector | Output | Wybór karty/portu wyjścia | - |

### Sekcja: Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_maxlength_time | Q3TimeEdit | Max Record Time: | Maks. czas nagrania | - |
| lib_vox_spin | QSpinBox | VOX Threshold: | -99..0 dbFS | - |
| lib_trim_spin | QSpinBox | AutoTrim Threshold: | -99..0 dbFS | - |
| lib_preroll_spin | QSpinBox | Tail Preroll: | 0..10000 ms, step 100 | - |
| lib_ripdev_edit | QLineEdit | Ripper Device: | ścieżka urządzenia | - |
| lib_paranoia_box | QComboBox | Paranoia Level: | "Normal"/"Low"/"None" | - |
| lib_isrc_box | QComboBox | Read ISRCs from CD: | "No"/"Yes" | - |
| lib_cd_server_type_box | QComboBox | CD Metadata Source: | Dummy/CDDB/MusicBrainz | cdServerTypeData(int) |
| lib_cddb_server_edit | QLineEdit | CDDB Server: | adres serwera (warunkowy) | - |
| lib_mb_server_edit | QLineEdit | MusicBrainz Server: | adres serwera (warunkowy) | - |
| lib_format_box | QComboBox | Format: | "PCM16"/"PCM24"/"MPEG Layer 2" | formatData(int) |
| lib_bitrate_box | QComboBox | Bitrate: | 32-192 kbps/chan (only MPEG) | - |
| lib_editor_box | QComboBox | Allow External Editing: | "No"/"Yes" | - |
| lib_converter_box | QComboBox | Sample Rate Converter: | lista z libsamplerate | - |
| lib_limit_search_box | QComboBox | Limit Searches at Startup: | "No"/"Yes"/"Previous" | - |

### Sekcja: Defaults

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_channels_box | QComboBox | Channels: | "1"/"2" | - |
| lib_recmode_box | QComboBox | Record Mode: | "Manual"/"VOX" | - |
| lib_trimstate_box | QComboBox | AutoTrim: | "On"/"Off" | - |
| lib_riplevel_spin | QSpinBox | Normalization Level: | -99..0 dbFS | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| ok_button | QPushButton | "&OK" | Zapisuje konfigurację | okData() |
| cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | cae_station->scanned() == false | QMessageBox info | lib_input_card, lib_output_card disabled |
| CD Source = Dummy | lib_cd_server_type_box == 0 | Server label/edit disabled | lib_cd_server_label, both server edits disabled |
| CD Source = CDDB | lib_cd_server_type_box == 1 | CDDB server edit visible | lib_mb_server_edit hidden, lib_cddb_server_edit shown |
| CD Source = MusicBrainz | lib_cd_server_type_box == 2 | MusicBrainz edit visible | lib_cddb_server_edit hidden, lib_mb_server_edit shown |
| Format = PCM16/PCM24 | lib_format_box == 0 or 1 | Bitrate disabled | lib_bitrate_box disabled |
| Format = MPEG L2 | lib_format_box == 2 | Bitrate enabled | lib_bitrate_box enabled, populated with rates |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| lib_ripdev_edit | RDTextValidator | (inline) | real-time | validator |
| lib_cddb_server_edit | RDTextValidator | (inline) | real-time | validator |
| lib_mb_server_edit | RDTextValidator | (inline) | real-time | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDLibrary" | station, cae_station |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |

---

# UI Contract: Configure RDLogedit

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDLogedit |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDLogedit" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 395x500 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdlogedit.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdlogedit_dialog.png |
| Mockup HTML | ✅ | mockups/EditRDLogedit.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Audio I/O

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_input_card | RDCardSelector | INPUT | Wybór karty/portu wejścia | - |
| lib_output_card | RDCardSelector | OUTPUT | Wybór karty/portu wyjścia | - |

### Sekcja: Voice Tracker Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| lib_maxlength_time | Q3TimeEdit | Max Record Time: | Maks. czas nagrania | - |
| lib_threshold_spin | QSpinBox | AutoTrim Threshold: | -99..0 dbFS | - |
| lib_normalization_spin | QSpinBox | Normalization Level: | -99..0 dbFS | - |
| lib_preroll_spin | QSpinBox | Audio Margin: | 0..10000 ms, step 100 | - |
| lib_format_box | QComboBox | Format: | "PCM16"/"PCM24"/"MPEG Layer 2" | formatData(int) |
| lib_bitrate_box | QComboBox | Bitrate: | 32-192 kbps/chan (only MPEG) | - |
| lib_enable_second_start_box | QComboBox | Enable 2nd Start Button: | "No"/"Yes" | - |
| lib_waveform_caption_edit | QLineEdit | WaveForm Caption: | tekst | - |
| lib_startcart_edit | QLineEdit | Play Start Cart: | numer koszyka (1-999999) | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectStartData() |
| lib_endcart_edit | QLineEdit | Play End Cart: | numer koszyka | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectEndData() |
| lib_recstartcart_edit | QLineEdit | Record Start Cart: | numer koszyka | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectRecordStartData() |
| lib_recendcart_edit | QLineEdit | Record End Cart: | numer koszyka | - |
| (select button) | QPushButton | "Select" | Otwiera RDCartDialog (Macro) | selectRecordEndData() |
| lib_channels_box | QComboBox | Channels: | "1"/"2" | - |
| lib_default_transtype_box | QComboBox | Default Transition: | "Play"/"Segue"/"Stop" | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| ok_button | QPushButton | "&OK" | Zapisuje konfigurację | okData() |
| cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | cae_station->scanned() == false | QMessageBox info | lib_input_card, lib_output_card disabled |
| Format = PCM | lib_format_box == 0 or 1 | Bitrate disabled | lib_bitrate_box disabled |
| Format = MPEG L2 | lib_format_box == 2 | Bitrate enabled with rate list | lib_bitrate_box enabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| lib_startcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |
| lib_endcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |
| lib_recstartcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |
| lib_recendcart_edit | QIntValidator 1-999999 | (inline) | real-time | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDLogedit" | station, cae_station |
| EditRDLogedit | "Select" buttons | -> RDCartDialog (Macro type) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |

---

# UI Contract: Configure RDPanel

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditRDPanel |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - Configure RDPanel" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 630x496 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_rdpanel.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.configure_rdpanel_dialog.png |
| Mockup HTML | ✅ | mockups/EditRDPanel.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |
| cae_station | RDStation* | EditStation | tak |

## Widgety i interakcje

### Sekcja: Channel Assignments (lewa strona)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_card_sel[0] | RDCardSelector | SoundPanel First Play Output | Wybór karty/portu | - |
| air_start_rml_edit[0] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[0] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[1] | RDCardSelector | SoundPanel Second Play Output | Wybór karty/portu | - |
| air_start_rml_edit[1] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[1] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[2] | RDCardSelector | SoundPanel Third Play Output | Wybór karty/portu | - |
| air_start_rml_edit[2] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[2] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[3] | RDCardSelector | SoundPanel Fourth Play Output | Wybór karty/portu | - |
| air_start_rml_edit[3] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[3] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[4] | RDCardSelector | SoundPanel Fifth and Later Play Output | Wybór karty/portu | - |
| air_start_rml_edit[4] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[4] | QLineEdit | Stop RML: | Komenda RML | - |
| air_card_sel[5] | RDCardSelector | SoundPanel Cue Output | Wybór karty/portu | - |
| air_start_rml_edit[5] | QLineEdit | Start RML: | Komenda RML | - |
| air_stop_rml_edit[5] | QLineEdit | Stop RML: | Komenda RML | - |

### Sekcja: Display Settings

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_skin_edit | QLineEdit | Background Image: | ścieżka do pliku | - |
| (button) | QPushButton | "Select" | QFileDialog | selectSkinData() |

### Sekcja: Sound Panel Settings (prawa strona)

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| air_station_box | QSpinBox | Host Panels: | 0-MAX_PANELS, "None" | - |
| air_user_box | QSpinBox | User Panels: | 0-MAX_PANELS, "None" | - |
| air_flash_box | QCheckBox | Flash Active Buttons | toggle | - |
| air_panel_pause_box | QCheckBox | Enable Button Pausing | toggle | - |
| air_clearfilter_box | QCheckBox | Clear Cart Search Filter | toggle | - |
| air_defaultsvc_box | QComboBox | Default Service: | "[none]" + serwisy z DB | - |
| air_label_template_edit | QLineEdit | Label Template: | szablon etykiety | - |

### Przyciski akcji

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (ok) | QPushButton | "&OK" | Zapisuje konfigurację | okData() |
| (cancel) | QPushButton | "&Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| No Audio Config | station->scanned() == false | QMessageBox info | Wszystkie air_card_sel[0-5] disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| air_start_rml_edit[*] | RDTextValidator | (inline) | real-time | validator |
| air_stop_rml_edit[*] | RDTextValidator | (inline) | real-time | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "Configure RDPanel" | station, cae_station |
| EditRDPanel | "Select" (skin) button | -> QFileDialog |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |

---

# UI Contract: JACK Client Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditJackClient |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - JACK Client Configuration for {station_name}" |
| Modalność | modal |
| Rodzic | EditJack |
| Rozmiar | 450x130 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_jack_client.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditJackClient.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditJack | tak |
| desc | QString* (in/out) | caller | tak |
| cmd | QString* (in/out) | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_jack_description_edit | QLineEdit | Description: | Opis klienta JACK | - |
| edit_jack_command_line_edit | QLineEdit | Command Line: | Linia komend klienta JACK | - |
| edit_ok_button | QPushButton | "&OK" | Zapisuje i zamyka (done(0)) | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | 2 pola tekstowe + OK/Cancel | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| edit_jack_command_line_edit | trimmed() na okData | (brak komunikatu) | okData() | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditJack | Przycisk "Add"/"Edit" | station, desc*, cmd* (via exec()) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: PyPAD Instances

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListPypads |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - PyPAD Instances on {station_name}" |
| Modalność | modal |
| Rodzic | EditStation |
| Rozmiar | 600x400 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_pypads.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.pypad_instances_dialog.png |
| Mockup HTML | ✅ | mockups/ListPypads.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditStation | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | RDListView | (lista instancji) | Wyświetla PyPAD instances | doubleClickedData() -> editData() |
| list_add_button | QPushButton | "&Add" | Dodaje nową instancję PyPAD | addData() |
| list_edit_button | QPushButton | "&Edit" | Edytuje wybraną instancję | editData() |
| list_delete_button | QPushButton | "&Delete" | Usuwa wybraną instancję | deleteData() |
| list_error_button | QPushButton | "&Error Log" | Pokazuje log błędów | errorData() |
| list_close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

### Kolumny listy
| # | Nagłówek | Wyrównanie | Dane |
|---|----------|-----------|------|
| 0 | (status icon) | Center | Zielona/czerwona ikonka (running/stopped) |
| 1 | ID | Right | Numer ID instancji |
| 2 | Description | Left | Opis instancji |
| 3 | Script Path | Left | Ścieżka do skryptu Python |
| 4 | Exit Code | Right | Kod wyjścia procesu |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Running | IS_RUNNING='Y' | Zielona ikonka w kolumnie 0 | - |
| Stopped | IS_RUNNING='N' | Czerwona ikonka w kolumnie 0 | - |
| Empty list | brak instancji | Pusta lista | - |
| No selection | nic nie zaznaczone | Edit/Delete/Error nic nie robią | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (delete) | Potwierdzenie | "Are you sure you want to delete this instance?" | deleteData() | QMessageBox::question (Yes/No) |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Przycisk "PyPAD Instances" | station |
| ListPypads | "Add" button | -> QFileDialog (skrypt .py) -> EditPypad (nowy ID) |
| ListPypads | "Edit" button / doubleclick | -> EditPypad (existing ID) |
| ListPypads | "Error Log" button | -> ViewPypadErrors (ID) |

## Logika biznesowa
- Timer 3000ms odświeża statusy IS_RUNNING i EXIT_CODE z DB (updateData)
- Przy Add: szuka pliku .exemplar obok skryptu i wczytuje jako domyślną konfigurację
- Po Add/Edit: wysyła RDNotification (PypadType, Add/ModifyAction) przez RIPC
- Po Delete: wysyła RDNotification (PypadType, DeleteAction) przez RIPC

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |

---

# UI Contract: Edit PyPAD Instance

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditPypad |
| Typ | Dialog |
| Tytuł okna | "Edit PyPAD Instance [ID: {id}]" |
| Modalność | modal (inherited) |
| Rodzic | ListPypads |
| Rozmiar | 600x660 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_pypad.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_pypad_instance_dialog.png |
| Mockup HTML | ✅ | mockups/EditPypad.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int | ListPypads | tak (PYPAD_INSTANCES.ID) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_script_path_edit | QLineEdit | Script Path: | Ścieżka skryptu (readOnly) | - |
| edit_description_edit | QLineEdit | Description: | Opis instancji (edytowalny) | - |
| edit_config_text | QTextEdit | Configuration | Konfiguracja (plaintext, word wrap) | - |
| edit_ok_button | QPushButton | "OK" | Zapisuje do DB | okData() |
| edit_cancel_button | QPushButton | "Cancel" | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | Script Path (readonly) + Description + Configuration textarea | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak walidacji explicite | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListPypads | "Add"/"Edit" button | id (PYPAD_INSTANCES.ID) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Brak istotnych rozbieżności |

---

# UI Contract: Script Error Log

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ViewPypadErrors |
| Typ | Dialog |
| Tytuł okna | "Script Error Log [ID: {id}]" |
| Modalność | modal (inherited) |
| Rodzic | ListPypads |
| Rozmiar | 600x400 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/view_pypad_errors.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ViewPypadErrors.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int | ListPypads | tak (PYPAD_INSTANCES.ID) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| view_text | QTextEdit | (error log viewer) | Wyświetla ERROR_TEXT (readOnly) | - |
| view_close_button | QPushButton | "Close" | Zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Has errors | ERROR_TEXT not empty | Tekst błędów w widoku | - |
| No errors | ERROR_TEXT empty | Pusty widok | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListPypads | "Error Log" button | id (PYPAD_INSTANCES.ID) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: Rivendell Switcher List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListMatrices |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Switcher List |
| Modalność | modal |
| Rodzic | EditStation (switcher configuration) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_matrices.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_switcher_list_dialog.png |
| Mockup HTML | ✅ | mockups/ListMatrices.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | EditStation parent | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | Q3ListView | Switchers: | Wyświetla listę switcherów (MATRIX, DESCRIPTION, TYPE) | - |
| list_view (dblclick) | Q3ListView | - | Dwuklik otwiera EditMatrix | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddMatrix, potem EditMatrix | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditMatrix dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany switcher (z potwierdzeniem) | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog, wysyła RDMacro::SZ dla zmodyfikowanych | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | Brak switcherów w DB | Pusta lista, wszystkie przyciski aktywne | - |
| Lista z elementami | Switchery istnieją w DB | Lista MATRIX/DESCRIPTION/TYPE | - |
| Brak zaznaczenia | Nie wybrano elementu | Edit/Delete nie działają (return early) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Delete | Potwierdzenie | "Are you sure you want to delete switcher X:Y on Z? ALL references to this switcher will be deleted!" | Kliknięcie Delete | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditStation | Otwiera jako modal | station (QString) |
| ListMatrices -> AddMatrix | addData() -> AddMatrix::exec() | station |
| ListMatrices -> EditMatrix | addData()/editData() -> EditMatrix::exec() | RDMatrix* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł okna | "Rivendell Switcher List" | "RDAdmin - Rivendell Switcher List" | Screenshot obcina prefix |
| Kolumny | MATRIX, DESCRIPTION, TYPE | MATRIX, DESCRIPTION, TYPE | Zgodne |
| Przyciski | Add, Edit, Delete, Close | &Add, &Edit, &Delete, &Close | Zgodne |

---

# UI Contract: Add Switcher

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddMatrix |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Switcher |
| Modalność | modal |
| Rodzic | ListMatrices |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_matrix.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddMatrix.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | QString | ListMatrices | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| add_matrix_box | QSpinBox | &New Matrix Number: | Wybór numeru matrycy (0..MAX_MATRICES-1) | - |
| add_type_box | QComboBox | &Switcher Type: | Wybór typu switcher (RDMatrix::Type enum) | - |
| ok_button | QPushButton | &OK | Sprawdza duplikat, tworzy rekord MATRICES, done(matrix_num) | okData() |
| cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Otwarcie | SpinBox ustawiony na pierwszy wolny numer matrycy | - |
| Brak wolnych | Wszystkie numery zajęte | SpinBox bez wolnego numeru (GetNextMatrix() zwraca -1) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Matrix Number | Nie może być duplikatem | "Matrix already exists!" | OK kliknięty, istnieje w DB | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListMatrices | addData() -> exec() | station |
| AddMatrix -> ListMatrices | done(matrix_num) lub done(-1) | numer matrycy lub -1 (anulowano) |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: Edit Switcher

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditMatrix |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Switcher |
| Modalność | modal |
| Rodzic | ListMatrices |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_matrix.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_switcher_dialog.png |
| Mockup HTML | ✅ | mockups/EditMatrix.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | ListMatrices | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (label) | QLabel | Matrix Number: | Wyświetla numer matrycy (readonly) | - |
| (label) | QLabel | Switcher Type: | Wyświetla typ switchera (readonly) | - |
| edit_name_edit | QLineEdit | Description: | Nazwa switchera | - |
| edit_porttype_box | QComboBox | Type: (Primary) | Serial/TCP-IP/None | portTypeActivatedData() |
| edit_port_box | QComboBox | Serial Port: (Primary) | Lista portów serialnych | - |
| edit_ipaddress_edit | QLineEdit | IP Address: (Primary) | Adres IP primary | - |
| edit_ipport_spin | QSpinBox | IP Port: (Primary) | Port IP (0-65535) | - |
| edit_username_edit | QLineEdit | Username: (Primary) | Login primary | - |
| edit_password_edit | QLineEdit | Password: (Primary) | Hasło primary (EchoMode::Password) | - |
| edit_start_cart_edit | QLineEdit | Startup Cart: (Primary) | Numer cart startowego | - |
| edit_start_cart_button | QPushButton | Select (Primary Start) | Otwiera RDCartDialog | startCartData() |
| edit_stop_cart_edit | QLineEdit | Shutdown Cart: (Primary) | Numer cart zamykającego | - |
| edit_stop_cart_button | QPushButton | Select (Primary Stop) | Otwiera RDCartDialog | stopCartData() |
| edit_porttype2_box | QComboBox | Type: (Backup) | Serial/TCP-IP/None | portType2ActivatedData() |
| edit_port2_box | QComboBox | Serial Port: (Backup) | Lista portów serialnych backup | - |
| edit_ipaddress2_edit | QLineEdit | IP Address: (Backup) | Adres IP backup | - |
| edit_ipport2_spin | QSpinBox | IP Port: (Backup) | Port IP backup | - |
| edit_username2_edit | QLineEdit | Username: (Backup) | Login backup | - |
| edit_password2_edit | QLineEdit | Password: (Backup) | Hasło backup (EchoMode::Password) | - |
| edit_start_cart2_edit | QLineEdit | Startup Cart: (Backup) | Cart startowy backup | - |
| edit_start_cart2_button | QPushButton | Select (Backup Start) | Otwiera RDCartDialog | startCart2Data() |
| edit_stop_cart2_edit | QLineEdit | Shutdown Cart: (Backup) | Cart zamykający backup | - |
| edit_stop_cart2_button | QPushButton | Select (Backup Stop) | Otwiera RDCartDialog | stopCart2Data() |
| edit_card_box | QSpinBox | Card: | Numer karty (0-9999) | - |
| edit_inputs_box | QSpinBox | Inputs: | Liczba wejść (0-MAX_ENDPOINTS) | inputsChangedData() |
| edit_outputs_box | QSpinBox | Outputs: | Liczba wyjść (0-MAX_ENDPOINTS) | - |
| edit_device_edit | QLineEdit | Device: | Urządzenie GPIO | - |
| edit_gpis_box | QSpinBox | GPIs: | Liczba GPI (0-MAX_GPIO_PINS) | gpisChangedData() |
| edit_gpos_box | QSpinBox | GPOs: | Liczba GPO (0-MAX_GPIO_PINS) | gposChangedData() |
| edit_layer_box | QComboBox | Layer: | V,A-O | - |
| edit_displays_box | QSpinBox | Displays: | Liczba wyświetlaczy (0-1024) | - |
| edit_inputs_button | QPushButton | Configure Inputs | Otwiera ListEndpoints(Input) | inputsButtonData() |
| edit_outputs_button | QPushButton | Configure Outputs | Otwiera ListEndpoints(Output) | outputsButtonData() |
| edit_gpis_button | QPushButton | Configure GPIs | Otwiera ListGpis(GpioInput) | gpisButtonData() |
| edit_gpos_button | QPushButton | Configure GPOs | Otwiera ListGpis(GpioOutput) | gposButtonData() |
| edit_livewire_button | QPushButton | LiveWire Nodes | Otwiera ListNodes | livewireButtonData() |
| edit_livewire_gpio_button | QPushButton | LiveWire GPIOs | Otwiera ListLiveWireGpios | livewireGpioButtonData() |
| edit_vguestrelays_button | QPushButton | vGuest Switches | Otwiera ListVguestResources(Relay) | vguestRelaysButtonData() |
| edit_vguestdisplays_button | QPushButton | vGuest Displays | Otwiera ListVguestResources(Display) | vguestDisplaysButtonData() |
| edit_sasresources_button | QPushButton | SAS Switches | Otwiera ListSasResources | sasResourcesButtonData() |
| ok_button | QPushButton | &OK | WriteMatrix() -> done(0) | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Primary=Serial | portType=TtyPort | Serial Port enabled, IP disabled, carts disabled | IP/cart fields disabled |
| Primary=TCP/IP | portType=TcpPort | IP/Port enabled, Serial disabled | Serial port disabled |
| Primary=None | portType=NoPort | Wszystkie primary connection disabled | Wszystkie primary disabled |
| Backup=Serial | portType2=TtyPort | Backup serial enabled, IP disabled | Backup IP disabled |
| Backup=TCP/IP | portType2=TcpPort | Backup IP enabled, serial disabled | Backup serial disabled |
| Backup=None | portType2=NoPort | Wszystkie backup disabled | Wszystkie backup disabled |
| Type-dependent | RDMatrix::controlActive() | Widgety enabled/disabled wg typu switchera | Dynamicznie per matrix type |
| GPI/GPO linked | GpioInputsLinkedControl | Zmiana Inputs zmienia GPIs/GPOs | Linked spinboxes |
| Inputs=0 | inputs_box=0 | Configure Inputs disabled | edit_inputs_button disabled |
| GPIs=0 | gpis_box=0 | Configure GPIs disabled | edit_gpis_button disabled |
| GPOs=0 | gpos_box=0 | Configure GPOs disabled | edit_gpos_button disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Primary IP | Poprawny adres IP | "The primary IP address is invalid!" | OK + TCP/IP type | QMessageBox::warning |
| Backup IP | Poprawny adres IP | "The backup IP address is invalid!" | OK + Backup TCP/IP | QMessageBox::warning |
| Primary Serial | Port musi być aktywny | "The primary serial device is not active!" | OK + Serial type | QMessageBox::information |
| Backup Serial | Port musi być aktywny | "The backup serial device is not active!" | OK + Backup Serial | QMessageBox::information |
| Duplikat połączeń | Primary != Backup (IP+port lub serial) | "The primary and backup connections must be different!" | OK | QMessageBox::warning |
| Description | RDTextValidator | - | Inline validation | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListMatrices | editData()/addData() -> exec() | RDMatrix* |
| EditMatrix -> ListEndpoints | inputsButtonData()/outputsButtonData() | RDMatrix*, Input/Output |
| EditMatrix -> ListGpis | gpisButtonData()/gposButtonData() | RDMatrix*, GpioInput/GpioOutput |
| EditMatrix -> ListNodes | livewireButtonData() | RDMatrix* |
| EditMatrix -> ListLiveWireGpios | livewireGpioButtonData() | RDMatrix*, bundle_count |
| EditMatrix -> ListVguestResources | vguestRelaysButtonData()/vguestDisplaysButtonData() | RDMatrix*, VguestType, size |
| EditMatrix -> ListSasResources | sasResourcesButtonData() | RDMatrix*, displays_count |
| EditMatrix -> RDCartDialog | startCartData()/stopCartData()/startCart2Data()/stopCart2Data() | cart number |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Screenshot jest mały | Trudno odczytać szczegóły | Pełna struktura z kodem | Screenshot w niskiej rozdzielczości |
| Sekcje | Primary/Backup Connection widoczne | Grouped by drawn lines (paintEvent) | Zgodne |

---

# UI Contract: List Endpoints (Inputs/Outputs)

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListEndpoints |
| Typ | Dialog |
| Tytuł okna | RDAdmin - List Inputs / RDAdmin - List Outputs |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_endpoints.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListEndpoints.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| endpoint | RDMatrix::Endpoint | EditMatrix (Input/Output) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | INPUTS/OUTPUTS | Lista endpointów z kolumnami zależnymi od typu switchera | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditEndpoint | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditEndpoint dla wybranego | editData() |
| list_ok_button | QPushButton | &OK | Zapisuje wszystkie endpointy do DB | okData() |
| list_cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

Kolumny Q3ListView zależą od typu matrycy:
- **Default**: INPUT/OUTPUT, LABEL
- **Unity4000 (Input)**: + SOURCE, MODE
- **LogitekVguest**: + ENGINE (Hex), DEVICE (Hex)
- **StarGuideIII (Input)**: + PROVIDER ID, SERVICE ID, MODE
- **LiveWireLwrpAudio**: + NODE, #

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Input mode | endpoint=RDMatrix::Input | Tytuł "List Inputs", kolumna "INPUT" | - |
| Output mode | endpoint=RDMatrix::Output | Tytuł "List Outputs", kolumna "OUTPUT" | - |
| Readonly | type=LiveWireLwrpAudio lub SasUsi | Edit disabled, brak doubleclick | edit_button disabled |
| Editable | inne typy | Edit aktywny, doubleclick działa | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak walidacji na tym poziomie | - | - | Walidacje w EditEndpoint |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | inputsButtonData()/outputsButtonData() | RDMatrix*, Input/Output |
| ListEndpoints -> EditEndpoint | editData() | type, endpoint, pointnum, pointname, feedname, mode, enginenum, devicenum |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: Edit Endpoint (Input/Output)

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditEndpoint |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Input / RDAdmin - Edit Output |
| Modalność | modal |
| Rodzic | ListEndpoints |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_endpoint.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditEndpoint.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| type | RDMatrix::Type | ListEndpoints | tak |
| endpoint | RDMatrix::Endpoint | ListEndpoints | tak |
| pointnum | int | ListEndpoints | tak |
| pointname | QString* | ListEndpoints (in/out) | tak |
| feedname | QString* | ListEndpoints (in/out) | tak |
| mode | RDMatrix::Mode* | ListEndpoints (in/out) | tak |
| enginenum | int* | ListEndpoints (in/out) | tak |
| devicenum | int* | ListEndpoints (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_endpoint_edit | QLineEdit | Name: | Nazwa endpointu | - |
| edit_feed_edit | QLineEdit | Feed: | Feed name (Unity4000 Input only) | - |
| edit_mode_box | QComboBox | Mode: | Stereo/Left/Right (Unity4000/StarGuideIII Input only) | - |
| edit_enginenum_edit | QLineEdit | Engine (Hex): / Provider ID: | Numer engine (Logitek) lub Provider ID (StarGuide) | - |
| edit_devicenum_edit | QLineEdit | Device (Hex): / Service ID: | Numer device (Logitek) lub Service ID (StarGuide) | - |
| ok_button | QPushButton | &OK | Waliduje numery, zapisuje wyniki do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Default | Generic matrix type | Tylko Name field widoczny | Feed, Mode, Engine, Device hidden |
| Unity4000 Input | type=Unity4000, endpoint=Input | Name + Feed + Mode | Engine/Device hidden |
| Unity4000 Output | type=Unity4000, endpoint=Output | Tylko Name | Feed/Mode/Engine/Device hidden |
| LogitekVguest | type=LogitekVguest | Name + Engine (Hex) + Device (Hex) | Feed/Mode hidden |
| StarGuideIII Input | type=StarGuideIII, endpoint=Input | Name + Provider ID + Service ID + Mode | Feed hidden |
| StarGuideIII Output | type=StarGuideIII, endpoint=Output | Tylko Name | Reszta hidden |

Rozmiar okna zależny od typu:
- Unity4000 Input: 400x130
- StarGuideIII Input: 420x156
- Domyślny: 400x100

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Engine Number | Poprawna liczba hex (Logitek) lub decimal (StarGuide) | "The Engine Number is Invalid!" / "The Provider ID is Invalid!" | OK | QMessageBox::warning |
| Device Number | Poprawna liczba hex (Logitek) lub decimal (StarGuide) | "The Device Number is Invalid!" / "The Service ID is Invalid!" | OK | QMessageBox::warning |
| Name | RDTextValidator | - | Inline | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListEndpoints | editData() -> exec() | type, endpoint, pointnum, pointname*, feedname*, mode*, enginenum*, devicenum* |
| EditEndpoint -> ListEndpoints | done(0) z wynikami w pointerach | Zmodyfikowane pointname, feedname, mode, enginenum, devicenum |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: List GPIs / GPOs

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListGpis |
| Typ | Dialog |
| Tytuł okna | RDAdmin - List GPIs / RDAdmin - List GPOs |
| Modalność | modal (inherited) |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_gpis.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.list_gpis_dialog.png |
| Mockup HTML | ✅ | mockups/ListGpis.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| type | RDMatrix::GpioType | EditMatrix (GpioInput/GpioOutput) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | GPI Lines / GPO Lines | Lista GPIO z cartami ON/OFF | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditGpi | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditGpi dla wybranego | editData() |
| list_ok_button | QPushButton | &OK | Usuwa stare, zapisuje nowe GPIO carts + wysyła RML GI | okData() |
| list_cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

Kolumny Q3ListView:
- GPI / GPO (number)
- ON MACRO CART
- ON DESCRIPTION
- OFF MACRO CART
- OFF DESCRIPTION

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| GPI mode | type=GpioInput | Tytuł "List GPIs", kolumna "GPI", label "GPI Lines" | - |
| GPO mode | type=GpioOutput | Tytuł "List GPOs", kolumna "GPO", label "GPO Lines" | - |
| LiveWire | type=LiveWireLwrpAudio | 5-digit numbering (00001) | - |
| Standard | inne typy | 3-digit numbering (001), fixed size list | - |
| Unassigned | Brak cart | "[unassigned]" w ON/OFF DESCRIPTION | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak walidacji na tym poziomie | - | - | Walidacja w EditGpi |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | gpisButtonData()/gposButtonData() | RDMatrix*, GpioInput/GpioOutput |
| ListGpis -> EditGpi | editData() | gpi number, oncart*, ondesc*, offcart*, offdesc* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "List GPIs" | "RDAdmin - List GPIs" | Screenshot obcina prefix |
| Kolumny | GPI, ON MACRO CART, ON DESCRIPTION, OFF MACRO CART, OFF DESCRIPTION | Zgodne | Zgodne |
| Przyciski | Edit, OK, Cancel | &Edit, &OK, &Cancel | Zgodne |

---

# UI Contract: Edit GPI

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditGpi |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit GPI {N} |
| Modalność | modal (inherited) |
| Rodzic | ListGpis |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_gpi.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_gpi_dialog.png |
| Mockup HTML | ✅ | mockups/EditGpi.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| gpi | int | ListGpis | tak |
| oncart | int* | ListGpis (in/out) | tak |
| ondesc | QString* | ListGpis (in/out) | tak |
| offcart | int* | ListGpis (in/out) | tak |
| offdesc | QString* | ListGpis (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_on_group | QGroupBox | ON Transition | Grupa ON | - |
| edit_onmacro_edit | QLineEdit | Cart Number: (ON) | Numer cart ON macro | - |
| (on select btn) | QPushButton | &Select (ON) | Otwiera RDCartDialog (Macro only) | selectOnData() |
| (on clear btn) | QPushButton | C&lear (ON) | Czyści ON cart | clearOnData() |
| edit_ondescription_edit | QLineEdit | Description: (ON) | Opis cart ON (readonly) | - |
| edit_off_group | QGroupBox | OFF Transition | Grupa OFF | - |
| edit_offmacro_edit | QLineEdit | Cart Number: (OFF) | Numer cart OFF macro | - |
| (off select btn) | QPushButton | &Select (OFF) | Otwiera RDCartDialog (Macro only) | selectOffData() |
| (off clear btn) | QPushButton | C&lear (OFF) | Czyści OFF cart | clearOffData() |
| edit_offdescription_edit | QLineEdit | Description: (OFF) | Opis cart OFF (readonly) | - |
| ok_button | QPushButton | &OK | Waliduje, zapisuje carty do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Oba puste | Nowe GPI | Oba cart numbers puste, descriptions puste | - |
| ON assigned | oncart > 0 | ON Cart Number wypełniony, ON Description z tytułem cart | - |
| OFF assigned | offcart > 0 | OFF Cart Number wypełniony, OFF Description z tytułem cart | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| ON Cart Number | Poprawna liczba int | "Invalid Cart Number!" | OK + niepusty + nie-int | QMessageBox::warning |
| OFF Cart Number | Poprawna liczba int | "Invalid Cart Number!" | OK + niepusty + nie-int | QMessageBox::warning |
| ON/OFF Cart | RDTextValidator | - | Inline | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListGpis | editData() -> exec() | gpi, oncart*, ondesc*, offcart*, offdesc* |
| EditGpi -> RDCartDialog | selectOnData()/selectOffData() | cart number, RDCart::Macro filter |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Edit GPI 2" | "RDAdmin - Edit GPI 2" | Screenshot obcina prefix |
| Grupy | ON Transition, OFF Transition | QGroupBox z tymi tytułami | Zgodne |
| Przyciski | Select, Clear w obu sekcjach | &Select, C&lear | Zgodne |
| Description | Readonly, "Label Test" | readonly QLineEdit | Zgodne |

---

# UI Contract: SAS Switches

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListSasResources |
| Typ | Dialog |
| Tytuł okna | RDAdmin - SAS Switches |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_sas_resources.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListSasResources.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| size | int | EditMatrix (displays count) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | SAS Switches | Lista SAS resources | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditSasResource | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditSasResource | editData() |
| list_ok_button | QPushButton | &OK | Zapisuje do VGUEST_RESOURCES | okData() |
| list_cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

Kolumny Q3ListView:
- GPIO Line (3-digit)
- Console
- Source
- Opto/Relay

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista załadowana | Otwarcie | Lista GPIO lines z Console/Source/Relay | - |
| Puste pola | Brak resource | Puste kolumny Console/Source/Relay | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak na tym poziomie | - | - | Walidacja w EditSasResource |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | sasResourcesButtonData() | RDMatrix*, displays_count |
| ListSasResources -> EditSasResource | editData() | enginenum*, devicenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: Edit SAS Switch

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSasResource |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit SAS Switch |
| Modalność | modal |
| Rodzic | ListSasResources |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_sas_resource.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditSasResource.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| enginenum | int* | ListSasResources (in/out) | tak |
| devicenum | int* | ListSasResources (in/out) | tak |
| relaynum | int* | ListSasResources (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_enginenum_edit | QLineEdit | Console Number: | Numer konsoli SAS | - |
| edit_devicenum_edit | QLineEdit | Source Number: | Numer źródła SAS | - |
| edit_relaynum_edit | QLineEdit | Opto/Relay Number: | Numer opto/relay | - |
| ok_button | QPushButton | &OK | Waliduje, zapisuje do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Nowy | Wszystkie -1 | Puste pola | - |
| Edycja | Wartości >= 0 | Wypełnione pola | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Console Number | Poprawna liczba int | "The Console Number is Invalid!" | OK + niepuste + nie-int | QMessageBox::warning |
| Source Number | Poprawna liczba int | "The Source Number is Invalid!" | OK + niepuste + nie-int | QMessageBox::warning |
| Opto/Relay Number | Poprawna liczba int | "The Opto/Relay Number is Invalid!" | OK + niepuste + nie-int | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSasResources | editData() -> exec() | enginenum*, devicenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: vGuest Switches / Displays

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListVguestResources |
| Typ | Dialog |
| Tytuł okna | RDAdmin - vGuest Switches / RDAdmin - vGuest Displays |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_vguest_resources.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListVguestResources.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| type | RDMatrix::VguestType | EditMatrix (VguestTypeRelay/VguestTypeDisplay) | tak |
| size | int | EditMatrix (gpos_count / displays_count) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | - | Lista vGuest resources | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditVguestResource | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditVguestResource | editData() |
| list_ok_button | QPushButton | &OK | Zapisuje do VGUEST_RESOURCES | okData() |
| list_cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

Kolumny Q3ListView dla Relay mode:
- GPIO LINE (3-digit)
- ENGINE (Hex)
- DEVICE (Hex)
- SURFACE (Hex)
- BUS/RELAY (Hex)

Kolumny Q3ListView dla Display mode:
- DISPLAY (3-digit)
- ENGINE (Hex)
- DEVICE (Hex)
- SURFACE (Hex)

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Relay mode | type=VguestTypeRelay | Tytuł "vGuest Switches", 5 kolumn | - |
| Display mode | type=VguestTypeDisplay | Tytuł "vGuest Displays", 4 kolumny (bez BUS/RELAY) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak na tym poziomie | - | - | Walidacja w EditVguestResource |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | vguestRelaysButtonData()/vguestDisplaysButtonData() | RDMatrix*, VguestType, size |
| ListVguestResources -> EditVguestResource | editData() | VguestType, enginenum*, devicenum*, surfacenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |

---

# UI Contract: Edit vGuest Resource

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditVguestResource |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit vGuest Switch / RDADmin - Edit vGuest Display |
| Modalność | modal |
| Rodzic | ListVguestResources |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_vguest_resource.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditVguestResource.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| type | RDMatrix::VguestType | ListVguestResources | tak |
| enginenum | int* | ListVguestResources (in/out) | tak |
| devicenum | int* | ListVguestResources (in/out) | tak |
| surfacenum | int* | ListVguestResources (in/out) | tak |
| relaynum | int* | ListVguestResources (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_enginenum_edit | QLineEdit | Engine (Hex): | Numer engine Logitek (hex) | - |
| edit_devicenum_edit | QLineEdit | Device (Hex): | Numer device Logitek (hex) | - |
| edit_surfacenum_edit | QLineEdit | Surface (Hex): | Numer surface Logitek (hex) | - |
| edit_relaynum_edit | QLineEdit | Bus/Relay (Hex): | Numer bus/relay (hex) | - |
| ok_button | QPushButton | &OK | Waliduje hex, zapisuje do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Switch mode | type=VguestTypeRelay | Tytuł "Edit vGuest Switch", Bus/Relay enabled | - |
| Display mode | type=VguestTypeDisplay | Tytuł "Edit vGuest Display", Bus/Relay disabled | edit_relaynum_edit disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Engine (Hex) | Poprawna liczba hex | "The Engine Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |
| Device (Hex) | Poprawna liczba hex | "The Device Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |
| Surface (Hex) | Poprawna liczba hex | "The Surface Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |
| Bus/Relay (Hex) | Poprawna liczba hex | "The Bus/Relay Number is Invalid!" | OK + niepuste + nie-hex | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListVguestResources | editData() -> exec() | VguestType, enginenum*, devicenum*, surfacenum*, relaynum* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
| Tytuł Display | - | "RDADmin" (literówka w kodzie) | Typo: "RDADmin" zamiast "RDAdmin" |

---

# UI Contract: Livewire Node List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListNodes |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Livewire Node List |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_nodes.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListNodes.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix parent | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | RDListView | (columns: HOSTNAME, DESCRIPTION, FIRST OUTPUT, TCP PORT) | wyświetla listę nodów LiveWire | doubleClicked→doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera EditNode w trybie add | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditNode w trybie edit | editData() |
| list_delete_button | QPushButton | &Delete | usuwa wybrany node | deleteData() |
| list_close_button | QPushButton | &Close | zamyka dialog, purge endpoints | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak nodów w SWITCHER_NODES | Pusta lista, przyciski aktywne | - |
| Lista z elementami | istnieją nody | Lista z kolumnami HOSTNAME, DESCRIPTION, FIRST OUTPUT, TCP PORT | - |
| FIRST OUTPUT = [none] | BASE_OUTPUT == 0 | Tekst "[none]" w kolumnie FIRST OUTPUT | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Wybrany element (delete) | Potwierdzenie usunięcia | "Are your sure you want to delete this node?" | Kliknięcie Delete | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | Otwiera ListNodes | RDMatrix* matrix |
| ListNodes → EditNode (Add) | Kliknięcie Add | id=-1 (nowy), matrix |
| ListNodes → EditNode (Edit) | Kliknięcie Edit / Double-click | id wybranego noda, matrix |
| closeData | Purge INPUTS + OUTPUTS endpoints, done(0) | - |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Edit LiveWire Node

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditNode |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit LiveWire Node |
| Modalność | modal |
| Rodzic | ListNodes |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_node.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditNode.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | int* | ListNodes (-1 = nowy) | tak |
| matrix | RDMatrix* | ListNodes | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_hostname_edit | QLineEdit | Hostname: | wprowadzenie hostname noda | - |
| edit_tcpport_spin | QSpinBox | Port: | TCP port (0-65535) | - |
| edit_description_edit | QLineEdit | Description: | opis noda | - |
| edit_output_spin | QSpinBox | First Output: | bazowy output (0-32767, 0=None) | - |
| edit_password_edit | QLineEdit | Password: | hasło (EchoMode=Password) | passwordChangedData() |
| button (View Node Info) | QPushButton | &View Node Info | otwiera ViewNodeInfo | viewData() |
| button (OK) | QPushButton | &OK | zapisuje i zamyka | okData() |
| button (Cancel) | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Tryb Add | id < 0 | Puste pola, TCP port = RD_LIVEWIRE_DEFAULT_TCP_PORT | - |
| Tryb Edit | id >= 0 | Pola wypełnione z DB, hasło = "********" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| hostname + port | Unikalność w matrycy (STATION + MATRIX + HOSTNAME + TCP_PORT) | "That node is already listed for this matrix!" | OK w trybie Add, duplikat | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListNodes (Add) | addData() | id=-1, matrix |
| ListNodes (Edit) | editData() | id wybranego noda, matrix |
| EditNode → ViewNodeInfo | Kliknięcie View Node Info | hostname, port, password, base_output |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Viewing Livewire Node

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ViewNodeInfo |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Viewing Livewire Node |
| Modalność | modal |
| Rodzic | EditNode |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/view_node_info.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ViewNodeInfo.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| hostname | QString | EditNode | tak |
| port | Q_UINT16 | EditNode | tak |
| passwd | QString | EditNode | tak |
| base_output | unsigned | EditNode | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| view_hostname_edit | QLineEdit (readOnly) | Hostname: | wyświetla hostname | - |
| view_tcpport_edit | QLineEdit (readOnly) | Port: | wyświetla TCP port | - |
| view_system_edit | QLineEdit (readOnly) | System Version: | wypełniane z LiveWire | connectedData() |
| view_protocol_edit | QLineEdit (readOnly) | Protocol Version: | wypełniane z LiveWire | connectedData() |
| view_sources_edit | QLineEdit (readOnly) | Sources: | liczba źródeł | connectedData() |
| view_destinations_edit | QLineEdit (readOnly) | Destinations: | liczba destynacji | connectedData() |
| view_channels_edit | QLineEdit (readOnly) | Channels: | liczba kanałów | connectedData() |
| view_gpis_edit | QLineEdit (readOnly) | GPIs: | liczba GPI (format: total [bundles X size]) | connectedData() |
| view_gpos_edit | QLineEdit (readOnly) | GPOs: | liczba GPO (format: total [bundles X size]) | connectedData() |
| view_sources_view | RDListView | Sources (columns: #, Input #, Name, Active, Shareable, Chans, Gain) | lista źródeł | sourceChangedData() |
| view_destinations_view | RDListView | Destinations (columns: #, Output #, Name, Chans, Load, Gain) | lista destynacji | destinationChangedData() |
| button (Close) | QPushButton | &Close | zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Łączenie | Tuż po otwarciu | Pola wersji puste, listy puste - oczekiwanie na połączenie | - |
| Połączono | connectedData() | Pola wersji wypełnione, listy wypełniają się dynamicznie | - |
| Source [unassigned] | channelNumber <= 0 | Input # = "[unassigned]" | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - dialog read-only |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditNode | Kliknięcie "View Node Info" | hostname, port, password, base_output |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Livewire GPIO Source Assignments

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListLiveWireGpios |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Livewire GPIO Source Assignments |
| Modalność | modal |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_livewiregpios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListLiveWireGpios.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| slot_quan | int | EditMatrix (liczba slotów GPIO) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | RDListView | Switchers: (columns: Lines, Source #, Surface Address) | wyświetla sloty GPIO | doubleClicked→doubleClickedData() |
| list_edit_button | QPushButton | &Edit | otwiera EditLiveWireGpio | editData() |
| list_ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| list_cancel_button | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista slotów | zawsze | Wiersze "X - Y" (grupy po 5 linii GPIO), Source # i Surface Address | - |
| Source = [none] | SOURCE_NUMBER == 0 | "[none]" w kolumnie Source # | - |
| Address = [all] | IP_ADDRESS puste | "[all]" w kolumnie Surface Address | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji na tym poziomie |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | Otwiera ListLiveWireGpios | matrix, slot_quan |
| ListLiveWireGpios → EditLiveWireGpio | Kliknięcie Edit / Double-click | slot number, source, address |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Edit GPIO Source

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditLiveWireGpio |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit GPIO Source |
| Modalność | modal |
| Rodzic | ListLiveWireGpios |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_livewiregpio.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditLiveWireGpio.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| slot | int | ListLiveWireGpios | tak |
| source | int* | ListLiveWireGpios (in/out) | tak |
| addr | QHostAddress* | ListLiveWireGpios (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| label (title) | QLabel | GPIO Lines X - Y (dynamicznie: 5*slot+1 - 5*slot+5) | info header | - |
| edit_source_number_spin | QSpinBox | Livewire Source: | numer źródła (0-RD_LIVEWIRE_MAX_SOURCE, 0=None) | - |
| edit_ip_address_edit | QLineEdit | Surface Address: | adres IP surface | - |
| button (OK) | QPushButton | &OK | waliduje i zamyka | okData() |
| button (Cancel) | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | Pola wypełnione z parametrów wejściowych | - |
| Adres pusty | addr.isNull() | Pole Surface Address puste | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| edit_ip_address_edit | Poprawny adres IP (lub pusty, lub "0.0.0.0") | "The IP address is invalid!" | OK, niepoprawny IP | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListLiveWireGpios | editData() / double-click | slot, source*, addr* |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Edit Channel GPIOs

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditChannelGpios |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Channel GPIOs |
| Modalność | modal |
| Rodzic | EditAudioPorts |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_channelgpios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_channel_gpios_dialog.png |
| Mockup HTML | ✅ | mockups/EditChannelGpios.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| conf | RDAirPlayConf* | EditAudioPorts | tak |
| chan | RDAirPlayConf::Channel | EditAudioPorts (enum kanału) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_title_label | QLabel | (dynamicznie: channelText(chan)) | tytuł kanału | - |
| edit_start_gpi_matrix_spin | QSpinBox | Start GPI: (matrix) | matryca start GPI (-1..MAX_MATRICES, -1=None) | startMatrixGpiChangedData() |
| edit_start_gpi_line_spin | QSpinBox | (line) | linia start GPI (1..MAX_GPIO_PINS) | - |
| edit_start_gpo_matrix_spin | QSpinBox | Start GPO: (matrix) | matryca start GPO (-1..MAX_MATRICES, -1=None) | startMatrixGpoChangedData() |
| edit_start_gpo_line_spin | QSpinBox | (line) | linia start GPO (1..MAX_GPIO_PINS) | - |
| edit_stop_gpi_matrix_spin | QSpinBox | Stop GPI: (matrix) | matryca stop GPI (-1..MAX_MATRICES, -1=None) | stopMatrixGpiChangedData() |
| edit_stop_gpi_line_spin | QSpinBox | (line) | linia stop GPI (1..MAX_GPIO_PINS) | - |
| edit_stop_gpo_matrix_spin | QSpinBox | Stop GPO: (matrix) | matryca stop GPO (-1..MAX_MATRICES, -1=None) | stopMatrixGpoChangedData() |
| edit_stop_gpo_line_spin | QSpinBox | (line) | linia stop GPO (1..MAX_GPIO_PINS) | - |
| edit_gpio_type_box | QComboBox | Signalling Type: | Edge / Level | - |
| edit_ok_button | QPushButton | OK | zapisuje i zamyka | okData() |
| edit_cancel_button | QPushButton | Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| SoundPanel / Cue channel | chan == SoundPanel1..5 lub Cue | Start GPI label + oba spiny disabled | Start GPI disabled |
| Matrix = None (-1) | matrix spin = -1 | Line spin disabled | Line spin disabled |
| Matrix >= 0 | matrix spin >= 0 | Line spin enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - wartości zawsze w zakresie spinboxów |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditAudioPorts | Otwiera EditChannelGpios | RDAirPlayConf*, Channel |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Main Log Output 1" | Dynamicznie z channelText(chan) | Zgadza się - screenshot pokazuje konkretny kanał |
| Layout | 4 wiersze GPI/GPO + Signalling Type + OK/Cancel | Zgadza się z kodem | Zgodność pełna |

---

# UI Contract: Rivendell Feed List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListFeeds |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Feed List |
| Modalność | non-modal (brak setModal) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_feeds.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListFeeds.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| - | - | - | Brak (odczytuje bezpośrednio z DB) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_feeds_view | RDListView | Podcast Feeds (columns: icon, Key, Title, Public URL, Superfeed, AutoPost, Creation Date) | wyświetla listę feedów | doubleClicked→doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera AddFeed, potem EditFeed | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditFeed | editData() |
| list_delete_button | QPushButton | &Delete | usuwa feed (z postępem) | deleteData() |
| list_repost_button | QPushButton | &Repost | repostuje cały feed | repostData() |
| list_unpost_button | QPushButton | &Unpost | usuwa remote data | unpostData() |
| list_close_button | QPushButton | &Close | zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak feedów | Pusta lista z ikoną i przyciskami | - |
| Lista z feedami | feedy istnieją | Lista z ikoną (32x32), Key, Title, URL, Superfeed Y/N, AutoPost Y/N, Data | - |
| Progress (delete) | deleteData() | QProgressDialog "Deleting remote audio..." | - |
| Progress (repost) | repostData() | QProgressDialog "Posting images...", "Posting item data...", "Posting RSS XML data..." | - |
| Progress (unpost) | unpostData() | QProgressDialog "Unposting..." (XML, items, images) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Wybrany feed (delete) | Potwierdzenie usunięcia | 'Are you sure you want to delete feed "X"?' | Delete | QMessageBox::warning |
| Repost | Potwierdzenie repost | "This operation will repost all XML, image and audio data..." | Repost | QMessageBox::question |
| Unpost | Potwierdzenie unpost | "This operation will unpost (remove) all XML, image and audio data..." | Unpost | QMessageBox::question |
| Delete remote XML | Ostrzeżenie | "Failed to delete remote feed XML." | removeRss() zwraca false | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Menu/button | - |
| ListFeeds → AddFeed | Kliknięcie Add | id*, keyname* |
| ListFeeds → EditFeed | Kliknięcie Add (po AddFeed) lub Edit | feed keyname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Add RSS Feed

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddFeed |
| Typ | Dialog |
| Tytuł okna | RDADmin - Add RSS Feed |
| Modalność | non-modal (brak setModal) |
| Rodzic | ListFeeds |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_feed.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddFeed.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | unsigned* | ListFeeds (out) | tak |
| keyname | QString* | ListFeeds (out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_keyname_edit | QLineEdit | &New Feed Name: | nazwa feeda (max 8 znaków, bez spacji) | textChanged→keynameChangedData() |
| feed_users_box | QCheckBox | Enable Feed for All Users | domyślnie checked | - |
| feed_ok_button | QPushButton | &OK | tworzy feed | okData() |
| feed_cancel_button | QPushButton | &Cancel | zamyka bez tworzenia | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Puste pole | keyname puste | OK disabled | OK disabled |
| Pole wypełnione | keyname niepuste | OK enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| feed_keyname_edit | Max 8 znaków, bez spacji (RDTextValidator) | - | Na bieżąco | validator |
| feed_keyname_edit | Niepuste | OK disabled gdy puste | Na bieżąco | keynameChangedData |
| Tworzenie feeda | RDFeed::create() musi się powieść | err_msg z RDFeed::create | OK, błąd tworzenia | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListFeeds | addData() | id*, keyname* |
| AddFeed → done(0) | OK sukces | id i keyname ustawione |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Feed Editor

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditFeed |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Feed: {keyname} |
| Modalność | non-modal (brak setModal) |
| Rodzic | ListFeeds |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_feed.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditFeed.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| feed | QString (key name) | ListFeeds | tak |

## Widgety i interakcje

### Nagłówek (top)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_is_superfeed_box | QComboBox | Is Superfeed: (No/Yes) | przełącza tryb superfeed | superfeedActivatedData() |
| feed_is_superfeed_button | QPushButton | Select Member Feeds | otwiera EditSuperfeed | selectSubfeedsData() |
| feed_list_images_button | QPushButton | Manage Images | otwiera ListImages | listImagesData() |

### Channel Values (lewa strona, GroupBox)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_channel_title_edit | QLineEdit | Title: | tytuł kanału (max 191) | - |
| feed_channel_category_box | RDRssCategoryBox | Category: | kategoria RSS | - |
| feed_channel_link_edit | QLineEdit | Link: | link kanału (max 191) | - |
| feed_channel_copyright_edit | QLineEdit | Copyright: | copyright (max 64) | - |
| feed_channel_editor_edit | QLineEdit | Editor: | edytor (max 64) | - |
| feed_channel_author_edit | QLineEdit | Author: | autor (max 64) | - |
| feed_channel_author_is_default_check | QCheckBox | Use as default Item Author | domyślny autor itema | - |
| feed_channel_owner_name_edit | QLineEdit | Owner Name: | właściciel (max 64) | - |
| feed_channel_owner_email_edit | QLineEdit | Owner E-Mail: | email właściciela (max 64) | - |
| feed_channel_webmaster_edit | QLineEdit | Webmaster: | webmaster (max 64) | - |
| feed_channel_language_edit | QLineEdit | Language: | język (max 8) | - |
| feed_channel_explicit_check | QCheckBox | Channel contains explicit content | oznaczenie explicit | - |
| feed_channel_description_edit | QTextEdit | Description: | opis kanału (multiline) | - |
| feed_channel_image_box | RDImagePickerBox | Image: | obraz kanału | - |

### Upload / Audio (lewa strona, poniżej groupbox)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_purge_url_edit | QLineEdit | Upload URL: | URL uploadu (max 191) | purgeUrlChangedData() |
| feed_purge_username_edit | QLineEdit | Username: | username (max 64) | lineeditChangedData() |
| feed_purge_password_edit | QLineEdit (Password) | Password: | hasło (max 64) | - |
| feed_purge_use_id_file_check | QCheckBox | Authenticate with local identity file | użyj SSH id file | - |
| feed_format_edit | QLineEdit (readOnly) | Audio Format: | opis formatu audio | - |
| feed_format_button | QPushButton | S&et | otwiera RDExportSettingsDialog | setFormatData() |
| feed_normalize_check | QCheckBox | Normalize | włącz normalizację | checkboxToggledData() |
| feed_normalize_spin | QSpinBox | Level: | poziom normalizacji (-30..-1 dBFS) | - |
| feed_extension_edit | QLineEdit | Audio Extension: | rozszerzenie pliku (max 16) | - |
| feed_base_url_edit | QLineEdit | Download URL: | bazowy URL downloadu (max 191) | - |
| feed_autopost_box | QComboBox | Enable AutoPost: (No/Yes) | autopost | - |
| feed_max_shelf_life_spin | QSpinBox | Default Shelf Life: | czas życia (0-365 dni, 0=Unlimited) | - |
| feed_item_image_box | RDImagePickerBox | Default Item Image: | domyślny obraz itema | - |
| feed_base_preamble_edit | QLineEdit | Enclosure Preamble: | preambuła enclosure (max 191) | - |
| feed_castorder_box | QComboBox | Episode Sort Order: | Descending / Ascending | - |

### RSS Schema (prawa strona)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_rss_schema_box | QComboBox | RSS Schema: | wybór schematu RSS | schemaActivatedData() |
| feed_header_xml_edit | QTextEdit | Header XML: | XML nagłówka | - |
| feed_header_xml_button | QPushButton | Copy to Clipboard | kopiuje header XML | copyHeaderXmlData() |
| feed_channel_xml_edit | QTextEdit | Channel XML: | XML kanału | - |
| feed_channel_xml_button | QPushButton | Copy to Clipboard | kopiuje channel XML | copyChannelXmlData() |
| feed_item_xml_edit | QTextEdit | Item XML: | XML itema | - |
| feed_item_xml_button | QPushButton | Copy to Clipboard | kopiuje item XML | copyItemXmlData() |

### Przyciski
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| feed_cancel_button | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Superfeed=Yes | is_superfeed=1 | Select Member Feeds enabled; shelf life, autopost, format, normalize, extension, item XML disabled | Wiele pól disabled |
| Superfeed=No | is_superfeed=0 | Select Member Feeds disabled; pola audio enabled | Member Feeds button disabled |
| Custom Schema | RSS schema=Custom | Header/Channel/Item XML editable | - |
| Non-custom Schema | RSS schema != Custom | Header/Channel XML read-only, Item XML disabled gdy superfeed | XML fields disabled |
| Normalize off | normalize unchecked | Level spin + label + unit disabled | Level disabled |
| SFTP URL + SSH key | Upload URL scheme=sftp i SSH id file istnieje | Checkbox SSH id file enabled | - |
| Empty username | purge username empty | Password disabled | Password disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Superfeed subfeeds | Superfeed musi mieć >= 1 subfeed | "Superfeed must have at least one subfeed assigned!" | OK, superfeed bez subfeedów | QMessageBox::warning |
| Upload URL | Schemat URL musi być obsługiwany | "Audio Upload URL has unsupported scheme!" | OK, nieobsługiwany schemat | QMessageBox::warning |
| Post XML | postXmlConditional() musi się powieść | (wewnętrzny dialog) | OK, błąd postowania | postXmlConditional |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListFeeds | addData() / editData() | feed keyname |
| EditFeed → EditSuperfeed | Select Member Feeds | RDFeed* |
| EditFeed → ListImages | Manage Images | RDImagePickerModel*, RDFeed* |
| EditFeed → RDExportSettingsDialog | Set (format) | RDSettings* |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: RSS Superfeed

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSuperfeed |
| Typ | Dialog |
| Tytuł okna | RDAdmin - RSS Superfeed: {keyName} |
| Modalność | non-modal (brak setModal) |
| Rodzic | EditFeed |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_superfeed.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditSuperfeed.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| feed | RDFeed* | EditFeed | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_host_sel | RDListSelector | Available Feeds / Member Feeds | dual-list selector | - |
| ok_button | QPushButton | &OK | zapisuje mapowanie i zamyka | okData() |
| cancel_button | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | Dwie listy: Available Feeds (non-superfeedy) i Member Feeds (przypisane) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - RDListSelector zarządza przesuwaniem |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditFeed | Select Member Feeds | RDFeed* |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Image Manager

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListImages |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Image Manager |
| Modalność | non-modal (brak setModal) |
| Rodzic | EditFeed |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_images.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListImages.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| model | RDImagePickerModel* | EditFeed | tak |
| feed | RDFeed* | EditFeed (via exec()) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | QListView | (model: RDImagePickerModel, 40x40 thumbnails) | wyświetla listę obrazów | clicked→clickedData(), doubleClicked→doubleClickedData() |
| list_add_button | QPushButton | Add | otwiera QFileDialog, importuje i uploaduje obraz | addData() |
| list_view_button | QPushButton | View | otwiera EditImage | viewData() |
| list_delete_button | QPushButton | Delete | usuwa wybrany obraz | deleteData() |
| list_close_button | QPushButton | Close | zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Brak selekcji | nic nie wybrane | View i Delete reagują na kliknięcie | View/Delete stany zależą od kliknięcia |
| Obraz wybrany | kliknięcie na element z DecorationRole | View i Delete enabled | - |
| Pusta pozycja | kliknięcie na element bez DecorationRole | View i Delete disabled | View/Delete disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Import pliku | importImageFile() musi się powieść | "Image import failed." + err_msg | Add, błąd importu | QMessageBox::warning |
| Upload obrazu | postImage() musi się powieść | "Image upload failed!" | Add, błąd uploadu | QMessageBox::warning |
| Usunięcie - in use | Obraz nie może być używany jako channel/default/item image | "Image is in use as {roles}." | Delete, obraz w użyciu | QMessageBox::warning |
| Usunięcie - potwierdzenie | Potwierdzenie usunięcia | "Are you sure you want to delete this image?" | Delete | QMessageBox::question |
| Usunięcie - błąd | deleteImage() musi się powieść | "Image deletion failed!" + err_msg | Delete, błąd usunięcia | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditFeed | Manage Images | RDImagePickerModel*, RDFeed* |
| ListImages → EditImage | Add (po imporcie) / View / Double-click | img_id |
| ListImages → QFileDialog | Add | filtr: RD_PODCAST_IMAGE_FILE_FILTER |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Image Viewer

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditImage |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Image Viewer |
| Modalność | non-modal (brak setModal) |
| Rodzic | ListImages |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_image.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditImage.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| img_id | int | ListImages (via exec()) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| c_image_label | QLabel | (wyświetla obraz skalowany do okna) | podgląd obrazu | - |
| c_description_edit | QLineEdit | Description: | opis obrazu (max 191, edytowalny) | - |
| c_url_edit | QLineEdit (readOnly) | URL: | URL obrazu (autogenerowany) | - |
| c_size_value_label | QLabel | Native Size: | wymiary obrazu WxH | - |
| c_extension_value_label | QLabel | Type: | rozszerzenie pliku (uppercase) | - |
| c_ok_button | QPushButton | OK | zapisuje opis i zamyka | okData() |
| c_cancel_button | QPushButton | Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | exec(img_id) | Obraz wyświetlony skalowany, metadane wypełnione z DB | - |
| Resize | zmiana rozmiaru okna | Obraz przeskalowany do nowego rozmiaru (KeepAspectRatio) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - description zawsze poprawny |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListImages | addData() (po imporcie), viewData(), double-click | img_id |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |

---

# UI Contract: Rivendell Replicators

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListReplicators |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Replicators |
| Modalność | modal |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_replicators.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.rivendell_replicators_dialog.png |
| Mockup HTML | ✅ | mockups/ListReplicators.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_replicators_view | RDListView | Replicators: | Wyświetla listę replikatorów (NAME, TYPE, DESCRIPTION, HOST) | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddReplicator dialog | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditReplicator dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany replikator po potwierdzeniu | deleteData() |
| list_list_button | QPushButton | &List\nCarts | Otwiera ListReplicatorCarts dla wybranego | listData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (default button) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusta lista | Brak replikatorów w DB | Pusta tabela z nagłówkami kolumn | - |
| Lista z danymi | Istnieją replikatory | Tabela z wierszami (NAME, TYPE, DESCRIPTION, HOST) | - |
| Brak zaznaczenia | Nie wybrano wiersza | Edit/Delete/List Carts klikalne ale ignorowane (return) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Zaznaczenie (delete) | Wymaga wybranego itemu | "Are you sure you want to delete replicator \"{name}\"?" | Klik Delete | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Przycisk "Manage Replicators" | (nic) |
| ListReplicators → AddReplicator | Przycisk Add | QString *name (out) |
| ListReplicators → EditReplicator | Przycisk Edit / double-click | QString name (replicator name) |
| ListReplicators → ListReplicatorCarts | Przycisk List Carts | QString name (replicator name) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Zgodność | Pełna | Pełna | Screenshot dokładnie odpowiada kodowi |

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

---

# UI Contract: Replicator Editor

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditReplicator |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Replicator: {repl_name} |
| Modalność | modal |
| Rodzic | ListReplicators / AddReplicator |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_replicator.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.replicator_dialog.png |
| Mockup HTML | ✅ | mockups/EditReplicator.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| repl_name | const QString& | Nazwa replikatora z listy | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| repl_name_edit | QLineEdit | Name: | Wyświetla nazwę (readOnly, max 32) | - |
| repl_description_edit | QLineEdit | Description: | Opis replikatora (max 64) | - |
| repl_type_box | QComboBox | Type: | Wybór typu replikatora (RDReplicator::Type enum) | - |
| repl_station_box | QComboBox | Host System: | Wybór stacji z DB STATIONS | - |
| repl_url_edit | QLineEdit | Audio Upload URL: | URL do uploadu audio (max 255) | - |
| repl_username_edit | QLineEdit | Username: | Nazwa użytkownika (max 64) | - |
| repl_password_edit | QLineEdit | Password: | Hasło (echoMode=Password, max 64) | - |
| repl_format_edit | QLineEdit | Upload Format: | Opis formatu audio (readOnly) | - |
| repl_format_button | QPushButton | S&et | Otwiera RDExportSettingsDialog | setFormatData() |
| repl_normalize_box | QCheckBox | Normalize | Włącza/wyłącza normalizację | normalizeCheckData() |
| repl_normalize_spin | QSpinBox | Level: | Poziom normalizacji (-30 do -1 dBFS) | - |
| repl_groups_sel | RDListSelector | Available Groups / Active Groups | Przypisanie grup do replikatora | - |
| ok_button | QPushButton | &OK | Zapisuje zmiany (default) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Normalize ON | repl_normalize_box checked | Level spin + dBFS label aktywne | - |
| Normalize OFF | repl_normalize_box unchecked | Level spin + dBFS label disabled | repl_normalize_label, repl_normalize_spin, repl_normalize_unit_label disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak jawnych walidacji) | - | - | - | okData() zapisuje bez sprawdzeń |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReplicators | Edit / double-click | QString repl_name |
| AddReplicator | Po INSERT do DB | QString repl_name_edit->text() |
| EditReplicator → RDExportSettingsDialog | Przycisk Set | RDSettings* repl_settings |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Zgodność | Pełna | Pełna | Screenshot dokładnie odpowiada kodowi |

---

# UI Contract: Replicator Carts

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListReplicatorCarts |
| Typ | Dialog |
| Tytuł okna | RDAdmin - {replname} Replicator Carts |
| Modalność | modal |
| Rodzic | ListReplicators |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_replicator_carts.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListReplicatorCarts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| replname | const QString& | Nazwa replikatora z ListReplicators | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | RDListView | Active Carts: | Wyświetla karty replikatora (icon, CART, TITLE, LAST POSTED, POSTED FILENAME) | - |
| list_repost_button | QPushButton | &Repost | Oznacza wybraną kartę do repostu (REPOST=Y) | repostData() |
| list_repost_all_button | QPushButton | Repost\n&All | Oznacza wszystkie karty replikatora do repostu | repostAllData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (default) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusta lista | Brak kart w REPL_CART_STATE | Pusta tabela z nagłówkami | - |
| Lista z danymi | Istnieją karty | Tabela z ikonami (Audio=play, Macro=rml5), numerem, tytułem, datą i plikiem | - |
| Auto-refresh | Co 5 sekund | Aktualizacja kolumny LAST POSTED | Timer 5000ms (single-shot, restartowany) |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Zaznaczenie (repost) | Wymaga wybranego itemu | (brak komunikatu, return) | Klik Repost bez zaznaczenia | repostData() |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReplicators | Przycisk List Carts | QString replname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |

---

# UI Contract: Rivendell Report List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListReports |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Report List |
| Modalność | modal |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_reports.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListReports.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_box | Q3ListBox | R&eports: | Wyświetla listę nazw raportów z DB REPORTS | doubleClickedData() |
| list_add_button | QPushButton | &Add | Otwiera AddReport, potem EditReport | addData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditReport dla wybranego | editData() |
| list_delete_button | QPushButton | &Delete | Usuwa wybrany raport po potwierdzeniu | deleteData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (default) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusta lista | Brak raportów w DB | Pusta lista | - |
| Lista z danymi | Istnieją raporty | Lista nazw raportów | - |
| Brak zaznaczenia | Nie wybrano elementu | Edit/Delete klikalne ale ignorowane | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Zaznaczenie (delete) | Wymaga wybranego itemu | "Are you sure you want to delete report \"{name}\"?" | Klik Delete | QMessageBox::warning "Delete Report" |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Przycisk "Manage Reports" | (nic) |
| ListReports → AddReport | Przycisk Add | QString* rptname (out) |
| ListReports → EditReport | Przycisk Edit / double-click / po Add | QString rptname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |

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

---

# UI Contract: Edit Report

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditReport |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Report {rptname} |
| Modalność | modal |
| Rodzic | ListReports |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_report.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditReport.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| rptname | QString | Nazwa raportu z ListReports | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_description_edit | QLineEdit | &Report Description: | Opis raportu (max 64) | - |
| edit_filter_box | QComboBox | Export &Filter: | Typ filtra eksportu (RDReport::ExportFilter enum) | - |
| edit_stationid_edit | QLineEdit | Station ID: | Identyfikator stacji (max 16, RDTextValidator) | - |
| edit_cartzeros_box | QCheckBox | Use Leading Zeros | Wiodące zera w numerach kart | leadingZerosToggled() |
| edit_cartdigits_spin | QSpinBox | Digits: | Liczba cyfr (1-6) | - |
| edit_stationtype_box | QComboBox | Station Type: | Typ stacji (RDReport::StationType enum) | - |
| edit_linesperpage_spin | QSpinBox | Lines per Page: | Linie na stronę (10-200, hidden) | - |
| edit_servicename_edit | QLineEdit | Ser&vice Name: | Nazwa serwisu (max 64) | - |
| edit_stationformat_edit | QLineEdit | Station &Format: | Format stacji (max 64) | - |
| edit_path_edit | QLineEdit | Export Path: | Ścieżka eksportu Linux (max 255, RDTextValidator) | - |
| edit_postexport_cmd_edit | QLineEdit | Post Export Cmd: | Komenda po eksporcie (RDTextValidator) | - |
| edit_traffic_box | QCheckBox | Traffic | Eksportuj zdarzenia Traffic | - |
| edit_music_box | QCheckBox | Music | Eksportuj zdarzenia Music | - |
| edit_generic_box | QCheckBox | All | Eksportuj wszystkie typy zdarzeń | genericEventsToggledData() |
| edit_forcetraffic_box | QCheckBox | Traffic Log | Wymuszaj źródło: Traffic Log | - |
| edit_forcemusic_box | QCheckBox | Music Log | Wymuszaj źródło: Music Log | - |
| edit_onairflag_box | QComboBox | Include Only OnAir Events: | No/Yes | - |
| edit_daypart_check | QCheckBox | Filter by Daypart | Włącza filtrowanie po porze dnia | toggled → enable/disable time edits |
| edit_starttime_edit | Q3TimeEdit | Start Time: | Czas rozpoczęcia daypartu | - |
| edit_endtime_edit | Q3TimeEdit | End Time: | Czas zakończenia daypartu | - |
| edit_service_sel | RDListSelector | Available Services / Source Services | Przypisanie serwisów do raportu | - |
| edit_station_sel | RDListSelector | Available Hosts / Source Hosts | Przypisanie stacji do raportu | - |
| edit_group_box | QCheckBox | Filter by Groups | Włącza filtrowanie po grupach | toggled → enable/disable group_sel |
| edit_group_sel | RDListSelector | Available Groups / Allowed Groups | Przypisanie grup do raportu | - |
| ok_button | QPushButton | &OK | Zapisuje zmiany (default) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Leading Zeros ON | edit_cartzeros_box checked | Digits spin aktywny | - |
| Leading Zeros OFF | edit_cartzeros_box unchecked | Digits spin disabled | edit_cartdigits_label, edit_cartdigits_spin disabled |
| Generic Events ON | edit_generic_box checked | Traffic/Music checkboxy disabled | edit_traffic_box, edit_music_box, edit_traffic_label, edit_music_label disabled |
| Generic Events OFF | edit_generic_box unchecked | Traffic/Music checkboxy aktywne | - |
| Daypart ON | edit_daypart_check checked | Start/End time editable | - |
| Daypart OFF | edit_daypart_check unchecked | Start/End time disabled | edit_starttime_edit, edit_endtime_edit, labels disabled |
| Groups Filter ON | edit_group_box checked | Group selector aktywny | - |
| Groups Filter OFF | edit_group_box unchecked | Group selector disabled | edit_group_sel disabled |
| Lines per Page | Zawsze | Ukryty (hidden) | edit_linesperpage_spin + label hidden |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak jawnych walidacji) | - | - | - | okData() zapisuje bez sprawdzeń |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReports | Edit / double-click / po Add | QString rptname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |