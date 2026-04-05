# PHASE-2 — Inventory Sub-Agent (per klasa)
## Wersja: 1.0.0 | Faza: 2 | Scope: jeden plik .h + .cpp

---

## Cel

Przeprowadzić pełną analizę semantyczną jednej pary .h/.cpp.
Wydobyć WHAT (co klasa robi) bez HOW (jak to implementuje).

---

## Parametry wejściowe

```
ARTIFACT_ID:  identyfikator artifaktu (np. LIB)
HEADER_FILE:  ścieżka do pliku .h
SOURCE_FILE:  ścieżka do pliku .cpp (może być null)
PARTIAL_ID:   numer partial (np. 007)
```

---

## Kroki wykonania

### Krok 1 — Pobierz overview przez Serena

```
Serena: get_symbols_overview(file="{HEADER_FILE}")
→ Lista symboli najwyższego poziomu (klasy, funkcje, enums)

Jeśli SOURCE_FILE != null:
Serena: get_symbols_overview(file="{SOURCE_FILE}")
→ Lista metod zaimplementowanych
```

### Krok 2 — Dla każdej klasy w pliku

#### 2a — Ustal typ Qt

```bash
grep "class {CLASSNAME}.*:.*public" {HEADER_FILE}
```

Mapa typów:
```
: public QMainWindow  → MainWindow     (główne okno aplikacji)
: public QDialog      → Dialog         (modal workflow)
: public QWidget      → Widget         (panel/komponent UI)
: public QAbstractItemModel → DataModel (kontrakt danych MVC)
: public QAbstractTableModel → TableModel
: public QSortFilterProxyModel → ProxyModel
: public QThread      → BackgroundTask  (operacja async)
: public QRunnable    → Task            (zadanie w thread pool)
: public QObject      → Service         (serwis domenowy)
: public QStyledItemDelegate → Delegate (renderer wiersza)
```

#### 2b — Wyciągnij sygnały

```
Serena: search_for_pattern(
  pattern="signals:",
  file="{HEADER_FILE}"
)
→ Znajdź sekcję signals:
→ Wylistuj każdy sygnał z typami parametrów
```

Dla każdego sygnału opisz: nazwa, parametry, semantyczne znaczenie
(co ten sygnał oznacza biznesowo, nie technicznie).

#### 2c — Wyciągnij sloty

```
Serena: search_for_pattern(
  pattern="(public|protected|private) slots:",
  file="{HEADER_FILE}"
)
→ Znajdź sekcje slotów
→ Wylistuj każdy slot z typami parametrów i widocznością
```

#### 2d — Wyciągnij Q_PROPERTY

```
Serena: search_for_pattern(
  pattern="Q_PROPERTY",
  file="{HEADER_FILE}"
)
→ Każdy Q_PROPERTY: typ, nazwa, READ, WRITE, NOTIFY
→ To jest bindable state klasy
```

#### 2e — Wyciągnij publiczne metody (API klasy)

```
Serena: get_symbols_overview(file="{HEADER_FILE}")
→ Filtruj: tylko public methods
→ Pomiń: konstruktory trywialne, gettery/settery proste
→ Zostaw: metody które mają semantyczne znaczenie biznesowe
```

#### 2f — Wyciągnij enums i stałe

```bash
grep -A 20 "enum\|enum class" {HEADER_FILE} | head -60
```

Każdy enum = zbiór możliwych stanów lub kategorii (często = reguła biznesowa).

#### 2g — Analiza implementacji (jeśli SOURCE_FILE istnieje)

Dla każdej publicznej metody z 2e:
```
Serena: find_symbol("{CLASSNAME}::{METHOD_NAME}")
→ Pobierz implementację
→ Wyciągnij: warunki wejściowe (if/guard clauses)
→ Wyciągnij: walidacje (assert, throw, return early)
→ Wyciągnij: SQL zapytania (QSqlQuery) — to są reguły biznesowe!
→ Wyciągnij: wywołania zewnętrznych systemów (QProcess, QTcpSocket)
→ NIE opisuj algorytmu — opisz co metoda osiąga
```

#### 2h — Identyfikacja Linux-specific użycia

```
Szukaj w implementacji:
- QProcess z komendami: "jackd", "cdparanoia", "lame", "flac"
- QDBusInterface, QDBusConnection
- Hardcoded ścieżki: "/dev/", "/proc/", "/etc/"
- #ifdef Q_OS_LINUX

Każde znalezione użycie → oznacz jako LINUX_SPECIFIC
```

### Krok 3 — Zapisz partial wynik

Utwórz `.analysis/{ARTIFACT_ID}/_partials/inv-{PARTIAL_ID}-{CLASSNAME}.md`:

```markdown
---
partial_id: {PARTIAL_ID}
artifact: {ARTIFACT_ID}
class_name: {CLASSNAME}
header_file: {HEADER_FILE}
source_file: {SOURCE_FILE}
phase: 2
status: done
agent_version: 1.0.0
---

# {CLASSNAME}

## Typ Qt
{typ z mapy typów}

## Odpowiedzialność (WHAT)
{1-3 zdania: co ta klasa robi z perspektywy biznesowej}

## Sygnały
| Sygnał | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| {nazwa} | {typy} | {co oznacza to zdarzenie} |

## Sloty
| Slot | Parametry | Widoczność | Co robi |
|------|-----------|------------|---------|
| {nazwa} | {typy} | public/protected | {efekt biznesowy} |

## Stan (Q_PROPERTY)
| Property | Typ | Getter | Setter | Notify signal |
|----------|-----|--------|--------|---------------|
| {nazwa} | {typ} | {getter} | {setter} | {sygnał} |

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| {nazwa} | {typy} | {co osiąga} | {kiedy można wywołać} |

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| {nazwa} | {wartości} | {co reprezentują} |

## Reguły biznesowe (z implementacji)
{lista reguł wyciągniętych z walidacji, guard clauses, SQL}
- Reguła: {opis w języku naturalnym}
- Źródło: {metoda gdzie znaleziona}

## Linux-specific użycia
| Komponent | Użycie | Priorytet zastąpienia |
|-----------|--------|----------------------|
| {np. cdparanoia} | {kontekst} | CRITICAL/HIGH/MEDIUM |

## Zależności od innych klas tego artifaktu
{lista klas z tego samego artifaktu które ta klasa używa}

## Zależności od shared libraries
{lista klas z librd/librdmacro których używa}
```

---

## Warunek done

```
Plik partial istnieje w _partials/
Frontmatter ma status=done
Sekcja "Odpowiedzialność" wypełniona (nie może być pusta)
Sekcje sygnałów i slotów wypełnione LUB "Brak" odnotowane
```
