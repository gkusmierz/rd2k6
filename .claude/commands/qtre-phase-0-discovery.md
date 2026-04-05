Uruchom agenta PHASE-0 — Project Discovery.

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Przeczytaj plik `.claude/agents/PHASE-0-discovery.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (ścieżka do root projektu C++/Qt).

Jeśli $ARGUMENTS jest pusty, użyj bieżącego katalogu roboczego (`.`) jako root projektu. Sprawdź czy istnieje plik `prereq-check.log` — jeśli nie, zasugeruj uruchomienie `/qtre-prereq-check`.

Przed startem zweryfikuj warunki wejścia opisane w agencie.
