# Technology Stack

## Architecture

Lightweight hexagonal architecture within a single QMake project. Domain logic is fully isolated from frameworks. Qt6 serves as the infrastructure layer (UI, database, networking, audio) but never leaks into the domain.

See `hexagonal-architecture.md` (steering-custom) for detailed architectural rules.

## Core Technologies

- **Language**: C++20 (ISO standard, no compiler extensions)
- **UI Framework**: Qt 6 / Qt Quick / QML
- **Build System**: QMake (Qt 6)
- **Target Platforms**: Linux, macOS, Windows (anywhere Qt6 runs)

## Key Libraries

- **Qt Core**: Event loop, signals/slots, property system, threading
- **Qt Quick/QML**: Declarative UI with C++ backend models
- **Qt SQL**: Database abstraction (adapter layer only)
- **Qt Multimedia**: Audio playback and recording (adapter layer only)
- **Qt Network**: HTTP, TCP/IP for RPC and IPC (adapter layer only)
- **Qt Test**: Unit and integration testing framework

## Development Standards

### Modern C++ (C++20)

- **RAII everywhere**: All resource management through constructors/destructors. No raw `new`/`delete`.
- **Smart pointers**: `std::unique_ptr` for exclusive ownership, `std::shared_ptr` only when shared ownership is genuinely required. Exception: Qt's parent-child ownership model (see Qt Framework section).
- **Value semantics**: Prefer value types. Use `std::move` for transfer. Domain value objects are immutable after construction.
- **`std::optional<T>`**: For values that may be absent. Never use sentinel values or magic numbers.
- **`[[nodiscard]]`**: On all functions where ignoring the return value is likely a bug.
- **`constexpr`/`consteval`**: For compile-time computation where possible.
- **`enum class`**: Always scoped enums, never plain `enum`.
- **Structured bindings, `auto`, range-for**: Use modern syntax for clarity.
- **No C-style casts**: Use `static_cast`, `dynamic_cast`, `reinterpret_cast` explicitly.

### Thread Safety (Mission-Critical)

- **`std::mutex` + `std::lock_guard`/`std::scoped_lock`**: For shared mutable state.
- **`std::atomic`**: For lock-free flags and counters.
- **`std::jthread`**: For managed background threads with cooperative cancellation.
- **Qt signal/slot across threads**: Use `Qt::QueuedConnection` for cross-thread communication.
- **No global mutable state**: All shared state is encapsulated in thread-safe service objects.
- **Audio thread constraint**: Audio processing callbacks must be lock-free and allocation-free. Pre-allocate buffers, use lock-free queues for communication with the main thread.

### Qt Framework Rules

- **Qt parent-child ownership**: Use raw pointers for QObject children whose lifetime is managed by a parent. Do NOT wrap parent-owned QObjects in smart pointers.
- **Smart pointers for non-QObject resources**: `std::unique_ptr` for resources outside the Qt object tree.
- **Signal/slot for error propagation**: No C++ exceptions. Errors are communicated via dedicated error signals carrying structured error info (error code, context, severity).
- **Property system**: Use `Q_PROPERTY` with `NOTIFY` signals for all QML-exposed state.
- **QML/C++ boundary**: C++ exposes models (`QAbstractListModel` subclasses) and controller objects to QML. QML handles only presentation. Business logic stays in C++.

### Code Quality

- Compiler warnings: `-Wall -Wextra -Wpedantic -Werror`
- Static analysis: `clang-tidy` with modern C++ checks enabled
- No compiler-specific extensions — strict ISO C++20

## Key Technical Decisions

- **Hexagonal architecture**: Domain purity enables testing without Qt, swappable adapters, and clear dependency direction
- **Qt6 as infrastructure, not architecture**: Qt is an implementation detail confined to adapters and UI
- **Signal/slot error handling**: Embraces Qt's exception-free design; errors as first-class events, not exceptional interruptions
- **Cross-platform from day one**: No `#ifdef __linux__`, no POSIX-only APIs, no Linux-specific audio stacks
- **Single QMake project**: No separate libraries/repos for domain/ports/adapters — one project with logical directory separation
- **Cart/cut domain model preserved**: The broadcast domain model (carts, cuts, logs, services, clocks) is carried forward from Rivendell 1.x as proven radio automation abstractions

## Testing Strategy

- **Unit**: Domain logic and business rules tested with Qt Test — no Qt infrastructure needed for pure domain tests
- **Integration**: Adapter tests with real database, audio subsystem stubs
- **E2E**: Automated UI testing via qt-vnc-agent — QML app runs in `-platform vnc` mode, MCP agent simulates user interactions (click, type, navigate) like Playwright for Qt
- **All tests run cross-platform**: No Linux-specific test infrastructure

---
_Document standards and patterns, not every dependency_
