---
phase: 1
artifact: RLB
artifact_name: rdlibrary
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdlibrary

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdlibrary/ |
| CMakeLists.txt | brak (autotools: rdlibrary/Makefile.am) |
| Target autotools | bin_PROGRAMS = rdlibrary |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 17 |
| Pliki .cpp | 15 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts | 7 (i18n: pt_BR, nb, nn, cs, de, fr, es) |
| Linie kodu (est.) | ~8990 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdlibrary.cpp:1720 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdlibrary.cpp:1723 | QApplication a(argc, argv) | Inicjalizacja Qt |
| MainWidget | rdlibrary.h | MainWidget : public RDWidget | Główne okno (RDWidget, nie QMainWindow) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdlibrary.h | RDWidget (Q_OBJECT) | Główne okno aplikacji — lista kartów, filtry, akcje CRUD |
| AudioCart | audio_cart.h | RDWidget (Q_OBJECT) | Widget edycji/wyswietlania audio cart (cuty, marker, player) |
| MacroCart | macro_cart.h | RDWidget (Q_OBJECT) | Widget edycji/wyswietlania macro cart |
| EditCart | edit_cart.h | RDDialog (Q_OBJECT) | Dialog edycji metadanych carta |
| EditMacro | edit_macro.h | RDDialog (Q_OBJECT) | Dialog edycji pojedynczego makra |
| EditNotes | edit_notes.h | RDDialog (Q_OBJECT) | Dialog edycji notatek carta |
| EditSchedulerCodes | edit_schedulercodes.h | RDDialog (Q_OBJECT) | Dialog edycji kodow schedulera |
| RecordCut | record_cut.h | RDDialog (Q_OBJECT) | Dialog nagrywania/importu cuta audio |
| CdRipper | cdripper.h | RDDialog (Q_OBJECT) | Dialog rippowania CD (cdparanoia) |
| DiskRipper | disk_ripper.h | RDDialog (Q_OBJECT) | Dialog rippowania calego dysku CD (batch) |
| DiskGauge | disk_gauge.h | RDWidget (Q_OBJECT) | Widget gauge zajętości dysku audio |
| ListReports | list_reports.h | RDDialog (Q_OBJECT) | Dialog wyboru i generowania raportow |
| LibListView | lib_listview.h | RDListView (Q_OBJECT) | Customowy list view z drag-and-drop |
| NoteBubble | notebubble.h | QLabel (Q_OBJECT) | Tooltip/bubble do wyswietlania notatek |
| AudioControls | audio_controls.h | Plain C++ (brak Q_OBJECT) | Kontener na referencje do kontrolek edycji audio |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | audio_cart.h | audio_cart.cpp | Widget audio cart — 927 LOC |
| 002 | cdripper.h | cdripper.cpp | Dialog CD rip — 784 LOC |
| 003 | disk_gauge.h | disk_gauge.cpp | Gauge widget — 153 LOC |
| 004 | disk_ripper.h | disk_ripper.cpp | Batch CD rip dialog — 1210 LOC |
| 005 | edit_cart.h | edit_cart.cpp | Cart edit dialog — 1104 LOC |
| 006 | edit_macro.h | edit_macro.cpp | Macro edit dialog — 127 LOC |
| 007 | edit_notes.h | edit_notes.cpp | Notes edit dialog — 124 LOC |
| 008 | edit_schedulercodes.h | edit_schedulercodes.cpp | Scheduler codes dialog — 208 LOC |
| 009 | lib_listview.h | lib_listview.cpp | Custom list view — 141 LOC |
| 010 | list_reports.h | list_reports.cpp | Reports dialog — 678 LOC |
| 011 | macro_cart.h | macro_cart.cpp | Widget macro cart — 405 LOC |
| 012 | notebubble.h | notebubble.cpp | Note bubble label — 92 LOC |
| 013 | rdlibrary.h | rdlibrary.cpp | Main widget + main() — 1694 LOC |
| 014 | record_cut.h | record_cut.cpp | Record/import cut dialog — 1135 LOC |
| 015 | validate_cut.h | validate_cut.cpp | Cut validation utility — 120 LOC |

### Pliki tylko .h (bez .cpp)

| Header | Zawartość |
|--------|-----------|
| globals.h | Deklaracje extern globalnych zmiennych (rdaudioport_conf, disk_gauge, cut_clipboard, flagi) |
| audio_controls.h | Plain C++ container class — referencje do kontrolek UI edycji audio |

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_audio_cart.cpp | Generowane przez Qt moc |
| moc_cdripper.cpp | Generowane przez Qt moc |
| moc_disk_gauge.cpp | Generowane przez Qt moc |
| moc_disk_ripper.cpp | Generowane przez Qt moc |
| moc_edit_cart.cpp | Generowane przez Qt moc |
| moc_edit_macro.cpp | Generowane przez Qt moc |
| moc_edit_notes.cpp | Generowane przez Qt moc |
| moc_edit_schedulercodes.cpp | Generowane przez Qt moc |
| moc_lib_listview.cpp | Generowane przez Qt moc |
| moc_list_reports.cpp | Generowane przez Qt moc |
| moc_macro_cart.cpp | Generowane przez Qt moc |
| moc_notebubble.cpp | Generowane przez Qt moc |
| moc_rdlibrary.cpp | Generowane przez Qt moc |
| moc_record_cut.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plików testowych specyficznych dla tego artifaktu. Testy w tests/ dotyczą biblioteki librd (LIB_RDLIBS), nie rdlibrary bezpośrednio.

## Autotools Target Definition

```makefile
bin_PROGRAMS = rdlibrary

dist_rdlibrary_SOURCES = audio_cart.cpp audio_cart.h\
                         audio_controls.h\
                         cdripper.cpp cdripper.h\
                         disk_gauge.cpp disk_gauge.h\
                         disk_ripper.cpp disk_ripper.h\
                         edit_cart.cpp edit_cart.h\
                         edit_macro.cpp edit_macro.h\
                         edit_notes.cpp edit_notes.h\
                         edit_schedulercodes.cpp edit_schedulercodes.h\
                         globals.h\
                         lib_listview.cpp lib_listview.h\
                         list_reports.cpp list_reports.h\
                         macro_cart.cpp macro_cart.h\
                         notebubble.cpp notebubble.h\
                         rdlibrary.cpp rdlibrary.h\
                         record_cut.cpp record_cut.h\
                         validate_cut.cpp validate_cut.h
```

## Zależności (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal (librd) | Główna biblioteka Rivendell |
| @LIBVORBIS@ | external | Obsługa formatu Ogg Vorbis |
| @QT4_LIBS@ | Qt framework | Qt 4 libraries |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz disc lookup (CD ripper) |
| -lQt3Support | Qt framework | Qt 3 compatibility layer |
