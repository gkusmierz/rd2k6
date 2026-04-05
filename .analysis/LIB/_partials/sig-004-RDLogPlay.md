---
partial_id: 004
class_name: RDLogPlay
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDLogPlay

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| `renamed()` | `setLogName()` | Gdy nowa nazwa logu różni się od bieżącej | Nazwa logu została zmieniona |
| `reloaded()` | `setNextLine()`, `load()`, `append()`, `move()`, `remove()`, `refresh()` | Po każdej operacji przeładowania lub zmiany struktury logu | Zawartość logu została odświeżona |
| `transportChanged()` | `setNextLine()`, `load()`, `append()`, `move()`, `remove()`, `makeNext()`, `Playing()`, `Paused()`, `Stopped()`, `Finished()`, `play()`, `pause()`, `stop()` | Po każdej zmianie stanu transportu | Stan transportu uległ zmianie (do odświeżenia widoku) |
| `inserted(int line)` | `insert()`, `insertCart()`, `move()` | Po wstawieniu zdarzenia do logu | Nowy element wstawiony na pozycji `line` |
| `removed(int line, int num, bool moving)` | `remove()`, `move()` | Po usunięciu zdarzeń z logu | `num` elementów usunięto od pozycji `line`; `moving=true` gdy to część operacji przeniesienia |
| `modified(int line)` | `insert()`, `insertCart()`, `remove()`, `move()`, `setLogLine()`, `RefreshEvents()`, `StartEvent()`, `GetNextPlayable()`, `Playing()`, `refresh()` | Po modyfikacji właściwości zdarzenia na pozycji `line` | Parametry zdarzenia `line` zostały zaktualizowane |
| `auditionHeadPlayed(int line)` | `auditionStartedData()` | Gdy `play_audition_head_played==true` | Audycja head-point zdarzenia `line` rozpoczęła odtwarzanie |
| `auditionTailPlayed(int line)` | `auditionStartedData()` | Gdy `play_audition_head_played==false` | Audycja tail-point zdarzenia `line` rozpoczęła odtwarzanie |
| `auditionStopped(int line)` | `auditionStoppedData()` | Zawsze | Audycja zdarzenia `line` zakończyła odtwarzanie |
| `played(int line)` | `Playing()`, `StartEvent()` (makro/marker) | Gdy zdarzenie przechodzi w stan Playing | Zdarzenie `line` zaczęło się odtwarzać |
| `paused(int line)` | `Paused()` | Po wywołaniu pauzy | Zdarzenie `line` zostało wstrzymane |
| `stopped(int line)` | `Stopped()`, `CleanupEvent()` | Po zatrzymaniu zdarzenia | Zdarzenie `line` zostało zatrzymane |
| `position(int line, int point)` | `positionData()` | Co interwał positionTimera | Aktualna pozycja odtwarzania zdarzenia `line` w ms |
| `topEventChanged(int line)` | `CleanupEvent()` | Gdy zmienia się zdarzenie na szczycie listy aktywnych | Nowe zdarzenie `line` jest teraz najstarszym aktywnym |
| `nextEventChanged(int line)` | `setNextLine()`, `StartEvent()`, `makeNext()` | Po zmianie wskaźnika następnego zdarzenia | Następne zaplanowane zdarzenie to `line` |
| `activeEventChanged(int line, RDLogLine::TransType trans)` | `AdvanceActiveEvent()` | Gdy zmienia się aktywne zdarzenie (lub brak, `line==-1`) | Aktywne zdarzenie i typ przejścia |
| `nextStopChanged(QTime time)` | `GetNextStop()` → `UpdatePostPoint()` | Gdy zmienia się czas następnego stopu | Czas następnego bezwarunkowego zatrzymania logu |
| `postPointChanged(QTime point, int offset, bool offset_valid, bool running)` | `UpdatePostPoint()` | Gdy zmienia się post-point | Czas i offset post-pointu, czy log gra |
| `runStatusChanged(bool running)` | `UpdateRunStatus()` | Gdy zmienia się stan „log gra/nie gra" | Log przeszedł do stanu aktywnego (`true`) lub zatrzymanego (`false`) |
| `refreshabilityChanged(bool state)` | `load()`, `append()`, `move()`, `refresh()`, `checkTimerData()` | Gdy możliwość odświeżania logu z bazy zmienia się | `true` = log można odświeżyć z DB; `false` = nie ma zmian |
| `refreshStatusChanged(bool active)` | `refresh()` | Na początku (`true`) i końcu (`false`) operacji odświeżenia | Operacja odświeżenia logu w toku / zakończona |
| `channelStarted(int id, int mport, int card, int port)` | `StartEvent()` | Gdy kanał audio zostaje przydzielony i uruchomiony | Log `id` uruchomił odtwarzanie na karcie `card`, porcie `port` |
| `channelStopped(int id, int mport, int card, int port)` | `ClearChannel()` | Po zwolnieniu kanału audio | Log `id` zakończył używanie karty `card`, portu `port` |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `RDMacroEvent *play_macro_deck` | `started()` | `macroStartedData()` | `lib/rdlogplay.cpp:113` (konstruktor) |
| `RDMacroEvent *play_macro_deck` | `finished()` | `macroFinishedData()` | `lib/rdlogplay.cpp:114` (konstruktor) |
| `RDMacroEvent *play_macro_deck` | `stopped()` | `macroStoppedData()` | `lib/rdlogplay.cpp:115` (konstruktor) |
| `RDCae *play_cae` | `timescalingSupported(int,bool)` | `timescalingSupportedData(int,bool)` | `lib/rdlogplay.cpp:120` (konstruktor) |
| `RDRipc *rda->ripc()` | `onairFlagChanged(bool)` | `onairFlagChangedData(bool)` | `lib/rdlogplay.cpp:126` (konstruktor) |
| `RDRipc *rda->ripc()` | `notificationReceived(RDNotification*)` | `notificationReceivedData(RDNotification*)` | `lib/rdlogplay.cpp:128` (konstruktor) |
| `RDSimplePlayer *play_audition_player` | `played()` | `auditionStartedData()` | `lib/rdlogplay.cpp:143` (konstruktor, jeśli dostępny cue deck) |
| `RDSimplePlayer *play_audition_player` | `stopped()` | `auditionStoppedData()` | `lib/rdlogplay.cpp:145` (konstruktor) |
| `QTimer *play_trans_timer` | `timeout()` | `transTimerData()` | `lib/rdlogplay.cpp:157` (konstruktor) |
| `QTimer *play_grace_timer` | `timeout()` | `graceTimerData()` | `lib/rdlogplay.cpp:161` (konstruktor) |
| `RDPlayDeck *playdeck` | `stateChanged(int,RDPlayDeck::State)` | `playStateChangedData(int,RDPlayDeck::State)` | `lib/rdlogplay.cpp:2105` (StartAudioEvent) |
| `RDPlayDeck *playdeck` | `position(int,int)` | `positionData(int,int)` | `lib/rdlogplay.cpp:2107` (StartAudioEvent) |
| `RDPlayDeck *playdeck` | `segueStart(int)` | `segueStartData(int)` | `lib/rdlogplay.cpp:2109` (StartAudioEvent) |
| `RDPlayDeck *playdeck` | `segueEnd(int)` | `segueEndData(int)` | `lib/rdlogplay.cpp:2111` (StartAudioEvent) |
| `RDPlayDeck *playdeck` | `talkStart(int)` | `talkStartData(int)` | `lib/rdlogplay.cpp:2113` (StartAudioEvent) |
| `RDPlayDeck *playdeck` | `talkEnd(int)` | `talkEndData(int)` | `lib/rdlogplay.cpp:2115` (StartAudioEvent) |

## Połączenia wychodzące (klasa jako nadawca connect)

(Patrz: sekcja "Połączenia przychodzące" — RDLogPlay jest odbiorcą we wszystkich connect() zdefiniowanych w swoim konstruktorze i StartAudioEvent. Sygnały emitowane przez RDLogPlay są odbierane przez zewnętrzne klasy — patrz niżej.)

## Konsumenci sygnałów RDLogPlay (zewnętrzne connect() → RDLogPlay jako źródło)

| Sygnał | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane |
|--------|----------|---------------|--------------------|
| `reloaded()` | `RDAirPlay` (przez reload_mapper) | `logReloadedData(int)` | `rdairplay/rdairplay.cpp:291` |
| `renamed()` | `RDAirPlay` (przez rename_mapper) | `logRenamedData(int)` | `rdairplay/rdairplay.cpp:293` |
| `channelStarted(int,int,int,int)` | `RDAirPlay` | `logChannelStartedData(int,int,int,int)` | `rdairplay/rdairplay.cpp:294` |
| `channelStopped(int,int,int,int)` | `RDAirPlay` | `logChannelStoppedData(int,int,int,int)` | `rdairplay/rdairplay.cpp:296` |
| `transportChanged()` | `RDAirPlay` | `transportChangedData()` | `rdairplay/rdairplay.cpp:299` |
| `postPointChanged(QTime,int,bool,bool)` | `PostCounter` (widget) | `setPostPoint(QTime,int,bool,bool)` | `rdairplay/rdairplay.cpp:367` |
| `nextStopChanged(QTime)` | `StopCounter` (widget) | `setTime(QTime)` | `rdairplay/rdairplay.cpp:419` |
| `reloaded()` | `ListLog` | `logReloadedData()` | `rdairplay/list_log.cpp:365` |
| `played(int)` | `ListLog` | `logPlayedData(int)` | `rdairplay/list_log.cpp:366` |
| `paused(int)` | `ListLog` | `logPausedData(int)` | `rdairplay/list_log.cpp:367` |
| `stopped(int)` | `ListLog` | `logStoppedData(int)` | `rdairplay/list_log.cpp:368` |
| `inserted(int)` | `ListLog` | `logInsertedData(int)` | `rdairplay/list_log.cpp:369` |
| `removed(int,int,bool)` | `ListLog` | `logRemovedData(int,int,bool)` | `rdairplay/list_log.cpp:370` |
| `transportChanged()` | `ListLog` | `transportChangedData()` | `rdairplay/list_log.cpp:372` |
| `modified(int)` | `ListLog` | `modifiedData(int)` | `rdairplay/list_log.cpp:374` |
| `refreshabilityChanged(bool)` | `ListLog` | `refreshabilityChangedData(bool)` | `rdairplay/list_log.cpp:375` |
| `auditionHeadPlayed(int)` | `ListLog` | `auditionHeadData(int)` | `rdairplay/list_log.cpp:377` |
| `auditionTailPlayed(int)` | `ListLog` | `auditionTailData(int)` | `rdairplay/list_log.cpp:379` |
| `auditionStopped(int)` | `ListLog` | `auditionStoppedData(int)` | `rdairplay/list_log.cpp:381` |
| `transportChanged()` | `ButtonLog` | `transportChangedData()` | `rdairplay/button_log.cpp:37` |
| `modified(int)` | `ButtonLog` | `modifiedData(int)` | `rdairplay/button_log.cpp:39` |
| `played(int)` | `ButtonLog` | `playedData(int)` | `rdairplay/button_log.cpp:40` |
| `stopped(int)` | `ButtonLog` | `stoppedData(int)` | `rdairplay/button_log.cpp:41` |
| `paused(int)` | `ButtonLog` | `pausedData(int)` | `rdairplay/button_log.cpp:42` |
| `position(int,int)` | `ButtonLog` | `positionData(int,int)` | `rdairplay/button_log.cpp:43` |
| `reloaded()` | `RDVAirPlayD` (przez reload_mapper) | `logReloadedData(int)` | `rdvairplayd/rdvairplayd.cpp:127` |
| `renamed()` | `RDVAirPlayD` (przez rename_mapper) | — | `rdvairplayd/rdvairplayd.cpp:129` |

## Q_PROPERTY reactive bindings

(brak — projekt Qt4)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|--------------|-----------|
| Unix socket (`play_pad_socket`) | rdpadd (PAD daemon) | `SendNowNext()` — wysyła JSON z Now/Next | Informuje zewnętrzny serwer PAD o aktualnie i następnie odtwarzanym carcie; wywoływane po każdej zmianie stanu |
| RDRipc `sendRml()` | Sieć RML | `rda->ripc()->sendRml(rml)` | Wysyła makro RML do zdalnej stacji (dla kartów typu makro z włączoną obsługą Now&Next) |
| RDRipc `notificationReceived` | od serwera rda | odbiór `RDNotification*` w `notificationReceivedData()` | Obsługuje powiadomienia globalne (np. refresh logu) z systemu Rivendell |
| RDCae `connectHost()` | CAE (rdcae daemon) | `play_cae->connectHost()` | Połączenie z silnikiem audio CAE do zarządzania odtwarzaniem |
