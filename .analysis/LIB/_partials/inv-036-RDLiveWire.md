# inv-036 — RDLiveWire

PARTIAL_ID: 036
Status: done
Agent: PHASE-2-inventory-subagent (networking batch)

---

## Klasa: RDLiveWire

**Plik:** `lib/rdlivewire.h`, `lib/rdlivewire.cpp`
**Dziedziczenie:** `QObject` (bezposrednie)
**Rola:** Driver wezla Axia LiveWire — protokol sieciowy audio-over-IP. Zarzadza polaczeniem TCP z wezlem LiveWire, odpytuje jego konfiguracje (zrodla, cele, GPIO) i umozliwia sterowanie routingiem audio oraz GPIO.

### Klasa pomocnicza: AString

Rozszerzenie QString o metode `split(sep, esc)` obslugujaca escape character (znaki w cudzyslowach nie sa dzielone). Uzywana wylacznie do parsowania odpowiedzi protokolu LWRP.

### Konstruktor

| Sygnatura | Opis |
|-----------|------|
| `RDLiveWire(unsigned id, QObject *parent=0)` | Tworzy driver z identyfikatorem. Inicjalizuje socket TCP, timery watchdog, holdoff i reconnect. |

### Metody publiczne — Konfiguracja

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `id()` | `unsigned` | Identyfikator instancji drivera |
| `hostname()` | `QString` | Nazwa hosta wezla LiveWire |
| `tcpPort()` | `Q_UINT16` | Port TCP wezla |
| `baseOutput()` | `unsigned` | Bazowy numer wyjscia |
| `connectToHost(hostname, port, passwd, base_output)` | `void` | Nawiazuje polaczenie TCP z wezlem (asynchroniczne) |
| `loadSettings(hostname, port, passwd, base_output)` | `bool` | Nawiazuje polaczenie i czeka synchronicznie na odpowiedz VER (max 5s, polling processEvents) |
| `deviceName()` | `QString` | Nazwa urzadzenia wezla |
| `protocolVersion()` | `QString` | Wersja protokolu LWRP |
| `systemVersion()` | `QString` | Wersja systemu wezla |

### Metody publiczne — Audio routing

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `sources()` | `int` | Liczba zrodel audio |
| `destinations()` | `int` | Liczba celow audio |
| `channels()` | `int` | Liczba kanalow na zrodlo/cel |
| `setRoute(src_num, dest_slot)` | `void` | Ustawia routing: przypisuje zrodlo do celu (przez multicast 239.192.x.x) |

### Metody publiczne — GPIO

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `gpis()` / `gpos()` | `int` | Liczba slotow GPI/GPO |
| `gpiChannel(slot, line)` / `gpoChannel(slot, line)` | `unsigned` | Numer kanalu dla danego GPI/GPO |
| `gpiState(slot, line)` / `gpoState(slot, line)` | `bool` | Aktualny stan pinu GPI/GPO |
| `gpiSet(slot, line, interval=0)` | `void` | Ustawia GPI na aktywny (opcjonalnie z auto-reset po interval ms) |
| `gpiReset(slot, line, interval=0)` | `void` | Resetuje GPI (opcjonalnie z auto-set po interval ms) |
| `gpoSet(slot, line, interval=0)` | `void` | Ustawia GPO na aktywny (opcjonalnie z auto-reset) |
| `gpoReset(slot, line, interval=0)` | `void` | Resetuje GPO (opcjonalnie z auto-set) |

### Signals

| Signal | Parametry | Opis |
|--------|-----------|------|
| `connected` | `unsigned id` | Polaczenie z wezlem nawiazane i konfiguracja wczytana |
| `sourceChanged` | `unsigned id, RDLiveWireSource *src` | Zmiana konfiguracji zrodla audio |
| `destinationChanged` | `unsigned id, RDLiveWireDestination *dst` | Zmiana konfiguracji celu audio |
| `gpoConfigChanged` | `unsigned id, unsigned slot, unsigned chan` | Zmiana konfiguracji GPIO (przypisanie kanalu do slotu) |
| `gpiChanged` | `unsigned id, unsigned slot, unsigned line, bool state` | Zmiana stanu GPI |
| `gpoChanged` | `unsigned id, unsigned slot, unsigned line, bool state` | Zmiana stanu GPO |
| `watchdogStateChanged` | `unsigned id, const QString &msg` | Zmiana stanu polaczenia watchdog (utrata/przywrocenie) |

### Private Slots

| Slot | Opis |
|------|------|
| `connectedData()` | Po polaczeniu TCP: wysyla LOGIN i VER |
| `connectionClosedData()` | Utrata polaczenia: uruchamia reconnect z losowym holdoff |
| `readyReadData()` | Buforuje dane TCP linia po linii, wywoluje DespatchCommand |
| `errorData(err)` | Obsluga bledow socketu; ConnectionRefused uruchamia reconnect |
| `gpiTimeoutData(id)` / `gpoTimeoutData(id)` | Auto-toggle GPI/GPO po uplywie interwalu (timed pulse) |
| `watchdogData()` | Wysyla periodyczny VER jako heartbeat |
| `watchdogTimeoutData()` | Brak odpowiedzi watchdog — uruchamia reconnect |
| `holdoffData()` | Po holdoff — resetuje polaczenie |
| `resetConnectionData()` | Zamyka socket i laczy ponownie |

### Metody prywatne — Protokol LWRP

| Metoda | Opis |
|--------|------|
| `DespatchCommand(cmd)` | Router komend: parsuje opcode (VER/SRC/DST/GPI/GPO/CFG) i deleguje |
| `SendCommand(cmd)` | Wysyla komende LWRP (dodaje CRLF) |
| `ReadVersion(cmd)` | Parsuje odpowiedz VER: wersja, nazwa, liczby SRC/DST/GPI/GPO. Inicjalizuje tablice GPIO. |
| `ReadSources(cmd)` | Parsuje SRC: slot, nazwa, adres multicast, gain, kanaly |
| `ReadDestinations(cmd)` | Parsuje DST: slot, nazwa, adres, kanaly, gain |
| `ReadGpis(cmd)` / `ReadGpos(cmd)` | Parsuje stany GPIO (h=high/inactive, l=low/active) |
| `ReadGpioConfig(cmd)` | Parsuje CFG GPO: przypisanie zrodla do slotu GPIO |
| `PruneUrl(str)` | Obcina URL (czesc przed '<') |
| `ResetConnection()` | Zamyka socket i reconnect |
| `GetHoldoff()` | Losowy holdoff 5-30s przed reconnect |

### Wzorzec behawioralny

RDLiveWire to **pelny driver protokolu LWRP (LiveWire Routing Protocol)**. Obsluguje:

1. **Polaczenie TCP** z wezlem LiveWire na zadanym porcie
2. **Autentykacje** — komenda LOGIN z haslem
3. **Autodiscovery** — po polaczeniu odpytuje VER, SRC, DST, GPI, GPO, CFG GPO
4. **Routing audio** — przez komendy DST z adresami multicast 239.192.x.x
5. **GPIO** — odczyt/zapis stanow GPI/GPO z opcjonalnymi timed pulses (auto-toggle po interwale)
6. **Watchdog** — periodyczny heartbeat VER co 10s, timeout 30s
7. **Auto-reconnect** — przy utracie polaczenia, losowy holdoff 5-30s i ponowne polaczenie
8. **Subskrypcja zmian** — komendy ADD GPI/ADD GPO rejestruja na powiadomienia o zmianach

### Stale

| Stala | Wartosc | Opis |
|-------|---------|------|
| `RDLIVEWIRE_WATCHDOG_INTERVAL` | 10000 ms | Odstep miedzy heartbeatami |
| `RDLIVEWIRE_WATCHDOG_TIMEOUT` | 30000 ms | Timeout braku odpowiedzi |
| `RDLIVEWIRE_RECONNECT_MIN_INTERVAL` | 5000 ms | Minimalny holdoff reconnect |
| `RDLIVEWIRE_RECONNECT_MAX_INTERVAL` | 30000 ms | Maksymalny holdoff reconnect |

### Zaleznosci

- `RDLiveWireSource` — model danych zrodla audio
- `RDLiveWireDestination` — model danych celu audio
- `rd.h` — stale (RD_LIVEWIRE_MAX_CMD_LENGTH, RD_LIVEWIRE_GPIO_BUNDLE_SIZE, RD_LIVEWIRE_DEFAULT_CHANNELS)
- `RDSocketStrings` — czytelne nazwy bledow socketu
- `RDApplication` (rda) — logowanie syslog

### Platformowe

Brak bezposrednich zaleznosci Linux-specific (poza `<unistd.h>` dla `usleep`). Komunikacja przez QTcpSocket.
