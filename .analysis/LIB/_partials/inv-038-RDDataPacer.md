# inv-038 — RDDataPacer

PARTIAL_ID: 038
Status: done
Agent: PHASE-2-inventory-subagent (networking batch)

---

## Klasa: RDDataPacer

**Plik:** `lib/rddatapacer.h`, `lib/rddatapacer.cpp`
**Dziedziczenie:** `QObject` (bezposrednie)
**Rola:** Rate-limiter strumienia danych. Ogranicza czestotliwosc wysylania wiadomosci (QByteArray) do zadanego interwalu — jesli dane przychodza szybciej, sa kolejkowane i wysylane po kolei z zadanym odstepem.

### Konstruktor / Destruktor

| Sygnatura | Opis |
|-----------|------|
| `RDDataPacer(QObject *parent=0)` | Tworzy pacer z domyslnym interwalem 100ms. Inicjalizuje QTimer single-shot. |
| `~RDDataPacer()` | Zwalnia timer |

### Metody publiczne

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `paceInterval()` | `int` | Aktualny interwat pace (ms) |
| `setPaceInterval(msecs)` | `void` | Ustawia interwat pace (ms) |

### Signals

| Signal | Parametry | Opis |
|--------|-----------|------|
| `dataSent` | `const QByteArray &data` | Emitowany gdy dane sa "wysylane" (gotowe do konsumpcji) |

### Public Slots

| Slot | Parametry | Opis |
|------|-----------|------|
| `send` | `const QByteArray &data` | Przyjmuje dane do wyslania. Jesli timer nieaktywny — natychmiast emituje dataSent i startuje timer. Jesli aktywny — kolejkuje. |

### Private Slots

| Slot | Opis |
|------|------|
| `timeoutData()` | Po uplywie interwalu: jesli kolejka niepusta — emituje dataSent z nastepnym elementem i restartuje timer. Jesli pusta — nic (timer wygasa). |

### Wzorzec behawioralny

RDDataPacer to **token bucket / leaky bucket rate limiter** z nastepujaca logika:

1. **Idle** — timer nieaktywny, kolejka pusta
2. **send() przy idle** — dane emitowane NATYCHMIAST przez dataSent(), timer startuje (blokuje nastepne)
3. **send() przy aktywnym timerze** — dane trafiaja do kolejki (QQueue<QByteArray>)
4. **timeout** — jesli kolejka ma dane, emituje najstarszy element i restartuje timer
5. **timeout przy pustej kolejce** — powrot do idle (timer wygasa, single-shot)

Gwarantuje minimalne odstepy `paceInterval` ms miedzy kolejnymi emisjami dataSent.

### Stale

| Stala | Wartosc | Opis |
|-------|---------|------|
| `RDDATAPACER_DEFAULT_PACE_INTERVAL` | 100 ms | Domyslny interwat miedzy pakietami |

### Pola prywatne

| Pole | Typ | Opis |
|------|-----|------|
| `d_data_queue` | `QQueue<QByteArray>` | Kolejka oczekujacych danych |
| `d_timer` | `QTimer*` | Single-shot timer pacing |
| `d_pace_interval` | `int` | Interwat pace w ms |

### Platformowe

Brak zaleznosci systemowych — czysta warstwa Qt.
