# inv-051 — RDRecording

status: done
agent: PHASE-2-inventory-subagent
partial_id: 051

## Klasa: RDRecording

**Plik:** `lib/rdrecording.h` / `lib/rdrecording.cpp`
**Rola:** Model zaplanowanego nagrywania (scheduled recording/event). Reprezentuje rekord w tabeli RECORDINGS — definiuje kiedy, co, jak i skąd nagrywać/pobierać/przesyłać. Obsługuje wiele typów zaplanowanych akcji: nagrywanie audio, macro events, switch events, playout, download, upload.

**Konstruktor:** `RDRecording(int id, bool create = false)` — ładuje rekord po ID; create=true tworzy nowy.

**Dziedziczenie:** brak (standalone)
**Zależności:** brak sygnałów/slotów (nie jest QObject)

---

## Enumy

### Type
Typ zaplanowanego zdarzenia:
- `Recording=0` — nagrywanie audio
- `MacroEvent=1` — wykonanie makra
- `SwitchEvent=2` — przełączenie matrycy
- `Playout=3` — odtwarzanie
- `Download=4` — pobieranie pliku
- `Upload=5` — wysyłanie pliku
- `LastType=6` — sentinel

### StartType
Sposób startu:
- `HardStart=0` — start o stałym czasie
- `GpiStart=1` — start wyzwalany przez GPI

### EndType
Sposób zakończenia:
- `HardEnd=0` — koniec o stałym czasie
- `GpiEnd=1` — koniec wyzwalany przez GPI
- `LengthEnd=2` — koniec po określonej długości

### ExitCode
Kod wyjścia ostatniego wykonania:
- `Ok=0`, `Short=1`, `LowLevel=2`, `HighLevel=3`
- `Downloading=4`, `Uploading=5`, `ServerError=6`, `InternalError=7`
- `Interrupted=8`, `RecordActive=9`, `PlayActive=10`, `Waiting=11`
- `DeviceBusy=12`, `NoCut=13`, `UnknownFormat=14`

---

## Właściwości (gettery + settery) — wybrane kluczowe

### Scheduling
| Właściwość | Opis |
|---|---|
| isActive | Czy zdarzenie jest aktywne |
| station | Stacja wykonująca |
| type | Typ zdarzenia (Recording/Macro/Switch/...) |
| startTime / endTime | Czas startu i końca |
| startType / endType | Sposób startu/końca (Hard/GPI/Length) |
| sun/mon/tue/wed/thu/fri/sat | Dni tygodnia (bool per dzień) |

### Audio / Recording
| Właściwość | Opis |
|---|---|
| channel | Kanał wejściowy |
| cutName | Nazwa docelowego cuta |
| format | Format nagrywania |
| channels | Liczba kanałów audio |
| sampleRate | Sample rate |
| bitrate / quality | Bitrate lub jakość (dla VBR) |
| normalizationLevel | Poziom normalizacji |
| trimThreshold | Próg trimowania ciszy |

### Switching / GPI
| Właściwość | Opis |
|---|---|
| switchSource / switchDestination | Źródło i cel przełączenia matrycy |
| startGpi / endGpi | Numer GPI dla startu/stopu |
| startMatrix / startLine | Matryca i linia GPI startu |
| endMatrix / endLine | Matryca i linia GPI końca |
| startLength / endLength | Długość okna GPI (ms) |

### Download/Upload
| Właściwość | Opis |
|---|---|
| url | URL źródła/celu |
| urlUsername / urlPassword | Dane uwierzytelniające |
| urlUseIdFile | Czy używać pliku klucza SSH |
| enableMetadata | Czy aktualizować metadane |

### Podcasting
| Właściwość | Opis |
|---|---|
| feedId | ID feeda podcastowego |
| feedKeyName | Nazwa klucza feeda (readonly, lookup z FEEDS) |

### Inne
| Właściwość | Opis |
|---|---|
| description | Opis zdarzenia |
| length | Maksymalna długość |
| macroCart | Numer cartu makra |
| oneShot | Czy jednorazowe (auto-dezaktywacja) |
| allowMultipleRecordings | Czy pozwalać na jednoczesne nagrywanie |
| maxGpiRecordingLength | Max długość nagrywania GPI |
| startOffset | Offset startu |
| startdateOffset / enddateOffset / eventdateOffset | Offsety dat |

---

## Metody statyczne

- `typeString(type)` → QString — nazwa typu zdarzenia
- `exitString(code)` → QString — opis kodu wyjścia

---

## Metody prywatne (persystencja)

- `GetIntValue/GetUIntValue/GetBoolValue/GetStringValue/GetTimeValue(field)` — odczyt z DB
- `SetRow(param, value)` — zapis do DB (5 overloadów dla różnych typów)
- `AddRecord()` → int — tworzenie nowego rekordu (auto-increment ID)

---

## SQL / Tabele

| Tabela | Operacje | Kontekst |
|---|---|---|
| `RECORDINGS` | SELECT, INSERT, UPDATE | Główna tabela — pełna konfiguracja zdarzenia |
| `FEEDS` | SELECT | Lookup nazwy feeda podcastowego po ID |
