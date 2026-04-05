# ORCHESTRATOR — By Phase (Phase-First Mode)

## Cel

Orkiestrator trybu "phase-first": dla każdej fazy (1→7) przetwarza **wszystkie** artefakty,
zanim przejdzie do następnej fazy. W ramach jednej fazy artefakty przetwarzane są
**równolegle** (z uwzględnieniem priorytetów i zależności).

## Tryb pracy

```
Faza 1: [LIB, HPI, WCA] → [CAE, RPC] → [AIR, ADM] → ... → [TST]
Faza 2: [LIB, HPI, WCA] → [CAE, RPC] → [AIR, ADM] → ... → [TST]
Fazy 3+4 równolegle: [LIB, HPI, WCA] → ...
Faza 5: [LIB, HPI, WCA] → ...
Faza 6: [LIB, HPI, WCA] → ...
Faza 7: [LIB, HPI, WCA] → ...
```

Artefakty o tym samym priorytecie mogą być uruchamiane równolegle (Agent tool).
Artefakty o wyższym priorytecie (niższy numer) muszą zakończyć się przed niższym.

## Parametry wejściowe

- `$ARGUMENTS` — opcjonalnie: `PHASE_SPEC` lub `PHASE_SPEC ARTIFACT_FILTER`
  - Bez argumentów: zaczyna od fazy 1 do 7 dla wszystkich artefaktów
  - `2` — **TYLKO faza 2** (jedna faza, nie zakres!)
  - `2-5` — fazy od 2 do 5 (zakres jawny)
  - `2 LIB,HPI,CAE` — TYLKO faza 2 dla podanych artefaktów
  - `2-5 LIB,HPI,CAE` — fazy 2-5 dla podanych artefaktów

  **WAŻNE**: Pojedyncza liczba = JEDNA faza. Zakres = myślnik (np. `2-7`).
  NIE wykonuj faz poza podanym zakresem. Po ukończeniu ostatniej fazy z zakresu → STOP.

## Algorytm

### Krok 1: Wczytaj kanban i dependency graph z manifestu

1. Przeczytaj manifest: `.analysis/*.manifest.md`
2. Sparsuj tabelę `Artifacts` — kolumny P1-P7 to kanban board:
   ```
   | ID | Nazwa | Typ | Pri | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
   ```
   Statusy: `pending`, `in-progress`, `done`, `failed`, `skip`
3. Sparsuj tabelę `Dependency Graph` — kolumna `Depends On`:
   ```
   | ID | Depends On | Uwagi |
   ```
4. Jeśli podano `ARTIFACT_FILTER`, ogranicz listę do podanych ID
5. Ustal `START_PHASE` i `END_PHASE` z argumentów:
   - Pojedyncza liczba (np. `2`): START_PHASE=2, END_PHASE=2
   - Zakres (np. `2-5`): START_PHASE=2, END_PHASE=5
   - Brak argumentu: START_PHASE=najniższa faza z artefaktem != `done`, END_PHASE=7

**WAŻNE**: Manifest jest jedynym źródłem prawdy. NIE skanuj frontmatter poszczególnych plików.
Każdy sub-agent po zakończeniu fazy aktualizuje odpowiednią kolumnę P{N} w manifeście.

### Krok 2: Dla każdej fazy N od START_PHASE do END_PHASE

**STOP CONDITION**: Po zakończeniu fazy END_PHASE → ZATRZYMAJ SIĘ. Nie kontynuuj do kolejnych faz.
Jeśli użytkownik podał `2`, wykonaj TYLKO fazę 2 i zakończ z raportem.

1. **Filtruj artefakty** na trzy listy:
   - **SKIP**: artefakty które już mają fazę N ze statusem `done` → **POMIŃ**
   - **READY**: spełniają WSZYSTKIE warunki poniżej
   - **BLOCKED**: nie spełniają któregoś warunku → **POMIŃ, zaloguj powód**

   **Warunki gotowości** (WSZYSTKIE muszą być spełnione):

   a) **Warunek fazowy** — poprzednie fazy artefaktu ukończone:
      - Faza 1: zawsze gotowy (manifest istnieje)
      - Faza 2: wymaga P1=done
      - Faza 3: wymaga P2=done
      - Faza 4: wymaga P2=done
      - Faza 5: wymaga P2,P3,P4=done
      - Faza 6: wymaga P2,P3,P4,P5=done
      - Faza 7: wymaga P6=done

   b) **Warunek zależności** — sprawdź tabelę `Dependency Graph`:
      - Dla fazy N ≥ 2: WSZYSTKIE artefakty z kolumny `Depends On` muszą mieć P{N}=done
      - Przykład: CAE depends on LIB,HPI → CAE może zacząć fazę 3 dopiero
        gdy LIB.P3=done ORAZ HPI.P3=done
      - Faza 1 (structure scan): NIE wymaga zależności (skanuje tylko pliki)

2. **Wyświetl plan fazy** przed uruchomieniem:
   ```
   === FAZA {N} — PLAN ===
   SKIP (already done): LIB, HPI
   READY: WCA, CAE, RPC
   BLOCKED: AIR (brak phase-2)
   ```

3. **Grupuj READY artefakty wg priorytetu** (0, 1, 2, ... 10)

3. **Dla każdej grupy priorytetowej** (od najwyższej):
   - Uruchom fazę N dla wszystkich artefaktów z grupy **równolegle** używając Agent tool
   - Każdy sub-agent dostaje prompt:
     ```
     Uruchom fazę N dla artefaktu {ARTIFACT_ID}.
     
     BOOTSTRAP (wykonaj NAJPIERW):
     1. ToolSearch(query="+serena", max_results=50) — pobierz narzędzia Serena MCP
     2. mcp__serena__initial_instructions() — zainicjalizuj Serenę
     
     Potem przeczytaj plik .claude/agents/PHASE-{N}-{name}.md i wykonaj wszystkie kroki.
     Artifact ID: {ARTIFACT_ID}
     ```
   - Poczekaj na zakończenie wszystkich sub-agentów w grupie
   - Zweryfikuj że wszystkie zakończyły się sukcesem (sprawdź frontmatter status=done)

4. **Specjalny przypadek — fazy 3 i 4**:
   - Fazy 3 i 4 mogą działać równolegle dla tego samego artefaktu
   - Uruchom je jednocześnie: dla każdego artefaktu dwa sub-agenty (phase-3 + phase-4)
   - Po zakończeniu obu, przejdź do fazy 5

5. **Raportuj postęp** po każdej fazie:
   ```
   === FAZA {N} ZAKOŃCZONA ===
   ✓ LIB — done
   ✓ HPI — done
   ✗ WCA — failed (reason)
   Artefakty gotowe: 27/30
   Następna faza: {N+1}
   ```

### Krok 3: Podsumowanie

Po zakończeniu fazy END_PHASE (lub wszystkich faz jeśli zakres pełny) wyświetl tabelę końcową z statusami.
**NIE kontynuuj do kolejnych faz po END_PHASE.**

## Obsługa błędów

- Jeśli artefakt się nie powiedzie w danej fazie, **kontynuuj z pozostałymi**.
- Na końcu fazy wyświetl listę failed artefaktów.
- Następne fazy pomijają artefakty z brakującymi zależnościami.
- Zawsze loguj sesję do manifestu.

## Mapowanie faz na agentów

| Faza | Agent | Nazwa |
|------|-------|-------|
| 1 | PHASE-1-structure-scan.md | Structure Scan |
| 2 | PHASE-2-inventory.md | Inventory Build |
| 3 | PHASE-3-ui-extraction.md | UI Extraction |
| 4 | PHASE-4-call-graph.md | Signal & Call Graph |
| 5 | PHASE-5-facts-mining.md | Facts Mining |
| 6 | PHASE-6-spec-synthesis.md | SPEC Synthesis |
| 7 | PHASE-7-feature-decomposition.md | Feature Decomposition |

## Ograniczenia paralelizmu

- Maksymalnie **5 sub-agentów równolegle** (ochrona zasobów)
- Jeśli grupa priorytetowa ma >5 artefaktów, podziel na batche po 5

## Ochrona kontekstu orkiestratora

WAŻNE: Jako orkiestrator musisz chronić swój kontekst. Przestrzegaj tych reguł:

1. **Nie czytaj plików źródłowych** — to robią sub-agenty, nie ty
2. **Nie czytaj pełnych plików agentów** — sub-agenty same je czytają. Ty tylko podajesz ścieżkę
3. **Trzymaj minimalny stan** — jedyne co potrzebujesz to: lista artefaktów, ich statusy (1 linia per artefakt), i który etap realizujesz
4. **Raporty trzymaj krótko** — max 3-5 linii per faza, nie cytuj outputów sub-agentów
5. **Sprawdzanie frontmatter**: czytaj TYLKO pierwsze 10 linii pliku (offset=0, limit=10), nie cały plik
6. **Nie akumuluj historii** — po zakończeniu fazy, wynik to 1 linia statusu per artefakt

Twój kontekst powinien wyglądać mniej więcej tak:
```
[manifest: 30 artefaktów wczytanych]
[faza 1: LIB✓ HPI✓ WCA✓ CAE✓ ... — 30/30 done]
[faza 2: LIB✓ HPI✓ WCA✗ CAE✓ ... — 29/30 done, 1 failed]
[faza 3: uruchamiam...]
```
