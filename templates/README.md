# Gateway-OS Security Templates

**Purpose:** Reusable security modules for Google Apps Script projects
**Standard:** Project Sentinel Compliance
**Version:** 1.0.0

---

## Available Templates

### 1. SecurityAgent.template.gs

**Drop-in security module for any Google Apps Script project**

**Provides:**
- ✅ Zero-Code Storage (Script Properties)
- ✅ Identity Guardrail (Email authorization)
- ✅ Audit Logging (Security_Audit tab)
- ✅ Fail-Safe Configuration (Error handling)

**Use Cases:**
- Webhook handlers (n8n, Make, Zapier)
- Scheduled automation scripts
- Drive file processors
- Spreadsheet automation
- API integrations

**Implementation Time:** ~15 minutes

**Documentation:** See `IMPLEMENTATION_GUIDE.md`

---

## Quick Start

### 1. Copy Template to Your Project

```bash
# From your Apps Script project
cp templates/SecurityAgent.template.gs SecurityAgent.gs
```

Or copy-paste from the Apps Script editor.

### 2. Customize (3 changes)

```javascript
// Line ~35: Project name
const PROJECT_NAME = "YOUR_PROJECT_NAME";

// Line ~41: Required properties
const REQUIRED_PROPERTIES = [
  'AUTHORIZED_EMAIL',
  'SPREADSHEET_ID',
  'ENVIRONMENT',
  // Add your properties here
];

// Line ~385: Setup values
function SecurityAgent_setupScriptProperties(config) {
  const defaultConfig = {
    'AUTHORIZED_EMAIL': 'your@email.com',  // UPDATE
    'SPREADSHEET_ID': 'YOUR_SHEET_ID',     // UPDATE
    'ENVIRONMENT': 'production',
  };
  // ...
}
```

### 3. Run Setup

```javascript
SecurityAgent_setupScriptProperties()
SecurityAgent_runAllTests()
```

### 4. Protect Your Functions

```javascript
function yourPublicFunction() {
  SecurityAgent_checkAuthorization(); // Add this line
  // ... your code
}
```

**Done!** Your project is now Project Sentinel compliant. 🎉

---

## File Descriptions

| File | Purpose | Size |
|------|---------|------|
| `SecurityAgent.template.gs` | Core security module (template) | ~600 lines |
| `IMPLEMENTATION_GUIDE.md` | Step-by-step implementation guide | Comprehensive |
| `README.md` | This file (overview) | Quick reference |

---

## Implementation Levels

### Level 1: Basic (5 minutes)
- Copy template
- Update PROJECT_NAME
- Run setup function
- Add authorization checks to public functions

**Result:** Protected entry points, audit logging

### Level 2: Standard (15 minutes)
- Level 1 +
- Replace hardcoded IDs with Script Properties
- Add custom properties to REQUIRED_PROPERTIES
- Test authorization and logging

**Result:** Zero-code storage, full audit trail

### Level 3: Advanced (30 minutes)
- Level 2 +
- Add custom security events
- Implement multi-environment support
- Create security documentation for project

**Result:** Production-grade security compliance

---

## Example Projects

### Gateway-OS (Reference Implementation)

Location: `/prod-project/SecurityAgent.gs`

Features demonstrated:
- Authorization on webhook handlers
- Script Properties for all credentials
- Security_Audit tab integration
- Multi-agent architecture

### Coming Soon

- NexusAI security hardening (already has basic Sentinel)
- Inbox Processor security update
- Resume Tools security review

---

## Testing Your Implementation

Run the built-in test suite:

```javascript
SecurityAgent_runAllTests()
```

Expected output:
```
═══════════════════════════════════════
PROJECT SENTINEL TEST SUITE - YourProject
═══════════════════════════════════════

=== Testing Configuration for YourProject ===
✅ Configuration is valid
   Configured properties: 4

=== Testing Authorization for YourProject ===
✅ Authorization successful

=== Testing Audit Logging for YourProject ===
✅ Test event logged to Security_Audit tab

═══════════════════════════════════════
TEST SUMMARY
═══════════════════════════════════════
Configuration: ✅ PASS
Authorization: ✅ PASS
Logging: ✅ PASS
```

---

## Security Best Practices

### DO ✅

- Call `SecurityAgent_checkAuthorization()` at the start of all public functions
- Store ALL credentials in Script Properties (never hardcode)
- Use `SecurityAgent_getProperty()` instead of `PropertiesService` directly
- Log critical security events with `SecurityAgent_logEvent()`
- Run `SecurityAgent_validateConfiguration()` after deployment
- Monitor Security_Audit tab regularly

### DON'T ❌

- Skip authorization checks on "internal" functions
- Hardcode API keys, sheet IDs, or folder IDs in code
- Commit Script Properties values to Git
- Disable error throwing for missing credentials
- Share authorized email credentials
- Ignore Security_Audit warnings/errors

---

## Customization Examples

### Add API Key Management

```javascript
// 1. Add to REQUIRED_PROPERTIES
const REQUIRED_PROPERTIES = [
  'AUTHORIZED_EMAIL',
  'SPREADSHEET_ID',
  'ENVIRONMENT',
  'OPENAI_API_KEY',  // New
];

// 2. Use in code
function callOpenAI(prompt) {
  SecurityAgent_checkAuthorization();

  const apiKey = SecurityAgent_getProperty('OPENAI_API_KEY');
  // ... API call with key
}
```

### Add Multiple Environments

```javascript
// dev-setup.gs
function setupDev() {
  SecurityAgent_setupScriptProperties({
    'AUTHORIZED_EMAIL': 'dev@example.com',
    'SPREADSHEET_ID': 'DEV_SHEET_ID',
    'ENVIRONMENT': 'development'
  });
}

// prod-setup.gs
function setupProd() {
  SecurityAgent_setupScriptProperties({
    'AUTHORIZED_EMAIL': 'prod@example.com',
    'SPREADSHEET_ID': 'PROD_SHEET_ID',
    'ENVIRONMENT': 'production'
  });
}
```

### Add Custom Security Events

```javascript
// Log data exports
function exportData() {
  SecurityAgent_checkAuthorization();

  const data = getData();

  SecurityAgent_logEvent('DATA_EXPORTED', 'WARN', {
    recordCount: data.length,
    exportedBy: Session.getActiveUser().getEmail(),
    timestamp: new Date().toISOString()
  });

  return data;
}
```

---

## Migration Guide

### From Hardcoded to Secure

**Step 1:** Identify hardcoded values
```bash
# Search for hardcoded IDs
grep -r "const.*=.*[\"'][0-9A-Za-z_-]{20,}[\"']" *.gs
```

**Step 2:** Add to Script Properties
```javascript
// Add each found value to REQUIRED_PROPERTIES
// Add to setupScriptProperties()
```

**Step 3:** Replace references
```javascript
// Before:
const SHEET_ID = "1ABC123...";

// After:
const SHEET_ID = SecurityAgent_getProperty('SHEET_ID');
```

**Step 4:** Test
```javascript
SecurityAgent_testConfiguration()
```

---

## Support & Documentation

**Full Documentation:**
- Implementation Guide: `templates/IMPLEMENTATION_GUIDE.md`
- Security Overview: `SECURITY.md`
- Gateway-OS Example: `prod-project/SecurityAgent.gs`

**Common Issues:**
See troubleshooting section in `IMPLEMENTATION_GUIDE.md`

**Questions:**
Check Security_Audit tab for logged events and errors

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-07 | Initial release |
|  |  | - SecurityAgent template |
|  |  | - Implementation guide |
|  |  | - Gateway-OS reference impl |

---

## License

Personal Educational Use - Cary Hebert

---

**🔒 Make all your Google Apps Script projects production-ready with Project Sentinel!**
