# inv-050 — RDClock

status: done
agent: PHASE-2-inventory-subagent
partial_id: 050

## Klasa: RDClock

**Plik:** `lib/rdclock.h` / `lib/rdclock.cpp`
**Rola:** Model szablonu zegara (clock template). Zegar definiuje układ eventów w ciągu jednej godziny programu radiowego. Zawiera kolekcję RDEventLine — każdy event-line określa co i kiedy ma się wydarzyć w danej godzinie. Używany do generowania logów.

**Konstruktor:** `RDClock(RDStation *station)` — wymaga kontekstu stacji.

**Dziedziczenie:** brak (standalone)
**Zależności:** RDStation, RDEventLine

---

## Właściwości (gettery + settery)

| Właściwość | Getter | Setter | Opis |
|---|---|---|---|
| name | `name()` | `setName()` | Nazwa zegara (identyfikator) |
| shortName | `shortName()` | `setShortName()` | Krótka nazwa (do wyświetlania w gridzie) |
| color | `color()` | `setColor()` | Kolor wyświetlania |
| remarks | `remarks()` | `setRemarks()` | Uwagi/notatki |
| artistSep | `getArtistSep()` | `setArtistSep()` | Separacja artystów (anti-repeat, minuty) |
| rulesModified | `getRulesModified()` | `setRulesModified()` | Czy reguły schedulera zostały zmodyfikowane |

---

## Kolekcja event-lines

| Metoda | Opis |
|---|---|
| `eventLine(line)` → RDEventLine* | Pobranie event-line po indeksie |
| `size()` | Liczba event-lines w zegarze |
| `insert(name, start_time, length)` | Wstawienie nowego event-line |
| `remove(line)` | Usunięcie event-line po indeksie |

---

## Kluczowe metody

### load(clockname)
Ładuje zegar z bazy danych — najpierw metadane z CLOCKS, potem event-lines z CLOCK_LINES.

### save(clockname)
Zapisuje zegar do DB — aktualizuje CLOCKS, czyści CLOCK_LINES i wstawia je od nowa (DELETE+INSERT pattern).

### validate(start_time, length, except_line) → bool
Sprawdza czy nowy event-line o podanym czasie/długości nie koliduje z istniejącymi. Parametr except_line pozwala pominąć konkretną linię (np. przy edycji).

### generateLog(hour, logname, svc_name, errors) → bool
Generuje sekcję logu dla jednej godziny. Iteruje po event-lines i wywołuje RDEventLine::generateLog() dla każdego.

### clear()
Usuwa wszystkie event-lines z pamięci.

---

## Pola prywatne

- `clock_events` — kolekcja (vector/list) obiektów RDEventLine
- `clock_name`, `clock_short_name`, `clock_color`, `clock_remarks` — metadane
- `artistsep`, `rules_modified` — parametry schedulera
- `clock_station` — RDStation*

---

## SQL / Tabele

| Tabela | Operacje | Kontekst |
|---|---|---|
| `CLOCKS` | SELECT, INSERT, UPDATE | Metadane zegara |
| `CLOCK_LINES` | SELECT, INSERT, DELETE | Event-lines w zegarze. Pattern DELETE all + INSERT all przy save. |
| `EVENTS` | SELECT | Walidacja — sprawdzenie czy event istnieje |
