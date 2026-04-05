---
partial_id: 003
artifact: CAE
class_name: CaeServerConnection
header_file: cae/cae_server.h
source_file: cae/cae_server.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# CaeServerConnection

## Typ Qt
plain C++ (brak dziedziczenia z QObject) -- value object / connection state

## Odpowiedzialnosc (WHAT)
Value object przechowujacy stan jednego polaczenia TCP z klientem. Zawiera socket, flage autentykacji, akumulator parsowania komend, port UDP do metrow i tablice flag metrowania per karta audio.

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| Brak | --- | Nie jest QObject, nie ma sygnalow |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| Brak | --- | --- | Nie jest QObject, nie ma slotow |

## Stan (Q_PROPERTY)
| Property | Typ | Getter | Setter | Notify signal |
|----------|-----|--------|--------|---------------|
| Brak | --- | --- | --- | Nie jest QObject |

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| CaeServerConnection (konstruktor) | QTcpSocket *sock | Inicjalizuje stan: socket=sock, authenticated=false, accum="", meter_port=0, meters_enabled[]=false | Socket musi byc aktywny |
| ~CaeServerConnection | - | Niszczy socket (deleteLater) | --- |

## Pola publiczne (data members)
| Pole | Typ | Znaczenie |
|------|-----|-----------|
| socket | QTcpSocket* | Aktywne polaczenie TCP z klientem |
| authenticated | bool | Czy klient przeszedl autentykacje (komenda PW) |
| accum | QString | Akumulator znakow do parsowania komend (do znaku '!') |
| meter_port | uint16_t | Port UDP na ktory wysylac aktualizacje metrow (0 = wylaczony) |
| meters_enabled | bool[RD_MAX_CARDS] | Flaga metrowania per karta -- true jesli klient chce metry z tej karty |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak | --- | --- |

## Reguly biznesowe (z implementacji)
- Regula: Nowe polaczenie jest domyslnie nieautentykowane (authenticated=false). Klient musi wyslac komende PW z poprawnym haslem.
  Zrodlo: konstruktor
- Regula: Metering jest domyslnie wylaczony na wszystkich kartach (meters_enabled[i]=false). Klient musi jawnie go wlaczyc komenda ME.
  Zrodlo: konstruktor
- Regula: Socket jest zarzadzany przez Qt ownership -- deleteLater() w destruktorze zapobiega kasowaniu w trakcie przetwarzania sygnalow.
  Zrodlo: destruktor

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Brak | --- | --- |

## Zaleznosci od innych klas tego artifaktu
- Brak -- jest uzywana przez CaeServer

## Zaleznosci od shared libraries
- Brak bezposrednich (RD_MAX_CARDS to stala z rd.h)
