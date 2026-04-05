---
partial_id: 062
class_name: RDCddbLookup
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDCddbLookup

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `lookupDone(RDDiscLookup::Result, const QString &)` | **odziedziczony** — emitowany przez `processLookup()` (klasa bazowa `RDDiscLookup`) | Wywoływany przez `FinishCddbLookup()` po odebraniu odpowiedzi z serwera CDDB lub błędzie sieci | Zakończenie zapytania CDDB z wynikiem ExactMatch / NoMatch / LookupError |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `lookup_socket` (QTcpSocket) | `readyRead()` | `readyReadData()` | `lib/rdcddblookup.cpp:48` |
| `lookup_socket` (QTcpSocket) | `error(QAbstractSocket::SocketError)` | `errorData(QAbstractSocket::SocketError)` | `lib/rdcddblookup.cpp:49-50` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `lookupDone(...)` (dziedziczony) | `DiskRipper` | `lookupDoneData(...)` | `rdlibrary/disk_ripper.cpp:86-88` (przez fabrykę) |
| `lookupDone(...)` (dziedziczony) | `CdRipper` | `lookupDoneData(...)` | `rdlibrary/cdripper.cpp:89-90` (przez fabrykę) |

## Łańcuch wywołań wewnętrznych

```
QTcpSocket::readyRead → readyReadData() →
    [parse CDDB protocol states 0..7] →
    FinishCddbLookup(result, msg) →
        processLookup(result, msg) [base class] →
            emit lookupDone(result, msg)
```

```
QTcpSocket::error → errorData() →
    FinishCddbLookup(LookupError, "Network error") →
        processLookup(...) → emit lookupDone(...)
```

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| TCP socket (QTcpSocket) | Serwer CDDB (FreeDB) — port 888 | `SendToServer()` / `readyReadData()` | Dwukierunkowa wymiana protokołu CDDB przez sieć |
