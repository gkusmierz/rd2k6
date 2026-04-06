---
phase: 6
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
sections_complete: 16
quality_gates_passed: 4
agent_version: 1.3.0
---

# SPEC: {ARTIFACT_NAME}
## Behavioral Specification — WHAT without HOW

> Dokument ten opisuje CO system robi i JAKIE MA ZACHOWANIE.
> Jest **nawigacyjnym PRD** — podsumowuje i linkuje do szczegółów w fazach 2-5.
> Agenci kodujący czytają FEAT pliki (Phase 7) które zawierają kompletne dane.

### Źródła szczegółów

| Dokument | Zawiera | Czytaj gdy |
|----------|---------|-----------|
| `inventory.md` | Pełne API klas, sygnały, sloty, enums | Potrzebujesz sygnatury metody |
| `ui-contracts.md` | Pełne kontrakty UI, widgety, stany, walidacje | Potrzebujesz detali UI |
| `mockups/*.html` | Wizualne odwzorowania okien (Tailwind) | Chcesz zobaczyć jak wygląda |
| `call-graph.md` | Wszystkie connect(), emit(), przepływy | Potrzebujesz grafu zdarzeń |
| `facts.md` | Reguły Gherkin z source references | Potrzebujesz reguł z dowodami |

---

## Sekcja 1 — Project Overview

**Czym jest {ARTIFACT_NAME}:**
{2-3 zdania opisujące cel i wartość biznesową. Zero technologii.}

**Główni aktorzy:**
| Aktor | Rola |
|-------|------|
| {Operator} | {opis} |

**Kluczowe wartości biznesowe:**
- {wartość 1}

---

## Sekcja 2 — Domain Model

### Encje biznesowe

| Encja | Opis | Kluczowe pola | Pełne API |
|-------|------|--------------|-----------|
| {Encja} | {co reprezentuje} | {pola} | `inventory.md#{KLASA}` |

### Relacje

```
{Encja A} 1──────────N {Encja B}   (jeden A ma wiele B)
```

### Enums

| Enum | Wartości | Znaczenie |
|------|----------|-----------|

---

## Sekcja 3 — Data Model (schemat DB)

> Tabele bazy danych z kolumnami. Wyekstrahowane z kodu SQL w artefakcie.

### Tabela: {NAZWA}

| Kolumna | Typ | Null | Opis | Mapowanie |
|---------|-----|------|------|-----------|
| {col} | {typ} | {YES/NO} | {opis} | → {Encja.pole} |

### Relacje FK

```
{TABELA_A}.{kolumna} → {TABELA_B}.{PK}
```

---

## Sekcja 4 — Functional Capabilities (Use Cases)

| ID | Aktor | Akcja | Efekt biznesowy | Priorytet |
|----|-------|-------|----------------|-----------|
| UC-001 | {Aktor} | {akcja} | {efekt} | MUST/SHOULD/COULD |

→ Pełne reguły: `facts.md`

---

## Sekcja 5 — Business Rules (Gherkin)

> Kluczowe reguły definiujące zachowanie systemu.
> Kompletna lista z source references: `facts.md`

```gherkin
Rule: {Nazwa}
  Scenario: {opis}
    Given ...
    When  ...
    Then  ...
```

---

## Sekcja 6 — State Machines

### {NazwaEncji} State Machine

```mermaid
stateDiagram-v2
    [*] --> {Stan1}
```

| Przejście | Trigger | Warunek | Efekt |
|-----------|---------|---------|-------|

---

## Sekcja 7 — Reactive Architecture

### Kluczowe przepływy zdarzeń

**Przepływ: {nazwa}**
```
[Użytkownik] {akcja}
    → {co system robi}
    → {efekt końcowy}
```

### Cross-artifact komunikacja

| Źródło | Zdarzenie | Cel | Efekt |
|--------|-----------|-----|-------|

→ Pełny graf: `call-graph.md`

---

## Sekcja 8 — UI/UX Contracts

> Referencje do pełnych kontraktów. NIE kopiuj tabel widgetów.

### Design System
- **Design Tokens:** `../design-tokens.json`
- **Galeria mockupów:** `mockups/_index.html`

> Agenty kodujące MUSZĄ załadować design-tokens.json aby zachować
> spójność kolorów, fontów i spacingu cross-artifact.

### {NazwaOkna} — {krótki opis}
{1-2 zdania co robi to okno}
- **Kontrakt:** `ui-contracts.md#{KLASA}`
- **Mockup:** `mockups/{KLASA}.html`
- **Features:** {PREFIX}-{NNN}

→ Pełna dokumentacja UI: `ui-contracts.md`

---

## Sekcja 9 — API & Protocol Contracts

### {Nazwa protokołu} ({mechanizm} → {cel})

| Komenda | Parametry | Odpowiedź | Znaczenie |
|---------|-----------|-----------|-----------|
| {cmd} | {params} | {response} | {opis} |

### HTTP/REST Endpoints (jeśli istnieją)

| Metoda | Endpoint | Parametry | Odpowiedź |
|--------|----------|-----------|-----------|

---

## Sekcja 10 — Data Flow

```
[Baza danych] → [Model domenowy] → [Logika biznesowa] → [UI]
```

| Transformacja | Od | Do | Co się zmienia |
|--------------|----|----|----------------|

---

## Sekcja 11 — Error Taxonomy

| Kod/Typ | Kategoria | Co wywołuje | Zachowanie | Komunikat |
|---------|-----------|-------------|-----------|-----------|

---

## Sekcja 12 — Integration Contracts

### Cross-artifact

| Artifact | Mechanizm | Kierunek | Kontrakt |
|----------|-----------|---------|---------|

### Zewnętrzne systemy

| System | Rola | Protokół | Dane |
|--------|------|----------|------|

---

## Sekcja 13 — Platform Independence Map

| Funkcja | Oryginał | Klon | Priorytet |
|---------|----------|------|-----------|

---

## Sekcja 14 — Non-Functional Requirements

```gherkin
Scenario: {wymóg}
  Given {warunki}
  When  {akcja}
  Then  {kryterium}
```

---

## Sekcja 15 — Configuration

| Klucz | Typ | Domyślna | Opis |
|-------|-----|---------|------|

---

## Sekcja 16 — E2E Acceptance Scenarios

```gherkin
Feature: {nazwa}
  Scenario: {happy path}
    Given ...
    When  ...
    Then  ...
```

---

## Assumptions & Open Questions

| # | Założenie | Alternatywa | Wpływ |
|---|-----------|-------------|-------|

---

*SPEC wygenerowany przez Qt Reverse Engineering Multi-Agent System v1.3.0*
*Źródła: inventory.md + ui-contracts.md + call-graph.md + facts.md + kod źródłowy*
