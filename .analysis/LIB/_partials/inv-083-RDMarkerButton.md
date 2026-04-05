---
partial_id: "083"
class: RDMarkerButton
source: lib/rdmarker_button.h, lib/rdmarker_button.cpp
status: done
agent: PHASE-2-inventory-subagent
---

# RDMarkerButton

## Rola
Specjalizowany przycisk do wybierania markerów audio w edytorze RDEditAudio. Dziedziczy z RDPushButton i nadpisuje obsługę klawiatury — przechwytuje klawisze nawigacyjne (strzałki, Home, End itp.) aby nie były konsumowane przez przycisk, lecz mogły być przekazane do okna nadrzędnego (edytora audio). Używany jako jeden z 11 przycisków markerów w RDEditAudio.

## Hierarchia
- **Dziedziczy z:** RDPushButton
- **Brak kompozycji** — minimalistyczny widget

## Konstruktory
```
RDMarkerButton(QWidget *parent)
RDMarkerButton(const QString &text, QWidget *parent)
RDMarkerButton(const QIcon &icon, const QString &text, QWidget *parent)
```

## Sygnały
Brak zadeklarowanych sygnałów (dziedziczy sygnały z RDPushButton/QPushButton).

## Sloty
Brak zadeklarowanych slotów.

## Zdarzenia
- `keyPressEvent(QKeyEvent*)` — filtruje klawisze nawigacyjne, przekazuje je do rodzica zamiast obsługiwać lokalnie

## Uwagi
- Klasa nie posiada Q_OBJECT — nie definiuje własnych sygnałów/slotów
- Cała logika ogranicza się do nadpisania keyPressEvent

## Zależności
- **RDPushButton** — klasa bazowa (przycisk Rivendell)
