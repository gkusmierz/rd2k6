# Product Overview

Rivendell 2.0 is a complete reimplementation of the Rivendell radio automation platform — a professional broadcast automation system used by radio stations worldwide for playout, scheduling, content management, and live-assist operations.

## Core Capabilities

- **Audio Playout**: Real-time audio playback with precise timing, crossfades, and segue control
- **Log Management**: Broadcast log creation, editing, and execution with voice tracking
- **Content Library**: Cart/cut-based media asset management with metadata, scheduling codes, and group organization
- **Scheduling**: Clock-based automatic log generation with traffic/music merge
- **Catch Events**: Timed recording, switching, and upload operations
- **Administration**: Multi-station, multi-user configuration with granular permissions
- **Podcasting**: Automated RSS feed generation and publishing from broadcast content

## Target Users

- **Broadcast operators**: Live-assist playout, sound panel triggering, voice tracking
- **Audio engineers**: Recording, editing, CD ripping, format management
- **Program directors**: Log scheduling, clock management, content rotation
- **System administrators**: Station configuration, user management, hardware setup
- **Content managers**: Podcast publishing, feed management

## Mission-Critical Context

This is **mission-critical broadcast software**. Failures during live broadcast are unacceptable. Design decisions must prioritize:
1. **Reliability** — no crashes, no undefined behavior, graceful degradation
2. **Deterministic timing** — audio playout timing is non-negotiable
3. **Concurrent safety** — multiple operators and daemons share state simultaneously
4. **Operational clarity** — operators must always know system state at a glance

## Scope: Reimplementation, Not Clone

Rivendell 2.0 preserves the **domain model and operational workflows** of the original while modernizing:
- Original: C++/Qt4, Linux-only, ALSA/JACK, MySQL, tightly coupled
- New: C++20/Qt6, cross-platform, portable audio, database-agnostic, hexagonal architecture

Domain knowledge is extracted from the original codebase via the `src-to-sdd` pipeline. Implementation is entirely new — no legacy code is carried over.

## Platform Independence

The original Rivendell is Linux-only. Rivendell 2.0 explicitly rejects platform lock-in. The application must run on any platform where Qt6 is available (Linux, macOS, Windows). All platform-specific abstractions go through Qt's portable APIs or dedicated adapter interfaces.

---
_Focus on patterns and purpose, not exhaustive feature lists_
