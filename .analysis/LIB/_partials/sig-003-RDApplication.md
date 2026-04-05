---
partial_id: sig-003
class_name: RDApplication
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDApplication

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `userChanged()` | `userChangedData()` (~rdapplication.cpp:458) | Brak ticketu: użytkownik pobierany z `app_ripc->user()` | Aktualny użytkownik Rivendell zmienił się (propagacja z RDRipc::userChanged) |
| `userChanged()` | `userChangedData()` (~rdapplication.cpp:472) | Z ticketem: autoryzacja przez WEBAPI_AUTHS → `q->first()` | Użytkownik zautoryzowany przez WebAPI ticket zmienił się lub uaktualnił |

## Połączenia przychodzące (klasa jako odbiorca)

RDApplication jest odbiorcą sygnału `userChanged()` ze swojego wewnętrznego `app_ripc` (RDRipc).

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `RDRipc` (`app_ripc`) | `userChanged()` | `userChangedData()` | rdapplication.cpp:208 — metoda `open()` |

## Połączenia wychodzące (klasa jako nadawca connect)

RDApplication w metodzie `open()` ustanawia jedno połączenie przychodzące (siebie jako odbiorca):

| Sygnał (nadawca zewnętrzny) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|----------------------------|---------|--------------|------------------------------|
| `RDRipc::userChanged()` | `this` (RDApplication) | `userChangedData()` | rdapplication.cpp:208 |

## Połączenia zewnętrzne — kto podłącza się do sygnałów RDApplication

W lib/*.cpp nie znaleziono żadnych connect() do `rda` (globalnego singletona) z SIGNAL(userChanged).
Subskrybenci sygnału `RDApplication::userChanged()` znajdują się w aplikacjach (rdairplay, rdlibrary itp.) poza lib/.

Sygnał `userChanged()` RDApplication jest pośrednikiem: przepuszcza `RDRipc::userChanged` przez walidację ticketu WebAPI i dopiero wtedy rozgłasza go dalej.

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| Delegacja do `RDRipc` | `ripcd` daemon | `app_ripc->connectHost(...)` (wywoływane przez aplikację przez `rda->ripc()`) | RDApplication przechowuje i udostępnia instancję RDRipc; sama nie inicjuje połączenia TCP |
| Delegacja do `RDCae` | `caed` daemon | `app_cae->connectToServer(...)` (wywoływane przez aplikację przez `rda->cae()`) | Analogicznie — RDApplication jest kontenerem dla RDCae |
| SQL (MySQL) | Baza Rivendell | `userChangedData()` — zapytanie `WEBAPI_AUTHS` | W trybie WebAPI ticket weryfikacja użytkownika w bazie zamiast przez ripcd |
| `syslog` | systemd/rsyslog | `syslog(int priority, const char *fmt, ...)` | Logowanie aplikacji z konfiguracją facility z RDConfig |

## Rola architektoniczna

RDApplication jest globalnym singletonem (`extern RDApplication *rda;`) dostępnym w całym procesie.
Agreguje wszystkie zasoby współdzielone: `RDCae`, `RDRipc`, `RDStation`, `RDUser`, `RDConfig` i konfiguracje modułów.
Jedyna emitowana sygnał (`userChanged`) stanowi centralny punkt powiadamiania aplikacji o zmianie kontekstu użytkownika,
niezależnie od źródła zmiany (ripcd lub WebAPI).
