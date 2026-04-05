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

| ID | Nazwa | Typ | Prefix | Priorytet | Status fazy 1 | Status fazy 5 | Status done |
|----|-------|-----|--------|-----------|--------------|--------------|-------------|
| L01 | {libname} | library | {XXX} | 0 | pending | pending | pending |
| A01 | {appname} | application | {XXX} | 1 | pending | pending | pending |

## Dependency Graph (inter-artifact)

```
{LIB_ID} ({libname}) ← {app1}, {app2}, {app3}
{LIB2_ID} ({lib2name}) ← {app1}
```

## Sessions Log

| Artifact | Faza | Started | Completed | Uwagi |
|----------|------|---------|-----------|-------|
| - | - | - | - | - |
