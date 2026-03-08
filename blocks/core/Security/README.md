# Security Agent Block

**Type:** Core Infrastructure
**Version:** 1.0.0
**Purpose:** Project Sentinel security implementation for Google Apps Script projects

---

## Overview

SecurityAgent provides the four pillars of Project Sentinel compliance:

✅ **Zero-Code Storage** - Credentials in Script Properties
✅ **Identity Guardrail** - Email authorization on every operation
✅ **Audit Logging** - Security_Audit tab tracks all events
✅ **Fail-Safe Configuration** - Missing properties throw explicit errors

---

## Public API

### Authorization

```javascript
SecurityAgent_checkAuthorization()
```
**Purpose:** Verifies current user is authorized
**Returns:** `{ user, timestamp, authorized: true }`
**Throws:** Error if unauthorized
**Usage:** Call at entry point of ALL public functions

### Configuration

```javascript
SecurityAgent_validateConfiguration()
```
**Purpose:** Validates all required Script Properties are set
**Returns:** `{ valid, missing[], configured[] }`

```javascript
SecurityAgent_setupScriptProperties(config)
```
**Purpose:** Sets up Script Properties for project
**Parameters:** `config` object with property key-value pairs

### Logging

```javascript
SecurityAgent_logEvent(eventType, severity, details)
```
**Purpose:** Logs security event to Security_Audit tab
**Parameters:**
- `eventType` (string) - Event identifier
- `severity` (string) - 'INFO' | 'WARN' | 'ERROR'
- `details` (object) - Event metadata

### Property Management

```javascript
SecurityAgent_getProperty(propertyName, required = true)
```
**Purpose:** Retrieves Script Property with fail-safe error handling
**Returns:** Property value or null if not required

---

## Dependencies

### Required
- **PropertiesService** (GAS built-in)
- **SpreadsheetApp** (GAS built-in) - for audit logging
- **Session** (GAS built-in) - for user email

### Optional
None - this is a foundational block with no dependencies on other blocks

---

## Required Script Properties

| Property | Type | Required | Default | Purpose |
|----------|------|----------|---------|---------|
| `AUTHORIZED_EMAIL` | string | Yes | - | Email allowed to execute functions |
| `SPREADSHEET_ID` | string | Yes | - | Sheet for Security_Audit tab |
| `ENVIRONMENT` | string | Yes | 'production' | Environment identifier |

---

## Integration Pattern

### Step 1: Include Block

Copy `SecurityAgent.gs` into your GAS project or composition.

### Step 2: Configure Script Properties

```javascript
SecurityAgent_setupScriptProperties({
  'AUTHORIZED_EMAIL': 'your@email.com',
  'SPREADSHEET_ID': 'YOUR_SHEET_ID',
  'ENVIRONMENT': 'production'
});
```

### Step 3: Protect Functions

```javascript
function yourPublicFunction() {
  SecurityAgent_checkAuthorization(); // Add this first
  // ... your code
}
```

### Step 4: Log Critical Events

```javascript
SecurityAgent_logEvent('DATA_EXPORTED', 'INFO', {
  recordCount: 100,
  user: Session.getActiveUser().getEmail()
});
```

---

## Block Contract

### What This Block Provides

- ✅ Authorization checking
- ✅ Security event logging
- ✅ Configuration validation
- ✅ Script Property management
- ✅ Security_Audit tab auto-creation

### What This Block Requires

- ✅ Script Properties must be configured
- ✅ SPREADSHEET_ID must point to accessible sheet
- ✅ User must have access to execute script

### What This Block Does NOT Provide

- ❌ Business logic
- ❌ Data processing
- ❌ UI components
- ❌ Webhook routing

---

## Used By (Compositions)

- `gateway-os-prod`
- `gateway-os-dev`
- `nexus-ai-inventory`
- Any GAS project requiring Project Sentinel compliance

---

## Testing

```javascript
// Test authorization
SecurityAgent_testAuthorization()

// Test configuration
SecurityAgent_testConfiguration()

// Test logging
SecurityAgent_testLogging()

// Run all tests
SecurityAgent_runAllTests()
```

---

## File Size

~10 KB (~400 lines)

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Initial extraction from prod-project |

---

## Related Blocks

- **Router** - Uses SecurityAgent_checkAuthorization()
- **All Agents** - Should use SecurityAgent_checkAuthorization()

---

## Template Available

See `/templates/SecurityAgent.template.gs` for customizable version with setup guide.
