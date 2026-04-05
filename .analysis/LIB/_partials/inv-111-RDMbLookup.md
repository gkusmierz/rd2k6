---
partial_id: 111
artifact: LIB
class_name: RDMbLookup
header_file: lib/rdmblookup.h
source_file: lib/rdmblookup.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDMbLookup

## Typ Qt
Dialog (dziedziczy RDDiscLookup)

## Odpowiedzialność (WHAT)
Implementacja lookup metadanych płyt CD przez API MusicBrainz (libmusicbrainz5). Pobiera dane o wydaniu (release) i okładkę albumu (libcoverart).

## Sygnały
Brak

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| sourceName() | Zwraca "MusicBrainz" |
| sourceLogo() | Zwraca logo MusicBrainz |
| sourceUrl() | Zwraca URL musicbrainz.org |
| lookupRecord() | Wykonuje lookup przez libmusicbrainz5 |

## Reguły biznesowe
- Używa libdiscid do identyfikacji płyty
- Pobiera listę release'ów pasujących do disc ID
- Pobiera okładkę albumu przez libcoverart (Cover Art Archive)
- Parsuje ISRC z nagrań

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| libmusicbrainz5 | Lookup metadanych | HIGH |
| libdiscid | Identyfikacja dysku | HIGH |
| libcoverart | Okładki albumów | MEDIUM |

## Zależności
RDDiscLookup (base), libmusicbrainz5, libdiscid, libcoverart
