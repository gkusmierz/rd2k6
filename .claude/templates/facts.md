---
phase: 5
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
sources_used: [code, tests, docs]
facts_total: ~
conflicts_found: 0
agent_version: 1.0.0
---

# Facts: {ARTIFACT_NAME}

## Źródła analizy

| Źródło | Użyte | Jakość |
|--------|-------|--------|
| Kod źródłowy | tak/nie | wysoka/średnia/niska |
| Testy QTest | tak/nie | liczba plików testowych |
| Dokumentacja (docs/opsguide/) | tak/nie | pliki XML użyte |

---

## Use Cases (aktor → akcja → efekt)

<!-- Z testów QTest — to jest source of truth -->

| ID | Aktor | Akcja | Efekt | Źródło |
|----|-------|-------|-------|--------|
| UC-001 | {Operator} | {co robi} | {co osiąga} | test/{plik}.cpp |

---

## Reguły biznesowe (Gherkin)

<!-- Wszystkie reguły odkryte z kodu, testów i dokumentacji -->

```gherkin
# ─── REGUŁY ZARZĄDZANIA {ENCJA} ──────────────────────────

Rule: {Nazwa reguły 1}

  Scenario: {happy path}
    Given {warunek wstępny}
    When  {akcja}
    Then  {oczekiwany efekt}
    And   {efekt uboczny}

  Scenario: {edge case}
    Given {warunek graniczny}
    When  {akcja}
    Then  {oczekiwane zachowanie}

  # Źródło: {kod/test/docs} | {plik:linia lub docs/opsguide/{plik.xml}:{sekcja}}
  # Pewność: potwierdzone/przypuszczalne
```

---

## Stany encji

> Dla każdej encji ze statusem/stanem — pełna maszyna stanów w Mermaid.
> **OBOWIĄZKOWE:** Każda encja z enum Status/State MUSI mieć diagram.
> Źródło: szukaj enum z wartościami stanów + metody które zmieniają stan.

### {NazwaEncji} — stany

```mermaid
stateDiagram-v2
    [*] --> {StanPoczątkowy}
    {StanA} --> {StanB} : {trigger}
    {StanB} --> {StanC} : {trigger}
    {StanC} --> [*]
    
    note right of {StanA}
        {warunek wejścia}
    end note
```

| Przejście | Trigger | Warunek | Efekt uboczny | Źródło |
|-----------|---------|---------|--------------|--------|
| {A → B} | {zdarzenie} | {warunek} | {co się dzieje} | {plik}:{linia} |

---

## Ograniczenia i limity

<!-- Magic numbers i stałe z opisem biznesowym -->

| Ograniczenie | Wartość | Dotyczy | Źródło |
|-------------|---------|---------|--------|
| {nazwa} | {wartość} | {kontekst} | {kod: plik:linia} |

---

## Konfiguracja (QSettings)

| Klucz | Typ | Wartość domyślna | Znaczenie |
|-------|-----|-----------------|-----------|
| {klucz} | {typ} | {domyślna} | {co kontroluje} |

---

## Linux-specific komponenty

<!-- Wszystkie zidentyfikowane komponenty platform-specific -->

| Komponent | Gdzie używany (klasa/metoda) | Funkcja | Priorytet zastąpienia |
|-----------|---------------------------|---------|----------------------|
| JACK audio | {klasa}::{metoda} | {do czego} | CRITICAL |
| D-Bus | {klasa}::{metoda} | {do czego} | CRITICAL |
| cdparanoia | {klasa}::{metoda} | {do czego} | HIGH |
| MySQL | {klasa}::{metoda} | {do czego} | HIGH |

---

## Konflikty między źródłami

<!-- Rozbieżności znalezione przez Crosscheck sub-agenta -->

### TYP 1 — W dokumentacji, brak w kodzie

| Fakt z docs/ | Plik XML | Status |
|--------------|----------|--------|
| {opis} | {docs/opsguide/plik.xml} | undocumented_gap / removed_feature |

### TYP 2 — W kodzie, brak w dokumentacji

| Fakt z kodu | Plik | Status |
|-------------|------|--------|
| {opis} | {plik} | hidden_feature / needs_doc |

### TYP 3 — Sprzeczność kod ↔ dokumentacja

| Kod mówi | Docs mówi | Plik XML | Rozstrzygnięcie |
|----------|-----------|----------|----------------|
| {opis} | {opis} | {docs/opsguide/plik.xml} | kod_wins / docs_wins / requires_review |

### TYP 4 — Edge cases tylko w testach (undocumented constraints)

| Test | Constraint odkryta | Plik testowy |
|------|--------------------|-------------|
| {nazwa testu} | {opis constraintu} | {plik:linia} |
