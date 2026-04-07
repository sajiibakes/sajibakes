/**
 * SAJI BAKES GIVEAWAY ENTRIES: APP SCRIPT BACKEND
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" -> "Apps Script" in the top menu.
 * 3. Delete any code in the editor and paste ALL of this code into it.
 * 4. Save the project (click the Floppy Disk icon or Ctrl+S).
 * 5. Click the "Deploy" button (top right) -> "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Set "Execute as" to "Me (your email)".
 * 8. Set "Who has access" to "Anyone".
 * 9. Click "Deploy".
 * 10. You will be asked to "Authorize access". Follow the prompts to authorize it.
 *     (If Google shows a "Google hasn't verified this app" warning, click "Advanced" and then "Go to project (unsafe)").
 * 11. Copy the "Web app URL" that is provided at the end of the deployment.
 * 12. Paste that URL into the `config.js` file for APP_SCRIPT_URL.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var rawValues = data.values; // [[username, text, timestamp], ...]

    if (!rawValues || rawValues.length === 0) {
      return ContentService.createTextOutput("Error: No data").setMimeType(ContentService.MimeType.TEXT);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.clearContents();

    // Add Header Row
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

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

// Needed to handle preflight CORS requests from the browser
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
