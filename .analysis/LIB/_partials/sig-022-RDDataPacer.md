---
partial_id: 022
class_name: RDDataPacer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDDataPacer

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `dataSent(const QByteArray &data)` | `send(const QByteArray &data)` | Timer nieaktywny — natychmiastowe wysłanie | Dane wysłane bezpośrednio (kolejka pusta, brak oczekiwania) |
| `dataSent(const QByteArray &data)` | `timeoutData()` | Timeout timera AND kolejka niepusta | Dane wysłane z kolejki po upływie interwału tempa |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QTimer` (d_timer) | `timeout()` | `timeoutData()` | `lib/rddatapacer.cpp:30` (konstruktor) |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `dataSent(const QByteArray &)` | `Gvc7000` (w ripcd) | `sendCommandData(const QByteArray &)` | `ripcd/gvc7000.cpp:62` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| Wewnętrzna kolejka (QQueue) | — | `dataSent` → odbiorca wysyła przez TCP/TTY | Regulacja tempa wysyłania danych (np. komendy do urządzenia GVC7000) |

## Uwagi
Klasa implementuje rate limiting dla sekwencji komend do urządzeń (np. macierzy GVC7000). Buforuje dane w kolejce QQueue i emituje `dataSent` co `d_pace_interval` ms. Jeśli kolejka jest pusta, wysyła natychmiast i uruchamia timer blokujący.
