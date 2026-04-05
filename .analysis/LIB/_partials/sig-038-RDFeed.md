---
partial_id: 038
class_name: RDFeed
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDFeed

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `postProgressRangeChanged(int min,int max)` | `postCast()` / `postLog()` / `postLog(lineno)` | na początku każdej operacji postowania | Ustawia zakres paska postępu (min=0, max=N kroków) |
| `postProgressChanged(int step)` | `postCast()` / `postLog()` / `postLog(lineno)` / `renderLineStartedData()` | po każdym etapie operacji | Aktualizuje krok postępu (0..max); każdy etap = inny krok pipeline |

> Szczegóły kroków postępu:
> - `postCast()`: 5 kroków (0=start, 1=upload audio, 2=save podcast, 3=remote archive, 4=generate XML, 5=finalize)
> - `postLog()` (log→podcast): 6 kroków analogicznie
> - `postLog()` z liniami: 4+(end_line-start_line) kroków; kroki 1..N odpowiadają renderowaniu kolejnych linii loga

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `renderer` (RDAudioExport/renderer) | `progressMessageSent(const QString &)` | `renderMessage(const QString &)` | `rdfeed.cpp:1509` (lokalne, w czasie renderowania) |
| `renderer` | `lineStarted(int,int)` | `renderLineStartedData(int,int)` | `rdfeed.cpp:1511` (lokalne, w czasie renderowania) |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `postProgressChanged(int)` | `rdcastmanager::ListCasts` | (progress bar slot) | `rdcastmanager/list_casts.cpp:89` |
| `postProgressRangeChanged(int,int)` | `rdcastmanager::ListCasts` | (progress range slot) | `rdcastmanager/list_casts.cpp:91` |

## Q_PROPERTY reactive bindings
(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| HTTP/CURL | Web service (rdxport) | `SavePodcast()` → multipart POST do `RDXPORT_COMMAND_SAVE_PODCAST` | Upload pliku audio podcastu przez webservice Rivendell |
| HTTP/CURL | Zdalny serwer | `postPodcast()` | Upload pliku XML RSS na zdalny host |
| SQL | MySQL/MariaDB | liczne zapytania | CRUD na tabelach FEEDS, PODCASTS, SUPERFEED_MAPS, FEED_PERMS |
