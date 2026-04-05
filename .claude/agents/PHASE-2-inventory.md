# PHASE-2 — Inventory Build Agent (Orchestrator)
## Wersja: 1.2.0 | Faza: 2 | Scope: per artifact

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Cel

Zbudować pełny inwentarz klas, metod, sygnałów i slotów dla jednego artifaktu.
Uruchamia sub-agentów równolegle (jeden per para .h/.cpp), merge agent konsoliduje.

---

## Wejście

```
Typ:        artifact ID
Źródło:     .analysis/{ARTIFACT_ID}/discovery-state.md
Walidacja:
  - discovery-state.md istnieje
  - frontmatter: phase=1, status=done
```

---

## Kroki wykonania

### Krok 1 — Załaduj listę plików z discovery-state.md

Przeczytaj sekcję "Pliki źródłowe" z discovery-state.md.
Zbuduj listę par: `[("cart.h", "cart.cpp"), ("cut.h", "cut.cpp"), ...]`

Obsługa przypadków brzegowych:
- plik .h bez .cpp → analyze tylko header (klasa może być template/inline)
- plik .cpp bez .h → analyze implementację bezpośrednio (może być main.cpp)
- pliki `moc_*.cpp` → POMIŃ (generowane przez moc)
- pliki `ui_*.h` → POMIŃ (generowane z .ui plików, analizowane w Fazie 3)

### Krok 1b — Skanuj WSZYSTKIE klasy (nie tylko Q_OBJECT)

> **WAŻNE:** Wiele projektów Qt ma klasy plain C++ (Active Record, Value Object,
> helper/utility) BEZ makra Q_OBJECT. Te klasy NIE pojawiają się w skanowaniu
> sygnałów/slotów ale SĄ częścią domain model i muszą być zinwentaryzowane.

```
# Znajdź WSZYSTKIE klasy C++ w artifact folder
Serena: search_for_pattern(
  substring_pattern="^class\\s+\\w+",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.h"
)
→ LISTA_WSZYSTKIE

# Porównaj z listą Q_OBJECT klas z discovery-state.md
# Różnica = plain C++ klasy do dodania do inwentarza
PLAIN_CPP = LISTA_WSZYSTKIE - LISTA_QOBJECT

# Dla każdej plain C++ klasy: uruchom sub-agenta tak samo jak dla Q_OBJECT
# Sub-agent automatycznie ustawi "Sygnały: Brak" i "Sloty: Brak"
```

**Kategoryzacja plain C++ klas:**
```
Klasa z getterami/setterami + SQL → Active Record (model domenowy)
Klasa z samymi metodami statycznymi → Utility
Klasa z enum'ami i stałymi → Value Object / Constants
Klasa z algorytmami → Service (non-Qt)
struct / klasa z samymi polami → Data Transfer Object
```

### Krok 2 — Uruchom sub-agenty równolegle

Dla każdej pary plików uruchom `.claude/agents/PHASE-2-inventory-subagent.md` z parametrami:
```
ARTIFACT_ID:  {ARTIFACT_ID}
HEADER_FILE:  {ścieżka do .h}
SOURCE_FILE:  {ścieżka do .cpp lub null}
PARTIAL_ID:   {NR}  (sekwencyjny numer, np. 001, 002, ...)
```

Sub-agent zapisuje wynik do:
```
.analysis/{ARTIFACT_ID}/_partials/inv-{PARTIAL_ID}-{CLASSNAME}.md
```

Priorytet kolejności sub-agentów:
1. Klasy dziedziczące bezpośrednio z QObject (core domain)
2. Klasy dziedziczące z QDialog/QMainWindow (UI)
3. Klasy utility i helper

### Krok 3 — Poczekaj na ukończenie wszystkich sub-agentów

Sprawdź że wszystkie pliki `_partials/inv-*.md` istnieją:
```
Serena: find_file(
  file_mask="inv-*.md",
  relative_path=".analysis/{ARTIFACT_ID}/_partials"
)
→ Zlicz wyniki i porównaj z oczekiwaną liczbą par plików
```

### Krok 4 — Wywołaj Merge Agent

Uruchom `.claude/agents/MERGE-AGENT.md` z parametrami:
```
ARTIFACT_ID:     {ARTIFACT_ID}
PHASE:           2
PARTIAL_PATTERN: inv-*.md
OUTPUT_FILE:     inventory.md
TEMPLATE:        .claude/templates/inventory.md
```

### Krok 5 — Walidacja output

Po merge sprawdź inventory.md:
```
- Każda klasa z discovery-state.md ma wpis w inventory.md?
- Żadna klasa nie jest zduplikowana?
- Każda klasa z Q_OBJECT ma sekcję sygnałów i slotów?
- Każdy Q_PROPERTY jest wylistowany?
- Liczba klas w inventory >= liczba klas ze skanu (Krok 1b)?
```

Jeśli brakuje klas → uruchom ponownie sub-agenta dla tych par.

### Krok 6 — Spot-check (OBOWIĄZKOWY)

> Losowa weryfikacja 3 klas zapobiega propagacji błędów do kolejnych faz.

Wybierz **3 losowe klasy** z wygenerowanego inventory.md (preferuj mix: 1 QObject, 1 Dialog, 1 plain C++).

Dla każdej:
```
# Zweryfikuj sygnały
Serena: search_for_pattern(
  substring_pattern="signals:",
  relative_path="{HEADER_FILE}",
  context_lines_after=30
)
→ Porównaj z sekcją "Sygnały" w inventory
→ Czy brakuje jakiegoś sygnału? Czy jakiś jest nadmiarowy?

# Zweryfikuj typ socketu / komunikacji (jeśli klasa komunikacyjna)
Serena: find_symbol(
  name_path_pattern="{CLASS}/connectHost",
  relative_path="{SOURCE_FILE}",
  include_body=true
)
→ Czy opis w inventory odpowiada faktycznej implementacji?
→ TCP vs UDP? Synchroniczny vs asynchroniczny?
```

Jeśli >=1 rozbieżność → przeglądnij powiązane klasy i popraw.

---

## Warunek done

```
inventory.md istnieje z frontmatter phase=2, status=done
Liczba klas w inventory >= liczba klas z discovery-state.md (uwzględnia plain C++)
Zero duplikatów
Spot-check 3 klas przeszedł bez rozbieżności
Kolumna P2 w manifest.md → done
```

**Po zakończeniu**: zmień kolumnę **P2** w tabeli Artifacts manifestu na done.

## Co dalej

Fazy 3 i 4 mogą startować równolegle:
- `/qtre-phase-3-ui-extraction ARTIFACT_ID`
- `/qtre-phase-4-call-graph ARTIFACT_ID`
