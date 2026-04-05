# inv-048 — RDEventLine

status: done
agent: PHASE-2-inventory-subagent
partial_id: 048

## Klasa: RDEventLine

**Plik:** `lib/rdevent_line.h` / `lib/rdevent_line.cpp`
**Rola:** Pojedyncza linia eventu w zegarze (clock). Łączy event z pozycją w zegarze i dodaje parametry czasu/długości. Odpowiada za generowanie i linkowanie logów — to kluczowa klasa w pipeline'ie generowania logów schedulera.

**Konstruktor:** `RDEventLine(RDStation *station)` — wymaga kontekstu stacji.

**Dziedziczenie:** brak (standalone)
**Zależności:** RDStation, RDLogLine, RDLogEvent, RDLog, RDEventImportList

---

## Enumy

### ImportSource
Źródło importu danych do eventu:
- `None=0` — brak importu
- `Traffic=1` — dane z systemu traffic
- `Music=2` — dane z systemu muzycznego
- `Scheduler=3` — dane z wewnętrznego schedulera

### InsertFirst
Typ pierwszego wstawianego elementu:
- `InsertNone=0` — nic
- `InsertBreak=1` — wstaw break (przerwa)
- `InsertTrack=2` — wstaw track marker (voicetrack)

---

## Właściwości (gettery + settery)

| Właściwość | Typ | Opis |
|---|---|---|
| name | QString | Nazwa powiązanego eventu |
| preposition | int (ms) | Stały czas startu |
| timeType | RDLogLine::TimeType | Typ czasu (hard/soft/relative) |
| graceTime | int (ms) | Tolerancja czasu |
| useAutofill | bool | Czy autofill włączony |
| autofillSlop | int (ms) | Tolerancja autofill |
| useTimescale | bool | Czy timescale włączony |
| importSource | ImportSource | Źródło importu |
| startSlop | int (ms) | Tolerancja startu |
| endSlop | int (ms) | Tolerancja końca |
| firstTransType | RDLogLine::TransType | Przejście pierwszego elementu |
| defaultTransType | RDLogLine::TransType | Domyślne przejście |
| color | QColor | Kolor w UI |
| schedGroup | QString | Grupa schedulera |
| HaveCode / HaveCode2 | QString | Kody schedulera |
| titleSep | int | Separacja tytułów (anti-repeat) |
| startTime | QTime | Czas startu w zegarze |
| length | int (ms) | Długość okna w zegarze |

---

## Kluczowe metody

### generateLog(logname, svcname, errors, clockname) → bool
Generuje wpisy logu dla tego event-line. Kluczowa operacja w pipeline tworzenia logów. Przetwarza import source, wstawia carty z schedulera/traffic/music, obsługuje autofill.

### linkLog(e, log, svcname, link_logline, track_str, label_cart, track_cart, errors) → bool
Linkuje wygenerowane wpisy logu z istniejącym logiem. Obsługuje voicetracking (track markers), label carty, łączenie z importowanymi danymi.

### load(eventname) / save()
Persystencja — ładuje/zapisuje konfigurację event-line z/do bazy danych.

### propertiesText() → QString (2 overloady)
Zwraca opis tekstowy właściwości eventu (do wyświetlania w UI). Wersja statyczna przyjmuje parametry jawnie.

### GetLength(cartnum, def_length) → int (prywatna)
Pobiera długość cartu — fallback do def_length jeśli brak.

---

## Pola prywatne (stan w pamięci)

Pola `event_*` przechowują pełny stan event-line w pamięci (pre/postimport list, station, nested event, sched group itp.).

Ważne: `event_preimport_list` i `event_postimport_list` — obiekty RDEventImportList (listy importu pre/post).

---

## SQL / Tabele

| Tabela | Operacje | Kontekst |
|---|---|---|
| `EVENTS` | SELECT, UPDATE, INSERT | Konfiguracja eventu — load/save |
| `LOG_LINES` | SELECT, INSERT | Generowanie logów — wstawianie linii logu |
| `STACK_LINES` | SELECT, INSERT | Stack schedulera — anti-repeat, separacja artystów/tytułów |
| `STACK_SCHED_CODES` | INSERT | Kody schedulera w stacku |
| `IMPORTER_LINES` | SELECT, UPDATE | Linie importowane z traffic/music — aktualizacja statusu |
