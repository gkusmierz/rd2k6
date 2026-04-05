---
partial_id: 57
class_name: RDTransportButton
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDTransportButton

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `clicked()` (dziedziczony z QPushButton) | `mousePressEvent()` (QPushButton) | Standardowe kliknięcie LPM | Przycisk transportu kliknięty |

Uwaga: RDTransportButton dziedziczy z QPushButton i nie dodaje własnych sygnałów. Emituje wyłącznie `clicked()` z klasy bazowej.

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `flash_timer` (QTimer, wewnętrzny) | `timeout()` | `flashClock()` | `lib/rdtransportbutton.cpp:47` |

## Połączenia wychodzące (klasa jako nadawca connect)

Sygnał `clicked()` jest podłączany przez konsumentów:

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `clicked()` | `dg_player` | `eject()` | `utils/rddiscimport/rddiscimport.cpp:250` |
| `clicked()` | rdlibrary/disk_ripper | `ejectButtonData()` | `rdlibrary/disk_ripper.cpp:204` |
| `clicked()` | rdlibrary/disk_ripper | `playButtonData()` | `rdlibrary/disk_ripper.cpp:210` |
| `clicked()` | rdlibrary/cdripper | `ejectButtonData()` | `rdlibrary/cdripper.cpp:205` |
| `clicked()` | rdlibrary/cdripper | `playButtonData()` | `rdlibrary/cdripper.cpp:211` |
| `clicked()` | lib/rdcueedit | `auditionButtonData()` | `lib/rdcueedit.cpp:104` |
| `clicked()` | lib/rdcueedit | `pauseButtonData()` | `lib/rdcueedit.cpp:117` |
| `clicked()` | lib/rdcueedit | `stopButtonData()` | `lib/rdcueedit.cpp:130` |

## Typy przycisków (TransType enum)

Play, Stop, Record, FastForward, Rewind, Eject, Pause, PlayFrom, PlayBetween, Loop, Up, Down, PlayTo

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
