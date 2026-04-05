# PHASE-0 — Project Discovery Agent
## Wersja: 1.1.0 | Faza: 0 | Scope: cały projekt

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
> Bash dopuszczalny TYLKO dla operacji systemowych (mkdir, wc -l, cmake) i przetwarzania tekstu.
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

Zidentyfikować wszystkie atomowe artefakty projektu (aplikacje, biblioteki, narzędzia),
przypisać im ID, priorytety i zbudować dependency graph.
Output jest entry pointem dla wszystkich kolejnych faz.

---

## Wejście

```
Typ:        folder (root projektu)
Wymagane:   prereq-check.log ze statusem READY
Walidacja:
  - prereq-check.log istnieje
  - prereq-check.log zawiera "Status końcowy: READY"
  - compile_commands.json istnieje
```

---

## Kroki wykonania

### Krok 1 — Skan wysokopoziomowy przez Serena

```
Serena: list_dir(path=".", recursive=false)
→ Zidentyfikuj foldery najwyższego poziomu

Serena: list_dir(path=".", recursive=true, depth=2)
→ Pełna mapa struktury do 2 poziomów głębokości
```

### Krok 2 — Analiza build system

**Dla CMake:**
```
Serena: find_file(file_mask="CMakeLists.txt", relative_path=".")
→ Lista wszystkich CMakeLists.txt w projekcie

Serena: search_for_pattern(
  substring_pattern="add_executable|add_library",
  paths_include_glob="**/CMakeLists.txt"
)
→ Wszystkie definicje targetów (executables i libraries)
```

**Dla qmake:**
```
Serena: find_file(file_mask="*.pro", relative_path=".")
→ Lista .pro plików (każdy = osobna aplikacja/biblioteka)

Serena: search_for_pattern(
  substring_pattern="^TEMPLATE|^TARGET|^SUBDIRS",
  paths_include_glob="**/*.pro"
)
→ Typ i nazwa każdego targetu
```

### Krok 3 — Klasyfikacja artifaktów

Dla każdego zidentyfikowanego targetu określ:

```
Typ:
  application  → add_executable / TEMPLATE=app
  library      → add_library / TEMPLATE=lib
  tool         → małe narzędzie CLI
  test         → test suite

Ważność:
  critical     → core systemu, wszystkie inne zależą
  major        → główna aplikacja użytkownika
  support      → narzędzie pomocnicze
  test         → tylko testy
```

### Krok 4 — Przypisanie ID i priorytetów

Reguły przypisywania ID (3 litery, unikalne):
```
- Biblioteki shared: priorytet 0 (zawsze pierwsze)
- Główne aplikacje UI: priorytet 1-5 (wg centralności w systemie)
- Narzędzia pomocnicze: priorytet 6-9
- Test suites: priorytet 10+ (lub pomijane jeśli brak kodu biznesowego)
```

Unikaj ID które kolidują z powszechnymi skrótami (SQL, API, etc.)

### Krok 5 — Dependency graph

```
Serena: search_for_pattern(
  substring_pattern="target_link_libraries",
  paths_include_glob="**/CMakeLists.txt"
)
→ Inter-target dependencies (CMake)

Serena: find_file(file_mask="*.h", relative_path=".")
→ Zidentyfikuj shared headers (te w */include/*)
```

Zbuduj tabelę: który artifact → używa których bibliotek.

### Krok 6 — Identyfikacja Linux-specific komponentów

Szukaj w CMakeLists.txt i plikach źródłowych:
```
# Audio
Serena: search_for_pattern(
  substring_pattern="(?i)jack|alsa|oss|pulse|PulseAudio",
  paths_include_glob="**/{CMakeLists.txt,*.h,*.cpp}"
)

# IPC
Serena: search_for_pattern(
  substring_pattern="(?i)dbus|DBus",
  paths_include_glob="**/{CMakeLists.txt,*.h,*.cpp}"
)

# CD
Serena: search_for_pattern(
  substring_pattern="(?i)cdparanoia|libcdio",
  paths_include_glob="**/CMakeLists.txt"
)

# Database
Serena: search_for_pattern(
  substring_pattern="(?i)mysql|postgresql|sqlite",
  paths_include_glob="**/CMakeLists.txt"
)
```

### Krok 7 — Zlicz rozmiar projektu

```
# Zlicz pliki per typ — używaj Serena find_file
Serena: find_file(file_mask="*.cpp", relative_path=".")  → zlicz wyniki (pomiń build/, moc_*)
Serena: find_file(file_mask="*.h", relative_path=".")    → zlicz wyniki
Serena: find_file(file_mask="*.ui", relative_path=".")   → zlicz wyniki
Serena: find_file(file_mask="*.qml", relative_path=".")  → zlicz wyniki
Serena: find_file(file_mask="*.pro", relative_path=".")  → zlicz wyniki
```

```bash
# Linie kodu — to wymaga bash (Serena nie liczy LOC)
find . \( -name "*.cpp" -o -name "*.h" \) \
  ! -path "*/build/*" ! -path "*/.build/*" ! -path "*/moc_*" \
  | xargs wc -l | sort -rn | head -20
```

### Krok 8 — Zapisz manifest

Utwórz `.analysis/{PROJECT_NAME}.manifest.md` używając szablonu `.claude/templates/manifest.md`.

---

## Warunek done

```
manifest.md istnieje w .analysis/
Każdy artifact ma: ID, nazwę, typ, prefix, priorytet
Dependency graph jest kompletny
Linux-specific tabela wypełniona
Sessions Log pusty (czeka na fazy 1-7)
```

---

## Co dalej

Uruchom `/qtre-phase-1-structure-scan ARTIFACT_ID` z artifact ID o priorytecie 0
(biblioteki shared), następnie kolejne wg rosnącego priorytetu.
