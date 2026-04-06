---
phase: 3
artifact: SVC
artifact_name: rdservice (Service Manager daemon)
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

# UI Contracts: rdservice (Service Manager daemon)

## Tryb ekstrakcji

| Parametr | Wartosc |
|----------|---------|
| Tryb UI | N/A (headless daemon) |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Programowy UI (C++) | 0 |
| Screenshots uzyte | 0 |
| Mockupy wygenerowane | 0 |

## Uzasadnienie N/A

rdservice jest headless daemonem (QCoreApplication, nie QApplication).
Nie posiada zadnych okien, dialogow, widgetow ani jakiegokolwiek interfejsu graficznego.
Jedynym interfejsem uzytkownika sa:
- Argumenty wiersza polecen (--end-startup-after-X, --force-system-maintenance, --initial-maintenance-interval)
- Unix signals (SIGTERM, SIGINT do zamkniecia; SIGUSR1 do przeladowania dropboxow)
- Logi syslog

Te interfejsy sa udokumentowane w inventory.md (reguly biznesowe MainObject).

## Przeglad okien

Brak okien — daemon bez UI.

## Navigation Flow

N/A — brak nawigacji UI.
