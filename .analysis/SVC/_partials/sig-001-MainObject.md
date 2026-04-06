---
partial_id: 001
class_name: MainObject
artifact: SVC
phase: 4
status: done
---

# Call Graph: MainObject

## Sygnaly emitowane (klasa jako nadawca)
Brak — MainObject nie emituje zadnych wlasnych sygnalow.

## Polaczenia przychodzace (klasa jako odbiorca)
| Nadawca | Sygnal | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| svc_exit_timer (QTimer) | timeout() | exitData() | rdservice.cpp:123 |
| svc_maint_timer (QTimer) | timeout() | checkMaintData() | rdservice.cpp:139 |
| svc_processes[id] (RDProcess) | finished(int) | processFinishedData(int) | maint_routines.cpp:122 |

## Polaczenia wychodzace (klasa jako nadawca connect)
Brak — MainObject nie podlacza swoich sygnalow do innych obiektow (nie ma wlasnych sygnalow).

## Q_PROPERTY reactive bindings
Brak — MainObject nie ma Q_PROPERTY.

## Cross-artifact sygnaly
| Mechanizm | Cel | Sygnal/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| QProcess (via RDProcess) | caed, ripcd, rdcatchd, rdpadd, rdpadengined, rdvairplayd, rdrepld, rdrssd, rdimport | process start/terminate/kill | Zarzadzanie cyklem zycia procesow potomnych |
| Unix signals | rdservice (self) | SIGTERM/SIGINT/SIGUSR1 | Graceful shutdown i dropbox reload |
| SQL (table lock) | shared MySQL DB | LOCK TABLES VERSION WRITE | Koordynacja utrzymania miedzy hostami |
