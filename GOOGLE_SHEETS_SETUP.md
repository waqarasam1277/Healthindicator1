# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up Google Sheets as the primary data storage for your Metabolic Risk Calculator application.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Metabolic Risk Calculator - Patient Records"
4. Keep this sheet open as you'll need it in the next steps

## Step 2: Set up Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete the default `myFunction()` code
3. Copy and paste the entire contents of `/app/google-apps-script.js` into the script editor
4. Click **Save** and give your project a name (e.g., "Metabolic Risk Calculator API")

## Step 3: Deploy the Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Type" and select **Web app**
3. Configure the deployment:
   - **Description**: "Metabolic Risk Calculator API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Important**: Copy the **Web app URL** - you'll need this for your application

## Step 4: Configure Your Application

1. Open `/app/script.js` in your project
2. Find this line:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_ID` with the URL you copied in Step 3

## Step 5: Configure OpenAI (Optional)

If you want AI-powered recommendations:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. In `/app/script.js`, replace:
   ```javascript
   const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
   ```
   with your actual API key

## Step 6: Test the Setup

1. Start your application:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. Fill out a test patient form and click "Calculate Risk"
4. Click "Save Results" to test Google Sheets integration
5. Check your Google Sheet - you should see the patient data appear

## Features

### ✅ What Works Now:
- **Patient Data Storage**: All patient records saved to Google Sheets
- **Real-time Sync**: Data immediately appears in your Google Sheet
- **Risk Calculation**: BMI, TyG Index, TG/HDL Ratio calculations
- **Visual Analytics**: Advanced gauge charts and risk visualization
- **PDF Export**: Professional medical reports
- **Search & Filter**: Patient record management
- **Color Coding**: Risk levels automatically color-coded in sheets
- **AI Recommendations**: OpenAI-powered health advice (if API key provided)

### 📊 Google Sheet Features:
- **Automatic Headers**: Sheet automatically sets up proper column headers
- **Color Coding**: Risk levels highlighted (Green=Low, Yellow=Moderate, Red=High)
- **Data Validation**: Proper data formatting and validation
- **Sortable Data**: Automatically sorted by creation date
- **Export Ready**: Data formatted for easy analysis and reporting

## Troubleshooting

### Common Issues:

1. **"Google Sheets URL not configured" error**
   - Make sure you replaced `YOUR_GOOGLE_APPS_SCRIPT_ID` with your actual deployment URL

2. **Permission errors**
   - Ensure the web app is deployed with "Anyone" access
   - You may need to authorize the script on first run

3. **Data not appearing in sheets**
   - Check the browser console for error messages
   - Verify the Google Apps Script is deployed as a web app
   - Test the script URL directly in your browser - it should return JSON

4. **CORS errors**
   - This shouldn't happen with Apps Script, but if it does, make sure the deployment is set to "Anyone" access

### Testing the Google Apps Script:

You can test your deployment by visiting:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=test
```

This should return: "Google Apps Script is working!"

## Security Notes

- **Data Privacy**: All patient data is stored in your personal Google Sheet
- **Access Control**: Only you have access to the Google Sheet and Apps Script
- **HIPAA Compliance**: Ensure your Google Workspace meets your compliance requirements
- **API Keys**: Keep your OpenAI API key secure and don't commit it to public repositories

## Advanced Configuration

### Custom Sheet Name:
In the Google Apps Script, you can change the sheet name by modifying:
```javascript
const SHEET_NAME = 'Patient Records';
```

### Additional Fields:
To add more patient data fields, update both:
1. The `HEADERS` array in Google Apps Script
2. The patient form in your HTML application

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Apps Script deployment
3. Test the script URL directly
4. Ensure all required permissions are granted