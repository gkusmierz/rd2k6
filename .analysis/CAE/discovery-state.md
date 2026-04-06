---
phase: 1
artifact: CAE
artifact_name: caed (Core Audio Engine)
status: done
completed_at: 2026-04-06
agent_version: 1.1.0
---

# Discovery State: caed (Core Audio Engine)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | cae/ |
| CMakeLists.txt | brak (autotools: cae/Makefile.am) |
| Target | caed (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 2 |
| Pliki .cpp | 5 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Linie kodu (est.) | ~7 423 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | cae/cae.cpp:2186 | int main(int argc, char *argv[]) | Punkt startowy procesu caed |
| QCoreApplication | cae/cae.cpp:2189 | QCoreApplication a(argc,argv,false) | Inicjalizacja Qt (headless daemon) |
| MainObject | cae/cae.cpp:2190 | new MainObject(NULL,"main") | Glowny obiekt daemona |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | cae/cae.h | QObject | Glowna klasa daemona CAE - zarzadza audio drivers (ALSA/JACK/HPI), obsluguje komendy TCP, metering |
| CaeServer | cae/cae_server.h | QObject | Serwer TCP przyjmujacy polaczenia od klientow (rdairplay, rdlibrary, etc.) |
| CaeServerConnection | cae/cae_server.h | plain C++ (non-Qt) | Struktura danych polaczenia klienta (socket, auth, meter config) |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | cae/cae.h | cae/cae.cpp | MainObject - glowna logika daemona + main() |
| 002 | cae/cae_server.h | cae/cae_server.cpp | CaeServer + CaeServerConnection - warstwa TCP |

### Pliki tylko .h (bez .cpp)

brak

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| cae/cae_alsa.cpp | Implementacja ALSA driver (~1896 LOC) - metody MainObject::alsa*() |
| cae/cae_hpi.cpp | Implementacja HPI driver (~527 LOC) - metody MainObject::hpi*() |
| cae/cae_jack.cpp | Implementacja JACK driver (~1690 LOC) - metody MainObject::jack*() |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_cae.cpp | Generowane przez Qt moc |
| moc_cae_server.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition

```makefile
# cae/Makefile.am
sbin_PROGRAMS = caed

dist_caed_SOURCES = cae.cpp cae.h\
                    cae_alsa.cpp\
                    cae_hpi.cpp\
                    cae_jack.cpp\
                    cae_server.cpp cae_server.h

nodist_caed_SOURCES = moc_cae.cpp\
                      moc_cae_server.cpp
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ | internal (librd) | Biblioteka wspoldzielona Rivendell |
| @LIBALSA@ | external | ALSA audio library |
| @LIBHPI@ | external | AudioScience HPI library |
| @LIBJACK@ | external | JACK Audio Connection Kit |
| @LIBSRC@ | external | libsamplerate |
| @LIBVORBIS@ | external | Ogg Vorbis codec |
| @QT4_LIBS@ | Qt framework | Qt4 libraries |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz metadata |
| Qt3Support | Qt compat | Qt3 compatibility layer |

## Architektura (wstepna)

CAE (caed) to headless daemon dzialajacy jako serwer TCP. Klienci (rdairplay, rdlibrary, etc.)
laczaca sie i wysylaja komendy sterujace audio (play, record, volume, metering).

MainObject jest monolityczna klasa (~130 metod) zawierajaca:
- **Warstwa komend TCP**: metody *Data() (np. playData, recordData) obslugujace komendy klientow
- **Driver ALSA**: metody alsa*() w cae_alsa.cpp (~1896 LOC)
- **Driver JACK**: metody jack*() w cae_jack.cpp (~1690 LOC)
- **Driver HPI**: metody hpi*() w cae_hpi.cpp (~527 LOC)
- **Metering**: metody Send*Update() do wysylania poziomow audio do klientow
- **Provisioning**: InitProvisioning(), InitMixers()

CaeServer obsluguje wieloklientowy TCP (QTcpServer) z mapowaniem sygnaly/sloty per polaczenie.
