# PHASE-5 — Facts Mining Agent
## Wersja: 1.0.0 | Faza: 5 | Scope: per artifact

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
  pattern="if.*return|if.*throw|if.*emit.*error",
  path="{ARTIFACT_FOLDER}"
)
→ Każdy guard clause = reguła: "akcja X jest dozwolona tylko gdy Y"
```

**2. SQL zapytania — to są reguły biznesowe:**
```
Serena: search_for_pattern(
  pattern="QSqlQuery|exec(",
  path="{ARTIFACT_FOLDER}"
)
→ Dla każdego SQL: co zapisuje/czyta/waliduje
→ WHERE clause = reguła filtrowania
→ CHECK w SQL = reguła integralności
```

**3. Obliczenia i formuły:**
```bash
grep -rn "=.*\*\|=.*\/\|\..*().*+\|.*%.*" \
  --include="*.cpp" {ARTIFACT_FOLDER} | \
  grep -v "^//\|test\|Test" | head -50
# → każda formuła = reguła obliczeniowa
```

**4. Stałe i magic numbers:**
```
Serena: search_for_pattern(
  pattern="#define|const.*=.*[0-9]",
  path="{ARTIFACT_FOLDER}"
)
→ Stałe z nazwą = udokumentowane ograniczenia biznesowe
→ Magic numbers = nieudokumentowane ograniczenia (wymagają opisu)
```

**5. QSettings klucze:**
```
Serena: search_for_pattern(
  pattern="QSettings.*value|QSettings.*setValue",
  path="{ARTIFACT_FOLDER}"
)
→ Każdy klucz = opcja konfiguracyjna (reguła z domyślną wartością)
```

**Output:** `.analysis/{ARTIFACT_ID}/_partials/facts-code.md`

---

## Sub-agent B — Test Facts Miner (QTest)

**Parametry:** ARTIFACT_ID, lista plików testowych

**Cel:** Wyciągnąć use cases i edge cases z testów — to jest source of truth.

```bash
# Znajdź pliki testowe dla tego artifaktu
find . -name "*test*" -o -name "*Test*" | \
  grep -i "{ARTIFACT_NAME}" | grep "\.cpp$"
```

### Czego szukać w testach

**1. Nazwy metod testowych = use cases:**
```
Serena: get_symbols_overview(file="{TEST_FILE}")
→ Każda metoda testowa opisuje jeden scenariusz
→ Nazwy typu: test_should_reject_when_empty → reguła: "odrzuć gdy puste"
```

**2. QTest::addColumn + QTest::newRow = dane testowe z edge cases:**
```
Serena: search_for_pattern(
  pattern="QTest::newRow",
  path="{TEST_FOLDER}"
)
→ Każdy newRow to konkretny przypadek testowy z danymi wejściowymi
→ To są edge cases odkryte przez autorów
```

**3. QCOMPARE i QVERIFY = oczekiwane zachowanie:**
```bash
grep -n "QCOMPARE\|QVERIFY\|QFAIL\|QEXPECT_FAIL" \
  --include="*.cpp" -r {TEST_FOLDER}
→ Każde QCOMPARE(actual, expected) = specyfikacja zachowania
```

**4. Testy negatywne = co system ODRZUCA:**
```bash
grep -n "QFAIL\|QEXPECT_FAIL\|should.*fail\|invalid\|error" \
  --include="*.cpp" -ri {TEST_FOLDER}
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
# Znajdź strony dotyczące tego artifaktu
pdftotext -layout {PDF_FILE} - | \
  grep -n "{ARTIFACT_NAME}\|{ARTIFACT_FULL_NAME}" | \
  head -20
# → Zidentyfikuj zakres stron
```

```bash
# Wyciągnij tekst z tych stron
pdftotext -f {START_PAGE} -l {END_PAGE} -layout {PDF_FILE} -
```

```bash
# Rasteryzuj strony z diagramami/UI screenshots
pdftoppm -jpeg -r 150 -f {PAGE} -l {PAGE} {PDF_FILE} /tmp/rdlib-page
ls /tmp/rdlib-page*.jpg
# → Przeczytaj wizualnie przez Serena: read_file(/tmp/rdlib-page-N.jpg)
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
Wczytaj:
  Serena: read_memory("facts-code") LUB read_file("_partials/facts-code.md")
  Serena: read_memory("facts-tests") LUB read_file("_partials/facts-tests.md")
  Serena: read_memory("facts-pdf") LUB read_file("_partials/facts-pdf.md")
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

## Warunek done

```
facts.md istnieje z frontmatter phase=5, status=done
Każda reguła biznesowa zapisana w Gherkin
Każdy use case zmapowany na klasę/metodę z inventory.md
Linux-specific komponenty wypisane z priorytetem zastąpienia
Sekcja Conflicts wypełniona (lub "Brak rozbieżności" jeśli czysto)
```
