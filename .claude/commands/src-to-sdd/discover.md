---
description: "Project Discovery — identify all artifacts in a C++/Qt project"
allowed-tools: Read, Write, Edit, Glob, Bash, Task, ToolSearch, mcp__serena__initial_instructions, mcp__serena__activate_project, mcp__serena__check_onboarding_performed, mcp__serena__onboarding, mcp__serena__get_current_config, mcp__serena__list_dir, mcp__serena__find_file, mcp__serena__search_for_pattern, mcp__serena__get_symbols_overview
argument-hint: <project-path>
---

# /src-to-sdd:discover

Runs the Discovery Agent on a C++/Qt project to identify all atomic artifacts.

## Prerequisites
- `compile_commands.json` must exist in the project root
- Serena MCP must be available

## Usage
```
/src-to-sdd:discover /path/to/project
```

## Execution

1. Validate that `$1` (project path) is provided
2. Validate that `$1/compile_commands.json` exists
3. Create `.analysis/` directory if it doesn't exist

Use the Task tool to invoke the Discovery Agent:

```
Task(
  subagent_type="src-to-sdd-discovery-agent",
  description="Project Discovery — identify artifacts",
  prompt="""
Project path: $1
Output directory: .analysis/

Read the agent instructions from:
  .claude/agents/src-to-sdd/discovery.md

Read the manifest template from:
  .claude/templates/src-to-sdd/manifest.md

Execute all steps as defined in the agent.
Bootstrap Serena MCP first (MANDATORY).
"""
)
```

## Output
- `.analysis/{PROJECT}.manifest.md` — artifact inventory with status tracking

## Next Steps
After discovery, run extraction for each artifact:
```
/src-to-sdd:extract {ARTIFACT_ID}
```
Start with priority 0 (libraries) first.
