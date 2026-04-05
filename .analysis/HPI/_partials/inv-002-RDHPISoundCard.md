---
partial_id: "002"
artifact: HPI
class_name: RDHPISoundCard
header_file: rdhpi/rdhpisoundcard.h
source_file: rdhpi/rdhpisoundcard.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHPISoundCard

## Typ Qt
Service (QObject) -- glowna klasa zarzadzania kartami dzwiekowymi HPI

## Odpowiedzialnosc (WHAT)
Centralna klasa odpowiedzialna za wykrywanie, inicjalizacje i zarzadzanie kartami dzwiekowymi AudioScience HPI. Zapewnia dostep do mixera (sterowanie glosnoscia stram/port, poziomami wejscia/wyjscia, multiplekserem zrodel), odczyt miernikow poziomu audio (metering), konfiguracje zrodla zegara (internal/AES-EBU/word clock), obsluge VOX (voice-operated switch), sterowanie trybem kanalow (normal/swap/left-only/right-only), passthrough i fade z profilami Linear/Log.

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| inputPortError(int card, int port) | card, port | Zmiana stanu bledu na porcie wejsciowym AES/EBU (wykryta roznica w error_word) |
| leftInputStreamMeter(int card, int stream, int level) | card, stream, level | Aktualny poziom audio lewego kanalu strumienia wejsciowego |
| leftOutputStreamMeter(int card, int stream, int level) | card, stream, level | Aktualny poziom audio lewego kanalu strumienia wyjsciowego |
| rightInputStreamMeter(int card, int stream, int level) | card, stream, level | Aktualny poziom audio prawego kanalu strumienia wejsciowego |
| rightOutputStreamMeter(int card, int stream, int level) | card, stream, level | Aktualny poziom audio prawego kanalu strumienia wyjsciowego |
| leftInputPortMeter(int card, int port, int level) | card, port, level | Aktualny poziom audio lewego kanalu portu wejsciowego |
| leftOutputPortMeter(int card, int port, int level) | card, port, level | Aktualny poziom audio lewego kanalu portu wyjsciowego |
| rightInputPortMeter(int card, int port, int level) | card, port, level | Aktualny poziom audio prawego kanalu portu wejsciowego |
| rightOutputPortMeter(int card, int port, int level) | card, port, level | Aktualny poziom audio prawego kanalu portu wyjsciowego |
| inputMode(int card, int port, RDHPISoundCard::ChannelMode mode) | card, port, mode | Zmiana trybu kanalu na porcie wejsciowym |
| outputMode(int card, int stream, RDHPISoundCard::ChannelMode mode) | card, stream, mode | Zmiana trybu kanalu na strumieniu wyjsciowym |
| tunerSubcarrierChanged(RDHPISoundCard::Subcarrier car, bool state) | car, state | Zmiana stanu subcarriera tunera (MPX/RDS) |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| setInputVolume(int card, int stream, int level) | card, stream, level | public | Ustawia glosnosc strumienia wejsciowego (obie kanaly na ten sam poziom) |
| setOutputVolume(int card, int stream, int port, int level) | card, stream, port, level | public | Ustawia glosnosc strumienia wyjsciowego na danym porcie |
| fadeOutputVolume(int card, int stream, int port, int level, int length) | card, stream, port, level, length | public | Wykonuje automatyczny fade glosnosci wyjsciowej do zadanego poziomu w okreslonum czasie (profil Linear lub Log) |
| setInputLevel(int card, int port, int level) | card, port, level | public | Ustawia poziom wejsciowy na porcie (wszystkie kanaly) |
| setOutputLevel(int card, int port, int level) | card, port, level | public | Ustawia poziom wyjsciowy na porcie (wszystkie kanaly) |
| setInputMode(int card, int port, ChannelMode mode) | card, port, mode | public | Zmienia tryb kanalu wejsciowego (Normal/Swap/LeftOnly/RightOnly) |
| setOutputMode(int card, int stream, ChannelMode mode) | card, stream, mode | public | Zmienia tryb kanalu wyjsciowego |
| setInputStreamVOX(int card, int stream, short gain) | card, stream, gain | public | Ustawia prog VOX (voice-operated switch) na strumieniu wejsciowym |
| havePassthroughVolume(int card, int in_port, int out_port) | card, in_port, out_port | public | Sprawdza czy istnieje kontrola glosnosci passthrough miedzy portami |
| setPassthroughVolume(int card, int in_port, int out_port, int level) | card, in_port, out_port, level | public | Ustawia glosnosc passthrough miedzy portem wejsciowym a wyjsciowym |
| clock() | brak | private | Cykliczny timer (METER_INTERVAL=20ms): sprawdza bledy AES/EBU na portach wejsciowych i emituje inputPortError przy zmianie |

## Stan (Q_PROPERTY)
Brak -- klasa nie deklaruje Q_PROPERTY.

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| driver() | brak | Zwraca typ drivera (zawsze Hpi) | - |
| hpiInformation(int card) | card | Zwraca obiekt RDHPIInformation z metadanymi adaptera | - |
| getCardQuantity() | brak | Zwraca liczbe wykrytych kart HPI | - |
| getCardInputStreams(int card) | card | Zwraca liczbe strumieni wejsciowych karty | - |
| getCardOutputStreams(int card) | card | Zwraca liczbe strumieni wyjsciowych karty | - |
| getCardInputPorts(int card) | card | Zwraca liczbe portow wejsciowych karty | - |
| getCardOutputPorts(int card) | card | Zwraca liczbe portow wyjsciowych karty | - |
| getCardDescription(int card) | card | Zwraca opis karty (format: "AudioScience XXXX [N]") | - |
| setClockSource(int card, ClockSource src) | card, src | Konfiguruje zrodlo zegara karty (Internal/AesEbu/SpDiff/WordClock) | - |
| haveTimescaling(int card) | card | Sprawdza czy karta wspiera timescaling (adaptery 0x6xxx) | card < HPI_MAX_ADAPTERS |
| inputStreamMeter(int card, int stream, short *level) | card, stream, level | Odczytuje szczytowy poziom audio strumienia wejsciowego | card < card_quantity, stream < card_input_streams |
| outputStreamMeter(int card, int stream, short *level) | card, stream, level | Odczytuje szczytowy poziom audio strumienia wyjsciowego | card < card_quantity, stream < card_output_streams |
| setFadeProfile(FadeProfile profile) | profile | Konfiguruje profil fade (Linear lub Log) | - |
| getInputPortMux(int card, int port) | card, port | Zwraca aktualnie wybrane zrodlo multipleksera portu wejsciowego | - |
| setInputPortMux(int card, int port, SourceNode node) | card, port, node | Przelacza multiplekser portu wejsciowego na LineIn lub AesEbuIn | node == LineIn lub AesEbuIn |
| getInputPortError(int card, int port) | card, port | Zwraca slowo bledu AES/EBU receivera na porcie | input_port_aesebu[card][port] == true |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| FadeProfile | Linear=0, Log=1 | Profil krzywej fade glosnosci |
| Channel | Left=0, Right=1 | Kanaly stereo |
| ChannelMode | Normal=0, Swap=1, LeftOnly=2, RightOnly=3 | Tryb routingu kanalow audio (mapowane na HPI_CHANNEL_MODE_*-1) |
| DeviceClass | RecordDevice=0, PlayDevice=1 | Klasa urzadzenia audio -- nagrywanie lub odtwarzanie |
| Driver | Alsa=0, Hpi=1, Jack=2 | Typ drivera audio (ta klasa zawsze zwraca Hpi) |
| ClockSource | Internal=0, AesEbu=1, SpDiff=2, WordClock=4 | Zrodlo zegara synchronizacji karty |
| SourceNode | SourceBase=100, OStream=101, LineIn=102, AesEbuIn=103, Tuner=104, RfIn=105, Clock=106, Raw=107, Mic=108 | Wezly zrodlowe mixera (mapowane na HPI_SOURCENODE_*) |
| DestNode | DestBase=200, IStream=201, LineOut=202, AesEbuOut=203, RfOut=204, Speaker=205 | Wezly docelowe mixera (mapowane na HPI_DESTNODE_*) |
| TunerBand | Fm=0, FmStereo=1, Am=2, Tv=3 | Pasmo tunera radiowego |
| Subcarrier | Mpx=0, Rds=1 | Typ subcarriera tunera (multiplex lub RDS) |

## Reguly biznesowe (z implementacji)
- Regula: Poziomy glosnosci HPI sa ograniczone do zakresu 0-2400 (RDHPISOUNDCARD_HPI_MAX_LEVEL / RDHPISOUNDCARD_HPI_MIN_LEVEL).
- Zrodlo: definicje stalych w rdhpisoundcard.h
- Regula: Domyslny profil fade to Log (logarytmiczny).
- Zrodlo: konstruktor RDHPISoundCard
- Regula: Karty z adapter_id 0x6xxx wspieraja timescaling (sprawdzane przez mask 0xF000 == 0x6000).
- Zrodlo: HPIProbe()
- Regula: Karty z adapter_id 0x5111 lub 0x5211 uzywaja multipleksera strumieniowego (input_mux_type=true), pozostale uzywaja multipleksera portowego.
- Zrodlo: HPIProbe()
- Regula: Timer metering (clock()) uruchamiany co 20ms (METER_INTERVAL) monitoruje bledy AES/EBU i emituje sygnaly inputPortError tylko przy zmianie stanu bledu.
- Zrodlo: clock(), HPIProbe()
- Regula: Settery glosnosci (setInputVolume, setOutputVolume) ustawiaja oba kanaly L/R na identyczna wartosc.
- Zrodlo: setInputVolume(), setOutputVolume()
- Regula: setInputPortMux akceptuje tylko zrodla LineIn i AesEbuIn -- inne sa odrzucane.
- Zrodlo: setInputPortMux()
- Regula: Kazdemu guard clause w getterach metering towarzyszy walidacja card < card_quantity i stream/port < odpowiedni limit.
- Zrodlo: inputStreamMeter(), outputStreamMeter(), inputPortMeter(), outputPortMeter()

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| syslog (via RDApplication::syslog) | Logowanie bledow HPI do system logu | MEDIUM |
| asihpi/hpi.h (AudioScience HPI SDK) | Caly interfejs karty dzwiekowej -- driver hardware | CRITICAL |

## Zaleznosci od innych klas tego artifaktu
- RDHPIInformation: przechowuje tablice hpi_info[HPI_MAX_ADAPTERS] z metadanymi adapterow

## Zaleznosci od shared libraries
- librd::RDConfig: przekazywany w konstruktorze, uzywany do konfiguracji logowania
- librd::RDApplication: uzywany do syslog
