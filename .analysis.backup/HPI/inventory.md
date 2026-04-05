---
phase: 2
artifact: HPI
artifact_name: librdhpi
status: done
completed_at: 2026-04-05
partial_count: 5
conflicts_found: 0
missing_coverage: 0
agent_version: 1.1.0
---

# Inventory: librdhpi

## Statystyki

| Typ | Liczba |
|-----|--------|
| Klasy lacznie | 5 |
| QMainWindow subclassy | 0 |
| QDialog subclassy | 0 |
| QWidget subclassy | 1 (Q3ListBox) |
| QObject subclassy (serwisy) | 3 |
| QAbstractItemModel subclassy | 0 |
| QThread subclassy | 0 |
| Plain C++ (bez QObject) | 1 |

---

## Klasy -- szczegolowy inwentarz

### RDHPIInformation

**Typ Qt:** Plain C++ (brak Q_OBJECT)
**Plik:** `rdhpiinformation.h` + `rdhpiinformation.cpp`
**Odpowiedzialnosc:** Kontener danych przechowujacy informacje identyfikacyjne i wersjonujace adaptera AudioScience HPI -- numer seryjny, wersje HPI SDK (major/minor/point zakodowane w uint32_t), wersje DSP, wersje PCB i numer montazu.

**Sygnaly:**
Brak -- klasa nie dziedziczy z QObject.

**Sloty:**
Brak -- klasa nie dziedziczy z QObject.

**Stan (Q_PROPERTY):**
Brak.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| serialNumber() | brak | Zwraca numer seryjny adaptera | - |
| setSerialNumber() | unsigned num | Ustawia numer seryjny | - |
| hpiVersion() | brak | Zwraca pelna wersje HPI jako uint32_t | - |
| setHpiVersion() | uint32_t ver | Ustawia pelna wersje HPI | - |
| hpiMajorVersion() | brak | Zwraca major (bity 16-31) | - |
| hpiMinorVersion() | brak | Zwraca minor (bity 8-15) | - |
| hpiPointVersion() | brak | Zwraca point (bity 0-7) | - |
| dspMajorVersion() / setDspMajorVersion() | unsigned | Wersja major DSP firmware | - |
| dspMinorVersion() / setDspMinorVersion() | unsigned | Wersja minor DSP firmware | - |
| pcbVersion() / setPcbVersion() | char | Wersja PCB (znak, np. 'A') | - |
| assemblyVersion() / setAssemblyVersion() | unsigned | Numer montazu karty | - |
| clear() | brak | Reset wszystkich pol do 0 (pcb='0') | - |

**Enums:**
Brak.

**Reguly biznesowe (z implementacji):**
- Wersja HPI jest przechowywana jako pojedynczy uint32_t z kodowaniem: major w bitach 16-31, minor w bitach 8-15, point w bitach 0-7.
- Domyslna wartosc pcbVersion po clear() to znak '0'.

**Linux-specific:**
Brak.

**Zaleznosci od innych klas tego artifaktu:**
Brak.

**Zaleznosci od shared libraries:**
Brak.

---

### RDHPIPlayStream

**Typ Qt:** QObject + RDWaveFile (wielodziedziczenie)
**Plik:** `rdhpiplaystream.h` + `rdhpiplaystream.cpp`
**Odpowiedzialnosc:** Odtwarzanie plikow WAV/MPEG przez strumienie wyjsciowe AudioScience HPI. Obsluguje play/pause/stop, pozycjonowanie (seek), kontrole predkosci z timescaling, automatyczne buforowanie fragmentow oraz raportowanie pozycji. Formaty: PCM 8/16/24/32-bit, MPEG L1/L2/L3, Vorbis (opcjonalnie).

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| isStopped(bool state) | state | Strumien zatrzymany (true) lub aktywny (false) |
| played() | brak | Odtwarzanie rozpoczete |
| paused() | brak | Odtwarzanie wstrzymane |
| stopped() | brak | Odtwarzanie calkowicie zatrzymane |
| position(int samples) | samples | Aktualna pozycja odtwarzania w probkach (~co 150ms) |
| stateChanged(int card, int stream, int state) | card, stream, state | Zmiana stanu (0=Stopped, 1=Playing, 2=Paused) |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| setCard(int card) | card | public | Ustawia karte (tylko gdy nie gra) |
| play() | brak | public | Rozpoczyna odtwarzanie |
| pause() | brak | public | Wstrzymuje odtwarzanie |
| stop() | brak | public | Calkowicie zatrzymuje odtwarzanie |
| currentPosition() | brak | public | Zwraca pozycje w probkach |
| setPosition(unsigned samples) | samples | public | Seek; jesli gra -- pause/seek/resume |
| setPlayLength(int length) | length (ms) | public | Limit czasu odtwarzania; po uplynieciu auto-pause |
| tickClock() | brak | public | Cykliczny timer: buforowanie fragmentow, wykrywanie EOF |

**Stan (Q_PROPERTY):**
Brak.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| errorString(Error) | err | Czytelny opis bledu | - |
| formatSupported(Format) | format | Czy karta obsluguje format | card_number >= 0 |
| openWave() / openWave(QString) | filename | Otwiera plik WAV + rezerwuje strumien HPI | - |
| closeWave() | brak | Zamyka plik + zwalnia strumien; jesli gra -- najpierw stop() | - |
| getCard() / getStream() | brak | Numery karty i strumienia | - |
| getSpeed() | brak | Aktualna predkosc (1000=1x) | - |
| setSpeed(int, bool, bool) | speed, pitch, rate | Ustawia predkosc z timescaling | patrz reguly |
| getState() | brak | Stopped/Playing/Paused | - |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| State | Stopped=0, Playing=1, Paused=2 | Stan odtwarzania |
| Error | Ok=0, NoFile=1, NoStream=2, AlreadyOpen=3 | Kody bledow |

**Reguly biznesowe (z implementacji):**
- Strumien HPI rezerwowany dynamicznie z puli za pomoca mutexu (stream_mutex).
- Timescaling wymaga wsparcia karty i jest w zakresie 83.3%-125%.
- Variable pitch + resampling: max +/- 4%. Variable pitch bez resamplingu: brak wsparcia.
- Fragment DMA = buffer_size/4, max 192000 bajtow.
- Pozycja emitowana co 3 ticki zegara (~150ms).
- Seek podczas play: automatyczny pause/reposition/resume.
- play_length > 0: jednorazowy timer, po uplynieciu auto-pause.
- Po EOF (HPI_STATE_DRAINED): automatyczne zamkniecie strumienia i emission stopped/position(0).
- MPEG seek oblicza pozycje bajtowa z AvgBytesPerSec (nie block-accurate).

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| asihpi/hpi.h | Interfejs strumienia wyjsciowego HPI | CRITICAL |
| syslog | Logowanie bledow HPI | MEDIUM |

**Zaleznosci od innych klas tego artifaktu:**
- RDHPISoundCard: sprawdzenie strumieni, timescaling, konfiguracja

**Zaleznosci od shared libraries:**
- librd::RDWaveFile: klasa bazowa -- obsluga plikow WAV/MPEG
- librd::RDApplication: logowanie syslog

---

### RDHPIRecordStream

**Typ Qt:** QObject + RDWaveFile (wielodziedziczenie)
**Plik:** `rdhpirecordstream.h` + `rdhpirecordstream.cpp`
**Odpowiedzialnosc:** Nagrywanie audio do plikow WAV/MPEG przez strumienie wejsciowe AudioScience HPI. Rozbudowana maszyna stanowa (5 stanow), VOX, ograniczenie dlugosci nagrania, buforowanie z karty HPI do pliku. Formaty: PCM 8/16/24/32-bit, MPEG L1/L2/L3, Vorbis.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| isStopped(bool state) | state | Strumien zatrzymany (true) lub aktywny (false) |
| ready() | brak | Strumien gotowy do nagrywania (RecordReady) |
| recording() | brak | Nagrywanie rozpoczete (komenda record) |
| recordStart() | brak | Pierwsze probki faktycznie nagrane (opozniony wzgledem recording) |
| paused() | brak | Nagrywanie wstrzymane |
| stopped() | brak | Nagrywanie calkowicie zatrzymane |
| position(int samples) | samples | Pozycja nagrywania w probkach (co 100ms) |
| stateChanged(int card, int stream, int state) | card, stream, state | Zmiana stanu (0=Recording, 1=RecordReady, 2=Paused, 3=Stopped, 4=RecordStarted) |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| setCard(int card) | card | public | Ustawia karte (tylko gdy nie nagrywa) |
| setStream(int stream) | stream | public | Ustawia strumien wejsciowy |
| recordReady() | brak | public | Przygotowuje nagrywanie: konfiguruje format, startuje strumien HPI |
| record() | brak | public | Rozpoczyna nagrywanie; jesli nie gotowy -- auto recordReady() |
| pause() | brak | public | Wstrzymuje nagrywanie (strumien HPI kontynuuje) |
| stop() | brak | public | Calkowicie zatrzymuje nagrywanie |
| setInputVOX(int gain) | gain | public | Ustawia prog VOX (deleguje do RDHPISoundCard) |
| setRecordLength(int length) | length (ms) | public | Limit dlugosci nagrania; po uplynieciu auto-pause |

**Stan (Q_PROPERTY):**
Brak.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| errorString(Error) | err | Czytelny opis bledu | - |
| createWave() / createWave(QString) | filename | Tworzy plik WAV + rezerwuje strumien HPI | - |
| closeWave() | brak | Zamyka plik (z poprawna liczba probek) + zwalnia strumien | - |
| formatSupported(Format) / formatSupported() | format | Czy karta obsluguje format | card_number >= 0 |
| getCard() / getStream() | brak | Numery karty i strumienia | - |
| haveInputVOX() | brak | Czy karta wspiera VOX na biezacym strumieniu | - |
| getState() | brak | Aktualny stan maszyny stanowej (5 stanow) | - |
| getPosition() | brak | Pozycja nagrywania w probkach | - |
| samplesRecorded() | brak | Calkowita liczba nagranych probek | - |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| RecordState | Recording=0, RecordReady=1, Paused=2, Stopped=3, RecordStarted=4 | Maszyna stanowa nagrywania (5-stanowa) |
| Error | Ok=0, NoFile=1, NoStream=2, AlreadyOpen=3 | Kody bledow |

**Reguly biznesowe (z implementacji):**
- Maszyna stanowa: Stopped -> RecordReady -> Recording -> RecordStarted -> Paused (i powroty).
- RecordStarted emitowany dopiero gdy samples_recorded > 0 (nie w momencie komendy record).
- Fragment DMA ograniczony do 192000 bajtow (kompatybilnosc ALSA).
- Timer zegara co 100ms (RDHPIRECORDSTREAM_CLOCK_INTERVAL).
- record_length > 0: jednorazowy timer, po uplynieciu auto-pause.
- Debug wlaczany zmienna srodowiskowa _RDHPIRECORDSTREAM, xrun przez _RSOUND_XRUN.
- Dla MPEG: konfiguracja MEXT chunk (homogenous=true, padding=false, hackedBitRate=true, freeFormat=false).
- closeWave() przekazuje samples_recorded do RDWaveFile::closeWave() dla poprawnego naglowka.
- Strumien wejsciowy otwierany bezposrednio po stream_number (nie z puli dynamicznej).

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| asihpi/hpi.h | Interfejs strumienia wejsciowego HPI | CRITICAL |
| syslog | Logowanie bledow HPI | MEDIUM |
| getenv() | Zmienne srodowiskowe debug/xrun | LOW |

**Zaleznosci od innych klas tego artifaktu:**
- RDHPISoundCard: sprawdzenie VOX, strumieni, konfiguracja

**Zaleznosci od shared libraries:**
- librd::RDWaveFile: klasa bazowa -- tworzenie/zapis plikow WAV/MPEG
- librd::RDApplication: logowanie syslog

---

### RDHPISoundCard

**Typ Qt:** QObject (Service)
**Plik:** `rdhpisoundcard.h` + `rdhpisoundcard.cpp`
**Odpowiedzialnosc:** Centralna klasa zarzadzania kartami dzwiekowymi AudioScience HPI. Wykrywa adaptery, inicjalizuje mixer, zapewnia sterowanie glosnoscia (stream/port/passthrough), odczyt miernikow audio, konfiguracje zrodla zegara, VOX, multiplekser zrodel wejsciowych, tryb kanalow i fade z profilami Linear/Log.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| inputPortError(int card, int port) | card, port | Zmiana stanu bledu AES/EBU na porcie wejsciowym |
| leftInputStreamMeter(int card, int stream, int level) | card, stream, level | Poziom audio L kanalu strumienia wejsciowego |
| leftOutputStreamMeter(int card, int stream, int level) | card, stream, level | Poziom audio L kanalu strumienia wyjsciowego |
| rightInputStreamMeter(int card, int stream, int level) | card, stream, level | Poziom audio R kanalu strumienia wejsciowego |
| rightOutputStreamMeter(int card, int stream, int level) | card, stream, level | Poziom audio R kanalu strumienia wyjsciowego |
| leftInputPortMeter(int card, int port, int level) | card, port, level | Poziom audio L kanalu portu wejsciowego |
| leftOutputPortMeter(int card, int port, int level) | card, port, level | Poziom audio L kanalu portu wyjsciowego |
| rightInputPortMeter(int card, int port, int level) | card, port, level | Poziom audio R kanalu portu wejsciowego |
| rightOutputPortMeter(int card, int port, int level) | card, port, level | Poziom audio R kanalu portu wyjsciowego |
| inputMode(int card, int port, ChannelMode mode) | card, port, mode | Zmiana trybu kanalu portu wejsciowego |
| outputMode(int card, int stream, ChannelMode mode) | card, stream, mode | Zmiana trybu kanalu strumienia wyjsciowego |
| tunerSubcarrierChanged(Subcarrier car, bool state) | car, state | Zmiana stanu subcarriera tunera |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| setInputVolume(int card, int stream, int level) | card, stream, level | public | Glosnosc strumienia wejsciowego (L=R) |
| setOutputVolume(int card, int stream, int port, int level) | card, stream, port, level | public | Glosnosc strumienia wyjsciowego na porcie |
| fadeOutputVolume(int card, int stream, int port, int level, int length) | card, stream, port, level, length | public | Fade glosnosci wyjsciowej (profil Linear/Log) |
| setInputLevel(int card, int port, int level) | card, port, level | public | Poziom wejsciowy na porcie |
| setOutputLevel(int card, int port, int level) | card, port, level | public | Poziom wyjsciowy na porcie |
| setInputMode(int card, int port, ChannelMode mode) | card, port, mode | public | Tryb kanalu wejsciowego |
| setOutputMode(int card, int stream, ChannelMode mode) | card, stream, mode | public | Tryb kanalu wyjsciowego |
| setInputStreamVOX(int card, int stream, short gain) | card, stream, gain | public | Prog VOX na strumieniu |
| havePassthroughVolume(int card, int in_port, int out_port) | card, in_port, out_port | public | Czy istnieje passthrough miedzy portami |
| setPassthroughVolume(int card, int in_port, int out_port, int level) | card, in_port, out_port, level | public | Glosnosc passthrough |
| clock() | brak | private | Timer 20ms: monitorowanie bledow AES/EBU |

**Stan (Q_PROPERTY):**
Brak.

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| driver() | brak | Typ drivera (zawsze Hpi) | - |
| hpiInformation(int card) | card | Metadane adaptera (RDHPIInformation) | - |
| getCardQuantity() | brak | Liczba wykrytych kart | - |
| getCardInputStreams/OutputStreams(int card) | card | Liczba strumieni I/O | - |
| getCardInputPorts/OutputPorts(int card) | card | Liczba portow I/O | - |
| getCardDescription(int card) | card | Opis karty ("AudioScience XXXX [N]") | - |
| setClockSource(int card, ClockSource) | card, src | Zrodlo zegara (Internal/AesEbu/SpDiff/WordClock) | - |
| haveTimescaling(int card) | card | Czy karta wspiera timescaling | card < HPI_MAX_ADAPTERS |
| haveInputVolume/OutputVolume(card, stream, port) | ... | Czy istnieje kontrola glosnosci | bounds check |
| inputStreamMeter/outputStreamMeter(card, stream, level*) | ... | Odczyt miernika audio | card/stream bounds |
| setFadeProfile(FadeProfile) | profile | Profil fade (Linear/Log) | - |
| getInputPortMux/setInputPortMux(card, port, ...) | ... | Multiplekser zrodel (LineIn/AesEbuIn) | - |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| FadeProfile | Linear=0, Log=1 | Profil krzywej fade |
| Channel | Left=0, Right=1 | Kanaly stereo |
| ChannelMode | Normal=0, Swap=1, LeftOnly=2, RightOnly=3 | Tryb routingu kanalow |
| DeviceClass | RecordDevice=0, PlayDevice=1 | Klasa urzadzenia |
| Driver | Alsa=0, Hpi=1, Jack=2 | Typ drivera audio |
| ClockSource | Internal=0, AesEbu=1, SpDiff=2, WordClock=4 | Zrodlo zegara |
| SourceNode | SourceBase=100..Mic=108 | Wezly zrodlowe mixera (HPI_SOURCENODE_*) |
| DestNode | DestBase=200..Speaker=205 | Wezly docelowe mixera (HPI_DESTNODE_*) |
| TunerBand | Fm=0, FmStereo=1, Am=2, Tv=3 | Pasmo tunera |
| Subcarrier | Mpx=0, Rds=1 | Typ subcarriera |

**Reguly biznesowe (z implementacji):**
- Poziomy glosnosci HPI: zakres 0-2400 (RDHPISOUNDCARD_HPI_MAX/MIN_LEVEL).
- Domyslny profil fade: Log.
- Karty 0x6xxx wspieraja timescaling (mask 0xF000 == 0x6000).
- Karty 0x5111/0x5211 uzywaja multipleksera strumieniowego; reszta portowego.
- Timer metering 20ms: monitoruje bledy AES/EBU, emituje inputPortError przy zmianie.
- Settery glosnosci ustawiaja oba kanaly L/R na identyczna wartosc.
- setInputPortMux akceptuje tylko LineIn i AesEbuIn.
- Walidacja bounds we wszystkich getterach metering.

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| asihpi/hpi.h | Caly interfejs karty HPI | CRITICAL |
| syslog | Logowanie bledow | MEDIUM |

**Zaleznosci od innych klas tego artifaktu:**
- RDHPIInformation: tablica hpi_info[HPI_MAX_ADAPTERS] z metadanymi adapterow

**Zaleznosci od shared libraries:**
- librd::RDConfig: konfiguracja logowania
- librd::RDApplication: logowanie syslog

---

### RDHPISoundSelector

**Typ Qt:** Q3ListBox (Qt3Support legacy widget)
**Plik:** `rdhpisoundselector.h` + `rdhpisoundselector.cpp`
**Odpowiedzialnosc:** Widget UI umozliwiajacy wybor urzadzenia audio (karty i portu). Wyswietla liste portow wejsciowych lub wyjsciowych wszystkich kart HPI. Emituje sygnaly z numerem karty i portu po wybraniu elementu.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| changed(int card, int port) | card, port | Uzytkownik wybral urzadzenie audio |
| cardChanged(int card) | card | Zmiana karty |
| portChanged(int port) | port | Zmiana portu |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| selection(int selection) | selection | private | Dekoduje indeks listy na (card, port), emituje sygnaly |

**Stan (Q_PROPERTY):**
Brak.

**Publiczne API:**
Brak dodatkowych metod poza konstruktorem.

**Enums:**
Brak wlasnych (uzywa RDHPISoundCard::DeviceClass).

**Reguly biznesowe (z implementacji):**
- Kodowanie indeksu listy: card * HPI_MAX_NODES + port.
- UWAGA: Dekodowanie uzywa HPI_MAX_ADAPTERS zamiast HPI_MAX_NODES -- prawdopodobny bug.
- Widget tworzy wlasna instancje RDHPISoundCard (nie wspoldzieli).

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Q3ListBox (Qt3Support) | Legacy widget -- wymaga migracji na QListWidget | HIGH |
| asihpi/hpi.h (posrednio) | Wykrywanie kart | CRITICAL |

**Zaleznosci od innych klas tego artifaktu:**
- RDHPISoundCard: tworzona lokalnie; enumeracja kart i portow

**Zaleznosci od shared libraries:**
- librd::RDConfig: konfiguracja

---

## Missing Coverage

| Klasa | Plik | Powod braku |
|-------|------|-------------|
| (brak) | - | Wszystkie 5 klas z discovery-state.md maja wpis |

---

## Conflicts

| ID | Klasa | Opis konfliktu | Status |
|----|-------|----------------|--------|
| (brak) | - | - | - |
