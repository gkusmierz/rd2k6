# inv-016 — RDRenderer

## Class: RDRenderer
- **Header:** `lib/rdrenderer.h`
- **Source:** `lib/rdrenderer.cpp`
- **Inherits:** `QObject`
- **Role:** Renders a Rivendell log (sequence of audio events) into a single audio file or imports the result into an existing cart/cut in the audio store.

### Purpose
RDRenderer takes an `RDLogEvent` (a loaded log with ordered lines of carts, markers, macros, etc.), walks through it sequentially, mixes overlapping audio (segue transitions with gain ramps), and produces one continuous audio output. It supports two output modes: render to a file on disk, or render and import directly into the Rivendell cart/cut audio store.

### Signals
| Signal | Parameters | Emitted when |
|--------|-----------|--------------|
| `progressMessageSent` | `const QString &msg` | A human-readable progress/status message is generated (pass info, line details, warnings) |
| `lineStarted` | `int lineno, int totallines` | Processing advances to a new log line; used for progress tracking |

### Slots
| Slot | Parameters | Behavior |
|------|-----------|----------|
| `abort()` | none | Sets abort flag; the render loop checks this flag on each iteration and stops gracefully if set |

### Key Public Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `renderToFile(outfile, log, settings, start_time, ignore_stops, err_msg, first_line, last_line, first_time, last_time)` | `bool` | Renders log to a WAV file on disk. If the target format is not raw PCM16/PCM24 or normalization is needed, performs a 2-pass render (render to temp WAV, then convert). Otherwise single-pass direct render. |
| `renderToCart(cartnum, cutnum, log, settings, start_time, ignore_stops, err_msg, first_line, last_line, first_time, last_time)` | `bool` | Renders log to a temporary WAV file, then imports the result into the specified cart/cut in the audio store. Always 2-pass. Validates cart/cut existence first. Checks that rendered duration will not overflow 32-bit BWF structures. |
| `warnings()` | `QStringList` | Returns accumulated warning messages from the most recent render (e.g., missing audio, STOP events encountered). |

### Rendering Behavior (private `Render` method)
- Opens an output WAV file via libsndfile (PCM16 or PCM24, system sample rate).
- Converts each `RDLogLine` from the log into an `__RDRenderLogLine` wrapper.
- Optionally converts STOP transitions to PLAY if `ignore_stops` is true.
- Supports filtering by line range (`first_line`/`last_line`) and by hard-time markers (`first_time`/`last_time`).
- For each line in range:
  - If STOP transition: logs warning and halts rendering.
  - If Cart type with available audio: opens the audio, calculates frame count based on transition type (segue start point for segues, end point otherwise), mixes all currently-playing previous lines via `Sum()`, writes PCM frames.
  - If audio unavailable for a Cart: logs "NO AUDIO AVAILABLE" warning.
  - Non-audio events (markers, macros, chains, track markers, links): skipped with progress message.
- Advances a virtual clock (`current_time`) by the duration of each rendered segment.
- Supports abort: checks `render_abort` flag on each iteration.

### Audio Mixing (`Sum` method)
- Reads PCM float frames from a still-open audio handle.
- Applies a gain ramp using exponential scaling: `ratio = 10^((i * rampRate + rampLevel) / 2000)`.
- Adds (sums) the scaled samples into the output buffer — this is how overlapping segues are mixed.
- When all frames of a source are read, the source handle is closed automatically.

### Segue Ramp Calculation
- When the next transition is Segue and segue points are defined, the ramp rate is calculated as `segueGain / framesInSegueRegion`.
- The ramp level accumulates across Sum calls, providing continuous fade-out during segue overlap.

### Private Helpers
| Method | Description |
|--------|-------------|
| `ConvertAudio(src, dst, settings, err_msg)` | Converts rendered WAV to target format/settings using `RDAudioConvert` |
| `ImportCart(src, cartnum, cutnum, chans, err_msg)` | Imports rendered WAV into the Rivendell audio store via `RDAudioImport` |
| `FramesFromMsec(msec)` | Converts milliseconds to sample frames using system sample rate |
| `DeleteTempFile(filename)` | Removes a temporary file and its parent directory |
| `ProgressMessage(msg)` / `ProgressMessage(time, line, trans, msg)` | Emits `progressMessageSent` signal with formatted status text |

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `render_warnings` | `QStringList` | Accumulated warnings from current render pass |
| `render_abort` | `bool` | Abort flag, set by `abort()` slot |
| `render_total_passes` | `int` | Total passes for current operation (1 or 2), used in progress reporting |

---

## Helper Class: __RDRenderLogLine
- **Inherits:** `RDLogLine`
- **Role:** Wraps an `RDLogLine` with additional state for rendering: audio file handle, gain ramp level/rate, and methods to open/close the underlying audio.

### Purpose
Each log line being rendered needs its own audio file handle (opened via libsndfile) and per-line ramp state for segue mixing. This class adds that state on top of the base `RDLogLine` data.

### Key Methods
| Method | Description |
|--------|-------------|
| `open(time)` | For Cart-type lines: creates an `RDCart`, selects an appropriate cut for the given time, exports the cut's audio segment to a temp WAV file, opens it via libsndfile. Sets start/end/segue points from the cut. Returns true if audio is ready. |
| `close()` | Closes the libsndfile handle. |
| `setRamp(next_trans, segue_gain)` | Calculates ramp rate for segue fadeout based on segue region duration and gain. |
| `summary()` | Returns a human-readable summary string based on line type (cart number+title, marker comment, macro title, chain label, etc.). |
| `cart()` / `cut()` / `handle()` | Accessors for the opened RDCart, RDCut, and SNDFILE handle. |
| `rampLevel()` / `setRampLevel()` / `rampRate()` / `setRampRate()` | Gain ramp state accessors for segue mixing. |

### Audio File Acquisition (`GetCutFile`)
- Exports audio from Rivendell audio store to a temporary WAV file (PCM16, system sample rate, specified channels, no normalization).
- Uses `RDAudioExport` with user credentials from `rda` (global application object).
- Specifies a point range (start_pt to end_pt) for the export.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `ll_cart` | `RDCart*` | Opened cart object |
| `ll_cut` | `RDCut*` | Selected cut within the cart |
| `ll_handle` | `SNDFILE*` | libsndfile handle for reading audio PCM data |
| `ll_logline` | `RDLogLine*` | Reference to original log line |
| `ll_channels` | `unsigned` | Channel count for the render |
| `ll_ramp_level` | `double` | Current gain ramp level (dB-like, used in exponential scaling) |
| `ll_ramp_rate` | `double` | Gain change rate per frame (for segue fades) |

---

## SQL Usage
- **None direct.** RDRenderer does not execute SQL queries. Database access is delegated to `RDCart`, `RDCut`, `RDAudioExport`, and `RDAudioImport`.

## Linux/Platform-Specific
- Uses `mkdtemp()` for creating temporary directories.
- Uses `unlink()` and `rmdir()` for temp file cleanup.
- Uses `libsndfile` (`sf_open`, `sf_readf_float`, `sf_writef_float`, `sf_close`) for all audio I/O.
- Uses `PATH_MAX` for temp path buffer sizing.
- Global `rda` application object provides system sample rate and user credentials.

## Dependencies
| Dependency | Role |
|------------|------|
| `RDLogEvent` / `RDLogLine` | Input: the log and its lines |
| `RDCart` / `RDCut` | Audio cart/cut lookup and metadata |
| `RDSettings` | Output format configuration (format, channels, sample rate, normalization) |
| `RDAudioExport` | Exports audio from store to temp file |
| `RDAudioConvert` | Converts between audio formats |
| `RDAudioImport` | Imports rendered audio back into audio store |
| `RDTempDirectory` | Provides base path for temp files |
| `libsndfile` | Low-level audio file read/write |

## Consumers
- `utils/rdrender/rdrender.cpp` — CLI log rendering utility
- `rdlogedit/render_dialog.cpp` — Log editor render dialog
- `lib/rdfeed.cpp` — Podcast feed generation (renders log for RSS feed audio)
