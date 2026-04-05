---
phase: 1
artifact: CSM
artifact_name: rdcastmanager
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdcastmanager

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdcastmanager/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | `bin_PROGRAMS = rdcastmanager` |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 7 |
| Pliki .cpp | 6 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~2310 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdcastmanager.cpp:413 | int main(argc, argv) | Punkt startowy procesu |
| QApplication | rdcastmanager.cpp:416 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget | rdcastmanager.cpp:447 | MainWidget *w=new MainWidget(config) | Glowne okno (RDWidget) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdcastmanager.h | RDWidget | Glowne okno aplikacji — lista RSS feedow z przyciskami Open/Copy/Report |
| ListCasts | list_casts.h | RDDialog | Dialog listy castow (epizodow) danego feedu z operacjami CRUD |
| EditCast | edit_cast.h | RDDialog | Dialog edycji pojedynczego castu/epizodu podcastu |
| LogModel | logmodel.h | QAbstractTableModel | Read-only data model dla logow Rivendell (MVC) |
| LogDialog | logdialog.h | RDDialog | Read-only dialog listera logow z QTableView |
| RenderDialog | render_dialog.h | RDDialog | Dialog renderowania logu do audio z opcjami czasu startu i zakresu |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdcastmanager.h | rdcastmanager.cpp | MainWidget + main() — glowne okno aplikacji |
| 002 | list_casts.h | list_casts.cpp | ListCasts — lista castow/epizodow feedu |
| 003 | edit_cast.h | edit_cast.cpp | EditCast — edycja pojedynczego castu |
| 004 | logmodel.h | logmodel.cpp | LogModel — model danych logow (QAbstractTableModel) |
| 005 | logdialog.h | logdialog.cpp | LogDialog — read-only lister logow |
| 006 | render_dialog.h | render_dialog.cpp | RenderDialog — dialog renderowania logu |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje globalnych zmiennych (cast_filter, cast_group, cast_schedcode) |

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_edit_cast.cpp | Generowane przez Qt moc |
| moc_list_casts.cpp | Generowane przez Qt moc |
| moc_logdialog.cpp | Generowane przez Qt moc |
| moc_logmodel.cpp | Generowane przez Qt moc |
| moc_rdcastmanager.cpp | Generowane przez Qt moc |
| moc_render_dialog.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
bin_PROGRAMS = rdcastmanager

dist_rdcastmanager_SOURCES = edit_cast.cpp edit_cast.h\
                             globals.h\
                             list_casts.cpp list_casts.h\
                             logdialog.cpp logdialog.h\
                             logmodel.cpp logmodel.h\
                             rdcastmanager.cpp rdcastmanager.h\
                             render_dialog.cpp render_dialog.h

nodist_rdcastmanager_SOURCES = moc_edit_cast.cpp\
                               moc_list_casts.cpp\
                               moc_logdialog.cpp\
                               moc_logmodel.cpp\
                               moc_rdcastmanager.cpp\
                               moc_render_dialog.cpp

rdcastmanager_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z autotools LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal | librd — glowna biblioteka Rivendell |
| @QT4_LIBS@ | Qt framework | Qt 4 |
| -lQt3Support | Qt framework | Qt3 compatibility layer |
| @LIBVORBIS@ | external | Ogg Vorbis audio codec |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz disc/track lookup |
