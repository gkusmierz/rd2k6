# PHASE-2 — Inventory Build Agent (Orchestrator)
## Wersja: 1.0.0 | Faza: 2 | Scope: per artifact

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
```bash
EXPECTED=$(wc -l < lista_par_plikow.txt)
ACTUAL=$(ls .analysis/{ARTIFACT_ID}/_partials/inv-*.md 2>/dev/null | wc -l)
echo "Oczekiwane: $EXPECTED, Ukończone: $ACTUAL"
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
```

Jeśli brakuje klas → uruchom ponownie sub-agenta dla tych par.

---

## Warunek done

```
inventory.md istnieje z frontmatter phase=2, status=done
Liczba klas w inventory = liczba klas z discovery-state.md
Zero duplikatów
```

## Co dalej

Fazy 3 i 4 mogą startować równolegle:
- `/qtre-phase-3-ui-extraction ARTIFACT_ID`
- `/qtre-phase-4-call-graph ARTIFACT_ID`
