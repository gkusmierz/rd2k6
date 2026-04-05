---
partial_id: "054"
class: RDSchedRulesList
sources:
  - lib/rdschedruleslist.h
  - lib/rdschedruleslist.cpp
status: done
phase: 2
---

# RDSchedRulesList — Scheduler Rules Collection

## Purpose

Holds the complete set of scheduling rules for a given clock. Each scheduler code gets a rule entry specifying constraints the scheduling engine uses when placing carts: maximum rows in sequence, minimum wait between plays, and "not after" / "or after" alternate code constraints.

## Constructor

- `RDSchedRulesList(QString clockname, RDConfig *config)` — Loads all scheduler codes from `SCHED_CODES`, then for each code loads the rule parameters from `RULE_LINES` for the given clock. If no rule exists for a code, defaults are: max_row=1, min_wait=0, all constraint strings empty.

## Destructor

- `~RDSchedRulesList()` — Frees dynamically allocated arrays.

## Public Interface

| Method | Returns | Description |
|--------|---------|-------------|
| `insertItem(pos, maxrow, minwait, notafter, orafter, orafterii)` | `void` | Sets rule parameters at position `pos` |
| `getItemSchedCode(pos)` | `QString` | Scheduler code at position |
| `getItemMaxRow(pos)` | `int` | Maximum consecutive rows allowed for this code |
| `getItemMinWait(pos)` | `int` | Minimum number of rows to wait before replaying this code |
| `getItemNotAfter(pos)` | `QString` | Code that must NOT precede this one |
| `getItemOrAfter(pos)` | `QString` | Alternative "or after" code (first) |
| `getItemOrAfterII(pos)` | `QString` | Alternative "or after" code (second) |
| `getItemDescription(pos)` | `QString` | Description of the scheduler code at position |
| `getNumberOfItems()` | `int` | Total number of scheduler codes (and thus rules) |
| `Save(clockname)` | `void` | Persists all rules: deletes existing RULE_LINES for the clock, then inserts fresh rows |

## Database Mapping

| Table | Key Column(s) | Operation | Description |
|-------|--------------|-----------|-------------|
| `SCHED_CODES` | `CODE` | R | All codes loaded on construction (CODE, DESCRIPTION) |
| `RULE_LINES` | `CLOCK_NAME`, `CODE` | R/D/C | Rules per clock per code. Full delete+reinsert on Save. |

### RULE_LINES Columns

- `CLOCK_NAME` — owning clock name
- `CODE` — scheduler code
- `MAX_ROW` — max consecutive occurrences (int)
- `MIN_WAIT` — minimum gap in rows (int)
- `NOT_AFTER` — code that must not precede (string)
- `OR_AFTER` — alternative predecessor code 1 (string)
- `OR_AFTER_II` — alternative predecessor code 2 (string)

## Internal Storage

Uses parallel C-style dynamic arrays (`new[]`/`delete[]`) indexed by position. Size equals the total number of scheduler codes in the system.

## Dependencies

- Not a QObject, plain C++ class
- Depends on `RDConfig` (passed but not stored/used beyond construction context)
