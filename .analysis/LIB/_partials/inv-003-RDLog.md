---
partial_id: "003"
artifact: LIB
class_name: RDLog
phase: 2
status: done
files:
  - lib/rdlog.h
  - lib/rdlog.cpp
---

# RDLog — Inventory

## Typ Qt

Plain C++ class (no QObject, no signals/slots, no Q_PROPERTY). Active Record pattern over MySQL.

## Odpowiedzialnosc (WHAT)

Represents a radio station **log** (daily playlist/schedule). Provides CRUD operations and metadata management for a single log record in the `LOGS` table. A log groups ordered lines (LOG_LINES) that define what airs and when.

Key responsibilities:
- **Create** a new log for a given service and air date, applying shelflife/purge rules from the service configuration.
- **Read** all log metadata (name, service, dates, description, track counts, link state, auto-refresh).
- **Update** individual metadata fields via typed setter methods (each setter issues its own SQL UPDATE).
- **Delete** a log and its associated lines and voice-track carts.
- **Readiness check** — determines if a log is fully prepared for air (all music linked, all traffic linked, all voice tracks completed).
- **Track accounting** — counts scheduled vs. completed voice tracks by joining LOG_LINES with CART.
- **Link quantity tracking** — counts music-link and traffic-link placeholders remaining in log lines.
- **XML serialization** — produces an XML fragment of the log's metadata for web API responses.
- **Factory** — creates an `RDLogEvent` for in-memory manipulation of this log's lines.

## Sygnaly

Brak. Klasa nie dziedziczy po QObject.

## Sloty

Brak.

## Q_PROPERTY

Brak.

## API

### Konstruktor

| Sygnatura | Opis |
|-----------|------|
| `RDLog(const QString &name)` | Loads log by name from DB (normalizes case from LOGS.NAME) |

### Metody instancji — Gettery

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `name()` | `QString` | Nazwa logu (klucz glowny) |
| `exists()` | `bool` | Czy log istnieje w DB |
| `logExists()` | `bool` | Flaga cache (czy log istnieje, ustawiana z zewnatrz) |
| `type()` | `RDLog::Type` | Typ logu (Log/Event/Clock/Grid) |
| `description()` | `QString` | Opis logu |
| `service()` | `QString` | Nazwa serwisu (stacja/format) |
| `startDate()` | `QDate` | Data poczatku obowiazywania |
| `endDate()` | `QDate` | Data konca obowiazywania |
| `purgeDate()` | `QDate` | Data automatycznego usuniecia |
| `originUser()` | `QString` | Uzytkownik ktory stworzyl log |
| `originDatetime()` | `QDateTime` | Data/czas utworzenia |
| `linkDatetime()` | `QDateTime` | Data/czas ostatniego linkowania |
| `modifiedDatetime()` | `QDateTime` | Data/czas ostatniej modyfikacji |
| `autoRefresh()` | `bool` | Czy log odsweza sie automatycznie |
| `scheduledTracks()` | `int` | Liczba zaplanowanych voice-trackow |
| `completedTracks()` | `int` | Liczba ukonczonych voice-trackow |
| `includeImportMarkers()` | `bool` | Czy import markerow jest wlaczony |
| `linkQuantity(Source)` | `int` | Liczba linkow muzycznych lub trafficowych |
| `linkState(Source)` | `LinkState` | Stan linkowania (Missing/Done/NotPresent) |
| `nextId()` | `int` | Nastepny wolny ID linii w logu |
| `isReady()` | `bool` | Gotowy do emisji (muzyka zlinkowana AND traffic zlinkowany AND tracki kompletne) |

### Metody instancji — Settery

Kazdy setter wykonuje bezposredni SQL UPDATE na tabeli LOGS.

| Metoda | Parametr | Opis |
|--------|----------|------|
| `setLogExists(bool)` | bool | Ustawia flage cache |
| `setType(Type)` | RDLog::Type | Zmienia typ logu |
| `setDescription(QString)` | QString | Zmienia opis |
| `setService(QString)` | QString | Zmienia serwis |
| `setStartDate(QDate)` | QDate | Zmienia date poczatku |
| `setEndDate(QDate)` | QDate | Zmienia date konca |
| `setPurgeDate(QDate)` | QDate | Zmienia date purge |
| `setOriginUser(QString)` | QString | Zmienia uzytkownika |
| `setOriginDatetime(QDateTime)` | QDateTime | Zmienia date utworzenia |
| `setLinkDatetime(QDateTime)` | QDateTime | Zmienia date linkowania |
| `setModifiedDatetime(QDateTime)` | QDateTime | Zmienia date modyfikacji |
| `setAutoRefresh(bool)` | bool | Zmienia auto-refresh |
| `setScheduledTracks(int)` | int | Ustawia liczbe zaplanowanych trackow |
| `setCompletedTracks(int)` | int | Ustawia liczbe ukonczonych trackow |
| `setIncludeImportMarkers(bool)` | bool | Zmienia flage markerow importu |
| `setLinkQuantity(Source, int)` | Source, int | Ustawia liczbe linkow |
| `setLinkState(Source, LinkState)` | Source, LinkState | Ustawia stan linkowania |
| `setNextId(int)` | int | Ustawia nastepny ID linii |

### Metody instancji — Operacje

| Metoda | Opis |
|--------|------|
| `remove(RDStation*, RDUser*, RDConfig*)` | Usuwa log: najpierw voice-tracki (CART), potem LOG_LINES, potem LOGS |
| `updateTracks()` | Przelicza scheduled/completed voice-tracki z JOIN LOG_LINES+CART i aktualizuje LOGS |
| `removeTracks(RDStation*, RDUser*, RDConfig*)` | Usuwa wszystkie carty posiadane przez ten log (CART.OWNER = nazwa logu ze spacjami zamienionymi na _) |
| `updateLinkQuantity(Source)` | Przelicza i aktualizuje liczbe music-link lub traffic-link placeholderow w LOG_LINES |
| `createLogEvent()` | Tworzy nowy RDLogEvent (in-memory reprezentacja linii logu) |
| `xml()` | Serializuje metadane logu do XML (18 pol z tabeli LOGS) |

### Metody statyczne

| Metoda | Opis |
|--------|------|
| `create(name, svc_name, air_date, user_name, err_msg*, config*)` | Tworzy nowy log w DB: czyta shelflife z SERVICES, oblicza PURGE_DATE, insertuje do LOGS |
| `exists(name)` | Sprawdza czy log o danej nazwie istnieje w DB |
| `remove(name, station*, user*, config*)` | Statyczny wrapper na instancyjne remove() |

### Metody prywatne (Active Record helpers)

| Metoda | Opis |
|--------|------|
| `GetIntValue(field)` | Czyta int z LOGS WHERE NAME=log_name |
| `GetUnsignedValue(field)` | Czyta unsigned z LOGS |
| `GetStringValue(field)` | Czyta QString z LOGS |
| `GetDateValue(field)` | Czyta QDate z LOGS |
| `GetDatetimeValue(field)` | Czyta QDateTime z LOGS |
| `SetRow(field, int/uint/QString/QDate/QDateTime)` | UPDATE LOGS SET field=value WHERE NAME=log_name (5 przeciazen) |

## Enums

### RDLog::Type
| Wartosc | Znaczenie |
|---------|-----------|
| `Log = 0` | Standardowy log (playlista dzienna) |
| `Event = 1` | Log zdarzeniowy |
| `Clock = 2` | Zegar (szablon godzinowy) |
| `Grid = 3` | Siatka (szablon tygodniowy) |

### RDLog::Source
| Wartosc | Znaczenie |
|---------|-----------|
| `SourceTraffic = 0` | Zrodlo: system trafficowy (reklamy) |
| `SourceMusic = 1` | Zrodlo: scheduler muzyczny |

### RDLog::LinkState
| Wartosc | Znaczenie |
|---------|-----------|
| `LinkMissing = 0` | Linkowanie nie wykonane, ale wymagane |
| `LinkDone = 1` | Linkowanie zakonczone pomyslnie |
| `LinkNotPresent = 2` | Linkowanie nie dotyczy tego logu (brak placeholderow) |

## Reguly biznesowe

1. **Readiness rule**: Log jest gotowy do emisji (`isReady()`) wtedy i tylko wtedy, gdy:
   - (brak music-linkow LUB music jest zlinkowany) ORAZ
   - (brak traffic-linkow LUB traffic jest zlinkowany) ORAZ
   - (brak zaplanowanych trackow LUB scheduled == completed)
2. **Purge date calculation**: Przy tworzeniu logu purge date jest obliczana na podstawie shelflife z SERVICES:
   - `OriginCreationDate` -> purge = dzis + shelflife dni
   - `OriginAirDate` -> purge = air_date + shelflife dni (tylko jesli air_date jest valid)
3. **Track ownership**: Voice-tracki nalezace do logu sa identyfikowane przez CART.OWNER = nazwa_logu (z zamiana spacji na `_`).
4. **Deletion cascade**: Usuniecie logu wymaga najpierw: (1) usuniecie voice-track cartow, (2) usuniecie LOG_LINES, (3) usuniecie z LOGS. Jesli krok 1 zawiedzie, cala operacja jest przerywana.
5. **Name normalization**: Konstruktor normalizuje case nazwy logu z DB (odczytuje kanoniczny zapis z tabeli LOGS).
6. **Create uniqueness**: Proba utworzenia logu o istniejacej nazwie konczy sie bledem (duplikat SQL INSERT).

## Linux-specific

Brak. Klasa nie uzywa QProcess, urzadzen /dev/ ani wywolan systemowych.

## Tabele DB

| Tabela | Rola | Operacje |
|--------|------|----------|
| `LOGS` | Glowna tabela metadanych loggow | SELECT, INSERT, UPDATE, DELETE |
| `LOG_LINES` | Linie logu (poszczegolne eventy playlisty) | SELECT (count), DELETE |
| `CART` | Carty audio (voice-tracki posiadane przez log) | SELECT (via RDCart), DELETE (via RDCart::remove) |
| `SERVICES` | Konfiguracja serwisow (shelflife, description template) | SELECT (przy create) |

### Kluczowe kolumny LOGS (odczytane z xml() i create())

NAME, SERVICE, DESCRIPTION, ORIGIN_USER, ORIGIN_DATETIME, LINK_DATETIME, MODIFIED_DATETIME, PURGE_DATE, AUTO_REFRESH, START_DATE, END_DATE, SCHEDULED_TRACKS, COMPLETED_TRACKS, MUSIC_LINKS, MUSIC_LINKED, TRAFFIC_LINKS, TRAFFIC_LINKED, NEXT_ID, TYPE, INCLUDE_IMPORT_MARKERS

## Zaleznosci

| Klasa | Rola |
|-------|------|
| `RDConfig` | Konfiguracja systemu (przekazywana do operacji usuwania) |
| `RDLogEvent` | In-memory reprezentacja linii logu (tworzony przez createLogEvent()) |
| `RDUser` | Uzytkownik (przekazywany do operacji usuwania) |
| `RDStation` | Stacja (przekazywana do operacji usuwania) |
| `RDSqlQuery` | Wrapper SQL query (Active Record warstwa dostepu do DB) |
| `RDCart` | Cart audio (usuwany przy removeTracks) |
| `RDSvc` | Serwis (enum ShelflifeOrigin uzywany przy create) |
| `RDLogLine` | Typy linii logu (enum Track, MusicLink, TrafficLink) |
| `RDEscapeString` | Helper do SQL escaping |
| `RDXmlField` | Helper do XML serializacji |
| `RDBool` | Helper konwersji Y/N na bool |
