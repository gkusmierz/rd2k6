---
phase: 6
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
sections_complete: 14
quality_gates_passed: 4
agent_version: 1.0.0
---

# SPEC: {ARTIFACT_NAME}
## Behavioral Specification — WHAT without HOW

> Dokument ten opisuje CO system robi i JAKIE MA ZACHOWANIE.
> Nie opisuje JAK to robi ani w jakiej technologii.
> Wystarczy do zbudowania klona w dowolnym języku na dowolnej platformie.

---

## Sekcja 1 — Project Overview

**Czym jest {ARTIFACT_NAME}:**
{2-3 zdania opisujące cel i wartość biznesową. Zero technologii.}

**Główni aktorzy:**
| Aktor | Rola |
|-------|------|
| {Operator} | {opis} |
| {Administrator} | {opis} |
| {System} | {opis} |

**Kluczowe wartości biznesowe:**
- {wartość 1}
- {wartość 2}

---

## Sekcja 2 — Domain Model

### Encje biznesowe

| Encja | Opis | Kluczowe pola |
|-------|------|--------------|
| {Encja} | {co reprezentuje} | {lista pól z typami} |

### Relacje

```
{Encja A} 1──────────N {Encja B}   (jeden A ma wiele B)
{Encja B} N──────────M {Encja C}   (wiele-do-wielu)
```

### Enums (zbiory stanów)

| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| {NazwaEnum} | {val1, val2} | {co reprezentuje każda wartość} |

---

## Sekcja 3 — Functional Capabilities (Use Cases)

| ID | Aktor | Akcja | Efekt biznesowy | Priorytet |
|----|-------|-------|----------------|-----------|
| UC-001 | {Aktor} | {akcja} | {efekt} | MUST/SHOULD/COULD |

---

## Sekcja 4 — Business Rules (Gherkin)

```gherkin
# Wszystkie reguły biznesowe — z facts.md

Rule: {Nazwa reguły}
  ...

Rule: {Kolejna reguła}
  ...
```

---

## Sekcja 5 — State Machines

<!-- Dla każdej encji ze statusem/stanem -->

### {NazwaEncji} State Machine

```mermaid
stateDiagram-v2
    [*] --> {Stan1}
    ...
```

| Przejście | Trigger | Warunek | Efekt uboczny |
|-----------|---------|---------|--------------|

---

## Sekcja 6 — Reactive Architecture

### Kluczowe przepływy zdarzeń

<!-- Z call-graph.md — opisane słownie, bez Qt-specific terminologii -->

**Przepływ: {nazwa}**
```
[Użytkownik] {akcja}
    → {co system robi krok po kroku}
    → {efekt końcowy}
```

### Cross-artifact komunikacja

| Źródło | Zdarzenie | Cel | Efekt |
|--------|-----------|-----|-------|

---

## Sekcja 7 — UI/UX Contracts

<!-- Kompletna lista z ui-contracts.md -->

### {NazwaOkna}

| Pole | Wartość |
|------|---------|
| Typ | MainWindow / Dialog / Panel |
| Otwierane przez | {kto/co otwiera} |
| Dane wejściowe | {co potrzebuje żeby się wyświetlić} |

**Widgety i interakcje:**
| Element | Akcja użytkownika | Efekt |
|---------|------------------|-------|

**Stany widoku:**
| Stan | Kiedy | Co widzi użytkownik |
|------|-------|---------------------|

**Nawigacja z tego okna:**
| Dokąd | Jak | Warunek |
|-------|-----|---------|

---

## Sekcja 8 — Data Flow

```
[Baza danych] → [Model domenowy] → [ViewModel] → [Widok UI]
     ↑                                                ↓
[Baza danych] ← [Model domenowy] ← [Akcja użytkownika]
```

| Transformacja | Od | Do | Co się zmienia |
|--------------|----|----|----------------|

---

## Sekcja 9 — Error Taxonomy

| Kod/Typ błędu | Kategoria | Co wywołuje | Zachowanie systemu | Komunikat użytkownika |
|--------------|-----------|-------------|------------------|----------------------|
| {błąd} | user/system/external | {co} | {co robi system} | {co widzi user} |

---

## Sekcja 10 — Integration Contracts

### Shared Libraries

| Biblioteka | Używane funkcjonalności | Interfejs |
|------------|------------------------|-----------|
| {librd} | {lista} | {API} |

### Cross-artifact

| Artifact | Mechanizm | Kierunek | Kontrakt |
|----------|-----------|---------|---------|

### Zewnętrzne systemy

| System | Rola | Protokół/Format | Dane |
|--------|------|----------------|------|

---

## Sekcja 11 — Platform Independence Map

> Ta sekcja jest kluczowa dla projektu klonowania.
> Każdy komponent platform-specific musi być tu udokumentowany.

| Funkcja | Rivendell (Linux) | Klon (platforma docelowa) | Priorytet zastąpienia |
|---------|------------------|--------------------------|----------------------|
| Audio playback | JACK / ALSA | [decyzja implementatora] | CRITICAL |
| Audio record | JACK / ALSA | [decyzja implementatora] | CRITICAL |
| IPC | D-Bus | [decyzja implementatora] | CRITICAL |
| CD ripping | cdparanoia | [decyzja implementatora] | HIGH |
| Database | MySQL | [decyzja implementatora] | HIGH |
| Audio encode | lame / FLAC | [decyzja implementatora] | MEDIUM |

**Wymagania funkcjonalne dla zamienników:**
| Funkcja | Wymagania WHAT (nie HOW) |
|---------|--------------------------|
| Audio playback | Odtwarza pliki WAV/FLAC/MP3, kontrola głośności, seeking |

---

## Sekcja 12 — Non-Functional Requirements

<!-- Tylko te udowodnione przez kod — testowalne -->

```gherkin
Scenario: {Wymóg wydajnościowy}
  Given {warunki}
  When  {akcja}
  Then  {mierzalne kryterium}
```

---

## Sekcja 13 — Configuration

| Klucz | Typ | Domyślna wartość | Opis |
|-------|-----|-----------------|------|
| {klucz} | {typ} | {wartość} | {co kontroluje} |

---

## Sekcja 14 — E2E Acceptance Scenarios

```gherkin
Feature: {Pełna nazwa feature}

  Background:
    Given {wspólny stan wstępny dla wszystkich scenariuszy}

  Scenario: {Kompletny happy path}
    Given {pełny stan wstępny}
    When  {sekwencja akcji użytkownika}
    Then  {pełny oczekiwany efekt w UI}
    And   {efekt w danych/bazie}
    And   {efekty uboczne: powiadomienia, logi, etc.}

  Scenario: {Ważny edge case}
    Given {warunek graniczny}
    When  {akcja}
    Then  {oczekiwane zachowanie}

  Scenario: {Failure case}
    Given {warunek błędu}
    When  {akcja użytkownika}
    Then  {komunikat błędu i zachowanie systemu}
```

---

## Assumptions & Open Questions

<!-- Miejsca gdzie kod był niejasny i musiano przyjąć założenia -->

| # | Założenie | Alternatywa | Wpływ na implementację |
|---|-----------|-------------|----------------------|
| 1 | {założenie} | {inne możliwe zachowanie} | {co by się zmieniło} |

---

*SPEC wygenerowany przez Qt Reverse Engineering Multi-Agent System v1.0.0*
*Źródła: inventory.md + ui-contracts.md + call-graph.md + facts.md*
