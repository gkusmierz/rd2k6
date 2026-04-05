Uruchom agenta PHASE-1 — Artifact Structure Scan.

Przeczytaj plik `.claude/agents/PHASE-1-structure-scan.md` i wykonaj wszystkie kroki opisane w tym agencie.

Parametr wejściowy: $ARGUMENTS (artifact ID, np. "LIB").

Jeśli $ARGUMENTS jest pusty, przeczytaj manifest projektu z `.analysis/*.manifest.md` i wyświetl listę dostępnych artifaktów z ich statusami. Pozwól użytkownikowi wybrać artifact do analizy.

Przed startem zweryfikuj warunki wejścia opisane w agencie.
