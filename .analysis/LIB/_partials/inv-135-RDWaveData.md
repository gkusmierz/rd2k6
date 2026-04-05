---
partial_id: 135
artifact: LIB
class_name: RDWaveData
header_file: lib/rdwavedata.h
source_file: lib/rdwavedata.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDWaveData

## Typ Qt
Plain C++ (Value Object / DTO)

## Odpowiedzialność (WHAT)
Kontener metadanych audio — przechowuje ~80 pól opisujących utwór audio: tytuł, artysta, album, daty, punkty markerów (segue, talk, hook, fade), ustawienia odtwarzania, kody schedulera, ISRC, ISCI itp. Używany jako DTO do transferu metadanych między komponentami.

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| EndType | FadeDown/ColdEnd/UnknownEnd | Jak kończy się utwór |
| CartType | All/Audio/Macro | Typ carta |
| UsageCode | Feature/Open/Close/Theme/Background/Promo/Legal/Other | Kategoria użycia w radiu |

## Publiczne API
~160 getterów/setterów mapujących 1:1 na pola metadanych. Kluczowe grupy:
- Identyfikacja: cartNumber, cutNumber, cutName
- Metadata: title, artist, album, conductor, label, composer, publisher, songId
- Scheduling: schedCodes, usageCode, weight, evergreen, dayOfWeek
- Audio markers: startPos, endPos, segueStart/End, talkStart/End, hookStart/End, fadeUp/Down
- Dates: startDate/Time, endDate/Time, daypartStart/End
- Utility: validateMarkers, validateDateTimes, clear, dump

## Reguły biznesowe
- validateMarkers() sprawdza spójność par markerów (start < end)
- validateDateTimes() sprawdza spójność dat (start < end)
- Centralny DTO używany przez import/export, rdimport CLI, PyPAD, web API

## Tabele DB
Brak (in-memory DTO)

## Zależności
RDAudioSettings
