---
partial_id: 045
class_name: RDSvc
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDSvc

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `generationProgress(int step)` | `generateLog(...)` | Na początku (step=0), po utworzeniu struktury logu (step=1), po każdym zdarzeniu (step=1+i), po zakończeniu (step=24) | Postęp generowania logu — krok 0..24 (gdzie 24 = 100%) |
| `generationProgress(int step)` | `linkLog(...)` | Na początku (step=0), po przetworzeniu każdego linku (step=1+24*current_link/total_links), po zakończeniu (step=24) | Postęp linkowania bloków muzycznych/traffic — proporcjonalny postęp 0..24 |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak — metody `generateLog()` i `linkLog()` wywoływane synchronicznie, sygnały emitowane w trakcie ich wykonania) | — | — | — |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `generationProgress(int)` | `rdlogmanager/GenerateLog` (`gen_progress_dialog` — QProgressDialog) | `setValue(int)` | `rdlogmanager/generate_log.cpp:318` |
| `generationProgress(int)` | `rdlogmanager/GenerateLog` (`gen_progress_dialog`) | `setValue(int)` | `rdlogmanager/generate_log.cpp:427` |
| `generationProgress(int)` | `rdlogmanager/GenerateLog` (`gen_progress_dialog`) | `setValue(int)` | `rdlogmanager/generate_log.cpp:487` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — RDSvc nie wysyła sygnałów sieciowych bezpośrednio; generowanie i linkowanie logu to operacje lokalne na DB)
