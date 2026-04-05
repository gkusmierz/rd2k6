---
phase: 1
artifact: SVC
artifact_name: rdservice
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdservice

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdservice/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | rdservice (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 4 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | ~873 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdservice.cpp | int main(argc, argv) | Punkt startowy procesu |
| QCoreApplication | rdservice.cpp | QCoreApplication a(argc,argv) | Inicjalizacja Qt (headless, bez GUI) |
| MainObject | rdservice.cpp | new MainObject() | Glowny obiekt daemona |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdservice.h | QObject | Jedyna klasa — zarzadza cyklem zycia wszystkich demonow Rivendell |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdservice.h | rdservice.cpp | MainObject — konstruktor, sloty (processFinishedData, checkMaintData, exitData), main() |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| startup.cpp | MainObject::Startup(), StartDropboxes(), KillProgram(), TargetCommandString() — sekwencyjny start demonow (caed, ripcd, rdcatchd, rdpadd, rdpadengined, rdvairplayd, rdrepld, rdrssd) + launch dropbox-ow |
| shutdown.cpp | MainObject::Shutdown(), ShutdownDropboxes() — graceful termination demonow w odwrotnej kolejnosci |
| maint_routines.cpp | MainObject::checkMaintData(), RunSystemMaintRoutine(), RunLocalMaintRoutine(), GetMaintInterval(), RunEphemeralProcess() — periodyczne uruchamianie rdmaint (local + system) |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdservice.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
sbin_PROGRAMS = rdservice

dist_rdservice_SOURCES = maint_routines.cpp\
                         rdservice.cpp rdservice.h\
                         shutdown.cpp\
                         startup.cpp

nodist_rdservice_SOURCES = moc_rdservice.cpp

rdservice_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external (audio codec) | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external (disc lookup) | tak |
| -lQt3Support | Qt3 compat | tak |

## Kluczowe obserwacje

1. **Supervisor pattern**: rdservice jest supervisorem procesow — uruchamia i nadzoruje wszystkie demony Rivendell (caed, ripcd, rdcatchd, rdpadd, rdpadengined, rdvairplayd, rdrepld, rdrssd).
2. **Dropbox launcher**: dynamicznie uruchamia instancje rdimport jako "dropbox" na podstawie konfiguracji z bazy danych (tabela DROPBOXES).
3. **Maintenance scheduler**: periodycznie uruchamia rdmaint (local + system) z randomizowanym interwalem.
4. **Signal handling**: SIGTERM/SIGINT = graceful shutdown, SIGUSR1 = reload dropboxow.
5. **Startup targets**: mozliwosc zatrzymania startu po konkretnym demonie (--end-startup-after-X) do celow diagnostycznych.
6. **Conditional start**: rdrepld startuje tylko jesli sa REPLICATORS dla tej stacji; rdrssd startuje tylko jesli ta stacja jest RSS_PROCESSOR_STATION.
7. **Headless**: QCoreApplication (bez GUI), daemon instalowany do sbin/.
8. **Proces management via RDProcess**: uzywa RDProcess z librd do zarzadzania procesami potomnymi (start/stop/monitoring).
