# inv-037 — RDMulticaster

PARTIAL_ID: 037
Status: done
Agent: PHASE-2-inventory-subagent (networking batch)

---

## Klasa: RDMulticaster

**Plik:** `lib/rdmulticaster.h`, `lib/rdmulticaster.cpp`
**Dziedziczenie:** `QObject` (bezposrednie)
**Rola:** Multi-interfejsowy transceiver multicast UDP. Umozliwia wysylanie i odbieranie wiadomosci multicast na wszystkich interfejsach sieciowych maszyny (z wylaczeniem loopback).

### Konstruktor

| Sygnatura | Opis |
|-----------|------|
| `RDMulticaster(QObject *parent=0)` | Tworzy Q3SocketDevice (Datagram), QSocketNotifier, wykrywa wszystkie interfejsy sieciowe |

### Metody publiczne

| Metoda | Zwraca | Opis |
|--------|--------|------|
| `bind(port)` | `bool` | Binduje socket na 0.0.0.0:port (wszystkie interfejsy) |
| `enableLoopback(state)` | `void` | Wlacza/wylacza loopback multicast (IP_MULTICAST_LOOP) |
| `subscribe(addr)` | `void` | Dolacza do grupy multicast na WSZYSTKICH wykrytych interfejsach (IP_ADD_MEMBERSHIP) |
| `unsubscribe(addr)` | `void` | Opuszcza grupe multicast na wszystkich interfejsach (IP_DROP_MEMBERSHIP) |

### Signals

| Signal | Parametry | Opis |
|--------|-----------|------|
| `received` | `const QString &msg, const QHostAddress &src_addr` | Odebrano wiadomosc multicast — tresc i adres nadawcy |

### Public Slots

| Slot | Parametry | Opis |
|------|-----------|------|
| `send` | `const QString &msg, const QHostAddress &m_addr, uint16_t port` | Wysyla wiadomosc multicast UDP |

### Private Slots

| Slot | Opis |
|------|------|
| `activatedData(int sock)` | Odbiera dane z socketu (recvfrom z MSG_DONTWAIT), emituje received() dla kazdego pakietu |

### Metody prywatne

| Metoda | Opis |
|--------|------|
| `GetInterfaces()` | Wykrywa wszystkie interfejsy sieciowe (SIOCGIFNAME/SIOCGIFADDR), pomija loopback (127.x.x.x) |

### Wzorzec behawioralny

RDMulticaster to **multi-interface multicast transceiver**:

1. **Autodetekcja interfejsow** — przy starcie skanuje wszystkie interfejsy sieciowe, pomija loopback
2. **Subscribe na wszystkich interfejsach** — IP_ADD_MEMBERSHIP wykonywane per-interfejs, gwarantuje odbiór multicast niezaleznie od konfiguracji routingu
3. **Non-blocking receive** — MSG_DONTWAIT, petla recvfrom az do wyczerpania danych
4. **Sygnalowy API** — send/received jako slots/signals, integracja z Qt event loop

Bufor odbioru: 1500 bajtow (typowy MTU Ethernet).

### Pola prywatne

| Pole | Typ | Opis |
|------|-----|------|
| `multi_socket` | `Q3SocketDevice*` | Socket UDP (Q3SocketDevice::Datagram) |
| `multi_notifier` | `QSocketNotifier*` | Notifier odczytu na sockecie |
| `multi_iface_addresses` | `vector<QHostAddress>` | Wykryte adresy interfejsow (bez loopback) |

### Platformowe (Linux-specific)

- Wymaga `<sys/ioctl.h>`, `<netinet/in.h>`, `<netinet/ip.h>`, `<net/if.h>`
- Uzywa: `ioctl(SIOCGIFNAME/SIOCGIFADDR)`, `setsockopt(IP_ADD_MEMBERSHIP/IP_DROP_MEMBERSHIP/IP_MULTICAST_LOOP)`, `recvfrom(MSG_DONTWAIT)`
- `ip_mreqn` — Linux-specific struktura multicast membership
- **Wylacznie Linux** — API enumeracji interfejsow i multicast sa Linux-specific
- Uzywa przestarzalego `Q3SocketDevice` (Qt3 compatibility)
