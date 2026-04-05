---
partial_id: 129
artifact: LIB
class_name: RDSettings
header_file: lib/rdsettings.h
source_file: lib/rdsettings.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDSettings

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Kontener ustawień formatu audio: format kodowania, kanały, sample rate, bitrate, jakość, poziomy normalizacji i autotrim. Obsługuje presety (named presets) z persystencją w DB i generowanie opisów/rozszerzeń plików.

## Sygnały
Brak (plain C++)

## Sloty
Brak

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| format/setFormat | Format kodowania (PCM16/24, MPEG L2/L3, Vorbis, FLAC) |
| channels/setChannels | Liczba kanałów |
| sampleRate/setSampleRate | Częstotliwość próbkowania |
| bitRate/setBitRate | Bitrate |
| quality/setQuality | Jakość (dla VBR) |
| normalizationLevel/setNormalizationLevel | Poziom normalizacji (dBFS) |
| autotrimLevel/setAutotrimLevel | Poziom autotrim (dBFS) |
| loadPreset/addPreset/savePreset/deletePreset | CRUD presetów |
| defaultExtension | Rozszerzenie pliku dla formatu |

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| Format | Pcm16/Pcm24/MpegL2/MpegL2Wav/MpegL3/Flac/OggVorbis | Wspierane formaty kodowania |

## Tabele DB (CRUD)
Presety przechowywane w DB (kolumny z SqlFields())

## Zależności
RDSqlQuery
