---
description: "Semantic Extraction — deep Serena analysis of one artifact"
allowed-tools: Read, Write, Edit, Glob, Task, ToolSearch, mcp__serena__initial_instructions, mcp__serena__activate_project, mcp__serena__check_onboarding_performed, mcp__serena__onboarding, mcp__serena__get_current_config, mcp__serena__list_dir, mcp__serena__find_file, mcp__serena__get_symbols_overview, mcp__serena__find_symbol, mcp__serena__search_for_pattern, mcp__serena__find_referencing_symbols, mcp__serena__read_file
argument-hint: <ARTIFACT_ID>
---

# /src-to-sdd:extract

Runs the Semantic Extraction Agent on one artifact to produce a complete
semantic dump (semantic-context.md).

## Prerequisites
- `.analysis/{PROJECT}.manifest.md` must exist (run `/src-to-sdd:discover` first)
- Artifact must exist in the manifest
- Serena MCP must be available
- For non-library artifacts: dependency libraries should be extracted first

## Usage
```
/src-to-sdd:extract LIB
/src-to-sdd:extract CAE
/src-to-sdd:extract ADM
```

## Execution

1. Validate that `$1` (ARTIFACT_ID) is provided
2. Read manifest to verify artifact exists and get metadata
3. Check dependency readiness (all depends_on artifacts should have Extraction=done)
4. Create `.analysis/$1/` directory if needed

Use the Task tool to invoke the Extraction Agent:

```
Task(
  subagent_type="src-to-sdd-extraction-agent",
  description="Semantic Extraction for $1",
  prompt="""
Artifact ID: $1
Manifest: .analysis/{find the manifest file}

Read the agent instructions from:
  .claude/agents/src-to-sdd/extraction.md

Execute all steps and sections (A through F) as defined in the agent.
Bootstrap Serena MCP first (MANDATORY).

STRICT RULES:
- Use ONLY Serena MCP tools for source code access
- NO grep, NO bash, NO Read on .cpp/.h files
- Write incrementally to semantic-context.md after each section
- Perform spot-check validation at the end
"""
)
```

## Output
- `.analysis/{ARTIFACT_ID}/semantic-context.md` — complete semantic dump

## Resume
If interrupted, re-run the same command. The agent checks `sections_completed`
in frontmatter and resumes from the last completed section.

## Next Steps
After extraction, run the bridge to generate BLAH specs:
```
/src-to-sdd:bridge {ARTIFACT_ID}
```
