# INV-008: RDGroup

partial_id: inv-008
artifact: LIB
class: RDGroup
status: done
sources:
  - lib/rdgroup.h
  - lib/rdgroup.cpp

---

## Overview

RDGroup is a plain C++ Active Record representing a **cart group** in the Rivendell radio automation system. A group organizes carts (audio/macro items) into a named collection with configurable cart number ranges, lifecycle policies, reporting flags, and display attributes. The class maps directly to the `GROUPS` table in the database.

Not a QObject -- no signals, no slots, no Q_PROPERTY.

## Enum

| Enum | Values | Purpose |
|------|--------|---------|
| `ExportType` | `None=0`, `Traffic=1`, `Music=2` | Identifies report export categories (traffic vs. music scheduling) |

## Constructor

| Signature | Behavior |
|-----------|----------|
| `RDGroup(QString name, bool create=false)` | If `create=true`, inserts a new row into `GROUPS` with the given name. If `create=false` (default), looks up the existing group and normalizes the name to the DB-stored casing. |

## Properties (getter/setter pairs via Active Record)

All properties read from / write to the `GROUPS` table, keyed by `NAME`.

| Property | Type | DB Column | Description |
|----------|------|-----------|-------------|
| `name` | QString | NAME | Group name (read-only, set at construction) |
| `exists` | bool | (row existence check) | Whether the group row exists in DB |
| `description` | QString | DESCRIPTION | Human-readable group description |
| `defaultCartType` | RDCart::Type | DEFAULT_CART_TYPE | Default type for new carts (Audio/Macro) |
| `defaultLowCart` | unsigned | DEFAULT_LOW_CART | Low end of the group's cart number range |
| `defaultHighCart` | unsigned | DEFAULT_HIGH_CART | High end of the group's cart number range |
| `defaultCutLife` | int (days) | DEFAULT_CUT_LIFE | Default lifetime for cuts in days |
| `cutShelflife` | int (days) | CUT_SHELFLIFE | How long cuts are kept before expiry |
| `deleteEmptyCarts` | bool | DELETE_EMPTY_CARTS | Whether to auto-delete carts with no cuts |
| `defaultTitle` | QString | DEFAULT_TITLE | Template string for auto-generated cart titles |
| `enforceCartRange` | bool | ENFORCE_CART_RANGE | Whether cart numbers must fall within low/high range |
| `exportReport(type)` | bool | REPORT_TFC / REPORT_MUS | Whether group is included in traffic/music reports |
| `enableNowNext` | bool | ENABLE_NOW_NEXT | Whether group participates in now/next metadata |
| `color` | QColor | COLOR | Display color for the group in UI |
| `notifyEmailAddress` | QString | NOTIFY_EMAIL_ADDRESS | Email address for group notifications |

## Key Business Methods

### generateTitle(pathname) -> QString
Produces a cart title from the `defaultTitle` template by replacing placeholders:
- `%p` -- path portion of the file
- `%f` -- filename without extension
- `%e` -- file extension

### nextFreeCart(startcart=0) -> unsigned
Finds the next unoccupied cart number within the group's configured range (DEFAULT_LOW_CART..DEFAULT_HIGH_CART). Scans the CART table for gaps. Returns 0 if no free cart is available.

### freeCartQuantity() -> int
Counts how many cart numbers are still available in the group's range. Returns -1 if range is not configured (negative bounds).

### reserveCarts(cart_nums, station_name, type, quantity) -> bool
Reserves a contiguous block of `quantity` cart numbers for the given station:
- Searches for free carts sequentially starting from the low range
- Inserts placeholder rows into the CART table (title="[reserved]", with pending station/PID/datetime)
- If an insert fails (number already taken), rolls back all reserved carts for that attempt and retries from the next gap
- Returns true if the full quantity was reserved, false if insufficient carts

### cartNumberValid(cartnum) -> bool
Validates whether a cart number is acceptable for this group:
- Must be in range 1..999999 (absolute bounds)
- If `enforceCartRange` is enabled, must also fall within DEFAULT_LOW_CART..DEFAULT_HIGH_CART
- If range enforcement is off, any valid absolute number is accepted

### xml() -> QString
Serializes the group to an XML `<group>` element containing all major properties.

## Database Tables

| Table | Role | Key Columns Used |
|-------|------|-----------------|
| `GROUPS` | Primary table | NAME (PK), DESCRIPTION, DEFAULT_CART_TYPE, DEFAULT_LOW_CART, DEFAULT_HIGH_CART, DEFAULT_CUT_LIFE, CUT_SHELFLIFE, DELETE_EMPTY_CARTS, DEFAULT_TITLE, ENFORCE_CART_RANGE, REPORT_TFC, REPORT_MUS, ENABLE_NOW_NEXT, COLOR, NOTIFY_EMAIL_ADDRESS |
| `CART` | Referenced for cart allocation | NUMBER, GROUP_NAME, TYPE, TITLE, PENDING_STATION, PENDING_PID, PENDING_DATETIME |

## Private Helpers

| Method | Purpose |
|--------|---------|
| `GetNextFreeCart(startcart)` | Core cart-finding logic scanning CART table for gaps in the group's range |
| `ReserveCart(station_name, type, cart_num)` | Inserts a single placeholder CART row; uses raw QSqlQuery (not RDSqlQuery) because the insert may legitimately fail on duplicate |
| `SetRow(param, value)` | Three overloads (int, unsigned, QString) -- updates a single column in the GROUPS row |
| `ReportField(type)` | Maps ExportType enum to DB column name (Traffic->REPORT_TFC, Music->REPORT_MUS) |

## Dependencies

- **RDCart::Type** -- enum used for default cart type and reservation
- **RDSqlQuery / QSqlQuery** -- database access (QSqlQuery used deliberately in ReserveCart to avoid connection reset on expected insert failures)
- **RDEscapeString** -- SQL string escaping
- **RDGetSqlValue / RDDoesRowExist** -- convenience DB read helpers
- **RDXmlField** -- XML serialization helper
- **RDGetBasePart / RDGetPathPart** -- path manipulation for title generation
