# inv-033 — RDSocket

PARTIAL_ID: 033
Status: done
Agent: PHASE-2-inventory-subagent (networking batch)

---

## Klasa: RDSocket

**Plik:** `lib/rdsocket.h`, `lib/rdsocket.cpp`
**Dziedziczenie:** `QTcpSocket` (bezposrednie)
**Rola:** Rozszerzenie QTcpSocket o identyfikator polaczenia (connection ID). Umozliwia identyfikowanie, ktore polaczenie emitowalo dany sygnal, gdy wiele socketow jest obslugiwanych jednoczesnie.

### Konstruktor

| Sygnatura | Opis |
|-----------|------|
| `RDSocket(int id, QObject *parent=0)` | Tworzy socket z przypisanym numerycznym ID. Podlacza wszystkie sygnaly bazowego QTcpSocket do prywatnych slotow retransmitujacych. |

### Signals

| Signal | Parametry | Opis |
|--------|-----------|------|
| `hostFoundID` | `int id` | Host zostal znaleziony — retransmisja QTcpSocket::hostFound z dolaczonym ID |
| `connectedID` | `int id` | Polaczenie nawiazane — retransmisja z ID |
| `connectionClosedID` | `int id` | Polaczenie zamkniete — retransmisja z ID |
| `delayedCloseFinishedID` | `int id` | Opoznione zamkniecie zakonczone — retransmisja z ID |
| `readyReadID` | `int id` | Dane gotowe do odczytu — retransmisja z ID |
| `bytesWrittenID` | `int nbytes, int id` | Bajty zapisane — retransmisja z iloscia i ID |
| `errorID` | `QAbstractSocket::SocketError error, int id` | Blad socketu — retransmisja z kodem bledu i ID |

### Private Slots

| Slot | Opis |
|------|------|
| `hostFoundData()` | Odbiera QTcpSocket::hostFound, emituje hostFoundID(id) |
| `connectedData()` | Odbiera QTcpSocket::connected, emituje connectedID(id) |
| `connectionClosedData()` | Odbiera QTcpSocket::disconnected, emituje connectionClosedID(id) |
| `delayedCloseFinishedData()` | Odbiera QTcpSocket::delayedCloseFinished, emituje delayedCloseFinishedID(id) |
| `readyReadData()` | Odbiera QTcpSocket::readyRead, emituje readyReadID(id) |
| `bytesWrittenData(int)` | Odbiera QTcpSocket::bytesWritten, emituje bytesWrittenID(nbytes, id) |
| `errorData(QAbstractSocket::SocketError)` | Odbiera QTcpSocket::error, emituje errorID(error, id) |

### Wzorzec behawioralny

RDSocket to **ID-multiplexing proxy** nad QTcpSocket. Kazdy sygnal bazowego socketu jest przechwytywany i re-emitowany z dolaczonym identyfikatorem `id`. Pozwala to na obsluge wielu jednoczesnych polaczen TCP przez jednego handlera sygnalowego (np. w polaczeniu z QSignalMapper).

### Pola prywatne

| Pole | Typ | Opis |
|------|-----|------|
| `id_num` | `int` | Numer identyfikujacy polaczenie, ustawiany w konstruktorze |

### Platformowe

Brak zaleznosci systemowych — czysta warstwa Qt.
