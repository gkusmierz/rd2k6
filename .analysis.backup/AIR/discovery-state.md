---
phase: 1
artifact: AIR
artifact_name: rdairplay
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdairplay

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdairplay/ |
| CMakeLists.txt | brak (autotools: rdairplay/Makefile.am) |
| Target autotools | bin_PROGRAMS = rdairplay |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 16 |
| Pliki .cpp | 15 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~9030 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdairplay.cpp:2346 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdairplay.cpp:2349 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget (RDWidget) | rdairplay.h | MainWidget : public RDWidget | Glowne okno aplikacji (nie QMainWindow — uzywa RDWidget) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdairplay.h | RDWidget (Q_OBJECT) | Glowny widget aplikacji — on-air playout UI, zarzadzanie logami i panelami |
| ButtonLog | button_log.h | RDWidget (Q_OBJECT) | Widget trybu button-play — wyswietla linie logu jako przyciski start/stop |
| ListLog | list_log.h | RDWidget (Q_OBJECT) | Widget pelnego logu — lista zdarzen z kontrolkami odtwarzania |
| LogLineBox | loglinebox.h | RDWidget (Q_OBJECT) | Pojedyncza linia logu — wyswietla info o carcie z paskiem postepu |
| EditEvent | edit_event.h | RDDialog (Q_OBJECT) | Dialog edycji zdarzenia logu — czas, typ przejscia, grace time |
| ListLogs | list_logs.h | RDDialog (Q_OBJECT) | Dialog wyboru logu — load/save/unload z filtrowaniem |
| PieCounter | pie_counter.h | RDWidget (Q_OBJECT) | Widget pie-chart countdown — wizualny odliczacz czasu trwania |
| PostCounter | post_counter.h | RDPushButton (Q_OBJECT) | Widget post-point — wyswietla odchylenie od planowanego czasu |
| StopCounter | stop_counter.h | RDPushButton (Q_OBJECT) | Widget stop counter — odlicza czas do konca aktualnego elementu |
| StartButton | start_button.h | RDPushButton (Q_OBJECT) | Przycisk start/stop/pause z wieloma trybami (12 stanow) |
| ModeDisplay | mode_display.h | RDPushButton (Q_OBJECT) | Wyswietlacz trybu operacyjnego (Manual/Auto/LiveAssist) |
| WallClock | wall_clock.h | RDPushButton (Q_OBJECT) | Zegar scienny — czas rzeczywisty z detekcja utraty synchronizacji |
| HourSelector | hourselector.h | RDWidget (Q_OBJECT) | Selektor godzin — 24 przyciski do nawigacji po logu godzinowym |
| LibListView | lib_listview.h | RDListView (Q_OBJECT) | ListView z obsluga drag-and-drop cartow |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | button_log.h | button_log.cpp | Widget button-play view |
| 002 | edit_event.h | edit_event.cpp | Dialog edycji zdarzenia |
| 003 | hourselector.h | hourselector.cpp | Selektor godzin |
| 004 | lib_listview.h | lib_listview.cpp | ListView z drag-drop |
| 005 | list_log.h | list_log.cpp | Widget pelnego logu |
| 006 | list_logs.h | list_logs.cpp | Dialog wyboru logu |
| 007 | loglinebox.h | loglinebox.cpp | Pojedyncza linia logu |
| 008 | mode_display.h | mode_display.cpp | Wyswietlacz trybu |
| 009 | pie_counter.h | pie_counter.cpp | Pie countdown widget |
| 010 | post_counter.h | post_counter.cpp | Post-point counter |
| 011 | rdairplay.h | rdairplay.cpp | Glowny widget + main() |
| 012 | start_button.h | start_button.cpp | Start/stop button |
| 013 | stop_counter.h | stop_counter.cpp | Stop counter |
| 014 | wall_clock.h | wall_clock.cpp | Zegar scienny |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje zmiennych globalnych (RDAudioPort, RDEventPlayer, RDCartDialog) |
| colors.h | Definicje kolorow i napisow trybowych (#define stale) |

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| local_macros.cpp | Implementacja RunLocalMacros() — obsluga komend RML (Remote Macro Language) |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_button_log.cpp | Generowane przez Qt moc |
| moc_edit_event.cpp | Generowane przez Qt moc |
| moc_hourselector.cpp | Generowane przez Qt moc |
| moc_lib_listview.cpp | Generowane przez Qt moc |
| moc_list_log.cpp | Generowane przez Qt moc |
| moc_list_logs.cpp | Generowane przez Qt moc |
| moc_loglinebox.cpp | Generowane przez Qt moc |
| moc_mode_display.cpp | Generowane przez Qt moc |
| moc_pie_counter.cpp | Generowane przez Qt moc |
| moc_post_counter.cpp | Generowane przez Qt moc |
| moc_rdairplay.cpp | Generowane przez Qt moc |
| moc_start_button.cpp | Generowane przez Qt moc |
| moc_stop_counter.cpp | Generowane przez Qt moc |
| moc_wall_clock.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
bin_PROGRAMS = rdairplay

dist_rdairplay_SOURCES = button_log.cpp button_log.h\
                         edit_event.cpp edit_event.h\
                         globals.h\
                         hourselector.cpp hourselector.h\
                         lib_listview.cpp lib_listview.h\
                         list_log.cpp list_log.h\
                         list_logs.cpp list_logs.h\
                         local_macros.cpp colors.h\
                         loglinebox.cpp loglinebox.h\
                         mode_display.cpp mode_display.h\
                         pie_counter.cpp pie_counter.h\
                         post_counter.cpp post_counter.h\
                         rdairplay.cpp rdairplay.h\
                         start_button.cpp start_button.h\
                         stop_counter.cpp stop_counter.h\
                         wall_clock.cpp wall_clock.h

rdairplay_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
rdairplay_LDFLAGS = -rdynamic
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal (librd) | Glowna biblioteka Rivendell |
| @QT4_LIBS@ | Qt framework | Qt 4 (widgets, core, gui) |
| -lQt3Support | Qt framework | Warstwa kompatybilnosci Qt3 |
| @LIBVORBIS@ | external | Kodek audio Vorbis |
| @MUSICBRAINZ_LIBS@ | external | Lookup metadanych audio |
