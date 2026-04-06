# PHASE-3 — UI Extraction Agent
## Wersja: 1.2.0 | Faza: 3 | Scope: per artifact

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
> | Ciało konstruktora (TRYB B) | `Serena: find_symbol(include_body=true)` | `cat` |
> | Czytanie pliku .ui (XML) | **Read** tool | — |
> | Czytanie pliku .qml | **Read** tool | — |
> | Screenshoty (PNG/JPG) | **Read** tool (multimodal) | — |

---

## Cel

Wydobyć kompletne UI Contracts dla każdego okna/dialogu/panelu artifaktu.
Output: ui-contracts.md — frozen UI reference dla agentów kodujących.
Opcjonalnie: mockups/ — HTML/Tailwind wizualne odwzorowania okien.

---

## Wejście

```
Wymagane:   .analysis/{ARTIFACT_ID}/inventory.md (phase=2, status=done)

Opcjonalne (ale SILNIE ZALECANE):
  SCREENSHOTS_DIR: ścieżka do folderu ze screenshotami (np. docs/opsguide/)
  DOC_URL:         URL do online dokumentacji z UI screenshots

Opcjonalne:
  pliki .ui (Qt Designer XML)
  pliki .qml (Qt Quick)
```

### Auto-discovery screenshotów w repozytorium

Przed przetwarzaniem sprawdź czy repo zawiera screenshoty:
```
Glob: docs/**/*.png
Glob: docs/**/*.jpg
Glob: screenshots/**/*.png
Glob: resources/**/*.png
```

> **Rivendell-specific:** Repozytorium zawiera `docs/opsguide/` z **141 screenshotami PNG**
> pokrywającymi dialogi z rdadmin, rdairplay, rdcartslots, rdcastmanager, rdlogedit,
> rdlogmanager i inne. Nazwy plików mają format `{app}.{dialog_name}.png`.
> Użyj ich jako SCREENSHOTS_DIR nawet jeśli nie podano jawnie.

Jeśli screenshoty znalezione → ustaw SCREENSHOTS_DIR automatycznie i kontynuuj
z Krokiem 2 (Screenshots → Mockupy).


---

## Krok 1 — Detekcja trybu UI

Zlicz pliki per typ:
```
Serena: find_file(file_mask="*.ui", relative_path="{ARTIFACT_FOLDER}")
→ Zlicz: UI_COUNT

Serena: find_file(file_mask="*.qml", relative_path="{ARTIFACT_FOLDER}")
→ Zlicz: QML_COUNT

Serena: search_for_pattern(
  substring_pattern="setupUi",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)
→ Zlicz: SETUPUI_COUNT
```

**Wybór trybu:**

| Warunek | Tryb | Opis |
|---------|------|------|
| UI_COUNT >= 1 | **TRYB A** — XML-first | Parsuj .ui pliki, mapuj sloty |
| QML_COUNT >= 1 | **TRYB C** — QML-first | Parsuj .qml komponenty, bindingi, stany |
| UI_COUNT=0 i QML_COUNT=0 | **TRYB B** — Code-first | Analizuj konstruktory C++, build UI z kodu |

> Artifact może mieć mieszankę trybów (np. .ui + programowy UI).
> W takim wypadku: TRYB A dla klas z setupUi(), TRYB B dla reszty.
> QML i C++ mogą współistnieć — TRYB C dla .qml, TRYB A/B dla C++.

---

## TRYB A — XML-first (pliki .ui)

### Krok A1 — Mapowanie klasa ↔ plik .ui

```
# Połącz klasy z inventory.md które używają setupUi()
Serena: search_for_pattern(
  substring_pattern="setupUi",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp"
)
→ Zbuduj mapowanie: klasa C++ ↔ plik .ui
```

### Krok A2 — Sub-agent per plik .ui

Dla każdego pliku .ui:
```
# .ui to XML — Serena nie ma symbolicznego parsera XML, użyj Read tool
Read: {FILE}.ui
→ Parsuj XML Qt Designer
```

Z XML wyciągnij:
```xml
<widget class="QDialog" name="MainDialog">
  <property name="windowTitle"><string>Cart Editor</string></property>
  <widget class="QPushButton" name="saveButton">
    <property name="text"><string>Save</string></property>
  </widget>
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
```

---

## TRYB B — Code-first (programowy UI w C++)

> Ten tryb jest KRYTYCZNY dla projektów bez plików .ui.
> Cały UI jest budowany w konstruktorach klas C++.

### Krok B1 — Zbierz listę dialogów/widgetów z inventory.md

Z inventory.md wyciągnij klasy z typem:
- QDialog / RDDialog / QWidget / RDWidget / QMainWindow
- Każda z nich = potencjalne okno UI

### Krok B2 — Sub-agent per dialog/widget

Dla każdej klasy UI uruchom sub-agenta:

**Parametry:** ARTIFACT_ID, CLASS_NAME, HEADER_FILE, SOURCE_FILE

**Ekstrakcja z konstruktora:**
```
# KLUCZOWY KROK: przeczytaj konstruktor — tam jest layout
Serena: find_symbol(
  name_path_pattern="{CLASS_NAME}/{CLASS_NAME}",
  relative_path="{SOURCE_FILE}",
  include_body=true
)
→ Konstruktor zawiera: new QWidget, setWindowTitle, new QLabel, connect()

# Jeśli konstruktor jest zbyt duży lub Serena go ucina:
Read: {SOURCE_FILE}  (z offset/limit na zakres konstruktora)
```

**Z konstruktora wyciągnij:**

| Wzorzec w kodzie | Co oznacza | Pole w UI Contract |
|---|---|---|
| `setWindowTitle("...")` | Tytuł okna | Tytuł okna |
| `new QPushButton("label")` | Przycisk z etykietą | Widget + etykieta |
| `new QLabel("label:")` | Etykieta statyczna | Label pola |
| `new QLineEdit()` | Pole tekstowe | Widget |
| `new QComboBox()` | Lista rozwijana | Widget |
| `new QCheckBox("label")` | Checkbox | Widget + etykieta |
| `new QSpinBox()` | Pole numeryczne | Widget |
| `connect(widget, SIGNAL(...), this, SLOT(...))` | Akcja | Slot mapowanie |
| `widget->setEnabled(false)` | Stan początkowy | Disabled w initial |
| `widget->hide()` | Ukryty element | Hidden w initial |

**Ekstrakcja walidacji z slotów (okData, sloty akcji):**
```
# Szukaj QMessageBox w slotach (= komunikaty walidacji)
Serena: search_for_pattern(
  substring_pattern="QMessageBox",
  relative_path="{SOURCE_FILE}",
  context_lines_before=3,
  context_lines_after=2
)
→ Każdy QMessageBox::warning/information = komunikat walidacji UI

# Szukaj guard clauses w okData/acceptData
Serena: find_symbol(
  name_path_pattern="{CLASS_NAME}/okData",
  relative_path="{SOURCE_FILE}",
  include_body=true
)
→ Warunki if(...) przed accept() = walidacje
```

**Ekstrakcja danych wejściowych (parametry konstruktora):**
```
Serena: find_symbol(
  name_path_pattern="{CLASS_NAME}/{CLASS_NAME}",
  relative_path="{HEADER_FILE}",
  include_body=false,
  include_info=true
)
→ Parametry konstruktora = dane wejściowe okna
```

---

## TRYB C — QML-first (pliki .qml)

> QML to deklaratywny język UI — zupełnie inna struktura niż C++.
> Bindingi property, State{} bloki, sygnały to JAWNE konstrukty języka.

### Krok C1 — Znajdź i skategoryzuj pliki QML

```
Serena: find_file(file_mask="*.qml", relative_path="{ARTIFACT_FOLDER}")
→ Lista plików .qml

# Opcjonalnie: plik qmldir (rejestr komponentów QML)
Serena: find_file(file_mask="qmldir", relative_path="{ARTIFACT_FOLDER}")
```

### Krok C2 — Mapuj QML ↔ C++ backend

```
# Zarejestrowane typy QML (bridge C++ → QML)
Serena: search_for_pattern(
  substring_pattern="qmlRegisterType|qmlRegisterSingletonType",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=1
)
→ Każdy registered type = C++ klasa dostępna w QML

# Context properties (dane wstrzykiwane do QML engine)
Serena: search_for_pattern(
  substring_pattern="setContextProperty",
  relative_path="{ARTIFACT_FOLDER}",
  paths_include_glob="**/*.cpp",
  context_lines_after=1
)
→ Każda context property = dane dostępne globalnie w QML
```

### Krok C3 — Sub-agent per plik .qml

Dla każdego pliku .qml:
```
# QML nie jest obsługiwany przez Serena LSP — użyj Read tool
Read: {FILE}.qml
```

**Z QML wyciągnij:**

| Konstrukt QML | Co oznacza | Pole w UI Contract |
|---|---|---|
| `Item {}` / `Rectangle {}` / `Window {}` | Komponent root | Typ okna/widgetu |
| `property string title: "..."` | Deklaracja property | Dane wejściowe |
| `text: model.title` | Property binding | Źródło danych (reaktywne) |
| `onClicked: { ... }` | Handler interakcji | Akcja (jak slot w C++) |
| `signal itemSelected(int id)` | Sygnał QML | Sygnał emitowany |
| `State { name: "editing"; when: ... }` | Jawny stan widoku | Stany widoku (1:1!) |
| `Transition { ... }` | Animacja przejścia | Animacje między stanami |
| `Loader { source: "..." }` | Dynamiczne ładowanie | Nawigacja |
| `StackView { ... }` | Stos nawigacji | Flow między ekranami |
| `ListView { model: ...; delegate: ... }` | Lista z delegatem | Widget listowy |
| `Repeater { model: ... }` | Powtórzony element | Grid/lista dynamiczna |

**Dla każdego komponentu QML zapisz:**

```markdown
## Bindingi reaktywne (QML-specific)
| Property QML | Wyrażenie | Źródło (C++ model / QML) | Aktualizacja |
|---|---|---|---|
| text | model.title | CartModel::title (Q_PROPERTY) | automatyczna |
| visible | editMode | lokalna property | automatyczna |

## Stany widoku (z QML State{})
| Stan | when: warunek | Zmiany wizualne (PropertyChanges) |
|---|---|---|
| "editing" | editMode == true | saveButton.visible=true, titleField.readOnly=false |
| "loading" | isLoading | spinner.visible=true, content.opacity=0.5 |
```

---

## Krok 2 — Screenshots → Tailwind Mockupy (OPCJONALNY ale ZALECANY)

> Ten krok działa z KAŻDYM trybem (A/B/C).
> Wymaga podania SCREENSHOTS_DIR lub DOC_URL.
> **Cel:** dać agentom kodującym WIZUALNĄ KOTWICĘ — deterministic UI reference
> zamiast interpretacji prozy. Eliminuje rozbieżności kolorów, fontów, layoutów.

### Krok 2a — Pozyskaj screenshoty

**Jeśli SCREENSHOTS_DIR podany:**
```
Glob: {SCREENSHOTS_DIR}/*.png
Glob: {SCREENSHOTS_DIR}/*.jpg
→ Lista screenshotów
```

**Jeśli DOC_URL podany:**
```
WebFetch: {DOC_URL}
→ Znajdź <img> tagi w HTML dokumentacji
→ Pobierz obrazy do .analysis/{ARTIFACT_ID}/_screenshots/
```

### Krok 2b — Wyciągnij Design Tokens (PIERWSZY ARTIFACT = definicja, kolejne = dziedziczenie)

> **design-tokens.json** zapewnia spójność wizualną CROSS-ARTIFACT.
> Pierwszy artifact definiuje tokeny, kolejne je dziedziczą i rozszerzają.

**Jeśli `.analysis/design-tokens.json` NIE istnieje (pierwszy artifact):**

Przeanalizuj wizualnie 3-5 screenshotów i wyciągnij:
```
Dla każdego screenshota:
  Read: {screenshot.png}
  → Kolory: tło okna, tło pól, kolor tekstu, kolor przycisków, akcent
  → Fonty: rozmiar tekstu, rozmiar etykiet, rozmiar tytułów
  → Spacing: padding wewnętrzny, gap między elementami, marginesy grup
  → Proporcje: szerokość etykiet vs pól, wysokość przycisków
  → Styl: border radius, cienie, separator style
```

Zapisz `.analysis/design-tokens.json`:
```json
{
  "_meta": {
    "generated_by": "QTRE Phase-3 v1.2.0",
    "source_artifact": "{ARTIFACT_ID}",
    "source_screenshots": ["{lista plików}"]
  },
  "colors": {
    "bg-window": "#f0f0f0",
    "bg-panel": "#ffffff",
    "bg-input": "#ffffff",
    "bg-button-primary": "#3b82f6",
    "bg-button-secondary": "#e5e7eb",
    "bg-titlebar": "#1d4ed8",
    "text-primary": "#1f2937",
    "text-secondary": "#6b7280",
    "text-button": "#ffffff",
    "text-titlebar": "#ffffff",
    "border-input": "#d1d5db",
    "border-group": "#e5e7eb",
    "accent": "#2563eb",
    "error": "#dc2626",
    "success": "#16a34a",
    "warning": "#d97706"
  },
  "typography": {
    "font-family": "system-ui, -apple-system, sans-serif",
    "text-xs": "0.75rem",
    "text-sm": "0.875rem",
    "text-base": "1rem",
    "text-label": "0.875rem",
    "text-title": "0.875rem",
    "font-weight-label": "400",
    "font-weight-title": "700"
  },
  "spacing": {
    "padding-panel": "1rem",
    "padding-input": "0.25rem 0.5rem",
    "gap-form-row": "0.5rem",
    "gap-button-bar": "0.5rem",
    "label-width": "8rem",
    "margin-group": "1rem"
  },
  "borders": {
    "radius-input": "0.25rem",
    "radius-button": "0.25rem",
    "radius-panel": "0.375rem",
    "width-input": "1px",
    "width-group": "1px"
  },
  "shadows": {
    "panel": "0 1px 3px rgba(0,0,0,0.12)",
    "dialog": "0 4px 6px rgba(0,0,0,0.1)"
  },
  "tailwind_overrides": {
    "theme": {
      "extend": {
        "colors": {
          "app-primary": "#3b82f6",
          "app-accent": "#2563eb",
          "app-bg": "#f0f0f0"
        }
      }
    }
  }
}
```

**Jeśli `.analysis/design-tokens.json` ISTNIEJE (kolejny artifact):**
```
Read: .analysis/design-tokens.json
→ Użyj istniejących tokenów
→ Jeśli screenshoty tego artifaktu wskazują na NOWE kolory/style
   → DODAJ do tokenów (nie nadpisuj istniejących)
   → Zaktualizuj plik z nowym source_artifact w historii
```

### Krok 2c — Mapuj screenshoty na klasy

Strategia mapowania:
1. **Po nazwie pliku**: `rdcartslots.select_cart_dialog.png` → RDCartDialog
2. **Po tytule okna**: Read screenshot (multimodal) → rozpoznaj tytuł → mapuj na inventory

```
Dla każdego screenshota:
  Read: {screenshot.png}
  → Zidentyfikuj tytuł okna (pasek tytułowy)
  → Zidentyfikuj widgety: przyciski, pola, listy, combo boxy
  → Zidentyfikuj layout: grupy, zakładki, splitter'y
  → Zmapuj na klasę z inventory.md
```

### Krok 2d — Generuj mockup HTML/Tailwind

Dla każdego zmapowanego okna utwórz:
`.analysis/{ARTIFACT_ID}/mockups/{CLASSNAME}.html`

> **KRYTYCZNE:** Każdy mockup MUSI ładować design-tokens.json i aplikować tokeny
> przez Tailwind config. To gwarantuje spójność wizualną między artefaktami.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Design tokens — załadowane z design-tokens.json
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'app-primary': '{bg-button-primary}',
            'app-accent': '{accent}',
            'app-bg': '{bg-window}',
            'app-panel': '{bg-panel}',
            'app-titlebar': '{bg-titlebar}',
            'app-border': '{border-input}',
            'app-text': '{text-primary}',
            'app-text-secondary': '{text-secondary}',
            'app-error': '{error}',
            'app-success': '{success}'
          },
          borderRadius: {
            'app': '{radius-input}'
          },
          fontSize: {
            'app-label': '{text-label}',
            'app-title': '{text-title}'
          }
        }
      }
    }
  </script>
  <title>{WINDOW_TITLE} — UI Mockup</title>
  <!-- Screenshot source: {screenshot_filename} -->
  <!-- Class: {CLASS_NAME} -->
  <!-- Design tokens: ../../design-tokens.json -->
  <!-- Generated by QTRE Phase-3 v1.2.0 -->
</head>
<body class="bg-app-bg p-6 font-sans text-sm text-app-text">
  <div class="bg-app-panel rounded-app shadow-lg max-w-2xl mx-auto overflow-hidden">
    <!-- Title bar -->
    <div class="bg-app-titlebar text-white px-4 py-2 text-app-title font-bold">
      {WINDOW_TITLE}
    </div>
    <!-- Content -->
    <div class="p-4 space-y-3">
      <!-- Odwzoruj layout ze screenshota -->
      <!-- Każdy interaktywny element ma data-widget="{member_var_name}" -->
      
      <!-- Przykład: pole z etykietą -->
      <div data-widget="{widget_name}" class="flex items-center gap-2">
        <label class="w-32 text-right text-app-text-secondary text-app-label">{Label}:</label>
        <input type="text" class="border border-app-border rounded-app px-2 py-1 flex-1"
               placeholder="{placeholder}">
      </div>
      
      <!-- Przykład: przycisk -->
      <button data-widget="{btn_name}" 
              class="bg-app-primary text-white px-4 py-1 rounded-app hover:opacity-90">
        {Button Label}
      </button>
    </div>
    <!-- Button bar -->
    <div class="border-t border-app-border px-4 py-3 flex justify-end gap-2 bg-gray-50">
      <button data-widget="ok_button" class="bg-app-primary text-white px-6 py-1 rounded-app">OK</button>
      <button data-widget="cancel_button" class="bg-gray-300 px-6 py-1 rounded-app">Cancel</button>
    </div>
  </div>
</body>
</html>
```

**Reguły generowania mockupu:**
- Zachowaj proporcje i układ ze screenshota
- Używaj klas `app-*` z design tokens (NIE hardcode'uj kolorów)
- Użyj `data-widget="{name}"` na każdym interaktywnym elemencie
- Użyj realistycznych danych (nazwy z inventory, etykiety z kodu)
- Dodaj komentarz HTML z nazwą pliku screenshota i klasy
- Nie dodawaj JavaScript (poza Tailwind config) — to jest STATYCZNY mockup

### Krok 2e — Generuj _index.html (galeria mocków)

Utwórz `.analysis/{ARTIFACT_ID}/mockups/_index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>{ARTIFACT_NAME} — UI Mockups Gallery</title>
</head>
<body class="bg-gray-100 p-8 font-sans">
  <h1 class="text-2xl font-bold mb-6">{ARTIFACT_NAME} — UI Mockups</h1>
  <p class="text-gray-600 mb-8">
    Wygenerowane z screenshotów: {SCREENSHOTS_DIR}.
    Design tokens: <a href="../../design-tokens.json">design-tokens.json</a>
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Per mockup: -->
    <a href="{CLASSNAME}.html" class="block bg-white rounded-lg shadow hover:shadow-md p-4">
      <h2 class="font-semibold text-lg">{WINDOW_TITLE}</h2>
      <p class="text-gray-500 text-sm">{CLASS_NAME} — {window_type}</p>
      <p class="text-gray-400 text-xs mt-1">Screenshot: {screenshot_filename}</p>
    </a>
  </div>
</body>
</html>
```

### Krok 2f — Crosscheck: mockup ↔ kod

Dla każdego mockupu:
```
LISTA_MOCKUP = widgety z data-widget atrybutów w HTML
LISTA_KOD    = member variables z konstruktora C++ / elementów QML

DIFF_BRAKUJE_W_KODZIE = LISTA_MOCKUP - LISTA_KOD
  → Elementy widoczne na screenshocie ale nieodnalezione w kodzie
  → Możliwy powód: dynamicznie tworzone, z parent widget, inna klasa

DIFF_BRAKUJE_NA_SCREENSHOT = LISTA_KOD - LISTA_MOCKUP
  → Elementy w kodzie ale niewidoczne na screenshocie
  → Możliwy powód: ukryte w danym stanie, conditional, inny tryb
```

Każda rozbieżność trafia do sekcji **"Rozbieżności screenshot ↔ kod"** w UI Contract.

---

## Krok 3 — Spot-check (OBOWIĄZKOWY)

> Losowa weryfikacja zapobiega "halucynacjom" agenta.

Wybierz **3 losowe dialogi/widgety** z wygenerowanych UI Contracts.
Dla każdego:

```
# Zweryfikuj 2 rzeczy bezpośrednio z kodu:
1. Serena: find_symbol(name_path="{CLASS}/{CONSTRUCTOR}", include_body=true)
   → Czy widgety z contractu istnieją w konstruktorze?
   
2. Serena: search_for_pattern(
     substring_pattern="QMessageBox",
     relative_path="{SOURCE_FILE}"
   )
   → Czy komunikaty walidacji z contractu istnieją w kodzie?

Jeśli >=1 rozbieżność:
  → Przeglądnij WSZYSTKIE UI Contracts
  → Popraw wykryte błędy
  → Dodaj notatkę w frontmatter: spot_check_issues: N
```

---

## Krok 4 — Wywołaj Merge Agent

```
MERGE-AGENT z parametrami:
  PARTIAL_PATTERN: ui-*.md
  OUTPUT_FILE:     ui-contracts.md
  TEMPLATE:        .claude/templates/ui-contracts.md
```

---

## Format partial pliku UI (per okno)

```markdown
---
partial_id: {NR}
artifact: {ARTIFACT_ID}
window_name: {NAZWA}
class_name: {KLASA C++}
ui_source: .ui | code | .qml
ui_file: {ścieżka .ui/.qml lub null}
screenshot: {ścieżka .png lub null}
mockup: {ścieżka .html lub null}
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
| Tytuł okna | {windowTitle z kodu/screenshota} |
| Modalność | modal / modeless |
| Rodzic | {klasa która otwiera to okno} |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅/❌ | {source_file.cpp} |
| Plik .ui | ✅/❌/N/A | {file.ui lub N/A} |
| Plik .qml | ✅/❌/N/A | {file.qml lub N/A} |
| Screenshot | ✅/❌ | {screenshot.png lub brak} |
| Mockup HTML | ✅/❌ | {mockups/Class.html lub brak} |

## Dane wejściowe (co okno pobiera żeby się wyświetlić)

| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| {parametr} | {typ} | {konstruktor/property} | tak/nie |

## Widgety i interakcje

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| {member_name} | QPushButton | "Save" | kliknięcie | onSaveClicked() |

## Bindingi reaktywne (tylko TRYB C — QML)

| Property QML | Wyrażenie | Źródło danych | Aktualizacja |
|---|---|---|---|
| text | model.title | CartModel (C++) | automatyczna |

## Menu i akcje (jeśli MainWindow)

| Menu | Akcja | Shortcut | Slot | Warunek |
|------|-------|----------|------|---------|

## Stany widoku

| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|

## Walidacje UI

| Pole | Reguła | Komunikat | Kiedy | Źródło (plik:linia) |
|------|--------|-----------|-------|---------------------|

## Nawigacja

| Skąd | Jak | Co przekazuje |
|------|-----|---------------|

## Rozbieżności screenshot ↔ kod

| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak) | | | |

## Linux-specific elementy UI

| Element | Powód | Zastąpić przez |
|---------|-------|---------------|
```

---

## Warunek done

```
ui-contracts.md istnieje z frontmatter phase=3, status=done
Każde okno z inventory.md (typ MainWindow/Dialog/Widget) ma UI Contract
Każdy button/action ma zmapowany slot
Stany widoku wypełnione
Spot-check wykonany (3 losowe weryfikacje z kodem)
Kolumna P3 w manifest.md → done

Jeśli SCREENSHOTS_DIR podany:
  .analysis/design-tokens.json istnieje (lub zaktualizowany)
  Folder mockups/ istnieje z plikami HTML + _index.html
  Każdy mockup używa klas app-* z design tokens (nie hardcoded kolorów)
  Sekcja "Źródła ekstrakcji" wypełniona dla każdego contractu
  Sekcja "Rozbieżności screenshot ↔ kod" wypełniona (lub "brak")
```

**Po zakończeniu**: zmień kolumnę **P3** w tabeli Artifacts manifestu na done.
