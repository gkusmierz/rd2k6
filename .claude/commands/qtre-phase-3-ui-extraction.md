Uruchom agenta PHASE-3 — UI Extraction.

Przeczytaj plik `.claude/agents/PHASE-3-ui-extraction.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę artifaktów ze statusem phase-2 = done. Pozwól użytkownikowi wybrać artifact.

Przed startem zweryfikuj warunki wejścia opisane w agencie. Sub-agentów uruchamiaj równolegle za pomocą narzędzia Agent.
