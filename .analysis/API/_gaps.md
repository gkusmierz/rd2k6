# Extraction Gaps: API

## Gap 1: Delete vs Remove Podcast distinction

- **Section:** Components and Interfaces / MediaPublishService
- **Missing:** The semantic distinction between `RD_DeletePodcast` (CMD 39) and `RD_RemovePodcast` (CMD 41) is not documented. Both appear to remove a podcast but use different server command IDs. It is unclear whether one deletes the file while the other removes the metadata record, or if they serve different purposes.
- **Source:** Business Rules (Section E) should have documented the behavioral difference between these two operations.
- **Impact:** Requirement 7 acceptance criteria 3 and 4 may describe redundant operations. The implementation may need clarification from the server-side WEB artifact to determine the correct semantics.

## Gap 2: Podcast/RSS/Image data structures for listing

- **Section:** Data Models / Domain Model
- **Missing:** The API provides publish/upload/remove operations for podcasts, RSS feeds, and images, but no data structures for listing or reading these entities. It is unclear whether these entities are managed elsewhere or whether the API coverage is intentionally limited.
- **Source:** API Surface (Section B) -- no list/read functions exist for podcast, RSS, or image entities.
- **Impact:** Low. The CRUD mapping table in the semantic context correctly shows no Read operations for these entities. The design accurately reflects the available API surface.
