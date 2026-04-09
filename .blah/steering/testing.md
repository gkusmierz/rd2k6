# Testing Standards

## Philosophy
- Test behavior, not implementation
- Domain tests are fast and framework-free — they validate business rules in pure C++
- Adapter tests prove the integration with real infrastructure (database, audio, network)
- E2E tests prove the user workflows end-to-end through the actual QML UI
- Cover mission-critical paths deeply (playout timing, cut rotation, concurrent access)

## Framework

**Qt Test** for all C++ tests. Single framework, consistent across layers.

```cpp
#include <QTest>

class TestCutRotation : public QObject {
    Q_OBJECT
private slots:
    void selectsNextCutByWeight();
    void skipsExpiredCuts();
    void returnsNulloptWhenNoCutsValid();
};
```

## Organization

Mirror the `src/` structure under `tests/`:

```
tests/
├── unit/
│   ├── domain/         ← pure C++ tests, no Qt infrastructure
│   │   ├── test_cart_entity.cpp
│   │   ├── test_cart_number.cpp
│   │   └── test_cut_rotation_service.cpp
│   └── adapters/       ← adapter tests with mock ports
│       ├── test_sql_cart_repository.cpp
│       └── test_cart_list_model.cpp
├── integration/        ← multi-layer tests with real adapters
│   ├── test_library_workflow.cpp
│   └── test_playout_sequence.cpp
└── e2e/                ← qt-vnc-agent UI automation
    ├── test_cart_browsing.py
    └── test_recording_flow.py
```

Naming: `test_<module_name>.cpp` — one test file per source module.

## Test Types

### Unit: Domain (`tests/unit/domain/`)
- Pure C++ — these tests MUST compile without linking Qt
- Test domain entities, value objects, and domain services
- No mocks needed — domain has no dependencies
- Fastest tests in the suite

### Unit: Adapters (`tests/unit/adapters/`)
- Test adapters with mock port implementations
- Mock outbound ports to test application services in isolation
- Use Qt Test for adapter tests that involve Qt types

### Integration (`tests/integration/`)
- Real database (SQLite in-memory), real adapters, real wiring
- Test multi-layer workflows: create cart → find cart → delete cart
- Slower, but prove the adapters work with real infrastructure

### E2E (`tests/e2e/`)
- Uses **qt-vnc-agent** — the application runs with `-platform vnc:port=5900`
- An MCP agent connects via VNC and simulates user interactions (click, type, navigate)
- Equivalent to Playwright for Qt/QML applications
- Tests complete user workflows: browse library → open cart → edit → save
- Slowest tests — run only for critical user journeys

## Structure (AAA)

```cpp
void TestCartEntity::updatesTitle()
{
    // Arrange
    auto cart = CartEntity(CartNumber(1000), CartType::Audio, "Original");

    // Act
    cart.updateTitle("Updated");

    // Assert
    QCOMPARE(cart.title(), std::string("Updated"));
}
```

## Mocking & Test Doubles

- **Domain layer**: No mocks needed (no dependencies)
- **Application layer**: Mock outbound ports (implement interface, record calls)
- **Adapter layer**: Use in-memory SQLite, stub audio devices
- **Never mock the system under test**
- **No mocking frameworks** — write simple manual mocks implementing port interfaces:

```cpp
class MockCartRepository : public ICartRepository {
public:
    std::vector<domain::CartEntity> savedCarts;

    void save(const domain::CartEntity& cart) override {
        savedCarts.push_back(cart);
    }
    // ... other methods
};
```

## Thread Safety Testing

- Test concurrent access to shared services with `std::thread` + barriers
- Verify signal/slot error propagation across thread boundaries
- Stress-test audio callback paths for allocation-freedom
- Use TSAN (Thread Sanitizer) in CI builds

## Coverage

- Domain layer: high coverage (business rules are the core value)
- Adapters: cover happy path + error mapping
- E2E: cover critical user journeys only (login → main workflow → exit)
- Enforce thresholds in CI; exceptions require review rationale

---
_Focus on patterns and decisions. Tool-specific config lives in .pro files._
