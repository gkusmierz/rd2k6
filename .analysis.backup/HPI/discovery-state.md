---
phase: 1
artifact: HPI
artifact_name: librdhpi
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: librdhpi

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdhpi/ |
| CMakeLists.txt | brak (autotools: rdhpi/Makefile.am) |
| Target autotools | librdhpi.la (lib_LTLIBRARIES) |
| Typ | library |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 5 |
| Pliki .cpp | 5 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~3025 |

## Entry Points

Biblioteka -- brak main(), brak QApplication, brak QMainWindow.

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| - | - | - | To jest biblioteka; brak entry points |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDHPIInformation | rdhpiinformation.h | plain C++ (bez Q_OBJECT) | Kontener danych o adapterze AudioScience HPI (serial, wersje, PCB) |
| RDHPISoundCard | rdhpisoundcard.h | QObject | Glowna klasa zarzadzania kartami dzwiekowymi HPI -- mixer, metering, volume, tuner, port/stream enumeration |
| RDHPIPlayStream | rdhpiplaystream.h | QObject + RDWaveFile | Odtwarzanie plikow WAV przez strumien HPI -- play/pause/stop, pozycjonowanie, timescaling |
| RDHPIRecordStream | rdhpirecordstream.h | QObject + RDWaveFile | Nagrywanie plikow WAV przez strumien HPI -- record/pause/stop, VOX |
| RDHPISoundSelector | rdhpisoundselector.h | Q3ListBox (Qt3Support widget) | Widget wyboru urzadzenia audio (karta/port) |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdhpiinformation.h | rdhpiinformation.cpp | Plain C++ kontener danych adaptera |
| 002 | rdhpisoundcard.h | rdhpisoundcard.cpp | Glowna klasa karty -- 881 linii .cpp |
| 003 | rdhpiplaystream.h | rdhpiplaystream.cpp | Playback stream -- 749 linii .cpp |
| 004 | rdhpirecordstream.h | rdhpirecordstream.cpp | Record stream -- 651 linii .cpp |
| 005 | rdhpisoundselector.h | rdhpisoundselector.cpp | Widget selektora -- 61 linii .cpp |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdhpiplaystream.cpp | Generowane przez Qt moc |
| moc_rdhpirecordstream.cpp | Generowane przez Qt moc |
| moc_rdhpisoundcard.cpp | Generowane przez Qt moc |
| moc_rdhpisoundselector.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
lib_LTLIBRARIES = librdhpi.la
dist_librdhpi_la_SOURCES = rdhpiinformation.cpp rdhpiinformation.h\
                           rdhpiplaystream.cpp rdhpiplaystream.h\
                           rdhpirecordstream.cpp rdhpirecordstream.h\
                           rdhpisoundcard.cpp rdhpisoundcard.h\
                           rdhpisoundselector.cpp rdhpisoundselector.h

nodist_librdhpi_la_SOURCES = moc_rdhpiplaystream.cpp\
                             moc_rdhpirecordstream.cpp\
                             moc_rdhpisoundcard.cpp\
                             moc_rdhpisoundselector.cpp

librdhpi_la_LDFLAGS = -release $(VERSION)
```

## Zaleznosci (z Makefile.am / headerow)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| librd (rdconfig.h, rdwavefile.h) | internal | tak |
| asihpi (hpi.h, hpi_version.h) | external (AudioScience HPI SDK) | tak |
| Qt4 Core (qobject, qstring, qtimer, qdatetime) | Qt framework | tak |
| Qt3Support (q3listbox via Q3ListBox) | Qt framework (legacy) | tak |

## Uwagi

- Projekt uzywa autotools (Makefile.am), nie CMake. Plik rdhpi.pro istnieje wylacznie dla i18n (lupdate/lrelease).
- Biblioteka jest cienka warstwa abstrakcji nad AudioScience HPI API (asihpi/hpi.h).
- RDHPIPlayStream i RDHPIRecordStream dziedzicza wielokrotnie: QObject + RDWaveFile.
- RDHPISoundSelector uzywa Qt3Support (Q3ListBox) -- wymaga migracji przy clone.
- Warunkowa kompilacja (HPI_VER) obsluguje rozne wersje HPI SDK.
