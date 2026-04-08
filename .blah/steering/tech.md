# Technology Stack

## Architecture

Layered REST API with domain modules. Each domain (Albums, Photos, Tags, Sharing, Search) owns its controller, service, and repository layers. A background worker handles asynchronous thumbnail generation. File storage is separated from metadata storage.

## Core Technologies

- **Language**: TypeScript (frontend and backend)
- **Runtime**: Node.js
- **Backend**: Layered REST API with domain-separated modules
- **Frontend**: SPA (framework-agnostic at design level)
- **Database**: Relational (PostgreSQL recommended)
- **File Storage**: Object/file storage (local filesystem or S3-compatible)
- **Background Processing**: In-process job queue for thumbnail generation

## Development Standards

### Type Safety
- All service methods return `Result<T, E>` discriminated unions -- no exceptions for expected error conditions
- Typed interfaces for all service contracts, data models, and API request/response shapes
- Explicit error types: `ValidationError`, `NotFoundError`, `ForbiddenError`, `StorageError`, `ProcessingError`

### Error Handling Pattern
- Services return Result types; controllers map error variants to HTTP status codes
- All error responses include correlation IDs for tracing
- Field-level validation details in 400 responses

### File Validation
- File format validated by magic bytes inspection, not Content-Type headers
- Uploaded filenames are sanitized and never used as storage keys
- File size limited to a configured maximum (recommended: 20 MB)

## Key Technical Decisions

- **Domain modules over microservices**: CRUD-heavy application benefits from simplicity of a monolith with clear internal boundaries
- **Async thumbnail generation**: Upload response returns immediately with `thumbnailStatus: pending`; client polls for readiness
- **Polymorphic sharing model**: Single shares table with `resourceType` discriminator supports both album and photo sharing
- **Result types over exceptions**: All expected errors are typed and returned, not thrown
- **Separated file storage**: Binary files stored externally (not in the relational database) for efficiency

## Testing Strategy

- **Unit**: Service-level tests for validation, business rules, and orchestration
- **Integration**: End-to-end flows (upload, cascade deletion, share/revoke, tag-based search)
- **E2E**: Full user workflows through the API and frontend
- **Performance**: Concurrent uploads, large album pagination, thumbnail worker throughput

---
_Document standards and patterns, not every dependency_
