---
partial_id: "017"
artifact: LIB
class_name: RDAudioConvert
phase: 2
status: done
agent_version: 1.1.0
---

# RDAudioConvert

## Typ Qt
QObject derivative (Q_OBJECT macro). No signals, no slots, no Q_PROPERTY declarations. Uses QObject solely for tr() localization support and parent-based memory management.

## Odpowiedzialnosc (WHAT)
Converts audio files between formats through a 3-stage pipeline:
1. **Stage 1 (Decode)** -- Converts any supported source format into a normalized signed 32-bit integer WAV file.
2. **Stage 2 (Transform)** -- Adjusts audio levels (normalization), resamples sample rate, changes channelization (mono/stereo), and applies speed/tempo changes.
3. **Stage 3 (Encode)** -- Writes the transformed audio to the requested destination format.

The caller configures source file, destination file, destination settings (format, bitrate, sample rate, channels, normalization), optional time range, and speed ratio, then calls `convert()` which returns an error code.

Also applies ID3v2 metadata tags to MPEG output files and embeds RDXL (Rivendell XML) cart metadata in ID3v2 user text frames.

## Sygnaly
Brak (no signals declared).

## Sloty
Brak (no slots declared).

## Q_PROPERTY
Brak (no Q_PROPERTY declarations).

## Publiczne API

| Metoda | Opis WHAT |
|--------|-----------|
| `RDAudioConvert(QObject *parent=0)` | Konstruktor. Inicjalizuje domyslne parametry konwersji i laduje biblioteki MPEG (libmad, libmp3lame, libtwolame) przez dlopen. |
| `~RDAudioConvert()` | Destruktor. Zamyka handlery dlopen. |
| `setSourceFile(QString)` | Ustawia sciezke pliku zrodlowego. |
| `setDestinationFile(QString)` | Ustawia sciezke pliku docelowego. |
| `setDestinationSettings(RDSettings*)` | Ustawia parametry docelowe (format, bitrate, sample rate, kanaly, normalizacja). |
| `sourceWaveData() -> RDWaveData*` | Zwraca metadane audio (wave data) odczytane ze zrodla. |
| `sourceRdxl() -> QString` | Zwraca RDXL XML odczytany ze zrodla. |
| `setDestinationWaveData(RDWaveData*)` | Ustawia metadane do zapisania w pliku docelowym. |
| `setDestinationRdxl(QString)` | Ustawia RDXL XML do osadzenia w pliku docelowym. |
| `setRange(int start, int end)` | Ustawia zakres czasowy konwersji (start/end point w ms, -1 = calosc). |
| `setSpeedRatio(float)` | Ustawia wspolczynnik predkosci (tempo). Walidowany vs RD_TIMESCALE_MIN/MAX. |
| `convert() -> ErrorCode` | Glowna operacja: uruchamia 3-etapowy pipeline konwersji. Tworzy katalog tymczasowy, przetwarza Stage1->Stage2->Stage3, sprzata. |
| `settingsValid(RDSettings*) -> bool` | Walidacja ustawien (stub -- zawsze zwraca true). |
| `errorText(ErrorCode) -> QString` | Tlumaczenie kodu bledu na tekst czytelny dla uzytkownika (uzywa tr()). |

## Enums

### ErrorCode
| Wartosc | Nazwa | Znaczenie |
|---------|-------|-----------|
| 0 | ErrorOk | Sukces |
| 1 | ErrorInvalidSettings | Nieprawidlowe lub nieobslugiwane ustawienia |
| 2 | ErrorNoSource | Brak dostepu do pliku zrodlowego |
| 3 | ErrorNoDestination | Nie mozna utworzyc pliku docelowego |
| 4 | ErrorInvalidSource | Nierozpoznany format zrodla |
| 5 | ErrorInternal | Blad wewnetrzny (np. awaria biblioteki) |
| 6 | ErrorFormatNotSupported | Nieobslugiwany format |
| 7 | ErrorNoDisc | Brak plyty CD w napedzie |
| 8 | ErrorNoTrack | Brak sciezki na CD |
| 9 | ErrorInvalidSpeed | Nieprawidlowy wspolczynnik predkosci |
| 10 | ErrorFormatError | Blad formatu zrodla |
| 11 | ErrorNoSpace | Brak miejsca na dysku |

## Reguly biznesowe

1. **3-etapowy pipeline**: Kazda konwersja przechodzi Decode -> Transform -> Encode, uzywajac plikow tymczasowych WAV 32-bit jako formatu posredniego.
2. **Obslugiwane formaty zrodlowe (Stage 1)**: WAV (PCM i MPEG-in-WAV), MPEG (MP2/MP3), ATX, TMC, Ambos, Ogg Vorbis, FLAC, M4A/AAC, oraz wszystkie formaty obslugiwane przez libsndfile (AIFF, etc.) jako fallback.
3. **Obslugiwane formaty docelowe (Stage 3)**: PCM 16-bit WAV, PCM 24-bit WAV, MPEG Layer 2 (raw), MPEG Layer 2 in WAV container, MPEG Layer 3, FLAC, Ogg Vorbis. MPEG Layer 1 nie jest obslugiwany.
4. **Normalizacja**: Jezeli `normalizationLevel != 0` w ustawieniach, Stage 2 oblicza gain na podstawie peak sample i stosuje go do calego audio.
5. **Resampling**: Jezeli sample rate zrodla != docelowy, uzywa libsamplerate (SRC) do konwersji. Typ konwertera pochodzi z konfiguracji biblioteki (`srcConverter`).
6. **Zmiana kanalizacji**: Mono->Stereo (duplikacja), Stereo->Mono (usrednianie). Obslugujesz tylko 1 i 2 kanaly.
7. **Zmiana tempa**: Jezeli `speed_ratio != 1.0`, uzywa SoundTouch do zmiany tempa bez zmiany wysokosci dzwieku.
8. **Walidacja speed ratio**: Musi byc w zakresie [RD_TIMESCALE_MIN, RD_TIMESCALE_MAX], inaczej ErrorInvalidSpeed.
9. **ID3v2 tagging**: Po zakodowaniu do MPEG, stosuje metadane (tytul, artysta, album, label, dyrygent, kompozytor, wydawca, copyright, ISRC, rok, BPM) oraz osadza RDXL cart XML w ramce UserTextIdentification.
10. **RDXL propagacja**: RDXL XML ze zrodla moze byc odczytany i przekazany do pliku docelowego (w MPEG Layer 2 WAV, Layer 2 raw, oraz PCM). Dla MPEG uzywa ID3v2 frame, dla WAV uzywa natywnego RDWaveFile.
11. **Transcoding delay**: Miedzy iteracjami konwersji Stage 2 stosuje konfigurowalne opoznienie (usleep) aby nie obciazac CPU.

## Linux-specific

1. **dlopen do ladowania bibliotek MPEG**: libmad.so.0 (dekodowanie MPEG), libmp3lame.so.0 (enkodowanie MP3/Layer3), libtwolame.so.0 (enkodowanie MP2/Layer2). Ladowane dynamicznie -- brak hard dependency. Jezeli biblioteka nie jest dostepna, odpowiedni format nie jest obslugiwany.
2. **dlsym do rozwiazywania symboli**: Wszystkie funkcje lame_*, twolame_*, mad_* sa ladowane jako wskazniki funkcji przez dlsym().
3. **Pliki tymczasowe**: Uzywa RDTempDirectory do tworzenia katalogu tymczasowego (`/tmp/rdaudioconvert-XXXXX/`) z plikami posrednimi `signed32_1.wav` i `signed32_2.wav`.
4. **POSIX I/O**: Uzywa `open()`, `write()`, `close()`, `unlink()`, `stat()` do operacji na plikach. `usleep()` do throttlingu.
5. **syslog**: Loguje ostrzezenia i bledy przez `rda->syslog()` (LOG_WARNING).
6. **Conditional compilation**: `HAVE_FLAC`, `HAVE_MP4_DECODE` -- kompilacja warunkowa dla FLAC i M4A/AAC.

## Tabele DB
Brak bezposrednich operacji na bazie danych. Klasa operuje wylacznie na plikach audio. Jedyne posrednie uzycie DB to przez `RDCart` w `ApplyId3Tag()` (odczyt danych koszyka do osadzenia RDXL XML).

## Zaleznosci

### Klasy Rivendell
| Klasa | Rola |
|-------|------|
| RDSettings | Konfiguracja formatu docelowego (format, bitrate, sample rate, kanaly, normalizacja) |
| RDWaveData | Metadane audio (tytul, artysta, album, etc.) |
| RDWaveFile | Odczyt/zapis plikow WAV z obsluga roznych formatow (MPEG-in-WAV, ATX, TMC, Ambos) |
| RDTempDirectory | Tworzenie katalogu tymczasowego |
| RDCart | Odczyt danych koszyka do generowania RDXL XML |
| RDConfig | Konfiguracja systemowa (transcoding delay) |
| RDApplication (rda) | Singleton dostepu do konfiguracji i logowania |
| RDFlacDecode | Dekodowanie FLAC (Stage 1) |
| RDMP4 | Dekodowanie M4A/AAC (Stage 1, warunkowe) |

### Biblioteki zewnetrzne
| Biblioteka | Rola |
|------------|------|
| libsndfile (sndfile.h) | Uniwersalny odczyt/zapis formatow audio (PCM WAV, AIFF, etc.) |
| libsamplerate (samplerate.h) | Konwersja sample rate (resampling) |
| SoundTouch | Zmiana tempa/predkosci audio |
| libmad (dlopen) | Dekodowanie MPEG (MP2/MP3) -- Stage 1 |
| libmp3lame (dlopen) | Enkodowanie MPEG Layer 3 -- Stage 3 |
| libtwolame (dlopen) | Enkodowanie MPEG Layer 2 -- Stage 3 |
| FLAC++ (warunkowe) | Enkodowanie FLAC -- Stage 3 |
| libvorbis/libogg | Enkodowanie Ogg Vorbis -- Stage 3 |
| mp4v2 + libfaad (warunkowe) | Dekodowanie M4A/AAC -- Stage 1 |
| TagLib | Odczyt/zapis tagow ID3v2 w plikach MPEG |
