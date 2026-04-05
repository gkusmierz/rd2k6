---
phase: 1
artifact: LGE
artifact_name: rdlogedit
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdlogedit

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdlogedit/ |
| CMakeLists.txt | brak (autotools: rdlogedit/Makefile.am) |
| Target autotools | bin_PROGRAMS = rdlogedit |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 15 |
| Pliki .cpp | 14 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 7 |
| Linie kodu (est.) | ~9100 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdlogedit.cpp:845 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdlogedit.cpp:848 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget | rdlogedit.h | MainWidget : public RDWidget | Glowne okno aplikacji (nie QMainWindow, dziedziczy z RDWidget) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdlogedit.h | RDWidget (Q_OBJECT) | Glowne okno — lista logow z filtrami, CRUD, voice tracking |
| EditLog | edit_log.h | RDDialog (Q_OBJECT) | Dialog edycji pojedynczego logu — najbardziej rozbudowana klasa (~1682 LOC w .cpp) |
| EditEvent | edit_event.h | RDDialog (Q_OBJECT) | Abstrakcyjna klasa bazowa dla edytorow zdarzen logu (czas, tranzycja, grace) |
| EditLogLine | edit_logline.h | EditEvent (Q_OBJECT) | Dialog edycji zdarzenia typu cart (wybor cartu, overlap) |
| EditChain | edit_chain.h | EditEvent (Q_OBJECT) | Dialog edycji zdarzenia chain-to (przelaczenie na inny log) |
| EditMarker | edit_marker.h | EditEvent (Q_OBJECT) | Dialog edycji markera w logu |
| EditTrack | edit_track.h | EditEvent (Q_OBJECT) | Dialog edycji voice-track log entry |
| AddMeta | add_meta.h | RDDialog (Q_OBJECT) | Dialog wyboru typu meta-eventu (marker/chain/track) |
| VoiceTracker | voice_tracker.h | RDDialog (Q_OBJECT) | Voice tracker — nagrywanie i edycja segmentow glosowych (~3839 LOC w .cpp) |
| RenderDialog | render_dialog.h | RDDialog (Q_OBJECT) | Dialog renderowania logu do pliku audio lub cart/cut |
| ListReports | list_reports.h | RDDialog (Q_OBJECT) | Dialog generowania raportow z logu (log report, CSV, exception report) |
| DropListView | drop_listview.h | RDListView (Q_OBJECT) | ListView z obsluga drag & drop cartow |
| LogListView | log_listview.h | RDListView (Q_OBJECT) | ListView z menu kontekstowym tranzycji (play/segue/stop) |
| ListListViewItem | list_listviewitem.h | Q3ListViewItem | Custom list item z track-count renderingiem i kolorowymi ikonami |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | add_meta.h | add_meta.cpp | Dialog wyboru typu meta-eventu |
| 002 | drop_listview.h | drop_listview.cpp | ListView z drag & drop |
| 003 | edit_chain.h | edit_chain.cpp | Edycja chain-to event |
| 004 | edit_event.h | edit_event.cpp | Baza edytorow zdarzen |
| 005 | edit_log.h | edit_log.cpp | Edycja logu — glowny dialog |
| 006 | edit_logline.h | edit_logline.cpp | Edycja cart event |
| 007 | edit_marker.h | edit_marker.cpp | Edycja markera |
| 008 | edit_track.h | edit_track.cpp | Edycja voice track entry |
| 009 | list_listviewitem.h | list_listviewitem.cpp | Custom list view item |
| 010 | list_reports.h | list_reports.cpp | Raporty z logu |
| 011 | log_listview.h | log_listview.cpp | ListView z context menu |
| 012 | rdlogedit.h | rdlogedit.cpp | MainWidget + main() |
| 013 | render_dialog.h | render_dialog.cpp | Dialog renderowania |
| 014 | voice_tracker.h | voice_tracker.cpp | Voice tracker |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje zmiennych globalnych (global_import_running, rozmiary okien, styl czasu) |

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_add_meta.cpp | Generowane przez Qt moc |
| moc_drop_listview.cpp | Generowane przez Qt moc |
| moc_edit_chain.cpp | Generowane przez Qt moc |
| moc_edit_event.cpp | Generowane przez Qt moc |
| moc_edit_log.cpp | Generowane przez Qt moc |
| moc_edit_logline.cpp | Generowane przez Qt moc |
| moc_edit_marker.cpp | Generowane przez Qt moc |
| moc_edit_track.cpp | Generowane przez Qt moc |
| moc_list_reports.cpp | Generowane przez Qt moc |
| moc_log_listview.cpp | Generowane przez Qt moc |
| moc_rdlogedit.cpp | Generowane przez Qt moc |
| moc_render_dialog.cpp | Generowane przez Qt moc |
| moc_voice_tracker.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition (autotools)

```makefile
bin_PROGRAMS = rdlogedit

dist_rdlogedit_SOURCES = add_meta.cpp add_meta.h\
                         drop_listview.cpp drop_listview.h\
                         edit_chain.cpp edit_chain.h\
                         edit_event.cpp edit_event.h\
                         edit_log.cpp edit_log.h\
                         edit_logline.cpp edit_logline.h\
                         edit_marker.cpp edit_marker.h\
                         edit_track.cpp edit_track.h\
                         list_listviewitem.cpp list_listviewitem.h\
                         list_reports.cpp list_reports.h\
                         log_listview.cpp log_listview.h\
                         rdlogedit.cpp rdlogedit.h globals.h\
                         render_dialog.cpp render_dialog.h\
                         voice_tracker.cpp voice_tracker.h

nodist_rdlogedit_SOURCES = moc_add_meta.cpp\
                           moc_drop_listview.cpp\
                           moc_edit_chain.cpp\
                           moc_edit_event.cpp\
                           moc_edit_log.cpp\
                           moc_edit_logline.cpp\
                           moc_edit_marker.cpp\
                           moc_edit_track.cpp\
                           moc_list_reports.cpp\
                           moc_log_listview.cpp\
                           moc_rdlogedit.cpp\
                           moc_render_dialog.cpp\
                           moc_voice_tracker.cpp

rdlogedit_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z autotools LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external (audio codec) | tak |
| @QT4_LIBS@ | Qt 4 framework | tak |
| @MUSICBRAINZ_LIBS@ | external (disc lookup) | tak |
| -lQt3Support | Qt 3 compat layer | tak |

## Hierarchia klas

```
RDWidget
  └── MainWidget                (glowne okno)

RDDialog
  ├── EditEvent                 (abstrakcyjna baza)
  │   ├── EditLogLine           (edycja cart event)
  │   ├── EditChain             (edycja chain-to event)
  │   ├── EditMarker            (edycja markera)
  │   └── EditTrack             (edycja voice track entry)
  ├── EditLog                   (edycja calego logu)
  ├── AddMeta                   (wybor typu meta-eventu)
  ├── VoiceTracker              (nagrywanie voiceover)
  ├── RenderDialog              (renderowanie logu)
  └── ListReports               (generowanie raportow)

RDListView
  ├── DropListView              (drag & drop)
  └── LogListView               (context menu tranzycji)

Q3ListViewItem
  └── ListListViewItem          (custom rendering)
```
