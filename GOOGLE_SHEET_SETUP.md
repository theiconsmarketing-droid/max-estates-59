# Google Sheet Lead Integration Guide

Your website forms are now configured to send leads to:
`https://script.google.com/macros/s/AKfycbw-4XKZTJStKCNNw3Ux3f2MYN562UHWC5TdfBchNr60S6-c9oIgv330o-c2xIaArSowcQ/exec`

---

## Complete Google Apps Script Code (`Code.gs`)

Make sure your **Apps Script** editor inside Google Sheet (`1E8mDSwVhqiudDakEc6q8xbw-ev35jZ_yq1JyK9l3lTw`) has this complete code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    
    var name = data.name || '';
    var email = data.email || '';
    var phone = data.phone || '';
    var configuration = data.configuration || '';
    var source = data.source || '';
    var website = data.website || '';
    
    // Auto-create headers if sheet is brand new (row 1 is empty)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Full Name", "Email", "Phone", "Configuration", "Form Source", "Website"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }
    
    // Append lead row
    sheet.appendRow([formattedDate, name, email, phone, configuration, source, website]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Max Estates 59 Lead Webhook is running!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Critical Check in Apps Script:
Whenever you update code in `Code.gs`, click **Deploy** → **Manage deployments** → Click the **✏️ Pencil Icon** → Select **Version: New version** → Click **Deploy** so the active Web App runs the latest code!
