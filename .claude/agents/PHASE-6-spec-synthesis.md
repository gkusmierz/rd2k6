# PHASE-6 — SPEC Synthesis Agent
## Wersja: 1.0.0 | Faza: 6 | Scope: per artifact | Typ: monolithic

---

## Cel

Syntetyzować SPEC.md — kompletny obraz WHAT bez HOW.
To jest dokument który wystarczyłby do zbudowania klona od zera
w dowolnej technologii na dowolnej platformie.

Agent jest MONOLITYCZNY — brak sub-agentów.
Wymaga pełnego kontekstu wszystkich poprzednich faz.

---

## Wejście

```
Wymagane (wszystkie muszą mieć status=done):
  .analysis/{ARTIFACT_ID}/inventory.md      (phase=2)
  .analysis/{ARTIFACT_ID}/ui-contracts.md   (phase=3)
  .analysis/{ARTIFACT_ID}/call-graph.md     (phase=4)
  .analysis/{ARTIFACT_ID}/facts.md          (phase=5)

Opcjonalne:
  .analysis/{PROJECT}.manifest.md           (dla kontekstu cross-artifact)
```

**Walidacja wejścia:**
```bash
for f in inventory.md ui-contracts.md call-graph.md facts.md; do
  STATUS=$(grep "^status:" .analysis/{ARTIFACT_ID}/$f | cut -d: -f2 | tr -d ' ')
  [ "$STATUS" = "done" ] || \
    echo "BLOKADA: $f nie ma statusu done (actual: $STATUS)"
done
```

---

## Kroki wykonania

### Krok 1 — Przeczytaj wszystkie wejścia

Wczytaj sekwencyjnie (jeden po drugim, nie równolegle):
1. inventory.md — zrozum domain model
2. call-graph.md — zrozum reaktywność
3. ui-contracts.md — zrozum UI layer
4. facts.md — zrozum reguły biznesowe i use cases

### Krok 2 — Buduj SPEC.md sekcja po sekcji

Używaj szablonu `.claude/templates/SPEC.md`. Wypełnij każdą z 14 sekcji:

**Sekcja 1 — Project Overview**
- Co robi ten artifact (2-3 zdania, zero technologii)
- Główni użytkownicy / aktorzy
- Kluczowe wartości biznesowe

**Sekcja 2 — Domain Model**
- Encje biznesowe (z inventory.md, klasy z Q_OBJECT)
- Relacje między encjami
- Kluczowe value objects
- Enums jako zbiory stanów/kategorii

**Sekcja 3 — Functional Capabilities (Use Cases)**
- Lista wszystkich use cases (z facts.md, sekcja tests)
- Aktor → akcja → efekt
- Bez implementacji — tylko co osiąga

**Sekcja 4 — Business Rules (Gherkin)**
- WSZYSTKIE reguły z facts.md przepisane w Gherkin
- Minimum: happy path + edge case per reguła
- Osobny scenariusz per warunek brzegowy

**Sekcja 5 — State Machines**
- Dla każdej encji z "statusem" lub "stanem"
- Stany, przejścia, triggery, efekty uboczne
- Format: Mermaid stateDiagram-v2

**Sekcja 6 — Reactive Architecture (Qt-specific)**
- Graf sygnałów z call-graph.md w czytelnej formie
- Kluczowe przepływy zdarzeń opisane słownie
- Cross-artifact eventy (D-Bus lub inne)

**Sekcja 7 — UI/UX Contracts**
- Kompletna lista okien/dialogów z ui-contracts.md
- Dla każdego: dane, interakcje, stany
- Navigation flow między oknami

**Sekcja 8 — Data Flow**
- Jak dane płyną przez warstwy (DB → model → widok → użytkownik)
- Transformacje danych
- Format: diagram lub tabela

**Sekcja 9 — Error Taxonomy**
- Wszystkie błędy zidentyfikowane w facts.md
- Kategorie: user error / system error / external error
- Co system robi dla każdej kategorii

**Sekcja 10 — Integration Contracts**
- Zależności od shared libraries (librd, librdmacro)
- Cross-artifact komunikacja
- Zewnętrzne systemy (baza danych, audio engine, etc.)

**Sekcja 11 — Platform Independence Map**
```markdown
| Funkcja | Rivendell (Linux) | Klon (target) | Priorytet |
|---------|-------------------|---------------|-----------|
| Audio playback | JACK/ALSA | [do ustalenia] | CRITICAL |
| CD ripping | cdparanoia | [do ustalenia] | HIGH |
| IPC | D-Bus | [do ustalenia] | CRITICAL |
| Database | MySQL | [do ustalenia] | HIGH |
```

**Sekcja 12 — Non-Functional Requirements**
- Tylko te udowodnione przez kod (timeouty, cache TTL, pool sizes)
- Format: testowalne scenariusze Gherkin

**Sekcja 13 — Configuration**
- Wszystkie QSettings klucze z domyślnymi wartościami
- Zmienne środowiskowe
- Pliki konfiguracyjne

**Sekcja 14 — E2E Acceptance Scenarios**
- Kompletne user journeys (minimum 3 na artifact)
- Format: Gherkin Feature z wieloma Scenarios
- Pokryj: happy path + najważniejsze edge cases

### Krok 3 — Quality Gates

Przed zapisaniem SPEC.md sprawdź:

```
GATE 1 — Completeness:
  Każdy use case z facts.md ma scenariusz w Sekcji 14?
  Każda encja z Sekcji 2 ma co najmniej jedną regułę w Sekcji 4?
  Każde okno z Sekcji 7 ma co najmniej jeden E2E scenario?

GATE 2 — Platform Independence:
  Sekcja 3, 4, 7 nie zawierają słów:
  JACK, ALSA, D-Bus, cdparanoia, MySQL, /dev/, #ifdef Q_OS_LINUX
  (te należą WYŁĄCZNIE do Sekcji 11)

GATE 3 — Testability:
  Każda reguła w Sekcji 4 ma:
  - co najmniej jeden "happy path" scenario
  - co najmniej jeden "negative" scenario

GATE 4 — Consistency:
  Nazwy encji w Sekcji 2 = nazwy w Sekcjach 4, 5, 7, 8?
```

Jeśli Gate się nie domknie → uzupełnij brakujące sekcje przed zapisem.

---

## Warunek done

```
SPEC.md istnieje z frontmatter phase=6, status=done
Wszystkie 14 sekcji wypełnione (żadna nie jest "TODO" ani pusta)
Wszystkie 4 Quality Gates zaliczone
Sekcja 11 (Platform Independence Map) kompletna
```

## Co dalej

Uruchom `/qtre-phase-7-feature-decomposition ARTIFACT_ID`
