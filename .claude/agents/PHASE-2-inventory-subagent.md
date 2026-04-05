# PHASE-2 — Inventory Sub-Agent (per klasa)
## Wersja: 1.1.0 | Faza: 2 | Scope: jeden plik .h + .cpp

---

## Toolbox — Serena MCP First

> **Twarda reguła:** Używaj Serena MCP jako PRIMARY tool do interakcji z kodem źródłowym.
> NIGDY nie używaj `grep`, `cat`, `Read` do czytania kodu C++/Qt.
> Bash dopuszczalny TYLKO dla operacji systemowych.
>
> | Potrzebujesz | Użyj Serena | NIE używaj |
> |---|---|---|
> | Przegląd symboli pliku | `get_symbols_overview` | `cat`, `head`, `Read` |
> | Szukanie wzorców w kodzie | `search_for_pattern` | `grep`, `rg` |
> | Czytanie ciała metody/klasy | `find_symbol(include_body=true)` | `Read`, `cat` |
> | Ustalenie typu Qt klasy | `find_symbol(include_info=true)` | `grep "class"` |
> | Referencje do symbolu | `find_referencing_symbols` | `grep` |
> | Enums i stałe | `find_symbol` z `include_kinds` | `grep "enum"` |

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
Serena: get_symbols_overview(relative_path="{HEADER_FILE}", depth=1)
→ Lista symboli najwyższego poziomu (klasy, funkcje, enums)
→ depth=1: pokaż też metody klas

Jeśli SOURCE_FILE != null:
Serena: get_symbols_overview(relative_path="{SOURCE_FILE}")
→ Lista metod zaimplementowanych
```

### Krok 2 — Dla każdej klasy w pliku

#### 2a — Ustal typ Qt

```
Serena: find_symbol(
  name_path_pattern="{CLASSNAME}",
  relative_path="{HEADER_FILE}",
  include_info=true,
  max_matches=1
)
→ Odczytaj klasę bazową z wyniku (info zawiera sygnaturę z dziedziczeniem)
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
  substring_pattern="signals:",
  relative_path="{HEADER_FILE}",
  context_lines_after=20
)
→ Znajdź sekcję signals:
→ Wylistuj każdy sygnał z typami parametrów
```

Dla każdego sygnału opisz: nazwa, parametry, semantyczne znaczenie
(co ten sygnał oznacza biznesowo, nie technicznie).

#### 2c — Wyciągnij sloty

```
Serena: search_for_pattern(
  substring_pattern="(public|protected|private) slots:",
  relative_path="{HEADER_FILE}",
  context_lines_after=20
)
→ Znajdź sekcje slotów
→ Wylistuj każdy slot z typami parametrów i widocznością
```

#### 2d — Wyciągnij Q_PROPERTY

```
Serena: search_for_pattern(
  substring_pattern="Q_PROPERTY",
  relative_path="{HEADER_FILE}"
)
→ Każdy Q_PROPERTY: typ, nazwa, READ, WRITE, NOTIFY
→ To jest bindable state klasy
```

#### 2e — Wyciągnij publiczne metody (API klasy)

```
Serena: find_symbol(
  name_path_pattern="{CLASSNAME}",
  relative_path="{HEADER_FILE}",
  depth=1
)
→ Pobierz listę metod klasy (depth=1 = bezpośrednie dzieci)
→ Filtruj: tylko public methods
→ Pomiń: konstruktory trywialne, gettery/settery proste
→ Zostaw: metody które mają semantyczne znaczenie biznesowe
```

#### 2f — Wyciągnij enums i stałe

```
# Enums — użyj LSP symbol kind 10 (Enum)
Serena: get_symbols_overview(relative_path="{HEADER_FILE}", depth=1)
→ Wyfiltruj symbole typu Enum i EnumMember

# Jeśli potrzebujesz pełnych wartości:
Serena: find_symbol(
  name_path_pattern="{ENUM_NAME}",
  relative_path="{HEADER_FILE}",
  include_body=true
)
```

Każdy enum = zbiór możliwych stanów lub kategorii (często = reguła biznesowa).

#### 2g — Analiza implementacji (jeśli SOURCE_FILE istnieje)

Dla każdej publicznej metody z 2e:
```
Serena: find_symbol(
  name_path_pattern="{CLASSNAME}/{METHOD_NAME}",
  relative_path="{SOURCE_FILE}",
  include_body=true,
  max_matches=1
)
→ Pobierz implementację metody
→ Wyciągnij: warunki wejściowe (if/guard clauses)
→ Wyciągnij: walidacje (assert, throw, return early)
→ Wyciągnij: SQL zapytania (QSqlQuery) — to są reguły biznesowe!
→ Wyciągnij: wywołania zewnętrznych systemów (QProcess, QTcpSocket)
→ NIE opisuj algorytmu — opisz co metoda osiąga
```

#### 2h — Identyfikacja Linux-specific użycia

```
Serena: search_for_pattern(
  substring_pattern="QProcess|jackd|cdparanoia|lame|flac",
  relative_path="{SOURCE_FILE}"
)

Serena: search_for_pattern(
  substring_pattern="QDBusInterface|QDBusConnection",
  relative_path="{SOURCE_FILE}"
)

Serena: search_for_pattern(
  substring_pattern="/dev/|/proc/|/etc/|Q_OS_LINUX",
  relative_path="{SOURCE_FILE}"
)

→ Każde znalezione użycie → oznacz jako LINUX_SPECIFIC
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
