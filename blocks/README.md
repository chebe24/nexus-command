# Gateway-OS Agent Blocks

**Architecture:** Modular component system for Google Apps Script
**Purpose:** Reusable, composable agent blocks for building GAS applications
**Version:** 1.0.0

---

## Overview

This directory contains **self-contained agent blocks** that can be composed into different applications (compositions). Each block is a single-responsibility module with clear dependencies, API contracts, and configuration.

### Why Blocks?

**Before (Duplication):**
- NexusAI had its own `update-db.gs` with embedded security
- Gateway-OS had duplicate code in prod/dev
- Security updates required changes in multiple files

**After (DRY):**
- One SecurityAgent block used by ALL compositions
- One InventoryAgent block (from NexusAI) reused everywhere
- Security updates = change one file

---

## Directory Structure

```
blocks/
├── core/                           ← Infrastructure blocks
│   ├── Security/
│   │   ├── SecurityAgent.gs        ← Project Sentinel implementation
│   │   ├── README.md              ← API docs, integration guide
│   │   └── config.json            ← Dependencies, Script Properties
│   │
│   ├── Router/
│   │   ├── Router.gs              ← Webhook routing
│   │   ├── README.md
│   │   └── config.json
│   │
│   └── Utilities/
│       ├── Utilities.gs           ← Shared helpers
│       ├── README.md
│       └── config.json
│
└── agents/                         ← Business logic blocks
    ├── InventoryAgent/
    │   ├── InventoryAgent.gs      ← Drive scanning
    │   ├── README.md
    │   └── config.json
    │
    ├── LoggerAgent/
    │   ├── LoggerAgent.gs         ← Chat logging
    │   ├── README.md
    │   └── config.json
    │
    └── PatternRegistryAgent/
        ├── PatternRegistryAgent.gs ← Pattern sync
        ├── README.md
        └── config.json
```

---

## Block Types

### Core Blocks

**Infrastructure** - Required by most compositions

| Block | Purpose | Dependencies | Size |
|-------|---------|--------------|------|
| **Security** | Authorization, audit logging, Script Properties | None | ~10 KB |
| **Router** | Webhook routing, request handling | Security, Utilities | ~4 KB |
| **Utilities** | Shared helpers, sheet management | None | ~3 KB |

### Agent Blocks

**Business Logic** - Optional, mix and match

| Block | Purpose | Dependencies | Size |
|-------|---------|--------------|------|
| **InventoryAgent** | Drive scanning, inventory management | Security, Utilities | ~10 KB |
| **LoggerAgent** | Chat log entries, filename validation | Security, PatternRegistry | ~11 KB |
| **PatternRegistryAgent** | GitHub YAML sync | Security | ~9 KB |

---

## Block Anatomy

Each block contains:

### 1. Code File (*.gs)

Self-contained Google Apps Script file with:
- Public API (functions other blocks can call)
- Private helpers (prefixed with `_BlockName_`)
- Clear comments and JSDoc

### 2. README.md

Documentation including:
- Overview and purpose
- Public API documentation
- Dependencies
- Integration patterns
- Script Properties required
- Block contract (what it provides/requires)

### 3. config.json

Machine-readable metadata:
- Block info (name, version, author)
- Dependencies (blocks, GAS services)
- Script Properties schema
- Public API list
- Router contract (for agents)
- Composition notes

---

## How to Use Blocks

### Option 1: Manual Composition (Current)

Copy blocks into your GAS project:

```bash
# Copy core blocks
cp blocks/core/Security/SecurityAgent.gs prod-project/
cp blocks/core/Router/Router.gs prod-project/
cp blocks/core/Utilities/Utilities.gs prod-project/

# Copy desired agents
cp blocks/agents/LoggerAgent/LoggerAgent.gs prod-project/

# Deploy
clasp push
```

### Option 2: Automated Composition (Phase 2)

Define manifest, run build script:

```json
// compositions/my-app/manifest.json
{
  "blocks": {
    "core": ["Security", "Router", "Utilities"],
    "agents": ["LoggerAgent"]
  }
}
```

```bash
./scripts/compose.sh my-app
# → Assembles blocks into compositions/my-app/
# → Ready for clasp push
```

---

## Dependency Resolution

### Load Order

Blocks must be loaded in dependency order:

1. **Utilities** (no dependencies)
2. **SecurityAgent** (no block dependencies)
3. **Router** (needs Security, Utilities)
4. **Agents** (need Security, may need other agents)

### Checking Dependencies

Every block's `config.json` lists dependencies:

```json
{
  "dependencies": {
    "blocks": ["SecurityAgent", "Utilities"],
    "gas_services": ["DriveApp", "SpreadsheetApp"]
  }
}
```

---

## Script Properties

### Block Requirements

Each block's `config.json` specifies required properties:

```json
{
  "script_properties": {
    "required": [
      {
        "name": "AUTHORIZED_EMAIL",
        "type": "string",
        "description": "...",
        "example": "user@example.com"
      }
    ]
  }
}
```

### Composition Setup

Collect all required properties from included blocks:

```bash
# Example for gateway-os-prod composition:
# - SecurityAgent requires: AUTHORIZED_EMAIL, SPREADSHEET_ID, ENVIRONMENT
# - InventoryAgent requires: DRIVE_FOLDER_ID
# - PatternRegistryAgent requires: GITHUB_REGISTRY_URL

# Set all at once:
SecurityAgent_setupScriptProperties({
  'AUTHORIZED_EMAIL': 'cary.hebert@gmail.com',
  'SPREADSHEET_ID': '1ABC123...',
  'ENVIRONMENT': 'production',
  'DRIVE_FOLDER_ID': '0DEF456...',
  'GITHUB_REGISTRY_URL': 'https://raw.githubusercontent.com/...'
});
```

---

## Block Contracts

### API Contract

Public functions are documented in README.md and listed in config.json:

```json
{
  "public_api": [
    "BlockName_publicFunction()",
    "BlockName_otherFunction(payload)"
  ]
}
```

**Naming Convention:** `BlockName_functionName()`

### Router Contract (Agents Only)

Agents that integrate with Router define:

```json
{
  "router_contract": {
    "action": "actionname",
    "payload_schema": {...},
    "response_schema": {...}
  }
}
```

---

## Creating New Blocks

### Template Structure

```
blocks/agents/MyAgent/
├── MyAgent.gs              ← Code
├── README.md               ← Documentation
└── config.json             ← Metadata
```

### Code Template

```javascript
/**
 * @file      MyAgent.gs
 * @version   1.0.0
 * @purpose   Brief description
 */

// Public API
function MyAgent_init(payload) {
  // Entry point called by Router
}

// Private helpers
function _MyAgent_helper() {
  // Internal function
}
```

### README Template

See existing blocks for structure. Include:
- Overview
- Public API
- Dependencies
- Integration pattern
- Block contract

### config.json Template

```json
{
  "block": {
    "name": "MyAgent",
    "type": "agent",
    "version": "1.0.0"
  },
  "dependencies": {
    "blocks": [],
    "gas_services": []
  },
  "script_properties": {
    "required": [],
    "optional": []
  },
  "public_api": []
}
```

---

## Testing Blocks

### Unit Testing (Manual)

Each block with test functions:

```javascript
// In MyAgent.gs
function MyAgent_test() {
  const result = MyAgent_init({test: "data"});
  Logger.log(result);
}
```

### Integration Testing

Compose blocks and test together:

```javascript
// Test composition
SecurityAgent_testConfiguration();
MyAgent_test();
```

---

## Migration from Existing Code

### Step 1: Identify Reusable Code

Look for:
- Functions used in multiple files
- Security/authorization logic
- Sheet access patterns
- API integrations

### Step 2: Extract to Block

- Create block directory
- Copy code with clear API
- Document dependencies
- Create config.json

### Step 3: Replace Originals

- Import block into compositions
- Remove duplicate code
- Update references

---

## Current Blocks

### Core (3 blocks)

- ✅ **SecurityAgent** - Project Sentinel compliance
- ✅ **Router** - Webhook routing
- ✅ **Utilities** - Shared helpers

### Agents (3 blocks)

- ✅ **InventoryAgent** - Drive scanning (from NexusAI)
- ✅ **LoggerAgent** - Chat logging
- ✅ **PatternRegistryAgent** - GitHub YAML sync

**Total:** 6 blocks, ~47 KB code, fully documented

---

## Future Blocks (Ideas)

- **RelocationTrackerAgent** - SHSID onboarding documents
- **EmailAgent** - Gmail integration
- **CalendarAgent** - Google Calendar sync
- **SlidesAgent** - Presentation generation
- **DriveOrganizerAgent** - File organization

---

## Benefits of Block Architecture

### ✅ DRY (Don't Repeat Yourself)

One SecurityAgent → used by all compositions
No duplicated security code

### ✅ Single Responsibility

Each block does ONE thing well
Clear separation of concerns

### ✅ Composability

Mix and match blocks for different apps
gateway-os-prod uses different blocks than nexus-ai

### ✅ Testability

Each block can be tested independently
Clear dependencies make mocking easy

### ✅ Maintainability

Update one block → all compositions benefit
Clear documentation in every block

### ✅ Reusability

Extract NexusAI code → reuse in Gateway-OS
Template system for new projects

---

## Related Documentation

- `/templates/SecurityAgent.template.gs` - Reusable security template
- `/templates/IMPLEMENTATION_GUIDE.md` - How to use security template
- `/SECURITY.md` - Project Sentinel standards
- `/compositions/` (Phase 2) - Assembled applications

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Initial block architecture, 6 blocks extracted |

---

**Architecture:** Component-based, modular design
**Inspiration:** Microservices, UNIX philosophy, React components
**Maintained by:** Cary Hebert
