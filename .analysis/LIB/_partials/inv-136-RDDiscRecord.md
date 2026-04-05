---
partial_id: 136
artifact: LIB
class_name: RDDiscRecord
header_file: lib/rddiscrecord.h
source_file: lib/rddiscrecord.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDDiscRecord

## Typ Qt
Plain C++ (Value Object / DTO)

## Odpowiedzialność (WHAT)
Kontener metadanych płyty CD — disc ID, MCN, tytuł, artysta, lista utworów (tytuły, ISRC), offsety ścieżek. Używany przez system disc lookup (CDDB/MusicBrainz) do przechowywania wyników wyszukiwania.

## Publiczne API
Gettery/settery: discId, discLength, discMcn, discTitle, discArtist, discAlbum, discYear, discGenre, trackTitle(N), trackIsrc(N), trackOffset(N), tracks (count)

## Tabele DB
Brak (in-memory DTO)

## Zależności
Brak
