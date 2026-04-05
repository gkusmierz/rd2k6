---
partial_id: 034
class_name: RDSocket
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDSocket

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `hostFoundID(int id)` | `hostFoundData()` | po rozwiązaniu DNS | QTcpSocket::hostFound z dołączonym ID połączenia |
| `connectedID(int id)` | `connectedData()` | po nawiązaniu połączenia TCP | QTcpSocket::connected z ID |
| `connectionClosedID(int id)` | `connectionClosedData()` | po zamknięciu połączenia | QTcpSocket::disconnected z ID |
| `delayedCloseFinishedID(int id)` | `delayedCloseFinishedData()` | po opóźnionym zamknięciu | QTcpSocket::delayedCloseFinished z ID |
| `readyReadID(int id)` | `readyReadData()` | gdy dane dostępne do odczytu | QTcpSocket::readyRead z ID |
| `bytesWrittenID(int nbytes,int id)` | `bytesWrittenData(int nbytes)` | po zapisaniu bajtów | QTcpSocket::bytesWritten z ID |
| `errorID(QAbstractSocket::SocketError,int id)` | `errorData(QAbstractSocket::SocketError)` | przy błędzie gniazda | QTcpSocket::error z ID |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `this` (QTcpSocket) | `hostFound()` | `hostFoundData()` | `rdsocket.cpp:31` |
| `this` (QTcpSocket) | `connected()` | `connectedData()` | `rdsocket.cpp:32` |
| `this` (QTcpSocket) | `disconnected()` | `connectionClosedData()` | `rdsocket.cpp:33` |
| `this` (QTcpSocket) | `delayedCloseFinished()` | `delayedCloseFinishedData()` | `rdsocket.cpp:34` |
| `this` (QTcpSocket) | `readyRead()` | `readyReadData()` | `rdsocket.cpp:36` |
| `this` (QTcpSocket) | `bytesWritten(int)` | `bytesWrittenData(int)` | `rdsocket.cpp:37` |
| `this` (QTcpSocket) | `error(QAbstractSocket::SocketError)` | `errorData(...)` | `rdsocket.cpp:38` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `connectedID(int)` | `VGuest` (ripcd) | `connectedData(int)` | `ripcd/vguest.cpp:245` |
| pozostałe *ID sygnały | różni odbiorcy w ripcd, rdcatchd itp. | zależnie od kontekstu | per-instance |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| TCP | zewnętrzne urządzenia/demony | wszystkie sygnały *ID | Wrapper dodający ID do standardowych sygnałów TCP — umożliwia multipleksowanie wielu połączeń przez jeden handler |
