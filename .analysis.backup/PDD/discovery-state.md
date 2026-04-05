---
phase: 1
artifact: PDD
artifact_name: rdpadd
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdpadd (PAD Consolidation Server)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | rdpadd/ |
| CMakeLists.txt | brak (autotools: rdpadd/Makefile.am) |
| Target | rdpadd (sbin_PROGRAMS) |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Linie kodu (est.) | ~285 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdpadd.cpp:201 | int main(argc, argv) | Punkt startowy procesu |
| QCoreApplication | rdpadd.cpp:203 | QCoreApplication a | Inicjalizacja Qt (headless, brak GUI) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | rdpadd.h | QObject | Glowny obiekt daemona — serwer konsolidacji PAD (Program Associated Data) |
| MetadataSource | rdpadd.h | plain C++ | Bufor metadanych dla jednego zrodla (source connection), nie dziedziczy z Qt |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdpadd.h | rdpadd.cpp | MainObject + MetadataSource + main() |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_rdpadd.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Build Target Definition (autotools)

```makefile
sbin_PROGRAMS = rdpadd

dist_rdpadd_SOURCES = rdpadd.cpp rdpadd.h
nodist_rdpadd_SOURCES = moc_rdpadd.cpp

rdpadd_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| Qt3Support | Qt compat | tak |

## Architektura (notatki)

rdpadd to minimalistyczny daemon typu "PAD Consolidation Server". Pelni role posrednika (broker/proxy) pomiedzy zrodlami metadanych PAD a klientami:

- **Source side**: nasluchuje na abstrakcyjnym UNIX socket (`RD_PAD_SOURCE_UNIX_ADDRESS = "m4w8n8fsfddf-473fdueusurt-8954"`) za pomoca `RDUnixServer`. Zrodla (np. rdlogplay z librd) wysylaja dane PAD zakonczne `\r\n\r\n`.
- **Client side**: nasluchuje na TCP port `RD_PAD_CLIENT_TCP_PORT = 34289` (QTcpServer). Klienci (np. pypad scripts) lacza sie i odbieraja skonsolidowane dane PAD.
- **Logika**: gdy zrodlo wysle kompletny blok metadanych (buforowany w MetadataSource, zatwierdzony gdy konczy sie `\r\n\r\n`), serwer broadcastuje go do wszystkich podlaczonych klientow TCP.
- **Nowy klient**: przy polaczeniu otrzymuje biezacy stan (ostatni committed bufor) ze wszystkich aktywnych zrodel (metoda SendState).
