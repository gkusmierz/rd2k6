---
phase: 1
artifact: WCA
artifact_name: librivwebcapi
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: librivwebcapi

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | apis/rivwebcapi/rivwebcapi/ |
| Folder glowny projektu | apis/rivwebcapi/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | librivwebcapi.la (lib_LTLIBRARIES) |
| Typ | library |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h (lib) | 49 |
| Pliki .c (lib) | 45 |
| Pliki .h (tests) | 1 |
| Pliki .c (tests) | 39 |
| Pliki .cpp | 0 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki dokumentacji XML | 46 (docs/rivwebcapi/) |
| Linie kodu (est.) | ~5500 (lib) + ~4000 (tests) |

## Uwaga: Pure C Library (nie C++/Qt)

librivwebcapi jest biblioteka napisana w czystym C. Nie uzywa Qt, QObject, sygnalow/slotow
ani zadnych klas C++. Komunikuje sie z Rivendell Web API (rdxport.cgi) poprzez libcurl (HTTP)
i parsuje odpowiedzi XML za pomoca Expat. Oferuje kompatybilnosc C++ przez makra
`_MYRIVLIB_INIT_DECL` / `_MYRIVLIB_FINI_DECL` (extern "C").

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | brak | - | Biblioteka -- brak entry point |
| QApplication | brak | - | Nie uzywa Qt |
| QMainWindow | brak | - | Nie uzywa Qt |

## Klasy Qt (identyfikowane)

Brak. Biblioteka jest napisana w czystym C -- nie zawiera klas Qt ani klas C++.

## Struktury danych (C structs)

| Struktura | Plik .h | Opis |
|-----------|---------|------|
| rd_cart | rd_cart.h | Dane koszyka audio (numer, tytul, artysta, album, metadane, tablica cutow) |
| rd_cut | rd_cut.h | Dane elementu audio (nazwa, czas trwania, punkty start/end/segue/fade/hook/talk, dayparting) |
| rd_group | rd_group.h | Grupa koszykow (nazwa, opis, zakres numerow, raportowanie) |
| rd_schedcodes | rd_schedcodes.h | Kod schedulera (kod + opis) |
| rd_logline | rd_listlog.h | Linia logu playoutowego (typ, koszyk, cut, metadane, punkty audio, linki eventow) |
| rd_log | rd_listlogs.h | Metadane logu (nazwa, serwis, opis, daty, status linkowania traffic/music) |
| rd_service | rd_listservices.h | Serwis radiowy (nazwa + opis) |
| rd_audioinfo | rd_audioinfo.h | Informacje o pliku audio (format, kanaly, sample rate, ramki, dlugosc) |
| rd_audiostore | rd_audiostore.h | Stan magazynu audio (wolne/calkowite bajty) |
| rd_trimaudio | rd_trimaudio.h | Wynik trim audio (numer koszyka/cuta, poziom, punkty start/end) |
| rd_ticketinfo | rd_createticket.h | Bilet autentykacji (token + data wygasniecia) |
| rd_cartimport | rd_import.h | Wynik importu audio (kod odpowiedzi, blad, numer koszyka/cuta) |
| rd_system_settings | rd_listsystemsettings.h | Ustawienia systemowe (sample rate, max post, sciezka ISCI) |
| save_loghdr_values | rd_savelog.h | Naglowek logu do zapisu (serwis, opis, daty, autorefresh) |
| save_logline_values | rd_savelog.h | Linia logu do zapisu (typ, koszyk, punkty audio, metadane markerow) |

## Funkcje API

### Zarzadzanie koszykami (Carts)

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_AddCart | rd_addcart.h | rd_addcart.c | Dodaj nowy koszyk |
| RD_EditCart | rd_editcart.h | rd_editcart.c | Edytuj metadane koszyka |
| RD_RemoveCart | rd_removecart.h | rd_removecart.c | Usun koszyk |
| RD_ListCart | rd_listcart.h | rd_listcart.c | Pobierz pojedynczy koszyk |
| RD_ListCarts | rd_listcarts.h | rd_listcarts.c | Listuj koszyki (z filtrem) |
| RD_ListCartCuts | rd_listcartcuts.h | rd_listcartcuts.c | Listuj koszyk z cutami |
| RD_ListCartsCuts | rd_listcartscuts.h | rd_listcartscuts.c | Listuj wiele koszykow z cutami |
| RD_ListCartSchedCodes | rd_listcartschedcodes.h | rd_listcartschedcodes.c | Kody schedulera dla koszyka |
| RD_AssignSchedCode | rd_assignschedcode.h | rd_assignschedcode.c | Przypisz kod schedulera |
| RD_UnassignSchedCode | rd_unassignschedcode.h | rd_unassignschedcode.c | Usun kod schedulera |

### Zarzadzanie cutami (Cuts)

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_AddCut | rd_addcut.h | rd_addcut.c | Dodaj cut do koszyka |
| RD_EditCut | rd_editcut.h | rd_editcut.c | Edytuj metadane cuta |
| RD_RemoveCut | rd_removecut.h | rd_removecut.c | Usun cut |
| RD_ListCut | rd_listcut.h | rd_listcut.c | Pobierz pojedynczy cut |
| RD_ListCuts | rd_listcuts.h | rd_listcuts.c | Listuj cuty koszyka |

### Audio

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_AudioInfo | rd_audioinfo.h | rd_audioinfo.c | Informacje o pliku audio |
| RD_AudioStore | rd_audiostore.h | rd_audiostore.c | Stan magazynu audio |
| RD_ExportCart | rd_export.h | rd_export.c | Eksport audio (z konwersja formatu) |
| RD_ImportCart | rd_import.h | rd_import.c | Import audio |
| RD_ExportPeaks | rd_exportpeaks.h | rd_exportpeaks.c | Eksport danych peak |
| RD_CopyAudio | rd_copyaudio.h | rd_copyaudio.c | Kopiuj audio miedzy cutami |
| RD_DeleteAudio | rd_deleteaudio.h | rd_deleteaudio.c | Usun dane audio cuta |
| RD_TrimAudio | rd_trimaudio.h | rd_trimaudio.c | Wyznacz punkty trim |

### Logi

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_AddLog | rd_addlog.h | rd_addlog.c | Utworz nowy log |
| RD_DeleteLog | rd_deletelog.h | rd_deletelog.c | Usun log |
| RD_ListLog | rd_listlog.h | rd_listlog.c | Pobierz zawartosc logu |
| RD_ListLogs | rd_listlogs.h | rd_listlogs.c | Listuj logi (z filtrem) |
| RD_SaveLog | rd_savelog.h | rd_savelog.c | Zapisz/zaktualizuj log |

### Grupy i serwisy

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_ListGroup | rd_listgroup.h | rd_listgroup.c | Pobierz pojedyncza grupe |
| RD_ListGroups | rd_listgroups.h | rd_listgroups.c | Listuj wszystkie grupy |
| RD_ListServices | rd_listservices.h | rd_listservices.c | Listuj serwisy |
| RD_ListSchedCodes | rd_listschedcodes.h | rd_listschedcodes.c | Listuj kody schedulera |
| RD_ListSystemSettings | rd_listsystemsettings.h | rd_listsystemsettings.c | Ustawienia systemowe |

### Podcasting / RSS / Images

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_PostPodcast | rd_postpodcast.h | rd_postpodcast.c | Opublikuj audio podcastu |
| RD_SavePodcast | rd_savepodcast.h | rd_savepodcast.c | Zapisz plik audio podcastu |
| RD_DeletePodcast | rd_deletepodcast.h | rd_deletepodcast.c | Usun audio podcastu |
| RD_RemovePodcast | rd_removepodcast.h | rd_removepodcast.c | Usun item podcastu |
| RD_PostRss | rd_postrss.h | rd_postrss.c | Opublikuj feed RSS |
| RD_RemoveRss | rd_removerss.h | rd_removerss.c | Usun feed RSS |
| RD_PostImage | rd_postimage.h | rd_postimage.c | Opublikuj obraz |
| RD_RemoveImage | rd_removeimage.h | rd_removeimage.c | Usun obraz |

### Autentykacja i metadane

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_CreateTicket | rd_createticket.h | rd_createticket.c | Utworz bilet autentykacji |
| RD_GetVersion | rd_getversion.h | rd_getversion.c | Pobierz wersje biblioteki |
| RD_GetUserAgent | rd_getuseragent.h | rd_getuseragent.c | Pobierz User-Agent string |

### Utility (rd_common)

| Funkcja | Plik .h | Plik .c | Opis |
|---------|---------|---------|------|
| RD_ReadBool | rd_common.h | rd_common.c | Parsuj string boolowski |
| RD_Cnv_DTString_to_tm | rd_common.h | rd_common.c | Konwersja datetime string -> struct tm |
| RD_Cnv_tm_to_DTString | rd_common.h | rd_common.c | Konwersja struct tm -> datetime string |
| strlcpy | rd_common.h | rd_common.c | Bezpieczne kopiowanie stringow |
| get_local_offset | rd_common.h | rd_common.c | Offset UTC lokalnej strefy |
| validate_tm | rd_common.h | rd_common.c | Walidacja struktury tm |
| RD_Cnv_TString_to_msec | rd_common.h | rd_common.c | Konwersja time string -> milisekundy |
| RD_Cnv_msec_to_TString | rd_common.h | rd_common.c | Konwersja milisekundy -> time string |

## Pliki zrodlowe

### Pary .h/.c

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rd_addcart.h | rd_addcart.c | API: AddCart |
| 002 | rd_addcut.h | rd_addcut.c | API: AddCut |
| 003 | rd_addlog.h | rd_addlog.c | API: AddLog |
| 004 | rd_assignschedcode.h | rd_assignschedcode.c | API: AssignSchedCode |
| 005 | rd_audioinfo.h | rd_audioinfo.c | API: AudioInfo |
| 006 | rd_audiostore.h | rd_audiostore.c | API: AudioStore |
| 007 | rd_common.h | rd_common.c | Utility functions |
| 008 | rd_copyaudio.h | rd_copyaudio.c | API: CopyAudio |
| 009 | rd_createticket.h | rd_createticket.c | API: CreateTicket |
| 010 | rd_deleteaudio.h | rd_deleteaudio.c | API: DeleteAudio |
| 011 | rd_deletelog.h | rd_deletelog.c | API: DeleteLog |
| 012 | rd_deletepodcast.h | rd_deletepodcast.c | API: DeletePodcast |
| 013 | rd_editcart.h | rd_editcart.c | API: EditCart |
| 014 | rd_editcut.h | rd_editcut.c | API: EditCut |
| 015 | rd_export.h | rd_export.c | API: ExportCart |
| 016 | rd_exportpeaks.h | rd_exportpeaks.c | API: ExportPeaks |
| 017 | rd_getuseragent.h | rd_getuseragent.c | API: GetUserAgent |
| 018 | rd_getversion.h | rd_getversion.c | API: GetVersion |
| 019 | rd_import.h | rd_import.c | API: ImportCart |
| 020 | rd_listcart.h | rd_listcart.c | API: ListCart |
| 021 | rd_listcartcuts.h | rd_listcartcuts.c | API: ListCartCuts |
| 022 | rd_listcarts.h | rd_listcarts.c | API: ListCarts |
| 023 | rd_listcartscuts.h | rd_listcartscuts.c | API: ListCartsCuts |
| 024 | rd_listcartschedcodes.h | rd_listcartschedcodes.c | API: ListCartSchedCodes |
| 025 | rd_listcut.h | rd_listcut.c | API: ListCut |
| 026 | rd_listcuts.h | rd_listcuts.c | API: ListCuts |
| 027 | rd_listgroup.h | rd_listgroup.c | API: ListGroup |
| 028 | rd_listgroups.h | rd_listgroups.c | API: ListGroups |
| 029 | rd_listlog.h | rd_listlog.c | API: ListLog |
| 030 | rd_listlogs.h | rd_listlogs.c | API: ListLogs |
| 031 | rd_listschedcodes.h | rd_listschedcodes.c | API: ListSchedCodes |
| 032 | rd_listservices.h | rd_listservices.c | API: ListServices |
| 033 | rd_listsystemsettings.h | rd_listsystemsettings.c | API: ListSystemSettings |
| 034 | rd_postimage.h | rd_postimage.c | API: PostImage |
| 035 | rd_postpodcast.h | rd_postpodcast.c | API: PostPodcast |
| 036 | rd_postrss.h | rd_postrss.c | API: PostRss |
| 037 | rd_removecart.h | rd_removecart.c | API: RemoveCart |
| 038 | rd_removecut.h | rd_removecut.c | API: RemoveCut |
| 039 | rd_removeimage.h | rd_removeimage.c | API: RemoveImage |
| 040 | rd_removepodcast.h | rd_removepodcast.c | API: RemovePodcast |
| 041 | rd_removerss.h | rd_removerss.c | API: RemoveRss |
| 042 | rd_savelog.h | rd_savelog.c | API: SaveLog |
| 043 | rd_savepodcast.h | rd_savepodcast.c | API: SavePodcast |
| 044 | rd_trimaudio.h | rd_trimaudio.c | API: TrimAudio |
| 045 | rd_unassignschedcode.h | rd_unassignschedcode.c | API: UnassignSchedCode |

### Pliki tylko .h (bez .c) -- struktury danych

| Header | Zawartosc |
|--------|-----------|
| rd_cart.h | Definicja struct rd_cart + enum CART_TYPE |
| rd_cut.h | Definicja struct rd_cut |
| rd_group.h | Definicja struct rd_group |
| rd_schedcodes.h | Definicja struct rd_schedcodes |

### Pliki tylko .c (bez .h)

Brak.

### Pliki pomijane (generowane)

Brak (projekt nie uzywa Qt moc/uic).

## Pliki testowe

| Plik | Framework | Testowana funkcja API |
|------|-----------|----------------------|
| tests/addcart_test.c | manual (standalone) | RD_AddCart |
| tests/addcut_test.c | manual | RD_AddCut |
| tests/addlog_test.c | manual | RD_AddLog |
| tests/assignschedcode_test.c | manual | RD_AssignSchedCode |
| tests/audioinfo_test.c | manual | RD_AudioInfo |
| tests/audiostore_test.c | manual | RD_AudioStore |
| tests/copyaudio_test.c | manual | RD_CopyAudio |
| tests/createticket_test.c | manual | RD_CreateTicket |
| tests/deleteaudio_test.c | manual | RD_DeleteAudio |
| tests/deletelog_test.c | manual | RD_DeleteLog |
| tests/deletepodcast_test.c | manual | RD_DeletePodcast |
| tests/editcart_test.c | manual | RD_EditCart |
| tests/editcut_test.c | manual | RD_EditCut |
| tests/exportcart_test.c | manual | RD_ExportCart |
| tests/exportpeaks_test.c | manual | RD_ExportPeaks |
| tests/getuseragent_test.c | manual | RD_GetUserAgent |
| tests/getversion_test.c | manual | RD_GetVersion |
| tests/importcart_test.c | manual | RD_ImportCart |
| tests/listcart_test.c | manual | RD_ListCart |
| tests/listcartcuts_test.c | manual | RD_ListCartCuts |
| tests/listcarts_test.c | manual | RD_ListCarts |
| tests/listcartscuts_test.c | manual | RD_ListCartsCuts |
| tests/listcartschedcodes_test.c | manual | RD_ListCartSchedCodes |
| tests/listcut_test.c | manual | RD_ListCut |
| tests/listcuts_test.c | manual | RD_ListCuts |
| tests/listgroup_test.c | manual | RD_ListGroup |
| tests/listgroups_test.c | manual | RD_ListGroups |
| tests/listlog_test.c | manual | RD_ListLog |
| tests/listlogs_test.c | manual | RD_ListLogs |
| tests/listschedcodes_test.c | manual | RD_ListSchedCodes |
| tests/listservices_test.c | manual | RD_ListServices |
| tests/listsystemsettings_test.c | manual | RD_ListSystemSettings |
| tests/postimage_test.c | manual | RD_PostImage |
| tests/postpodcast_test.c | manual | RD_PostPodcast |
| tests/postrss_test.c | manual | RD_PostRss |
| tests/removecart_test.c | manual | RD_RemoveCart |
| tests/removecut_test.c | manual | RD_RemoveCut |
| tests/removeimage_test.c | manual | RD_RemoveImage |
| tests/removepodcast_test.c | manual | RD_RemovePodcast |
| tests/removerss_test.c | manual | RD_RemoveRss |
| tests/savelog_test.c | manual | RD_SaveLog |
| tests/savepodcast_test.c | manual | RD_SavePodcast |
| tests/trimaudio_test.c | manual | RD_TrimAudio |
| tests/unassignschedcode_test.c | manual | RD_UnassignSchedCode |
| tests/common.c + common.h | - | Shared test utilities (PromptForString) |

Testy sa standalone C programs (nie QTest), kazdy z wlasna funkcja main(). Linkowane z -lrivwebcapi -lexpat -lcurl -lm.

## Build Target Definition (autotools)

```makefile
# apis/rivwebcapi/rivwebcapi/Makefile.am
lib_LTLIBRARIES = librivwebcapi.la
dist_librivwebcapi_la_SOURCES = rd_addcart.c rd_addcart.h \
    rd_addcut.c rd_addcut.h \
    rd_addlog.c rd_addlog.h \
    ... (45 par .c/.h)

librivwebcapi_la_LDFLAGS = -version-info $(INTERFACE_RIVWEBCAPI_CURRENT):$(INTERFACE_RIVWEBCAPI_REVISION):$(INTERFACE_RIVWEBCAPI_AGE)

includedir = $(prefix)/include/rivwebcapi
include_HEADERS = rd_addcart.h rd_addcut.h ... rd_cart.h rd_cut.h rd_group.h rd_schedcodes.h ...
```

Biblioteka posiada wlasny configure.ac (samodzielny build system w apis/rivwebcapi/), niezalezny od glownego Rivendell configure. Wersjonowanie libtool: CURRENT=1, REVISION=0, AGE=1.

## Zaleznosci (z linker flags)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| libcurl | external (HTTP client) | tak |
| libexpat | external (XML parser) | tak |
| libm | system (math) | tak |

## Dodatkowe pliki projektu

| Plik | Opis |
|------|------|
| apis/rivwebcapi/configure.ac | Autoconf config (sprawdza curl/expat) |
| apis/rivwebcapi/rivwebcapi.pc.in | pkg-config template |
| apis/rivwebcapi/autogen.sh | Bootstrap script |
| apis/rivwebcapi/acinclude.m4 | Autoconf macros |
| apis/rivwebcapi/get_target.sh | Target arch detection |
| apis/rivwebcapi/get_distro.pl | Distro detection |
| docs/rivwebcapi/*.xml | 46 plikow dokumentacji XML (DocBook) |
