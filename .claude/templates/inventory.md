---
phase: 2
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
partial_count: ~
conflicts_found: 0
missing_coverage: 0
spot_check_issues: 0
agent_version: 1.2.0
---

# Inventory: {ARTIFACT_NAME}

## Statystyki

| Typ | Liczba |
|-----|--------|
| Klasy łącznie | ~ |
| QMainWindow subclassy | ~ |
| QDialog subclassy | ~ |
| QWidget subclassy | ~ |
| QObject subclassy (serwisy) | ~ |
| QAbstractItemModel subclassy | ~ |
| QThread subclassy | ~ |
| Plain C++ (non-Qt) klasy | ~ |

---

## Klasy — szczegółowy inwentarz

<!-- Sekcja generowana przez Merge Agent z partial plików inv-*.md -->
<!-- Jeden blok per klasa, posortowane alfabetycznie -->

### {NazwaKlasy}

**Typ Qt:** {QMainWindow / QDialog / QWidget / QObject / etc.}
**Plik:** `{klasa.h}` + `{klasa.cpp}`
**Odpowiedzialność:** {1-2 zdania WHAT bez HOW}

**Sygnały:**
| Sygnał | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| {nazwa} | {typy} | {co oznacza to zdarzenie} |

**Sloty:**
| Slot | Parametry | Widoczność | Efekt |
|------|-----------|------------|-------|
| {nazwa} | {typy} | public/protected | {efekt biznesowy} |

**Stan (Q_PROPERTY):**
| Property | Typ | NOTIFY sygnał |
|----------|-----|--------------|
| {nazwa} | {typ} | {sygnał} |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywołania |
|--------|-----------|-------|------------------|
| {nazwa} | {typy} | {co osiąga} | {kiedy można wywołać} |

**Enums:**
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| {nazwa} | {wartości} | {co reprezentują} |

**Reguły biznesowe (z implementacji):**
- {reguła 1 w języku naturalnym}
- {reguła 2}

**Linux-specific:**
| Komponent | Użycie | Priorytet zastąpienia |
|-----------|--------|----------------------|
| {komponent} | {kontekst} | CRITICAL / HIGH / MEDIUM |

**Zależności od innych klas tego artifaktu:**
- {NazwaKlasy}: {jak używana}

**Zależności od shared libraries:**
- {librd::NazwaKlasy}: {jak używana}

---

## Missing Coverage

<!-- Klasy z discovery-state.md które nie mają wpisu w inventory -->
<!-- Generowane przez Merge Agent -->

| Klasa | Plik | Powód braku |
|-------|------|-------------|

---

## Conflicts

<!-- Konflikty które wymagają ludzkiej decyzji -->
<!-- Generowane przez Merge Agent -->

| ID | Klasa | Opis konfliktu | Status |
|----|-------|----------------|--------|
