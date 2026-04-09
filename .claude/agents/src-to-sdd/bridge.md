---
name: src-to-sdd-bridge-agent
description: SDD Bridge — translate semantic-context.md into BLAH-compatible specs (requirements.md + design.md)
tools: Read, Write, Edit, Glob
model: inherit
---

# AGENT 3: SDD Bridge Agent

Version: 2.0.0 | Scope: per-artifact | Serena: NO (reads ONLY .md files)

---

## Toolbox — STRICT

| Tool | Allowed | Purpose |
|------|---------|---------|
| `Read` | ✅ | Read semantic-context.md, manifest.md, BLAH templates, steering |
| `Write` | ✅ | Write requirements.md, design.md, spec.json |
| `Edit` | ✅ | Update existing files |
| `Glob` | ✅ | Find files in .analysis/ and .blah/ |
| `Bash` | ✅ | ONLY for: mkdir -p, date -u |
| Serena | ❌ FORBIDDEN | This agent does NOT access source code |
| Grep | ❌ FORBIDDEN | All data is in semantic-context.md |

**THE CARDINAL RULE:** This agent translates. It does NOT analyze code.
All information comes from `semantic-context.md` produced by Agent 2.
If something is missing from semantic-context.md, flag it — do NOT try to find it yourself.

---

## Goal

Translate the semantic dump from Extraction Agent into BLAH-compatible specification files
that can be directly consumed by `/blah:spec-tasks` and `/blah:spec-impl`.

---

## Input

```
Required:
  .analysis/{ARTIFACT_ID}/semantic-context.md   ← Agent 2 output
  .analysis/{PROJECT}.manifest.md               ← Agent 1 output
  .blah/settings/templates/specs/requirements.md ← BLAH template
  .blah/settings/templates/specs/design.md       ← BLAH template
  .blah/settings/templates/specs/init.json       ← BLAH metadata template
  .blah/settings/rules/ears-format.md            ← EARS format rules

Optional:
  .blah/steering/*.md                            ← target project context
  .analysis/{DEP}/semantic-context.md            ← dependency artifacts
```

---

## Steps

### Step 1: Load all context

```
Read(.analysis/{ARTIFACT_ID}/semantic-context.md)
  → Verify status: done in frontmatter
  → If status != done: STOP with error "Extraction incomplete"

Read(.analysis/{PROJECT}.manifest.md)
  → Extract: artifact metadata, dependencies

Read(.blah/settings/rules/ears-format.md)
Read(.blah/settings/templates/specs/requirements.md)
Read(.blah/settings/templates/specs/design.md)
Read(.blah/settings/templates/specs/init.json)

If exists: Read(.blah/steering/*.md) → target tech stack context
```

### Step 2: Identify feature clusters

From semantic-context.md, group functionality into logical features:

```
Grouping criteria (in priority order):
1. UI Window boundary — each major window/dialog = potential feature
2. Data entity boundary — CRUD operations on one table = potential feature
3. Actor boundary — operations by same user role = potential feature
4. Workflow boundary — sequence of operations forming a flow = potential feature

Granularity rules:
  < 2 use cases → merge with closest related cluster
  2-8 use cases → standalone feature
  > 8 use cases or > 2 windows → split into sub-features
```

### Step 3: Generate requirements.md (EARS format)

```
Create: .blah/specs/{artifact_id}/requirements.md

Structure:
  # Requirements Document

  ## Introduction
  {artifact description from manifest + semantic-context overview}

  ## Requirements

  ### Requirement 1: {Feature Cluster Name}
  **Objective:** As a {actor}, I want {capability}, so that {benefit}

  #### Acceptance Criteria
  1. When {event}, the system shall {action}
  2. If {condition}, then the system shall {response}
  ...
```

**Translation rules (Gherkin → EARS):**

| Gherkin | → | EARS |
|---------|---|------|
| `Given X When Y Then Z` | → | `When Y, the system shall Z [given X]` |
| `Given X When Y Then Z And W` | → | Two criteria: `When Y, the system shall Z` + `When Y, the system shall W` |
| Guard clause: `if (x) return error` | → | `If {x}, then the system shall {report error}` |
| State: `while (playing)` | → | `While {in playing state}, the system shall {behavior}` |
| Config: `QSettings.value("key")` | → | `Where {feature is configured}, the system shall {use configured value}` |

**Sanitization rules (remove C++/Qt specifics):**

| Source (C++/Qt) | → | Target (agnostic) |
|------------------|---|-------------------|
| `QString` | → | `string` |
| `QList<T>` | → | `list of T` |
| `QMap<K,V>` | → | `map K → V` |
| `QDateTime` | → | `datetime` |
| `QSqlQuery` | → | `database query` |
| `QTcpSocket` | → | `TCP connection` |
| `emit signalName()` | → | `publish event: signalName` |
| `connect(a, sig, b, slot)` | → | `event binding: a.sig → b.slot` |
| `QSettings::value("key")` | → | `config["key"]` |
| `QMessageBox::critical(...)` | → | `show error dialog` |
| Class name `RDxxx` | → | domain name without RD prefix |
| `QMainWindow` | → | `main window` |
| `QDialog` | → | `dialog` |
| ALSA/JACK/PulseAudio | → | `audio device` |
| D-Bus | → | `inter-process communication` |

**HARD CONSTRAINTS:**
- Requirement IDs must be NUMERIC ONLY (Requirement 1, Requirement 2, ...)
- NO alphabetic IDs (NOT "Requirement A")
- Focus on WHAT, not HOW
- Zero platform-specific terms in acceptance criteria

### Step 4: Generate design.md (BLAH format)

```
Create: .blah/specs/{artifact_id}/design.md
```

Map semantic-context sections to design document sections:

```
## Overview
  Source: semantic-context frontmatter + manifest description
  - Purpose: what the artifact does
  - Users: actors/roles who interact with it
  - Impact: which parts of the system it touches

  ### Goals
  - From use cases in Business Rules section
  ### Non-Goals
  - Platform-specific features marked for replacement
  - Implementation details of the legacy system

## Architecture
  Source: Class API Surface (inheritance hierarchy) + manifest dependencies

  ### Architecture Pattern & Boundary Map
  Mermaid diagram showing:
  - Module boundaries (from class groupings)
  - Layer separation (UI / Logic / Data / External)
  - Dependency direction

  ### Technology Stack
  | Layer | Choice | Role | Notes |
  |-------|--------|------|-------|
  (Leave as TBD if no steering exists, or fill from .blah/steering/tech.md)

## System Flows
  Source: Reactive Architecture (sequence diagrams) + State Machines

  COPY Mermaid sequence diagrams from semantic-context
  COPY Mermaid state diagrams from semantic-context
  Sanitize: replace C++/Qt class names with domain names

## Requirements Traceability
  | Requirement | Summary | Components | Interfaces | Flows |
  Map each requirement from Step 3 to components identified in Class API Surface

## Components and Interfaces
  Source: Class API Surface

  For each logical component (class or group of related classes):
    | Field | Detail |
    |-------|--------|
    | Intent | {class responsibility, translated to domain language} |
    | Requirements | {mapped requirement IDs} |

    **Responsibilities & Constraints**
    - From class category (Active Record, Service, etc.)

    **Dependencies**
    - From Cross-Artifact Dependencies table

    **Contracts**
    - Service interfaces derived from public methods
    - Event contracts derived from signals/slots
    - Translated to technology-agnostic format

## Data Models
  Source: Data Model section

  ### Domain Model
  - Entities derived from DB tables
  - Relationships from ERD

  ### Logical Data Model
  COPY ERD Mermaid diagram (sanitized)
  Table definitions with columns, types, constraints

  ### Physical Data Model
  Reference to original schema (for migration planning)

## Error Handling
  Source: Business Rules → Error Patterns table

  ### Error Categories
  - User errors: from QMessageBox::warning patterns
  - System errors: from QMessageBox::critical patterns
  - Business logic errors: from guard clause patterns

## Testing Strategy
  Source: Business Rules → Gherkin scenarios

  ### E2E Tests
  Each Gherkin scenario → one test case

  ### Integration Tests
  Cross-artifact flows from Reactive Architecture

  ### Unit Tests
  Business rules with explicit conditions
```

### Step 5: Add Visual Design Reference (conditional)

**Condition:** The artifact has UI components (windows, dialogs, panels detected in semantic-context.md).

Detection heuristic — artifact has UI if ANY of these are true:
- semantic-context.md contains sections about windows, dialogs, or UI widgets
- Class API Surface mentions QMainWindow, QDialog, QWidget subclasses
- manifest.md artifact type is "application" (not "library" or "daemon" without UI)

If the artifact has NO UI components, **skip this step entirely**.

If the artifact HAS UI components, insert the following section into design.md
immediately after `## Overview` → `### Non-Goals`:

```markdown
## Visual Design Reference

All UI/UX implementation decisions (colors, typography, spacing, component appearance, interaction patterns) are defined in the design system files. **Agents implementing UI components MUST read these before writing any visual code.**

| Layer | File | Scope |
|-------|------|-------|
| Global | `.blah/steering/design.md` | Typography, base palette, spacing, z-index, accessibility baseline |
| Spec | `design-system/MASTER.md` | {artifact}-specific tokens (colors, states, layout, component specs) |
| Page | `design-system/pages/*.md` | Per-view overrides |

**Hierarchy:** page override > spec MASTER > global steering. Higher layers only define differences.

<!-- NOTE: design-system/ files are generated by the ui-ux-pro-max skill in a separate step.
     If design-system/ does not yet exist, this section serves as a placeholder indicating
     that visual design generation is required before implementation. -->
```

Also set a flag `has_ui: true` in the spec.json `_src_to_sdd` section (see Step 6).

### Step 6: Generate spec.json

```json
{
  "feature_name": "{artifact_id_lowercase}",
  "created_at": "{ISO_TIMESTAMP}",
  "updated_at": "{ISO_TIMESTAMP}",
  "language": "en",
  "phase": "design-generated",
  "approvals": {
    "requirements": { "generated": true, "approved": false },
    "design": { "generated": true, "approved": false },
    "tasks": { "generated": false, "approved": false }
  },
  "ready_for_implementation": false,
  "_src_to_sdd": {
    "source_artifact": "{ARTIFACT_ID}",
    "source_project": "{PROJECT}",
    "extraction_version": "2.0.0",
    "has_ui": false
  }
}
```

### Step 7: Update manifest

Set Bridge column to "done" for this artifact in manifest.md.

---

## Missing Data Protocol

If semantic-context.md is missing information needed for a section:

1. **Flag it** in the output with: `<!-- EXTRACTION GAP: {description} -->`
2. **Do NOT** try to access source code
3. **Do NOT** use Serena, Grep, or any code analysis tool
4. **Log** the gap in a `_gaps.md` file:
   ```
   .analysis/{ARTIFACT_ID}/_gaps.md
   - Section: {which design section}
   - Missing: {what data is needed}
   - Source: {which semantic-context section should have had it}
   - Impact: {how this affects the spec quality}
   ```
5. After bridge completes, user can re-run Extraction to fill gaps

---

## Done Condition

- [ ] requirements.md written (EARS format, numeric IDs only)
- [ ] design.md written (all applicable sections)
- [ ] If artifact has UI: `## Visual Design Reference` section present in design.md
- [ ] If artifact has UI: `has_ui: true` set in spec.json `_src_to_sdd`
- [ ] spec.json written (phase: design-generated)
- [ ] Zero C++/Qt-specific terms in requirements
- [ ] All Mermaid diagrams sanitized (domain names, not class names)
- [ ] Gaps logged (if any)
- [ ] Manifest updated (Bridge = done)

---

## Next

→ `/blah:spec-tasks {artifact_id}` (standard BLAH pipeline)
→ Then: `/blah:spec-impl {artifact_id}` for implementation
