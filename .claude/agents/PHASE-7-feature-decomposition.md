# PHASE-7 — Feature Decomposition Agent
## Wersja: 1.0.0 | Faza: 7 | Scope: per artifact

---

## Cel

Zdekomponować SPEC.md na zestaw FEAT-*.md — samowystarczalne wsady dla agentów
kodujących (spec-kitty i podobne). Każdy FEAT ma jasną granicę, kontekst,
reguły biznesowe i informację o tym od czego zależy i co blokuje.

Master Agent robi topological sort z grafu depends_on/blocks.

---

## Wejście

```
Wymagane:
  .analysis/{ARTIFACT_ID}/SPEC.md         (phase=6, status=done)
  .analysis/{PROJECT}.manifest.md          (dla cross-artifact depends_on)
```

---

## Kroki wykonania

### Krok 1 — Identyfikacja feature clusters

Przeczytaj SPEC.md Sekcja 3 (Use Cases) i Sekcja 14 (E2E Scenarios).

Grupuj use cases w **klastry** według:
```
1. Wspólny kontekst biznesowy (np. "wszystko związane z Cart")
2. Wspólne dane (operują na tych samych encjach)
3. Naturalna kolejność wykonania (A musi być przed B)
4. Wspólny widok UI (operują w tym samym oknie)
```

Zasada granularności:
```
ZBYT MAŁE → merge (jeśli feature ma < 2 use cases)
W SAM RAZ → osobny FEAT (2-8 use cases, jeden kontekst)
ZBYT DUŻE → podziel (jeśli feature ma > 8 use cases lub > 2 okna UI)
```

### Krok 2 — Uruchom sub-agenty per cluster

Dla każdego klastra uruchom sub-agenta który pisze FEAT draft:

**Sub-agent: per cluster**

Parametry: ARTIFACT_ID, PREFIX, CLUSTER_NR, lista use cases

```
Sub-agent tworzy: .analysis/{ARTIFACT_ID}/_partials/feat-draft-{NR}.md
```

Format draftu — kluczowe sekcje:
```markdown
# FEAT DRAFT {NR}: {Tytuł}

## Use Cases z SPEC.md
{lista use cases z Sekcji 3 należących do tego klastra}

## Reguły biznesowe
{reguły Gherkin z Sekcji 4 dotyczące tego klastra}

## Encje domenowe
{encje z Sekcji 2 używane przez ten cluster}

## UI Contracts
{okna/dialogi z Sekcji 7 należące do tego klastra}

## Zależności (wstępna ocena)
DEPENDS ON: {inne features które muszą być gotowe najpierw}
BLOCKS: {inne features które czekają na ten}
```

### Krok 3 — Master Agent: Topological Sort

Po ukończeniu wszystkich sub-agentów:

1. Wczytaj wszystkie feat-draft-*.md
2. Zbuduj graf zależności:
   ```
   Dla każdego FEAT:
     depends_on = lista FEAT które muszą być done wcześniej
     blocks = lista FEAT które czekają na ten
   ```
3. Wykonaj topological sort
4. Przypisz numery sekwencyjne (001, 002...) w kolejności wykonania
5. Sprawdź circular deps — jeśli istnieją → przerwij i zgłoś
6. Przypisz cross-artifact depends_on (z manifest.md)

### Krok 4 — Zapisz finalne FEAT-*.md

Dla każdego FEAT (w kolejności topological sort) utwórz:
`.analysis/{ARTIFACT_ID}/Features/{PREFIX}-{NNN}.md`

Używaj szablonu `.claude/templates/FEAT.md`.

---

## Format FEAT-{NNN}.md — kompletna specyfikacja

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
agent_version: 1.0.0
---

# {PREFIX}-{NNN}: {Tytuł}

## Kontekst biznesowy
{2-4 zdania: po co ta feature istnieje, jaki problem rozwiązuje,
kto jej używa. Zero implementacji.}

## Aktorzy
{kto używa tej features: operator, administrator, system, etc.}

## Granica funkcjonalności
```
IN SCOPE:
  - {co jest w tej feature}
  - {kolejna rzecz}

OUT OF SCOPE:
  - {co celowo pominięto — należy do innego FEAT}
  - {np. LIB-007 obsługuje X}
```

## Use Cases
| ID | Aktor | Akcja | Efekt | Scenariusz Gherkin |
|----|-------|-------|-------|-------------------|
| UC-1 | Operator | Otwiera edytor Cart | Wyświetla formularz | FEAT-{NNN}-UC1 |
| UC-2 | Operator | Zapisuje Cart | Cart trafia do bazy | FEAT-{NNN}-UC2 |

## Reguły biznesowe (Gherkin)

```gherkin
Rule: {nazwa reguły}

  Scenario: {happy path}
    Given {warunek wstępny}
    When {akcja}
    Then {oczekiwany efekt}
    And {efekt uboczny}

  Scenario: {edge case / negative}
    Given {warunek wstępny}
    When {akcja która powinna się nie udać}
    Then {oczekiwany komunikat błędu lub brak efektu}
```

## UI Contracts (dla tej features)
{wyciąg z ui-contracts.md dotyczący tej features}
Pełny UI Contract: `.analysis/{ARTIFACT_ID}/ui-contracts.md#{WINDOW_NAME}`

## Dane i encje domenowe
| Encja | Operacje | Pola wymagane | Pola opcjonalne |
|-------|----------|--------------|-----------------|
| Cart | CREATE, READ, UPDATE | cart_number, title | description |

## Platform Independence
| Funkcja | Rivendell (Linux) | Klon (do zastąpienia) | Priorytet |
|---------|-------------------|-----------------------|-----------|
| {np. audio play} | JACK | [wybór implementatora] | CRITICAL |

## Sygnały integracji (z innymi FEAT)
| Zdarzenie | Emitowane przez | Odbierane przez | FEAT |
|-----------|----------------|-----------------|------|
| cartSaved(int) | ta feature | library index update | {PREFIX}-{NNN} |

## Open Questions dla agenta PM
- [ ] {pytanie które wymaga decyzji przed implementacją}
- [ ] {np. Czy wspieramy równoległy rip wielu CD?}

## Acceptance Criteria (E2E)
{E2E scenariusze z Sekcji 14 SPEC.md dotyczące tej features}
```

---

## Warunek done

```
Dla każdego FEAT:
  - Plik {PREFIX}-{NNN}.md istnieje w Features/
  - Frontmatter kompletny (id, depends_on, blocks, status)
  - Sekcja "Kontekst biznesowy" wypełniona
  - Co najmniej 2 scenariusze Gherkin
  - "Open Questions" wypełnione lub "Brak otwartych pytań"

Topological sort jest możliwy (brak circular deps)
Artifact status w manifest.md → done
Sessions Log zaktualizowany
```

## Co dalej

Przejdź do następnego artifaktu z manifest.md (kolejny priorytet).
Lub jeśli wszystkie done → całość gotowa dla agenta PM (spec-kitty / scrum master).
