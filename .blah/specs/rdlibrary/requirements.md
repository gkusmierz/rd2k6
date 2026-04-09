# Requirements Document

## Introduction

The Library Manager (rdlibrary) is the primary application for managing the audio and macro cart library in the Rivendell broadcast automation system. It provides a main window for browsing, searching, filtering, and managing carts (both audio and macro types), along with specialized dialogs for editing cart metadata, managing audio cuts, recording audio, ripping CDs, editing macro commands, managing scheduler codes, and generating reports. The application supports multi-user environments with permission-based access, real-time cross-client notifications, and drag-and-drop integration with other system modules.

## Requirements

### Requirement 1: Cart Library Browsing and Filtering

**Objective:** As a broadcast operator, I want to browse and filter the cart library with flexible search criteria, so that I can quickly find the audio or macro content I need.

#### Acceptance Criteria

1. The system shall display all accessible carts in a multi-column list showing cart number, group, length, talk time, title, artist, start/end dates, album, label, composer, conductor, publisher, client, agency, user-defined field, cut count, last cut played, enforce length, preserve pitch, length deviation, and ownership.
2. When the user enters text in the filter field, the system shall filter the cart list based on the search text.
3. Where the station is configured for synchronous filtering, the system shall update the list in real-time as the filter text changes.
4. Where the station is configured for asynchronous filtering, the system shall display a search button and update the list only when the user clicks search or presses enter.
5. When the user clicks the clear button, the system shall reset the filter field and refresh the list.
6. When the user selects a group from the group dropdown, the system shall filter the cart list to show only carts in the selected group.
7. When the user selects a scheduler code from either scheduler code dropdown, the system shall filter the cart list to show only carts with the matching scheduler code.
8. When the user toggles the "Show Audio Carts" checkbox, the system shall include or exclude audio-type carts from the list.
9. When the user toggles the "Show Macro Carts" checkbox, the system shall include or exclude macro-type carts from the list.
10. When the user toggles the "Show Matches" checkbox, the system shall limit displayed results to only those matching the current filter.
11. The system shall display each cart row color-coded according to the group color assignment.
12. The system shall display carts hierarchically, with cuts shown as child items under their parent cart.
13. The system shall save and restore the window geometry between sessions.
14. The system shall display the station name and current user in the window title.

### Requirement 2: Cart Creation and Deletion

**Objective:** As a library manager, I want to add and remove carts from the library, so that I can maintain the content collection.

#### Acceptance Criteria

1. When the user clicks the add button, the system shall create a new audio cart and open the cart editor dialog.
2. When the user clicks the add macro button, the system shall create a new macro cart and open the cart editor dialog.
3. When the user clicks the delete button, the system shall prompt for confirmation before deleting the selected cart(s).
4. If the cart is referenced by one or more scheduled recording events, then the system shall warn the user and require explicit confirmation before deletion.
5. If a cut from the cart being deleted is currently in the clipboard, then the system shall warn that the clipboard will be emptied and require confirmation.
6. If the cart is owned by a voice tracking session, then the system shall skip deletion of that cart silently.
7. When a cart is added, modified, or deleted, the system shall publish a notification event so that other connected clients update their displays accordingly.

### Requirement 3: Cart Metadata Editing

**Objective:** As a library manager, I want to edit cart metadata including title, artist, album, and scheduling information, so that carts are properly catalogued.

#### Acceptance Criteria

1. When the user double-clicks a cart or clicks the edit button, the system shall open the cart editor dialog.
2. The system shall support bulk editing when multiple carts are selected, applying changes to all selected carts.
3. The system shall display the cart type, number, and group as read-only fields.
4. The system shall allow editing of title, artist, album, year, label, client, agency, publisher, conductor, composer, user-defined field, song ID, and beats-per-minute.
5. If the user attempts to save a cart without a title (in single-edit mode), then the system shall display a warning and prevent saving.
6. If the system configuration disallows duplicate cart titles and another cart already has the same title, then the system shall display a warning and prevent saving.
7. When the user enables enforce-length mode, the system shall allow setting a forced length value.
8. If enforce-length is enabled and one or more cut lengths exceed the timescaling limits, then the system shall warn the user and allow them to override or cancel.
9. If multiple cuts share the same play order value (when using play-order scheduling), then the system shall display a warning and prevent saving.
10. The system shall allow the user to select the cut scheduling mode (weight-based or play-order).
11. The system shall allow opening a notes editor for free-text cart notes.
12. The system shall allow opening a scheduler codes editor to assign or remove scheduler codes.
13. Where the cart type is macro, the system shall display synchronous playback and use-event-length toggle options.
14. The system shall allow selecting a group from the groups the user has permission to access.

### Requirement 4: Audio Cut Management

**Objective:** As an audio engineer, I want to manage individual audio cuts within a cart, so that I can control the audio content and its scheduling.

#### Acceptance Criteria

1. When the user clicks the add button in the audio cut manager, the system shall create a new cut in the cart.
2. If the cart has reached the maximum number of cuts, then the system shall display a warning and prevent adding.
3. When the user clicks the delete button, the system shall delete the selected cut(s) after confirmation.
4. If a cut being deleted is referenced by a scheduled recording event, then the system shall warn and require confirmation.
5. If a cut being deleted is currently in the clipboard, then the system shall warn that the clipboard will be emptied.
6. When the user clicks the copy button with a single cut selected, the system shall copy that cut to the clipboard.
7. If the user clicks copy without a single cut selected, then the system shall display an information message requiring single selection.
8. When the user clicks paste, the system shall paste the clipboard content into the selected cut.
9. If the paste target already contains audio, then the system shall warn about overwriting and require confirmation.
10. If the clipboard is empty when pasting, then the system shall display an information message.
11. When the user clicks the import button, the system shall allow importing an audio file as a cut.
12. When the user clicks the edit button, the system shall open the cut metadata editor for the selected cut.
13. When the user clicks the record button, the system shall open the recording dialog for the selected cut.
14. When the user clicks the rip button, the system shall open the single-track CD ripper for the selected cut.
15. When the user clicks the external editor button and audio exists, the system shall launch the configured external audio editor.
16. If the user clicks the external editor button and no audio is present in the cut, then the system shall display an information message.
17. When any cut operation modifies data, the system shall publish a data-changed event to update the parent cart editor.

### Requirement 5: Audio Recording

**Objective:** As an audio engineer, I want to record audio directly into a cut, so that I can capture live content into the library.

#### Acceptance Criteria

1. The system shall display cut metadata fields including description, outcue, ISRC, ISCI, source, weight, play date, and play counter.
2. The system shall provide record, play, and stop transport controls.
3. When the user clicks record, the system shall begin recording audio from the configured audio input device.
4. While recording is in progress, the system shall display audio level meters and a recording timer.
5. When the user clicks stop during recording, the system shall stop recording and apply auto-trim if configured.
6. The system shall allow configuring the recording channel count (mono or stereo).
7. The system shall allow configuring air date scheduling with start and end datetime ranges.
8. The system shall allow configuring daypart scheduling with start and end time-of-day ranges.
9. The system shall allow selecting specific days of the week for playback eligibility, with set-all and clear-all convenience buttons.
10. When the user enables the evergreen flag, the system shall mark the cut as always valid regardless of date and time scheduling.
11. When the user clicks the play button, the system shall play back the recorded audio for preview.
12. If the audio input signal has an alarm condition, then the system shall indicate the alarm status to the user.

### Requirement 6: CD Ripping (Batch)

**Objective:** As a library manager, I want to rip multiple tracks from a CD and assign them to carts, so that I can efficiently ingest physical media.

#### Acceptance Criteria

1. When the user opens the batch CD ripper, the system shall detect the inserted CD and display its track list.
2. The system shall perform an online metadata lookup (disc database) and populate album, artist, and track title fields.
3. The system shall allow the user to assign individual tracks to specific cart/cut destinations.
4. The system shall support single-track and multi-track assignment modes.
5. When the user clicks the rip button, the system shall rip all assigned tracks sequentially.
6. While ripping is in progress, the system shall display overall and per-track progress indicators.
7. The system shall allow configuring normalization level for ripped audio.
8. The system shall allow configuring auto-trim settings for ripped audio.
9. The system shall allow selecting the channel count for ripped audio.
10. When the user clicks eject, the system shall eject the CD.
11. The system shall provide play and stop transport controls for previewing CD tracks.
12. When ripping completes for each track, the system shall publish a notification event for the newly created cart.
13. The system shall allow opening a browser to the disc lookup service for additional metadata.
14. When the user clicks modify cart label, the system shall allow editing the cart label for a selected track assignment.

### Requirement 7: CD Ripping (Single Track)

**Objective:** As an audio engineer, I want to rip a single track from a CD directly into an existing cut, so that I can quickly capture specific content.

#### Acceptance Criteria

1. When the user opens the single-track ripper, the system shall detect the CD and display its track list.
2. The system shall perform an online metadata lookup and populate title, artist, album, and label fields.
3. When the user selects a track and clicks the rip button, the system shall rip the selected track into the target cut.
4. While ripping is in progress, the system shall display a progress indicator.
5. The system shall allow configuring normalization and auto-trim settings.
6. The system shall allow selecting the channel count.
7. The system shall provide eject, play, and stop transport controls.
8. When ripping completes, the system shall return the metadata (title, artist, album, label) to the calling component.

### Requirement 8: Macro Cart Editing

**Objective:** As a broadcast operator, I want to create and edit macro command sequences, so that I can automate system actions.

#### Acceptance Criteria

1. When the user adds a macro line, the system shall insert a new command entry in the macro list.
2. When the user edits a macro line, the system shall open the macro command editor dialog.
3. The system shall allow deleting, copying, and pasting individual macro lines.
4. When the user clicks run-line, the system shall execute the selected macro command.
5. When the user clicks run-cart, the system shall execute the entire macro sequence.
6. The system shall calculate and display the total macro duration.
7. When the total duration changes, the system shall publish a length-changed event to the parent cart editor.

### Requirement 9: Cut Validity and Scheduling

**Objective:** As a scheduling operator, I want the system to automatically validate cut scheduling eligibility, so that only valid content plays at the correct times.

#### Acceptance Criteria

1. The system shall validate each cut's scheduling status based on a priority evaluation order.
2. If any cut within a cart passes all validity checks, then the cart shall be marked as always-valid.
3. If a cut has zero length (no audio), then the system shall mark it as never-valid.
4. If a cut is marked as evergreen, then the system shall bypass all date and time scheduling checks for that cut.
5. If the current day of the week does not match the cut's enabled days, then the system shall mark it as not currently valid.
6. If the current date is outside the cut's start/end date range, then the system shall mark it accordingly (future-valid if start date is in the future, never-valid if end date has passed).
7. If the current time is outside the cut's daypart range, then the system shall mark it as not currently valid.

### Requirement 10: Reporting and Export

**Objective:** As a library manager, I want to generate reports and export cart data, so that I can analyze and share library information.

#### Acceptance Criteria

1. The system shall offer three report types: cart report, cut report, and cart data dump (CSV).
2. When the user selects cart report and clicks generate, the system shall produce a formatted report of carts matching the current filter.
3. When the user selects cut report and clicks generate, the system shall produce a formatted report including cut-level detail for matching carts.
4. When the user selects cart data dump, the system shall produce a CSV export of cart and cut data.
5. Where the CSV export option is selected, the system shall allow the user to optionally prepend field names as a header row.

### Requirement 11: Note Bubbles and Preview

**Objective:** As a broadcast operator, I want to preview cart notes and audio without opening editors, so that I can quickly review content.

#### Acceptance Criteria

1. When the user enables "Show Note Bubbles" and hovers over a cart row, the system shall display a tooltip popup showing the cart's notes.
2. The system shall provide an embedded audio player for previewing the selected cart's audio.
3. When the user presses the configured keyboard shortcut, the system shall toggle playback of the selected cart.

### Requirement 12: Drag-and-Drop Integration

**Objective:** As a broadcast operator, I want to drag carts from the library into other applications, so that I can quickly assign content to logs and panels.

#### Acceptance Criteria

1. Where the station configuration enables drag-and-drop, the system shall allow the user to toggle drag mode via a checkbox.
2. While drag mode is enabled, the system shall allow dragging cart items from the list to other system modules.

### Requirement 13: Multi-User Session Management

**Objective:** As a system administrator, I want the library to handle user session changes and concurrent access safely, so that data integrity is maintained.

#### Acceptance Criteria

1. When the user session changes, the system shall refresh the group list and cart display to reflect the new user's permissions.
2. While a cart editor dialog is open, the system shall lock the session and defer processing of incoming deletion notifications.
3. When the editor dialog closes, the system shall process any deferred notifications and check if the user changed during the edit.
4. When a notification is received indicating another client added a cart matching the current filter, the system shall add the cart to the display.
5. When a notification is received indicating another client modified a cart, the system shall refresh that cart's display.
6. When a notification is received indicating another client deleted a cart, the system shall remove that cart from the display.
