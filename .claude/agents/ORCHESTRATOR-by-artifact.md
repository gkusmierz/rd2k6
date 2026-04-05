# ORCHESTRATOR — By Artifact (Artifact-First Mode)

## Cel

Orkiestrator trybu "artifact-first": dla każdego artefaktu wykonuje **wszystkie fazy** (1→7)
sekwencyjnie, zanim przejdzie do następnego artefaktu. Artefakty o tym samym priorytecie
mogą być przetwarzane **równolegle**.

## Tryb pracy

```
Priorytet 0: [LIB(1→7), HPI(1→7), WCA(1→7)] — równolegle
Priorytet 1: [CAE(1→7), RPC(1→7)] — równolegle
Priorytet 2: [AIR(1→7), ADM(1→7)] — równolegle
...
Priorytet 10: [TST(1→7)]
```

W ramach jednego artefaktu fazy wykonywane są **sekwencyjnie** (z wyjątkiem 3+4 równolegle).

## Parametry wejściowe

- `$ARGUMENTS` — opcjonalnie: `ARTIFACT_FILTER` lub `START_PRIORITY`
  - Bez argumentów: przetwarza wszystkie artefakty od priorytetu 0
  - `LIB,HPI` — tylko podane artefakty (pomija priorytetowanie)
  - `priority:3` — zaczyna od priorytetu 3 (pomija 0, 1, 2)

## Algorytm

### Krok 1: Wczytaj kanban i dependency graph z manifestu

1. Przeczytaj manifest: `.analysis/*.manifest.md`
2. Sparsuj tabelę `Artifacts` — kolumny P1-P7 to kanban board
3. Sparsuj tabelę `Dependency Graph` — kolumna `Depends On`
4. Jeśli podano filtr, ogranicz listę
5. Grupuj artefakty wg priorytetu (kolumna `Pri`)

**WAŻNE**: Manifest jest jedynym źródłem prawdy. NIE skanuj frontmatter poszczególnych plików.

### Warunek zależności (inter-artifact)

Przed uruchomieniem fazy N ≥ 2 dla artefaktu, sprawdź:
- Wszystkie artefakty z `Depends On` muszą mieć P{N}=done
- Przykład: CAE depends on LIB,HPI → CAE.P3 może wystartować gdy LIB.P3=done I HPI.P3=done
- Faza 1: nie wymaga zależności (skanuje tylko pliki)

Jeśli zależność nie jest spełniona — artefakt jest BLOCKED. Sub-agent nie startuje.

### Krok 2: Dla każdej grupy priorytetowej (od 0 wzwyż)

1. **Uruchom pipeline per artefakt równolegle** (max 5 równoległych):
   - Każdy sub-agent otrzymuje jedno zadanie: przeprowadzić artefakt przez WSZYSTKIE fazy

2. **Prompt dla sub-agenta pipeline**:
   ```
   Przeprowadź artefakt {ARTIFACT_ID} przez fazy od {START_PHASE} do 7.
   
   BOOTSTRAP (wykonaj NAJPIERW):
   1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
   2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
   Bez tego narzędzia Serena NIE BĘDĄ DOSTĘPNE (są to deferred tools).
   
   Dla każdej fazy N:
   1. Przeczytaj plik .claude/agents/PHASE-{N}-{name}.md
   2. Wykonaj wszystkie kroki opisane w agencie (Krok 0 Bootstrap już zrobiony — pomiń)
   3. Zweryfikuj że output ma status=done w frontmatter
   4. Przejdź do fazy N+1
   
   Specjalne przypadki:
   - Fazy 3 i 4 uruchom sekwencyjnie (jesteś sub-agentem, nie możesz spawnować sub-sub-agentów bezpośrednio)
   - Faza 2 wymaga uruchomienia sub-agentów — użyj Agent tool
   
   Start: sprawdź aktualny status artefaktu w .analysis/{ARTIFACT_ID}/
   i zacznij od pierwszej niezakończonej fazy.
   
   Artifact ID: {ARTIFACT_ID}
   ```

3. **Poczekaj na zakończenie grupy**

4. **Raportuj postęp**:
   ```
   === PRIORYTET {P} ZAKOŃCZONY ===
   ✓ LIB — all phases done (1→7)
   ✓ HPI — all phases done (1→7)
   ✗ WCA — failed at phase 3 (reason)
   Następna grupa: priorytet {P+1}
   ```

### Krok 3: Podsumowanie

Po zakończeniu wszystkich grup wyświetl tabelę końcową.

## Ustalanie START_PHASE per artefakt (resumowalność)

Odczytaj wiersz artefaktu z tabeli kanban w manifeście:

```
| LIB | librd | library | 0 | done | done | done | pending | pending | pending | pending |
```

Skanuj kolumny P1-P7 od lewej do prawej:
- Pierwsza kolumna ze statusem != `done` → to jest START_PHASE
- Jeśli status = `in-progress` → poprzednia sesja została przerwana, **wznów tę fazę**
- Jeśli status = `failed` → pomiń artefakt (chyba że użytkownik wyraźnie każe retry)

**To działa niezależnie od trybu** — jeśli wcześniej uruchomiłeś `/qtre-run-by-phase`
który ukończył fazy 1-3 dla wszystkich artefaktów, a teraz uruchamiasz `/qtre-run-by-artifact`,
to pipeline każdego artefaktu automatycznie zacznie od fazy 4.

Manifest jest jedynym źródłem prawdy — **stan przetrwa między sesjami i trybami**.

## Mapowanie faz na agentów

| Faza | Agent | Plik |
|------|-------|------|
| 1 | Structure Scan | PHASE-1-structure-scan.md |
| 2 | Inventory Build | PHASE-2-inventory.md |
| 3 | UI Extraction | PHASE-3-ui-extraction.md |
| 4 | Call Graph | PHASE-4-call-graph.md |
| 5 | Facts Mining | PHASE-5-facts-mining.md |
| 6 | SPEC Synthesis | PHASE-6-spec-synthesis.md |
| 7 | Feature Decomposition | PHASE-7-feature-decomposition.md |

## Obsługa błędów

- Jeśli faza się nie powiedzie dla artefaktu, **zatrzymaj pipeline tego artefaktu**.
- Inne artefakty kontynuują niezależnie.
- Na końcu grupy raportuj który artefakt się zatrzymał i na której fazie.
- Loguj sesje do manifestu.

## Ograniczenia paralelizmu

- Maksymalnie **3 artefakty równolegle** (pipeline jest ciężki — każdy artefakt = 7 faz)
- Wewnątrz pipeline: sekwencyjnie (z wyjątkiem phase-3+4 jeśli agent wspiera)

## Ochrona kontekstu orkiestratora

WAŻNE: Jako orkiestrator musisz chronić swój kontekst. Przestrzegaj tych reguł:

1. **Nie czytaj plików źródłowych ani agentów** — to robią sub-agenty
2. **Trzymaj minimalny stan** — lista artefaktów + 1 linia statusu per artefakt
3. **Sprawdzanie frontmatter**: czytaj TYLKO pierwsze 10 linii pliku (offset=0, limit=10)
4. **Nie akumuluj historii** — po zakończeniu grupy priorytetowej, wynik to 1 linia per artefakt
5. **Raporty krótko** — max 3-5 linii per grupa priorytetowa
