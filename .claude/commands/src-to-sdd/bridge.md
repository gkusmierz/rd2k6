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
- `.blah/specs/{artifact_id}/design-system/` — (optional, UI artifacts only) visual design system

## Post-Bridge: Visual Design System (optional)

After the Bridge Agent completes, check if the artifact has UI components by reading
the generated `spec.json` and looking for `_src_to_sdd.has_ui: true`.

**If `has_ui` is false** — skip this step entirely. Proceed to Next Steps.

**If `has_ui` is true** — launch a subagent to generate the visual design system:

```
Agent(
  description="Generate design system for $1",
  prompt="""
You are generating a visual design system for the BLAH specification at .blah/specs/$1/.

Use the /ui-ux-pro-max skill by calling:
  Skill(skill="ui-ux-pro-max", args=".blah/specs/$1")

This will generate:
  .blah/specs/$1/design-system/MASTER.md
  .blah/specs/$1/design-system/pages/*.md

The skill will use the existing design.md and requirements.md as input context.
It should also read .blah/steering/design.md for global design guidelines inheritance.

After the skill completes, verify that design-system/MASTER.md was created.
"""
)
```

This step ensures that UI implementation agents have deterministic visual guidelines
(colors, typography, spacing, components) instead of ad-hoc choices per run.

## Next Steps
The generated specs are directly compatible with BLAH pipeline:
```
/blah:spec-tasks {artifact_id}     ← generate implementation tasks
/blah:spec-impl {artifact_id}      ← implement with TDD
/blah:validate-impl {artifact_id}  ← verify implementation
```
