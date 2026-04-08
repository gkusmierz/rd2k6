# src-to-sdd — Reverse Engineering Agent System

## What is this?

A set of specialized agents for reverse-engineering C++/Qt projects into
BLAH-compatible specifications (requirements.md + design.md). The generated specs
can be directly consumed by the BLAH pipeline (`/blah:spec-tasks` → `/blah:spec-impl`)
to re-implement the software in any target technology.

**Philosophy:** Extract WHAT the system does (behavior), not HOW it does it (implementation).
The output is technology-agnostic — suitable for cloning legacy C++/Qt applications
into modern stacks (C#/.NET, Python, TypeScript, etc.).

---

## Prerequisites

1. **Serena MCP** must be installed and available as an MCP server.
   Agents bootstrap Serena with `ToolSearch(query="+serena")` → `mcp__serena__initial_instructions()`.

2. **compile_commands.json** must exist in the project root.
   Generate it with:
   ```bash
   # CMake projects
   cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -B build && cp build/compile_commands.json .

   # qmake projects (use Bear)
   bear -- make
   ```

3. **BLAH framework** must be set up in the same repository (`.blah/` directory).
   The src-to-sdd agents produce output compatible with BLAH specs.

---

## Quick Start

```bash
# 1. Navigate to the C++/Qt project root (where compile_commands.json is)
cd /path/to/cpp-project

# 2. Copy .claude/ directory from this repo (or symlink)
cp -r /path/to/cc-sdd-poc/.claude .

# 3. Copy .blah/ directory (for BLAH pipeline support)
cp -r /path/to/cc-sdd-poc/.blah .

# 4. Run discovery
/src-to-sdd:discover .

# 5. Check what was found
/src-to-sdd:status

# 6. Extract semantics (start with libraries)
/src-to-sdd:extract LIB

# 7. Generate BLAH specs
/src-to-sdd:bridge LIB

# 8. Continue with standard BLAH pipeline
/blah:spec-tasks lib
/blah:spec-impl lib
```

Or run everything at once:
```bash
/src-to-sdd:batch /path/to/cpp-project
```

---

## Architecture

### 4 Agents (replacing the old 8-phase system)

| # | Agent | Serena? | Input | Output |
|---|-------|---------|-------|--------|
| 1 | **Discovery** | YES | project root | `.analysis/{PROJECT}.manifest.md` |
| 2 | **Extraction** | YES | manifest + source code | `.analysis/{ID}/semantic-context.md` |
| 3 | **Bridge** | NO | semantic-context.md | `.blah/specs/{id}/requirements.md` + `design.md` |
| 4 | **BLAH** (existing) | NO | BLAH specs | `tasks.md` → implementation |

### The Cardinal Rule: Serena-Only Code Access

```
┌─────────────────────────────────────────────────┐
│  SOURCE CODE (.cpp, .h, .pro, CMakeLists.txt)    │
│                                                   │
│  Access: ONLY via Serena MCP                      │
│  ✅ mcp__serena__find_symbol()                    │
│  ✅ mcp__serena__search_for_pattern()             │
│  ✅ mcp__serena__get_symbols_overview()            │
│  ✅ mcp__serena__find_referencing_symbols()        │
│  ✅ mcp__serena__list_dir()                        │
│  ✅ mcp__serena__find_file()                       │
│                                                   │
│  ❌ grep / rg / Grep tool                         │
│  ❌ Read tool on .cpp/.h files                    │
│  ❌ cat / head / tail via Bash                    │
│  ❌ Any other text-based code search              │
│                                                   │
│  Exceptions (Serena can't parse these):           │
│  ⚠️ .ui files (Qt XML) → Read allowed             │
│  ⚠️ .qml files → Read allowed                     │
│  ⚠️ Screenshots (PNG/JPG) → Read allowed          │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
Source Code
    │
    │ Agent 1: Discovery (Serena)
    │ Identifies build targets, classifies artifacts
    ▼
.analysis/{PROJECT}.manifest.md
    │
    │ Agent 2: Extraction (Serena)
    │ Deep semantic analysis: classes, DB, signals, rules, UI
    ▼
.analysis/{ARTIFACT}/semantic-context.md
    │
    │ Agent 3: Bridge (NO Serena — reads .md only)
    │ Translates to BLAH format, sanitizes C++/Qt terms
    ▼
.blah/specs/{artifact}/
├── spec.json
├── requirements.md (EARS format)
└── design.md
    │
    │ Standard BLAH pipeline (existing agents)
    ▼
.blah/specs/{artifact}/tasks.md
    │
    ▼
New implementation in target technology
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/src-to-sdd:discover <path>` | Scan project, identify artifacts, create manifest |
| `/src-to-sdd:extract <ID>` | Deep Serena analysis of one artifact → semantic-context.md |
| `/src-to-sdd:bridge <ID>` | Translate semantic-context → BLAH specs |
| `/src-to-sdd:batch <path>` | Full pipeline: discover → extract all → bridge all |
| `/src-to-sdd:status` | Check progress across all artifacts |

### Workflow after src-to-sdd

| Command | Description |
|---------|-------------|
| `/blah:spec-tasks <artifact>` | Generate implementation tasks from specs |
| `/blah:spec-impl <artifact> [tasks]` | Implement with TDD |
| `/blah:validate-impl <artifact>` | Verify implementation against specs |

---

## File Structure

```
.claude/
├── agents/src-to-sdd/
│   ├── README.md              ← this file
│   ├── discovery.md           ← Agent 1: project discovery
│   ├── extraction.md          ← Agent 2: Serena semantic extraction
│   ├── bridge.md              ← Agent 3: semantic → BLAH translation
│   └── status.md              ← Status reporter
│
├── commands/src-to-sdd/
│   ├── discover.md            ← /src-to-sdd:discover
│   ├── extract.md             ← /src-to-sdd:extract
│   ├── bridge.md              ← /src-to-sdd:bridge
│   ├── batch.md               ← /src-to-sdd:batch
│   └── status.md              ← /src-to-sdd:status
│
└── templates/src-to-sdd/
    ├── manifest.md             ← project manifest template
    └── semantic-context.md     ← semantic dump template

.analysis/                      ← created by agents (gitignored recommended)
├── {PROJECT}.manifest.md
└── {ARTIFACT}/
    ├── semantic-context.md
    └── _gaps.md (if any)

.blah/specs/{artifact}/         ← created by Bridge agent
├── spec.json
├── requirements.md
└── design.md
```

---

## semantic-context.md — The Handover Document

The semantic-context.md is the central artifact of this system. It contains
6 sections that capture everything about an artifact:

| Section | Content | Source |
|---------|---------|--------|
| **A: Files & Symbols** | File listing, symbol index | `list_dir`, `get_symbols_overview` |
| **B: Class API Surface** | Inheritance, signals, slots, properties, methods, enums | `find_symbol`, `search_for_pattern` |
| **C: Data Model** | DB tables, columns, FK, ERD, CRUD mappings | `search_for_pattern` (CREATE TABLE) |
| **D: Reactive Architecture** | connect() calls, emit statements, cross-artifact refs | `search_for_pattern`, `find_referencing_symbols` |
| **E: Business Rules** | Guard clauses, state machines, config keys, Gherkin scenarios | `search_for_pattern`, `find_symbol` (bodies) |
| **F: UI Contracts** | Windows, widgets, layouts, actions, data flow | `find_file` (.ui), `Read` (.ui XML), `search_for_pattern` |

The Bridge agent reads ONLY this file to produce BLAH specs.
If data is missing here, it's missing everywhere downstream.

---

## Comparison with Old System (rivendell .claude/agents/)

| Aspect | Old (v1.6, 8 phases) | New (v2.0, 4 agents) |
|--------|----------------------|----------------------|
| Phases | 8 (Phase 0-7 + QA) | 4 agents |
| Serena-using agents | 8 (each bootstraps) | 2 (Discovery + Extraction) |
| Output format | Internal (SPEC.md, FEAT-*.md) | BLAH-native (requirements.md, design.md) |
| Sub-agents per phase | Up to N (orchestrator + merge) | None (monolithic per artifact) |
| Coding agent compatibility | Requires custom parser | Out of the box via /blah:spec-tasks |
| Files per artifact | ~8-10 | 2 (semantic-context + BLAH specs) |
| Context flow | Serena memory + MD files | MD files only |

---

## Troubleshooting

**Serena bootstrap fails:**
- Check that compile_commands.json exists in project root
- Verify Serena MCP is configured in Claude Code settings
- Try: `ToolSearch(query="+serena", max_results=50)` manually

**Extraction produces empty sections:**
- Artifact may not have that type of content (e.g., CLI tool has no UI)
- Section will be marked as empty — this is expected
- Bridge agent handles empty sections gracefully

**Bridge reports gaps:**
- Check `.analysis/{ARTIFACT}/_gaps.md` for details
- Re-run extraction with focus on the missing section
- Or accept the gap and fill manually in the BLAH specs

**Large artifact exceeds context window:**
- Extraction agent writes incrementally (section by section)
- If interrupted, re-run — it resumes from last completed section
- For very large artifacts (>200 files), consider splitting

---

## Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| ADL-100 | Serena as ONLY code interface | Semantic analysis > text search. Single source of truth. |
| ADL-101 | Monolithic Extraction (no sub-agents) | Eliminates Merge Agent complexity. Simpler debugging. |
| ADL-102 | BLAH-compatible output | Zero custom parsers. /blah:spec-tasks works immediately. |
| ADL-103 | semantic-context.md as intermediate | Debuggable, reusable, separates concerns. |
| ADL-104 | No Grep/Read on source code | Consistency. Serena provides better results. |
