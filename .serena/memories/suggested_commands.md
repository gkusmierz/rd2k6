# Rivendell — Suggested Commands

## Build System
The project uses Autotools + qmake. The .pro files exist for sub-project organization.

### Initial Setup
```bash
./autogen.sh
./configure
make
```

### qmake (sub-projects)
```bash
qmake rivendell.pro
make
```

## Utility Commands
- `git` — version control
- `ls`, `find`, `grep` — file exploration (Linux)
- `qmake` — available at /home/gk/.local/bin/qmake

## Notes
- No `bear` installed — compile_commands.json must be generated manually if needed
- No CMake — project uses autotools + qmake
