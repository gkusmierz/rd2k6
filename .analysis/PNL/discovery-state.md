---
phase: 1
artifact: PNL
artifact_name: rdpanel
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdpanel

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdpanel/ |
| CMakeLists.txt | brak (autotools: rdpanel/Makefile.am) |
| Target autotools | rdpanel (bin_PROGRAMS) |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 2 |
| Pliki .cpp | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts (i18n) | 5 |
| Linie kodu (est.) | ~520 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdpanel.cpp:378 | int main(argc, argv) | Punkt startowy procesu |
| QApplication | rdpanel.cpp:381 | QApplication a(argc,argv) | Inicjalizacja Qt |
| RDWidget (glowne okno) | rdpanel.h:38 | MainWidget : RDWidget | Glowne okno (standalone cart wall) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdpanel.h | RDWidget (QWidget) | Glowne i jedyne okno aplikacji — dedicated cart wall utility |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdpanel.h | rdpanel.cpp | MainWidget + main() — cala logika aplikacji |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje globalnych zmiennych (RDAudioPort*, RDCartDialog*) |

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdpanel.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
bin_PROGRAMS = rdpanel

dist_rdpanel_SOURCES = globals.h\
                       rdpanel.cpp rdpanel.h

nodist_rdpanel_SOURCES = moc_rdpanel.cpp

rdpanel_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am target_link_libraries)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external (audio codec) | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external (disc lookup) | tak |
| -lQt3Support | Qt 3 compatibility | tak |

## Uwagi

rdpanel jest bardzo kompaktowa aplikacja — cala logika w jednym pliku .cpp (412 linii).
Sluzy jako standalone "cart wall" (panel przyciskow do odtwarzania audio).
Deleguje ciezka prace do komponentow bibliotecznych z librd:
- RDSoundPanel — grid przyciskow sound panelu (7 wierszy x 9 kolumn)
- RDStereoMeter — wskaznik poziomu audio
- RDEmptyCart — puste miejsce na cart (drag & drop)
- RDEventPlayer — odtwarzanie zdarzen/makr
- RDCartDialog — dialog wyboru cartow
- RDApplication (rda) — centralny obiekt aplikacji Rivendell

Obsluguje do 5 kanalow wyjsciowych audio (SoundPanel1-5Channel).
Odbiera RML (Rivendell Macro Language) przez RIPC.
Ustawia skorkowanie (skin) przez panel_skin_pixmap.
