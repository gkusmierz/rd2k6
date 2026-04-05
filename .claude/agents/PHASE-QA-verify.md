# PHASE-QA — Phase Verification Agent
## Wersja: 1.1.0 | Faza: po każdej | Scope: per artifact + per phase

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Cel

Niezależna weryfikacja outputu zakończonej fazy.
Agent NIGDY nie modyfikuje plików analizy — tylko raportuje problemy.
Znalezione issues trafiają do **changelog** artefaktu jako wpisy BUG.

**Outputy:**
- `.analysis/{ARTIFACT_ID}/_qa/qa-phase-{N}-cycle-{C}.md` — raport z danego cyklu
- `.analysis/{ARTIFACT_ID}/_qa/changelog.md` — append-only log (BUG entries)

---

## Parametry wejściowe

```
ARTIFACT_ID:  identyfikator artifaktu (np. LIB)
PHASE:        numer fazy do weryfikacji (1-7)
```

---

## Krok 1 — Inicjalizacja changelog

Sprawdź czy changelog istnieje:
```
Read: .analysis/{ARTIFACT_ID}/_qa/changelog.md
```

Jeśli nie istnieje → utwórz z szablonu `.claude/templates/qa-changelog.md`.
Jeśli istnieje → wczytaj, ustal numer cyklu QA (= ile razy ta faza była weryfikowana + 1).

```
CYCLE = (liczba plików qa-phase-{N}-cycle-*.md) + 1
```

---

## Krok 2 — Wykonaj kontrole per faza

> Kontrole identyczne jak w sekcji poniżej.
> Każda kontrola produkuje wynik: PASS / WARNING / FAIL.

---

## Wspólne kontrole (każda faza)

### Kontrola 0 — Frontmatter

```
Read: .analysis/{ARTIFACT_ID}/{OUTPUT_FILE}
→ Sprawdź:
  - phase: {N} → zgadza się z PHASE?
  - status: done → jest done?
  - completed_at: nie jest puste?
  - agent_version: nie jest puste?
```

### Kontrola 1 — Manifest consistency

```
Read: .analysis/{PROJECT}.manifest.md
→ Kolumna P{N} dla tego artifaktu = done?
→ Jeśli nie → FAIL: "Manifest nie zaktualizowany"
```

---

## Kontrole per faza

### FAZA 1 — Discovery State

**Plik:** `.analysis/{ARTIFACT_ID}/discovery-state.md`

```
CTRL-1.1: Liczba plików
  Serena: find_file(file_mask="*.h", relative_path="{ARTIFACT_FOLDER}")
  Serena: find_file(file_mask="*.cpp", relative_path="{ARTIFACT_FOLDER}")
  → Porównaj z liczbami w sekcji "Statystyki"
  → Tolerancja: ±5 plików (mogą być wygenerowane moc_/ui_)
  → Jeśli różnica > 10: FAIL

CTRL-1.2: Entry points
  Serena: search_for_pattern(
    substring_pattern="^int main",
    relative_path="{ARTIFACT_FOLDER}",
    paths_include_glob="**/*.cpp"
  )
  → Czy wynik zgadza się z sekcją "Entry Points"?

CTRL-1.3: Klasy Qt — sample check
  Wybierz 5 losowych klas z listy "Klasy Qt"
  Serena: find_symbol(name_path_pattern="{CLASS}", relative_path="{HEADER}")
  → Czy klasa istnieje? Czy typ Qt się zgadza?
```

### FAZA 2 — Inventory

**Plik:** `.analysis/{ARTIFACT_ID}/inventory.md`

```
CTRL-2.1: Kompletność klas
  Serena: search_for_pattern(
    substring_pattern="^class\\s+\\w+",
    relative_path="{ARTIFACT_FOLDER}",
    paths_include_glob="**/*.h"
  )
  → Zlicz unikalne klasy
  → Porównaj z "Klasy łącznie" w inventory
  → Jeśli inventory < 80% faktycznych klas: FAIL

CTRL-2.2: Sygnały — deep check (3 klasy)
  Wybierz 3 klasy z największą liczbą sygnałów w inventory.
  Dla każdej:
    Serena: search_for_pattern(
      substring_pattern="signals:",
      relative_path="{HEADER}",
      context_lines_after=40
    )
    → Zlicz sygnały w headerze vs w inventory
    → Brakujące sygnały: WARNING per brakujący

CTRL-2.3: Typ komunikacji
  Dla klas komunikacyjnych (Cae, Ripc, CatchConnect itp.):
    Serena: search_for_pattern(
      substring_pattern="SocketDevice|QTcpSocket|QUdpSocket",
      relative_path="{SOURCE}"
    )
    → Czy opis w inventory (TCP/UDP) odpowiada faktycznie użytemu socket type?

CTRL-2.4: Brak sekcji "Brak"
  Czy są klasy z Q_OBJECT które mają "Sygnały: Brak" ale faktycznie mają sygnały?
  (sample 3 takie klasy)
```

### FAZA 3 — UI Contracts

**Plik:** `.analysis/{ARTIFACT_ID}/ui-contracts.md`

```
CTRL-3.1: Pokrycie dialogów
  Z inventory.md wyciągnij klasy typu QDialog/RDDialog/QWidget
  → Porównaj z listą okien w ui-contracts.md
  → Brakujące dialogi: FAIL per brakujący

CTRL-3.2: Widgety — deep check (3 dialogi)
  Wybierz 3 dialogi z ui-contracts.md
  Dla każdego:
    Serena: find_symbol(
      name_path_pattern="{CLASS}/{CLASS}",
      relative_path="{SOURCE}",
      include_body=true
    )
    → Przeczytaj konstruktor
    → Porównaj widgety z konstruktora z tabelą "Widgety i interakcje"
    → Brakujące/nadmiarowe widgety: WARNING

CTRL-3.3: Walidacje — deep check (3 dialogi)
  Dla tych samych 3 dialogów:
    Serena: search_for_pattern(
      substring_pattern="QMessageBox",
      relative_path="{SOURCE}",
      context_lines_before=2,
      context_lines_after=2
    )
    → Porównaj komunikaty z sekcją "Walidacje UI"
    → Fałszywe walidacje (w doc ale nie w kodzie): FAIL
    → Brakujące walidacje (w kodzie ale nie w doc): WARNING

CTRL-3.4: Tytuły okien
  Dla każdego dialogu w ui-contracts.md:
    Serena: search_for_pattern(
      substring_pattern="setWindowTitle",
      relative_path="{SOURCE}"
    )
    → Czy tytuł w doc zgadza się z kodem?

CTRL-3.5: Screenshoty i mockupy (jeśli dostępne)
  Glob: .analysis/{ARTIFACT_ID}/mockups/*.html
  → Czy każdy dialog z ui-contracts.md ma mockup?
  → Czy sekcja "Źródła ekstrakcji" jest wypełniona?
```

### FAZA 4 — Call Graph

**Plik:** `.analysis/{ARTIFACT_ID}/call-graph.md`

```
CTRL-4.1: Pokrycie connect()
  Serena: search_for_pattern(
    substring_pattern="connect\\(",
    relative_path="{ARTIFACT_FOLDER}",
    paths_include_glob="**/*.cpp"
  )
  → Zlicz unikalne connect() w kodzie
  → Porównaj z "Połączenia connect() łącznie" w call-graph.md
  → Jeśli call-graph < 70% faktycznych: FAIL

CTRL-4.2: Sygnały — konsystencja z inventory
  Z inventory.md wyciągnij wszystkie sygnały
  Z call-graph.md wyciągnij sygnały w tabelach
  → Sygnały w inventory ale nie w call-graph → powinny być w "Missing Coverage"
  → Sygnały w call-graph ale nie w inventory → WARNING (niespójność)

CTRL-4.3: Cross-artifact — deep check
  Dla każdego połączenia cross-artifact:
    Serena: search_for_pattern(
      substring_pattern="{SOCKET_PATTERN}",
      relative_path="{SOURCE}"
    )
    → Czy mechanizm komunikacji (TCP/UDP/HTTP) jest poprawnie opisany?
```

### FAZA 5 — Facts

**Plik:** `.analysis/{ARTIFACT_ID}/facts.md`

```
CTRL-5.1: Source references
  Przejrzyj WSZYSTKIE reguły Gherkin w facts.md
  → Ile ma komentarz "# Źródło: {plik}:{linia}" lub "# Pewność: ..."?
  → Reguły bez source: WARNING per brakujący
  → Jeśli > 30% bez source: FAIL

CTRL-5.2: Reguły — deep check (5 reguł)
  Wybierz 5 losowych reguł Gherkin z facts.md
  Dla każdej:
    Serena: find_symbol lub Read (na wskazanym source)
    → Czy logika w kodzie odpowiada regule Gherkin?
    → Czy warunki Given/When/Then są dokładne?

CTRL-5.3: Limity i stałe
  Wybierz 5 losowych limitów z sekcji "Ograniczenia i limity"
  Serena: search_for_pattern(substring_pattern="{STALA_NAZWA}")
  → Czy wartość w facts.md zgadza się z kodem?

CTRL-5.4: Linux-specific kompletność
  Z inventory.md wyciągnij sekcje "Linux-specific" z klas
  → Czy facts.md zawiera wszystkie zidentyfikowane komponenty?
```

### FAZA 6 — SPEC

**Plik:** `.analysis/{ARTIFACT_ID}/SPEC.md`

```
CTRL-6.1: Kompletność sekcji
  SPEC.md powinien mieć 14 sekcji.
  → Sprawdź czy żadna sekcja nie jest pusta lub "TODO"

CTRL-6.2: Konsystencja z inputami
  → Encje w Sekcji 2 ⊆ klasy z inventory.md?
  → Use cases w Sekcji 3 ⊆ use cases z facts.md?
  → UI w Sekcji 7 ⊆ okna z ui-contracts.md?
  → Sygnały w Sekcji 6 ⊆ przepływy z call-graph.md?

CTRL-6.3: Platform independence (Gate 2)
  Szukaj w Sekcjach 3, 4, 7 słów:
  JACK, ALSA, D-Bus, cdparanoia, MySQL, /dev/, /etc/, syslog, PAM
  → Te słowa powinny być TYLKO w Sekcji 11
  → Każde wystąpienie poza Sekcją 11: WARNING

CTRL-6.4: Gherkin quality
  Wybierz 3 losowe reguły z Sekcji 4
  → Czy mają happy path + negative scenario?
  → Czy Given/When/Then są konkretne (nie ogólnikowe)?
```

### FAZA 7 — Feature Decomposition

**Plik:** `.analysis/{ARTIFACT_ID}/Features/{PREFIX}-*.md`

```
CTRL-7.1: Pokrycie use cases
  Z SPEC.md Sekcja 3 wyciągnij listę use cases
  Z Features/ wyciągnij use cases ze wszystkich FEAT
  → Każdy UC z SPEC musi być w jakimś FEAT
  → Brakujące UC: FAIL

CTRL-7.2: Zależności — cykl
  Zbuduj graf depends_on z frontmatter każdego FEAT
  → Czy istnieje cykl A→B→A?
  → Jeśli tak: FAIL

CTRL-7.3: Kompletność frontmatter
  Dla każdego FEAT:
    → id: nie puste?
    → depends_on: tablica (może być pusta)?
    → blocks: tablica (może być pusta)?
    → status: pending?

CTRL-7.4: Granica odpowiedzialności
  Dla każdego FEAT:
    → Sekcja "IN SCOPE" nie jest pusta?
    → Sekcja "OUT OF SCOPE" nie jest pusta?
    → OUT OF SCOPE wskazuje na inne FEAT?
```

---

## Krok 3 — Zapisz raport QA

Zapisz: `.analysis/{ARTIFACT_ID}/_qa/qa-phase-{N}-cycle-{C}.md`

```markdown
---
artifact: {ARTIFACT_ID}
phase: {N}
cycle: {C}
verified_at: {YYYY-MM-DD}
status: pass | fail | pass_with_warnings
checks_total: {N}
checks_passed: {N}
checks_warned: {N}
checks_failed: {N}
bugs_logged: {N}
agent_version: 1.1.0
---

# QA Report: Phase {N} — {ARTIFACT_ID} (Cycle {C})

## Podsumowanie

| Metryka | Wartość |
|---------|---------|
| Cykl QA | {C} |
| Kontrole łącznie | {N} |
| ✅ Passed | {N} |
| ⚠️ Warning | {N} |
| ❌ Failed | {N} |
| Bugs zalogowane | {N} |
| Status | PASS / FAIL / PASS_WITH_WARNINGS |

## Szczegóły kontroli

### CTRL-{N}.{M}: {Nazwa kontroli}

**Status:** ✅ PASS / ⚠️ WARNING / ❌ FAIL
**Opis:** {co sprawdzano}
**Wynik:** {co znaleziono}
**Dowód:** {plik:linia lub fragment kodu}
**Bug ID:** {BUG-P{N}-{NR} jeśli zalogowany}
```

---

## Krok 4 — Zapisz BUG entries do changelog

Dla każdego wyniku FAIL lub WARNING, dodaj wpis BUG do changelog.

**Format wpisu BUG:**

```markdown
### BUG-P{PHASE}-{NR} | {SEVERITY} | {STATUS}

- **Kontrola:** CTRL-{N}.{M}
- **Cykl:** {C}
- **Data:** {YYYY-MM-DD}
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Status:** open
- **Opis:** {co jest nie tak}
- **Dowód:** {plik:linia lub dokładny opis rozbieżności}
- **Oczekiwany stan:** {co powinno być}
- **Plik do poprawy:** {ścieżka do pliku analizy}
- **Sekcja do poprawy:** {która sekcja w pliku}
```

**Mapowanie severity:**

| Wynik kontroli | Severity | Kiedy |
|---------------|----------|-------|
| FAIL | CRITICAL | Brakujące dane, fałszywe informacje, sprzeczność z kodem |
| FAIL | HIGH | Brak pokrycia >20% elementów, błędny typ komunikacji |
| WARNING | MEDIUM | Pojedyncze brakujące elementy, drobne nieścisłości |
| WARNING | LOW | Kosmetyczne (case mismatch, brak sekcji opcjonalnej) |

**Reguły zapisu do changelog:**

1. Wpis trafia do sekcji `## Phase {N}` w changelog.md
2. Numer BUG: `BUG-P{PHASE}-{KOLEJNY_NR}` (autoincrement w ramach fazy)
3. Jeśli identyczny bug był już zalogowany w poprzednim cyklu i ma status `open`:
   → NIE duplikuj — dodaj komentarz `Re-confirmed in cycle {C}`
4. Jeśli bug z poprzedniego cyklu ma status `fixed` ale nadal występuje:
   → Zmień status na `reopened`, dodaj komentarz

**Po dodaniu BUG entries zaktualizuj tabelę Podsumowanie w changelog:**

```
→ Przelicz: total_bugs, open_critical, open_high, open_medium, open_low
→ Ustaw status fazy: unstable (jeśli open CRIT/HIGH) | stable (jeśli brak CRIT/HIGH) | clean (zero open)
→ Inkrementuj qa_cycles dla fazy
```

---

## Krok 5 — Raport końcowy

Wyświetl użytkownikowi:
```
QA Phase {N} Cycle {C} — {ARTIFACT_ID}
Status: {PASS/FAIL/PASS_WITH_WARNINGS}
Bugs: {N new} logged, {M existing} re-confirmed, {K} already fixed
Open: {CRIT} critical, {HIGH} high, {MED} medium, {LOW} low

Następny krok:
  Jeśli open CRIT/HIGH > 0:
    → /qtre-qa-fix {ARTIFACT_ID} {PHASE}   (autonomiczna naprawa)
  Jeśli open == 0:
    → Faza {N} jest CLEAN. Kontynuuj do fazy {N+1}.
```

---

## Warunek done

```
Raport QA istnieje w _qa/qa-phase-{N}-cycle-{C}.md
Changelog zaktualizowany (BUG entries dodane)
Tabela podsumowania w changelog przeliczona
Status ogólny ustalony
```
