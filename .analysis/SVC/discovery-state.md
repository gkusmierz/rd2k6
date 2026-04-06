---
phase: 1
artifact: SVC
artifact_name: rdservice (Service Manager daemon)
status: done
completed_at: 2026-04-06
agent_version: 1.1.0
---

# Discovery State: rdservice (Service Manager daemon)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdservice/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | sbin_PROGRAMS = rdservice |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 4 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Linie kodu (est.) | ~869 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdservice/rdservice.cpp | int main(int argc, char *argv[]) | Punkt startowy procesu (linia 205) |
| QCoreApplication | rdservice/rdservice.cpp | QCoreApplication a(argc,argv) | Inicjalizacja Qt (headless, brak GUI) |
| MainObject | rdservice/rdservice.h | MainObject : QObject | Główny obiekt logiki daemon |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdservice.h | QObject | Jedyna klasa — zarządza cyklem życia usług Rivendell (startup, shutdown, maintenance) |

## Enum (wewnętrzny)

| Enum | Klasa | Wartości |
|------|-------|---------|
| StartupTarget | MainObject | Enum definiujący cel uruchomienia |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdservice.h | rdservice.cpp | Klasa MainObject + main() |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

| Source | Zawartość |
|--------|-----------|
| maint_routines.cpp | Rutyny utrzymania systemu (RunSystemMaintRoutine, RunLocalMaintRoutine, GetMaintInterval) |
| shutdown.cpp | Logika zamykania (Shutdown, ShutdownDropboxes, KillProgram) |
| startup.cpp | Logika uruchamiania usług (Startup, StartDropboxes, RunEphemeralProcess) |

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_rdservice.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plików testowych dla tego artifaktu.

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

## Zależności (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| -lQt3Support | Qt3 compat | tak |

## Struktura MainObject — metody

| Metoda | Typ | Opis |
|--------|-----|------|
| MainObject() | constructor | Inicjalizacja daemon |
| checkMaintData() | slot/method | Sprawdzanie danych utrzymania |
| exitData() | slot/method | Obsługa zakończenia |
| Startup() | method | Uruchamianie usług |
| StartDropboxes() | method | Uruchamianie dropboxów |
| KillProgram() | method | Zabijanie procesu |
| Shutdown() | method | Zamykanie usług |
| ShutdownDropboxes() | method | Zamykanie dropboxów |
| RunSystemMaintRoutine() | method | Rutyna utrzymania systemu |
| RunLocalMaintRoutine() | method | Rutyna utrzymania lokalnego |
| GetMaintInterval() | method | Pobieranie interwału utrzymania |
| RunEphemeralProcess() | method | Uruchamianie procesów efemerycznych |
| TargetCommandString() | method | Konwersja target na string |

## Pola MainObject

| Pole | Typ (estimated) | Opis |
|------|-----------------|------|
| svc_processes | container | Lista zarządzanych procesów |
| svc_maint_timer | QTimer* | Timer rutyny utrzymania |
| svc_exit_timer | QTimer* | Timer zamykania |
| svc_startup_target | StartupTarget | Cel uruchomienia |
| svc_force_system_maintenance | bool | Flaga wymuszenia utrzymania |
