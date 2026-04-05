# PHASE-1 — Artifact Structure Scan Agent
## Wersja: 1.1.0 | Faza: 1 | Scope: per artifact

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Toolbox — Serena MCP First

> **Twarda reguła:** Używaj Serena MCP jako PRIMARY tool do interakcji z kodem źródłowym.
> Bash dopuszczalny TYLKO dla operacji systemowych (mkdir, wc -l).
>
> | Potrzebujesz | Użyj Serena | NIE używaj |
> |---|---|---|
> | Listowanie plików | `list_dir`, `find_file` | `find`, `ls` |
> | Szukanie wzorców w kodzie | `search_for_pattern` | `grep`, `rg` |
> | Przeglądanie symboli | `get_symbols_overview` | `cat`, `head` |
> | Czytanie kodu symbolu | `find_symbol(include_body=true)` | `Read`, `cat` |
> | Referencje do symbolu | `find_referencing_symbols` | `grep` |

---

## Cel

Dla jednego artifaktu: zidentyfikować wszystkie pliki źródłowe,
główne klasy Qt, entry points i CMake targets.
Output: mapa struktury gotowa dla Fazy 2 (Inventory).

---

## Wejście

```
Typ:        artifact ID (string, np. "LIB")
Źródło:     .analysis/{PROJECT}.manifest.md
Wymagane:   tak
Walidacja:
  - artifact ID istnieje w manifest.md
  - artifact status = pending
  - jeśli typ=application: wszystkie biblioteki zależne mają phase-5 status=done
    (sprawdź w manifest.md sekcja Dependency Graph)
```

**Pobierz z manifest.md:**
- Nazwę artifaktu (np. "RDLibrary")
- Folder źródłowy (np. "rdlibrary/")
- Prefix ID (np. "LIB")
- Typ (application/library)

---

## Kroki wykonania

### Krok 1 — Aktualizuj kanban w manifest.md

W tabeli `Artifacts` znajdź wiersz artefaktu i zmień kolumnę **P1** z `pending` na `in-progress`.
Dodaj datę startu do Sessions Log.

### Krok 2 — Utwórz folder artifaktu

```bash
mkdir -p .analysis/{ARTIFACT_ID}/
mkdir -p .analysis/{ARTIFACT_ID}/_partials/
mkdir -p .analysis/{ARTIFACT_ID}/Features/
```

### Krok 3 — Skan plików źródłowych

```
Serena: list_dir(relative_path="{ARTIFACT_FOLDER}", recursive=true)
→ Pobierz pełną listę plików i katalogów

# Zlicz pliki per typ
Serena: find_file(file_mask="*.cpp", relative_path="{ARTIFACT_FOLDER}")
Serena: find_file(file_mask="*.h", relative_path="{ARTIFACT_FOLDER}")
Serena: find_file(file_mask="*.ui", relative_path="{ARTIFACT_FOLDER}")
Serena: find_file(file_mask="*.qml", relative_path="{ARTIFACT_FOLDER}")
Serena: find_file(file_mask="*.qrc", relative_path="{ARTIFACT_FOLDER}")
Serena: find_file(file_mask="*.ts", relative_path="{ARTIFACT_FOLDER}")
→ Zlicz wyniki każdego wywołania
```

### Krok 4 — Identyfikacja głównych klas Qt

Dla każdego pliku .h użyj Sereny:
```
Serena: get_symbols_overview(relative_path="{FILE}.h")
→ Zidentyfikuj klasy które dziedziczą z Qt
```

Szukaj wzorców dziedziczenia i Q_OBJECT:
```
# Klasy dziedziczące z Qt
Serena: search_for_pattern(
  substring_pattern="class\\s+\\w+.*:\\s*public\\s+Q",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.h"
)

# Klasy z Q_OBJECT (uczestniczą w sygnałach/slotach)
Serena: search_for_pattern(
  substring_pattern="Q_OBJECT",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.h"
)
```

### Krok 5 — Identyfikacja entry points

```
# main() funkcja
Serena: search_for_pattern(
  substring_pattern="^int main",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)

# QApplication / QCoreApplication
Serena: search_for_pattern(
  substring_pattern="QApplication|QCoreApplication|QGuiApplication",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)

# QMainWindow subclass (główne okno)
Serena: search_for_pattern(
  substring_pattern="class\\s+\\w+.*:\\s*public\\s+QMainWindow",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.h"
)
```

### Krok 6 — CMake target dla tego artifaktu

```
# Znajdź CMakeLists.txt dla tego artifaktu
Serena: find_file(file_mask="CMakeLists.txt", relative_path="{ARTIFACT_FOLDER}")

# Wyciągnij target definition
Serena: search_for_pattern(
  substring_pattern="add_executable|add_library",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/CMakeLists.txt",
  context_lines_after=20
)
```

### Krok 7 — Identyfikacja plików testowych

```
# Pliki testowe (QTest)
Serena: find_file(file_mask="*test*.cpp", relative_path=".")
Serena: find_file(file_mask="*Test*.cpp", relative_path=".")
Serena: find_file(file_mask="*test*.h", relative_path=".")
→ Przefiltruj wyniki szukając {ARTIFACT_NAME} lub {ARTIFACT_ID}

# Klasy testowe dziedziczące z QObject
Serena: search_for_pattern(
  substring_pattern="(?i)class.*test.*:.*public.*QObject",
  paths_include_glob="**/*.h"
)
```

### Krok 8 — Zapisz discovery-state.md

Utwórz `.analysis/{ARTIFACT_ID}/discovery-state.md` używając szablonu.

---

## Warunek done

```
discovery-state.md istnieje z frontmatter phase=1, status=done
Wszystkie pliki .h/.cpp skatalogowane
Klasy Qt zidentyfikowane z typem (QMainWindow/QDialog/etc.)
Entry point (main.cpp) zidentyfikowany
Pliki testowe zidentyfikowane (lub "brak" odnotowane)
Kolumna P1 w manifest.md → done
```

**Po zakończeniu**: zmień kolumnę **P1** w tabeli `Artifacts` manifestu na `done`.

---

## Co dalej

Uruchom `/qtre-phase-2-inventory ARTIFACT_ID`.
