---
description: "Check src-to-sdd pipeline status and recommended next steps"
allowed-tools: Read, Glob, Task
argument-hint: ""
---

# /src-to-sdd:status

Reports current status of the src-to-sdd pipeline for all artifacts.

## Usage
```
/src-to-sdd:status
```

## Execution

Use the Task tool to invoke the Status Agent:

```
Task(
  subagent_type="src-to-sdd-status-agent",
  description="Check src-to-sdd status",
  prompt="""
Read the agent instructions from:
  .claude/agents/src-to-sdd/status.md

Check:
1. .analysis/*.manifest.md for artifact list
2. .analysis/{ARTIFACT}/semantic-context.md for extraction status
3. .blah/specs/{artifact}/ for bridge and BLAH pipeline status

Report a complete status table and recommended next actions.
"""
)
```

## Output
Prints a status table to the conversation showing progress per artifact
across all pipeline stages: Discovery → Extraction → Bridge → Tasks → Impl.
