# INV-030: RDTransfer

- **partial_id:** 030
- **status:** done
- **agent:** PHASE-2-inventory-subagent
- **date:** 2026-04-05

## Class Overview

| Property | Value |
|----------|-------|
| Class | `RDTransfer` |
| Inherits | `QObject` |
| Role | Abstract base class for all remote data transfer operations |
| Q_OBJECT | Yes |
| Header | `lib/rdtransfer.h` |
| Source | `lib/rdtransfer.cpp` |

**Purpose:** Provides a common base for download and upload transfer classes. Defines URL scheme validation and configuration access. Cannot be instantiated directly (has pure virtual method).

## Constructor

| Signature | Parameters | Behavior |
|-----------|------------|----------|
| `RDTransfer(RDConfig *c, QObject *parent=0)` | `c` - system configuration; `parent` - QObject parent | Stores configuration reference. Standard QObject parentage. |

## Public Methods

| Method | Signature | Returns | Behavior |
|--------|-----------|---------|----------|
| `supportedSchemes` | `virtual QStringList supportedSchemes() const = 0` | List of URL scheme strings | **Pure virtual.** Each subclass declares which URL schemes it can handle. |
| `urlIsSupported` | `bool urlIsSupported(const QString &url)` | `bool` | Converts string to QUrl and delegates to QUrl overload. |
| `urlIsSupported` | `bool urlIsSupported(const QUrl &url)` | `bool` | Returns false if URL is relative or invalid. Returns true if URL scheme is in `supportedSchemes()` list. |

## Protected Methods

| Method | Signature | Returns | Behavior |
|--------|-----------|---------|----------|
| `config` | `RDConfig *config() const` | Pointer to RDConfig | Accessor for stored system configuration. Used by subclasses. |

## Signals

None.

## Slots

None.

## Private State

| Field | Type | Purpose |
|-------|------|---------|
| `xfer_config` | `RDConfig*` | Stored system configuration reference |

## Inheritance Hierarchy

```
QObject
  \-- RDTransfer (abstract)
        |-- RDDownload (INV-031)
        \-- RDUpload  (INV-032)
```

## Dependencies

| Dependency | Role |
|------------|------|
| `QObject` | Base class, parent-child lifecycle |
| `QUrl` | URL parsing and validation |
| `QStringList` | Scheme list return type |
| `RDConfig` | System configuration access |

## Platform / Linux-Specific

None at this level. Platform-specific behavior is in subclasses.

## Behavioral Notes

- URL validation is two-step: (1) must be absolute and valid, (2) scheme must be in subclass's supported list.
- This class holds no transfer state itself -- all transfer logic is in subclasses.
- The pure virtual `supportedSchemes()` forces each subclass to declare its protocol support.
