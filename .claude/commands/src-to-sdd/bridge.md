---
description: "SDD Bridge — translate semantic-context into BLAH-compatible specs"
allowed-tools: Read, Write, Edit, Glob, Bash, Task
argument-hint: <ARTIFACT_ID>
---

# /src-to-sdd:bridge

Runs the SDD Bridge Agent to translate semantic-context.md into BLAH-compatible
requirements.md and design.md.

## Prerequisites
- `.analysis/{ARTIFACT_ID}/semantic-context.md` must exist with `status: done`
- Run `/src-to-sdd:extract {ARTIFACT_ID}` first
- BLAH templates must exist at `.blah/settings/templates/specs/`

## Usage
```
/src-to-sdd:bridge LIB
/src-to-sdd:bridge CAE
```

## Execution

1. Validate that `$1` (ARTIFACT_ID) is provided
2. Verify semantic-context.md exists and status=done
3. Create `.blah/specs/$1/` directory if needed

Use the Task tool to invoke the Bridge Agent:

```
Task(
  subagent_type="src-to-sdd-bridge-agent",
  description="SDD Bridge for $1",
  prompt="""
Artifact ID: $1
Semantic context: .analysis/$1/semantic-context.md
Manifest: .analysis/{find the manifest file}

Read the agent instructions from:
  .claude/agents/src-to-sdd/bridge.md

Read BLAH templates from:
  .blah/settings/templates/specs/requirements.md
  .blah/settings/templates/specs/design.md
  .blah/settings/templates/specs/init.json
  .blah/settings/rules/ears-format.md

Read steering (if exists):
  .blah/steering/*.md

Execute all steps as defined in the agent.

STRICT RULES:
- NO Serena MCP — this agent does NOT touch source code
- NO Grep — all data comes from semantic-context.md
- Sanitize ALL C++/Qt terms into technology-agnostic language
- Requirement IDs must be NUMERIC ONLY
- Log any data gaps to .analysis/$1/_gaps.md
"""
)
```

## Output
- `.blah/specs/{artifact_id}/spec.json` — BLAH metadata
- `.blah/specs/{artifact_id}/requirements.md` — EARS requirements
- `.blah/specs/{artifact_id}/design.md` — technical design

## Next Steps
The generated specs are directly compatible with BLAH pipeline:
```
/blah:spec-tasks {artifact_id}     ← generate implementation tasks
/blah:spec-impl {artifact_id}      ← implement with TDD
/blah:validate-impl {artifact_id}  ← verify implementation
```
