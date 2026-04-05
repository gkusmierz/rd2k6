# PHASE-7 — Feature Decomposition Agent
## Wersja: 1.3.0 | Faza: 7 | Scope: per artifact

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Cel

Zdekomponować SPEC.md na zestaw FEAT-*.md — samowystarczalne wsady dla agentów
kodujących (spec-kitty, zenflow, specswarm i podobne).

### Kluczowa zmiana (v1.3.0): FEAT czyta z WIELU źródeł

```
STARA architektura (v1.2):
  SPEC.md → wyciągnij fragment → FEAT
  (FEAT = wycinek streszczenia = utrata 85% informacji)

NOWA architektura (v1.3):
  SPEC.md → dekompozycja na klastry (scope, aktorzy, use cases)
  inventory.md → pełne API klas w scope
  ui-contracts.md → pełne kontrakty UI + mockupy
  call-graph.md → sygnały/sloty dla klas w scope
  facts.md → reguły Gherkin z source references
  SPEC.md Sekcja 3 (Data Model) → tabele DB w scope
  SPEC.md Sekcja 9 (API) → protokoły w scope
  
  FEAT = KOMPLETNY PAKIET do implementacji
```

> **Reguła:** FEAT musi zawierać WSZYSTKO co agent kodujący potrzebuje.
> Agent kodujący NIE POWINIEN musieć czytać inventory.md czy call-graph.md.
> Ale MUSI mieć referencje do ui-contracts.md i mockupów (bo są za duże do skopiowania).

---

## Wejście

```
Wymagane:
  .analysis/{ARTIFACT_ID}/SPEC.md             (phase=6, status=done)
  .analysis/{ARTIFACT_ID}/inventory.md        (phase=2) ← NOWE: bezpośredni dostęp
  .analysis/{ARTIFACT_ID}/ui-contracts.md     (phase=3) ← NOWE: bezpośredni dostęp
  .analysis/{ARTIFACT_ID}/call-graph.md       (phase=4) ← NOWE: bezpośredni dostęp
  .analysis/{ARTIFACT_ID}/facts.md            (phase=5) ← NOWE: bezpośredni dostęp
  .analysis/{PROJECT}.manifest.md             (dla cross-artifact depends_on)
```

---

## Kroki wykonania

### Krok 1 — Identyfikacja feature clusters

Przeczytaj SPEC.md Sekcja 4 (Use Cases) i Sekcja 16 (E2E Scenarios).

Grupuj use cases w **klastry** według:
```
1. Wspólny kontekst biznesowy (np. "wszystko związane z Cart")
2. Wspólne dane (operują na tych samych encjach / tabelach DB)
3. Naturalna kolejność wykonania (A musi być przed B)
4. Wspólny widok UI (operują w tym samym oknie)
```

Zasada granularności:
```
ZBYT MAŁE → merge (jeśli feature ma < 2 use cases)
W SAM RAZ → osobny FEAT (2-8 use cases, jeden kontekst)
ZBYT DUŻE → podziel (jeśli feature ma > 8 use cases lub > 2 okna UI)
```

### Krok 2 — Dla każdego klastra: zbierz KOMPLETNE dane

**To jest kluczowy krok. Sub-agent per klaster musi:**

1. **Z SPEC.md** wyciągnąć:
   - Use cases należące do klastra (Sekcja 4)
   - Data model: tabele DB w scope (Sekcja 3)
   - API/Protocol: komendy w scope (Sekcja 9)
   - E2E scenarios (Sekcja 16)

2. **Z inventory.md** wyciągnąć:
   - Pełne API klas w scope (publiczne metody, parametry, efekty)
   - Sygnały i sloty klas w scope
   - Enums z wartościami
   - Reguły biznesowe z implementacji (guard clauses)

3. **Z ui-contracts.md** wyciągnąć:
   - Pełne kontrakty okien/dialogów w scope (widgety, sloty, walidacje, stany)
   - Ścieżki do mockupów HTML
   - Navigation flow

4. **Z call-graph.md** wyciągnąć:
   - Połączenia connect() między klasami w scope
   - Przepływy zdarzeń dotyczące tego klastra

5. **Z facts.md** wyciągnąć:
   - Reguły Gherkin dotyczące encji w scope (z source references!)
   - Limity i stałe
   - Linux-specific komponenty

### Krok 3 — Master Agent: Topological Sort

Po ukończeniu wszystkich sub-agentów:

1. Wczytaj wszystkie feat-draft-*.md
2. Zbuduj graf zależności
3. Wykonaj topological sort
4. Przypisz numery sekwencyjne (001, 002...)
5. Sprawdź circular deps
6. Przypisz cross-artifact depends_on

### Krok 4 — Zapisz finalne FEAT-*.md

Dla każdego FEAT utwórz:
`.analysis/{ARTIFACT_ID}/Features/{PREFIX}-{NNN}.md`

Używaj szablonu `.claude/templates/FEAT.md`.

---

## Format FEAT-{NNN}.md — KOMPLETNA specyfikacja dla agenta kodującego

```markdown
---
id: {PREFIX}-{NNN}
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa, np. RDLibrary}
title: {krótki tytuł features}
status: pending
depends_on: [{PREFIX}-001, {PREFIX}-003]
blocks: [{PREFIX}-007, LIB-012]
estimated_wp: {szacowana liczba Working Packages}
phase: 7
agent_version: 1.3.0
---

# {PREFIX}-{NNN}: {Tytuł}

## Kontekst biznesowy

{2-4 zdania: po co ta feature istnieje, jaki problem rozwiązuje,
kto jej używa. Zero implementacji.}

## Aktorzy

| Aktor | Rola w tej feature |
|-------|-------------------|
| {Operator} | {co robi} |

## Granica funkcjonalności

```
IN SCOPE:
  - {co wchodzi w skład}
OUT OF SCOPE:
  - {co celowo pominięto} → patrz {PREFIX}-{OTHER}
```

## Use Cases

| ID | Aktor | Akcja | Efekt | Priorytet |
|----|-------|-------|-------|-----------|
| UC-1 | {Aktor} | {co} | {efekt} | MUST |

## Reguły biznesowe (Gherkin)

> Pełne reguły z source references. Skopiowane z facts.md, nie streszczone.

```gherkin
Rule: {Nazwa}
  Scenario: {happy path}
    Given {stan wstępny}
    When  {akcja}
    Then  {oczekiwany efekt}
  # Źródło: {plik}:{linia} | Pewność: potwierdzone
```

## Data Model (tabele DB w scope)

> Skopiowane z SPEC.md Sekcja 3 — tylko tabele dotyczące tego FEAT.

| Tabela | Kolumna | Typ | Opis |
|--------|---------|-----|------|
| CART | NUMBER | int unsigned | PK |
| CART | TYPE | int | 1=Audio, 2=Macro |
| CART | TITLE | varchar(255) | Tytuł |
...

Relacje:
- CART.GROUP_NAME → GROUPS.NAME
- CUTS.CART_NUMBER → CART.NUMBER

## API klas w scope

> Z inventory.md — pełne sygnatury metod, parametry, efekty.

### {NazwaKlasy}

**Odpowiedzialność:** {1-2 zdania}

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| selectCut() | cut*, time | Wybiera cut wg rotation | Cart musi istnieć |

**Sygnały:**
| Sygnał | Parametry | Znaczenie |
|--------|-----------|-----------|
| renamed() | - | Log przemianowany |

**Enums:**
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| PlayOrder | Sequence, Random | Kolejność rotation |

## Protokoły komunikacji (jeśli dotyczy)

> Z SPEC.md Sekcja 9 — tylko komendy używane przez klasy w scope.

| Komenda | Parametry | Odpowiedź | Znaczenie |
|---------|-----------|-----------|-----------|
| PL | handle len speed pitch | PY handle | Play audio |

## UI Contracts (dla tej feature)

> Referencje do pełnych kontraktów + kluczowe widgety.
> Agent kodujący MUSI przeczytać pełne kontrakty i mockupy.

### {NazwaOkna} — {krótki opis}

**Pełny kontrakt:** `ui-contracts.md#RDCartDialog`
**Mockup HTML:** `mockups/RDCartDialog.html`

**Kluczowe widgety w scope tej feature:**
| Widget | Typ | Etykieta | Akcja | Slot |
|--------|-----|----------|-------|------|
| cart_filter_edit | QLineEdit | "Cart Filter:" | filtrowanie | filterChangedData() |
{... tylko widgety relevantne dla tego FEAT}

**Stany widoku:**
| Stan | Kiedy | Efekt |
|------|-------|-------|
| filtered | po wyszukiwaniu | lista przefiltrowana |

**Walidacje:**
| Pole | Reguła | Komunikat | Źródło |
|------|--------|-----------|--------|
| cart selection | wymagane | - | rdcart_dialog.cpp:280 |

## Sygnały integracji (z call-graph.md)

> Połączenia connect() między klasami w scope tej feature i resztą systemu.

**Emitowane (ta feature → inne):**
| Sygnał | Klasa | Odbiorca | Slot | Kontekst |
|--------|-------|----------|------|----------|
| played(int) | RDLogPlay | {zewn. aplikacja} | onPlayed() | Po starcie odtwarzania |

**Odbierane (inne → ta feature):**
| Nadawca | Sygnał | Klasa (tu) | Slot | Kontekst |
|---------|--------|------------|------|----------|
| RDCae | playStopped(int) | RDPlayDeck | stopData() | Po zatrzymaniu audio |

## Platform Independence

| Funkcja | Oryginał | Klon | Priorytet |
|---------|----------|------|-----------|
| Audio play | JACK/ALSA | [implementator] | CRITICAL |

Jeśli feature jest platform-agnostic: "Brak — feature jest platform-agnostic."

## Configuration (klucze w scope)

| Klucz | Typ | Domyślna | Wpływ na tę feature |
|-------|-----|---------|---------------------|
| [Cae] AudioRoot | string | /var/snd | Katalog plików audio |

## Acceptance Criteria (E2E)

```gherkin
Feature: {Tytuł tej feature}
  Scenario: {happy path}
    Given {stan}
    When  {akcja}
    Then  {efekt}
```

## Open Questions

- [ ] {pytanie}

## Working Packages (wstępny podział)

| WP | Opis | Zależności |
|----|------|-----------|
| WP-1 | Domain model: {klasy} | - |
| WP-2 | Data access: {tabele DB} | WP-1 |
| WP-3 | Business logic: {reguły} | WP-1 |
| WP-4 | UI: {dialogi} | WP-1, WP-3 |
| WP-5 | Integration: {sygnały} | WP-3 |
| WP-6 | Tests | WP-1..WP-5 |
```

---

## Warunek done

```
Dla każdego FEAT:
  - Plik {PREFIX}-{NNN}.md istnieje w Features/
  - Sekcja "Data Model" wypełniona (lub "Brak tabel DB")
  - Sekcja "API klas" ma pełne sygnatury z inventory.md
  - Sekcja "UI Contracts" ma referencje do kontraktów i mockupów
  - Sekcja "Sygnały integracji" ma połączenia z call-graph.md
  - Sekcja "Reguły biznesowe" ma source references
  - Sekcja "Protokoły" wypełniona jeśli dotyczy
  - Minimum 2 scenariusze Gherkin E2E

Topological sort bez cykli
Kolumna P7 w manifest.md → done
```

**Po zakończeniu**: zmień kolumnę **P7** w tabeli Artifacts manifestu na done.

## Co dalej

Przejdź do następnego artifaktu z manifest.md.
Lub jeśli wszystkie done → gotowe dla agentów kodujących.
