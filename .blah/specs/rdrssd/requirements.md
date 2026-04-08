# Requirements Document

## Introduction

The RSS Feed Processor (rdrssd) is a background daemon responsible for managing the lifecycle of RSS/Podcast feeds in the Rivendell radio automation system. It periodically scans all non-superfeed entries, detects newly effective or expired podcast episodes, removes expired content (both audio files and database records), regenerates RSS XML documents, and broadcasts change notifications to other system components. It is a headless service with no user interface.

## Requirements

### Requirement 1: Daemon Lifecycle Management

**Objective:** As a system administrator, I want the RSS feed processor daemon to start safely with validated configuration and appropriate security privileges, so that it operates reliably without elevated permissions.

#### Acceptance Criteria

1. When the daemon starts as the root user, the system shall drop to the configured non-privileged group and user identities before entering the processing loop.
2. If setting the group identity fails during privilege dropping, then the system shall log the failure and exit with code 1.
3. If setting the user identity fails during privilege dropping, then the system shall log the failure and exit with code 1.
4. When the `--process-interval` command-line argument is provided with a valid positive integer, the system shall use that value (in seconds) as the polling interval between feed processing cycles.
5. If the `--process-interval` command-line argument contains a non-numeric or invalid value, then the system shall print an error message and exit with code 1.
6. If an unrecognized command-line option is provided, then the system shall log the unknown option and exit with code 2.
7. If the database connection cannot be established during startup, then the system shall print the error and exit with code 1.
8. When startup completes successfully, the system shall connect to the IPC daemon and begin the periodic processing timer with an initial delay of zero.
9. Where no `--process-interval` argument is provided, the system shall default to a 30-second polling interval.

### Requirement 2: Feed Processing and Podcast Lifecycle

**Objective:** As a content manager, I want expired podcast episodes to be automatically purged and RSS feeds to be regenerated when content changes, so that published feeds always reflect the current state of available episodes.

#### Acceptance Criteria

1. When the processing timer fires, the system shall query all feeds that are not marked as superfeeds and process each one individually.
2. When a feed is marked as a superfeed, the system shall exclude it from processing.
3. When a podcast episode has an expiration datetime in the past, the system shall remove the episode's audio from storage.
4. When a podcast episode has been expired and its audio removed, the system shall delete the episode record from the database.
5. When an expired podcast episode is purged, the system shall broadcast a feed modification notification via inter-process communication.
6. When an expired podcast episode is purged, the system shall broadcast a feed item deletion notification via inter-process communication.
7. When an expired podcast episode is purged, the system shall log the purge at informational level.
8. If an audio file removal fails for an expired episode, then the system shall log a warning but still proceed to delete the episode record from the database.
9. When a podcast episode's effective datetime has passed since the feed was last built, the system shall regenerate and upload the feed's RSS XML document.
10. When a podcast episode's expiration datetime has passed since the feed was last built, the system shall regenerate and upload the feed's RSS XML document.
11. When the RSS XML document is successfully regenerated and uploaded, the system shall broadcast a feed modification notification.
12. If the RSS XML document regeneration or upload fails, then the system shall log a warning identifying the feed and the triggering episode.
13. When all feeds have been processed, the system shall restart the processing timer with the configured polling interval.
