---
partial_id: 046
class_name: RDPodcast
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDPodcast

## Sygnały emitowane (klasa jako nadawca)

(no signals declared — klasa nie deklaruje sekcji `signals:` w nagłówku `lib/rdpodcast.h`)

## Połączenia przychodzące (klasa jako odbiorca)

(none — klasa nie ma slotów Qt i nie jest odbiorcą żadnych connect())

## Połączenia wychodzące (klasa jako nadawca connect)

(none — klasa nie definiuje żadnych connect())

## Zachowanie wewnętrzne

`RDPodcast` jest klasą czysto data-access — dostęp do pojedynczego podcastu przez operacje CRUD na DB (tabela `PODCASTS`). Nie posiada żadnej logiki reaktywnej Qt.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

(none — klasa działa wyłącznie przez SQL na lokalnej bazie danych)
