---
phase: 5
artifact: LIB
source: code
status: done
---

# Code Facts: librd

## Guard Clauses i Walidacje

### Cart & Cut Selection

```gherkin
Rule: Cut Selection — Validity Window
  Scenario: Selecting a cut for playback from an audio cart
    Given a cart of type Audio with cuts in CUTS table
    When  the system selects the next cut to play
    Then  only cuts matching ALL of the following are eligible:
          - START_DATETIME <= now <= END_DATETIME (or dates are NULL)
          - START_DAYPART <= current_time <= END_DAYPART (or dayparts are NULL)
          - Current day-of-week column (MON/TUE/WED/THU/FRI/SAT/SUN) = "Y"
          - EVERGREEN = "N" (non-evergreen cuts are tried first)
          - LENGTH > 0 (cut must have audio content)
  # Zrodlo: lib/rdcart.cpp:113-128
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Evergreen Fallback
  Scenario: No valid non-evergreen cuts found for a cart
    Given an audio cart where no cuts pass the validity window check
    When  the system needs a cut to play
    Then  the system falls back to EVERGREEN="Y" cuts with LENGTH>0
    And   if no evergreen cuts exist either, the cut name is empty (no playback)
  # Zrodlo: lib/rdcart.cpp:145-168
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Cut Validity — Evergreen Override
  Scenario: Checking if a specific cut is valid
    Given a cut record in the CUTS table
    When  the EVERGREEN field = "Y"
    Then  the cut is always considered valid (bypasses all date/day/daypart checks)
  # Zrodlo: lib/rdcut.cpp:128-131
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Cut Validity — Day-of-Week Check
  Scenario: Checking day-of-week restriction on a non-evergreen cut
    Given a non-evergreen cut
    When  the current day-of-week column (MON-SUN) != "Y"
    Then  the cut is invalid for playback
  # Zrodlo: lib/rdcut.cpp:132-135
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Cut Validity — DateTime Window
  Scenario: Checking start/end datetime restrictions
    Given a non-evergreen cut with START_DATETIME and END_DATETIME set
    When  START_DATETIME > now OR END_DATETIME < now
    Then  the cut is invalid for playback
  # Zrodlo: lib/rdcut.cpp:136-151
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Cut Validity — Daypart Window
  Scenario: Checking daypart time restrictions
    Given a non-evergreen cut with START_DAYPART and END_DAYPART set
    When  START_DAYPART > current_time OR END_DAYPART < current_time
    Then  the cut is invalid for playback
  # Zrodlo: lib/rdcut.cpp:144-151
  # Pewnosc: potwierdzone
```

### Cart Validity State Machine

```gherkin
Rule: Cart Validity Levels
  Scenario: Computing overall cart validity from its cuts
    Given a cart with one or more cuts
    When  the system computes cart validity
    Then  the cart validity is the HIGHEST of any cut's validity:
          - NeverValid: no playable cuts exist
          - ConditionallyValid: at least one cut has daypart/DOW/date restrictions
          - FutureValid: cut's START_DATETIME is in the future
          - AlwaysValid: promoted from ConditionallyValid when ALL 7 days active AND no daypart restrictions
          - EvergreenValid: ALL cuts are marked as evergreen
  # Zrodlo: lib/rdcart.cpp:1131-1196
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Cut Validity — Timescale Feasibility
  Scenario: Enforced length check during validation
    Given a cut with enforce_length enabled
    When  the cut's actual LENGTH * RD_TIMESCALE_MAX < forced_length
    Or    the cut's actual LENGTH * RD_TIMESCALE_MIN > forced_length
    Then  the cut is NeverValid (cannot be timescaled to fit)
  # Zrodlo: lib/rdcart.cpp:2348-2355
  # Pewnosc: potwierdzone
```

### Cart Number Validation

```gherkin
Rule: Cart Number Range Enforcement
  Scenario: Validating a cart number for a group
    Given a group with ENFORCE_CART_RANGE = "Y"
    When  a cart number is checked via cartNumberValid()
    Then  it must be between DEFAULT_LOW_CART and DEFAULT_HIGH_CART (inclusive)
    And   it must be between 1 and 999999 (global range)
  # Zrodlo: lib/rdgroup.cpp:331-356
  # Pewnosc: potwierdzone
```

### User Authentication & Authorization

```gherkin
Rule: User Authentication — Dual Mode
  Scenario: Authenticating a user
    Given a user login attempt
    When  localAuthentication() is true
    Then  the system checks PASSWORD in the USERS table directly
    And   for web users, ENABLE_WEB must also be "Y"
    When  localAuthentication() is false
    Then  the system delegates to PAM (Pluggable Authentication Modules)
  # Zrodlo: lib/rduser.cpp:65-95
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Group-Based Cart Authorization
  Scenario: Checking if user can access a cart
    Given a user and a cart number
    When  the system checks cartAuthorized()
    Then  it joins CART with USER_PERMS on GROUP_NAME
    And   the user must have permission to the cart's group via USER_PERMS table
  # Zrodlo: lib/rduser.cpp:545-559
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Feed Authorization
  Scenario: Checking if user can access a podcast feed
    Given a user and a feed key_name
    When  the system checks feedAuthorized()
    Then  there must be a matching row in FEED_PERMS for that user and key_name
  # Zrodlo: lib/rduser.cpp:563-576
  # Pewnosc: potwierdzone
```

### Log Playback Guards

```gherkin
Rule: Play Deck Allocation
  Scenario: Starting an event on the log play machine
    Given an event to play on RDLogPlay
    When  the event status is not Paused
    Then  a free PlayDeck must be allocated via GetPlayDeck()
    And   if no deck is available (NULL), playback cannot start (returns false)
  # Zrodlo: lib/rdlogplay.cpp:2090-2094
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Missing Audio Zombification
  Scenario: Starting playback but no audio file exists
    Given a log line with a cart/cut assignment
    When  playdeck->setCart() returns false (no audio available)
    Then  the event is "zombified" — it transitions immediately through Playing to Finished
    And   a LOG_WARNING is emitted
  # Zrodlo: lib/rdlogplay.cpp:1881-1892
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Position Bounds Check
  Scenario: Starting playback at a stored position
    Given a log line with a play position
    When  playPosition > effectiveLength
    Then  the play position is reset to 0
  # Zrodlo: lib/rdlogplay.cpp:1903-1906
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Segue Auto-Transition
  Scenario: Auto-segue to next event
    Given a playing event reaches its segue start point
    When  the operating mode is Auto AND next event's transition type is Segue
    And   the current event status is Playing AND its id != -1
    Then  the system starts the next event automatically with crossfade
  # Zrodlo: lib/rdlogplay.cpp:1525-1536
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Segue End — Auto Stop
  Scenario: Segue end point reached
    Given a playing event reaches its segue end point
    When  operating mode is Auto AND current event status is Finishing
    Then  the play deck is stopped, event cleaned up, and traffic logged
  # Zrodlo: lib/rdlogplay.cpp:1552-1561
  # Pewnosc: potwierdzone
```

### Timescale Guards

```gherkin
Rule: Timescale Speed Range
  Scenario: Calculating timescale speed for a play deck
    Given a log line with enforced length and timescale ratio calculated
    When  timescale_speed < DIVISOR * MIN (0.833) OR > DIVISOR * MAX (1.250)
    Then  timescale is reset to 1.0 (no scaling) and timescale_active = false
  # Zrodlo: lib/rdplay_deck.cpp:180-186
  # Pewnosc: potwierdzone
```

### Log Lock

```gherkin
Rule: Log Pessimistic Locking
  Scenario: Acquiring a lock on a log for editing
    Given a log to be edited
    When  tryLock() is called
    Then  the system atomically updates LOCK_DATETIME via SQL UPDATE with WHERE condition:
          LOCK_DATETIME is null OR LOCK_DATETIME < (now - 30s timeout)
    And   if the UPDATE affects 0 rows, the lock is held by another user
    And   the lock heartbeat refreshes every 15s (half the 30s timeout)
  # Zrodlo: lib/rdloglock.cpp:59-136, rd.h:578 (RD_LOG_LOCK_TIMEOUT=30000ms)
  # Pewnosc: potwierdzone
```

### Log Generation

```gherkin
Rule: Log Generation Requires Lock
  Scenario: Generating a log from clock/service
    Given a service wants to generate a log for a date
    When  the log already exists
    Then  it must be locked first; if locking fails, generation aborts
    And   the old log is removed, a new one created and locked
  # Zrodlo: lib/rdsvc.cpp:819-842
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Log Generation — Clock per Hour
  Scenario: Populating log events from service clocks
    Given a log being generated for a specific date
    When  iterating through 24 hours of the day
    Then  for each hour, the clock is determined by SERVICE_CLOCKS table
          keyed by (SERVICE_NAME, HOUR = 24*(dayOfWeek-1) + hour_index)
    And   each clock generates its events for that hour slot
  # Zrodlo: lib/rdsvc.cpp:853-865
  # Pewnosc: potwierdzone
```

### Duplicate Title Prevention

```gherkin
Rule: Duplicate Cart Titles
  Scenario: Setting a cart title when duplicates are disallowed
    Given the system setting allowDuplicateCartTitles() is false
    When  a cart title is set that already exists on another cart
    Then  the system appends " [N]" suffix (incrementing N) until unique
  # Zrodlo: lib/rdcart.cpp:2361-2385
  # Pewnosc: potwierdzone
```

## SQL -- Reguly danych

| Operacja | Tabela | Warunek WHERE/CHECK | Znaczenie biznesowe | Zrodlo |
|----------|--------|---------------------|---------------------|--------|
| SELECT | CUTS | CART_NUMBER=X, EVERGREEN="N", LENGTH>0, date/daypart/DOW filters | Selekcja prawidlowych cutow do playbacku | lib/rdcart.cpp:113-128 |
| SELECT | CUTS | CART_NUMBER=X, EVERGREEN="Y", LENGTH>0 | Fallback na evergreen cuty | lib/rdcart.cpp:146-155 |
| SELECT | CUTS | CUT_NAME=X, all validity fields | Pelna walidacja cuta | lib/rdcut.cpp:108-122 |
| UPDATE | CUTS | CART_NUMBER=X | Reset rotacji (LOCAL_COUNTER=0) po dodaniu cuta | lib/rdcart.cpp:1225-1229 |
| SELECT | USER_PERMS | USER_NAME=X, GROUP_NAME=Y | Autoryzacja uzytkownika do grupy | lib/rduser.cpp:517-523 |
| SELECT | CART JOIN USER_PERMS | CART.GROUP_NAME=USER_PERMS.GROUP_NAME | Autoryzacja uzytkownika do cartu przez grupe | lib/rduser.cpp:551-558 |
| SELECT | FEED_PERMS | USER_NAME=X, KEY_NAME=Y | Autoryzacja uzytkownika do feedu RSS | lib/rduser.cpp:569-575 |
| UPDATE | LOGS | LOCK conditions (NULL or expired) | Pesymistyczny lock na logu z timeout 30s | lib/rdloglock.cpp:104-113 |
| SELECT | SERVICE_CLOCKS | SERVICE_NAME, HOUR=24*(dow-1)+h | Mapowanie zegar->godzina per dzien tygodnia | lib/rdsvc.cpp:854-856 |
| SELECT | STACK_LINES | SERVICE_NAME, SCHED_STACK_ID >= stackid-titlesep | Separacja tytulowa w schedulerze | lib/rdevent_line.cpp:644-646 |
| SELECT | STACK_LINES | SERVICE_NAME, SCHED_STACK_ID >= stackid-artistsep | Separacja artysty w schedulerze | lib/rdevent_line.cpp:676-678 |
| SELECT | STACK_LINES JOIN STACK_SCHED_CODES | SCHED_STACK_ID > stackid-range, SCHED_CODE=X | Max-in-a-row / min-wait dla scheduler codes | lib/rdevent_line.cpp:719-726 |
| SELECT | GROUPS | NAME=X | Cart range (DEFAULT_LOW_CART, DEFAULT_HIGH_CART), ENFORCE_CART_RANGE | lib/rdgroup.cpp:268-273, 337-343 |
| SELECT | SUPERFEED_MAPS | KEY_NAME=X | Mapowanie superfeed -> subfeedy | lib/rdfeed.cpp:132-135 |
| SELECT | LOG_LINES | LOG_NAME=X, TYPE=MusicLink/TrafficLink | Liczenie linkow muzycznych/trafficowych w logu | lib/rdlog.cpp:282-300 |
| SELECT | IMPORTER_LINES | STATION_NAME, PROCESS_ID | Import danych traffic/music z plikami zewnetrznymi | lib/rdsvc.cpp:747-755 |

## Obliczenia i Formuly

| Formula | Kontekst | Znaczenie | Zrodlo |
|---------|----------|-----------|--------|
| `avg_length = SUM(cut_length * weight) / SUM(weight)` | Aktualizacja dlugosci cartu | Srednia dlugosc cartu wazona wagami cutow; cuty po END_DATETIME maja wage 0 | lib/rdcart.cpp:1062-1108 |
| `avg_segue = SUM(segue_portion * weight) / SUM(weight)` | Aktualizacja segue cartu | Segue = segue_start - start_point; jesli brak segue, uzywana cala dlugosc cuta | lib/rdcart.cpp:1092-1097 |
| `hook_length = hook_end - hook_start` | Dlugsc hooka | Srednia dlugosc hooka (czesc cuta do podgladu) | lib/rdcart.cpp:1098 |
| `talk_length = talk_end - talk_start` | Min/max talk length | Dlugosc segmentu talk (dla prezenterow) | lib/rdcart.cpp:1099-1103 |
| `max_deviation = max(high-avg, avg-low)` | Odchylenie dlugosci | Maksymalne odchylenie dlugosci cutow od sredniej | lib/rdcart.cpp:612-618 |
| `free_carts = high_cart - low_cart - used_carts` | Wolne carty w grupie | Ile cartow mozna jeszcze dodac w zakresie grupy | lib/rdgroup.cpp:263-292 |
| `timescale_speed = DIVISOR * forced_length / actual_length` | Timescaling playdecku | Przelicznik predkosci do dopasowania cartu do wymaganej dlugosci | lib/rdplay_deck.cpp:180-190 |
| `talk_point = cut_talk_point * (DIVISOR / timescale_speed)` | Korekcja talk pointow | Punkty talk sa skalowane odwrotnie do predkosci timescale | lib/rdplay_deck.cpp:212-216 |
| `gap_length = 1000 * (next_start_secs - prev_secs) - prev_length` | Import traffic/music | Obliczanie przerw miedzy elementami importu (gap >= 0) | lib/rdsvc.cpp:761-763 |
| `clock_hour = 24 * (dayOfWeek - 1) + hour_index` | Mapowanie zegar-godzina | 168 slotow (7 dni * 24 godziny) na tygodniowy rozklad zegarow | lib/rdsvc.cpp:856 |
| `cut_selection_ratio = LOCAL_COUNTER / WEIGHT` | Weighted cut rotation | Cut o najnizszym stosunku counter/weight jest nastepny | lib/rdcart.cpp:2233 |

## Stale i Limity

### System Limits

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| RD_MAX_CART_NUMBER | 999999 | Maksymalny numer cartu w systemie | lib/rd.h:180 |
| RD_MAX_CUT_NUMBER | 999 | Maksymalna liczba cutow na cart | lib/rd.h:185 |
| RD_MAX_CARDS | 24 | Maksymalna liczba kart audio | lib/rd.h:129 |
| RD_MAX_STREAMS | 48 | Maksymalna liczba strumieni audio na karte/typ | lib/rd.h:134 |
| RD_MAX_PORTS | 24 | Maksymalna liczba portow audio na karte/typ | lib/rd.h:139 |
| MAX_TTYS | 8 | Maksymalna liczba portow szeregowych (TTY) | lib/rd.h:144 |
| MAX_DECKS | 8 | Maksymalna liczba deckow nagrywania na stacje | lib/rd.h:149 |
| MAX_ENDPOINTS | 2048 | Maks. wejsc/wyjsc w macierzy przelacznikowej | lib/rd.h:154 |
| MAX_MATRICES | 8 | Maks. macierzy przelacznikowych na stacje | lib/rd.h:159 |
| RD_MAX_MACRO_TIMERS | 16 | Maks. timerow makr na stacje | lib/rd.h:164 |
| MAX_PANELS | 50 | Maks. paneli dzwiekowych danego typu | lib/rd.h:175 |
| MAX_GPIO_PINS | 32768 | Maks. pinow GPIO (GPI lub GPO) | lib/rd.h:124 |
| RD_MAX_PASSWORD_LENGTH | 32 | Maks. dlugosc hasla uzytkownika | lib/rd.h:76 |

### Audio & Playback

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| RD_DEFAULT_SAMPLE_RATE | 48000 | Domyslna czestotliwosc probkowania audio | lib/rd.h:370 |
| RD_DEFAULT_CHANNELS | 2 | Domyslna liczba kanalow (stereo) | lib/rd.h:375 |
| RD_TIMESCALE_MIN | 0.833 | Minimalny wspolczynnik timescale (~83.3%, slowdown limit) | lib/rd.h:342 |
| RD_TIMESCALE_MAX | 1.250 | Maksymalny wspolczynnik timescale (~125%, speedup limit) | lib/rd.h:343 |
| RD_TIMESCALE_DIVISOR | 100000.0 | Dzielnik dokladnosci timescale | lib/rd.h:344 |
| RD_FADE_DEPTH | -3000 | Min. glosnosc na koncu segue (-30dB w setnych dB) | lib/rd.h:317 |
| RD_MUTE_DEPTH | -10000 | Pelne wyciszenie (-100dB w setnych dB) | lib/rd.h:322 |
| RD_BASE_ANALOG | 1600 | Referencyjny poziom analogowy: -16dBFS = +4dBu (w setnych dB) | lib/rd.h:170 |
| REFERENCE_LEVEL | 1600 | Identyczny z RD_BASE_ANALOG | lib/rd.h:190 |
| RD_MAX_BANDPASS | 15000 | Maks. czestotliwosc pasma audio (Hz) — limit FM stereo | lib/rd.h:337 |
| RD_CUEEDITOR_AUDITION_PREROLL | 5000 | Preroll audition w edytorze cue (5 sek w ms) | lib/rd.h:428 |

### Log Playback Engine

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| LOGPLAY_MAX_PLAYS | 7 | Maks. rownoczesnych playbackow w logu | lib/rdlogplay.h:45 |
| TRANSPORT_QUANTITY | 7 | Ilosc transportow (deckow) playbacku | lib/rdlogplay.h:46 |
| LOGPLAY_LOOKAHEAD_EVENTS | 20 | Ile eventow do przodu analizowac | lib/rdlogplay.h:47 |
| LOGPLAY_RESCAN_INTERVAL | 5000 | Czestotliwosc rescan logu (5s) | lib/rdlogplay.h:48 |
| LOGPLAY_RESCAN_SIZE | 30 | Ile eventow sprawdzac przy rescan | lib/rdlogplay.h:49 |
| RDAIRPLAY_LOG_QUANTITY | 3 | Liczba maszyn logowych w RDAirPlay | lib/rd.h:419 |

### Networking & Daemons

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| RIPCD_TCP_PORT | 5006 | Port TCP dla RIPCD (GPIO/serial daemon) | lib/rd.h:99 |
| CAED_TCP_PORT | 5005 | Port TCP dla CAE (Core Audio Engine) | lib/rd.h:104 |
| RDCATCHD_TCP_PORT | 6006 | Port TCP dla RDCatchd (scheduler daemon) | lib/rd.h:109 |
| RD_RML_ECHO_PORT | 5858 | Port RML z echo (odpowiedzia) | lib/rd.h:282 |
| RD_RML_NOECHO_PORT | 5859 | Port RML bez echo | lib/rd.h:283 |
| RD_RML_REPLY_PORT | 5860 | Port odpowiedzi RML | lib/rd.h:284 |
| RD_RML_MAX_LENGTH | 2048 | Maks. dlugosc komendy RML | lib/rd.h:286 |
| RD_NOTIFICATION_PORT | 20539 | Port UDP notyfikacji miedzy stacjami | lib/rd.h:588 |
| RD_PAD_CLIENT_TCP_PORT | 34289 | Port TCP klienta PAD (Program Associated Data) | lib/rd.h:610 |
| RD_LOG_LOCK_TIMEOUT | 30000 | Timeout locka na logu (30 sek) | lib/rd.h:578 |
| RD_DEFAULT_SERVICE_TIMEOUT | 30 | Timeout uslug webowych (30 sek) | lib/rd.h:616 |
| RD_CURL_TIMEOUT | 1200 | Timeout operacji CURL (20 min) | lib/rd.h:496 |
| RD_WEB_SESSION_TIMEOUT | 900 | Timeout sesji webowej (15 min) | lib/rdweb.h:38 |

### Sound Panel

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| PANEL_MAX_OUTPUTS | 5 | Maks. wyjsc audio panelu | lib/rdsound_panel.h:46 |
| PANEL_SCAN_INTERVAL | 10000 | Interwat skanowania panelu (10s) | lib/rdsound_panel.h:47 |
| PANEL_MAX_BUTTON_COLUMNS | 20 | Maks. kolumn przyciskow | lib/rdbutton_panel.h:37 |
| PANEL_MAX_BUTTON_ROWS | 20 | Maks. wierszy przyciskow | lib/rdbutton_panel.h:38 |
| RDCARTSLOTS_MAX_ROWS | 16 | Maks. wierszy cart slotow | lib/rd.h:557 |
| RDCARTSLOTS_MAX_COLUMNS | 4 | Maks. kolumn cart slotow | lib/rd.h:558 |

### PlayDeck Ducking

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| RDPLAYDECK_DUCKDOWN_LENGTH | 750 | Czas sciszenia (duck down) w ms | lib/rdplay_deck.h:36 |
| RDPLAYDECK_DUCKUP_LENGTH | 1500 | Czas powrotu glosnosci (duck up) w ms | lib/rdplay_deck.h:37 |

### Database

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| RD_VERSION_DATABASE | 347 | Aktualna wersja schematu bazy danych | lib/dbversion.h:27 |
| DEFAULT_MYSQL_DATABASE | "Rivendell" | Domyslna nazwa bazy danych | lib/rd.h:64 |
| DEFAULT_MYSQL_USERNAME | "rduser" | Domyslny uzytkownik MySQL | lib/rd.h:65 |
| DEFAULT_MYSQL_HEARTBEAT_INTERVAL | 360 | Interwat heartbeat bazy (6 min) | lib/rd.h:68 |

### Podcasting

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| RDFEED_TOTAL_POST_STEPS | 4 | Kroki publikacji podcastu | lib/rdfeed.h:36 |
| RD_GPIO_EVENT_DAYS | 30 | Ile dni przechowywac eventy GPIO | lib/rd.h:626 |

### Scheduler Defaults

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| Default artist_sep | 15 | Domyslna separacja artysty (jesli poza zakresem -1..50000) | lib/rdevent_line.cpp:561-566 |
| Default title_sep | 100 | Domyslna separacja tytulu (jesli poza zakresem -1..50000) | lib/rdevent_line.cpp:568-573 |

### Audio Formats

| Stala | Wartosc | Znaczenie biznesowe | Zrodlo |
|-------|---------|---------------------|--------|
| WAVE_FORMAT_PCM | 0x0001 | Format PCM (nieskompresowany) | lib/rdwavefile.h:1259 |
| WAVE_FORMAT_MPEG | 0x0050 | Format MPEG audio | lib/rdwavefile.h:1302 |
| WAVE_FORMAT_MPEGLAYER3 | 0x0055 | Format MP3 | lib/rdwavefile.h:1305 |
| WAVE_FORMAT_VORBIS | 0xFFFF | Format Ogg Vorbis (Rivendell-specific ID) | lib/rdwavefile.h:1369 |
| WAVE_FORMAT_FLAC | 0xFFFE | Format FLAC (Rivendell-specific ID) | lib/rdwavefile.h:1370 |
| WAVE_FORMAT_M4A | 0xFFFD | Format M4A/AAC (Rivendell-specific ID) | lib/rdwavefile.h:1371 |
| CART_DEFAULT_END_YEAR | 2099 | Domyslny rok konca waznosci cartu | lib/rdwavefile.h:1240 |

## Scheduler — Reguly Dekonfliktacji

```gherkin
Rule: Title Separation
  Scenario: Scheduling a cart from scheduler group
    Given a scheduler event with title_sep >= 0
    When  selecting carts from the scheduler group
    Then  carts whose TITLE matches any title in the last N stack entries are excluded
    And   N = title_sep value (default 100 if out of range)
    And   if all carts excluded, the rule is "broken" (logged) and exclusion reverted
  # Zrodlo: lib/rdevent_line.cpp:638-666
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Artist Separation
  Scenario: Scheduling a cart from scheduler group
    Given a scheduler event with artist_sep >= 0
    When  selecting carts from the scheduler group
    Then  carts whose ARTIST matches any artist in the last N stack entries are excluded
    And   N = artist_sep value (default 15 if out of range)
    And   if all carts excluded, the rule is "broken" (logged) and exclusion reverted
  # Zrodlo: lib/rdevent_line.cpp:670-698
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Max In A Row / Min Wait (Clock Rules)
  Scenario: Applying clock scheduler rules
    Given a clock defines RULE_LINES with CODE, MAX_ROW, MIN_WAIT
    When  selecting carts
    Then  range = MAX_ROW + MIN_WAIT entries back in the stack
    And   if carts with that sched_code already >= MAX_ROW in range, exclude carts with that code
    And   if all excluded, rule is "broken" and exclusion reverted
  # Zrodlo: lib/rdevent_line.cpp:700-740
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Do Not Schedule After
  Scenario: Applying "not after" constraint
    Given a clock rule has NOT_AFTER sched code set
    When  the immediately previous stack entry has that code
    Then  carts with the rule's CODE are excluded from selection
  # Zrodlo: lib/rdevent_line.cpp:742-770
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Scheduler Code Filtering
  Scenario: Filtering carts by required sched codes
    Given an event defines HAVE_CODE and/or HAVE_CODE2
    When  building the candidate cart list
    Then  only carts that possess ALL required sched codes are included
  # Zrodlo: lib/rdevent_line.cpp:618-633
  # Pewnosc: potwierdzone
```

## Cut Rotation — Algorytmy Wyboru

```gherkin
Rule: Weighted Cut Selection
  Scenario: Selecting next cut with useWeighting() = true
    Given a cart with weighting enabled
    When  selecting the next cut to play
    Then  the cut with the lowest ratio (LOCAL_COUNTER / WEIGHT) is chosen
    And   this ensures proportional rotation based on assigned weights
  # Zrodlo: lib/rdcart.cpp:129-131, 2231-2237
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Sequential Cut Selection (Play Order)
  Scenario: Selecting next cut with useWeighting() = false
    Given a cart with weighting disabled (play order mode)
    When  selecting the next cut to play
    Then  cuts are sorted by LAST_PLAY_DATETIME desc, PLAY_ORDER desc
    And   the algorithm picks the next PLAY_ORDER after the last played one
    And   wraps around to lowest PLAY_ORDER when reaching the end
  # Zrodlo: lib/rdcart.cpp:133-135, 2239-2259
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Weighted Selection — Expired Cuts Weight Zero
  Scenario: Computing average length with expired cuts
    Given a cut whose END_DATETIME is in the past
    When  calculating average cart length or selecting cuts
    Then  the expired cut's WEIGHT is treated as 0 (excluded from calculations)
  # Zrodlo: lib/rdcart.cpp:590-593, 1087-1090
  # Pewnosc: potwierdzone
```

## Event Properties — Log Generation

```gherkin
Rule: Preposition Override
  Scenario: Event has preposition value set (>= 0)
    Given a clock event with preposition >= 0
    When  generating log entries for this event
    Then  time_type is forced to Hard
    And   grace_time is forced to -1 (no grace)
    And   the start time is moved earlier by preposition milliseconds
  # Zrodlo: lib/rdevent_line.cpp:462-471
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Import Source Types
  Scenario: Event log generation with import source
    Given an event has import_source set to Traffic, Music, or Scheduler
    When  generating the log
    Then  Traffic creates TrafficLink placeholder
    And   Music creates MusicLink placeholder
    And   Scheduler directly fills from CART table with deconfliction
  # Zrodlo: lib/rdevent_line.cpp:504-549
  # Pewnosc: potwierdzone
```

## Notifications

```gherkin
Rule: Inter-Station Notifications via UDP
  Scenario: Broadcasting state changes across workstations
    Given a cart, log, feed, or other entity is modified
    When  a notification is sent
    Then  it is broadcast as a UDP packet on port 20539
    And   format: "NOTIFY <type> <action> <id>"
    And   types include: Cart, Log, Pypad, Dropbox, CatchEvent, FeedItem
  # Zrodlo: lib/rdnotification.cpp:82-120, rd.h:588
  # Pewnosc: potwierdzone
```

## Superfeed (Podcast Aggregation)

```gherkin
Rule: Superfeed Aggregation
  Scenario: A feed is marked as superfeed
    Given IS_SUPERFEED = "Y" in FEEDS table
    When  rendering the feed
    Then  it aggregates items from all member feeds defined in SUPERFEED_MAPS table
  # Zrodlo: lib/rdfeed.cpp:112-139
  # Pewnosc: potwierdzone
```

## Log Refresh (Live Sync)

```gherkin
Rule: Log Refresh — 4-Pass Algorithm
  Scenario: Log is refreshed while playing (live update from database)
    Given a log is playing and a new version is available
    When  the log is refreshed
    Then  Pass 1: Mark matching events between old and new log by ID
    Then  Pass 2: Purge events not in new log (pass=0), preserving playing items
    Then  Pass 3: Add new events at correct positions (after holdovers)
    Then  Pass 4: Delete orphaned finished events not in new log
  # Zrodlo: lib/rdlogplay.cpp:680-732
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Holdover Events
  Scenario: Events carry over during log refresh
    Given some events are marked as holdovers (from previous log)
    When  the log is refreshed
    Then  holdover events stay at the top of the log
    And   new events are inserted after the last holdover
  # Zrodlo: lib/rdlogplay.cpp:692-703
  # Pewnosc: potwierdzone
```

## Audio File Management

```gherkin
Rule: Audio File Path Convention
  Scenario: Locating audio file for a cut
    Given a cut named e.g. "001234_001"
    When  the system needs the audio file path
    Then  path = audioRoot + "/" + cutName + "." + audioExtension
    And   default audioRoot is configured in rd.conf
  # Zrodlo: lib/rdconfig.cpp:113-117
  # Pewnosc: potwierdzone
```

```gherkin
Rule: Cut Name Format
  Scenario: Creating a new cut for a cart
    Given a cart with number N
    When  adding a new cut
    Then  cut_name = sprintf("%06d_%03d", cart_number, cut_number)
    And   cut_number is the next available slot (1 to 999)
  # Zrodlo: lib/rdcart.cpp:1252-1255
  # Pewnosc: potwierdzone
```

## QSettings -- Konfiguracja

Rivendell does NOT use QSettings. Configuration is managed through:
1. **RDProfile** (INI-style) for rd.conf and rd.ini files (`lib/rdprofile.cpp`)
2. **MySQL database** for all runtime settings (via RDSqlQuery)
3. **RDConfig** class reads rd.conf via RDProfile (`lib/rdconfig.cpp:530`)

| Klucz (rd.conf sekcja/tag) | Typ | Domyslna | Znaczenie | Zrodlo |
|-------|-----|----------|-----------|--------|
| [Identity]/AudioRoot | string | (config) | Root katalog plikow audio | lib/rdconfig.cpp:101-104 |
| [Identity]/AudioExtension | string | (config) | Rozszerzenie plikow audio | lib/rdconfig.cpp:107-109 |
| [Identity]/Label | string | "Default Configuration" | Etykieta konfiguracji | lib/rdconfig.cpp:120-122, rd.h:229 |
| [mySQL]/Hostname | string | "localhost" | Host bazy danych | lib/rd.h:63 |
| [mySQL]/Database | string | "Rivendell" | Nazwa bazy | lib/rd.h:64 |
| [mySQL]/Loginname | string | "rduser" | Uzytkownik bazy | lib/rd.h:65 |
| [mySQL]/Password | string | "letmein" | Haslo bazy | lib/rd.h:66 |
| [Fonts]/Family | string | (system) | Rodzina czcionki UI | lib/rdconfig.cpp:156-158 |
| [Fonts]/ButtonSize | int | (default) | Rozmiar czcionki przyciskow | lib/rdconfig.cpp:162-164 |
| [AudioStore]/MountSource | string | (none) | Zrodlo montowania audio store | lib/rdconfig.cpp:126-128 |
| [AudioStore]/MountType | string | (none) | Typ montowania (NFS, etc.) | lib/rdconfig.cpp:132-134 |
| [AudioStore]/MountOptions | string | "defaults" | Opcje montowania | lib/rdconfig.cpp:138-140, rd.h:234 |
