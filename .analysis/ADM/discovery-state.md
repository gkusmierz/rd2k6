---
phase: 1
artifact: ADM
artifact_name: rdadmin
status: done
completed_at: 2026-04-06
agent_version: 1.1.0
---

# Discovery State: rdadmin

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdadmin/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | `bin_PROGRAMS = rdadmin` |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 81 |
| Pliki .cpp | 84 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts (i18n) | 7 (cs, de, es, fr, nb, nn, pt_BR) |
| Pliki inne | 4 (2x .xpm, 1x .pro, 1x .html) |
| Linie kodu (est.) | ~36 007 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdadmin.cpp:376 | `int main(int argc, char *argv[])` | Punkt startowy procesu |
| QApplication | rdadmin.cpp:378-379 | `QApplication a(argc,argv)` | Inicjalizacja Qt GUI |
| MainWidget | rdadmin.h | `class MainWidget : public RDWidget` | Główny widget aplikacji (nie QMainWindow) |

Uwaga: rdadmin NIE używa QMainWindow — główne okno to `MainWidget` dziedziczący z `RDWidget` (który sam dziedziczy z QWidget w librd).

## Klasy Qt (identyfikowane) — 81 klas z Q_OBJECT

### MainWidget (RDWidget) — 1 klasa

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdadmin.h | RDWidget | Główny widget z menu administracyjnym |

### ImportFields (RDWidget) — 1 klasa

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| ImportFields | importfields.h | RDWidget | Widget pól importu audio |

### Dialogi "Add" (RDDialog) — 10 klas

| Klasa | Plik .h | Opis |
|-------|---------|------|
| AddFeed | add_feed.h | Dodawanie kanału RSS/podcast |
| AddGroup | add_group.h | Dodawanie grupy kartów |
| AddHostvar | add_hostvar.h | Dodawanie zmiennej hosta |
| AddMatrix | add_matrix.h | Dodawanie matrycy przełączania |
| AddReplicator | add_replicator.h | Dodawanie replikatora |
| AddReport | add_report.h | Dodawanie raportu |
| AddSchedCode | add_schedcodes.h | Dodawanie kodu harmonogramu |
| AddStation | add_station.h | Dodawanie stacji |
| AddSvc | add_svc.h | Dodawanie serwisu (usługi) |
| AddUser | add_user.h | Dodawanie użytkownika |

### Dialogi "Edit" (RDDialog) — 34 klasy

| Klasa | Plik .h | Opis |
|-------|---------|------|
| EditAudioPorts | edit_audios.h | Edycja portów audio stacji |
| EditCartSlots | edit_cartslots.h | Edycja slotów kartów |
| EditChannelGpios | edit_channelgpios.h | Edycja GPIO kanałów |
| EditDecks | edit_decks.h | Edycja decków nagrywania/odtwarzania |
| EditDropbox | edit_dropbox.h | Edycja dropboxa (auto-import) |
| EditEndpoint | edit_endpoint.h | Edycja endpointu matrycy |
| EditFeed | edit_feed.h | Edycja kanału RSS/podcast |
| EditFeedPerms | edit_feed_perms.h | Edycja uprawnień do kanałów |
| EditGpi | edit_gpi.h | Edycja GPI (General Purpose Input) |
| EditGroup | edit_group.h | Edycja grupy kartów |
| EditHostvar | edit_hostvar.h | Edycja zmiennej hosta |
| EditHotkeys | edit_hotkeys.h | Edycja klawiszy skrótów |
| EditImage | edit_image.h | Edycja obrazu/grafiki |
| EditJack | edit_jack.h | Edycja konfiguracji JACK |
| EditJackClient | edit_jack_client.h | Edycja klienta JACK |
| EditLiveWireGpio | edit_livewiregpio.h | Edycja GPIO LiveWire |
| EditMatrix | edit_matrix.h | Edycja matrycy przełączania |
| EditNode | edit_node.h | Edycja węzła LiveWire |
| EditPypad | edit_pypad.h | Edycja instancji PyPAD |
| EditRDAirPlay | edit_rdairplay.h | Edycja konfiguracji RDAirPlay na stacji |
| EditRDLibrary | edit_rdlibrary.h | Edycja konfiguracji RDLibrary na stacji |
| EditRDLogedit | edit_rdlogedit.h | Edycja konfiguracji RDLogedit na stacji |
| EditRDPanel | edit_rdpanel.h | Edycja konfiguracji RDPanel na stacji |
| EditReplicator | edit_replicator.h | Edycja replikatora |
| EditReport | edit_report.h | Edycja raportu |
| EditSasResource | edit_sas_resource.h | Edycja zasobu SAS |
| EditSchedCode | edit_schedcodes.h | Edycja kodu harmonogramu |
| EditStation | edit_station.h | Edycja stacji roboczej |
| EditSuperfeed | edit_superfeed.h | Edycja superfeed (agregacja kanałów) |
| EditSvc | edit_svc.h | Edycja serwisu (usługi) |
| EditSvcPerms | edit_svc_perms.h | Edycja uprawnień do serwisów |
| EditSystem | edit_system.h | Edycja ustawień systemowych |
| EditTtys | edit_ttys.h | Edycja portów TTY/serial |
| EditUser | edit_user.h | Edycja użytkownika |
| EditUserPerms | edit_user_perms.h | Edycja uprawnień użytkownika do grup |
| EditUserServicePerms | edit_user_service_perms.h | Edycja uprawnień użytkownika do serwisów |
| EditVguestResource | edit_vguest_resource.h | Edycja zasobu vGuest |

### Dialogi "List" (RDDialog) — 20 klas

| Klasa | Plik .h | Opis |
|-------|---------|------|
| ListDropboxes | list_dropboxes.h | Lista dropboxów |
| ListEncoders | list_encoders.h | Lista enkoderów |
| ListEndpoints | list_endpoints.h | Lista endpointów matrycy |
| ListFeeds | list_feeds.h | Lista kanałów RSS/podcast |
| ListGpis | list_gpis.h | Lista GPI/GPO |
| ListGroups | list_groups.h | Lista grup kartów |
| ListHostvars | list_hostvars.h | Lista zmiennych hosta |
| ListImages | list_images.h | Lista obrazów |
| ListLiveWireGpios | list_livewiregpios.h | Lista GPIO LiveWire |
| ListMatrices | list_matrices.h | Lista matryc przełączania |
| ListNodes | list_nodes.h | Lista węzłów LiveWire |
| ListPypads | list_pypads.h | Lista instancji PyPAD |
| ListReplicatorCarts | list_replicator_carts.h | Lista kartów replikatora |
| ListReplicators | list_replicators.h | Lista replikatorów |
| ListReports | list_reports.h | Lista raportów |
| ListSasResources | list_sas_resources.h | Lista zasobów SAS |
| ListSchedCodes | list_schedcodes.h | Lista kodów harmonogramu |
| ListStations | list_stations.h | Lista stacji roboczych |
| ListSvcs | list_svcs.h | Lista serwisów |
| ListUsers | list_users.h | Lista użytkowników |
| ListVguestResources | list_vguest_resources.h | Lista zasobów vGuest |

### Dialogi "View" (RDDialog) — 3 klasy

| Klasa | Plik .h | Opis |
|-------|---------|------|
| ViewAdapters | view_adapters.h | Podgląd adapterów audio |
| ViewNodeInfo | view_node_info.h | Podgląd informacji o węźle |
| ViewPypadErrors | view_pypad_errors.h | Podgląd błędów PyPAD |

### Dialogi specjalne (RDDialog) — 10 klas

| Klasa | Plik .h | Opis |
|-------|---------|------|
| AutofillCarts | autofill_carts.h | Autouzupełnianie kartów w serwisie |
| HelpAudioPorts | help_audios.h | Pomoc audio portów |
| ImportFields | importfields.h | Widget pól importu (RDWidget, nie RDDialog) |
| InfoDialog | info_dialog.h | Dialog informacji o systemie |
| License | license.h | Dialog licencji GPL |
| Login | login.h | Dialog logowania |
| RenameGroup | rename_group.h | Dialog zmiany nazwy grupy |
| TestImport | test_import.h | Dialog testowania importu audio |

## Pliki źródłowe

### Pary .h/.cpp — 80 par

Wszystkie klasy wymienione powyżej mają odpowiadające pary .h/.cpp (np. `edit_station.h` + `edit_station.cpp`). Łącznie 80 par plików.

### Pliki tylko .h (bez .cpp) — 1 plik

| Header | Zawartość |
|--------|-----------|
| globals.h | Deklaracje globalne (extern zmienne, stałe) |

### Pliki tylko .cpp (bez .h) — 4 pliki

| Source | Zawartość |
|--------|-----------|
| xpm_info_banner1.cpp | Dane XPM banera info (EXTRA_DIST) |
| xpm_info_banner2.cpp | Dane XPM banera info (EXTRA_DIST) |

Uwaga: 2 dodatkowe .cpp generowane w build time: `global_credits.c` (z AUTHORS) i `global_gpl2.c` (z gpl2.html) przez helper `cwrap`.

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_*.cpp (80 plików) | Generowane przez Qt moc |
| global_credits.c | Generowane przez cwrap z AUTHORS |
| global_gpl2.c | Generowane przez cwrap z gpl2.html |

## Pliki testowe

Brak dedykowanych plików testowych dla rdadmin. Plik `test_import.cpp` to dialog GUI do testowania importu audio (nie unit test). W katalogu `tests/` brak testów powiązanych z rdadmin.

## Build Target Definition (autotools)

```makefile
# Makefile.am
bin_PROGRAMS = rdadmin

dist_rdadmin_SOURCES = add_feed.cpp add_feed.h \
                       add_group.cpp add_group.h \
                       ... (80 par .h/.cpp) ...
                       view_pypad_errors.cpp view_pypad_errors.h

nodist_rdadmin_SOURCES = global_credits.c \
                         global_gpl2.c \
                         moc_*.cpp (80 plików)

rdadmin_LDADD = @LIB_RDLIBS@ -lsamplerate @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support

AM_CPPFLAGS = -Wall -DPREFIX=\"$(prefix)\" -I$(top_srcdir)/lib @QT4_CFLAGS@ @MUSICBRAINZ_CFLAGS@ -DQT3_SUPPORT -I/usr/include/Qt3Support
```

## Zależności (z LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ (librd) | internal | Główna biblioteka Rivendell |
| -lsamplerate | external | Konwersja sample rate audio |
| @LIBVORBIS@ | external | Kodek Ogg Vorbis |
| @QT4_LIBS@ | Qt framework | Qt4 (Core, Gui, Network, Sql, Xml) |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz metadata lookup |
| -lQt3Support | Qt framework | Qt3 compatibility layer |

## Architektura na wysokim poziomie

rdadmin to **aplikacja administracyjna GUI** systemu Rivendell. Składa się z:

1. **MainWidget** (rdadmin.h) — główny widget z menu głównymi modułami admin
2. **Login** — dialog uwierzytelniania
3. **81 dialogów RDDialog** — CRUD dla wszystkich encji systemowych:
   - **Stacje**: EditStation, ListStations, EditAudioPorts, EditDecks, EditCartSlots, EditJack, EditRDAirPlay, EditRDLibrary, EditRDLogedit, EditRDPanel, EditHotkeys
   - **Użytkownicy**: EditUser, ListUsers, EditUserPerms, EditUserServicePerms
   - **Grupy**: EditGroup, ListGroups, RenameGroup, AutofillCarts
   - **Serwisy**: EditSvc, ListSvcs, EditSvcPerms
   - **Kanały (feeds/podcasts)**: EditFeed, ListFeeds, EditFeedPerms, EditSuperfeed, ListImages, EditImage
   - **Matryce przełączania**: EditMatrix, ListMatrices, ListEndpoints, EditEndpoint, ListGpis, EditGpi, ListSasResources, EditSasResource, ListVguestResources, EditVguestResource
   - **LiveWire**: ListNodes, EditNode, ViewNodeInfo, ListLiveWireGpios, EditLiveWireGpio, EditChannelGpios, ViewAdapters
   - **Dropboxy**: ListDropboxes, EditDropbox, TestImport, ImportFields
   - **Replikatory**: ListReplicators, EditReplicator, ListReplicatorCarts
   - **Raporty**: ListReports, EditReport
   - **PyPAD**: ListPypads, EditPypad, ViewPypadErrors
   - **System**: EditSystem, EditTtys, ListHostvars, EditHostvar, ListEncoders, ListSchedCodes, EditSchedCode
   - **Info/License**: InfoDialog, License, HelpAudioPorts

4. **Wzorzec UI**: List→Add/Edit→SubEdit (hierarchia dialogów nawigacyjnych)
5. **Brak własnej logiki biznesowej** — cała logika DB/audio/IPC delegowana do librd (@LIB_RDLIBS@)
