# inv-049 — RDEventImportList

status: done
agent: PHASE-2-inventory-subagent
partial_id: 049

## Klasy: RDEventImportItem + RDEventImportList

**Plik:** `lib/rdeventimportlist.h` / `lib/rdeventimportlist.cpp`
**Rola:** Lista elementów importu dla eventu schedulera. Każdy event może mieć listę pre-import i post-import — elementy, które mają być wstawione przed/po głównej treści eventu. RDEventImportItem to pojedynczy element listy, RDEventImportList to zarządzana kolekcja.

---

## Klasa: RDEventImportItem

**Rola:** Pojedynczy element importu w liście. Może reprezentować cart, marker lub end-marker.

**Konstruktor:** `RDEventImportItem(bool end_marker=false)`

### Właściwości

| Właściwość | Typ | Opis |
|---|---|---|
| isEndMarker | bool (readonly) | Czy to znacznik końca |
| eventType | RDLogLine::Type | Typ elementu (Audio, Macro, Marker, itp.) |
| cartNumber | unsigned | Numer cartu (0 = brak) |
| transType | RDLogLine::TransType | Typ przejścia (Play, Segue, Stop) |
| markerComment | QString | Komentarz markera |

---

## Klasa: RDEventImportList

**Konstruktor:** `RDEventImportList()` — pusta lista

### Enum: ImportType
- `PreImport=0` — lista elementów wstawianych przed treścią eventu
- `PostImport=1` — lista elementów wstawianych po treści eventu

### Właściwości

| Właściwość | Getter | Setter | Opis |
|---|---|---|---|
| eventName | `eventName()` | `setEventName()` | Nazwa powiązanego eventu |
| type | `type()` | `setType()` | PreImport lub PostImport |

### Metody kolekcji

| Metoda | Opis |
|---|---|
| `size()` | Liczba elementów |
| `item(n)` | Pobranie n-tego elementu |
| `endMarkerItem()` | Pobranie end-markera |
| `takeItem(n)` | Wyjęcie elementu (transfer ownership) |
| `removeItem(n)` | Usunięcie elementu |
| `moveItem(from, to)` | Przesunięcie elementu na liście |
| `clear()` | Wyczyszczenie listy |

### Persystencja

| Metoda | Opis |
|---|---|
| `load()` | Załaduj listę z DB na podstawie eventName + type |
| `save(first_trans)` | Zapisz listę do DB; opcjonalnie nadpisz transition type pierwszego elementu |

---

## SQL / Tabele

| Tabela | Operacje | Kontekst |
|---|---|---|
| `EVENT_LINES` | SELECT, INSERT, DELETE | Główna tabela — ładowanie i zapisywanie elementów listy importu. DELETE+INSERT przy save (pełna wymiana). |
