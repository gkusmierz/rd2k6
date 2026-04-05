# RDCatchConnect — Inventory Partial

- **partial_id:** inv-014
- **artifact:** LIB
- **phase:** 2-inventory
- **status:** done
- **files:** lib/rdcatch_connect.h, lib/rdcatch_connect.cpp

---

## Class Overview

| Field | Value |
|-------|-------|
| Class | `RDCatchConnect` |
| Inherits | `QObject` |
| Role | TCP client for the Rivendell Catch (Netcatcher) Daemon — sends commands and receives asynchronous status/event responses |
| Pattern | Command-response over TCP with text-based protocol; heartbeat watchdog |

## Purpose

RDCatchConnect provides a client-side connection to the `rdcatchd` daemon. It sends text-based commands over a TCP socket and parses incoming responses, translating them into Qt signals. Each instance is identified by a serial number, enabling multiplexed connections (e.g., one per host in `rdcatch`).

## Constructor

| Parameter | Type | Description |
|-----------|------|-------------|
| `serial` | `int` | Unique serial number identifying this connection instance |
| `parent` | `QObject*` | Qt parent (default 0) |

On construction:
- Initializes all deck statuses and monitor states
- Creates QTcpSocket and connects its `connected`/`readyRead` signals to internal slots
- Creates a heartbeat watchdog timer (interval: 15 seconds, single-shot) — emits `heartbeatFailed` if no heartbeat received before timeout

## Public Methods

| Method | Description |
|--------|-------------|
| `connectHost(hostname, port, password)` | Initiates TCP connection to the catch daemon at the given host/port; stores password for authentication |
| `status(chan)` | Returns the current `RDDeck::Status` for a given channel — channels 1..MAX_DECKS are record decks, channels 129+ are play decks |
| `currentId(chan)` | Returns the current event ID for a given channel (same record/play deck mapping as `status`) |
| `enableMetering(state)` | Enables or disables meter level reporting from the daemon |
| `reloadHeartbeat()` | Requests the daemon to reload its heartbeat configuration |
| `reloadDropboxes()` | Requests the daemon to reload dropbox configurations |

## Public Slots

| Slot | Command Sent | Description |
|------|-------------|-------------|
| `reset()` | `RS!` | Requests the daemon to reset |
| `reload()` | `RD!` | Requests the daemon to reload its event schedule |
| `refresh()` | `RE 0!` | Requests a full channel status refresh (channel 0 = all) |
| `reloadOffset()` | `RO!` | Requests the daemon to reload time offset configuration |
| `stop(deck)` | `SR <deck>!` | Stops recording/playback on the specified deck |
| `monitor(deck, state)` | `MN <deck> <state>!` | Sets monitor state for a deck (on/off) |
| `toggleMonitor(deck)` | `MN <deck> 0/1!` | Toggles the monitor state for a deck based on cached local state |
| `setExitCode(id, code, msg)` | `SC <id> <code> <msg>!` | Sets the exit code and message for a completed recording event |

## Signals

| Signal | Emitted When |
|--------|-------------|
| `connected(serial, state)` | Authentication response received — `state=true` if password accepted, `false` if rejected |
| `statusChanged(serial, channel, status, id, cutname)` | A deck's status or current event ID changes (record or play deck) |
| `monitorChanged(serial, channel, state)` | Monitor state changes on a deck |
| `meterLevel(serial, deck, chan, level)` | Meter level data received from the daemon |
| `eventUpdated(id)` | An event has been updated in the daemon's schedule |
| `eventPurged(id)` | An event has been purged from the daemon's schedule |
| `deckEventSent(serial, chan, number)` | A deck event notification received from the daemon |
| `heartbeatFailed(id)` | Heartbeat watchdog expired — daemon may be unreachable |

## Protocol Details

**Wire format:** Space-delimited text commands terminated by `!`. Example: `PW mypassword!`, `RE 0!`, `MN 1 1!`.

**Connection sequence:**
1. Client calls `connectHost()` which opens TCP connection
2. On TCP connect, client automatically sends password: `PW <password>!`
3. Daemon responds with `PW +` (accepted) or `PW -` (rejected)
4. On successful auth, client automatically requests a full status refresh (`RE 0!`)

**Incoming command dispatch:**

| Command | Meaning | Signal Emitted |
|---------|---------|----------------|
| `PW` | Auth response (+ or -) | `connected` |
| `RE` | Channel status (chan, status, id, cutname) | `statusChanged` |
| `RM` | Meter level (deck, channel, level) | `meterLevel` |
| `RU` | Event updated (id) | `eventUpdated` |
| `PE` | Event purged (id) | `eventPurged` |
| `DE` | Deck event (deck, number) | `deckEventSent` |
| `HB` | Heartbeat — resets the watchdog timer | (none, resets timer) |
| `MN` | Monitor state (deck, state) | `monitorChanged` |

**Heartbeat:** Timer fires every 15 seconds (single-shot, restarted on each `HB` receipt). If no heartbeat arrives within the interval, `heartbeatFailed` is emitted once.

## Channel Addressing

- Channels 1 through MAX_DECKS: **record decks** (stored at index `chan-1`)
- Channels 129 through 128+MAX_DECKS: **play decks** (stored at index `chan-129` for IDs, `chan-128` for status)
- Channel 0: broadcast/all channels (used in refresh requests)

## State Tracking

The class caches per-deck state locally:
- `cc_record_deck_status[]` / `cc_play_deck_status[]` — current RDDeck::Status per deck
- `cc_record_id[]` / `cc_play_id[]` — current event ID per deck
- `cc_monitor_state[]` — current monitor on/off per deck

Status change signals are only emitted when the new status differs from cached state (deduplication).

## Constants

| Constant | Value | Meaning |
|----------|-------|---------|
| `CC_MAX_ARGS` | 10 | Maximum number of arguments in a protocol message |
| `CC_MAX_LENGTH` | 256 | Maximum character length of a single argument |
| `CC_HEARTBEAT_INTERVAL` | 15000 | Heartbeat timeout in milliseconds (15 seconds) |

## Dependencies

| Dependency | Usage |
|------------|-------|
| `QObject` | Base class |
| `QTcpSocket` | TCP communication with daemon |
| `QTimer` | Heartbeat watchdog |
| `RDDeck::Status` | Enumeration for deck status values |
| `RDRecording::ExitCode` | Enumeration for recording exit codes |
| `rd.h` | MAX_DECKS constant |

## Consumers

- **rdcatch** — `CatchConnector` wraps an `RDCatchConnect` per host; main catch GUI uses it to monitor all hosts
- **rdcatchd** — the daemon itself creates an instance (likely for local loopback control)
- **rdadmin/EditStation** — uses it for station configuration testing
- **sas_filter** — SAS automation importer uses it for catch operations

## SQL

No direct SQL queries. All data comes from the daemon via TCP protocol.

## Linux-specific

No Linux-specific APIs used. Communication is purely through Qt's cross-platform `QTcpSocket`.
