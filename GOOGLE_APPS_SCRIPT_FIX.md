# 🔧 Google Apps Script Fix Instructions

## Issue Detected
Your Google Apps Script is showing "Script function not found: doGet" error. This means the script wasn't properly deployed or saved.

## Quick Fix Steps (2 minutes)

### Step 1: Go to Your Google Apps Script
1. Open: https://script.google.com/home
2. Find your project: "Metabolic Risk Calculator API" (or whatever you named it)
3. Click to open it

### Step 2: Replace the Code
1. **DELETE** all existing code in the editor
2. **COPY** the entire contents of `/app/google-apps-script-simple.js`
3. **PASTE** it into the Apps Script editor
4. Click **Save** (Ctrl+S)

### Step 3: Redeploy the Web App
1. Click **Deploy** > **Manage deployments**
2. Click the pencil icon ✏️ next to your existing deployment
3. Change **Version** from "1" to "New"
4. Click **Deploy**
5. **IMPORTANT**: Copy the new web app URL (it might be the same)

### Step 4: Test the Script
Visit this URL in your browser (replace with your actual deployment URL):
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=test
```

You should see: **"Google Apps Script is working!"**

### Step 5: Update Your Application (if URL changed)
If you got a new URL in Step 3, update `/app/script.js`:
```javascript
const GOOGLE_SHEETS_URL = 'YOUR_NEW_URL_HERE';
```

## Common Issues & Solutions

### ❌ "Script function not found: doGet"
- **Solution**: The code wasn't saved properly. Repeat Steps 1-3.

### ❌ "Authorization required"
- **Solution**: Run the script once manually in the Apps Script editor (Run > doGet)

### ❌ "Permission denied"
- **Solution**: Make sure deployment is set to "Anyone" access

### ❌ "Execution transcript disabled"
- **Solution**: This is normal, ignore this message

## Testing Your Integration

### Test 1: Direct Script Test
```bash
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=test"
```
Should return: "Google Apps Script is working!"

### Test 2: Application Test
1. Go to http://localhost:3000
2. Fill out patient form
3. Click "Calculate Risk"  
4. Click "Save Results"
5. Should see: "Patient record saved successfully to Google Sheets"

### Test 3: Check Your Google Sheet
1. Go to your Google Sheet
2. Should see a new row with patient data
3. Risk level should be color-coded

## What the Fixed Script Does

✅ **Handles GET requests** (for retrieving patient data)
✅ **Handles POST requests** (for saving patient data)  
✅ **Creates sheet automatically** with proper headers
✅ **Error handling** with clear messages
✅ **Simple, reliable code** that works consistently

## Still Having Issues?

### Check the Apps Script Logs:
1. In Apps Script editor, go to **Executions**
2. Look for any error messages
3. Share the error details for further help

### Verify Permissions:
1. Make sure you authorized the script to access Google Sheets
2. Check that the deployment has "Anyone" access
3. Ensure you're using the correct deployment URL

## Success Indicators

When everything is working, you should see:
- ✅ "Google Apps Script is working!" when testing the URL
- ✅ "Patient record saved successfully" in your application
- ✅ Patient data appearing in your Google Sheet
- ✅ Risk levels color-coded (Green/Yellow/Red)

## Next Steps After Fix

Once your Google Apps Script is working:
1. Test saving a few patient records
2. Check that data appears in your Google Sheet
3. Verify you can retrieve patient records in the application
4. Optional: Add your OpenAI API key for AI recommendations

Your application is already fully functional - it just needs the Google Apps Script connection to work properly!