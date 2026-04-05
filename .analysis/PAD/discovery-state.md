---
phase: 1
artifact: PAD
artifact_name: rdpadengined
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdpadengined

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdpadengined/ |
| CMakeLists.txt | brak (autotools: rdpadengined/Makefile.am) |
| Target autotools | rdpadengined (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | 370 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdpadengined.cpp:305 | int main(argc, argv) | Punkt startowy procesu |
| QCoreApplication | rdpadengined.cpp:307 | QCoreApplication a(argc,argv) | Inicjalizacja Qt (headless, bez GUI) |
| MainObject | rdpadengined.cpp:309 | new MainObject() | Glowny obiekt daemona |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdpadengined.h | QObject | PAD Consolidation Server - zarzadza instancjami skryptow PyPAD |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdpadengined.h | rdpadengined.cpp | Jedyna klasa (MainObject) + main() + SigHandler |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdpadengined.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
sbin_PROGRAMS = rdpadengined

dist_rdpadengined_SOURCES = rdpadengined.cpp rdpadengined.h

nodist_rdpadengined_SOURCES = moc_rdpadengined.cpp

rdpadengined_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| Qt3Support | Qt compat | tak |

## Architektura (notatki dla Fazy 2)

- Bardzo maly daemon (370 LOC, 1 klasa).
- MainObject laczy sie z ripcd (RIPCD_TCP_PORT) i nasluchuje notyfikacji RDNotification::PypadType.
- Zarzadza cyklem zycia skryptow PyPAD: start/stop/restart na podstawie tabeli DB PYPAD_INSTANCES.
- Skrypty uruchamiane przez RDProcess z argumentami: script_path, localhost, RD_PAD_CLIENT_TCP_PORT, $id.
- Obsluguje sygnaly SIGINT/SIGTERM do graceful shutdown.
- Zrzuca uprawnienia root (setuid/setgid) na pypadUid/pypadGid z konfiguracji.
- Sloty: ripcConnectedData, notificationReceivedData, instanceStartedData, instanceFinishedData, exitData.
- Metody prywatne: ScriptIsActive, StartScript, KillScript, SetRunStatus.
