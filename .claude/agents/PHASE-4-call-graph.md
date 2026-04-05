# PHASE-4 — Signal & Call Graph Agent
## Wersja: 1.2.0 | Faza: 4 | Scope: per artifact

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
> NIGDY nie używaj `grep`, `cat`, `Read` do szukania wzorców w plikach C++/Qt.
>
> | Potrzebujesz | Użyj Serena | NIE używaj |
> |---|---|---|
> | Szukanie connect()/emit() | `search_for_pattern` | `grep`, `rg` |
> | Referencje do klasy | `find_referencing_symbols` | `grep` |
> | Symbole pliku | `get_symbols_overview` | `cat`, `Read` |
> | Ciało metody | `find_symbol(include_body=true)` | `Read` |
> | Listowanie plików | `find_file`, `list_dir` | `find`, `ls` |

---

## Cel

Zbudować kompletny graf reaktywności: każdy connect(), emit() i Q_PROPERTY
z dokładnym mapowaniem nadawca→sygnał→odbiorca→slot→efekt biznesowy.
To jest BACKBONE dla zrozumienia jak system reaguje na zdarzenia.

---

## Wejście

```
Wymagane:   .analysis/{ARTIFACT_ID}/inventory.md (phase=2, status=done)
```

---

## Kroki wykonania

### Krok 1 — Zbierz wszystkie punkty connect()

```
# Qt5-style connect (pointer-to-member)
Serena: search_for_pattern(
  substring_pattern="connect\\(",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=3
)
→ Lista wszystkich wywołań connect()
→ context_lines_after=3 łapie multi-line connect() calls

# Jeśli potrzebujesz odfiltrować Qt4-style (SIGNAL/SLOT makra):
Serena: search_for_pattern(
  substring_pattern="SIGNAL\\(|SLOT\\(",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)
```

### Krok 2 — Zbierz wszystkie emit()

```
Serena: search_for_pattern(
  substring_pattern="emit ",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_before=2
)
→ Lista wszystkich emisji sygnałów (kontekst przed = warunek emisji)
```

### Krok 3 — Zbierz wszystkie Q_PROPERTY z NOTIFY

```
Serena: search_for_pattern(
  substring_pattern="Q_PROPERTY",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.h"
)
→ Dla każdego Q_PROPERTY z NOTIFY: to jest automatyczny connect w QML
```

### Krok 4 — Uruchom sub-agenty równolegle

Jeden sub-agent per klasa z Q_OBJECT (lista z inventory.md).

**Sub-agent: per QObject subclass**

```
Parametry:
  CLASS_NAME: {NazwaKlasy}
  CLASS_FILE: {ścieżka .cpp}
  PARTIAL_ID: {NR}
```

Dla tej klasy:
```
# Jako NADAWCA (co ta klasa emituje)
Serena: search_for_pattern(
  substring_pattern="emit ",
  relative_path="{CLASS_FILE}",
  context_lines_before=3
)
→ Lista sygnałów które ta klasa emituje
→ Kontekst: w jakiej metodzie, przy jakim warunku

# Jako ODBIORCA (kto łączy się z tą klasą)
Serena: find_referencing_symbols(
  name_path="{CLASS_NAME}",
  relative_path="{CLASS_HEADER_FILE}"
)
→ Kto tworzy instancje tej klasy
→ W których miejscach jest connect() z tą klasą jako src lub dst

# Wewnętrzne połączenia (self-connections)
Serena: search_for_pattern(
  substring_pattern="connect\\(this",
  relative_path="{CLASS_FILE}"
)
```

Format partial:
`.analysis/{ARTIFACT_ID}/_partials/sig-{PARTIAL_ID}-{CLASSNAME}.md`

```markdown
---
partial_id: {NR}
class_name: {CLASSNAME}
artifact: {ARTIFACT_ID}
phase: 4
status: done
---

# Call Graph: {CLASSNAME}

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| cartSaved(int id) | onSaveClicked() | po sukcesie zapisu | Cart został pomyślnie zapisany |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| RDLibrary | cartSelected(int) | onCartSelected(int) | rdlibrary.cpp:234 |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|------------|---------|--------------|------------------------------|
| saveClicked() | m_database | save(Cart) | rdcartedit.cpp:89 |

## Q_PROPERTY reactive bindings
| Property | Typ | Notify sygnał | Kto nasłuchuje |
|----------|-----|--------------|----------------|
| volume | int | volumeChanged | VolumeSlider (QML binding) |

## Cross-artifact sygnały (D-Bus lub inne IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| QDBus | RDAirPlay | cartPlayed(int) | Powiadom że cart jest odtwarzany |
```

### Krok 5 — Wywołaj Merge Agent

```
MERGE-AGENT z parametrami:
  PARTIAL_PATTERN: sig-*.md
  OUTPUT_FILE:     call-graph.md
  TEMPLATE:        .claude/templates/call-graph.md
```

### Krok 6 — Wykryj circular dependencies

Po merge sprawdź:
```
Czy jest cykl A→B→A w grafie?
Oznacz jako WARNING — mogą być intencjonalne (feedback loops) lub bugi
```

---

## Warunek done

```
call-graph.md istnieje z frontmatter phase=4, status=done
Każdy connect() z kodu ma krawędź w grafie
Każdy emit() jest zmapowany do connect() odbiorców
Cross-artifact połączenia (TCP/IPC) są oznaczone
Spot-check 3 klas przeszedł
Kolumna P4 w manifest.md → done
```

### Spot-check (OBOWIĄZKOWY)

Wybierz **3 klasy** z największą liczbą sygnałów. Dla każdej:

```
# Porównaj sygnały z header vs call-graph.md
Serena: search_for_pattern(
  substring_pattern="signals:",
  relative_path="{HEADER_FILE}",
  context_lines_after=30
)
→ Lista sygnałów z headera

# Porównaj z sekcją w call-graph.md
→ Czy każdy sygnał z headera jest w grafie?
→ Jeśli brakuje → sprawdź czy sygnał jest połączony w aplikacjach klienckich
   (w takim przypadku dodaj do "Missing Coverage" z wyjaśnieniem)
```

**Po zakończeniu**: zmień kolumnę **P4** w tabeli Artifacts manifestu na done.
