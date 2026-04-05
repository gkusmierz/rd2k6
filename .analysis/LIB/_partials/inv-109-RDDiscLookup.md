---
partial_id: 109
artifact: LIB
class_name: RDDiscLookup
header_file: lib/rddisclookup.h
source_file: lib/rddisclookup.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDDiscLookup

## Typ Qt
Dialog (dziedziczy RDDialog) — klasa bazowa

## Odpowiedzialność (WHAT)
Abstrakcyjna klasa bazowa dla lookup metadanych płyt CD. Definiuje interfejs dialog wyświetlający wyniki wyszukiwania (lista tytułów) z wyborem przez użytkownika. Obsługuje też CD-Text, walidację ISRC i UPC-A.

## Sygnały
Brak

## Sloty
| Slot | Widoczność | Co robi |
|------|------------|---------|
| okData | private | Potwierdź wybór |
| cancelData | private | Anuluj |

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| sourceName() | Nazwa źródła metadanych (abstrakcyjna) |
| sourceLogo() | Logo źródła (abstrakcyjna) |
| sourceUrl() | URL źródła (abstrakcyjna) |
| setCddbRecord(RDDiscRecord*) | Ustaw rekord płyty do lookup |
| lookup() | Rozpocznij wyszukiwanie (wywołuje lookupRecord) |
| hasCdText() | Czy płyta ma CD-Text |
| isrcIsValid/formattedIsrc/normalizedIsrc | Walidacja i formatowanie ISRC |
| upcAIsValid/formattedUpcA/normalizedUpcA | Walidacja i formatowanie UPC-A |

## Stany i kategorie (enums)
Brak

## Reguły biznesowe
- CD-Text jest czytany bezpośrednio z dysku jako fallback gdy lookup online nie zwraca wyników
- ISRC i UPC-A mają ścisłe reguły walidacji (check digit, format)
- lookupRecord() jest pure virtual — implementacja w podklasach

## Zależności
RDDiscRecord, RDProfile, RDTempDirectory
