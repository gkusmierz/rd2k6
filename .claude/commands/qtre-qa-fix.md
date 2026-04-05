Uruchom agenta QA-FIX (autonomiczna naprawa) dla artefaktu.

## Parametry

Argument: `ARTIFACT_ID PHASE_NUMBER [opis problemu...]`
Przykład: `/qtre-qa-fix LIB 3` (napraw open bugs z changelog)
Przykład: `/qtre-qa-fix LIB 3 RDCae jest opisany jako UDP ale primary to TCP` (zgłoś + napraw)

## Instrukcje

1. Wczytaj definicję agenta: `.claude/agents/PHASE-QA-fix.md`
2. Parsuj argumenty:
   - `ARTIFACT_ID` = pierwszy argument (np. LIB)
   - `PHASE` = drugi argument (np. 3)
   - `BUG_DESCRIPTION` = reszta argumentów (opcjonalny opis problemu)
3. Uruchom agenta z parametrami ARTIFACT_ID, PHASE, i opcjonalnie BUG_DESCRIPTION
4. Agent:
   - Jeśli podano opis → loguje ręczny BUG, weryfikuje z kodem, naprawia
   - Zawsze → czyta changelog, naprawia open bugs, loguje FIX entries
5. Wyświetl podsumowanie (fixed/skipped/remaining) po zakończeniu

## Uwagi

- Agent naprawia TYLKO pliki w `.analysis/` — nigdy kod źródłowy
- Ręczne zgłoszenia są weryfikowane z kodem — agent nie przyjmuje bezkrytycznie
- Jeśli bug wymaga ludzkiej decyzji → oznacza jako `needs_human_review`
- Po naprawie uruchom `/qtre-qa ARTIFACT_ID PHASE` żeby zweryfikować poprawki
- Alternatywa: `/qtre-qa-report` robi to samo ale TYLKO loguje+naprawia zgłoszenie (nie rusza reszty)
