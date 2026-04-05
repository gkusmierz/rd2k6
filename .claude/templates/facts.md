---
phase: 5
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
sources_used: [code, tests, pdf]
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
| Dokumentacja PDF | tak/nie | strony {N}-{M} |

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

  # Źródło: {kod/test/pdf} | {plik:linia lub PDF strona N}
  # Pewność: potwierdzone/przypuszczalne
```

---

## Stany encji

<!-- Dla każdej encji ze statusem/stanem — pełna maszyna stanów -->

### {NazwaEncji} — stany

```mermaid
stateDiagram-v2
    [*] --> {StanPoczątkowy}
    {StanA} --> {StanB} : {trigger}
    {StanB} --> {StanC} : {trigger}
    {StanC} --> [*]
```

| Przejście | Trigger | Warunek | Efekt uboczny |
|-----------|---------|---------|--------------|
| {A → B} | {zdarzenie} | {warunek} | {co się dzieje} |

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

| Fakt z PDF | Strona | Status |
|------------|--------|--------|
| {opis} | {N} | undocumented_gap / removed_feature |

### TYP 2 — W kodzie, brak w dokumentacji

| Fakt z kodu | Plik | Status |
|-------------|------|--------|
| {opis} | {plik} | hidden_feature / needs_doc |

### TYP 3 — Sprzeczność kod ↔ dokumentacja

| Kod mówi | PDF mówi | Strona | Rozstrzygnięcie |
|----------|----------|--------|----------------|
| {opis} | {opis} | {N} | kod_wins / pdf_wins / requires_review |

### TYP 4 — Edge cases tylko w testach (undocumented constraints)

| Test | Constraint odkryta | Plik testowy |
|------|--------------------|-------------|
| {nazwa testu} | {opis constraintu} | {plik:linia} |
