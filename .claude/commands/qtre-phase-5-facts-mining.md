Uruchom agenta PHASE-5 — Facts Mining.

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Przeczytaj plik `.claude/agents/PHASE-5-facts-mining.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę artifaktów ze statusami faz 3 i 4 = done. Pozwól użytkownikowi wybrać artifact.

Przed startem zweryfikuj warunki wejścia opisane w agencie (fazy 2, 3, 4 muszą być done). Sub-agentów uruchamiaj równolegle za pomocą narzędzia Agent.
