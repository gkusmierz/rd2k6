# inv-034 — RDUnixServer

PARTIAL_ID: 034
Status: done
Agent: PHASE-2-inventory-subagent (networking batch)

---

## Klasa: RDUnixServer

**Plik:** `lib/rdunixserver.h`, `lib/rdunixserver.cpp`
**Dziedziczenie:** `QObject` (bezposrednie)
**Rola:** Serwer UNIX domain socket (SOCK_STREAM). Odpowiednik QTcpServer dla lokalnych polaczen UNIX — nasluchuje na pathname lub abstract socket addresses i akceptuje przychodzace polaczenia.

### Konstruktor / Destruktor

| Sygnatura | Opis |
|-----------|------|
| `RDUnixServer(QObject *parent=0)` | Inicjalizuje serwer (domyslnie max 3 oczekujace polaczenia) |
| `~RDUnixServer()` | Zamyka socket i zwalnia QSocketNotifier |

### Metody publiczne

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `close()` | `void` | Zamyka nasluchujacy socket (shutdown SHUT_RDWR) |
| `errorString()` | `QString` | Ostatni komunikat bledu |
| `hasPendingConnections()` | `bool` | Zawsze zwraca false (nie implementuje kolejkowania) |
| `isListening()` | `bool` | Czy serwer nasluchuje |
| `listenToPathname(pathname)` | `bool` | Rozpoczyna nasluchiwanie na plikowej sciezce UNIX socket |
| `listenToAbstract(addr)` | `bool` | Rozpoczyna nasluchiwanie na abstrakcyjnym adresie UNIX socket |
| `nextPendingConnection()` | `QTcpSocket*` | Akceptuje nastepne polaczenie, zwraca QTcpSocket z ustawionym deskryptorem |
| `maxPendingConnections()` | `int` | Zwraca limit oczekujacych polaczen |
| `setMaxPendingConnections(num)` | `void` | Ustawia limit oczekujacych polaczen |
| `socketDescriptor()` | `int` | Deskryptor nasluchujacego socketu |
| `setSocketDescriptor(sock)` | `void` | Ustawia zewnetrzny deskryptor socketu i konfiguruje notifier |

### Signals

| Signal | Parametry | Opis |
|--------|-----------|------|
| `newConnection()` | brak | Emitowany gdy nowe polaczenie jest gotowe do zaakceptowania |

### Private Slots

| Slot | Opis |
|------|------|
| `newConnectionData(int fd)` | Odbiera QSocketNotifier::activated, emituje newConnection() |

### Wzorzec behawioralny

RDUnixServer to **QTcpServer-like wrapper** nad UNIX domain sockets. Obsluguje dwa typy adresow UNIX (pathname i abstract). Po nawiazaniu polaczenia, klient jest wrap-owany w standardowy QTcpSocket (przez setSocketDescriptor), co pozwala reszcie systemu traktowac go jak zwykle polaczenie TCP.

Roznica pathname vs abstract:
- **pathname**: socket widoczny w systemie plikow (np. `/tmp/my.sock`)
- **abstract**: socket w abstrakcyjnej przestrzeni nazw Linuxa (sun_path[0]='\0')

### Pola prywatne

| Pole | Typ | Opis |
|------|-----|------|
| `unix_socket` | `int` | Deskryptor nasluchujacego socketu (-1 = zamkniety) |
| `unix_is_listening` | `bool` | Flaga nasluchiwania |
| `unix_max_pending_connections` | `int` | Limit backlog listen() (domyslnie 3) |
| `unix_notifier` | `QSocketNotifier*` | Notifier odczytu na nasluchujacym sockecie |
| `unix_error_string` | `QString` | Ostatni komunikat bledu |

### Platformowe (Linux-specific)

- Wymaga `<linux/un.h>`, `<sys/socket.h>`, `<sys/types.h>`
- Uzywa niskopoziomowego API: `socket(AF_UNIX)`, `bind()`, `listen()`, `accept()`, `shutdown()`
- UNIX_PATH_MAX z `<linux/un.h>`
- **Wylacznie Linux** — nie jest przenosny na inne platformy
