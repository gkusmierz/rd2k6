---
partial_id: 061
class_name: RDDiscLookup
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDDiscLookup

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `lookupDone(RDDiscLookup::Result, const QString &err_msg)` | `processLookup()` → `emit lookupDone(ExactMatch, "OK")` | Po przetworzeniu wyniku (ISRC recovery + titles selection) | Zakończenie wyszukiwania metadanych CD — wynik: ExactMatch / NoMatch / LookupError |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `lookup_ok_button` (QPushButton) | `clicked()` | `okData()` | `lib/rddisclookup.cpp` konstruktor |
| `lookup_cancel_button` (QPushButton) | `clicked()` | `cancelData()` | `lib/rddisclookup.cpp` konstruktor |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `lookupDone(RDDiscLookup::Result, const QString &)` | `DiskRipper` | `lookupDoneData(RDDiscLookup::Result, const QString &)` | `rdlibrary/disk_ripper.cpp:86-88` |
| `lookupDone(RDDiscLookup::Result, const QString &)` | `CdRipper` | `lookupDoneData(RDDiscLookup::Result, const QString &)` | `rdlibrary/cdripper.cpp:89-90` |

## Uwagi architektoniczne

- `RDDiscLookup` jest klasą bazową — instancje tworzone przez fabrykę `RDDiscLookupFactory()` w `lib/rddisclookup_factory.cpp`.
- Podklasy (`RDCddbLookup`, `RDMbLookup`, `RDDummyLookup`) implementują `lookupRecord()` i wywołują `processLookup()` po zakończeniu.
- `processLookup()` obsługuje odczyt ISRC z dysku (jeśli brak) i ostatecznie emituje `lookupDone`.
- Konsumenci (`DiskRipper`, `CdRipper`) tworzą instancję przez fabrykę i podłączają się do `lookupDone`.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| TCP socket (RDCddbLookup) | Serwer CDDB/FreeDB | readyRead / error | Asynchroniczne pobranie metadanych CD przez sieć |
| HTTP (RDMbLookup) | MusicBrainz API | synchroniczne wywołanie biblioteki musicbrainz5 | Pobranie metadanych CD + cover art |
