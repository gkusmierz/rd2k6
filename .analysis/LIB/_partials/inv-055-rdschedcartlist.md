---
partial_id: "055"
class: RDSchedCartList
sources:
  - lib/rdschedcartlist.h
  - lib/rdschedcartlist.cpp
status: done
phase: 2
---

# RDSchedCartList — Scheduler Cart Candidate List

## Purpose

In-memory collection of cart candidates for the scheduling engine. Holds a working set of carts with their metadata (number, length, artist, title, scheduler codes) and supports filtering by scheduler codes, snapshot/restore for backtracking during scheduling.

## Constructor

- `RDSchedCartList()` — Creates an empty list (no DB interaction).

## Public Interface

| Method | Returns | Description |
|--------|---------|-------------|
| `insertItem(cartnumber, cartlength, stack_id, artist, title, schedcodes)` | `void` | Appends a cart to the list. Artist and title are normalized (lowercased, spaces removed) for comparison purposes. |
| `removeItem(itemnumber)` | `void` | Removes item at given index |
| `removeIfCode(itemnumber, test_code)` | `bool` | Removes ALL items (not just itemnumber) that contain the given scheduler code. Returns true if any were removed. |
| `itemHasCode(itemnumber, test_code)` | `bool` | Checks if item has a specific scheduler code |
| `itemHasCodes(itemnumber, test_codes)` | `bool` | Checks if item has ALL of the given scheduler codes |
| `getItemCartNumber(itemnumber)` | `unsigned` | Cart number |
| `getItemCartLength(itemnumber)` | `int` | Cart duration/length |
| `getItemStackid(itemnumber)` | `int` | Stack position identifier |
| `getItemArtist(itemnumber)` | `QString` | Normalized artist string |
| `getItemTitle(itemnumber)` | `QString` | Normalized title string |
| `getItemSchedCodes(itemnumber)` | `QStringList` | All scheduler codes for item |
| `getNumberOfItems()` | `int` | Current list size |
| `save()` | `void` | Snapshots current state into backup lists (in-memory only) |
| `restore()` | `void` | Restores from last snapshot |

## Database Mapping

None. This is a pure in-memory data structure. Carts are populated externally (by the scheduler engine) and not persisted.

## Key Behaviors

1. **Normalization**: Artist and title stored lowercase with spaces stripped, enabling case/space-insensitive duplicate detection.
2. **Snapshot/Restore**: `save()`/`restore()` provide a single-level undo mechanism for the scheduler's trial-and-error placement algorithm.
3. **Code filtering**: `removeIfCode()` scans the entire list in reverse order, removing all items matching the given code.

## Internal Storage

Parallel `QList` / `QStringList` containers for each attribute. Separate `list_save*` copies for snapshot support.

## Dependencies

- Not a QObject, plain C++ class
- No database dependency
