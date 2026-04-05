# inv-035 — RDUnixSocket

PARTIAL_ID: 035
Status: done
Agent: PHASE-2-inventory-subagent (networking batch)

---

## Klasa: RDUnixSocket

**Plik:** `lib/rdunixsocket.h`, `lib/rdunixsocket.cpp`
**Dziedziczenie:** `QTcpSocket` (bezposrednie)
**Rola:** Klient UNIX domain socket (SOCK_STREAM). Odpowiednik QTcpSocket dla lokalnych polaczen UNIX — laczy sie z pathname lub abstract socket address.

### Konstruktor

| Sygnatura | Opis |
|-----------|------|
| `RDUnixSocket(QObject *parent=0)` | Tworzy socket kliencki (pusta inicjalizacja) |

### Metody publiczne

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `connectToPathname(pathname, mode=ReadWrite)` | `bool` | Laczy sie z UNIX socket w sciezce plikowej. **UWAGA: Zawsze zwraca false — NIE ZAIMPLEMENTOWANE.** |
| `connectToAbstract(addr, mode=ReadWrite)` | `bool` | Laczy sie z abstrakcyjnym adresem UNIX socket. Po podlaczeniu ustawia deskryptor na QTcpSocket, wiec reszta systemu moze uzywac standardowego API Qt. |

### Signals / Slots

Brak wlasnych sygnalow i slotow — dziedziczy pelne API QTcpSocket (connected, readyRead, error, itp.).

### Wzorzec behawioralny

RDUnixSocket to **QTcpSocket adapter** dla polaczen klienckich UNIX domain socket. Po nawiazaniu polaczenia niskopoziomowym API, przechodzi w tryb QTcpSocket przez `setSocketDescriptor()`. Klient uzywajacy go widzi standardowy interfejs QTcpSocket.

**Istotne ograniczenie:** Metoda `connectToPathname()` jest stub-em (zawsze zwraca false). Tylko `connectToAbstract()` jest funkcjonalne — co sugeruje, ze system Rivendell komunikuje sie wylacznie przez abstract UNIX sockets.

### Platformowe (Linux-specific)

- Wymaga `<linux/un.h>`, `<sys/socket.h>`, `<sys/types.h>`
- Uzywa niskopoziomowego API: `socket(AF_UNIX)`, `connect()`
- UNIX_PATH_MAX z `<linux/un.h>`
- **Wylacznie Linux** — nie jest przenosny na inne platformy
- Adres abstrakcyjny: `sun_path[0]='\0'` + nazwa (specyficzne dla Linuxa)
