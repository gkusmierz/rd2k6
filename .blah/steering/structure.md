# Project Structure

## Organization Philosophy

Domain-module organization within a layered architecture. Each domain (Albums, Photos, Tags, Sharing, Search) is a self-contained module with its own controller, service, and repository. Infrastructure concerns (file storage, job queue) are abstracted behind adapter interfaces.

## Directory Patterns

### Domain Modules
**Pattern**: Each domain gets its own module directory containing controller, service, and repository  
**Purpose**: Keep domain logic cohesive and boundaries clear  
**Example**: An Albums module contains `AlbumController`, `AlbumService`, and `AlbumRepository`

### API Layer (Controllers)
**Purpose**: HTTP concern handling -- request parsing, response formatting, status codes  
**Rule**: Controllers contain no business logic; they delegate entirely to services

### Service Layer
**Purpose**: Business logic, validation, orchestration  
**Rule**: Services return `Result<T, E>` types; services communicate with repositories and adapters

### Repository Layer
**Purpose**: Data access and persistence  
**Rule**: Repositories abstract database queries; no business logic

### Infrastructure Adapters
**Purpose**: Abstract external systems (file storage, job queues)  
**Example**: `FileStorageAdapter` provides a uniform interface over local filesystem or S3

### Background Workers
**Purpose**: Asynchronous processing tasks  
**Example**: `ThumbnailWorker` dequeues jobs, generates thumbnails, updates records

## Naming Conventions

- **Services**: `{Domain}Service` (e.g., `AlbumService`, `PhotoService`)
- **Controllers**: `{Domain}Controller` (e.g., `AlbumController`)
- **Repositories**: `{Domain}Repository` (e.g., `AlbumRepository`)
- **Adapters**: `{Purpose}Adapter` (e.g., `FileStorageAdapter`)
- **Workers**: `{Task}Worker` (e.g., `ThumbnailWorker`)
- **Interfaces**: Named by their contract, matching implementation names
- **Error types**: `{Category}Error` (e.g., `ValidationError`, `NotFoundError`)

## API Route Patterns

```
/api/{resource}              -- collection (GET list, POST create)
/api/{resource}/:id          -- individual (GET, PUT, DELETE)
/api/{parent}/:parentId/{child}  -- nested resources
```

Examples:
- `POST /api/albums` -- create album
- `GET /api/albums/:albumId/photos` -- list photos in album
- `POST /api/photos/:photoId/tags` -- add tag to photo

## Data Model Patterns

- **Aggregates**: Album is the aggregate root; deletion cascades to photos, tags, and shares
- **Polymorphic references**: Shares use `(resourceType, resourceId)` instead of separate join tables
- **Compound uniqueness**: Used for PhotoTag `(photoId, tag)` and Share `(resourceType, resourceId, recipientUserId)`
- **Pagination**: 1-based pages, max 100 items per page, consistent `PaginatedList<T>` wrapper

## Code Organization Principles

- Domain modules are independent; cross-domain communication goes through service interfaces
- All external systems are accessed through adapter abstractions
- Authentication is handled at the API layer; authorization at the service layer
- Search queries are always scoped to resources the user owns or has been granted access to

---
_Document patterns, not file trees. New files following patterns should not require updates_
