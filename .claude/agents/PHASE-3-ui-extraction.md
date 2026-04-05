# PHASE-3 — UI Extraction Agent
## Wersja: 1.1.0 | Faza: 3 | Scope: per artifact

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Toolbox — Serena MCP First

> **Twarda reguła:** Używaj Serena MCP do pracy z kodem C++/Qt.
> Pliki .ui (XML) i .qml czytaj przez **Read** tool (Serena LSP ich nie obsługuje).
>
> | Potrzebujesz | Użyj | NIE używaj |
> |---|---|---|
> | Szukanie plików .ui/.qml | `Serena: find_file` | `find` |
> | Szukanie setupUi/connect w .cpp | `Serena: search_for_pattern` | `grep` |
> | Referencje do widgetu w C++ | `Serena: find_referencing_symbols` | `grep` |
> | Symbole klasy okna | `Serena: find_symbol`, `get_symbols_overview` | `cat` |
> | Czytanie pliku .ui (XML) | **Read** tool | — |
> | Czytanie pliku .qml | **Read** tool | — |
> | Przetwarzanie PDF | **bash** (`pdftoppm`) + **Read** (obraz) | — |

---

## Cel

Wydobyć kompletne UI Contracts dla każdego okna/dialogu/panelu artifaktu.
Wejście: pliki .ui (Qt Designer XML), pliki .qml, sekcje PDF z UI screenshots.
Output: ui-contracts.md — frozen UI reference dla agentów kodujących.

---

## Wejście

```
Wymagane:   .analysis/{ARTIFACT_ID}/inventory.md (phase=2, status=done)
Opcjonalne: pliki .ui, pliki .qml, PDF dokumentacja
```

---

## Kroki wykonania

### Krok 1 — Znajdź wszystkie pliki UI

```
Serena: find_file(file_mask="*.ui", relative_path="{ARTIFACT_FOLDER}")
Serena: find_file(file_mask="*.qml", relative_path="{ARTIFACT_FOLDER}")

# Połącz z klasami z inventory.md które używają setupUi()
Serena: search_for_pattern(
  substring_pattern="setupUi",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)
```

Zbuduj mapowanie: `okno (klasa) ↔ plik .ui`

### Krok 2 — Uruchom sub-agenty równolegle

**Sub-agent A: per plik .ui**

Dla każdego pliku .ui:
```
# .ui to XML — Serena nie ma symbolicznego parsera XML, użyj Read tool
Read: {FILE}.ui
→ Parsuj XML Qt Designer
```

Z XML wyciągnij:
```xml
<!-- Szukaj w strukturze XML: -->
<widget class="QDialog" name="MainDialog">
  <property name="windowTitle"><string>Cart Editor</string></property>
  <widget class="QPushButton" name="saveButton">
    <property name="text"><string>Save</string></property>
  </widget>
  <widget class="QLineEdit" name="titleEdit"/>
  ...
</widget>
```

Dla każdego widgetu z akcją (QPushButton, QAction, QMenu):
```
# Znajdź connect() lub slot podłączony do tego widgetu
Serena: search_for_pattern(
  substring_pattern="{BUTTON_NAME}",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=3
)
→ Znajdź slot podłączony do tego buttona

# Jeśli button name to symbol C++:
Serena: find_referencing_symbols(
  name_path="{BUTTON_NAME}",
  relative_path="{ARTIFACT_SOURCE_FILE}"
)
```

**Sub-agent B: per QML komponent**

```
# QML nie jest obsługiwany przez LSP Sereny — użyj Read tool
Read: {FILE}.qml
→ Wyciągnij: komponenty, bindingi, sygnały, stany (State{})
→ Mapuj: property binding → dane które komponent wyświetla
→ Mapuj: onClicked/onActivated → co się dzieje po interakcji
```

**Sub-agent C: PDF UI screenshots (jeśli PDF dostępny)**

```bash
# Rasteryzacja PDF wymaga bash (Serena nie obsługuje PDF)
pdftoppm -jpeg -r 150 -f {PAGE} -l {PAGE} {PDF_FILE} /tmp/page
```
```
# Następnie odczytaj wizualnie:
Read: /tmp/page-{NR}.jpg
→ Opisz wizualnie co widać: układ, przyciski, pola, menu
→ Zmapuj na klasy z inventory.md
```

Każdy sub-agent zapisuje:
`.analysis/{ARTIFACT_ID}/_partials/ui-{NR}-{WINDOWNAME}.md`

### Krok 3 — Wywołaj Merge Agent

```
MERGE-AGENT z parametrami:
  PARTIAL_PATTERN: ui-*.md
  OUTPUT_FILE:     ui-contracts.md
  TEMPLATE:        .claude/templates/ui-contracts.md
```

### Krok 4 — Generuj HTML preview (opcjonalnie)

Dla każdego UI Contract wygeneruj statyczny HTML reference:
`.analysis/{ARTIFACT_ID}/ui-preview/{WINDOWNAME}.html`

To jest frozen UI reference — agenci kodujący dostają to jako "jak ma wyglądać".

---

## Format partial pliku UI (per okno)

```markdown
---
partial_id: {NR}
artifact: {ARTIFACT_ID}
window_name: {NAZWA}
class_name: {KLASA C++}
ui_file: {ścieżka .ui lub null}
window_type: MainWindow|Dialog|Widget|Panel
phase: 3
status: done
---

# UI Contract: {NAZWA OKNA}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | {NazwaKlasy} |
| Typ | Dialog / MainWindow / Widget |
| Tytuł okna | {windowTitle z .ui} |
| Modalność | modal / modeless |
| Rodzic | {klasa która otwiera to okno} |

## Dane wejściowe (co okno pobiera żeby się wyświetlić)
{lista: skąd pochodzi każde pole danych wyświetlane w oknie}

## Widgety i interakcje
| Widget (name) | Typ Qt | Label/Tekst | Akcja po interakcji | Slot |
|---------------|--------|-------------|---------------------|------|
| saveButton | QPushButton | "Save" | zapisz zmiany | onSaveClicked() |
| titleEdit | QLineEdit | - | edycja tytułu | - |
| cartList | QListWidget | - | wybór elementu | onCartSelected() |

## Menu i akcje (jeśli MainWindow)
| Menu | Akcja | Shortcut | Slot | Warunek aktywności |
|------|-------|----------|------|-------------------|
| File | New Cart | Ctrl+N | onNewCart() | zawsze |
| File | Delete | Del | onDeleteCart() | jeśli coś zaznaczone |

## Stany widoku
| Stan | Kiedy | Co widać | Co jest ukryte/disabled |
|------|-------|----------|------------------------|
| loading | po otwarciu | spinner | buttony akcji |
| empty | brak danych | "No items" message | lista |
| populated | są dane | pełny widok | - |
| editing | edycja w toku | zmienione pola | save disabled jeśli invalid |
| error | błąd | error message | - |

## Walidacje UI
{lista: które pola są required, które mają format validation}
- {pole}: {reguła walidacji} → {komunikat błędu}

## Nawigacja
| Skąd można otworzyć | Jak | Co przekazuje |
|--------------------|-----|---------------|
| {okno źródłowe} | double-click / button | {dane wejściowe} |

## Linux-specific UI elementy
{widgety specyficzne dla Linux, np. device selectors /dev/}
```

---

## Warunek done

```
ui-contracts.md istnieje z frontmatter phase=3, status=done
Każde okno z inventory.md (typ MainWindow/Dialog/Widget) ma UI Contract
Każdy button/action ma zmapowany slot
Stany widoku wypełnione
Kolumna P3 w manifest.md → done
```

**Po zakończeniu**: zmień kolumnę **P3** w tabeli Artifacts manifestu na done.
