# ADL — Architecture Decisions Log
## Qt Reverse Engineering Multi-Agent System

Format: append-only. Nigdy nie usuwamy decyzji — max oznaczamy `superseded by ADL-XXX`.
Każda decyzja ma datę, status i pełne uzasadnienie wraz z odrzuconymi alternatywami.

---

## ADL-001 — Stan między sesjami: YAML frontmatter w plikach output

Data: 2026-04-05 | Status: active

**Kontekst:** Agenci działają w wielu sesjach. Potrzebny mechanizm który mówi
"gdzie jesteśmy" bez zewnętrznej bazy danych ani osobnego pliku stanu.

**Opcje rozważane:**
- A) Jeden centralny plik stanu (`state.json`)
- B) Katalog `.analysis/` z osobnymi plikami statusów
- C) YAML frontmatter wbudowany w każdy output MD ← **wybrane**
- D) Kombinacja B + C ← **finalnie wybrane**

**Uzasadnienie:** Opcja C daje każdemu plikowi samoopis — plik "wie" jaki ma status
bez zewnętrznej zależności. Opcja D łączy strukturę katalogową (B) z samoopisem (C).
Manifest istnieje dla overview, frontmatter dla precyzyjnego statusu per plik.

**Wpływ:** Każdy output MD MUSI zawierać frontmatter:
```yaml
---
phase: N
artifact: ARTIFACT_ID
status: pending | in-progress | done | blocked
completed_at: ~
agent_version: 1.0.0
---
```

---

## ADL-002 — Struktura katalogów: per-artifact isolation

Data: 2026-04-05 | Status: active

**Kontekst:** Projekt ma wiele artifactów (aplikacje, biblioteki). Trzeba izolować
analizę każdego z nich żeby unikać context bleeding między sesjami.

**Opcje rozważane:**
- A) Płaska struktura: wszystkie pliki w `.analysis/`
- B) Per-artifact katalogi: `.analysis/{ARTIFACT}/` ← **wybrane**
- C) Per-phase katalogi: `.analysis/phase-2/`, `.analysis/phase-3/`

**Uzasadnienie:** B daje naturalną izolację — cała wiedza o RDLibrary jest
w `.analysis/RDLIBRARY/`. Łatwo wznowić, łatwo debugować, łatwo usunąć
jeden artifact i zacząć od nowa bez wpływu na inne.

**Wpływ:** Każda sesja per-artifact ma własny root: `.analysis/{ARTIFACT_ID}/`

---

## ADL-003 — Numeracja features: płaska z grafem zależności

Data: 2026-04-05 | Status: active

**Kontekst:** Features muszą być wykonywane w odpowiedniej kolejności przez
agenta PM/nadzorcę. Potrzebna konwencja która koduje zależności.

**Opcje rozważane:**
- A) Warstwowa numeracja: `LIB-1001`, `LIB-2001` (warstwa w numerze)
- B) Płaska numeracja + graf: `LIB-001` + `depends_on` w frontmatter ← **wybrane**

**Uzasadnienie:** Warstwowa numeracja jest sztywna — zmiana zależności wymaga
renumeracji. Płaska + graf jest elastyczna: nadzorca robi topological sort
z `depends_on`/`blocks` i sam ustala kolejność. Człowiek też może czytać LIB-001
jako "pierwsza feature" bez myślenia o warstwach.

**Wpływ:** Każdy FEAT-*.md ma frontmatter z:
```yaml
depends_on: [LIB-001, LIB-003]
blocks: [LIB-007, LIB-008]
```

---

## ADL-004 — Identyfikatory artifactów: 3-literowe prefiksy

Data: 2026-04-05 | Status: active

**Kontekst:** Artifakty muszą mieć krótkie, jednoznaczne ID używane w nazwach
plików, JIRA ticketach i referencjach między featurami.

**Decyzja:** 3-znakowy prefix per artifact, przypisywany w Fazie 0.

**Przykłady dla Rivendell:**
```
LIB  RDLibrary       AIR  RDAirPlay      CAT  RDCatch
ADM  RDAdmin         LOG  RDLogEdit      LMG  RDLogManager
LGN  RDLogin         CSL  RDCartSlots    PNL  RDPanel
RDL  librd           MAC  librdmacro
```

**Reguła:** biblioteki mają priorytet 0 (analizowane pierwsze bo wszystkie
aplikacje od nich zależą). Aplikacje numerowane od 1 wg priorytetu analizy.

---

## ADL-005 — Kolejność analizy: biblioteki przed aplikacjami

Data: 2026-04-05 | Status: active

**Kontekst:** Shared libraries (librd, librdmacro) są używane przez wszystkie
aplikacje. Analiza aplikacji bez znajomości bibliotek = niekompletne fakty.

**Decyzja:** Biblioteki dostają priorytet 0 w manifest.md i są analizowane
przed jakąkolwiek aplikacją. Każda sesja aplikacji ma dostęp do read-only
wyników sesji bibliotek.

**Wpływ:** W PHASE-5 (Facts Mining) agent sprawdza czy biblioteki zależne
mają status `done` w manifest.md zanim zacznie analizę aplikacji.

---

## ADL-006 — CLAUDE.md zamiast README.md jako entry point

Data: 2026-04-05 | Status: active

**Kontekst:** Dokumentacja systemu musi być automatycznie czytana przez
Claude Code przy każdym starcie sesji, bez ręcznego promptowania.

**Decyzja:** `CLAUDE.md` jest głównym plikiem systemu. Claude Code czyta go
automatycznie jako system prompt z dysku. README.md nie istnieje — nie ma
miękkiej dokumentacji "dla człowieka", wszystko jest instrukcją operacyjną.

**Uzasadnienie:** CLAUDE.md to de facto system prompt zapisany na dysku.
Każdy agent który wchodzi do projektu dostaje pełny kontekst startowy
bez żadnego dodatkowego promptowania użytkownika.

---

## ADL-007 — Separacja dokumentacji: 4 pliki zamiast jednego

Data: 2026-04-05 | Status: active

**Kontekst:** System ma kilka rodzajów dokumentacji z różnymi cyklami życia:
decyzje (append-only), katalog agentów (aktualizowany), kontrakty (stabilne),
lekcje (rosnące z doświadczeniem).

**Decyzja:** 4 osobne pliki linkowane z CLAUDE.md:
- `ADL.md` — decyzje architektoniczne (append-only)
- `AGENTS.md` — katalog agentów z wersjami
- `PHASES.md` — kontrakty faz (wejście/wyjście)
- `LESSONS.md` — lekcje z realnych projektów

**Uzasadnienie:** Jeden duży plik byłby nieczytelny i mieszałby różne cykle
życia dokumentów. Agent szuka konkretnej informacji — trafia do właściwego pliku.

---

## ADL-008 — Serena MCP jako backend semantyczny

Data: 2026-04-05 | Status: active

**Kontekst:** Analiza C++/Qt na poziomie grep/read_file jest kosztowna
kontekstowo i zawodna (false positives, missing cross-file references).

**Decyzja:** Serena MCP z backendem clangd/ccls jako primary tool dla
analizy semantycznej. Grep i read_file jako fallback gdy Serena nie dostarcza.

**Kluczowe narzędzia Sereny:**
- `get_symbols_overview(file)` → inventory pliku bez czytania całości
- `find_referencing_symbols(symbol)` → kto wołuje ten symbol (call graph)
- `find_symbol(name)` → globalne wyszukiwanie symbolu
- `search_for_pattern(pattern)` → Qt-specific patterns (Q_PROPERTY, connect, emit)
- `write_memory` / `read_memory` → transport danych między sub-agentami

**Prerequisite:** `compile_commands.json` w root projektu.
CMake: `cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -B build .`
qmake: `bear -- qmake && bear -- make`

---

## ADL-009 — Sub-agenci z Merge Agent pattern

Data: 2026-04-05 | Status: active

**Kontekst:** Fazy 2-5 mogą analizować wiele plików/symboli równolegle.
Równoległość jest kluczowa dla projektów 150k+ linii kodu.

**Decyzja:** Fazy 2, 3, 4, 5, 7 używają wzorca:
```
Phase Agent → N × Sub-agents (równolegle) → Merge Agent → output.md
```

Fazy 0, 1, 6 są monolityczne (jeden agent, brak sub-agentów).

**Sub-agent scope:**
- Faza 2: jeden sub-agent per para .h/.cpp
- Faza 3: jeden sub-agent per .ui file / QML komponent
- Faza 4: jeden sub-agent per cluster connect() wywołań
- Faza 5: osobne sub-agenty dla kodu, testów, docs/, crosscheck
- Faza 7: jeden sub-agent per feature cluster

---

## ADL-010 — Partial pliki: persystowane jako audit trail

Data: 2026-04-05 | Status: active

**Kontekst:** Sub-agenci produkują partial wyniki przed merge. Pytanie:
czy te pliki tymczasowe mają znikać po merge czy zostawać?

**Opcje:**
- A) Efemeryczne — znikają po merge (czystość)
- B) Persystowane w `_partials/` ← **wybrane**

**Uzasadnienie:** Gdy Merge Agent popełni błąd lub coś pominie, bez
partial plików nie ma jak wrócić do surowych danych. `_partials/` to
audit trail który pozwala debugować i wznawiać bez powtarzania całej fazy.
Storage jest tani, czas sub-agentów jest drogi.

---

## ADL-011 — Serena memory jako transport między sub-agentami

Data: 2026-04-05 | Status: active

**Kontekst:** Sub-agenci muszą przekazać wyniki do Merge Agenta.
Pytanie: pliki MD czy Serena memory system?

**Decyzja:** Dual approach:
- Serena `write_memory` dla szybkiego transferu w trakcie sesji
- Pliki MD w `_partials/` jako persystowane backup (ADL-010)

**Uzasadnienie:** Serena memory jest szybsza dla in-session komunikacji.
Pliki MD są persystowane między sesjami. Oba mechanizmy razem dają
i szybkość i trwałość.

---

## ADL-012 — compile_commands.json jako twarde prerequisite

Data: 2026-04-05 | Status: active

**Kontekst:** Serena z backendem clangd wymaga compile_commands.json
dla cross-file reference finding. Bez tego narzędzia semantyczne nie działają.

**Decyzja:** PREREQ-CHECK.md to osobny agent uruchamiany ZAWSZE przed
Fazą 0. Jeśli compile_commands.json nie istnieje — generuje go automatycznie
(dla CMake) lub instruuje użytkownika (dla qmake). Blokuje dalsze fazy.

**Strategia generowania:**
```bash
# CMake (auto):
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -B .build . && \
cp .build/compile_commands.json .

# qmake (semi-auto, wymaga bear):
which bear || (echo "Install bear: apt/brew install bear" && exit 1)
bear -- qmake && bear -- make
```

---

## ADL-013 — Migracja do struktury Claude Code ze slash commands

Data: 2026-04-05 | Status: active

**Kontekst:** System agentów był zapakowany w `archive/` i nie miał
integracji z Claude Code slash commands. Użytkownik musiał ręcznie
czytać pliki agentów i kopiować instrukcje.

**Decyzja:** Migracja struktury:
- Pliki przeniesione z `archive/` do root projektu
- Utworzony `.claude/commands/` z 10 slash commandami
- CLAUDE.md zaktualizowany o sekcję slash commands

**Slash commands:** `/prereq-check`, `/phase-0` do `/phase-7`, `/status`

**Wpływ:** Użytkownik uruchamia fazę jednym poleceniem `/phase-N ARTIFACT_ID`
zamiast ręcznego czytania plików agentów. Pliki agentów nadal istnieją
jako pełna dokumentacja — slash commands są skrótami do ich wykonania.
