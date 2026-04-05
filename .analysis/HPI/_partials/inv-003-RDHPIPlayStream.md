---
partial_id: "003"
artifact: HPI
class_name: RDHPIPlayStream
header_file: rdhpi/rdhpiplaystream.h
source_file: rdhpi/rdhpiplaystream.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHPIPlayStream

## Typ Qt
Service (QObject) + RDWaveFile (wielodziedziczenie) -- strumien odtwarzania audio HPI

## Odpowiedzialnosc (WHAT)
Odtwarzanie plikow WAV/MPEG przez strumienie wyjsciowe AudioScience HPI. Obsluguje cykl zycia odtwarzania (play/pause/stop), pozycjonowanie w pliku (seek), kontrole predkosci z timescaling, automatyczne buforowanie fragmentow do karty HPI oraz raportowanie pozycji odtwarzania. Obsluguje formaty PCM 8/16/24/32-bit, MPEG Layer 1/2/3 i Vorbis (opcjonalnie).

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| isStopped(bool state) | state | Informuje czy strumien jest zatrzymany (true) lub aktywny (false) |
| played() | brak | Odtwarzanie zostalo rozpoczete |
| paused() | brak | Odtwarzanie zostalo wstrzymane |
| stopped() | brak | Odtwarzanie zostalo calkowicie zatrzymane |
| position(int samples) | samples | Aktualna pozycja odtwarzania w probkach (emitowany cyklicznie co ~3 ticki zegara) |
| stateChanged(int card, int stream, int state) | card, stream, state | Zmiana stanu odtwarzania na konkretnej karcie/strumieniu (0=Stopped, 1=Playing, 2=Paused) |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| setCard(int card) | card | public | Ustawia numer karty dzwiekowej (tylko gdy nie trwa odtwarzanie) |
| play() | brak | public | Rozpoczyna odtwarzanie: otwiera strumien HPI, konfiguruje format, buforuje pierwszy fragment, startuje timer | 
| pause() | brak | public | Wstrzymuje odtwarzanie: zatrzymuje strumien HPI, zachowuje pozycje pending samples |
| stop() | brak | public | Calkowicie zatrzymuje odtwarzanie: resetuje strumien, pozycje i bufory |
| currentPosition() | brak | public | Zwraca aktualna pozycje w probkach (samples_played + samples_skipped) |
| setPosition(unsigned samples) | samples | public | Ustawia pozycje odtwarzania (seek); jesli odtwarzanie trwa -- pause/seek/resume |
| setPlayLength(int length) | length (ms) | public | Ustawia maksymalny czas odtwarzania w ms; po uplynieciu automatycznie wykonuje pause() |
| tickClock() | brak | public | Cykliczny callback timera: buforuje kolejne fragmenty do karty HPI, wykrywa koniec pliku, emituje position co 3 ticki |

## Stan (Q_PROPERTY)
Brak.

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| errorString(Error err) | err | Zwraca czytelny opis bledu | - |
| formatSupported(Format format) | format | Sprawdza czy karta HPI obsluguje dany format audio | card_number >= 0 |
| formatSupported() | brak | Sprawdza czy biezacy format otworzonego pliku jest obslugiwany | plik musi byc otwarty |
| openWave() | brak | Otwiera plik WAV i rezerwuje strumien HPI | wave_name ustawione |
| openWave(QString filename) | filename | Otwiera konkretny plik WAV | - |
| closeWave() | brak | Zamyka plik i zwalnia strumien HPI; jesli trwa odtwarzanie -- najpierw stop() | - |
| getCard() | brak | Zwraca numer karty | - |
| getStream() | brak | Zwraca numer strumienia HPI (przydzielony dynamicznie) | - |
| getSpeed() | brak | Zwraca aktualna predkosc odtwarzania (1000 = normalna, 1x) | - |
| setSpeed(int speed, bool pitch, bool rate) | speed, pitch, rate | Ustawia predkosc odtwarzania z timescaling | patrz reguly ponizej |
| getState() | brak | Zwraca aktualny stan: Stopped/Playing/Paused | - |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| State | Stopped=0, Playing=1, Paused=2 | Stan maszyny stanowej odtwarzania |
| Error | Ok=0, NoFile=1, NoStream=2, AlreadyOpen=3 | Kody bledow operacji na strumieniu |

## Reguly biznesowe (z implementacji)
- Regula: Strumien HPI jest rezerwowany dynamicznie z puli dostepnych strumieni wyjsciowych karty za pomoca lokalnego mutexu (stream_mutex). Pierwszy wolny strumien jest przydzielany.
- Zrodlo: GetStream()
- Regula: Timescaling wymaga wsparcia karty (haveTimescaling) i jest ograniczony do zakresu 83300-125000 (83.3%-125% normalnej predkosci).
- Zrodlo: setSpeed()
- Regula: Zmiana predkosci z pitch=true i rate=true (variable pitch + resampling) ograniczona do +/- 4% (96000-104000).
- Zrodlo: setSpeed()
- Regula: Zmiana predkosci z pitch=true i rate=false (variable pitch bez resamplingu) nie jest obslugiwana.
- Zrodlo: setSpeed()
- Regula: Fragment DMA jest obliczany jako buffer_size/4, ale nie wiekszy niz MAX_FRAGMENT_SIZE (192000 bajtow).
- Zrodlo: play()
- Regula: Pozycja jest emitowana co 3 ticki zegara (~150ms przy FRAGMENT_TIME=50ms).
- Zrodlo: tickClock()
- Regula: Seek podczas odtwarzania powoduje automatyczne pause/reposition/resume (restart_transport).
- Zrodlo: setPosition()
- Regula: play_length > 0 uruchamia jednorazowy timer ktory po uplynieciu czasu automatycznie wywoluje pause().
- Zrodlo: play(), play_timer
- Regula: Po naturalnym zakonczeniu pliku (HPI_STATE_DRAINED) strumien jest automatycznie zamykany i emitowane sa sygnaly stopped/position(0).
- Zrodlo: tickClock()
- Regula: Dla formatu MPEG seek oblicza pozycje bajtowa na podstawie AvgBytesPerSec (nie block-accurate).
- Zrodlo: setPosition()

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| syslog (via RDApplication::syslog) | Logowanie bledow HPI | MEDIUM |
| asihpi/hpi.h (AudioScience HPI SDK) | Caly interfejs strumienia wyjsciowego HPI | CRITICAL |
| sys/types.h, sys/stat.h, unistd.h | POSIX headers (typy systemowe) | LOW |

## Zaleznosci od innych klas tego artifaktu
- RDHPISoundCard: przekazywany w konstruktorze; uzywany do: sprawdzenia liczby strumieni, wsparcia timescaling, konfiguracji

## Zaleznosci od shared libraries
- librd::RDWaveFile: klasa bazowa (wielodziedziczenie) -- obsluga plikow WAV/MPEG
- librd::RDApplication: logowanie bledow przez syslog
- librd::RDConfig: konfiguracja (przez sound_card->config())
