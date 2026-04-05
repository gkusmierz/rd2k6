---
partial_id: 028
class_name: RDMulticaster
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDMulticaster

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `received(const QString &msg, const QHostAddress &src_addr)` | `activatedData(int sock)` | `recvfrom()` zwraca dane (UDP socket gotowy do odczytu) | Odebrano wiadomość UDP multicast; `msg` = treść, `src_addr` = adres nadawcy |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QSocketNotifier` (multi_notifier) | `activated(int)` | `activatedData(int)` | `lib/rdmulticaster.cpp:36` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `received(const QString &, const QHostAddress &)` | `Ripcd` (ripcd daemon) | `notificationReceivedData(const QString &, const QHostAddress &)` (lub podobny) | `ripcd/ripcd.cpp:178` |
| `received(const QString &, const QHostAddress &)` | `McastRecvTest` | `receivedData(const QString &, const QHostAddress &)` | `tests/mcast_recv_test.cpp:79` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| UDP Multicast (IP_ADD_MEMBERSHIP / IP_DROP_MEMBERSHIP) | Sieć lokalna | `subscribe()` / `unsubscribe()` | Dołączenie/opuszczenie grupy multicast na wszystkich interfejsach sieciowych |
| UDP wysyłanie | Sieć multicast | `send(msg, addr, port)` | Wysłanie wiadomości na adres multicast i port; używane przez ripcd do powiadomień systemowych |
| Q3SocketDevice (raw UDP) | Kernel networking | `recvfrom()` + `QSocketNotifier` | Asynchroniczny odbiór pakietów UDP przez notyfikację Qt |

## Uwagi
Używa niskopoziomowego `Q3SocketDevice` (nie `QUdpSocket`) dla pełnej kontroli nad opcjami gniazda multicast. Automatycznie wykrywa wszystkie interfejsy sieciowe przez `GetInterfaces()` i subskrybuje grupę multicast na każdym z nich. Loopback domyślnie włączony (wyłączany przez `enableLoopback(false)` w ripcd).
