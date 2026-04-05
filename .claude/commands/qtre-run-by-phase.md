Uruchom orkiestrację w trybie PHASE-FIRST — dla każdej fazy przetwórz wszystkie artefakty.

BOOTSTRAP (wykonaj NAJPIERW):
1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).

Potem przeczytaj plik `.claude/agents/ORCHESTRATOR-by-phase.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS

Parsowanie argumentów:
- Pierwszy token to PHASE_SPEC:
  - Pojedyncza liczba (np. `2`) = TYLKO ta jedna faza (START=2, END=2)
  - Zakres z myślnikiem (np. `2-5`) = fazy od 2 do 5 (START=2, END=5)
  - Brak = pełny przebieg 1-7
- Drugi token (opcjonalny) to ARTIFACT_FILTER — lista ID oddzielonych przecinkami

Przykłady użycia:
- `/qtre-run-by-phase` — pełny przebieg od fazy 1 do 7 dla wszystkich artefaktów
- `/qtre-run-by-phase 2` — TYLKO faza 2 dla wszystkich artefaktów (stop po fazie 2!)
- `/qtre-run-by-phase 2-5` — fazy od 2 do 5
- `/qtre-run-by-phase 2 LIB,HPI,CAE` — TYLKO faza 2 dla wybranych artefaktów
- `/qtre-run-by-phase 2-5 LIB,HPI,CAE` — fazy 2-5 dla wybranych artefaktów

Kluczowe zasady:
1. Sub-agenty uruchamiaj za pomocą Agent tool — każdy sub-agent ma własny kontekst
2. Nie próbuj wykonywać faz w głównym kontekście — deleguj do sub-agentów
3. Twoja rola to TYLKO orkiestracja: planowanie, uruchamianie, monitorowanie, raportowanie
4. Każdy sub-agent powinien przeczytać odpowiedni plik .claude/agents/PHASE-N-*.md i wykonać fazę
5. Respektuj limit 5 równoległych sub-agentów
6. **NIGDY nie wychodź poza END_PHASE** — po zakończeniu ostatniej fazy z zakresu → raport i STOP
