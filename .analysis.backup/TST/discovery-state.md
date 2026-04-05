---
phase: 1
artifact: TST
artifact_name: tests
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: tests

## Lokalizacja

| Pole | Wartosc |
|------|---------|
| Folder zrodlowy | tests/ + web/tests/ |
| CMakeLists.txt | brak (autotools: tests/Makefile.am + web/tests/Makefile.am) |
| Target autotools | 28 noinst_PROGRAMS (unit tests, nie instalowane) + HTML test forms (instalowane do libexecdir) |
| Typ | test |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 28 |
| Pliki .cpp | 28 |
| Pliki .html (web test forms) | 45 |
| Pliki .js (web test support) | 2 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .txt (test data) | 2 |
| Linie kodu C++ (est.) | ~4600 (28 par, srednia ~164 LOC/para) |

## Entry Points

Kazdy z 28 testow C++ jest oddzielnym programem z wlasnym `main()` i `MainObject`.

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() x28 | kazdy *_test.cpp / test_*.cpp | int main(argc, argv) | Kazdy test to oddzielny executable |
| QApplication x27 | 27 z 28 testow | QApplication a(argc,argv,false) | Headless Qt app (false = bez GUI) |
| QCoreApplication x1 | rdwavefile_test.cpp | QCoreApplication a(argc,argv) | Jedyny test bez QApplication |

## Klasy Qt (identyfikowane)

Wszystkie 28 testow definiuja klase `MainObject : public QObject`. Nie jest to wspoldielona klasa -- kazdy test ma wlasna definicje. 6 testow uzywa Q_OBJECT (sygnaly/sloty), 22 to proste testy constructor-only.

### Testy z Q_OBJECT (signal/slot pattern)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | timer_test.h | QObject + Q_OBJECT | Test dokladnosci QTimer (slot timeoutData) |
| MainObject | rdwavefile_test.h | QObject + Q_OBJECT | Test RDWaveFile read/parse |
| MainObject | notification_test.h | QObject + Q_OBJECT | Test RDNotification (slot notificationReceivedData) |
| MainObject | mcast_recv_test.h | QObject + Q_OBJECT | Test multicast receive (uzywa RDMulticaster) |
| MainObject | metadata_wildcard_test.h | QObject + Q_OBJECT | Test metadata wildcard matching |
| MainObject | log_unlink_test.h | QObject + Q_OBJECT | Test log unlink z RDRIPC |

### Testy constructor-only (bez Q_OBJECT)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | audio_convert_test.h | QObject | Test RDAudioConvert |
| MainObject | audio_export_test.h | QObject | Test RDAudioExport |
| MainObject | audio_import_test.h | QObject | Test RDAudioImport |
| MainObject | audio_metadata_test.h | QObject | Test metadata RDWaveFile |
| MainObject | audio_peaks_test.h | QObject | Test audio peaks z RDWaveFile |
| MainObject | cmdline_parser_test.h | QObject | Test RDCmdSwitch (command line parser) |
| MainObject | datedecode_test.h | QObject | Test RDDateDecode |
| MainObject | dateparse_test.h | QObject | Test RDDateTime parsing |
| MainObject | db_charset_test.h | QObject | Test DB charset handling |
| MainObject | delete_test.h | QObject | Test RDDelete |
| MainObject | download_test.h | QObject | Test RDDownload |
| MainObject | feed_image_test.h | QObject | Test feed image operations (RDFeed) |
| MainObject | getpids_test.h | QObject | Test PID retrieval |
| MainObject | readcd_test.h | QObject | Test RDDiscLookup (CD reading) |
| MainObject | reserve_carts_test.h | QObject | Test cart reservation (RDGroup) |
| MainObject | rdxml_parse_test.h | QObject | Test RD XML parsing (RDCart, RDWaveData) |
| MainObject | sendmail_test.h | QObject | Test RDSendMail |
| MainObject | stringcode_test.h | QObject | Test string encoding (RDWeb) |
| MainObject | test_hash.h | QObject | Test RDHash |
| MainObject | test_pam.h | QObject | Test PAM authentication |
| MainObject | upload_test.h | QObject | Test RDUpload |
| MainObject | wav_chunk_test.h | QObject | Test WAV chunk parsing |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | audio_convert_test.h | audio_convert_test.cpp | Test konwersji audio (RDAudioConvert) |
| 002 | audio_export_test.h | audio_export_test.cpp | Test eksportu audio (RDAudioExport) |
| 003 | audio_import_test.h | audio_import_test.cpp | Test importu audio (RDAudioImport) |
| 004 | audio_metadata_test.h | audio_metadata_test.cpp | Test metadanych audio (RDWaveFile) |
| 005 | audio_peaks_test.h | audio_peaks_test.cpp | Test peak analysis (RDWaveFile) |
| 006 | cmdline_parser_test.h | cmdline_parser_test.cpp | Test parsera linii komend (RDCmdSwitch) |
| 007 | datedecode_test.h | datedecode_test.cpp | Test dekodowania dat (RDDateDecode) |
| 008 | dateparse_test.h | dateparse_test.cpp | Test parsowania dat (RDDateTime, RDWeb) |
| 009 | db_charset_test.h | db_charset_test.cpp | Test charset bazy danych |
| 010 | delete_test.h | delete_test.cpp | Test usuwania (RDDelete) |
| 011 | download_test.h | download_test.cpp | Test pobierania (RDDownload) |
| 012 | feed_image_test.h | feed_image_test.cpp | Test obrazow feedow (RDFeed) |
| 013 | getpids_test.h | getpids_test.cpp | Test pobierania PID |
| 014 | log_unlink_test.h | log_unlink_test.cpp | Test odlaczania logow (Q_OBJECT, RDLog, RDRIPC) |
| 015 | mcast_recv_test.h | mcast_recv_test.cpp | Test multicast receive (Q_OBJECT, RDMulticaster) |
| 016 | metadata_wildcard_test.h | metadata_wildcard_test.cpp | Test wildcard metadanych (Q_OBJECT, RDLogLine) |
| 017 | notification_test.h | notification_test.cpp | Test notyfikacji (Q_OBJECT, RDRIPC) |
| 018 | rdwavefile_test.h | rdwavefile_test.cpp | Test RDWaveFile (Q_OBJECT, QCoreApplication) |
| 019 | rdxml_parse_test.h | rdxml_parse_test.cpp | Test parsowania XML (RDCart, RDWaveData) |
| 020 | readcd_test.h | readcd_test.cpp | Test czytania CD (RDDiscLookup) |
| 021 | reserve_carts_test.h | reserve_carts_test.cpp | Test rezerwacji cartow (RDGroup) |
| 022 | sendmail_test.h | sendmail_test.cpp | Test wysylania maili (RDSendMail, RDWeb) |
| 023 | stringcode_test.h | stringcode_test.cpp | Test kodowania stringow (RDWeb) |
| 024 | test_hash.h | test_hash.cpp | Test hashowania (RDHash) |
| 025 | test_pam.h | test_pam.cpp | Test PAM authentication |
| 026 | timer_test.h | timer_test.cpp | Test dokladnosci QTimer (Q_OBJECT) |
| 027 | upload_test.h | upload_test.cpp | Test uploadu (RDUpload) |
| 028 | wav_chunk_test.h | wav_chunk_test.cpp | Test parsowania chunkow WAV |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_log_unlink_test.cpp | Generowane przez Qt moc |
| moc_metadata_wildcard_test.cpp | Generowane przez Qt moc |
| moc_mcast_recv_test.cpp | Generowane przez Qt moc |
| moc_notification_test.cpp | Generowane przez Qt moc |
| moc_rdwavefile_test.cpp | Generowane przez Qt moc |
| moc_timer_test.cpp | Generowane przez Qt moc |

## Pliki testowe

TST sam jest artefaktem testowym. Artefakt nie zawiera testow SWOICH testow.

### Testy C++ (tests/)

28 programow testowych, kazdy jako oddzielny executable (noinst_PROGRAMS).
Wzorzec: `main()` -> `QApplication(argc,argv,false)` -> `new MainObject()` -> `a.exec()`.
Framework: brak formalnego frameworka (nie QTest). Testy sa "hand-rolled" --
konstruktor MainObject wykonuje logike testowa i konczy `exit(0)` lub `exit(256)`.

### Testy HTML (web/tests/)

45 formularzy HTML + 2 pliki JS -- test harnesses dla rdxport.cgi (web API).
Kazdy formularz to prosty HTML form z `action="/rd-bin/rdxport.cgi"` method="post".
Odpowiadaja 1:1 komendom API z artefaktu XPT.

## Pliki danych testowych

| Plik | Opis |
|------|------|
| rivendell_standard.txt | Plik referencyjny standardu Rivendell |
| visualtraffic.txt | Dane testowe Visual Traffic (import format) |

## Build System (autotools)

### tests/Makefile.am

```makefile
AM_CPPFLAGS = -Wall -I$(top_srcdir)/lib @QT4_CFLAGS@ @MUSICBRAINZ_CFLAGS@ -DQT3_SUPPORT -I/usr/include/Qt3Support
LIBS = -L$(top_srcdir)/lib

noinst_PROGRAMS = audio_convert_test audio_export_test audio_import_test
                  audio_metadata_test audio_peaks_test cmdline_parser_test
                  datedecode_test dateparse_test db_charset_test delete_test
                  download_test feed_image_test getpids_test log_unlink_test
                  mcast_recv_test metadata_wildcard_test notification_test
                  rdwavefile_test rdxml_parse_test readcd_test
                  reserve_carts_test sendmail_test stringcode_test
                  test_hash test_pam timer_test upload_test wav_chunk_test
```

Kazdy target linkuje: `@LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support`
Wyjatek: `timer_test` linkuje tylko `@QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support` (nie uzywa librd).

### web/tests/Makefile.am

Pliki HTML/JS instalowane do `@libexecdir@`. Brak kompilacji -- tylko kopiowanie.

## Zaleznosci (z Makefile.am target_link_libraries)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak (27/28 testow) |
| @QT4_LIBS@ | Qt framework | tak (28/28 testow) |
| @LIBVORBIS@ | external | tak (27/28 testow) |
| @MUSICBRAINZ_LIBS@ | external | tak (28/28 testow) |
| -lQt3Support | Qt compat | tak (28/28 testow) |

## Testowane klasy librd (mapowanie test -> klasa LIB)

| Test | Testowane klasy z librd |
|------|------------------------|
| audio_convert_test | RDAudioConvert, RDSettings |
| audio_export_test | RDAudioExport, RDSettings |
| audio_import_test | RDAudioImport, RDSettings |
| audio_metadata_test | RDWaveFile |
| audio_peaks_test | RDWaveFile |
| cmdline_parser_test | RDCmdSwitch |
| datedecode_test | RDDateDecode, RDDb |
| dateparse_test | RDDateTime, RDWeb |
| db_charset_test | RDApplication |
| delete_test | RDDelete, RDApplication |
| download_test | RDDownload, RDApplication |
| feed_image_test | RDFeed, RDApplication |
| getpids_test | RDConf, RDDateDecode, RDDb |
| log_unlink_test | RDLog, RDRIPC, RDStation, RDSvc, RDConfig |
| mcast_recv_test | RDMulticaster |
| metadata_wildcard_test | RDLogLine, RDMulticaster, RDApplication |
| notification_test | RDRIPC, RDApplication |
| rdwavefile_test | RDWaveFile, RDWaveData |
| rdxml_parse_test | RDCart, RDWaveData |
| readcd_test | RDDiscLookup |
| reserve_carts_test | RDGroup, RDConfig, RDDb |
| sendmail_test | RDSendMail, RDWeb, RDApplication |
| stringcode_test | RDWeb |
| test_hash | RDHash, RDCut, RDConfig, RDDb |
| test_pam | RDConfig, RDSettings |
| timer_test | (brak -- testuje QTimer, nie librd) |
| upload_test | RDUpload, RDApplication |
| wav_chunk_test | (brak specyficznych -- niski poziom WAV) |

## Uwagi architektoniczne

1. **Brak formalnego frameworka testowego** -- testy sa "hand-rolled", nie uzywaja QTest ani gtest.
   Wzorzec: konstruktor MainObject() = cala logika, exit(0) = sukces, exit(256) = blad.
2. **timer_test jest jedynym testem niezaleznym od librd** -- testuje wylacznie QTimer.
3. **6 testow uzywa Q_OBJECT** i wymaga moc: timer_test, rdwavefile_test, notification_test,
   mcast_recv_test, metadata_wildcard_test, log_unlink_test. Te testy uzywaja sygnalow/slotow
   (np. nasluchiuja na zdarzenia asynchroniczne).
4. **web/tests/ to formularze HTML** -- nie sa testami automatycznymi, lecz interaktywnymi
   harness'ami do recznego testowania API rdxport.cgi w przegladarce.
5. **Wszystkie testy C++ to noinst_PROGRAMS** -- nie sa instalowane, sluza tylko do developmentu.
6. **rdwavefile_test jest jedynym testem uzywajacym QCoreApplication** zamiast QApplication.
