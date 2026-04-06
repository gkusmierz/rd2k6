---
phase: 1
artifact: HPI
artifact_name: librdhpi
status: done
completed_at: 2026-04-06
agent_version: 1.1.0
---

# Discovery State: librdhpi

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdhpi/ |
| CMakeLists.txt | brak (autotools: rdhpi/Makefile.am) |
| Target autotools | lib_LTLIBRARIES = librdhpi.la |
| Typ | library |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 5 |
| Pliki .cpp | 5 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~3480 |

## Entry Points

Biblioteka — brak main(). Jest biblioteką współdzieloną (.so) linkowaną warunkowo (ifdef HPI) przez CAE i RPC.

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDHPISoundCard | rdhpisoundcard.h | QObject | Zarządzanie kartami dźwiękowymi AudioScience HPI — enumeracja, sterowanie mikserami, metering, routing |
| RDHPIPlayStream | rdhpiplaystream.h | QObject + RDWaveFile | Odtwarzanie plików WAV przez HPI — play/pause/stop, pozycjonowanie, kontrola prędkości |
| RDHPIRecordStream | rdhpirecordstream.h | QObject + RDWaveFile | Nagrywanie audio przez HPI — record/pause/stop, VOX, monitorowanie pozycji |
| RDHPISoundSelector | rdhpisoundselector.h | Q3ListBox | Widget UI do wyboru karty dźwiękowej i portu HPI |
| RDHPIInformation | rdhpiinformation.h | plain C++ | Value object z informacjami o karcie HPI (serial, wersje firmware/DSP/PCB) |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdhpisoundcard.h | rdhpisoundcard.cpp | Główna klasa — zarządzanie kartami HPI, mixer controls |
| 002 | rdhpiplaystream.h | rdhpiplaystream.cpp | Stream playback przez HPI |
| 003 | rdhpirecordstream.h | rdhpirecordstream.cpp | Stream recording przez HPI |
| 004 | rdhpisoundselector.h | rdhpisoundselector.cpp | UI widget do wyboru karty/portu |
| 005 | rdhpiinformation.h | rdhpiinformation.cpp | Value object — info o karcie |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_rdhpiplaystream.cpp | Generowane przez Qt moc |
| moc_rdhpirecordstream.cpp | Generowane przez Qt moc |
| moc_rdhpisoundcard.cpp | Generowane przez Qt moc |
| moc_rdhpisoundselector.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plików testowych dla tego artifaktu.

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

## Zależności

| Biblioteka | Typ | Uwagi |
|------------|-----|-------|
| asihpi/hpi.h | external (AudioScience HPI SDK) | Niskopoziomowe API sprzętowe |
| asihpi/hpi_version.h | external (AudioScience HPI SDK) | Wersjonowanie API |
| librd (rdwavefile.h) | internal | RDWaveFile — bazowa klasa pliku WAV |
| Qt4 (QtCore, Qt3Support) | framework | QObject, QTimer, Q3ListBox |

## Warunkowa kompilacja

Biblioteka jest kompilowana warunkowo — `configure.ac` sprawdza obecność HPI SDK:
- Jeśli HPI SDK obecne: `LIBHPI="-lrdhpi -lhpi"`, instalowane pliki .so/.a/.la
- Jeśli brak: `LIBHPI=""`, biblioteka nie jest budowana
- Konsumenci (CAE, RPC) używają `#ifdef HPI` do warunkowego includowania nagłówków

## Konsumenci (kto linkuje librdhpi)

| Artifact | Plik | Użycie |
|----------|------|--------|
| CAE | cae/cae.h | `#ifdef HPI` — RDHPISoundCard, RDHPIPlayStream, RDHPIRecordStream |
| RPC | ripcd/ | `#ifdef HPI` — driver HPI dla switcher/GPIO |
| Aplikacje | rdairplay, rdlibrary, ... | Pośrednio przez librd (include rdhpisoundcard.h w wielu main.cpp) |
