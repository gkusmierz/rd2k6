# PHASE-4 — Signal & Call Graph Agent
## Wersja: 1.0.0 | Faza: 4 | Scope: per artifact

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
Serena: search_for_pattern(
  pattern="connect(",
  path="{ARTIFACT_FOLDER}",
  file_pattern="*.cpp"
)
→ Lista wszystkich wywołań connect()
```

```bash
# Backup przez grep dla Qt4-style connect
grep -rn "connect(" --include="*.cpp" {ARTIFACT_FOLDER} | \
  grep -v "^//\|\/\*" | \
  grep "SIGNAL\|&.*::" | \
  sort
```

### Krok 2 — Zbierz wszystkie emit()

```
Serena: search_for_pattern(
  pattern="emit ",
  path="{ARTIFACT_FOLDER}",
  file_pattern="*.cpp"
)
→ Lista wszystkich emisji sygnałów
```

### Krok 3 — Zbierz wszystkie Q_PROPERTY z NOTIFY

```
Serena: search_for_pattern(
  pattern="Q_PROPERTY",
  path="{ARTIFACT_FOLDER}",
  file_pattern="*.h"
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
Serena: search_for_pattern(pattern="emit ", file="{CLASS_FILE}")
→ Lista sygnałów które ta klasa emituje
→ Dla każdego emit: w jakiej metodzie, przy jakim warunku

# Jako ODBIORCA (kto łączy się z tą klasą)
Serena: find_referencing_symbols("{CLASS_NAME}")
→ Kto tworzy instancje tej klasy
→ W których miejscach jest connect() z tą klasą jako src lub dst

# Wewnętrzne połączenia (self-connections)
Serena: search_for_pattern(
  pattern="connect(this",
  file="{CLASS_FILE}"
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
Cross-artifact połączenia (D-Bus) są oznaczone
```
