# MERGE-AGENT — Merge & Consolidation Agent
## Wersja: 1.1.0 | Wywoływany przez: Fazy 2, 3, 4, 5, 7

---

## Toolbox

> Ten agent operuje na plikach `.md` (analysis outputs), nie na kodzie źródłowym.
> - Listowanie partial plików: `Serena: find_file` (nie `ls`, `find`)
> - Szukanie statusów w frontmatter: `Serena: search_for_pattern` (nie `grep`)
> - Czytanie treści partials: **Read** tool (pliki .md, nie kod)
> - Czytanie szablonów: **Read** tool

---

## Cel

Skonsolidować wyniki N sub-agentów w jeden spójny plik output.
Deduplikować, rozwiązywać konflikty, walidować kompletność.

---

## Parametry wejściowe

```
ARTIFACT_ID:     identyfikator artifaktu
PHASE:           numer fazy (2/3/4/5/7)
PARTIAL_PATTERN: wzorzec plików partial (np. inv-*.md)
OUTPUT_FILE:     nazwa pliku output (np. inventory.md)
TEMPLATE:        szablon do użycia (np. .claude/templates/inventory.md)
```

---

## Kroki wykonania

### Krok 1 — Zbierz wszystkie partial pliki

```
# Znajdź partial pliki pasujące do wzorca
Serena: find_file(
  file_mask="{PARTIAL_PATTERN}",
  relative_path=".analysis/{ARTIFACT_ID}/_partials"
)
→ Lista partial plików, zlicz wyniki

# Sprawdź status każdego partial
Serena: search_for_pattern(
  substring_pattern="^status:",
  relative_path=".analysis/{ARTIFACT_ID}/_partials",
  paths_include_glob="**/{PARTIAL_PATTERN}"
)
→ Każdy musi mieć "status: done", inaczej WARNING
```

### Krok 2 — Załaduj szablon

```
# Szablony to pliki .md — użyj Read tool
Read: .claude/templates/{OUTPUT_FILE_TEMPLATE}
→ Zapamiętaj strukturę sekcji szablonu
```

### Krok 3 — Merge per sekcja

Dla każdej sekcji w szablonie:

1. Zbierz wszystkie dane z partial plików dotyczące tej sekcji
2. Sprawdź duplikaty (ta sama klasa/sygnał/feature opisana dwa razy)
3. Jeśli duplikat: zachowaj bogatszy wpis, odnotuj conflict
4. Jeśli conflict mergowalny: połącz
5. Jeśli conflict nie do rozwiązania: zostaw oba z flagą `⚠️ CONFLICT`

### Krok 4 — Deduplikacja (krytyczna dla Fazy 2 i 4)

**Faza 2 (Inventory):**
```
Klasy mogą być referencjonowane przez wiele plików.
Reguła: jedna klasa = jeden wpis.
Identyfikator: class_name (unikalne w C++)
```

**Faza 4 (Call Graph):**
```
Sygnały mogą być opisane zarówno po stronie nadawcy jak i odbiorcy.
Reguła: jedna krawędź connect() = jeden wpis w grafie.
Identyfikator: (sender_class, signal_name, receiver_class, slot_name)
```

**Faza 5 (Facts):**
```
Te same reguły biznesowe mogą być znalezione w kodzie I w testach I w PDF.
Reguła: jeden fakt = jeden wpis z polem "Potwierdzony przez: kod/test/pdf"
Identyfikator: treść Gherkin (jeśli Given/When/Then identyczne → merge)
```

### Krok 5 — Walidacja kompletności

**Faza 2:** Każda klasa z discovery-state.md ma wpis?
**Faza 3:** Każde okno z inventory.md (typ Window/Dialog) ma UI Contract?
**Faza 4:** Każdy sygnał z inventory.md ma co najmniej jedną krawędź?
**Faza 5:** Każdy use case z tests-partial ma regułę Gherkin?
**Faza 7:** Każdy use case z SPEC.md Sekcja 3 należy do jakiegoś FEAT?

Brakujące elementy → lista w sekcji `## Missing Coverage` output pliku.

### Krok 6 — Zapisz output

Utwórz `.analysis/{ARTIFACT_ID}/{OUTPUT_FILE}` z frontmatter:
```yaml
---
phase: {PHASE}
artifact: {ARTIFACT_ID}
status: done
completed_at: {YYYY-MM-DD}
partial_count: {N}
conflicts_found: {liczba konfliktów}
missing_coverage: {liczba brakujących elementów}
agent_version: 1.0.0
---
```

Następnie pełna treść według szablonu.

### Krok 7 — Raport merge

Na końcu wypisz:
```markdown
## Merge Report

Partial pliki: {N}
Duplikaty usunięte: {N}
Konflikty rozwiązane: {N}
Konflikty nierozwiązane (⚠️): {N}
Brakujące elementy: {N}

Jeśli conflicts > 0 lub missing > 0:
  → Sprawdź sekcję "## Missing Coverage" i "## Conflicts" w output pliku
  → Zadecyduj czy wymagają ręcznej interwencji
```

---

## Zasady rozwiązywania konfliktów

```
CONFLICT TYP 1: Różne opisy tej samej klasy
  → Wybierz dłuższy/bogatszy wpis jako bazę
  → Dołącz unikalne elementy z krótszego

CONFLICT TYP 2: Sprzeczne reguły biznesowe
  → NIE rozwiązuj automatycznie
  → Zostaw oba z flagą: ⚠️ CONFLICT: [opis rozbieżności]
  → Dodaj do Missing Coverage z typem "requires_human_review"

CONFLICT TYP 3: Duplikat identyczny
  → Usuń cicho (bez śladu)

CONFLICT TYP 4: Częściowe pokrycie (A opisuje 3 pola, B opisuje 5 pól)
  → Merge: weź unię wszystkich pól
```
