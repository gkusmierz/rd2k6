# Requirements Document

## Introduction

RDCastManager is the podcast and RSS feed management application within the Rivendell radio automation platform. It enables content managers to browse permitted podcast feeds, manage individual cast (episode) items within those feeds, edit episode metadata, and publish content via multiple source workflows (from cart, file, or rendered log). The application enforces role-based feed access, supports superfeed aggregation, and handles the full lifecycle of podcast items from posting through expiration.

## Requirements

### Requirement 1: Feed List and Access Control

**Objective:** As a content manager, I want to see only the podcast feeds I have permission to access, so that feed management is restricted to authorized users.

#### Acceptance Criteria

1. When the application starts, the system shall load the list of feeds the current user has permission to access.
2. If the user has no feed permissions, then the system shall display an empty feed list.
3. When a feed is displayed in the list, the system shall show its key name, feed name, active/total cast count, public URL, and feed image thumbnail.
4. Where a feed is a superfeed, the system shall display "[superfeed]" instead of an active/total count.
5. When the current user changes, the system shall refresh the feed list to reflect the new user's permissions.
6. When a notification of type Feed is received, the system shall refresh the affected feed item in the list.

### Requirement 2: Feed Navigation and Actions

**Objective:** As a content manager, I want to open feeds, copy their public URL, and generate reports, so that I can manage and share feed information efficiently.

#### Acceptance Criteria

1. When the user double-clicks a feed or clicks the "View Feed" button, the system shall open the cast item list for the selected feed.
2. When the user clicks "Copy URL to Clipboard", the system shall copy the selected feed's public URL to the system clipboard.
3. When the user clicks "Online Feed Report", the system shall generate a report for the selected feed.
4. While no feed is selected, the system shall disable the "View Feed", "Copy URL to Clipboard", and "Online Feed Report" buttons.

### Requirement 3: Cast Item List Management

**Objective:** As a content manager, I want to browse, filter, and manage cast items within a feed, so that I can maintain podcast episode content.

#### Acceptance Criteria

1. When the cast list opens for a feed, the system shall display all cast items with their title, status indicator, start date, expiration date, length, feed key, category, posted-by information, and content hash.
2. When the user types in the filter field, the system shall filter the cast list to show only items matching the entered text.
3. When the user toggles the "Active" checkbox, the system shall filter the cast list to show only active (non-expired) items.
4. The system shall display a status indicator for each cast: green for active with current or past effective date, blue for active with future effective date, red for pending, and white for expired.
5. When a notification of type Feed Item is received, the system shall refresh the cast list.

### Requirement 4: Superfeed Restrictions

**Objective:** As a content manager, I want superfeeds to be read-only, so that aggregated feed content cannot be accidentally modified.

#### Acceptance Criteria

1. While a feed is marked as a superfeed, the system shall disable the "Post From Cart", "Post From File", "Post From Log", "Edit", and "Delete" buttons.

### Requirement 5: Podcast Privilege Enforcement

**Objective:** As a system administrator, I want cast operations to be restricted by user privileges, so that unauthorized modifications are prevented.

#### Acceptance Criteria

1. If the user does not have the add-podcast privilege, then the system shall disable the "Post From Cart", "Post From File", and "Post From Log" buttons.
2. If the user does not have the edit-podcast privilege, then the system shall disable the "Edit" button.
3. If the user does not have the delete-podcast privilege, then the system shall disable the "Delete" button.
4. When the current user changes, the system shall re-evaluate all privilege-based button states.

### Requirement 6: Post Cast from Cart

**Objective:** As a content manager, I want to create a podcast episode from an existing cart, so that broadcast content can be published as a podcast.

#### Acceptance Criteria

1. When the user clicks "Post From Cart" and selects a cut, the system shall upload the audio and create a new cast item.
2. When the post succeeds, the system shall open the episode editor for metadata entry.
3. When the post succeeds, the system shall send add-item and modify-feed notifications.
4. If the post fails, then the system shall display an error message with the failure details.
5. While a post operation is in progress, the system shall display a progress indicator.

### Requirement 7: Post Cast from File

**Objective:** As a content manager, I want to create a podcast episode from an audio file, so that external content can be published to the feed.

#### Acceptance Criteria

1. When the user clicks "Post From File" and selects an audio file, the system shall upload the file and create a new cast item.
2. When the post succeeds, the system shall open the episode editor for metadata entry.
3. When the post succeeds, the system shall send add-item and modify-feed notifications.
4. If the post fails, then the system shall display an error message with the failure details.
5. While a post operation is in progress, the system shall display a progress indicator.

### Requirement 8: Post Cast from Rendered Log

**Objective:** As a content manager, I want to create a podcast episode from a rendered broadcast log, so that recorded shows can be published as podcasts.

#### Acceptance Criteria

1. When the user clicks "Post From Log", the system shall present a log selection interface.
2. When a log is selected, the system shall present render options including start time mode, stop handling, and event range selection.
3. When configuring render options, the system shall allow the user to select a contiguous range of log events.
4. If no log events are selected, then the system shall display a message "At least one log event must be selected."
5. When the render completes and post succeeds, the system shall open the episode editor for metadata entry.
6. When the post succeeds, the system shall send add-item and modify-feed notifications.
7. If the post fails, then the system shall display an error message with the failure details.

### Requirement 9: Cast Item Editing

**Objective:** As a content manager, I want to edit podcast episode metadata, so that published episodes have accurate information.

#### Acceptance Criteria

1. When the user opens the episode editor, the system shall display the episode's origin, title, author, category, link, description, explicit content flag, image, comments URL, air date/time, expiration settings, and active status.
2. The system shall display the origin field as read-only.
3. When the user clicks OK, the system shall save all modified metadata to the database and conditionally update the remote RSS feed.
4. If expiration is enabled and the expiration date is before the air date, then the system shall display an error "Item expiration cannot be prior to Air Date/Time!" and keep the editor open.
5. If expiration is enabled and the expiration date is in the past, then the system shall display an error "Item expiration must be in the future!" and keep the editor open.
6. While a cast item has expired status, the system shall disable the expiration mode selector and the active checkbox.

### Requirement 10: Cast Item Deletion

**Objective:** As a content manager, I want to delete podcast episodes with proper confirmation, so that accidental deletions are prevented and remote resources are cleaned up.

#### Acceptance Criteria

1. When the user clicks "Delete" on a selected cast item, the system shall display a confirmation dialog.
2. If the user declines the confirmation, then the system shall abort the deletion.
3. When the user confirms deletion, the system shall attempt to remove the remote audio file.
4. If the remote audio removal fails, then the system shall warn the user and ask whether to continue with the local deletion.
5. When the local podcast record is deleted, the system shall update the feed's last build timestamp and regenerate the remote RSS feed.
6. If the remote RSS regeneration fails, then the system shall display a warning "Unable to update remote XML data!"

### Requirement 11: Application Initialization and Error Handling

**Objective:** As a content manager, I want the application to validate its environment at startup, so that configuration problems are reported immediately.

#### Acceptance Criteria

1. If the application configuration cannot be loaded, then the system shall display a critical error and exit.
2. If an unknown command-line option is provided, then the system shall display a critical error with the option name and exit.
3. If a temporary directory cannot be created for operations, then the system shall display a warning message.
