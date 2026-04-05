---
partial_id: "010"
artifact: LIB
class: RDCae
files: [lib/rdcae.h, lib/rdcae.cpp]
status: done
---

# RDCae — Core Audio Engine IPC Client

## Purpose

RDCae is the client-side proxy for Rivendell's Core Audio Engine daemon (`caed`). It provides the sole interface through which application-level code controls audio playback, recording, metering, and hardware configuration. All commands are sent as text-based messages over a TCP socket to the `caed` daemon on port 5005; responses are parsed and re-emitted as Qt signals.

## Inheritance

- **Base class:** `QObject`
- **Q_OBJECT:** yes

## Enums

| Enum | Values | Semantics |
|------|--------|-----------|
| `ClockSource` | InternalClock(0), AesEbuClock(1), SpDiffClock(2), WordClock(4) | Audio clock synchronization source for a sound card |
| `ChannelMode` | Normal(0), Swap(1), LeftOnly(2), RightOnly(3) | Stereo channel routing mode for input/output |
| `SourceType` | Analog(0), AesEbu(1) | Physical input connector type |
| `AudioCoding` | Pcm16(0), MpegL1(1), MpegL2(2), MpegL3(3), Pcm24(4) | Audio encoding format for recording |

## Constructor

```
RDCae(RDStation *station, RDConfig *config, QObject *parent = 0)
```

- Requires an `RDStation` (provides CAE address) and `RDConfig` (provides password, meter port config).
- Creates a non-blocking TCP socket (`Q3SocketDevice::Stream`) for commands.
- Creates a non-blocking UDP socket (`Q3SocketDevice::Datagram`) for meter data, auto-binding to a port in the configured meter port range (max 999 ports).
- Initializes all cards/streams/ports arrays to default (levels to -10000, handles to -1, positions to 0, statuses to false).
- Starts a periodic timer at `RD_METER_UPDATE_INTERVAL` (20 ms) that fires `clockData()`.

## Signals

| Signal | Parameters | Emitted When |
|--------|------------|-------------|
| `isConnected(bool state)` | true = authenticated, false = auth failed | Password response received from daemon |
| `playLoaded(int handle)` | handle identifier | (declared but not emitted in this class -- likely reserved) |
| `playPositioned(int handle, unsigned pos)` | handle, position in samples | Daemon confirms position seek |
| `playing(int handle)` | handle | Daemon confirms playback started |
| `playStopped(int handle)` | handle | Daemon confirms playback stopped |
| `playUnloaded(int handle)` | handle | Daemon confirms stream unloaded; clears internal handle/port state |
| `recordLoaded(int card, int stream)` | card, stream | Daemon confirms record stream loaded |
| `recording(int card, int stream)` | card, stream | Daemon confirms recording started |
| `recordStopped(int card, int stream)` | card, stream | Daemon confirms recording stopped |
| `recordUnloaded(int card, int stream, unsigned msecs)` | card, stream, duration in ms | Daemon confirms record unloaded (returns recorded length) |
| `gpiInputChanged(int line, bool state)` | GPIO line, state | (declared but not emitted in this class) |
| `connected(bool state)` | connection state | (declared but not emitted in this class) |
| `inputStatusChanged(int card, int stream, bool state)` | card, port, active flag | Input status update from daemon (0=active, 1=inactive) |
| `playPositionChanged(int handle, unsigned sample)` | handle, sample position | Position changed (emitted from clockData timer AND from PP dispatch) |
| `timescalingSupported(int card, bool state)` | card, supported flag | Daemon reports whether card supports timescaling |

## Private Slots

| Slot | Purpose |
|------|---------|
| `readyData()` | Polls TCP socket for incoming data, dispatches all complete commands; also processes delayed commands from loadPlay synchronization |
| `readyData(int *stream, int *handle, QString name)` | Overloaded variant used during synchronous loadPlay -- captures LP response matching requested filename, delays all other commands |
| `clockData()` | Timer-driven (20ms); compares cached positions to last-emitted positions and emits `playPositionChanged` for any changes |

## Public Methods -- Playback

| Method | Daemon Command | Behavior |
|--------|---------------|----------|
| `connectHost()` | `PW <password>!` then `TS <card>!` + `IS <card> <port>!` for all cards/ports | Connects to daemon with retry (up to 10 attempts, 100ms apart). After connection, authenticates and queries timescale support and input status for every card/port |
| `enableMetering(QList<int> *cards)` | `ME <udp_port> <card1> <card2>...!` | Tells daemon to send meter UDP data to this client's bound port for the specified unique card numbers |
| `loadPlay(int card, QString name, int *stream, int *handle) -> bool` | `LP <card> <name>!` | **Synchronous call**: sends load command then busy-waits polling readyData until daemon returns stream/handle. Returns false if daemon returns stream=-1 (file not found etc.) |
| `unloadPlay(int handle)` | `UP <handle>!` | Release a play stream |
| `positionPlay(int handle, int pos)` | `PP <handle> <pos>!` | Seek to position (ignored if pos < 0) |
| `play(int handle, unsigned length, int speed, bool pitch)` | `PY <handle> <length> <speed> <pitch_0_or_1>!` | Start playback with given length, speed, and pitch-preservation flag |
| `stopPlay(int handle)` | `SP <handle>!` | Stop playback |
| `playPosition(int handle) -> unsigned` | (local lookup) | Returns cached position for the given handle by scanning card/stream arrays |
| `requestTimescale(int card)` | `TS <card>!` | Query daemon whether card supports timescaling |
| `playPortActive(int card, int port, int except_stream) -> bool` | (local lookup) | Returns true if any stream (except `except_stream`) is marked active on the given card/port |
| `setPlayPortActive(int card, int port, int stream)` | (local state) | Marks a stream as active on a port (flag set in `cae_output_status_flags`) |

## Public Methods -- Recording

| Method | Daemon Command | Behavior |
|--------|---------------|----------|
| `loadRecord(int card, int stream, QString name, AudioCoding coding, int chan, int samp_rate, int bit_rate)` | `LR <card> <stream> <coding> <chan> <samp_rate> <bit_rate> <name>!` | Load a record stream with given encoding parameters |
| `unloadRecord(int card, int stream)` | `UR <card> <stream>!` | Release a record stream |
| `record(int card, int stream, unsigned length, int threshold)` | `RD <card> <stream> <length> <threshold>!` | Start recording with max length and VOX threshold |
| `stopRecord(int card, int stream)` | `SR <card> <stream>!` | Stop recording |

## Public Methods -- Hardware Configuration

| Method | Daemon Command | Behavior |
|--------|---------------|----------|
| `setClockSource(int card, ClockSource src)` | `CS <card> <src>!` | Set audio clock source for a card |
| `setInputVolume(int card, int stream, int level)` | `IV <card> <stream> <level>!` | Set input volume |
| `setOutputVolume(int card, int stream, int port, int level)` | `OV <card> <stream> <port> <level>!` | Set output volume |
| `fadeOutputVolume(int card, int stream, int port, int level, int length)` | `FV <card> <stream> <port> <level> <length>!` | Fade output volume over time |
| `setInputLevel(int card, int port, int level)` | `IL <card> <port> <level>!` | Set input level on port |
| `setOutputLevel(int card, int port, int level)` | `OL <card> <port> <level>!` | Set output level on port |
| `setInputMode(int card, int stream, ChannelMode mode)` | `IM <card> <stream> <mode>!` | Set channel mode on input |
| `setOutputMode(int card, int stream, ChannelMode mode)` | `OM <card> <stream> <mode>!` | Set channel mode on output |
| `setInputVOXLevel(int card, int stream, int level)` | `IX <card> <stream> <level>!` | Set VOX trigger level on input |
| `setInputType(int card, int port, SourceType type)` | `IT <card> <port> <type>!` | Set physical input type (Analog/AesEbu) |
| `setPassthroughVolume(int card, int in_port, int out_port, int level)` | `AL <card> <in_port> <out_port> <level>!` | Set audio passthrough volume between ports |

## Public Methods -- Metering

| Method | Behavior |
|--------|----------|
| `inputMeterUpdate(int card, int port, short levels[2])` | Reads UDP meter data, returns cached L/R input levels |
| `outputMeterUpdate(int card, int port, short levels[2])` | Reads UDP meter data, returns cached L/R output levels |
| `outputStreamMeterUpdate(int card, int stream, short levels[2])` | Reads UDP meter data, returns cached L/R stream output levels |

## IPC Protocol

### Command Transport
- **TCP socket** on port `CAED_TCP_PORT` (5005) for commands/responses.
- **UDP socket** on auto-bound port from configurable range for meter data.
- Commands are `!`-terminated text strings with space-separated arguments.
- Responses follow same format; parsed character-by-character in `readyData()`.

### Command Codes (client -> daemon)
`PW` (password), `LP` (load play), `UP` (unload play), `PP` (position play), `PY` (play), `SP` (stop play), `LR` (load record), `UR` (unload record), `RD` (record), `SR` (stop record), `CS` (clock source), `IV` (input volume), `OV` (output volume), `FV` (fade volume), `IL` (input level), `OL` (output level), `IM` (input mode), `OM` (output mode), `IX` (input VOX), `IT` (input type), `AL` (passthrough level), `ME` (enable metering), `TS` (timescale query), `IS` (input status query)

### Response Dispatch
Responses use the same command codes. Success indicated by `+` character in a status argument; failure by `-`. The `DispatchCommand` method routes each response to the appropriate signal emission.

### Meter UDP Messages
- `ML I <card> <port> <left> <right>` -- input meter levels
- `ML O <card> <port> <left> <right>` -- output meter levels
- `MO <card> <stream> <left> <right>` -- stream output meter levels
- `MP <card> <stream> <position>` -- play position updates

## Internal State Arrays (dimensioned by system constants)

| Array | Dimensions | Tracks |
|-------|-----------|--------|
| `input_status` | [RD_MAX_CARDS=24][RD_MAX_PORTS=24] | Per-port input active/inactive |
| `cae_handle` | [24][RD_MAX_STREAMS=48] | Handle ID per card/stream (-1 = unused) |
| `cae_pos` | [24][48] | Last-emitted position per card/stream |
| `cae_output_positions` | [24][48] | Current position from meter UDP |
| `cae_input_levels` | [24][24][2] | L/R input meter levels |
| `cae_output_levels` | [24][24][2] | L/R output meter levels |
| `cae_stream_output_levels` | [24][24][2] | L/R per-stream output levels |
| `cae_output_status_flags` | [24][24][48] | Which streams are active on which ports |
| `delayed_cmds` | vector<RDCmdCache> | Commands received during synchronous loadPlay, dispatched later |

## SQL Queries

None. This class communicates exclusively via IPC socket protocol to `caed`.

## Linux-Specific

- Uses `usleep()` for busy-wait delays during connection and synchronous loadPlay.
- Uses POSIX `syslog.h` constants (LOG_ERR) via `rda->syslog()`.
- Uses `Q3SocketDevice` (Qt3 compatibility) for both TCP stream and UDP datagram sockets.
- `isgraph()` from `<ctype.h>` for protocol character filtering.

## Dependencies

| Dependency | Role |
|-----------|------|
| `RDStation` | Provides CAE daemon network address |
| `RDConfig` | Provides authentication password, meter port range |
| `RDCmdCache` | Buffer for parsed command arguments |
| `RDApplication` (via `rda`) | Syslog access |

## Key Behavioral Notes

1. **loadPlay is synchronous-blocking**: it busy-waits with `usleep(1000)` polling for the daemon response, logging a warning if latency exceeds 1 second.
2. **Delayed command queue**: during loadPlay's busy-wait, all non-LP responses are queued in `delayed_cmds` and dispatched on the next normal `readyData()` call.
3. **Position change detection**: `clockData()` runs every 20ms comparing UDP-received positions with last-emitted values -- only emits `playPositionChanged` when the value actually changes.
4. **Unload clears port flags**: when a play stream is unloaded, all `cae_output_status_flags` for that stream across all ports are cleared.
5. **Authentication on connect**: the first thing sent after TCP connect is the password; daemon responds with PW +/- triggering `isConnected`.
