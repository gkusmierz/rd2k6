# Hexagonal Architecture — Rivendell 2.0

This document defines the architectural rules that ALL implementation agents MUST follow. It is the single source of truth for dependency direction, layer responsibilities, and enforcement rules.

## Overview

Rivendell 2.0 uses a **lightweight hexagonal architecture** (Ports & Adapters) within a single QMake project. "Lightweight" means: no separate repositories or libraries per layer — just strict directory-based separation with build-system-enforced dependency rules.

```
                    ┌─────────────────────┐
                    │        UI           │  QML views, components
                    │      (Qt Quick)     │
                    └──────────┬──────────┘
                               │ uses
                    ┌──────────▼──────────┐
                    │    UI Adapters      │  QML models, controllers
                    │   (src/adapters/ui) │
                    └──────────┬──────────┘
                               │ implements
          ┌────────────────────▼────────────────────┐
          │              Inbound Ports               │  Use case interfaces
          │          (src/ports/inbound)              │
          └────────────────────┬────────────────────┘
                               │ defines
          ┌────────────────────▼────────────────────┐
          │           Application Services           │  Orchestrate domain + ports
          │              (src/app)                   │
          └──────┬─────────────┬─────────────┬──────┘
                 │ uses        │ uses        │ uses
          ┌──────▼──────┐ ┌───▼────┐ ┌──────▼──────┐
          │   Domain    │ │Outbound│ │   Domain    │
          │  Entities   │ │ Ports  │ │  Services   │
          │  (domain/)  │ │(ports/)│ │  (domain/)  │
          └─────────────┘ └───┬────┘ └─────────────┘
                              │ implemented by
          ┌───────────────────▼───────────────────────┐
          │              Adapters                      │
          │  persistence/ | audio/ | network/ | fs/   │
          │            (src/adapters/)                 │
          └───────────────────────────────────────────┘
```

---

## The Dependency Rule

**Inner layers NEVER depend on outer layers. Dependencies always point inward.**

```
ui → adapters/ui → ports/inbound → app → domain
                                    ↓
                              ports/outbound → adapters/*
```

| Layer | May depend on | MUST NOT depend on |
|-------|--------------|-------------------|
| `domain/` | C++ standard library only | Qt, ports, adapters, app, ui |
| `ports/` | domain, C++ standard library | Qt, adapters, app, ui |
| `app/` | domain, ports | Qt (except minimal), adapters (only via port interfaces), ui |
| `adapters/` | domain, ports, Qt, external libs | app, ui, other adapters |
| `ui/` | adapters/ui (exposed models) | domain directly, ports, app, persistence |

---

## Layer Rules

### Domain Layer (`src/domain/`)

The domain is the heart of the system. It contains business logic and is **completely framework-agnostic**.

**MUST:**
- Compile with C++ standard library only — no `#include <Q*>` anywhere
- Use value semantics for value objects (immutable after construction)
- Define aggregate roots with clear ownership boundaries
- Express business rules as domain service methods with clear pre/post conditions
- Use `enum class` for all domain enumerations
- Use `std::optional<T>` for optional values, never sentinel values
- Mark getters `[[nodiscard]]`

**MUST NOT:**
- Include any Qt headers
- Depend on any database, network, or filesystem concepts
- Use exceptions for control flow (return error types or use output parameters)
- Contain any I/O operations
- Reference any adapter or port implementation

**Entity pattern:**
```cpp
// src/domain/entities/cart_entity.h
#pragma once
#include "domain/value_objects/cart_number.h"
#include "domain/value_objects/cart_type.h"
#include <string>
#include <optional>
#include <chrono>

namespace rd::domain {

class CartEntity {
public:
    CartEntity(CartNumber number, CartType type, std::string title);

    [[nodiscard]] CartNumber number() const { return m_number; }
    [[nodiscard]] CartType type() const { return m_type; }
    [[nodiscard]] const std::string& title() const { return m_title; }
    [[nodiscard]] std::optional<std::chrono::seconds> forcedLength() const { return m_forcedLength; }

    void updateTitle(std::string title);
    void setForcedLength(std::optional<std::chrono::seconds> length);

private:
    CartNumber m_number;
    CartType m_type;
    std::string m_title;
    std::optional<std::chrono::seconds> m_forcedLength;
};

} // namespace rd::domain
```

**Value object pattern:**
```cpp
// src/domain/value_objects/cart_number.h
#pragma once
#include <cstdint>
#include <compare>

namespace rd::domain {

class CartNumber {
public:
    explicit constexpr CartNumber(uint32_t value) : m_value(value) {}

    [[nodiscard]] constexpr uint32_t value() const { return m_value; }
    constexpr auto operator<=>(const CartNumber&) const = default;

private:
    uint32_t m_value;
};

} // namespace rd::domain
```

**Domain service pattern:**
```cpp
// src/domain/services/cut_rotation_service.h
#pragma once
#include "domain/entities/cut_entity.h"
#include <vector>
#include <optional>

namespace rd::domain {

class CutRotationService {
public:
    [[nodiscard]] std::optional<CutEntity> selectNextCut(
        const std::vector<CutEntity>& cuts,
        std::chrono::system_clock::time_point now) const;
};

} // namespace rd::domain
```

### Ports (`src/ports/`)

Ports define the **contracts** between the domain/application and the outside world.

**Inbound ports** (use cases — what the application offers):
```cpp
// src/ports/inbound/i_library_service.h
#pragma once
#include "domain/entities/cart_entity.h"
#include "domain/value_objects/cart_number.h"
#include <vector>
#include <optional>

namespace rd::ports::inbound {

class ILibraryService {
public:
    virtual ~ILibraryService() = default;

    virtual std::optional<domain::CartEntity> findCart(domain::CartNumber number) = 0;
    virtual std::vector<domain::CartEntity> searchCarts(const std::string& filter) = 0;
    virtual void createCart(domain::CartNumber number, domain::CartType type, const std::string& title) = 0;
    virtual void deleteCart(domain::CartNumber number) = 0;
};

} // namespace rd::ports::inbound
```

**Outbound ports** (what the application needs from infrastructure):
```cpp
// src/ports/outbound/i_cart_repository.h
#pragma once
#include "domain/entities/cart_entity.h"
#include "domain/value_objects/cart_number.h"
#include <vector>
#include <optional>

namespace rd::ports::outbound {

class ICartRepository {
public:
    virtual ~ICartRepository() = default;

    virtual std::optional<domain::CartEntity> findByNumber(domain::CartNumber number) = 0;
    virtual std::vector<domain::CartEntity> findAll() = 0;
    virtual void save(const domain::CartEntity& cart) = 0;
    virtual void remove(domain::CartNumber number) = 0;
};

} // namespace rd::ports::outbound
```

**MUST:**
- Be pure virtual classes with virtual destructor
- Use `I` prefix naming: `ICartRepository`, `IAudioEngine`
- Reference only domain types in signatures (no Qt types, no SQL types)
- Be header-only (no `.cpp` files for port definitions)

**MUST NOT:**
- Contain any implementation logic
- Reference any specific technology (no `QSqlDatabase`, no `QAudioOutput`)

### Adapters (`src/adapters/`)

Adapters are **concrete implementations** of port interfaces. This is where Qt, SQL, network, and platform code lives.

**Persistence adapter pattern:**
```cpp
// src/adapters/persistence/sql_cart_repository.h
#pragma once
#include "ports/outbound/i_cart_repository.h"
#include <QSqlDatabase>

namespace rd::adapters::persistence {

class SqlCartRepository : public ports::outbound::ICartRepository {
public:
    explicit SqlCartRepository(QSqlDatabase db);

    std::optional<domain::CartEntity> findByNumber(domain::CartNumber number) override;
    std::vector<domain::CartEntity> findAll() override;
    void save(const domain::CartEntity& cart) override;
    void remove(domain::CartNumber number) override;

private:
    QSqlDatabase m_db;
};

} // namespace rd::adapters::persistence
```

**UI adapter pattern (QML bridge):**
```cpp
// src/adapters/ui/cart_list_model.h
#pragma once
#include "ports/inbound/i_library_service.h"
#include <QAbstractListModel>

namespace rd::adapters::ui {

class CartListModel : public QAbstractListModel {
    Q_OBJECT
    Q_PROPERTY(int count READ rowCount NOTIFY countChanged)

public:
    explicit CartListModel(ports::inbound::ILibraryService& service, QObject* parent = nullptr);

    // QAbstractListModel interface
    int rowCount(const QModelIndex& parent = {}) const override;
    QVariant data(const QModelIndex& index, int role) const override;
    QHash<int, QByteArray> roleNames() const override;

signals:
    void countChanged();
    void errorOccurred(const QString& code, const QString& message);

private:
    ports::inbound::ILibraryService& m_service;
    std::vector<domain::CartEntity> m_carts;
};

} // namespace rd::adapters::ui
```

**MUST:**
- Implement exactly one port interface per adapter class
- Handle all technology-specific error conditions and translate to domain terms or error signals
- Use constructor injection for all dependencies
- Contain all Qt, SQL, network, filesystem code — nowhere else

**MUST NOT:**
- Contain business logic (delegate to domain services)
- Depend on other adapters (adapters are independent, composed in app layer)
- Expose Qt types in port interfaces

### Application Layer (`src/app/`)

The composition root. Implements inbound ports by orchestrating domain logic and outbound ports.

```cpp
// src/app/library_service.h
#pragma once
#include "ports/inbound/i_library_service.h"
#include "ports/outbound/i_cart_repository.h"
#include "domain/services/cut_rotation_service.h"
#include <memory>

namespace rd::app {

class LibraryService : public ports::inbound::ILibraryService {
public:
    explicit LibraryService(std::unique_ptr<ports::outbound::ICartRepository> repository);

    std::optional<domain::CartEntity> findCart(domain::CartNumber number) override;
    std::vector<domain::CartEntity> searchCarts(const std::string& filter) override;
    void createCart(domain::CartNumber number, domain::CartType type, const std::string& title) override;
    void deleteCart(domain::CartNumber number) override;

private:
    std::unique_ptr<ports::outbound::ICartRepository> m_repository;
    domain::CutRotationService m_rotationService;
};

} // namespace rd::app
```

**MUST:**
- Receive all dependencies via constructor (dependency injection)
- Own outbound port implementations via `std::unique_ptr`
- Coordinate domain logic — never duplicate it

**MUST NOT:**
- Contain domain rules (belongs in `domain/services/`)
- Directly use Qt, SQL, or any framework API (only through outbound ports)

### UI Layer (`src/ui/`)

Pure QML. Receives data from adapter/ui models. Sends user actions to adapter/ui controllers.

**MUST:**
- Be pure QML/JavaScript — no C++ in this directory
- Bind to C++ models/controllers exposed from `adapters/ui/`
- Follow the design system tokens from steering `design.md`
- Handle only presentation concerns (layout, animation, visual state)

**MUST NOT:**
- Contain business logic (no cart validation in QML, no scheduling rules)
- Make direct network/database calls
- Import C++ headers

---

## Error Propagation Architecture

No C++ exceptions in the codebase. Errors flow through **Qt signals** carrying structured error information.

```cpp
// src/domain/value_objects/error_info.h (domain — pure C++)
#pragma once
#include <string>

namespace rd::domain {

enum class ErrorSeverity { Warning, Error, Critical };
enum class ErrorCategory { Validation, NotFound, Conflict, Hardware, Network, Internal };

struct ErrorInfo {
    ErrorCategory category;
    ErrorSeverity severity;
    std::string code;       // machine-readable: "CART_NOT_FOUND"
    std::string message;    // human-readable: "Cart 001234 does not exist"
    std::string context;    // optional extra detail
};

} // namespace rd::domain
```

**Propagation path:**
1. **Domain** detects error → returns `std::optional` / error struct (no exceptions)
2. **Application service** translates domain result → emits error signal or returns
3. **UI adapter** catches error → emits `errorOccurred(QString code, QString message)` signal
4. **QML** receives signal → displays appropriate error UI

---

## Dependency Injection (Composition Root)

All wiring happens in `src/app/` at application startup. No service locators, no global singletons.

```cpp
// src/app/application.cpp — composition root
auto db = QSqlDatabase::addDatabase("QSQLITE");
auto cartRepo = std::make_unique<SqlCartRepository>(db);
auto libraryService = std::make_unique<LibraryService>(std::move(cartRepo));
auto cartModel = new CartListModel(*libraryService, &engine);
// expose to QML
engine.rootContext()->setContextProperty("cartModel", cartModel);
```

---

## Build System Enforcement

QMake enforces the dependency rule via per-subdirectory `.pro` files:

```qmake
# src/domain/domain.pro
TEMPLATE = lib
CONFIG += staticlib c++20
QT -= core gui                     # Domain is pure C++ — NO Qt
INCLUDEPATH += $$PWD/..

# src/ports/ports.pro
TEMPLATE = lib
CONFIG += staticlib c++20
QT -= core gui                     # Ports are pure C++ — NO Qt
DEPENDPATH += $$PWD/../domain
INCLUDEPATH += $$PWD/..

# src/adapters/adapters.pro
TEMPLATE = lib
CONFIG += staticlib c++20
QT += core sql multimedia          # Adapters USE Qt
LIBS += -L$$OUT_PWD/../domain -lrd_domain
LIBS += -L$$OUT_PWD/../ports -lrd_ports
INCLUDEPATH += $$PWD/..

# src/app/app.pro
TEMPLATE = lib
CONFIG += staticlib c++20
QT += core                         # Minimal Qt for signal/slot in app services
LIBS += -L$$OUT_PWD/../domain -lrd_domain
LIBS += -L$$OUT_PWD/../ports -lrd_ports
# app links ports (interfaces) NOT adapters — adapters are injected at runtime
INCLUDEPATH += $$PWD/..
```

If a domain file accidentally includes `<QObject>`, the build fails because `QT -= core gui`. This is intentional.

---

## Testing Implications

| Layer | Test type | Framework | Needs Qt? |
|-------|-----------|-----------|-----------|
| `domain/` | Unit | Qt Test (or pure C++ test) | No |
| `ports/` | N/A (interfaces) | — | — |
| `app/` | Unit + Integration | Qt Test | Minimal (mock outbound ports) |
| `adapters/` | Integration | Qt Test | Yes |
| `ui/` | E2E | qt-vnc-agent | Yes (full app) |

Domain tests are the fastest. They compile and run without Qt. Mock outbound ports to test application services in isolation.

---

## Quick Reference: "Where Does This Code Go?"

| I need to... | Layer | Directory |
|--------------|-------|-----------|
| Define what a Cart is | Domain | `src/domain/entities/` |
| Define CartNumber with equality | Domain | `src/domain/value_objects/` |
| Implement cut rotation rules | Domain | `src/domain/services/` |
| Define "find cart by number" contract | Port (outbound) | `src/ports/outbound/` |
| Define "library search" use case | Port (inbound) | `src/ports/inbound/` |
| Query the database for carts | Adapter | `src/adapters/persistence/` |
| Expose cart list to QML | Adapter | `src/adapters/ui/` |
| Orchestrate create-cart workflow | App | `src/app/` |
| Render the cart list | UI | `src/ui/views/` |
| Wire everything together at startup | App | `src/app/application.cpp` |

---
_This file is the architectural law. If code violates these rules, it is a bug — regardless of whether it works._
