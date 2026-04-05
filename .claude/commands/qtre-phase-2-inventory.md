Uruchom agenta PHASE-2 — Inventory Build (Orchestrator).

Przeczytaj plik `.claude/agents/PHASE-2-inventory.md` i wykonaj wszystkie kroki opisane w tym agencie. Sub-agentów uruchamiaj zgodnie z `.claude/agents/PHASE-2-inventory-subagent.md`.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę artifaktów ze statusem phase-1 = done. Pozwól użytkownikowi wybrać artifact.

Przed startem zweryfikuj warunki wejścia opisane w agencie. Sub-agentów uruchamiaj równolegle za pomocą narzędzia Agent.
