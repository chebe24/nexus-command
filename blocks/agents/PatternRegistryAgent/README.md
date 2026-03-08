# PatternRegistryAgent Block

**Type:** Business Logic Agent
**Version:** 1.0.0
**Purpose:** Syncs filename patterns from GitHub YAML to PatternRegistry sheet

---

## Overview

PatternRegistryAgent fetches `pattern-registry.yaml` from GitHub, parses pattern definitions, and writes them to the PatternRegistry tab. Enables dynamic filename validation across all agents without code changes.

---

## Public API

```javascript
PatternRegistryAgent_sync()
```
**Purpose:** Fetches YAML from GitHub and updates PatternRegistry tab
**Parameters:** None
**Returns:** Plain response `{ code, message, data }`
**Router Contract:** `action: "syncpatterns"`

---

## Functionality

1. **GitHub Fetch**
   - Reads GITHUB_REGISTRY_URL from Script Properties
   - Fetches raw YAML content via UrlFetchApp

2. **YAML Parsing**
   - Extracts pattern definitions
   - Parses: patternKey, subject, filetype, regex, example, version

3. **Sheet Update**
   - Overwrites PatternRegistry tab completely (not append)
   - Writes all patterns with LastUpdated timestamp
   - Auto-resizes columns for readability

4. **Audit Logging**
   - Logs sync events to ProdLog
   - Tracks success/failure

---

## Dependencies

### Required Blocks
- **SecurityAgent** - Via Router authorization

### Required GAS Services
- UrlFetchApp (GitHub fetch)
- SpreadsheetApp (sheet writing)
- PropertiesService (config access)

---

## Required Script Properties

| Property | Type | Required | Purpose |
|----------|------|----------|---------|
| `GITHUB_REGISTRY_URL` | string | Yes | GitHub raw URL for pattern-registry.yaml |
| `SPREADSHEET_ID` | string | Yes | Spreadsheet for PatternRegistry tab |

**GITHUB_REGISTRY_URL Example:**
```
https://raw.githubusercontent.com/chebe24/AI-Agents/main/pattern-registry.yaml
```

---

## Sheet Structure

**Tab Name:** `PatternRegistry`

| Column | Type | Description |
|--------|------|-------------|
| PatternKey | string | Unique pattern identifier (e.g., "general", "math_lp") |
| Subject | string | Subject area (MATH, Sci, SS, Fren, Any) |
| FileType | string | File type (LP, Annot, News, PDF, etc.) |
| Regex | string | Full regex pattern for filename validation |
| Example | string | Example filename matching pattern |
| Version | string | Pattern registry version (e.g., "6.0") |
| LastUpdated | datetime | Sync timestamp |

---

## Integration Pattern

### Router Registration

```javascript
case "syncpatterns":
  return _Router_wrapResponse(PatternRegistryAgent_sync());
```

### Webhook Call

```bash
curl -X POST https://your-web-app-url/exec \
  -H "Content-Type: application/json" \
  -d '{"action": "syncpatterns"}'
```

### Time-Based Trigger

```javascript
// In Triggers.gs
ScriptApp.newTrigger('PatternRegistryAgent_sync')
  .timeBased()
  .everyDays(1)
  .atHour(2)
  .create();
```

### onOpen Trigger

```javascript
ScriptApp.newTrigger('PatternRegistryAgent_sync')
  .forSpreadsheet(SPREADSHEET_ID)
  .onOpen()
  .create();
```

---

## Block Contract

### What This Block Provides

- ✅ GitHub YAML fetching
- ✅ Pattern parsing
- ✅ Sheet synchronization
- ✅ Versioning support
- ✅ ProdLog integration

### What This Block Requires

- ✅ GITHUB_REGISTRY_URL configured
- ✅ GitHub repo accessible (public or with auth)
- ✅ Valid YAML structure in pattern-registry.yaml

### What This Block Does NOT Provide

- ❌ Pattern validation logic (that's in LoggerAgent)
- ❌ Pattern editing interface
- ❌ Version control/rollback

---

## YAML Schema (Expected)

```yaml
metadata:
  version: "6.0"

patterns:
  pattern_key:
    label: "Pattern Name"
    subject: "MATH | Sci | SS | etc."
    filetype: "LP | Annot | etc."
    full_regex: "^regex pattern$"
    example: "01-2026-08-15_MATH_LP_Example.pdf"
```

---

## Used By (Blocks)

- **LoggerAgent** - Reads PatternRegistry for dynamic validation

---

## Used By (Compositions)

- `gateway-os-prod`
- `gateway-os-dev`

---

## Automation

Recommended triggers:
- **Daily sync** - Keep patterns up to date
- **onOpen** - Sync when spreadsheet opens
- **Webhook** - Manual trigger via API

---

## File Size

~9 KB (~290 lines)

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Initial version with GitHub sync and YAML parsing |

---

## Related Blocks

- **LoggerAgent** - Consumes PatternRegistry data
- **Triggers** - Automates sync schedule
- **SecurityAgent** - Provides authorization
