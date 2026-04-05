---
partial_id: 063
class_name: RDMbLookup
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDMbLookup

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `lookupDone(RDDiscLookup::Result, const QString &)` | **odziedziczony** — emitowany przez `processLookup()` (klasa bazowa `RDDiscLookup`) | Wywoływany przez `lookupRecord()` po przetworzeniu odpowiedzi MusicBrainz5 | Zakończenie zapytania MusicBrainz z wynikiem ExactMatch / NoMatch / LookupError |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| (brak wewnętrznych połączeń Qt) | — | — | Brak `connect()` w konstruktorze — biblioteka musicbrainz5 używana synchronicznie |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `lookupDone(...)` (dziedziczony) | `DiskRipper` | `lookupDoneData(...)` | `rdlibrary/disk_ripper.cpp:86-88` (przez fabrykę) |
| `lookupDone(...)` (dziedziczony) | `CdRipper` | `lookupDoneData(...)` | `rdlibrary/cdripper.cpp:89-90` (przez fabrykę) |

## Łańcuch wywołań wewnętrznych

```
[wywołanie zewnętrzne] lookup() →
    lookupRecord() [override] →
        musicbrainz5::Query (synchroniczne HTTP) →
        ProcessRelease() →
        GetReleaseCover() (opcjonalnie — cover art HTTP) →
        processLookup(result_code, err_str) [base class] →
            emit lookupDone(result_code, err_str)
```

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| HTTP synchroniczny (biblioteka musicbrainz5) | MusicBrainz Web Service API | `musicbrainz5::Query::LookupDiscID()` | Wyszukiwanie metadanych albumu po disc ID |
| HTTP synchroniczny (biblioteka libcoverart) | Cover Art Archive API | `GetReleaseCover()` | Pobieranie okładki albumu (cover art) |
| Katalog tymczasowy (`/tmp`) | Lokalny FS | `temp_directory` | Zapis pobranego cover art przed załadowaniem do Qt |
