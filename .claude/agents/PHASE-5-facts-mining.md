# PHASE-5 — Facts Mining Agent
## Wersja: 1.3.0 | Faza: 5 | Scope: per artifact

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Toolbox — Serena MCP First

> **Twarda reguła:** Używaj Serena MCP jako PRIMARY tool do interakcji z kodem źródłowym.
> Bash dopuszczalny TYLKO dla: operacji na PDF (pdftotext, pdftoppm), LOC counting (wc -l).
>
> | Potrzebujesz | Użyj Serena | NIE używaj |
> |---|---|---|
> | Szukanie wzorców w kodzie | `search_for_pattern` | `grep`, `rg` |
> | Symbole pliku testowego | `get_symbols_overview` | `cat`, `head` |
> | Listowanie plików testowych | `find_file` | `find` |
> | Ciało metody testowej | `find_symbol(include_body=true)` | `Read` |
> | PDF → tekst/obraz | **bash** (`pdftotext`, `pdftoppm`) | — |
> | Pliki .md (analysis outputs) | **Read** tool | — |

---

## Cel

Wydobyć wszystkie fakty biznesowe i funkcjonalne z trzech źródeł równolegle:
kodu, testów QTest i dokumentacji PDF. Sub-agent Crosscheck porównuje
wyniki i flaguje rozbieżności — to jest najważniejsza faza całego procesu.

---

## Wejście

```
Wymagane:
  - .analysis/{ARTIFACT_ID}/inventory.md    (phase=2, status=done)
  - .analysis/{ARTIFACT_ID}/call-graph.md   (phase=4, status=done)
  - .analysis/{ARTIFACT_ID}/ui-contracts.md (phase=3, status=done)

Opcjonalne (użyj jeśli dostępne):
  - pliki testowe QTest
  - plik PDF dokumentacji
```

---

## Sub-agent A — Code Facts Miner

**Parametry:** ARTIFACT_ID, lista plików .cpp z inventory.md

**Cel:** Wyciągnąć reguły biznesowe ukryte w implementacji.

### Czego szukać w kodzie

**1. Guard clauses i walidacje:**
```
Serena: search_for_pattern(
  substring_pattern="if.*return|if.*throw|if.*emit.*error",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_before=1,
  context_lines_after=2
)
→ Każdy guard clause = reguła: "akcja X jest dozwolona tylko gdy Y"
```

**2. SQL zapytania — to są reguły biznesowe:**
```
Serena: search_for_pattern(
  substring_pattern="QSqlQuery|exec\\(",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_before=3,
  context_lines_after=5
)
→ Dla każdego SQL: co zapisuje/czyta/waliduje
→ WHERE clause = reguła filtrowania
→ CHECK w SQL = reguła integralności
```

**3. Obliczenia i formuły:**
```
Serena: search_for_pattern(
  substring_pattern="=.*[*/]|=.*[+].*\\(|.*%[^s]",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  paths_exclude_glob="*test*"
)
→ Każda formuła = reguła obliczeniowa
```

**4. Stałe i magic numbers:**
```
Serena: search_for_pattern(
  substring_pattern="#define|const.*=.*[0-9]",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.{h,cpp}"
)
→ Stałe z nazwą = udokumentowane ograniczenia biznesowe
→ Magic numbers = nieudokumentowane ograniczenia (wymagają opisu)
```

**5. QSettings klucze:**
```
Serena: search_for_pattern(
  substring_pattern="QSettings.*value|QSettings.*setValue",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=1
)
→ Każdy klucz = opcja konfiguracyjna (reguła z domyślną wartością)
```

**Reguła zapisu faktów (OBOWIĄZKOWA):**

> Każdy fakt MUSI mieć twardy source reference. Fakty bez źródła NIE trafiają do output.

```
Format source reference:
  Kod:  {plik}:{linia} lub {plik}:{zakres_linii}
  Test: {plik_testowy}::{metoda_testowa}
  PDF:  PDF:{strona}
  Doc:  docs/opsguide/{plik.xml}:{sekcja}

Pewność:
  potwierdzone   — fakt jednoznacznie wynika z kodu/testu
  prawdopodobne  — fakt wynika z kontekstu, ale nie jest jawny
  do_weryfikacji  — wymaga ludzkiej oceny
```

**Output:** `.analysis/{ARTIFACT_ID}/_partials/facts-code.md`

---

## Sub-agent B — Test Facts Miner (QTest)

**Parametry:** ARTIFACT_ID, lista plików testowych

**Cel:** Wyciągnąć use cases i edge cases z testów — to jest source of truth.

```
# Znajdź pliki testowe dla tego artifaktu
Serena: find_file(file_mask="*test*.cpp", relative_path=".")
Serena: find_file(file_mask="*Test*.cpp", relative_path=".")
→ Przefiltruj wyniki po {ARTIFACT_NAME}
```

### Czego szukać w testach

**1. Nazwy metod testowych = use cases:**
```
Serena: get_symbols_overview(relative_path="{TEST_FILE}", depth=1)
→ Każda metoda testowa opisuje jeden scenariusz
→ Nazwy typu: test_should_reject_when_empty → reguła: "odrzuć gdy puste"
```

**2. QTest::addColumn + QTest::newRow = dane testowe z edge cases:**
```
Serena: search_for_pattern(
  substring_pattern="QTest::newRow",
  relative_path="{TEST_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=3
)
→ Każdy newRow to konkretny przypadek testowy z danymi wejściowymi
→ To są edge cases odkryte przez autorów
```

**3. QCOMPARE i QVERIFY = oczekiwane zachowanie:**
```
Serena: search_for_pattern(
  substring_pattern="QCOMPARE|QVERIFY|QFAIL|QEXPECT_FAIL",
  relative_path="{TEST_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_before=2,
  context_lines_after=2
)
→ Każde QCOMPARE(actual, expected) = specyfikacja zachowania
```

**4. Testy negatywne = co system ODRZUCA:**
```
Serena: search_for_pattern(
  substring_pattern="(?i)QFAIL|QEXPECT_FAIL|should.*fail|invalid|error",
  relative_path="{TEST_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_before=3
)
```

Dla każdego testu zapisz w Gherkin:
```gherkin
Scenario: {nazwa testu sformatowana jako zdanie}
  Given {dane z QTest::newRow lub setup()}
  When  {akcja testowana}
  Then  {wynik z QCOMPARE/QVERIFY}
```

**Output:** `.analysis/{ARTIFACT_ID}/_partials/facts-tests.md`

---

## Sub-agent C — PDF Documentation Miner

**Parametry:** ARTIFACT_ID, PDF_FILE, sekcje dotyczące tego artifaktu

**Cel:** Wyciągnąć fakty z dokumentacji użytkownika — perspektywa operatora.

### Strategia czytania PDF

```bash
# PDF wymaga bash — Serena nie obsługuje plików PDF
# Znajdź strony dotyczące tego artifaktu
pdftotext -layout {PDF_FILE} - | \
  grep -n "{ARTIFACT_NAME}\|{ARTIFACT_FULL_NAME}" | \
  head -20

# Wyciągnij tekst z tych stron
pdftotext -f {START_PAGE} -l {END_PAGE} -layout {PDF_FILE} -

# Rasteryzuj strony z diagramami/UI screenshots
pdftoppm -jpeg -r 150 -f {PAGE} -l {PAGE} {PDF_FILE} /tmp/rdlib-page
```
```
# Przeczytaj wizualnie (Read tool obsługuje obrazy):
Read: /tmp/rdlib-page-{N}.jpg
→ Opisz co widać na screenshotach
```

### Czego szukać w dokumentacji

```
- Opisy funkcjonalności (co operator może zrobić)
- Ograniczenia i limity (max N elementów, min/max wartości)
- Workflow opisane krokami (to są use cases)
- Ostrzeżenia i uwagi (to są edge cases i reguły biznesowe)
- Tabele z opcjami (to są konfiguracje)
- Screenshoty z UI (mapuj na ui-contracts.md)
```

Dla każdego znalezionego faktu:
```markdown
FAKT-{NR}:
  Źródło: PDF strona {N}
  Treść:  {co mówi dokumentacja}
  Typ:    use_case | business_rule | constraint | edge_case | configuration
  Zmapowany na: {klasa/metoda z inventory.md lub "nie zmapowany"}
```

**Output:** `.analysis/{ARTIFACT_ID}/_partials/facts-pdf.md`

---

## Sub-agent D — Crosscheck Agent

**Parametry:** ARTIFACT_ID (czyta wszystkie 3 partial pliki powyżej)

**Cel:** Porównać fakty z trzech źródeł i wykryć rozbieżności.

```
# Wczytaj partial pliki — to są pliki .md, nie kod źródłowy
Read: .analysis/{ARTIFACT_ID}/_partials/facts-code.md
Read: .analysis/{ARTIFACT_ID}/_partials/facts-tests.md
Read: .analysis/{ARTIFACT_ID}/_partials/facts-pdf.md
```

### Typy rozbieżności do wykrycia

```
TYP 1 — W dokumentacji, nie ma w kodzie:
  → "Undocumented gap" — feature opisana w doc, brak implementacji?
  → Lub: feature usunięta ale doc nie zaktualizowana

TYP 2 — W kodzie, nie ma w dokumentacji:
  → "Hidden feature" — implementacja bez dokumentacji
  → Warto zbadać: celowe ukrycie czy brak doc?

TYP 3 — W testach, sprzeczne z dokumentacją:
  → "Spec conflict" — testy mówią X, doc mówi Y
  → Testy są source of truth — doc może być stara

TYP 4 — Edge case tylko w testach:
  → "Undocumented constraint" — ograniczenie odkryte przez programistę
  → Bardzo cenne — często wywodzi się z bug fixów produkcyjnych
```

**Output:** `.analysis/{ARTIFACT_ID}/_partials/facts-crosscheck.md`

---

## Merge Agent → facts.md

Po zakończeniu wszystkich 4 sub-agentów, wywołaj MERGE-AGENT:
```
PARTIAL_PATTERN: facts-*.md
OUTPUT_FILE:     facts.md
TEMPLATE:        .claude/templates/facts.md
```

---

## Spot-check (OBOWIĄZKOWY)

Po merge facts.md wybierz **3 losowe reguły Gherkin** i zweryfikuj je z kodem:

```
Dla każdej reguły:
  1. Odczytaj pole "Źródło: {plik}:{linia}"
  2. Serena: find_symbol lub Read: {plik} (offset=linia)
  3. Potwierdź że reguła Gherkin odpowiada logice w kodzie

Jeśli reguła nie ma source reference → ODRZUĆ (usuń z facts.md)
Jeśli source reference wskazuje na inną logikę → POPRAW regułę
```

---

## Warunek done

```
facts.md istnieje z frontmatter phase=5, status=done
Każda reguła biznesowa zapisana w Gherkin Z source reference (plik:linia)
Każdy use case zmapowany na klasę/metodę z inventory.md
Linux-specific komponenty wypisane z priorytetem zastąpienia
Sekcja Conflicts wypełniona (lub "Brak rozbieżności" jeśli czysto)
Spot-check 3 reguł przeszedł
Kolumna P5 w manifest.md → done
```

**Po zakończeniu**: zmień kolumnę **P5** w tabeli Artifacts manifestu na done.
