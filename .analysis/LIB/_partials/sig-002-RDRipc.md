---
partial_id: sig-002
class_name: RDRipc
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDRipc

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `connected(bool state)` | `DispatchCommand()` (~rdripc.cpp:266) | RU response + `!ripc_connected` (pierwsza identyfikacja użytkownika) | Połączenie z ripcd ustanowione i uwierzytelnione; emitowany raz przy pierwszym logowaniu |
| `userChanged()` | `DispatchCommand()` (~rdripc.cpp:268) | RU response: użytkownik inny niż poprzedni | Aktualny użytkownik Rivendell na tej stacji zmienił się |
| `rmlReceived(RDMacro *rml)` | `DispatchCommand()` (~rdripc.cpp:289,307) | MS (Cmd) lub ME (Reply) — prawidłowe RML | Odebrano polecenie makro RML — do wykonania lub odpowiedź na makro |
| `gpiStateChanged(int matrix, int line, bool state)` | `DispatchCommand()` (~rdripc.cpp:321,324) | GI response: `mask>0` lub `ignore_mask==true` | Stan linii GPI zmienił się (0=low, 1=high); filtrowany przez maskę |
| `gpoStateChanged(int matrix, int line, bool state)` | `DispatchCommand()` (~rdripc.cpp:338,341) | GO response: `mask>0` lub `ignore_mask==true` | Stan linii GPO zmienił się |
| `gpiMaskChanged(int matrix, int line, bool state)` | `DispatchCommand()` (~rdripc.cpp:353,356) | GM response | Maska GPI zmieniona (linia włączona/wyłączona z obsługi) |
| `gpoMaskChanged(int matrix, int line, bool state)` | `DispatchCommand()` (~rdripc.cpp:367,370) | GN response | Maska GPO zmieniona |
| `gpiCartChanged(int matrix, int line, int off_cartnum, int on_cartnum)` | `DispatchCommand()` (~rdripc.cpp:382) | GC response | Kart skojarzony z linią GPI zmienił się (osobno dla stanu ON i OFF) |
| `gpoCartChanged(int matrix, int line, int off_cartnum, int on_cartnum)` | `DispatchCommand()` (~rdripc.cpp:393) | GD response | Kart skojarzony z linią GPO zmienił się |
| `onairFlagChanged(bool state)` | `DispatchCommand()` (~rdripc.cpp:401) | TA response: zmieniona flaga on-air | Stan flagi "on air" stacji zmienił się |
| `notificationReceived(RDNotification *notify)` | `DispatchCommand()` (~rdripc.cpp:418) | ON response: poprawna notyfikacja | Odebrano notyfikację systemową (np. zmiana kartu, logu, użytkownika) |

## Połączenia przychodzące (klasa jako odbiorca)

RDRipc łączy wewnętrznie swoje private sloty z sygnałami `QTcpSocket` (w konstruktorze, rdripc.cpp:50-53):

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTcpSocket` (wewnętrzny) | `connected()` | `connectedData()` | rdripc.cpp:50 — konstruktor |
| `QTcpSocket` (wewnętrzny) | `error(QAbstractSocket::SocketError)` | `errorData(QAbstractSocket::SocketError)` | rdripc.cpp:51 — konstruktor |
| `QTcpSocket` (wewnętrzny) | `readyRead()` | `readyData()` | rdripc.cpp:53 — konstruktor |

## Połączenia wychodzące (klasa jako nadawca connect)

RDRipc sam ustanawia connect() wyłącznie do swoich własnych prywatnych slotów (patrz wyżej).
Żadnych connect() z zewnętrznym obiektem jako źródłem sygnału.

| Sygnał (nadawca) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-----------------|---------|--------------|------------------------------|
| `QTcpSocket::connected()` | `this` (RDRipc) | `connectedData()` | rdripc.cpp:50 |
| `QTcpSocket::error(...)` | `this` (RDRipc) | `errorData(...)` | rdripc.cpp:51 |
| `QTcpSocket::readyRead()` | `this` (RDRipc) | `readyData()` | rdripc.cpp:53 |

## Połączenia zewnętrzne — kto podłącza się do sygnałów RDRipc

| Subscriber (klasa) | Sygnał RDRipc | Slot subskrybenta | Lokalizacja connect() |
|-------------------|--------------|------------------|----------------------|
| `RDApplication` | `userChanged()` | `userChangedData()` | rdapplication.cpp:208 — metoda `open()` |
| `RDSoundPanel` | `onairFlagChanged(bool)` | `onairFlagChangedData(bool)` | rdsound_panel.cpp:196 |
| `RDLogPlay` | `onairFlagChanged(bool)` | `onairFlagChangedData(bool)` | rdlogplay.cpp:126 |
| `RDLogPlay` | `notificationReceived(RDNotification*)` | `notificationReceivedData(RDNotification*)` | rdlogplay.cpp:128 |

**Nota:** `rmlReceived`, `gpiStateChanged`, `gpoStateChanged`, `gpiMaskChanged`, `gpoMaskChanged`, `gpiCartChanged`, `gpoCartChanged`, `connected` — w lib/*.cpp nie znaleziono connect() do tych sygnałów; subskrybenci znajdują się w aplikacjach (rdairplay, rdcatch itp.) poza katalogiem lib/.

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| TCP socket (`QTcpSocket`) | `ripcd` daemon (RPC/IPC daemon) | `connectHost(hostname, hostport, password)` | Nawiązanie połączenia z ripcd; autentykacja przez PW, potem RU dla identyfikacji użytkownika |
| Protokół tekstowy `!`-terminated | `ripcd` | `SendCommand(const QString &cmd)` | Wysyłka poleceń: SU (zmiana użytkownika), GI/GO/GM/GN/GC/GD (GPI/GPO), MS/ME (RML), ON (notification), TA (on-air flag), RH (reload heartbeat) |
| Odczyt asynchroniczny | `ripcd` | `readyData()` → `DispatchCommand()` | Parsowanie odpowiedzi: PW/RU/MS/ME/GI/GO/GM/GN/GC/GD/TA/ON → emit sygnałów Qt |
| Protokół RML (UDP pośrednio) | Inne stacje (przez ripcd) | `sendRml(RDMacro*)` | RML wysyłany przez ripcd do docelowej stacji/portu; ripcd obsługuje UDP |
