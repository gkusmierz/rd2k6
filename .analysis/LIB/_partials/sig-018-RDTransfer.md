---
partial_id: 018
class_name: RDTransfer
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDTransfer

## Sygnały emitowane (klasa jako nadawca)
| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| (brak) | — | — | Klasa bazowa bez własnych sygnałów |

## Połączenia przychodzące (klasa jako odbiorca)
| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak) | — | — | Brak połączeń przychodzących |

## Połączenia wychodzące (klasa jako nadawca connect)
| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak) | — | — | Klasa nie definiuje własnych connect() |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)
| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | Klasa bazowa; transfer URL/file przez CURL wywoływany synchronicznie przez runDownload()/runUpload() podklas |

## Uwagi
RDTransfer jest abstrakcyjną klasą bazową dla RDDownload, RDUpload i RDDelete. Nie posiada własnych sygnałów ani slotów. Udostępnia wspólne metody: `urlIsSupported()`, `supportedSchemes()`, `config()`. Nie ma sygnałów — podklasy definiują `progressChanged(int)`.
