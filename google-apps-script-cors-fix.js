/**
 * CORS-ENABLED Google Apps Script for Metabolic Risk Calculator
 * Copy this EXACT code to your Google Apps Script editor
 */

// Handle GET requests with CORS headers
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'test') {
      return ContentService
        .createTextOutput('Google Apps Script is working!')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    if (action === 'getPatients') {
      const result = getPatients();
      return addCorsHeaders(result);
    }
    
    const result = ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action parameter'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    return addCorsHeaders(result);
      
  } catch (error) {
    const result = ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    return addCorsHeaders(result);
  }
}

// Handle POST requests with CORS headers
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    if (action === 'savePatient') {
      const result = savePatient(requestData.data);
      return addCorsHeaders(result);
    }
    
    const result = ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    return addCorsHeaders(result);
      
  } catch (error) {
    const result = ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    return addCorsHeaders(result);
  }
}

// Add CORS headers to response
function addCorsHeaders(response) {
  return response
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}

// Save patient data to the sheet
function savePatient(patientData) {
  try {
    const sheet = getOrCreateSheet();
    
    // Prepare data row
    const rowData = [
      patientData.id || new Date().getTime().toString(),
      patientData.fullName || '',
      patientData.age || '',
      patientData.gender || '',
      patientData.weight || '',
      patientData.height || '',
      patientData.glucose || '',
      patientData.triglycerides || '',
      patientData.hdl || '',
      patientData.hba1c || '',
      patientData.diabetes || '',
      patientData.bmi || '',
      patientData.tygIndex || '',
      patientData.tgHdlRatio || '',
      patientData.riskLevel || '',
      patientData.riskDescription || '',
      patientData.aiRecommendations || '',
      patientData.createdAt || new Date().toISOString(),
      patientData.createdBy || ''
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Apply color coding based on risk level
    const lastRow = sheet.getLastRow();
    const riskLevel = patientData.riskLevel;
    const rowRange = sheet.getRange(lastRow, 1, 1, 19);
    
    if (riskLevel === 'Low Risk') {
      rowRange.setBackground('#d4edda'); // Light green
    } else if (riskLevel === 'Moderate Risk') {
      rowRange.setBackground('#fff3cd'); // Light yellow
    } else if (riskLevel === 'High Risk') {
      rowRange.setBackground('#f8d7da'); // Light red
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Patient record saved successfully',
        rowNumber: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to save patient: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get all patient records
function getPatients() {
  try {
    const sheet = getOrCreateSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          data: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const patients = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const patient = {
        id: row[0] || '',
        fullName: row[1] || '',
        age: row[2] || '',
        gender: row[3] || '',
        weight: row[4] || '',
        height: row[5] || '',
        glucose: row[6] || '',
        triglycerides: row[7] || '',
        hdl: row[8] || '',
        hba1c: row[9] || '',
        diabetes: row[10] || '',
        bmi: row[11] || '',
        tygIndex: row[12] || '',
        tgHdlRatio: row[13] || '',
        riskLevel: row[14] || '',
        riskDescription: row[15] || '',
        aiRecommendations: row[16] || '',
        createdAt: row[17] || '',
        createdBy: row[18] || ''
      };
      
      patients.push(patient);
    }
    
    // Sort by creation date (most recent first)
    patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        data: patients
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to retrieve patients: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get or create the patient records sheet
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Patient Records');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Patient Records');
    
    // Add headers
    const headers = [
      'ID', 'Full Name', 'Age', 'Gender', 'Weight (kg)', 'Height (m)', 
      'Glucose (mg/dL)', 'Triglycerides (mg/dL)', 'HDL (mg/dL)', 'HbA1c (%)', 
      'Diabetes Status', 'BMI', 'TyG Index', 'TG/HDL Ratio', 'Risk Level', 
      'Risk Description', 'AI Recommendations', 'Created At', 'Created By'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}