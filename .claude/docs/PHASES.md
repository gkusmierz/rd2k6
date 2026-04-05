# PHASES.md — Phase Contract Registry
## Qt Reverse Engineering Multi-Agent System

Każda faza ma twardy kontrakt: wejście, walidacja, wyjście, warunek done.
Agent MUSI sprawdzić kontrakt zanim zacznie fazę.

---

## Status Check — jak sprawdzić gdzie jesteś

```bash
# Przeczytaj manifest projektu
cat .analysis/*.manifest.md | grep -A 2 "Status"

# Sprawdź frontmatter każdego pliku output
for f in .analysis/**/*.md; do
  echo "=== $f ==="; head -6 "$f"; echo
done
```

---

## Tabela faz

| Faza | Nazwa | Scope | Sub-agenci | Agent file |
|------|-------|-------|-----------|------------|
| -1 | Prerequisite Check | project | nie | PREREQ-CHECK.md |
| 0 | Project Discovery | project | nie | PHASE-0-discovery.md |
| 1 | Artifact Structure Scan | per artifact | nie | PHASE-1-structure-scan.md |
| 2 | Inventory Build | per artifact | TAK | PHASE-2-inventory.md |
| 3 | UI Extraction | per artifact | TAK | PHASE-3-ui-extraction.md |
| 4 | Signal & Call Graph | per artifact | TAK | PHASE-4-call-graph.md |
| 5 | Facts Mining | per artifact | TAK | PHASE-5-facts-mining.md |
| 6 | SPEC Synthesis | per artifact | nie | PHASE-6-spec-synthesis.md |
| 7 | Feature Decomposition | per artifact | TAK | PHASE-7-feature-decomposition.md |

---

## FAZA -1 — Prerequisite Check

```
WEJŚCIE
  Typ:        folder (root projektu)
  Wymagane:   tak
  Walidacja:  folder istnieje i nie jest pusty

WYJŚCIE
  Modyfikuje: .serena/project.yml (jeśli nie istnieje)
  Tworzy:     compile_commands.json (jeśli brak)
  Raport:     prereq-check.log (w root projektu)

WARUNEK DONE
  compile_commands.json istnieje w root projektu
  Serena MCP dostępna i odpowiada
  clangd lub ccls dostępny

BLOKUJE
  Wszystkie kolejne fazy
```

---

## FAZA 0 — Project Discovery

```
WEJŚCIE
  Typ:        folder (root projektu)
  Wymagane:   tak
  Walidacja:
    - CMakeLists.txt LUB *.pro istnieje w root
    - compile_commands.json istnieje (prereq check done)

WYJŚCIE
  Plik:       .analysis/{PROJECT}.manifest.md
  Szablon:    .claude/templates/manifest.md

WARUNEK DONE
  Wszystkie artifakty zidentyfikowane z ID, typem i priorytetem
  Dependency graph wypełniony
  Status wszystkich artifaktów = pending

PRZEJŚCIE
  Następna faza:  PHASE-1 (dla każdego artifaktu wg priorytetu)
  Dane:           artifact ID z manifest.md
```

---

## FAZA 1 — Artifact Structure Scan

```
WEJŚCIE
  Typ:        artifact ID (np. "LIB" dla RDLibrary)
  Źródło:     .analysis/{PROJECT}.manifest.md
  Wymagane:   tak
  Walidacja:
    - artifact ID istnieje w manifest.md
    - artifact status = pending lub in-progress
    - dla aplikacji: wszystkie zależne biblioteki mają PHASE-5 status = done

WYJŚCIE
  Plik:       .analysis/{ARTIFACT}/discovery-state.md
  Szablon:    .claude/templates/discovery-state.md

WARUNEK DONE
  Wszystkie pliki źródłowe zidentyfikowane i skatalogowane
  Główne klasy zidentyfikowane (QMainWindow, QDialog, QWidget subclassy)
  Entry points zidentyfikowane (main(), QApplication)
  CMake targets dla tego artifaktu wypisane

PRZEJŚCIE
  Następna faza:  PHASE-2
  Aktualizuje:    artifact status w manifest.md → in-progress
```

---

## FAZA 2 — Inventory Build

```
WEJŚCIE
  Typ:        discovery-state.md (z Fazy 1)
  Ścieżka:    .analysis/{ARTIFACT}/discovery-state.md
  Wymagane:   tak
  Walidacja:  frontmatter phase=1, status=done

SUB-AGENCI (równolegle)
  Jeden sub-agent per para .h/.cpp
  Każdy pisze: .analysis/{ARTIFACT}/_partials/inv-{NR}-{CLASSNAME}.md
  Merge Agent: konsoliduje do inventory.md

WYJŚCIE
  Plik:       .analysis/{ARTIFACT}/inventory.md
  Szablon:    .claude/templates/inventory.md

WARUNEK DONE
  Każda klasa ma: nazwę, typ Qt, pola, metody publiczne, sygnały, sloty
  Każda para .h/.cpp ma wpis
  Żadna klasa nie jest duplikatem w output

PRZEJŚCIE
  Następna faza:  PHASE-3 i PHASE-4 (mogą startować równolegle)
```

---

## FAZA 3 — UI Extraction

```
WEJŚCIE
  Typ:        inventory.md + pliki .ui + pliki .qml + PDF (opcjonalnie)
  Ścieżka:    .analysis/{ARTIFACT}/inventory.md
  Wymagane:   inventory.md (tak), .ui/.qml (jeśli istnieją), PDF (opcjonalnie)
  Walidacja:  frontmatter phase=2, status=done

SUB-AGENCI (równolegle)
  Jeden sub-agent per .ui plik (Qt Designer XML)
  Jeden sub-agent per główny .qml komponent
  Jeden sub-agent per sekcja PDF z UI screenshots (jeśli PDF dostępny)
  Każdy pisze: .analysis/{ARTIFACT}/_partials/ui-{NR}-{WINDOWNAME}.md
  Merge Agent: konsoliduje do ui-contracts.md

WYJŚCIE
  Plik:       .analysis/{ARTIFACT}/ui-contracts.md
  Szablon:    .claude/templates/ui-contracts.md

WARUNEK DONE
  Każde okno/dialog ma UI Contract
  Każdy widget z interakcją ma zdefiniowany event handler
  Każdy stan widoku (loading/error/empty/success) jest opisany

PRZEJŚCIE
  Następna faza:  PHASE-5 (razem z PHASE-4)
```

---

## FAZA 4 — Signal & Call Graph

```
WEJŚCIE
  Typ:        inventory.md + pliki źródłowe
  Ścieżka:    .analysis/{ARTIFACT}/inventory.md
  Wymagane:   tak
  Walidacja:  frontmatter phase=2, status=done

SUB-AGENCI (równolegle)
  Jeden sub-agent per QObject subclass (śledzi jej connect() i emit())
  Jeden sub-agent per QAbstractItemModel subclass
  Każdy pisze: .analysis/{ARTIFACT}/_partials/sig-{NR}-{CLASSNAME}.md
  Merge Agent: buduje pełny graf

WYJŚCIE
  Plik:       .analysis/{ARTIFACT}/call-graph.md
  Szablon:    .claude/templates/call-graph.md

WARUNEK DONE
  Każdy connect() ma krawędź: nadawca → sygnał → odbiorca → slot
  Każdy emit() jest zmapowany do odpowiednich connect() odbiorców
  Każdy Q_PROPERTY z NOTIFY jest w grafie
  Circular dependencies są oznaczone

PRZEJŚCIE
  Następna faza:  PHASE-5
```

---

## FAZA 5 — Facts Mining

```
WEJŚCIE
  Typ:        inventory.md + call-graph.md + ui-contracts.md + testy + PDF
  Ścieżki:    .analysis/{ARTIFACT}/*.md
  Wymagane:   inventory.md, call-graph.md (tak); testy, PDF (jeśli istnieją)
  Walidacja:
    - phase-2 status=done
    - phase-3 status=done
    - phase-4 status=done

SUB-AGENCI (sekwencja z częściowym overlappem)
  Sub-agent CODE:      analizuje implementację pod kątem reguł biznesowych
  Sub-agent TESTS:     ekstrahuje use cases z QTest (jeśli istnieją)
  Sub-agent PDF:       ekstrahuje fakty z dokumentacji (jeśli istnieje)
  Sub-agent CROSSCHECK: porównuje wyniki 3 powyższych, flaguje rozbieżności
  Każdy pisze: .analysis/{ARTIFACT}/_partials/facts-{source}.md
  Merge Agent: konsoliduje do facts.md

WYJŚCIE
  Plik:       .analysis/{ARTIFACT}/facts.md
  Szablon:    .claude/templates/facts.md

WARUNEK DONE
  Każda reguła biznesowa wypisana w Gherkin
  Każdy use case z testów zmapowany na feature
  Linux-specific komponenty zidentyfikowane i oznaczone jako TO REPLACE
  Rozbieżności kod/doc/testy wypisane w sekcji Conflicts

PRZEJŚCIE
  Następna faza:  PHASE-6
```

---

## FAZA 6 — SPEC Synthesis

```
WEJŚCIE
  Typ:        inventory.md + ui-contracts.md + call-graph.md + facts.md
  Ścieżki:    .analysis/{ARTIFACT}/*.md
  Wymagane:   wszystkie 4 pliki, wszystkie status=done
  Walidacja:  fazy 2, 3, 4, 5 wszystkie status=done

AGENT
  Monolityczny — brak sub-agentów
  Pełny kontekst wszystkich poprzednich faz

WYJŚCIE
  Plik:       .analysis/{ARTIFACT}/SPEC.md
  Szablon:    .claude/templates/SPEC.md

WARUNEK DONE
  Wszystkie 14 sekcji wypełnione
  Zero referencji do technologii Linux-specific w sekcjach funkcjonalnych
  Każda reguła biznesowa ma co najmniej jeden scenariusz Gherkin
  Sekcja "Platform Independence" kompletna

PRZEJŚCIE
  Następna faza:  PHASE-7
```

---

## FAZA 7 — Feature Decomposition

```
WEJŚCIE
  Typ:        SPEC.md + manifest.md (dla cross-artifact depends_on)
  Ścieżki:    .analysis/{ARTIFACT}/SPEC.md
              .analysis/{PROJECT}.manifest.md
  Wymagane:   tak
  Walidacja:  SPEC.md phase=6 status=done

SUB-AGENCI (równolegle)
  Jeden sub-agent per feature cluster (logicznie powiązane features)
  Master Agent: topological sort z depends_on/blocks
  Każdy pisze: .analysis/{ARTIFACT}/Features/{PREFIX}-NNN.md

WYJŚCIE
  Pliki:      .analysis/{ARTIFACT}/Features/{PREFIX}-001.md ...
  Szablon:    .claude/templates/FEAT.md

WARUNEK DONE
  Każda feature ma kompletny frontmatter z depends_on i blocks
  Topological sort jest możliwy (brak circular deps)
  Każda feature jest samowystarczalnym wsadem dla agenta kodującego
  Linux-specific sekcja wypełniona dla każdej feature która tego wymaga

PRZEJŚCIE
  Artifact status w manifest.md → done
  Kolejny artifact z manifest.md (następny priorytet)
```
