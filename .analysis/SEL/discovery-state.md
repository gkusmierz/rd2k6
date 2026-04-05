---
phase: 1
artifact: SEL
artifact_name: rdselect
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdselect

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdselect/ |
| CMakeLists.txt | brak (autotools: rdselect/Makefile.am) |
| Target autotools | rdselect (bin_PROGRAMS) |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts | 7 (cs, de, es, fr, nb, nn, pt_BR) |
| Linie kodu (est.) | ~385 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdselect.cpp:280 | int main(argc, argv) | Punkt startowy procesu |
| QApplication | rdselect.cpp:283 | QApplication a(argc,argv) | Inicjalizacja Qt |
| MainWidget | rdselect.cpp:313 | MainWidget *w=new MainWidget(config) | Glowne okno (RDWidget) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdselect.h | RDWidget (QWidget) | Okno selektora systemu — pozwala wybrac konfiguracje Rivendell |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdselect.h | rdselect.cpp | Jedyna para; zawiera MainWidget + main() |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak (main() jest w rdselect.cpp razem z klasa MainWidget).

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdselect.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition (autotools)

```makefile
bin_PROGRAMS = rdselect

dist_rdselect_SOURCES = rdselect.cpp rdselect.h

nodist_rdselect_SOURCES = moc_rdselect.cpp

rdselect_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am / LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @QT4_LIBS@ | Qt framework (Qt4) | tak |
| -lQt3Support | Qt3Support (kompatybilnosc) | tak |
| @LIBVORBIS@ | external (audio codec) | tak |
| @MUSICBRAINZ_LIBS@ | external (disc lookup) | tak |

## Uwagi dodatkowe

- Bardzo maly artefakt: 1 klasa, 1 para plikow, ~385 LOC.
- MainWidget dziedziczy z RDWidget (librd), nie z QMainWindow.
- Uzywa Q3ListBox (Qt3Support) do wyswietlania listy konfiguracji.
- Przy wyborze konfiguracji deleguje do zewnetrznego procesu `rdselect_helper` (artefakt UTL/utils).
- Wczytuje pliki .conf z katalogu RD_DEFAULT_RDSELECT_DIR i tworzy obiekty RDConfig.
- Waliduje baze danych (RDDbValid) i audio store (RDAudioStoreValid) dla aktywnej konfiguracji.
- Pozycjonowanie okna zalezy od RDMonitorConfig (pozycja na ekranie).
- Instaluje plik rd.audiostore.autofs do /etc/auto.master.d/ (automount).
