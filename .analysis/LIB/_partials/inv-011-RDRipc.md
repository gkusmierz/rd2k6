# inv-011 — RDRipc

## Identyfikacja

| Pole | Wartość |
|------|---------|
| Klasa | `RDRipc` |
| Plik nagłówkowy | `lib/rdripc.h` |
| Plik źródłowy | `lib/rdripc.cpp` |
| Bazowa klasa | `QObject` |
| Rola | Klient IPC — komunikacja z demonem `ripcd` przez TCP socket |

## Opis

RDRipc jest klientem protokołu tekstowego do komunikacji z daemonem `ripcd` (Rivendell Inter-Process Communication Daemon). Zapewnia dwukierunkową wymianę komunikatów: wysyła komendy (request GPI/GPO status, zmiana użytkownika, wysyłanie makr RML, notyfikacji, flagi on-air) i odbiera odpowiedzi/zdarzenia, które konwertuje na sygnały Qt.

Protokół jest tekstowy, oparty na jednoliterowych lub dwuliterowych komendach rozdzielanych spacjami, terminowanych znakiem `!`. Komunikacja odbywa się przez `QTcpSocket`.

## Zależności

- `RDStation` — informacja o stacji (nazwa), przekazywana w konstruktorze
- `RDConfig` — konfiguracja systemowa, przekazywana w konstruktorze
- `RDMacro` — reprezentacja makr RML (Rivendell Macro Language)
- `RDNotification` — reprezentacja notyfikacji systemowych (typ, akcja, id)
- `RDSqlQuery` / `rddb.h` — odczyt zmiennych hostowych z tabeli HOSTVARS (przy wysyłaniu RML)
- `RDEscapeString` — escapowanie stringów SQL
- `RDDateTimeDecode` — rozwijanie tokenów daty/czasu w makrach RML
- `RDApplication` (via `rda->syslog()`) — logowanie systemowe

## Protokół tekstowy (komendy)

### Wysyłane do ripcd (klient -> serwer)

| Komenda | Format | Znaczenie |
|---------|--------|-----------|
| `PW` | `PW <password>!` | Uwierzytelnienie po nawiązaniu połączenia |
| `RU!` | `RU!` | Żądanie tożsamości bieżącego użytkownika |
| `SU` | `SU <username>!` | Zmiana bieżącego użytkownika |
| `GI` | `GI <matrix>!` | Żądanie statusu GPI (General Purpose Input) |
| `GO` | `GO <matrix>!` | Żądanie statusu GPO (General Purpose Output) |
| `GM` | `GM <matrix>!` | Żądanie maski GPI |
| `GN` | `GN <matrix>!` | Żądanie maski GPO |
| `GC` | `GC <matrix>!` | Żądanie cart assignment GPI |
| `GD` | `GD <matrix>!` | Żądanie cart assignment GPO |
| `MS` | `MS <addr> <port> <rml>` | Wysłanie makra RML (Cmd) |
| `ME` | `ME <addr> <port> <rml>` | Wysłanie makra RML (Reply/echo) |
| `ON` | `ON <notification>!` | Wysłanie notyfikacji |
| `TA` | `TA <0\|1>!` | Wysłanie flagi on-air |
| `RH!` | `RH!` | Reload heartbeat |

### Odbierane od ripcd (serwer -> klient)

| Komenda | Parametry | Emitowany sygnał |
|---------|-----------|------------------|
| `PW` | (brak dodatkowych) | Odpowiedź na auth — wyzwala wysłanie `RU!` |
| `RU` | `<username>` | `connected(true)` (pierwsze połączenie) + `userChanged()` |
| `MS` | `<addr> <echo> <rml...>` | `rmlReceived(RDMacro*)` z role=Cmd |
| `ME` | `<addr> <echo_ignored> <rml...>` | `rmlReceived(RDMacro*)` z role=Reply |
| `GI` | `<matrix> <line> <state> <mask>` | `gpiStateChanged(matrix, line, bool)` — filtrowane maską |
| `GO` | `<matrix> <line> <state> <mask>` | `gpoStateChanged(matrix, line, bool)` — filtrowane maską |
| `GM` | `<matrix> <line> <state>` | `gpiMaskChanged(matrix, line, bool)` |
| `GN` | `<matrix> <line> <state>` | `gpoMaskChanged(matrix, line, bool)` |
| `GC` | `<matrix> <line> <off_cart> <on_cart>` | `gpiCartChanged(matrix, line, off_cartnum, on_cartnum)` |
| `GD` | `<matrix> <line> <off_cart> <on_cart>` | `gpoCartChanged(matrix, line, off_cartnum, on_cartnum)` |
| `TA` | `<0\|1>` | `onairFlagChanged(bool)` — aktualizuje też wewnętrzny stan |
| `ON` | `<notification_data...>` | `notificationReceived(RDNotification*)` |

## Sygnały

| Sygnał | Parametry | Kiedy emitowany |
|--------|-----------|-----------------|
| `connected(bool)` | state | Gdy po raz pierwszy otrzymano odpowiedź RU z nazwą użytkownika |
| `userChanged()` | (brak) | Gdy serwer raportuje zmianę użytkownika (inna nazwa niż dotychczasowa) |
| `gpiStateChanged(int,int,bool)` | matrix, line, state | Zmiana stanu wejścia GPI (z uwzględnieniem maski) |
| `gpoStateChanged(int,int,bool)` | matrix, line, state | Zmiana stanu wyjścia GPO (z uwzględnieniem maski) |
| `gpiMaskChanged(int,int,bool)` | matrix, line, state | Zmiana maski GPI |
| `gpoMaskChanged(int,int,bool)` | matrix, line, state | Zmiana maski GPO |
| `gpiCartChanged(int,int,int,int)` | matrix, line, off_cartnum, on_cartnum | Zmiana przypisania cartów do GPI |
| `gpoCartChanged(int,int,int,int)` | matrix, line, off_cartnum, on_cartnum | Zmiana przypisania cartów do GPO |
| `notificationReceived(RDNotification*)` | notify | Otrzymano notyfikację systemową od ripcd |
| `onairFlagChanged(bool)` | state | Zmiana flagi "on air" |
| `rmlReceived(RDMacro*)` | rml | Otrzymano makro RML (Cmd lub Reply) |

## Sloty (prywatne)

| Slot | Wyzwalacz | Zachowanie |
|------|-----------|------------|
| `connectedData()` | `QTcpSocket::connected` | Inicjuje handshake — wysyła komendę PW z hasłem |
| `errorData(QAbstractSocket::SocketError)` | `QTcpSocket::error` | Loguje błąd socketa do sysloga (LOG_DEBUG) |
| `readyData()` | `QTcpSocket::readyRead` | Czyta dane z socketa, akumuluje w buforze, rozpoznaje terminator `!` i wywołuje DispatchCommand |

## Kluczowe zachowania

### Cykl życia połączenia
1. Konstruktor tworzy `QTcpSocket` i podpina sloty
2. `connectHost(hostname, port, password)` inicjuje połączenie TCP i zapamiętuje hasło
3. Po nawiązaniu połączenia TCP automatycznie wysyła `PW <password>!`
4. Serwer odpowiada `PW` -> klient wysyła `RU!` (żądanie użytkownika)
5. Serwer odpowiada `RU <username>` -> emituje `connected(true)` i `userChanged()`

### Filtrowanie GPI/GPO maską
Zdarzenia GPI/GPO (komendy `GI`, `GO`) zawierają pole `mask`. Sygnał jest emitowany tylko gdy maska > 0 LUB gdy `ripc_ignore_mask` jest ustawiony na true. Pozwala to filtrować nieistotne zdarzenia GPIO.

### Wysyłanie makr RML (sendRml)
Przed wysłaniem makra RML:
1. Pobiera zmienne hostowe z tabeli `HOSTVARS` (WHERE STATION_NAME = nazwa stacji)
2. Zastępuje zmienne w treści makra ich wartościami
3. Rozszerza tokeny daty/czasu (`RDDateTimeDecode`)
4. Formatuje komendę jako `MS` (Cmd) lub `ME` (Reply) w zależności od roli makra
5. Dołącza adres IP i port (echo/no-echo) do komendy

### Parsowanie protokołu (readyData + DispatchCommand)
Dane z socketa są akumulowane znak po znaku. Znak `!` działa jako terminator komendy — wywołuje `DispatchCommand()` i resetuje bufor. Znaki `\r` i `\n` są ignorowane. Komendy są parsowane przez split po spacjach.

## SQL

| Tabela | Operacja | Kontekst |
|--------|----------|----------|
| `HOSTVARS` | SELECT (NAME, VARVALUE) | `sendRml()` — pobiera zmienne hostowe dla bieżącej stacji do substytucji w treści makra RML |

## Pola wewnętrzne

| Pole | Typ | Opis |
|------|-----|------|
| `ripc_socket` | `QTcpSocket*` | Socket TCP do komunikacji z ripcd |
| `ripc_user` | `QString` | Bieżąca nazwa użytkownika (z odpowiedzi RU) |
| `ripc_password` | `QString` | Hasło do uwierzytelnienia z ripcd |
| `ripc_station` | `RDStation*` | Obiekt stacji (nazwa, konfiguracja) |
| `ripc_config` | `RDConfig*` | Konfiguracja systemowa Rivendell |
| `ripc_onair_flag` | `bool` | Bieżący stan flagi "on air" |
| `ripc_ignore_mask` | `bool` | Gdy true, GPI/GPO zdarzenia nie są filtrowane maską |
| `ripc_accum` | `QString` | Bufor akumulujący dane z socketa do momentu terminatora `!` |
| `ripc_connected` | `bool` | Flaga — czy połączenie zostało w pełni nawiązane (po pierwszym RU) |
| `debug` | `bool` | Flaga debug (inicjalizowana na false, nie wykorzystywana aktywnie) |

## Specyfika platformowa

- Używa `syslog.h` (Linux) do logowania via `rda->syslog(LOG_DEBUG, ...)`
- Bufor odczytu socketa: 1500 bajtów (stały rozmiar)
