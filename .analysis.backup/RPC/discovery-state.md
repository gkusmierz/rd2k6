---
phase: 1
artifact: RPC
artifact_name: ripcd (Rivendell Interprocess Communication Daemon)
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: ripcd (RPC Service Daemon)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | ripcd/ |
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
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | ~18 800 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | ripcd/ripcd.cpp:851 | int main(int argc, char *argv[]) | Punkt startowy procesu |
| QApplication | ripcd/ripcd.cpp:853 | QApplication a(argc,argv,false) | Inicjalizacja Qt (headless, false=no GUI) |
| MainObject | ripcd/ripcd.h | MainObject : public QObject | Glowny obiekt daemona, cala logika |

## Klasy Qt (identyfikowane)

### Klasa glowna

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | ripcd.h | QObject | Glowny obiekt daemona — obsluga polaczen TCP, RML, GPIO, switcherow |

### Klasa bazowa driverow

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| Switcher | switcher.h | QObject (abstract) | Abstrakcyjna baza dla driverow switcher/GPIO; definiuje interfejs processCommand, GPI/GPO |

### Klasy driverow switcher/GPIO (dziedzicza z Switcher)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| Acu1p | acu1p.h | Switcher | Driver ACU-1 Prophet |
| Am16 | am16.h | Switcher | Driver 360 Systems AM-16 audio switcher |
| Bt10x1 | bt10x1.h | Switcher | Driver BroadcastTools 10x1 switcher |
| Bt16x1 | bt16x1.h | Switcher | Driver BroadcastTools 16x1 switcher |
| Bt16x2 | bt16x2.h | Switcher | Driver BroadcastTools 16x2 switcher |
| Bt8x2 | bt8x2.h | Switcher | Driver BroadcastTools 8x2 switcher |
| BtAcs82 | btacs82.h | Switcher | Driver BroadcastTools ACS 8.2 switcher |
| BtAdms4422 | btadms4422.h | Switcher | Driver BroadcastTools ADMS 44.22 switcher |
| BtGpi16 | btgpi16.h | Switcher | Driver BroadcastTools GPI-16 |
| BtSentinel4Web | btsentinel4web.h | Switcher | Driver BroadcastTools Sentinel 4 Web |
| BtSrc16 | btsrc16.h | Switcher | Driver BroadcastTools SRC-16 |
| BtSrc8Iii | btsrc8iii.h | Switcher | Driver BroadcastTools SRC-8 III |
| BtSs124 | btss124.h | Switcher | Driver BroadcastTools SS 12.4 switcher |
| BtSs164 | btss164.h | Switcher | Driver BroadcastTools SS 16.4 switcher |
| BtSs21 | btss21.h | Switcher | Driver BroadcastTools SS 2.1 switcher |
| BtSs41Mlr | btss41mlr.h | Switcher | Driver BroadcastTools SS 4.1 MLR switcher |
| BtSs42 | btss42.h | Switcher | Driver BroadcastTools SS 4.2 switcher |
| BtSs44 | btss44.h | Switcher | Driver BroadcastTools SS 4.4 switcher |
| BtSs82 | btss82.h | Switcher | Driver BroadcastTools SS 8.2 switcher |
| BtU41MlrWeb | btu41mlrweb.h | Switcher | Driver BroadcastTools Universal 4.1 MLR Web |
| Gvc7000 | gvc7000.h | Switcher | Driver Grass Valley GVC-7000 |
| Harlond | harlond.h | Switcher | Driver Harlond (AudioScience HPI) |
| KernelGpio | kernelgpio.h | Switcher | Driver Linux kernel GPIO |
| LiveWireLwrpAudio | livewire_lwrpaudio.h | Switcher | Driver Livewire LWRP audio routing |
| LiveWireLwrpGpio | livewire_lwrpgpio.h | Switcher | Driver Livewire LWRP GPIO |
| LiveWireMcastGpio | livewire_mcastgpio.h | Switcher | Driver Livewire multicast GPIO |
| LocalAudio | local_audio.h | Switcher | Driver local audio cards (HPI) |
| LocalGpio | local_gpio.h | Switcher | Driver local GPIO |
| Modbus | modbus.h | Switcher | Driver Modbus protocol |
| ModemLines | modemlines.h | Switcher | Driver serial modem lines GPIO |
| Quartz1 | quartz1.h | Switcher | Driver Quartz Type 1 router |
| RossNkScp | rossnkscp.h | Switcher | Driver Ross NK SCP protocol |
| Sas16000 | sas16000.h | Switcher | Driver SAS 16000 switcher |
| Sas32000 | sas32000.h | Switcher | Driver SAS 32000 switcher |
| Sas64000 | sas64000.h | Switcher | Driver SAS 64000 switcher |
| Sas64000Gpi | sas64000gpi.h | Switcher | Driver SAS 64000 GPI |
| SasUsi | sasusi.h | Switcher | Driver SAS USI protocol |
| SoftwareAuthority | swauthority.h | Switcher | Driver Software Authority protocol |
| StarGuide3 | starguide3.h | Switcher | Driver StarGuide III satellite receiver |
| Unity4000 | unity4000.h | Switcher | Driver Unity 4000 intercom |
| VGuest | vguest.h | Switcher | Driver Logitek vGuest protocol |
| WheatnetLio | wheatnet_lio.h | Switcher | Driver Wheatnet LIO |
| WheatnetSlio | wheatnet_slio.h | Switcher | Driver Wheatnet SLIO |

### Klasy pomocnicze (nie-Qt, brak Q_OBJECT)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| RipcdConnection | ripcd_connection.h | plain C++ | Obiekt polaczenia TCP klienta (socket + auth state) |
| StarGuideFeed | starguide_feed.h | plain C++ | Kontener danych feed dla StarGuide III |
| UnityFeed | unity_feed.h | plain C++ | Kontener danych feed dla Unity 4000 |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | ripcd.h | ripcd.cpp | Glowny obiekt daemona (MainObject) + main() |
| 002 | switcher.h | switcher.cpp | Abstrakcyjna baza driverow switcher/GPIO |
| 003 | ripcd_connection.h | ripcd_connection.cpp | Polaczenie TCP klienta |
| 004 | globals.h | — | Deklaracje globalne (ripcd_active_locks) — TYLKO .h |
| 005 | acu1p.h | acu1p.cpp | Driver ACU-1 Prophet |
| 006 | am16.h | am16.cpp | Driver 360 Systems AM-16 |
| 007 | bt10x1.h | bt10x1.cpp | Driver BroadcastTools 10x1 |
| 008 | bt16x1.h | bt16x1.cpp | Driver BroadcastTools 16x1 |
| 009 | bt16x2.h | bt16x2.cpp | Driver BroadcastTools 16x2 |
| 010 | bt8x2.h | bt8x2.cpp | Driver BroadcastTools 8x2 |
| 011 | btacs82.h | btacs82.cpp | Driver BroadcastTools ACS 8.2 |
| 012 | btadms4422.h | btadms4422.cpp | Driver BroadcastTools ADMS 44.22 |
| 013 | btgpi16.h | btgpi16.cpp | Driver BroadcastTools GPI-16 |
| 014 | btsentinel4web.h | btsentinel4web.cpp | Driver BroadcastTools Sentinel 4 Web |
| 015 | btsrc16.h | btsrc16.cpp | Driver BroadcastTools SRC-16 |
| 016 | btsrc8iii.h | btsrc8iii.cpp | Driver BroadcastTools SRC-8 III |
| 017 | btss124.h | btss124.cpp | Driver BroadcastTools SS 12.4 |
| 018 | btss164.h | btss164.cpp | Driver BroadcastTools SS 16.4 |
| 019 | btss21.h | btss21.cpp | Driver BroadcastTools SS 2.1 |
| 020 | btss41mlr.h | btss41mlr.cpp | Driver BroadcastTools SS 4.1 MLR |
| 021 | btss42.h | btss42.cpp | Driver BroadcastTools SS 4.2 |
| 022 | btss44.h | btss44.cpp | Driver BroadcastTools SS 4.4 |
| 023 | btss82.h | btss82.cpp | Driver BroadcastTools SS 8.2 |
| 024 | btu41mlrweb.h | btu41mlrweb.cpp | Driver BroadcastTools U 4.1 MLR Web |
| 025 | gvc7000.h | gvc7000.cpp | Driver Grass Valley GVC-7000 |
| 026 | harlond.h | harlond.cpp | Driver Harlond (AudioScience HPI) |
| 027 | kernelgpio.h | kernelgpio.cpp | Driver Linux kernel GPIO |
| 028 | livewire_lwrpaudio.h | livewire_lwrpaudio.cpp | Driver Livewire LWRP audio |
| 029 | livewire_lwrpgpio.h | livewire_lwrpgpio.cpp | Driver Livewire LWRP GPIO |
| 030 | livewire_mcastgpio.h | livewire_mcastgpio.cpp | Driver Livewire multicast GPIO |
| 031 | local_audio.h | local_audio.cpp | Driver local audio (HPI) |
| 032 | local_gpio.h | local_gpio.cpp | Driver local GPIO |
| 033 | modbus.h | modbus.cpp | Driver Modbus protocol |
| 034 | modemlines.h | modemlines.cpp | Driver serial modem lines |
| 035 | quartz1.h | quartz1.cpp | Driver Quartz Type 1 |
| 036 | rossnkscp.h | rossnkscp.cpp | Driver Ross NK SCP |
| 037 | sas16000.h | sas16000.cpp | Driver SAS 16000 |
| 038 | sas32000.h | sas32000.cpp | Driver SAS 32000 |
| 039 | sas64000.h | sas64000.cpp | Driver SAS 64000 |
| 040 | sas64000gpi.h | sas64000gpi.cpp | Driver SAS 64000 GPI |
| 041 | sasusi.h | sasusi.cpp | Driver SAS USI |
| 042 | swauthority.h | swauthority.cpp | Driver Software Authority |
| 043 | starguide3.h | starguide3.cpp | Driver StarGuide III |
| 044 | starguide_feed.h | starguide_feed.cpp | Kontener danych StarGuide feed |
| 045 | unity4000.h | unity4000.cpp | Driver Unity 4000 |
| 046 | unity_feed.h | unity_feed.cpp | Kontener danych Unity feed |
| 047 | vguest.h | vguest.cpp | Driver Logitek vGuest |
| 048 | wheatnet_lio.h | wheatnet_lio.cpp | Driver Wheatnet LIO |
| 049 | wheatnet_slio.h | wheatnet_slio.cpp | Driver Wheatnet SLIO |

### Pliki tylko .h (bez .cpp)

| Header | Zawartosc |
|--------|-----------|
| globals.h | Deklaracje globalne (extern ripcd_active_locks) |

### Pliki tylko .cpp (bez .h)

| Source | Zawartosc |
|--------|-----------|
| local_macros.cpp | Metody MainObject: LoadLocalMacros(), RunLocalMacros() — obsluga makr RML |
| local_notifications.cpp | Metody MainObject: RunLocalNotifications() — obsluga notyfikacji |
| loaddrivers.cpp | Metoda MainObject: LoadSwitchDriver() — fabryka instancji driverow Switcher |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_*.cpp (30 plikow) | Generowane przez Qt moc (wymienione w nodist_ripcd_SOURCES) |

## Pliki testowe

Brak dedykowanych plikow testowych dla ripcd.

Powiazane testy w tests/:
- tests/notification_test.cpp — testuje polaczenie z ripcd (RIPCD_TCP_PORT), ale nie jest testem ripcd per se
- tests/log_unlink_test.cpp — referuje ripcd posrednio

## Autotools Target Definition

```makefile
sbin_PROGRAMS = ripcd

dist_ripcd_SOURCES = acu1p.cpp acu1p.h\
                     am16.cpp am16.h\
                     bt10x1.cpp bt10x1.h\
                     bt16x1.cpp bt16x1.h\
                     bt16x2.cpp bt16x2.h\
                     bt8x2.cpp bt8x2.h\
                     btacs82.cpp btacs82.h\
                     btadms4422.cpp btadms4422.h\
                     btgpi16.cpp btgpi16.h\
                     btsentinel4web.cpp btsentinel4web.h\
                     btss124.cpp btss124.h\
                     btss21.cpp btss21.h\
                     btss164.cpp btss164.h\
                     btss41mlr.cpp btss41mlr.h\
                     btss42.cpp btss42.h\
                     btss44.cpp btss44.h\
                     btss82.cpp btss82.h\
                     btsrc16.cpp btsrc16.h\
                     btsrc8iii.cpp btsrc8iii.h\
                     btu41mlrweb.cpp btu41mlrweb.h\
                     gvc7000.cpp gvc7000.h\
                     harlond.cpp harlond.h\
                     kernelgpio.cpp kernelgpio.h\
                     livewire_lwrpaudio.cpp livewire_lwrpaudio.h\
                     livewire_lwrpgpio.cpp livewire_lwrpgpio.h\
                     livewire_mcastgpio.cpp livewire_mcastgpio.h\
                     local_audio.cpp local_audio.h\
                     local_gpio.cpp local_gpio.h\
                     local_macros.cpp\
                     local_notifications.cpp\
                     loaddrivers.cpp\
                     modbus.cpp modbus.h\
                     modemlines.cpp modemlines.h\
                     quartz1.cpp quartz1.h\
                     ripcd.cpp ripcd.h globals.h\
                     ripcd_connection.cpp ripcd_connection.h\
                     rossnkscp.cpp rossnkscp.h\
                     sas32000.cpp sas32000.h\
                     sas64000.cpp sas64000.h\
                     sas64000gpi.cpp sas64000gpi.h\
                     sas16000.cpp sas16000.h\
                     sasusi.cpp sasusi.h\
                     starguide3.cpp starguide3.h\
                     starguide_feed.cpp starguide_feed.h\
                     swauthority.cpp swauthority.h\
                     switcher.cpp switcher.h\
                     unity4000.cpp unity4000.h\
                     unity_feed.cpp unity_feed.h\
                     vguest.cpp vguest.h\
                     wheatnet_lio.cpp wheatnet_lio.h\
                     wheatnet_slio.cpp wheatnet_slio.h
```

## Zaleznosci (z Makefile.am target_link_libraries)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @LIBVORBIS@ | external (audio codec) | tak |
| @QT4_LIBS@ | Qt framework | tak |
| @LIBHPI@ (librdhpi / AudioScience HPI) | internal + external | tak |
| @LIBJACK@ | external (JACK audio) | tak |
| @MUSICBRAINZ_LIBS@ | external (MusicBrainz) | tak |
| Qt3Support | Qt framework (compat) | tak |

## Architektura (podsumowanie)

ripcd to headless daemon (QApplication z false = brak GUI) pelniacy role centralnego
hubu IPC i sterownika urzadzen GPIO/switcher w systemie Rivendell.

**Wzorzec architektoniczny**: Strategy/Driver pattern
- `Switcher` (abstract QObject) definiuje interfejs: processCommand(), GPI/GPO, sygnaly
- 43 konkretne drivery implementuja rozne protokoly sprzetowe
- `MainObject` laduje drivery dynamicznie przez LoadSwitchDriver() (factory w loaddrivers.cpp)
- Komunikacja z klientami (rdairplay, rdlibrary itp.) przez TCP (QTcpServer + RipcdConnection)
- Obsluga makr RML (Rivendell Macro Language) przez UDP (echo/noecho/reply)
- GPIO state tracking: macierze GPI/GPO z maskami i makrami
