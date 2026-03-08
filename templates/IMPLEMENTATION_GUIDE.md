# Project Sentinel - Security Agent Implementation Guide

**Version:** 1.0.0
**Created:** 2026-03-07
**Purpose:** Step-by-step guide for implementing Project Sentinel security in any Google Apps Script project

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Customization Guide](#customization-guide)
5. [Testing & Verification](#testing--verification)
6. [Integration Patterns](#integration-patterns)
7. [Troubleshooting](#troubleshooting)
8. [Examples](#examples)

---

## Overview

The SecurityAgent template provides **drop-in Project Sentinel compliance** for any Google Apps Script project.

### What You Get

✅ **Zero-Code Storage** - All credentials in Script Properties
✅ **Identity Guardrail** - Email verification on every operation
✅ **Audit Logging** - Security_Audit tab tracks all events
✅ **Fail-Safe Configuration** - Missing properties throw explicit errors

### Time to Implement

- **Initial Setup:** 10 minutes
- **Integration:** 5-30 minutes (depending on project size)
- **Testing:** 5 minutes

---

## Prerequisites

Before implementing, ensure you have:

- [ ] Google Apps Script project (created or existing)
- [ ] Google Sheets spreadsheet for logging
- [ ] Authorized user email address
- [ ] Editor access to Apps Script project

---

## Installation Steps

### Step 1: Copy the Template

1. Navigate to `templates/SecurityAgent.template.gs`
2. Copy the entire file contents
3. Open your Apps Script project
4. Create a new file called `SecurityAgent.gs`
5. Paste the template contents

### Step 2: Customize for Your Project

Edit these constants in `SecurityAgent.gs`:

```javascript
// Line ~35: Update project name
const PROJECT_NAME = "YOUR_PROJECT_NAME"; // e.g., "NexusAI", "InboxProcessor"

// Line ~41: Define required Script Properties
const REQUIRED_PROPERTIES = [
  'AUTHORIZED_EMAIL',    // REQUIRED
  'SPREADSHEET_ID',      // REQUIRED
  'ENVIRONMENT',         // REQUIRED
  // Add your project-specific properties:
  'DRIVE_FOLDER_ID',     // Example: if you scan Drive folders
  'API_KEY',             // Example: if you use external APIs
  // ... add more as needed
];
```

### Step 3: Configure Setup Function

Update `SecurityAgent_setupScriptProperties()` (around line 385):

```javascript
function SecurityAgent_setupScriptProperties(config) {
  const defaultConfig = {
    'AUTHORIZED_EMAIL': 'your.email@example.com',  // ⚠️ UPDATE THIS
    'SPREADSHEET_ID': 'YOUR_SHEET_ID',              // ⚠️ UPDATE THIS
    'ENVIRONMENT': 'production',
    // Add your project-specific values:
    'DRIVE_FOLDER_ID': 'YOUR_FOLDER_ID',           // If needed
    'API_KEY': 'YOUR_API_KEY',                     // If needed
  };
  // ... rest of function
}
```

### Step 4: Run Setup

In the Apps Script editor:

1. Select `SecurityAgent_setupScriptProperties` from the function dropdown
2. Click **Run**
3. Authorize the script when prompted
4. Check the logs for success message

### Step 5: Verify Configuration

Run the test suite:

```javascript
SecurityAgent_runAllTests()
```

Expected output:
```
✅ Configuration is valid
✅ Authorization successful
✅ Test event logged
```

---

## Customization Guide

### Adding Project-Specific Properties

**Example: Adding Database URL**

1. Add to `REQUIRED_PROPERTIES`:
```javascript
const REQUIRED_PROPERTIES = [
  'AUTHORIZED_EMAIL',
  'SPREADSHEET_ID',
  'ENVIRONMENT',
  'DATABASE_URL',  // ← Add this
];
```

2. Add to `SecurityAgent_setupScriptProperties()`:
```javascript
const defaultConfig = {
  'AUTHORIZED_EMAIL': 'you@example.com',
  'SPREADSHEET_ID': 'YOUR_SHEET_ID',
  'ENVIRONMENT': 'production',
  'DATABASE_URL': 'https://your-db.com',  // ← Add this
};
```

3. Access in your code:
```javascript
const dbUrl = SecurityAgent_getProperty('DATABASE_URL');
```

### Making Properties Optional

If a property is not critical:

```javascript
// Required (throws error if missing)
const apiKey = SecurityAgent_getProperty('API_KEY', true);

// Optional (returns null if missing)
const optionalKey = SecurityAgent_getProperty('OPTIONAL_KEY', false);
```

---

## Testing & Verification

### Quick Test

Run in Apps Script editor:

```javascript
SecurityAgent_runAllTests()
```

### Individual Tests

**Test Configuration:**
```javascript
SecurityAgent_testConfiguration()
```
Checks: All Script Properties are set

**Test Authorization:**
```javascript
SecurityAgent_testAuthorization()
```
Checks: Current user is authorized

**Test Logging:**
```javascript
SecurityAgent_testLogging()
```
Checks: Security_Audit tab created and writable

### Verify Security_Audit Tab

1. Open your Google Sheets spreadsheet
2. Look for "Security_Audit" tab
3. Should contain test events with:
   - Timestamp
   - Project name
   - Event type
   - Severity (color-coded)
   - User email
   - Details (JSON)

---

## Integration Patterns

### Pattern 1: Protect Public Functions

**Before (❌ INSECURE):**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  // ... process data
}
```

**After (✅ SECURE):**
```javascript
function doPost(e) {
  SecurityAgent_checkAuthorization(); // ADD THIS LINE FIRST

  const data = JSON.parse(e.postData.contents);
  // ... process data
}
```

### Pattern 2: Replace Hardcoded IDs

**Before (❌ INSECURE):**
```javascript
const SPREADSHEET_ID = "1ABC123xyz..."; // Hardcoded!

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
```

**After (✅ SECURE):**
```javascript
function getSpreadsheet() {
  const id = SecurityAgent_getProperty('SPREADSHEET_ID');
  return SpreadsheetApp.openById(id);
}
```

### Pattern 3: Secure Configuration Object

**Before (❌ INSECURE):**
```javascript
const CONFIG = {
  apiKey: "sk-1234567890",  // Hardcoded!
  endpoint: "https://api.example.com"
};
```

**After (✅ SECURE):**
```javascript
const CONFIG = {
  get apiKey() {
    return SecurityAgent_getProperty('API_KEY');
  },
  get endpoint() {
    return SecurityAgent_getProperty('API_ENDPOINT');
  }
};
```

### Pattern 4: Log Security Events

Add logging for important operations:

```javascript
function processPayment(amount) {
  SecurityAgent_checkAuthorization();

  try {
    // ... payment processing

    SecurityAgent_logEvent('PAYMENT_PROCESSED', 'INFO', {
      amount: amount,
      timestamp: new Date().toISOString()
    });

  } catch (e) {
    SecurityAgent_logEvent('PAYMENT_FAILED', 'ERROR', {
      error: e.message,
      amount: amount
    });
    throw e;
  }
}
```

---

## Troubleshooting

### Error: "AUTHORIZED_EMAIL not configured"

**Cause:** Script Properties not set
**Fix:** Run `SecurityAgent_setupScriptProperties()`

### Error: "Unauthorized access attempt"

**Cause:** Wrong user email
**Fix:**
1. Check Security_Audit tab for attempted email
2. Update `AUTHORIZED_EMAIL` in Script Properties
3. Or log in with correct account

### Error: "SPREADSHEET_ID not configured"

**Cause:** Missing SPREADSHEET_ID
**Fix:**
1. Get your Sheet ID from URL: `docs.google.com/spreadsheets/d/[THIS_PART]/edit`
2. Run `SecurityAgent_setupScriptProperties()` with correct ID

### Security_Audit Tab Not Created

**Cause:** No security events logged yet
**Fix:** Run `SecurityAgent_testLogging()` to create the tab

### Configuration Test Fails

**Cause:** Missing Script Properties
**Fix:**
1. Run `SecurityAgent_testConfiguration()` to see which properties are missing
2. Add missing properties manually or via `SecurityAgent_setupScriptProperties()`

---

## Examples

### Example 1: Simple Webhook Handler

```javascript
// SecurityAgent.gs already added to project

function doPost(e) {
  // 🔒 SECURITY CHECKPOINT
  SecurityAgent_checkAuthorization();

  try {
    const payload = JSON.parse(e.postData.contents);

    // Process the payload
    const result = processData(payload);

    // Log success
    SecurityAgent_logEvent('WEBHOOK_PROCESSED', 'INFO', {
      action: payload.action
    });

    return ContentService.createTextOutput(JSON.stringify(result));

  } catch (e) {
    // Log error
    SecurityAgent_logEvent('WEBHOOK_ERROR', 'ERROR', {
      error: e.message
    });
    throw e;
  }
}

function processData(payload) {
  // Your business logic here
  return { success: true };
}
```

### Example 2: Drive Folder Scanner

```javascript
// SecurityAgent.gs configuration
const REQUIRED_PROPERTIES = [
  'AUTHORIZED_EMAIL',
  'SPREADSHEET_ID',
  'ENVIRONMENT',
  'DRIVE_FOLDER_ID'  // Added for Drive scanning
];

// Main function
function scanDriveFolder() {
  // 🔒 SECURITY CHECKPOINT
  SecurityAgent_checkAuthorization();

  try {
    // Get folder ID securely
    const folderId = SecurityAgent_getProperty('DRIVE_FOLDER_ID');
    const folder = DriveApp.getFolderById(folderId);

    const files = folder.getFiles();
    let count = 0;

    while (files.hasNext()) {
      const file = files.next();
      // Process file
      count++;
    }

    // Log success
    SecurityAgent_logEvent('DRIVE_SCAN_COMPLETE', 'INFO', {
      filesProcessed: count,
      folderId: folderId
    });

    return count;

  } catch (e) {
    SecurityAgent_logEvent('DRIVE_SCAN_ERROR', 'ERROR', {
      error: e.message
    });
    throw e;
  }
}
```

### Example 3: Multi-Environment Setup

```javascript
// Development setup
function setupDevelopment() {
  SecurityAgent_setupScriptProperties({
    'AUTHORIZED_EMAIL': 'dev@example.com',
    'SPREADSHEET_ID': 'DEV_SHEET_ID',
    'ENVIRONMENT': 'development',
    'API_ENDPOINT': 'https://dev-api.example.com'
  });
}

// Production setup
function setupProduction() {
  SecurityAgent_setupScriptProperties({
    'AUTHORIZED_EMAIL': 'prod@example.com',
    'SPREADSHEET_ID': 'PROD_SHEET_ID',
    'ENVIRONMENT': 'production',
    'API_ENDPOINT': 'https://api.example.com'
  });
}

// Your code automatically adapts to environment
function callAPI(data) {
  SecurityAgent_checkAuthorization();

  const endpoint = SecurityAgent_getProperty('API_ENDPOINT');
  const env = SecurityAgent_getProperty('ENVIRONMENT');

  Logger.log(`Calling ${env} API: ${endpoint}`);
  // ... API call logic
}
```

---

## Checklist

Use this checklist when implementing Project Sentinel:

### Setup Phase
- [ ] Copy SecurityAgent.template.gs to project
- [ ] Rename to SecurityAgent.gs
- [ ] Update PROJECT_NAME constant
- [ ] Update REQUIRED_PROPERTIES array
- [ ] Update SecurityAgent_setupScriptProperties() values
- [ ] Run setupScriptProperties()
- [ ] Run testConfiguration()

### Integration Phase
- [ ] Add SecurityAgent_checkAuthorization() to all public functions
- [ ] Replace hardcoded IDs with SecurityAgent_getProperty()
- [ ] Add SecurityAgent_logEvent() for critical operations
- [ ] Remove any hardcoded credentials from code
- [ ] Update configuration objects to use getters

### Testing Phase
- [ ] Run SecurityAgent_runAllTests()
- [ ] Verify Security_Audit tab created
- [ ] Test authorization with correct user
- [ ] Test authorization with wrong user (should fail)
- [ ] Verify all Script Properties are set
- [ ] Test main application functions

### Deployment Phase
- [ ] Deploy to production
- [ ] Verify Script Properties in production environment
- [ ] Test production webhook/trigger access
- [ ] Monitor Security_Audit tab for issues
- [ ] Document any project-specific security notes

---

## Support

**Documentation:**
- Main Security Docs: `/SECURITY.md`
- Template File: `/templates/SecurityAgent.template.gs`
- Example Project: Gateway-OS (`/prod-project/SecurityAgent.gs`)

**Questions or Issues:**
- Check Security_Audit tab for logged errors
- Run `SecurityAgent_testConfiguration()` to diagnose
- Review troubleshooting section above

---

**Last Updated:** 2026-03-07
**Version:** 1.0.0
**Maintained By:** Cary Hebert / Claude
**License:** Personal Educational Use
