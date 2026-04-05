# inv-006 | RDStation

- **Class:** `RDStation`
- **Files:** `lib/rdstation.h`, `lib/rdstation.cpp`
- **Role:** Active Record model representing a Rivendell workstation/host. Each station is a named host in the radio automation system with its own audio hardware configuration, application settings, and codec capabilities.
- **Inherits:** none (plain C++ class, no QObject)
- **Signals/Slots:** none
- **Pattern:** Active Record -- every getter reads directly from the DB (`RDGetSqlValue`), every setter writes directly via `SetRow` helper. No in-memory cache except `station_name` and `time_offset`.

## Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `AudioDriver` | `None=0`, `Hpi=1`, `Jack=2`, `Alsa=3` | Identifies the audio driver type for a sound card slot |
| `Capability` | `HaveOggenc=0`, `HaveOgg123=1`, `HaveFlac=2`, `HaveLame=3`, `HaveMpg321=4`, `HaveTwoLame=5`, `HaveMp4Decode=6` | Codec/tool availability flags per station (oggenc, FLAC, LAME, TwoLAME, mpg321, MP4 decode) |
| `FilterMode` | `FilterSynchronous=0`, `FilterAsynchronous=1` | Audio filter processing mode |

## Construction & Identity

- Constructor takes `(const QString &name, bool create=false)`. Stores `station_name` as the persistent identity key (maps to `STATIONS.NAME` in DB).
- `exists()` -- checks if a row exists in `STATIONS` table for this name.
- `name()` -- returns the stored station name (the only truly cached field).

## Property Accessors (getter/setter pairs)

All follow the same Active Record pattern: getter calls `RDGetSqlValue("STATIONS","NAME",station_name,COLUMN)`, setter calls `SetRow(COLUMN, value)`.

| Property | Type | DB Column | Description |
|----------|------|-----------|-------------|
| `shortName` | QString | `SHORT_NAME` | Abbreviated display name |
| `description` | QString | `DESCRIPTION` | Human-readable station description |
| `userName` | QString | `USER_NAME` | Default user associated with this station |
| `defaultName` | QString | `DEFAULT_NAME` | Default service/log name |
| `address` | QHostAddress | `IPV4_ADDRESS` | IPv4 address of the station |
| `httpStation` | QString | `HTTP_STATION` | HTTP service station name |
| `caeStation` | QString | `CAE_STATION` | Core Audio Engine host |
| `timeOffset` | int | `TIME_OFFSET` | Time offset in ms (cached after first read) |
| `heartbeatCart` | unsigned | `HEARTBEAT_CART` | Cart number played as heartbeat signal |
| `heartbeatInterval` | unsigned | `HEARTBEAT_INTERVAL` | Interval (ms) between heartbeats |
| `startupCart` | unsigned | `STARTUP_CART` | Cart played on station startup |
| `editorPath` | QString | `EDITOR_PATH` | Path to external audio editor |
| `reportEditorPath` | QString | `REPORT_EDITOR_PATH` | Path to external report editor |
| `browserPath` | QString | `BROWSER_PATH` | Path to external web browser |
| `sshIdentityFile` | QString | `SSH_IDENTITY_FILE` | SSH key file for remote operations |
| `filterMode` | FilterMode | `FILTER_MODE` | Synchronous vs asynchronous filtering |
| `startJack` | bool | `START_JACK` | Whether to auto-start JACK audio server |
| `jackServerName` | QString | `JACK_SERVER_NAME` | JACK server instance name |
| `jackCommandLine` | QString | `JACK_COMMAND_LINE` | JACK startup command |
| `jackPorts` | int | -- | Number of JACK ports (via AUDIO_PORTS table) |
| `cueCard` | int | `CUE_CARD` | Card number for cue output |
| `cuePort` | int | `CUE_PORT` | Port number for cue output |
| `cueStartCart` | unsigned | `CUE_START_CART` | Cart to play when cue starts |
| `cueStopCart` | unsigned | `CUE_STOP_CART` | Cart to play when cue stops |
| `cartSlotColumns` | int | `CARTSLOT_COLUMNS` | Cart slot grid column count |
| `cartSlotRows` | int | `CARTSLOT_ROWS` | Cart slot grid row count |
| `enableDragdrop` | bool | `ENABLE_DRAGDROP` | Whether drag-and-drop is enabled |
| `enforcePanelSetup` | bool | `ENFORCE_PANEL_SETUP` | Whether panel layout is locked |
| `systemMaint` | bool | `SYSTEM_MAINT` | Whether station participates in system maintenance tasks |
| `scanned` | bool | `SCANNED` | Whether station's hardware has been scanned |

## Capability Checking

- `haveCapability(Capability cap)` -- reads a per-capability boolean column from `STATIONS` (e.g. `HAVE_OGGENC`, `HAVE_LAME`, `HAVE_FLAC`, `HAVE_TWOLAME`, `HAVE_MPG321`, `HAVE_OGG123`, `HAVE_MP4_DECODE`).
- `setHaveCapability(Capability cap, bool state)` -- writes the corresponding column.

## Audio Card Management

- `cards()` -- counts non-None audio cards by querying `AUDIO_CARDS` where `STATION_NAME` matches.
- `cardDriver(int cardnum)` / `setCardDriver(int cardnum, AudioDriver driver)` -- reads/writes the audio driver for a specific card slot from `AUDIO_CARDS`.
- `driverVersion(int cardnum)` / `setDriverVersion(...)` -- firmware/driver version string per card.
- `cardName(int cardnum)` / `setCardName(...)` -- human-readable card name.
- `cardInputs(int cardnum)` / `setCardInputs(...)` -- number of input channels per card.
- `cardOutputs(int cardnum)` / `setCardOutputs(...)` -- number of output channels per card.

## Lifecycle (static-like operations)

### create(name, err_msg, exemplar, hostaddr)
Provisions a complete new station in the database. Creates rows in **all** dependent tables:
- `AUDIO_CARDS` (RD_MAX_CARDS slots)
- `AUDIO_INPUTS` / `AUDIO_OUTPUTS` (RD_MAX_CARDS x RD_MAX_PORTS)
- `STATIONS` (main record)
- `RDAIRPLAY` / `RDAIRPLAY_CHANNELS` (airplay config)
- `RDPANEL` / `RDPANEL_CHANNELS` (panel config)
- `RDLOGEDIT` (log editor config)
- `RDLIBRARY` (library config)
- `LOG_MACHINES` (log playout machines)
- `LOG_MODES` (log modes)
- `DECKS` (record/play decks)
- `JACK_CLIENTS` (JACK connections)
- `CARTSLOTS` (cart slot grid)
- `SWITCHER_NODES` (GPIO/switcher nodes)
- `HOSTVARS` (host variables)
- `GPIS` / `GPOS` (general purpose I/O)
- `SERVICE_PERMS` (service access permissions)
- `REPORT_STATIONS` (report associations)

If `exemplar` is provided, copies settings from an existing station; otherwise creates blank defaults.

### remove(name)
Cascade-deletes station data from all dependent tables (same set as `create` plus `DECK_EVENTS`, `TTYS`, `RECORDINGS`, `MATRICES`, `INPUTS`, `OUTPUTS`, `VGUEST_RESOURCES`, `PANELS`, `EXTENDED_PANELS`, `RDHOTKEYS`, `PYPAD_INSTANCES`).

## DB Tables Touched

| Table | Relation | Key Column |
|-------|----------|------------|
| `STATIONS` | Primary -- one row per station | `NAME` |
| `AUDIO_CARDS` | 1:N (up to RD_MAX_CARDS per station) | `STATION_NAME` |
| `AUDIO_INPUTS` | 1:N (cards x ports) | `STATION_NAME` |
| `AUDIO_OUTPUTS` | 1:N (cards x ports) | `STATION_NAME` |
| `DECKS` | 1:N | `STATION_NAME` |
| `DECK_EVENTS` | 1:N | `STATION_NAME` |
| `TTYS` | 1:N (serial ports) | `STATION_NAME` |
| `RECORDINGS` | 1:N | `STATION_NAME` |
| `RDAIRPLAY` | 1:1 per station | `STATION` |
| `RDAIRPLAY_CHANNELS` | 1:N | `STATION_NAME` |
| `RDPANEL` | 1:1 per station | `STATION` |
| `RDPANEL_CHANNELS` | 1:N | `STATION_NAME` |
| `RDLOGEDIT` | 1:1 per station | `STATION` |
| `RDLIBRARY` | 1:1 per station | `STATION` |
| `LOG_MACHINES` | 1:N | `STATION_NAME` |
| `LOG_MODES` | 1:N | `STATION_NAME` |
| `JACK_CLIENTS` | 1:N | `STATION_NAME` |
| `CARTSLOTS` | 1:N | `STATION_NAME` |
| `SWITCHER_NODES` | 1:N | `STATION_NAME` |
| `HOSTVARS` | 1:N | `STATION_NAME` |
| `GPIS` | 1:N | `STATION_NAME` |
| `MATRICES` | 1:N | `STATION_NAME` |
| `INPUTS` | 1:N | `STATION_NAME` |
| `OUTPUTS` | 1:N | `STATION_NAME` |
| `VGUEST_RESOURCES` | 1:N | `STATION_NAME` |
| `SERVICE_PERMS` | 1:N | `STATION_NAME` |
| `REPORT_STATIONS` | 1:N | `STATION_NAME` |
| `PANELS` | 1:N (station panels) | `OWNER` |
| `EXTENDED_PANELS` | 1:N | `OWNER` |
| `RDHOTKEYS` | 1:N | `STATION_NAME` |
| `PYPAD_INSTANCES` | 1:N | `STATION_NAME` |

## Private Helpers

- `SetRow(param, value)` -- 4 overloads (QString, int, unsigned, bool). Updates a single column in `STATIONS` table for the current station name.

## Derived Addresses

- `httpAddress()` -- resolves the HTTP service address: if `httpStation` is set, looks up that station's address; otherwise returns own address.
- `caeAddress()` -- resolves the CAE service address: if `caeStation` is set, looks up that station's address; otherwise returns own address.
- `webServiceUrl(hostname, port, user, passwd)` -- constructs a URL string for the Rivendell web API endpoint.

## Fields (in-memory state)

| Field | Type | Purpose |
|-------|------|---------|
| `station_name` | QString | Station identity key -- used in all DB queries |
| `time_offset` | int | Cached time offset value |
| `time_offset_valid` | bool | Whether `time_offset` cache has been populated |
