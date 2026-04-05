---
id: {PREFIX}-{NNN}
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
title: {krótki tytuł}
status: pending
depends_on: []
blocks: []
estimated_wp: ~
phase: 7
agent_version: 1.0.0
---

# {PREFIX}-{NNN}: {Tytuł}

## Kontekst biznesowy

{2-4 zdania opisujące po co ta feature istnieje, jaki problem rozwiązuje
i kto jej używa. Zero implementacji, zero technologii.}

## Aktorzy

| Aktor | Rola w tej feature |
|-------|-------------------|
| {np. Operator} | {co robi} |
| {np. Administrator} | {co robi} |

## Granica funkcjonalności

```
IN SCOPE:
  - {co wchodzi w skład tej feature}
  - {kolejny element}

OUT OF SCOPE:
  - {co celowo pominięto} → patrz {PREFIX}-{OTHER}
  - {kolejny element out of scope}
```

## Use Cases

| ID | Aktor | Akcja | Efekt biznesowy |
|----|-------|-------|----------------|
| UC-1 | {Aktor} | {co robi} | {co osiąga} |
| UC-2 | {Aktor} | {co robi} | {co osiąga} |

## Reguły biznesowe

```gherkin
Rule: {Nazwa reguły biznesowej}

  Scenario: {happy path}
    Given {stan wstępny}
    When  {akcja użytkownika lub systemu}
    Then  {oczekiwany wynik}
    And   {efekt uboczny jeśli istnieje}

  Scenario: {edge case lub negative}
    Given {stan wstępny}
    When  {akcja która powinna się nie udać lub przypadek graniczny}
    Then  {oczekiwane zachowanie}
```

## UI Contracts (dla tej feature)

| Okno/Dialog | Typ | Powiązany UC | Link do pełnego kontraktu |
|-------------|-----|-------------|--------------------------|
| {NazwaOkna} | Dialog | UC-1 | ui-contracts.md#{ANCHOR} |

### Kluczowe elementy UI

{Wyciąg z ui-contracts.md: tylko te widgety i stany które dotyczą tej feature}

## Dane i encje domenowe

| Encja | Operacje w tej feature | Pola wymagane | Pola opcjonalne |
|-------|----------------------|--------------|-----------------|
| {Encja} | CREATE / READ / UPDATE / DELETE | {lista} | {lista} |

## Platform Independence

| Funkcja | Oryginał (Linux) | Klon (platforma docelowa) | Priorytet |
|---------|-----------------|--------------------------|-----------|
| {np. audio playback} | JACK/ALSA | [decyzja implementatora] | CRITICAL |

Jeśli ta feature nie ma platform-specific komponentów: "Brak — feature jest platform-agnostic."

## Sygnały integracji z innymi features

| Zdarzenie | Emitowane przez (tu) | Odbiera | Feature |
|-----------|---------------------|---------|---------|
| {zdarzenie} | {ta feature} | {kto} | {PREFIX}-{NNN} |

| Zdarzenie | Emitowane przez | Odbiera (tu) | Feature |
|-----------|----------------|-------------|---------|
| {zdarzenie} | {kto} | {ta feature} | {PREFIX}-{NNN} |

## Acceptance Criteria (E2E)

```gherkin
Feature: {Tytuł tej feature}

  Scenario: {Kompletny user journey — happy path}
    Given {pełny stan wstępny}
    When  {sekwencja akcji}
    Then  {pełny oczekiwany efekt}
    And   {efekty uboczne}

  Scenario: {Ważny edge case}
    Given {stan wstępny edge case}
    When  {akcja}
    Then  {oczekiwane zachowanie}
```

## Open Questions dla agenta PM

- [ ] {Pytanie wymagające decyzji przed implementacją}
- [ ] {Kolejne pytanie}

Jeśli brak: "Brak otwartych pytań — feature gotowa do implementacji."

## Szacowany zakres (Working Packages)

| WP | Opis | Zależności WP |
|----|------|--------------|
| WP-1 | {np. Domain model: klasa Cart} | - |
| WP-2 | {np. Unit testy dla Cart} | WP-1 |
| WP-3 | {np. UI: CartEditDialog} | WP-1 |
| WP-4 | {np. Integration test} | WP-1, WP-2, WP-3 |

*Szacunek wstępny — agent PM może podzielić inaczej.*
