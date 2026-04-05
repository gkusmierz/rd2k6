---
partial_id: 032
class_name: RDPanelButton
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDPanelButton

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `cartDropped(int row,int col,unsigned cartnum,const QColor &color,const QString &title)` | `dropEvent(QDropEvent*)` | gdy drop zawiera poprawny numer koszyka i dane | Koszyk upuszczony na przycisk panelu; zawiera pozycję (row,col) i metadane |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `RDSoundPanel` | `tick()` | `tickClock()` | `rdsound_panel.cpp:1033` (dynamicznie, gdy przycisk aktywny) |
| `RDSoundPanel` | `buttonFlash(bool)` | `flashButton(bool)` | (przez `buttonFlash` signal z zewnątrz; public slot) |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `clicked()` (QPushButton) | `RDSoundPanel::panel_mapper` (QSignalMapper) | `map()` | `rdsound_panel.cpp:1215,1230` |
| `cartDropped(...)` | (brak bezpośrednich connect w lib — obsługiwany przez RDSoundPanel) | — | — |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
