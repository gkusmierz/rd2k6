# inv-052 — RDReport

status: done
agent: PHASE-2-inventory-subagent
partial_id: 052

## Klasa: RDReport

**Plik:** `lib/rdreport.h` / `lib/rdreport.cpp` + 13 plików `lib/export_*.cpp`
**Rola:** Model raportu z generowaniem exportów. Zarządza konfiguracją raportów (filtry, ścieżki, format) i deleguje generowanie do specjalizowanych metod Export*. Raporty przetwarzają dane z logów (ELR — Event Log Reporting) i generują pliki w formatach wymaganych przez systemy traffic, muzyczne i analityczne.

**Konstruktor:** `RDReport(const int &rptname, RDStation *station, RDConfig *config, int *parent = 0)`

**Dziedziczenie:** brak (standalone)
**Zależności:** RDStation, RDConfig

---

## Enumy

### ExportFilter
Formaty eksportu (22 wartości):
| Wartość | Nazwa | Opis |
|---|---|---|
| 0 | CbsiDeltaFlex | Format CBSI DeltaFlex |
| 1 | TextLog | Prosty log tekstowy |
| 2 | BmiEmr | BMI Electronic Music Report |
| 3 | Technical | Raport techniczny |
| 4 | SoundExchange | SoundExchange (opłaty za streaming) |
| 5 | RadioTraffic | Radio Traffic (v1) |
| 6 | VisualTraffic | Visual Traffic |
| 7 | CounterPoint | CounterPoint |
| 8 | Music1 | Music1 |
| 9 | MusicSummary | Podsumowanie muzyczne |
| 10 | WideOrbit | WideOrbit |
| 11 | NprSoundExchange | NPR SoundExchange |
| 12 | MusicPlayout | Music Playout |
| 13 | NaturalLog | Natural Log |
| 14 | MusicClassical | Music Classical |
| 15 | MrMaster | MrMaster |
| 16 | SpinCount | Licznik odtworzeń (spin count) |
| 17 | CutLog | Cut Log |
| 18 | CounterPoint2 | CounterPoint v2 |
| 19 | ResultsReport | Results/Reconciliation Report |
| 20 | RadioTraffic2 | Radio Traffic (v2) |
| 21 | LastFilter | Sentinel |

### ExportOs
System docelowy: `Linux=0`, `Windows=1` (wpływa na line endings)

### ExportType
Typ raportu: `Generic=0`, `Traffic=1`, `Music=2`

### StationType
Typ stacji: `TypeOther=0`, `TypeAm=1`, `TypeFm=2`, `TypeLast=3`

### ErrorCode
Kody błędów: `ErrorOk=0`, `ErrorCanceled=1`, `ErrorCantOpen=2`

---

## Właściwości (gettery + settery)

| Właściwość | Opis |
|---|---|
| name | Nazwa raportu (readonly) |
| exists | Czy raport istnieje w DB |
| description | Opis raportu |
| filter | Filtr eksportu (ExportFilter) |
| exportPath | Ścieżka wyjściowa pliku |
| postExportCommand | Komenda do uruchomienia po eksporcie |
| exportTypeEnabled | Czy dany typ eksportu (Generic/Traffic/Music) włączony |
| exportTypeForced | Czy dany typ eksportu jest wymuszony |
| stationId | ID stacji |
| cartDigits | Liczba cyfr numeru cartu |
| useLeadingZeros | Czy wiodące zera |
| linesPerPage | Linie na stronę |
| serviceName | Nazwa serwisu |
| stationType | Typ stacji (AM/FM/Other) |
| stationFormat | Format stacji |
| startSource / filterOnairFlag | Źródło startu / filtr on-air |
| filterGroups | Filtrowane grupy |
| startTime / endTime | Zakres czasu raportu |

---

## Kluczowe metody

### generateReport(startdate, enddate, station, out_path) → bool
Główna metoda — generuje raport za podany zakres dat. Buduje tymczasową tabelę ELR_LINES z danych logu, następnie wywołuje odpowiednią metodę Export* na podstawie wybranego filtra.

### outputExists(startdate) → bool
Sprawdza czy plik wyjściowy raportu już istnieje.

### Metody statyczne
- `filterText(filter)` → QString — nazwa filtra
- `stationTypeText(type)` → QString — nazwa typu stacji
- `multipleDaysAllowed(filter)` → bool — czy filtr obsługuje zakres wielu dni
- `multipleMonthsAllowed(filter)` → bool — czy filtr obsługuje zakres wielu miesięcy
- `errorText(code)` → QString — opis błędu

### Metody formatowania (statyczne)
- `leftJustify(str, width)` — wyrównanie do lewej
- `rightJustify(str, width)` — wyrównanie do prawej
- `center(str, width)` — centrowanie

---

## Metody Export* (13 implementacji w osobnych plikach)

Każda metoda generuje plik w specyficznym formacie. Implementacja w oddzielnych plikach .cpp:

| Metoda | Plik | Format |
|---|---|---|
| `ExportDeltaflex()` | `export_deltaflex.cpp` | CBSI DeltaFlex |
| `ExportTextLog()` | `export_textlog.cpp` | Prosty log tekstowy |
| `ExportBmiEmr()` | `export_bmiemr.cpp` | BMI EMR |
| `ExportTechnical()` | `export_technical.cpp` | Raport techniczny |
| `ExportSoundEx()` | `export_soundex.cpp` | SoundExchange |
| `ExportNprSoundEx()` | `export_nprsoundex.cpp` | NPR SoundExchange |
| `ExportRadioTraffic()` | `export_radiotraffic.cpp` | Radio Traffic |
| `ExportMusicClassical()` | `export_musicclassical.cpp` | Music Classical |
| `ExportMusicPlayout()` | `export_musicplayout.cpp` | Music Playout |
| `ExportMusicSummary()` | `export_musicsummary.cpp` | Music Summary |
| `ExportSpinCount()` | `export_spincount.cpp` | Spin Count |
| `ExportCutLog()` | `export_cutlog.cpp` | Cut Log |
| `ExportResultsReport()` | `export_resultsrecon.cpp` | Results/Reconciliation |

---

## Metody prywatne (persystencja)

- `SetRow(param, value)` — 6 overloadów dla różnych typów
- `SetRowNull(param)` — ustawienie NULL
- `OsFieldName(os)` — nazwa pola DB dla systemu OS
- `TypeFieldName(type)` — nazwa pola DB dla typu eksportu

---

## SQL / Tabele

| Tabela | Operacje | Kontekst |
|---|---|---|
| `REPORTS` | SELECT, UPDATE | Konfiguracja raportu |
| `REPORT_STATIONS` | SELECT | Filtrowanie po stacjach |
| `REPORT_GROUPS` | SELECT | Filtrowanie po grupach |
| `REPORT_SERVICES` | SELECT | Filtrowanie po serwisach |
| `GROUPS` | SELECT | Lookup grup |
| `ELR_LINES` | INSERT, SELECT | Tymczasowe dane logu dla generowania raportu — budowane z danych logu serwisu |
