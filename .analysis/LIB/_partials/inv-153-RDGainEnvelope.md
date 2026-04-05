---
partial_id: 153
artifact: LIB
class_name: RDGainEnvelope
header_file: lib/rdgain_envelope.h
source_file: lib/rdgain_envelope.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDGainEnvelope

## Typ Qt
Plain C++ (Utility)

## Odpowiedzialność (WHAT)
Obwiednia głośności (gain envelope) — definiuje krzywą zmian głośności w czasie. Używana do fade in/out i ducking w renderingu audio.

## Publiczne API
addPoint(time, gain), gainAt(time), clear, size

## Zależności
Brak
