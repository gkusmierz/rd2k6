---
phase: 1
artifact: CTD
artifact_name: rdcatchd
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdcatchd

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdcatchd/ |
| CMakeLists.txt | brak (autotools: rdcatchd/Makefile.am) |
| Target autotools | rdcatchd (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 3 |
| Pliki .cpp | 5 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | ~4840 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdcatchd.cpp:2677 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | rdcatchd.cpp:2679 | QApplication a(argc,argv,false) | Inicjalizacja Qt (headless, false=no GUI) |
| MainObject | rdcatchd.cpp:2680 | new MainObject() | Glowny obiekt daemon |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdcatchd.h | QObject | Glowny obiekt daemon — obsluga zdarzen catch (nagrywanie, odtwarzanie, makra, upload/download, switche), komunikacja TCP, zarzadzanie deckami |
| EventPlayer | event_player.h | QObject | Odtwarzacz zdarzen dla deckow — emituje runCart() w odpowiednich momentach czasowych |
| ServerConnection | rdcatchd.h | plain C++ (nie-Qt) | Kontener polaczenia TCP klienta (socket, autentykacja, metering) |
| CatchEvent | catch_event.h | plain C++ (nie-Qt) | Kontener danych zdarzenia catch (typ, harmonogram, parametry nagrywania/pobierania/uploadu) |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdcatchd.h | rdcatchd.cpp | MainObject + ServerConnection, glowna logika daemon (~2683 + 268 linii) |
| 002 | catch_event.h | catch_event.cpp | CatchEvent — kontener danych zdarzenia (~725 + 201 linii) |
| 003 | event_player.h | event_player.cpp | EventPlayer — odtwarzacz zdarzen deckowych (~123 + 60 linii) |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| batch.cpp | RunBatch, RunImport, RunDownload, RunUpload — tryb wsadowy (import/export audio, pobieranie/wysylanie plikow) (~541 linii) |
| local_macros.cpp | RunLocalMacros — obsluga lokalnych makr RML (RE, RN, RS, RL, RB, RI) (~240 linii) |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdcatchd.cpp | Generowane przez Qt moc |
| moc_event_player.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
sbin_PROGRAMS = rdcatchd

dist_rdcatchd_SOURCES = batch.cpp\
                        catch_event.cpp catch_event.h\
                        event_player.cpp event_player.h\
                        local_macros.cpp\
                        rdcatchd.cpp rdcatchd.h

nodist_rdcatchd_SOURCES = moc_event_player.cpp\
                          moc_rdcatchd.cpp

rdcatchd_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD + includes)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ (librd) | internal | Glowna biblioteka Rivendell (rdcae, rdconfig, rdcatch_connect, rdmacro_event, rdtimeengine, etc.) |
| @LIBVORBIS@ | external | Kodek Ogg Vorbis |
| @QT4_LIBS@ | Qt framework | Qt 4 |
| @MUSICBRAINZ_LIBS@ | external | Lookup metadanych muzycznych |
| -lQt3Support | Qt framework | Warstwa kompatybilnosci Qt3 |

## Architektura (streszczenie)

rdcatchd to daemon (netcatcher) dzialajacy bez GUI (QApplication z false).
Obsluguje zdarzenia zaplanowane w harmonogramie: nagrywanie audio, odtwarzanie,
wykonywanie makr RML, przelaczanie switch/router, pobieranie plikow (download)
i wysylanie plikow (upload). Komunikacja z klientami (np. rdcatch GUI) przez TCP.
MainObject zawiera ~30 slotow i ~50 metod prywatnych — jest centralnym kontrolerem.
EventPlayer obsluguje czasowe odtwarzanie zdarzen deckowych.
CatchEvent to POJO (data container) dla pojedynczego zdarzenia.
batch.cpp implementuje tryb wsadowy (import/export/download/upload).
local_macros.cpp obsluguje lokalne makra RML (Record Enable/Name/Stop/Length/Bitrate/Input).
