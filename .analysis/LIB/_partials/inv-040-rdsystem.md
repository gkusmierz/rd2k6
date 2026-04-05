---
partial_id: "040"
class: RDSystem
source_files:
  - lib/rdsystem.h
  - lib/rdsystem.cpp
phase: 2
status: done
---

# RDSystem — Global System Settings (DB)

## Purpose
Provides access to global system-wide settings stored in the `SYSTEM` database table. This is a singleton-row table — there is exactly one row with system-wide parameters that apply to the entire Rivendell installation.

## Data Source
- **Table**: `SYSTEM` (single row)
- **Key**: none (single-row table)
- All getters/setters read/write directly via SQL on each call (no caching)

## Inheritance
- Plain C++ class (no QObject, no signals/slots)

## DB Table: SYSTEM

| Column | Accessor | Type | Description |
|--------|----------|------|-------------|
| SAMPLE_RATE | `sampleRate()` / `setSampleRate()` | int | System-wide audio sample rate |
| DUP_CART_TITLES | `allowDuplicateCartTitles()` / `setAllowDuplicateCartTitles()` | bool | Allow duplicate cart titles |
| FIX_DUP_CART_TITLES | `fixDuplicateCartTitles()` / `setFixDuplicateCartTitles()` | bool | Auto-fix duplicate titles |
| MAX_POST_LENGTH | `maxPostLength()` / `setMaxPostLength()` | unsigned | Maximum HTTP POST length in bytes |
| ISCI_XREFERENCE_PATH | `isciXreferencePath()` / `setIsciXreferencePath()` | string | Path to ISCI cross-reference file |
| ORIGIN_EMAIL_ADDRESS | `originEmailAddress()` / `setOriginEmailAddress()` | string | Email address for system notifications |
| TEMP_CART_GROUP | `tempCartGroup()` / `setTempCartGroup()` | string | Default group for temporary carts |
| SHOW_USER_LIST | `showUserList()` / `setShowUserList()` | bool | Show user list at login |
| NOTIFICATION_ADDRESS | `notificationAddress()` / `setNotificationAddress()` | string | Notification target address |
| RSS_PROCESSOR_STATION | `rssProcessorStation()` / `setRssProcessorStation()` | string | Station for RSS feed processing |

## Key Methods
- `xml()` — serializes all system settings to XML fragment
- `GetValue(field)` / `SetRow(param, value)` — generic DB column read/write helpers for the SYSTEM table

## Pattern
Every getter runs a `SELECT field FROM SYSTEM` query. Every setter runs an `UPDATE SYSTEM SET field=value`. No constructor parameters needed — always operates on the single SYSTEM row.
