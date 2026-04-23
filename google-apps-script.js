/**
 * SAJI BAKES: MULTI-PURPOSE APP SCRIPT BACKEND
 * 
 * This script handles:
 * 1. Giveaway comment syncing (Rule-based validation)
 * 2. Order status updates (Pending/Completed)
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open your Google Sheet (Orders or Giveaway).
 * 2. Click "Extensions" -> "Apps Script" in the top menu.
 * 3. Delete any code in the editor and paste ALL of this code into it.
 * 4. Save and Deploy as a Web App ("Execute as: Me", "Who has access: Anyone").
 * 5. Update the `APP_SCRIPT_URL` in `config.js` with the new deployment URL.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // Handle Order Status Update
    if (action === 'updateOrderStatus') {
      return handleUpdateOrderStatus(data);
    } 
    
    // Handle Giveaway Sync (Default action)
    return handleGiveawaySync(data);

  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Updates a specific row's status in Column K (11)
 */
function handleUpdateOrderStatus(data) {
  var rowIndex = parseInt(data.rowIndex);
  var status = data.status;
  
  if (isNaN(rowIndex) || rowIndex < 1) {
    return ContentService.createTextOutput("Error: Invalid Row Index").setMimeType(ContentService.MimeType.TEXT);
  }

  // Target the active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Target the first sheet (usually 'Sheet1' or the first tab)
  var sheet = ss.getSheets()[0]; 
  
  // Ensure Column 11 (K) has a header if we're updating for the first time
  if (sheet.getRange(1, 11).getValue() === "") {
    sheet.getRange(1, 11).setValue("Status");
  }

  // Update Status in Column K (11th column)
  sheet.getRange(rowIndex, 11).setValue(status);
  
  return ContentService.createTextOutput("Success: Status Updated to " + status).setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Processes Instagram comments for the Giveaway sheet
 */
function handleGiveawaySync(data) {
  var rawValues = data.values; // [[username, text, timestamp], ...]

  if (!rawValues || rawValues.length === 0) {
    return ContentService.createTextOutput("Error: No data").setMimeType(ContentService.MimeType.TEXT);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clearContents();

  // Add Header Row for Giveaway
  var processedValues = [
    ["Username", "Comment", "Timestamp", "Valid Tags (3+)", "Unique Entry"]
  ];

  var seenUsers = {};

  for (var i = 0; i < rawValues.length; i++) {
    var row = rawValues[i];
    var username = row[0];
    var text = row[1];
    var timestamp = row[2];

    // Rule 1: Check for 3+ tags (mentions starting with @)
    var tags = text.match(/@[\w.]+/g) || [];
    var hasThreeTags = tags.length >= 3;
    var flagValidTags = hasThreeTags ? 1 : 0;

    // Rule 2: Check for unique valid entry per user
    var flagUniqueEntry = 0;
    if (hasThreeTags && !seenUsers[username]) {
      flagUniqueEntry = 1;
      seenUsers[username] = true;
    }

    processedValues.push([username, text, timestamp, flagValidTags, flagUniqueEntry]);
  }

  if (processedValues.length > 0) {
    sheet.getRange(1, 1, processedValues.length, 5).setValues(processedValues);
  }

  return ContentService.createTextOutput("Success: Giveaway Synced").setMimeType(ContentService.MimeType.TEXT);
}

// Handle preflight CORS requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
