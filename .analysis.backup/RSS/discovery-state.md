---
phase: 1
artifact: RSS
artifact_name: rdrssd
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdrssd (RSS Processor Service)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdrssd/ |
| CMakeLists.txt | brak (autotools: rdrssd/Makefile.am) |
| Target autotools | rdrssd (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Linie kodu (est.) | 253 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdrssd.cpp:200 | int main(argv, argc) | Punkt startowy procesu |
| QCoreApplication | rdrssd.cpp:202 | QCoreApplication a(argv, argc) | Inicjalizacja Qt (headless, brak GUI) |
| MainObject | rdrssd.cpp:204 | new MainObject() | Główny obiekt demona |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdrssd.h | QObject | Jedyna klasa — RSS feed processor daemon; cyklicznie przetwarza feedy z bazy danych |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdrssd.h | rdrssd.cpp | MainObject + main() |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_rdrssd.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plików testowych dla tego artifaktu.

(Uwaga: testy RSS w apis/rivwebcapi/tests/ dotyczą Web C API, nie rdrssd.)

## Build Target Definition (autotools)

```makefile
sbin_PROGRAMS = rdrssd

dist_rdrssd_SOURCES = rdrssd.cpp rdrssd.h

nodist_rdrssd_SOURCES = moc_rdrssd.cpp

rdrssd_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zależności (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| -lQt3Support | Qt legacy compat | tak |

## Kluczowe zależności z librd (includes)

| Header | Opis |
|--------|------|
| rdapplication.h | Inicjalizacja aplikacji Rivendell (RDApplication) |
| rdescape_string.h | Escaping stringów SQL |
| rdfeed.h | Klasa RDFeed — reprezentacja feedu RSS |
| rdpodcast.h | Klasa RDPodcast — reprezentacja odcinka podcastu |

## Architektura (podsumowanie)

rdrssd to minimalny daemon (253 LOC, 1 klasa) pracujący w pętli timerowej:
1. Startuje z QCoreApplication (headless), inicjalizuje RDApplication
2. Zrzuca uprawnienia root (setuid/setgid) na użytkownika pypad
3. Łączy się z ripcd(8) via RPC
4. Co d_process_interval ms (domyślnie 30s) odpytuje tabelę FEEDS
5. Dla każdego feedu (nie-superfeed) sprawdza PODCASTS z przeterminowanym effective/expiration datetime
6. Usuwa wygasłe podcasty (audio + rekord DB) i repostuje XML feedu
7. Wysyła notyfikacje (FeedType, FeedItemType) przez ripcd
