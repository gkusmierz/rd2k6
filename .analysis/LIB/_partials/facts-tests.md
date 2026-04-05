---
phase: 5
artifact: LIB
source: tests
status: done
---

# Test Facts: librd

## Przegląd plików testowych

Wszystkie testy to proste programy z `main()` i `MainObject` (bez QTest framework).
Logika testowa jest w `MainObject::MainObject` (konstruktor). Wynik oceniany ręcznie via stdout/exit code.

| Plik | Testuje | Kluczowe klasy/funkcje | Typ testu |
|------|---------|----------------------|-----------|
| db_charset_test.cpp | Charset konfiguracji DB | RDSqlQuery, RDApplication | Diagnostyczny |
| cmdline_parser_test.cpp | Parsowanie argumentów CLI | RDCmdSwitch | Diagnostyczny |
| audio_peaks_test.cpp | Odczyt energii audio z pliku WAV | RDWaveFile (energy/peaks) | Funkcjonalny |
| dateparse_test.cpp | Parsowanie dat RFC822, XML, Auto | RDParseRfc822DateTime, RDParseXmlDateTime, RDParseDateTime, RDParseXmlTime, RDWriteXmlDate/Time/DateTime, RDWriteRfc822DateTime | Funkcjonalny |
| timer_test.cpp | Precyzja QTimer | QTimer | Precyzyjny pomiar |
| rdxml_parse_test.cpp | Parsowanie XML z danymi cart/cut | RDCart::readXml, RDWaveData | Funkcjonalny |
| readcd_test.cpp | Odczyt metadanych CD (DiscID, ISRC) | discid, RDDiscLookup::isrcIsValid, formattedIsrc, normalizedIsrc | Funkcjonalny |
| stringcode_test.cpp | Kodowanie/dekodowanie stringów XML i URL | RDXmlEscape, RDXmlUnescape, RDUrlEscape, RDUrlUnescape | Funkcjonalny |
| download_test.cpp | Pobieranie plików (HTTP/FTP/SSH) | RDDownload | Integracyjny |
| wav_chunk_test.cpp | Parsowanie struktury WAV/RIFF | Niskopoziomowy odczyt RIFF/WAVE chunks | Strukturalny |
| mcast_recv_test.cpp | Odbiór multicast UDP | RDMulticaster | Integracyjny |
| reserve_carts_test.cpp | Rezerwacja cart-ów w grupie | RDGroup::reserveCarts | Funkcjonalny |
| delete_test.cpp | Usuwanie pliku przez URL | RDDelete | Integracyjny |
| audio_convert_test.cpp | Konwersja formatów audio | RDAudioConvert | Funkcjonalny |
| audio_metadata_test.cpp | Odczyt metadanych z pliku audio | RDWaveFile, RDWaveData | Funkcjonalny |
| audio_export_test.cpp | Eksport audio z systemu do pliku | RDAudioExport | Funkcjonalny |
| audio_import_test.cpp | Import audio z pliku do systemu | RDAudioImport | Funkcjonalny |
| rdwavefile_test.cpp | Otwarcie i walidacja pliku WAV | RDWaveFile | Funkcjonalny |
| log_unlink_test.cpp | Odlinkowanie importu z logu | RDLog, RDSvc::clearLogLinks | Funkcjonalny |
| test_pam.cpp | Autentykacja PAM | pam_start, pam_authenticate | Integracyjny |
| feed_image_test.cpp | Zarządzanie obrazami feedów (list/push/pop) | RDFeed, FEED_IMAGES (SQL) | Funkcjonalny |
| upload_test.cpp | Upload pliku na serwer | RDUpload | Integracyjny |
| sendmail_test.cpp | Wysyłanie emaili | RDSendMail | Integracyjny |
| test_hash.cpp | Hashowanie pliku SHA1 | RDSha1Hash | Funkcjonalny |
| getpids_test.cpp | Znajdowanie PID procesów po nazwie | RDGetPids | Funkcjonalny |
| metadata_wildcard_test.cpp | Rozwijanie wildcardów metadanych | RDLogLine::resolveWildcards | Funkcjonalny |
| notification_test.cpp | Odbiór notyfikacji RPC | RDNotification, RDRipc | Integracyjny |
| datedecode_test.cpp | Dekodowanie kodów daty/czasu | RDDateDecode, RDDateTimeDecode | Funkcjonalny |

## Use Cases (z testów)

```gherkin
Rule: Parsowanie argumentów linii poleceń (RDCmdSwitch)

  Scenario: Parsowanie opcji --key=value z linii komend
    Given Program uruchomiony z argumentami CLI
    When  RDCmdSwitch parsuje qApp->argc()/argv()
    Then  Klucze i wartości są dostępne przez keys()/key(i)/value(i)
    And   Nieprzetworzone opcje (processed(i)==false) powodują exit z komunikatem błędu
  # Źródło: tests/cmdline_parser_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Parsowanie dat i czasu (wiele formatów)

  Scenario: Parsowanie daty RFC822
    Given String daty w formacie RFC822 przekazany przez --datetime
    When  RDParseRfc822DateTime(datetime, &ok) jest wywołane
    Then  Zwraca QDateTime i ok=true dla poprawnego stringa
    And   Zwraca ok=false i "invalid date/time string" dla niepoprawnego
  # Źródło: tests/dateparse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Parsowanie daty XML xs:dateTime
    Given String daty w formacie XML xs:dateTime
    When  RDParseXmlDateTime(datetime, &ok) jest wywołane
    Then  Zwraca QDateTime i ok=true dla poprawnego stringa
  # Źródło: tests/dateparse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Parsowanie czasu XML xs:time z day offset
    Given String czasu w formacie XML
    When  RDParseXmlTime(time, &ok, &day_offset) jest wywołane
    Then  Zwraca QTime, ok flag i day_offset (utracony/zyskany dzień)
  # Źródło: tests/dateparse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Auto-detekcja formatu daty
    Given String daty w nieznanym formacie
    When  RDParseDateTime(datetime, &ok) jest wywołane z --format=auto
    Then  System automatycznie wykrywa format i parsuje datę
  # Źródło: tests/dateparse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Serializacja aktualnej daty/czasu do XML
    Given Aktualna data/czas systemu
    When  RDWriteXmlDate/RDWriteXmlTime/RDWriteXmlDateTime jest wywołane
    Then  Zwraca string w formacie XML xs:date/xs:time/xs:dateTime
  # Źródło: tests/dateparse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Serializacja aktualnej daty/czasu do RFC822
    Given Aktualna data/czas systemu
    When  RDWriteRfc822DateTime jest wywołane
    Then  Zwraca string w formacie RFC822
  # Źródło: tests/dateparse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Dekodowanie kodów daty (RDDateDecode/RDDateTimeDecode)

  Scenario: Dekodowanie kodu daty z uwzględnieniem stacji i serwisu
    Given Kod daty (np. pattern z wildcardami), aktualna data, stacja, config, serwis
    When  RDDateDecode(date, currentDate, station, config, service) jest wywołane
    Then  Zwraca zdekodowany string daty
  # Źródło: tests/datedecode_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Dekodowanie kodu daty/czasu
    Given Kod datetime, aktualny datetime, stacja, config, serwis
    When  RDDateTimeDecode(datetime, currentDateTime, station, config, service) jest wywołane
    Then  Zwraca zdekodowany string datetime
  # Źródło: tests/datedecode_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Kodowanie i dekodowanie stringów

  Scenario: Escape XML
    Given Dowolny string wejściowy
    When  RDXmlEscape(str) jest wywołane
    Then  Zwraca string z escaped znakami XML
  # Źródło: tests/stringcode_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Unescape XML
    Given String z XML entities
    When  RDXmlUnescape(str) jest wywołane
    Then  Zwraca zdekodowany string
  # Źródło: tests/stringcode_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Escape URL
    Given Dowolny string wejściowy
    When  RDUrlEscape(str) jest wywołane
    Then  Zwraca string URL-encoded
  # Źródło: tests/stringcode_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Unescape URL
    Given String URL-encoded
    When  RDUrlUnescape(str) jest wywołane
    Then  Zwraca zdekodowany string
  # Źródło: tests/stringcode_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Hashowanie plików (SHA1)

  Scenario: Obliczenie SHA1 hash pliku
    Given Ścieżka do pliku (--filename)
    When  RDSha1Hash(filename) jest wywołane
    Then  Zwraca string z hashem SHA1
  # Źródło: tests/test_hash.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: SHA1 hash nieistniejącego pliku
    Given Ścieżka do nieistniejącego pliku
    When  RDSha1Hash(filename) jest wywołane
    Then  Zwraca pusty string
    And   Test wypisuje błąd "unable to open" i exit(256)
  # Źródło: tests/test_hash.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Odczyt energii/peaks z pliku audio

  Scenario: Sprawdzenie czy plik WAV ma dane energii
    Given Plik audio WAV (--filename)
    When  RDWaveFile::openWave() i wave->hasEnergy()
    Then  Raportuje czy plik zawiera dane energii i ich rozmiar
  # Źródło: tests/audio_peaks_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Odczyt energii dla konkretnej ramki (mono)
    Given Plik audio mono z danymi energii, numer ramki (--frame)
    When  wave->energy(frame) jest wywołane
    Then  Zwraca wartość energii (16-bit) dla ramki
  # Źródło: tests/audio_peaks_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Odczyt energii dla konkretnej ramki (stereo)
    Given Plik audio stereo z danymi energii, numer ramki (--frame)
    When  wave->energy(2*frame) i wave->energy(2*frame+1)
    Then  Zwraca oddzielne wartości energii dla lewego i prawego kanału
    And   Stereo: ramki indeksowane jako 2*frame (lewy) i 2*frame+1 (prawy)
  # Źródło: tests/audio_peaks_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Parsowanie struktury WAV/RIFF

  Scenario: Walidacja nagłówka RIFF/WAVE
    Given Plik binarny (--filename)
    When  Odczytane są pierwsze 12 bajtów
    Then  Pierwsze 4 bajty MUSZĄ być "RIFF"
    And   Bajty 4-7 to payload length (little-endian uint32)
    And   Bajty 8-11 MUSZĄ być "WAVE"
    And   file_length POWINNO być równe payload_length + 8
  # Źródło: tests/wav_chunk_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Enumeracja chunków WAV
    Given Poprawny plik RIFF/WAVE
    When  Iteracja przez chunki (NextChunk)
    Then  Każdy chunk ma 4-bajtową nazwę i 4-bajtową długość (little-endian)
    And   Chunki są iterowane sekwencyjnie aż do końca pliku
  # Źródło: tests/wav_chunk_test.cpp::MainObject::NextChunk
  # Pewność: potwierdzone

Rule: Parsowanie XML z danymi cart/cut

  Scenario: Parsowanie Rivendell XML do danych cart i cut
    Given Plik XML z danymi Rivendell (--filename)
    When  RDCart::readXml(&data, xml) jest wywołane
    Then  Zwraca wektor RDWaveData — data[0] = dane carta, data[1..n] = dane cutów
    And   Zwraca liczbę < 1 gdy brak danych ("no data found")
  # Źródło: tests/rdxml_parse_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Odczyt metadanych z pliku audio

  Scenario: Odczyt metadanych audio z pliku
    Given Plik audio (--filename)
    When  RDWaveFile::openWave(wavedata) jest wywołane
    Then  Typ pliku jest dostępny przez wavefile->type()
    And   Metadane (jeśli znalezione) dostępne przez wavedata->metadataFound() i wavedata->dump()
    And   Gdy brak metadanych wypisuje "No metadata found."
  # Źródło: tests/audio_metadata_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Otwarcie pliku WAV

  Scenario: Walidacja otwarcia pliku WAV
    Given Ścieżka do pliku audio (--filename)
    When  RDWaveFile(filename).openWave(wavedata)
    Then  Zwraca true i populuje wavedata dla poprawnego pliku
    And   Zwraca false dla niepoprawnego/niedostępnego pliku
  # Źródło: tests/rdwavefile_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Konwersja formatów audio

  Scenario: Konwersja pliku audio między formatami
    Given Plik źródłowy (--source-file), plik docelowy (--destination-file)
    And   Format docelowy (Pcm16/Pcm24/MpegL2/MpegL2Wav/MpegL3/Flac/OggVorbis)
    And   Opcjonalnie: kanały, sample rate, bit rate, quality, normalization level, speed ratio
    And   Opcjonalnie: start-point/end-point (zakres w ms)
    And   Opcjonalnie: metadata-cart (metadane z istniejącego carta)
    When  RDAudioConvert::convert() jest wywołane
    Then  Tworzy plik w docelowym formacie z przekonwertowanym audio
    And   Wynik konwersji opisany przez RDAudioConvert::errorText()
  # Źródło: tests/audio_convert_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Eksport audio z systemu

  Scenario: Eksport audio z carta/cutu do pliku
    Given Cart number i cut number
    And   Plik docelowy i ustawienia formatu (format, channels, sample rate, bit rate, quality)
    And   Opcjonalnie: start-point/end-point, normalization-level
    And   Credentials (username/password)
    When  RDAudioExport::runExport(username, password, &audio_conv_err)
    Then  Eksportuje audio cutu do pliku docelowego we wskazanym formacie
  # Źródło: tests/audio_export_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Import audio do systemu

  Scenario: Import pliku audio do carta/cutu
    Given Cart number i cut number
    And   Plik źródłowy (--source-file)
    And   Opcjonalnie: destination channels, normalization level, autotrim level
    And   Opcjonalnie: --use-metadata (importuj metadane z pliku)
    And   Credentials (username/password)
    When  RDAudioImport::runImport(username, password, &audio_conv_err)
    Then  Importuje audio do wskazanego cutu
  # Źródło: tests/audio_import_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Pobieranie plików (RDDownload)

  Scenario: Pobranie pliku z URL na dysk
    Given Source URL i destination file
    And   Opcjonalnie: username/password, SSH identity file
    When  RDDownload::runDownload(username, password, ssh_identity, use_identity, debug)
    Then  Pobiera plik i raportuje wynik przez RDDownload::errorText()
  # Źródło: tests/download_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Upload plików (RDUpload)

  Scenario: Upload pliku na serwer
    Given Source file i destination URL
    And   Opcjonalnie: username/password, SSH identity file
    When  RDUpload::runUpload(username, password, ssh_identity, use_identity, debug)
    Then  Uploaduje plik i raportuje wynik przez RDUpload::errorText()
  # Źródło: tests/upload_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Usuwanie pliku zdalnego (RDDelete)

  Scenario: Usunięcie pliku przez URL
    Given Target URL (musi być fully qualified i valid)
    And   Opcjonalnie: username/password, SSH identity file
    When  RDDelete::runDelete(username, password, ssh_identity, use_identity, debug)
    Then  Usuwa plik i raportuje wynik przez RDDelete::errorText()
  # Źródło: tests/delete_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Rezerwacja cart-ów w grupie

  Scenario: Rezerwacja wielu cart-ów w grupie
    Given Nazwa grupy (--group) i ilość (--quantity >= 1)
    When  RDGroup::reserveCarts(&cart_nums, stationName, RDCart::Audio, quantity)
    Then  Zwraca true i wektor zarezerwowanych numerów cart-ów
    And   Zwraca false gdy rezerwacja się nie powiodła
  # Źródło: tests/reserve_carts_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Odlinkowanie importu z logu

  Scenario: Odlinkowanie źródła traffic/music z logu
    Given Nazwa logu (--log), źródło (traffic/music)
    When  RDSvc::clearLogLinks(source, log_name, user, &err_msg)
    Then  Usuwa powiązania importu z logu
    And   Wymaga autentykacji przez RDRipc (czeka na userChanged signal)
  # Źródło: tests/log_unlink_test.cpp::MainObject::MainObject, MainObject::userData
  # Pewność: potwierdzone

Rule: Zarządzanie obrazami feedów podcast

  Scenario: Listowanie obrazów feedu
    Given Klucz feedu (--feed)
    When  Zapytanie SQL do FEED_IMAGES where FEED_KEY_NAME
    Then  Wyświetla ID, Description, Dimensions (WxHxD) dla każdego obrazu
  # Źródło: tests/feed_image_test.cpp::MainObject::RunList
  # Pewność: potwierdzone

  Scenario: Dodanie obrazu do feedu (push)
    Given Klucz feedu (--feed), plik obrazu (--filename), opis (--description)
    When  Obraz ładowany z pliku, walidowany jako QImage, zapisywany do FEED_IMAGES
    Then  Zapis do bazy zawiera: FEED_ID, FEED_KEY_NAME, WIDTH, HEIGHT, DEPTH, DESCRIPTION, DATA (blob)
  # Źródło: tests/feed_image_test.cpp::MainObject::RunPush
  # Pewność: potwierdzone

  Scenario: Pobranie obrazu z feedu (pop)
    Given ID obrazu (--image-id), plik docelowy (--filename)
    When  Zapytanie SQL select DATA from FEED_IMAGES where ID
    Then  Zapisuje dane binarne obrazu do pliku
  # Źródło: tests/feed_image_test.cpp::MainObject::RunPop
  # Pewność: potwierdzone

Rule: Odbiór multicast

  Scenario: Nasłuchiwanie wiadomości multicast UDP
    Given Adres multicast i port (--from=IP:PORT)
    When  RDMulticaster::bind(port) i subscribe(address)
    Then  Odbiera wiadomości i wypisuje źródłowy IP + treść
  # Źródło: tests/mcast_recv_test.cpp::MainObject::MainObject, MainObject::receivedData
  # Pewność: potwierdzone

Rule: Odbiór notyfikacji RPC

  Scenario: Nasłuchiwanie notyfikacji Rivendell
    Given Połączenie z RDRipc na localhost:RIPCD_TCP_PORT
    When  Signal notificationReceived(RDNotification*) jest emitowany
    Then  Notyfikacja jest serializowana przez notify->write() i wypisana
  # Źródło: tests/notification_test.cpp::MainObject::MainObject, notificationReceivedData
  # Pewność: potwierdzone

Rule: Autentykacja PAM

  Scenario: Autentykacja użytkownika przez PAM
    Given Nazwa serwisu PAM (--service-name)
    When  pam_start() i pam_authenticate() z callbackiem konwersacyjnym
    Then  Wypisuje "Success!" gdy autentykacja przeszła
    And   Wypisuje komunikat błędu PAM gdy autentykacja nie przeszła
  # Źródło: tests/test_pam.cpp::MainObject::MainObject, ConversationResponseCallback
  # Pewność: potwierdzone

Rule: Odczyt metadanych CD (DiscID)

  Scenario: Odczyt DiscID z napędu CD
    Given Urządzenie CD (--device)
    When  discid_read lub discid_read_sparse
    Then  Wyświetla FreeDB DiscID, MusicBrainz DiscID, Submission URL
  # Źródło: tests/readcd_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

  Scenario: Odczyt rozszerzonych metadanych CD (MCN, ISRC)
    Given Urządzenie CD (--device) z flagą --extended
    When  discid_read (pełny odczyt) + iteracja po trackach
    Then  Wyświetla MCN + dla każdego tracku: ISRC, walidację, sformatowany i znormalizowany ISRC
  # Źródło: tests/readcd_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Rozwijanie wildcardów metadanych

  Scenario: Rozwinięcie kodu wildcard z metadanymi carta
    Given Numer carta (--cart), kod wildcard (--code), opcjonalnie numer cutu (--cut)
    When  RDLogLine::resolveWildcards(cartnum, code, cutnum)
    Then  Zwraca string z rozwiniętymi wildcardami
  # Źródło: tests/metadata_wildcard_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Znajdowanie PID procesów

  Scenario: Wyszukanie PID-ów procesu po nazwie
    Given Nazwa programu (--program)
    When  RDGetPids(program)
    Then  Zwraca listę PID-ów pasujących procesów
  # Źródło: tests/getpids_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Wysyłanie emaili

  Scenario: Wysłanie emaila przez system
    Given From, To, opcjonalnie CC/BCC, subject, body (inline lub z pliku)
    When  RDSendMail(&err_msg, subject, body, from, to, cc, bcc, dry_run)
    Then  Zwraca true przy sukcesie, false z err_msg przy błędzie
  # Źródło: tests/sendmail_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone

Rule: Precyzja timerów

  Scenario: Weryfikacja precyzji QTimer
    Given Timer ustawiony na 60 sekundowy interwał (potem podwajany)
    When  Timer odpala i mierzy gettimeofday (start vs end)
    Then  Wypisuje oczekiwany czas, faktyczny czas i procentową różnicę
  # Źródło: tests/timer_test.cpp::MainObject::MainObject, timeoutData
  # Pewność: potwierdzone

Rule: Diagnostyka bazy danych

  Scenario: Wyświetlenie charset i collation bazy danych
    Given Połączenie z bazą Rivendell
    When  SQL: "show variables like '%character_set%'" i '%collation%'
    Then  Wyświetla wszystkie zmienne charset i collation MySQL
  # Źródło: tests/db_charset_test.cpp::MainObject::MainObject
  # Pewność: potwierdzone
```

## Edge Cases (z testów)

| Test | Edge case | Oczekiwany wynik | Źródło |
|------|-----------|-----------------|--------|
| dateparse_test | --datetime i --time podane jednocześnie | Exit 256 z "mutually exclusive" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | Ani --datetime ani --time nie podane | Exit 256 z "you must specify" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | --time z formatem RFC822 | Exit 1 z "RFC822 format has no --time parser" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | --print z formatem auto | Exit 1 z "auto not supported for printing" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | --print=date z formatem RFC822 | Exit 1 z "date unsupported for RFC822 format" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | Niepoprawny string daty | ok=false, wypisuje "invalid date/time string" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | Parsowanie czasu z day_offset < 0 | Wypisuje "(lost N day)" | tests/dateparse_test.cpp::MainObject |
| dateparse_test | Parsowanie czasu z day_offset > 0 | Wypisuje "(gained N day)" | tests/dateparse_test.cpp::MainObject |
| datedecode_test | --date i --datetime jednocześnie | Exit 256 z "mutually exclusive" | tests/datedecode_test.cpp::MainObject |
| datedecode_test | Ani --date ani --datetime | Exit 256 z "you must specify" | tests/datedecode_test.cpp::MainObject |
| wav_chunk_test | Plik nie jest RIFF | Exit 256 z "not a RIFF file" | tests/wav_chunk_test.cpp::MainObject |
| wav_chunk_test | Plik RIFF nie jest WAVE | Exit 256 z "not a WAVE file" | tests/wav_chunk_test.cpp::MainObject |
| wav_chunk_test | Payload size != file size - 8 | WARNING: "Payload and file sizes disagree!" | tests/wav_chunk_test.cpp::MainObject |
| wav_chunk_test | Chunk size wykracza poza koniec pliku | WARNING: "chunk size points beyond end of file!" | tests/wav_chunk_test.cpp::NextChunk |
| wav_chunk_test | Plik obcięty (< 4/8/12 bajtów) | Exit 256 z "file truncated" | tests/wav_chunk_test.cpp::MainObject |
| test_hash | Nieistniejący plik | RDSha1Hash zwraca pusty string, exit 256 | tests/test_hash.cpp::MainObject |
| audio_peaks_test | Plik bez danych energii | Wypisuje "does NOT have energy" | tests/audio_peaks_test.cpp::MainObject |
| audio_peaks_test | Niepoprawna wartość --frame | Exit 256 z "invalid --frame argument" | tests/audio_peaks_test.cpp::MainObject |
| audio_convert_test | bit-rate i quality oba niezerowe | Exit 256 z "mutually exclusive" | tests/audio_convert_test.cpp::MainObject |
| audio_convert_test | metadata-cart nie istnieje w DB | Exit 256 z "does not exist" | tests/audio_convert_test.cpp::MainObject |
| audio_convert_test | metadata-cart poza zakresem (0 lub > RD_MAX_CART_NUMBER) | Exit 256 z "invalid" | tests/audio_convert_test.cpp::MainObject |
| audio_convert_test | normalization_level > 0 | Exit 256 z "invalid normalization level" | tests/audio_convert_test.cpp::MainObject |
| audio_convert_test | speed_ratio <= 0 | Exit 256 z "invalid speed-ratio" | tests/audio_convert_test.cpp::MainObject |
| audio_export_test | cart_number > 999999 | Exit 256 z "invalid cart number" | tests/audio_export_test.cpp::MainObject |
| audio_export_test | cut_number > 999 | Exit 256 z "invalid cut number" | tests/audio_export_test.cpp::MainObject |
| audio_export_test | bit-rate i quality oba niezerowe | Exit 256 z "mutually exclusive" | tests/audio_export_test.cpp::MainObject |
| audio_import_test | cart_number > 999999 | Exit 256 z "invalid cart number" | tests/audio_import_test.cpp::MainObject |
| audio_import_test | cut_number > 999 | Exit 256 z "invalid cut number" | tests/audio_import_test.cpp::MainObject |
| audio_import_test | normalization_level > 0 | Exit 256 z "invalid" | tests/audio_import_test.cpp::MainObject |
| audio_import_test | autotrim_level > 0 | Exit 256 z "invalid" | tests/audio_import_test.cpp::MainObject |
| delete_test | URL relatywne | Exit 1 z "URL's must be fully qualified" | tests/delete_test.cpp::MainObject |
| delete_test | URL niepoprawne | Exit 1 z "invalid URL" | tests/delete_test.cpp::MainObject |
| delete_test | Nieobsługiwany schemat URL | Exit 1 z "unsupported URL scheme" (urlIsSupported) | tests/delete_test.cpp::MainObject |
| mcast_recv_test | --from bez portu lub adresu | Exit 1 z "invalid argument to --from" | tests/mcast_recv_test.cpp::MainObject |
| mcast_recv_test | Niepoprawny adres IP w --from | Exit 1 z "invalid address" | tests/mcast_recv_test.cpp::MainObject |
| mcast_recv_test | Port = 0 lub >= 65536 | Exit 1 z "invalid port" | tests/mcast_recv_test.cpp::MainObject |
| reserve_carts_test | quantity < 1 | Exit 256 z "must reserve at least one cart" | tests/reserve_carts_test.cpp::MainObject |
| reserve_carts_test | Grupa nie istnieje | Exit 256 z "group does not exist" (group->exists()) | tests/reserve_carts_test.cpp::MainObject |
| reserve_carts_test | Rezerwacja się nie powiodła | Wypisuje "reservation failed" (reserveCarts returns false) | tests/reserve_carts_test.cpp::MainObject |
| metadata_wildcard_test | cart > RD_MAX_CART_NUMBER lub == 0 | Exit 1 z "invalid cart number" | tests/metadata_wildcard_test.cpp::MainObject |
| metadata_wildcard_test | cut > RD_MAX_CUT_NUMBER lub <= 0 | Exit 1 z "invalid cut number" | tests/metadata_wildcard_test.cpp::MainObject |
| feed_image_test | --list, --pop, --push jednocześnie | Exit 1 z "mutually exclusive" | tests/feed_image_test.cpp::MainObject |
| feed_image_test | Push: niepoprawny plik obrazu | Exit 1 z "invalid image file" (QImage::loadFromData fails) | tests/feed_image_test.cpp::RunPush |
| feed_image_test | Pop: nieistniejące image-id | Exit 1 z "no such image" (SQL returns empty) | tests/feed_image_test.cpp::RunPop |
| feed_image_test | Feed nie istnieje | Exit 1 z "no such feed" (feed->exists()) | tests/feed_image_test.cpp::MainObject |
| sendmail_test | --body i --body-file jednocześnie | Exit z "mutually exclusive" | tests/sendmail_test.cpp::MainObject |
| log_unlink_test | Log nie istnieje | Exit 1 z "no such log" (RDLog::exists()) | tests/log_unlink_test.cpp::userData |
| log_unlink_test | --source niepoprawna wartość (nie traffic/music) | Exit 1 z "must specify a source" | tests/log_unlink_test.cpp::MainObject |
| rdxml_parse_test | XML bez danych | Exit 256 z "no data found" (n < 1) | tests/rdxml_parse_test.cpp::MainObject |

## Testy negatywne (co system ODRZUCA)

| Test | Co odrzuca | Jak reaguje | Źródło |
|------|-----------|-------------|--------|
| Wszystkie testy | Nieznane opcje CLI | Exit z "unknown option" | Wszystkie pliki (RDCmdSwitch pattern) |
| dateparse_test | Brak --format | Exit 1 z "no --format specified" | tests/dateparse_test.cpp |
| dateparse_test | Nieznana wartość --format | Exit 1 z "unknown --format value" | tests/dateparse_test.cpp |
| dateparse_test | Nieznana wartość --print | Exit 1 z "unknown --print value" | tests/dateparse_test.cpp |
| audio_convert_test | Nieznany format docelowy (nie Pcm16/Pcm24/MpegL2/MpegL2Wav/MpegL3/Flac/OggVorbis) | Exit 256 z "invalid destination format" | tests/audio_convert_test.cpp |
| audio_export_test | Nieznany format docelowy (nie Pcm16/MpegL2/MpegL2Wav/MpegL3/Flac/OggVorbis) | Exit 256 z "invalid destination format" (uwaga: brak Pcm24 w eksporcie) | tests/audio_export_test.cpp |
| delete_test | URL relatywne (nie fully qualified) | Exit 1 z "URL's must be fully qualified" | tests/delete_test.cpp |
| delete_test | Nieobsługiwany protokół URL | Exit 1 z "unsupported URL scheme" (RDDelete::urlIsSupported) | tests/delete_test.cpp |
| mcast_recv_test | Format --from bez ":" | Exit 1 - wymaga IP:PORT (split na ":") | tests/mcast_recv_test.cpp |
| mcast_recv_test | Port poza zakresem 1-65535 | Exit 1 z "invalid port" | tests/mcast_recv_test.cpp |
| feed_image_test | Niepoprawny obraz (QImage nie może załadować) | Exit 1 z "invalid image file" | tests/feed_image_test.cpp |
| audio_convert_test | normalization_level > 0 (musi być <= 0 dB) | Exit 256 z "invalid" | tests/audio_convert_test.cpp |
| audio_import_test | autotrim_level > 0 (musi być <= 0 dB) | Exit 256 z "invalid" | tests/audio_import_test.cpp |

## Kluczowe stałe i limity (z testów)

| Stała/Limit | Wartość | Źródło |
|-------------|---------|--------|
| Max cart number | RD_MAX_CART_NUMBER (999999 w eksporcie) | audio_export_test, metadata_wildcard_test |
| Max cut number | RD_MAX_CUT_NUMBER (999 w eksporcie) | audio_export_test, audio_import_test |
| Normalization level | Musi być <= 0 (dB) | audio_convert_test, audio_export_test, audio_import_test |
| Autotrim level | Musi być <= 0 (dB) | audio_import_test |
| Speed ratio | Musi być > 0 | audio_convert_test |
| UDP port range | 1-65535 | mcast_recv_test |
| Timer test initial interval | 60000 ms (60s), podwajany po każdym cyklu | timer_test |
| WAV energy indexing (stereo) | left=2*frame, right=2*frame+1 | audio_peaks_test |

## Obsługiwane formaty audio (z testów)

### Konwersja (audio_convert_test)
- Pcm16, Pcm24, MpegL2, MpegL2Wav, MpegL3, Flac, OggVorbis

### Eksport (audio_export_test)
- Pcm16, MpegL2, MpegL2Wav, MpegL3, Flac, OggVorbis
- **UWAGA: Pcm24 NIE jest obsługiwane w eksporcie (w przeciwieństwie do konwersji)**

## Transfer plików - wspólny wzorzec

Trzy klasy transferu (RDDownload, RDUpload, RDDelete) współdzielą wzorzec:
- Opcjonalne credentials: username/password
- Opcjonalne SSH identity file: --ssh-identity-filename + --use-identity-file
- Debug flag: rda->config()->logXloadDebugData()
- Wynik: ErrorCode + errorText()
- URL musi być fully qualified (przynajmniej dla delete)
