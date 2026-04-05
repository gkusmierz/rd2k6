# PHASE-1 — Artifact Structure Scan Agent
## Wersja: 1.0.0 | Faza: 1 | Scope: per artifact

---

## Cel

Dla jednego artifaktu: zidentyfikować wszystkie pliki źródłowe,
główne klasy Qt, entry points i CMake targets.
Output: mapa struktury gotowa dla Fazy 2 (Inventory).

---

## Wejście

```
Typ:        artifact ID (string, np. "LIB")
Źródło:     .analysis/{PROJECT}.manifest.md
Wymagane:   tak
Walidacja:
  - artifact ID istnieje w manifest.md
  - artifact status = pending
  - jeśli typ=application: wszystkie biblioteki zależne mają phase-5 status=done
    (sprawdź w manifest.md sekcja Dependency Graph)
```

**Pobierz z manifest.md:**
- Nazwę artifaktu (np. "RDLibrary")
- Folder źródłowy (np. "rdlibrary/")
- Prefix ID (np. "LIB")
- Typ (application/library)

---

## Kroki wykonania

### Krok 1 — Aktualizuj status w manifest.md

Zmień status artifaktu z `pending` na `in-progress`.
Dodaj datę startu do Sessions Log.

### Krok 2 — Utwórz folder artifaktu

```bash
mkdir -p .analysis/{ARTIFACT_ID}/
mkdir -p .analysis/{ARTIFACT_ID}/_partials/
mkdir -p .analysis/{ARTIFACT_ID}/Features/
```

### Krok 3 — Skan plików źródłowych

```
Serena: list_dir(path="{ARTIFACT_FOLDER}", recursive=true)
→ Pobierz pełną listę plików
```

```bash
# Wylistuj pliki z podziałem na typy
find {ARTIFACT_FOLDER} -type f \
  \( -name "*.cpp" -o -name "*.h" -o -name "*.ui" \
     -o -name "*.qml" -o -name "*.qrc" -o -name "*.ts" \) \
  | sort

# Zlicz per typ
for ext in cpp h ui qml qrc ts; do
  COUNT=$(find {ARTIFACT_FOLDER} -name "*.$ext" | wc -l)
  echo "$ext: $COUNT"
done
```

### Krok 4 — Identyfikacja głównych klas Qt

Dla każdego pliku .h użyj Sereny:
```
Serena: get_symbols_overview(file="{FILE}.h")
→ Zidentyfikuj klasy które dziedziczą z Qt
```

Szukaj wzorców (Serena: search_for_pattern):
```bash
# Klasy dziedziczące z Qt
grep -rh "class.*:.*public.*Q" --include="*.h" {ARTIFACT_FOLDER} | \
  grep -v "^//" | sort

# Klasy z Q_OBJECT (uczestniczą w sygnałach/slotach)
grep -rhl "Q_OBJECT" --include="*.h" {ARTIFACT_FOLDER}
```

### Krok 5 — Identyfikacja entry points

```bash
# main() funkcja
grep -rn "^int main\|^int main(" --include="*.cpp" {ARTIFACT_FOLDER}

# QApplication / QCoreApplication
grep -rn "QApplication\|QCoreApplication\|QGuiApplication" \
  --include="*.cpp" {ARTIFACT_FOLDER}

# QMainWindow subclass (główne okno)
grep -rh "class.*:.*public.*QMainWindow" --include="*.h" {ARTIFACT_FOLDER}
```

### Krok 6 — CMake target dla tego artifaktu

```bash
# Znajdź CMakeLists.txt dla tego artifaktu
find {ARTIFACT_FOLDER} -name "CMakeLists.txt" | head -3

# Wyciągnij target definition
grep -A 20 "add_executable\|add_library" \
  {ARTIFACT_FOLDER}/CMakeLists.txt 2>/dev/null | head -40
```

### Krok 7 — Identyfikacja plików testowych

```bash
# Pliki testowe (QTest)
find . -name "*test*" -o -name "*Test*" | \
  grep -i "{ARTIFACT_NAME}\|{ARTIFACT_ID}" | \
  grep -E "\.cpp$|\.h$"

# Klasy dziedziczące z QTest
grep -rh "class.*:.*public.*QObject" --include="*.h" . | \
  grep -i "test"
```

### Krok 8 — Zapisz discovery-state.md

Utwórz `.analysis/{ARTIFACT_ID}/discovery-state.md` używając szablonu.

---

## Warunek done

```
discovery-state.md istnieje z frontmatter phase=1, status=done
Wszystkie pliki .h/.cpp skatalogowane
Klasy Qt zidentyfikowane z typem (QMainWindow/QDialog/etc.)
Entry point (main.cpp) zidentyfikowany
Pliki testowe zidentyfikowane (lub "brak" odnotowane)
```

---

## Co dalej

Uruchom `/qtre-phase-2-inventory ARTIFACT_ID`.
