---
phase: 3
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
ui_mode: A|B|C|mixed
windows_total: ~
dialogs_total: ~
panels_total: ~
screenshots_used: 0
mockups_generated: 0
spot_check_issues: 0
agent_version: 1.2.0
---

# UI Contracts: {ARTIFACT_NAME}

## Tryb ekstrakcji

| Parametr | Wartość |
|----------|---------|
| Tryb UI | A (XML) / B (Code-first) / C (QML) / mixed |
| Pliki .ui | {N} |
| Pliki .qml | {N} |
| Programowy UI (C++) | {N dialogów/widgetów} |
| Screenshots użyte | {N} |
| Mockupy wygenerowane | {N} |

## Przegląd okien

| Klasa | Typ | Tytuł | Otwierany przez | Modalność | Źródło UI | Screenshot | Mockup |
|-------|-----|-------|----------------|-----------|-----------|-----------|--------|
| {NazwaKlasy} | Dialog | {windowTitle} | {kto} | modal | .ui/code/qml | ✅/❌ | ✅/❌ |

## Navigation Flow

```
{MainWindow}
    ├── [File → New] → {NewDialog} (modal)
    ├── [double-click lista] → {EditDialog} (modal)
    └── [Tools → Config] → {ConfigDialog} (modal)
```

---

## UI Contract: {NazwaOkna}

**Klasa:** `{NazwaKlasy}`
**Źródło UI:** `{plik.ui}` / `{plik.qml}` / "kod C++ (programowy)"
**Typ:** MainWindow / Dialog / Widget / Panel
**Tytuł okna:** {windowTitle}
**Modalność:** modal / modeless
**Rodzic:** {KlasaRodzica lub "top-level"}
**Otwierany przez:** {KlasaKtóraOtwiera → metoda}

### Źródła ekstrakcji

| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅/❌ | {source_file.cpp} |
| Plik .ui | ✅/❌/N/A | {file.ui lub N/A} |
| Plik .qml | ✅/❌/N/A | {file.qml lub N/A} |
| Screenshot | ✅/❌ | {screenshot.png lub brak} |
| Mockup HTML | ✅/❌ | {mockups/Class.html lub brak} |

### Dane wejściowe (co okno potrzebuje żeby się wyświetlić)

| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| {np. cart_id} | {int} | {parametr konstruktora} | tak/nie |

### Widgety i interakcje

| Widget (objectName) | Typ Qt | Etykieta/Placeholder | Akcja użytkownika | Efekt / Slot |
|--------------------|--------|---------------------|------------------|-------------|
| {saveButton} | QPushButton | "Save" | kliknięcie | zapisuje formularz → {onSaveClicked()} |

### Bindingi reaktywne (tylko QML — TRYB C)

| Property QML | Wyrażenie | Źródło danych | Aktualizacja |
|---|---|---|---|
| text | model.title | CartModel (C++) | automatyczna |

### Menu i akcje (jeśli MainWindow lub ma QMenuBar)

| Menu | Podmenu | Akcja (QAction) | Shortcut | Slot | Warunek aktywności |
|------|---------|----------------|----------|------|-------------------|

### Stany widoku

| Stan | Kiedy następuje | Co widzi użytkownik | Disabled/Hidden |
|------|----------------|---------------------|----------------|
| initial | przy otwarciu | {opis} | {lista elementów} |

### Walidacje UI

| Pole | Reguła | Komunikat błędu | Kiedy sprawdzane | Źródło (plik:linia) |
|------|--------|----------------|-----------------|---------------------|
| {titleEdit} | wymagane | "Title is required" | przed zapisem | {file.cpp:123} |

### Nawigacja

| Skąd | Jak otwierane | Co przekazuje | Warunek |
|------|--------------|---------------|---------|

### Rozbieżności screenshot ↔ kod

| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak rozbieżności) | | | |

### Linux-specific elementy UI

| Element | Powód platformowej specyfiki | Zastąpić przez |
|---------|------------------------------|---------------|

---

<!-- Powtórz blok "UI Contract" dla każdego okna/dialogu artifaktu -->
