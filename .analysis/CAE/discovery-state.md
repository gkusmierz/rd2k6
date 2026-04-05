---
phase: 1
artifact: CAE
artifact_name: caed (Core Audio Engine daemon)
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: caed (Core Audio Engine)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | cae/ |
| CMakeLists.txt | brak (autotools: cae/Makefile.am) |
| Target autotools | sbin_PROGRAMS = caed |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 2 |
| Pliki .cpp | 5 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Linie kodu (est.) | ~7 050 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | cae/cae.cpp:2186 | int main(int argc, char *argv[]) | Punkt startowy procesu caed |
| QCoreApplication | cae/cae.cpp:2189 | QCoreApplication a(argc,argv,false) | Inicjalizacja Qt (headless, bez GUI) |
| MainObject | cae/cae.cpp:2190 | new MainObject(NULL,"main") | Glowny obiekt daemona, dziedziczy QObject |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | cae/cae.h | QObject | Glowna klasa daemona — dispatchuje komendy do driverow audio (HPI/JACK/ALSA), zarzadza playback/record/metering |
| CaeServer | cae/cae_server.h | QObject (Q_OBJECT) | Serwer TCP przyjmujacy polaczenia klientow, parsuje protokol tekstowy, emituje sygnaly z requestami |
| CaeServerConnection | cae/cae_server.h | brak (plain C++) | Value object — stan polaczenia TCP (socket, autentykacja, akumulator komend, meter port) |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | cae/cae.h | cae/cae.cpp | MainObject — glowna logika daemona, dispatching do driverow, metering, obsluga komend |
| 002 | cae/cae_server.h | cae/cae_server.cpp | CaeServer + CaeServerConnection — serwer TCP z protokolem tekstowym |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| cae/cae_alsa.cpp | ALSA driver — implementacja metod MainObject::alsa*() (~1734 LOC) |
| cae/cae_hpi.cpp | AudioScience HPI driver — implementacja metod MainObject::hpi*() (~456 LOC) |
| cae/cae_jack.cpp | JACK driver — implementacja metod MainObject::jack*() (~1546 LOC) |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_cae.cpp | Generowane przez Qt moc (zrodlo: cae.h) |
| moc_cae_server.cpp | Generowane przez Qt moc (zrodlo: cae_server.h) |

## Pliki testowe

Brak plikow testowych dla tego artifaktu. Przeszukano katalog tests/ — brak referencji do cae/caed.

## Build Target Definition (Makefile.am)

```makefile
sbin_PROGRAMS = caed

dist_caed_SOURCES = cae.cpp cae.h\
                    cae_alsa.cpp\
                    cae_hpi.cpp\
                    cae_jack.cpp\
                    cae_server.cpp cae_server.h

nodist_caed_SOURCES = moc_cae.cpp\
                      moc_cae_server.cpp

caed_LDADD = @LIB_RDLIBS@\
             @LIBALSA@\
             @LIBHPI@\
             @LIBJACK@\
             @LIBSRC@\
             @LIBVORBIS@\
             @QT4_LIBS@\
             @MUSICBRAINZ_LIBS@\
             -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal (librd) | Glowna biblioteka Rivendell |
| @LIBHPI@ | internal (librdhpi) | AudioScience HPI abstraction |
| @LIBALSA@ | external | ALSA sound library |
| @LIBJACK@ | external | JACK Audio Connection Kit |
| @LIBSRC@ | external | libsamplerate — konwersja sample rate |
| @LIBVORBIS@ | external | Ogg Vorbis codec |
| @QT4_LIBS@ | Qt framework | Qt 4 core libraries |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz lookup |
| -lQt3Support | Qt framework | Qt3 compatibility layer |

## Architektura (notatki)

CAE (caed) to headless daemon audio engine. Kluczowe obserwacje:

1. **Protokol tekstowy przez TCP** — CaeServer nasluchuje na porcie TCP, klienci lacz sie i wysylaja komendy tekstowe zakonczne '!'. Komendy: PW (auth), LP (load playback), PY (play), SP (stop), LR (load recording), RD (record), SR (stop record), IV/OV/FV (volume), IL/OL (level), IM/OM (mode), IX (vox), IT (input type), IS (input status), AL (passthrough), CS (clock source), OS (output status flag), ME (meter enable), DC (disconnect).

2. **Trzy pluggowalne drivery audio** — HPI (AudioScience hardware), JACK (pro audio server), ALSA (Linux native). Kazdy driver implementuje identyczny zestaw metod (load/unload/play/stop/record, volume/level/mode, meters, passthrough). Kompilacja warunkowa przez #ifdef HPI/JACK/ALSA.

3. **Metering przez UDP** — meter updates wysylane sa datagramami UDP do polaczonych klientow.

4. **Kodeki audio** — TwoLAME (MP2 encoding) i MAD (MP3 decoding) ladowane dynamicznie (dlopen). SoundTouch do timescalingu.

5. **Brak GUI** — uzywa QCoreApplication, nie QApplication. Czysty daemon.
