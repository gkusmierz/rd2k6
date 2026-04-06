---
phase: 3
artifact: CAE
artifact_name: caed (Core Audio Engine)
status: done
completed_at: 2026-04-06
ui_mode: N/A
windows_total: 0
dialogs_total: 0
panels_total: 0
screenshots_used: 0
mockups_generated: 0
spot_check_issues: 0
agent_version: 1.2.0
---

# UI Contracts: caed (Core Audio Engine)

## Tryb ekstrakcji

| Parametr | Wartosc |
|----------|---------|
| Tryb UI | N/A (headless daemon) |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Programowy UI (C++) | 0 |
| Screenshots uzyte | 0 |
| Mockupy wygenerowane | 0 |

## Przeglad okien

CAE (caed) to headless daemon uruchamiany przez QCoreApplication (nie QApplication).
Nie posiada zadnego interfejsu graficznego. Komunikacja z klientami odbywa sie
wylacznie poprzez protokol TCP (port CAED_TCP_PORT) oraz UDP (metering).

Brak okien, dialogow, widgetow ani paneli do udokumentowania.

## Interfejs uzytkownika CAE

Jedynym "interfejsem" CAE jest:
1. **Protokol TCP** (tekstowy) -- patrz call-graph.md i SPEC.md
2. **Metering UDP** -- wysylanie poziomow audio do klientow
3. **CLI flag** `-d` (debug mode -- daemon pozostaje w foreground)
4. **Unix signals** SIGHUP/SIGINT/SIGTERM do graceful shutdown

Te interfejsy sa udokumentowane w inventory.md (CaeServer, MainObject) i beda
szczegolowo opisane w call-graph.md (Phase 4) oraz SPEC.md (Phase 6).
