# AI-DLC and Spec-Driven Development

BLAH-style Spec Driven Development implementation on AI-DLC (AI Development Life Cycle)

---

## Two Workflows: Forward (BLAH) and Reverse (src-to-sdd)

This project supports two complementary workflows:

### Forward Engineering (BLAH) — idea → code
Start from an idea or description, generate specs, then implement.
Use `/blah:*` commands.

### Reverse Engineering (src-to-sdd) — code → specs
Start from existing C++/Qt source code, extract semantics via Serena MCP,
then generate BLAH-compatible specs ready for re-implementation.
Use `/src-to-sdd:*` commands.

Both workflows converge at the same point: BLAH specs (requirements.md + design.md)
that feed into `/blah:spec-tasks` and `/blah:spec-impl`.

---

## src-to-sdd Pipeline (Reverse Engineering)

### Hard Rules — NEVER break these
1. **Serena MCP is the ONLY interface to source code.** No grep, no Read on .cpp/.h, no bash for code analysis.
2. **Bootstrap Serena first.** Every agent touching code MUST run: `ToolSearch(query="+serena", max_results=50)` → `mcp__serena__initial_instructions()`.
3. **semantic-context.md is the handover.** Agent 2 (Extraction) writes it. Agent 3 (Bridge) reads it. No shortcuts.
4. **Bridge agent NEVER touches source code.** It translates .md files only.
5. **Output is BLAH-native.** requirements.md (EARS) + design.md — directly consumable by `/blah:spec-tasks`.

### Commands

| Command | Agent | Serena? | Description |
|---------|-------|---------|-------------|
| `/src-to-sdd:discover <path>` | Discovery | YES | Identify all artifacts in a C++/Qt project |
| `/src-to-sdd:extract <ID>` | Extraction | YES | Deep semantic analysis of one artifact |
| `/src-to-sdd:bridge <ID>` | Bridge | NO | Translate semantic dump → BLAH specs |
| `/src-to-sdd:batch <path>` | Orchestrator | mixed | Run full pipeline on all artifacts |
| `/src-to-sdd:status` | Status | NO | Check pipeline progress |

### Typical Workflow
```
1. /src-to-sdd:discover /path/to/cpp-project
   → .analysis/{PROJECT}.manifest.md

2. /src-to-sdd:extract LIB    (libraries first — priority 0)
   /src-to-sdd:extract CAE    (then daemons — priority 1)
   /src-to-sdd:extract ADM    (then apps — priority 2)
   → .analysis/{ID}/semantic-context.md per artifact

3. /src-to-sdd:bridge LIB
   /src-to-sdd:bridge CAE
   → .blah/specs/{id}/requirements.md + design.md + spec.json

4. /blah:spec-tasks {id}       (standard BLAH pipeline from here)
5. /blah:spec-impl {id}
```

### Architecture
```
.claude/
├── agents/src-to-sdd/
│   ├── discovery.md          ← Agent 1: project scan
│   ├── extraction.md         ← Agent 2: Serena deep analysis
│   ├── bridge.md             ← Agent 3: semantic → BLAH translation
│   └── status.md             ← Status reporter
├── commands/src-to-sdd/
│   ├── discover.md           ← /src-to-sdd:discover
│   ├── extract.md            ← /src-to-sdd:extract
│   ├── bridge.md             ← /src-to-sdd:bridge
│   ├── batch.md              ← /src-to-sdd:batch
│   └── status.md             ← /src-to-sdd:status
└── templates/src-to-sdd/
    ├── manifest.md            ← manifest template
    └── semantic-context.md    ← semantic dump template
```

### Data Flow
```
Source Code (.cpp/.h)
    │ [Serena MCP — ONLY interface]
    ▼
.analysis/{PROJECT}.manifest.md        ← Agent 1 (Discovery)
.analysis/{ARTIFACT}/semantic-context.md ← Agent 2 (Extraction)
    │ [Read .md files — NO Serena]
    ▼
.blah/specs/{artifact}/
    ├── spec.json                       ← Agent 3 (Bridge)
    ├── requirements.md (EARS)          ← Agent 3 (Bridge)
    └── design.md                       ← Agent 3 (Bridge)
    │ [Standard BLAH pipeline]
    ▼
.blah/specs/{artifact}/tasks.md        ← /blah:spec-tasks
    │
    ▼
Implementation in target technology     ← /blah:spec-impl
```

---

## BLAH Pipeline (Forward Engineering)

### Paths
- Steering: `.blah/steering/`
- Specs: `.blah/specs/`

### Steering vs Specification

**Steering** (`.blah/steering/`) - Guide AI with project-wide rules and context
**Specs** (`.blah/specs/`) - Formalize development process for individual features

### Active Specifications
- Check `.blah/specs/` for active specifications
- Use `/blah:spec-status [feature-name]` to check progress

### Minimal Workflow
- Phase 0 (optional): `/blah:steering`, `/blah:steering-custom`
- Phase 1 (Specification):
  - `/blah:spec-init "description"`
  - `/blah:spec-requirements {feature}`
  - `/blah:validate-gap {feature}` (optional: for existing codebase)
  - `/blah:spec-design {feature} [-y]`
  - `/blah:validate-design {feature}` (optional: design review)
  - `/blah:spec-tasks {feature} [-y]`
- Phase 2 (Implementation): `/blah:spec-impl {feature} [tasks]`
  - `/blah:validate-impl {feature}` (optional: after implementation)
- Progress check: `/blah:spec-status {feature}` (use anytime)

---

## Development Guidelines
- Think in English, generate responses in English. All Markdown content written to project files (e.g., requirements.md, design.md, tasks.md, research.md, validation reports) MUST be written in the target language configured for this specification (see spec.json.language).

## Development Rules
- 3-phase approval workflow: Requirements → Design → Tasks → Implementation
- Human review required each phase; use `-y` only for intentional fast-track
- Keep steering current and verify alignment with `/blah:spec-status`
- Follow the user's instructions precisely, and within that scope act autonomously: gather the necessary context and complete the requested work end-to-end in this run, asking questions only when essential information is missing or the instructions are critically ambiguous.

## Steering Configuration
- Load entire `.blah/steering/` as project memory
- Default files: `product.md`, `tech.md`, `structure.md`
- Custom files are supported (managed via `/blah:steering-custom`)
