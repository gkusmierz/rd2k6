---
phase: 1
artifact: CST
artifact_name: rdcartslots
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdcartslots

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdcartslots/ |
| CMakeLists.txt | brak (autotools: Makefile.am) |
| Target autotools | rdcartslots (bin_PROGRAMS) |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 2 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts | 6 (de, es, fr, nb, nn, pt_BR) |
| Linie kodu (est.) | 516 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdcartslots.cpp:214 | int main(argc, argv) | Punkt startowy procesu |
| QApplication | rdcartslots.cpp:217 | QApplication a(argc, argv) | Inicjalizacja Qt |
| RDWidget | rdcartslots.h:34 | MainWidget : RDWidget | Glowne okno (nie QMainWindow, dziedziczy z RDWidget) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdcartslots.h | RDWidget (Q_OBJECT) | Glowny widget aplikacji, zarzadza siatka cart slotow |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdcartslots.h | rdcartslots.cpp | MainWidget + main(), konstruktor, sloty, events |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| local_macros.cpp | Implementacja MainWidget::RunLocalMacros() — obsluga komend RML (DL/DP/DS/DX) |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdcartslots.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
bin_PROGRAMS = rdcartslots

dist_rdcartslots_SOURCES = local_macros.cpp\
                           rdcartslots.cpp rdcartslots.h

nodist_rdcartslots_SOURCES = moc_rdcartslots.cpp

rdcartslots_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| Qt3Support | Qt compat | tak |

## Obserwacje

- Bardzo mala aplikacja (516 LOC, 1 klasa MainWidget).
- Nie uzywa QMainWindow — MainWidget dziedziczy z RDWidget (wrapper Rivendell).
- Dynamicznie tworzy siatke RDCartSlot widgetow (kolumny x wiersze z konfiguracji stacji).
- Obsluguje 4 komendy RML: DL (load cart), DP (play), DS (stop), DX (breakaway).
- Korzysta z dialogow z librd: RDCartDialog, RDSlotDialog, RDCueEditDialog, RDListSvcs.
- UI budowane calkowicie programowo (brak .ui).
- Komunikacja przez CAE (audio) i RIPC (RML/user).
