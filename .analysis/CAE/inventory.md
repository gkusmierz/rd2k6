---
phase: 2
artifact: CAE
artifact_name: caed (Core Audio Engine daemon)
status: done
completed_at: 2026-04-05
partial_count: 3
conflicts_found: 0
missing_coverage: 0
agent_version: 1.1.0
---

# Inventory: caed (Core Audio Engine daemon)

## Statystyki

| Typ | Liczba |
|-----|--------|
| Klasy lacznie | 3 |
| QMainWindow subclassy | 0 |
| QDialog subclassy | 0 |
| QWidget subclassy | 0 |
| QObject subclassy (serwisy) | 2 |
| QAbstractItemModel subclassy | 0 |
| QThread subclassy | 0 |
| Plain C++ (value objects) | 1 |

---

## Klasy -- szczegolowy inwentarz

### CaeServer

**Typ Qt:** QObject (Service)
**Plik:** `cae/cae_server.h` + `cae/cae_server.cpp`
**Odpowiedzialnosc:** Serwer sieciowy TCP daemona caed. Nasluchuje na porcie, przyjmuje polaczenia klientow, parsuje protokol tekstowy (komendy rozdzielane '!'), autentykuje klientow haslem, i emituje sygnaly z zwalidowanymi zadaniami. Zarzadza multipleksowaniem polaczen i stanem metrowania per klient.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| connectionDropped | int id | Klient rozlaczyl sie -- MainObject musi zwolnic zasoby |
| loadPlaybackReq | int id, unsigned card, const QString &name | Zadanie zaladowania pliku audio do odtwarzania (LP) |
| unloadPlaybackReq | int id, unsigned handle | Zwolnienie strumienia playback (UP) |
| playPositionReq | int id, unsigned handle, unsigned pos | Seek w strumieniu (PP) |
| playReq | int id, unsigned handle, unsigned length, unsigned speed, unsigned pitch_flag | Rozpoczecie odtwarzania z timescaling (PY) |
| stopPlaybackReq | int id, unsigned handle | Zatrzymanie odtwarzania (SP) |
| timescalingSupportReq | int id, unsigned card | Zapytanie o timescaling (TS) |
| loadRecordingReq | int id, unsigned card, unsigned port, unsigned coding, unsigned channels, unsigned samprate, unsigned bitrate, const QString &name | Przygotowanie nagrywania (LR) |
| unloadRecordingReq | int id, unsigned card, unsigned stream | Zakonczenie nagrywania (UR) |
| recordReq | int id, unsigned card, unsigned stream, unsigned len, int threshold_level | Rozpoczecie nagrywania z progiem VOX (RD) |
| stopRecordingReq | int id, unsigned card, unsigned stream | Zatrzymanie nagrywania (SR) |
| setInputVolumeReq | int id, unsigned card, unsigned stream, int level | Glosnosc wejscia (IV) |
| setOutputVolumeReq | int id, unsigned card, unsigned stream, unsigned port, int level | Glosnosc wyjscia (OV) |
| fadeOutputVolumeReq | int id, unsigned card, unsigned stream, unsigned port, int level, unsigned length | Fade glosnosci (FV) |
| setInputLevelReq | int id, unsigned card, unsigned port, int level | Poziom wejscia hardware (IL) |
| setOutputLevelReq | int id, unsigned card, unsigned port, int level | Poziom wyjscia hardware (OL) |
| setInputModeReq | int id, unsigned card, unsigned stream, unsigned mode | Tryb wejscia mono/stereo (IM) |
| setOutputModeReq | int id, unsigned card, unsigned stream, unsigned mode | Tryb wyjscia mono/stereo (OM) |
| setInputVoxLevelReq | int id, unsigned card, unsigned stream, int level | Prog VOX (IX) |
| setInputTypeReq | int id, unsigned card, unsigned port, unsigned type | Typ wejscia analog/digital (IT) |
| getInputStatusReq | int id, unsigned card, unsigned port | Status wejscia (IS) |
| setAudioPassthroughLevelReq | int id, unsigned card, unsigned input, unsigned output, int level | Passthrough input->output (AL) |
| setClockSourceReq | int id, unsigned card, int input | Zrodlo zegara sync (CS) |
| setOutputStatusFlagReq | int id, unsigned card, unsigned port, unsigned stream, bool state | Flaga statusu wyjscia (OS) |
| openRtpCaptureChannelReq | int id, unsigned card, unsigned port, uint16_t udp_port, unsigned samprate, unsigned chans | Kanal RTP (niezaimplementowane) |
| meterEnableReq | int id, uint16_t udp_port, const QList<unsigned> &cards | Wlaczenie metrow (ME) |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| newConnectionData | - | private | Akceptuje nowe polaczenie TCP, tworzy CaeServerConnection |
| readyReadData | int id | private | Parsuje dane z socketa, przy '!' wywoluje ProcessCommand |
| connectionClosedData | int id | private | Emituje connectionDropped, czysci polaczenie |

**Stan (Q_PROPERTY):**
| Property | Typ | NOTIFY sygnal |
|----------|-----|--------------|
| Brak | --- | --- |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| connectionIds | - | Lista ID aktywnych polaczen | Zawsze |
| peerAddress | int id | Adres IP klienta | Polaczenie istnieje |
| peerPort | int id | Port klienta | Polaczenie istnieje |
| meterPort | int id | Port UDP metrow klienta | Polaczenie istnieje |
| setMeterPort | int id, uint16_t port | Ustawia port UDP metrow | Polaczenie istnieje |
| metersEnabled | int id, unsigned card | Czy metering wlaczony per karta | Polaczenie istnieje |
| setMetersEnabled | int id, unsigned card, bool state | Wl/wyl metering per karta | Polaczenie istnieje |
| listen | QHostAddress &addr, uint16_t port | Rozpoczyna nasluchiwanie TCP | Przed startem |
| sendCommand (broadcast) | const QString &cmd | Wysyla do WSZYSTKICH authenticated klientow | Klienci polaczeni |
| sendCommand (unicast) | int id, const QString &cmd | Wysyla do konkretnego klienta | Polaczenie istnieje |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak | --- | --- |

**Reguly biznesowe (z implementacji):**
- Protokol tekstowy: komendy to ciagi znakow zakonczne '!', CR/LF ignorowane
- 24 kody komend (2-literowe): LP, UP, PP, PY, SP, TS, LR, UR, RD, SR, IV, OV, FV, IL, OL, IM, OM, IX, IT, IS, AL, CS, OS, ME, PW, DC
- Komenda PW (password) jest jedyna dostepna bez autentykacji
- Komenda DC zamyka polaczenie natychmiast (reszta bufora ignorowana)
- Walidacja: sprawdzane sa liczba argumentow, zakresy (card<RD_MAX_CARDS, port<RD_MAX_PORTS, stream<RD_MAX_STREAMS, coding<5, chans<=2, mode<=3, type<=1)
- Broadcast sendCommand wysyla tylko do authenticated klientow
- Polaczenia identyfikowane przez socket descriptor (int)

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Brak | Platform-agnostic (Qt TCP) | --- |

**Zaleznosci od innych klas tego artifaktu:**
- CaeServerConnection: value object stanu polaczenia

**Zaleznosci od shared libraries:**
- RDConfig (librd): haslo autentykacji
- RDApplication (librd): syslog

---

### CaeServerConnection

**Typ Qt:** plain C++ (brak QObject)
**Plik:** `cae/cae_server.h` + `cae/cae_server.cpp`
**Odpowiedzialnosc:** Value object przechowujacy stan jednego polaczenia TCP z klientem. Zawiera socket, flage autentykacji, akumulator parsowania komend, port UDP metrow i tablice flag metrowania per karta.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| Brak | --- | Nie jest QObject |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| Brak | --- | --- | Nie jest QObject |

**Stan (Q_PROPERTY):**
| Property | Typ | NOTIFY sygnal |
|----------|-----|--------------|
| Brak | --- | --- |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| CaeServerConnection | QTcpSocket *sock | Inicjalizuje: authenticated=false, accum="", meter_port=0, all meters disabled | Socket aktywny |

**Pola publiczne (data members):**
| Pole | Typ | Znaczenie |
|------|-----|-----------|
| socket | QTcpSocket* | Polaczenie TCP z klientem |
| authenticated | bool | Czy przeszedl autentykacje PW |
| accum | QString | Akumulator do parsowania komend |
| meter_port | uint16_t | Port UDP metrow (0=wylaczony) |
| meters_enabled | bool[RD_MAX_CARDS] | Flaga metrowania per karta |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak | --- | --- |

**Reguly biznesowe (z implementacji):**
- Nowe polaczenie jest domyslnie nieautentykowane
- Metering domyslnie wylaczony na wszystkich kartach
- Socket zarzadzany przez Qt (deleteLater w destruktorze)

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Brak | --- | --- |

**Zaleznosci od innych klas tego artifaktu:**
- Brak (uzywana przez CaeServer)

**Zaleznosci od shared libraries:**
- rd.h: stala RD_MAX_CARDS

---

### MainObject

**Typ Qt:** QObject (Service) -- headless daemon, QCoreApplication
**Plik:** `cae/cae.h` + `cae/cae.cpp` + `cae/cae_alsa.cpp` + `cae/cae_hpi.cpp` + `cae/cae_jack.cpp`
**Odpowiedzialnosc:** Glowna klasa daemona caed. Przyjmuje polecenia od klientow (przez CaeServer) i dispatchuje je do odpowiedniego drivera audio (HPI/JACK/ALSA). Zarzadza cyklem zycia strumieni playback i recording, kontroluje mikser, wysyla metry przez UDP, oraz auto-provisionuje stacje w bazie danych.

**Sygnaly:**
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| Brak | --- | MainObject nie emituje sygnalow -- jest koncowym odbiorca |

**Sloty:**
| Slot | Parametry | Widocznosc | Efekt |
|------|-----------|------------|-------|
| loadPlaybackData | int id, unsigned card, const QString &name | private | Laduje plik audio do playback na karcie, przydziela handle |
| unloadPlaybackData | int id, unsigned handle | private | Zwalnia strumien playback i handle |
| playPositionData | int id, unsigned handle, unsigned pos | private | Seek w strumieniu |
| playData | int id, unsigned handle, unsigned length, unsigned speed, unsigned pitch_flag | private | Rozpoczyna odtwarzanie (opcjonalny timescaling) |
| stopPlaybackData | int id, unsigned handle | private | Zatrzymuje odtwarzanie |
| timescalingSupportData | int id, unsigned card | private | Sprawdza timescaling support |
| loadRecordingData | int id, unsigned card, unsigned port, unsigned coding, unsigned channels, unsigned samprate, unsigned bitrate, const QString &name | private | Przygotowuje nagrywanie (tworzy plik audio) |
| unloadRecordingData | int id, unsigned card, unsigned stream | private | Finalizuje nagrywanie, zwraca dlugosc w ms |
| recordData | int id, unsigned card, unsigned stream, unsigned len, int threshold_level | private | Rozpoczyna nagrywanie z progiem VOX |
| stopRecordingData | int id, unsigned card, unsigned stream | private | Zatrzymuje nagrywanie |
| setInputVolumeData | int id, unsigned card, unsigned stream, int level | private | Glosnosc wejscia per stream |
| setOutputVolumeData | int id, unsigned card, unsigned stream, unsigned port, int level | private | Glosnosc wyjscia per stream+port |
| fadeOutputVolumeData | int id, unsigned card, unsigned stream, unsigned port, int level, unsigned length | private | Fade glosnosci w zadanym czasie |
| setInputLevelData | int id, unsigned card, unsigned port, int level | private | Poziom wejscia hardware |
| setOutputLevelData | int id, unsigned card, unsigned port, int level | private | Poziom wyjscia hardware |
| setInputModeData | int id, unsigned card, unsigned stream, unsigned mode | private | Tryb wejscia (mono/stereo/L/R) |
| setOutputModeData | int id, unsigned card, unsigned stream, unsigned mode | private | Tryb wyjscia (mono/stereo/L/R) |
| setInputVoxLevelData | int id, unsigned card, unsigned stream, int level | private | Prog VOX |
| setInputTypeData | int id, unsigned card, unsigned port, unsigned type | private | Typ wejscia (analog/AES-EBU) |
| getInputStatusData | int id, unsigned card, unsigned port | private | Odpytanie statusu wejscia |
| setAudioPassthroughLevelData | int id, unsigned card, unsigned input, unsigned output, int level | private | Passthrough routing |
| setClockSourceData | int id, unsigned card, int input | private | Zrodlo zegara sync |
| setOutputStatusFlagData | int id, unsigned card, unsigned port, unsigned stream, bool state | private | Flaga statusu wyjscia |
| openRtpCaptureChannelData | int id, unsigned card, unsigned port, uint16_t udp_port, unsigned samprate, unsigned chans | private | [STUB niezaimplementowany] |
| meterEnableData | int id, uint16_t udp_port, const QList<unsigned> &cards | private | Wlacza metering UDP |
| statePlayUpdate | int card, int stream, int state | private | Callback drivera -- zmiana stanu play (1=playing, 2=paused, 0=stopped) |
| stateRecordUpdate | int card, int stream, int state | private | Callback drivera -- zmiana stanu record (0=recording, 4=started, 2=paused, 3=stopped) |
| updateMeters | - | private | Timer -- odpytuje metry, pozycje, statusy; graceful shutdown |
| connectionDroppedData | int id | private | Czysci zasoby rozlaczonego klienta |
| jackStopTimerData | int stream | private | Timer JACK -- stop po timeout |
| jackFadeTimerData | int stream | private | Timer JACK -- krok fade |
| jackRecordTimerData | int stream | private | Timer JACK -- monitoring nagrywania |
| jackClientStartData | - | private | Uruchamia klienty JACK z bazy danych |
| alsaStopTimerData | int cardstream | private | Timer ALSA -- stop po timeout |
| alsaFadeTimerData | int cardstream | private | Timer ALSA -- krok fade |
| alsaRecordTimerData | int cardport | private | Timer ALSA -- monitoring nagrywania |

**Stan (Q_PROPERTY):**
| Property | Typ | NOTIFY sygnal |
|----------|-----|--------------|
| Brak | --- | --- |

**Publiczne API:**
| Metoda | Parametry | Efekt | Warunki wywolania |
|--------|-----------|-------|------------------|
| MainObject | QObject *parent, const char *name | Inicjalizuje daemon: config, DB, CaeServer, drivery, ProbeCaps, InitMixers, timer metrow, realtime scheduling | Raz przy starcie |

**Enums:**
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak wlasnych | Uzywa RDStation::AudioDriver (None, Hpi, Jack, Alsa) | Identyfikacja drivera per karta |

**Reguly biznesowe (z implementacji):**
- Kazda karta (0..RD_MAX_CARDS-1) ma dokladnie jeden driver (HPI/JACK/ALSA/None); dispatch przez switch(cae_driver[card])
- Strumienie playback identyfikowane przez handle (0-255) mapujacy na (card, stream)
- Tylko wlasciciel strumienia (play_owner/record_owner == id) moze na nim operowac
- Przed nagrywaniem plik audio jest usuwany (unlink) aby nie zaklocic trwajacych odtworzen
- Odpowiedz to echo komendy + "+!" (sukces) lub "-!" (blad)
- Przy rozlaczeniu klienta WSZYSTKIE jego strumienie sa automatycznie zwalniane (KillSocket)
- Metering cykliczny (RD_METER_UPDATE_INTERVAL), UDP do klientow z wlaczonym metering
- updateMeters() obsluguje graceful shutdown (sprawdza flage `exiting`)
- Auto-provisioning stacji i serwisu w bazie danych przy starcie (InitProvisioning)
- Mikser inicjalizowany z bazy (RDAudioPort): passthrough na mute, typy, poziomy, tryby
- Realtime scheduling (SCHED_FIFO) z mlockall() -- opcjonalne, konfigurowane
- Kodeki MPEG ladowane dynamicznie (dlopen) -- brak nie blokuje startu
- Timescaling wymaga SoundTouch i wsparcia drivera
- Dlugosc nagrania konwertowana z sampli na ms (len*1000/system_sample_rate)

**Linux-specific:**
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| ALSA (libasound) | Driver audio -- PCM playback/capture | CRITICAL |
| JACK (libjack) | Driver audio -- serwer, port routing, callbacks | CRITICAL |
| AudioScience HPI | Driver audio -- profesjonalne karty broadcast | CRITICAL |
| pthread | Realtime scheduling (SCHED_FIFO), watkowanie ALSA | CRITICAL |
| mlockall | Blokowanie pamieci w trybie realtime | HIGH |
| syslog | Logowanie systemowe | HIGH |
| dlopen/dlsym | Dynamiczne ladowanie kodeków (twolame, mad, lame, faad, mp4v2) | HIGH |
| SoundTouch | Timescaling (zmiana predkosci z korekcja pitcha) | MEDIUM |
| signal (POSIX) | Obsluga SIGINT/SIGTERM/SIGHUP | MEDIUM |
| QProcess | Uruchamianie serwera JACK i klientow JACK | MEDIUM |
| /proc/ | Sprawdzanie czy daemon jest uruchomiony | LOW |

**Zaleznosci od innych klas tego artifaktu:**
- CaeServer: dostarcza polecenia jako sygnaly, MainObject je obsluguje; odpowiedzi przez sendCommand()

**Zaleznosci od shared libraries:**
- RDConfig (librd): konfiguracja systemu, nazwa stacji, MySQL, sciezka audio, haslo
- RDStation (librd): reprezentacja stacji, driver per karta, capabilities
- RDSystem (librd): system_sample_rate
- RDAudioPort (librd): konfiguracja miksera per port
- RDCmdSwitch (librd): parsing CLI args
- RDSqlQuery (librd): zapytania SQL (provisioning)
- RDWaveFile (librd): obsluga plikow audio
- RDSvc (librd): tworzenie serwisu
- RDApplication (librd): syslog wrapper
- RDHPISoundCard, RDHPIPlayStream, RDHPIRecordStream (librdhpi): HPI driver

---

## Missing Coverage

| Klasa | Plik | Powod braku |
|-------|------|-------------|
| (brak) | --- | Wszystkie 3 klasy z discovery-state.md maja wpisy |

---

## Conflicts

| ID | Klasa | Opis konfliktu | Status |
|----|-------|----------------|--------|
| (brak) | --- | --- | --- |
