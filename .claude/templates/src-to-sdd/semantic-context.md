---
artifact: {{ARTIFACT_ID}}
project: {{PROJECT}}
status: pending
agent_version: 2.0.0
extracted_at: ~
serena_bootstrap: false
sections_completed: []
source_files_count: ~
classes_count: ~
tables_count: ~
connections_count: ~
rules_count: ~
ui_windows_count: ~
---

# Semantic Context: {{ARTIFACT_NAME}}

> This file is the SINGLE SOURCE OF TRUTH for all downstream agents.
> It is produced by the Semantic Extraction Agent using Serena MCP exclusively.
> No other agent reads source code directly.

## Files & Symbols

### Source Files
| File | Type | Symbols | LOC (est) |
|------|------|---------|-----------|

### Symbol Index
| Symbol | Kind | File | Qt Class? |
|--------|------|------|-----------|

## Class API Surface

<!-- Per class:
### {ClassName} [{category}]
- **File:** {header_file}
- **Inherits:** {base classes}
- **Qt Object:** Yes/No

#### Signals
| Signal | Parameters | Description |

#### Slots
| Slot | Visibility | Parameters | Description |

#### Properties (Q_PROPERTY)
| Property | Type | READ | WRITE | NOTIFY |

#### Public Methods
| Method | Return | Parameters | Brief |

#### Enums
| Enum | Values |
-->

## Data Model

<!-- Per table:
### Table: {table_name}
| Column | Type | Constraints |
- Primary Key:
- Foreign Keys:
- CRUD Classes:

### ERD (Mermaid)
-->

## Reactive Architecture

### Signal/Slot Connections
| # | Sender | Signal | Receiver | Slot | File:Line |
|---|--------|--------|----------|------|-----------|

### Key Sequence Diagrams
<!-- Mermaid sequence diagrams for critical flows -->

### Cross-Artifact Dependencies
| External Class | From Artifact | Used In Files | Purpose |
|---------------|---------------|---------------|---------|

## Business Rules

<!-- Per rule:
### Rule: {descriptive_name}
- **Source:** {file}:{line}
- **Trigger:** {what triggers}
- **Condition:** {guard clause}
- **Action:** {what happens}
- **Gherkin:**
  ```gherkin
  Scenario: {name}
    Given {context}
    When {action}
    Then {outcome}
  ```
-->

### State Machines
<!-- Mermaid stateDiagram-v2 -->

### Configuration Keys
| Key | Default | Type | Description |
|-----|---------|------|-------------|

### Error Patterns
| Error | Severity | Condition | Message |
|-------|----------|-----------|---------|

## UI Contracts

<!-- Per window/dialog:
### Window: {ClassName}
- Type: QMainWindow | QDialog | QWidget
- Title: "{title}"
- Size: WxH
- Layout: {type}

#### Widgets
| Widget | Type | Label | Binding | Enabled-When |

#### Actions
| Action | Shortcut | Trigger | Handler |

#### Data Flow
- Source: {where data comes from}
- Display: {how presented}
- Edit: {how modified}
- Save: {where data goes}
-->
