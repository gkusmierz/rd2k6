---
phase: 1
artifact: LIB
artifact_name: librd
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: librd

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | lib/ |
| CMakeLists.txt | brak (autotools) |
| Makefile.am | lib/Makefile.am |
| Target | lib_LTLIBRARIES = librd.la |
| Typ | library |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 195 |
| Pliki .cpp | 204 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~101 370 |

## Entry Points

Biblioteka -- brak main(). librd jest linkowana przez wszystkie pozostale artefakty (@LIB_RDLIBS@).

Glowny obiekt inicjalizacyjny: `RDApplication` (rdapplication.h) -- singleton zarzadzajacy polaczeniem DB, konfiguracja, sesja uzytkownika.

## Klasy Qt (identyfikowane)

### QObject derivatives

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDApplication | rdapplication.h | QObject | Singleton aplikacji -- DB, config, user session |
| RDCae | rdcae.h | QObject | Klient Core Audio Engine (IPC do caed) |
| RDRipc | rdripc.h | QObject | Klient RPC/IPC (komunikacja z ripcd) |
| RDCatchConnect | rdcatch_connect.h | QObject | Klient catch daemon |
| RDLogPlay | rdlogplay.h | QObject, RDLogEvent | Silnik odtwarzania logow (playout engine) |
| RDPlayDeck | rdplay_deck.h | QObject | Pojedynczy deck odtwarzania audio |
| RDMacroEvent | rdmacro_event.h | QObject | Kontener listy makr RML |
| RDRenderer | rdrenderer.h | QObject | Renderer logow do plikow audio |
| RDFeed | rdfeed.h | QObject | Zarzadzanie podcastami/feedami RSS |
| RDPodcast | rdpodcast.h | QObject | Pojedynczy podcast |
| RDSvc | rdsvc.h | QObject | Konfiguracja serwisu (service) |
| RDLiveWire | rdlivewire.h | QObject | Protokol Axia LiveWire |
| RDMulticaster | rdmulticaster.h | QObject | Obsluga multicast UDP |
| RDSocket | rdsocket.h | QTcpSocket | Rozszerzony QTcpSocket |
| RDUnixServer | rdunixserver.h | QObject | Serwer UNIX socket (SOCK_STREAM) |
| RDUnixSocket | rdunixsocket.h | QTcpSocket | Klient UNIX socket |
| RDCdPlayer | rdcdplayer.h | QObject | Sterowanie odtwarzaczem CD |
| RDCdRipper | rdcdripper.h | QObject | Ripping CD do plikow |
| RDGpio | rdgpio.h | QObject | Sterowanie GPIO |
| RDKernelGpio | rdkernelgpio.h | QObject | GPIO przez kernel /dev/gpio |
| RDAudioConvert | rdaudioconvert.h | QObject | Konwersja formatow audio |
| RDAudioExport | rdaudioexport.h | QObject | Eksport audio (HTTP) |
| RDAudioImport | rdaudioimport.h | QObject | Import audio (HTTP) |
| RDAudioInfo | rdaudioinfo.h | QObject | Metadane audio (HTTP) |
| RDAudioStore | rdaudiostore.h | QObject | Informacje o storage audio |
| RDTrimAudio | rdtrimaudio.h | QObject | Obcinanie ciszy w audio |
| RDPeaksExport | rdpeaksexport.h | QObject | Eksport danych peak |
| RDCopyAudio | rdcopyaudio.h | QObject | Kopiowanie audio miedzy cutami |
| RDRehash | rdrehash.h | QObject | Przeliczanie hash audio |
| RDDelete | rddelete.h | QObject | Usuwanie plikow audio (HTTP) |
| RDDownload | rddownload.h | QObject | Pobieranie plikow (curl) |
| RDUpload | rdupload.h | QObject | Wysylanie plikow (curl) |
| RDTransfer | rdtransfer.h | QObject | Baza dla download/upload |
| RDDataPacer | rddatapacer.h | QObject | Rate-limiter danych |
| RDTimeEngine | rdtimeengine.h | QObject | Silnik timerow (scheduled events) |
| RDOneShot | rdoneshot.h | QObject | Jednorazowe timery |
| RDCodeTrap | rdcodetrap.h | QObject | Trapowanie sekwencji znakow |
| RDEventPlayer | rdevent_player.h | QObject | Odtwarzanie eventow |
| RDProcess | rdprocess.h | QObject | Zarzadzanie procesami |
| RDDbHeartbeat | rddbheartbeat.h | QObject | Heartbeat polaczenia DB |
| RDLogLock | rdloglock.h | QObject | Blokowanie logow (edit lock) |

### QWidget derivatives

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDWidget | rdwidget.h | QWidget, RDFontEngine | Baza dla widgetow Rivendell |
| RDDialog | rddialog.h | QDialog, RDFontEngine | Baza dla dialogow Rivendell |
| RDFrame | rdframe.h | QFrame, RDFontEngine | Baza dla QFrame widgetow |
| RDSoundPanel | rdsound_panel.h | (Q_OBJECT) | Panel dzwiekowy (button grid) |
| RDCartSlot | rdcartslot.h | (Q_OBJECT) | Slot na cart |
| RDSlotBox | rdslotbox.h | (Q_OBJECT) | Widget slotu cart |
| RDSlotDialog | rdslotdialog.h | (Q_OBJECT) | Dialog konfiguracji slotu |
| RDSlotOptions | rdslotoptions.h | - | Opcje slotu |
| RDPanelButton | rdpanel_button.h | (Q_OBJECT) | Przycisk panelu |
| RDButtonPanel | rdbutton_panel.h | - | Panel przyciskow |
| RDButtonDialog | rdbutton_dialog.h | (Q_OBJECT) | Dialog edycji przycisku |
| RDPushButton | rdpushbutton.h | QPushButton, RDFontEngine | Rozszerzony QPushButton |
| RDTransportButton | rdtransportbutton.h | QPushButton | Przycisk transportu (play/stop/etc.) |
| RDComboBox | rdcombobox.h | QComboBox | Rozszerzony QComboBox |
| RDLineEdit | rdlineedit.h | QLineEdit | Rozszerzony QLineEdit |
| RDMarkerEdit | rdmarker_edit.h | QLineEdit | Edytor markerow |
| RDMarkerBar | rdmarker_bar.h | QLabel | Pasek markerow audio |
| RDMarkerButton | rdmarker_button.h | - | Przycisk markera |
| RDSimplePlayer | rdsimpleplayer.h | QWidget | Prosty player audio |
| RDCueEdit | rdcueedit.h | (Q_OBJECT) | Edytor cue pointow |
| RDCueEditDialog | rdcueeditdialog.h | (Q_OBJECT) | Dialog edycji cue |
| RDEditAudio | rdedit_audio.h | (Q_OBJECT) | Edytor audio (waveform) |
| RDWavePainter | rdwavepainter.h | QPainter | Rysowanie waveform |
| RDStereoMeter | rdstereometer.h | QWidget | Miernik stereo |
| RDSegMeter | rdsegmeter.h | QWidget | Miernik segmentowy |
| RDPlayMeter | rdplaymeter.h | (Q_OBJECT) | Miernik odtwarzania |
| RDSlider | rdslider.h | QWidget, Q3RangeControl | Suwak |
| RDBusyBar | rdbusybar.h | QFrame | Pasek zajetosci |
| RDBusyDialog | rdbusydialog.h | (Q_OBJECT) | Dialog zajetosci |
| RDEmptyCart | rdemptycart.h | QWidget | Widget pustego carta |
| RDCartDrag | rdcartdrag.h | Q3StoredDrag | Drag&drop cartow |
| RDListView | rdlistview.h | Q3ListView | Rozszerzony Q3ListView |
| RDListViewItem | rdlistviewitem.h | Q3ListViewItem | Rozszerzony Q3ListViewItem |
| RDTimeEdit | rdtimeedit.h | Q3Frame | Edytor czasu |
| RDDatePicker | rddatepicker.h | (Q_OBJECT) | Wybor daty |
| RDDateDialog | rddatedialog.h | (Q_OBJECT) | Dialog daty |
| RDGpioSelector | rdgpioselector.h | QWidget | Selektor GPIO |
| RDCardSelector | rdcardselector.h | (Q_OBJECT) | Selektor karty audio |
| RDListSelector | rdlistselector.h | (Q_OBJECT) | Selektor z listy |
| RDLogFilter | rdlogfilter.h | QWidget | Filtr logow |
| RDImagePickerModel | rdimagepickermodel.h | QAbstractListModel | Model obrazkow |
| RDImagePickerBox | rdimagepickerbox.h | QComboBox | Wybor obrazka |
| RDRssCategoryBox | rdrsscategorybox.h | QComboBox | Wybor kategorii RSS |

### Dialogi (dziedziczace z RDDialog/QDialog)

| Klasa | Plik .h | Opis |
|-------|---------|------|
| RDCartDialog | rdcart_dialog.h | Dialog wyboru carta |
| RDCutDialog | rdcut_dialog.h | Dialog wyboru cuta |
| RDAddCart | rdadd_cart.h | Dialog dodawania carta |
| RDAddLog | rdadd_log.h | Dialog dodawania logu |
| RDGetPasswd | rdgetpasswd.h | Dialog hasla |
| RDGetAth | rdget_ath.h | Dialog autoryzacji |
| RDPasswd | rdpasswd.h | Dialog zmiany hasla |
| RDEditPanelName | rdedit_panel_name.h | Dialog nazwy panelu |
| RDExportSettingsDialog | rdexport_settings_dialog.h | Dialog ustawien eksportu |
| RDWaveDataDialog | rdwavedata_dialog.h | Dialog metadanych audio |
| RDSchedCodesDialog | rdschedcodes_dialog.h | Dialog kodow schedulera |
| RDListLogs | rdlist_logs.h | Dialog listy logow |
| RDListGroups | rdlist_groups.h | Dialog listy grup |
| RDListSvcs | rdlistsvcs.h | Dialog listy serwisow |
| RDImportAudio | rdimport_audio.h | Dialog importu audio |

### QValidator derivatives

| Klasa | Plik .h | Opis |
|-------|---------|------|
| RDTextValidator | rdtextvalidator.h | Walidator tekstu |
| RDIdValidator | rdidvalidator.h | Walidator ID |

### Disc lookup (MusicBrainz/CDDB)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDDiscLookup | rddisclookup.h | (Q_OBJECT) | Baza disc lookup |
| RDCddbLookup | rdcddblookup.h | (Q_OBJECT) | Lookup CDDB (FreeDB) |
| RDMbLookup | rdmblookup.h | (Q_OBJECT) | Lookup MusicBrainz |
| RDDummyLookup | rddummylookup.h | (Q_OBJECT) | Dummy lookup (stub) |

### Klasy non-Qt (plain C++ / data model)

| Klasa | Plik .h | Opis |
|-------|---------|------|
| RDCart | rdcart.h | Model carta (audio container) |
| RDCut | rdcut.h | Model cuta (audio segment w carcie) |
| RDLog | rdlog.h | Model logu (playlista) |
| RDLogEvent | rdlog_event.h | Zdarzenia w logu |
| RDLogLine | rdlog_line.h | Pojedyncza linia logu |
| RDStation | rdstation.h | Model stacji (host) |
| RDUser | rduser.h | Model uzytkownika |
| RDGroup | rdgroup.h | Model grupy cartow |
| RDMatrix | rdmatrix.h | Model matrycy switcher |
| RDRecording | rdrecording.h | Model nagrywania (scheduled) |
| RDEvent | rdevent.h | Model eventu schedulera |
| RDEventLine | rdevent_line.h | Linia eventu |
| RDEventImportList | rdeventimportlist.h | Lista importu eventow |
| RDClock | rdclock.h | Model zegara (clock template) |
| RDReport | rdreport.h | Model raportu + generowanie exportow |
| RDReplicator | rdreplicator.h | Model replikacji |
| RDDropbox | rddropbox.h | Model dropboxa (auto-import) |
| RDDeck | rddeck.h | Model decka (nagrywanie) |
| RDConfig | rdconfig.h | Konfiguracja systemowa (rd.conf) |
| RDSystem | rdsystem.h | Ustawienia systemowe (z DB) |
| RDAirplayConf | rdairplay_conf.h | Konfiguracja rdairplay |
| RDLibraryConf | rdlibrary_conf.h | Konfiguracja rdlibrary |
| RDLogeditConf | rdlogedit_conf.h | Konfiguracja rdlogedit |
| RDCatchConf | rdcatch_conf.h | Konfiguracja rdcatch |
| RDMonitorConfig | rdmonitor_config.h | Konfiguracja rdmonitor |
| RDAudioPort | rdaudio_port.h | Konfiguracja portu audio |
| RDSettings | rdsettings.h | Ustawienia audio (format, bitrate) |
| RDAudioSettings | rdaudiosettings.h | Zaawansowane ustawienia audio |
| RDMacro | rdmacro.h | Pojedyncze makro RML |
| RDTty | rdtty.h | Konfiguracja portu szeregowego TTY |
| RDNotification | rdnotification.h | Powiadomienie (event bus) |
| RDWaveFile | rdwavefile.h | Obsluga plikow WAV/audio |
| RDWaveData | rdwavedata.h | Metadane audio (title, artist, etc.) |
| RDDiscRecord | rddiscrecord.h | Metadane plyty CD |
| RDRssSchemas | rdrssschemas.h | Schematy RSS |
| RDLiveWireSource | rdlivewiresource.h | Zrodlo LiveWire |
| RDLiveWireDestination | rdlivewiredestination.h | Cel LiveWire |
| RDSchedCartList | rdschedcartlist.h | Lista cartow schedulera |
| RDSchedRulesList | rdschedruleslist.h | Lista regul schedulera |
| RDSchedCode | rdschedcode.h | Kod schedulera |
| RDHotKeys | rdhotkeys.h | Skroty klawiszowe |
| RDHotKeyList | rdhotkeylist.h | Lista skrotow |
| RDGroupList | rdgroup_list.h | Lista grup |
| RDCastSearch | rdcastsearch.h | Wyszukiwanie podcastow |
| RDFormPost | rdformpost.h | Parser formularzy HTTP POST |
| RDProfile | rdprofile.h | Parser plikow konfiguracyjnych (INI-style) |
| RDGrid | rdgrid.h | Siatka zegara (clock grid) |
| RDStatus | rdstatus.h | Status systemu |
| RDTimEvent | rdtimeevent.h | Zdarzenie czasowe |
| RDCmdSwitch | rdcmd_switch.h | Parser argumentow CLI |
| RDCmdCache | rdcmd_cache.h | Cache polecen |
| RDSqlQuery | rddb.h | Rozszerzony QSqlQuery |
| RDDb | rddb.h | Inicjalizacja polaczenia DB |
| RDSystemUser | rdsystemuser.h | Uzytkownik systemowy (PAM) |
| RDFontEngine | rdfontengine.h | Silnik fontow (DPI-aware) |
| RDCartSearchText | rdcart_search_text.h | Budowanie SQL wyszukiwania cartow |
| RDLogIcons | rdlog_icons.h | Ikony typow logow |
| RDInstanceLock | rdinstancelock.h | Blokada instancji procesu |
| RDTempDirectory | rdtempdirectory.h | Katalog tymczasowy |
| RDRingBuffer | rdringbuffer.h | Bufor kolowy audio |
| RDMeterAverage | rdmeteraverage.h | Usrednianie pomiarow miernika |
| RDGainEnvelope | rdgain_envelope.h | Obwiednia glosnosci |
| RDSendMail | rdsendmail.h | Wysylanie emaili |
| RDWeb | rdweb.h | Utility HTTP/web |
| RDWebResult | rdwebresult.h | Wynik operacji web |
| RDUrl | rdurl.h | Rozszerzony Q3Url |
| RDSocketStrings | rdsocketstrings.h | Stale stringow protokolu socket |
| RDStringList | rdstringlist.h | Rozszerzona QStringList |
| RDCsv | rdcsv.h | Parser CSV |
| RDTextFile | rdtextfile.h | Czytanie plikow tekstowych |
| RDFLACDecode | rdflacdecode.h | Dekoder FLAC |
| RDMp4 | rdmp4.h | Parser MP4/AAC |
| RDMixer | rdmixer.h | Kontrola miksera ALSA |
| RDPam | rdpam.h | Autentykacja PAM |

## Pliki zrodlowe

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| rd.h | Globalne stale, enumeracje, makra (#define) |
| dbversion.h | Numer wersji schematu DB |
| gpio.h | Definicje typow GPIO |
| rdxport_interface.h | Interfejs protokolu rdxport (HTTP API) |
| rdpaths.h.in | Template sciezek systemowych (generowany przez autoconf) |

### Pliki tylko .cpp (bez .h) -- export_*.cpp

| Source | Zawartosc |
|--------|-----------|
| export_bmiemr.cpp | Eksport raportu BMI EMR |
| export_cutlog.cpp | Eksport raportu CutLog |
| export_deltaflex.cpp | Eksport raportu DeltaFlex |
| export_musicclassical.cpp | Eksport raportu Music Classical |
| export_musicplayout.cpp | Eksport raportu Music Playout |
| export_musicsummary.cpp | Eksport raportu Music Summary |
| export_nprsoundex.cpp | Eksport raportu NPR Soundex |
| export_radiotraffic.cpp | Eksport raportu RadioTraffic |
| export_resultsrecon.cpp | Eksport raportu Results/Reconciliation |
| export_soundex.cpp | Eksport raportu Soundex |
| export_spincount.cpp | Eksport raportu Spin Count |
| export_technical.cpp | Eksport raportu Technical |
| export_textlog.cpp | Eksport raportu Text Log |

Uwaga: Pliki export_*.cpp to implementacje metod klasy RDReport -- kazdy plik zawiera logike generowania jednego formatu raportu.

### Pary .h/.cpp (190 par)

Pelna lista -- 190 par plikow .h/.cpp w lib/. Wszystkie pary sa wymienione w Makefile.am (dist_librd_la_SOURCES). Kazda para odpowiada jednej lub wiecej klasom wymienionym w tabelach powyzej.

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_*.cpp | Generowane przez Qt MOC (93 pliki wymienione w nodist_librd_la_SOURCES) |
| rdpaths.h | Generowany z rdpaths.h.in przez autoconf |
| *.qm | Generowane z .ts przez lrelease |

## Pliki testowe

| Plik | Framework | Testowane klasy/moduly |
|------|-----------|------------------------|
| tests/audio_convert_test.cpp/.h | custom | RDAudioConvert |
| tests/audio_export_test.cpp/.h | custom | RDAudioExport |
| tests/audio_import_test.cpp/.h | custom | RDAudioImport |
| tests/audio_metadata_test.cpp/.h | custom | metadane audio |
| tests/audio_peaks_test.cpp/.h | custom | dane peak audio |
| tests/cmdline_parser_test.cpp/.h | custom | RDCmdSwitch |
| tests/datedecode_test.cpp/.h | custom | RDDateDecode |
| tests/dateparse_test.cpp/.h | custom | parsowanie dat |
| tests/db_charset_test.cpp/.h | custom | charset DB |
| tests/delete_test.cpp/.h | custom | RDDelete |
| tests/download_test.cpp/.h | custom | RDDownload |
| tests/feed_image_test.cpp/.h | custom | obrazki feedow |
| tests/getpids_test.cpp/.h | custom | PID procesow |
| tests/log_unlink_test.cpp/.h | custom | usuwanie logow |
| tests/mcast_recv_test.cpp/.h | custom | RDMulticaster |
| tests/metadata_wildcard_test.cpp/.h | custom | wildcardy metadanych |
| tests/notification_test.cpp/.h | custom | RDNotification |
| tests/rdwavefile_test.cpp/.h | custom | RDWaveFile |
| tests/rdxml_parse_test.cpp/.h | custom | parsowanie XML |
| tests/readcd_test.cpp/.h | custom | odczyt CD |
| tests/reserve_carts_test.cpp/.h | custom | rezerwacja cartow |
| tests/sendmail_test.cpp/.h | custom | RDSendMail |
| tests/stringcode_test.cpp/.h | custom | kodowanie stringow |
| tests/test_hash.cpp/.h | custom | RDHash |
| tests/test_pam.cpp/.h | custom | RDPam |
| tests/timer_test.cpp/.h | custom | timery |
| tests/upload_test.cpp/.h | custom | RDUpload |
| tests/wav_chunk_test.cpp/.h | custom | chunki WAV |

Uwaga: Testy NIE uzywaja QTest framework -- to standalone programy testowe (custom framework).

## Autotools Target Definition

```makefile
# lib/Makefile.am
lib_LTLIBRARIES = librd.la
# dist_librd_la_SOURCES = 190+ par .h/.cpp + 13 export_*.cpp + 5 standalone .h
# nodist_librd_la_SOURCES = 93 moc_*.cpp (generowane przez Qt MOC)
librd_la_LDFLAGS = -release $(VERSION)
```

Build flags: `AM_CPPFLAGS = -Wall -DPREFIX="$(prefix)" @QT4_CFLAGS@ @MUSICBRAINZ_CFLAGS@ -Wno-strict-aliasing -DQT3_SUPPORT`

## Zaleznosci (z Makefile.am / configure.ac)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| Qt4 (QtCore, QtGui, QtNetwork, QtSql, QtXml) | Qt framework | Glowny framework |
| Qt3Support | Qt compat | Kompatybilnosc z Qt3 (Q3ListView, Q3Url, etc.) |
| libmusicbrainz5 | external | Lookup metadanych plyt CD |
| libdiscid | external | Identyfikacja plyt CD |
| libcoverart | external | Okladki albumow |
| taglib | external | Metadane audio (ID3 tags) |
| libcurl | external | HTTP transfer (download/upload) |
| libvorbis | external | Kodek OGG Vorbis |
| libsndfile | external | Obsluga formatow audio |
| FLAC | external | Kodek FLAC |
| libsamplerate | external | Resampling audio |
| PAM | system | Autentykacja uzytkownikow |
| ALSA | system | Mikser audio |
