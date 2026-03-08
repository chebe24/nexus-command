# Router Block

**Type:** Core Infrastructure
**Version:** 1.0.0
**Purpose:** Webhook request routing and agent orchestration

---

## Overview

Router is the central entry point for all webhook requests in Gateway-OS. It receives POST requests from external tools (n8n, Make, iOS Shortcuts), parses the payload, and routes to the appropriate Agent based on the `action` field.

---

## Public API

### HTTP Endpoints

```javascript
doGet(e)
```
**Purpose:** Health check endpoint
**Returns:** `{ code: 200, message: "Gateway-OS [ENV] is online" }`
**Usage:** Visit deployment URL in browser to verify service is running

```javascript
doPost(e)
```
**Purpose:** Main webhook entry point
**Parameters:** `e` - Event object with postData.contents (JSON payload)
**Returns:** ContentService response with JSON

---

## Request Flow

```
External Tool (n8n, Make, Shortcut)
    │
    │  POST { "action": "inventory", ... }
    ▼
doPost(e)
    │
    ├─ SecurityAgent_checkAuthorization()  ← Security check
    ├─ Parse JSON payload
    ├─ Extract action field
    │
    └─ Route to Agent:
        ├─ "fileops"      → _Router_handleFileOps()
        ├─ "logentry"     → LoggerAgent_logEntry()
        ├─ "syncpatterns" → PatternRegistryAgent_sync()
        ├─ "inventory"    → InventoryAgent_init()
        └─ unknown        → 400 error
```

---

## Agent Registration

To add a new agent route:

```javascript
// In Router.gs, add to switch statement:
case "youraction":
  return _Router_wrapResponse(YourAgent_init(payload));
```

---

## Dependencies

### Required Blocks
- **SecurityAgent** - For authorization checking
- **Utilities** - For buildResponse(), logEvent()

### Required GAS Services
- ContentService
- JSON parsing

---

## Payload Contract

All webhook requests must follow this schema:

```json
{
  "action": "string (required)",
  "...": "additional fields depend on agent"
}
```

**Example:**
```json
{
  "action": "inventory"
}
```

```json
{
  "action": "logentry",
  "title": "My Log Entry",
  "platform": "Claude Code",
  "status": "Complete"
}
```

---

## Response Format

All responses follow standard envelope:

```json
{
  "code": 200,
  "message": "Success message",
  "data": {},
  "env": "production"
}
```

---

## Required Script Properties

| Property | Type | Required | Purpose |
|----------|------|----------|---------|
| `AUTHORIZED_EMAIL` | string | Yes | Via SecurityAgent |
| `SPREADSHEET_ID` | string | Yes | Via Utilities |

---

## Integration Pattern

### Step 1: Include Dependencies

Router requires:
- SecurityAgent.gs
- Utilities.gs
- Config.gs (for ENV variable)

### Step 2: Register Agents

Add routes in the switch statement for each agent.

### Step 3: Deploy as Web App

1. Deploy → New deployment
2. Execute as: Me
3. Who has access: Anyone
4. Copy web app URL

---

## Block Contract

### What This Block Provides

- ✅ HTTP endpoint handling (GET/POST)
- ✅ Payload validation
- ✅ Action-based routing
- ✅ Security integration
- ✅ Response formatting

### What This Block Requires

- ✅ SecurityAgent for authorization
- ✅ Utilities for helpers
- ✅ Agents to route to

### What This Block Does NOT Provide

- ❌ Business logic
- ❌ Data processing
- ❌ Direct sheet access

---

## Used By (Compositions)

- `gateway-os-prod`
- `gateway-os-dev`
- Any composition that needs webhook entry point

---

## Registered Routes (Current)

| Action | Agent | Purpose |
|--------|-------|---------|
| `fileops` | _Router_handleFileOps | File operation logging |
| `logentry` | LoggerAgent | Chat log entry |
| `syncpatterns` | PatternRegistryAgent | Pattern registry sync |
| `inventory` | InventoryAgent (if registered) | Drive inventory scan |

---

## Error Handling

- 400: Bad request (invalid JSON, missing action)
- 500: Server error (agent threw exception)
- 403: Unauthorized (SecurityAgent check failed)

---

## Testing

```javascript
// Test GET (health check)
// Visit: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

// Test POST (via curl)
curl -X POST YOUR_WEB_APP_URL \
  -H "Content-Type: application/json" \
  -d '{"action": "logentry", "title": "Test"}'
```

---

## File Size

~4 KB (~130 lines)

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Extracted from prod-project with security integration |

---

## Related Blocks

- **SecurityAgent** - Called at doPost() entry
- **Utilities** - Used for buildResponse()
- **All Agents** - Receive routed requests
