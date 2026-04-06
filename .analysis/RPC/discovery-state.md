---
phase: 1
artifact: RPC
artifact_name: ripcd (RPC/IPC Daemon)
status: done
completed_at: 2026-04-06
agent_version: 1.1.0
---

# Discovery State: ripcd (RPC/IPC Daemon)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | ripcd/ |
| CMakeLists.txt | brak (autotools: ripcd/Makefile.am) |
| Target autotools | sbin_PROGRAMS = ripcd |
| Typ | daemon |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 49 |
| Pliki .cpp | 51 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Linie kodu (est.) | ~18 801 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | ripcd/ripcd.cpp | brak jawnego main() — wbudowany w ripcd.cpp | Entry point w ripcd.cpp (linia ~853) |
| QApplication | ripcd/ripcd.cpp | QApplication a(argc,argv,false) | Qt event loop (headless, false=no GUI) |
| MainObject | ripcd/ripcd.h | MainObject : public QObject | Główny obiekt demona, zarządza wszystkimi driverami |

## Klasy Qt (identyfikowane)

### Klasy główne (core daemon)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | ripcd.h | QObject | Główny obiekt demona — ładuje drivery, obsługuje RML, GPIO, IPC |
| Switcher | switcher.h | QObject | Abstrakcyjna klasa bazowa dla driverów switcher/GPIO |
| RipcdConnection | ripcd_connection.h | plain C++ | Połączenie TCP klienta RIPC (nie-QObject) |

### Klasy helper (data structs)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| StarGuideFeed | starguide_feed.h | plain C++ | Struktura danych feed StarGuide |
| UnityFeed | unity_feed.h | plain C++ | Struktura danych feed Unity |

### Drivery switcher/GPIO (wszystkie : public Switcher → QObject)

| Klasa | Plik .h | Producent/Protokół | Opis |
|-------|---------|-------------------|------|
| Acu1p | acu1p.h | ACU-1 Prophet | Audio switcher driver |
| Am16 | am16.h | 360 Systems AM-16 | Audio matrix switcher |
| Bt10x1 | bt10x1.h | BroadcastTools 10x1 | Audio switcher |
| Bt16x1 | bt16x1.h | BroadcastTools 16x1 | Audio switcher |
| Bt16x2 | bt16x2.h | BroadcastTools 16x2 | Audio switcher |
| Bt8x2 | bt8x2.h | BroadcastTools 8x2 | Audio switcher |
| BtAcs82 | btacs82.h | BroadcastTools ACS 8.2 | Audio switcher |
| BtAdms4422 | btadms4422.h | BroadcastTools ADMS 44.22 | Audio switcher |
| BtGpi16 | btgpi16.h | BroadcastTools GPI-16 | GPIO-only device |
| BtSentinel4Web | btsentinel4web.h | BroadcastTools Sentinel 4 Web | Switcher via web/HTTP |
| BtSrc16 | btsrc16.h | BroadcastTools SRC-16 | Audio switcher |
| BtSrc8Iii | btsrc8iii.h | BroadcastTools SRC-8 III | Audio switcher |
| BtSs124 | btss124.h | BroadcastTools SS 12.4 | Audio switcher |
| BtSs164 | btss164.h | BroadcastTools SS 16.4 | Audio switcher |
| BtSs21 | btss21.h | BroadcastTools SS 2.1 | Audio switcher |
| BtSs41Mlr | btss41mlr.h | BroadcastTools SS 4.1 MLR | Audio switcher |
| BtSs42 | btss42.h | BroadcastTools SS 4.2 | Audio switcher |
| BtSs44 | btss44.h | BroadcastTools SS 4.4 | Audio switcher |
| BtSs82 | btss82.h | BroadcastTools SS 8.2 | Audio switcher |
| BtU41MlrWeb | btu41mlrweb.h | BroadcastTools U4.1 MLR Web | Switcher via web/HTTP |
| Gvc7000 | gvc7000.h | GVG 7000 | Video/audio switcher |
| Harlond | harlond.h | Logitek Harlond | Audio engine/router via IP |
| KernelGpio | kernelgpio.h | Linux Kernel GPIO | GPIO via /dev/gpio |
| LiveWireLwrpAudio | livewire_lwrpaudio.h | Axia LiveWire LWRP | Audio routing via LWRP |
| LiveWireLwrpGpio | livewire_lwrpgpio.h | Axia LiveWire LWRP | GPIO via LWRP |
| LiveWireMcastGpio | livewire_mcastgpio.h | Axia LiveWire Multicast | GPIO via multicast |
| LocalAudio | local_audio.h | Local (HPI/JACK) | Local audio card switcher |
| LocalGpio | local_gpio.h | Local GPIO | Local GPIO handler |
| Modbus | modbus.h | Modbus TCP | Industrial GPIO via Modbus |
| ModemLines | modemlines.h | Serial Modem Lines | GPIO via RS-232 control lines |
| Quartz1 | quartz1.h | Quartz Electronics Type 1 | Audio router |
| RossNkScp | rossnkscp.h | Ross NK (SCP protocol) | Video/audio router |
| Sas16000 | sas16000.h | SAS 16000 | Audio switcher |
| Sas32000 | sas32000.h | SAS 32000 | Audio router |
| Sas64000 | sas64000.h | SAS 64000 | Audio router |
| Sas64000Gpi | sas64000gpi.h | SAS 64000 GPI | GPIO companion for SAS 64000 |
| SasUsi | sasusi.h | SAS USI | SAS Universal Serial Interface |
| SoftwareAuthority | swauthority.h | Software Authority Protocol | Generic switcher via SAP |
| StarGuide3 | starguide3.h | StarGuide III | Satellite receiver |
| Unity4000 | unity4000.h | Sierra Automated Systems Unity 4000 | Audio router |
| VGuest | vguest.h | Logitek vGuest | Audio engine/router via IP |
| WheatnetLio | wheatnet_lio.h | Wheatstone WheatNet LIO | Audio/GPIO via IP |
| WheatnetSlio | wheatnet_slio.h | Wheatstone WheatNet SLIO | Audio/GPIO via IP |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | ripcd.h | ripcd.cpp | MainObject — core daemon |
| 002 | ripcd_connection.h | ripcd_connection.cpp | Połączenia TCP klientów |
| 003 | switcher.h | switcher.cpp | Klasa bazowa driverów |
| 004 | acu1p.h | acu1p.cpp | ACU-1 Prophet driver |
| 005 | am16.h | am16.cpp | AM-16 driver |
| 006 | bt10x1.h | bt10x1.cpp | BT 10x1 driver |
| 007 | bt16x1.h | bt16x1.cpp | BT 16x1 driver |
| 008 | bt16x2.h | bt16x2.cpp | BT 16x2 driver |
| 009 | bt8x2.h | bt8x2.cpp | BT 8x2 driver |
| 010 | btacs82.h | btacs82.cpp | BT ACS 8.2 driver |
| 011 | btadms4422.h | btadms4422.cpp | BT ADMS 44.22 driver |
| 012 | btgpi16.h | btgpi16.cpp | BT GPI-16 driver |
| 013 | btsentinel4web.h | btsentinel4web.cpp | BT Sentinel 4 Web driver |
| 014 | btsrc16.h | btsrc16.cpp | BT SRC-16 driver |
| 015 | btsrc8iii.h | btsrc8iii.cpp | BT SRC-8 III driver |
| 016 | btss124.h | btss124.cpp | BT SS 12.4 driver |
| 017 | btss164.h | btss164.cpp | BT SS 16.4 driver |
| 018 | btss21.h | btss21.cpp | BT SS 2.1 driver |
| 019 | btss41mlr.h | btss41mlr.cpp | BT SS 4.1 MLR driver |
| 020 | btss42.h | btss42.cpp | BT SS 4.2 driver |
| 021 | btss44.h | btss44.cpp | BT SS 4.4 driver |
| 022 | btss82.h | btss82.cpp | BT SS 8.2 driver |
| 023 | btu41mlrweb.h | btu41mlrweb.cpp | BT U4.1 MLR Web driver |
| 024 | gvc7000.h | gvc7000.cpp | GVG 7000 driver |
| 025 | harlond.h | harlond.cpp | Harlond driver |
| 026 | kernelgpio.h | kernelgpio.cpp | Kernel GPIO driver |
| 027 | livewire_lwrpaudio.h | livewire_lwrpaudio.cpp | LiveWire LWRP Audio driver |
| 028 | livewire_lwrpgpio.h | livewire_lwrpgpio.cpp | LiveWire LWRP GPIO driver |
| 029 | livewire_mcastgpio.h | livewire_mcastgpio.cpp | LiveWire Multicast GPIO driver |
| 030 | local_audio.h | local_audio.cpp | Local Audio driver |
| 031 | local_gpio.h | local_gpio.cpp | Local GPIO driver |
| 032 | modbus.h | modbus.cpp | Modbus TCP driver |
| 033 | modemlines.h | modemlines.cpp | Modem Lines driver |
| 034 | quartz1.h | quartz1.cpp | Quartz 1 driver |
| 035 | rossnkscp.h | rossnkscp.cpp | Ross NK SCP driver |
| 036 | sas16000.h | sas16000.cpp | SAS 16000 driver |
| 037 | sas32000.h | sas32000.cpp | SAS 32000 driver |
| 038 | sas64000.h | sas64000.cpp | SAS 64000 driver |
| 039 | sas64000gpi.h | sas64000gpi.cpp | SAS 64000 GPI driver |
| 040 | sasusi.h | sasusi.cpp | SAS USI driver |
| 041 | starguide3.h | starguide3.cpp | StarGuide 3 driver |
| 042 | starguide_feed.h | starguide_feed.cpp | StarGuideFeed data struct |
| 043 | swauthority.h | swauthority.cpp | Software Authority driver |
| 044 | unity4000.h | unity4000.cpp | Unity 4000 driver |
| 045 | unity_feed.h | unity_feed.cpp | UnityFeed data struct |
| 046 | vguest.h | vguest.cpp | vGuest driver |
| 047 | wheatnet_lio.h | wheatnet_lio.cpp | WheatNet LIO driver |
| 048 | wheatnet_slio.h | wheatnet_slio.cpp | WheatNet SLIO driver |

### Pliki tylko .h (bez .cpp)

| Header | Zawartość |
|--------|-----------|
| globals.h | Globalny extern: ripcd_active_locks |

### Pliki tylko .cpp (bez .h)

| Source | Zawartość |
|--------|-----------|
| local_macros.cpp | Metody MainObject: LoadLocalMacros, RunLocalMacros |
| local_notifications.cpp | Metody MainObject: RunLocalNotifications |
| loaddrivers.cpp | Metoda MainObject: LoadSwitchDriver — factory method dla driverów |

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_*.cpp (31 plików) | Generowane przez Qt moc |

## Pliki testowe

Brak dedykowanych plików testowych dla ripcd. Referencje do RIPCD_TCP_PORT znalezione w:
- tests/log_unlink_test.cpp — test łączności via RIPC protocol
- tests/notification_test.cpp — test notyfikacji via RIPC protocol

## Autotools Target Definition

```makefile
sbin_PROGRAMS = ripcd

# Linkowane biblioteki:
ripcd_LDADD = @LIB_RDLIBS@      # librd (Rivendell core library)
              @LIBVORBIS@        # libvorbis (audio codec)
              @QT4_LIBS@         # Qt4 libraries
              @LIBHPI@           # AudioScience HPI (opcjonalne)
              @LIBJACK@          # JACK Audio (opcjonalne)
              @MUSICBRAINZ_LIBS@ # MusicBrainz (metadata)
              -lQt3Support       # Qt3 compatibility
```

## Zależności (z Makefile.am target_link_libraries)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @LIBHPI@ (librdhpi) | internal/opcjonalna | tak |
| @LIBJACK@ | external/opcjonalna | tak |
| @LIBVORBIS@ | external | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |
| -lQt3Support | Qt3 compat | tak |

## Architektura (wstępna obserwacja)

ripcd to daemon IPC/switcher z architekturą **driver plugin**:
1. **MainObject** — singleton zarządzający lifecycle, IPC (RIPC protocol), RML macros, GPIO state
2. **Switcher** — abstrakcyjna klasa bazowa, definiuje interfejs: processCommand, sendGpi/sendGpo, sygnały gpiChanged/gpoChanged
3. **43 drivery** — każdy dziedziczy z Switcher i implementuje komunikację z konkretnym sprzętem (serial, TCP, HTTP, GPIO kernel, multicast)
4. **RipcdConnection** — zarządzanie połączeniami TCP klientów
5. **Pliki bez headera** (local_macros.cpp, local_notifications.cpp, loaddrivers.cpp) — metody MainObject wydzielone do osobnych plików
