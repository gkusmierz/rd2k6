Uruchom orkiestrację w trybie BULK — wszystkie artefakty × wszystkie fazy z maksymalnym paralelizmem.

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Przeczytaj plik `.claude/agents/ORCHESTRATOR-bulk.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (opcjonalnie: ARTIFACT_FILTER lub wave:N-M).

Przykłady użycia:
- `/qtre-run-bulk` — przetwórz cały projekt (wave'y 0→10)
- `/qtre-run-bulk LIB,HPI,CAE` — tylko wybrane artefakty
- `/qtre-run-bulk wave:0-2` — tylko wave'y 0, 1 i 2

Kluczowe zasady:
1. PRZED STARTEM wyświetl plan wave'ów i poproś o potwierdzenie
2. Sub-agenty uruchamiaj za pomocą Agent tool — każdy prowadzi artefakt przez pełny pipeline
3. Każdy sub-agent ma własny kontekst — drzewo agentów, brak context exhaustion
4. Wave = grupa artefaktów o tym samym priorytecie, procesowana równolegle
5. Wave'y wykonywane sekwencyjnie (wave 0 musi się skończyć przed wave 1)
6. Limit: 3 równoległe pipeline per wave
7. Twoja rola to TYLKO orkiestracja — deleguj całą pracę do sub-agentów
