# AGENTS.md — Agent Catalogue
## Qt Reverse Engineering Multi-Agent System

---

## Katalog agentów — v1.0.0

| Agent | Plik | Faza | Typ | Status |
|-------|------|------|-----|--------|
| Prerequisite Check | .claude/agents/PREREQ-CHECK.md | -1 | monolithic | active |
| Project Discovery | .claude/agents/PHASE-0-discovery.md | 0 | monolithic | active |
| Artifact Structure Scan | .claude/agents/PHASE-1-structure-scan.md | 1 | monolithic | active |
| Inventory Build | .claude/agents/PHASE-2-inventory.md | 2 | orchestrator | active |
| Inventory Sub-Agent | .claude/agents/PHASE-2-inventory-subagent.md | 2 | sub-agent | active |
| UI Extraction | .claude/agents/PHASE-3-ui-extraction.md | 3 | orchestrator | active |
| Signal & Call Graph | .claude/agents/PHASE-4-call-graph.md | 4 | orchestrator | active |
| Facts Mining | .claude/agents/PHASE-5-facts-mining.md | 5 | orchestrator | active |
| SPEC Synthesis | .claude/agents/PHASE-6-spec-synthesis.md | 6 | monolithic | active |
| Feature Decomposition | .claude/agents/PHASE-7-feature-decomposition.md | 7 | orchestrator | active |
| Merge Agent | .claude/agents/MERGE-AGENT.md | 2,3,4,5,7 | merge | active |
| Orchestrator By-Phase | .claude/agents/ORCHESTRATOR-by-phase.md | all | orchestrator | active |
| Orchestrator By-Artifact | .claude/agents/ORCHESTRATOR-by-artifact.md | all | orchestrator | active |
| Orchestrator Bulk | .claude/agents/ORCHESTRATOR-bulk.md | all | orchestrator | active |

---

## Narzędzia Sereny używane przez agentów

| Narzędzie Sereny | Używane przez | Cel |
|-----------------|---------------|-----|
| `get_symbols_overview` | PHASE-2 sub-agent | Inventory klasy bez czytania całego pliku |
| `find_symbol` | PHASE-1, PHASE-2 | Globalne wyszukiwanie klasy/funkcji |
| `find_referencing_symbols` | PHASE-4 sub-agent | Kto woła ten sygnał/slot |
| `search_for_pattern` | PHASE-2, PHASE-4 | Qt patterns (connect, emit, Q_PROPERTY) |
| `read_file` | wszystkie | Fallback gdy Serena nie wystarcza |
| `list_dir` | PHASE-0, PHASE-1 | Struktura plików |
| `find_file` | PHASE-3 | Znajdź pliki .ui, .qml |
| `write_memory` | sub-agenci | Transport partial wyników do Merge Agenta |
| `read_memory` | Merge Agent | Odczyt partial wyników sub-agentów |
| `list_memories` | Merge Agent | Lista wszystkich partial wyników |
| `onboarding` | PHASE-0 | Inicjalizacja projektu w Serenie |

---

## Qt-specific patterns — referencja dla agentów

Każdy agent który analizuje kod C++/Qt MUSI szukać tych wzorców:

### Klasy i hierarchia
```
Q_OBJECT              → klasa uczestniczy w systemie meta-obiektów Qt
QMainWindow subclass  → główne okno aplikacji
QDialog subclass      → modal workflow
QWidget subclass      → panel/komponent UI
QAbstractItemModel    → kontrakt danych dla widoku (MVC)
QThread subclass      → operacja asynchroniczna
QRunnable             → zadanie w thread pool
```

### Reaktywność
```
signals:              → sekcja sygnałów — publiczny interfejs zdarzeń
slots: / public slots → sekcja slotów — handlery
Q_PROPERTY(T name     → bindable state z NOTIFY sygnałem
  READ getter
  WRITE setter
  NOTIFY nameChanged)
connect(src, &Src::signal, dst, &Dst::slot)  → krawędź call-graph
connect(src, SIGNAL(sig()), dst, SLOT(slot())) → stary styl (Qt4)
emit signalName(args) → punkt publikacji eventu
```

### UI i konfiguracja
```
QAction               → komenda użytkownika (menu/toolbar/shortcut)
QSettings             → konfiguracja persystowana (klucz/wartość)
QTimer                → trigger czasowy (jednorazowy lub cykliczny)
setupUi(this)         → inicjalizacja z pliku .ui (Qt Designer)
```

### Dane i modele
```
QSqlDatabase          → połączenie z bazą danych
QSqlQuery             → zapytanie SQL (reguły biznesowe w SQL!)
QSqlTableModel        → model tabeli DB dla widoku
QVariant              → typ dynamiczny Qt
```

### Asynchroniczność i IPC
```
QProcess              → uruchomienie zewnętrznego procesu
QTcpSocket / QUdpSocket → komunikacja sieciowa
QDBusInterface        → D-Bus IPC (Linux-specific → TO REPLACE)
QSharedMemory         → shared memory IPC
```

### Linux-specific (TO REPLACE w klonie)
```
QProcess("jackd")     → JACK audio daemon
QProcess("cdparanoia") → CD ripping
QDBus*                → D-Bus (Linux IPC)
/dev/dsp, /dev/snd    → ALSA/OSS audio devices
```

---

## Wersje agentów

Każdy agent ma wersję niezależną od systemu. Zmiana agenta = bump wersji.

| Agent | Wersja | Ostatnia zmiana | Powód |
|-------|--------|-----------------|-------|
| Wszystkie (phases) | 1.0.0 | 2026-04-05 | Initial release |
| Orchestrators (3x) | 1.0.0 | 2026-04-05 | Phase-first, Artifact-first, Bulk modes |
