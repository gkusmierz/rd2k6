---
partial_id: 163
artifact: LIB
class_name: RDMixer
header_file: lib/rdmixer.h
source_file: lib/rdmixer.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDMixer

## Typ Qt
Plain C++ (Utility — global functions)

## Odpowiedzialność (WHAT)
Kontrola miksera audio ALSA — ustawianie i odczyt poziomów głośności per kanał/port. Wrapper wokół ALSA mixer API.

## Publiczne API
RDSetMixerOutputVolume(), RDSetMixerInputVolume(), RDGetMixerOutputVolume(), RDGetMixerInputVolume()

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| ALSA mixer API | Kontrola głośności | CRITICAL |

## Zależności
libasound (ALSA)
