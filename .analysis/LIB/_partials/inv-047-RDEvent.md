# inv-047 — RDEvent

status: done
agent: PHASE-2-inventory-subagent
partial_id: 047

## Klasa: RDEvent

**Plik:** `lib/rdevent.h` / `lib/rdevent.cpp`
**Rola:** Model pojedynczego eventu schedulera. Reprezentuje szablon wydarzenia używany przy budowaniu logów. Zapewnia dostęp do właściwości wydarzenia (preposition, grace time, autofill, timescale, slopy, transition types, import source, itp.) i persystuje je w bazie danych.

**Konstruktor:** `RDEvent(const int &name, bool create = false)` — ładuje event po nazwie z DB; jeśli `create=true`, tworzy nowy rekord.

**Dziedziczenie:** brak (standalone)
**Zależności:** brak sygnałów/slotów (nie jest QObject)

---

## Właściwości (gettery + settery)

| Właściwość | Getter | Setter | Opis |
|---|---|---|---|
| name | `name()` | — | Nazwa eventu (identyfikator) |
| displayText | `displayText()` | `setDisplayText()` | Tekst wyświetlany w UI |
| noteText | `noteText()` | `setNoteText()` | Notatki/komentarze |
| preposition | `preposition()` | `setPreposition()` | Preposition time (ms) — stały czas startu |
| timeType | `timeType()` | `setTimeType()` | Typ czasu (hard/soft) |
| graceTime | `graceTime()` | `setGraceTime()` | Czas tolerancji (grace period, ms) |
| useAutofill | `useAutofill()` | `setUseAutofill()` | Czy używać autofill do wypełnienia czasu |
| autofillSlop | `autofillSlop()` | `setAutofillSlop()` | Tolerancja autofill (ms) |
| useTimescale | `useTimescale()` | `setUseTimescale()` | Czy używać timescale |
| importSource | `importSource()` | `setImportSource()` | Źródło importu (Traffic/Music/Scheduler) |
| startSlop | `startSlop()` | `setStartSlop()` | Tolerancja startu (ms) |
| endSlop | `endSlop()` | `setEndSlop()` | Tolerancja końca (ms) |
| firstTransType | `firstTransType()` | `setFirstTransType()` | Typ przejścia dla pierwszego elementu |
| defaultTransType | `defaultTransType()` | `setDefaultTransType()` | Domyślny typ przejścia |
| color | `color()` | `setColor()` | Kolor wyświetlania |
| nestedEvent | `nestedEvent()` | `setNestedEvent()` | Nazwa zagnieżdżonego eventu |
| remarks | `remarks()` | `setRemarks()` | Uwagi |
| schedGroup | `schedGroup()` | `setSchedGroup()` | Grupa schedulera |
| HaveCode / HaveCode2 | `HaveCode()` / `HaveCode2()` | `setHaveCode()` / `setHaveCode2()` | Flagi kodu schedulera |
| artistSep | `artistSep()` | `setArtistSep()` | Separacja artystów (anti-repeat) |
| titleSep | `titleSep()` | `setTitleSep()` | Separacja tytułów (anti-repeat) |

---

## Metody prywatne (persystencja)

- `GetIntValue(field)` — odczyt int z tabeli EVENTS
- `GetStringValue(field)` — odczyt string z tabeli EVENTS
- `SetRow(param, value)` — zapis wartości do tabeli EVENTS (2 overloady: int i string)

---

## SQL / Tabele

| Tabela | Operacje | Kontekst |
|---|---|---|
| `EVENTS` | SELECT, INSERT, UPDATE | Główna tabela — wszystkie właściwości eventu |

- Konstruktor: `select NAME from EVENTS where ...` → jeśli brak i create=true → `insert into EVENTS set ...`
- Gettery: `select <field> from EVENTS where ...`
- Settery: `update EVENTS set ...`
