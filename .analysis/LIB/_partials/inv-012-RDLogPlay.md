# RDLogPlay — Inventory Partial

- **partial_id**: inv-012
- **artifact**: LIB
- **header**: lib/rdlogplay.h
- **source**: lib/rdlogplay.cpp
- **status**: done

---

## 1. Class Identity

| Property | Value |
|----------|-------|
| Class | `RDLogPlay` |
| Inherits | `QObject`, `RDLogEvent` (multiple inheritance) |
| Header | `lib/rdlogplay.h` |
| Source | `lib/rdlogplay.cpp` |
| Role | Radio playout engine — manages real-time playback of a broadcast log |
| Q_OBJECT | Yes |
| Q_PROPERTY | None |
| Q_ENUM | None |

**Purpose**: RDLogPlay is the central playout engine for Rivendell's on-air automation. It takes a broadcast log (an ordered list of audio carts, macros, markers, and chain events) and manages their real-time execution: starting, stopping, pausing, transitioning between events, handling timed starts, and reporting "Now Playing / Next" metadata. Each RDLogPlay instance represents one "log machine" (identified by `play_id`).

---

## 2. Constants

| Constant | Value | Meaning |
|----------|-------|---------|
| `LOGPLAY_MAX_PLAYS` | 7 | Maximum simultaneous audio events (overlapping playout) |
| `TRANSPORT_QUANTITY` | 7 | Size of the transport event array |
| `LOGPLAY_LOOKAHEAD_EVENTS` | 20 | Lookahead window for scheduled events |

---

## 3. Dependencies (includes)

| Dependency | Role |
|------------|------|
| `RDLogEvent` | Base class — ordered collection of log lines (events) |
| `RDPlayDeck` | Audio playout deck — wraps CAE for single-cut playback |
| `RDCae` | Core Audio Engine connection for hardware I/O |
| `RDMacroEvent` | Macro cart execution engine |
| `RDSimplePlayer` | Simplified player used for audition (preview) playback |
| `RDEventPlayer` | RML (Rivendell Macro Language) event executor |
| `RDAirPlayConf` | Airplay configuration (op modes, segue lengths, etc.) |
| `RDLog` | Log metadata (service, modified datetime, link datetime) |
| `RDUnixSocket` | Unix domain socket for PAD (Program Associated Data) updates |
| `RDNotification` | Inter-process notification system (cart/log change events) |

---

## 4. Signals

| Signal | Parameters | Emitted When |
|--------|-----------|--------------|
| `renamed()` | — | Log name changes |
| `reloaded()` | — | Log loaded or refreshed from database |
| `transportChanged()` | — | Any transport state change (play/stop/finish/insert/remove) |
| `inserted(int line)` | line index | Event inserted into the log |
| `removed(int line, int num, bool moving)` | line, count, is-move | Event(s) removed from the log |
| `modified(int line)` | line index | Event metadata changed (cart reloaded, state change) |
| `auditionHeadPlayed(int line)` | line index | Audition preview started from head |
| `auditionTailPlayed(int line)` | line index | Audition preview started from tail |
| `auditionStopped(int line)` | line index | Audition preview stopped |
| `played(int line)` | line index | Event started playing |
| `paused(int line)` | line index | Event paused |
| `stopped(int line)` | line index | Event stopped/finished |
| `position(int line, int point)` | line, ms position | Playback position update |
| `topEventChanged(int line)` | line index | First visible event changed |
| `nextEventChanged(int line)` | line index | "Next" pointer moved |
| `activeEventChanged(int line, RDLogLine::TransType)` | line, transition type | Active (playing) event changed |
| `nextStopChanged(QTime time)` | time | Predicted next stop time changed |
| `postPointChanged(QTime, int, bool, bool)` | time, offset, offset_valid, running | Post point (countdown) changed |
| `runStatusChanged(bool running)` | running flag | Log transitions between running/idle |
| `refreshabilityChanged(bool state)` | refreshable flag | Log became refreshable or not |
| `refreshStatusChanged(bool active)` | active flag | Refresh operation started/completed |
| `channelStarted(int id, int mport, int card, int port)` | machine id, channel, card, port | Audio channel allocated and started |
| `channelStopped(int id, int mport, int card, int port)` | machine id, channel, card, port | Audio channel released |

---

## 5. Slots (private)

| Slot | Triggered By | Behavior |
|------|-------------|----------|
| `transTimerData()` | `play_trans_timer` timeout | Fires hard-timed events: handles grace time logic, starts the next scheduled event in Auto mode |
| `graceTimerData()` | `play_grace_timer` timeout | After grace period expires, starts the pending hard-timed event |
| `playStateChangedData(int id, RDPlayDeck::State)` | `RDPlayDeck::stateChanged` | Dispatches to Playing/Paused/Stopping/Stopped/Finished handlers based on deck state |
| `onairFlagChangedData(bool)` | `rda->ripc()` RIPC signal | Updates the on-air flag (used for traffic logging) |
| `segueStartData(int)` | `RDPlayDeck::segueStart` | Triggers next event start when segue point reached |
| `segueEndData(int)` | `RDPlayDeck::segueEnd` | Handles segue endpoint |
| `talkStartData(int)` | `RDPlayDeck::talkStart` | Notifies talk-start marker reached |
| `talkEndData(int)` | `RDPlayDeck::talkEnd` | Notifies talk-end marker reached |
| `positionData(int, int)` | `RDPlayDeck::position` | Forwards playback position to `position()` signal |
| `macroStartedData()` | `RDMacroEvent::started` | Marks macro as running, emits `played()` |
| `macroFinishedData()` | `RDMacroEvent::finished` | Cleans up after macro, triggers `FinishEvent`, handles pending refresh |
| `macroStoppedData()` | `RDMacroEvent::stopped` | Handles macro interruption |
| `timescalingSupportedData(int, bool)` | `RDCae::timescalingSupported` | Records whether timescaling (tempo change) is available on a card |
| `auditionStartedData()` | `RDSimplePlayer::played` | Emits audition-started signals |
| `auditionStoppedData()` | `RDSimplePlayer::stopped` | Emits audition-stopped signals |
| `notificationReceivedData(RDNotification*)` | RIPC notification | Handles cart-change (reloads affected log lines) and log-change (triggers refresh or sets refreshable flag) |

---

## 6. Key Public Methods

### Log Lifecycle

| Method | Signature | Behavior |
|--------|-----------|----------|
| `setLogName` | `void setLogName(QString name)` | Sets the log name, persists to `RDAirPlayConf`, emits `renamed()` |
| `load` | `void load()` | Removes idle events, loads log from DB via `RDLogEvent::load()`, marks holdovers, refreshes event metadata, resets playback pointers, emits `reloaded()` |
| `append` | `void append(const QString &log_name)` | Appends another log's events to the current log |
| `refresh` | `bool refresh()` | 4-pass merge of DB changes into running log: (1) mark active/finished, (2) purge deleted, (3) add new, (4) remove orphaned finished events. Preserves running playout. Emits `reloaded()` |
| `save` | `void save(int line=-1)` | Persists log state to DB via `RDLogEvent::save()`, updates modified timestamp |
| `clear` | `void clear()` | Removes all events from the log |
| `isRefreshable` | `bool isRefreshable() const` | True if the DB version of the log is newer than the loaded version (different modified datetime, same link datetime) |

### Playback Control

| Method | Signature | Behavior |
|--------|-----------|----------|
| `play` | `bool play(int line, StartSource src, int mport=-1, bool skip_meta=false)` | Starts event at given line. Finds next playable event, starts with Segue or Play transition depending on segue length. Returns false if channels invalid, line invalid, or max simultaneous plays reached |
| `stop` (all) | `bool stop(bool all, int port, int fade)` | Stops running events, optionally filtered by port. Applies fade-out |
| `stop` (line) | `bool stop(int line, int fade)` | Stops specific event by line. Delegates to RDPlayDeck::stop for audio, RDMacroEvent::stop for macros |
| `pause` | `bool pause(int line)` | Pauses audio event at line (audio only, macros cannot be paused) |
| `channelPlay` | `bool channelPlay(int mport)` | Starts playback on a specific channel/port |
| `channelStop` | `bool channelStop(int mport)` | Stops playback on a specific channel/port |

### Log Editing (live)

| Method | Signature | Behavior |
|--------|-----------|----------|
| `insert` (by cart) | `void insert(int line, int cartnum, TransType next, TransType type)` | Inserts a new event by cart number at a given line |
| `insert` (by logline) | `void insert(int line, RDLogLine*, bool update, bool preserve_custom_trans)` | Inserts a pre-built log line at a given position |
| `remove` | `void remove(int line, int num, bool update, bool preserve_custom_trans)` | Removes events from the log |
| `move` | `void move(int from, int to)` | Moves an event within the log |
| `copy` | `void copy(int from, int to, TransType type)` | Copies an event to another position |

### Navigation & State

| Method | Signature | Behavior |
|--------|-----------|----------|
| `makeNext` | `void makeNext(int line, bool refresh_status=true)` | Sets the "next" pointer, sends Now/Next PAD update, recalculates transition timer and post point |
| `nextLine` | `int nextLine() const` | Returns the line index of the next scheduled event |
| `nextEvent` | `RDLogLine* nextEvent()` | Returns the RDLogLine of the next scheduled event |
| `currentLine` | `int currentLine() const` | Returns the line of the currently playing event |
| `runningEvents` | `int runningEvents(int*, bool include_paused)` | Populates array with line indices of all running events, returns count |
| `running` | `bool running(bool include_paused)` | Returns true if any event is currently playing |
| `status` | `RDLogLine::Status status(int line)` | Returns the status of an event at given line |

### Audition (Preview)

| Method | Signature | Behavior |
|--------|-----------|----------|
| `auditionHead` | `void auditionHead(int line)` | Previews event from the start via the cue output (RDSimplePlayer on cue card/port) |
| `auditionTail` | `void auditionTail(int line)` | Previews event from the tail (last N ms, controlled by audition preroll) |
| `auditionStop` | `void auditionStop()` | Stops audition preview |

### Volume & Channel

| Method | Signature | Behavior |
|--------|-----------|----------|
| `duckVolume` | `void duckVolume(int level, int fade, int mport)` | Ducks (attenuates) volume of running events, per-port or all. Stores duck level and applies to all active audio decks on the specified port |
| `setChannels` | `void setChannels(int cards[2], int ports[2], start_rml[2], stop_rml[2])` | Configures 2 output channels (card/port pairs) with start/stop RML macros, requests timescale capability check |

---

## 7. Internal Event Engine

### State Machine (per-event lifecycle)

Events transition through: **Scheduled** -> **Playing** -> **Finishing** -> **Finished** (or **Paused**, **Stopped**)

### Core Internal Methods

| Method | Behavior |
|--------|----------|
| `StartEvent` | Master event dispatcher. Handles transitions for running events (Play=hard stop, Segue=fade). Routes to `StartAudioEvent` for carts, `RDMacroEvent` for macros, skip-through for markers/tracks. Handles Chain events (log switching). Advances next pointer |
| `StartAudioEvent` | Allocates an `RDPlayDeck`, connects its state/position/segue/talk signals, prepares for playback |
| `FinishEvent` | Called when an event finishes naturally. In Auto mode, auto-starts next event with appropriate transition. Emits `stopped()` |
| `CleanupEvent` | Disconnects and frees the `RDPlayDeck` associated with a finished event |
| `Playing` | Handler for deck entering Playing state: updates start times, emits `played()`, advances active event, triggers auto-refresh if available, logs playout to cut record |
| `Paused` | Handler for deck entering Paused state: emits `paused()` |
| `Stopping` | Handler for deck entering Stopping state (fade-out in progress) |
| `Stopped` | Handler for deck fully stopped: cleans up, logs traffic (TrafficStop), handles pending grace timer, advances active event |
| `Finished` | Handler for deck reaching end of audio: cleans up, calls `FinishEvent`, logs traffic (TrafficFinish) |
| `SetTransTimer` | Scans all scheduled events for the next hard-timed event and arms `play_trans_timer` to fire at that time |
| `GetNextChannel` | Alternates between the 2 configured output channels (round-robin) |
| `GetPlayDeck` / `FreePlayDeck` | Pool management for `RDPlayDeck` instances (up to `RD_MAX_STREAMS`) |
| `GetNextPlayable` | Scans forward from a line to find the next event that can actually play (skips invalid/no-cart/no-cut) |
| `RefreshEvents` | Reloads cart metadata for scheduled events in a given range (resolves cut selection, checks availability) |
| `UpdateStartTimes` | Recalculates predicted start times for all events from a given line forward |
| `UpdatePostPoint` | Calculates the "post point" — the predicted end-of-content time used for countdown displays |
| `AdvanceActiveEvent` | Tracks which event is the "active" one for UI highlighting purposes |

---

## 8. Operation Modes

The engine operates in modes defined by `RDAirPlayConf::OpMode`:

| Mode | Behavior |
|------|----------|
| **Auto** | Events auto-chain: when one finishes, the next starts automatically. Hard-timed events fire at their scheduled time. Segue transitions overlap audio |
| **Manual** | Events require explicit user action to start. Transitions between running events are not auto-managed |

In Auto mode:
- `transTimerData` fires at hard-start times and triggers next event
- `graceTimerData` implements grace periods (delay before hard-start triggers)
- Grace time of -1 means "make next but don't auto-start" (user gets visual cue)
- Grace time of 0 means "start immediately at scheduled time"
- Grace time > 0 means "wait N ms after scheduled time, then start"

---

## 9. PAD (Program Associated Data) / Now & Next

`SendNowNext()` sends JSON over a Unix domain socket (`RD_PAD_SOURCE_UNIX_ADDRESS`) to the `rdpadd` daemon. The JSON includes:
- **dateTime**, **hostName**, **shortHostName**, **machine** (log machine ID)
- **onairFlag**, **mode** (Auto/Manual)
- **service** block: name, description, programCode
- **log** block: log name
- **now** block: currently playing event with full cart/cut metadata
- **next** block: next scheduled event

The "now" event is determined by a **hybrid algorithm**:
1. Use the most recently started event if it is a Now&Next-enabled macro cart
2. Otherwise, use the longest-running event

Now/Next is also configurable via `setNowCart` / `setNextCart` for default/fallback carts.

---

## 10. SQL / Database Interaction

### ELR_LINES (Electronic Log Reconciliation)

`LogTraffic()` inserts a row into `ELR_LINES` for every play/stop/finish event. Fields recorded:

| Column | Content |
|--------|---------|
| SERVICE_NAME | Active service name |
| LENGTH | Actual play duration (ms) |
| LOG_NAME | Log name |
| LOG_ID | Event ID within the log |
| CART_NUMBER | Cart number played |
| STATION_NAME | Station name |
| EVENT_DATETIME | Actual start datetime |
| EVENT_TYPE | Traffic action (start/stop/finish/macro) |
| EVENT_SOURCE | Source of the event |
| EXT_START_TIME, EXT_LENGTH, EXT_DATA, EXT_EVENT_ID, EXT_ANNC_TYPE | External scheduling data |
| PLAY_SOURCE | Which log machine (1-based) |
| CUT_NUMBER | Cut number within the cart |
| EXT_CART_NAME | External cart name |
| TITLE, ARTIST, ALBUM, LABEL | Metadata |
| SCHEDULED_TIME | Originally scheduled time |
| ISRC, PUBLISHER, COMPOSER, CONDUCTOR, SONG_ID | Music metadata |
| USAGE_CODE | Usage code for reporting |
| START_SOURCE | How the event was started (time/manual/etc.) |
| ONAIR_FLAG | Whether station was on-air |
| USER_DEFINED | User-defined field |
| DESCRIPTION, OUTCUE, ISCI | Additional metadata |

### Other DB Access

- `LogPlayEvent()` calls `RDCut::logPlayout()` to increment the cut's play counter
- `save()` delegates to `RDLogEvent::save()` for persisting log state
- `load()` delegates to `RDLogEvent::load()` for loading from LOGS/LOG_LINES tables
- `refresh()` creates a temporary `RDLogEvent` to load the current DB state for merging

---

## 11. Linux-Specific / Platform Details

| Aspect | Detail |
|--------|--------|
| PAD socket | Abstract Unix domain socket (`RD_PAD_SOURCE_UNIX_ADDRESS`) via `RDUnixSocket` |
| Syslog | Logs playout events via `rda->syslog()` at LOG_INFO/LOG_WARNING/LOG_DEBUG levels |
| CAE | Connects to Core Audio Engine daemon for hardware audio I/O |
| RIPC | Connects to Rivendell Inter-Process Communication daemon for notifications and RML dispatch |
| Audition | Only available if `cueCard >= 0` and `cuePort >= 0` and application is not running in TTY mode (`qApp->type() != QApplication::Tty`) |
| Timescaling | Requested per-card; availability depends on hardware/CAE support |

---

## 12. Key State Variables

| Variable | Type | Role |
|----------|------|------|
| `play_id` | int | Log machine identifier (0-based) |
| `play_op_mode` | RDAirPlayConf::OpMode | Current operation mode (Auto/Manual) |
| `play_next_line` | int | Line index of the "next" event to play |
| `play_line_counter` | int | Tracks current position for sequential playback |
| `play_active_line` | int | Currently active (highlighted) event line |
| `play_active_trans` | RDLogLine::TransType | Transition type of the active event |
| `play_running` | bool | Whether any event is currently playing |
| `play_start_next` | bool | Flag for auto-starting next event |
| `play_segue_length` | int | Default segue overlap duration (ms) |
| `play_trans_length` | int | Default transition length (ms) |
| `play_card[2]` / `play_port[2]` | int | Two configured output channel card/port pairs |
| `play_start_rml[2]` / `play_stop_rml[2]` | QString | RML macros executed on channel start/stop |
| `play_onair_flag` | bool | On-air status from RIPC |
| `play_refreshable` | bool | Whether the log has a newer version available in DB |
| `play_duck_volume_port1/2` | int | Current duck (attenuation) level per port |
| `play_now_cartnum` / `play_next_cartnum` | unsigned | Default/override cart numbers for Now/Next display |
| `play_audition_preroll` | int | Milliseconds of audio to play for tail audition |
| `play_deck[RD_MAX_STREAMS]` | RDPlayDeck* | Pool of audio playout decks |
| `play_deck_active[RD_MAX_STREAMS]` | bool | Which decks are currently in use |
| `next_channel` | int | Round-robin channel alternator (0 or 1) |
| `play_log` | RDLog* | Cached log metadata for refresh tracking |
| `play_link_datetime` / `play_modified_datetime` | QDateTime | Timestamps for refresh detection |
