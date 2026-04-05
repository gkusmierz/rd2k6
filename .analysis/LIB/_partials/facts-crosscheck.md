---
phase: 5
artifact: LIB
source: crosscheck
status: done
---

# Crosscheck: librd

## Podsumowanie

| Typ rozbieznosci | Liczba |
|-------------------|--------|
| TYP 1 — W docs, brak w kodzie | 3 |
| TYP 2 — W kodzie, brak w docs | 9 |
| TYP 3 — Sprzecznosc test<->docs | 2 |
| TYP 4 — Edge case tylko w testach | 14 |

## TYP 1 — W dokumentacji, brak w kodzie

| Fakt z dokumentacji | Zrodlo doc | Status |
|---------------------|-----------|--------|
| Dayparting wplywa TYLKO na modul on-air (RDAirPlay), w innych modulach cut zawsze gra — brak mechanizmu w librd ktory by enforceowal ten podział; to wynika z tego ze inne moduly po prostu nie wywoluja walidacji daypartowej | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting | nie_dotyczy_LIB — to jest logika wywolania w aplikacjach, nie w librd; librd udostepnia walidacje, ale nie wymusza kontekstu on-air |
| Rename grupy do istniejacej grupy = merge (karty przenoszone do docelowej grupy) — brak implementacji merge w RDGroup w librd | docs/opsguide/rdadmin.xml:rdadmin.manage_groups.renaming_groups | nie_dotyczy_LIB — operacja merge jest prawdopodobnie w RDAdmin UI, nie w librd |
| Transmit Now & Next (Group) jest DEPRECATED — zostanie usuniete w v4.x — brak kodu deprecation warning w librd | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information | undocumented_gap — pole istnieje w DB ale brak kodu obslugi w librd; deprecation jest tylko w docs |

## TYP 2 — W kodzie, brak w dokumentacji

| Fakt z kodu | Zrodlo kod | Status |
|-------------|-----------|--------|
| Log Pessimistic Locking z 30s timeout i 15s heartbeat — pesymistyczny lock na logu z atomowym UPDATE i auto-expire | lib/rdloglock.cpp:59-136 | hidden_feature — dokumentacja nie opisuje mechanizmu lockowania logow |
| Log Refresh — 4-Pass Algorithm (mark, purge, add, delete orphans) — zywiotkowa synchronizacja logu podczas odtwarzania | lib/rdlogplay.cpp:680-732 | internal_only — szczegol implementacji silnika playback |
| Holdover Events — eventy z poprzedniego logu pozostaja na gorze po refresh | lib/rdlogplay.cpp:692-703 | hidden_feature — brak opisu holdover w docs |
| Duplicate Cart Titles — automatyczne dodawanie sufiksu " [N]" gdy duplikaty tytulu sa zabronione | lib/rdcart.cpp:2361-2385 | hidden_feature — docs nie opisuja mechanizmu deduplikacji tytulow |
| Superfeed Aggregation — feed z IS_SUPERFEED="Y" agreguje itemy z subfeedow przez SUPERFEED_MAPS | lib/rdfeed.cpp:112-139 | needs_doc — superfeedy sa zaawansowana funkcja bez opisu w opsguide |
| Inter-Station Notifications via UDP port 20539 — broadcast zmian stanu miedzy stacjami | lib/rdnotification.cpp:82-120 | hidden_feature — notyfikacje sa infrastruktura wewnetrzna |
| Scheduler deconfliction rules: Do Not Schedule After constraint — wyklucza carty po konkretnym sched code | lib/rdevent_line.cpp:742-770 | hidden_feature — docs opisuja scheduler ogolnie ale nie ta konkretna regule |
| Preposition Override — wymuszenie Hard time i przesuniecie start time o preposition ms | lib/rdevent_line.cpp:462-471 | hidden_feature — szczegol generowania logu |
| Missing Audio Zombification — event bez audio przechodzi natychmiast Playing->Finished z LOG_WARNING | lib/rdlogplay.cpp:1881-1892 | internal_only — mechanizm obslugi bledow silnika playback |

## TYP 3 — Sprzecznosc test<->dokumentacja

| Kod/Test mowi | Docs mowi | Zrodlo kod | Zrodlo doc | Rozstrzygniecie |
|---------------|-----------|-----------|-----------|----------------|
| Formaty konwersji audio obejmuja: Pcm16, Pcm24, MpegL2, MpegL2Wav, MpegL3, Flac, OggVorbis (+ M4A w kodzie: WAVE_FORMAT_M4A=0xFFFD) | Formaty importu: WAV (PCM16/24/MPEG), MP1/MP2/MP3, OGG, FLAC — brak M4A/AAC | tests/audio_convert_test.cpp, lib/rdwavefile.h:1371 | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file | kod_wins — M4A jest zdefiniowany w kodzie (WAVE_FORMAT_M4A) ale docs nie wymieniaja go jako obslugiwany format |
| Kod definiuje AlwaysValid jako promocje z ConditionallyValid gdy ALL 7 dni aktywne AND brak daypart restrictions; EvergreenValid gdy ALL cuts sa evergreen | Docs opisuja 4 kolory: NO COLOR (gra normalnie), CYAN (data w przyszlosci), RED (poza dayparting/brak audio), GREEN (evergreen) — brak mapowania na 5-stopniowa skale validity z kodu | lib/rdcart.cpp:1131-1196 | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding | kod_wins — dokumentacja upraszcza model validity do kolorow UI; kod ma bogatszy model (NeverValid, ConditionallyValid, FutureValid, AlwaysValid, EvergreenValid) |

## TYP 4 — Edge cases tylko w testach

| Test | Constraint odkryta | Plik testowy | Zmapowana na klase |
|------|--------------------|-------------|-------------------|
| dateparse_test | --datetime i --time sa mutually exclusive | tests/dateparse_test.cpp::MainObject | RDParseRfc822DateTime, RDParseXmlDateTime |
| dateparse_test | --time z formatem RFC822 jest nieobslugiwany (exit 1) | tests/dateparse_test.cpp::MainObject | RDParseRfc822DateTime |
| dateparse_test | --print z formatem auto jest nieobslugiwany | tests/dateparse_test.cpp::MainObject | RDParseDateTime |
| dateparse_test | Parsowanie czasu z day_offset < 0 raportuje "lost N day" | tests/dateparse_test.cpp::MainObject | RDParseXmlTime |
| wav_chunk_test | Plik obciety (< 4/8/12 bajtow) powoduje exit z "file truncated" | tests/wav_chunk_test.cpp::MainObject | RDWaveFile |
| wav_chunk_test | Chunk size wykraczajacy poza koniec pliku generuje WARNING | tests/wav_chunk_test.cpp::NextChunk | RDWaveFile |
| audio_convert_test | bit-rate i quality sa mutually exclusive | tests/audio_convert_test.cpp::MainObject | RDAudioConvert |
| audio_convert_test | metadata-cart poza zakresem (0 lub > 999999) = invalid | tests/audio_convert_test.cpp::MainObject | RDAudioConvert |
| audio_convert_test | normalization_level > 0 = invalid | tests/audio_convert_test.cpp::MainObject | RDAudioConvert |
| audio_convert_test | speed_ratio <= 0 = invalid | tests/audio_convert_test.cpp::MainObject | RDAudioConvert |
| audio_export_test | cart_number > 999999 = invalid | tests/audio_export_test.cpp::MainObject | RDAudioExport |
| audio_export_test | cut_number > 999 = invalid | tests/audio_export_test.cpp::MainObject | RDAudioExport |
| delete_test | URL relatywne = exit z "URL's must be fully qualified" | tests/delete_test.cpp::MainObject | RDDelete |
| feed_image_test | Push niepoprawnego pliku obrazu = exit z "invalid image file" | tests/feed_image_test.cpp::RunPush | RDFeed (FEED_IMAGES) |

## Potwierdzenia (fakty zgodne w wielu zrodlach)

| Fakt | Kod | Test | Doc | Pewnosc |
|------|-----|------|-----|---------|
| Cart number range: 1-999999 (RD_MAX_CART_NUMBER=999999) | ✅ lib/rd.h:180 | ✅ audio_export_test, metadata_wildcard_test | ✅ docs/opsguide/rdlibrary.xml | potwierdzone |
| Max cuts per cart: 999 (RD_MAX_CUT_NUMBER=999) | ✅ lib/rd.h:185 | ✅ audio_export_test, audio_import_test | ✅ docs/opsguide/rdlibrary.xml | potwierdzone |
| Cut validity: daypart + DOW + date range + evergreen as AND logic | ✅ lib/rdcut.cpp:128-151 | ❌ | ✅ docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting | potwierdzone |
| Evergreen fallback: when no valid non-evergreen cuts, use evergreen cuts | ✅ lib/rdcart.cpp:145-168 | ❌ | ✅ docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding (GREEN=Evergreen) | potwierdzone |
| Weighted cut rotation: ratio = LOCAL_COUNTER / WEIGHT | ✅ lib/rdcart.cpp:2231-2237 | ❌ | ✅ docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting (By Weight) | potwierdzone |
| Sequential cut rotation: By Specified Order | ✅ lib/rdcart.cpp:2239-2259 | ❌ | ✅ docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting (By Specified Order) | potwierdzone |
| Enforce Cart Range: cart number must be within group's DEFAULT_LOW_CART..DEFAULT_HIGH_CART | ✅ lib/rdgroup.cpp:331-356 | ✅ reserve_carts_test | ✅ docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups | potwierdzone |
| User auth: dual mode (local password vs PAM) | ✅ lib/rduser.cpp:65-95 | ✅ test_pam.cpp | ✅ docs/opsguide/overview.xml:sect.overview.users (implicit) | potwierdzone |
| Group-based cart authorization via USER_PERMS table | ✅ lib/rduser.cpp:545-559 | ❌ | ✅ docs/opsguide/rdadmin.xml:sect.rdadmin.manage_users (Group Permissions) | potwierdzone |
| Feed authorization via FEED_PERMS table | ✅ lib/rduser.cpp:563-576 | ❌ | ✅ docs/opsguide/rdadmin.xml:sect.rdadmin.manage_users (Podcast Feed Permissions) | potwierdzone |
| RML ports: echo=5858, noecho=5859, reply=5860 | ✅ lib/rd.h:282-284 | ❌ | ✅ docs/opsguide/rml.xml:sect.rml.command_delivery | potwierdzone |
| PAD TCP port: 34289 | ✅ lib/rd.h:610 | ❌ | ✅ docs/opsguide/pad.xml:sect.pad.the_json_interface | potwierdzone |
| Log machines: 3 (RDAIRPLAY_LOG_QUANTITY=3) | ✅ lib/rd.h:419 | ❌ | ✅ docs/opsguide/rdairplay.xml:sect.rdairplay.log_machines | potwierdzone |
| Max serial ports: 8 (MAX_TTYS=8) | ✅ lib/rd.h:144 | ❌ | ✅ docs/opsguide/overview.xml:sect.overview.serial_ports | potwierdzone |
| Timescale range: 0.833-1.250 (RD_TIMESCALE_MIN/MAX) | ✅ lib/rd.h:342-343 | ❌ | ✅ docs/opsguide/rdlibrary.xml (Enforce Length — "ograniczone") | potwierdzone |
| Automation modes: Automatic, LiveAssist, Manual | ✅ lib/rdlogplay.cpp (implicit) | ❌ | ✅ docs/opsguide/rdairplay.xml:sect.rdairplay.layout | potwierdzone |
| Audio formats: WAV/PCM, MPEG, MP3, Ogg, FLAC | ✅ lib/rdwavefile.h:1259-1370 | ✅ audio_convert_test | ✅ docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file | potwierdzone |
| SHA1 hash: empty string for nonexistent file | ✅ (implicit — RDSha1Hash) | ✅ test_hash.cpp | ❌ | potwierdzone |
| Audio import: supports normalization, autotrim, channels, use-metadata | ✅ lib/rdaudioimport | ✅ audio_import_test | ✅ docs/opsguide/rdlibrary.xml | potwierdzone |
| Audio export: supports format, channels, sample rate, bit rate, quality | ✅ lib/rdaudioexport | ✅ audio_export_test | ✅ docs/opsguide/rdlibrary.xml | potwierdzone |
| File transfer: RDDownload (HTTP/FTP/SSH), RDUpload, RDDelete | ✅ lib/rddownload, rdupload, rddelete | ✅ download_test, upload_test, delete_test | ❌ | potwierdzone |
| Podcast feed images: list/push/pop via FEED_IMAGES table | ✅ lib/rdfeed.cpp | ✅ feed_image_test | ✅ docs/opsguide/rdcastmanager.xml (implicit) | potwierdzone |
| Dropbox: one-time import, requires cart range in group | ✅ (implicit via rdgroup/rdsvc) | ❌ | ✅ docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes | potwierdzone |
| Log generation: clock per hour, 168 slots (7*24) | ✅ lib/rdsvc.cpp:853-865 | ❌ | ❌ | prawdopodobne |
| Cut name format: sprintf("%06d_%03d", cart, cut) | ✅ lib/rdcart.cpp:1252-1255 | ❌ | ❌ | prawdopodobne |
| Segue auto-transition: starts next event when current reaches segue start in Auto mode | ✅ lib/rdlogplay.cpp:1525-1536 | ❌ | ✅ docs/opsguide/rdairplay.xml (Automatic mode) | potwierdzone |
| Title/Artist separation in scheduler (defaults: title=100, artist=15) | ✅ lib/rdevent_line.cpp:561-573 | ❌ | ❌ | prawdopodobne |
| Multicast receiver: subscribe to address, bind to port | ✅ lib/rdmulticaster | ✅ mcast_recv_test | ❌ | potwierdzone |
| Notification via RIPC: signal notificationReceived(RDNotification*) | ✅ lib/rdnotification.cpp | ✅ notification_test | ❌ | potwierdzone |
| XML escape/unescape + URL escape/unescape utility functions | ✅ lib (rdxml, rdurl) | ✅ stringcode_test | ❌ | potwierdzone |
| Date parsing: RFC822, XML xs:dateTime, auto-detect | ✅ lib (rddatetime) | ✅ dateparse_test | ❌ | potwierdzone |
| Log lock timeout: 30000ms (RD_LOG_LOCK_TIMEOUT) | ✅ lib/rd.h:578, lib/rdloglock.cpp | ❌ | ❌ | prawdopodobne |
