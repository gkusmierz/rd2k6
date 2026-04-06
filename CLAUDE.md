# Qt Reverse Engineering — Multi-Agent System
## Instrukcja operacyjna dla Claude Code

Wersja: 1.1.0 | Status: active

---

## Czym jest ten system

Zestaw agentów do głębokiego reverse engineeringu projektów C++/Qt.
Cel: wydobycie kompletnego obrazu WHAT (co system robi) bez HOW (jak to robi).
Output: gotowy wsad dla agentów kodujących — behavioral clone w nowej technologii.

System jest **technologicznie agnostyczny** — działa na każdym projekcie C++/Qt,
nie tylko Rivendell. Zabierasz go do każdego nowego projektu open source.

---

## Twarde reguły — NIGDY nie łam

1. **Nie analizuj wszystkiego naraz.** Jeden artifact per sesja. Zero wyjątków.
2. **Nie pisz HOW.** Specyfikacja opisuje zachowanie, nie implementację.
3. **Nie pomijaj faz.** Każda faza buduje na poprzedniej. Brak skrótów.
4. **Nie kontynuuj bez walidacji wejścia.** Sprawdź czy input istnieje i jest kompletny.
5. **Nie nadpisuj ukończonych faz.** Status `done` jest nienaruszalny bez jawnej zgody użytkownika.
6. **Zawsze aktualizuj frontmatter.** Każdy plik ma status. Aktualizuj go po każdej fazie.
7. **Partial pliki są persystowane.** Nie usuwaj `_partials/` — to audit trail.
8. **Serena przed grep.** Używaj narzędzi semantycznych Sereny, nie brute-force grep.
9. **Bootstrap Serena MCP.** Każdy agent/sub-agent MUSI na starcie wykonać:
   `ToolSearch(query="+serena", max_results=50)` → `mcp__serena__initial_instructions()`.
   Narzędzia Serena są deferred — bez jawnego pobrania przez ToolSearch NIE BĘDĄ DOSTĘPNE.

---

## Jak zacząć — slash commands

System udostępnia slash commands do uruchamiania poszczególnych faz.
Wpisz `/nazwa-komendy` w Claude Code, aby uruchomić daną fazę.

```
Nowy projekt?
    └─► /qtre-prereq-check /ścieżka/do/projektu
        └─► /qtre-phase-0-discovery /ścieżka/do/projektu
            └─► Wynik: .analysis/{PROJECT}.manifest.md

Kontynuacja istniejącego projektu?
    └─► /qtre-status                         ← sprawdź gdzie jesteś
        └─► /qtre-phase-N-... ARTIFACT_ID   ← uruchom następną fazę

Nie wiesz co dalej?
    └─► /qtre-status
```

### Dostępne slash commands

| Command | Faza | Opis |
|---------|------|------|
| `/qtre-prereq-check` | -1 | Walidacja środowiska (build system, Serena MCP) |
| `/qtre-phase-0-discovery` | 0 | Project Discovery — identyfikacja artifaktów |
| `/qtre-phase-1-structure-scan ARTIFACT_ID` | 1 | Structure Scan — mapa plików artifaktu |
| `/qtre-phase-2-inventory ARTIFACT_ID` | 2 | Inventory Build — klasy, sygnały, sloty |
| `/qtre-phase-3-ui-extraction ARTIFACT_ID` | 3 | UI Extraction — kontrakty UI |
| `/qtre-phase-4-call-graph ARTIFACT_ID` | 4 | Signal & Call Graph — graf reaktywności |
| `/qtre-phase-5-facts-mining ARTIFACT_ID` | 5 | Facts Mining — reguły biznesowe |
| `/qtre-phase-6-spec-synthesis ARTIFACT_ID` | 6 | SPEC Synthesis — kompletna specyfikacja |
| `/qtre-phase-7-feature-decomposition ARTIFACT_ID` | 7 | Feature Decomposition — FEAT-*.md |
| `/qtre-qa ARTIFACT_ID PHASE` | QA | Weryfikacja outputu fazy — loguje BUGs do changelog |
| `/qtre-qa-fix ARTIFACT_ID PHASE [opis]` | QA | Naprawa bugów z changelog (+ opcjonalny ręczny bug) |
| `/qtre-qa-report ARTIFACT_ID PHASE opis` | QA | Zgłoś ręcznie problem → weryfikacja → naprawa |
| `/qtre-qa-loop ARTIFACT_ID PHASE [MAX]` | QA | Pętla verify→fix→verify do stabilności (domyślnie max 5) |
| `/qtre-status` | - | Sprawdź status projektu i następne kroki |
| `/qtre-run-by-phase [N\|N-M] [FILTER]` | orch | Orkiestracja: faza po fazie (`2`=tylko faza 2, `2-5`=zakres) |
| `/qtre-run-by-artifact` | orch | Orkiestracja: artefakt po artefakcie, pełny pipeline |
| `/qtre-run-bulk` | orch | Orkiestracja: bulk — wszystkie artefakty × wszystkie fazy |

---

## Struktura katalogów

```
.analysis/
├── {PROJECT}.manifest.md          ← FAZA 0 output, entry point
├── design-tokens.json             ← FAZA 3 output, cross-artifact design system
└── {ARTIFACT}/                    ← per artifact (np. RDLIBRARY/)
    ├── discovery-state.md         ← FAZA 1
    ├── inventory.md               ← FAZA 2 (klasy + diagramy klas Mermaid)
    ├── data-model.md              ← FAZA 2 (tabele DB + ERD Mermaid)
    ├── ui-contracts.md            ← FAZA 3
    ├── call-graph.md              ← FAZA 4 (+ sequence diagrams Mermaid)
    ├── facts.md                   ← FAZA 5
    ├── SPEC.md                    ← FAZA 6
    ├── _partials/                 ← sub-agent outputs (audit trail)
    │   ├── inv-*.md
    │   ├── sig-*.md
    │   └── ui-*.md
    ├── mockups/                   ← FAZA 3 output (HTML/Tailwind mockupy)
    │   ├── _index.html            ← galeria wszystkich mockupów
    │   └── {ClassName}.html       ← per okno/dialog
    ├── Features/                  ← FAZA 7
    │   ├── {PREFIX}-001.md
    │   ├── {PREFIX}-002.md
    │   └── ...
    └── _qa/                       ← QA loop outputs
        ├── changelog.md           ← append-only BUG/FIX log
        ├── qa-phase-3-cycle-1.md  ← raport QA per cykl
        ├── qa-phase-3-cycle-2.md
        └── ...
```

---

## Dokumentacja systemu

| Plik | Zawartość | Czytaj gdy |
|------|-----------|------------|
| `.claude/docs/ADL.md` | Decyzje architektoniczne z uzasadnieniem | Masz wątpliwości "dlaczego tak" |
| `.claude/docs/AGENTS.md` | Katalog agentów, wersje, statusy | Szukasz konkretnego agenta |
| `.claude/docs/PHASES.md` | Kontrakty faz — wejście/wyjście | Przed uruchomieniem każdej fazy |
| `.claude/docs/LESSONS.md` | Nauki z realnych projektów | Przed analizą nowego projektu |

---

## Struktura `.claude/`

Cały system agentów jest self-contained w katalogu `.claude/`.
Kopiujesz go do root projektu C++/Qt i masz gotowy zestaw narzędzi.

```
.claude/
├── commands/                      ← slash commands (entry points)
│   ├── qtre-prereq-check.md
│   ├── qtre-phase-0-discovery.md
│   ├── qtre-phase-1-structure-scan.md
│   ├── qtre-phase-2-inventory.md
│   ├── qtre-phase-3-ui-extraction.md
│   ├── qtre-phase-4-call-graph.md
│   ├── qtre-phase-5-facts-mining.md
│   ├── qtre-phase-6-spec-synthesis.md
│   ├── qtre-phase-7-feature-decomposition.md
│   ├── qtre-run-by-phase.md
│   ├── qtre-run-by-artifact.md
│   ├── qtre-run-bulk.md
│   └── qtre-status.md
├── agents/                        ← definicje agentów (instrukcje)
│   ├── ORCHESTRATOR-by-phase.md
│   ├── ORCHESTRATOR-by-artifact.md
│   ├── ORCHESTRATOR-bulk.md
│   ├── PREREQ-CHECK.md
│   ├── PHASE-0-discovery.md
│   ├── PHASE-1-structure-scan.md
│   ├── PHASE-2-inventory.md
│   ├── PHASE-2-inventory-subagent.md
│   ├── PHASE-3-ui-extraction.md
│   ├── PHASE-4-call-graph.md
│   ├── PHASE-5-facts-mining.md
│   ├── PHASE-6-spec-synthesis.md
│   ├── PHASE-7-feature-decomposition.md
│   └── MERGE-AGENT.md
├── templates/                     ← szablony outputów
│   ├── manifest.md
│   ├── discovery-state.md
│   ├── inventory.md
│   ├── data-model.md
│   ├── ui-contracts.md
│   ├── call-graph.md
│   ├── facts.md
│   ├── SPEC.md
│   └── FEAT.md
└── docs/                          ← dokumentacja systemu
    ├── ADL.md
    ├── AGENTS.md
    ├── PHASES.md
    └── LESSONS.md
```

---

## Wersjonowanie

Ten system jest wersjonowany. Przy każdej istotnej zmianie:
1. Zaktualizuj wersję w tym pliku (semver)
2. Dodaj wpis do `.claude/docs/ADL.md`
3. Zaktualizuj `.claude/docs/AGENTS.md`
4. Dodaj lekcję do `.claude/docs/LESSONS.md` jeśli wynika z doświadczenia

v1.0.0 — 2026-04-05 — Initial release. Zaprojektowany na bazie analizy Rivendell 4.4.1.
v1.1.0 — 2026-04-05 — Migracja do struktury Claude Code. Slash commands, .claude/commands/.
v1.2.0 — 2026-04-05 — Self-contained .claude/. Agents, templates, docs przeniesione do .claude/. Prefix qtre- na commands.
v1.3.0 — 2026-04-05 — Phase 3: 3 tryby UI (XML/Code/QML) + screenshots→mockupy. Phase 2: skan plain C++. Spot-check we wszystkich fazach. Nowy agent QA.
v1.4.0 — 2026-04-05 — Pętla QA: changelog per artifact, QA-fix agent, QA-loop orkiestrator. Verify→Fix→Verify do stabilności.
v1.5.0 — 2026-04-05 — Przełamanie łańcucha zależności. SPEC=nawigacyjny PRD (nie superdokument). FEAT czyta fazy 2-5 bezpośrednio. Nowe sekcje: Data Model (DB), API/Protocol Contracts.
v1.6.0 — 2026-04-05 — Data Model: ekstrakcja schematu DB w Phase 2, ERD Mermaid, mapowanie tabela↔klasa CRUD. Diagramy: class diagrams (P2), sequence diagrams + dependency graph (P4), state machines (P5).
