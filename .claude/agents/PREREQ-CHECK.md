# PREREQ-CHECK — Prerequisite Check Agent
## Wersja: 1.1.0 | Faza: -1

---

## Cel

Zweryfikować i przygotować środowisko przed jakąkolwiek analizą.
Brak spełnionych prerequisites = twarde zatrzymanie. Zero kontynuacji.

---

## Wejście

```
Typ:      folder (root projektu C++/Qt)
Podaj:    ścieżkę absolutną do root projektu
Przykład: /home/user/projects/rivendell
```

## Walidacja wejścia

```bash
# 1. Folder istnieje?
test -d "$PROJECT_ROOT" || { echo "ERROR: folder nie istnieje"; exit 1; }

# 2. To projekt C++/Qt?
find "$PROJECT_ROOT" -maxdepth 2 \
  \( -name "CMakeLists.txt" -o -name "*.pro" -o -name "*.pri" \) \
  | head -5
# Jeśli brak → zatrzymaj i zapytaj użytkownika czy to właściwy folder
```

---

## Kroki wykonania

### Krok 1 — Zidentyfikuj build system

```bash
# CMake?
if [ -f "$PROJECT_ROOT/CMakeLists.txt" ]; then
  echo "BUILD_SYSTEM=cmake"

# qmake?
elif ls "$PROJECT_ROOT"/*.pro 2>/dev/null | head -1; then
  echo "BUILD_SYSTEM=qmake"

else
  echo "ERROR: nieznany build system"
  echo "Oczekiwane: CMakeLists.txt lub *.pro"
  exit 1
fi
```

### Krok 2 — Sprawdź compile_commands.json

```bash
if [ -f "$PROJECT_ROOT/compile_commands.json" ]; then
  echo "OK: compile_commands.json istnieje"
  # Sprawdź czy nie jest pusty/stary
  ENTRIES=$(python3 -c "import json,sys; d=json.load(open('$PROJECT_ROOT/compile_commands.json')); print(len(d))")
  echo "Entries: $ENTRIES"
  [ "$ENTRIES" -gt 0 ] || echo "WARNING: compile_commands.json jest pusty"
else
  echo "MISSING: compile_commands.json — generuję..."

  # CMake — automatyczne
  if [ "$BUILD_SYSTEM" = "cmake" ]; then
    mkdir -p "$PROJECT_ROOT/.build"
    cmake \
      -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
      -B "$PROJECT_ROOT/.build" \
      "$PROJECT_ROOT"
    cp "$PROJECT_ROOT/.build/compile_commands.json" "$PROJECT_ROOT/"
    echo "OK: compile_commands.json wygenerowany (CMake)"

  # qmake — wymaga bear
  elif [ "$BUILD_SYSTEM" = "qmake" ]; then
    if ! command -v bear &>/dev/null; then
      echo "ERROR: 'bear' nie jest zainstalowany"
      echo "Zainstaluj: sudo apt install bear  LUB  brew install bear"
      echo "Następnie uruchom ręcznie:"
      echo "  cd $PROJECT_ROOT && bear -- qmake && bear -- make"
      exit 1
    fi
    cd "$PROJECT_ROOT"
    bear -- qmake && bear -- make
    echo "OK: compile_commands.json wygenerowany (qmake + bear)"
  fi
fi
```

### Krok 3 — Sprawdź Serena MCP

```
Wykonaj przez Serena MCP:
  get_current_config()

Oczekiwany wynik: konfiguracja z dostępnymi projektami.
Jeśli błąd → Serena nie jest podłączona do Claude Code.

Instrukcja dla użytkownika jeśli Serena niedostępna:
  1. Zainstaluj Serena: uvx --from git+https://github.com/oraios/serena serena start-mcp-server
  2. Dodaj do konfiguracji Claude Code
  3. Zrestartuj sesję
```

### Krok 4 — Zainicjalizuj projekt w Serenie

```
Wykonaj przez Serena MCP:
  activate_project(path="$PROJECT_ROOT")
  onboarding()

Serena zidentyfikuje strukturę projektu i zapisze w .serena/
```

### Krok 5 — Sprawdź Qt-specific tooling

```bash
# Qt zainstalowane?
which qmake || which qmake6 || \
  echo "WARNING: qmake nie znaleziony — może być OK jeśli używasz CMake"

# Wersja Qt z CMakeLists.txt
grep -i "find_package.*Qt" "$PROJECT_ROOT/CMakeLists.txt" | head -3

# Pliki .ui istnieją?
UI_COUNT=$(find "$PROJECT_ROOT" -name "*.ui" | wc -l)
echo "Pliki .ui: $UI_COUNT"

# Pliki .qml istnieją?
QML_COUNT=$(find "$PROJECT_ROOT" -name "*.qml" | wc -l)
echo "Pliki .qml: $QML_COUNT"
```

### Krok 6 — Utwórz prereq-check.log

Zapisz plik `$PROJECT_ROOT/prereq-check.log`:

```markdown
# Prerequisite Check Log
Data: {YYYY-MM-DD HH:MM}
Projekt: {PROJECT_ROOT}
Agent version: 1.0.0

## Wyniki

| Check | Status | Szczegóły |
|-------|--------|-----------|
| Folder istnieje | OK/FAIL | {path} |
| Build system | OK/FAIL | cmake/qmake |
| compile_commands.json | OK/GENERATED/FAIL | {entries} entries |
| Serena MCP | OK/FAIL | {version} |
| Projekt w Serenie | OK/FAIL | {project name} |
| Pliki .ui | INFO | {count} plików |
| Pliki .qml | INFO | {count} plików |

## Status końcowy
READY / BLOCKED

## Blokery (jeśli BLOCKED)
{lista blokerów z instrukcją naprawy}
```

---

## Warunek done

```
compile_commands.json istnieje i ma > 0 entries
Serena MCP odpowiada
Projekt zainicjalizowany w Serenie (.serena/ folder istnieje)
prereq-check.log zapisany ze statusem READY
```

---

## Co dalej

Status READY → uruchom `/qtre-phase-0-discovery` (lub czytaj `.claude/agents/PHASE-0-discovery.md`)
Status BLOCKED → napraw blokery, uruchom `/qtre-prereq-check` ponownie
