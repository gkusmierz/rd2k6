---
phase: 4
artifact: HPI
artifact_name: librdhpi
status: done
completed_at: 2026-04-06
connect_count: 5
emit_count: 34
signal_count: 23
emitting_classes: 4
cross_artifact: 2
circular_deps: 0
spot_check_issues: 0
agent_version: 1.6.0
---

# Signal & Call Graph: librdhpi

## Statystyki

| Metryka | Wartosc |
|---------|---------|
| Wywolania connect() | 5 |
| Emisje emit() | 34 |
| Unikalne sygnaly | 23 |
| Klasy emitujace | 4 (RDHPISoundCard, RDHPIPlayStream, RDHPIRecordStream, RDHPISoundSelector) |
| Cross-artifact polaczenia | 2 (CAE, RPC -- konsumenci librdhpi pod #ifdef HPI) |
| Circular dependencies | 0 |
| Q_PROPERTY z NOTIFY | 0 |

---

## Diagramy

### Sequence: Odtwarzanie audio przez HPI

```mermaid
sequenceDiagram
    participant Caller as CAE/Aplikacja
    participant PS as RDHPIPlayStream
    participant SC as RDHPISoundCard
    participant HPI as HPI SDK

    Caller->>PS: setCard(card)
    Caller->>PS: openWave(filename)
    PS->>PS: RDWaveFile::openWave()
    PS->>HPI: HPI_OutStreamOpen()
    PS->>HPI: HPI_OutStreamHostBufferAllocate()
    
    Caller->>PS: play()
    PS->>SC: haveTimescaling(card)
    PS->>HPI: HPI_OutStreamSetTimeScale()
    PS->>HPI: HPI_OutStreamGetInfoEx()
    PS->>HPI: HPI_FormatCreate()
    PS->>PS: readWave(pdata, fragment_size)
    PS->>HPI: HPI_OutStreamWriteBuf()
    PS->>HPI: HPI_OutStreamStart()
    PS-->>Caller: isStopped(false)
    PS-->>Caller: played()
    PS-->>Caller: stateChanged(card, stream, Playing)

    loop co 50ms (tickClock)
        PS->>HPI: HPI_OutStreamGetInfoEx()
        PS->>PS: readWave(pdata, fragment_size)
        PS->>HPI: HPI_OutStreamWriteBuf()
        PS-->>Caller: position(samples)
    end

    Note over PS: Gdy HPI_STATE_DRAINED
    PS->>HPI: HPI_OutStreamStop()
    PS->>HPI: HPI_OutStreamClose()
    PS-->>Caller: position(0)
    PS-->>Caller: isStopped(true)
    PS-->>Caller: stopped()
    PS-->>Caller: stateChanged(card, stream, Stopped)
```

### Sequence: Nagrywanie audio przez HPI

```mermaid
sequenceDiagram
    participant Caller as CAE/Aplikacja
    participant RS as RDHPIRecordStream
    participant SC as RDHPISoundCard
    participant HPI as HPI SDK

    Caller->>RS: setCard(card)
    Caller->>RS: setStream(stream)
    Caller->>RS: createWave(filename)
    RS->>RS: RDWaveFile::createWave()
    RS->>HPI: HPI_InStreamOpen()
    RS->>HPI: HPI_InStreamHostBufferAllocate()

    Caller->>RS: recordReady()
    RS->>HPI: HPI_InStreamGetInfoEx()
    RS->>HPI: HPI_FormatCreate()
    RS->>HPI: HPI_InStreamSetFormat()
    RS->>HPI: HPI_InStreamStart()
    RS-->>Caller: isStopped(false)
    RS-->>Caller: ready()
    RS-->>Caller: stateChanged(card, stream, RecordReady)

    Caller->>RS: record()
    RS->>HPI: HPI_InStreamReset()
    RS->>HPI: HPI_InStreamStart()
    RS-->>Caller: isStopped(false)
    RS-->>Caller: recording()
    RS-->>Caller: stateChanged(card, stream, Recording)

    loop co 100ms (tickClock)
        RS->>HPI: HPI_InStreamGetInfoEx()
        alt samples_recorded > 0 (pierwsze dane)
            RS-->>Caller: recordStart()
            RS-->>Caller: stateChanged(card, stream, RecordStarted)
        end
        RS->>HPI: HPI_InStreamReadBuf()
        RS->>RS: writeWave(pdata, fragment_size)
        RS-->>Caller: position(samples_recorded)
    end

    Caller->>RS: stop()
    RS->>HPI: HPI_InStreamStop()
    RS-->>Caller: isStopped(true)
    RS-->>Caller: stopped()
    RS-->>Caller: stateChanged(card, stream, Stopped)
```

### Sequence: Wybor karty/portu w UI

```mermaid
sequenceDiagram
    participant User
    participant SS as RDHPISoundSelector
    participant SC as RDHPISoundCard
    participant HPI as HPI SDK

    Note over SS,SC: Konstruktor
    SS->>SC: new RDHPISoundCard(config)
    SC->>HPI: HPI_SubSysCreate()
    SC->>SC: HPIProbe()
    SC->>HPI: HPI_SubSysGetNumAdapters()
    loop dla kazdego adaptera
        SC->>HPI: HPI_AdapterOpen()
        SC->>HPI: HPI_AdapterGetInfo()
        SC->>HPI: HPI_MixerOpen()
    end

    alt PlayDevice
        loop card, port
            SS->>SC: getCardOutputPorts(card)
            SS->>SC: getOutputPortDescription(card, port)
            SS->>SS: insertItem(description)
        end
    else RecordDevice
        loop card, port
            SS->>SC: getCardInputPorts(card)
            SS->>SC: getInputPortDescription(card, port)
            SS->>SS: insertItem(description)
        end
    end

    User->>SS: wybiera element listy
    SS-->>SS: highlighted(int selection)
    SS->>SS: selection(int)
    SS-->>User: changed(card, port)
    SS-->>User: cardChanged(card)
    SS-->>User: portChanged(port)
```

### Graf zaleznosci

```mermaid
graph TD
    subgraph librdhpi
        RDHPISoundCard
        RDHPIPlayStream
        RDHPIRecordStream
        RDHPISoundSelector
        RDHPIInformation
    end

    subgraph External
        HPI_SDK[AudioScience HPI SDK]
        RDWaveFile[librd::RDWaveFile]
        RDConfig[librd::RDConfig]
    end

    subgraph Consumers
        CAE[caed - Core Audio Engine]
        RPC[ripcd - RPC Daemon]
    end

    RDHPISoundCard --> HPI_SDK
    RDHPISoundCard --> RDHPIInformation
    RDHPISoundCard --> RDConfig
    RDHPIPlayStream --> RDHPISoundCard
    RDHPIPlayStream --> RDWaveFile
    RDHPIPlayStream --> HPI_SDK
    RDHPIRecordStream --> RDHPISoundCard
    RDHPIRecordStream --> RDWaveFile
    RDHPIRecordStream --> HPI_SDK
    RDHPISoundSelector --> RDHPISoundCard
    
    CAE -.->|"#ifdef HPI"| RDHPISoundCard
    CAE -.->|"#ifdef HPI"| RDHPIPlayStream
    CAE -.->|"#ifdef HPI"| RDHPIRecordStream
    RPC -.->|"#ifdef HPI"| RDHPISoundCard

    style HPI_SDK fill:#f96
    style CAE fill:#69f
    style RPC fill:#69f
```

---

## Polaczenia wewnetrzne (connect)

### RDHPISoundCard

| Nadawca | Sygnal | Odbiorca | Slot | Gdzie |
|---------|--------|----------|------|-------|
| clock_timer (QTimer) | timeout() | this | clock() | rdhpisoundcard.cpp:1037 |

**Timer clock()** taktuje co METER_INTERVAL (20ms). Sprawdza stan bledow AES/EBU na portach wejsciowych i emituje inputPortError(card, port) gdy zmieni sie error_word.

### RDHPIPlayStream

| Nadawca | Sygnal | Odbiorca | Slot | Gdzie |
|---------|--------|----------|------|-------|
| clock (QTimer) | timeout() | this | tickClock() | rdhpiplaystream.cpp:120 |
| play_timer (QTimer) | timeout() | this | pause() | rdhpiplaystream.cpp:123 |

**Timer tickClock()** taktuje co FRAGMENT_TIME (50ms). Streamuje dane audio do HPI output stream.
**Timer play_timer** -- jednorazowy timer na play_length ms. Po uplywie czasu auto-pause.

### RDHPIRecordStream

| Nadawca | Sygnal | Odbiorca | Slot | Gdzie |
|---------|--------|----------|------|-------|
| clock (QTimer) | timeout() | this | tickClock() | rdhpirecordstream.cpp:100 |
| length_timer (QTimer) | timeout() | this | pause() | rdhpirecordstream.cpp:103 |

**Timer tickClock()** taktuje co RDHPIRECORDSTREAM_CLOCK_INTERVAL (100ms). Odczytuje dane z HPI input stream i zapisuje do pliku WAV.
**Timer length_timer** -- jednorazowy timer na record_length ms. Po uplywie czasu auto-pause.

### RDHPISoundSelector

| Nadawca | Sygnal | Odbiorca | Slot | Gdzie |
|---------|--------|----------|------|-------|
| this (Q3ListBox) | highlighted(int) | this | selection(int) | rdhpisoundselector.cpp:59 |

---

## Sygnaly emitowane (per klasa)

### RDHPISoundCard -- sygnaly emitowane

| Sygnal | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| inputPortError(card, port) | clock() | error_word zmienil sie vs poprzedni | Blad AES/EBU na porcie wejsciowym |

Sygnaly zadeklarowane ale emitowane wylacznie przez zewnetrznych konsumentow (CAE):
- leftInputStreamMeter, rightInputStreamMeter
- leftOutputStreamMeter, rightOutputStreamMeter
- leftInputPortMeter, rightInputPortMeter
- leftOutputPortMeter, rightOutputPortMeter
- inputMode, outputMode
- tunerSubcarrierChanged (stub, nigdy nie emitowany)

**Uwaga:** Sygnaly metrowe (8 sygnalow *StreamMeter/*PortMeter) i trybu (inputMode/outputMode) nie sa emitowane wewnatrz librdhpi. Sa zadeklarowane w headerze ale emitowane przez CAE (caed) po odczytaniu wartosci z RDHPISoundCard::inputStreamMeter() etc. To jest wzorzec "thin hardware layer" -- librdhpi odczytuje dane sprzetowe, CAE emituje sygnaly do UI.

### RDHPIPlayStream -- sygnaly emitowane

| Sygnal | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| isStopped(false) | play() | !restart_transport | Odtwarzanie rozpoczete |
| played() | play() | !restart_transport | Odtwarzanie rozpoczete |
| stateChanged(card, stream, Playing) | play() | !restart_transport | Zmiana stanu na Playing |
| paused() | pause() | !restart_transport | Odtwarzanie wstrzymane |
| stateChanged(card, stream, Paused) | pause() | !restart_transport | Zmiana stanu na Paused |
| position(0) | stop() | !restart_transport | Pozycja zresetowana |
| isStopped(true) | stop() | !restart_transport | Odtwarzanie zatrzymane |
| stopped() | stop() | !restart_transport | Odtwarzanie zatrzymane |
| stateChanged(card, stream, 0) | stop() | !restart_transport | Zmiana stanu na Stopped |
| position(samples) | setPosition() | -- | Pozycja zmieniona (seek) |
| position(samples) | tickClock() | co 3 ticki (~150ms) | Aktualizacja biezacej pozycji |
| position(0) | tickClock() | HPI_STATE_DRAINED | Stream wyczerpany -- auto-stop |
| isStopped(true) | tickClock() | HPI_STATE_DRAINED | Auto-stop po wyczerpaniu |
| stopped() | tickClock() | HPI_STATE_DRAINED | Auto-stop po wyczerpaniu |
| stateChanged(card, stream, Stopped) | tickClock() | HPI_STATE_DRAINED | Auto-stop po wyczerpaniu |

**Wzorzec restart_transport:** Gdy uzytkownik zmienia pozycje podczas odtwarzania, play() wywoluje pause()->seek->play(). Flaga restart_transport blokuje emisje sygnalow podczas tego wewnetrznego restartu -- zapobiega flakowaniu UI.

### RDHPIRecordStream -- sygnaly emitowane

| Sygnal | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| isStopped(false) | recordReady() | -- | Strumien uzbrojony (armed) |
| ready() | recordReady() | -- | Strumien gotowy do nagrywania |
| stateChanged(card, stream, 1) | recordReady() | -- | RecordReady |
| isStopped(false) | record() | -- | Nagrywanie rozpoczete |
| recording() | record() | -- | Nagrywanie rozpoczete |
| stateChanged(card, stream, 0) | record() | -- | Recording |
| paused() | pause() | -- | Nagrywanie wstrzymane |
| stateChanged(card, stream, 2) | pause() | -- | Paused |
| isStopped(true) | stop() | is_ready OR is_recording OR is_paused | Nagrywanie zatrzymane |
| stopped() | stop() | j.w. | Nagrywanie zatrzymane |
| stateChanged(card, stream, Stopped) | stop() | j.w. | Stopped |
| position(0) | stop() | j.w. | Pozycja zresetowana |
| recordStart() | tickClock() | samples_recorded > 0 i !record_started | Pierwsze sample nagrane |
| stateChanged(card, stream, 4) | tickClock() | j.w. | RecordStarted |
| position(samples_recorded) | tickClock() | -- (co 100ms) | Aktualizacja pozycji nagrywania |

### RDHPISoundSelector -- sygnaly emitowane

| Sygnal | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| changed(card, port) | selection(int) | zawsze | Uzytkownik wybral karte i port |
| cardChanged(card) | selection(int) | zawsze | Zmiana karty |
| portChanged(port) | selection(int) | zawsze | Zmiana portu |

---

## Cross-artifact polaczenia

| Konsument | Mechanizm | Klasy HPI uzywane | Kontekst |
|-----------|-----------|-------------------|----------|
| CAE (caed) | #ifdef HPI, linkowanie librdhpi | RDHPISoundCard, RDHPIPlayStream, RDHPIRecordStream | Core Audio Engine -- playback i recording przez HPI |
| RPC (ripcd) | #ifdef HPI, linkowanie librdhpi | RDHPISoundCard | HPI driver dla switcher/GPIO |

Polaczenia sa statyczne (kompilacja warunkowa), nie dynamiczne (D-Bus/TCP). Konsumenci tworza instancje klas HPI i connect'uja sie do ich sygnalow w swoim kodzie.

---

## Circular dependencies

Brak. Graf jest acykliczny: RDHPISoundCard <- RDHPIPlayStream, RDHPIRecordStream, RDHPISoundSelector. RDHPIInformation jest embedded w RDHPISoundCard.

---

## Missing Coverage (sygnaly zadeklarowane ale nie emitowane wewnatrz librdhpi)

| Sygnal | Klasa | Powod |
|--------|-------|-------|
| leftInputStreamMeter | RDHPISoundCard | Emitowany przez konsumentow (CAE) po odczytaniu wartosci z inputStreamMeter() |
| rightInputStreamMeter | RDHPISoundCard | j.w. |
| leftOutputStreamMeter | RDHPISoundCard | j.w. |
| rightOutputStreamMeter | RDHPISoundCard | j.w. |
| leftInputPortMeter | RDHPISoundCard | j.w. |
| rightInputPortMeter | RDHPISoundCard | j.w. |
| leftOutputPortMeter | RDHPISoundCard | j.w. |
| rightOutputPortMeter | RDHPISoundCard | j.w. |
| inputMode | RDHPISoundCard | Emitowany przez konsumentow po zmianie trybu |
| outputMode | RDHPISoundCard | j.w. |
| tunerSubcarrierChanged | RDHPISoundCard | Stub -- tuner API nie zaimplementowane |

---

## Spot-check

3 klasy z najwieksza liczba sygnalow:

1. **RDHPIPlayStream** (6 sygnalow w headerze) -- zweryfikowane: isStopped, played, paused, stopped, position, stateChanged. Wszystkie 6 emitowanych w kodzie. PASS.

2. **RDHPIRecordStream** (8 sygnalow w headerze) -- zweryfikowane: isStopped, ready, recording, recordStart, paused, stopped, position, stateChanged. Wszystkie 8 emitowanych w kodzie. PASS.

3. **RDHPISoundCard** (12 sygnalow w headerze) -- zweryfikowane: 1 emitowany wewnetrznie (inputPortError), 11 zadeklarowanych ale emitowanych przez konsumentow (wzorzec "thin hardware layer"). Udokumentowane w Missing Coverage. PASS.
