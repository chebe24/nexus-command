# InventoryAgent Block

**Type:** Business Logic Agent
**Version:** 1.0.0
**Purpose:** Scans Google Drive folder and maintains AI agent inventory sheet

---

## Overview

InventoryAgent scans a configured Drive folder for AI agent files, maintains an inventory sheet tracking their status, and flags stale entries as deprecated. Originally extracted from NexusAI's `update-db.gs`.

---

## Public API

### Entry Point

```javascript
InventoryAgent_init(payload)
```
**Purpose:** Main entry point called by Router
**Parameters:** `payload` - Webhook payload object
**Returns:** Plain response object `{ code, message, data }`
**Router Contract:** `action: "inventory"`

---

## Functionality

1. **Drive Scan**
   - Reads DRIVE_FOLDER_ID from Script Properties
   - Scans `/active` subfolder for agent files
   - Extracts metadata (name, last modified, etc.)

2. **Inventory Update**
   - Creates or updates "Inventory" sheet tab
   - Writes agent metadata to sheet
   - Tracks: ID, Name, Ecosystem, Status, Last Updated, URL, Notes

3. **Deprecation Detection**
   - Flags agents not modified in DEPRECATED_DAYS
   - Updates Status column to "Deprecated"
   - Logs count of deprecated items

---

## Dependencies

### Required Blocks
- **SecurityAgent** - For authorization (called by Router)
- **Utilities** - For getOrCreateSheet(), logEvent()

### Required GAS Services
- DriveApp (folder/file access)
- SpreadsheetApp (via Utilities)

---

## Required Script Properties

| Property | Type | Required | Default | Purpose |
|----------|------|----------|---------|---------|
| `DRIVE_FOLDER_ID` | string | Yes | - | Google Drive folder containing `/active` subfolder |
| `SPREADSHEET_ID` | string | Yes | - | Via Utilities dependency |
| `DEPRECATED_DAYS` | number | No | 90 | Days until agent flagged as deprecated |

---

## Sheet Structure

**Tab Name:** `Inventory`

| Column | Type | Description |
|--------|------|-------------|
| ID | string | Unique file ID |
| Name | string | File/folder name |
| Ecosystem | string | Always "Active" (subfolder name) |
| Status | string | "Active" or "Deprecated" |
| Last Updated | date | Last modified timestamp |
| URL | string | Drive link to file |
| Notes | string | Reserved for future use |

---

## Integration Pattern

### Router Registration

```javascript
// In Router.gs
case "inventory":
  return _Router_wrapResponse(InventoryAgent_init(payload));
```

### Webhook Call

```json
POST https://your-web-app-url/exec
{
  "action": "inventory"
}
```

### Manual Trigger

```javascript
// Run directly in Apps Script editor
InventoryAgent_init({})
```

---

## Block Contract

### What This Block Provides

- ✅ Drive folder scanning
- ✅ Inventory sheet management
- ✅ Deprecation flagging
- ✅ Audit logging integration

### What This Block Requires

- ✅ DRIVE_FOLDER_ID points to valid folder with `/active` subfolder
- ✅ User has Drive access to folder
- ✅ SecurityAgent authorization (via Router)

### What This Block Does NOT Provide

- ❌ File content analysis
- ❌ Automatic deprecation cleanup
- ❌ Multi-folder scanning

---

## Used By (Compositions)

- `gateway-os-prod` (if registered)
- `gateway-os-dev` (if registered)
- `nexus-ai-inventory` (primary use case)

---

## Migration History

**Origin:** NexusAI `scripts/update-db.gs`
**Changes:**
- Removed embedded security layer (now uses SecurityAgent)
- Adapted to Gateway-OS Router pattern
- Uses Utilities helpers instead of duplicate code
- Refactored for modular composition

---

## Future Enhancements

- [ ] Support multiple folder scanning
- [ ] Configurable deprecation thresholds per agent
- [ ] Email notifications for deprecated agents
- [ ] Export inventory to JSON/CSV

---

## File Size

~10 KB (~350 lines)

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Extracted from NexusAI, adapted to Gateway-OS |

---

## Related Blocks

- **SecurityAgent** - Provides authorization
- **Utilities** - Provides sheet helpers
- **Router** - Routes "inventory" action
