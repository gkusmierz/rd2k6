Uruchom pętlę QA: verify → fix → verify aż do stabilności.

## Parametry

Argument: `ARTIFACT_ID PHASE_NUMBER [MAX_CYCLES]`
Przykład: `/qtre-qa-loop LIB 3` (domyślnie max 5 cykli)
Przykład: `/qtre-qa-loop LIB 3 10` (max 10 cykli)

## Instrukcje

1. Ustaw MAX_CYCLES = trzeci argument lub 5 (domyślnie)
2. Uruchom pętlę:

```
for CYCLE in 1..MAX_CYCLES:

  KROK A — Verify
    Uruchom agenta `.claude/agents/PHASE-QA-verify.md`
    z parametrami: ARTIFACT_ID, PHASE
    → Raport: qa-phase-{N}-cycle-{CYCLE}.md
    → BUG entries w changelog

  KROK B — Sprawdź warunek wyjścia
    Read: .analysis/{ARTIFACT_ID}/_qa/changelog.md
    → Policz open bugs z severity CRITICAL i HIGH dla tej fazy
    
    Jeśli open_critical == 0 AND open_high == 0:
      → KONIEC PĘTLI: "Faza {N} osiągnęła status STABLE po {CYCLE} cyklach"
      → Wyświetl podsumowanie: ile bugów naprawiono łącznie, ile open MEDIUM/LOW
      → EXIT

  KROK C — Fix
    Uruchom agenta `.claude/agents/PHASE-QA-fix.md`
    z parametrami: ARTIFACT_ID, PHASE
    → FIX entries w changelog
    → Pliki analizy poprawione

  KROK D — Sprawdź czy fix cokolwiek zmienił
    Jeśli agent fix zgłosił 0 napraw i 0 needs_human_review:
      → KONIEC PĘTLI: "Brak możliwości dalszych napraw. Wymagana interwencja."
      → EXIT
    Jeśli wszystkie remaining bugs mają status needs_human_review:
      → KONIEC PĘTLI: "Remaining bugs wymagają ludzkiej decyzji."
      → EXIT

→ Jeśli pętla osiągnęła MAX_CYCLES:
  → "Osiągnięto limit {MAX_CYCLES} cykli. Faza NIE jest stable."
  → Wyświetl remaining open bugs
```

3. Na końcu wyświetl pełne podsumowanie:

```
QA Loop Summary: Phase {N} — {ARTIFACT_ID}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cykli QA:     {CYCLE}
Total bugs:   {N} znalezionych
Fixed:        {M} naprawionych
Open:         {K} otwartych
  CRITICAL:   {C}
  HIGH:       {H}
  MEDIUM:     {M}
  LOW:        {L}
Human review: {R} wymagających decyzji
Status:       CLEAN / STABLE / UNSTABLE
```

## Uwagi

- Pętla ZAWSZE się zatrzymuje (max cykli, brak postępu, osiągnięcie stabilności)
- Logi z każdego cyklu zachowane w `_qa/qa-phase-{N}-cycle-{C}.md`
- Changelog jest append-only — pełna historia weryfikacji i napraw
- MEDIUM i LOW bugs nie blokują pętli — można je naprawić ręcznie
