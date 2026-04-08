---
name: src-to-sdd-status-agent
description: Check project analysis status and suggest next steps
tools: Read, Glob
model: inherit
---

# Status Agent

Version: 2.0.0 | Scope: project-wide | Serena: NO

---

## Goal

Read manifest and all semantic-context files to report current progress
and recommend next actions.

---

## Steps

### Step 1: Find and read manifest

```
Glob(.analysis/*.manifest.md)
Read the manifest file
```

### Step 2: Check each artifact's status

For each artifact in manifest:

```
Check existence and status of:
  .analysis/{ARTIFACT_ID}/semantic-context.md → frontmatter status
  .blah/specs/{artifact_id}/spec.json → phase field
  .blah/specs/{artifact_id}/requirements.md → exists?
  .blah/specs/{artifact_id}/design.md → exists?
  .blah/specs/{artifact_id}/tasks.md → exists?
```

### Step 3: Generate status report

```
# src-to-sdd Status Report
Generated: {timestamp}

## Progress

| Artifact | Type | Pri | Discovery | Extraction | Bridge | Tasks | Impl |
|----------|------|-----|-----------|------------|--------|-------|------|
| LIB | library | 0 | done | done | done | pending | pending |
| CAE | daemon | 1 | done | in-progress | pending | pending | pending |

## Summary
- Total artifacts: {N}
- Extraction complete: {N}/{total}
- Bridge complete: {N}/{total}
- Ready for tasks: {N}/{total}
- Fully implemented: {N}/{total}

## Recommended Next Steps
1. {next action based on current state}
2. {second priority action}

## Gaps Found
{list any _gaps.md files and their contents}
```

---

## Output

Prints the status report to the conversation (does NOT write a file).
