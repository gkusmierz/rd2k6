---
partial_id: 035
class_name: RDUnixServer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDUnixServer

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `newConnection()` | `newConnectionData(int fd)` | gdy QSocketNotifier wykryje aktywność na serwerze | Nowe połączenie UNIX socket oczekuje na accept() |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `unix_notifier` (QSocketNotifier) | `activated(int)` | `newConnectionData(int)` | `rdunixserver.cpp:100` (listenToPathname) |
| `unix_notifier` (QSocketNotifier) | `activated(int)` | `newConnectionData(int)` | `rdunixserver.cpp:131` (listenToAbstract) |
| `unix_notifier` (QSocketNotifier) | `activated(int)` | `newConnectionData(int)` | `rdunixserver.cpp:183` (setSocketDescriptor) |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `newConnection()` | `ripcd` (MainObject) | `newConnectionData()` | `ripcd/ripcd.cpp:114` |
| `newConnection()` | `rdcatchd` (MainObject) | `newConnectionData()` | `rdcatchd/rdcatchd.cpp:238` |
| `newConnection()` | `cae` (CaeServer) | `newConnectionData()` | `cae/cae_server.cpp:62` |
| `newConnection()` | `rdpadd` (MainObject) | `newConnectionData()` (client) | `rdpadd/rdpadd.cpp:86` |
| `newConnection()` | `rdpadd` (MainObject) | `newConnectionData()` (source) | `rdpadd/rdpadd.cpp:106` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| UNIX domain socket (AF_UNIX) | ripcd / rdcatchd / rdcae / rdpadd | `newConnection()` | Serwer IPC — każdy demon Rivendell używa RDUnixServer jako lokalnego serwera połączeń |
| Abstract UNIX socket | rdpadd | `listenToAbstract()` | Gniazdo bez pliku na dysku (Linux abstract namespace) |
