---
phase: 1
artifact: CTH
artifact_name: rdcatch
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdcatch

## Lokalizacja

| Pole | Wartosc |
|------|---------|
| Folder zrodlowy | rdcatch/ |
| CMakeLists.txt | brak (autotools: rdcatch/Makefile.am) |
| Target autotools | bin_PROGRAMS = rdcatch |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 15 |
| Pliki .cpp | 13 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~7680 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdcatch.cpp:2109 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdcatch.cpp:2112 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget (RDWidget) | rdcatch.h | MainWidget : public RDWidget | Glowne okno aplikacji (nie QMainWindow — uzywa RDWidget) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdcatch.h | RDWidget (Q_OBJECT) | Glowny widget — Event Schedule Manager, lista zdarzen catch z monitorami deckow |
| CatchConnector | rdcatch.h | plain C++ (brak Q_OBJECT) | Kontener na RDCatchConnect + nazwa stacji + kanaly/monitory |
| AddRecording | add_recording.h | RDDialog (Q_OBJECT) | Dialog wyboru typu nowego zdarzenia (recording/playout/download/upload/macro/switch) |
| EditRecording | edit_recording.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia nagrywania — station, deck, start/end type, autotrim, normalize |
| EditPlayout | edit_playout.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia playout — odtwarzanie zaplanowanego audio |
| EditDownload | edit_download.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia download — pobieranie pliku z URL do carta |
| EditUpload | edit_upload.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia upload — wysylanie carta na serwer (URL/feed) |
| EditCartEvent | edit_cartevent.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia macro cart — uruchomienie carta macro wg harmonogramu |
| EditSwitchEvent | edit_switchevent.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia switch — przelaczanie matrycy (matrix input/output) |
| DeckMon | deckmon.h | RDFrame (Q_OBJECT) | Monitor pojedynczego decka — status, metery audio, przyciski abort/monitor |
| CatchMonitor | catch_monitor.h | plain C++ (brak Q_OBJECT) | Kontener metadanych monitora decka (DeckMon ptr + serial + channel) |
| CatchListView | catch_listview.h | RDListView (Q_OBJECT) | Lista zdarzen z context menu i obsluga right-click (edit audio) |
| ListReports | list_reports.h | RDDialog (Q_OBJECT) | Dialog generowania raportow (Event Report, Xload Report) |
| VBox | vbox.h | QWidget (Q_OBJECT) | Widget layout — dynamiczny vertical box z horyzontalnym resizingiem |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdcatch.h | rdcatch.cpp | Glowny widget + main() + CatchConnector |
| 002 | add_recording.h | add_recording.cpp | Dialog dodawania nowego zdarzenia |
| 003 | edit_recording.h | edit_recording.cpp | Dialog edycji nagrywania |
| 004 | edit_playout.h | edit_playout.cpp | Dialog edycji playout |
| 005 | edit_download.h | edit_download.cpp | Dialog edycji download |
| 006 | edit_upload.h | edit_upload.cpp | Dialog edycji upload |
| 007 | edit_cartevent.h | edit_cartevent.cpp | Dialog edycji macro cart event |
| 008 | edit_switchevent.h | edit_switchevent.cpp | Dialog edycji switch event |
| 009 | deckmon.h | deckmon.cpp | Monitor decka nagrywajacego |
| 010 | catch_monitor.h | catch_monitor.cpp | Kontener metadanych monitora |
| 011 | catch_listview.h | catch_listview.cpp | Lista zdarzen z context menu |
| 012 | list_reports.h | list_reports.cpp | Dialog raportow |
| 013 | vbox.h | vbox.cpp | Vertical box layout widget |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje zmiennych globalnych (RDAudioPort, RDCartDialog, audition card/port) |
| colors.h | Definicje kolorow (#define) dla stanow zdarzen i przyciskow |

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_add_recording.cpp | Generowane przez Qt moc |
| moc_catch_listview.cpp | Generowane przez Qt moc |
| moc_deckmon.cpp | Generowane przez Qt moc |
| moc_edit_cartevent.cpp | Generowane przez Qt moc |
| moc_edit_download.cpp | Generowane przez Qt moc |
| moc_edit_playout.cpp | Generowane przez Qt moc |
| moc_edit_recording.cpp | Generowane przez Qt moc |
| moc_edit_switchevent.cpp | Generowane przez Qt moc |
| moc_edit_upload.cpp | Generowane przez Qt moc |
| moc_list_reports.cpp | Generowane przez Qt moc |
| moc_rdcatch.cpp | Generowane przez Qt moc |
| moc_vbox.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
bin_PROGRAMS = rdcatch

dist_rdcatch_SOURCES = add_recording.cpp add_recording.h\
                       catch_monitor.cpp catch_monitor.h\
                       catch_listview.cpp catch_listview.h\
                       colors.h\
                       deckmon.cpp deckmon.h\
                       edit_cartevent.cpp edit_cartevent.h\
                       edit_download.cpp edit_download.h\
                       edit_playout.cpp edit_playout.h\
                       edit_recording.cpp edit_recording.h\
                       edit_switchevent.cpp edit_switchevent.h\
                       edit_upload.cpp edit_upload.h\
                       globals.h\
                       list_reports.cpp list_reports.h\
                       rdcatch.cpp rdcatch.h\
                       vbox.cpp vbox.h
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Uwagi |
|------------|-----|-------|
| @LIB_RDLIBS@ | internal | librd — glowna biblioteka Rivendell |
| @LIBVORBIS@ | external | Ogg Vorbis codec |
| @QT4_LIBS@ | Qt framework | Qt 4 z Qt3Support |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz lookup |
| -lQt3Support | Qt framework | Qt3 compatibility layer |
