---
phase: 3
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
windows_total: ~
dialogs_total: ~
panels_total: ~
agent_version: 1.0.0
---

# UI Contracts: {ARTIFACT_NAME}

## Przegląd okien

| Klasa | Typ | Tytuł | Otwierany przez | Modalność |
|-------|-----|-------|----------------|-----------|
| {NazwaKlasy} | MainWindow/Dialog/Widget | {windowTitle} | {kto} | modal/modeless |

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
**Plik .ui:** `{plik.ui}` (lub "brak — generowane w kodzie")
**Typ:** MainWindow / Dialog / Widget / Panel
**Tytuł okna:** {windowTitle}
**Modalność:** modal / modeless
**Rodzic:** {KlasaRodzica lub "top-level"}
**Otwierany przez:** {KlasaKtóraOtwiera → metoda}

### Dane wejściowe (co okno potrzebuje żeby się wyświetlić)

| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| {np. cart_id} | {int} | {parametr konstruktora} | tak/nie |

### Widgety i interakcje

| Widget (objectName) | Typ Qt | Etykieta/Placeholder | Akcja użytkownika | Efekt / Slot |
|--------------------|--------|---------------------|------------------|-------------|
| {saveButton} | QPushButton | "Save" | kliknięcie | zapisuje formularz → {onSaveClicked()} |
| {titleEdit} | QLineEdit | "Enter title..." | edycja tekstu | aktualizacja pola |
| {cartList} | QListWidget | - | double-click | otwiera CartEditDialog |

### Menu i akcje (jeśli MainWindow lub ma QMenuBar)

| Menu | Podmenu | Akcja (QAction) | Shortcut | Slot | Warunek aktywności |
|------|---------|----------------|----------|------|-------------------|
| File | - | New Cart | Ctrl+N | {onNewCart()} | zawsze |
| File | - | Delete | Del | {onDeleteCart()} | gdy zaznaczone |
| Edit | - | Copy Audio | Ctrl+C | {onCopyAudio()} | gdy cut zaznaczony |

### Stany widoku

| Stan | Kiedy następuje | Co widzi użytkownik | Disabled/Hidden |
|------|----------------|---------------------|----------------|
| initial | przy otwarciu | {opis} | {lista elementów} |
| loading | ładowanie danych | spinner / "Loading..." | buttony akcji |
| empty | brak danych | "{komunikat empty state}" | - |
| populated | dane załadowane | pełny widok | - |
| editing | edycja w toku | zmienione pola (bold/kolor) | save disabled jeśli invalid |
| error | błąd | inline error message | - |

### Walidacje UI

| Pole | Reguła | Komunikat błędu | Kiedy sprawdzane |
|------|--------|----------------|-----------------|
| {titleEdit} | wymagane, max 255 znaków | "Title is required" | przed zapisem |
| {numberEdit} | musi być dodatnie | "Cart number must be positive" | on change |

### Nawigacja

| Skąd | Jak otwierane | Co przekazuje | Warunek |
|------|--------------|---------------|---------|
| {MainWindow} | {File → New lub button} | {brak / cart_id} | {zawsze / jeśli zaznaczone} |

### Linki do okien otwieranych z tego okna

| Docelowe okno | Jak | Przekazuje | Warunek |
|--------------|-----|------------|---------|
| {CutEditDialog} | double-click na liście cutów | {cut_id} | gdy cut zaznaczony |

### Linux-specific elementy UI

| Element | Powód platformowej specyfiki | Zastąpić przez |
|---------|------------------------------|---------------|
| {np. /dev/dsp selector} | ALSA device picker | {platform-agnostic audio device selector} |

---

<!-- Powtórz blok "UI Contract" dla każdego okna/dialogu artifaktu -->
