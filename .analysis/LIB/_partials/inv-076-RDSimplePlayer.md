---
partial_id: "076"
class: RDSimplePlayer
source: lib/rdsimpleplayer.h, lib/rdsimpleplayer.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDSimplePlayer

## Rola
Prosty widget do odtwarzania audio z kartów Rivendell. Udostępnia dwa przyciski transportowe (play/stop) i emituje sygnały o stanie odtwarzania. Działa jako minimalistyczny player dla podglądu pojedynczych cartów/cutów.

## Hierarchia
- **Dziedziczy z:** QWidget
- **Zawiera:** RDTransportButton (play, stop), RDEventPlayer, std::queue<int> (handles)

## Konstruktor
```
RDSimplePlayer(RDCae *cae, RDRipc *ripc, int card, int port,
               unsigned start_cart, unsigned end_cart, QWidget *parent=0)
```
Wymaga podania silnika audio (RDCae), połączenia RIPC, numeru karty/portu dźwiękowego oraz zakresu numerów cartów.

## Sygnały
| Sygnał | Opis |
|--------|------|
| `played()` | Emitowany gdy odtwarzanie się rozpoczęło |
| `stopped()` | Emitowany gdy odtwarzanie się zatrzymało |

## Sloty publiczne
| Slot | Opis |
|------|------|
| `play()` | Rozpoczyna odtwarzanie od początku |
| `play(int start_pos)` | Rozpoczyna odtwarzanie od podanej pozycji |
| `stop()` | Zatrzymuje odtwarzanie |

## Sloty prywatne
| Slot | Opis |
|------|------|
| `playingData(int handle)` | Reakcja na zdarzenie rozpoczęcia playback z CAE |
| `playStoppedData(int handle)` | Reakcja na zdarzenie zatrzymania playback z CAE |

## Metody publiczne
| Metoda | Opis |
|--------|------|
| `setCart(unsigned cart)` | Ustawia numer carta do odtworzenia |
| `setCart(QString cart)` | Ustawia numer carta (string) |
| `setCut(QString cart)` | Ustawia konkretny cut do odtworzenia |
| `isPlaying() -> bool` | Zwraca czy trwa odtwarzanie |
| `playButton() -> RDTransportButton*` | Zwraca wskaźnik do przycisku play |
| `stopButton() -> RDTransportButton*` | Zwraca wskaźnik do przycisku stop |

## Stan wewnętrzny
- `play_cart` / `play_cut` — aktualnie załadowany cart/cut
- `play_is_playing` — flaga stanu odtwarzania
- `play_handles` — kolejka uchwytów audio (std::queue<int>)
- `play_card`, `play_stream`, `play_port` — parametry sprzętowe audio

## Zależności
- **RDCae** — silnik audio (odtwarzanie)
- **RDRipc** — komunikacja z rdd (inter-process)
- **RDEventPlayer** — obsługa zdarzeń playback
- **RDTransportButton** — przyciski transportowe (play/stop)
