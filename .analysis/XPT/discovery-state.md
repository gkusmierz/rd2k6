---
phase: 1
artifact: XPT
artifact_name: rdxport.cgi
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdxport.cgi

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | web/rdxport/ |
| CMakeLists.txt | brak (autotools: web/rdxport/Makefile.am) |
| Target | rdxport.cgi (libexec_PROGRAMS) |
| Typ | web (CGI binary, setuid root -> drops to rivendell user) |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 18 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .pro | 1 (pusty, tylko do i18n) |
| Linie kodu (est.) | ~4605 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdxport.cpp:476 | int main(argc, argv) | Punkt startowy CGI |
| QApplication | rdxport.cpp:478 | QApplication a(argc,argv,false) | Qt event loop (non-GUI mode) |
| Xport ctor | rdxport.cpp:46 | Xport::Xport() | Inicjalizacja: open DB, parse POST, authenticate, connect ripcd |
| Command dispatch | rdxport.cpp:155 | Xport::ripcConnectedData() | Switch na COMMAND -> dispatch do metod |

## Architektura

rdxport.cgi to **CGI binary** uruchamiany przez web serwer (Apache). Komunikacja:
- **Wejscie**: HTTP POST (multipart/form-data lub url-encoded) via CGI env vars
- **Wyjscie**: XML responses (application/xml) lub binary audio data (audio/x-mpeg, audio/x-wav, etc.)
- **Auth**: ticket-based lub user/password via RDFormPost::authenticate()
- **Protocol**: 45 komend numerycznych (RDXPORT_COMMAND_*) zdefiniowanych w lib/rdxport_interface.h

Wzorzec: Xport ctor -> authenticate -> connect ripcd -> ripcConnectedData (slot) -> dispatch command -> generate response -> exit.
Kazde wywolanie CGI to osobny proces (fork by Apache).

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| Xport | rdxport.h | QObject | Jedyna klasa; web service portal, command dispatcher + 45 handler methods |

## Komendy API (45 endpointow)

### Cart Management
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| ADDCART | 12 | AddCart() | carts.cpp |
| LISTCARTS | 6 | ListCarts() | carts.cpp |
| LISTCART | 7 | ListCart() | carts.cpp |
| EDITCART | 14 | EditCart() | carts.cpp |
| REMOVECART | 13 | RemoveCart() | carts.cpp |

### Cut Management
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| ADDCUT | 10 | AddCut() | carts.cpp |
| LISTCUTS | 9 | ListCuts() | carts.cpp |
| LISTCUT | 8 | ListCut() | carts.cpp |
| EDITCUT | 15 | EditCut() | carts.cpp |
| REMOVECUT | 11 | RemoveCut() | carts.cpp |

### Audio Operations
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| EXPORT | 1 | Export() | export.cpp |
| IMPORT | 2 | Import() | import.cpp |
| DELETEAUDIO | 3 | DeleteAudio() | deleteaudio.cpp |
| COPYAUDIO | 18 | CopyAudio() | copyaudio.cpp |
| AUDIOINFO | 19 | AudioInfo() | audioinfo.cpp |
| AUDIOSTORE | 23 | AudioStore() | audiostore.cpp |
| EXPORT_PEAKS | 16 | ExportPeaks() | exportpeaks.cpp |
| TRIMAUDIO | 17 | TrimAudio() | trimaudio.cpp |
| REHASH | 32 | Rehash() | rehash.cpp |

### Log Management
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| ADDLOG | 29 | AddLog() | logs.cpp |
| DELETELOG | 30 | DeleteLog() | logs.cpp |
| LISTLOGS | 20 | ListLogs() | logs.cpp |
| LISTLOG | 22 | ListLog() | logs.cpp |
| SAVELOG | 28 | SaveLog() | logs.cpp |
| LOCKLOG | 34 | LockLog() | logs.cpp |

### Group Management
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| LISTGROUPS | 4 | ListGroups() | groups.cpp |
| LISTGROUP | 5 | ListGroup() | groups.cpp |

### Scheduler Codes
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| LISTSCHEDCODES | 24 | ListSchedCodes() | schedcodes.cpp |
| ASSIGNSCHEDCODE | 25 | AssignSchedCode() | schedcodes.cpp |
| UNASSIGNSCHEDCODE | 26 | UnassignSchedCode() | schedcodes.cpp |
| LISTCARTSCHEDCODES | 27 | ListCartSchedCodes() | schedcodes.cpp |

### Services & System
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| LISTSERVICES | 21 | ListServices() | services.cpp |
| LISTSYSTEMSETTINGS | 33 | ListSystemSettings() | systemsettings.cpp |
| CREATETICKET | 31 | TryCreateTicket() | rdxport.cpp |

### Podcast / RSS / Image
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| SAVE_PODCAST | 38 | SavePodcast() | podcasts.cpp |
| GET_PODCAST | 37 | GetPodcast() | podcasts.cpp |
| DELETE_PODCAST | 39 | DeletePodcast() | podcasts.cpp |
| POST_PODCAST | 40 | PostPodcast() | podcasts.cpp |
| REMOVE_PODCAST | 41 | RemovePodcast() | podcasts.cpp |
| POST_RSS | 42 | PostRss() | podcasts.cpp |
| REMOVE_RSS | 43 | RemoveRss() | podcasts.cpp |
| POST_IMAGE | 44 | PostImage() | podcasts.cpp |
| REMOVE_IMAGE | 45 | RemoveImage() | podcasts.cpp |

### Test/Debug
| Komenda | ID | Metoda | Plik |
|---------|----|--------|------|
| SAVESTRING | 35 | SaveString() | tests.cpp |
| SAVEFILE | 36 | SaveFile() | tests.cpp |

## Pliki zrodlowe

### Para .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdxport.h | rdxport.cpp | Jedyna klasa Xport : QObject + main() + dispatch + auth + helpers |

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| carts.cpp | Cart/Cut CRUD: AddCart, ListCarts, ListCart, EditCart, RemoveCart, AddCut, ListCuts, ListCut, EditCut, RemoveCut, CheckPointerValidity |
| logs.cpp | Log CRUD + locking: AddLog, DeleteLog, ListLogs, ListLog, SaveLog, LockLog, GetLogService, ServiceUserValid, LogLockXml |
| podcasts.cpp | Podcast/RSS/Image ops: SavePodcast, GetPodcast, DeletePodcast, PostPodcast, RemovePodcast, PostRss(Elemental), RemoveRss, PostImage, RemoveImage |
| export.cpp | Audio export z konwersja formatu |
| import.cpp | Audio import z konwersja + opcjonalny auto-create cart |
| audioinfo.cpp | Pobieranie metadanych audio (format, channels, sample rate, etc.) |
| audiostore.cpp | Statystyki dysku audio storage (free/total bytes) |
| copyaudio.cpp | Hard-link kopia audio miedzy cutami |
| deleteaudio.cpp | Usuwanie pliku audio + energy + CUT_EVENTS |
| exportpeaks.cpp | Eksport danych peak/energy jako binary |
| trimaudio.cpp | Automatyczne wyznaczanie trim pointow |
| groups.cpp | Listowanie grup uzytkownika |
| rehash.cpp | Przeliczenie SHA1 hash pliku audio |
| schedcodes.cpp | Scheduler codes CRUD: List, Assign, Unassign, ListCart |
| services.cpp | Listowanie serwisow uzytkownika |
| systemsettings.cpp | Listowanie ustawien systemowych |
| tests.cpp | Debug: SaveString, SaveFile |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdxport.cpp | Generowane przez Qt moc |

## Pliki testowe

### HTML test forms (web/tests/)

Istnieje 46 plikow HTML w `web/tests/` - sa to formularze HTML testujace kazda komende rdxport.cgi:
addcart.html, addcut.html, addlog.html, assignschedcode.html, audioinfo.html, audiostore.html, 
copyaudio.html, createticket.html, delete_audio.html, deletelog.html, deletepodcast.html,
editcart.html, editcut.html, export.html, exportpeaks.html, getpodcast.html, import.html,
listcart.html, listcarts.html, listcartschedcodes.html, listcut.html, listcuts.html,
listgroup.html, listgroups.html, listlog.html, listlogs.html, listschedcodes.html,
listservices.html, listsystemsettings.html, locklog.html, postimage.html, postpodcast.html,
postrss.html, rehash.html, removecart.html, removecut.html, removeimage.html, removepodcast.html,
removerss.html, savefile.html, savelog.html, savepodcast.html, savestring.html, trimaudio.html,
unassignschedcode.html + 2 pliki JS (editcart.js, editcut.js).

### C++ tests (tests/)

| Plik | Framework | Testowane klasy |
|------|-----------|-----------------|
| tests/audio_export_test.cpp | QTest | RDXport interface (audio export) |

## Build Target Definition (autotools)

```makefile
libexec_PROGRAMS = rdxport.cgi

dist_rdxport_cgi_SOURCES = audioinfo.cpp audiostore.cpp carts.cpp copyaudio.cpp
    deleteaudio.cpp groups.cpp export.cpp exportpeaks.cpp import.cpp logs.cpp
    podcasts.cpp rdxport.cpp rdxport.h rehash.cpp tests.cpp schedcodes.cpp
    services.cpp systemsettings.cpp trimaudio.cpp

nodist_rdxport_cgi_SOURCES = moc_rdxport.cpp

# Installed setuid root (chmod 4755) -> drops privileges at runtime
install-exec-hook:
    chown root rdxport.cgi; chmod 4755 rdxport.cgi
```

## Zaleznosci (z Makefile.am target_link_libraries)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ (librd) | internal | Glowna biblioteka Rivendell |
| libsndfile | external | Audio file I/O |
| @LIBVORBIS@ | external | Ogg Vorbis codec |
| @QT4_LIBS@ | Qt framework | Qt4 core + gui |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz metadata lookup |
| -lQt3Support | Qt framework | Qt3 compatibility layer |
| libcurl | external (implicit via podcasts.cpp) | HTTP/FTP upload for RSS/podcast posting |

## Interface Definition

Komendy API zdefiniowane w `lib/rdxport_interface.h` (45 komend, ID 1-45).
Ten plik jest czescia librd (LIB artifact) i jest wspoldzielony z klientami API.
