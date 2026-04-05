---
partial_id: 110
artifact: LIB
class_name: RDCddbLookup
header_file: lib/rdcddblookup.h
source_file: lib/rdcddblookup.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDCddbLookup

## Typ Qt
Dialog (dziedziczy RDDiscLookup)

## Odpowiedzialność (WHAT)
Implementacja lookup metadanych płyt CD przez protokół CDDB (FreeDB). Łączy się z serwerem CDDB przez TCP socket, wysyła zapytanie disc ID i parsuje odpowiedź z tytułami utworów.

## Sygnały
Brak (dziedziczone z RDDiscLookup)

## Sloty
| Slot | Widoczność | Co robi |
|------|------------|---------|
| errorData | private | Obsługa błędów socket |

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| sourceName() | Zwraca "FreeDB" |
| lookupRecord() | Wykonuje CDDB query przez TCP |

## Reguły biznesowe
- Protokół CDDB: handshake → query discid → read disc data → quit
- Parsuje pary klucz=wartość (DTITLE, TTITLE0..N, DYEAR, DGENRE)
- Dekodowanie stringów z URL-encoding

## Zależności
RDDiscLookup (base), QTcpSocket
