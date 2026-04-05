---
phase: 1
artifact: MON
artifact_name: rdmonitor
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdmonitor

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdmonitor/ |
| CMakeLists.txt | brak (autotools: rdmonitor/Makefile.am) |
| Target autotools | rdmonitor (bin_PROGRAMS) |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 2 |
| Pliki .cpp | 2 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | 818 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdmonitor.cpp:475 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdmonitor.cpp:478 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget (RDWidget) | rdmonitor.h | MainWidget : RDWidget | Glowny widget (nie QMainWindow — borderless applet) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdmonitor.h | RDWidget (Q_OBJECT) | Glowny widget systemu monitoringu — borderless, stays-on-top applet wyswietlajacy status DB/audio |
| PositionDialog | positiondialog.h | RDDialog (Q_OBJECT) | Dialog konfiguracji pozycji appletu na ekranie (screen number, position, offset X/Y) |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdmonitor.h | rdmonitor.cpp | MainWidget + main() + SigHandler — glowny widget + entry point |
| 002 | positiondialog.h | positiondialog.cpp | PositionDialog — dialog pozycji na ekranie |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdmonitor.cpp | Generowane przez Qt moc |
| moc_positiondialog.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition (autotools)

```makefile
bin_PROGRAMS = rdmonitor

dist_rdmonitor_SOURCES = positiondialog.cpp positiondialog.h\
                         rdmonitor.cpp rdmonitor.h

nodist_rdmonitor_SOURCES = moc_positiondialog.cpp\
                           moc_rdmonitor.cpp

rdmonitor_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @LIBVORBIS@ | external (codec) | tak |
| @MUSICBRAINZ_LIBS@ | external (disc lookup) | tak |
| -lQt3Support | Qt compatibility | tak |

## Uwagi dodatkowe

- rdmonitor to niewielki applet (system tray-like widget) wyswietlany jako borderless, stays-on-top okno.
- Cyklicznie (co 5s) waliduje stan bazy danych (RDDbValid) i audio store (RDAudioStoreValid).
- Wyswietla zielona/czerwona ikonke w zaleznosci od statusu.
- Prawy klik otwiera PositionDialog (konfiguracja pozycji na ekranie).
- Podwojny lewy klik uruchamia rdselect (jesli >1 konfiguracja w RD_DEFAULT_RDSELECT_DIR).
- Hover pokazuje status label z komunikatem diagnostycznym (DB ok/fail, schema ok/skewed, audio ok/fail).
- Konfiguracja pozycji: 6 pozycji (UpperLeft/Center/Right, LowerLeft/Center/Right) + offset X/Y + numer ekranu.
- Konfiguracja pozycji zapisywana przez RDMonitorConfig (z librd).
- Obsluga sygnalow SIGTERM/SIGINT (SigHandler -> exit(0)).
