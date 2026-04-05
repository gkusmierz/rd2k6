---
partial_id: 162
artifact: LIB
class_name: RDMp4
header_file: lib/rdmp4.h
source_file: lib/rdmp4.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDMp4

## Typ Qt
Plain C++ (Parser)

## Odpowiedzialność (WHAT)
Parser kontenerów MP4/M4A (AAC). Parsuje atomy (ftyp, moov, mdat) i wyciąga metadane audio (codec, sample rate, channels, duration). Nie dekoduje audio — tylko parsuje strukturę kontenera.

## Publiczne API
parse(filename) → metadane audio (channels, sampleRate, duration, codec)

## Zależności
Brak (pure parser)
