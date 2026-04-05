---
partial_id: 029
class_name: RDSoundPanel
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDSoundPanel

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `tick()` | `tickClock()` | zawsze (timer 1s) | Takt zegara — propagowany do aktywnych przycisków |
| `buttonFlash(bool state)` | `tickClock()` | co 2 takty, gdy `panel_flash==true` | Przełączenie stanu migania przycisków |
| `selectClicked(unsigned cartnum,int row,int col)` | `buttonMapperData(int id)` | tryb CopyFrom: cartnum>0 | Wybór istniejącego koszyka (cartnum>0, row/col=0) |
| `selectClicked(unsigned cartnum,int row,int col)` | `buttonMapperData(int id)` | tryby CopyTo/Move/Select: przycisk pusty | Wybór pustej pozycji (cartnum=0, row/col z mapowania) |
| `channelStarted(int mport,int card,int port)` | `PlayButton(...)` → wewnętrzne | po starcie odtwarzania | Kanał audio zaczął odtwarzać (numer portu, karty, wyjścia) |
| `channelStopped(int mport,int card,int port)` | wewnętrzna obsługa hookEnd/stateChanged | po zatrzymaniu | Kanał audio zakończył odtwarzanie |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `panel_mapper` (QSignalMapper) | `mapped(int)` | `buttonMapperData(int)` | `rdsound_panel.cpp:87` |
| `panel_selector_box` | `activated(int)` | `panelActivatedData(int)` | `rdsound_panel.cpp:101` |
| `panel_selector_box` | `setupClicked()` | `panelSetupData()` | `rdsound_panel.cpp:103` |
| `panel_playmode_box` | `activated(int)` | `playmodeActivatedData(int)` | `rdsound_panel.cpp:131` |
| `panel_reset_button` | `clicked()` | `resetClickedData()` | `rdsound_panel.cpp:148` |
| `panel_all_button` | `clicked()` | `allClickedData()` | `rdsound_panel.cpp:163` |
| `panel_setup_button` | `clicked()` | `setupClickedData()` | `rdsound_panel.cpp:177` |
| `rda->cae()` (RDCae) | `timescalingSupported(int,bool)` | `timescalingSupportedData(int,bool)` | `rdsound_panel.cpp:190` |
| `rda->ripc()` (RDRipc) | `onairFlagChanged(bool)` | `onairFlagChangedData(bool)` | `rdsound_panel.cpp:196` |
| `panel_scan_timer` (QTimer) | `timeout()` | `scanPanelData()` | `rdsound_panel.cpp:229` |
| `button->playDeck()` (RDPlayDeck) | `stateChanged(int,RDPlayDeck::State)` | `stateChangedData(int,RDPlayDeck::State)` | `rdsound_panel.cpp:1029` (per-button) |
| `button->playDeck()` (RDPlayDeck) | `hookEnd(int)` | `hookEndData(int)` | `rdsound_panel.cpp:1031` (per-button) |
| `panel_buttons[*]->panelButton(j,k)` | `clicked()` | `panel_mapper->map()` | `rdsound_panel.cpp:1215,1230` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `tick()` | `button` (RDPanelButton) | `tickClock()` | `rdsound_panel.cpp:1033` (dynamicznie dla każdego aktywnego przycisku) |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| `rda->ripc()` | rdpadd/ripcd | `onairFlagChanged(bool)` | Odbiera stan on-air z RIPCD przez RIPC |
| `rda->cae()` | rdcae | `timescalingSupported(int,bool)` | Odbiera info o timescalingu z CAE |
| `panel_event_player` | ripcd | exec RML | Wykonuje makra RML przez IPC przy starcie/zatrzymaniu |
