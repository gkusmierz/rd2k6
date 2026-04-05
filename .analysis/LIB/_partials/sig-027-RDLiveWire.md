---
partial_id: 027
class_name: RDLiveWire
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDLiveWire

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `connected(unsigned id)` | `ReadVersion()` | Pierwsze połączenie — `!live_connected` i parsowanie VER zakończone | Połączenie z węzłem LiveWire nawiązane; `id` = identyfikator węzła |
| `sourceChanged(unsigned id, RDLiveWireSource *src)` | `ReadSources()` | Odebrano komendę `SRC` z węzła | Konfiguracja źródła audio zmieniła się |
| `destinationChanged(unsigned id, RDLiveWireDestination *dst)` | `ReadDestinations()` | Odebrano komendę `DST` z węzła | Konfiguracja wejścia docelowego zmieniła się |
| `gpoConfigChanged(unsigned id, unsigned slot, unsigned chan)` | `ReadGpioConfig()` | Odebrano komendę `CFG GPO` — pole `SRCA` | Konfiguracja kanału GPO zmieniona (przypisanie źródła) |
| `gpiChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `gpiSet()` | Wywołanie gpiSet() — wymuszenie aktywacji GPI | GPI aktywowany przez kod lokalny (wysłanie komendy do węzła) |
| `gpiChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `gpiReset()` | Wywołanie gpiReset() — wymuszenie deaktywacji GPI | GPI dezaktywowany przez kod lokalny |
| `gpiChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `gpiTimeoutData(int id)` | Timeout timera GPI — auto-powrót stanu | GPI powrócił do poprzedniego stanu po upływie interwału |
| `gpiChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `ReadGpis()` | Odebrano komendę `GPI` z węzła (zmiana stanu `h`↔`l`) | Zmiana stanu wejścia GPI zgłoszona przez węzeł LiveWire |
| `gpoChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `gpoSet()` | Wywołanie gpoSet() | GPO aktywowany lokalnie |
| `gpoChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `gpoReset()` | Wywołanie gpoReset() | GPO dezaktywowany lokalnie |
| `gpoChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `gpoTimeoutData(int id)` | Timeout timera GPO — auto-powrót stanu | GPO powrócił do poprzedniego stanu po upływie interwału |
| `gpoChanged(unsigned id, unsigned slot, unsigned line, bool state)` | `ReadGpos()` | Odebrano komendę `GPO` z węzła (zmiana stanu `h`↔`l`) | Zmiana stanu wyjścia GPO zgłoszona przez węzeł LiveWire |
| `watchdogStateChanged(unsigned id, const QString &msg)` | `connectionClosedData()` | Połączenie TCP zamknięte przez węzeł | Utrata połączenia — watchdog zgłasza stan |
| `watchdogStateChanged(unsigned id, const QString &msg)` | `errorData()` | `ErrConnectionRefused` | Odmowa połączenia — watchdog zgłasza stan |
| `watchdogStateChanged(unsigned id, const QString &msg)` | `watchdogTimeoutData()` | Timeout odpowiedzi na heartbeat VER | Brak odpowiedzi watchdoga — połączenie utracone |
| `watchdogStateChanged(unsigned id, const QString &msg)` | `ReadVersion()` | `live_watchdog_state == true` po odtworzeniu | Połączenie odtworzone — watchdog zmienia stan na OK |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTcpSocket` (live_socket) | `connected()` | `connectedData()` | `lib/rdlivewire.cpp:98` (konstruktor) |
| `QTcpSocket` (live_socket) | `connectionClosed()` | `connectionClosedData()` | `lib/rdlivewire.cpp:99` (konstruktor) |
| `QTcpSocket` (live_socket) | `readyRead()` | `readyReadData()` | `lib/rdlivewire.cpp:101` (konstruktor) |
| `QTcpSocket` (live_socket) | `error(QAbstractSocket::SocketError)` | `errorData(QAbstractSocket::SocketError)` | `lib/rdlivewire.cpp:102` (konstruktor) |
| `QTimer` (live_watchdog_timer) | `timeout()` | `watchdogData()` | `lib/rdlivewire.cpp:109` (konstruktor) |
| `QTimer` (live_watchdog_timeout_timer) | `timeout()` | `watchdogTimeoutData()` | `lib/rdlivewire.cpp:112` (konstruktor) |
| `QTimer` (live_holdoff_timer) | `timeout()` | `holdoffData()` | `lib/rdlivewire.cpp:116` (konstruktor) |
| `QSignalMapper` (mapper GPI) | `mapped(int)` | `gpiTimeoutData(int)` | `lib/rdlivewire.cpp:624` (ReadVersion, tworzenie timerów GPI) |
| `QSignalMapper` (mapper GPO) | `mapped(int)` | `gpoTimeoutData(int)` | `lib/rdlivewire.cpp:648` (ReadVersion, tworzenie timerów GPO) |
| `QTimer` (live_gpi_timers[N]) | `timeout()` | `map()` (→ gpiTimeoutData) | `lib/rdlivewire.cpp:635` (via QSignalMapper) |
| `QTimer` (live_gpo_timers[N]) | `timeout()` | `map()` (→ gpoTimeoutData) | `lib/rdlivewire.cpp:659` (via QSignalMapper) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `connected(unsigned)` | `LwrpAudio` (ripcd) | `nodeConnectedData(unsigned)` | `ripcd/livewire_lwrpaudio.cpp:57` |
| `sourceChanged(unsigned, RDLiveWireSource *)` | `LwrpAudio` (ripcd) | `sourceChangedData(unsigned, RDLiveWireSource *)` | `ripcd/livewire_lwrpaudio.cpp:59` |
| `destinationChanged(unsigned, RDLiveWireDestination *)` | `LwrpAudio` (ripcd) | `destinationChangedData(unsigned, RDLiveWireDestination *)` | `ripcd/livewire_lwrpaudio.cpp:63` |
| `watchdogStateChanged(unsigned, const QString &)` | `LwrpAudio` (ripcd) | `watchdogStateChangedData(unsigned, const QString &)` | `ripcd/livewire_lwrpaudio.cpp:67` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| TCP (LWRP protocol) | Węzeł Axia LiveWire | `connectToHost()` / `SendCommand()` | Protokół LWRP (LiveWire Routing Protocol) — sterowanie routingiem audio IP i GPIO przez TCP |
| Komendy LWRP | Węzeł | VER, SRC, DST, GPI, GPO, CFG GPO, LOGIN, ADD GPI, ADD GPO | Wersja urządzenia, konfiguracja źródeł/celów, stan GPIO |
| Watchdog | TCP keepalive | `watchdogData()` → `SendCommand("VER")` | Heartbeat co `RDLIVEWIRE_WATCHDOG_INTERVAL` ms; timeout `RDLIVEWIRE_WATCHDOG_TIMEOUT` ms |
| Reconnect | Ponowne połączenie | `holdoffData()` → `ResetConnection()` | Automatyczny reconnect po utracie połączenia z opóźnieniem holdoff |

## Uwagi
Klasa implementuje pełny klient protokołu LWRP (Axia LiveWire Routing Protocol). Zarządza wieloma węzłami jednocześnie (każda instancja = jeden węzeł). Obsługuje dynamiczne tworzenie timerów GPI/GPO (per slot per line) podczas odbioru komendy VER. `loadSettings()` blokuje synchronicznie (do 5 sekund) przez `qApp->processEvents()`.
