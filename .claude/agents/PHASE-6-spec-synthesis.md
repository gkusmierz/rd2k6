# PHASE-6 — SPEC Synthesis Agent
## Wersja: 1.3.0 | Faza: 6 | Scope: per artifact | Typ: monolithic

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Toolbox

> Ten agent operuje ZARÓWNO na plikach `.md` (analysis outputs) JAK I na kodzie źródłowym.
> - Czytanie plików wejściowych: **Read** tool (pliki .md)
> - Ekstrakcja brakujących danych z kodu: `Serena: find_symbol`, `search_for_pattern`, `get_symbols_overview`
> - Walidacja: `Serena: search_for_pattern` dla statusów

---

## Cel

Syntetyzować SPEC.md — **nawigacyjny dokument** opisujący WHAT bez HOW.
SPEC.md jest **indeksem i podsumowaniem**, NIE superdokumentem.
Szczegóły żyją w plikach faz 2-5 i są **referencjonowane**, nie kopiowane.

### Zmiana roli SPEC.md (v1.3.0)

| Stara rola (v1.2) | Nowa rola (v1.3) |
|---|---|
| Superdokument z całą wiedzą | Nawigacyjny PRD z referencjami |
| Kopiuje dane z faz 2-5 | Podsumowuje + linkuje do źródeł |
| UI = skrócona tabela | UI = pełne referencje do ui-contracts.md + mockupów |
| Brak data model | **Nowa sekcja: Data Model (schemat DB)** |
| Brak API | **Nowa sekcja: API/Protocol Contracts** |

---

## Wejście

```
Wymagane (wszystkie muszą mieć status=done):
  .analysis/{ARTIFACT_ID}/inventory.md      (phase=2)
  .analysis/{ARTIFACT_ID}/ui-contracts.md   (phase=3)
  .analysis/{ARTIFACT_ID}/call-graph.md     (phase=4)
  .analysis/{ARTIFACT_ID}/facts.md          (phase=5)

NOWE — agent MUSI też czytać kod źródłowy bezpośrednio:
  - Schemat DB: SQL tabele z kodu (QSqlQuery CREATE/ALTER/INSERT)
  - Protokoły: format komend TCP/IPC z kodu
  - Konfiguracja: klucze z kodu (QSettings, RDConfig)
  
  NIE polegaj wyłącznie na streszczeniach z poprzednich faz!

Opcjonalne:
  .analysis/{PROJECT}.manifest.md           (dla kontekstu cross-artifact)
```

---

## Kroki wykonania

### Krok 1 — Przeczytaj inputy z faz 2-5

Wczytaj sekwencyjnie:
1. inventory.md — zrozum domain model
2. call-graph.md — zrozum reaktywność
3. ui-contracts.md — zrozum UI layer
4. facts.md — zrozum reguły biznesowe i use cases

### Krok 2 — Ekstrakcja danych BEZPOŚREDNIO z kodu (NOWE)

> Fazy 2-5 nie wyciągają wszystkiego. SPEC agent musi sam pozyskać:

**2a — Data Model (schemat bazy danych)**
```
# Znajdź SQL CREATE/ALTER TABLE w kodzie
Serena: search_for_pattern(
  substring_pattern="CREATE TABLE|ALTER TABLE|CREATE INDEX",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.{cpp,h,sql}",
  context_lines_after=20
)

# Znajdź nazwy tabel używanych w QSqlQuery
Serena: search_for_pattern(
  substring_pattern="from\\s+[A-Z_]+|into\\s+[A-Z_]+|update\\s+[A-Z_]+",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=3
)

→ Zbuduj listę tabel z kolumnami
→ Zmapuj tabele na encje z inventory.md
```

**2b — API / Protocol Contracts**
```
# Komendy TCP (dla klas komunikacyjnych)
Serena: search_for_pattern(
  substring_pattern="sprintf.*\"|QString.*\"[A-Z][A-Z]",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/rd{cae,ripc,catch_connect}.cpp",
  context_lines_before=2,
  context_lines_after=2
)

# HTTP endpoints (jeśli są)
Serena: search_for_pattern(
  substring_pattern="QUrl|QNetworkRequest|/cgi-bin/|rdxport",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)

→ Lista komend/endpointów z parametrami
```

### Krok 3 — Buduj SPEC.md sekcja po sekcji

Używaj szablonu `.claude/templates/SPEC.md`. Wypełnij każdą z **16 sekcji** (było 14, dodano 2 nowe):

**Sekcja 1 — Project Overview**
- Co robi ten artifact (2-3 zdania, zero technologii)
- Główni użytkownicy / aktorzy
- Kluczowe wartości biznesowe

**Sekcja 2 — Domain Model**
- Encje biznesowe (z inventory.md)
- Relacje między encjami
- Enums jako zbiory stanów/kategorii
- **NOWE:** Referencja do pełnego inventory: `→ Pełne API: inventory.md#{ENCJA}`

**Sekcja 3 — Data Model (schemat DB) ← NOWA**
- Tabele z kolumnami i typami (z Kroku 2a)
- Mapowanie: tabela DB ↔ encja domenowa
- Kluczowe relacje FK
- Format:

```markdown
### Tabela: CART
| Kolumna | Typ | Null | Opis |
|---------|-----|------|------|
| NUMBER | int unsigned | NO | PK, numer carta |
| TYPE | int | NO | 1=Audio, 2=Macro |
| GROUP_NAME | varchar(10) | NO | FK → GROUPS |
| TITLE | varchar(255) | YES | Tytuł carta |
...

Mapowanie: CART → encja Cart (inventory.md#RDCart)
```

**Sekcja 4 — Functional Capabilities (Use Cases)**
- Lista use cases: Aktor → akcja → efekt
- **Referencja:** `→ Pełne reguły: facts.md`

**Sekcja 5 — Business Rules (Gherkin)**
- KLUCZOWE reguły (nie wszystkie — tylko te definiujące zachowanie)
- **Referencja:** `→ Kompletne reguły z source references: facts.md`
- Reguły tu powinny być na poziomie "co system gwarantuje", nie szczegóły implementacji

**Sekcja 6 — State Machines**
- Maszyny stanów dla encji z "statusem"
- Mermaid diagramy + tabele przejść

**Sekcja 7 — Reactive Architecture**
- Kluczowe przepływy zdarzeń (słownie, bez Qt-specific)
- Cross-artifact komunikacja
- **Referencja:** `→ Pełny graf: call-graph.md`

**Sekcja 8 — UI/UX Contracts ← ROZSZERZONA**
- **NIE kopiuj** tabel z ui-contracts.md
- Zamiast tego: lista okien z bezpośrednimi linkami
- Dla każdego okna: 1-2 zdania CO robi + link do pełnego kontraktu + link do mockupu

```markdown
### RDCartDialog — wybór carta z biblioteki
Modalny dialog umożliwiający filtrowanie i wybór carta z biblioteki audio.
- **Pełny kontrakt:** `ui-contracts.md#RDCartDialog`
- **Mockup:** `mockups/RDCartDialog.html`
- **Powiązane features:** LIB-010

### RDEditAudio — edytor markerów audio
Pełnoekranowy edytor waveformu z 10 przyciskami markerów.
- **Pełny kontrakt:** `ui-contracts.md#RDEditAudio`
- **Mockup:** `mockups/RDEditAudio.html`
- **Powiązane features:** LIB-010, LIB-004
```

**Sekcja 9 — API & Protocol Contracts ← NOWA**
- Komendy TCP do caed/ripcd/rdcatchd (z Kroku 2b)
- HTTP endpoints (rdxport.cgi)
- Multicast/UDP protokoły
- Format:

```markdown
### CAE Protocol (TCP → caed)
| Komenda | Parametry | Odpowiedź | Znaczenie |
|---------|-----------|-----------|-----------|
| PL | handle length speed pitch | PY handle | Play audio |
| SP | handle | - | Stop playback |
| LR | card name stream | LR card stream handle | Load for record |

### RIPC Protocol (TCP → ripcd)
| Komenda | Parametry | Odpowiedź | Znaczenie |
|---------|-----------|-----------|-----------|
| RU | user! | - | Set user |
| ON | type action id | - | Send notification |
```

**Sekcja 10 — Data Flow**
- Jak dane płyną: DB → model → logika → UI → użytkownik

**Sekcja 11 — Error Taxonomy**
- Błędy z kategoryzacją

**Sekcja 12 — Integration Contracts**
- Shared libraries, cross-artifact, zewnętrzne systemy

**Sekcja 13 — Platform Independence Map**
- Mapowanie platform-specific → generic

**Sekcja 14 — Non-Functional Requirements**
- Tylko testowalne (z Gherkin)

**Sekcja 15 — Configuration**
- Klucze konfiguracyjne z domyślnymi wartościami

**Sekcja 16 — E2E Acceptance Scenarios**
- Minimum 3 kompletne user journeys

### Krok 4 — Quality Gates

```
GATE 1 — Completeness:
  Każdy use case ma scenariusz E2E?
  Każda encja ma regułę?

GATE 2 — Platform Independence:
  Sekcje 4, 5, 8 nie zawierają platform-specific słów

GATE 3 — Referencje:
  NOWE: Sekcja 8 (UI) linkuje do ui-contracts.md i mockupów?
  NOWE: Sekcja 2 linkuje do inventory.md?
  NOWE: Sekcja 3 (Data Model) ma mapowanie tabela→encja?
  NOWE: Sekcja 9 (API) ma listę komend/endpointów?

GATE 4 — Consistency:
  Nazwy encji spójne między sekcjami?
```

---

## Warunek done

```
SPEC.md istnieje z frontmatter phase=6, status=done
Wszystkie 16 sekcji wypełnione
Sekcja 3 (Data Model) ma schemat DB
Sekcja 8 (UI) ma linki do ui-contracts.md i mockupów (nie kopie)
Sekcja 9 (API) ma kontrakty protokołów
Wszystkie 4 Quality Gates zaliczone
Kolumna P6 w manifest.md → done
```

**Po zakończeniu**: zmień kolumnę **P6** w tabeli Artifacts manifestu na done.

## Co dalej

Uruchom `/qtre-phase-7-feature-decomposition ARTIFACT_ID`
