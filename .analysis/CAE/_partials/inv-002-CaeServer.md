---
partial_id: 002
artifact: CAE
class_name: CaeServer
header_file: cae/cae_server.h
source_file: cae/cae_server.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# CaeServer

## Typ Qt
QObject (Service) -- serwer TCP parsujacy protokol tekstowy

## Odpowiedzialnosc (WHAT)
Serwer sieciowy TCP daemona caed. Nasluchuje na porcie TCP, przyjmuje polaczenia klientow, parsuje protokol tekstowy (komendy rozdzielane '!'), autentykuje klientow haslem, i emituje sygnaly z zwalidowanymi zadaniami do MainObject. Odpowiada za multipleksowanie polaczen -- wielu klientow moze byc polaczonych jednoczesnie. Zarzadza rowniez stanem metrowania per polaczenie (meter_port, meters_enabled per card).

## Sygnaly
| Sygnal | Parametry | Znaczenie biznesowe |
|--------|-----------|---------------------|
| connectionDropped | int id | Klient rozlaczyl sie -- MainObject musi zwolnic zasoby tego klienta |
| loadPlaybackReq | int id, unsigned card, const QString &name | Zadanie zaladowania pliku audio do odtwarzania (komenda LP) |
| unloadPlaybackReq | int id, unsigned handle | Zadanie zwolnienia strumienia playback (komenda UP) |
| playPositionReq | int id, unsigned handle, unsigned pos | Zadanie ustawienia pozycji odtwarzania (komenda PP) |
| playReq | int id, unsigned handle, unsigned length, unsigned speed, unsigned pitch_flag | Zadanie rozpoczecia odtwarzania z parametrami (komenda PY) |
| stopPlaybackReq | int id, unsigned handle | Zadanie zatrzymania odtwarzania (komenda SP) |
| timescalingSupportReq | int id, unsigned card | Zapytanie o wsparcie timescalingu (komenda TS) |
| loadRecordingReq | int id, unsigned card, unsigned port, unsigned coding, unsigned channels, unsigned samprate, unsigned bitrate, const QString &name | Zadanie przygotowania nagrywania (komenda LR) |
| unloadRecordingReq | int id, unsigned card, unsigned stream | Zadanie zakonczenia nagrywania (komenda UR) |
| recordReq | int id, unsigned card, unsigned stream, unsigned len, int threshold_level | Zadanie rozpoczecia nagrywania (komenda RD) |
| stopRecordingReq | int id, unsigned card, unsigned stream | Zadanie zatrzymania nagrywania (komenda SR) |
| setInputVolumeReq | int id, unsigned card, unsigned stream, int level | Ustawienie glosnosci wejscia (komenda IV) |
| setOutputVolumeReq | int id, unsigned card, unsigned stream, unsigned port, int level | Ustawienie glosnosci wyjscia (komenda OV) |
| fadeOutputVolumeReq | int id, unsigned card, unsigned stream, unsigned port, int level, unsigned length | Fade glosnosci wyjscia (komenda FV) |
| setInputLevelReq | int id, unsigned card, unsigned port, int level | Ustawienie poziomu wejscia hardware (komenda IL) |
| setOutputLevelReq | int id, unsigned card, unsigned port, int level | Ustawienie poziomu wyjscia hardware (komenda OL) |
| setInputModeReq | int id, unsigned card, unsigned stream, unsigned mode | Zmiana trybu wejscia (komenda IM) |
| setOutputModeReq | int id, unsigned card, unsigned stream, unsigned mode | Zmiana trybu wyjscia (komenda OM) |
| setInputVoxLevelReq | int id, unsigned card, unsigned stream, int level | Ustawienie progu VOX (komenda IX) |
| setInputTypeReq | int id, unsigned card, unsigned port, unsigned type | Ustawienie typu wejscia analog/digital (komenda IT) |
| getInputStatusReq | int id, unsigned card, unsigned port | Odpytanie statusu wejscia (komenda IS) |
| setAudioPassthroughLevelReq | int id, unsigned card, unsigned input, unsigned output, int level | Ustawienie passthrough (komenda AL) |
| setClockSourceReq | int id, unsigned card, int input | Ustawienie zrodla zegara (komenda CS) |
| setOutputStatusFlagReq | int id, unsigned card, unsigned port, unsigned stream, bool state | Ustawienie flagi statusu wyjscia (komenda OS) |
| openRtpCaptureChannelReq | int id, unsigned card, unsigned port, uint16_t udp_port, unsigned samprate, unsigned chans | Otwarcie kanalu RTP (niezaimplementowane w MainObject) |
| meterEnableReq | int id, uint16_t udp_port, const QList<unsigned> &cards | Wlaczenie przesylania metrow (komenda ME) |

## Sloty
| Slot | Parametry | Widocznosc | Co robi |
|------|-----------|------------|---------|
| newConnectionData | - | private | Akceptuje nowe polaczenie TCP, tworzy CaeServerConnection, podlacza readyRead i disconnected przez QSignalMapper |
| readyReadData | int id | private | Czyta dane z socketa, akumuluje znaki, przy '!' wywoluje ProcessCommand |
| connectionClosedData | int id | private | Emituje connectionDropped, czysci polaczenie z mapy |

## Stan (Q_PROPERTY)
| Property | Typ | Getter | Setter | Notify signal |
|----------|-----|--------|--------|---------------|
| Brak | --- | --- | --- | Klasa nie deklaruje Q_PROPERTY |

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| connectionIds | - | Zwraca liste ID aktywnych polaczen | Zawsze dostepne |
| peerAddress | int id | Zwraca adres IP klienta | Polaczenie musi istniec |
| peerPort | int id | Zwraca port klienta | Polaczenie musi istniec |
| meterPort | int id | Zwraca port UDP do wysylania metrow klientowi | Polaczenie musi istniec |
| setMeterPort | int id, uint16_t port | Ustawia port UDP metrow dla klienta | Polaczenie musi istniec |
| metersEnabled | int id, unsigned card | Sprawdza czy metering jest wlaczony dla klienta na danej karcie | Polaczenie musi istniec |
| setMetersEnabled | int id, unsigned card, bool state | Wlacza/wylacza metering per klient per karta | Polaczenie musi istniec |
| listen | const QHostAddress &addr, uint16_t port | Rozpoczyna nasluchiwanie na adresie/porcie TCP | Przed startem serwera |
| sendCommand (broadcast) | const QString &cmd | Wysyla komende do WSZYSTKICH uwierzytelnionych klientow | Klienci musza byc authenticated |
| sendCommand (unicast) | int id, const QString &cmd | Wysyla komende do konkretnego klienta | Polaczenie musi istniec |

## Stany i kategorie (enums)
| Enum | Wartosci | Znaczenie |
|------|----------|-----------|
| Brak | --- | --- |

## Reguly biznesowe (z implementacji)
- Regula: Protokol tekstowy -- komendy sa ciagami znakow zakonczonymi znakiem '!'. Znaki CR i LF sa ignorowane. Kazdy inny znak jest akumulowany.
  Zrodlo: readyReadData()
- Regula: Komendy sa parsowane jako tokeny rozdzielone spacjami (split(" ", SkipEmptyParts)). Pierwszy token to kod komendy (2 litery: LP, UP, PY, SP, LR, UR, RD, SR, IV, OV, FV, IL, OL, IM, OM, IX, IT, IS, AL, CS, OS, ME, PW, DC).
  Zrodlo: ProcessCommand()
- Regula: Komenda DC (disconnect) zamyka polaczenie natychmiast i zwraca true (co powoduje wczesny return w readyReadData -- reszta bufora jest ignorowana).
  Zrodlo: ProcessCommand(), readyReadData()
- Regula: Komenda PW (password) jest jedyna komenda dostepna bez autentykacji. Porownuje haslo z konfiguracja (cae_config->password()). Odpowiedz: "PW +!" lub "PW -!".
  Zrodlo: ProcessCommand()
- Regula: Wszystkie komendy oprocz PW i DC wymagaja autentykacji (conn->authenticated). Nieautentykowane komendy sa cicho ignorowane.
  Zrodlo: ProcessCommand() (guard: if(!conn->authenticated) return false)
- Regula: Walidacja parametrow -- kazda komenda sprawdza liczbe argumentow (f0.size()==N), zakresy (card<RD_MAX_CARDS, port<RD_MAX_PORTS, stream<RD_MAX_STREAMS, coding<5, chans<=2, mode<=3, type<=1). Nieprawidlowe komendy generuja ogolny blad (cmd+"-!").
  Zrodlo: ProcessCommand(), poszczegolne bloki if()
- Regula: Kazde polaczenie jest identyfikowane przez socket descriptor (int) -- uzyty jako klucz w QMap<int, CaeServerConnection*>.
  Zrodlo: newConnectionData(), cae_connections map
- Regula: Broadcast (sendCommand bez id) wysyla tylko do authenticated klientow.
  Zrodlo: sendCommand(const QString &cmd) -- guard: if(it.value()->authenticated)

## Linux-specific uzycia
| Komponent | Uzycie | Priorytet zastapienia |
|-----------|--------|----------------------|
| Brak | CaeServer jest platform-agnostic (Qt TCP) | --- |

## Zaleznosci od innych klas tego artifaktu
- CaeServerConnection: value object przechowujacy stan polaczenia (uzywany wewnetrznie)

## Zaleznosci od shared libraries
- RDConfig (librd): dostep do hasla autentykacji (cae_config->password())
- RDApplication (librd): syslog wrapper do logowania polaczen
