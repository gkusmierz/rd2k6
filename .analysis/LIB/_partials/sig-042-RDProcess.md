---
partial_id: 042
class_name: RDProcess
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDProcess

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `started(int id)` | `startedData()` | Po uruchomieniu procesu (po odebraniu `QProcess::started()`) | Proces potomny wystartował — rozgłasza własny `p_id` |
| `finished(int id)` | `finishedData(int exit_code, QProcess::ExitStatus status)` | Po zakończeniu procesu (crash lub normalny exit) | Proces potomny zakończył się — rozgłasza `p_id`; `errorText()` zawiera diagnostykę |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QProcess* p_process` (wewnętrzny) | `started()` | `startedData()` | `lib/rdprocess.cpp:31` (konstruktor) |
| `QProcess* p_process` (wewnętrzny) | `finished(int, QProcess::ExitStatus)` | `finishedData(int, QProcess::ExitStatus)` | `lib/rdprocess.cpp:32` (konstruktor) |
| `QProcess* p_process` (wewnętrzny) | `readyReadStandardError()` | `readyReadStandardErrorData()` | `lib/rdprocess.cpp:34` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `finished(int)` | `rdservice/MainObject` (`svc_processes[id]`) | `processFinishedData(int)` | `rdservice/maint_routines.cpp:122` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — klasa zarządza procesami OS lokalnie; używana przez rdservice i rdpadengined do uruchamiania demonów Rivendell)
