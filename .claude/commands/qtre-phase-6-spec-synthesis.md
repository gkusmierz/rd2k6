Uruchom agenta PHASE-6 — SPEC Synthesis.

Przeczytaj plik `.claude/agents/PHASE-6-spec-synthesis.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę artifaktów ze statusem phase-5 = done. Pozwól użytkownikowi wybrać artifact.

Przed startem zweryfikuj warunki wejścia opisane w agencie (fazy 2, 3, 4, 5 muszą być done). Agent jest monolityczny — brak sub-agentów.
