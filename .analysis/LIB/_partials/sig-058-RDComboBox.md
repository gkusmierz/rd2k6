---
partial_id: 58
class_name: RDComboBox
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDComboBox

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `setupClicked()` | `mousePressEvent()` | `combo_setup_mode == true` | Kliknięcie w trybie setup — zamiast normalnego wyboru |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak zewnętrznych connect() do RDComboBox) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `setupClicked()` | `lib/rdsound_panel` (panel_selector_box) | `panelSetupData()` | `lib/rdsound_panel.cpp:103` |

## Uwagi

RDComboBox rozszerza QComboBox o tryb "setup mode" — gdy `combo_setup_mode == true`, kliknięcie emituje `setupClicked()` zamiast zachowania standardowego. Używany w RDSoundPanel do przełączenia panelu dźwięku w tryb konfiguracji. `keyPressEvent()` filtruje klawisze z listy `ignored_keys`.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
