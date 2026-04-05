---
partial_id: "005"
artifact: HPI
class_name: RDHPISoundSelector
header_file: rdhpi/rdhpisoundselector.h
source_file: rdhpi/rdhpisoundselector.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHPISoundSelector

## Typ Qt
Widget (Q3ListBox -- Qt3Support legacy widget)

## Odpowiedzialnosc (WHAT)
Widget UI umozliwiajacy uzytkownikowi wybor urzadzenia audio (karty dzwiekowej i portu). Wyswietla liste portow wejsciowych lub wyjsciowych (w zaleznosci od DeviceClass) wszystkich wykrytych kart HPI. Po wybraniu elementu emituje sygnaly z numerem karty i portu.

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| changed(int card, int port) | card, port | Uzytkownik wybral urzadzenie audio -- emituje numer karty i numer portu |
| cardChanged(int card) | card | Zmiana wybranej karty dzwiekowej |
| portChanged(int port) | port | Zmiana wybranego portu na karcie |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| selection(int selection) | selection | private | Obsluguje wybor elementu z listy; dekoduje indeks na (card, port) i emituje sygnaly changed/cardChanged/portChanged |

## Stan (Q_PROPERTY)
Brak.

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| (konstruktor) | DeviceClass dev_class, RDConfig *config, QWidget *parent | Tworzy widget, wykrywa karty HPI, populuje liste portami wejsciowymi (RecordDevice) lub wyjsciowymi (PlayDevice) | - |

## Stany i kategorie (enums)
Brak wlasnych (uzywa RDHPISoundCard::DeviceClass).

## Reguly biznesowe (z implementacji)
- Regula: Indeks elementu listy koduje karte i port jako: card * HPI_MAX_NODES + port.
- Zrodlo: konstruktor
- Regula: Dekodowanie indeksu na karte/port uzywa HPI_MAX_ADAPTERS (nie HPI_MAX_NODES): card = selection / HPI_MAX_ADAPTERS, port = selection % HPI_MAX_ADAPTERS. UWAGA: to jest prawdopodobny bug -- kodowanie uzywa HPI_MAX_NODES ale dekodowanie uzywa HPI_MAX_ADAPTERS.
- Zrodlo: selection()
- Regula: Widget tworzy wlasna instancje RDHPISoundCard w konstruktorze (nie wspoldzieli z reszta systemu).
- Zrodlo: konstruktor

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Q3ListBox (Qt3Support) | Widget listy -- wymaga migracji na QListWidget | HIGH |
| asihpi/hpi.h (posrednio przez RDHPISoundCard) | Wykrywanie kart dzwiekowych | CRITICAL |
| Warunkowe #ifdef ALSA / #ifdef JACK | Naglowki ALSA/JACK (wlaczone ale nieuzywane w tym pliku) | LOW |

## Zaleznosci od innych klas tego artifaktu
- RDHPISoundCard: tworzona lokalnie w konstruktorze; uzywana do enumeracji kart i portow

## Zaleznosci od shared libraries
- librd::RDConfig: przekazywany do RDHPISoundCard
