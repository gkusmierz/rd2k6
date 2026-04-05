---
partial_id: 134
artifact: LIB
class_name: RDWaveFile
header_file: lib/rdwavefile.h
source_file: lib/rdwavefile.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDWaveFile

## Typ Qt
Plain C++ (rozszerza QFile)

## Odpowiedzialność (WHAT)
Kompletna obsługa plików audio — odczyt i zapis WAV, MPEG, Ogg Vorbis, FLAC, AIFF, ATX, TMC, M4A. Parsuje i generuje chunki WAV (fmt, data, cart, bext, mext, levl, scot, AIR1, RDXL). Obsługuje metadane broadcast (AES46/Cart Chunk, BWF/Bext), dane energii (peak/RMS), normalizację, trim points.

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| Format | Pcm8/Pcm16/Pcm24/Float/MpegL1/MpegL2/MpegL3/OggVorbis/Atx/Tmc/Flac/Aiff/M4A | Formaty audio |
| Type | Unknown/Wave/Mpeg/Ogg/Atx/Tmc/Flac/Aiff/M4A | Typ kontenera |

## Publiczne API (kluczowe)
| Metoda | Efekt |
|--------|-------|
| openWave/createWave/closeWave | Lifecycle pliku |
| readWave/writeWave/seekWave | I/O audio data |
| getFormatChunk/getDataChunk | Parsowanie chunków |
| getSampleLength/getTimeLength | Długość audio |
| hasEnergy/energy/readEnergy | Dane peak/energy |
| startTrim/endTrim | Wyznaczanie punktów ciszy |
| getCart*/getBext*/getMext* | Metadane broadcast |
| setCart*/setBext* | Zapis metadanych |
| GetType/IsWav/IsMpeg/IsOgg/IsFlac/IsM4A | Detekcja formatu |

## Reguły biznesowe
- Automatyczna detekcja formatu z magic bytes
- Cart Chunk (AES46) przechowuje metadane radiowe (timer markers, out cue, dates)
- BWF/Bext Chunk przechowuje metadane produkcyjne (originator, coding history)
- Energy data = peak values per frame dla waveform display
- Normalizacja oparta na peak detection

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| libsndfile | Fallback decoder | MEDIUM |
| libvorbis | Ogg Vorbis support | MEDIUM |
| FLAC API | FLAC support | MEDIUM |

## Tabele DB
Brak (file I/O only)

## Zależności
libsndfile, libvorbis, FLAC, libsamplerate
