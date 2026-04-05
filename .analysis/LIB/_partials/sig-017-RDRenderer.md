---
partial_id: 17
class_name: RDRenderer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDRenderer

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `progressMessageSent(const QString &msg)` | `ProgressMessage(const QString &msg)` | Zawsze po wygenerowaniu wiadomości postępu | Tekstowa informacja o postępie renderowania (np. tytuł, ostrzeżenie, podsumowanie) |
| `progressMessageSent(const QString &msg)` | `ProgressMessage(const QTime &time, int line, const QString &trans, const QString &msg)` | Zawsze po złożeniu wiadomości z parametrów czasowych i linii | Sformatowana wiadomość o postępie z informacją o czasie, numerze linii i rodzaju przejścia |
| `lineStarted(int linno, int totallines)` | `Render()` (prywatna) | Przy każdym rozpoczęciu renderowania kolejnej linii loga | Informuje o numerze aktualnie renderowanej linii i łącznej liczbie linii (wskaźnik postępu) |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `QProgressDialog` (`render_progress_dialog`) | `canceled()` | `abort()` | `rdlogedit/render_dialog.cpp:280` — użytkownik anuluje dialog postępu |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|------------|---------|--------------|------------------------------|
| `progressMessageSent(const QString &)` | `MainObject` (rdrender) | `printProgressMessage(const QString &)` | `utils/rdrender/rdrender.cpp:300` — wypisuje wiadomość na stdout |
| `progressMessageSent(const QString &)` | `RDFeed` | `renderMessage(const QString &)` | `lib/rdfeed.cpp:1509` — obsługa postępu podczas renderowania feeda RSS/podcast |
| `lineStarted(int, int)` | `RDFeed` | `renderLineStartedData(int, int)` | `lib/rdfeed.cpp:1511` — aktualizacja wskaźnika postępu podczas renderowania feeda |
| `lineStarted(int, int)` | `RenderDialog` | `lineStartedData(int, int)` | `rdlogedit/render_dialog.cpp:279` — aktualizacja paska postępu w dialogu renderowania |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
*(brak — RDRenderer operuje lokalnie na plikach i DB, nie używa IPC)*

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| — | — | — | — |

## Uwagi
- Klasa operuje synchronicznie w wywołującym wątku — `renderToFile()`/`renderToCart()` blokują do zakończenia.
- `abort()` (public slot) ustawia flagę `render_abort` sprawdzaną w pętli renderowania.
- `ProgressMessage()` jest prywatną metodą wewnętrzną — nie jest slotem; emituje `progressMessageSent`.
- Używana przez: `utils/rdrender/rdrender.cpp`, `rdlogedit/render_dialog.cpp`, `lib/rdfeed.cpp`.
