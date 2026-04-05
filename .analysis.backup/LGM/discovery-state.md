---
phase: 1
artifact: LGM
artifact_name: rdlogmanager
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdlogmanager

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdlogmanager/ |
| CMakeLists.txt | brak (autotools: rdlogmanager/Makefile.am) |
| Target | rdlogmanager (bin_PROGRAMS) |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 27 |
| Pliki .cpp | 27 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~9080 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdlogmanager.cpp:278 | int main(int argc, char *argv[]) | Punkt startowy procesu; parsuje CLI args, dispatches do GUI lub CLI mode |
| gui_main() | rdlogmanager.cpp:235 | int gui_main(int argc, char *argv[]) | GUI mode — tworzy QApplication, MainWidget, event loop |
| QApplication (GUI) | rdlogmanager.cpp:238 | QApplication a(argc,argv) | Inicjalizacja Qt w trybie GUI |
| QApplication (CLI/log) | rdlogmanager.cpp:374 | QApplication a(argc,argv,false) | Inicjalizacja Qt w trybie CLI (log generation, headless) |
| QApplication (CLI/report) | commandline_ops.cpp:43 | QApplication a(argc,argv,false) | Inicjalizacja Qt w trybie CLI (report generation) |
| RDWidget (main) | rdlogmanager.h:42 | MainWidget : public RDWidget | Glowne okno (nie QMainWindow — uzywa RDWidget) |
| LogObject (CLI) | logobject.h:28 | LogObject : public QObject | Headless log generation object (CLI mode) |

Aplikacja ma dwa tryby pracy:
1. **GUI mode** (domyslny) — uruchamia MainWidget z 6 przyciskami nawigacyjnymi
2. **CLI mode** — uruchamia LogObject (generowanie logow) lub RunReportOperation (raporty)
   CLI flags: -g (generate), -m (merge music), -t (merge traffic), -s (service), -r (report), -d/-e (date offsets), -P (protect existing)

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdlogmanager.h | RDWidget | Glowne okno — 6 przyciskow: Events, Clocks, Grids, Generate, Reports, Close |
| LogObject | logobject.h | QObject | Headless log generation (CLI mode) |
| ListEvents | list_events.h | RDDialog | Lista eventow z CRUD + rename + filtrowanie po serwisie |
| ListClocks | list_clocks.h | RDDialog | Lista clockow z CRUD + rename + filtrowanie po serwisie |
| ListGrids | list_grids.h | RDDialog | Lista gridow (serwisow) z edit |
| ListSvcs | list_svcs.h | RDDialog | Lista serwisow z generowaniem logow i purge |
| EditEvent | edit_event.h | RDDialog | Edytor eventu — import/preimport/postimport, scheduling, transitions, library browser |
| EditClock | edit_clock.h | RDDialog | Edytor clocka — lista eventow, pie chart, scheduling rules |
| EditGrid | edit_grid.h | RDDialog | Edytor gridu — 7 dni x 24 godziny, przypisywanie clockow do slotow |
| EditEventLine | edit_eventline.h | RDDialog | Edytor linii eventu w clocku (start time, event selection) |
| EditPerms | edit_perms.h | RDDialog | Edytor uprawnien (permissions) dla eventow i clockow |
| EditSchedRules | edit_schedrules.h | RDDialog | Edytor regul schedulera (artist separation, scheduler codes) |
| EditSchedCodeRules | edit_schedcoderules.h | RDDialog | Edytor regul dla pojedynczego scheduler code |
| EditNote | edit_note.h | RDDialog | Edytor notatki (tekst) w imporcie |
| EditTrack | edit_track.h | RDDialog | Edytor voice tracku (tekst) w imporcie |
| GenerateLog | generate_log.h | RDDialog | Dialog generowania logu — wybor serwisu, daty, merge music/traffic |
| AddEvent | add_event.h | RDDialog | Dialog dodawania nowego eventu (nazwa) |
| AddClock | add_clock.h | RDDialog | Dialog dodawania nowego clocka (nazwa) |
| RenameItem | rename_item.h | RDDialog | Dialog zmiany nazwy eventu/clocka |
| PickReportDates | pick_report_dates.h | RDDialog | Wybor dat do generowania raportu |
| ViewReportDialog | viewreportdialog.h | RDDialog | Podglad wygenerowanego raportu |
| SvcRecDialog | svc_rec_dialog.h | RDDialog | Dialog purge/delete rekordow serwisu z kalendarzem |
| SvcRec | svc_rec.h | RDWidget | Widget kalendarza — wybor daty z oznaczeniem aktywnych dni |
| ClockListView | clock_listview.h | RDListView | ListView eventow w clocku z context menu |
| LibListView | lib_listview.h | Q3ListView | ListView biblioteki cartow (do drag & drop w event editor) |
| ImportListView | import_listview.h | Q3ListView | ListView importowanych cartow (pre/post import) z D&D i context menu |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdlogmanager.h | rdlogmanager.cpp | MainWidget + gui_main() + main() |
| 002 | logobject.h | logobject.cpp | CLI log generation object |
| 003 | list_events.h | list_events.cpp | Lista eventow |
| 004 | list_clocks.h | list_clocks.cpp | Lista clockow |
| 005 | list_grids.h | list_grids.cpp | Lista gridow |
| 006 | list_svcs.h | list_svcs.cpp | Lista serwisow (reports) |
| 007 | edit_event.h | edit_event.cpp | Edytor eventu (1450 LOC — najwiekszy plik) |
| 008 | edit_clock.h | edit_clock.cpp | Edytor clocka (668 LOC) |
| 009 | edit_grid.h | edit_grid.cpp | Edytor gridu |
| 010 | edit_eventline.h | edit_eventline.cpp | Edytor linii eventu w clocku |
| 011 | edit_perms.h | edit_perms.cpp | Edytor uprawnien |
| 012 | edit_schedrules.h | edit_schedrules.cpp | Edytor regul schedulera |
| 013 | edit_schedcoderules.h | edit_schedcoderules.cpp | Edytor regul sched code |
| 014 | edit_note.h | edit_note.cpp | Edytor notatki |
| 015 | edit_track.h | edit_track.cpp | Edytor voice tracku |
| 016 | generate_log.h | generate_log.cpp | Dialog generowania logu (581 LOC) |
| 017 | add_event.h | add_event.cpp | Dialog dodawania eventu |
| 018 | add_clock.h | add_clock.cpp | Dialog dodawania clocka |
| 019 | rename_item.h | rename_item.cpp | Dialog zmiany nazwy |
| 020 | pick_report_dates.h | pick_report_dates.cpp | Wybor dat raportu |
| 021 | viewreportdialog.h | viewreportdialog.cpp | Podglad raportu |
| 022 | svc_rec_dialog.h | svc_rec_dialog.cpp | Dialog purge serwisu |
| 023 | svc_rec.h | svc_rec.cpp | Widget kalendarza (351 LOC) |
| 024 | clock_listview.h | clock_listview.cpp | Custom ListView dla clocka |
| 025 | lib_listview.h | lib_listview.cpp | Custom ListView biblioteki |
| 026 | import_listview.h | import_listview.cpp | Custom ListView importu |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje zmiennych globalnych (event_filter, clock_filter, skip_db_check) |

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| commandline_ops.cpp | Funkcja RunReportOperation() — CLI report generation |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_*.cpp (26 plikow) | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition (Makefile.am)

```makefile
bin_PROGRAMS = rdlogmanager

dist_rdlogmanager_SOURCES = add_clock.cpp add_clock.h\
                            add_event.cpp add_event.h\
                            clock_listview.cpp clock_listview.h\
                            commandline_ops.cpp globals.h\
                            edit_clock.cpp edit_clock.h\
                            edit_event.cpp edit_event.h\
                            edit_eventline.cpp edit_eventline.h\
                            edit_grid.cpp edit_grid.h\
                            edit_note.cpp edit_note.h\
                            edit_perms.cpp edit_perms.h\
                            edit_schedrules.cpp edit_schedrules.h\
                            edit_schedcoderules.cpp edit_schedcoderules.h\
                            edit_track.cpp edit_track.h\
                            generate_log.cpp generate_log.h\
                            import_listview.cpp import_listview.h\
                            lib_listview.cpp lib_listview.h\
                            list_clocks.cpp list_clocks.h\
                            list_events.cpp list_events.h\
                            list_grids.cpp list_grids.h\
                            list_svcs.cpp list_svcs.h\
                            logobject.cpp logobject.h\
                            pick_report_dates.cpp pick_report_dates.h\
                            rdlogmanager.cpp rdlogmanager.h\
                            rename_item.cpp rename_item.h\
                            svc_rec.cpp svc_rec.h\
                            svc_rec_dialog.cpp svc_rec_dialog.h\
                            viewreportdialog.cpp viewreportdialog.h
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal | librd (Rivendell core library) |
| @LIBVORBIS@ | external | libvorbis (audio codec) |
| @QT4_LIBS@ | Qt framework | Qt4 |
| @MUSICBRAINZ_LIBS@ | external | libmusicbrainz (disc lookup) |
| -lQt3Support | Qt framework | Qt3 compatibility layer |
