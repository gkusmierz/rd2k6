Uruchom agenta QA (Phase Verification) dla artefaktu.

## Parametry

Argument: `ARTIFACT_ID PHASE_NUMBER`
Przykład: `/qtre-qa LIB 3`

## Instrukcje

1. Wczytaj definicję agenta: `.claude/agents/PHASE-QA-verify.md`
2. Uruchom agenta z parametrami:
   - `ARTIFACT_ID` = pierwszy argument (np. LIB)
   - `PHASE` = drugi argument (np. 3)
3. Agent wykonuje kontrole specyficzne dla danej fazy
4. Output trafia do `.analysis/{ARTIFACT_ID}/_qa/qa-phase-{N}.md`
5. Wyświetl podsumowanie (pass/fail/warnings) po zakończeniu

## Uwagi

- Agent QA NIE modyfikuje żadnych plików — tylko czyta i raportuje
- Uruchamiaj po zakończeniu każdej fazy, PRZED rozpoczęciem następnej
- Jeśli status = FAIL → popraw problemy przed kontynuacją
- Jeśli status = PASS_WITH_WARNINGS → decyzja użytkownika czy kontynuować
