# Rivendell — Project Overview

Rivendell is a comprehensive digital audio system for professional radio broadcast environments.
Licensed under GPL v2. Developed primarily by Fred Gleason.

## Main Components (Qt/C++ applications)
- **RDAdmin** — administration and configuration
- **RDLibrary** — production audio interface
- **RDCatch** — automatic recorder and task scheduler
- **RDLogin** — user login utility
- **RDLogEdit** — air log creation, editing and voicetracker
- **RDLogManager** — automatic log generation from templates
- **RDAirPlay** — on-air playout application
- **RDPanel** — fullscreen SoundPanel cartwall
- **RDCastManager** — podcast management
- **RDCartSlots** — cart slot interface
- **RDMonitor** — system monitoring

## Tech Stack
- Language: C++
- UI Framework: Qt (classic widgets, no QML)
- Build: Autotools (autoconf/automake) + qmake (.pro files)
- No .ui files, no .qml files — UI built programmatically in C++
- Database: MySQL (for audio library, logs, etc.)
- Platform: Linux

## Repository Structure
- `lib/` — shared library (librd)
- `rdadmin/`, `rdairplay/`, `rdlibrary/`, etc. — individual applications
- `apis/` — API definitions
- `docs/` — documentation
- `conf/` — configuration files
- `helpers/`, `importers/` — auxiliary tools
- `web/` — web services (rdxport)
- `icons/` — application icons

## Branch Status
This branch (master) is frozen — historical only. Active development on branch 'v3'.
