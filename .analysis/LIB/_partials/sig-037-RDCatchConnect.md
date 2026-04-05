---
partial_id: 037
class_name: RDCatchConnect
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCatchConnect

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `connected(int serial,bool state)` | `DispatchCommand()` | po odpowiedzi na komendę PW (password) — true=ok, false=bad password | TCP połączenie z rdcatchd nawiązane/odrzucone |
| `statusChanged(int serial,unsigned channel,RDDeck::Status status,int id,const QString &cutname)` | `DispatchCommand()` | przy odpowiedzi DS/DR/DP (deck status) | Zmiana stanu decku (nagrywanie/odtwarzanie/idle) |
| `monitorChanged(int serial,unsigned channel,bool state)` | `DispatchCommand()` | przy odpowiedzi MN | Zmiana stanu monitoru decku |
| `meterLevel(int serial,int deck,int chan,int level)` | `DispatchCommand()` | przy odpowiedzi ML (meter level) | Poziom sygnału audio na decku |
| `eventUpdated(int id)` | `DispatchCommand()` | przy odpowiedzi EU (event updated) | Zdarzenie catchd zostało zaktualizowane |
| `eventPurged(int id)` | `DispatchCommand()` | przy odpowiedzi EP (event purged) | Zdarzenie catchd zostało usunięte |
| `deckEventSent(int serial,int chan,int number)` | `DispatchCommand()` | przy odpowiedzi DE | Deck wysłał zdarzenie (np. GPI trigger) |
| `heartbeatFailed(int id)` | `heartbeatTimeoutData()` | gdy brak odpowiedzi na heartbeat w czasie CC_HEARTBEAT_INTERVAL | Utrata połączenia z rdcatchd |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `cc_socket` (QTcpSocket) | `connected()` | `connectedData()` | `rdcatch_connect.cpp:44` |
| `cc_socket` (QTcpSocket) | `readyRead()` | `readyData()` | `rdcatch_connect.cpp:45` |
| `cc_heartbeat_timer` (QTimer) | `timeout()` | `heartbeatTimeoutData()` | `rdcatch_connect.cpp:51` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `statusChanged(...)` | `rdcatch::MainWidget` | `statusChangedData(...)` | `rdcatch/rdcatch.cpp:214` |
| `monitorChanged(...)` | `rdcatch::MainWidget` | `monitorChangedData(...)` | `rdcatch/rdcatch.cpp:218` |
| `connected(int,bool)` | `rdcatch::MainWidget` | `connectedData(int,bool)` | `rdcatch/rdcatch.cpp:221` |
| `meterLevel(...)` | `rdcatch::MainWidget` | `meterLevelData(...)` | `rdcatch/rdcatch.cpp:224` |
| `eventUpdated(int)` | `rdcatch::MainWidget` | `eventUpdatedData(int)` | `rdcatch/rdcatch.cpp:227` |
| `eventPurged(int)` | `rdcatch::MainWidget` | `eventPurgedData(int)` | `rdcatch/rdcatch.cpp:230` |
| `deckEventSent(...)` | `rdcatch::MainWidget` | `deckEventSentData(...)` | `rdcatch/rdcatch.cpp:233` |
| `heartbeatFailed(int)` | `rdcatch::MainWidget` | `heartbeatFailedData(int)` | `rdcatch/rdcatch.cpp:236` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| TCP (QTcpSocket) | rdcatchd daemon | `connectHost()` / `SendCommand()` | Klient protokołu tekstowego rdcatchd; komendy kończą się `!` |
| Heartbeat timer | rdcatchd | `RH!` co CC_HEARTBEAT_INTERVAL ms | Watchdog — wykrywa zawieszenie rdcatchd |
| Serial ID | rdcatch (multi-station) | we wszystkich sygnałach | Identyfikator stacji — RDCatch obsługuje wiele stacji jednocześnie |
