# Utilities Block

**Type:** Core Infrastructure
**Version:** 1.0.0
**Purpose:** Shared helper functions for Gateway-OS

---

## Overview

Utilities provides reusable helper functions used across all agents and core blocks. These are foundational tools for account verification, response building, logging, and sheet management.

---

## Public API

### Account Management

```javascript
checkAccount()
```
**Purpose:** Verifies script is running under correct Google account
**Returns:** `true` if account matches
**Throws:** Error if account mismatch
**Note:** Legacy function - SecurityAgent provides better authorization

### Response Building

```javascript
buildResponse(code, message, errors)
```
**Purpose:** Creates standard JSON HTTP response
**Parameters:**
- `code` (number) - HTTP status code
- `message` (string) - Response message
- `errors` (array) - Optional error details
**Returns:** ContentService.TextOutput with JSON

### Logging

```javascript
logEvent(eventType, payload)
```
**Purpose:** Logs event to Apps Script console
**Parameters:**
- `eventType` (string) - Event identifier
- `payload` (object) - Event data

### Sheet Management

```javascript
getSpreadsheet()
```
**Purpose:** Opens the main spreadsheet using Script Properties
**Returns:** Spreadsheet object
**Note:** Uses SPREADSHEET_ID from Script Properties (secure)

```javascript
getOrCreateSheet(name, headers)
```
**Purpose:** Gets existing sheet or creates new one with headers
**Parameters:**
- `name` (string) - Sheet tab name
- `headers` (array) - Column headers for new sheet
**Returns:** Sheet object

### Property Management

```javascript
getScriptProperty(key)
```
**Purpose:** Retrieves Script Property value
**Parameters:** `key` (string) - Property name
**Returns:** Property value or null
**Note:** Consider using SecurityAgent_getProperty() for fail-safe access

### File Validation

```javascript
validateFileName(fileName)
```
**Purpose:** Validates filename against Gateway-OS naming conventions
**Parameters:** `fileName` (string)
**Returns:** `{ valid: boolean, errors: string[] }`
**Note:** Legacy function - PatternRegistryAgent provides dynamic validation

---

## Dependencies

### Required Blocks
None - this is a foundational block

### Required GAS Services
- PropertiesService
- SpreadsheetApp
- ContentService
- Logger

---

## Required Script Properties

| Property | Type | Required | Purpose |
|----------|------|----------|---------|
| `SPREADSHEET_ID` | string | Yes | Main spreadsheet for operations |

---

## Integration Pattern

Utilities is imported by nearly all blocks:

```javascript
// In other blocks
const ss = getSpreadsheet();
const sheet = getOrCreateSheet("MySheet", ["Col1", "Col2"]);
logEvent('MY_EVENT', { data: 'value' });
```

---

## Block Contract

### What This Block Provides

- ✅ Account verification
- ✅ HTTP response formatting
- ✅ Console logging
- ✅ Sheet access and creation
- ✅ Script Property access
- ✅ File validation

### What This Block Requires

- ✅ SPREADSHEET_ID in Script Properties
- ✅ Access to spreadsheet

### What This Block Does NOT Provide

- ❌ Business logic
- ❌ Security authorization (use SecurityAgent)
- ❌ Webhook routing (use Router)

---

## Used By (Blocks)

- Router
- All Agents
- Config (via getSpreadsheet pattern)

---

## Migration Notes

### Legacy Functions

Some functions are legacy and have better alternatives:

| Legacy | Modern Alternative | Reason |
|--------|-------------------|--------|
| `checkAccount()` | `SecurityAgent_checkAuthorization()` | More comprehensive security |
| `getScriptProperty()` | `SecurityAgent_getProperty()` | Fail-safe error handling |
| `validateFileName()` | `PatternRegistryAgent` dynamic validation | Dynamic pattern loading |

**Recommendation:** Keep for backward compatibility but prefer modern alternatives in new code.

---

## File Size

~3 KB (~106 lines)

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Extracted from prod-project with secure getSpreadsheet() |

---

## Related Blocks

- **Config** - Defines constants used by Utilities
- **SecurityAgent** - Provides more robust property/auth management
- **All Agents** - Use these utilities
