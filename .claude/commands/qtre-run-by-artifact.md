Uruchom orkiestrację w trybie ARTIFACT-FIRST — dla każdego artefaktu przetwórz wszystkie fazy.

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Przeczytaj plik `.claude/agents/ORCHESTRATOR-by-artifact.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (opcjonalnie: ARTIFACT_FILTER lub priority:N).

Przykłady użycia:
- `/qtre-run-by-artifact` — pełny przebieg dla wszystkich artefaktów (wg priorytetu)
- `/qtre-run-by-artifact LIB,HPI` — tylko podane artefakty
- `/qtre-run-by-artifact priority:3` — zacznij od priorytetu 3

Kluczowe zasady:
1. Sub-agenty uruchamiaj za pomocą Agent tool — każdy sub-agent prowadzi JEDEN artefakt przez WSZYSTKIE fazy
2. Każdy sub-agent ma własny kontekst — brak ryzyka context exhaustion
3. Twoja rola to TYLKO orkiestracja: planowanie, uruchamianie, monitorowanie, raportowanie
4. Sub-agent sam czyta pliki agentów z .claude/agents/ i wykonuje fazy sekwencyjnie
5. Respektuj limit 3 równoległych sub-agentów (pipeline jest ciężki)
