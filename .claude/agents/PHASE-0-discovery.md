# PHASE-0 — Project Discovery Agent
## Wersja: 1.0.0 | Faza: 0 | Scope: cały projekt

---

## Cel

Zidentyfikować wszystkie atomowe artefakty projektu (aplikacje, biblioteki, narzędzia),
przypisać im ID, priorytety i zbudować dependency graph.
Output jest entry pointem dla wszystkich kolejnych faz.

---

## Wejście

```
Typ:        folder (root projektu)
Wymagane:   prereq-check.log ze statusem READY
Walidacja:
  - prereq-check.log istnieje
  - prereq-check.log zawiera "Status końcowy: READY"
  - compile_commands.json istnieje
```

---

## Kroki wykonania

### Krok 1 — Skan wysokopoziomowy przez Serena

```
Serena: list_dir(path=".", recursive=false)
→ Zidentyfikuj foldery najwyższego poziomu

Serena: list_dir(path=".", recursive=true, depth=2)
→ Pełna mapa struktury do 2 poziomów głębokości
```

### Krok 2 — Analiza build system

**Dla CMake:**
```bash
# Wylistuj wszystkie CMakeLists.txt
find . -name "CMakeLists.txt" | sort

# Z każdego wyciągnij add_executable i add_library
grep -rh "add_executable\|add_library" --include="CMakeLists.txt" | \
  grep -v "^#" | sort | uniq
```

**Dla qmake:**
```bash
# Znajdź .pro pliki (każdy = osobna aplikacja/biblioteka)
find . -name "*.pro" | sort

# Z każdego wyciągnij TEMPLATE i TARGET
for pro in $(find . -name "*.pro"); do
  echo "=== $pro ==="
  grep "^TEMPLATE\|^TARGET\|^SUBDIRS" "$pro"
done
```

### Krok 3 — Klasyfikacja artifaktów

Dla każdego zidentyfikowanego targetu określ:

```
Typ:
  application  → add_executable / TEMPLATE=app
  library      → add_library / TEMPLATE=lib
  tool         → małe narzędzie CLI
  test         → test suite

Ważność:
  critical     → core systemu, wszystkie inne zależą
  major        → główna aplikacja użytkownika
  support      → narzędzie pomocnicze
  test         → tylko testy
```

### Krok 4 — Przypisanie ID i priorytetów

Reguły przypisywania ID (3 litery, unikalne):
```
- Biblioteki shared: priorytet 0 (zawsze pierwsze)
- Główne aplikacje UI: priorytet 1-5 (wg centralności w systemie)
- Narzędzia pomocnicze: priorytet 6-9
- Test suites: priorytet 10+ (lub pomijane jeśli brak kodu biznesowego)
```

Unikaj ID które kolidują z powszechnymi skrótami (SQL, API, etc.)

### Krok 5 — Dependency graph

```bash
# CMake — inter-target dependencies
grep -rh "target_link_libraries" --include="CMakeLists.txt" | \
  grep -v "^#"

# Znajdź shared headers używane przez wiele targetów
find . -name "*.h" -path "*/include/*" | head -20
```

Zbuduj tabelę: który artifact → używa których bibliotek.

### Krok 6 — Identyfikacja Linux-specific komponentów

Szukaj w CMakeLists.txt i plikach źródłowych:
```bash
# Audio
grep -r "jack\|alsa\|oss\|pulse" --include="CMakeLists.txt" -i | head -10
grep -r "JACK\|ALSA\|PulseAudio" --include="*.h" --include="*.cpp" | head -10

# IPC
grep -r "dbus\|DBus" --include="CMakeLists.txt" -i | head -10

# CD
grep -r "cdparanoia\|libcdio" --include="CMakeLists.txt" -i | head -5

# Database
grep -r "mysql\|postgresql\|sqlite" --include="CMakeLists.txt" -i | head -5
```

### Krok 7 — Zlicz rozmiar projektu

```bash
# Linie kodu per język
find . \( -name "*.cpp" -o -name "*.h" \) \
  ! -path "*/build/*" ! -path "*/.build/*" ! -path "*/moc_*" \
  | xargs wc -l | sort -rn | head -20

# Łączna liczba plików per typ
echo "CPP: $(find . -name '*.cpp' ! -path '*/build/*' | wc -l)"
echo "H:   $(find . -name '*.h' ! -path '*/build/*' | wc -l)"
echo "UI:  $(find . -name '*.ui' | wc -l)"
echo "QML: $(find . -name '*.qml' | wc -l)"
echo "PRO: $(find . -name '*.pro' | wc -l)"
```

### Krok 8 — Zapisz manifest

Utwórz `.analysis/{PROJECT_NAME}.manifest.md` używając szablonu `.claude/templates/manifest.md`.

---

## Warunek done

```
manifest.md istnieje w .analysis/
Każdy artifact ma: ID, nazwę, typ, prefix, priorytet
Dependency graph jest kompletny
Linux-specific tabela wypełniona
Sessions Log pusty (czeka na fazy 1-7)
```

---

## Co dalej

Uruchom `/qtre-phase-1-structure-scan ARTIFACT_ID` z artifact ID o priorytecie 0
(biblioteki shared), następnie kolejne wg rosnącego priorytetu.
