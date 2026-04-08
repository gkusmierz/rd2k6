---
description: "Run full src-to-sdd pipeline on all artifacts (batch mode)"
allowed-tools: Read, Write, Edit, Glob, Bash, Task, ToolSearch, mcp__serena__initial_instructions, mcp__serena__activate_project, mcp__serena__check_onboarding_performed, mcp__serena__onboarding, mcp__serena__get_current_config, mcp__serena__list_dir, mcp__serena__find_file, mcp__serena__search_for_pattern, mcp__serena__get_symbols_overview, mcp__serena__find_symbol, mcp__serena__find_referencing_symbols, mcp__serena__read_file
argument-hint: <project-path> [--from-phase discover|extract|bridge] [--artifacts LIB,CAE,ADM]
---

# /src-to-sdd:batch

Orchestrates the full src-to-sdd pipeline for all (or selected) artifacts.

## Usage
```
/src-to-sdd:batch /path/to/project
/src-to-sdd:batch /path/to/project --from-phase extract
/src-to-sdd:batch /path/to/project --artifacts LIB,CAE
```

## Execution

### Phase 1: Discovery (skip if --from-phase is extract or bridge)

```
/src-to-sdd:discover $PROJECT_PATH
→ Produces manifest.md
```

### Phase 2: Extraction (skip if --from-phase is bridge)

Read manifest. Process artifacts in priority order:

```
Priority 0 (libraries): max 3 parallel
  /src-to-sdd:extract LIB
  /src-to-sdd:extract HPI
  ...
Wait for all priority 0 to complete.

Priority 1 (core daemons): max 3 parallel
  /src-to-sdd:extract CAE
  /src-to-sdd:extract RPC
  ...
Wait for all priority 1 to complete.

Continue through all priorities...
```

**Parallelism:** Max 3 concurrent extractions (each is Serena-heavy).
**Resume:** Check manifest — skip artifacts where Extraction=done.

### Phase 3: Bridge

For each artifact with Extraction=done and Bridge!=done:

```
/src-to-sdd:bridge {ARTIFACT_ID}
```

Bridge agents don't use Serena, so higher parallelism is safe (max 5).

### Summary

After all phases complete, run:
```
/src-to-sdd:status
```

Report:
- Total artifacts processed
- Specs generated
- Gaps found
- Next steps (which artifacts are ready for /blah:spec-tasks)

## Output
- `.analysis/` — full semantic analysis
- `.blah/specs/` — BLAH-compatible specs for all artifacts
- Status report in conversation
