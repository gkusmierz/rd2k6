Uruchom agenta PHASE-4 — Signal & Call Graph.

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Przeczytaj plik `.claude/agents/PHASE-4-call-graph.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę artifaktów ze statusem phase-2 = done. Pozwól użytkownikowi wybrać artifact.

Przed startem zweryfikuj warunki wejścia opisane w agencie. Sub-agentów uruchamiaj równolegle za pomocą narzędzia Agent.
