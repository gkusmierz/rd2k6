---
partial_id: 001
artifact: CAE
class_name: MainObject
header_file: cae/cae.h
source_file: cae/cae.cpp (+ cae/cae_alsa.cpp, cae/cae_hpi.cpp, cae/cae_jack.cpp)
phase: 2
status: done
agent_version: 1.1.0
---

# MainObject

## Typ Qt
QObject (Service) -- headless daemon, uses QCoreApplication (no GUI)

## Odpowiedzialnosc (WHAT)
Glowna klasa daemona caed -- silnik audio Rivendell. Przyjmuje polecenia od klientow sieciowych (przez CaeServer) i dispatchuje je do odpowiedniego drivera audio (HPI, JACK lub ALSA). Zarzadza cyklem zycia strumieni playback i recording, kontroluje mikser (volume, level, mode, passthrough), wysyla aktualizacje metrow przez UDP, oraz wykonuje provisioning stacji i serwisow w bazie danych przy starcie.

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| Brak | --- | MainObject nie emituje sygnalow -- jest koncowym odbiorca sygnalow z CaeServer |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| loadPlaybackData | int id, unsigned card, const QString &name | private | Laduje plik audio do strumienia playback na wskazanej karcie, przydziela handle, odpowiada klientowi z numerem strumienia/handle |
| unloadPlaybackData | int id, unsigned handle | private | Zwalnia strumien playback i handle, konczy odtwarzanie |
| playPositionData | int id, unsigned handle, unsigned pos | private | Ustawia pozycje odtwarzania (seek) w strumieniu |
| playData | int id, unsigned handle, unsigned length, unsigned speed, unsigned pitch_flag | private | Rozpoczyna odtwarzanie z opcjonalnym timescalingiem (speed/pitch) |
| stopPlaybackData | int id, unsigned handle | private | Zatrzymuje odtwarzanie strumienia |
| timescalingSupportData | int id, unsigned card | private | Sprawdza czy karta wspiera timescaling (zmiane predkosci z korekcja pitcha) |
| loadRecordingData | int id, unsigned card, unsigned port, unsigned coding, unsigned channels, unsigned samprate, unsigned bitrate, const QString &name | private | Przygotowuje nagrywanie -- tworzy plik audio z wybranymi parametrami (kodek, kanaly, sample rate, bitrate) |
| unloadRecordingData | int id, unsigned card, unsigned stream | private | Finalizuje nagrywanie, zwraca dlugosc nagrania w ms |
| recordData | int id, unsigned card, unsigned stream, unsigned len, int threshold_level | private | Rozpoczyna nagrywanie z opcjonalnym progiem VOX (threshold) |
| stopRecordingData | int id, unsigned card, unsigned stream | private | Zatrzymuje nagrywanie |
| setInputVolumeData | int id, unsigned card, unsigned stream, int level | private | Ustawia poziom glosnosci wejscia (per stream) |
| setOutputVolumeData | int id, unsigned card, unsigned stream, unsigned port, int level | private | Ustawia poziom glosnosci wyjscia (per stream + port) |
| fadeOutputVolumeData | int id, unsigned card, unsigned stream, unsigned port, int level, unsigned length | private | Plynna zmiana glosnosci wyjscia w zadanym czasie (fade in/out) |
| setInputLevelData | int id, unsigned card, unsigned port, int level | private | Ustawia poziom wejsciowy (hardware level per port) |
| setOutputLevelData | int id, unsigned card, unsigned port, int level | private | Ustawia poziom wyjsciowy (hardware level per port) |
| setInputModeData | int id, unsigned card, unsigned stream, unsigned mode | private | Zmienia tryb wejscia (mono/stereo/left/right) |
| setOutputModeData | int id, unsigned card, unsigned stream, unsigned mode | private | Zmienia tryb wyjscia (mono/stereo/left/right) |
| setInputVoxLevelData | int id, unsigned card, unsigned stream, int level | private | Ustawia prog VOX (voice-operated switch) na wejsciu |
| setInputTypeData | int id, unsigned card, unsigned port, unsigned type | private | Ustawia typ wejscia (Analog vs AES/EBU digital) |
| getInputStatusData | int id, unsigned card, unsigned port | private | Odpytuje status wejscia (aktywne/nieaktywne) |
| setAudioPassthroughLevelData | int id, unsigned card, unsigned input, unsigned output, int level | private | Ustawia poziom passthrough (direct routing input->output bez strumienia) |
| setClockSourceData | int id, unsigned card, int input | private | Ustawia zrodlo zegara synchronizacji audio karty |
| setOutputStatusFlagData | int id, unsigned card, unsigned port, unsigned stream, bool state | private | Ustawia flage statusu wyjscia (uzywane do raportowania stanu) |
| openRtpCaptureChannelData | int id, unsigned card, unsigned port, uint16_t udp_port, unsigned samprate, unsigned chans | private | [STUB] Otwiera kanal przechwytywania RTP -- niezaimplementowane |
| meterEnableData | int id, uint16_t udp_port, const QList<unsigned> &cards | private | Wlacza wysylanie aktualizacji metrow UDP do klienta na wybranych kartach |
| statePlayUpdate | int card, int stream, int state | private | Callback z drivera -- informuje klienta o zmianie stanu odtwarzania (playing/paused/stopped) |
| stateRecordUpdate | int card, int stream, int state | private | Callback z drivera -- informuje klienta o zmianie stanu nagrywania (recording/started/paused/stopped) |
| updateMeters | - | private | Periodyczny timer -- odpytuje wszystkie karty o poziomy metrow, status portow, pozycje odtwarzania i wysyla aktualizacje UDP do klientow |
| connectionDroppedData | int id | private | Czysci zasoby (strumienie, handle'e) po rozlaczeniu klienta |
| jackStopTimerData | int stream | private | Timer JACK -- zatrzymanie odtwarzania po uplywie czasu |
| jackFadeTimerData | int stream | private | Timer JACK -- krok animacji fade |
| jackRecordTimerData | int stream | private | Timer JACK -- monitoring czasu nagrywania |
| jackClientStartData | - | private | Uruchamia skonfigurowane klienty JACK (z bazy danych) po polaczeniu z serwerem JACK |
| alsaStopTimerData | int cardstream | private | Timer ALSA -- zatrzymanie odtwarzania |
| alsaFadeTimerData | int cardstream | private | Timer ALSA -- krok animacji fade |
| alsaRecordTimerData | int cardport | private | Timer ALSA -- monitoring nagrywania |

## Stan (Q_PROPERTY)
| Property | Typ | Getter | Setter | Notify signal |
|----------|-----|--------|--------|---------------|
| Brak | --- | --- | --- | Klasa nie deklaruje Q_PROPERTY |

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| MainObject (konstruktor) | QObject *parent, const char *name | Inicjalizuje caly daemon: konfiguracja, baza danych, CaeServer, drivery audio, ProbeCaps, InitMixers, timer metrow, realtime scheduling | Wywolywany raz przy starcie procesu |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak wlasnych enumow | --- | Uzywa RDStation::AudioDriver (None, Hpi, Jack, Alsa) do identyfikacji aktywnego drivera per karta |

## Reguly biznesowe (z implementacji)
- Regula: Kazda karta audio (card 0..RD_MAX_CARDS-1) ma przypisany dokladnie jeden driver (HPI/JACK/ALSA/None). Dispatch komend odbywa sie przez switch(cae_driver[card]).
  Zrodlo: loadPlaybackData, wszystkie sloty dispatchujace
- Regula: Strumienie playback sa identyfikowane przez handle (0-255), ktory mapuje na pare (card, stream). Handle sluzy jako token dla klienta.
  Zrodlo: GetNextHandle(), GetHandle(), play_handle[]
- Regula: Tylko klient ktory jest wlascicielem strumienia (play_owner/record_owner) moze na nim operowac. Przy probie operacji przez innego klienta zwracany jest blad.
  Zrodlo: playData (guard: play_owner[card][stream]==id), recordData, unloadPlaybackData
- Regula: Przed nagrywaniem istniejacy plik audio jest usuwany (unlink) aby nie zaklocic ewentualnych trwajacych odtworzen tego samego pliku.
  Zrodlo: loadRecordingData (unlink(wavename), unlink(wavename+".energy"))
- Regula: Odpowiedz na kazda komende to echo komendy z suffixem "+!" (sukces) lub "-!" (blad). Protokol tekstowy, komendy zakonczne '!'.
  Zrodlo: wszystkie sloty, cae_server->sendCommand()
- Regula: Przy rozlaczeniu klienta (connectionDropped) WSZYSTKIE jego strumienie (play i record) sa automatycznie zwalniane (KillSocket).
  Zrodlo: KillSocket()
- Regula: Metering odbywa sie cyklicznie (timer, RD_METER_UPDATE_INTERVAL) i wysyla aktualizacje UDP do klientow, ktorzy wlaczyli metering (meterEnableData).
  Zrodlo: updateMeters(), SendMeterLevelUpdate/SendMeterPositionUpdate/SendMeterOutputStatusUpdate
- Regula: updateMeters() sprawdza rowniez flage `exiting` i jesli ustawiona, zwalnia drivery i wychodzi -- to jedyny mechanizm graceful shutdown.
  Zrodlo: updateMeters()
- Regula: Przy starcie daemon moze auto-provisionowac stacje i serwis w bazie danych (InitProvisioning), jesli skonfigurowane w rd.conf.
  Zrodlo: InitProvisioning()
- Regula: Mikser jest inicjalizowany z bazy danych (RDAudioPort) -- passthrough na mute, typy wejsc, poziomy wejsc/wyjsc, tryby wejsc.
  Zrodlo: InitMixers()
- Regula: Mozliwosc realtime scheduling (SCHED_FIFO) z priorytetem konfigurowanym -- mlockall() zapobiega swappingowi.
  Zrodlo: konstruktor, sekcja "Initialize Thread Priorities"
- Regula: Kodeki MPEG (TwoLAME, MAD, LAME) sa ladowane dynamicznie przez dlopen -- ich brak nie uniemozliwia startu demona, tylko wylacza dany kodek.
  Zrodlo: LoadTwoLame(), LoadMad(), CheckLame()
- Regula: Odtwarzanie ze zmiana predkosci (timescaling) wymaga SoundTouch i musi byc wspierane przez driver (TimescaleSupported).
  Zrodlo: timescalingSupportData(), playData (speed, pitch_flag)
- Regula: Dlugosc nagrania (unloadRecord) jest konwertowana z sampli na milisekundy (len*1000/system_sample_rate) przed wyslaniem do klienta.
  Zrodlo: unloadRecordingData()

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| ALSA (libasound) | Driver audio -- przechwytywanie i odtwarzanie przez ALSA PCM | CRITICAL |
| JACK (libjack) | Driver audio -- polaczenia z serwerem JACK, routing portow, callbacks | CRITICAL |
| AudioScience HPI | Driver audio -- profesjonalne karty broadcast (RDHPISoundCard/PlayStream/RecordStream) | CRITICAL |
| pthread (POSIX threads) | Realtime scheduling (SCHED_FIFO), watkowanie ALSA | CRITICAL |
| mlockall | Blokowanie pamieci (zapobiega swappingowi w trybie realtime) | HIGH |
| syslog | Logowanie systemowe | HIGH |
| dlopen/dlsym | Dynamiczne ladowanie kodeków (libtwolame, libmad, libmp3lame, libfaad, libmp4v2) | HIGH |
| SoundTouch | Timescaling (zmiana predkosci z korekcja pitcha) | MEDIUM |
| signal (POSIX) | Obsluga SIGINT/SIGTERM/SIGHUP do graceful shutdown | MEDIUM |
| /proc/ | Sprawdzanie czy daemon jest uruchomiony (CheckDaemon, GetPid) | LOW |
| QProcess | Uruchamianie serwera JACK i klientow JACK (z bazy danych) | MEDIUM |

## Zaleznosci od innych klas tego artifaktu
- CaeServer: serwer TCP, dostarcza polecenia jako sygnaly, MainObject je obsluguje jako sloty; MainObject wysyla odpowiedzi przez cae_server->sendCommand()

## Zaleznosci od shared libraries
- RDConfig (librd): konfiguracja systemu (rd.conf), nazwa stacji, parametry MySQL, sciezka audio, haslo
- RDStation (librd): reprezentacja stacji w bazie, driver per karta, capabilities
- RDSystem (librd): parametry systemowe (system_sample_rate)
- RDAudioPort (librd): konfiguracja miksera per port (typ wejscia, poziomy, tryb)
- RDCmdSwitch (librd): parsing argumentow CLI
- RDSqlQuery (librd): zapytania SQL (provisioning)
- RDWaveFile (librd): obsluga plikow audio (wave, MPEG, Vorbis)
- RDSvc (librd): tworzenie serwisu (provisioning)
- RDApplication (librd): syslog wrapper
- RDHPISoundCard, RDHPIPlayStream, RDHPIRecordStream (librdhpi): HPI driver abstraction
