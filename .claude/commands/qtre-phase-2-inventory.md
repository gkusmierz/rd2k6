Uruchom agenta PHASE-2 — Inventory Build (Orchestrator).

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Przeczytaj plik `.claude/agents/PHASE-2-inventory.md` i wykonaj wszystkie kroki opisane w tym agencie. Sub-agentów uruchamiaj zgodnie z `.claude/agents/PHASE-2-inventory-subagent.md`.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę artifaktów ze statusem phase-1 = done. Pozwól użytkownikowi wybrać artifact.

Przed startem zweryfikuj warunki wejścia opisane w agencie. Sub-agentów uruchamiaj równolegle za pomocą narzędzia Agent.
