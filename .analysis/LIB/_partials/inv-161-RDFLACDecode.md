---
partial_id: 161
artifact: LIB
class_name: RDFLACDecode
header_file: lib/rdflacdecode.h
source_file: lib/rdflacdecode.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDFLACDecode

## Typ Qt
Plain C++ (Utility)

## Odpowiedzialność (WHAT)
Wrapper wokół libFLAC do dekodowania plików FLAC do PCM WAV. Callback-based API (write callback, metadata callback, error callback).

## Publiczne API
decode(input_flac, output_wav) → bool

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| libFLAC | Dekodowanie FLAC | MEDIUM |

## Zależności
libFLAC
