---
phase: 1
artifact: ADM
artifact_name: rdadmin
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdadmin

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdadmin/ |
| CMakeLists.txt | brak (autotools: rdadmin/Makefile.am) |
| Target autotools | bin_PROGRAMS = rdadmin |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 80 |
| Pliki .cpp | 82 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts (i18n) | 7 |
| Pliki .xpm (ikony) | 2 |
| Linie kodu (est.) | ~26 000 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdadmin.cpp:376 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdadmin.cpp:379 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget | rdadmin.h | MainWidget : RDWidget | Glowne okno aplikacji administracyjnej |

## Klasy Qt (identyfikowane)

Wszystkie 83 klasy z Q_OBJECT. Dziedziczenie: RDDialog (wrapper na QDialog z librd), RDWidget (wrapper na QWidget z librd).

### Glowny widget

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdadmin.h | RDWidget | Glowne okno z przyciskami do poszczegolnych sekcji admin |

### Dialogi Add (dodawanie nowych encji)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| AddFeed | add_feed.h | RDDialog | Dodawanie nowego podcastowego feedu |
| AddGroup | add_group.h | RDDialog | Dodawanie nowej grupy |
| AddHostvar | add_hostvar.h | RDDialog | Dodawanie zmiennej hosta |
| AddMatrix | add_matrix.h | RDDialog | Dodawanie nowej macierzy switcher/routera |
| AddReplicator | add_replicator.h | RDDialog | Dodawanie nowego replikatora |
| AddReport | add_report.h | RDDialog | Dodawanie nowego raportu |
| AddSchedCode | add_schedcodes.h | RDDialog | Dodawanie kodu harmonogramu |
| AddStation | add_station.h | RDDialog | Dodawanie nowej stacji |
| AddSvc | add_svc.h | RDDialog | Dodawanie nowego serwisu |
| AddUser | add_user.h | RDDialog | Dodawanie nowego uzytkownika |

### Dialogi Edit (edycja encji)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| EditAudioPorts | edit_audios.h | RDDialog | Konfiguracja portow audio stacji |
| EditCartSlots | edit_cartslots.h | RDDialog | Konfiguracja slotow cartow |
| EditChannelGpios | edit_channelgpios.h | RDDialog | Konfiguracja GPIO kanalow |
| EditDecks | edit_decks.h | RDDialog | Konfiguracja deckow (nagrywanie/odtwarzanie) |
| EditDropbox | edit_dropbox.h | RDDialog | Konfiguracja dropboxa (auto-import) |
| EditEndpoint | edit_endpoint.h | RDDialog | Edycja endpointu macierzy |
| EditFeed | edit_feed.h | RDDialog | Edycja podcastowego feedu |
| EditFeedPerms | edit_feed_perms.h | RDDialog | Uprawnienia do feedu |
| EditGpi | edit_gpi.h | RDDialog | Konfiguracja GPI (General Purpose Input) |
| EditGroup | edit_group.h | RDDialog | Edycja grupy |
| EditHostvar | edit_hostvar.h | RDDialog | Edycja zmiennej hosta |
| EditHotkeys | edit_hotkeys.h | RDDialog | Konfiguracja skrotow klawiszowych |
| EditImage | edit_image.h | RDDialog | Edycja obrazu podcastowego |
| EditJack | edit_jack.h | RDDialog | Konfiguracja JACK audio |
| EditJackClient | edit_jack_client.h | RDDialog | Konfiguracja klienta JACK |
| EditLiveWireGpio | edit_livewiregpio.h | RDDialog | Konfiguracja Livewire GPIO |
| EditMatrix | edit_matrix.h | RDDialog | Edycja macierzy audio |
| EditNode | edit_node.h | RDDialog | Edycja wezla Livewire |
| EditPypad | edit_pypad.h | RDDialog | Konfiguracja skryptu PyPAD |
| EditRDAirPlay | edit_rdairplay.h | RDDialog | Konfiguracja ustawien RDAirPlay per stacja |
| EditRDLibrary | edit_rdlibrary.h | RDDialog | Konfiguracja ustawien RDLibrary per stacja |
| EditRDLogedit | edit_rdlogedit.h | RDDialog | Konfiguracja ustawien RDLogEdit per stacja |
| EditRDPanel | edit_rdpanel.h | RDDialog | Konfiguracja ustawien RDPanel per stacja |
| EditReplicator | edit_replicator.h | RDDialog | Edycja replikatora |
| EditReport | edit_report.h | RDDialog | Edycja raportu |
| EditSasResource | edit_sas_resource.h | RDDialog | Edycja zasobu SAS |
| EditSchedCode | edit_schedcodes.h | RDDialog | Edycja kodu harmonogramu |
| EditStation | edit_station.h | RDDialog | Edycja stacji (wielozakladkowy) |
| EditSuperfeed | edit_superfeed.h | RDDialog | Edycja superfeeda (agregacja feedow) |
| EditSvc | edit_svc.h | RDDialog | Edycja serwisu |
| EditSvcPerms | edit_svc_perms.h | RDDialog | Uprawnienia do serwisow |
| EditSystem | edit_system.h | RDDialog | Ustawienia systemowe (globalne) |
| EditTtys | edit_ttys.h | RDDialog | Konfiguracja portow szeregowych TTY |
| EditUser | edit_user.h | RDDialog | Edycja uzytkownika |
| EditUserPerms | edit_user_perms.h | RDDialog | Uprawnienia uzytkownika do grup |
| EditUserServicePerms | edit_user_service_perms.h | RDDialog | Uprawnienia uzytkownika do serwisow |
| EditVguestResource | edit_vguest_resource.h | RDDialog | Edycja zasobu VGuest |

### Dialogi List (listy encji z CRUD)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| ListDropboxes | list_dropboxes.h | RDDialog | Lista dropboxow stacji |
| ListEncoders | list_encoders.h | RDDialog | Lista encoderow |
| ListEndpoints | list_endpoints.h | RDDialog | Lista endpointow macierzy |
| ListFeeds | list_feeds.h | RDDialog | Lista podcastowych feedow |
| ListGpis | list_gpis.h | RDDialog | Lista GPI/GPO |
| ListGroups | list_groups.h | RDDialog | Lista grup |
| ListHostvars | list_hostvars.h | RDDialog | Lista zmiennych hosta |
| ListImages | list_images.h | RDDialog | Lista obrazow podcastowych |
| ListLiveWireGpios | list_livewiregpios.h | RDDialog | Lista Livewire GPIO |
| ListMatrices | list_matrices.h | RDDialog | Lista macierzy audio |
| ListNodes | list_nodes.h | RDDialog | Lista wezlow Livewire |
| ListPypads | list_pypads.h | RDDialog | Lista skryptow PyPAD |
| ListReplicatorCarts | list_replicator_carts.h | RDDialog | Lista cartow replikatora |
| ListReplicators | list_replicators.h | RDDialog | Lista replikatorow |
| ListReports | list_reports.h | RDDialog | Lista raportow |
| ListSasResources | list_sas_resources.h | RDDialog | Lista zasobow SAS |
| ListSchedCodes | list_schedcodes.h | RDDialog | Lista kodow harmonogramu |
| ListStations | list_stations.h | RDDialog | Lista stacji |
| ListSvcs | list_svcs.h | RDDialog | Lista serwisow |
| ListUsers | list_users.h | RDDialog | Lista uzytkownikow |
| ListVguestResources | list_vguest_resources.h | RDDialog | Lista zasobow VGuest |

### Dialogi View (tylko odczyt)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| ViewAdapters | view_adapters.h | RDDialog | Podglad adapterow audio |
| ViewNodeInfo | view_node_info.h | RDDialog | Podglad informacji o wezle |
| ViewPypadErrors | view_pypad_errors.h | RDDialog | Podglad bledow PyPAD |

### Dialogi pomocnicze

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| AutofillCarts | autofill_carts.h | RDDialog | Konfiguracja autofill cartow |
| HelpAudioPorts | help_audios.h | RDDialog | Pomoc dot. portow audio |
| ImportFields | importfields.h | RDWidget | Widget pol importu (serwis) |
| InfoDialog | info_dialog.h | RDDialog | Dialog informacji o systemie |
| License | license.h | RDDialog | Wyswietlanie licencji |
| Login | login.h | RDDialog | Dialog logowania |
| RenameGroup | rename_group.h | RDDialog | Zmiana nazwy grupy |
| TestImport | test_import.h | RDDialog | Testowanie importu danych serwisu |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | add_feed.h | add_feed.cpp | Dialog: dodawanie feedu |
| 002 | add_group.h | add_group.cpp | Dialog: dodawanie grupy |
| 003 | add_hostvar.h | add_hostvar.cpp | Dialog: dodawanie zmiennej hosta |
| 004 | add_matrix.h | add_matrix.cpp | Dialog: dodawanie macierzy |
| 005 | add_replicator.h | add_replicator.cpp | Dialog: dodawanie replikatora |
| 006 | add_report.h | add_report.cpp | Dialog: dodawanie raportu |
| 007 | add_schedcodes.h | add_schedcodes.cpp | Dialog: dodawanie kodu harmonogramu |
| 008 | add_station.h | add_station.cpp | Dialog: dodawanie stacji |
| 009 | add_svc.h | add_svc.cpp | Dialog: dodawanie serwisu |
| 010 | add_user.h | add_user.cpp | Dialog: dodawanie uzytkownika |
| 011 | autofill_carts.h | autofill_carts.cpp | Dialog: konfiguracja autofill |
| 012 | edit_audios.h | edit_audios.cpp | Dialog: konfiguracja portow audio |
| 013 | edit_cartslots.h | edit_cartslots.cpp | Dialog: konfiguracja slotow cartow |
| 014 | edit_channelgpios.h | edit_channelgpios.cpp | Dialog: konfiguracja GPIO kanalow |
| 015 | edit_decks.h | edit_decks.cpp | Dialog: konfiguracja deckow |
| 016 | edit_dropbox.h | edit_dropbox.cpp | Dialog: konfiguracja dropboxa |
| 017 | edit_endpoint.h | edit_endpoint.cpp | Dialog: edycja endpointu |
| 018 | edit_feed.h | edit_feed.cpp | Dialog: edycja feedu |
| 019 | edit_feed_perms.h | edit_feed_perms.cpp | Dialog: uprawnienia feedu |
| 020 | edit_gpi.h | edit_gpi.cpp | Dialog: konfiguracja GPI |
| 021 | edit_group.h | edit_group.cpp | Dialog: edycja grupy |
| 022 | edit_hostvar.h | edit_hostvar.cpp | Dialog: edycja zmiennej hosta |
| 023 | edit_hotkeys.h | edit_hotkeys.cpp | Dialog: konfiguracja skrotow |
| 024 | edit_image.h | edit_image.cpp | Dialog: edycja obrazu |
| 025 | edit_jack.h | edit_jack.cpp | Dialog: konfiguracja JACK |
| 026 | edit_jack_client.h | edit_jack_client.cpp | Dialog: klient JACK |
| 027 | edit_livewiregpio.h | edit_livewiregpio.cpp | Dialog: Livewire GPIO |
| 028 | edit_matrix.h | edit_matrix.cpp | Dialog: edycja macierzy |
| 029 | edit_node.h | edit_node.cpp | Dialog: edycja wezla |
| 030 | edit_pypad.h | edit_pypad.cpp | Dialog: konfiguracja PyPAD |
| 031 | edit_rdairplay.h | edit_rdairplay.cpp | Dialog: ustawienia RDAirPlay |
| 032 | edit_rdlibrary.h | edit_rdlibrary.cpp | Dialog: ustawienia RDLibrary |
| 033 | edit_rdlogedit.h | edit_rdlogedit.cpp | Dialog: ustawienia RDLogEdit |
| 034 | edit_rdpanel.h | edit_rdpanel.cpp | Dialog: ustawienia RDPanel |
| 035 | edit_replicator.h | edit_replicator.cpp | Dialog: edycja replikatora |
| 036 | edit_report.h | edit_report.cpp | Dialog: edycja raportu |
| 037 | edit_sas_resource.h | edit_sas_resource.cpp | Dialog: zasob SAS |
| 038 | edit_schedcodes.h | edit_schedcodes.cpp | Dialog: kod harmonogramu |
| 039 | edit_station.h | edit_station.cpp | Dialog: edycja stacji |
| 040 | edit_superfeed.h | edit_superfeed.cpp | Dialog: edycja superfeeda |
| 041 | edit_svc.h | edit_svc.cpp | Dialog: edycja serwisu |
| 042 | edit_svc_perms.h | edit_svc_perms.cpp | Dialog: uprawnienia serwisow |
| 043 | edit_system.h | edit_system.cpp | Dialog: ustawienia systemowe |
| 044 | edit_ttys.h | edit_ttys.cpp | Dialog: porty TTY |
| 045 | edit_user.h | edit_user.cpp | Dialog: edycja uzytkownika |
| 046 | edit_user_perms.h | edit_user_perms.cpp | Dialog: uprawnienia uzytkownika |
| 047 | edit_user_service_perms.h | edit_user_service_perms.cpp | Dialog: uprawnienia serwisow uzytkownika |
| 048 | edit_vguest_resource.h | edit_vguest_resource.cpp | Dialog: zasob VGuest |
| 049 | help_audios.h | help_audios.cpp | Dialog: pomoc portow audio |
| 050 | importfields.h | importfields.cpp | Widget: pola importu |
| 051 | info_dialog.h | info_dialog.cpp | Dialog: informacje o systemie |
| 052 | license.h | license.cpp | Dialog: licencja |
| 053 | list_dropboxes.h | list_dropboxes.cpp | Dialog: lista dropboxow |
| 054 | list_encoders.h | list_encoders.cpp | Dialog: lista encoderow |
| 055 | list_endpoints.h | list_endpoints.cpp | Dialog: lista endpointow |
| 056 | list_feeds.h | list_feeds.cpp | Dialog: lista feedow |
| 057 | list_gpis.h | list_gpis.cpp | Dialog: lista GPI/GPO |
| 058 | list_groups.h | list_groups.cpp | Dialog: lista grup |
| 059 | list_hostvars.h | list_hostvars.cpp | Dialog: lista zmiennych hosta |
| 060 | list_images.h | list_images.cpp | Dialog: lista obrazow |
| 061 | list_livewiregpios.h | list_livewiregpios.cpp | Dialog: lista Livewire GPIO |
| 062 | list_matrices.h | list_matrices.cpp | Dialog: lista macierzy |
| 063 | list_nodes.h | list_nodes.cpp | Dialog: lista wezlow |
| 064 | list_pypads.h | list_pypads.cpp | Dialog: lista PyPAD |
| 065 | list_replicator_carts.h | list_replicator_carts.cpp | Dialog: carty replikatora |
| 066 | list_replicators.h | list_replicators.cpp | Dialog: lista replikatorow |
| 067 | list_reports.h | list_reports.cpp | Dialog: lista raportow |
| 068 | list_sas_resources.h | list_sas_resources.cpp | Dialog: lista zasobow SAS |
| 069 | list_schedcodes.h | list_schedcodes.cpp | Dialog: lista kodow harmonogramu |
| 070 | list_stations.h | list_stations.cpp | Dialog: lista stacji |
| 071 | list_svcs.h | list_svcs.cpp | Dialog: lista serwisow |
| 072 | list_users.h | list_users.cpp | Dialog: lista uzytkownikow |
| 073 | list_vguest_resources.h | list_vguest_resources.cpp | Dialog: lista zasobow VGuest |
| 074 | login.h | login.cpp | Dialog: logowanie |
| 075 | rdadmin.h | rdadmin.cpp | MainWidget + main() |
| 076 | rename_group.h | rename_group.cpp | Dialog: zmiana nazwy grupy |
| 077 | test_import.h | test_import.cpp | Dialog: test importu |
| 078 | view_adapters.h | view_adapters.cpp | Dialog: podglad adapterow |
| 079 | view_node_info.h | view_node_info.cpp | Dialog: informacje o wezle |
| 080 | view_pypad_errors.h | view_pypad_errors.cpp | Dialog: bledy PyPAD |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje extern zmiennych globalnych (admin_cart_dialog, admin credentials, backup flags) |

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| xpm_info_banner1.cpp | Dane XPM bannera informacyjnego 1 |
| xpm_info_banner2.cpp | Dane XPM bannera informacyjnego 2 |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_*.cpp | Generowane przez Qt moc (85 plikow w nodist_rdadmin_SOURCES) |
| global_credits.c | Generowane przez cwrap z ../AUTHORS |
| global_gpl2.c | Generowane przez cwrap z gpl2.html |

## Pliki testowe

Brak plikow testowych dla tego artifaktu. Klasa TestImport (test_import.h/cpp) to dialog UI do testowania importu danych serwisu, nie test automatyczny.

## Build Target Definition (autotools)

```makefile
bin_PROGRAMS = rdadmin

# 80 par .h/.cpp + 1 globals.h (dist sources)
dist_rdadmin_SOURCES = add_feed.cpp add_feed.h\
                       add_group.cpp add_group.h\
                       ... (80 par + globals.h)

# Generowane: moc_*.cpp + global_credits.c + global_gpl2.c
nodist_rdadmin_SOURCES = global_credits.c\
                         global_gpl2.c\
                         moc_add_feed.cpp\
                         ... (85 moc plikow)

rdadmin_LDADD = @LIB_RDLIBS@ -lsamplerate @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ (librd) | internal | Glowna biblioteka Rivendell |
| @QT4_LIBS@ | Qt framework | Qt 4 |
| -lQt3Support | Qt framework | Warstwa kompatybilnosci Qt3 |
| -lsamplerate | external | Konwersja sample rate |
| @LIBVORBIS@ | external | Kodek Ogg Vorbis |
| @MUSICBRAINZ_LIBS@ | external | Lookup metadanych muzycznych |

## Architektura (obserwacje)

- **Wzorzec**: klasyczna aplikacja Qt z jednym MainWidget (RDWidget) i ~80 dialogami (RDDialog).
- **Naming convention**: `add_*` (tworzenie), `edit_*` (edycja), `list_*` (lista CRUD), `view_*` (podglad read-only).
- **Brak QMainWindow** -- MainWidget dziedziczy z RDWidget (customowy wrapper z librd), nie z QMainWindow.
- **Brak .ui** -- caly UI budowany programowo w konstruktorach.
- **Wielozakladkowosc**: EditStation to centralny dialog z wieloma zakladkami (audio, decks, JACK, hotkeys, dropboxy, macierze, etc.).
- **Globalne zmienne** (globals.h): admin_cart_dialog, credentials, backup flags -- wspoldzielone miedzy dialogami.
