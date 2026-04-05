---
phase: 1
artifact: IMP
artifact_name: importers
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: importers

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | importers/ |
| CMakeLists.txt | brak (autotools: importers/Makefile.am) |
| Target build | 6 bin_PROGRAMS: nexgen_filter, panel_copy, rdcatch_copy, rivendell_filter, sas_filter, wings_filter |
| Typ | tool (6 niezaleznych narzedzi CLI + 1 skrypt bash) |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 6 |
| Pliki .cpp | 6 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki skryptowe | 1 (export_slax, bash) |
| Linie kodu (est.) | ~2536 (C++), ~2608 z export_slax |

## Entry Points

Kazdy z 6 programow ma wlasna funkcje main() i wlasna klase MainObject.

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | nexgen_filter.cpp | int main(argc, argv) | QApplication + MainObject, import z Prophet NexGen |
| main() | rivendell_filter.cpp | int main(argc, argv) | QApplication + MainObject, import z zewnetrznego Rivendella |
| main() | sas_filter.cpp | int main(argc, argv) | QApplication + MainObject, import zdarzen SAS64000 |
| main() | wings_filter.cpp | int main(argc, argv) | QApplication + MainObject, import z Crown/Airforce Wings |
| main() | panel_copy.cpp | int main(argc, argv) | QApplication + MainObject, kopiowanie przypisan SoundPanel |
| main() | rdcatch_copy.cpp | int main(argc, argv) | QApplication + MainObject, kopiowanie zdarzen RDCatch |
| bash | export_slax | n/a | Eksport archiwum Rivendell jako modul SLAX (bash script) |

## Klasy Qt (identyfikowane)

Kazdy program definiuje klase `MainObject : public QObject` z `Q_OBJECT`. Nie ma GUI (QMainWindow/QDialog) -- wszystkie sa narzediami CLI headless. Uzywaja QApplication w trybie non-GUI (`QApplication(argc,argv,false)`).

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | nexgen_filter.h | QObject | Import z NexGen: XML/PKT metadata + audio do biblioteki Rivendell |
| MainObject | rivendell_filter.h | QObject | Import cartow z zewnetrznej bazy Rivendell (MySQL-to-MySQL + audio copy) |
| MainObject | sas_filter.h | QObject | Import/usuwanie zdarzen RDCatch z pliku SAS64000 |
| MainObject | wings_filter.h | QObject | Import z bazy Crown Wings: odczyt pliku DB + audio ATX |
| MainObject | panel_copy.h | QObject | Kopiowanie przypisan SoundPanel miedzy bazami MySQL |
| MainObject | rdcatch_copy.h | QObject | Kopiowanie zdarzen RECORDINGS miedzy hostami Rivendell |

Dodatkowa struktura: `WingsRecord` (plain C struct) w wings_filter.h -- rekord z bazy Wings.

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | nexgen_filter.h | nexgen_filter.cpp | Importer NexGen (XML/PKT), 69+687 = 756 LOC |
| 002 | rivendell_filter.h | rivendell_filter.cpp | Importer z Rivendella, 40+453 = 493 LOC |
| 003 | sas_filter.h | sas_filter.cpp | Importer SAS64000, 48+245 = 293 LOC |
| 004 | wings_filter.h | wings_filter.cpp | Importer Wings, 60+296 = 356 LOC |
| 005 | panel_copy.h | panel_copy.cpp | Kopiowanie paneli, 45+209 = 254 LOC |
| 006 | rdcatch_copy.h | rdcatch_copy.cpp | Kopiowanie zdarzen RDCatch, 50+334 = 384 LOC |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Inne pliki

| Plik | Typ | Zawartość |
|------|-----|-----------|
| export_slax | bash script | Eksport archiwum MySQL + audio jako modul SLAX/tgz |
| Makefile.am | autotools | Definicja 6 targetow bin_PROGRAMS |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_nexgen_filter.cpp | Generowane przez Qt moc |
| moc_rivendell_filter.cpp | Generowane przez Qt moc |
| moc_sas_filter.cpp | Generowane przez Qt moc |
| moc_wings_filter.cpp | Generowane przez Qt moc |
| moc_panel_copy.cpp | Generowane przez Qt moc |
| moc_rdcatch_copy.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dedykowanych temu artefaktowi. W tests/ istnieje audio_import_test.cpp ale dotyczy ogolnej funkcjonalnosci importu audio (rdimport), nie tych konkretnych narzedzi.

## Build Target Definition (autotools)

```makefile
bin_PROGRAMS = nexgen_filter\
               panel_copy\
               rdcatch_copy\
               rivendell_filter\
               sas_filter\
               wings_filter

# Kazdy target linkuje: @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
# Kazdy target ma: dist_*_SOURCES (plik .cpp + .h) + nodist_*_SOURCES (moc_*.cpp)
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ (librd) | internal | Glowna biblioteka Rivendell |
| @QT4_LIBS@ | Qt framework | Qt4 core/widgets |
| -lQt3Support | Qt framework | Qt3 compatibility layer |
| @LIBVORBIS@ | external | Ogg Vorbis codec |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz metadata lookup |

## Wzorce architektoniczne

1. **Wzorzec CLI-as-constructor**: Kazdy program wykonuje cala logike w konstruktorze MainObject, konczy `exit(0)`. QApplication event loop nigdy nie jest realnie uzywany.
2. **Wzorzec importer/filter**: 4 programy (nexgen_filter, rivendell_filter, sas_filter, wings_filter) importuja dane z obcych systemow radio-automatyki.
3. **Wzorzec copier**: 2 programy (panel_copy, rdcatch_copy) kopiuja dane miedzy instancjami Rivendell (MySQL-to-MySQL).
4. **Brak GUI**: Wszystkie 6 programow sa headless CLI, QApplication jest uzywany w trybie false (non-GUI).
5. **RDApplication vs raw RDConfig**: nexgen_filter, sas_filter i wings_filter uzywaja nowszego `RDApplication`. rivendell_filter, panel_copy i rdcatch_copy uzywaja bezposrednio `RDConfig` + `RDCmdSwitch`.
6. **Zewnetrzne systemy**: Prophet NexGen (XML/PKT), Crown/Airforce Wings (binary DB + ATX audio), SAS64000 (fixed-width text), Rivendell (MySQL).
