---
phase: 0
status: done
completed_at: ~
agent_version: 1.0.0
project_name: ~
---

# {PROJECT_NAME} — Project Manifest

## Project Profile

| Pole | Wartość |
|------|---------|
| Nazwa | {pełna nazwa} |
| Wersja | {X.Y.Z} |
| Język | C++ / Qt {wersja} |
| Build system | CMake / qmake |
| Licencja | {GPL/LGPL/MIT/etc.} |
| Linie kodu (est.) | ~ |
| Plików źródłowych | ~ |
| Plików .ui | ~ |
| Plików .qml | ~ |

## Platform-specific Components (TO REPLACE in clone)

| Komponent | Technologia | Używany przez | Priorytet zastąpienia |
|-----------|-------------|---------------|----------------------|
| Audio engine | {JACK/ALSA/etc.} | {lista artifaktów} | CRITICAL |
| IPC | {D-Bus/etc.} | {lista artifaktów} | CRITICAL |
| Database | {MySQL/etc.} | {lista artifaktów} | HIGH |
| CD ripping | {cdparanoia/etc.} | {lista artifaktów} | HIGH |
| Audio encode | {lame/FLAC/etc.} | {lista artifaktów} | MEDIUM |

## Artifacts

| ID | Nazwa | Typ | Pri | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|----|-------|-----|-----|----|----|----|----|----|----|-----|
| L01 | {libname} | library | 0 | pending | pending | pending | pending | pending | pending | pending |
| A01 | {appname} | application | 1 | pending | pending | pending | pending | pending | pending | pending |

Statusy kolumn P1-P7: `pending` → `in-progress` → `done` | `failed` | `skip`
Fazy wypełniają się od lewej do prawej. Orkiestratory czytają tę tabelę jako jedyne źródło prawdy.

## Dependency Graph (inter-artifact)

Kolumna `Depends On` zawiera ID artefaktów które MUSZĄ mieć ukończoną analizę
danej fazy zanim ten artefakt może być analizowany w tej fazie.

**Reguła**: Artefakt może rozpocząć fazę N ≥ 2 tylko gdy WSZYSTKIE jego zależności
mają P{N}=done. Faza 1 (structure scan) nie wymaga zależności.

| ID | Depends On | Uwagi |
|----|-----------|-------|
| {LIB_ID} | — | root dependency |
| {APP_ID} | {LIB_ID} | zależy od biblioteki |

## Sessions Log

| Artifact | Faza | Started | Completed | Uwagi |
|----------|------|---------|-----------|-------|
| - | - | - | - | - |
