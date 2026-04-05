# ORCHESTRATOR — Bulk Mode

## Cel

Orkiestrator trybu "bulk": maksymalizuje przepustowość przetwarzając **wszystkie artefakty
przez wszystkie fazy** z uwzględnieniem zależności. Łączy zalety obu trybów — 
paralelizuje gdzie może, sekwencjonuje gdzie musi.

## Tryb pracy

```
WAVE 1 (priorytet 0): LIB, HPI, WCA — pełny pipeline 1→7 równolegle
WAVE 2 (priorytet 1): CAE, RPC — pełny pipeline 1→7 równolegle
  (start gdy WAVE 1 zakończy przynajmniej fazę 2 dla zależnych artefaktów)
WAVE 3 (priorytet 2): AIR, ADM — pełny pipeline 1→7 równolegle
...itd.
```

## Parametry wejściowe

- `$ARGUMENTS` — opcjonalnie: `ARTIFACT_FILTER` lub `WAVE_FILTER`
  - Bez argumentów: wszystkie artefakty, wszystkie fazy
  - `LIB,HPI,CAE` — tylko podane artefakty
  - `wave:0-2` — tylko wave'y 0, 1 i 2

## Algorytm

### Krok 1: Wczytaj kanban, dependency graph i zaplanuj wave'y

1. Przeczytaj manifest: `.analysis/*.manifest.md`
2. Sparsuj tabelę `Artifacts` — kolumny P1-P7 to kanban board
3. Sparsuj tabelę `Dependency Graph` — kolumna `Depends On`
4. **WAŻNE**: Manifest jest jedynym źródłem prawdy. NIE skanuj frontmatter plików.

### Warunek zależności (inter-artifact)

Przed uruchomieniem fazy N ≥ 2 dla artefaktu w wave'u, sprawdź:
- Wszystkie artefakty z `Depends On` muszą mieć P{N}=done
- Wave'y naturalnie respektują to (priorytet 0 przed 1), ale sprawdzaj jawnie
- Jeśli zależność failed → artefakt zależny jest automatycznie BLOCKED

5. Zbuduj plan wave'ów:
   - Wave = grupa artefaktów o tym samym priorytecie
   - Wave'y wykonywane sekwencyjnie (wave 0 przed wave 1)
   - Artefakty wewnątrz wave'a — równolegle

4. Sprawdź aktualny stan każdego artefaktu (które fazy done).

### Krok 2: Wyświetl plan i poproś o potwierdzenie

```
=== PLAN BULK PROCESSING ===

Wave 0 (priorytet 0): LIB [start: phase 2], HPI [start: phase 1], WCA [start: phase 1]
Wave 1 (priorytet 1): CAE [start: phase 1], RPC [start: phase 1]
Wave 2 (priorytet 2): AIR [start: phase 1], ADM [start: phase 1]
Wave 3 (priorytet 3): RLB, LGM, LGE, CTH, CTD [all: phase 1]
Wave 4 (priorytet 4): PNL, CST, CSM [all: phase 1]
Wave 5 (priorytet 5): MON, SEL, LGN, SVC, VAP [all: phase 1]
Wave 6 (priorytet 6): PAD, PDD, RSS, RPL [all: phase 1]
Wave 7 (priorytet 7): XPT, WGT [all: phase 1]
Wave 8 (priorytet 8): IMP, UTL [all: phase 1]
Wave 9 (priorytet 9): PYP [start: phase 1]
Wave 10 (priorytet 10): TST [start: phase 1]

Szacowana liczba sub-agentów: {N}
Kontynuować? (tak/nie)
```

### Krok 3: Wykonaj wave'y sekwencyjnie

Dla każdego wave'a:

1. **Uruchom pipeline per artefakt równolegle** (max 3 równoległe):
   - Każdy sub-agent prowadzi artefakt przez pełny cykl faz 1→7
   - Sub-agent sam zarządza sekwencją faz wewnętrznie

2. **Prompt dla sub-agenta pipeline**:
   ```
   Przeprowadź artefakt {ARTIFACT_ID} przez kompletny pipeline reverse engineering.
   
   BOOTSTRAP (wykonaj NAJPIERW):
   1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
   2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
   Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).
   
   Zaczyna od fazy {START_PHASE} (wcześniejsze fazy są już done).
   
   Sekwencja faz:
   1. PHASE-1 (Structure Scan) — przeczytaj .claude/agents/PHASE-1-structure-scan.md
   2. PHASE-2 (Inventory Build) — przeczytaj .claude/agents/PHASE-2-inventory.md
      - Uruchom sub-agentów wg .claude/agents/PHASE-2-inventory-subagent.md
   3. PHASE-3 (UI Extraction) — przeczytaj .claude/agents/PHASE-3-ui-extraction.md
   4. PHASE-4 (Call Graph) — przeczytaj .claude/agents/PHASE-4-call-graph.md
   5. PHASE-5 (Facts Mining) — przeczytaj .claude/agents/PHASE-5-facts-mining.md
   6. PHASE-6 (SPEC Synthesis) — przeczytaj .claude/agents/PHASE-6-spec-synthesis.md
   7. PHASE-7 (Feature Decomposition) — przeczytaj .claude/agents/PHASE-7-feature-decomposition.md
   
   Dla każdej fazy:
   - Przeczytaj plik agenta i wykonaj WSZYSTKIE kroki (Krok 0 Bootstrap już zrobiony — pomiń)
   - Zweryfikuj output (frontmatter status=done)
   - Jeśli faza się nie uda, zatrzymaj się i raportuj
   
   Artifact ID: {ARTIFACT_ID}
   Projekt: {PROJECT_NAME}
   Ścieżka analizy: .analysis/{ARTIFACT_ID}/
   ```

3. **Poczekaj na zakończenie wave'a**

4. **Raportuj**:
   ```
   === WAVE {W} (priorytet {P}) — ZAKOŃCZONY ===
   ✓ LIB — phases 1-7 done
   ✓ HPI — phases 1-7 done
   ✗ WCA — stopped at phase 4 (reason)
   
   Czas trwania wave'a: ~X min
   Następny wave: {W+1}
   ```

### Krok 4: Podsumowanie końcowe

```
=== BULK PROCESSING COMPLETE ===

Artefakty przetworzone: 27/30
Artefakty z błędami: 3
  - WCA: stopped at phase 4
  - ...

Wygenerowane pliki:
  - SPEC.md: 27
  - Features/FEAT-*.md: ~150
```

## Obsługa błędów

- Failure artefaktu **nie blokuje wave'a** — inne artefakty kontynuują
- Failure wave'a **nie blokuje kolejnych wave'ów** (chyba że zależność)
- Na końcu: pełny raport co się udało, co nie, i dlaczego

## Ograniczenia paralelizmu

- **3 artefakty równolegle per wave** (pipeline jest ciężki)
- Wewnątrz pipeline: sekwencyjnie (agent sam zarządza)
- Łączny limit: 3 równoległe sub-agenty

## Resumowalność (kontynuacja między trybami)

Orkiestrator odczytuje kanban z manifestu (kolumny P1-P7) i dla każdego artefaktu
ustala START_PHASE — pierwsza kolumna ze statusem != `done`.

- `in-progress` → poprzednia sesja przerwana, **wznów tę fazę**
- `failed` → pomiń artefakt (chyba że użytkownik każe retry)
- `pending` po ciągu `done` → normalne kontynuowanie

To oznacza:
- Możesz przerwać bulk i wznowić później — ukończone fazy nie będą powtarzane
- Możesz przełączyć się między trybami (by-phase → by-artifact → bulk) — manifest jest wspólny

## Ochrona kontekstu orkiestratora

WAŻNE: Jako orkiestrator musisz chronić swój kontekst:

1. **Nie czytaj plików źródłowych ani agentów** — to robią sub-agenty
2. **Trzymaj minimalny stan** — lista wave'ów + 1 linia statusu per artefakt
3. **Sprawdzanie frontmatter**: czytaj TYLKO pierwsze 10 linii pliku (offset=0, limit=10)
4. **Nie akumuluj historii** — po zakończeniu wave'a, wynik to 1 linia per artefakt
5. **Plan wave'ów**: oblicz raz na starcie, potem nie przeliczaj

## Kiedy użyć tego trybu

- Masz dużo czasu i chcesz przetworzyć cały projekt naraz
- Akceptujesz że niektóre artefakty mogą się nie udać
- Chcesz maksymalnie wykorzystać zasoby
