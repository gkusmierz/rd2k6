---
partial_id: "004"
artifact: HPI
class_name: RDHPIRecordStream
header_file: rdhpi/rdhpirecordstream.h
source_file: rdhpi/rdhpirecordstream.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHPIRecordStream

## Typ Qt
Service (QObject) + RDWaveFile (wielodziedziczenie) -- strumien nagrywania audio HPI

## Odpowiedzialnosc (WHAT)
Nagrywanie audio do plikow WAV/MPEG przez strumienie wejsciowe AudioScience HPI. Obsluguje cykl zycia nagrywania z rozbudowana maszyna stanowa (Stopped -> RecordReady -> Recording -> RecordStarted -> Paused -> Stopped). Zapewnia VOX (voice-operated switch), ograniczenie dlugosci nagrania, buforowanie danych z karty HPI do pliku oraz raportowanie pozycji nagrywania. Obsluguje formaty PCM 8/16/24/32-bit, MPEG Layer 1/2/3 i Vorbis.

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| isStopped(bool state) | state | Informuje czy strumien jest zatrzymany (true) lub aktywny (false) |
| ready() | brak | Strumien jest gotowy do nagrywania (RecordReady -- HPI stream jest otwarty i skonfigurowany) |
| recording() | brak | Nagrywanie zostalo rozpoczete (komenda record() wykonana) |
| recordStart() | brak | Pierwsze probki audio zostaly faktycznie nagrane (samples_recorded > 0) -- opózniony wzgledem recording() |
| paused() | brak | Nagrywanie zostalo wstrzymane |
| stopped() | brak | Nagrywanie zostalo calkowicie zatrzymane |
| position(int samples) | samples | Aktualna pozycja nagrywania w probkach (emitowany cyklicznie co tick zegara) |
| stateChanged(int card, int stream, int state) | card, stream, state | Zmiana stanu nagrywania (0=Recording, 1=RecordReady, 2=Paused, 3=Stopped, 4=RecordStarted) |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| setCard(int card) | card | public | Ustawia numer karty (tylko gdy nie trwa nagrywanie) |
| setStream(int stream) | stream | public | Ustawia numer strumienia wejsciowego |
| recordReady() | brak | public | Przygotowuje nagrywanie: konfiguruje format HPI, uruchamia strumien wejsciowy, startuje timer |
| record() | brak | public | Rozpoczyna faktyczne nagrywanie; jesli nie gotowy -- automatycznie wywoluje recordReady() |
| pause() | brak | public | Wstrzymuje nagrywanie; zachowuje dane, strumien HPI kontynuuje (ready do resume) |
| stop() | brak | public | Calkowicie zatrzymuje nagrywanie i zwalnia bufory |
| setInputVOX(int gain) | gain | public | Ustawia prog VOX na karcie dzwiekowej (deleguje do RDHPISoundCard) |
| setRecordLength(int length) | length (ms) | public | Ustawia maksymalna dlugosc nagrania; po uplynieciu automatycznie pause() |
| tickClock() | brak | private | Cykliczny callback (co 100ms): odczytuje dane z HPI, zapisuje do pliku, emituje pozycje |

## Stan (Q_PROPERTY)
Brak.

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| errorString(Error err) | err | Zwraca czytelny opis bledu | - |
| createWave() | brak | Tworzy plik WAV i rezerwuje strumien HPI wejsciowy | nazwa pliku ustawiona |
| createWave(QString filename) | filename | Tworzy konkretny plik WAV | - |
| closeWave() | brak | Zamyka plik (z poprawna liczba probek) i zwalnia strumien; jesli trwa nagrywanie -- najpierw stop() | - |
| formatSupported(Format format) | format | Sprawdza czy karta HPI obsluguje dany format nagrywania | card_number >= 0 |
| formatSupported() | brak | Sprawdza czy biezacy format jest obslugiwany | - |
| getCard() | brak | Zwraca numer karty | - |
| getStream() | brak | Zwraca numer strumienia | - |
| haveInputVOX() | brak | Sprawdza czy karta wspiera VOX na biezacym strumieniu | - |
| getState() | brak | Zwraca aktualny stan maszyny stanowej nagrywania | - |
| getPosition() | brak | Zwraca aktualna pozycje nagrywania w probkach | - |
| samplesRecorded() | brak | Zwraca calkowita liczbe nagranych probek | - |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| RecordState | Recording=0, RecordReady=1, Paused=2, Stopped=3, RecordStarted=4 | Stan maszyny stanowej nagrywania (5-stanowa) |
| Error | Ok=0, NoFile=1, NoStream=2, AlreadyOpen=3 | Kody bledow operacji na strumieniu |

## Reguly biznesowe (z implementacji)
- Regula: Maszyna stanowa nagrywania ma 5 stanow: Stopped -> RecordReady (strumien HPI otwarty, monitorowanie) -> Recording (komenda record) -> RecordStarted (pierwsza probka nagrana) -> Paused (wstrzymany, strumien dalej otwarty).
- Zrodlo: getState(), recordReady(), record(), pause(), stop()
- Regula: RecordStarted jest emitowany dopiero gdy samples_recorded > 0 (pierwsza faktyczna probka audio), nie w momencie komendy record().
- Zrodlo: tickClock()
- Regula: Fragment DMA jest ograniczony do 192000 bajtow (kompatybilnosc z ALSA).
- Zrodlo: recordReady()
- Regula: Timer zegara nagrywania dziala co 100ms (RDHPIRECORDSTREAM_CLOCK_INTERVAL).
- Zrodlo: konstruktor, tickClock()
- Regula: record_length > 0 uruchamia jednorazowy timer ktory po uplynieciu automatycznie wywoluje pause().
- Zrodlo: tickClock(), length_timer
- Regula: Tryb debug mozna wlaczyc zmienna srodowiskowa _RDHPIRECORDSTREAM.
- Zrodlo: konstruktor
- Regula: Tryb xrun notification mozna wlaczyc zmienna srodowiskowa _RSOUND_XRUN.
- Zrodlo: konstruktor
- Regula: Dla MPEG nagrywanie konfiguruje MEXT chunk z parametrami: homogenous=true, padding=false, hackedBitRate=true, freeFormat=false.
- Zrodlo: recordReady()
- Regula: closeWave() przekazuje samples_recorded do RDWaveFile::closeWave() aby poprawnie zapisac naglowek WAV.
- Zrodlo: closeWave()
- Regula: Strumien wejsciowy jest otwierany bezposrednio po numerze stream_number (nie dynamicznie z puli jak w PlayStream).
- Zrodlo: GetStream()

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| syslog (via RDApplication::syslog) | Logowanie bledow HPI | MEDIUM |
| asihpi/hpi.h (AudioScience HPI SDK) | Caly interfejs strumienia wejsciowego HPI | CRITICAL |
| sys/types.h, sys/stat.h, unistd.h | POSIX headers | LOW |
| Zmienne srodowiskowe (_RDHPIRECORDSTREAM, _RSOUND_XRUN) | Wlaczanie trybu debug przez getenv() | LOW |

## Zaleznosci od innych klas tego artifaktu
- RDHPISoundCard: przekazywany w konstruktorze; uzywany do: sprawdzenia VOX, liczby strumieni, konfiguracji

## Zaleznosci od shared libraries
- librd::RDWaveFile: klasa bazowa (wielodziedziczenie) -- tworzenie/zapis plikow WAV/MPEG
- librd::RDApplication: logowanie bledow przez syslog
