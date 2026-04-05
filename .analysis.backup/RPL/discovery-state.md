---
phase: 1
artifact: RPL
artifact_name: rdrepld
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdrepld (Replication Daemon)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdrepld/ |
| CMakeLists.txt | brak (autotools: rdrepld/Makefile.am) |
| Target autotools | sbin_PROGRAMS = rdrepld |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 4 |
| Pliki .cpp | 4 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | ~1199 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdrepld.cpp:260 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdrepld.cpp:262 | QApplication a(argc,argv,false) | Inicjalizacja Qt (headless, false=no GUI) |
| MainObject | rdrepld.cpp:263 | new MainObject() | Glowny obiekt demona |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdrepld.h | QObject | Glowna klasa demona, timer-driven main loop, laduje replicatory i procesuje carty |

## Klasy plain C++ (bez Qt)

| Klasa | Plik .h | Bazowa | Opis |
|-------|---------|--------|------|
| ReplConfig | replconfig.h | (brak) | Kontener konfiguracji replikatora (format, URL, credentials, normalizacja) |
| ReplFactory | replfactory.h | (brak) | Abstrakcyjna baza (virtual) dla metod replikacji — strategy pattern |
| CitadelXds | citadelxds.h | ReplFactory | Implementacja replikatora dla portalu Citadel XDS |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdrepld.h | rdrepld.cpp | MainObject (QObject), main(), signal handlers |
| 002 | replconfig.h | replconfig.cpp | ReplConfig — kontener konfiguracji (POD-like, gettery/settery) |
| 003 | replfactory.h | replfactory.cpp | ReplFactory — abstrakcyjna baza, virtual startProcess/processCart |
| 004 | citadelxds.h | citadelxds.cpp | CitadelXds — konkretna implementacja: ISCI xreference, upload, purge |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdrepld.cpp | Generowane przez Qt moc (nodist_rdrepld_SOURCES) |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition (autotools)

```makefile
sbin_PROGRAMS = rdrepld
dist_rdrepld_SOURCES = rdrepld.cpp rdrepld.h \
                       replconfig.cpp replconfig.h\
                       replfactory.cpp replfactory.h\
                       citadelxds.cpp citadelxds.h
nodist_rdrepld_SOURCES = moc_rdrepld.cpp
rdrepld_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal | librd (rdapplication, rdcart, rdcut, rddb, rdupload, rdaudioconvert, rddelete, ...) |
| @QT4_LIBS@ | Qt framework | Qt 4 core/gui |
| -lQt3Support | Qt framework | Qt3Support (Q3Url uzywane w citadelxds.cpp) |
| @LIBVORBIS@ | external | Vorbis audio codec (via rdaudioconvert) |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz lookup |

## Architektura (notatki)

- **Timer-driven daemon**: MainObject uruchamia QTimer co 10s (RD_RDREPL_SCAN_INTERVAL), w mainLoop() laduje replicatory z DB, procesuje carty, zwalnia replicatory.
- **Strategy pattern**: ReplFactory to abstrakcyjna baza z virtual startProcess()/processCart(). Jedyna implementacja: CitadelXds.
- **Citadel XDS flow**: Laduje ISCI cross-reference file (CSV) do tabeli DB ISCI_XREFERENCE, konwertuje audio (RDAudioConvert), uploaduje (RDUpload) na skonfigurowany URL, purge'uje obsolete pliki (RDDelete).
- **Headless**: QApplication z false (brak GUI), instaluje signal handlers (SIGINT/SIGTERM/SIGCHLD), zapisuje PID file.
- **Opcja -d**: Tryb debug (foreground, bez daemonizacji).
