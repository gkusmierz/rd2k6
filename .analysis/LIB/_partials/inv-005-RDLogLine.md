# inv-005 — RDLogLine

- **Plik**: `lib/rdlog_line.h` / `lib/rdlog_line.cpp`
- **Rodzaj**: Plain C++ value class (no QObject, no signals/slots, no Q_PROPERTY)
- **Rola**: Reprezentuje pojedynczą linię (event) w logu emisyjnym. Przechowuje kompletny stan jednego elementu schedule: metadane karty/cuta, punkty audio (start/end/segue/fade/talk/hook), informacje o przejściach (transition) i kontrolę odtwarzania.

---

## Klasa

### RDLogLine
Duża klasa-kontener (~100 pól, ~200 accessor/mutator). Nie dziedziczy po QObject. Czysto data-oriented: getter/setter + logika ładowania z DB + logika przygotowania do odtwarzania.

**Konstruktory:**
- `RDLogLine()` — pusty, wywołuje `clear()` (defaults)
- `RDLogLine(unsigned cartnum, int cutnum)` — ładuje metadane karty i opcjonalnie cuta bezpośrednio z DB (tabele CART, CUTS)

---

## Enums (11 typów)

| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| **Type** | Cart=0, Marker=1, Macro=2, OpenBracket=3, CloseBracket=4, Chain=5, Track=6, MusicLink=7, TrafficLink=8, UnknownType=9 | Rodzaj eventu w logu |
| **TransType** | Play=0, Segue=1, Stop=2, NoTrans=255 | Typ przejścia do następnego eventu |
| **TransEdge** | AllTrans=0, LeadingTrans=1, TrailingTrans=2 | Która krawędź przejścia |
| **TimeType** | Relative=0, Hard=1, NoTime=255 | Sposób wyznaczenia czasu startu (względny / twardy / brak) |
| **StartTimeType** | Imported=0, Logged=1, Predicted=2, Actual=3, Initial=4 | Skąd pochodzi wartość start time (5 indeksów tablicy start_time) |
| **Source** | Manual=0, Traffic=1, Music=2, Template=3, Tracker=4 | Kto wprowadził linię do logu |
| **Status** | Scheduled=1, Playing=2, Auditioning=3, Finished=4, Finishing=5, Paused=6 | Status runtime linii podczas odtwarzania |
| **State** | Ok=0, NoCart=1, NoCut=2 | Stan walidacji: czy karta/cut istnieją |
| **StartSource** | StartUnknown=0, StartManual=1, StartPlay=2, StartSegue=3, StartTime=4, StartPanel=5, StartMacro=6, StartChannel=7 | Co spowodowało start odtwarzania |
| **PlaySource** | UnknownSource=0, MainLog=1, AuxLog1=2, AuxLog2=3, SoundPanel=4, CartSlot=5 | Z jakiego logu/panelu uruchomiono |
| **PointerSource** | CartPointer=0, LogPointer=1, AutoPointer=2 | Warstwa punktów audio (cart-default, log-override, auto-calculated) |

---

## Grupy pól (WHAT, nie lista 1:1)

### Identyfikacja eventu
- `id` — unikalny ID linii w logu
- `type` — rodzaj eventu (Cart/Marker/Macro/Chain/Link/Bracket/Track)
- `cartNumber`, `cutNumber`, `cutName` — powiązanie z kartą i cutem audio
- `cartType` — Audio vs Macro

### Scheduling i czas
- `startTime[5]` — tablica 5 wariantów czasu startu (Imported/Logged/Predicted/Actual/Initial)
- `timeType` — Relative / Hard / NoTime
- `graceTime` — okno tolerancji hard-time
- `startDatetime`, `endDatetime` — okno ważności karty
- `originUser`, `originDateTime` — kto i kiedy wprowadził linię

### Transition (przejścia)
- `transType` — Play / Segue / Stop
- `segueGain` — poziom gain dla segue
- `hasCustomTransition` — czy przejście zostało ręcznie zmodyfikowane

### Punkty audio (wielowarstwowe: CartPointer / LogPointer / AutoPointer)
- `startPoint[src]`, `endPoint[src]` — zakres odtwarzania
- `segueStartPoint[src]`, `segueEndPoint[src]` — region segue
- `fadeupPoint[src]`, `fadeupGain` — fade in
- `fadedownPoint[src]`, `fadedownGain` — fade out
- `talkStartPoint`, `talkEndPoint` — region intro/talk-over
- `hookStartPoint`, `hookEndPoint`, `hookMode` — region hook (preview)
- `duckUpGain`, `duckDownGain` — ducking

### Metadane karty (ładowane z DB)
- `title`, `artist`, `album`, `publisher`, `composer`, `conductor`
- `label`, `year`, `client`, `agency`, `songId`
- `outcue`, `description`, `userDefined`, `cartNotes`
- `isrc`, `isci`, `recordingMbId`, `releaseMbId`
- `groupName`, `groupColor`
- `usageCode`, `playOrder`, `cutQuantity`, `lastCutPlayed`

### Kontrola odtwarzania (runtime)
- `status` — Scheduled/Playing/Auditioning/Finished/Finishing/Paused
- `state` — Ok/NoCart/NoCut (walidacja)
- `effectiveLength` — obliczona długość po uwzględnieniu timescale
- `forcedLength`, `enforceLength`, `preservePitch` — wymuszanie długości
- `timescalingActive` — czy timescaling jest aktywny
- `deck`, `playDeck`, `portName` — przypisanie do urządzenia
- `playTime`, `playPosition`, `playPositionChanged` — pozycja odtwarzania
- `pass` — numer przebiegu (pass) w logu
- `zombified` — linia usunięta ale jeszcze gra
- `evergreen` — karta evergreen (zawsze ważna)
- `asyncronous` — odtwarzanie asynchroniczne
- `pauseCard`, `pausePort` — para card/port przy pauzowaniu

### External scheduler data
- `extStartTime`, `extLength`, `extCartName`, `extData`, `extEventId`, `extAnncType` — dane z zewnętrznego schedulera (traffic/music)

### Link data (event linking)
- `linkEventName`, `linkStartTime`, `linkLength`, `linkStartSlop`, `linkEndSlop`, `linkId`, `linkEmbedded` — parametry linkowania eventów
- `useEventLength`, `eventLength` — wymuszanie długości z poziomu eventu

### Now/Next
- `nowNextEnabled` — czy linia uczestniczy w raportowaniu Now/Next (RDS/PAD)

---

## Kluczowe metody (zachowanie)

### `loadCart(int cartnum, int cutnum)`
Ładuje kompletne metadane karty z tabel CART + GROUPS (LEFT JOIN) oraz opcjonalnie szczegoly cuta z tabeli CUTS. Ustawia typ linii (Cart/Macro) na podstawie CART.TYPE. W trybie hookMode zamienia start/end na hook region.

### `loadCart(int cartnum, TransType next_type, int mach, bool timescale, TransType type, int len)`
Rozszerzony wariant: po załadowaniu karty wywoluje `setEvent()` do przygotowania audio. Opcjonalnie wymusza length i transition type.

### `setEvent(int mach, TransType next_type, bool timescale, int len) -> State`
Kluczowa metoda przygotowania eventu do odtwarzania. Zachowanie zalezy od typu:
- **Cart**: Tworzy RDCart, wybiera cut (`selectCut`), ładuje punkty audio z CUTS. Wspiera timescaling (skalowanie punktow proporcjonalnie do wymuszonej dlugosci). W hookMode uzywa hook start/end zamiast normalnych punktow. Oblicza effective_length i talk_length.
- **Macro**: Laduje RDMacroEvent, sprawdza czy macro zawiera komende LL (forced stop) dla danej maszyny. Ustawia effective_length z forced_length karty.
- **Inne typy** (Marker, Chain, Link, Bracket, Track): zeruje punkty audio, ustawia state=Ok.
- Zwraca State (Ok/NoCart/NoCut).

### `refreshPointers()`
Odswieża punkty audio CartPointer z tabeli CUTS (re-read z bazy). Uzywane gdy cut mogl sie zmienic (np. po edycji w innym module).

### `resolveWildcards(QString pattern, int log_id) -> QString`
System template'ow: zamienia placeholdery (%t=title, %a=artist, %n=cart number, itd.) na wartosci z pol linii. Synchronizowany z PyPAD i rdimport. Obsluguje ~30 wildcard'ow.

### `xml(int line) -> QString`
Serializacja do XML: generuje kompletny element `<logLine>` ze wszystkimi polami, wlaczajac wielowarstwowe punkty audio (cart/log source). Uzywane przez API.

### `effectiveLength() -> int`
Zwraca efektywna dlugosc: jesli cut nie jest wybrany, zwraca forcedLength; w przeciwnym razie effective_length (obliczona w setEvent).

### `clear()`
Reset do defaults: ~100 pol ustawianych na wartosci poczatkowe. Status=Scheduled, State=Ok, TimeType=Relative, TransType=Play, Type=Cart.

---

## Tabele DB

| Tabela | Operacja | Kontekst |
|--------|----------|----------|
| **CART** | SELECT (metadane karty: title, artist, group, forced_length, itp.) | Konstruktor(cartnum), loadCart() |
| **CUTS** | SELECT (punkty audio, length, outcue, ISRC, opis) | Konstruktor(cartnum,cutnum), setEvent(), loadCart(), refreshPointers() |
| **GROUPS** | SELECT (LEFT JOIN z CART — kolor grupy, enable_now_next) | loadCart() |

---

## Pointer System (trojwarstwowy)

Punkty audio (start, end, segue, fadeup, fadedown) sa przechowywane w tablicach indeksowanych przez PointerSource:
- **CartPointer (0)** — wartosc domyslna z tabeli CUTS
- **LogPointer (1)** — nadpisanie z poziomu logu (reczna edycja w RDLogEdit)
- **AutoPointer (2)** — wartosc obliczona automatycznie (timescaling, runtime)

Metody `startPoint(src)`, `endPoint(src)` itp. przyjmuja PointerSource jako parametr. Odtwarzacz wybiera odpowiednia warstwe.

---

## Relacje z innymi klasami

- **RDCart** — uzywa do walidacji istnienia karty, wyboru cuta (`selectCut`), pobierania `forcedLength` i `averageSegueLength`
- **RDCut** — statyczna metoda `cutName()` do generowania nazwy cuta
- **RDMacroEvent** / **RDMacro** — ladowanie i analiza makr (wykrywanie komendy LL = forced stop)
- **RDSqlQuery** — dostep do bazy danych
- **RDCart::Type**, **RDCart::PlayOrder**, **RDCart::UsageCode**, **RDCart::Validity** — referencje do enumow z RDCart
