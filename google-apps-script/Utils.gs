/**
 * Utils.gs - Helper functions for Gautam Ekta Sadhana
 */

/**
 * Get a sheet by name from the active spreadsheet.
 * @param {string} name - Sheet name
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet "' + name + '" not found.');
  }
  return sheet;
}

/**
 * Get a sheet by name, creating it with headers if it doesn't exist.
 */
function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }
  return sheet;
}

/**
 * Find a row in MEMBERS by phone number.
 * @param {string} phone - Phone number to search
 * @returns {number} Row number (1-based) or -1 if not found
 */
function findRowByPhone(phone) {
  var sheet = getSheet('MEMBERS');
  var data = sheet.getDataRange().getValues();
  // Column index 2 = Phone
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim() === String(phone).trim()) {
      return i + 1; // 1-based row number
    }
  }
  return -1;
}

/**
 * Find a row in MEMBERS by user ID.
 * @param {string} id - User ID to search
 * @returns {number} Row number (1-based) or -1 if not found
 */
function findRowById(id) {
  var sheet = getSheet('MEMBERS');
  var data = sheet.getDataRange().getValues();
  // Column index 0 = ID
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(id).trim()) {
      return i + 1; // 1-based row number
    }
  }
  return -1;
}

/**
 * Generate a short unique ID (8 characters).
 * @returns {string}
 */
function generateId() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 8);
}

/**
 * Get today's date in yyyy-MM-dd format in Asia/Kolkata timezone.
 * @returns {string}
 */
function todayIST() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
}

/**
 * Get yesterday's date in yyyy-MM-dd format in Asia/Kolkata timezone.
 * @returns {string}
 */
function yesterdayIST() {
  var now = new Date();
  now.setDate(now.getDate() - 1);
  return Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd');
}

/**
 * Return a JSON ContentService response.
 * @param {Object} data - Data to serialize
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
