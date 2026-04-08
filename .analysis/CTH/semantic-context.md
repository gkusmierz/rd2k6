---
artifact: CTH
project: Rivendell
status: in-progress
agent_version: 2.0.0
extracted_at: 2026-04-08T00:00:00Z
serena_bootstrap: true
sections_completed: [A]
source_files_count: 28
classes_count: ~
tables_count: ~
connections_count: ~
rules_count: ~
ui_windows_count: ~
---

# Semantic Context: CTH (rdcatch)

## Files & Symbols

### Source Files

| File | Type | Symbols | LOC (est) |
|------|------|---------|-----------|
| rdcatch.h | header | CatchConnector, MainWidget | ~300 |
| rdcatch.cpp | source | MainWidget impl | ~1500 |
| deckmon.h | header | DeckMon | ~80 |
| deckmon.cpp | source | DeckMon impl | ~400 |
| edit_recording.h | header | EditRecording | ~120 |
| edit_recording.cpp | source | EditRecording impl | ~800 |
| edit_download.h | header | EditDownload | ~100 |
| edit_download.cpp | source | EditDownload impl | ~600 |
| edit_upload.h | header | EditUpload | ~100 |
| edit_upload.cpp | source | EditUpload impl | ~600 |
| edit_playout.h | header | EditPlayout | ~80 |
| edit_playout.cpp | source | EditPlayout impl | ~400 |
| edit_switchevent.h | header | EditSwitchEvent | ~90 |
| edit_switchevent.cpp | source | EditSwitchEvent impl | ~500 |
| edit_cartevent.h | header | EditCartEvent | ~70 |
| edit_cartevent.cpp | source | EditCartEvent impl | ~350 |
| add_recording.h | header | AddRecording | ~50 |
| add_recording.cpp | source | AddRecording impl | ~200 |
| catch_monitor.h | header | CatchMonitor | ~40 |
| catch_monitor.cpp | source | CatchMonitor impl | ~100 |
| catch_listview.h | header | CatchListView | ~40 |
| catch_listview.cpp | source | CatchListView impl | ~100 |
| list_reports.h | header | ListReports | ~60 |
| list_reports.cpp | source | ListReports impl | ~300 |
| vbox.h | header | VBox | ~30 |
| vbox.cpp | source | VBox impl | ~50 |
| globals.h | header | (global variables) | ~15 |
| colors.h | header | (color constants) | ~10 |

### Symbol Index

| Symbol | Kind | File | Qt Class? |
|--------|------|------|-----------|
| MainWidget | Class | rdcatch.h | Yes (Q_OBJECT) |
| CatchConnector | Class | rdcatch.h | No (helper struct) |
| DeckMon | Class | deckmon.h | Yes (Q_OBJECT) |
| EditRecording | Class | edit_recording.h | Yes (Q_OBJECT) |
| EditDownload | Class | edit_download.h | Yes (Q_OBJECT) |
| EditUpload | Class | edit_upload.h | Yes (Q_OBJECT) |
| EditPlayout | Class | edit_playout.h | Yes (Q_OBJECT) |
| EditSwitchEvent | Class | edit_switchevent.h | Yes (Q_OBJECT) |
| EditCartEvent | Class | edit_cartevent.h | Yes (Q_OBJECT) |
| AddRecording | Class | add_recording.h | Yes (Q_OBJECT) |
| CatchMonitor | Class | catch_monitor.h | No (data class) |
| CatchListView | Class | catch_listview.h | Yes (Q_OBJECT) |
| ListReports | Class | list_reports.h | Yes (Q_OBJECT) |
| VBox | Class | vbox.h | Yes (Q_OBJECT) |
