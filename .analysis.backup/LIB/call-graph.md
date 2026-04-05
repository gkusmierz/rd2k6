---
phase: 4
artifact: LIB
artifact_name: librd
status: done
completed_at: 2026-04-05
partial_count: 0
total_connections: 180+
circular_deps_found: 0
agent_version: 1.1.0
---

# Call Graph: librd

## Statystyki

| Metryka | Wartosc |
|---------|---------|
| Polaczenia connect() lacznie | ~180 |
| Unikalne sygnaly | ~85 |
| Klasy emitujace | ~35 |
| Klasy odbierajace | ~30 |
| Cross-artifact polaczenia (TCP/IPC) | 3 (CAE, RIPC, CatchConnect) |
| Circular dependencies | 0 |

---

## Graf polaczen (connect registry)

### RDLogPlay — centralny silnik odtwarzania

| # | Nadawca | Sygnal | Odbiorca | Slot | Plik |
|---|---------|--------|----------|------|------|
| 1 | RDMacroEvent (play_macro_deck) | started() | RDLogPlay | macroStartedData() | rdlogplay.cpp:113 |
| 2 | RDMacroEvent (play_macro_deck) | finished() | RDLogPlay | macroFinishedData() | rdlogplay.cpp:114 |
| 3 | RDMacroEvent (play_macro_deck) | stopped() | RDLogPlay | macroStoppedData() | rdlogplay.cpp:115 |
| 4 | RDCae (play_cae) | timescalingSupported(int,bool) | RDLogPlay | timescalingSupportedData(int,bool) | rdlogplay.cpp:120 |
| 5 | RDRipc (rda->ripc()) | onairFlagChanged(bool) | RDLogPlay | onairFlagChangedData(bool) | rdlogplay.cpp:126 |
| 6 | RDRipc (rda->ripc()) | notificationReceived(RDNotification*) | RDLogPlay | notificationReceivedData(RDNotification*) | rdlogplay.cpp:128 |
| 7 | RDSimplePlayer (play_audition_player) | played() | RDLogPlay | auditionStartedData() | rdlogplay.cpp:143 |
| 8 | RDSimplePlayer (play_audition_player) | stopped() | RDLogPlay | auditionStoppedData() | rdlogplay.cpp:145 |
| 9 | QTimer (play_trans_timer) | timeout() | RDLogPlay | transTimerData() | rdlogplay.cpp:157 |
| 10 | QTimer (play_grace_timer) | timeout() | RDLogPlay | graceTimerData() | rdlogplay.cpp:161 |
| 11 | RDPlayDeck (playdeck) | stateChanged(int,RDPlayDeck::State) | RDLogPlay | playStateChangedData(int,RDPlayDeck::State) | rdlogplay.cpp:2105 |
| 12 | RDPlayDeck (playdeck) | position(int,int) | RDLogPlay | positionData(int,int) | rdlogplay.cpp:2107 |
| 13 | RDPlayDeck (playdeck) | segueStart(int) | RDLogPlay | segueStartData(int) | rdlogplay.cpp:2109 |
| 14 | RDPlayDeck (playdeck) | segueEnd(int) | RDLogPlay | segueEndData(int) | rdlogplay.cpp:2111 |
| 15 | RDPlayDeck (playdeck) | talkStart(int) | RDLogPlay | talkStartData(int) | rdlogplay.cpp:2113 |
| 16 | RDPlayDeck (playdeck) | talkEnd(int) | RDLogPlay | talkEndData(int) | rdlogplay.cpp:2115 |

### RDLogPlay — sygnaly emitowane

| # | Sygnal | Emitowany w | Warunek | Znaczenie |
|---|--------|------------|---------|-----------|
| 1 | renamed() | setLogName() | zmiana nazwy logu | Log zostal przemianowany |
| 2 | reloaded() | load()/refresh() | po zaladowaniu | Log zostal zaladowany/odswiezony |
| 3 | transportChanged() | play/stop/pause events | zmiana stanu transportu | Zmiana stanu odtwarzania |
| 4 | inserted(int line) | insert() | wstawienie linii | Nowa linia w logu |
| 5 | removed(int line, int num, bool) | remove() | usuniecie linii | Linia usunieta z logu |
| 6 | modified(int line) | rozne | modyfikacja linii | Linia zmodyfikowana |
| 7 | played(int line) | StartEvent() | start odtwarzania | Element rozpoczal odtwarzanie |
| 8 | paused(int line) | Paused() | pauza | Element wstrzymany |
| 9 | stopped(int line) | Stopped() | stop | Element zatrzymany |
| 10 | position(int line, int point) | positionData() | okresowo | Aktualizacja pozycji |
| 11 | topEventChanged(int line) | UpdateStartTimes() | zmiana kolejki | Gorny element zmieniony |
| 12 | nextEventChanged(int line) | AdvanceActiveEvent() | zmiana kolejki | Nastepny element zmieniony |
| 13 | activeEventChanged(int line, TransType) | rozne | zmiana aktywnego | Aktywny element zmieniony |
| 14 | nextStopChanged(QTime) | GetNextStop() | zmiana czasu | Czas nastepnego stopu |
| 15 | postPointChanged(QTime, int, bool, bool) | UpdatePostPoint() | zmiana post | Post-point zaktualizowany |
| 16 | runStatusChanged(bool) | play/stop | zmiana statusu | Zmiana statusu pracy |
| 17 | refreshabilityChanged(bool) | rozne | zmiana mozliwosci refresh | Zmiana odswiezalnosci |
| 18 | refreshStatusChanged(bool) | RefreshEvents() | odswiezanie | Status odswiezania |
| 19 | channelStarted(int,int,int,int) | StartAudioEvent() | start audio | Kanal audio uruchomiony |
| 20 | channelStopped(int,int,int,int) | ClearChannel() | stop audio | Kanal audio zatrzymany |

### RDSoundPanel — panel dzwiekowy

| # | Nadawca | Sygnal | Odbiorca | Slot | Plik |
|---|---------|--------|----------|------|------|
| 1 | QSignalMapper (panel_mapper) | mapped(int) | RDSoundPanel | buttonMapperData(int) | rdsound_panel.cpp:87 |
| 2 | RDComboBox (panel_selector_box) | activated(int) | RDSoundPanel | panelActivatedData(int) | rdsound_panel.cpp:101 |
| 3 | RDComboBox (panel_selector_box) | setupClicked() | RDSoundPanel | panelSetupData() | rdsound_panel.cpp:103 |
| 4 | RDComboBox (panel_playmode_box) | activated(int) | RDSoundPanel | playmodeActivatedData(int) | rdsound_panel.cpp:131 |
| 5 | QPushButton (panel_reset_button) | clicked() | RDSoundPanel | resetClickedData() | rdsound_panel.cpp:148 |
| 6 | QPushButton (panel_all_button) | clicked() | RDSoundPanel | allClickedData() | rdsound_panel.cpp:163 |
| 7 | QPushButton (panel_setup_button) | clicked() | RDSoundPanel | setupClickedData() | rdsound_panel.cpp:177 |
| 8 | RDCae (rda->cae()) | timescalingSupported(int,bool) | RDSoundPanel | timescalingSupportedData(int,bool) | rdsound_panel.cpp:190 |
| 9 | RDRipc (rda->ripc()) | onairFlagChanged(bool) | RDSoundPanel | onairFlagChangedData(bool) | rdsound_panel.cpp:196 |
| 10 | QTimer (panel_scan_timer) | timeout() | RDSoundPanel | scanPanelData() | rdsound_panel.cpp:229 |
| 11 | RDPlayDeck | stateChanged(int,State) | RDSoundPanel | stateChangedData(int,State) | rdsound_panel.cpp:1029 |
| 12 | RDPlayDeck | hookEnd(int) | RDSoundPanel | hookEndData(int) | rdsound_panel.cpp:1031 |
| 13 | RDSoundPanel | tick() | RDPanelButton | tickClock() | rdsound_panel.cpp:1033 |
| 14 | RDPanelButton | clicked() | QSignalMapper | map() | rdsound_panel.cpp:1215 |

### RDSoundPanel — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | tick() | wewnetrzny timer | Tik odliczania czasu przyciskow |
| 2 | buttonFlash(bool) | wewnetrzny timer | Flash migajacych przyciskow |
| 3 | selectClicked(unsigned,int,int) | buttonMapperData() | Wybor carta z panelu |
| 4 | channelStarted(int,int,int) | PlayAudio() | Kanal audio uruchomiony |
| 5 | channelStopped(int,int,int) | Stopped()/ClearChannel() | Kanal audio zatrzymany |

### RDCae — klient audio engine

| # | Nadawca | Sygnal | Odbiorca | Slot | Plik |
|---|---------|--------|----------|------|------|
| 1 | QTimer | timeout() | RDCae | clockData() | rdcae.cpp:95 |
| 2 | QTimer | timeout() | RDCae | readyData() | rdcae.cpp:111 |

### RDCae — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | isConnected(bool) | connectHost() | Polaczenie z CAE |
| 2 | playLoaded(int) | DispatchCommand() | Audio zaladowane |
| 3 | playPositioned(int,unsigned) | DispatchCommand() | Pozycja ustawiona |
| 4 | playing(int) | DispatchCommand() | Odtwarzanie rozpoczete |
| 5 | playStopped(int) | DispatchCommand() | Odtwarzanie zatrzymane |
| 6 | playUnloaded(int) | DispatchCommand() | Zasoby zwolnione |
| 7 | recordLoaded(int,int) | DispatchCommand() | Nagrywanie gotowe |
| 8 | recording(int,int) | DispatchCommand() | Nagrywanie w toku |
| 9 | recordStopped(int,int) | DispatchCommand() | Nagrywanie zatrzymane |
| 10 | recordUnloaded(int,int,unsigned) | DispatchCommand() | Zasoby nagrywania zwolnione |
| 11 | gpiInputChanged(int,bool) | DispatchCommand() | Zmiana GPI |
| 12 | inputStatusChanged(int,int,bool) | DispatchCommand() | Zmiana statusu wejscia |
| 13 | playPositionChanged(int,unsigned) | DispatchCommand() | Pozycja zmienionia |
| 14 | timescalingSupported(int,bool) | DispatchCommand() | Info o timescaling |

### RDRipc — klient RPC

| # | Nadawca | Sygnal | Odbiorca | Slot | Plik |
|---|---------|--------|----------|------|------|
| 1 | QTcpSocket (ripc_socket) | connected() | RDRipc | connectedData() | rdripc.cpp:50 |
| 2 | QTcpSocket (ripc_socket) | error(SocketError) | RDRipc | errorData(SocketError) | rdripc.cpp:51 |
| 3 | QTcpSocket (ripc_socket) | readyRead() | RDRipc | readyData() | rdripc.cpp:53 |

### RDRipc — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | connected(bool) | connectedData() | Polaczenie z ripcd |
| 2 | userChanged() | DispatchCommand() | Zmiana uzytkownika |
| 3 | gpiStateChanged(int,int,bool) | DispatchCommand() | Zmiana GPI |
| 4 | gpoStateChanged(int,int,bool) | DispatchCommand() | Zmiana GPO |
| 5 | gpiMaskChanged(int,int,bool) | DispatchCommand() | Zmiana maski GPI |
| 6 | gpoMaskChanged(int,int,bool) | DispatchCommand() | Zmiana maski GPO |
| 7 | gpiCartChanged(int,int,int,int) | DispatchCommand() | Zmiana cartow GPI |
| 8 | gpoCartChanged(int,int,int,int) | DispatchCommand() | Zmiana cartow GPO |
| 9 | notificationReceived(RDNotification*) | DispatchCommand() | Powiadomienie |
| 10 | onairFlagChanged(bool) | DispatchCommand() | Zmiana on-air |
| 11 | rmlReceived(RDMacro*) | DispatchCommand() | Komenda RML |

### RDCatchConnect — klient catch

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | connected(int,bool) | connectedData() | Polaczenie z rdcatchd |
| 2 | statusChanged(int,unsigned,Status,int,QString) | DispatchCommand() | Status decka |
| 3 | monitorChanged(int,unsigned,bool) | DispatchCommand() | Monitor state |
| 4 | meterLevel(int,int,int,int) | DispatchCommand() | Poziom audio |
| 5 | eventUpdated(int) | DispatchCommand() | Event updated |
| 6 | eventPurged(int) | DispatchCommand() | Event purged |
| 7 | heartbeatFailed(int) | heartbeatTimeoutData() | Utrata polaczenia |

### RDPlayDeck — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | stateChanged(int,State) | rozne stany | Zmiana stanu decka |
| 2 | position(int,int) | positionTimerData() | Pozycja odtwarzania |
| 3 | segueStart(int) | pointTimerData() | Poczatek segue |
| 4 | segueEnd(int) | pointTimerData() | Koniec segue |
| 5 | hookStart(int) | pointTimerData() | Poczatek hook |
| 6 | hookEnd(int) | pointTimerData() | Koniec hook |
| 7 | talkStart(int) | pointTimerData() | Poczatek talk |
| 8 | talkEnd(int) | pointTimerData() | Koniec talk |

### RDLiveWire — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | connected(unsigned) | connectedData() | Polaczenie LWRP |
| 2 | sourceChanged(unsigned,RDLiveWireSource*) | ReadSources() | Zmiana zrodla |
| 3 | destinationChanged(unsigned,RDLiveWireDestination*) | ReadDestinations() | Zmiana celu |
| 4 | gpiChanged(unsigned,unsigned,unsigned,bool) | ReadGpis() | Zmiana GPI |
| 5 | gpoChanged(unsigned,unsigned,unsigned,bool) | ReadGpos() | Zmiana GPO |
| 6 | watchdogStateChanged(unsigned,QString) | watchdogData() | Watchdog |

### RDMacroEvent — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | started() | exec() | Start wykonywania makr |
| 2 | started(int) | ExecList() | Start konkretnej linii |
| 3 | finished() | ExecList() | Koniec wykonywania |
| 4 | finished(int) | ExecList() | Koniec konkretnej linii |
| 5 | stopped() | stop() | Przerwanie |

### RDApplication — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | userChanged() | open() | Zmiana uzytkownika po inicjalizacji |

### RDRenderer — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | progressMessageSent(QString) | ProgressMessage() | Postep renderowania |
| 2 | lineStarted(int,int) | Render() | Przetwarzanie linii logu |

### RDFeed — sygnaly emitowane

| # | Sygnal | Emitowany w | Znaczenie |
|---|--------|------------|-----------|
| 1 | postProgressRangeChanged(int,int) | postPodcast/postXml | Zakres postepu uploadu |
| 2 | renderLineStartedData(int,int) | postLog() | Postep renderowania |

### Inne emitory sygnalow

| Klasa | Sygnal | Znaczenie |
|-------|--------|-----------|
| RDLogFilter | filterChanged(QString) | Zmiana filtra |
| RDCardSelector | settingsChanged(int,int,int,int) | Zmiana ustawien karty/portu |
| RDGpioSelector | settingsChanged() | Zmiana ustawien GPIO |
| RDTimeEngine | timeout(int) | Zdarzenie czasowe nadeszlo |
| RDOneShot | timeout(int) | Timer jednorazowy |
| RDCodeTrap | trapSeen(int,int) | Sekwencja znakow rozpoznana |
| RDDataPacer | dataSent(QByteArray) | Dane wyslane |
| RDMulticaster | received(QByteArray) | Dane multicast |
| RDUnixServer | newConnection(int) | Nowe polaczenie UNIX socket |
| RDProcess | started/finished(int) | Proces zewnetrzny |
| RDSlotBox | doubleClicked() | Double-click na slocie |
| RDCdPlayer | played/stopped/ejected | Stan odtwarzacza CD |
| RDCdRipper | progressChanged(int,int) | Postep rippingu |
| RDStereoMeter | clipChanged(int,bool) | Stan clip |
| RDImagePickerModel | refreshRows(int,int) | Odswiezenie modelu |

---

## Kluczowe przeplwy zdarzen

### Przepyw: Odtwarzanie elementu logu

```
[RDLogPlay] play(line, length, logline, trans)
    -> StartEvent(line)
        -> StartAudioEvent(line)
            -> RDPlayDeck::play(handle, length, speed)
                -> RDCae::play(handle, length, speed, pitch)
                    -> [TCP -> caed] "PL handle length speed pitch"
                        -> [caed -> TCP] "PY handle"
                -> emit stateChanged(id, Playing)
            -> RDLogPlay::playStateChangedData(id, Playing)
                -> emit played(line)
                -> emit channelStarted(id, mport, card, port)
    -> [RDPlayDeck timer] position(id, msecs)
        -> RDLogPlay::positionData(id, msecs)
            -> emit position(line, point)
    -> [RDPlayDeck timer] segueStart(id)
        -> RDLogPlay::segueStartData(id)
            -> play(next_line) // automatyczne uruchomienie nastepnego
    -> [RDPlayDeck] stateChanged(id, Stopped)
        -> RDLogPlay::playStateChangedData(id, Stopped)
            -> emit stopped(line)
            -> emit channelStopped(id, mport, card, port)
            -> FinishEvent(line) // czyszczenie
```

**Efekt biznesowy:** Odtworzenie elementu logu z automatycznym segue do nastepnego. Kluczowy flow dla automatyki radiowej.

### Przepyw: Klikniecie przycisku panelu dzwiekowego

```
[Uzytkownik] klika przycisk panelu
    -> RDPanelButton::clicked()
        -> QSignalMapper::mapped(int id)
            -> RDSoundPanel::buttonMapperData(int id)
                -> PlayButton(id, panel, row, col)
                    -> PlayAudio(button, logline, length)
                        -> RDPlayDeck::play()
                            -> RDCae::play()
                        -> emit channelStarted(mport, card, port)
    -> [RDPlayDeck] stateChanged(id, Playing)
        -> RDSoundPanel::stateChangedData(id, Playing)
            -> button->setState(Playing)
            -> button flash ON
    -> [RDPlayDeck] stateChanged(id, Stopped)
        -> RDSoundPanel::stateChangedData(id, Stopped)
            -> Stopped(id)
                -> emit channelStopped(mport, card, port)
                -> button->reset()
```

**Efekt biznesowy:** Natychmiastowe odtworzenie carta z przycisku panelu (jingle, efekt, reklama).

### Przepyw: Powiadomienie miedzy procesami

```
[Dowolna aplikacja] RDRipc::sendNotification(notify)
    -> [TCP -> ripcd] "ON type action id"
        -> [ripcd broadcast -> wszystkie klienty]
            -> RDRipc::readyData()
                -> DispatchCommand()
                    -> emit notificationReceived(notify)
                        -> RDLogPlay::notificationReceivedData(notify)
                            // np. odswiezenie po modyfikacji carta
                        -> RDSoundPanel: (nie podlacza bezposrednio)
```

**Efekt biznesowy:** Synchronizacja stanu miedzy wszystkimi aplikacjami Rivendell (np. edycja carta w rdlibrary natychmiast widoczna w rdairplay).

### Przepyw: Komenda RML

```
[Zewnetrzne zrodlo lub makro cart] 
    -> RDRipc::rmlReceived(RDMacro* rml)
        -> [Aplikacja odbierajaca interpretuje komende]
            -> np. PL (Play) -> RDLogPlay::play()
            -> np. ST (Stop) -> RDLogPlay::stop()
            -> np. PN (Panel) -> RDSoundPanel::play()
```

**Efekt biznesowy:** Zdalne sterowanie systemem przez komendy RML (z GPIO, serial, siec).

### Przepyw: Grace timer (opozniony start)

```
[RDLogPlay] element z timeType==Hard
    -> graceTimerData()
        -> sprawdzenie czy czas nadszedl
            -> play(line) // automatyczne odtworzenie o wyznaczonej godzinie
```

**Efekt biznesowy:** Precyzyjne odtwarzanie o zadanym czasie (np. wiadomosci o pelnej godzinie).

---

## Cross-artifact polaczenia

| Zrodlo | Mechanizm | Cel | Sygnal/Metoda | Znaczenie |
|--------|-----------|-----|---------------|-----------|
| LIB (RDCae) | TCP socket | CAE (caed) | komendy tekstowe (PL,SP,LR,etc.) | Sterowanie audio engine |
| LIB (RDRipc) | TCP socket | RPC (ripcd) | komendy tekstowe (RU,ON,GI,etc.) | GPIO, powiadomienia, RML |
| LIB (RDCatchConnect) | TCP socket | CTD (rdcatchd) | komendy tekstowe | Zaplanowane nagrania |
| LIB (RDAudioImport) | HTTP POST | XPT (rdxport.cgi) | multipart upload | Import audio przez web API |
| LIB (RDAudioExport) | HTTP GET | XPT (rdxport.cgi) | URL parametry | Eksport audio przez web API |
| LIB (RDFeed) | SFTP/FTP/HTTP | External server | curl upload | Publikacja podcastow |
| LIB (RDDownload) | HTTP/FTP/SFTP | External server | curl download | Pobieranie plikow |
| LIB (RDLiveWire) | TCP (LWRP) | Axia hardware | LWRP protocol | Routing audio LiveWire |

---

## Q_PROPERTY Reactive Bindings

Brak Q_PROPERTY z NOTIFY w librd. Klasy nie uzywaja mechanizmu Q_PROPERTY (Qt3/Qt4 styl — gettery/settery bezposrednie).

---

## Circular Dependencies

| Cykl | Klasy | Intentional? | Uwagi |
|------|-------|-------------|-------|
| Brak zidentyfikowanych | - | - | - |

---

## Missing Coverage

Sygnaly zdefiniowane w headerach ale nie znalezione w zadnym connect() wewnatrz librd (polaczone w aplikacjach klienckich):

| Klasa | Sygnal | Wyjasnenie |
|-------|--------|-----------|
| RDLogPlay | auditionHeadPlayed/auditionTailPlayed/auditionStopped | Polaczone w aplikacjach (rdairplay) |
| RDCae | recordLoaded/recording/recordStopped/recordUnloaded | Polaczone w rdcatch/rdlibrary |
| RDRipc | gpiCartChanged/gpoCartChanged | Polaczone w rdadmin |
| RDCatchConnect | deckEventSent | Polaczone w rdcatch |
| RDRenderer | progressMessageSent/lineStarted | Polaczone w rdlogedit/rdcastmanager |
