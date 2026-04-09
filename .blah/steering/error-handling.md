# Error Handling Standards

## Philosophy

**No C++ exceptions.** Qt disables exceptions by default, and broadcast automation systems cannot tolerate stack unwinding during live playout. All errors are handled explicitly through return values and Qt signal/slot propagation.

Errors are first-class events, not exceptional interruptions. A well-behaved component detects a problem, wraps it in structured error info, and signals it for upstream handling — without crashing, throwing, or silently swallowing.

## Error Classification

| Category | When | Example |
|----------|------|---------|
| `Validation` | Input fails business rules | Cart number out of range, empty title |
| `NotFound` | Requested resource doesn't exist | Cart not in database, audio file missing |
| `Conflict` | State prevents operation | Cart locked by another user, duplicate number |
| `Hardware` | Device failure or unavailability | Audio device disconnected, GPIO timeout |
| `Network` | Communication failure | RPC timeout, IPC daemon unreachable |
| `Internal` | Unexpected/unrecoverable condition | Corrupt database row, null invariant violation |

## Error Shape (Domain — Pure C++)

```cpp
// src/domain/value_objects/error_info.h
namespace rd::domain {

enum class ErrorSeverity { Warning, Error, Critical };

enum class ErrorCategory {
    Validation, NotFound, Conflict,
    Hardware, Network, Internal
};

struct ErrorInfo {
    ErrorCategory category;
    ErrorSeverity severity;
    std::string code;       // machine-readable: "CART_NOT_FOUND"
    std::string message;    // human-readable for operators
    std::string context;    // optional diagnostic detail
};

} // namespace rd::domain
```

This struct lives in domain and has no Qt dependencies.

## Propagation by Layer

### Domain Layer
Returns error information via return types. No signals (domain has no Qt).

```cpp
// Option A: std::optional (when absence is the only error)
[[nodiscard]] std::optional<CutEntity> selectNextCut(...) const;

// Option B: struct with success/error (when error details matter)
struct CreateCartResult {
    std::optional<CartEntity> cart;
    std::optional<ErrorInfo> error;
};
[[nodiscard]] CreateCartResult createCart(...);
```

### Application Layer
Translates domain results into signal emissions or return values.

```cpp
class LibraryService : public QObject, public ILibraryService {
    Q_OBJECT
signals:
    void errorOccurred(const rd::domain::ErrorInfo& error);

public:
    void deleteCart(domain::CartNumber number) override {
        auto cart = m_repository->findByNumber(number);
        if (!cart) {
            emit errorOccurred({
                ErrorCategory::NotFound,
                ErrorSeverity::Error,
                "CART_NOT_FOUND",
                "Cart " + std::to_string(number.value()) + " does not exist",
                ""
            });
            return;
        }
        m_repository->remove(number);
    }
};
```

### Adapter Layer
Catches technology-specific errors (SQL failures, I/O errors) and translates to domain ErrorInfo.

```cpp
void SqlCartRepository::save(const domain::CartEntity& cart) {
    QSqlQuery query(m_db);
    query.prepare("INSERT OR REPLACE INTO CART ...");
    // ...
    if (!query.exec()) {
        emit errorOccurred({
            ErrorCategory::Internal,
            ErrorSeverity::Error,
            "DB_WRITE_FAILED",
            "Failed to save cart " + std::to_string(cart.number().value()),
            query.lastError().text().toStdString()
        });
        return;
    }
}
```

### UI Layer (QML)
Connects to `errorOccurred` signals and displays appropriate UI feedback.

```qml
Connections {
    target: cartModel
    function onErrorOccurred(code, message) {
        errorToast.show(message)
    }
}
```

## Rules

**MUST:**
- Always emit structured `ErrorInfo` — never emit bare strings
- Always include a machine-readable `code` field
- Handle errors at the nearest appropriate level — don't let them propagate silently
- Log all `Critical` severity errors immediately
- Use `Qt::QueuedConnection` for error signals crossing thread boundaries
- Test error paths — verify correct error signals are emitted for each failure mode

**MUST NOT:**
- Use `throw` / `try` / `catch` anywhere in the codebase
- Use `qFatal()` in production code (it terminates the process)
- Swallow errors silently (every error must reach a handler)
- Include sensitive information in error messages (no passwords, tokens)
- Block the audio thread to emit error signals (use queued connections)

## Severity Guidelines

| Severity | Meaning | Action |
|----------|---------|--------|
| `Warning` | Degraded but functional | Log, show non-intrusive UI indicator |
| `Error` | Operation failed | Log, show error toast/dialog, operation aborted |
| `Critical` | System integrity at risk | Log, show modal alert, consider graceful shutdown |

## Logging

- Log all errors with: timestamp, category, severity, code, message, context
- `Warning`: log at WARN level
- `Error`: log at ERROR level
- `Critical`: log at ERROR level + alert mechanism
- Never log passwords, tokens, or user credentials
- Include request/operation context for tracing

---
_Errors as events, not exceptions. Every failure is observable, traceable, and recoverable._
