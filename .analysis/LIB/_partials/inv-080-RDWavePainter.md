---
partial_id: "080"
class: RDWavePainter
source: lib/rdwavepainter.h, lib/rdwavepainter.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDWavePainter

## Rola
Klasa rysująca waveformy audio na dowolnym QPaintDevice. Nie jest widgetem — dziedziczy z QPainter. Odpowiada za pobranie danych peak z serwera i renderowanie ich jako wizualizacji fali dźwiękowej. Używana przez RDCueEdit i inne widgety potrzebujące wyświetlić kształt fali.

## Hierarchia
- **Dziedziczy z:** QPainter (nie jest QWidget, nie ma Q_OBJECT)
- **Zawiera:** RDPeaksExport, RDCut*, RDStation*, RDUser*, RDConfig*

## Konstruktory
```
RDWavePainter(QPaintDevice *pd, RDCut *cut, RDStation *station,
              RDUser *user, RDConfig *config)
```
Inicjalizuje painter z urządzeniem docelowym i od razu ładuje dane wave.

```
RDWavePainter(RDStation *station, RDUser *user, RDConfig *config)
```
Inicjalizacja bez urządzenia — do późniejszego użycia z `begin()`.

## Enum
| Enum | Wartości | Opis |
|------|----------|------|
| `Channel` | Mono=0, Left=1, Right=2 | Kanał audio do rysowania |

## Metody publiczne
| Metoda | Opis |
|--------|------|
| `nameWave(RDCut *cut)` | Ustawia cut jako źródło danych wave |
| `begin(QPaintDevice *pd, RDCut *cut) -> bool` | Rozpoczyna rysowanie na urządzeniu z nowym cutem |
| `begin(QPaintDevice *pd) -> bool` | Rozpoczyna rysowanie na urządzeniu (z wcześniej ustawionym cutem) |
| `drawWaveBySamples(x, w, startsamp, endsamp, gain, channel, color, startclip, endclip)` | Rysuje waveform w zakresie próbek |
| `drawWaveByMsecs(x, w, startmsecs, endmsecs, gain, channel, color, startclip, endclip)` | Rysuje waveform w zakresie milisekund |

## Metody prywatne
| Metoda | Opis |
|--------|------|
| `LoadWave()` | Pobiera dane peak z serwera (RDPeaksExport) |

## Stan wewnętrzny
- `wave_cut` — wskaźnik na cut (źródło audio)
- `wave_station` / `wave_user` / `wave_config` — kontekst systemu
- `wave_peaks` — obiekt eksportu danych peak (RDPeaksExport)
- `wave_sample_rate` — częstotliwość próbkowania
- `wave_channels` — liczba kanałów

## Zależności
- **QPainter** — klasa bazowa (renderowanie 2D)
- **RDCut** — źródło danych audio
- **RDPeaksExport** — pobieranie danych peak z serwera Rivendell
- **RDStation** / **RDUser** / **RDConfig** — kontekst uwierzytelnienia
