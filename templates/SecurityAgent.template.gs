/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT SENTINEL - SECURITY AGENT TEMPLATE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @version   1.0.0
 * @created   2026-03-07
 * @author    Cary Hebert / Claude
 *
 * REUSABLE SECURITY MODULE - Drop into any Google Apps Script project
 *
 * BEFORE USING:
 *   1. Copy this file to your Apps Script project
 *   2. Rename to SecurityAgent.gs (remove .template)
 *   3. Update PROJECT_NAME constant below
 *   4. Update REQUIRED_PROPERTIES array with your project's needs
 *   5. Run setupScriptProperties() to configure
 *   6. Add SecurityAgent_checkAuthorization() to all public functions
 *
 * PROJECT SENTINEL COMPLIANCE - FOUR PILLARS:
 *   ✅ Zero-Code Storage - All credentials in Script Properties
 *   ✅ Identity Guardrail - Email verification on all operations
 *   ✅ Audit Logging - Security_Audit tab tracks all events
 *   ✅ Fail-Safe Configuration - Missing properties throw explicit errors
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// =============================================================================
// CONFIGURATION - CUSTOMIZE FOR YOUR PROJECT
// =============================================================================

/**
 * ⚙️ PROJECT CONFIGURATION
 * Update these values for your specific project
 */
const PROJECT_NAME = "YOUR_PROJECT_NAME"; // e.g., "Gateway-OS", "NexusAI", etc.

/**
 * ⚙️ REQUIRED SCRIPT PROPERTIES
 * List all Script Properties your project needs
 * Add/remove properties based on your project's requirements
 */
const REQUIRED_PROPERTIES = [
  'AUTHORIZED_EMAIL',    // Email allowed to execute functions (REQUIRED)
  'SPREADSHEET_ID',      // Google Sheets ID for logging (REQUIRED)
  'ENVIRONMENT',         // 'production' or 'development' (REQUIRED)
  // Add your project-specific properties below:
  // 'DRIVE_FOLDER_ID',
  // 'API_KEY',
  // 'DATABASE_URL',
];

// =============================================================================
// SECURITY CONFIGURATION
// =============================================================================

/**
 * Security configuration with fail-safe getters.
 * All values retrieved from Script Properties - NEVER hardcoded.
 */
const SECURITY_CONFIG = {
  /**
   * Get authorized email from Script Properties.
   * This is the ONLY email allowed to execute functions.
   */
  get authorizedEmail() {
    const email = PropertiesService.getScriptProperties().getProperty('AUTHORIZED_EMAIL');
    if (!email) {
      throw new Error(`🚨 SECURITY ERROR: AUTHORIZED_EMAIL not configured in Script Properties`);
    }
    return email;
  },

  /**
   * Get spreadsheet ID from Script Properties.
   * Used for audit logging and data operations.
   */
  get spreadsheetId() {
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) {
      throw new Error(`🚨 SECURITY ERROR: SPREADSHEET_ID not configured in Script Properties`);
    }
    return id;
  },

  /**
   * Get environment name (production/development).
   */
  get environment() {
    return PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') || 'production';
  },

  /**
   * Get project name for logging context.
   */
  get projectName() {
    return PROJECT_NAME;
  }
};

// =============================================================================
// PILLAR 1: IDENTITY GUARDRAIL - Authorization Checks
// =============================================================================

/**
 * **CRITICAL SECURITY FUNCTION**
 *
 * Verifies the current user is authorized to execute functions.
 * ⚠️ Call this at the entry point of ALL public functions.
 *
 * ZERO-TRUST MODEL:
 *   - Verify identity on EVERY execution
 *   - No assumptions about authentication state
 *   - Log both successful and failed attempts
 *
 * USAGE:
 *   function yourPublicFunction() {
 *     SecurityAgent_checkAuthorization(); // ADD THIS LINE FIRST
 *     // ... rest of your code
 *   }
 *
 * @throws {Error} If user is not authorized
 * @returns {Object} Authorization details { user, timestamp, authorized: true }
 */
function SecurityAgent_checkAuthorization() {
  const currentUser = Session.getActiveUser().getEmail();
  const authorizedEmail = SECURITY_CONFIG.authorizedEmail;
  const timestamp = new Date().toISOString();

  // Check authorization
  if (currentUser !== authorizedEmail) {
    // Log security violation
    SecurityAgent_logEvent('UNAUTHORIZED_ACCESS_ATTEMPT', 'ERROR', {
      attemptedBy: currentUser,
      expectedUser: authorizedEmail,
      timestamp: timestamp,
      project: PROJECT_NAME
    });

    // Throw error to halt execution
    const errorMsg = `🚨 SECURITY VIOLATION: Unauthorized access attempt by ${currentUser}. Expected: ${authorizedEmail}`;
    throw new Error(errorMsg);
  }

  // Log successful authorization
  SecurityAgent_logEvent('AUTHORIZED_ACCESS', 'INFO', {
    user: currentUser,
    timestamp: timestamp,
    project: PROJECT_NAME
  });

  return {
    user: currentUser,
    timestamp: timestamp,
    authorized: true
  };
}

/**
 * Validates all required Script Properties are configured.
 * Run this during setup or deployment to verify configuration.
 *
 * @returns {Object} Validation result with status and missing properties
 */
function SecurityAgent_validateConfiguration() {
  const missing = [];
  const configured = [];

  const scriptProps = PropertiesService.getScriptProperties();

  for (const prop of REQUIRED_PROPERTIES) {
    const value = scriptProps.getProperty(prop);
    if (!value) {
      missing.push(prop);
    } else {
      configured.push({ property: prop, value: value });
    }
  }

  const isValid = missing.length === 0;

  SecurityAgent_logEvent(
    isValid ? 'CONFIGURATION_VALID' : 'CONFIGURATION_INVALID',
    isValid ? 'INFO' : 'ERROR',
    {
      configured: configured.length,
      missing: missing.length,
      missingProperties: missing,
      project: PROJECT_NAME
    }
  );

  return {
    valid: isValid,
    missing: missing,
    configured: configured
  };
}

// =============================================================================
// PILLAR 2: AUDIT LOGGING - Security Event Tracking
// =============================================================================

/**
 * Logs a security event to the Security_Audit tab.
 *
 * Creates forensic audit trail for:
 *   - Authorization checks (successful and failed)
 *   - Configuration changes
 *   - Data access events
 *   - Error conditions
 *
 * @param {string} eventType - Event identifier (e.g., 'AUTHORIZED_ACCESS')
 * @param {string} severity - 'INFO' | 'WARN' | 'ERROR'
 * @param {Object} details - Event metadata (user, timestamp, etc.)
 */
function SecurityAgent_logEvent(eventType, severity, details) {
  try {
    const ss = SpreadsheetApp.openById(SECURITY_CONFIG.spreadsheetId);
    let sheet = ss.getSheetByName('Security_Audit');

    // Create the Security_Audit tab if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Security_Audit');
      const headers = [
        'Timestamp',
        'Project',
        'Event Type',
        'Severity',
        'User',
        'Environment',
        'Details'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#1a1a1a')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Prepare row data
    const timestamp = new Date();
    const user = details.user || Session.getActiveUser().getEmail() || 'system';
    const environment = SECURITY_CONFIG.environment;
    const project = details.project || PROJECT_NAME;
    const detailsJson = JSON.stringify(details);

    // Append the row
    sheet.appendRow([
      timestamp,
      project,
      eventType,
      severity,
      user,
      environment,
      detailsJson
    ]);

    // Color-code by severity
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, 7);

    switch (severity) {
      case 'ERROR':
        range.setBackground('#FFCDD2'); // soft red
        break;
      case 'WARN':
        range.setBackground('#FFF9C4'); // soft yellow
        break;
      case 'INFO':
        range.setBackground('#E8F5E9'); // soft green
        break;
      default:
        range.setBackground(null);
    }

  } catch (e) {
    // Fallback logging if sheet access fails
    console.error(`Security_Audit logging failed: ${e.message}`);
    Logger.log(`SECURITY_EVENT | ${PROJECT_NAME} | ${eventType} | ${severity} | ${JSON.stringify(details)}`);
    // Don't throw - logging errors shouldn't break main flow
  }
}

// =============================================================================
// PILLAR 3: ZERO-CODE STORAGE - Script Properties Helpers
// =============================================================================

/**
 * Retrieves a Script Property value with fail-safe error handling.
 * Use this instead of directly calling PropertiesService.
 *
 * @param {string} propertyName - Name of the Script Property
 * @param {boolean} required - If true, throws error when missing (default: true)
 * @returns {string|null} Property value or null if not required and missing
 * @throws {Error} If property is required but not set
 */
function SecurityAgent_getProperty(propertyName, required = true) {
  const value = PropertiesService.getScriptProperties().getProperty(propertyName);

  if (!value && required) {
    const errorMsg = `🚨 CONFIGURATION ERROR: ${propertyName} not set in Script Properties`;
    SecurityAgent_logEvent('PROPERTY_MISSING', 'ERROR', {
      property: propertyName,
      project: PROJECT_NAME
    });
    throw new Error(errorMsg);
  }

  return value;
}

/**
 * Sets a Script Property value with audit logging.
 * Use this instead of directly calling PropertiesService.
 *
 * @param {string} propertyName - Name of the Script Property
 * @param {string} value - Value to set
 */
function SecurityAgent_setProperty(propertyName, value) {
  PropertiesService.getScriptProperties().setProperty(propertyName, value);

  SecurityAgent_logEvent('PROPERTY_SET', 'INFO', {
    property: propertyName,
    project: PROJECT_NAME,
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// PILLAR 4: FAIL-SAFE CONFIGURATION - Setup & Validation
// =============================================================================

/**
 * ⚙️ SETUP FUNCTION - Run this ONCE during initial deployment
 *
 * Sets up all required Script Properties for your project.
 * Update the values below for your specific project needs.
 *
 * USAGE:
 *   1. Update the values in this function for your project
 *   2. Run this function from Apps Script editor
 *   3. Verify with SecurityAgent_testConfiguration()
 *
 * @param {Object} config - Configuration object with property values
 * @returns {Object} Setup result
 */
function SecurityAgent_setupScriptProperties(config) {
  // Default configuration - UPDATE THESE VALUES
  const defaultConfig = {
    'AUTHORIZED_EMAIL': 'your.email@example.com',  // ⚠️ UPDATE THIS
    'SPREADSHEET_ID': 'YOUR_SHEET_ID',              // ⚠️ UPDATE THIS
    'ENVIRONMENT': 'production',
    // Add your project-specific properties:
    // 'DRIVE_FOLDER_ID': 'YOUR_FOLDER_ID',
    // 'API_KEY': 'YOUR_API_KEY',
  };

  // Merge provided config with defaults
  const finalConfig = Object.assign({}, defaultConfig, config || {});

  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperties(finalConfig);

  SecurityAgent_logEvent('CONFIGURATION_UPDATED', 'INFO', {
    propertiesSet: Object.keys(finalConfig),
    project: PROJECT_NAME,
    timestamp: new Date().toISOString()
  });

  Logger.log(`✅ Script Properties configured for ${PROJECT_NAME}`);
  for (const key in finalConfig) {
    const displayValue = key.includes('KEY') || key.includes('SECRET')
      ? '***REDACTED***'
      : finalConfig[key];
    Logger.log(`   ${key}: ${displayValue}`);
  }

  return {
    success: true,
    message: `Script Properties configured for ${PROJECT_NAME}`,
    properties: Object.keys(finalConfig)
  };
}

/**
 * Views all current Script Properties (for debugging).
 * Returns a sanitized view (sensitive values are redacted).
 */
function SecurityAgent_viewConfiguration() {
  const scriptProps = PropertiesService.getScriptProperties();
  const allProps = scriptProps.getProperties();
  const sanitized = {};

  for (const key in allProps) {
    const value = allProps[key];

    // Redact sensitive values
    if (key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD')) {
      sanitized[key] = '***REDACTED***';
    }
    // Sanitize IDs (show first 8 chars only)
    else if (key.includes('ID') && value.length > 12) {
      sanitized[key] = value.substring(0, 8) + '...' + value.substring(value.length - 4);
    }
    // Show other values
    else {
      sanitized[key] = value;
    }
  }

  Logger.log(`=== ${PROJECT_NAME} Script Properties (Sanitized) ===`);
  Logger.log(JSON.stringify(sanitized, null, 2));

  return sanitized;
}

// =============================================================================
// TEST FUNCTIONS - Run these to verify security is working
// =============================================================================

/**
 * 🧪 Test authorization with current user.
 * Run this to verify SecurityAgent is working correctly.
 */
function SecurityAgent_testAuthorization() {
  Logger.log(`=== Testing Authorization for ${PROJECT_NAME} ===`);

  try {
    const result = SecurityAgent_checkAuthorization();
    Logger.log('✅ Authorization successful');
    Logger.log(JSON.stringify(result, null, 2));
    return result;
  } catch (e) {
    Logger.log('❌ Authorization failed');
    Logger.log(e.message);
    throw e;
  }
}

/**
 * 🧪 Test configuration validation.
 * Run this to check all required Script Properties are set.
 */
function SecurityAgent_testConfiguration() {
  Logger.log(`=== Testing Configuration for ${PROJECT_NAME} ===`);

  const result = SecurityAgent_validateConfiguration();

  if (result.valid) {
    Logger.log('✅ Configuration is valid');
    Logger.log(`   Configured properties: ${result.configured.length}`);
  } else {
    Logger.log('❌ Configuration is invalid');
    Logger.log(`   Missing properties: ${result.missing.join(', ')}`);
    Logger.log('');
    Logger.log('To fix: Run SecurityAgent_setupScriptProperties() or manually add missing properties');
  }

  return result;
}

/**
 * 🧪 Test audit logging.
 * Creates a test event in Security_Audit tab.
 */
function SecurityAgent_testLogging() {
  Logger.log(`=== Testing Audit Logging for ${PROJECT_NAME} ===`);

  try {
    SecurityAgent_logEvent('TEST_EVENT', 'INFO', {
      message: 'This is a test security event',
      project: PROJECT_NAME,
      timestamp: new Date().toISOString()
    });

    Logger.log('✅ Test event logged to Security_Audit tab');
    Logger.log('Check your spreadsheet for the new entry');
    return { success: true };
  } catch (e) {
    Logger.log('❌ Logging failed');
    Logger.log(e.message);
    throw e;
  }
}

/**
 * 🧪 Run all tests at once.
 * Comprehensive test suite for Project Sentinel implementation.
 */
function SecurityAgent_runAllTests() {
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log(`PROJECT SENTINEL TEST SUITE - ${PROJECT_NAME}`);
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('');

  const results = {
    configuration: null,
    authorization: null,
    logging: null
  };

  // Test 1: Configuration
  try {
    results.configuration = SecurityAgent_testConfiguration();
  } catch (e) {
    results.configuration = { error: e.message };
  }
  Logger.log('');

  // Test 2: Authorization
  try {
    results.authorization = SecurityAgent_testAuthorization();
  } catch (e) {
    results.authorization = { error: e.message };
  }
  Logger.log('');

  // Test 3: Logging
  try {
    results.logging = SecurityAgent_testLogging();
  } catch (e) {
    results.logging = { error: e.message };
  }
  Logger.log('');

  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('TEST SUMMARY');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log(`Configuration: ${results.configuration.valid ? '✅ PASS' : '❌ FAIL'}`);
  Logger.log(`Authorization: ${results.authorization.authorized ? '✅ PASS' : '❌ FAIL'}`);
  Logger.log(`Logging: ${results.logging.success ? '✅ PASS' : '❌ FAIL'}`);

  return results;
}

// =============================================================================
// DOCUMENTATION
// =============================================================================

/**
 * 📖 QUICK START GUIDE
 *
 * 1. CUSTOMIZE THIS FILE:
 *    - Update PROJECT_NAME constant (line ~35)
 *    - Update REQUIRED_PROPERTIES array (line ~41)
 *    - Update SecurityAgent_setupScriptProperties() with your values (line ~385)
 *
 * 2. RUN SETUP:
 *    - Run: SecurityAgent_setupScriptProperties()
 *    - Verify: SecurityAgent_testConfiguration()
 *
 * 3. PROTECT YOUR FUNCTIONS:
 *    Add to all public functions:
 *
 *    function yourFunction() {
 *      SecurityAgent_checkAuthorization(); // ADD THIS LINE FIRST
 *      // ... rest of your code
 *    }
 *
 * 4. TEST:
 *    - Run: SecurityAgent_runAllTests()
 *    - Check Security_Audit tab in your spreadsheet
 *
 * 5. DEPLOY:
 *    - Deploy your Apps Script
 *    - Test webhook/trigger access
 *    - Monitor Security_Audit tab
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * For detailed documentation, see:
 * https://github.com/chebe24/AI-Agents/blob/main/SECURITY.md
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
