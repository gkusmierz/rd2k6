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
| Folder źródłowy | lib/ |
| CMakeLists.txt | brak (autotools: lib/Makefile.am) |
| Target | librd.la (libtool shared library) |
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

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| Brak main() | — | — | To jest biblioteka, nie aplikacja |
| QApplication usage | rdcddblookup.cpp, rdmblookup.cpp, rddisclookup.cpp, rdcart_dialog.cpp, rdlogplay.cpp | QApplication::setOverrideCursor/processEvents | Wywołania statycznych metod QApplication (cursor, event loop) |
| Inicjalizacja | rdapplication.h | RDApplication | Klasa inicjalizująca całe środowisko Rivendell (singleton-like) |

## Klasy Qt (identyfikowane)

### Klasy bazowe / framework

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDApplication | rdapplication.h | QObject | Główna klasa inicjalizacyjna środowiska Rivendell |
| RDDialog | rddialog.h | QDialog + RDFontEngine | Bazowa klasa dla wszystkich modalnych dialogów |
| RDWidget | rdwidget.h | QWidget + RDFontEngine | Bazowa klasa dla widgetów Rivendell |
| RDFrame | rdframe.h | QFrame + RDFontEngine | Bazowa klasa dla QFrame-based widgetów |

### Komunikacja / IPC

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDCae | rdcae.h | QObject | Klient Core Audio Engine (CAE) |
| RDRipc | rdripc.h | QObject | Klient RPC — komunikacja z ripcd |
| RDCatchConnect | rdcatch_connect.h | QObject | Połączenie z rdcatchd |
| RDSocket | rdsocket.h | QTcpSocket | Rozszerzony socket TCP |
| RDUnixServer | rdunixserver.h | QObject | Serwer UNIX socket (SOCK_STREAM) |
| RDUnixSocket | rdunixsocket.h | QTcpSocket | Klient UNIX socket |
| RDMulticaster | rdmulticaster.h | QObject | Multicast UDP |
| RDLiveWire | rdlivewire.h | QObject | Kontrola Axia LiveWire |
| RDNotification | rdnotification.h | — (non-Qt) | Powiadomienia między procesami |

### Audio

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDAudioConvert | rdaudioconvert.h | QObject | Konwersja formatów audio |
| RDAudioExport | rdaudioexport.h | QObject | Eksport audio do pliku |
| RDAudioImport | rdaudioimport.h | QObject | Import audio z pliku |
| RDAudioInfo | rdaudioinfo.h | QObject | Informacje o pliku audio |
| RDAudioStore | rdaudiostore.h | QObject | Zarządzanie storage audio |
| RDCdPlayer | rdcdplayer.h | QObject | Odtwarzacz CD |
| RDCdRipper | rdcdripper.h | QObject | Ripping CD |
| RDPlayDeck | rdplay_deck.h | QObject | Deck playback |
| RDSimplePlayer | rdsimpleplayer.h | QWidget | Prosty odtwarzacz audio (widget) |
| RDTrimAudio | rdtrimaudio.h | QObject | Przycinanie audio |
| RDRehash | rdrehash.h | QObject | Rehash plików audio |
| RDPeaksExport | rdpeaksexport.h | QObject | Eksport danych peaks |
| RDRenderer | rdrenderer.h | QObject | Renderer audio (log → plik) |
| RDFLACDecode | rdflacdecode.h | — (non-Qt) | Dekoder FLAC |
| RDRingBuffer | rdringbuffer.h | — (non-Qt) | Bufor cykliczny audio |
| RDGainEnvelope | rdgain_envelope.h | — (non-Qt) | Obwiednia głośności |

### Baza danych / model

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDSqlQuery | rddb.h | QSqlQuery | Rozszerzony QSqlQuery |
| RDConfig | rdconfig.h | — (non-Qt) | Konfiguracja systemu (rd.conf) |
| RDStation | rdstation.h | — (non-Qt) | Stacja robocza |
| RDCart | rdcart.h | — (non-Qt) | Cart (kontener audio) |
| RDCut | rdcut.h | — (non-Qt) | Cut (segment audio w cart) |
| RDLog | rdlog.h | — (non-Qt) | Log (playlist) |
| RDLogEvent | rdlog_event.h | — (non-Qt) | Zdarzenia w logu |
| RDLogLine | rdlog_line.h | — (non-Qt) | Pojedyncza linia logu |
| RDLogPlay | rdlogplay.h | QObject + RDLogEvent | Odtwarzanie logu (playback engine) |
| RDClock | rdclock.h | — (non-Qt) | Zegar programowy |
| RDEvent | rdevent.h | — (non-Qt) | Zdarzenie programowe |
| RDEventLine | rdevent_line.h | — (non-Qt) | Linia zdarzenia |
| RDGroup | rdgroup.h | — (non-Qt) | Grupa cartów |
| RDFeed | rdfeed.h | QObject | Podcast feed |
| RDPodcast | rdpodcast.h | — (non-Qt) | Podcast entry |
| RDSvc | rdsvc.h | QObject | Serwis (przydział cartów) |
| RDRecording | rdrecording.h | — (non-Qt) | Nagranie zaplanowane |
| RDMatrix | rdmatrix.h | — (non-Qt) | Matryca przełączania audio |
| RDUser | rduser.h | — (non-Qt) | Użytkownik systemu |
| RDReport | rdreport.h | — (non-Qt) | Raport eksportowy |
| RDReplicator | rdreplicator.h | — (non-Qt) | Replikator danych |
| RDDropBox | rddropbox.h | — (non-Qt) | DropBox (auto-import) |
| RDSystem | rdsystem.h | — (non-Qt) | Konfiguracja systemowa |
| RDSchedCode | rdschedcode.h | — (non-Qt) | Kod schedulera |

### Widgety UI

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDPushButton | rdpushbutton.h | QPushButton + RDFontEngine | Przycisk z fontami Rivendell |
| RDTransportButton | rdtransportbutton.h | QPushButton | Przycisk transportu (play/stop/rec) |
| RDPanelButton | rdpanel_button.h | QObject | Przycisk panelu dźwiękowego |
| RDButtonPanel | rdbutton_panel.h | — (non-Qt) | Panel przycisków |
| RDSoundPanel | rdsound_panel.h | QObject | Panel dźwiękowy (SoundPanel) |
| RDComboBox | rdcombobox.h | QComboBox | ComboBox Rivendell |
| RDLineEdit | rdlineedit.h | QLineEdit | LineEdit Rivendell |
| RDMarkerEdit | rdmarker_edit.h | QLineEdit | Edycja markerów |
| RDMarkerBar | rdmarker_bar.h | QLabel | Pasek markerów |
| RDMarkerButton | rdmarker_button.h | — (non-Qt) | Przycisk markera |
| RDListView | rdlistview.h | Q3ListView | ListView (Qt3-compat) |
| RDListViewItem | rdlistviewitem.h | Q3ListViewItem | ListViewItem (Qt3-compat) |
| RDSlider | rdslider.h | QWidget + Q3RangeControl | Suwak |
| RDPlayMeter | rdplaymeter.h | QObject | Miernik playback |
| RDSegMeter | rdsegmeter.h | QWidget | Segment meter |
| RDStereoMeter | rdstereometer.h | QWidget | Miernik stereo |
| RDBusyBar | rdbusybar.h | QFrame | Pasek zajętości |
| RDTimeEdit | rdtimeedit.h | Q3Frame | Edycja czasu |
| RDDatePicker | rddatepicker.h | QObject | Wybór daty |
| RDLogFilter | rdlogfilter.h | QWidget | Filtr logów |
| RDEmptyCart | rdemptycart.h | QWidget | Widget pustego carta |
| RDCardSelector | rdcardselector.h | QObject | Selektor kart audio |
| RDGpioSelector | rdgpioselector.h | QWidget | Selektor GPIO |
| RDListSelector | rdlistselector.h | QObject | Selektor list (dual-list) |
| RDImagePickerBox | rdimagepickerbox.h | QComboBox | Selektor obrazów |
| RDImagePickerModel | rdimagepickermodel.h | QAbstractListModel | Model obrazów |
| RDRssCategoryBox | rdrsscategorybox.h | QObject | Selektor kategorii RSS |
| RDCartSlot | rdcartslot.h | QObject | Slot carta |
| RDSlotBox | rdslotbox.h | QObject | Box slotów |
| RDWavePainter | rdwavepainter.h | QPainter | Painter waveformu |
| RDCueEdit | rdcueedit.h | QObject | Edycja cue pointów |
| RDFontEngine | rdfontengine.h | — (non-Qt) | Silnik fontów |

### Dialogi

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDCartDialog | rdcart_dialog.h | (RDDialog) | Dialog wyboru carta |
| RDCutDialog | rdcut_dialog.h | (RDDialog) | Dialog wyboru cut |
| RDButtonDialog | rdbutton_dialog.h | (RDDialog) | Dialog konfiguracji przycisku |
| RDCueEditDialog | rdcueeditdialog.h | (RDDialog) | Dialog edycji cue |
| RDWaveDataDialog | rdwavedata_dialog.h | (RDDialog) | Dialog metadanych audio |
| RDExportSettingsDialog | rdexport_settings_dialog.h | (RDDialog) | Dialog ustawień eksportu |
| RDSlotDialog | rdslotdialog.h | (RDDialog) | Dialog konfiguracji slotu |
| RDSchedCodesDialog | rdschedcodes_dialog.h | (RDDialog) | Dialog kodów schedulera |
| RDAddCart | rdadd_cart.h | (RDDialog) | Dialog dodawania carta |
| RDAddLog | rdadd_log.h | (RDDialog) | Dialog dodawania logu |
| RDGetPasswd | rdgetpasswd.h | (RDDialog) | Dialog hasła |
| RDPasswd | rdpasswd.h | (RDDialog) | Dialog zmiany hasła |
| RDGetAth | rdget_ath.h | (RDDialog) | Dialog uwierzytelniania |
| RDDateDialog | rddatedialog.h | (RDDialog) | Dialog wyboru daty |
| RDEditAudio | rdedit_audio.h | (RDDialog) | Dialog edycji audio |
| RDEditPanelName | rdedit_panel_name.h | (RDDialog) | Dialog nazwy panelu |
| RDBusyDialog | rdbusydialog.h | (RDDialog) | Dialog busy/progress |
| RDListLogs | rdlist_logs.h | (RDDialog) | Dialog listy logów |
| RDListGroups | rdlist_groups.h | (RDDialog) | Dialog listy grup |
| RDListSvcs | rdlistsvcs.h | (RDDialog) | Dialog listy serwisów |
| RDSlotOptions | rdslotoptions.h | — | Opcje slotów |
| RDImportAudio | rdimport_audio.h | (RDDialog) | Dialog importu audio |

### Transfer / sieć

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDDownload | rddownload.h | QObject | Download plików (HTTP/FTP/SFTP) |
| RDUpload | rdupload.h | QObject | Upload plików |
| RDTransfer | rdtransfer.h | QObject | Bazowa klasa transferów |
| RDFormPost | rdformpost.h | — (non-Qt) | Parsowanie multipart form POST |
| RDUrl | rdurl.h | Q3Url | URL helper |

### Narzędzia / pomocnicze

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDCodeTrap | rdcodetrap.h | QObject | Pułapka na sekwencje znaków |
| RDMacro | rdmacro.h | — (non-Qt) | Makro RML |
| RDMacroEvent | rdmacro_event.h | QObject | Kontener listy makr RML |
| RDOneShot | rdoneshot.h | QObject | Jednorazowy timer |
| RDTimeEngine | rdtimeengine.h | QObject | Silnik zdarzeń czasowych |
| RDTimeEvent | rdtimeevent.h | — (non-Qt) | Zdarzenie czasowe |
| RDDataPacer | rddatapacer.h | QObject | Pacer wysyłki danych |
| RDDbHeartbeat | rddbheartbeat.h | QObject | Heartbeat połączenia DB |
| RDInstanceLock | rdinstancelock.h | — (non-Qt) | Blokada instancji procesu |
| RDLogLock | rdloglock.h | QObject | Blokada edycji logu |
| RDProcess | rdprocess.h | QObject | Zarządzanie procesami |
| RDEventPlayer | rdevent_player.h | QObject | Odtwarzacz zdarzeń (dźwięki UI) |
| RDTextValidator | rdtextvalidator.h | QValidator | Walidator tekstu |
| RDIdValidator | rdidvalidator.h | QValidator | Walidator ID |
| RDCartDrag | rdcartdrag.h | Q3StoredDrag | Drag-and-drop cartów |
| RDGpio | rdgpio.h | QObject | Sterowanie GPIO |
| RDKernelGpio | rdkernelgpio.h | QObject | GPIO przez kernel |
| RDCmdSwitch | rdcmd_switch.h | — (non-Qt) | Parsowanie argumentów CLI |
| RDProfile | rdprofile.h | — (non-Qt) | Parsowanie plików konfiguracyjnych |
| RDTempDirectory | rdtempdirectory.h | — (non-Qt) | Katalog tymczasowy |
| RDStringList | rdstringlist.h | QStringList | Rozszerzony QStringList |
| RDHash | rdhash.h | — (non-Qt) | Hashowanie (SHA1) |
| RDSendMail | rdsendmail.h | — (non-Qt) | Wysyłanie e-maili |

### Disc lookup

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RDDiscLookup | rddisclookup.h | QObject | Bazowa klasa lookup płyt CD |
| RDCddbLookup | rdcddblookup.h | QObject | Lookup CDDB |
| RDMbLookup | rdmblookup.h | QObject | Lookup MusicBrainz |
| RDDummyLookup | rddummylookup.h | QObject | Dummy lookup (brak sieci) |
| RDDiscRecord | rddiscrecord.h | — (non-Qt) | Rekord dysku CD |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdadd_cart.h | rdadd_cart.cpp | Dialog dodawania carta |
| 002 | rdadd_log.h | rdadd_log.cpp | Dialog dodawania logu |
| 003 | rdairplay_conf.h | rdairplay_conf.cpp | Konfiguracja RDAirPlay |
| 004 | rdapplication.h | rdapplication.cpp | Główna klasa aplikacji |
| 005 | rdaudio_exists.h | rdaudio_exists.cpp | Sprawdzanie istnienia audio |
| 006 | rdaudio_port.h | rdaudio_port.cpp | Port audio |
| 007 | rdaudioconvert.h | rdaudioconvert.cpp | Konwersja audio |
| 008 | rdaudioexport.h | rdaudioexport.cpp | Eksport audio |
| 009 | rdaudioimport.h | rdaudioimport.cpp | Import audio |
| 010 | rdaudioinfo.h | rdaudioinfo.cpp | Info audio |
| 011 | rdaudiosettings.h | rdaudiosettings.cpp | Ustawienia audio |
| 012 | rdaudiostore.h | rdaudiostore.cpp | Storage audio |
| 013 | rdbusybar.h | rdbusybar.cpp | Widget busy bar |
| 014 | rdbusydialog.h | rdbusydialog.cpp | Dialog busy |
| 015 | rdbutton_dialog.h | rdbutton_dialog.cpp | Dialog przycisku |
| 016 | rdbutton_panel.h | rdbutton_panel.cpp | Panel przycisków |
| 017 | rdcae.h | rdcae.cpp | Klient CAE |
| 018 | rdcardselector.h | rdcardselector.cpp | Selektor kart audio |
| 019 | rdcart.h | rdcart.cpp | Cart |
| 020 | rdcart_dialog.h | rdcart_dialog.cpp | Dialog carta |
| 021 | rdcart_search_text.h | rdcart_search_text.cpp | Tekst wyszukiwania cartów |
| 022 | rdcartdrag.h | rdcartdrag.cpp | Drag-and-drop cartów |
| 023 | rdcartslot.h | rdcartslot.cpp | Slot carta |
| 024 | rdcastsearch.h | rdcastsearch.cpp | Wyszukiwanie podcastów |
| 025 | rdcatch_conf.h | rdcatch_conf.cpp | Konfiguracja RDCatch |
| 026 | rdcatch_connect.h | rdcatch_connect.cpp | Połączenie z rdcatchd |
| 027 | rdcddblookup.h | rdcddblookup.cpp | Lookup CDDB |
| 028 | rdcdplayer.h | rdcdplayer.cpp | Odtwarzacz CD |
| 029 | rdcdripper.h | rdcdripper.cpp | Ripper CD |
| 030 | rdcheck_version.h | rdcheck_version.cpp | Sprawdzanie wersji |
| 031 | rdclock.h | rdclock.cpp | Zegar programowy |
| 032 | rdcmd_cache.h | rdcmd_cache.cpp | Cache komend |
| 033 | rdcmd_switch.h | rdcmd_switch.cpp | Parsowanie argumentów CLI |
| 034 | rdcodetrap.h | rdcodetrap.cpp | Pułapka kodów |
| 035 | rdcombobox.h | rdcombobox.cpp | ComboBox |
| 036 | rdconf.h | rdconf.cpp | Pomocnicze funcje konfiguracji |
| 037 | rdconfig.h | rdconfig.cpp | Główna konfiguracja (rd.conf) |
| 038 | rdcopyaudio.h | rdcopyaudio.cpp | Kopiowanie audio |
| 039 | rdcsv.h | rdcsv.cpp | Parser CSV |
| 040 | rdcueedit.h | rdcueedit.cpp | Edycja cue |
| 041 | rdcueeditdialog.h | rdcueeditdialog.cpp | Dialog edycji cue |
| 042 | rdcut.h | rdcut.cpp | Cut (segment audio) |
| 043 | rdcut_dialog.h | rdcut_dialog.cpp | Dialog cut |
| 044 | rdcut_path.h | rdcut_path.cpp | Ścieżka do pliku cut |
| 045 | rddatedecode.h | rddatedecode.cpp | Dekodowanie dat |
| 046 | rddatedialog.h | rddatedialog.cpp | Dialog daty |
| 047 | rddatepicker.h | rddatepicker.cpp | Picker daty |
| 048 | rddb.h | rddb.cpp | Baza danych (wrapper) |
| 049 | rddbheartbeat.h | rddbheartbeat.cpp | Heartbeat DB |
| 050 | rddatapacer.h | rddatapacer.cpp | Pacer danych |
| 051 | rddatetime.h | rddatetime.cpp | Formatowanie daty/czasu |
| 052 | rddebug.h | rddebug.cpp | Debug logging |
| 053 | rddeck.h | rddeck.cpp | Deck (konfiguracja) |
| 054 | rddelete.h | rddelete.cpp | Usuwanie zasobów (async) |
| 055 | rddialog.h | rddialog.cpp | Bazowy dialog |
| 056 | rddisclookup.h | rddisclookup.cpp | Bazowy disc lookup |
| 057 | rddisclookup_factory.h | rddisclookup_factory.cpp | Factory disc lookup |
| 058 | rddiscrecord.h | rddiscrecord.cpp | Rekord dysku CD |
| 059 | rddownload.h | rddownload.cpp | Download |
| 060 | rddropbox.h | rddropbox.cpp | DropBox |
| 061 | rddummylookup.h | rddummylookup.cpp | Dummy disc lookup |
| 062 | rdedit_audio.h | rdedit_audio.cpp | Edycja audio (marker editor) |
| 063 | rdedit_panel_name.h | rdedit_panel_name.cpp | Edycja nazwy panelu |
| 064 | rdemptycart.h | rdemptycart.cpp | Widget pustego carta |
| 065 | rdescape_string.h | rdescape_string.cpp | Escapowanie stringów SQL |
| 066 | rdevent.h | rdevent.cpp | Zdarzenie |
| 067 | rdevent_line.h | rdevent_line.cpp | Linia zdarzenia |
| 068 | rdevent_player.h | rdevent_player.cpp | Odtwarzacz zdarzeń |
| 069 | rdeventimportlist.h | rdeventimportlist.cpp | Lista importów zdarzenia |
| 070 | rdexport_settings_dialog.h | rdexport_settings_dialog.cpp | Dialog ustawień eksportu |
| 071 | rdfeed.h | rdfeed.cpp | Feed podcastu |
| 072 | rdfontengine.h | rdfontengine.cpp | Silnik fontów |
| 073 | rdformpost.h | rdformpost.cpp | Parsowanie form POST |
| 074 | rdflacdecode.h | rdflacdecode.cpp | Dekoder FLAC |
| 075 | rdframe.h | rdframe.cpp | Bazowy QFrame widget |
| 076 | rdgain_envelope.h | rdgain_envelope.cpp | Obwiednia gain |
| 077 | rdget_ath.h | rdget_ath.cpp | Dialog uwierzytelniania |
| 078 | rdgetpasswd.h | rdgetpasswd.cpp | Dialog hasła |
| 079 | rdgpio.h | rdgpio.cpp | GPIO |
| 080 | rdgpioselector.h | rdgpioselector.cpp | Selektor GPIO |
| 081 | rdgrid.h | rdgrid.cpp | Grid (siatka programu) |
| 082 | rdgroup.h | rdgroup.cpp | Grupa |
| 083 | rdgroup_list.h | rdgroup_list.cpp | Lista grup |
| 084 | rdhash.h | rdhash.cpp | Hash (SHA1) |
| 085 | rdhotkeys.h | rdhotkeys.cpp | Hot keys |
| 086 | rdhotkeylist.h | rdhotkeylist.cpp | Lista hot keys |
| 087 | rdidvalidator.h | rdidvalidator.cpp | Walidator ID |
| 088 | rdimagepickerbox.h | rdimagepickerbox.cpp | Picker obrazów (combo) |
| 089 | rdimagepickermodel.h | rdimagepickermodel.cpp | Model obrazów |
| 090 | rdimport_audio.h | rdimport_audio.cpp | Dialog importu audio |
| 091 | rdinstancelock.h | rdinstancelock.cpp | Blokada instancji |
| 092 | rdkernelgpio.h | rdkernelgpio.cpp | Kernel GPIO |
| 093 | rdlibrary_conf.h | rdlibrary_conf.cpp | Konfiguracja RDLibrary |
| 094 | rdlineedit.h | rdlineedit.cpp | LineEdit |
| 095 | rdlistselector.h | rdlistselector.cpp | Selektor list |
| 096 | rdlist_groups.h | rdlist_groups.cpp | Dialog listy grup |
| 097 | rdlist_logs.h | rdlist_logs.cpp | Dialog listy logów |
| 098 | rdlistsvcs.h | rdlistsvcs.cpp | Dialog listy serwisów |
| 099 | rdlistview.h | rdlistview.cpp | ListView (Qt3-compat) |
| 100 | rdlistviewitem.h | rdlistviewitem.cpp | ListViewItem |
| 101 | rdlivewire.h | rdlivewire.cpp | LiveWire |
| 102 | rdlivewiredestination.h | rdlivewiredestination.cpp | LiveWire destination |
| 103 | rdlivewiresource.h | rdlivewiresource.cpp | LiveWire source |
| 104 | rdlog.h | rdlog.cpp | Log |
| 105 | rdlog_event.h | rdlog_event.cpp | Zdarzenie logu |
| 106 | rdlog_icons.h | rdlog_icons.cpp | Ikony logu |
| 107 | rdlog_line.h | rdlog_line.cpp | Linia logu |
| 108 | rdlogedit_conf.h | rdlogedit_conf.cpp | Konfiguracja RDLogEdit |
| 109 | rdlogfilter.h | rdlogfilter.cpp | Filtr logów |
| 110 | rdloglock.h | rdloglock.cpp | Blokada logu |
| 111 | rdlogplay.h | rdlogplay.cpp | Odtwarzanie logu |
| 112 | rdmacro.h | rdmacro.cpp | Makro RML |
| 113 | rdmacro_event.h | rdmacro_event.cpp | Kontener makr |
| 114 | rdmarker_bar.h | rdmarker_bar.cpp | Pasek markerów |
| 115 | rdmarker_button.h | rdmarker_button.cpp | Przycisk markera |
| 116 | rdmarker_edit.h | rdmarker_edit.cpp | Edycja markera |
| 117 | rdmatrix.h | rdmatrix.cpp | Matryca audio |
| 118 | rdmblookup.h | rdmblookup.cpp | MusicBrainz lookup |
| 119 | rdmeteraverage.h | rdmeteraverage.cpp | Średnia metrów |
| 120 | rdmixer.h | rdmixer.cpp | Mikser audio |
| 121 | rdmonitor_config.h | rdmonitor_config.cpp | Konfiguracja RDMonitor |
| 122 | rdmp4.h | rdmp4.cpp | Obsługa MP4 |
| 123 | rdmulticaster.h | rdmulticaster.cpp | Multicast |
| 124 | rdnotification.h | rdnotification.cpp | Powiadomienia |
| 125 | rdoneshot.h | rdoneshot.cpp | Jednorazowy timer |
| 126 | rdpam.h | rdpam.cpp | PAM auth |
| 127 | rdpanel_button.h | rdpanel_button.cpp | Przycisk panelu |
| 128 | rdpasswd.h | rdpasswd.cpp | Dialog hasła |
| 129 | rdplay_deck.h | rdplay_deck.cpp | Play deck |
| 130 | rdplaymeter.h | rdplaymeter.cpp | Miernik playback |
| 131 | rdpeaksexport.h | rdpeaksexport.cpp | Eksport peaks |
| 132 | rdpodcast.h | rdpodcast.cpp | Podcast |
| 133 | rdprocess.h | rdprocess.cpp | Proces |
| 134 | rdprofile.h | rdprofile.cpp | Profil konfiguracji |
| 135 | rdpushbutton.h | rdpushbutton.cpp | PushButton |
| 136 | rdrecording.h | rdrecording.cpp | Nagranie |
| 137 | rdrehash.h | rdrehash.cpp | Rehash |
| 138 | rdrenderer.h | rdrenderer.cpp | Renderer |
| 139 | rdreplicator.h | rdreplicator.cpp | Replikator |
| 140 | rdreport.h | rdreport.cpp | Raport |
| 141 | rdringbuffer.h | rdringbuffer.cpp | Ring buffer |
| 142 | rdripc.h | rdripc.cpp | RIPC (RPC client) |
| 143 | rdrssschemas.h | rdrssschemas.cpp | Schematy RSS |
| 144 | rdrsscategorybox.h | rdrsscategorybox.cpp | Kategorie RSS |
| 145 | rdschedcartlist.h | rdschedcartlist.cpp | Lista cartów schedulera |
| 146 | rdschedcode.h | rdschedcode.cpp | Kod schedulera |
| 147 | rdschedcodes_dialog.h | rdschedcodes_dialog.cpp | Dialog kodów schedulera |
| 148 | rdschedruleslist.h | rdschedruleslist.cpp | Lista reguł schedulera |
| 149 | rdsegmeter.h | rdsegmeter.cpp | Segment meter |
| 150 | rdsendmail.h | rdsendmail.cpp | Wysyłanie maili |
| 151 | rdsettings.h | rdsettings.cpp | Ustawienia |
| 152 | rdsimpleplayer.h | rdsimpleplayer.cpp | Prosty odtwarzacz |
| 153 | rdslider.h | rdslider.cpp | Suwak |
| 154 | rdslotbox.h | rdslotbox.cpp | Box slotów |
| 155 | rdslotdialog.h | rdslotdialog.cpp | Dialog slotu |
| 156 | rdslotoptions.h | rdslotoptions.cpp | Opcje slotu |
| 157 | rdsocket.h | rdsocket.cpp | Socket |
| 158 | rdsocketstrings.h | rdsocketstrings.cpp | Stringi socketów |
| 159 | rdsound_panel.h | rdsound_panel.cpp | Panel dźwiękowy |
| 160 | rdstation.h | rdstation.cpp | Stacja |
| 161 | rdstatus.h | rdstatus.cpp | Status systemu |
| 162 | rdstereometer.h | rdstereometer.cpp | Miernik stereo |
| 163 | rdstringlist.h | rdstringlist.cpp | StringList |
| 164 | rdsvc.h | rdsvc.cpp | Serwis |
| 165 | rdsystem.h | rdsystem.cpp | System |
| 166 | rdsystemuser.h | rdsystemuser.cpp | System user |
| 167 | rdtempdirectory.h | rdtempdirectory.cpp | Katalog tymczasowy |
| 168 | rdtextfile.h | rdtextfile.cpp | Plik tekstowy |
| 169 | rdtextvalidator.h | rdtextvalidator.cpp | Walidator tekstu |
| 170 | rdtimeedit.h | rdtimeedit.cpp | Edycja czasu |
| 171 | rdtimeengine.h | rdtimeengine.cpp | Silnik czasu |
| 172 | rdtimeevent.h | rdtimeevent.cpp | Zdarzenie czasowe |
| 173 | rdtransportbutton.h | rdtransportbutton.cpp | Przycisk transportu |
| 174 | rdtransfer.h | rdtransfer.cpp | Transfer bazowy |
| 175 | rdtrimaudio.h | rdtrimaudio.cpp | Trim audio |
| 176 | rdtty.h | rdtty.cpp | TTY (serial) |
| 177 | rdttydevice.h | rdttydevice.cpp | Urządzenie TTY |
| 178 | rdttyout.h | rdttyout.cpp | Wyjście TTY |
| 179 | rdurl.h | rdurl.cpp | URL helper |
| 180 | rduser.h | rduser.cpp | Użytkownik |
| 181 | rdupload.h | rdupload.cpp | Upload |
| 182 | rdunixserver.h | rdunixserver.cpp | Unix server |
| 183 | rdunixsocket.h | rdunixsocket.cpp | Unix socket |
| 184 | rdversion.h | rdversion.cpp | Wersja |
| 185 | rdwavedata.h | rdwavedata.cpp | Dane wave |
| 186 | rdwavedata_dialog.h | rdwavedata_dialog.cpp | Dialog danych wave |
| 187 | rdwavefile.h | rdwavefile.cpp | Plik WAV |
| 188 | rdwavepainter.h | rdwavepainter.cpp | Painter waveformu |
| 189 | rdweb.h | rdweb.cpp | Web utilities |
| 190 | rdwebresult.h | rdwebresult.cpp | Wynik web |
| 191 | rdwidget.h | rdwidget.cpp | Bazowy widget |

### Pliki tylko .h (bez .cpp)

| Header | Zawartość |
|--------|-----------|
| rd.h | Główny nagłówek z definicjami stałych, enumów i makr systemu Rivendell |
| gpio.h | Struktury danych GPIO |
| dbversion.h | Definicja wersji schematu bazy danych |
| rdpaths.h.in | Template ścieżek systemowych (generowany przez configure) |
| rdxport_interface.h | Interfejs xport (web API) — struktury danych |

### Pliki tylko .cpp (bez .h) — eksportery raportów

| Source | Zawartość |
|--------|-----------|
| export_bmiemr.cpp | Eksporter: BMI EMR |
| export_cutlog.cpp | Eksporter: Cut Log |
| export_deltaflex.cpp | Eksporter: DeltaFlex |
| export_musicclassical.cpp | Eksporter: Music Classical |
| export_musicplayout.cpp | Eksporter: Music Playout |
| export_musicsummary.cpp | Eksporter: Music Summary |
| export_nprsoundex.cpp | Eksporter: NPR Soundex |
| export_radiotraffic.cpp | Eksporter: Radio Traffic |
| export_resultsrecon.cpp | Eksporter: Results Recon |
| export_soundex.cpp | Eksporter: Soundex |
| export_spincount.cpp | Eksporter: Spin Count |
| export_technical.cpp | Eksporter: Technical |
| export_textlog.cpp | Eksporter: Text Log |

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_*.cpp (97 plików) | Generowane przez Qt moc (Meta Object Compiler) |
| rdpaths.h | Generowany z rdpaths.h.in przez configure |

## Pliki testowe

| Plik | Framework | Testowane klasy/funkcje |
|------|-----------|------------------------|
| tests/audio_convert_test.cpp | standalone | RDAudioConvert |
| tests/audio_export_test.cpp | standalone | RDAudioExport |
| tests/audio_import_test.cpp | standalone | RDAudioImport |
| tests/audio_metadata_test.cpp | standalone | metadane audio |
| tests/audio_peaks_test.cpp | standalone | peaks audio |
| tests/cmdline_parser_test.cpp | standalone | RDCmdSwitch |
| tests/datedecode_test.cpp | standalone | RDDateDecode |
| tests/dateparse_test.cpp | standalone | parsowanie dat |
| tests/db_charset_test.cpp | standalone | charset DB |
| tests/delete_test.cpp | standalone | RDDelete |
| tests/download_test.cpp | standalone | RDDownload |
| tests/feed_image_test.cpp | standalone | obrazy feedu |
| tests/getpids_test.cpp | standalone | PIDs |
| tests/log_unlink_test.cpp | standalone | unlinkowanie logów |
| tests/mcast_recv_test.cpp | standalone | multicast receive |
| tests/metadata_wildcard_test.cpp | standalone | wildcards metadanych |
| tests/notification_test.cpp | standalone | RDNotification |
| tests/rdwavefile_test.cpp | standalone | RDWaveFile |
| tests/rdxml_parse_test.cpp | standalone | parsowanie XML |
| tests/readcd_test.cpp | standalone | czytanie CD |
| tests/reserve_carts_test.cpp | standalone | rezerwacja cartów |
| tests/sendmail_test.cpp | standalone | RDSendMail |
| tests/stringcode_test.cpp | standalone | kodowanie stringów |
| tests/test_hash.cpp | standalone | RDHash |
| tests/test_pam.cpp | standalone | RDPam |
| tests/timer_test.cpp | standalone | timer |
| tests/upload_test.cpp | standalone | RDUpload |
| tests/wav_chunk_test.cpp | standalone | chunki WAV |

## Autotools Target Definition

```makefile
# lib/Makefile.am
lib_LTLIBRARIES = librd.la

# 191 par .h/.cpp + 13 export_*.cpp + 5 standalone .h
dist_librd_la_SOURCES = [... 254 linii źródeł ...]

# 97 plików moc (generowane)
nodist_librd_la_SOURCES = moc_rdadd_cart.cpp ... moc_rdwidget.cpp

librd_la_LDFLAGS = -release $(VERSION)
```

## Zależności (z Makefile.am i configure.ac)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| Qt4 (QtCore, QtGui, QtNetwork, QtSql, Qt3Support) | Qt framework | tak |
| libvorbis / libvorbisenc / libvorbisfile | codec audio | tak |
| FLAC / FLAC++ | codec audio | tak |
| libsndfile | audio I/O | tak |
| libsamplerate | resampling | tak |
| SoundTouch | time-stretch | tak |
| libid3tag / taglib | metadane audio | tak |
| cdparanoia (cdda_interface, cdda_paranoia) | CD ripping | tak |
| libmusicbrainz | disc lookup | tak |
| libcurl | HTTP/FTP transfer | tak |
| OpenSSL (libcrypto) | hashing/crypto | tak |
| PAM (libpam) | autentykacja | tak |
| MySQL/MariaDB client | baza danych | tak |
