---
phase: 1
artifact: VAP
artifact_name: rdvairplayd
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdvairplayd

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdvairplayd/ |
| CMakeLists.txt | brak (autotools: rdvairplayd/Makefile.am) |
| Target autotools | rdvairplayd (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 2 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | 1011 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdvairplayd.cpp:341 | int main(argc, argv) | Punkt startowy procesu |
| QApplication | rdvairplayd.cpp:343 | QApplication a(argc,argv,false) | Inicjalizacja Qt (headless, false = no GUI) |
| MainObject | rdvairplayd.cpp:53 | MainObject::MainObject(QObject*) | Glowny obiekt daemona |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdvairplayd.h | QObject | Headless log player daemon -- odpowiednik rdairplay bez GUI, sterowany RML |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdvairplayd.h | rdvairplayd.cpp | Klasa MainObject + main() + konstruktor + sloty + exit/signal handling |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| local_macros.cpp | Implementacja rmlReceivedData() -- dispatcher komend RML (LL/AL/MN/PL/PM/PN/PS/MD/PX/RL/SN) + helper LogMachineIndex() |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdvairplayd.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

(Uwaga: tests/db_charset_test.cpp uzywa stringa "rdvairplayd" jako nazwy aplikacji RDApplication, ale nie jest testem tego daemona.)

## Build Target Definition (autotools)

```makefile
sbin_PROGRAMS = rdvairplayd

dist_rdvairplayd_SOURCES = local_macros.cpp\
                          rdvairplayd.cpp rdvairplayd.h

nodist_rdvairplayd_SOURCES = moc_rdvairplayd.cpp

rdvairplayd_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @LIBVORBIS@ | external | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| -lQt3Support | Qt3 compat | tak |

## Notatki architektoniczne

- rdvairplayd to "virtual airplay daemon" -- headless odpowiednik rdairplay (AIR).
- Uzywa QApplication z parametrem `false` (no GUI) -- czysty daemon.
- Obsluguje do 20 wirtualnych log machines (RD_RDVAIRPLAY_LOG_QUAN=20) z bazowym indeksem 100 (RD_RDVAIRPLAY_LOG_BASE).
- Sterowany wylacznie przez komendy RML (Rivendell Macro Language) odbierane przez RIPC (ripcd connection).
- Obslugiwane komendy RML: LL (Load Log), AL (Append Log), MN (Make Next), PL (Start), PM (Set Mode), PN (Start Next), PS (Stop), MD (Duck Machine), PX (Add Next), RL (Refresh Log), SN (Set Now/Next Cart).
- Tryby pracy: Auto, LiveAssist, Manual (identyczne jak w rdairplay).
- Graceful shutdown przez SIGINT/SIGTERM z zapisem ExitClean.
- Bardzo maly artifact -- 1 klasa, 3 pliki, ~1000 LOC.
