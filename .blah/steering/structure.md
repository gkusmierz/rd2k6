# Project Structure

## Organization Philosophy

Lightweight hexagonal architecture in a single QMake project. Code is organized by architectural layer (domain → ports → adapters → app → ui), not by feature. The dependency rule is strict: inner layers never reference outer layers.

See `hexagonal-architecture.md` (steering-custom) for detailed architectural rules and enforcement.

## Directory Patterns

### Domain Layer
**Location**: `src/domain/`
**Purpose**: Pure C++ domain entities, value objects, and domain services. Zero external dependencies — no Qt, no database, no I/O.
**Subdivisions**:
- `entities/` — aggregate roots and domain entities (Cart, Cut, Log, Service, Feed, User...)
- `value_objects/` — immutable value types (CartNumber, Duration, SchedulerCode, CartType...)
- `services/` — domain logic that doesn't belong to a single entity (CutRotation, LogValidation...)
- `events/` — domain event definitions (CartModified, LogLineChanged...)

### Ports (Interfaces)
**Location**: `src/ports/`
**Purpose**: Pure virtual C++ interfaces defining boundaries between domain and outside world.
**Subdivisions**:
- `inbound/` — use case interfaces / application service contracts (ILibraryService, IPlayoutService...)
- `outbound/` — infrastructure interfaces the domain depends on (ICartRepository, IAudioEngine, INotificationService...)

### Adapters (Implementations)
**Location**: `src/adapters/`
**Purpose**: Concrete implementations of port interfaces. This is where Qt and other frameworks live.
**Subdivisions**:
- `persistence/` — Qt SQL implementations of repository ports (SqlCartRepository, SqlLogRepository...)
- `audio/` — Qt Multimedia / platform audio implementations (QtAudioEngine, QtRecorder...)
- `network/` — RPC/IPC client implementations (RipcClient, CatchClient...)
- `ui/` — QML-facing adapter objects (models, controllers) that bridge domain to UI
- `filesystem/` — file I/O adapters (AudioFileAdapter, ExportAdapter...)

### Application Layer
**Location**: `src/app/`
**Purpose**: Composition root — dependency injection, wiring ports to adapters, application startup.
**Contents**: Application service implementations (implement inbound ports, orchestrate domain + outbound ports), DI container/factory.

### UI Layer
**Location**: `src/ui/`
**Purpose**: QML files and UI-only logic. Receives data from adapter/ui models. No business logic.
**Subdivisions**:
- `components/` — reusable QML components (buttons, meters, dialogs...)
- `views/` — screen-level QML views (MainWindow, CartEditor, RecordingDialog...)
- `theme/` — design tokens, colors, typography as QML singletons

### Tests
**Location**: `tests/`
**Purpose**: All test code, mirroring src structure.
**Subdivisions**:
- `unit/domain/` — pure domain logic tests (no Qt infrastructure needed)
- `unit/adapters/` — adapter tests with mocks/stubs
- `integration/` — multi-layer tests with real adapters
- `e2e/` — qt-vnc-agent based UI automation tests

## Naming Conventions

- **Files**: `snake_case.h`, `snake_case.cpp`
- **Classes**: `PascalCase` — `CartEntity`, `SqlCartRepository`, `ICartRepository`
- **Interfaces**: `I` prefix — `ICartRepository`, `IAudioEngine`, `IPlayoutService`
- **Member variables**: `m_` prefix — `m_cartNumber`, `m_duration`
- **Methods**: `camelCase` — `findById()`, `calculateDuration()`, `emitError()`
- **Qt Properties**: `camelCase` matching getter — `Q_PROPERTY(QString title READ title NOTIFY titleChanged)`
- **Namespaces**: `rd::domain`, `rd::ports`, `rd::adapters`, `rd::app`, `rd::ui`
- **Enum classes**: `PascalCase` type, `PascalCase` values — `enum class CartType { Audio, Macro }`
- **Constants**: `k` prefix + PascalCase — `kMaxCartNumber`, `kDefaultSampleRate`
- **Test files**: `test_<module_name>.cpp`

## Include Organization

```cpp
// 1. Corresponding header (for .cpp files)
#include "cart_entity.h"

// 2. Project headers (by layer, outer to inner)
#include "ports/outbound/i_cart_repository.h"
#include "domain/entities/cart_entity.h"

// 3. Qt headers
#include <QObject>
#include <QString>

// 4. Standard library
#include <memory>
#include <vector>
#include <optional>
```

**Path convention**: Includes use path from `src/` root — `#include "domain/entities/cart_entity.h"`

## QMake Organization

Single top-level `.pro` file with `SUBDIRS` template:
```qmake
# rivendell2.pro
TEMPLATE = subdirs
SUBDIRS = \
    src/domain \       # Static lib, no Qt dependency
    src/ports \        # Header-only (interfaces)
    src/adapters \     # Links Qt, implements ports
    src/app \          # Links all, composition root
    src/ui \           # QML resources
    tests              # Qt Test executables
```

The domain library MUST compile without Qt in its link dependencies (`QT -= core gui` in its `.pro` file).

## Code Organization Principles

- **Dependency rule**: domain ← ports ← adapters ← app. Never the reverse.
- **Domain purity**: `src/domain/` compiles with C++ standard library only.
- **One class per file**: Each `.h`/`.cpp` pair contains one primary class.
- **Header guards**: `#pragma once`
- **Forward declarations**: Prefer forward declarations over includes in headers.

---
_Document patterns, not file trees. New files following patterns should not require updates_
